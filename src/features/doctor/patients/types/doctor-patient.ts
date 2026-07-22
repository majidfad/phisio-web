export interface DoctorPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  assignedAt: string;
}

export interface DoctorPatientRequestDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  requestedAt: string;
}
