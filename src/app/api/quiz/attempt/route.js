import { PrismaClient } from '@/generated/prisma';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { isDurationExceeded } from './attemptVerify';

export async function POST(request) {
    const prisma = new PrismaClient();

    try {
        // Parse the request body
        const { studentId, paperId, quizPassword } = await request.json();

        // Verify valid student
        const student = await prisma.student.findUnique({
            where: { studentId },
        });

        if (!student) {
            return NextResponse.json({ message: "Invalid student" }, { status: 401 });
        }

        // Verify valid paper
        const paper = await prisma.paper.findUnique({
            where: { id: paperId },
        });

        if (!paper || !paper.isActive) {
            return NextResponse.json({ message: "Invalid or inactive paper" }, { status: 401 });
        }

        // Verify student's batch matches paper's batch
        if (student.batchId !== paper.batchId) {
            return NextResponse.json({ message: "Student's batch does not match paper's batch" }, { status: 401 });
        }

        // Verify quiz password
        if (paper.password !== quizPassword) {
            return NextResponse.json({ message: "Invalid quiz password" }, { status: 401 });
        }

        // Check if the student already has an attempt
        let attempt = await prisma.quizAttempt.findFirst({
            where: { studentId: student.id, paperId },
        });

        if (attempt) {
            // Check if the attempt is already finished
            if (attempt.isFinished) {
                return NextResponse.json({ message: 'Attempt already finished' }, { status: 403 });
            }

            // Check if the attempt is still valid
            if (isDurationExceeded(attempt, paper)) {
                return NextResponse.json({ message: "Quiz duration exceeded" }, { status: 403 });
            }

            // Update the attemptUuid for the existing attempt
            attempt = await prisma.quizAttempt.update({
                where: { id: attempt.id },
                data: { attemptUuid: uuidv4() },
            });
        } else {
            // Create a new attempt
            attempt = await prisma.quizAttempt.create({
                data: {
                    studentId: student.id,
                    paperId: paper.id,
                    attemptUuid: uuidv4(),
                    finalMarks: 0,
                },
            });
        }

        // Generate a JWT token for the attempt
        const tokenPayload = {
            attemptId: attempt.id,
            studentId: student.id,
            paperId: paper.id,
            attemptUuid: attempt.attemptUuid,
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' }); // 24 hours

        // Return success response with the session token
        const response = NextResponse.json({ message: "Quiz attempt successful" }, { status: 200 });

        response.cookies.set('quiztoken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 86400, // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Quiz attempt error:', error);
        return NextResponse.json({ message: "Quiz attempt failed" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}