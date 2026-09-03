import { Button } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import {
  AppResult,
  ConfirmActionModal,
  LoadingState,
  PageContainer,
  PageSection,
} from '@/components/ui';
import { useAuth } from '@/features/auth';
import { AddClinicDoctorModal } from '@/features/clinics/components/AddClinicDoctorModal';
import { ChangeClinicManagerModal } from '@/features/clinics/components/ChangeClinicManagerModal';
import { ClinicAdherenceStats } from '@/features/clinics/components/ClinicAdherenceStats';
import { ClinicDetailsCard } from '@/features/clinics/components/ClinicDetailsCard';
import { ClinicDoctorDetailsModal } from '@/features/clinics/components/ClinicDoctorDetailsModal';
import { ClinicDoctorsTable } from '@/features/clinics/components/ClinicDoctorsTable';
import { ClinicFormModal } from '@/features/clinics/components/ClinicFormModal';
import { ClinicPatientsTable } from '@/features/clinics/components/ClinicPatientsTable';
import { ClinicVisitsTable } from '@/features/clinics/components/ClinicVisitsTable';
import {
  useAddClinicDoctor,
  useChangeClinicManager,
  useClinic,
  useClinicAdherence,
  useClinicDoctorCandidates,
  useClinicDoctors,
  useClinicPatients,
  useDisableClinic,
  useRemoveClinicDoctor,
  useUpdateClinic,
} from '@/features/clinics/hooks/useClinics';
import {
  resolveAddClinicDoctorId,
  type AddClinicDoctorSchemaValues,
} from '@/features/clinics/schemas/add-clinic-doctor-schema';
import {
  resolveChangeClinicManagerId,
  type ChangeClinicManagerSchemaValues,
} from '@/features/clinics/schemas/change-clinic-manager-schema';
import {
  toClinicPhonePayload,
  type ClinicFormSchemaValues,
} from '@/features/clinics/schemas/clinic-form-schema';
import type { ClinicDoctorMemberDto } from '@/features/clinics/types/clinic';
import { getClinicListPath } from '@/features/clinics/utils/clinic-paths';
import {
  mergePatientsWithAdherence,
  toAdherenceLookup,
} from '@/features/clinics/utils/clinic-patient-adherence';
import { useToast } from '@/hooks/useToast';
import { hasRequiredRole } from '@/routes/utils/role-access';
import { getErrorMessage } from '@/utils/get-error-message';

