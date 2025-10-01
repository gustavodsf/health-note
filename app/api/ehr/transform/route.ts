
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// POST - Transform patient data to EHR format
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { patientDataId, ehrSystemId, patientData } = body;

    if (!ehrSystemId) {
      return NextResponse.json(
        { error: 'EHR system ID is required' },
        { status: 400 }
      );
    }

    // Get EHR system and its field mappings
    const ehrSystem = await prisma.eHRSystem.findUnique({
      where: { id: ehrSystemId },
      include: {
        fieldMappings: true
      }
    });

    if (!ehrSystem) {
      return NextResponse.json(
        { error: 'EHR system not found' },
        { status: 404 }
      );
    }

    let sourceData = patientData;

    // If patientDataId is provided, fetch from database
    if (patientDataId) {
      const whereClause: any = { id: patientDataId };
      
      // Patients can only transform their own data
      if (session.user.role === 'PATIENT') {
        whereClause.userId = session.user.id;
      }

      const dbPatientData = await prisma.patientData.findUnique({
        where: whereClause
      });

      if (!dbPatientData) {
        return NextResponse.json(
          { error: 'Patient data not found' },
          { status: 404 }
        );
      }

      sourceData = dbPatientData;
    }

    if (!sourceData) {
      return NextResponse.json(
        { error: 'No patient data provided' },
        { status: 400 }
      );
    }

    // Transform the data based on field mappings
    const transformedData = await transformPatientData(sourceData, ehrSystem.fieldMappings);

    // Log the transformation audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        patientDataId: patientDataId || null,
        ehrSystemId,
        action: 'EXPORT',
        entityType: 'PatientData',
        entityId: patientDataId || 'manual-transform',
        metadata: {
          ehrSystemName: ehrSystem.name,
          transformedFields: Object.keys(transformedData).length,
          timestamp: new Date()
        }
      }
    });

    return NextResponse.json({
      ehrSystem: {
        id: ehrSystem.id,
        name: ehrSystem.name,
        version: ehrSystem.version
      },
      originalData: sourceData,
      transformedData,
      mappingCount: ehrSystem.fieldMappings.length,
      transformedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error transforming patient data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to transform patient data based on field mappings
async function transformPatientData(patientData: any, fieldMappings: any[]) {
  const transformed: any = {};

  // Create a mapping lookup for efficiency
  const mappingLookup = fieldMappings.reduce((acc, mapping) => {
    acc[mapping.standardField] = {
      ehrField: mapping.ehrField,
      dataType: mapping.dataType,
      isRequired: mapping.isRequired
    };
  }, {} as any);

  // Standard field mappings
  const standardFieldMap: { [key: string]: string } = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    gender: 'gender',
    dob: 'dateOfBirth',
    address: 'address',
    city: 'city',
    state: 'state',
    zip: 'zipCode',
    country: 'country',
    allergies: 'allergies',
    medications: 'medications',
    medicalHistory: 'medicalHistory',
    socialHistory: 'socialHistory',
    familyHistory: 'familyHistory',
    emergencyContactName: 'emergencyContactName',
    emergencyContactPhone: 'emergencyContactPhone',
    emergencyContactRelation: 'emergencyContactRelation',
    insuranceProvider: 'insuranceProvider',
    insuranceNumber: 'insuranceNumber',
    insuranceGroup: 'insuranceGroup'
  };

  // Transform each field based on mappings
  Object.entries(standardFieldMap).forEach(([standardField, dataField]) => {
    const mapping = mappingLookup[standardField];
    if (mapping && patientData[dataField] !== null && patientData[dataField] !== undefined) {
      let value = patientData[dataField];

      // Apply data type transformations
      switch (mapping.dataType) {
        case 'string':
          value = String(value);
          break;
        case 'date':
          if (value instanceof Date) {
            value = value.toISOString().split('T')[0]; // YYYY-MM-DD format
          } else if (typeof value === 'string') {
            value = new Date(value).toISOString().split('T')[0];
          }
          break;
        case 'boolean':
          value = Boolean(value);
          break;
        case 'number':
          value = Number(value);
          break;
      }

      transformed[mapping.ehrField] = value;
    }
  });

  return transformed;
}
