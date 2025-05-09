import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const result = await jwtVerify(request);
  if (result instanceof NextResponse) return result;

  const { id } = await params;

  try {
    await prisma.paper.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ message: 'Failed to delete' }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  const result = await jwtVerify(request);
  if (result instanceof NextResponse) return result;

  const { id } = await params;
  const data = await request.json();

  try {
    const updatedPaper = await prisma.paper.update({
      where: {
        id: parseInt(id),
      },
      data,
    });

    return NextResponse.json({ message: 'Success', updatedPaper });
  } catch (error) {
    console.error('Error updating paper:', error);
    return NextResponse.json({ message: 'Failed to update' }, { status: 401 });
  }
}