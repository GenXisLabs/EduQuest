import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import { jwtVerify } from '../../attempt/jwtVerify';
import { verifyAttempt } from '../../attempt/attemptVerify';

const prisma = new PrismaClient();

export async function POST(request) {
    const jwtResult = await jwtVerify(request);
    if (jwtResult instanceof NextResponse) return jwtResult;

    const attemptResult = await verifyAttempt(jwtResult.attemptId, jwtResult.paperId);
    if (attemptResult instanceof NextResponse) return attemptResult;

    try {
        const body = await request.json();
        
        const { answers, attemptId } = body;

        if (!answers || !Array.isArray(answers) || answers.length === 0 || !attemptId) {
            return NextResponse.json({ message: 'Invalid format' }, { status: 400 });
        }

        for (const answer of answers) {
            const { questionId } = answer;

            const storedAnswer = await prisma.submittedAnswer.findFirst({
                where: {
                    attemptId: attemptId,
                    questionId: questionId,
                },
            });

            if (storedAnswer) {
                await prisma.submittedAnswer.update({
                    where: {
                        id: storedAnswer.id,
                    },
                    data: {
                        choiceNumber: answer.choiceNumber || -1,
                        essayAnswer: answer.essayAnswer || '',
                    },
                });
                continue;
            }

            await prisma.submittedAnswer.create({
                data: {
                    attemptId: attemptId,
                    questionId: questionId,
                    choiceNumber: answer.choiceNumber || -1,
                    essayAnswer: answer.essayAnswer || '',
                },
            });
        }

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error fetching quiz attempt:', error);
        return NextResponse.json({ message: 'Failed to fetch attempt' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}