import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable, TableIconActions, AppEmpty } from '@/components/ui';
import type { PatientDto } from '@/features/admin/patients/types/patient';
import {
  formatPatientDate,
  getPatientCreatedAt,
} from '@/features/admin/patients/utils/format-patient-date';
import { formatDisplayPhone } from '@/utils/persian-format';

import { formatPatientDoctors } from '../utils/format-patient-doctors';

interface PatientsTableProps {
  patients: PatientDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingPatientId?: string | null;
  onEdit: (patient: PatientDto) => void;
  onDelete: (patient: PatientDto) => void;
  onActivate: (patient: PatientDto) => void;
}

export function PatientsTable({
  patients,
  showInactiveView,
  isActivating = false,
  activatingPatientId = null,
  onEdit,
  onDelete,
  onActivate,
}: PatientsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<PatientDto> = [
    {
      title: t('admin.patients.columns.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('admin.patients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
    {
      title: t('admin.patients.columns.doctors'),
      key: 'doctors',
      ellipsis: true,
      render: (_, patient) =>
        formatPatientDoctors(patient.doctorNames, t('admin.patients.noDoctors')),
    },
    {
      title: t('admin.patients.columns.createdAt'),
      key: 'createdAt',
      width: 130,
      render: (_, patient) => formatPatientDate(getPatientCreatedAt(patient)),
    },
    ...(showInactiveView
      ? [
          {
            title: t('admin.exercises.columns.status'),
            key: 'status',
            width: 110,
            render: () => <Tag>{t('admin.common.status.inactive')}</Tag>,
          } as ColumnsType<PatientDto>[number],
        ]
      : []),
    {
      title: t('admin.patients.columns.actions'),
      key: 'actions',
      width: 110,
      align: 'center',
      render: (_, patient) =>
        showInactiveView ? (
          <Button
            type="link"
            loading={isActivating && activatingPatientId === patient.id}
            onClick={() => onActivate(patient)}
          >
            {t('admin.common.actions.activate')}
          </Button>
        ) : (
          <TableIconActions
            editLabel={t('admin.patients.actions.edit')}
            deleteLabel={t('admin.patients.actions.delete')}
            onEdit={() => onEdit(patient)}
            onDelete={() => onDelete(patient)}
          />
        ),
    },
  ];

  if (patients.length === 0) {
    return (
      <AppEmpty
        description={t(showInactiveView ? 'admin.patients.emptyInactive' : 'admin.patients.empty')}
      />
    );
  }

  return (
    <AppTable
      rowKey="id"
      columns={columns}
      dataSource={patients}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
