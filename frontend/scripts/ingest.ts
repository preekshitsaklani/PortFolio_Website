
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { getDriver, closeDriver } from '../src/lib/neo4j';
import { generateEmbedding } from '../src/lib/embeddings';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Types matching cv_data.json
interface CVData {
    person: {
        name: string;
        email: string;
        phone: string;
        role: string;
        bio: string;
    };
    skills: Array<{ name: string; category: string }>;
    education: Array<{ institution: string; degree: string; year: string; location: string }>;
    experience: Array<{
        company: string;
        role: string;
        duration: string;
        type: string;
        description: string;
        skills_used: string[];
    }>;
    projects: Array<{
        name: string;
        tagline: string;
        description: string;
        tech_stack: string[];
    }>;
    achievements: Array<{
        name: string;
        rank: string;
        context: string;
        track?: string;
    }>;
}

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
        console.error('Error creating vector index:', error);
    } finally {
        await session.close();
    }
}

async function createDocument(type: string, title: string, content: string, metadata: Record<string, any> = {}) {
    const session = getDriver().session();
    try {
        const embedding = await generateEmbedding(content);

        // Build dynamic cypher query based on metadata
        let query = `
            CREATE (d:Document {
                type: $type,
                title: $title,
                content: $content,
                embedding: $embedding
        `;

        const params: Record<string, any> = {
            type,
            title,
            content,
            embedding
        };

        // Add metadata to node properties
        for (const [key, value] of Object.entries(metadata)) {
            query += `, ${key}: $${key}`;
            params[key] = value;
        }

        query += '})';

        await session.run(query, params);
        process.stdout.write('.'); // Progress indicator
    } catch (error) {
        console.error(`\nError creating document "${title}":`, error);
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

    const data: CVData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
    const session = getDriver().session();

    try {
        console.log('Clearing old data...');
        await session.run('MATCH (n) DETACH DELETE n');

        await createVectorIndex();

        console.log('Ingesting data & generating embeddings (using HuggingFace API)...');

        // 1. Person
        await session.run(`
            CREATE (p:Person {
                name: $name, email: $email, phone: $phone, role: $role, bio: $bio
            })
        `, data.person);

        if (data.person.bio) {
            await createDocument(
                "bio",
                `About ${data.person.name}`,
                `${data.person.name} - ${data.person.role}. ${data.person.bio}`
            );
        }

        // 2. Skills
        const skillsByCategory: Record<string, string[]> = {};
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
            await createDocument(
                "skills",
                `${category} Skills`,
                `${data.person.name} has expertise in ${category}: ${skills.join(', ')}.`
            );
        }

        // 3. Education
        for (const edu of data.education) {
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (e:Education {institution: $institution, degree: $degree, year: $year, location: $location})
                CREATE (p)-[:STUDIED_AT]->(e)
            `, { ...edu, personName: data.person.name });

            await createDocument(
                "education",
                `Education at ${edu.institution}`,
                `${data.person.name} is pursuing ${edu.degree} at ${edu.institution} ({${edu.year}}), located in ${edu.location}.`
            );
        }

        // 4. Experience
        for (const exp of data.experience) {
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (j:Job {role: $role, company: $company, duration: $duration, type: $type, description: $description})
                CREATE (c:Company {name: $company})
                CREATE (p)-[:WORKED_AT]->(j)
                CREATE (j)-[:AT_COMPANY]->(c)
            `, { ...exp, personName: data.person.name });

            await createDocument(
                "experience",
                `${exp.role} at ${exp.company}`,
                `${data.person.name} worked as ${exp.role} at ${exp.company} (${exp.duration}, ${exp.type}). ${exp.description} Skills used: ${exp.skills_used.join(', ')}.`
            );
        }

        // 5. Projects
        const allProjects = [];
        for (const proj of data.projects) {
            allProjects.push(proj.name);
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (pr:Project {name: $name, tagline: $tagline, description: $description})
                CREATE (p)-[:CREATED]->(pr)
            `, { ...proj, personName: data.person.name });

            await createDocument(
                "project",
                proj.name,
                `Project: ${proj.name} - ${proj.tagline}. ${proj.description} Tech stack: ${proj.tech_stack.join(', ')}.`
            );
        }

        // 6. Achievements
        for (const ach of data.achievements) {
            await session.run(`
                MATCH (p:Person {name: $personName})
                CREATE (a:Award {name: $name, rank: $rank, context: $context, track: $track})
                CREATE (p)-[:WON]->(a)
            `, { ...ach, personName: data.person.name });

            const rankText = ach.rank ? ` (Rank: ${ach.rank})` : "";
            await createDocument(
                "achievement",
                ach.name,
                `Achievement: ${ach.name}${rankText}. ${ach.context}`
            );
        }

        // Summary Doc
        const allSkills = data.skills.map(s => s.name);
        await createDocument(
            "summary",
            `Summary of ${data.person.name}`,
            `${data.person.name} is an AI/ML specialist with expertise in ${allSkills.slice(0, 10).join(', ')}... Notable projects include ${allProjects.join(', ')}.`
        );

        console.log('\n✅ Data ingestion complete! The Titan is online.');

    } catch (error) {
        console.error('\nIngestion failed:', error);
    } finally {
        await closeDriver();
    }
}

ingest();
