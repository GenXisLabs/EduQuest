import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const paper = await prisma.paper.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!paper) {
            return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
        }

        if (!paper.isActive) {
            return NextResponse.json({ message: 'Paper is not active' }, { status: 403 });
        }

        delete paper.password; // Remove password from the paper object

        return NextResponse.json({ message: 'Success', paper });
    } catch (error) {
        console.error('Error fetching paper details:', error);
        return NextResponse.json({ message: 'Failed to fetch paper details' }, { status: 401 });
    } finally {
        await prisma.$disconnect();
    }
}