import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const students = await prisma.student.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return NextResponse.json({ message: "Success", data: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ message: 'Failed to fetch' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const body = await request.json();
        const newStudent = { ...body };
        const createdStudent = await prisma.student.create(
            {
                data: newStudent,
            }
        );
        return NextResponse.json({ message: "Success", data: createdStudent });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    } finally {
        await prisma.$disconnect();
    }
}