
import { PrismaClient } from '@prisma/client';
import { TransformedPatientData, PatientData, EHRFieldMapping } from './types';

const prisma = new PrismaClient();

export class EHRService {
  /**
   * Get all available EHR systems
   */
  static async getEHRSystems() {
    return await prisma.eHRSystem.findMany({
      where: { isActive: true },
      include: {
        fieldMappings: {
          orderBy: { standardField: 'asc' }
        },
        _count: {
          select: {
            patientData: true,
            fieldMappings: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get field mappings for a specific EHR system
   */
  static async getFieldMappings(ehrSystemId: string) {
    const ehrSystem = await prisma.eHRSystem.findUnique({
      where: { id: ehrSystemId, isActive: true },
      include: {
        fieldMappings: {
          orderBy: { standardField: 'asc' }
        }
      }
    });

    if (!ehrSystem) {
      throw new Error('EHR system not found or inactive');
    }

    return ehrSystem.fieldMappings;
  }

  /**
   * Transform patient data to EHR format
   */
  static async transformPatientData(
    patientData: PatientData,
    ehrSystemId: string
  ): Promise<TransformedPatientData> {
    const fieldMappings = await this.getFieldMappings(ehrSystemId);
    
    const transformedData: TransformedPatientData = {};

    // Create mapping lookup for efficiency
    const mappingLookup = fieldMappings.reduce((acc, mapping) => {
      acc[mapping.standardField] = mapping;
      return acc;
    }, {} as Record<string, any>);

    // Standard field to database field mapping
    const fieldMap: Record<string, keyof PatientData> = {
      'name': 'name',
      'email': 'email',
      'phone': 'phone',
      'gender': 'gender',
      'dob': 'dateOfBirth',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'zip': 'zipCode',
      'country': 'country',
      'allergies': 'allergies',
      'medications': 'medications',
      'medicalHistory': 'medicalHistory',
      'socialHistory': 'socialHistory',
      'familyHistory': 'familyHistory',
      'emergencyContactName': 'emergencyContactName',
      'emergencyContactPhone': 'emergencyContactPhone',
      'emergencyContactRelation': 'emergencyContactRelation',
      'insuranceProvider': 'insuranceProvider',
      'insuranceNumber': 'insuranceNumber',
      'insuranceGroup': 'insuranceGroup'
    };

    // Transform each mapped field
    Object.entries(fieldMap).forEach(([standardField, dataField]) => {
      const mapping = mappingLookup[standardField];
      if (mapping && patientData[dataField] !== null && patientData[dataField] !== undefined) {
        let value: any = patientData[dataField];

        // Apply data type transformations
        switch (mapping.dataType) {
          case 'string':
            value = String(value);
            break;
          case 'date':
            if (value instanceof Date) {
              value = value.toISOString().split('T')[0];
            } else if (typeof value === 'string') {
              const parsedDate = new Date(value);
              if (!isNaN(parsedDate.getTime())) {
                value = parsedDate.toISOString().split('T')[0];
              }
            }
            break;
          case 'boolean':
            value = Boolean(value);
            break;
          case 'number':
            value = Number(value);
            break;
        }

        transformedData[mapping.ehrField] = value;
      } else if (mapping && mapping.isRequired) {
        // Handle required fields that are missing
        transformedData[mapping.ehrField] = this.getDefaultValueForType(mapping.dataType);
      }
    });

    return transformedData;
  }

  /**
   * Reverse transform EHR data to standard format
   */
  static async reverseTransformData(
    ehrData: Record<string, any>,
    ehrSystemId: string
  ): Promise<Partial<PatientData>> {
    const fieldMappings = await this.getFieldMappings(ehrSystemId);
    
    const standardData: Partial<PatientData> = {};

    // Create reverse mapping lookup
    const reverseMappingLookup = fieldMappings.reduce((acc, mapping) => {
      acc[mapping.ehrField] = mapping;
      return acc;
    }, {} as Record<string, any>);

    // Reverse field mapping
    const reverseFieldMap: Record<string, keyof PatientData> = {
      'name': 'name',
      'email': 'email',
      'phone': 'phone',
      'gender': 'gender',
      'dob': 'dateOfBirth',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'zip': 'zipCode',
      'country': 'country',
      'allergies': 'allergies',
      'medications': 'medications',
      'medicalHistory': 'medicalHistory',
      'socialHistory': 'socialHistory',
      'familyHistory': 'familyHistory',
      'emergencyContactName': 'emergencyContactName',
      'emergencyContactPhone': 'emergencyContactPhone',
      'emergencyContactRelation': 'emergencyContactRelation',
      'insuranceProvider': 'insuranceProvider',
      'insuranceNumber': 'insuranceNumber',
      'insuranceGroup': 'insuranceGroup'
    };

    // Process each EHR field
    Object.entries(ehrData).forEach(([ehrField, value]) => {
      const mapping = reverseMappingLookup[ehrField];
      if (mapping) {
        const standardField = Object.keys(reverseFieldMap).find(
          key => reverseFieldMap[key as keyof typeof reverseFieldMap] === mapping.standardField
        );

        if (standardField && value !== null && value !== undefined) {
          const dataField = reverseFieldMap[standardField];
          if (dataField) {
            // Apply reverse data type transformations
            switch (mapping.dataType) {
              case 'date':
                if (typeof value === 'string') {
                  (standardData as any)[dataField] = new Date(value);
                }
                break;
              case 'string':
              case 'boolean':
              case 'number':
              default:
                (standardData as any)[dataField] = value;
                break;
            }
          }
        }
      }
    });

    return standardData;
  }

  /**
   * Validate required fields for EHR system
   */
  static async validateRequiredFields(
    patientData: PatientData,
    ehrSystemId: string
  ): Promise<{ isValid: boolean; missingFields: string[] }> {
    const fieldMappings = await this.getFieldMappings(ehrSystemId);
    const requiredMappings = fieldMappings.filter(mapping => mapping.isRequired);
    
    const missingFields: string[] = [];

    const fieldMap: Record<string, keyof PatientData> = {
      'name': 'name',
      'email': 'email',
      'phone': 'phone',
      'gender': 'gender',
      'dob': 'dateOfBirth',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'zip': 'zipCode',
      'country': 'country'
    };

    requiredMappings.forEach(mapping => {
      const dataField = fieldMap[mapping.standardField];
      if (dataField && (patientData[dataField] === null || patientData[dataField] === undefined || patientData[dataField] === '')) {
        missingFields.push(mapping.standardField);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Get default value for data type
   */
  private static getDefaultValueForType(dataType: string): any {
    switch (dataType) {
      case 'string':
        return '';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'date':
        return new Date().toISOString().split('T')[0];
      default:
        return null;
    }
  }
}
