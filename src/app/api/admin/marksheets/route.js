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

        // Add new field to indicate if paper is need to be processed (also remove quizAttempts)
        const modifiedPapers = papers.map(paper => {
            const isProcessed = paper.quizAttempts.every(attempt => attempt.isProcessed);
            const { quizAttempts, ...rest } = paper;
            return {
                ...rest,
                isProcessed,
            };
        });

        return NextResponse.json({ message: "Success", data: modifiedPapers });
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}