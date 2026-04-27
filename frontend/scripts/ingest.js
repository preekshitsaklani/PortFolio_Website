
const path = require('path');
const dotenv = require('dotenv');
const neo4j = require('neo4j-driver');
const fs = require('fs');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Configuration
const NEO4J_URI = process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || '';

// --- Embeddings Helper (Local) ---
let pipeline;
async function generateEmbedding(text) {
    if (!text) return [];
    try {
        if (!pipeline) {
            // Dynamic import for Xenova which is ESM
            const { pipeline: transformerPipeline } = await import('@xenova/transformers');
            pipeline = await transformerPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }

        const output = await pipeline(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error('Embedding generation failed:', error.message);
        throw error;
    }
}

// --- Neo4j Helper ---
let driver;
function getDriver() {
    if (!driver) {
        driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
    }
    return driver;
}
async function closeDriver() {
    if (driver) await driver.close();
}

// --- Ingestion Logic ---
async function createVectorIndex() {
    const session = getDriver().session();
    try {
        console.log('Creating vector index...');
        await session.run(`
            CREATE VECTOR INDEX document_embeddings IF NOT EXISTS
            FOR (d:Document)
            ON (d.embedding)
            OPTIONS {indexConfig: {
                \`vector.dimensions\`: 384,
                \`vector.similarity_function\`: 'cosine'
            }}
        `);
        console.log('Vector index created (or already exists).');
    } catch (error) {
        console.error('Note: Error creating vector index (might typically exist):', error.message);
    } finally {
        await session.close();
    }
}

async function createDocument(type, title, content, metadata = {}) {
    const session = getDriver().session();
    try {
        const embedding = await generateEmbedding(content);

        let query = `
            CREATE (d:Document {
                type: $type,
                title: $title,
                content: $content,
                embedding: $embedding
        `;

        const params = { type, title, content, embedding };

        for (const [key, value] of Object.entries(metadata)) {
            query += `, ${key}: $${key}`;
            params[key] = value;
        }

        query += '})';

        await session.run(query, params);
        process.stdout.write('.');
    } catch (error) {
        console.error(`\nError creating document "${title}":`, error.message);
    } finally {
        await session.close();
    }
}

async function ingest() {
    const cvPath = path.resolve(__dirname, '../../cv_data.json');
    if (!fs.existsSync(cvPath)) {
        console.error('CV data file not found:', cvPath);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
    const session = getDriver().session();

    try {
        console.log('--- STARTING INGESTION (Local Xenova) ---');
        console.log(`Loading data from ${cvPath}...`);

        console.log('Clearing old data...');
        await session.run('MATCH (n) DETACH DELETE n');

        await createVectorIndex();

        console.log('Ingesting Person...');
        await session.run(`
            CREATE (p:Person {
                name: $name, email: $email, phone: $phone, role: $role, bio: $bio
            })
        `, data.person);

        if (data.person.bio) {
            await createDocument("bio", `About ${data.person.name}`, `${data.person.name} - ${data.person.role}. ${data.person.bio}`);
        }

        console.log('Ingesting Skills...');
        const skillsByCategory = {};
        for (const skill of data.skills) {
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (s:Skill {name: $name, category: $category})
                CREATE (p)-[:MASTERED]->(s)
            `, { ...skill, personName: data.person.name });

            if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
            skillsByCategory[skill.category].push(skill.name);
        }
        for (const [category, skills] of Object.entries(skillsByCategory)) {
            await createDocument("skills", `${category} Skills`, `${data.person.name} has expertise in ${category}: ${skills.join(', ')}.`);
        }

        console.log('Ingesting Projects...');
        const allProjects = [];
        for (const proj of data.projects) {
            allProjects.push(proj.name);
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (pr:Project {name: $name, tagline: $tagline, description: $description})
                CREATE (p)-[:CREATED]->(pr)
            `, { ...proj, personName: data.person.name });

            await createDocument("project", proj.name, `Project: ${proj.name} - ${proj.tagline}. ${proj.description} Tech stack: ${proj.tech_stack.join(', ')}.`);
        }

        // Experience
        console.log('Ingesting Experience...');
        for (const exp of data.experience) {
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (j:Job {role: $role, company: $company, duration: $duration, type: $type, description: $description})
                CREATE (c:Company {name: $company})
                CREATE (p)-[:WORKED_AT]->(j)
                CREATE (j)-[:AT_COMPANY]->(c)
            `, { ...exp, personName: data.person.name });

            await createDocument("experience", `${exp.role} at ${exp.company}`, `${data.person.name} worked as ${exp.role} at ${exp.company} (${exp.duration}). ${exp.description}`);
        }


        // Summary
        const allSkills = data.skills.map(s => s.name);
        await createDocument("summary", `Summary of ${data.person.name}`, `${data.person.name} is an AI/ML specialist with expertise in ${allSkills.slice(0, 10).join(', ')}. Notable projects include ${allProjects.join(', ')}.`);

        console.log('\n✅ Data ingestion complete! The Titan is online.');

    } catch (error) {
        console.error('\nIngestion failed:', error);
    } finally {
        await session.close();
        await closeDriver();
    }
}

ingest();
