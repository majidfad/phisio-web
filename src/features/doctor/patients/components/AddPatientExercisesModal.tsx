import { AppResult } from '@/components/ui';
import { Button, Modal, Space, Spin, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseSelectionList } from '@/features/doctor/patients/components/ExerciseSelectionList';
import { ExerciseDosageFields } from '@/features/doctor/patients/components/ExerciseDosageFields';
import {
  useAssignPatientExercises,
  useExerciseCatalog,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type {
  AssignPatientExerciseItem,
  DoctorPatientExerciseDto,
} from '@/features/doctor/patients/types/patient-exercise-plan';
import {
  latestDosageByExerciseId,
  resolveDosageForSelection,
} from '@/features/doctor/patients/utils/copy-last-dosage';
import { createDefaultDosage } from '@/features/doctor/patients/utils/dosage-presets';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text } = Typography;

interface AddPatientExercisesModalProps {
  patientId: string;
  assignedExerciseIds: ReadonlySet<string>;
  planExercises: DoctorPatientExerciseDto[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPatientExercisesModal({
  patientId,
  assignedExerciseIds,
  planExercises,
  isOpen,
  onClose,
  onSuccess,
}: AddPatientExercisesModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: exercises = [], isLoading, isError, error, refetch } = useExerciseCatalog(isOpen);
  const assignExercises = useAssignPatientExercises(patientId);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const [dosageByExerciseId, setDosageByExerciseId] = useState<
    Record<string, AssignPatientExerciseItem>
  >({});
  const [copiedFromLastIds, setCopiedFromLastIds] = useState<Set<string>>(new Set());

  const selectableCount = useMemo(
    () => exercises.filter((exercise) => !assignedExerciseIds.has(exercise.exerciseId)).length,
    [assignedExerciseIds, exercises],
  );
  const latestByExerciseId = useMemo(
    () => latestDosageByExerciseId(planExercises),
    [planExercises],
  );

  const handleToggle = (exerciseId: string, checked: boolean) => {
    setDosageByExerciseId((current) => {
      if (checked) {
        if (current[exerciseId]) {
          return current;
        }
        const { item, copiedFromLast } = resolveDosageForSelection(exerciseId, latestByExerciseId);
        if (copiedFromLast) {
          setCopiedFromLastIds((ids) => new Set(ids).add(exerciseId));
        }
        return { ...current, [exerciseId]: item };
      }
      const rest = { ...current };
      delete rest[exerciseId];
      return rest;
    });
    if (!checked) {
      setCopiedFromLastIds((current) => {
        const next = new Set(current);
        next.delete(exerciseId);
        return next;
      });
    }
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

    setSelectedExerciseIds(new Set());
    setDosageByExerciseId({});
    setCopiedFromLastIds(new Set());
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedExerciseIds.size === 0) {
      toast.error(t('doctor.patients.exercisePlan.add.errors.noneSelected'));
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      await assignExercises.mutateAsync({
        items: exercises
          .filter((exercise) => selectedExerciseIds.has(exercise.exerciseId))
          .map(
            (exercise) =>
              dosageByExerciseId[exercise.exerciseId] ?? createDefaultDosage(exercise.exerciseId),
          ),
        scheduledDates: [today],
      });
      setSelectedExerciseIds(new Set());
      onSuccess();
      onClose();
    } catch (submitError) {
      toast.error(
        getErrorMessage(submitError, t('doctor.patients.exercisePlan.add.errors.saveFailed')),
      );
    }
  };

  return (
    <Modal
      title={t('doctor.patients.exercisePlan.add.title')}
      open={isOpen}
      onCancel={handleClose}
      onOk={() => void handleSubmit()}
      okText={
        assignExercises.isPending
          ? t('doctor.patients.exercisePlan.add.saving')
          : t('doctor.patients.exercisePlan.add.submit')
      }
      cancelText={t('doctor.patients.exercisePlan.add.cancel')}
      confirmLoading={assignExercises.isPending}
      okButtonProps={{ disabled: isLoading || isError }}
      destroyOnHidden
      centered
      width={560}
      zIndex={1100}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin tip={t('doctor.patients.exercisePlan.add.loading')} />
        </div>
      ) : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('doctor.patients.exercisePlan.add.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.patients.exercisePlan.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Text type="secondary">
            {t('doctor.patients.exercisePlan.add.hint', { count: selectableCount })}
          </Text>
          <ExerciseSelectionList
            exercises={exercises}
            selectedExerciseIds={selectedExerciseIds}
            assignedExerciseIds={assignedExerciseIds}
            onToggle={handleToggle}
          />
          {selectedExerciseIds.size > 0 ? (
            <ExerciseDosageFields
              exercises={exercises.filter((exercise) =>
                selectedExerciseIds.has(exercise.exerciseId),
              )}
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
          ) : null}
        </Space>
      ) : null}
    </Modal>
  );
}
