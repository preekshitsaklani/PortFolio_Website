import { NextResponse } from 'next/server';
import cvData from '@/data/cv_data.json';

export const dynamic = 'force-dynamic';

export interface Project {
    name: string;
    tagline: string;
    category: string;
    year: string;
    gradient: string;
    description: string;
    tech_stack: string[];
    links: {
        website?: string;
        github?: string;
        linkedin?: string;
        youtube?: string;
    };
}

export async function GET(): Promise<NextResponse<{ projects: Project[] }>> {
    try {
        const projects: Project[] = cvData.projects || [];
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('[Projects API] Error:', error);
        return NextResponse.json({ projects: [] });
    }
}
