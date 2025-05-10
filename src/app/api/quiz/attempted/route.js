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
            select: {
                id: true,
                type: true,
                marks: true,
                content: true,
            },
        });

        const data = {
            attempt: attemptResult.attempt,
            paper: attemptResult.paper,
            remainingTime: attemptResult.remainingTime,
            questions: questions,
        };

        return NextResponse.json({ message: 'Success', data: data });
    } catch (error) {
        console.error('Error fetching quiz attempt:', error);
        return NextResponse.json({ message: 'Failed to fetch attempt' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}