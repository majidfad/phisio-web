export const assignmentReportQueryKeys = {
  all: ['admin', 'assignment-report'] as const,
  report: () => [...assignmentReportQueryKeys.all, 'report'] as const,
};
