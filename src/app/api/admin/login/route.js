import { PrismaClient } from '@/generated/prisma';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const prisma = new PrismaClient();

    try {
        // Parse the request body
        const { email, password } = await request.json();

        // Find the admin user by email
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        delete admin.password; // Remove password from the response

        if (!admin) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Hash the provided password and compare it with the stored hash
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (admin.password !== hashedPassword) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        // Generate a jwt token 
        const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with the session token
        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 3600, // 1 hour
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: "Login failed" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}