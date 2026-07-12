import { Alert, Button, Form, Input, Modal, Result } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { DoctorPatientsTable } from '@/features/doctor/patients/components/DoctorPatientsTable';
import { PatientExerciseHistoryModal } from '@/features/doctor/patients/components/PatientExerciseHistoryModal';
import { ExerciseAssignmentWizard } from '@/features/doctor/patients/components/ExerciseAssignmentWizard';
import {
  useAddDoctorPatient,
  useDoctorPatients,
  useRemoveDoctorPatient,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import { getErrorMessage } from '@/utils/get-error-message';

export function DoctorPatientsPage() {
  const { t } = useTranslation();
  const { data: patients = [], isLoading, isError, error, refetch } = useDoctorPatients();
  const addPatient = useAddDoctorPatient();
  const removePatient = useRemoveDoctorPatient();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [removingPatientId, setRemovingPatientId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [assignmentWizardPatient, setAssignmentWizardPatient] = useState<DoctorPatientDto | null>(
    null,
  );
  const [exerciseHistoryPatient, setExerciseHistoryPatient] = useState<DoctorPatientDto | null>(
    null,
  );

  const openAddForm = () => {
    setFormError(null);
    setSuccessMessage(null);
    setPhoneNumber('');
    setShowAddForm(true);
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setFormError(null);
    setPhoneNumber('');
  };

  const handleAddSubmit = async () => {
    setFormError(null);
    setSuccessMessage(null);

    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setFormError(t('doctor.patients.errors.phoneRequired'));
      return;
    }

    try {
      await addPatient.mutateAsync({ phoneNumber: trimmedPhone });
      setSuccessMessage(t('doctor.patients.success.added'));
      closeAddForm();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, t('doctor.patients.errors.addFailed')));
    }
  };

  const handleRemove = async (patient: DoctorPatientDto) => {
    setRemovingPatientId(patient.patientId);
    setSuccessMessage(null);

    try {
      await removePatient.mutateAsync(patient.patientId);
    } catch {
      // Optimistic update rolls back on error.
    } finally {
      setRemovingPatientId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.patients.title')}
        description={t('doctor.patients.description')}
        action={<PageHeaderButton label={t('doctor.patients.addButton')} onClick={openAddForm} />}
      />

      {successMessage ? (
        <Alert type="success" message={successMessage} showIcon style={{ marginBottom: 16 }} />
      ) : null}

      <Modal
        title={t('doctor.patients.addTitle')}
        open={showAddForm}
        onCancel={closeAddForm}
        onOk={() => void handleAddSubmit()}
        okText={addPatient.isPending ? t('doctor.patients.adding') : t('doctor.patients.addSubmit')}
        cancelText={t('doctor.patients.cancel')}
        confirmLoading={addPatient.isPending}
        destroyOnHidden
        centered
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label={t('doctor.patients.phoneLabel')}
            validateStatus={formError ? 'error' : undefined}
            help={formError}
          >
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder={t('auth.phonePlaceholder')}
              dir="ltr"
              autoComplete="tel"
            />
          </Form.Item>
        </Form>
      </Modal>

      {isLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('doctor.patients.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.patients.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <DoctorPatientsTable
          patients={patients}
          removingPatientId={removingPatientId}
          onRemove={(patient) => void handleRemove(patient)}
          onOpenExercisePlan={setAssignmentWizardPatient}
          onOpenExerciseHistory={setExerciseHistoryPatient}
        />
      ) : null}

      <ExerciseAssignmentWizard
        patient={assignmentWizardPatient}
        onClose={() => setAssignmentWizardPatient(null)}
        onSuccess={() => setSuccessMessage(t('doctor.patients.exercisePlan.wizard.success'))}
      />

      <PatientExerciseHistoryModal
        patient={exerciseHistoryPatient}
        onClose={() => setExerciseHistoryPatient(null)}
      />
    </PageContainer>
  );
}
