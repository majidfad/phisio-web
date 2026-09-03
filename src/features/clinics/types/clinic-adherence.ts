export interface ClinicAdherencePeriodDto {
  from: string;
  to: string;
  scheduledDays: number;
  completedDays: number;
  missedDays: number;
  adherencePercentage: number;
}

export interface ClinicPatientAdherenceDto {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledDays: number;
  completedDays: number;
  adherencePercentage: number;
}

export interface ClinicAdherenceResponse {
  today: ClinicAdherencePeriodDto;
  last7Days: ClinicAdherencePeriodDto;
  last30Days: ClinicAdherencePeriodDto;
  patients: ClinicPatientAdherenceDto[];
}
