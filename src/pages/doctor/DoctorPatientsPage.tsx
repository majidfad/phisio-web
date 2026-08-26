import { Button, Space } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ConfirmActionModal,
  LoadingState,
  PageContainer,
  AppResult,
  AppTable,
  PageSection,
} from '@/components/ui';
import { PageHeader } from '@/components/PageHeader';
import { DoctorPatientsTable } from '@/features/doctor/patients/components/DoctorPatientsTable';
import { PatientExerciseHistoryModal } from '@/features/doctor/patients/components/PatientExerciseHistoryModal';
import { ExerciseAssignmentWizard } from '@/features/doctor/patients/components/ExerciseAssignmentWizard';
import { PatientOverviewDrawer } from '@/features/doctor/patients/components/PatientOverviewDrawer';
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
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits, formatPersianDate } from '@/utils/persian-format';

export function DoctorPatientsPage() {
  const { t } = useTranslation();
  const toast = useToast();
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

  const [removingPatientId, setRemovingPatientId] = useState<string | null>(null);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);
  const [patientToRemove, setPatientToRemove] = useState<DoctorPatientDto | null>(null);
  const [requestToReject, setRequestToReject] = useState<DoctorPatientRequestDto | null>(null);
  const [assignmentWizardPatient, setAssignmentWizardPatient] = useState<DoctorPatientDto | null>(
    null,
  );
  const [overviewPatient, setOverviewPatient] = useState<DoctorPatientDto | null>(null);
  const [exerciseHistoryPatient, setExerciseHistoryPatient] = useState<DoctorPatientDto | null>(
    null,
  );

  const handleRemoveConfirm = async () => {
    if (!patientToRemove) {
      return;
    }

    setRemovingPatientId(`${patientToRemove.patientId}:${patientToRemove.clinicId}`);

    try {
      await removePatient.mutateAsync({
        patientId: patientToRemove.patientId,
        clinicId: patientToRemove.clinicId,
      });
      toast.success(t('doctor.patients.success.removed'));
      setPatientToRemove(null);
    } catch (removeError) {
      toast.error(getErrorMessage(removeError, t('doctor.patients.errors.removeFailed')));
    } finally {
      setRemovingPatientId(null);
    }
  };

  const handleApprove = async (request: DoctorPatientRequestDto) => {
    setActingRequestId(`${request.patientId}:${request.clinicId}`);

    try {
      await approveRequest.mutateAsync({
        patientId: request.patientId,
        clinicId: request.clinicId,
      });
      toast.success(t('doctor.patients.success.approved'));
    } catch (approveError) {
      toast.error(getErrorMessage(approveError, t('doctor.patients.errors.approveFailed')));
    } finally {
      setActingRequestId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!requestToReject) {
      return;
    }

    setActingRequestId(`${requestToReject.patientId}:${requestToReject.clinicId}`);

    try {
      await rejectRequest.mutateAsync({
        patientId: requestToReject.patientId,
        clinicId: requestToReject.clinicId,
      });
      toast.success(t('doctor.patients.success.rejected'));
      setRequestToReject(null);
    } catch (rejectError) {
      toast.error(getErrorMessage(rejectError, t('doctor.patients.errors.rejectFailed')));
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

      <div className="patient-stack patient-stack--loose">
        <PageSection title={t('doctor.patients.requestsTitle')}>
          {isRequestsLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}

          {isRequestsError ? (
            <AppResult
              status="error"
              title={getErrorMessage(requestsError, t('doctor.patients.errors.loadRequestsFailed'))}
              extra={
                <Button type="primary" size="large" onClick={() => void refetchRequests()}>
                  {t('doctor.patients.retry')}
                </Button>
              }
            />
          ) : null}

          {!isRequestsLoading && !isRequestsError ? (
            <AppTable
              rowKey={(request) => `${request.patientId}:${request.clinicId}`}
              dataSource={requests}
              pagination={false}
              locale={{ emptyText: t('doctor.patients.emptyRequests') }}
              columns={[
                {
                  title: t('doctor.patients.columns.name'),
                  dataIndex: 'patientName',
                  minWidth: 140,
                },
                {
                  title: t('doctor.patients.columns.clinic'),
                  dataIndex: 'clinicName',
                  minWidth: 140,
                },
                {
                  title: t('doctor.patients.columns.phone'),
                  dataIndex: 'phoneNumber',
                  width: 150,
                  render: (value: string) => <span dir="ltr">{convertToPersianDigits(value)}</span>,
                },
                {
                  title: t('doctor.patients.columns.requestedAt'),
                  dataIndex: 'requestedAt',
                  width: 140,
                  render: (value: string) => formatPersianDate(value),
                },
                {
                  title: t('doctor.patients.columns.actions'),
                  key: 'actions',
                  width: 200,
                  render: (_, request) => (
                    <Space>
                      <Button
                        type="primary"
                        loading={actingRequestId === `${request.patientId}:${request.clinicId}`}
                        onClick={() => void handleApprove(request)}
                      >
                        {t('doctor.patients.approve')}
                      </Button>
                      <Button
                        danger
                        loading={actingRequestId === `${request.patientId}:${request.clinicId}`}
                        onClick={() => setRequestToReject(request)}
                      >
                        {t('doctor.patients.reject')}
                      </Button>
                    </Space>
                  ),
                },
              ]}
            />
          ) : null}
        </PageSection>

        <PageSection title={t('doctor.patients.linkedTitle')}>
          {isLoading ? <LoadingState tip={t('doctor.patients.loading')} /> : null}

          {isError ? (
            <AppResult
              status="error"
              title={getErrorMessage(error, t('doctor.patients.errors.loadFailed'))}
              extra={
                <Button type="primary" size="large" onClick={() => void refetch()}>
                  {t('doctor.patients.retry')}
                </Button>
              }
            />
          ) : null}

          {!isLoading && !isError ? (
            <DoctorPatientsTable
              patients={patients}
              removingPatientId={removingPatientId}
              onRemove={setPatientToRemove}
              onOpenOverview={setOverviewPatient}
              onOpenExercisePlan={setAssignmentWizardPatient}
              onOpenExerciseHistory={setExerciseHistoryPatient}
            />
          ) : null}
        </PageSection>
      </div>

      <PatientOverviewDrawer patient={overviewPatient} onClose={() => setOverviewPatient(null)} />

      <ExerciseAssignmentWizard
        patient={assignmentWizardPatient}
        onClose={() => setAssignmentWizardPatient(null)}
        onSuccess={() => toast.success(t('doctor.patients.exercisePlan.wizard.success'))}
      />

      <PatientExerciseHistoryModal
        patient={exerciseHistoryPatient}
        onClose={() => setExerciseHistoryPatient(null)}
      />

      <ConfirmActionModal
        open={patientToRemove !== null}
        title={t('doctor.patients.confirmRemove.title')}
        message={t('doctor.patients.confirmRemove.message', {
          name: patientToRemove?.patientName ?? '',
        })}
        confirmText={t('doctor.patients.confirmRemove.confirm')}
        cancelText={t('doctor.patients.confirmRemove.cancel')}
        confirming={removePatient.isPending}
        onCancel={() => setPatientToRemove(null)}
        onConfirm={() => void handleRemoveConfirm()}
      />

      <ConfirmActionModal
        open={requestToReject !== null}
        title={t('doctor.patients.confirmReject.title')}
        message={t('doctor.patients.confirmReject.message', {
          name: requestToReject?.patientName ?? '',
        })}
        confirmText={t('doctor.patients.confirmReject.confirm')}
        cancelText={t('doctor.patients.confirmReject.cancel')}
        confirming={rejectRequest.isPending}
        onCancel={() => setRequestToReject(null)}
        onConfirm={() => void handleRejectConfirm()}
      />
    </PageContainer>
  );
}
