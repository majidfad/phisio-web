import { Alert, Button, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingState, PageContainer, AppResult } from '@/components/ui';
import { PageHeader } from '@/components/PageHeader';
import { DoctorPatientsTable } from '@/features/doctor/patients/components/DoctorPatientsTable';
import { PatientExerciseHistoryModal } from '@/features/doctor/patients/components/PatientExerciseHistoryModal';
import { ExerciseAssignmentWizard } from '@/features/doctor/patients/components/ExerciseAssignmentWizard';
import {
  useApproveDoctorPatientRequest,
  useDoctorPatientRequests,
  useDoctorPatients,
  useRejectDoctorPatientRequest,
  useRemoveDoctorPatient,
} from '@/features/doctor/patients/hooks/useDoctorPatients';
import type {
  DoctorPatientDto,
  DoctorPatientRequestDto,
} from '@/features/doctor/patients/types/doctor-patient';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits, formatPersianDate } from '@/utils/persian-format';

export function DoctorPatientsPage() {
  const { t } = useTranslation();
  const { data: patients = [], isLoading, isError, error, refetch } = useDoctorPatients();
  const {
    data: requests = [],
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    error: requestsError,
    refetch: refetchRequests,
  } = useDoctorPatientRequests();
  const approveRequest = useApproveDoctorPatientRequest();
  const rejectRequest = useRejectDoctorPatientRequest();
  const removePatient = useRemoveDoctorPatient();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removingPatientId, setRemovingPatientId] = useState<string | null>(null);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);
  const [assignmentWizardPatient, setAssignmentWizardPatient] = useState<DoctorPatientDto | null>(
    null,
  );
  const [exerciseHistoryPatient, setExerciseHistoryPatient] = useState<DoctorPatientDto | null>(
    null,
  );

  const handleRemove = async (patient: DoctorPatientDto) => {
    setRemovingPatientId(patient.patientId);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await removePatient.mutateAsync(patient.patientId);
      setSuccessMessage(t('doctor.patients.success.removed'));
    } catch (removeError) {
      setActionError(getErrorMessage(removeError, t('doctor.patients.errors.removeFailed')));
    } finally {
      setRemovingPatientId(null);
    }
  };

  const handleApprove = async (request: DoctorPatientRequestDto) => {
    setActingRequestId(request.patientId);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await approveRequest.mutateAsync(request.patientId);
      setSuccessMessage(t('doctor.patients.success.approved'));
    } catch (approveError) {
      setActionError(getErrorMessage(approveError, t('doctor.patients.errors.approveFailed')));
    } finally {
      setActingRequestId(null);
    }
  };

  const handleReject = async (request: DoctorPatientRequestDto) => {
    setActingRequestId(request.patientId);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await rejectRequest.mutateAsync(request.patientId);
      setSuccessMessage(t('doctor.patients.success.rejected'));
    } catch (rejectError) {
      setActionError(getErrorMessage(rejectError, t('doctor.patients.errors.rejectFailed')));
    } finally {
      setActingRequestId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.patients.title')}
        description={t('doctor.patients.description')}
      />

      {successMessage ? (
        <Alert type="success" message={successMessage} showIcon style={{ marginBottom: 16 }} />
      ) : null}
      {actionError ? (
        <Alert type="error" message={actionError} showIcon style={{ marginBottom: 16 }} />
      ) : null}

      <Typography.Title level={5}>{t('doctor.patients.requestsTitle')}</Typography.Title>

      {isRequestsLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}

      {isRequestsError ? (
        <AppResult
          status="error"
          title={getErrorMessage(requestsError, t('doctor.patients.errors.loadRequestsFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetchRequests()}>
              {t('doctor.patients.retry')}
            </Button>
          }
        />
      ) : null}

      {!isRequestsLoading && !isRequestsError ? (
        <Table
          rowKey="patientId"
          dataSource={requests}
          pagination={false}
          locale={{ emptyText: t('doctor.patients.emptyRequests') }}
          style={{ marginBottom: 24 }}
          columns={[
            {
              title: t('doctor.patients.columns.name'),
              dataIndex: 'patientName',
            },
            {
              title: t('doctor.patients.columns.phone'),
              dataIndex: 'phoneNumber',
              render: (value: string) => <span dir="ltr">{convertToPersianDigits(value)}</span>,
            },
            {
              title: t('doctor.patients.columns.requestedAt'),
              dataIndex: 'requestedAt',
              render: (value: string) => formatPersianDate(value),
            },
            {
              title: t('doctor.patients.columns.actions'),
              key: 'actions',
              render: (_, request) => (
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    loading={actingRequestId === request.patientId}
                    onClick={() => void handleApprove(request)}
                  >
                    {t('doctor.patients.approve')}
                  </Button>
                  <Button
                    danger
                    size="small"
                    loading={actingRequestId === request.patientId}
                    onClick={() => void handleReject(request)}
                  >
                    {t('doctor.patients.reject')}
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      ) : null}

      <Typography.Title level={5}>{t('doctor.patients.linkedTitle')}</Typography.Title>

      {isLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}

      {isError ? (
        <AppResult
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
