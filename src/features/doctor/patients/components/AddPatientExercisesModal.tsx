import { AppResult } from '@/components/ui';
import { Alert, Button, Modal, Space, Spin, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseSelectionList } from '@/features/doctor/patients/components/ExerciseSelectionList';
import {
  useAssignPatientExercises,
  useExerciseCatalog,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text } = Typography;

interface AddPatientExercisesModalProps {
  patientId: string;
  assignedExerciseIds: ReadonlySet<string>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPatientExercisesModal({
  patientId,
  assignedExerciseIds,
  isOpen,
  onClose,
  onSuccess,
}: AddPatientExercisesModalProps) {
  const { t } = useTranslation();
  const { data: exercises = [], isLoading, isError, error, refetch } = useExerciseCatalog(isOpen);
  const assignExercises = useAssignPatientExercises(patientId);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);

  const selectableCount = useMemo(
    () => exercises.filter((exercise) => !assignedExerciseIds.has(exercise.exerciseId)).length,
    [assignedExerciseIds, exercises],
  );

  const handleToggle = (exerciseId: string, checked: boolean) => {
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

    setSelectedExerciseIds(new Set());
    setFormError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (selectedExerciseIds.size === 0) {
      setFormError(t('doctor.patients.exercisePlan.add.errors.noneSelected'));
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      await assignExercises.mutateAsync({
        exerciseIds: [...selectedExerciseIds],
        scheduledDates: [today],
      });
      setSelectedExerciseIds(new Set());
      onSuccess();
      onClose();
    } catch (submitError) {
      setFormError(
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
        </Space>
      ) : null}

      {formError ? (
        <Alert type="error" message={formError} showIcon style={{ marginTop: 16 }} />
      ) : null}
    </Modal>
  );
}
