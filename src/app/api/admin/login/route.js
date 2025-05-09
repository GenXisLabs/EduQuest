import { PrismaClient } from '@/generated/prisma';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const prisma = new PrismaClient();

    try {
        // Parse the request body
        const { email, password } = await request.json();

        // Find the admin user by email
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return new Response(JSON.stringify({ message: "Invalid email or password" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Hash the provided password and compare it with the stored hash
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (admin.password !== hashedPassword) {
            return new Response(JSON.stringify({ message: "Invalid email or password" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Generate a jwt token 
        const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with the session token
        return new Response(JSON.stringify({ message: "Login successful", token }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle errors
        return new Response(JSON.stringify({ message: "Login failed", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}