import { NextResponse } from 'next/server';
import { jwtVerify } from '../../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id } = await params;

    try {
        const questions = await prisma.question.findMany({
            where: {
                paperId: parseInt(id),
            },
            orderBy: {
                id: 'asc',
            },
        });

        return NextResponse.json({ message: 'Success', questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ message: 'Failed to fetch questions' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id } = await params;
    const data = await request.json();

    try {
        const newQuestion = await prisma.question.create({
            data: {
                ...data,
                paperId: parseInt(id),
            },
        });

        return NextResponse.json({ message: 'Success', question: newQuestion });
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json({ message: 'Failed to create question' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}