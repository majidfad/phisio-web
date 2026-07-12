import { Alert, Button, Modal, Result, Space, Spin, Steps, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseSelectionList } from '@/features/doctor/patients/components/ExerciseSelectionList';
import { JalaliCalendarPicker } from '@/features/doctor/patients/components/JalaliCalendarPicker';
import {
  useAssignPatientExercises,
  useExerciseCatalog,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getErrorMessage } from '@/utils/get-error-message';
import { sortIsoDatesAsc } from '@/utils/jalali-calendar';
import { formatPersianCalendarDateLong } from '@/utils/persian-format';

const { Text } = Typography;

interface ExerciseAssignmentWizardProps {
  patient: DoctorPatientDto | null;
  onClose: () => void;
  onSuccess?: () => void;
}

type WizardStep = 1 | 2 | 3;

export function ExerciseAssignmentWizard({
  patient,
  onClose,
  onSuccess,
}: ExerciseAssignmentWizardProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);

  const isOpen = Boolean(patient);
  const { data: exercises = [], isLoading, isError, error, refetch } = useExerciseCatalog(isOpen);
  const assignExercises = useAssignPatientExercises(patient?.patientId ?? '');

  const selectedExercises = useMemo(
    () => exercises.filter((exercise) => selectedExerciseIds.has(exercise.exerciseId)),
    [exercises, selectedExerciseIds],
  );

  const sortedSelectedDates = sortIsoDatesAsc(selectedDates);

  const handleToggleExercise = (exerciseId: string, checked: boolean) => {
    setFormError(null);
    setSelectedExerciseIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(exerciseId);
      } else {
        next.delete(exerciseId);
      }
      return next;
    });
  };

  const handleClose = () => {
    if (assignExercises.isPending) {
      return;
    }

    setStep(1);
    setSelectedDates([]);
    setSelectedExerciseIds(new Set());
    setFormError(null);
    onClose();
  };

  const goToNextStep = () => {
    setFormError(null);

    if (step === 1 && selectedDates.length === 0) {
      setFormError(t('doctor.patients.exercisePlan.wizard.errors.noDatesSelected'));
      return;
    }

    if (step === 2 && selectedExerciseIds.size === 0) {
      setFormError(t('doctor.patients.exercisePlan.wizard.errors.noExercisesSelected'));
      return;
    }

    setStep((current) => (current === 3 ? 3 : ((current + 1) as WizardStep)));
  };

  const goToPreviousStep = () => {
    setFormError(null);
    setStep((current) => (current === 1 ? 1 : ((current - 1) as WizardStep)));
  };

  const handleConfirm = async () => {
    setFormError(null);

    try {
      await assignExercises.mutateAsync({
        exerciseIds: [...selectedExerciseIds],
        scheduledDates: sortedSelectedDates,
      });
      onSuccess?.();
      handleClose();
    } catch (submitError) {
      setFormError(
        getErrorMessage(submitError, t('doctor.patients.exercisePlan.wizard.errors.saveFailed')),
      );
    }
  };

  const stepItems = [
    { title: t('doctor.patients.exercisePlan.wizard.steps.1') },
    { title: t('doctor.patients.exercisePlan.wizard.steps.2') },
    { title: t('doctor.patients.exercisePlan.wizard.steps.3') },
  ];

  const footer = (
    <Space wrap>
      {step > 1 ? (
        <Button disabled={assignExercises.isPending} onClick={goToPreviousStep}>
          {t('doctor.patients.exercisePlan.wizard.back')}
        </Button>
      ) : null}
      {step < 3 ? (
        <Button
          type="primary"
          disabled={(step === 2 && (isLoading || isError)) || assignExercises.isPending}
          onClick={goToNextStep}
        >
          {t('doctor.patients.exercisePlan.wizard.next')}
        </Button>
      ) : (
        <Button
          type="primary"
          loading={assignExercises.isPending}
          onClick={() => void handleConfirm()}
        >
          {assignExercises.isPending
            ? t('doctor.patients.exercisePlan.wizard.saving')
            : t('doctor.patients.exercisePlan.wizard.confirm')}
        </Button>
      )}
      <Button disabled={assignExercises.isPending} onClick={handleClose}>
        {t('doctor.patients.exercisePlan.wizard.cancel')}
      </Button>
    </Space>
  );

  return (
    <Modal
      title={t('doctor.patients.exercisePlan.wizard.title')}
      open={isOpen}
      onCancel={handleClose}
      footer={footer}
      width={720}
      destroyOnHidden
      centered
      maskClosable={!assignExercises.isPending}
    >
      <Steps current={step - 1} items={stepItems} style={{ marginBottom: 24 }} size="small" />

      {step === 1 ? (
        <JalaliCalendarPicker selectedDates={selectedDates} onChange={setSelectedDates} />
      ) : null}

      {step === 2 ? (
        <>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin tip={t('doctor.patients.exercisePlan.wizard.exercises.loading')} />
            </div>
          ) : null}

          {isError ? (
            <Result
              status="error"
              title={getErrorMessage(
                error,
                t('doctor.patients.exercisePlan.wizard.exercises.loadFailed'),
              )}
              extra={
                <Button type="primary" onClick={() => void refetch()}>
                  {t('doctor.patients.exercisePlan.retry')}
                </Button>
              }
            />
          ) : null}

          {!isLoading && !isError ? (
            <ExerciseSelectionList
              exercises={exercises}
              selectedExerciseIds={selectedExerciseIds}
              onToggle={handleToggleExercise}
              allowAssignedSelection
            />
          ) : null}
        </>
      ) : null}

      {step === 3 && patient ? (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text type="secondary">
              {t('doctor.patients.exercisePlan.wizard.confirmation.patient')}
            </Text>{' '}
            <Text>{patient.patientName}</Text>
          </div>

          <div>
            <Text type="secondary" strong>
              {t('doctor.patients.exercisePlan.wizard.confirmation.dates')}
            </Text>
            <ul style={{ margin: '8px 0 0', paddingInlineStart: 20 }}>
              {sortedSelectedDates.map((isoDate) => (
                <li key={isoDate}>{formatPersianCalendarDateLong(isoDate)}</li>
              ))}
            </ul>
          </div>

          <div>
            <Text type="secondary" strong>
              {t('doctor.patients.exercisePlan.wizard.confirmation.exercises')}
            </Text>
            <ul style={{ margin: '8px 0 0', paddingInlineStart: 20 }}>
              {selectedExercises.map((exercise: ExerciseDto) => (
                <li key={exercise.exerciseId}>{exercise.title}</li>
              ))}
            </ul>
          </div>

          <Text type="secondary">{t('doctor.patients.exercisePlan.wizard.confirmation.hint')}</Text>
        </Space>
      ) : null}

      {formError ? (
        <Alert type="error" message={formError} showIcon style={{ marginTop: 16 }} />
      ) : null}
    </Modal>
  );
}
