import * as neo4j from 'neo4j-driver';

// Neo4j connection configuration
const NEO4J_URI = process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || '';

let driver: neo4j.Driver | null = null;

export function getDriver(): neo4j.Driver {
    if (!driver) {
        driver = neo4j.driver(
            NEO4J_URI,
            neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
        );
    }
    return driver;
}

export async function closeDriver(): Promise<void> {
    if (driver) {
        await driver.close();
        driver = null;
    }
}

export interface SearchResult {
    title: string;
    content: string;
    type: string;
    score: number;
}

/**
 * Search for similar documents using vector similarity.
 * Falls back to text search if vector search fails.
 */
export async function searchSimilarDocuments(
    queryEmbedding: number[],
    limit: number = 5
): Promise<SearchResult[]> {
    const session = getDriver().session();

    try {
        // Try vector search first (Neo4j 5.11+)
        const result = await session.run(
            `
            CALL db.index.vector.queryNodes('document_embeddings', $limit, $embedding)
            YIELD node, score
            RETURN node.title AS title, node.content AS content, node.type AS type, score
            ORDER BY score DESC
            `,
            { embedding: queryEmbedding, limit }
        );

        return result.records.map(record => ({
            title: record.get('title'),
            content: record.get('content'),
            type: record.get('type'),
            score: record.get('score')
        }));
    } catch (vectorError) {
        console.warn('Vector search failed, falling back to all documents:', vectorError);

        // Fallback: return all documents (no vector search)
        const fallbackResult = await session.run(
            `
            MATCH (d:Document)
            RETURN d.title AS title, d.content AS content, d.type AS type, 1.0 AS score
            LIMIT $limit
            `,
            { limit }
        );

        return fallbackResult.records.map(record => ({
            title: record.get('title'),
            content: record.get('content'),
            type: record.get('type'),
            score: record.get('score')
        }));
    } finally {
        await session.close();
    }
}
