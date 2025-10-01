
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - List field mappings (with optional EHR system filter)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ehrSystemId = searchParams.get('ehrSystemId');

    const whereClause = ehrSystemId ? { ehrSystemId } : {};

    const mappings = await prisma.eHRFieldMapping.findMany({
      where: whereClause,
      include: {
        ehrSystem: {
          select: {
            id: true,
            name: true,
            version: true
          }
        }
      },
      orderBy: [
        { ehrSystemId: 'asc' },
        { standardField: 'asc' }
      ]
    });

    return NextResponse.json(mappings);
  } catch (error) {
    console.error('Error fetching field mappings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new field mapping (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ehrSystemId, standardField, ehrField, dataType, isRequired, description } = body;

    if (!ehrSystemId || !standardField || !ehrField || !dataType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify EHR system exists
    const ehrSystem = await prisma.eHRSystem.findUnique({
      where: { id: ehrSystemId }
    });

    if (!ehrSystem) {
      return NextResponse.json(
        { error: 'EHR system not found' },
        { status: 404 }
      );
    }

    const mapping = await prisma.eHRFieldMapping.create({
      data: {
        ehrSystemId,
        standardField,
        ehrField,
        dataType,
        isRequired: isRequired || false,
        description
      },
      include: {
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
        ehrSystemId,
        action: 'CREATE',
        entityType: 'EHRFieldMapping',
        entityId: mapping.id,
        newValues: {
          standardField,
          ehrField,
          dataType,
          isRequired,
          description
        }
      }
    });

    return NextResponse.json(mapping, { status: 201 });
  } catch (error) {
    console.error('Error creating field mapping:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
