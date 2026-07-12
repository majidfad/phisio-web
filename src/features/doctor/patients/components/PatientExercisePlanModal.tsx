import { Alert, Button, Modal, Result, Space, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddPatientExercisesModal } from '@/features/doctor/patients/components/AddPatientExercisesModal';
import { PatientExercisePlanTable } from '@/features/doctor/patients/components/PatientExercisePlanTable';
import { usePatientExercisePlan } from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import { getErrorMessage } from '@/utils/get-error-message';

interface PatientExercisePlanModalProps {
  patient: DoctorPatientDto | null;
  onClose: () => void;
}

export function PatientExercisePlanModal({ patient, onClose }: PatientExercisePlanModalProps) {
  const { t } = useTranslation();
  const {
    data: exercises = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientExercisePlan(patient?.patientId ?? null);
  const [showAddExercises, setShowAddExercises] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const assignedExerciseIds = useMemo(
    () => new Set(exercises.map((exercise) => exercise.exerciseId)),
    [exercises],
  );

  return (
    <>
      <Modal
        title={
          patient
            ? t('doctor.patients.exercisePlan.title', { name: patient.patientName })
            : t('doctor.patients.exercisePlan.title', { name: '' })
        }
        open={Boolean(patient)}
        onCancel={onClose}
        footer={null}
        width={720}
        destroyOnHidden
        centered
      >
        {patient ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setSuccessMessage(null);
                setShowAddExercises(true);
              }}
            >
              {t('doctor.patients.exercisePlan.add.open')}
            </Button>

            {successMessage ? <Alert type="success" message={successMessage} showIcon /> : null}

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Spin tip={t('doctor.patients.exercisePlan.loading')} />
              </div>
            ) : null}

            {isError ? (
              <Result
                status="error"
                title={getErrorMessage(error, t('doctor.patients.exercisePlan.errors.loadFailed'))}
                extra={
                  <Button type="primary" onClick={() => void refetch()}>
                    {t('doctor.patients.exercisePlan.retry')}
                  </Button>
                }
              />
            ) : null}

            {!isLoading && !isError ? <PatientExercisePlanTable exercises={exercises} /> : null}
          </Space>
        ) : null}
      </Modal>

      {patient ? (
        <AddPatientExercisesModal
          patientId={patient.patientId}
          assignedExerciseIds={assignedExerciseIds}
          isOpen={showAddExercises}
          onClose={() => setShowAddExercises(false)}
          onSuccess={() => setSuccessMessage(t('doctor.patients.exercisePlan.add.success'))}
        />
      ) : null}
    </>
  );
}
