import { NextResponse } from 'next/server';
import { jwtVerify } from '@/app/api/admin/auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const result = await jwtVerify(request);
  if (result instanceof NextResponse) return result;

  const { id, qid } = await params;

  return NextResponse.json({ message: 'Success', data: { id, qid } });
}