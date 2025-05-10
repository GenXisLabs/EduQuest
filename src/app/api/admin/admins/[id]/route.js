import { NextResponse } from 'next/server';
import { jwtVerify } from '../../auth/jwtVerify';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const result = await jwtVerify(request);
  if (result instanceof NextResponse) return result;

  const { id } = await params;

  // Check if the id is equal to the admin's id
  if (parseInt(id) === result.id) {
    return NextResponse.json({ message: 'Cannot delete yourself' }, { status: 401 });
  }

  try {
    await prisma.admin.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ message: 'Failed to delete' }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}