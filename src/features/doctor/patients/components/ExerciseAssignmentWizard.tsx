import { JalaliDatePicker } from '@/components/JalaliDatePicker';
import { AppResult } from '@/components/ui';
import {
  Button,
  Checkbox,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Steps,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseSelectionList } from '@/features/doctor/patients/components/ExerciseSelectionList';
import { ExerciseDosageFields } from '@/features/doctor/patients/components/ExerciseDosageFields';
import {
  useExerciseCatalog,
  usePatientExercisePlan,
  useSavePatientProgram,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import type { AssignPatientExerciseItem } from '@/features/doctor/patients/types/patient-exercise-plan';
import {
  addMonthsIso,
  buildDaysOfWeekMask,
  daysFromMask,
  ExerciseProgramCadenceType,
  type ExerciseProgramDto,
} from '@/features/doctor/patients/types/exercise-program';
import {
  latestDosageByExerciseId,
  resolveDosageForSelection,
} from '@/features/doctor/patients/utils/copy-last-dosage';
import { createDefaultDosage } from '@/features/doctor/patients/utils/dosage-presets';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianCalendarDateLong } from '@/utils/persian-format';

const { Text } = Typography;

interface ExerciseAssignmentWizardProps {
  patient: DoctorPatientDto | null;
  editingProgram?: ExerciseProgramDto | null;
  onClose: () => void;
  onSuccess?: () => void;
}

type WizardStep = 1 | 2 | 3;

