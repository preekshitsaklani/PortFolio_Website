
import { pipeline, env } from '@xenova/transformers';
import path from 'path';
import os from 'os';

// Configure transformers to use the Vercel ephemeral /tmp directory
env.cacheDir = path.join(os.tmpdir(), '.cache');
env.allowLocalModels = false;

// Singleton pipeline instance to avoid reloading model
let embedder: any = null;

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        if (!embedder) {
            console.log('Loading local embedding model...');
            embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('Model loaded.');
        }

        const output = await embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (error) {
        console.error('Embedding generation failed:', error);
        throw error;
    }
}
