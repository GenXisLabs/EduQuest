import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function verifyDuration(attempt, paper) {
    try {
        // Fetch the quiz attempt for the user
        const attempt = await prisma.quizAttempt.findFirst({
            where: {
                quizId: quizId,
                userId: userId,
            },
        });

        if (!attempt) {
            throw new Error('Quiz attempt not found');
        }

        // Check if the attempt is within the allowed duration
        const now = new Date();
        const startTime = new Date(attempt.startTime);
        const durationInMs = attempt.duration * 60 * 1000; // Convert minutes to milliseconds

        if (now - startTime > durationInMs) {
            return { valid: false, message: 'Quiz duration exceeded' };
        }

        return { valid: true, message: 'Quiz attempt is within the allowed duration' };
    } catch (error) {
        console.error(error);
        return { valid: false, message: 'An error occurred while verifying quiz duration' };
    } finally {
        await prisma.$disconnect();
    }
}

export { verifyQuizDuration };