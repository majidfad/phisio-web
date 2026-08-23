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
  isClinicManager?: boolean;
  managedClinicNames?: string[];
}

export interface CreateDoctorRequest {
  name: string;
  phoneNumber: string;
  email?: string | null;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
  password?: string;
  confirmPassword?: string;
  generatePassword?: boolean;
  clinicPhoneNumbers: string[];
  newClinicName?: string | null;
  newClinicAddress?: string | null;
  managerIsThisDoctor?: boolean;
  clinicManagerId?: string | null;
}

export interface CreateDoctorResponse {
  doctor: DoctorDto;
  generatedPassword?: string | null;
}

export type UpdateDoctorRequest = Omit<
  CreateDoctorRequest,
  | 'password'
  | 'confirmPassword'
  | 'generatePassword'
  | 'clinicPhoneNumbers'
  | 'newClinicName'
  | 'newClinicAddress'
  | 'managerIsThisDoctor'
  | 'clinicManagerId'
>;
