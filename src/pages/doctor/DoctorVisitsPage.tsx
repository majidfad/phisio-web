import { Search } from 'lucide-react';
import { Button, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppResult, AppTable, LoadingState, PageContainer } from '@/components/ui';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDoctorVisits } from '@/features/visits/hooks/usePatientVisits';
import type { PatientVisitDto } from '@/features/visits/types/patient-visit';
import { formatPersianDate, formatPersianNumber } from '@/utils/persian-format';
import { appIconProps } from '@/components/icons/app-icon';
import { getErrorMessage } from '@/utils/get-error-message';
import { AddPatientVisitModal } from '@/features/doctor/patients/components/AddPatientVisitModal';

export function DoctorVisitsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const doctorId = user?.userId ?? null;

  const [searchQuery, setSearchQuery] = useState('');
  const trimmedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addVisitOpen, setAddVisitOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useDoctorVisits(doctorId, {
    page,
    pageSize,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
  });

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.visits.title')}
        description={t('doctor.visits.description')}
        action={
          <Button type="primary" size="large" onClick={() => setAddVisitOpen(true)}>
            {t('doctor.patients.visits.addBtn')}
          </Button>
        }
      />

      <div className="patient-filter-bar">
        <Input
          size="large"
          allowClear
          prefix={<Search {...appIconProps} />}
          placeholder={t('doctor.visits.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? <LoadingState tip={t('doctor.visits.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('doctor.visits.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.visits.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <AppTable<PatientVisitDto>
          rowKey={(row) => row.visitId}
          dataSource={data?.visits ?? []}
          columns={[
            {
              title: t('patient.visits.columns.date'),
              dataIndex: 'visitAt',
              key: 'visitAt',
              width: 190,
              render: (value: string) => formatPersianDate(value),
            },
            {
              title: t('doctor.visits.columns.patient'),
              dataIndex: 'patientName',
              key: 'patientName',
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
              minWidth: 180,
              render: (notes: string | null) => notes ?? t('patient.visits.noNotes'),
            },
            {
              title: t('doctor.visits.columns.feedback'),
              key: 'feedback',
              width: 200,
              render: (_: unknown, row: PatientVisitDto) => {
                if (!row.feedback) {
                  return t('doctor.visits.feedback.none');
                }
                return t('patient.visits.feedback.summary', {
                  satisfaction: formatPersianNumber(row.feedback.satisfactionScore),
                  communication: formatPersianNumber(row.feedback.doctorCommunicationScore),
                });
              },
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

      <AddPatientVisitModal
        open={addVisitOpen}
        patient={null}
        onClose={() => setAddVisitOpen(false)}
      />
    </PageContainer>
  );
}