const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExerciseAssignmentWizard({
  patient,
  editingProgram = null,
  onClose,
  onSuccess,
}: ExerciseAssignmentWizardProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [step, setStep] = useState<WizardStep>(1);
  const [startDate, setStartDate] = useState(editingProgram?.startDate ?? todayIso());
  const [durationMonths, setDurationMonths] = useState(3);
  const [endDate, setEndDate] = useState(editingProgram?.endDate ?? addMonthsIso(todayIso(), 3));
  const [cadenceType, setCadenceType] = useState<number>(
    editingProgram?.cadenceType ?? ExerciseProgramCadenceType.DaysOfWeek,
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(
    editingProgram ? daysFromMask(editingProgram.daysOfWeekMask) : [1, 3, 5],
  );
  const [intervalDays, setIntervalDays] = useState(editingProgram?.intervalDays ?? 3);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(() => {
    if (!editingProgram) return new Set();
    return new Set(editingProgram.exercises.map((exercise) => exercise.exerciseId));
  });
  const [dosageByExerciseId, setDosageByExerciseId] = useState<
    Record<string, AssignPatientExerciseItem>
  >(() => {
    if (!editingProgram) return {};
    return Object.fromEntries(
      editingProgram.exercises.map((exercise) => [
        exercise.exerciseId,
        {
          exerciseId: exercise.exerciseId,
          sets: exercise.sets ?? undefined,
          reps: exercise.reps ?? undefined,
          holdSeconds: exercise.holdSeconds ?? undefined,
          restSeconds: exercise.restSeconds ?? undefined,
          side: exercise.side,
          clinicianNote: exercise.clinicianNote ?? undefined,
          patientCue: exercise.patientCue ?? undefined,
        },
      ]),
    );
  });
  const [copiedFromLastIds, setCopiedFromLastIds] = useState<Set<string>>(new Set());

  const isOpen = Boolean(patient);
  const { data: exercises = [], isLoading, isError, error, refetch } = useExerciseCatalog(isOpen);
  const { data: planExercises = [] } = usePatientExercisePlan(patient?.patientId ?? null);
  const saveProgram = useSavePatientProgram(patient?.patientId ?? '');

  const selectedExercises = useMemo(
    () => exercises.filter((exercise) => selectedExerciseIds.has(exercise.exerciseId)),
    [exercises, selectedExerciseIds],
  );
  const latestByExerciseId = useMemo(
    () => latestDosageByExerciseId(planExercises),
    [planExercises],
  );

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setEndDate(addMonthsIso(value || todayIso(), durationMonths));
  };

  const handleDurationChange = (months: number) => {
    setDurationMonths(months);
    setEndDate(addMonthsIso(startDate || todayIso(), months));
  };

  const handleToggleExercise = (exerciseId: string, checked: boolean) => {
    if (checked) {
      const { item, copiedFromLast } = resolveDosageForSelection(exerciseId, latestByExerciseId);
      setDosageByExerciseId((current) =>
        current[exerciseId] ? current : { ...current, [exerciseId]: item },
      );
      if (copiedFromLast) {
        setCopiedFromLastIds((current) => new Set(current).add(exerciseId));
      }
    } else {
      setDosageByExerciseId((current) => {
        const rest = { ...current };
        delete rest[exerciseId];
        return rest;
      });
      setCopiedFromLastIds((current) => {
        const next = new Set(current);
        next.delete(exerciseId);
        return next;
      });
    }
    setSelectedExerciseIds((current) => {
      const next = new Set(current);
      if (checked) next.add(exerciseId);
      else next.delete(exerciseId);
      return next;
    });
  };

  const handleClose = () => {
    if (saveProgram.isPending) return;
    setStep(1);
    onClose();
  };

  const goToNextStep = () => {
    if (step === 1) {
      if (!startDate || !endDate || endDate < startDate) {
        toast.error(t('doctor.patients.exercisePlan.wizard.errors.invalidPeriod'));
        return;
      }
      if (cadenceType === ExerciseProgramCadenceType.DaysOfWeek && selectedWeekdays.length === 0) {
        toast.error(t('doctor.patients.exercisePlan.wizard.errors.noWeekdays'));
        return;
      }
      if (
        cadenceType === ExerciseProgramCadenceType.Interval &&
        (!intervalDays || intervalDays < 1)
      ) {
        toast.error(t('doctor.patients.exercisePlan.wizard.errors.invalidInterval'));
        return;
      }
    }
    if (step === 2 && selectedExerciseIds.size === 0) {
      toast.error(t('doctor.patients.exercisePlan.wizard.errors.noExercisesSelected'));
      return;
    }
    setStep((current) => (current === 3 ? 3 : ((current + 1) as WizardStep)));
  };

  const handleConfirm = async () => {
    if (!patient) return;
    try {
      await saveProgram.mutateAsync({
        programId: editingProgram?.programId,
        request: {
          startDate,
          endDate,
          cadenceType: cadenceType as 1 | 2,
          daysOfWeekMask: buildDaysOfWeekMask(selectedWeekdays),
          intervalDays: cadenceType === ExerciseProgramCadenceType.Interval ? intervalDays : null,
          items: selectedExercises.map(
            (exercise) =>
              dosageByExerciseId[exercise.exerciseId] ?? createDefaultDosage(exercise.exerciseId),
          ),
        },
      });
      onSuccess?.();
      handleClose();
    } catch (submitError) {
      toast.error(
        getErrorMessage(submitError, t('doctor.patients.exercisePlan.wizard.errors.saveFailed')),
      );
    }
  };

  const footer = (
    <Space wrap>
      {step > 1 ? (
        <Button
          disabled={saveProgram.isPending}
          onClick={() => setStep((s) => (s - 1) as WizardStep)}
        >
          {t('doctor.patients.exercisePlan.wizard.back')}
        </Button>
      ) : null}
      {step < 3 ? (
        <Button type="primary" onClick={goToNextStep}>
          {t('doctor.patients.exercisePlan.wizard.next')}
        </Button>
      ) : (
        <Button type="primary" loading={saveProgram.isPending} onClick={() => void handleConfirm()}>
          {editingProgram
            ? t('doctor.patients.exercisePlan.wizard.updateProgram')
            : t('doctor.patients.exercisePlan.wizard.confirm')}
        </Button>
      )}
      <Button disabled={saveProgram.isPending} onClick={handleClose}>
        {t('doctor.patients.exercisePlan.wizard.cancel')}
      </Button>
    </Space>
  );

  return (
    <Modal
      title={
        editingProgram
          ? t('doctor.patients.exercisePlan.wizard.editTitle')
          : t('doctor.patients.exercisePlan.wizard.title')
      }
      open={isOpen}
      onCancel={handleClose}
      footer={footer}
      width={720}
      destroyOnHidden
      centered
    >
      <Steps
        current={step - 1}
        size="small"
        style={{ marginBottom: 20 }}
        items={[
          { title: t('doctor.patients.exercisePlan.wizard.steps.period') },
          { title: t('doctor.patients.exercisePlan.wizard.steps.2') },
          { title: t('doctor.patients.exercisePlan.wizard.steps.3') },
        ]}
      />

      {step === 1 ? (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {editingProgram ? (
            <Text type="secondary" style={{ display: 'block' }}>
              {t('doctor.patients.exercisePlan.wizard.futureOnlyHint')}
            </Text>
          ) : null}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('doctor.patients.exercisePlan.wizard.period.startDate')}
            </Text>
            <JalaliDatePicker
              value={startDate}
              onChange={handleStartDateChange}
              ariaLabel={t('doctor.patients.exercisePlan.wizard.period.startDate')}
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('doctor.patients.exercisePlan.wizard.period.duration')}
            </Text>
            <Select
              value={durationMonths}
              onChange={handleDurationChange}
              style={{ minWidth: 180 }}
              options={[1, 2, 3, 6].map((months) => ({
                value: months,
                label: t('doctor.patients.exercisePlan.wizard.period.months', { count: months }),
              }))}
            />
          </div>
          <div>
            <Text type="secondary">
              {t('doctor.patients.exercisePlan.wizard.period.endDate')}:{' '}
              {formatPersianCalendarDateLong(endDate)}
            </Text>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('doctor.patients.exercisePlan.wizard.period.cadence')}
            </Text>
            <Radio.Group
              value={cadenceType}
              onChange={(event) => setCadenceType(event.target.value)}
              optionType="button"
              options={[
                {
                  value: ExerciseProgramCadenceType.DaysOfWeek,
                  label: t('doctor.patients.exercisePlan.wizard.period.daysOfWeek'),
                },
                {
                  value: ExerciseProgramCadenceType.Interval,
                  label: t('doctor.patients.exercisePlan.wizard.period.interval'),
                },
              ]}
            />
          </div>
          {cadenceType === ExerciseProgramCadenceType.DaysOfWeek ? (
            <Checkbox.Group
              value={selectedWeekdays}
              onChange={(values) => setSelectedWeekdays(values as number[])}
              options={WEEKDAY_VALUES.map((day) => ({
                value: day,
                label: t(`doctor.patients.exercisePlan.wizard.weekdays.${day}`),
              }))}
            />
          ) : (
            <Space>
              <Text>{t('doctor.patients.exercisePlan.wizard.period.every')}</Text>
              <InputNumber
                min={1}
                max={30}
                value={intervalDays}
                onChange={(value) => setIntervalDays(value ?? 3)}
              />
              <Text>{t('doctor.patients.exercisePlan.wizard.period.days')}</Text>
            </Space>
          )}
        </Space>
      ) : null}

      {step === 2 ? (
        <>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin tip={t('doctor.patients.exercisePlan.wizard.exercises.loading')} />
            </div>
          ) : null}
          {isError ? (
            <AppResult
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
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Text type="secondary">
              {t('doctor.patients.exercisePlan.wizard.confirmation.patient')}
            </Text>{' '}
            <Text strong>{patient.patientName}</Text>
          </div>
          <Text type="secondary">
            {formatPersianCalendarDateLong(startDate)} → {formatPersianCalendarDateLong(endDate)}
          </Text>
          <ExerciseDosageFields
            exercises={selectedExercises}
            values={dosageByExerciseId}
            copiedFromLastIds={copiedFromLastIds}
            onChange={(exerciseId, value) => {
              setDosageByExerciseId((current) => ({ ...current, [exerciseId]: value }));
              setCopiedFromLastIds((current) => {
                const next = new Set(current);
                next.delete(exerciseId);
                return next;
              });
            }}
          />
        </Space>
      ) : null}
    </Modal>
  );
}
