import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ChevronLeft, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppEmpty, AppTable } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import type { DoctorDashboardRecentPatientDto } from '@/features/doctor/dashboard/types/dashboard';
import { routes } from '@/routes/routes';
import { formatDisplayPhone } from '@/utils/persian-format';

interface RecentPatientsTableProps {
  patients: DoctorDashboardRecentPatientDto[];
}

export function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnsType<DoctorDashboardRecentPatientDto> = [
    {
      title: t('doctor.dashboard.recentPatients.columns.name'),
      dataIndex: 'patientName',
      key: 'patientName',
      minWidth: 160,
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--phisio-primary-soft)',
              color: 'var(--phisio-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={16} />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--phisio-text)' }}>{name}</span>
        </div>
      ),
    },
    {
      title: t('doctor.dashboard.recentPatients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => (
        <span dir="ltr" style={{ fontWeight: 600, color: 'var(--phisio-text-secondary)' }}>
          {formatDisplayPhone(phone)}
        </span>
      ),
    },
    {
      title: 'وضعیت درمان',
      key: 'status',
      width: 140,
      render: () => <StatusCapsule status="active" label="در حال درمان" />,
    },
    {
      title: 'عملیات',
      key: 'actions',
      width: 120,
      render: () => (
        <Button
          type="link"
          size="small"
          icon={<ChevronLeft size={14} />}
          style={{ fontWeight: 600, paddingInline: 0 }}
          onClick={() => void navigate(routes.doctor.patients)}
        >
          مدیریت
        </Button>
      ),
    },
  ];

  if (patients.length === 0) {
    return <AppEmpty description={t('doctor.dashboard.emptyPatients')} />;
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
