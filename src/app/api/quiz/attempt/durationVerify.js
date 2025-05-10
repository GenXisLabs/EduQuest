import { PrismaClient } from '@/generated/prisma';

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

async function verifyDuration(attemptId, paperId) {
    try {
        // Fetch the quiz attempt for the user
        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                id: attemptId,
            },
        });

        // Fetch the quiz paper details
        const paper = await prisma.paper.findUnique({
            where: {
                id: paperId,
            },
        });

        if (!attempt || !paper) {
            return false;
        }

        return !isDurationExceeded(attempt, paper);
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

export { verifyQuizDuration, calcElapsedTime, clacRemainingTime, isDurationExceeded };