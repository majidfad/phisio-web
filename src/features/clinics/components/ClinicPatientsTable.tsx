import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppEmpty, AppTable } from '@/components/ui';
import type { ClinicPatientDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone } from '@/utils/persian-format';

interface ClinicPatientsTableProps {
  patients: ClinicPatientDto[];
  hideDoctorColumn?: boolean;
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
}: ClinicPatientsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<ClinicPatientDto> = [
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
          } satisfies ColumnsType<ClinicPatientDto>[number],
        ]),
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
      rowKey={(row) => `${row.patientId}-${row.doctorId}-${row.clinicId}`}
      columns={columns}
      dataSource={patients}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
