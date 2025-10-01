
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - List all EHR systems
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ehrSystems = await prisma.eHRSystem.findMany({
      orderBy: { name: 'asc' },
      include: {
        fieldMappings: true,
        _count: {
          select: {
            patientData: true,
            fieldMappings: true
          }
        }
      }
    });

    return NextResponse.json(ehrSystems);
  } catch (error) {
    console.error('Error fetching EHR systems:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new EHR system (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, version } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const ehrSystem = await prisma.eHRSystem.create({
      data: {
        name,
        description,
        version,
        isActive: true
      }
    });

    // Log the creation audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        ehrSystemId: ehrSystem.id,
        action: 'CREATE',
        entityType: 'EHRSystem',
        entityId: ehrSystem.id,
        newValues: {
          name,
          description,
          version
        }
      }
    });

    return NextResponse.json(ehrSystem, { status: 201 });
  } catch (error) {
    console.error('Error creating EHR system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
