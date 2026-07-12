export interface DoctorPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  assignedAt: string;
}

export interface AddDoctorPatientRequest {
  phoneNumber: string;
}
