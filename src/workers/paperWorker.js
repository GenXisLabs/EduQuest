const { parentPort, workerData } = require('worker_threads');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

const updateBgWorkerStatus = async (paperId, status) => {
    try {
        await prisma.paper.update({
            where: {
                id: paperId,
            },
            data: {
                bgWorkerStatus: status,
            }
        });
        console.log(`Updated bgWorkerStatus to ${status} for paper ID: ${paperId}`);
    } catch (error) {
        console.error('Error updating bgWorkerStatus:', error);
    }
};

const getTotalMarksForPaper = async (paperId) => {
    const questions = await prisma.question.findMany({
        where: {
            paperId: paperId,
        },
        select: {
            marks: true,
        },
    });

    const totalMarks = questions.reduce((acc, question) => acc + question.marks, 0);
    return totalMarks;
}

(async () => {
    const { paperId } = workerData;

    try {
        const totalMarksForPaper = await getTotalMarksForPaper(paperId);

        const quizAttempts = await prisma.quizAttempt.findMany({
            where: {
                paperId: paperId,
            },
            include: {
                submittedAnswers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        console.log(`Started processing paper ID: ${paperId}`);
        console.log(`Total Marks for Paper ID ${paperId}: ${totalMarksForPaper}`);
        

        // Calculate marks for every quiz attempt of the paper
        for (const attempt of quizAttempts) {
            console.log(`Calculating marks for attempt ID: ${attempt.id}`);
            
            const { submittedAnswers } = attempt;

            let totalMarks = 0;
            for (const answer of submittedAnswers) {
                const { question } = answer;
                
                if (question.type === 'mcq') {
                    const content = JSON.parse(question.content);
                    for (const choice of content.choices) {
                        if (choice.number === answer.choiceNumber) {
                            totalMarks += question.marks;
                            break;
                        }
                    }
                } else if (question.type === 'essay') {
                    totalMarks += answer.earnedMarks;
                }
            }

            const percentage = Math.round((totalMarks / totalMarksForPaper) * 100);

            console.log(`Total Marks: ${totalMarks}, Percentage: ${percentage}%, Updating...`);

            await prisma.quizAttempt.update({
                where: {
                    id: attempt.id,
                },
                data: {
                    finalMarks: totalMarks,
                    finalPercentage: percentage,
                    isProcessed: true,
                },
            });

            console.log('Done updating attempt:', attempt.id);
        }

        updateBgWorkerStatus(paperId, 'success');

        console.log(`Finished processing paper ID: ${paperId}`);
    } catch (error) {
        console.error('Error in background worker:', error);
        updateBgWorkerStatus(paperId, 'failed');
    } finally {
        await prisma.$disconnect();
    }

    prisma.$disconnect();
})();