export interface DoctorDashboardRecentPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
}

export interface DoctorDashboardDto {
  patientsCount: number;
  recentPatients: DoctorDashboardRecentPatientDto[];
}

export interface DoctorDashboardSummaryItem {
  id: string;
  labelKey: string;
  valueKey: keyof Pick<DoctorDashboardDto, 'patientsCount'>;
  to: string;
}

export interface DoctorDashboardNavItem {
  id: string;
  labelKey: string;
  to: string;
}
