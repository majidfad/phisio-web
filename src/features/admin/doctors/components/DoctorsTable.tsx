import { Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable, TableIconActions, AppEmpty } from '@/components/ui';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';
import { formatDisplayPhone } from '@/utils/persian-format';

import { formatDoctorDate, getDoctorCreatedAt } from '../utils/format-doctor-date';

interface DoctorsTableProps {
  doctors: DoctorDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingDoctorId?: string | null;
  isDeactivating?: boolean;
  deactivatingDoctorId?: string | null;
  onEdit: (doctor: DoctorDto) => void;
  onDelete: (doctor: DoctorDto) => void;
  onActivate: (doctor: DoctorDto) => void;
  onDeactivate: (doctor: DoctorDto) => void;
}

export function DoctorsTable({
  doctors,
  showInactiveView,
  isActivating = false,
  activatingDoctorId = null,
  isDeactivating = false,
  deactivatingDoctorId = null,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}: DoctorsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<DoctorDto> = [
    {
      title: t('admin.doctors.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('admin.doctors.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
    {
      title: t('admin.doctors.columns.specialty'),
      dataIndex: 'specialty',
      key: 'specialty',
      ellipsis: true,
      render: (v: string) => v || t('admin.doctors.notSet'),
    },
    {
      title: t('admin.doctors.columns.license'),
      dataIndex: 'medicalLicenseNumber',
      key: 'license',
      width: 130,
      render: (v: string) => v || t('admin.doctors.notSet'),
    },
    {
      title: t('admin.doctors.columns.address'),
      dataIndex: 'clinicAddress',
      key: 'address',
      ellipsis: true,
      render: (v: string) => v || t('admin.doctors.notSet'),
    },
    {
      title: t('admin.doctors.columns.createdAt'),
      key: 'createdAt',
      width: 130,
      render: (_, doctor) => formatDoctorDate(getDoctorCreatedAt(doctor)),
    },
    ...(showInactiveView
      ? [
          {
            title: t('admin.exercises.columns.status'),
            key: 'status',
            width: 130,
            render: () => <Tag color="warning">{t('admin.common.status.pending')}</Tag>,
          } as ColumnsType<DoctorDto>[number],
        ]
      : []),
    {
      title: t('admin.doctors.columns.actions'),
      key: 'actions',
      width: 170,
      align: 'center',
      render: (_, doctor) =>
        showInactiveView ? (
          <Button
            type="link"
            loading={isActivating && activatingDoctorId === doctor.id}
            onClick={() => onActivate(doctor)}
          >
            {t('admin.common.actions.activate')}
          </Button>
        ) : (
          <Space size={0}>
            <Button
              type="link"
              danger
              size="small"
              loading={isDeactivating && deactivatingDoctorId === doctor.id}
              onClick={() => onDeactivate(doctor)}
            >
              {t('admin.common.actions.deactivate')}
            </Button>
            <TableIconActions
              editLabel={t('admin.doctors.actions.edit')}
              deleteLabel={t('admin.doctors.actions.delete')}
              onEdit={() => onEdit(doctor)}
              onDelete={() => onDelete(doctor)}
            />
          </Space>
        ),
    },
  ];

  if (doctors.length === 0) {
    return (
      <AppEmpty
        description={t(showInactiveView ? 'admin.doctors.emptyInactive' : 'admin.doctors.empty')}
      />
    );
  }

  return (
    <AppTable
      rowKey="id"
      columns={columns}
      dataSource={doctors}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
