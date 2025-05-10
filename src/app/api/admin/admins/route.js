import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function GET(request) {
    const result = await jwtVerify(request);
    if (result instanceof NextResponse) return result;

    try {
        const admins = await prisma.admin.findMany();
        return NextResponse.json({ message: "Success", data: admins });
    } catch (error) {
        console.error('Error fetching admins:', error);
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
        var newAdmin = { ...body };

        // Add default password (mepa@123)
        if (!newAdmin.password) {
            newAdmin.password = crypto.createHash('sha256').update("mepa@123").digest('hex');
        }

        const createdAdmin = await prisma.admin.create(
            {
                data: newAdmin,
            }
        );
        return NextResponse.json({ message: "Success", data: createdAdmin });
    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    } finally {
        await prisma.$disconnect();
    }
}