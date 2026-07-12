export interface DashboardSummaryItem {
  id: string;
  labelKey: string;
  valueKey: keyof AdminDashboardStatsDto;
  to: string;
}

export interface DashboardNavItem {
  id: string;
  labelKey: string;
  to: string;
}

export interface AdminDashboardStatsDto {
  doctorCount: number;
  patientCount: number;
  exerciseCount: number;
}
