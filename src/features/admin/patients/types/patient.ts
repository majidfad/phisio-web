export interface PatientDto {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string | null;
  doctorNames?: string[];
  firstAssignedAt?: string;
  createdAt?: string;
  isEnabled: boolean;
}

export interface CreatePatientRequest {
  name: string;
  phoneNumber: string;
  email?: string | null;
}

export interface UpdatePatientRequest {
  name: string;
  phoneNumber: string;
  email?: string | null;
}

export type PatientFormValues = {
  name: string;
  phoneNumber: string;
  email: string;
};
