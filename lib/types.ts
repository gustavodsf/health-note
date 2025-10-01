
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'PATIENT' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface EHRSystem {
  id: string;
  name: string;
  description?: string;
  version?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fieldMappings?: EHRFieldMapping[];
  _count?: {
    patientData: number;
    fieldMappings: number;
  };
}

export interface EHRFieldMapping {
  id: string;
  ehrSystemId: string;
  standardField: string;
  ehrField: string;
  dataType: string;
  isRequired: boolean;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ehrSystem?: {
    id: string;
    name: string;
    version?: string | null;
  };
}

export interface PatientData {
  id: string;
  userId: string;
  ehrSystemId?: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  allergies?: string;
  medications?: string;
  medicalHistory?: string;
  socialHistory?: string;
  familyHistory?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceGroup?: string;
  isActive: boolean;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  ehrSystem?: EHRSystem;
}

export interface AuditLog {
  id: string;
  userId?: string;
  patientDataId?: string;
  ehrSystemId?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'IMPORT' | 'LOGIN' | 'LOGOUT';
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: Date;
  user?: User;
  patientData?: PatientData;
  ehrSystem?: EHRSystem;
}

export interface TransformedPatientData {
  [key: string]: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: ValidationError[];
}

// NextAuth type extensions
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      firstName?: string;
      lastName?: string;
    };
  }

  interface User {
    role: string;
    firstName?: string;
    lastName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    firstName?: string;
    lastName?: string;
  }
}
