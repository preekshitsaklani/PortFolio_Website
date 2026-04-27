import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
        const cvPath = path.resolve(process.cwd(), '../cv_data.json');
        
        if (!fs.existsSync(cvPath)) {
            console.error('CV data file not found:', cvPath);
            return NextResponse.json({ projects: [] });
        }

        const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
        const projects: Project[] = cvData.projects || [];

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('[Projects API] Error:', error);
        return NextResponse.json({ projects: [] });
    }
}
