import type { UserRole } from '@/types/auth';

export interface ClinicDto {
  clinicId: string;
  name: string;
  address: string;
  clinicManagerId: string;
  phoneNumbers: string[];
  createdAt: string;
  isEnabled: boolean;
}

export interface CreateClinicRequest {
  name: string;
  address: string;
  phoneNumbers: string[];
  clinicManagerId?: string;
}

export type UpdateClinicRequest = Omit<CreateClinicRequest, 'clinicManagerId'>;

export interface ChangeClinicManagerRequest {
  clinicManagerId: string;
}

export interface ClinicDoctorMemberDto {
  doctorId: string;
  name: string;
  phoneNumber: string;
  role: UserRole | number;
  specialty: string;
  medicalLicenseNumber: string;
  isClinicManager: boolean;
}

export interface ClinicDoctorCandidateDto {
  doctorId: string;
  name: string;
  phoneNumber: string;
  specialty: string;
  isClinicManager: boolean;
}

export interface ClinicPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  assignedAt: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
}

export type ClinicPhoneLookupStatus = 'None' | 'Found' | 'Conflict';

export interface ClinicPhoneLookupResultDto {
  status: ClinicPhoneLookupStatus;
  clinic: ClinicDto | null;
  conflictingClinics: ClinicDto[];
}
