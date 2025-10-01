
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - Get patient data (filtered by user for patients, all for admins)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ehrSystemId = searchParams.get('ehrSystemId');

    const whereClause: any = {};
    
    // Patients can only see their own data
    if (session.user.role === 'PATIENT') {
      whereClause.userId = session.user.id;
    }

    if (ehrSystemId) {
      whereClause.ehrSystemId = ehrSystemId;
    }

    const patientData = await prisma.patientData.findMany({
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
      },
      orderBy: { updatedAt: 'desc' }
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

// POST - Create new patient data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      ehrSystemId,
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      country,
      allergies,
      medications,
      medicalHistory,
      socialHistory,
      familyHistory,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      insuranceProvider,
      insuranceNumber,
      insuranceGroup
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // For patients, they can only create their own data
    let targetUserId = session.user.id;
    if (session.user.role !== 'PATIENT' && body.userId) {
      targetUserId = body.userId;
    }

    const patientData = await prisma.patientData.create({
      data: {
        userId: targetUserId,
        ehrSystemId,
        name,
        email,
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        city,
        state,
        zipCode,
        country: country || 'US',
        allergies,
        medications,
        medicalHistory,
        socialHistory,
        familyHistory,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
        insuranceProvider,
        insuranceNumber,
        insuranceGroup,
        lastModifiedBy: session.user.id
      },
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

    // Log the creation audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        patientDataId: patientData.id,
        ehrSystemId,
        action: 'CREATE',
        entityType: 'PatientData',
        entityId: patientData.id,
        newValues: {
          name,
          email,
          phone,
          gender,
          ehrSystemId
        },
        metadata: {
          createdFor: targetUserId
        }
      }
    });

    return NextResponse.json(patientData, { status: 201 });
  } catch (error) {
    console.error('Error creating patient data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
