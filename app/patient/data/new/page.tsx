
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PatientDataForm from './_components/patient-data-form';

const prisma = new PrismaClient();

export default async function NewPatientDataPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'PATIENT') {
    redirect('/admin/dashboard');
  }

  // Fetch available EHR systems
  const ehrSystems = await prisma.eHRSystem.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          fieldMappings: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <PatientDataForm 
      user={session.user}
      ehrSystems={JSON.parse(JSON.stringify(ehrSystems))}
      mode="create"
    />
  );
}
