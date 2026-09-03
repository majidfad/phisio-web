import {
  ConfirmActionModal,
  LoadingState,
  AppResult,
  PageSection,
  StatusCapsule,
} from '@/components/ui';
import { Button, Card, Drawer } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseAssignmentWizard } from '@/features/doctor/patients/components/ExerciseAssignmentWizard';
import { PatientExerciseStatsPanel } from '@/features/doctor/patients/components/PatientExerciseStatsPanel';
import { AddPatientVisitModal } from '@/features/doctor/patients/components/AddPatientVisitModal';
import {
  useDeletePatientProgram,
  usePatientOverview,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import { usePatientMostRecentVisit } from '@/features/visits/hooks/usePatientVisits';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import {
  daysFromMask,
  ExerciseProgramCadenceType,
  type ExerciseProgramDto,
} from '@/features/doctor/patients/types/exercise-program';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import {
  formatDisplayPhone,
  formatPersianCalendarDateLong,
  formatPersianDate,
} from '@/utils/persian-format';

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
  } = usePatientOverview(patient?.patientId ?? null, patient?.clinicId);
  const deleteProgram = useDeletePatientProgram(patient?.patientId ?? '', patient?.clinicId);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ExerciseProgramDto | null>(null);
  const [programToRemove, setProgramToRemove] = useState<ExerciseProgramDto | null>(null);
  const [visitAddOpen, setVisitAddOpen] = useState(false);

  const recentVisitQuery = usePatientMostRecentVisit(patient?.patientId ?? null, {
    clinicId: patient?.clinicId,
  });

  const describeCadence = (program: ExerciseProgramDto) => {
    if (program.cadenceType === ExerciseProgramCadenceType.Interval) {
      return t('doctor.patients.overview.cadenceInterval', { count: program.intervalDays ?? 1 });
    }
    const days = daysFromMask(program.daysOfWeekMask)
      .map((day) => t(`doctor.patients.exercisePlan.wizard.weekdays.${day}`))
      .join('، ');
    return t('doctor.patients.overview.cadenceDays', { days });
  };

  const handleRemoveProgramConfirm = async () => {
    if (!programToRemove) {
      return;
    }

    try {
      await deleteProgram.mutateAsync(programToRemove.programId);
      toast.success(t('doctor.patients.overview.removeProgramSuccess'));
      setProgramToRemove(null);
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
              <Button type="primary" size="large" onClick={() => void refetch()}>
                {t('doctor.patients.retry')}
              </Button>
            }
          />
        ) : null}

        {overview ? (
          <div className="patient-stack patient-stack--loose">
            <Card className="patient-media-card" size="small">
              <h3 className="patient-media-card__title">
                {t('doctor.patients.overview.demographics')}
              </h3>
              <p className="patient-media-card__body patient-media-card__body--emphasis">
                {overview.patientName}
              </p>
              <span className="patient-media-card__meta" dir="ltr">
                {formatDisplayPhone(overview.phoneNumber)}
              </span>
              <span className="patient-media-card__meta">
                {t('doctor.patients.overview.linkedAt', {
                  date: formatDateTime(overview.linkedAt),
                })}
              </span>
              <span className="patient-media-card__meta">
                {t('doctor.patients.overview.registeredAt', {
                  date: formatDateTime(overview.patientRegisteredAt),
                })}
              </span>
            </Card>

            <Card className="patient-media-card" size="small">
              <h3 className="patient-media-card__title">{t('doctor.patients.overview.stats')}</h3>
              <div className="exercise-row__chips doctor-overview__chips">
                <StatusCapsule
                  status="info"
                  showDot={false}
                  label={t('doctor.patients.overview.assigned', {
                    count: overview.summary.assignedExerciseCount,
                  })}
                />
                <StatusCapsule
                  status="active"
                  showDot={false}
                  label={t('doctor.patients.overview.completedDays', {
                    count: overview.summary.completedDaysCount,
                  })}
                />
                <StatusCapsule
                  status="pending"
                  showDot={false}
                  label={t('doctor.patients.overview.missedDays', {
                    count: overview.summary.missedDaysCount,
                  })}
                />
                <StatusCapsule
                  status="completed"
                  showDot={false}
                  label={t('doctor.patients.overview.adherence', {
                    percent: overview.summary.adherencePercentage,
                  })}
                />
                <StatusCapsule
                  status="info"
                  showDot={false}
                  label={t('doctor.patients.overview.todayCount', {
                    count: overview.activeExerciseCountToday,
                  })}
                />
              </div>
            </Card>

            <Card className="patient-media-card" size="small">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <h3 className="patient-media-card__title">
                  {t('doctor.patients.visits.recentTitle')}
                </h3>
                <Button type="primary" size="small" onClick={() => setVisitAddOpen(true)}>
                  {t('doctor.patients.visits.addBtn')}
                </Button>
              </div>

              {recentVisitQuery.isLoading ? (
                <LoadingState tip={t('doctor.patients.visits.loading')} />
              ) : recentVisitQuery.data ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                  <span className="patient-media-card__meta">
                    {t('doctor.patients.visits.when', {
                      value: formatPersianDate(recentVisitQuery.data.visitAt),
                    })}
                  </span>
                  <span className="patient-media-card__meta">
                    {t('doctor.patients.visits.doctorClinic', {
                      doctor: recentVisitQuery.data.doctorName,
                      clinic: recentVisitQuery.data.clinicName,
                    })}
                  </span>
                  {recentVisitQuery.data.doctorNotes ? (
                    <span
                      className="patient-media-card__meta"
                      style={{ maxHeight: 48, overflow: 'hidden' }}
                      title={recentVisitQuery.data.doctorNotes}
                    >
                      {recentVisitQuery.data.doctorNotes}
                    </span>
                  ) : (
                    <span className="patient-media-card__meta">
                      {t('doctor.patients.visits.noNotes')}
                    </span>
                  )}
                </div>
              ) : (
                <p className="patient-media-card__meta" style={{ marginTop: 10 }}>
                  {t('doctor.patients.visits.empty')}
                </p>
              )}
            </Card>

            <Card className="patient-media-card" size="small">
              <PatientExerciseStatsPanel
                patientId={overview.patientId}
                clinicId={patient?.clinicId}
                variant="overview"
              />
            </Card>

            <PageSection
              title={t('doctor.patients.overview.programs')}
              action={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setEditingProgram(null);
                    setWizardOpen(true);
                  }}
                >
                  {t('doctor.patients.overview.newProgram')}
                </Button>
              }
            >
              {overview.programs.length === 0 ? (
                <p className="patient-media-card__meta">
                  {t('doctor.patients.overview.noPrograms')}
                </p>
              ) : (
                <div className="patient-stack">
                  {overview.programs.map((program) => (
                    <Card key={program.programId} className="patient-media-card" size="small">
                      <h3 className="patient-media-card__title">
                        {formatPersianCalendarDateLong(program.startDate)} →{' '}
                        {formatPersianCalendarDateLong(program.endDate)}
                      </h3>
                      <span className="patient-media-card__meta">{describeCadence(program)}</span>
                      <span className="patient-media-card__meta">
                        {t('doctor.patients.overview.programCounts', {
                          upcoming: program.upcomingAssignmentCount,
                          past: program.pastAssignmentCount,
                          exercises: program.exercises.length,
                        })}
                      </span>
                      <div className="exercise-row__chips doctor-overview__chips">
                        {program.exercises.map((exercise) => (
                          <span key={exercise.exerciseId} className="exercise-meta-chip">
                            {exercise.exerciseName}
                          </span>
                        ))}
                      </div>
                      <div className="patient-media-card__actions">
                        <Button
                          onClick={() => {
                            setEditingProgram(program);
                            setWizardOpen(true);
                          }}
                        >
                          {t('doctor.patients.overview.editProgram')}
                        </Button>
                        <Button danger onClick={() => setProgramToRemove(program)}>
                          {t('doctor.patients.overview.removeProgram')}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </PageSection>
          </div>
        ) : null}
      </Drawer>

      <ConfirmActionModal
        open={programToRemove !== null}
        title={t('doctor.patients.overview.removeProgramConfirmTitle')}
        message={t('doctor.patients.overview.removeProgramConfirm')}
        confirmText={t('doctor.patients.overview.removeProgram')}
        cancelText={t('auth.changePassword.cancel')}
        confirming={deleteProgram.isPending}
        onCancel={() => setProgramToRemove(null)}
        onConfirm={() => void handleRemoveProgramConfirm()}
      />

      <AddPatientVisitModal
        open={visitAddOpen}
        patient={patient}
        onClose={() => setVisitAddOpen(false)}
      />

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
