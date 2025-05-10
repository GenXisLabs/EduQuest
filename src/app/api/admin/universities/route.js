import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const universities = await prisma.university.findMany();
        return NextResponse.json({ message: "Success", data: universities });
    } catch (error) {
        console.error('Error fetching batches:', error);
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
        const newUni = { ...body };
        const createdUni = await prisma.university.create(
            {
                data: newUni,
            }
        );
        return NextResponse.json({ message: "Success", data: createdUni });
    } catch (error) {
        console.error('Error creating batch:', error);
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    } finally {
        await prisma.$disconnect();
    }
}