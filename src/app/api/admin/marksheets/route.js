import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const papers = await prisma.paper.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                isActive: false,
            },
            include: {
                batch: {
                    select: {
                        name: true,
                    },
                },
                quizAttempts: {
                    select: {
                        isProcessed: true,
                    },
                },
            },
        });

        // Check if any quiz attempts are not processed
        const unprocessedPapers = papers.filter(paper => {
            return paper.quizAttempts.some(attempt => !attempt.isProcessed);
        });

        

        return NextResponse.json({ message: "Success", data: papers });
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}