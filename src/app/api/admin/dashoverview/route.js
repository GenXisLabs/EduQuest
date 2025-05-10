import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const totalStudents = await prisma.student.count();
        const totalPapers = await prisma.paper.count();
        const activePapers = await prisma.paper.count({
            where: {
                isActive: true,
            },
        });

        return NextResponse.json({
            message: 'Success',
            data: {
                totalStudents,
                totalPapers,
                activePapers,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        return NextResponse.json({ message: 'Failed to fetch dashboard overview' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}