import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppEmpty, AppTable } from '@/components/ui';
import {
  patientCareKey,
  type ClinicPatientTableRow,
} from '@/features/clinics/utils/clinic-patient-adherence';
import { formatDisplayPhone, formatPersianNumber } from '@/utils/persian-format';

interface ClinicPatientsTableProps {
  patients: ClinicPatientTableRow[];
  hideDoctorColumn?: boolean;
  showAdherenceColumn?: boolean;
}

function formatAssignedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export function ClinicPatientsTable({
  patients,
  hideDoctorColumn = false,
  showAdherenceColumn = false,
}: ClinicPatientsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<ClinicPatientTableRow> = [
    {
      title: t('clinics.patients.columns.name'),
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
      render: (name: string) => <bdi style={{ unicodeBidi: 'plaintext' }}>{name}</bdi>,
    },
    {
      title: t('clinics.patients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
    ...(hideDoctorColumn
      ? []
      : [
          {
            title: t('clinics.patients.columns.doctor'),
            dataIndex: 'doctorName',
            key: 'doctorName',
            ellipsis: true,
            render: (name: string) => <bdi style={{ unicodeBidi: 'plaintext' }}>{name}</bdi>,
          } satisfies ColumnsType<ClinicPatientTableRow>[number],
        ]),
    ...(showAdherenceColumn
      ? [
          {
            title: t('clinics.patients.columns.adherence'),
            dataIndex: 'adherencePercentage',
            key: 'adherencePercentage',
            width: 120,
            render: (value: number | null | undefined) =>
              value == null ? t('clinics.notSet') : `${formatPersianNumber(value)}%`,
          } satisfies ColumnsType<ClinicPatientTableRow>[number],
        ]
      : []),
    {
      title: t('clinics.patients.columns.assignedAt'),
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      width: 130,
      render: (value: string) => formatAssignedAt(value),
    },
  ];

  if (patients.length === 0) {
    return <AppEmpty description={t('clinics.patients.empty')} />;
  }

  return (
    <AppTable
      rowKey={(row) => patientCareKey(row)}
      columns={columns}
      dataSource={patients}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
