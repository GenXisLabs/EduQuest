import { PrismaClient } from '@/generated/prisma';
import crypto from 'crypto';

export async function GET() {
    const prisma = new PrismaClient();

    try {
        // Seed the database
        const user = await prisma.admin.create({
            data: {
                id: 1,
                name: 'Super Admin',
                email: 'admin@admin.com',
                password: crypto.createHash('sha256').update('mepa@123').digest('hex'),
            },
        });

        // Return success response
        return new Response(JSON.stringify({ message: "Seed successful", user }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle errors
        return new Response(JSON.stringify({ message: "Seed failed", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } finally {
        await prisma.$disconnect();
    }
}