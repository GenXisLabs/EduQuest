import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

const prisma = new PrismaClient();

async function jwtVerify(req) {
    try {
        // Get cookies from the request
        const cookies = req.cookies;
        const token = cookies.get('quiztoken');

        if (!token) {
            return NextResponse.json({ message: 'Token not found' }, { status: 401 });
        }

        const tokenValue = token.value;

        // Validate the JWT
        const decoded = jwt.verify(tokenValue, secretKey);

        const attempt = await prisma.quizAttempt.findUnique({
            where: {
                id: decoded.attemptId,
            },
        });

        if (decoded.attemptUuid !== attempt.attemptUuid) {
            return NextResponse.json({ message: 'Invalid attempt' }, { status: 401 });
        }

        return decoded; 
    } catch (error) {
        console.error('QuizToken validation error:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
}

export { jwtVerify };