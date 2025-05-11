import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id } = await params;

    try {
        const attempts = await prisma.quizAttempt.findMany({
            where: {
                paperId: parseInt(id),
            },
            select: {
                id: true,
                isFinished: true,
                isProcessed: true,
                finalMarks: true,
                student: {
                    select: {
                        id: true,
                        studentId: true,
                    },
                },
            },
        });

        const attemptsWithUnmarkedEssayCount = await Promise.all(
            attempts.map(async (attempt) => {
                const unmarkedAnswers = await prisma.submittedAnswer.findMany({
                    where: {
                        attemptId: attempt.id,
                        isMarked: false,
                    },
                    include: {
                        question: {
                            select: {
                                type: true,
                            },
                        },
                    }
                });

                const unmarkedEssayAnswers = unmarkedAnswers.filter(
                    (answer) => answer.question.type === 'essay'
                );

                return {
                    ...attempt,
                    unmarkedEssayCount: unmarkedEssayAnswers.length,
                };
            })
        );

        return NextResponse.json({ message: 'Success', attempts: attemptsWithUnmarkedEssayCount });
    } catch (error) {
        console.error('Error fetching paper:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}