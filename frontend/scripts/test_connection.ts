
import dotenv from 'dotenv';
import path from 'path';
import { getDriver, closeDriver } from '../src/lib/neo4j';
import { generateEmbedding } from '../src/lib/embeddings';
import Groq from 'groq-sdk';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function test() {
    console.log('--- DIAGNOSTIC TEST ---');

    // 1. Test Env Vars
    console.log('Checking Environment Variables...');
    console.log('NEO4J_URI:', process.env.NEO4J_URI ? 'OK' : 'MISSING');
    console.log('NEO4J_USERNAME:', process.env.NEO4J_USERNAME ? 'OK' : 'MISSING');
    console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'OK' : 'MISSING');

    // 2. Test Embeddings
    console.log('\nTesting HuggingFace Embedding...');
    try {
        const emb = await generateEmbedding('Hello world');
        console.log(`Embedding generated successfully. Length: ${emb.length}`);
    } catch (e) {
        console.error('Embedding failed:', e);
    }

    // 3. Test Neo4j
    console.log('\nTesting Neo4j Connection...');
    const driver = getDriver();
    try {
        const info = await driver.getServerInfo();
        console.log('Connected to Neo4j:', info.agent);

        const session = driver.session();
        const count = await session.run('MATCH (n) RETURN count(n) AS c');
        console.log('Node count in DB:', count.records[0].get('c').toNumber());
        await session.close();
    } catch (e) {
        console.error('Neo4j connection failed:', e);
    } finally {
        await closeDriver();
    }

    // 4. Test Groq
    console.log('\nTesting Groq API...');
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const chat = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hi' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Groq Response:', chat.choices[0]?.message?.content);
    } catch (e) {
        console.error('Groq API failed:', e);
    }
}

test();
