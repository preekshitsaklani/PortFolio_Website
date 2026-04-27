
const path = require('path');
const dotenv = require('dotenv');
const { GraphDatabase } = require('neo4j-driver');
const Groq = require('groq-sdk');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Configuration
const NEO4J_URI = process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || '';
const HF_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';
const HF_API_URL = `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`;

async function generateEmbedding(text) {
    if (!text) return [];
    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: text, options: { wait_for_model: true } })
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function test() {
    console.log('--- DIAGNOSTIC TEST (JS) ---');
    console.log('NEO4J_URI:', NEO4J_URI);
    console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'MISSING');

    // 1. Test Embeddings
    console.log('\nTesting Embeddings...');
    try {
        const emb = await generateEmbedding('Hello world');
        console.log(`Embedding generated. Length: ${emb.length || (Array.isArray(emb) ? emb.length : typeof emb)}`);
    } catch (e) {
        console.error('Embedding failed:', e.message);
    }

    // 2. Test Neo4j
    console.log('\nTesting Neo4j...');
    const driver = GraphDatabase.driver(NEO4J_URI, GraphDatabase.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
    try {
        const info = await driver.getServerInfo();
        console.log('Connected to Neo4j:', info.agent);
        await driver.close();
    } catch (e) {
        console.error('Neo4j failed:', e.message);
    }

    // 3. Test Groq
    console.log('\nTesting Groq...');
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const chat = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Hi' }],
            model: 'llama-3.3-70b-versatile',
        });
        console.log('Groq Response:', chat.choices[0]?.message?.content);
    } catch (e) {
        console.error('Groq failed:', e.message);
    }
}

test();
