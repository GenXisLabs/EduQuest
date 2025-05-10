import { PrismaClient } from '@/generated/prisma';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { jwtVerify } from '../attempt/jwtVerify';
import { verifyAttempt } from '../attempt/attemptVerify';

export async function GET(request) {
    const jwtResult = await jwtVerify(request);
    if (jwtResult instanceof NextResponse) return jwtResult;

    const attemptResult = await verifyAttempt(jwtResult.attemptId, jwtResult.paperId, true);
    if (attemptResult instanceof NextResponse) return attemptResult;

    return NextResponse.json({ message: 'Success', data: attemptResult });
}