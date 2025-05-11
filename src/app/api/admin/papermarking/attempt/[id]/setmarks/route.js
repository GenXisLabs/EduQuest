import { NextResponse } from 'next/server';
import { jwtVerify } from '@/app/api/admin/auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id } = await params;

    const { answerId, marks } = await request.json();

    try {
        const answer = await prisma.submittedAnswer.findUnique({
            where: {
                id: answerId,
            },
        });

        if (!answer) {
            return NextResponse.json({ message: 'Answer not found' }, { status: 404 });
        }

        await prisma.submittedAnswer.update({
            where: {
                id: answerId,
            },
            data: {
                isMarked: true,
                earnedMarks: parseInt(marks),
            },
        });

        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        console.error('Error fetching paper:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}