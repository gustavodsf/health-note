
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - Get specific EHR system
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ehrSystem = await prisma.eHRSystem.findUnique({
      where: { id: params.id },
      include: {
        fieldMappings: {
          orderBy: { standardField: 'asc' }
        },
        _count: {
          select: {
            patientData: true
          }
        }
      }
    });

    if (!ehrSystem) {
      return NextResponse.json(
        { error: 'EHR system not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ehrSystem);
  } catch (error) {
    console.error('Error fetching EHR system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update EHR system (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, version, isActive } = body;

    const existingSystem = await prisma.eHRSystem.findUnique({
      where: { id: params.id }
    });

    if (!existingSystem) {
      return NextResponse.json(
        { error: 'EHR system not found' },
        { status: 404 }
      );
    }

    const updatedSystem = await prisma.eHRSystem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(version && { version }),
        ...(isActive !== undefined && { isActive })
      }
    });

    // Log the update audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        ehrSystemId: params.id,
        action: 'UPDATE',
        entityType: 'EHRSystem',
        entityId: params.id,
        oldValues: {
          name: existingSystem.name,
          description: existingSystem.description,
          version: existingSystem.version,
          isActive: existingSystem.isActive
        },
        newValues: {
          name: updatedSystem.name,
          description: updatedSystem.description,
          version: updatedSystem.version,
          isActive: updatedSystem.isActive
        }
      }
    });

    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.error('Error updating EHR system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete EHR system (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingSystem = await prisma.eHRSystem.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            patientData: true
          }
        }
      }
    });

    if (!existingSystem) {
      return NextResponse.json(
        { error: 'EHR system not found' },
        { status: 404 }
      );
    }

    if (existingSystem._count.patientData > 0) {
      return NextResponse.json(
        { error: 'Cannot delete EHR system with existing patient data' },
        { status: 400 }
      );
    }

    await prisma.eHRSystem.delete({
      where: { id: params.id }
    });

    // Log the deletion audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entityType: 'EHRSystem',
        entityId: params.id,
        oldValues: {
          name: existingSystem.name,
          description: existingSystem.description,
          version: existingSystem.version
        }
      }
    });

    return NextResponse.json({ message: 'EHR system deleted successfully' });
  } catch (error) {
    console.error('Error deleting EHR system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
