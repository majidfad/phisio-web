import { History, LayoutDashboard, Stethoscope, Trash2 } from 'lucide-react';
import { Button, Grid, Space, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { AppTable, WarmEmptyState } from '@/components/ui';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text } = Typography;

interface DoctorPatientsTableProps {
  patients: DoctorPatientDto[];
  removingPatientId?: string | null;
  onRemove: (patient: DoctorPatientDto) => void;
  onOpenOverview: (patient: DoctorPatientDto) => void;
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
  onOpenOverview,
  onOpenExercisePlan,
  onOpenExerciseHistory,
}: DoctorPatientsTableProps) {
  const { t } = useTranslation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

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
      width: 200,
      align: 'center',
      render: (_, patient) => (
        <Space size={4} className="table-icon-actions">
          <Tooltip title={t('doctor.patients.overview.open')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<LayoutDashboard {...denseIconProps} />}
              aria-label={t('doctor.patients.overview.open')}
              onClick={() => onOpenOverview(patient)}
            />
          </Tooltip>
          <Tooltip title={t('doctor.patients.exercisePlan.open')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<Stethoscope {...denseIconProps} />}
              aria-label={t('doctor.patients.exercisePlan.open')}
              onClick={() => onOpenExercisePlan(patient)}
            />
          </Tooltip>
          <Tooltip title={t('doctor.patients.exerciseHistory.open')}>
            <Button
              type="text"
              className="table-icon-actions__btn table-icon-actions__btn--edit"
              icon={<History {...denseIconProps} />}
              aria-label={t('doctor.patients.exerciseHistory.open')}
              onClick={() => onOpenExerciseHistory(patient)}
            />
          </Tooltip>
          <Tooltip title={t('doctor.patients.remove')}>
            <Button
              type="text"
              danger
              className="table-icon-actions__btn table-icon-actions__btn--delete"
              icon={<Trash2 {...denseIconProps} />}
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
    return <WarmEmptyState description={t('doctor.patients.empty')} />;
  }

  if (isMobile) {
    return (
      <div className="patient-card-list" role="list">
        {patients.map((patient) => (
          <article key={patient.patientId} className="patient-card" role="listitem">
            <div className="patient-card__body">
              <Text strong className="patient-card__name">
                {patient.patientName}
              </Text>
              <Text type="secondary" dir="ltr" className="patient-card__meta">
                {formatDisplayPhone(patient.phoneNumber)}
              </Text>
              <Text type="secondary" className="patient-card__meta">
                {formatAssignedAt(patient.assignedAt)}
              </Text>
            </div>
            <div className="patient-card__actions">
              <Button size="small" onClick={() => onOpenOverview(patient)}>
                {t('doctor.patients.overview.open')}
              </Button>
              <Button size="small" type="primary" onClick={() => onOpenExercisePlan(patient)}>
                {t('doctor.patients.exercisePlan.open')}
              </Button>
              <Button size="small" onClick={() => onOpenExerciseHistory(patient)}>
                {t('doctor.patients.exerciseHistory.open')}
              </Button>
              <Button
                size="small"
                danger
                loading={removingPatientId === patient.patientId}
                onClick={() => onRemove(patient)}
              >
                {t('doctor.patients.remove')}
              </Button>
            </div>
          </article>
        ))}
      </div>
    );
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
