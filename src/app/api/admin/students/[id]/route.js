import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const result = await jwtVerify(request);
  if (result instanceof NextResponse) return result;

  const { id } = await params;

  try {
    await prisma.student.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ message: 'Failed to delete' }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}