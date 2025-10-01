
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - Get specific patient data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whereClause: any = { id: params.id };
    
    // Patients can only access their own data
    if (session.user.role === 'PATIENT') {
      whereClause.userId = session.user.id;
    }

    const patientData = await prisma.patientData.findUnique({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        ehrSystem: {
          select: {
            id: true,
            name: true,
            version: true
          }
        }
      }
    });

    if (!patientData) {
      return NextResponse.json(
        { error: 'Patient data not found' },
        { status: 404 }
      );
    }

    // Log the read audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        patientDataId: params.id,
        action: 'READ',
        entityType: 'PatientData',
        entityId: params.id,
        metadata: {
          accessedBy: session.user.role
        }
      }
    });

    return NextResponse.json(patientData);
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update patient data
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whereClause: any = { id: params.id };
    
    // Patients can only update their own data
    if (session.user.role === 'PATIENT') {
      whereClause.userId = session.user.id;
    }

    const existingData = await prisma.patientData.findUnique({
      where: whereClause
    });

    if (!existingData) {
      return NextResponse.json(
        { error: 'Patient data not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: any = { ...body };
    
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    updateData.lastModifiedBy = session.user.id;

    const updatedData = await prisma.patientData.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        ehrSystem: {
          select: {
            id: true,
            name: true,
            version: true
          }
        }
      }
    });

    // Log the update audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        patientDataId: params.id,
        action: 'UPDATE',
        entityType: 'PatientData',
        entityId: params.id,
        oldValues: {
          name: existingData.name,
          email: existingData.email,
          phone: existingData.phone,
          ehrSystemId: existingData.ehrSystemId
        },
        newValues: {
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          ehrSystemId: updatedData.ehrSystemId
        }
      }
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating patient data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete patient data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whereClause: any = { id: params.id };
    
    // Patients can only delete their own data
    if (session.user.role === 'PATIENT') {
      whereClause.userId = session.user.id;
    }

    const existingData = await prisma.patientData.findUnique({
      where: whereClause
    });

    if (!existingData) {
      return NextResponse.json(
        { error: 'Patient data not found' },
        { status: 404 }
      );
    }

    await prisma.patientData.delete({
      where: { id: params.id }
    });

    // Log the deletion audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        entityType: 'PatientData',
        entityId: params.id,
        oldValues: {
          name: existingData.name,
          email: existingData.email,
          userId: existingData.userId
        }
      }
    });

    return NextResponse.json({ message: 'Patient data deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
