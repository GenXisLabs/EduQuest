import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import { jwtVerify } from '../auth/jwtVerify';

export async function GET(req) {
    const result = jwtVerify(req);

    if (result instanceof NextResponse) return result; 

    const prisma = new PrismaClient();
    
    try {
        // If the token is valid, renew admin data from the database
        const admin = await prisma.admin.findUnique({
            where: { "id": result.id },
        });

        delete admin.password; // Remove password from the response

        return NextResponse.json({ message: 'Token is valid', admin: admin });
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}