export interface DoctorDashboardRecentPatientDto {
  patientId: string;
  patientName: string;
  phoneNumber: string;
  clinicId: string;
  clinicName: string;
}

export interface DoctorDashboardDto {
  patientsCount: number;
  pendingRequestsCount: number;
  assignedExercisesCount: number;
  completedExercisesCount: number;
  feedbackCount: number;
  recentPatients: DoctorDashboardRecentPatientDto[];
}

export interface DoctorDashboardSummaryItem {
  id: string;
  labelKey: string;
  valueKey: keyof Pick<
    DoctorDashboardDto,
    | 'patientsCount'
    | 'pendingRequestsCount'
    | 'assignedExercisesCount'
    | 'completedExercisesCount'
    | 'feedbackCount'
  >;
  to: string;
}

export interface DoctorDashboardNavItem {
  id: string;
  labelKey: string;
  to: string;
}
