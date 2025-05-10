import { NextResponse } from 'next/server';
import { jwtVerify } from '@/app/api/admin/auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id, qid } = await params;
    const body = await request.json();

    try {
        const updatedQuestion = await prisma.question.update({
            where: {
                id: parseInt(qid),
            },
            data: body,
        });

        return NextResponse.json({ message: 'Question updated successfully', question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        return NextResponse.json({ message: 'Error updating question', error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request, { params }) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    const { id, qid } = await params;

    try {
        await prisma.question.delete({
            where: {
                id: parseInt(qid),
            },
        });

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json({ message: 'Error deleting question', error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}