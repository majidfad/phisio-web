import { Button, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppEmpty, AppTable, StatusCapsule } from '@/components/ui';
import { normalizeUserRole } from '@/features/auth/utils/normalize-user-role';
import type { ClinicDoctorMemberDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone } from '@/utils/persian-format';

interface ClinicDoctorsTableProps {
  doctors: ClinicDoctorMemberDto[];
  isRemoving?: boolean;
  removingDoctorId?: string | null;
  onView: (doctor: ClinicDoctorMemberDto) => void;
  onRemove: (doctor: ClinicDoctorMemberDto) => void;
}

export function ClinicDoctorsTable({
  doctors,
  isRemoving = false,
  removingDoctorId = null,
  onView,
  onRemove,
}: ClinicDoctorsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<ClinicDoctorMemberDto> = [
    {
      title: t('clinics.doctors.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string, doctor) => (
        <Space size={8} wrap>
          <bdi style={{ unicodeBidi: 'plaintext' }}>{name}</bdi>
          {doctor.isClinicManager ? (
            <StatusCapsule
              status="info"
              label={t('clinics.doctors.managerBadge')}
              showDot={false}
            />
          ) : null}
        </Space>
      ),
    },
    {
      title: t('clinics.doctors.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
    {
      title: t('clinics.doctors.columns.specialty'),
      dataIndex: 'specialty',
      key: 'specialty',
      ellipsis: true,
      render: (value: string) => value || t('clinics.notSet'),
    },
    {
      title: t('clinics.doctors.columns.role'),
      dataIndex: 'role',
      key: 'role',
      width: 140,
      render: (role: ClinicDoctorMemberDto['role']) => {
        const normalized = normalizeUserRole(role);
        if (normalized === 'ClinicManager') {
          return t('layout.roles.clinicManager');
        }

        if (normalized === 'Doctor') {
          return t('layout.roles.doctor');
        }

        return t('clinics.notSet');
      },
    },
    {
      title: t('clinics.doctors.columns.actions'),
      key: 'actions',
      width: 180,
      align: 'center',
      render: (_, doctor) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => onView(doctor)}>
            {t('clinics.doctors.view')}
          </Button>
          {doctor.isClinicManager ? (
            <Tooltip title={t('clinics.doctors.cannotRemoveManager')}>
              <span>
                <Button type="link" danger size="small" disabled>
                  {t('clinics.doctors.remove')}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              type="link"
              danger
              size="small"
              loading={isRemoving && removingDoctorId === doctor.doctorId}
              onClick={() => onRemove(doctor)}
            >
              {t('clinics.doctors.remove')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (doctors.length === 0) {
    return <AppEmpty description={t('clinics.doctors.empty')} />;
  }

  return (
    <AppTable
      rowKey="doctorId"
      columns={columns}
      dataSource={doctors}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
