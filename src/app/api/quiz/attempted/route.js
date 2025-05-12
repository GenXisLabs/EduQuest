import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import { jwtVerify } from '../attempt/jwtVerify';
import { verifyAttempt } from '../attempt/attemptVerify';

const prisma = new PrismaClient();

export async function GET(request) {
    const jwtResult = await jwtVerify(request);
    if (jwtResult instanceof NextResponse) return jwtResult;

    const attemptResult = await verifyAttempt(jwtResult.attemptId, jwtResult.paperId);
    if (attemptResult instanceof NextResponse) return attemptResult;

    try {
        const questions = await prisma.question.findMany({
            where: {
                paperId: attemptResult.paper.id,
            },
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                type: true,
                marks: true,
                content: true,
                fileUpload: true,
            },
        });

        const submittedAnswers = await prisma.submittedAnswer.findMany({
            where: {
                attemptId: attemptResult.attempt.id,
            },
            select: {
                id: true,
                questionId: true,
                choiceNumber: true,
                essayAnswer: true,
                cldPublicId: true,
            },
        });

        // Convert question.content to JSON & remove isAnswer from choices
        const modifiedQuestions = questions.map((question) => {
            try {
                question.content = JSON.parse(question.content);
                if (question.content.choices) {
                    question.content.choices = question.content.choices.map((choice) => {
                        delete choice.isAnswer;
                        return choice;
                    });
                }
                return question;
            } catch (error) {
                console.error('Error parsing question content:', error);
                throw new Error('Failed to parse question content');
            }
        });

        const data = {
            attempt: attemptResult.attempt,
            paper: attemptResult.paper,
            remainingTime: attemptResult.remainingTime,
            questions: modifiedQuestions,
            submittedAnswers: submittedAnswers,
        };

        return NextResponse.json({ message: 'Success', data: data });
    } catch (error) {
        console.error('Error fetching quiz attempt:', error);
        return NextResponse.json({ message: 'Failed to fetch attempt' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}