export function ClinicDetailsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { clinicId } = useParams<{ clinicId: string }>();
  const { user } = useAuth();
  const isAdmin = Boolean(user && hasRequiredRole(user, 'Admin'));
  const listPath = getClinicListPath(user);

  const { data: clinic, isLoading, isError, error, refetch } = useClinic(clinicId);
  const {
    data: doctors = [],
    isLoading: isDoctorsLoading,
    isError: isDoctorsError,
    error: doctorsError,
    refetch: refetchDoctors,
  } = useClinicDoctors(clinicId);
  const {
    data: patients = [],
    isLoading: isPatientsLoading,
    isError: isPatientsError,
    error: patientsError,
    refetch: refetchPatients,
  } = useClinicPatients(clinicId);
  const adherenceQuery = useClinicAdherence(clinicId);
  const patientsWithAdherence = useMemo(
    () =>
      mergePatientsWithAdherence(patients, toAdherenceLookup(adherenceQuery.data?.patients ?? [])),
    [patients, adherenceQuery.data?.patients],
  );

  const updateClinic = useUpdateClinic();
  const disableClinic = useDisableClinic();
  const changeManager = useChangeClinicManager();
  const addDoctor = useAddClinicDoctor(clinicId);
  const removeDoctor = useRemoveClinicDoctor(clinicId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isChangeManagerOpen, setIsChangeManagerOpen] = useState(false);
  const [clinicToDisable, setClinicToDisable] = useState(false);
  const [doctorToView, setDoctorToView] = useState<ClinicDoctorMemberDto | null>(null);
  const [doctorToRemove, setDoctorToRemove] = useState<ClinicDoctorMemberDto | null>(null);

  const candidatesQuery = useClinicDoctorCandidates(isAddDoctorOpen || isChangeManagerOpen);
  const assignedDoctorIds = useMemo(
    () => new Set(doctors.map((doctor) => doctor.doctorId)),
    [doctors],
  );
  const currentManager = useMemo(
    () => doctors.find((doctor) => doctor.isClinicManager) ?? null,
    [doctors],
  );

  const handleEditSubmit = async (values: ClinicFormSchemaValues) => {
    if (!clinic) {
      return;
    }

    try {
      await updateClinic.mutateAsync({
        id: clinic.clinicId,
        request: {
          name: values.name.trim(),
          address: values.address.trim(),
          phoneNumbers: toClinicPhonePayload(values.phoneNumbers),
        },
      });
      toast.success(t('clinics.success.updated'));
      setIsEditOpen(false);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('clinics.errors.saveFailed')));
    }
  };

  const handleDisableConfirm = async () => {
    if (!clinic) {
      return;
    }

    try {
      await disableClinic.mutateAsync(clinic.clinicId);
      toast.success(t('clinics.success.disabled'));
      setClinicToDisable(false);
      void navigate(listPath);
    } catch (disableError) {
      toast.error(getErrorMessage(disableError, t('clinics.errors.disableFailed')));
    }
  };

  const handleAddDoctor = async (values: AddClinicDoctorSchemaValues) => {
    const doctorId = resolveAddClinicDoctorId(values);
    if (assignedDoctorIds.has(doctorId)) {
      toast.error(t('clinics.doctors.errors.alreadyAssigned'));
      return;
    }

    try {
      await addDoctor.mutateAsync(doctorId);
      toast.success(t('clinics.doctors.success.added'));
      setIsAddDoctorOpen(false);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('clinics.doctors.errors.addFailed')));
    }
  };

  const handleChangeManager = async (values: ChangeClinicManagerSchemaValues) => {
    if (!clinic) {
      return;
    }

    const clinicManagerId = resolveChangeClinicManagerId(values);
    if (clinicManagerId === clinic.clinicManagerId) {
      toast.error(t('clinics.changeManager.errors.sameManager'));
      return;
    }

    try {
      await changeManager.mutateAsync({
        id: clinic.clinicId,
        request: { clinicManagerId },
      });
      toast.success(t('clinics.changeManager.success'));
      setIsChangeManagerOpen(false);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('clinics.changeManager.errors.saveFailed')));
    }
  };

  const handleRemoveDoctor = async () => {
    if (!doctorToRemove) {
      return;
    }

    if (doctorToRemove.isClinicManager) {
      toast.error(t('clinics.doctors.cannotRemoveManager'));
      return;
    }

    try {
      await removeDoctor.mutateAsync(doctorToRemove.doctorId);
      toast.success(t('clinics.doctors.success.removed'));
      setDoctorToRemove(null);
    } catch (removeError) {
      toast.error(getErrorMessage(removeError, t('clinics.doctors.errors.removeFailed')));
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={clinic?.name ?? t('clinics.details.title')}
        description={t('clinics.details.description')}
        action={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => void navigate(listPath)}>{t('clinics.details.back')}</Button>
            {clinic ? (
              <Button onClick={() => setIsEditOpen(true)}>{t('clinics.actions.edit')}</Button>
            ) : null}
            {clinic && isAdmin ? (
              <Button onClick={() => setIsChangeManagerOpen(true)}>
                {t('clinics.actions.changeManager')}
              </Button>
            ) : null}
            {clinic?.isEnabled ? (
              <Button danger onClick={() => setClinicToDisable(true)}>
                {t('clinics.actions.disable')}
              </Button>
            ) : null}
          </div>
        }
      />

      {isLoading ? <LoadingState tip={t('clinics.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('clinics.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('clinics.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && clinic ? (
        <>
          <ClinicDetailsCard
            clinic={clinic}
            doctorCount={doctors.length}
            managerName={currentManager?.name}
          />

          <PageSection
            title={t('clinics.adherence.title')}
            description={t('clinics.adherence.description')}
          >
            <ClinicAdherenceStats clinicId={clinicId} />
          </PageSection>

          <PageSection
            title={t('clinics.doctors.title')}
            description={t('clinics.doctors.description')}
            action={
              <Button type="primary" onClick={() => setIsAddDoctorOpen(true)}>
                {t('clinics.doctors.add')}
              </Button>
            }
          >
            {isDoctorsLoading ? <LoadingState tip={t('clinics.doctors.loading')} /> : null}

            {isDoctorsError ? (
              <AppResult
                status="error"
                title={getErrorMessage(doctorsError, t('clinics.doctors.errors.loadFailed'))}
                extra={
                  <Button type="primary" onClick={() => void refetchDoctors()}>
                    {t('clinics.retry')}
                  </Button>
                }
              />
            ) : null}

            {!isDoctorsLoading && !isDoctorsError ? (
              <ClinicDoctorsTable
                doctors={doctors}
                isRemoving={removeDoctor.isPending}
                removingDoctorId={doctorToRemove?.doctorId ?? null}
                onView={setDoctorToView}
                onRemove={setDoctorToRemove}
              />
            ) : null}
          </PageSection>

          <PageSection
            title={t('clinics.patients.title')}
            description={t('clinics.patients.description')}
          >
            {isPatientsLoading ? <LoadingState tip={t('clinics.patients.loading')} /> : null}

            {isPatientsError ? (
              <AppResult
                status="error"
                title={getErrorMessage(patientsError, t('clinics.patients.errors.loadFailed'))}
                extra={
                  <Button type="primary" onClick={() => void refetchPatients()}>
                    {t('clinics.retry')}
                  </Button>
                }
              />
            ) : null}

            {!isPatientsLoading && !isPatientsError ? (
              <ClinicPatientsTable patients={patientsWithAdherence} showAdherenceColumn />
            ) : null}
          </PageSection>

          <PageSection
            title={t('clinics.visits.title')}
            description={t('clinics.visits.description')}
          >
            <ClinicVisitsTable clinicId={clinicId} />
          </PageSection>

          <ClinicFormModal
            isOpen={isEditOpen}
            mode="edit"
            clinic={clinic}
            requireClinicManagerId={isAdmin}
            doctors={[]}
            isLoadingDoctors={false}
            isDoctorsError={false}
            isSubmitting={updateClinic.isPending}
            onRetryDoctors={() => undefined}
            onClose={() => setIsEditOpen(false)}
            onSubmit={handleEditSubmit}
          />

          <AddClinicDoctorModal
            isOpen={isAddDoctorOpen}
            isSubmitting={addDoctor.isPending}
            isLoadingCandidates={candidatesQuery.isLoading}
            isCandidatesError={candidatesQuery.isError}
            assignedDoctorIds={assignedDoctorIds}
            candidates={candidatesQuery.data ?? []}
            onRetryCandidates={() => void candidatesQuery.refetch()}
            onClose={() => setIsAddDoctorOpen(false)}
            onSubmit={handleAddDoctor}
          />

          <ClinicDoctorDetailsModal
            open={doctorToView !== null}
            clinicId={clinicId}
            doctor={doctorToView}
            onClose={() => setDoctorToView(null)}
          />

          {isAdmin ? (
            <ChangeClinicManagerModal
              isOpen={isChangeManagerOpen}
              isSubmitting={changeManager.isPending}
              isLoadingCandidates={candidatesQuery.isLoading}
              isCandidatesError={candidatesQuery.isError}
              currentManagerId={clinic.clinicManagerId}
              currentManagerName={currentManager?.name}
              candidates={candidatesQuery.data ?? []}
              onRetryCandidates={() => void candidatesQuery.refetch()}
              onClose={() => setIsChangeManagerOpen(false)}
              onSubmit={handleChangeManager}
            />
          ) : null}

          <ConfirmActionModal
            open={clinicToDisable}
            title={t('clinics.disable.title')}
            message={t('clinics.disable.message', { name: clinic.name })}
            confirmText={t('clinics.disable.confirm')}
            cancelText={t('clinics.disable.cancel')}
            confirming={disableClinic.isPending}
            onCancel={() => setClinicToDisable(false)}
            onConfirm={() => void handleDisableConfirm()}
          />

          <ConfirmActionModal
            open={doctorToRemove !== null}
            title={t('clinics.doctors.removeTitle')}
            message={t('clinics.doctors.removeMessage', { name: doctorToRemove?.name ?? '' })}
            confirmText={t('clinics.doctors.remove')}
            cancelText={t('clinics.form.cancel')}
            confirming={removeDoctor.isPending}
            onCancel={() => setDoctorToRemove(null)}
            onConfirm={() => void handleRemoveDoctor()}
          />
        </>
      ) : null}
    </PageContainer>
  );
}
