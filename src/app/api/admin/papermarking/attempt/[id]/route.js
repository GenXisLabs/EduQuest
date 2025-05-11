import { NextResponse } from 'next/server';
import { jwtVerify } from '../../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id } = await params;

    try {
        const attempt = await prisma.quizAttempt.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                student: {
                    select: {
                        id: true,
                        studentId: true,
                    },
                },
                paper: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                submittedAnswers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        // Filter submitted answers to only include essay questions
        const essayAnswers = attempt.submittedAnswers.filter(
            (answer) => answer.question.type === 'essay'
        );

        delete attempt.submittedAnswers; // Remove submittedAnswers from attempt
        attempt.essayAnswers = essayAnswers; // Add essayAnswers to attempt

        return NextResponse.json({ message: 'Success', attempt });
    } catch (error) {
        console.error('Error fetching paper:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}