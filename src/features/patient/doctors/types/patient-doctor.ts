/** API serializes DoctorPatientStatus enum as number. */
export const DoctorPatientStatusCode = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
} as const;

export type DoctorPatientStatusCode =
  (typeof DoctorPatientStatusCode)[keyof typeof DoctorPatientStatusCode];

export interface PatientDoctorDirectoryItemDto {
  doctorId: string;
  name: string;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
  phoneNumber: string;
  relationshipStatus: DoctorPatientStatusCode | null;
}

export interface PatientDoctorProfileDto {
  doctorId: string;
  name: string;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
  phoneNumber: string;
  relationshipStatus: DoctorPatientStatusCode | null;
  relationshipCreatedAt: string | null;
}

export interface PatientLinkedDoctorDto {
  doctorId: string;
  name: string;
  specialty: string;
  medicalLicenseNumber: string;
  clinicAddress: string;
  phoneNumber: string;
  status: DoctorPatientStatusCode;
  createdAt: string;
}
