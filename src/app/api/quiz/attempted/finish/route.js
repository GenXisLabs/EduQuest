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
        await prisma.quizAttempt.update({
            where: { id: attemptResult.attempt.id },
            data: { isFinished: true },
        });

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error updating quiz attempt:', error);
        return NextResponse.json({ error: 'Failed to update attempt' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}