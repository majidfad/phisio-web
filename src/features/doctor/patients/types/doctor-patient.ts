export interface DoctorPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  assignedAt: string;
  clinicId: string;
  clinicName: string;
}

export interface DoctorPatientRequestDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  requestedAt: string;
  clinicId: string;
  clinicName: string;
}

export interface DoctorPatientClinicActionRequest {
  patientId: string;
  clinicId: string;
}

export interface DoctorClinicOptionDto {
  clinicId: string;
  name: string;
  address: string;
  activePatientCount: number;
  pendingRequestCount: number;
}

export interface DoctorPatientLookupDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
}

export interface AddDoctorPatientRequest {
  patientId: string;
  clinicId: string;
}
