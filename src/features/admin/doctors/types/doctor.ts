export interface DoctorDto {
  id: string;
  name: string;
  phoneNumber: string;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
  createdAt: string;
  email?: string | null;
  isEnabled: boolean;
}

export interface CreateDoctorRequest {
  name: string;
  phoneNumber: string;
  email?: string | null;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
}

export type UpdateDoctorRequest = CreateDoctorRequest;
