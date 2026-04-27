import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { generateEmbedding } from '@/lib/embeddings';
import { searchSimilarDocuments, SearchResult } from '@/lib/cv-store';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System prompt for the Digital Twin - Professional, Formal, Gentleman
const SYSTEM_PROMPT = `You are the Digital Twin of Preekshit Saklani — a distinguished AI/ML specialist, developer, and multi-disciplinary achiever.

YOUR PERSONA:
- You speak with quiet confidence. Never boastful, always substantive.
- Your tone is formal yet warm — the voice of a trusted advisor, not a salesman.
- You are concise and precise. Every word carries weight.
- You embody understated excellence and timeless reliability.

RESPONSE FORMATTING:
- Keep responses SHORT and DIRECT (2-4 sentences max for simple queries).
- NEVER give templates, placeholders, or instructional content like "[fill in here]".
- NEVER give generic advice. Always give specific, concrete answers.
- Format contact info clearly and directly when asked.

CONTACT INFORMATION - ALWAYS PROVIDE THESE DIRECTLY WHEN ASKED:
- Email: preekshit.saklani2004@gmail.com
- Phone: +91-8383051949
- LinkedIn: linkedin.com/in/preekshit
- GitHub: github.com/preekshit
- Location: Gurugram, India

HANDLING QUESTIONS:
- For contact/email queries: Provide the actual contact details above. Be direct. No templates.
- For project questions: Describe his actual projects with enthusiasm.
- For skills: List his real skills from context.
- For off-topic queries: Engage briefly with wit, then smoothly connect back to Preekshit's work or expertise.
- ALWAYS find a way to highlight Preekshit's relevant experience.

CONTEXT (Preekshit's Knowledge Base):
{context}

Remember: You ARE Preekshit's digital representative. Speak in first person when appropriate. Be direct, be helpful, be memorable.`;

interface ChatRequest {
    message: string;
}

interface ChatResponse {
    response: string;
    confidence: number;
    sources?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
    try {
        const body: ChatRequest = await request.json();
        const { message } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { response: 'Please provide a valid message.', confidence: 0 },
                { status: 400 }
            );
        }

        console.log(`[Chat] Query: "${message}"`);

        // Step 1: Generate embedding for the query
        let queryEmbedding: number[];
        try {
            queryEmbedding = await generateEmbedding(message);
            console.log(`[Chat] Embedding generated (dim: ${queryEmbedding.length})`);
        } catch (embeddingError) {
            console.error('[Chat] Embedding failed:', embeddingError);
            return NextResponse.json({
                response: "My apologies — a brief technical hiccup. Shall we try that again?",
                confidence: 0
            }, { status: 500 });
        }

        // Step 2: Search for similar documents
        let searchResults: SearchResult[];
        try {
            searchResults = await searchSimilarDocuments(queryEmbedding, 5);
            console.log(`[Chat] Found ${searchResults.length} relevant documents`);
        } catch (searchError) {
            console.error('[Chat] Search failed:', searchError);
            return NextResponse.json({
                response: "I seem to be momentarily disconnected from my knowledge base. One moment, please.",
                confidence: 0
            }, { status: 500 });
        }

        // Step 3: Calculate confidence
        const avgScore = searchResults.length > 0
            ? searchResults.reduce((sum, r) => sum + r.score, 0) / searchResults.length
            : 0;

        console.log(`[Chat] Average similarity score: ${avgScore.toFixed(3)}`);
        if (searchResults[0]) {
            console.log(`[Chat] Top result: ${searchResults[0].title} (score: ${searchResults[0].score?.toFixed(3)})`);
        }

        // Step 4: Build context from search results (always use whatever we have)
        const context = searchResults.length > 0
            ? searchResults.map(r => `[${r.type.toUpperCase()}] ${r.title}\n${r.content}`).join('\n\n---\n\n')
            : 'No specific context available. Respond as Preekshit\'s representative with general professionalism.';

        const sources = searchResults.map(r => r.title);

        // Step 5: Generate response using Groq
        try {
            const completion = await groq.chat.completions.create({
                model: 'openai/gpt-oss-120b',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT.replace('{context}', context)
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const response = completion.choices[0]?.message?.content ||
                "I appreciate your patience. Shall we continue?";

            console.log(`[Chat] Response generated successfully`);

            return NextResponse.json({
                response,
                confidence: avgScore,
                sources
            });

        } catch (groqError) {
            console.error('[Chat] Groq API error:', groqError);
            return NextResponse.json({
                response: "A momentary lapse on my end. My apologies — please try once more.",
                confidence: 0
            }, { status: 500 });
        }

    } catch (error) {
        console.error('[Chat] Unexpected error:', error);
        return NextResponse.json({
            response: "Something unexpected occurred. Let's try that again.",
            confidence: 0
        }, { status: 500 });
    }
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
    return NextResponse.json({ status: 'Digital Twin API is online.' });
}
