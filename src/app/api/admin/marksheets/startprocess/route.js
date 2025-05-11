import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';
import { Worker } from 'worker_threads';
import path from 'path';
import { cwd } from 'process';

const prisma = new PrismaClient();

const startBackgroundWorker = (paperId) => {
    new Worker(path.resolve('src/workers/paperWorker.js'), {
        workerData: {
            paperId,
        },
    });
};

export async function POST(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { paperId } = await request.json();

    try {
        const paper = await prisma.paper.findUnique({
            where: {
                id: paperId,
            }
        });

        if (!paper) {
            return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
        }

        // Check if the paper is already active
        if (paper.isActive) {
            return NextResponse.json({ message: 'Paper is already active' }, { status: 400 });
        }

        // Update the bgWorkerStatus to running
        await prisma.paper.update({
            where: {
                id: paperId,
            },
            data: {
                bgWorkerStatus: 'running',
            }
        });

        // Start the background worker
        startBackgroundWorker(paperId);

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error starting background worker:', error);
        return NextResponse.json({ message: 'An error occurred while processing the request' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}