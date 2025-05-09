import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const prisma = new PrismaClient();
    
    try {
        // Get cookies from the request
        const cookies = req.cookies;
        const token = cookies.get('token').value;

        if (!token) {
            return NextResponse.json({ error: 'Token not found' }, { status: 401 });
        }

        // Validate the JWT
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey);

        // If the token is valid, renew admin data from the database
        const admin = await prisma.admin.findUnique({
            where: { "id": decoded.id },
        });

        delete admin.password; // Remove password from the response

        return NextResponse.json({ message: 'Token is valid', user: admin });
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
}