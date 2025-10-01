
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PatientDashboardClient from './_components/patient-dashboard-client';

const prisma = new PrismaClient();

export default async function PatientDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'PATIENT') {
    redirect('/admin/dashboard');
  }

  // Fetch patient data
  const patientData = await prisma.patientData.findMany({
    where: { userId: session.user.id },
    include: {
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
    <PatientDashboardClient 
      user={session.user}
      patientData={JSON.parse(JSON.stringify(patientData))}
      ehrSystems={JSON.parse(JSON.stringify(ehrSystems))}
    />
  );
}
