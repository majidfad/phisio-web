import { httpClient } from '@/api/http-client';

import type { AssignmentReportDto } from '../types/assignment-report';

const ASSIGNMENTS_BASE = '/admin/assignments';

export const assignmentReportService = {
  async getReport(): Promise<AssignmentReportDto[]> {
    const { data } = await httpClient.get<AssignmentReportDto[]>(`${ASSIGNMENTS_BASE}/report`);
    return data;
  },
};
