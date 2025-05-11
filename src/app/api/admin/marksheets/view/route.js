import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';
import path from 'path';
import { Worker } from 'worker_threads';

const prisma = new PrismaClient();

const generatePDF = async (paperId) => {
    const pdfBuffer = await new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve('src/workers/pdfWorker.js'), {
            workerData: { paperId }
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });

    return pdfBuffer;
};

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const { searchParams } = new URL(request.url);

        const paperId = searchParams.get('paperId');

        if (!paperId) {
            return NextResponse.json({ message: 'Paper ID is required' }, { status: 400 });
        }

        const pdfBuffer = await generatePDF(paperId);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="marksheet-${paperId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}