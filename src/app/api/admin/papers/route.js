import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const papers = await prisma.paper.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return NextResponse.json({ message: "Success", data: papers });
    } catch (error) {
        console.error('Error fetching papers:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    }
}

export async function POST(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const body = await request.json();
        const newPaper = { ...body };
        const createdPaper = await prisma.paper.create(
            {
                data: newPaper,
            }
        );
        return NextResponse.json({ message: "Success", data: createdPaper });
    } catch (error) {
        console.error('Error creating paper:', error);
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }
}