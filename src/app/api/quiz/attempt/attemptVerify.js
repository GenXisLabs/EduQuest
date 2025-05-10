import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function calcElapsedTime(attempt) {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - attempt.createdAt) / 1000);
    return elapsedSeconds;
}

function clacRemainingTime(attempt, paper) {
    const elapsedSeconds = calcElapsedTime(attempt);
    return paper.duration - elapsedSeconds;
}

function isDurationExceeded(attempt, paper) {
    const elapsedSeconds = calcElapsedTime(attempt);
    return elapsedSeconds > paper.duration
}

async function verifyAttempt(attemptId, paperId) {
    try {
        // Fetch the quiz attempt for the user
        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                id: attemptId,
            },
        });

        if (!attempt) {
            return NextResponse.json({ message: 'Attempt not found' }, { status: 401 });
        }

        if (attempt.isFinished) {
            return NextResponse.json({ message: 'Attempt already finished' }, { status: 403 });
        }

        // Fetch the quiz paper details
        const paper = await prisma.paper.findUnique({
            where: {
                id: paperId,
            },
        });

        if (!paper) {
            return NextResponse.json({ message: 'Paper not found' }, { status: 401 });
        }

        if (!paper.isActive) {
            return NextResponse.json({ message: 'Paper is not active' }, { status: 403 });
        }

        if (isDurationExceeded(attempt, paper)) {
            return NextResponse.json({ message: 'Quiz duration exceeded' }, { status: 403 });
        }

        delete paper.password; // Remove password from the paper object

        return {
            attempt,
            paper,
            elapsedTime: calcElapsedTime(attempt),
            remainingTime: clacRemainingTime(attempt, paper),
        };
    } catch (error) {
        console.error('Error verifying attempt:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export { verifyAttempt, calcElapsedTime, clacRemainingTime, isDurationExceeded };