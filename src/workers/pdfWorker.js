const { parentPort, workerData } = require('worker_threads');
const { PrismaClient } = require('../generated/prisma');

const PDFDocument = require('pdfkit');
// const getStream = require('get-stream');

const prisma = new PrismaClient();

(async () => {
    const { paperId } = workerData;

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => { 
        const pdfBuffer = Buffer.concat(buffers);
        parentPort.postMessage(pdfBuffer);
    });
  
    doc.fontSize(20).text('Student Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`ID: `);
    doc.text(`Name: `);
    doc.text(`Marks:`);
    doc.end();
  
    // const pdfBuffer = await getStream.buffer(doc);
    // parentPort.postMessage(pdfBuffer);

    prisma.$disconnect();
})();