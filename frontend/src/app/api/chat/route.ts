import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import cvData from '@/data/cv_data.json';

export const maxDuration = 60; // Prevent timeout during model download on Vercel
export const dynamic = 'force-dynamic';

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
- LinkedIn: linkedin.com/in/preekshit-saklani-0170304plr
- GitHub: github.com/preekshitsaklani
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

        // Skip embeddings entirely to bypass Vercel serverless limits and timeouts
        // Pass the raw CV data into context directly
        const context = JSON.stringify(cvData, null, 2);
        const avgScore = 1.0;
        const sources = ["Preekshit's Master CV Database"];

        // Step 5: Generate response using Groq
        try {
            if (!process.env.GROQ_API_KEY) {
                console.error('[Chat] Missing GROQ_API_KEY environment variable.');
                return NextResponse.json({
                    response: "System configuration incomplete. Missing API key.",
                    confidence: 0
                }, { status: 500 });
            }
            
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY
            });

            const completion = await groq.chat.completions.create({
                model: 'llama3-70b-8192',
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
