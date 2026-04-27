/**
 * In-memory CV data store with semantic search.
 * Fallback for when Neo4j is not available.
 */

import { generateEmbedding } from './embeddings';
import fs from 'fs';
import path from 'path';

interface Document {
    title: string;
    content: string;
    type: string;
    embedding?: number[];
}

// Cache for documents with embeddings
let documentsCache: Document[] | null = null;

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Load and prepare CV documents with embeddings
 */
async function loadDocuments(): Promise<Document[]> {
    if (documentsCache) return documentsCache;

    // Try to load cv_data.json
    const cvPath = path.resolve(process.cwd(), '../cv_data.json');

    if (!fs.existsSync(cvPath)) {
        console.error('CV data file not found:', cvPath);
        return [];
    }

    const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
    const documents: Document[] = [];

    // Create documents from CV data
    const person = cvData.person;

    // Contact Information (high priority)
    documents.push({
        title: `Contact Information for ${person.name}`,
        content: `To reach ${person.name}, you can contact him directly via: Email: ${person.email}, Phone: ${person.phone}, LinkedIn: ${person.linkedin || 'linkedin.com/in/preekshit'}, GitHub: ${person.github || 'github.com/preekshit'}. He is based in ${person.location || 'Gurugram, India'}.`,
        type: 'contact'
    });

    // Bio
    if (person.bio) {
        documents.push({
            title: `About ${person.name}`,
            content: `${person.name} - ${person.role}. ${person.bio}`,
            type: 'bio'
        });
    }

    // Skills by category
    const skillsByCategory: Record<string, string[]> = {};
    for (const skill of cvData.skills || []) {
        if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
        skillsByCategory[skill.category].push(skill.name);
    }
    for (const [category, skills] of Object.entries(skillsByCategory)) {
        documents.push({
            title: `${category} Skills`,
            content: `${person.name} has expertise in ${category}: ${skills.join(', ')}.`,
            type: 'skills'
        });
    }

    // Experience
    for (const exp of cvData.experience || []) {
        documents.push({
            title: `${exp.role} at ${exp.company}`,
            content: `${person.name} worked as ${exp.role} at ${exp.company} (${exp.duration}, ${exp.type}). ${exp.description} Skills used: ${exp.skills_used?.join(', ') || 'N/A'}.`,
            type: 'experience'
        });
    }

    // Projects
    for (const proj of cvData.projects || []) {
        documents.push({
            title: proj.name,
            content: `Project: ${proj.name} - ${proj.tagline}. ${proj.description} Tech stack: ${proj.tech_stack?.join(', ') || 'N/A'}.`,
            type: 'project'
        });
    }

    // Achievements
    for (const ach of cvData.achievements || []) {
        documents.push({
            title: ach.name,
            content: `Achievement: ${ach.name}${ach.rank ? ` (Rank: ${ach.rank})` : ''}. ${ach.context}`,
            type: 'achievement'
        });
    }

    // Education
    for (const edu of cvData.education || []) {
        documents.push({
            title: `Education at ${edu.institution}`,
            content: `${person.name} is pursuing ${edu.degree} at ${edu.institution} (${edu.year}), located in ${edu.location}.`,
            type: 'education'
        });
    }

    // Summary
    const allSkills = (cvData.skills || []).map((s: any) => s.name);
    const allProjects = (cvData.projects || []).map((p: any) => p.name);
    documents.push({
        title: `Summary of ${person.name}`,
        content: `${person.name} is an AI/ML specialist and ${person.role}. Skills include: ${allSkills.slice(0, 15).join(', ')}. Notable projects: ${allProjects.join(', ')}.`,
        type: 'summary'
    });

    console.log(`[CV Store] Loaded ${documents.length} documents from CV`);

    // Generate embeddings for all documents
    console.log('[CV Store] Generating embeddings...');
    for (const doc of documents) {
        try {
            doc.embedding = await generateEmbedding(doc.content);
        } catch (e) {
            console.error(`[CV Store] Failed to embed: ${doc.title}`);
        }
    }
    console.log('[CV Store] Embeddings generated');

    documentsCache = documents;
    return documents;
}

export interface SearchResult {
    title: string;
    content: string;
    type: string;
    score: number;
}

/**
 * Search for similar documents using cosine similarity
 */
export async function searchSimilarDocuments(
    queryEmbedding: number[],
    limit: number = 5
): Promise<SearchResult[]> {
    const documents = await loadDocuments();

    // Calculate similarity scores
    const scored = documents
        .filter(doc => doc.embedding)
        .map(doc => ({
            title: doc.title,
            content: doc.content,
            type: doc.type,
            score: cosineSimilarity(queryEmbedding, doc.embedding!)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scored;
}
