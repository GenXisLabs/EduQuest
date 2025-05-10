import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const batches = await prisma.batch.findMany();
        return NextResponse.json({ message: "Success", data: batches });
    } catch (error) {
        console.error('Error fetching batches:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    }
}

export async function POST(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const body = await request.json();
        const newBatch = { ...body };
        const createdBatch = await prisma.batch.create(
            {
                data: newBatch,
            }
        );
        return NextResponse.json({ message: "Success", data: createdBatch });
    } catch (error) {
        console.error('Error creating batch:', error);
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }
}