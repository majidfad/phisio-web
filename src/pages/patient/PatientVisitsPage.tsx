import { Search } from 'lucide-react';
import { Button, Input, Space } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppResult, AppTable, LoadingState, PageContainer } from '@/components/ui';
import { PageHeader } from '@/components/PageHeader';
import { useMyPatientVisits } from '@/features/visits/hooks/usePatientVisits';
import type { PatientVisitDto } from '@/features/visits/types/patient-visit';
import { formatPersianDate } from '@/utils/persian-format';
import { appIconProps } from '@/components/icons/app-icon';
import { getErrorMessage } from '@/utils/get-error-message';

export function PatientVisitsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const trimmedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, refetch } = useMyPatientVisits({
    page,
    pageSize,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
  });

  const visits = data?.visits ?? [];

  return (
    <PageContainer>
      <PageHeader title={t('patient.visits.title')} description={t('patient.visits.description')} />

      <div className="patient-filter-bar">
        <Input
          size="large"
          allowClear
          prefix={<Search {...appIconProps} />}
          placeholder={t('patient.visits.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Space>
          <Button type="primary" onClick={() => void refetch()} loading={isLoading}>
            {t('patient.visits.retry')}
          </Button>
        </Space>
      </div>

      {isLoading ? <LoadingState tip={t('patient.visits.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('patient.visits.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.visits.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <AppTable<PatientVisitDto>
          rowKey={(row) => row.visitId}
          dataSource={visits}
          columns={[
            {
              title: t('patient.visits.columns.date'),
              dataIndex: 'visitAt',
              key: 'visitAt',
              width: 190,
              render: (value: string) => formatPersianDate(value),
            },
            {
              title: t('patient.visits.columns.doctor'),
              dataIndex: 'doctorName',
              key: 'doctorName',
              ellipsis: true,
              minWidth: 150,
            },
            {
              title: t('patient.visits.columns.clinic'),
              dataIndex: 'clinicName',
              key: 'clinicName',
              ellipsis: true,
              minWidth: 160,
            },
            {
              title: t('patient.visits.columns.notes'),
              dataIndex: 'doctorNotes',
              key: 'doctorNotes',
              ellipsis: true,
              minWidth: 220,
              render: (notes: string | null) => notes ?? t('patient.visits.noNotes'),
            },
          ]}
          loading={false}
          pagination={{
            current: page,
            pageSize,
            total: data?.totalVisits ?? 0,
            showSizeChanger: true,
          }}
          onChange={(pagination) => {
            setPage(pagination.current ?? 1);
            setPageSize(pagination.pageSize ?? 10);
          }}
          size="middle"
        />
      ) : null}
    </PageContainer>
  );
}
