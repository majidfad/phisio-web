import { DeleteOutlined, HistoryOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Button, Empty, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable } from '@/components/ui';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import { formatDisplayPhone } from '@/utils/persian-format';

interface DoctorPatientsTableProps {
  patients: DoctorPatientDto[];
  removingPatientId?: string | null;
  onRemove: (patient: DoctorPatientDto) => void;
  onOpenExercisePlan: (patient: DoctorPatientDto) => void;
  onOpenExerciseHistory: (patient: DoctorPatientDto) => void;
}

function formatAssignedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function DoctorPatientsTable({
  patients,
  removingPatientId = null,
  onRemove,
  onOpenExercisePlan,
  onOpenExerciseHistory,
}: DoctorPatientsTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<DoctorPatientDto> = [
    {
      title: t('doctor.patients.columns.name'),
      dataIndex: 'patientName',
      key: 'patientName',
      ellipsis: true,
    },
    {
      title: t('doctor.patients.columns.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => <span dir="ltr">{formatDisplayPhone(phone)}</span>,
    },
    {
      title: t('doctor.patients.columns.assignedAt'),
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      width: 130,
      render: (value: string) => formatAssignedAt(value),
    },
    {
      title: t('doctor.patients.columns.actions'),
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, patient) => (
        <Space size={4} className="table-icon-actions">
          <Tooltip title={t('doctor.patients.exercisePlan.open')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<MedicineBoxOutlined />}
              aria-label={t('doctor.patients.exercisePlan.open')}
              onClick={() => onOpenExercisePlan(patient)}
            />
          </Tooltip>
          <Tooltip title={t('doctor.patients.exerciseHistory.open')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<HistoryOutlined />}
              aria-label={t('doctor.patients.exerciseHistory.open')}
              onClick={() => onOpenExerciseHistory(patient)}
            />
          </Tooltip>
          <Tooltip title={t('doctor.patients.remove')}>
            <Button
              type="text"
              danger
              className="table-icon-actions__btn table-icon-actions__btn--delete"
              icon={<DeleteOutlined />}
              loading={removingPatientId === patient.patientId}
              aria-label={t('doctor.patients.remove')}
              onClick={() => onRemove(patient)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (patients.length === 0) {
    return <Empty description={t('doctor.patients.empty')} />;
  }

  return (
    <AppTable
      rowKey="patientId"
      columns={columns}
      dataSource={patients}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      size="middle"
    />
  );
}
