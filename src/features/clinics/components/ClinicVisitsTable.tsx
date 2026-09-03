import { Search } from 'lucide-react';
import { Button, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { AppResult, AppTable, LoadingState } from '@/components/ui';
import { useClinicVisits } from '@/features/visits/hooks/usePatientVisits';
import type {
  PatientCondition,
  PatientVisitDto,
  VisitType,
} from '@/features/visits/types/patient-visit';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianDate, formatPersianNumber } from '@/utils/persian-format';

interface ClinicVisitsTableProps {
  clinicId: string | undefined;
}

function visitTypeLabelKey(value: VisitType | null): string | null {
  switch (value) {
    case 1:
      return 'visitType.initial';
    case 2:
      return 'visitType.followUp';
    case 3:
      return 'visitType.emergency';
    case 4:
      return 'visitType.discharge';
    default:
      return null;
  }
}

function patientConditionLabelKey(value: PatientCondition | null): string | null {
  switch (value) {
    case 1:
      return 'patientCondition.improved';
    case 2:
      return 'patientCondition.unchanged';
    case 3:
      return 'patientCondition.worsened';
    default:
      return null;
  }
}

export function ClinicVisitsTable({ clinicId }: ClinicVisitsTableProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const trimmedSearch = useMemo(() => searchQuery.trim(), [searchQuery]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, refetch } = useClinicVisits(clinicId, {
    page,
    pageSize,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
  });

  return (
    <div className="patient-stack patient-stack--loose">
      <div className="patient-filter-bar">
        <Input
          size="large"
          allowClear
          prefix={<Search {...appIconProps} />}
          placeholder={t('clinics.visits.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? <LoadingState tip={t('clinics.visits.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('clinics.visits.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('clinics.retry')}
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
              title: t('clinics.visits.columns.date'),
              dataIndex: 'visitAt',
              key: 'visitAt',
              width: 190,
              render: (value: string) => formatPersianDate(value),
            },
            {
              title: t('clinics.visits.columns.patient'),
              dataIndex: 'patientName',
              key: 'patientName',
              ellipsis: true,
              minWidth: 150,
            },
            {
              title: t('clinics.visits.columns.doctor'),
              dataIndex: 'doctorName',
              key: 'doctorName',
              ellipsis: true,
              minWidth: 150,
            },
            {
              title: t('clinics.visits.columns.visitType'),
              dataIndex: 'visitType',
              key: 'visitType',
              width: 140,
              render: (value: VisitType | null) => {
                const key = visitTypeLabelKey(value);
                return key ? t(key) : t('clinics.notSet');
              },
            },
            {
              title: t('clinics.visits.columns.patientCondition'),
              dataIndex: 'patientCondition',
              key: 'patientCondition',
              width: 150,
              render: (value: PatientCondition | null) => {
                const key = patientConditionLabelKey(value);
                return key ? t(key) : t('clinics.notSet');
              },
            },
            {
              title: t('clinics.visits.columns.notes'),
              dataIndex: 'doctorNotes',
              key: 'doctorNotes',
              ellipsis: true,
              minWidth: 160,
              render: (notes: string | null) => notes ?? t('clinics.visits.noNotes'),
            },
            {
              title: t('clinics.visits.columns.feedback'),
              key: 'feedback',
              width: 200,
              render: (_: unknown, row: PatientVisitDto) => {
                if (!row.feedback) {
                  return t('clinics.visits.feedback.none');
                }
                return t('patient.visits.feedback.summary', {
                  satisfaction: formatPersianNumber(row.feedback.satisfactionScore),
                  communication: formatPersianNumber(row.feedback.doctorCommunicationScore),
                });
              },
            },
          ]}
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
    </div>
  );
}
