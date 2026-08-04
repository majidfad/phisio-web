import { Button, Grid } from 'antd';
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

const TABLE_SCROLL_X = 620;

function PatientAvatar() {
  return (
    <div className="patient-avatar" aria-hidden="true">
      <User size={16} />
    </div>
  );
}

export function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const openPatients = () => {
    void navigate(routes.doctor.patients);
  };

  const columns: ColumnsType<DoctorDashboardRecentPatientDto> = [
    {
      title: t('doctor.dashboard.recentPatients.columns.name'),
      dataIndex: 'patientName',
      key: 'patientName',
      width: 200,
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PatientAvatar />
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
      title: t('doctor.dashboard.recentPatients.columns.status'),
      key: 'status',
      width: 150,
      render: () => (
        <StatusCapsule status="active" label={t('doctor.dashboard.recentPatients.statusActive')} />
      ),
    },
    {
      title: t('doctor.dashboard.recentPatients.columns.actions'),
      key: 'actions',
      width: 120,
      render: () => (
        <Button
          type="link"
          size="small"
          icon={<ChevronLeft size={14} />}
          style={{ fontWeight: 600, paddingInline: 0 }}
          onClick={openPatients}
        >
          {t('doctor.dashboard.recentPatients.manage')}
        </Button>
      ),
    },
  ];

  if (patients.length === 0) {
    return <AppEmpty description={t('doctor.dashboard.emptyPatients')} />;
  }

  if (isMobile) {
    return (
      <div className="patient-card-list">
        {patients.map((patient) => (
          <button
            key={patient.patientId}
            type="button"
            className="patient-card patient-card--tap"
            onClick={openPatients}
          >
            <div className="patient-card__header">
              <PatientAvatar />
              <div className="patient-card__identity">
                <span className="patient-card__name">{patient.patientName}</span>
                <span className="patient-card__meta" dir="ltr">
                  {formatDisplayPhone(patient.phoneNumber)}
                </span>
              </div>
              <ChevronLeft size={18} className="patient-card__chevron" aria-hidden />
            </div>
            <StatusCapsule
              status="active"
              label={t('doctor.dashboard.recentPatients.statusActive')}
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <AppTable
      rowKey="patientId"
      columns={columns}
      dataSource={patients}
      pagination={false}
      size="middle"
      scroll={{ x: TABLE_SCROLL_X }}
    />
  );
}
