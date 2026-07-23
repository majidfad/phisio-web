import { LoadingState, AppResult } from '@/components/ui';
import { Button, Card, Drawer, Popconfirm, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseAssignmentWizard } from '@/features/doctor/patients/components/ExerciseAssignmentWizard';
import { PatientExerciseStatsPanel } from '@/features/doctor/patients/components/PatientExerciseStatsPanel';
import {
  useDeletePatientProgram,
  usePatientOverview,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import {
  daysFromMask,
  ExerciseProgramCadenceType,
  type ExerciseProgramDto,
} from '@/features/doctor/patients/types/exercise-program';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatDisplayPhone, formatPersianCalendarDateLong } from '@/utils/persian-format';

const { Text, Title } = Typography;

interface PatientOverviewDrawerProps {
  patient: DoctorPatientDto | null;
  onClose: () => void;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function PatientOverviewDrawer({ patient, onClose }: PatientOverviewDrawerProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    data: overview,
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientOverview(patient?.patientId ?? null);
  const deleteProgram = useDeletePatientProgram(patient?.patientId ?? '');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ExerciseProgramDto | null>(null);

  const describeCadence = (program: ExerciseProgramDto) => {
    if (program.cadenceType === ExerciseProgramCadenceType.Interval) {
      return t('doctor.patients.overview.cadenceInterval', { count: program.intervalDays ?? 1 });
    }
    const days = daysFromMask(program.daysOfWeekMask)
      .map((day) => t(`doctor.patients.exercisePlan.wizard.weekdays.${day}`))
      .join('، ');
    return t('doctor.patients.overview.cadenceDays', { days });
  };

  const handleRemoveProgram = async (programId: string) => {
    try {
      await deleteProgram.mutateAsync(programId);
      toast.success(t('doctor.patients.overview.removeProgramSuccess'));
    } catch (err) {
      toast.error(getErrorMessage(err, t('doctor.patients.overview.removeProgramFailed')));
    }
  };

  return (
    <>
      <Drawer
        open={Boolean(patient)}
        onClose={onClose}
        width={640}
        title={patient?.patientName ?? t('doctor.patients.overview.title')}
        destroyOnHidden
      >
        {isLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}
        {isError ? (
          <AppResult
            status="error"
            title={getErrorMessage(error, t('doctor.patients.overview.loadFailed'))}
            extra={
              <Button type="primary" onClick={() => void refetch()}>
                {t('doctor.patients.retry')}
              </Button>
            }
          />
        ) : null}

        {overview ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card size="small">
              <Title level={5} style={{ marginTop: 0 }}>
                {t('doctor.patients.overview.demographics')}
              </Title>
              <Text style={{ display: 'block' }}>{overview.patientName}</Text>
              <Text type="secondary" style={{ display: 'block' }} dir="ltr">
                {formatDisplayPhone(overview.phoneNumber)}
              </Text>
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                {t('doctor.patients.overview.linkedAt', {
                  date: formatDateTime(overview.linkedAt),
                })}
              </Text>
              <Text type="secondary" style={{ display: 'block' }}>
                {t('doctor.patients.overview.registeredAt', {
                  date: formatDateTime(overview.patientRegisteredAt),
                })}
              </Text>
            </Card>

            <Card size="small">
              <Title level={5} style={{ marginTop: 0 }}>
                {t('doctor.patients.overview.stats')}
              </Title>
              <Space wrap>
                <Tag>
                  {t('doctor.patients.overview.assigned', {
                    count: overview.summary.assignedExerciseCount,
                  })}
                </Tag>
                <Tag color="success">
                  {t('doctor.patients.overview.completedDays', {
                    count: overview.summary.completedDaysCount,
                  })}
                </Tag>
                <Tag color="warning">
                  {t('doctor.patients.overview.missedDays', {
                    count: overview.summary.missedDaysCount,
                  })}
                </Tag>
                <Tag color="blue">
                  {t('doctor.patients.overview.adherence', {
                    percent: overview.summary.adherencePercentage,
                  })}
                </Tag>
                <Tag>
                  {t('doctor.patients.overview.todayCount', {
                    count: overview.activeExerciseCountToday,
                  })}
                </Tag>
              </Space>
            </Card>

            <Card size="small">
              <PatientExerciseStatsPanel patientId={overview.patientId} variant="overview" />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0 }}>
                {t('doctor.patients.overview.programs')}
              </Title>
              <Button
                type="primary"
                onClick={() => {
                  setEditingProgram(null);
                  setWizardOpen(true);
                }}
              >
                {t('doctor.patients.overview.newProgram')}
              </Button>
            </div>

            {overview.programs.length === 0 ? (
              <Text type="secondary">{t('doctor.patients.overview.noPrograms')}</Text>
            ) : (
              overview.programs.map((program) => (
                <Card key={program.programId} size="small">
                  <Text strong style={{ display: 'block' }}>
                    {formatPersianCalendarDateLong(program.startDate)} →{' '}
                    {formatPersianCalendarDateLong(program.endDate)}
                  </Text>
                  <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    {describeCadence(program)}
                  </Text>
                  <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    {t('doctor.patients.overview.programCounts', {
                      upcoming: program.upcomingAssignmentCount,
                      past: program.pastAssignmentCount,
                      exercises: program.exercises.length,
                    })}
                  </Text>
                  <Space wrap style={{ marginTop: 8 }}>
                    {program.exercises.map((exercise) => (
                      <Tag key={exercise.exerciseId}>{exercise.exerciseName}</Tag>
                    ))}
                  </Space>
                  <Space style={{ marginTop: 12 }}>
                    <Button
                      onClick={() => {
                        setEditingProgram(program);
                        setWizardOpen(true);
                      }}
                    >
                      {t('doctor.patients.overview.editProgram')}
                    </Button>
                    <Popconfirm
                      title={t('doctor.patients.overview.removeProgramConfirmTitle')}
                      description={t('doctor.patients.overview.removeProgramConfirm')}
                      okText={t('doctor.patients.overview.removeProgram')}
                      cancelText={t('auth.changePassword.cancel')}
                      okButtonProps={{ danger: true, loading: deleteProgram.isPending }}
                      onConfirm={() => void handleRemoveProgram(program.programId)}
                    >
                      <Button danger>{t('doctor.patients.overview.removeProgram')}</Button>
                    </Popconfirm>
                  </Space>
                </Card>
              ))
            )}
          </Space>
        ) : null}
      </Drawer>

      {patient ? (
        <ExerciseAssignmentWizard
          patient={wizardOpen ? patient : null}
          editingProgram={editingProgram}
          onClose={() => {
            setWizardOpen(false);
            setEditingProgram(null);
          }}
          onSuccess={() => {
            toast.success(t('doctor.patients.exercisePlan.wizard.success'));
            void refetch();
          }}
        />
      ) : null}
    </>
  );
}
