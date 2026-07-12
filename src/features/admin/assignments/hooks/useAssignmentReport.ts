import { useQuery } from '@tanstack/react-query';

import { assignmentReportService } from '../services/assignmentReportService';
import { assignmentReportQueryKeys } from './assignment-report-query-keys';

export function useAssignmentReport() {
  return useQuery({
    queryKey: assignmentReportQueryKeys.report(),
    queryFn: () => assignmentReportService.getReport(),
  });
}
