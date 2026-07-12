import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { AssignmentReportTable } from '@/features/admin/assignments/components/AssignmentReportTable';
import { useAssignmentReport } from '@/features/admin/assignments/hooks/useAssignmentReport';
import { getErrorMessage } from '@/utils/get-error-message';

export function AssignmentsPage() {
  const { t } = useTranslation();
  const { data: rows = [], isLoading, isError, error, refetch } = useAssignmentReport();

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.assignments.title')}
        description={t('admin.assignments.description')}
      />

      {isLoading ? <LoadingState tip={t('admin.assignments.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('admin.assignments.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.assignments.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? <AssignmentReportTable rows={rows} /> : null}
    </PageContainer>
  );
}
