import { Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable } from '@/components/ui';

import type { DoctorDashboardRecentPatientDto } from '@/features/doctor/dashboard/types/dashboard';
import { formatDisplayPhone } from '@/utils/persian-format';

interface RecentPatientsTableProps {
  patients: DoctorDashboardRecentPatientDto[];
}

export function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<DoctorDashboardRecentPatientDto> = [
    {
      title: t('doctor.dashboard.recentPatients.columns.name'),
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: t('doctor.dashboard.recentPatients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
  ];

  if (patients.length === 0) {
    return <Empty description={t('doctor.dashboard.emptyPatients')} />;
  }

  return (
    <AppTable
      rowKey="patientId"
      columns={columns}
      dataSource={patients}
      pagination={false}
      size="middle"
    />
  );
}
