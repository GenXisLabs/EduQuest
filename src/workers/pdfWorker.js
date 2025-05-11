const { parentPort, workerData } = require('worker_threads');
const { PrismaClient } = require('../generated/prisma');
const PDFDocument = require('pdfkit');

const prisma = new PrismaClient();

(async () => {
    const { paperId } = workerData;

    // Fetch the paper details
    const paper = await prisma.paper.findUnique({
        where: {
            id: parseInt(paperId),
        },
        select: {
            name: true,
        },
    });

    // Fetch the quiz attempts for the given paper ID
    const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
            paperId: parseInt(paperId),
        },
        select: {
            finalPercentage: true,
            student: {
                select: {
                    studentId: true,
                    name: true,
                },
            },
        },
    });

    // Sort quiz attempts by final percentage in descending order
    quizAttempts.sort((a, b) => b.finalPercentage - a.finalPercentage);

    // Generate the PDF
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => { 
        const pdfBuffer = Buffer.concat(buffers);
        parentPort.postMessage(pdfBuffer);
    });
  
    // The header

    doc.fontSize(20).text(`${paper.name} Marksheet`, { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('MEPA - Matara Engineering Professionals\' Association', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10);

    const rows = [];
    quizAttempts.forEach(attempt => {
        const { studentId, name } = attempt.student;
        const { finalPercentage } = attempt;
        rows.push([studentId, name, finalPercentage]);
    });

    doc.table({
        data: [
            ['Student ID', 'Name', 'Marks (%)'],
            ...rows
        ]
    });

    doc.end();
  
    // const pdfBuffer = await getStream.buffer(doc);
    // parentPort.postMessage(pdfBuffer);

    prisma.$disconnect();
})();