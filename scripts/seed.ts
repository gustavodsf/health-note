
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create test admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ehr-system.com' },
      update: {},
      create: {
        email: 'admin@ehr-system.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test patient user (as required by guidelines)
    const patientPassword = await bcrypt.hash('johndoe123', 12);
    const patient = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: patientPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: 'PATIENT'
      }
    });
    console.log('✅ Test patient user created:', patient.email);

    // Create additional test patient
    const testPatientPassword = await bcrypt.hash('patient123', 12);
    const testPatient = await prisma.user.upsert({
      where: { email: 'patient@test.com' },
      update: {},
      create: {
        email: 'patient@test.com',
        password: testPatientPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        role: 'PATIENT'
      }
    });
    console.log('✅ Additional test patient created:', testPatient.email);

    // Create Athena EHR System
    const athenaSystem = await prisma.eHRSystem.upsert({
      where: { name: 'Athena' },
      update: {},
      create: {
        name: 'Athena',
        description: 'Athena Health Electronic Health Record System',
        version: '2024.1',
        isActive: true
      }
    });
    console.log('✅ Athena EHR System created');

    // Create Allscripts EHR System
    const allscriptsSystem = await prisma.eHRSystem.upsert({
      where: { name: 'Allscripts' },
      update: {},
      create: {
        name: 'Allscripts',
        description: 'Allscripts Electronic Health Record System',
        version: '2024.2',
        isActive: true
      }
    });
    console.log('✅ Allscripts EHR System created');

    // Create Epic EHR System (additional example)
    const epicSystem = await prisma.eHRSystem.upsert({
      where: { name: 'Epic' },
      update: {},
      create: {
        name: 'Epic',
        description: 'Epic Systems Electronic Health Record',
        version: '2024.3',
        isActive: true
      }
    });
    console.log('✅ Epic EHR System created');

    // Define Athena field mappings
    const athenaFieldMappings = [
      { standardField: 'name', ehrField: 'PATIENT_IDENT_NAME', dataType: 'string', isRequired: true, description: 'Patient full name' },
      { standardField: 'gender', ehrField: 'GENDER_OF_PATIENT', dataType: 'string', isRequired: true, description: 'Patient gender' },
      { standardField: 'dob', ehrField: 'DATE_OF_BIRTH_PATIENT', dataType: 'date', isRequired: true, description: 'Patient date of birth' },
      { standardField: 'email', ehrField: 'EMAIL_ADDRESS_PATIENT', dataType: 'string', isRequired: false, description: 'Patient email address' },
      { standardField: 'phone', ehrField: 'PHONE_NUMBER_PATIENT', dataType: 'string', isRequired: false, description: 'Patient phone number' },
      { standardField: 'address', ehrField: 'ADDRESS_PATIENT', dataType: 'string', isRequired: false, description: 'Patient street address' },
      { standardField: 'city', ehrField: 'CITY_PATIENT', dataType: 'string', isRequired: false, description: 'Patient city' },
      { standardField: 'state', ehrField: 'STATE_PATIENT', dataType: 'string', isRequired: false, description: 'Patient state' },
      { standardField: 'zip', ehrField: 'ZIP_CODE_PATIENT', dataType: 'string', isRequired: false, description: 'Patient ZIP code' },
      { standardField: 'allergies', ehrField: 'ALLERGIES_PATIENT', dataType: 'string', isRequired: false, description: 'Patient allergies information' },
      { standardField: 'medicalHistory', ehrField: 'HISTORY_MEDICAL_PATIENT', dataType: 'string', isRequired: false, description: 'Patient medical history' },
      { standardField: 'medications', ehrField: 'MEDICATIONS_CURRENT_PATIENT', dataType: 'string', isRequired: false, description: 'Current medications' },
      { standardField: 'socialHistory', ehrField: 'SOCIAL_HISTORY_PATIENT', dataType: 'string', isRequired: false, description: 'Patient social history' },
      { standardField: 'familyHistory', ehrField: 'FAMILY_HISTORY_PATIENT', dataType: 'string', isRequired: false, description: 'Patient family history' },
      { standardField: 'emergencyContactName', ehrField: 'EMERGENCY_CONTACT_NAME', dataType: 'string', isRequired: false, description: 'Emergency contact name' },
      { standardField: 'emergencyContactPhone', ehrField: 'EMERGENCY_CONTACT_PHONE', dataType: 'string', isRequired: false, description: 'Emergency contact phone' },
      { standardField: 'insuranceProvider', ehrField: 'INSURANCE_PROVIDER_PATIENT', dataType: 'string', isRequired: false, description: 'Insurance provider name' },
      { standardField: 'insuranceNumber', ehrField: 'INSURANCE_ID_PATIENT', dataType: 'string', isRequired: false, description: 'Insurance ID number' }
    ];

    // Define Allscripts field mappings
    const allscriptsFieldMappings = [
      { standardField: 'name', ehrField: 'NAME_OF_PAT', dataType: 'string', isRequired: true, description: 'Patient name' },
      { standardField: 'gender', ehrField: 'GENDER_PAT', dataType: 'string', isRequired: true, description: 'Patient gender' },
      { standardField: 'dob', ehrField: 'BIRTHDATE_OF_PAT', dataType: 'date', isRequired: true, description: 'Patient birth date' },
      { standardField: 'email', ehrField: 'EMAIL_PAT', dataType: 'string', isRequired: false, description: 'Patient email' },
      { standardField: 'phone', ehrField: 'PHONE_PAT', dataType: 'string', isRequired: false, description: 'Patient phone' },
      { standardField: 'address', ehrField: 'ADDRESS_PAT', dataType: 'string', isRequired: false, description: 'Patient address' },
      { standardField: 'city', ehrField: 'CITY_PAT', dataType: 'string', isRequired: false, description: 'Patient city' },
      { standardField: 'state', ehrField: 'STATE_PAT', dataType: 'string', isRequired: false, description: 'Patient state' },
      { standardField: 'zip', ehrField: 'ZIPCODE_PAT', dataType: 'string', isRequired: false, description: 'Patient ZIP code' },
      { standardField: 'allergies', ehrField: 'ALLERGIES_PAT', dataType: 'string', isRequired: false, description: 'Patient allergies' },
      { standardField: 'medicalHistory', ehrField: 'HISTORY_MEDICAL_PAT', dataType: 'string', isRequired: false, description: 'Medical history' },
      { standardField: 'medications', ehrField: 'CURRENT_MEDS_PAT', dataType: 'string', isRequired: false, description: 'Current medications' },
      { standardField: 'socialHistory', ehrField: 'SOCIAL_HIST_PAT', dataType: 'string', isRequired: false, description: 'Social history' },
      { standardField: 'familyHistory', ehrField: 'FAMILY_HIST_PAT', dataType: 'string', isRequired: false, description: 'Family history' },
      { standardField: 'emergencyContactName', ehrField: 'EMERG_CONTACT_NAME_PAT', dataType: 'string', isRequired: false, description: 'Emergency contact' },
      { standardField: 'emergencyContactPhone', ehrField: 'EMERG_CONTACT_PHONE_PAT', dataType: 'string', isRequired: false, description: 'Emergency contact phone' },
      { standardField: 'insuranceProvider', ehrField: 'INSURANCE_COMPANY_PAT', dataType: 'string', isRequired: false, description: 'Insurance company' },
      { standardField: 'insuranceNumber', ehrField: 'INSURANCE_POLICY_PAT', dataType: 'string', isRequired: false, description: 'Insurance policy number' }
    ];

    // Define Epic field mappings (more modern naming convention)
    const epicFieldMappings = [
      { standardField: 'name', ehrField: 'PatientName', dataType: 'string', isRequired: true, description: 'Patient full name' },
      { standardField: 'gender', ehrField: 'PatientGender', dataType: 'string', isRequired: true, description: 'Patient gender' },
      { standardField: 'dob', ehrField: 'PatientBirthDate', dataType: 'date', isRequired: true, description: 'Patient birth date' },
      { standardField: 'email', ehrField: 'PatientEmail', dataType: 'string', isRequired: false, description: 'Patient email address' },
      { standardField: 'phone', ehrField: 'PatientPhone', dataType: 'string', isRequired: false, description: 'Patient phone number' },
      { standardField: 'address', ehrField: 'PatientAddress', dataType: 'string', isRequired: false, description: 'Patient street address' },
      { standardField: 'city', ehrField: 'PatientCity', dataType: 'string', isRequired: false, description: 'Patient city' },
      { standardField: 'state', ehrField: 'PatientState', dataType: 'string', isRequired: false, description: 'Patient state' },
      { standardField: 'zip', ehrField: 'PatientZipCode', dataType: 'string', isRequired: false, description: 'Patient ZIP code' },
      { standardField: 'allergies', ehrField: 'PatientAllergies', dataType: 'string', isRequired: false, description: 'Patient allergies' },
      { standardField: 'medicalHistory', ehrField: 'PatientMedicalHistory', dataType: 'string', isRequired: false, description: 'Patient medical history' },
      { standardField: 'medications', ehrField: 'PatientCurrentMedications', dataType: 'string', isRequired: false, description: 'Current medications' },
      { standardField: 'socialHistory', ehrField: 'PatientSocialHistory', dataType: 'string', isRequired: false, description: 'Patient social history' },
      { standardField: 'familyHistory', ehrField: 'PatientFamilyHistory', dataType: 'string', isRequired: false, description: 'Patient family history' },
      { standardField: 'emergencyContactName', ehrField: 'EmergencyContactName', dataType: 'string', isRequired: false, description: 'Emergency contact name' },
      { standardField: 'emergencyContactPhone', ehrField: 'EmergencyContactPhone', dataType: 'string', isRequired: false, description: 'Emergency contact phone' },
      { standardField: 'insuranceProvider', ehrField: 'InsuranceProvider', dataType: 'string', isRequired: false, description: 'Insurance provider' },
      { standardField: 'insuranceNumber', ehrField: 'InsuranceMemberID', dataType: 'string', isRequired: false, description: 'Insurance member ID' }
    ];

    // Insert Athena field mappings
    for (const mapping of athenaFieldMappings) {
      await prisma.eHRFieldMapping.upsert({
        where: {
          ehrSystemId_standardField: {
            ehrSystemId: athenaSystem.id,
            standardField: mapping.standardField
          }
        },
        update: mapping,
        create: {
          ...mapping,
          ehrSystemId: athenaSystem.id
        }
      });
    }
    console.log(`✅ ${athenaFieldMappings.length} Athena field mappings created`);

    // Insert Allscripts field mappings
    for (const mapping of allscriptsFieldMappings) {
      await prisma.eHRFieldMapping.upsert({
        where: {
          ehrSystemId_standardField: {
            ehrSystemId: allscriptsSystem.id,
            standardField: mapping.standardField
          }
        },
        update: mapping,
        create: {
          ...mapping,
          ehrSystemId: allscriptsSystem.id
        }
      });
    }
    console.log(`✅ ${allscriptsFieldMappings.length} Allscripts field mappings created`);

    // Insert Epic field mappings
    for (const mapping of epicFieldMappings) {
      await prisma.eHRFieldMapping.upsert({
        where: {
          ehrSystemId_standardField: {
            ehrSystemId: epicSystem.id,
            standardField: mapping.standardField
          }
        },
        update: mapping,
        create: {
          ...mapping,
          ehrSystemId: epicSystem.id
        }
      });
    }
    console.log(`✅ ${epicFieldMappings.length} Epic field mappings created`);

    // Create sample patient data
    const samplePatientData = await prisma.patientData.create({
      data: {
        userId: patient.id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        gender: 'Male',
        dateOfBirth: new Date('1990-05-15'),
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'US',
        allergies: 'Penicillin, Shellfish',
        medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
        medicalHistory: 'Hypertension diagnosed 2018, Type 2 Diabetes diagnosed 2020',
        socialHistory: 'Non-smoker, Occasional alcohol use',
        familyHistory: 'Father: Heart disease, Mother: Diabetes',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '(555) 987-6543',
        emergencyContactRelation: 'Spouse',
        insuranceProvider: 'Blue Cross Blue Shield',
        insuranceNumber: 'ABC123456789',
        insuranceGroup: 'GRP001',
        lastModifiedBy: admin.id
      }
    });
    console.log('✅ Sample patient data created for John Doe');

    // Create sample patient data for test patient
    const testPatientData = await prisma.patientData.create({
      data: {
        userId: testPatient.id,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '(555) 234-5678',
        gender: 'Female',
        dateOfBirth: new Date('1985-03-22'),
        address: '456 Oak Avenue',
        city: 'Springfield',
        state: 'NY',
        zipCode: '67890',
        country: 'US',
        allergies: 'None known',
        medications: 'Multivitamin daily',
        medicalHistory: 'Appendectomy 2010, No other significant history',
        socialHistory: 'Non-smoker, Non-drinker',
        familyHistory: 'No significant family history',
        emergencyContactName: 'Robert Smith',
        emergencyContactPhone: '(555) 345-6789',
        emergencyContactRelation: 'Brother',
        insuranceProvider: 'Aetna',
        insuranceNumber: 'DEF987654321',
        insuranceGroup: 'GRP002',
        lastModifiedBy: admin.id
      }
    });
    console.log('✅ Sample patient data created for Jane Smith');

    // Create initial audit log entry
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE',
        entityType: 'System',
        entityId: 'seed-process',
        newValues: {
          ehrSystemsCreated: 3,
          fieldMappingsCreated: athenaFieldMappings.length + allscriptsFieldMappings.length + epicFieldMappings.length,
          usersCreated: 3,
          patientDataCreated: 2
        },
        metadata: {
          seedVersion: '1.0',
          timestamp: new Date(),
          description: 'Initial database seeding completed'
        }
      }
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 3 EHR systems created (Athena, Allscripts, Epic)');
    console.log(`- ${athenaFieldMappings.length + allscriptsFieldMappings.length + epicFieldMappings.length} field mappings created`);
    console.log('- 3 users created (1 admin, 2 patients)');
    console.log('- 2 patient data records created');
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@ehr-system.com / admin123');
    console.log('Patient 1: john@doe.com / johndoe123');
    console.log('Patient 2: patient@test.com / patient123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
