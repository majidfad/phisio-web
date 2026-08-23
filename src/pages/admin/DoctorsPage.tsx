import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppResult, ConfirmActionModal } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { DeleteDoctorDialog } from '@/features/admin/doctors/components/DeleteDoctorDialog';
import { DoctorFormModal } from '@/features/admin/doctors/components/DoctorFormModal';
import { DoctorsTable } from '@/features/admin/doctors/components/DoctorsTable';
import {
  useActivateDoctor,
  useCreateDoctor,
  useDeactivateDoctor,
  useDeleteDoctor,
  useDoctors,
  useSetDoctorPassword,
  useUpdateDoctor,
} from '@/features/admin/doctors/hooks/useDoctors';
import type { DoctorFormSubmitValues } from '@/features/admin/doctors/components/DoctorFormModal';
import {
  toClinicPhonePayload,
  type DoctorFormSchemaValues,
} from '@/features/admin/doctors/schemas/doctor-form-schema';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';
import { AdminGeneratedPasswordModal } from '@/features/admin/password/components/AdminGeneratedPasswordModal';
import { AdminSetPasswordModal } from '@/features/admin/password/components/AdminSetPasswordModal';
import { toAdminSetPasswordRequest } from '@/features/admin/password/schemas/admin-password-schema';
import type { AdminSetPasswordRequest } from '@/features/admin/password/types/admin-password';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function DoctorsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors(listFilter);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();
  const activateDoctor = useActivateDoctor();
  const deactivateDoctor = useDeactivateDoctor();
  const setDoctorPassword = useSetDoctorPassword();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDto | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorDto | null>(null);
  const [doctorToDeactivate, setDoctorToDeactivate] = useState<DoctorDto | null>(null);
  const [doctorForPassword, setDoctorForPassword] = useState<DoctorDto | null>(null);
  const [activatingDoctorId, setActivatingDoctorId] = useState<string | null>(null);
  const [deactivatingDoctorId, setDeactivatingDoctorId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [generatedPasswordUserName, setGeneratedPasswordUserName] = useState('');

  const openCreateForm = () => {
    setSelectedDoctor(null);
    setFormMode('create');
  };

  const openEditForm = (doctor: DoctorDto) => {
    setSelectedDoctor(doctor);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedDoctor(null);
  };

  const showGeneratedPassword = (password: string | null | undefined, userName: string) => {
    if (!password) {
      return;
    }

    setGeneratedPasswordUserName(userName);
    setGeneratedPassword(password);
  };

  const handleFormSubmit = async (values: DoctorFormSubmitValues) => {
    const profilePayload = {
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim() === '' ? null : values.email.trim(),
      specialty: values.specialty.trim(),
      medicalLicenseNumber: values.medicalLicenseNumber.trim(),
      clinicAddress: values.clinicAddress.trim(),
    };

    try {
      if (formMode === 'create') {
        const createValues = values as DoctorFormSchemaValues;
        const passwordPayload = toAdminSetPasswordRequest(createValues);
        const clinicPhoneNumbers = toClinicPhonePayload(createValues.clinicPhoneNumbers);
        const managerIsThisDoctor = createValues.managerIsThisDoctor;
        const newClinicName = createValues.newClinicName.trim();
        const newClinicAddress = createValues.newClinicAddress.trim();

        const result = await createDoctor.mutateAsync({
          ...profilePayload,
          ...passwordPayload,
          clinicPhoneNumbers,
          newClinicName: newClinicName.length > 0 ? newClinicName : null,
          newClinicAddress: newClinicAddress.length > 0 ? newClinicAddress : null,
          managerIsThisDoctor,
          clinicManagerId:
            managerIsThisDoctor || !createValues.clinicManagerId?.trim()
              ? null
              : createValues.clinicManagerId.trim(),
        });
        closeForm();
        showGeneratedPassword(result.generatedPassword, result.doctor.name);
        return;
      }

      if (formMode === 'edit' && selectedDoctor) {
        await updateDoctor.mutateAsync({ id: selectedDoctor.id, request: profilePayload });
        closeForm();
      }
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.doctors.errors.saveFailed')));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) {
      return;
    }

    try {
      await deleteDoctor.mutateAsync(doctorToDelete.id);
      setDoctorToDelete(null);
    } catch {
      // Keep dialog open
    }
  };

  const handleActivate = async (doctor: DoctorDto) => {
    setActivatingDoctorId(doctor.id);

    try {
      await activateDoctor.mutateAsync(doctor.id);
    } catch {
      // Error surfaced via query refetch
    } finally {
      setActivatingDoctorId(null);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!doctorToDeactivate) {
      return;
    }

    setDeactivatingDoctorId(doctorToDeactivate.id);

    try {
      await deactivateDoctor.mutateAsync(doctorToDeactivate.id);
      setDoctorToDeactivate(null);
    } catch {
      // Keep dialog open
    } finally {
      setDeactivatingDoctorId(null);
    }
  };

  const handleSetPassword = async (request: AdminSetPasswordRequest) => {
    if (!doctorForPassword) {
      return;
    }

    try {
      const result = await setDoctorPassword.mutateAsync({
        id: doctorForPassword.id,
        request,
      });
      const userName = doctorForPassword.name;
      setDoctorForPassword(null);
      toast.success(t('admin.password.success'));
      showGeneratedPassword(result.generatedPassword, userName);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.password.error')));
    }
  };

  const isFormSubmitting = createDoctor.isPending || updateDoctor.isPending;

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.doctors.title')}
        description={t('admin.doctors.description')}
        action={
          !showInactiveView ? (
            <PageHeaderButton label={t('admin.doctors.addButton')} onClick={openCreateForm} />
          ) : undefined
        }
      />

      <AdminStatusTabs
        value={listFilter}
        onChange={setListFilter}
        labels={{ inactive: t('admin.common.tabs.pendingApproval') }}
      />

      {isLoading ? <LoadingState tip={t('admin.doctors.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('admin.doctors.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.doctors.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <DoctorsTable
          doctors={doctors}
          showInactiveView={showInactiveView}
          isActivating={activateDoctor.isPending}
          activatingDoctorId={activatingDoctorId}
          isDeactivating={deactivateDoctor.isPending}
          deactivatingDoctorId={deactivatingDoctorId}
          onEdit={openEditForm}
          onDelete={(doctor) => setDoctorToDelete(doctor)}
          onActivate={(doctor) => void handleActivate(doctor)}
          onDeactivate={setDoctorToDeactivate}
          onChangePassword={setDoctorForPassword}
        />
      ) : null}

      <DoctorFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        doctor={selectedDoctor}
        managerCandidates={doctors}
        isLoadingManagers={isLoading}
        isManagersError={isError}
        onRetryManagers={() => void refetch()}
        isSubmitting={isFormSubmitting}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteDoctorDialog
        isOpen={doctorToDelete !== null}
        doctorName={doctorToDelete?.name ?? ''}
        isDeleting={deleteDoctor.isPending}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />

      <ConfirmActionModal
        open={doctorToDeactivate !== null}
        title={t('admin.doctors.deactivate.title')}
        message={t('admin.doctors.deactivate.message', {
          name: doctorToDeactivate?.name ?? '',
        })}
        confirmText={t('admin.doctors.deactivate.confirm')}
        cancelText={t('admin.doctors.deactivate.cancel')}
        confirming={deactivateDoctor.isPending}
        onCancel={() => setDoctorToDeactivate(null)}
        onConfirm={() => void handleDeactivateConfirm()}
      />

      <AdminSetPasswordModal
        open={doctorForPassword !== null}
        userName={doctorForPassword?.name ?? ''}
        isSubmitting={setDoctorPassword.isPending}
        onClose={() => setDoctorForPassword(null)}
        onSubmit={handleSetPassword}
      />

      <AdminGeneratedPasswordModal
        open={generatedPassword !== null}
        password={generatedPassword}
        userName={generatedPasswordUserName}
        onClose={() => setGeneratedPassword(null)}
      />
    </PageContainer>
  );
}
