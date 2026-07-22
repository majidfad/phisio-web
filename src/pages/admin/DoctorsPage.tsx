import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppResult } from '@/components/ui';
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
  useUpdateDoctor,
} from '@/features/admin/doctors/hooks/useDoctors';
import type { DoctorFormSchemaValues } from '@/features/admin/doctors/schemas/doctor-form-schema';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function DoctorsPage() {
  const { t } = useTranslation();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors(listFilter);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();
  const activateDoctor = useActivateDoctor();
  const deactivateDoctor = useDeactivateDoctor();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDto | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorDto | null>(null);
  const [activatingDoctorId, setActivatingDoctorId] = useState<string | null>(null);
  const [deactivatingDoctorId, setDeactivatingDoctorId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateForm = () => {
    setSelectedDoctor(null);
    setFormError(null);
    setFormMode('create');
  };

  const openEditForm = (doctor: DoctorDto) => {
    setSelectedDoctor(doctor);
    setFormError(null);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedDoctor(null);
    setFormError(null);
  };

  const handleFormSubmit = async (values: DoctorFormSchemaValues) => {
    setFormError(null);

    const payload = {
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim() === '' ? null : values.email.trim(),
      specialty: values.specialty.trim(),
      medicalLicenseNumber: values.medicalLicenseNumber.trim(),
      clinicAddress: values.clinicAddress.trim(),
    };

    try {
      if (formMode === 'create') {
        await createDoctor.mutateAsync(payload);
      } else if (formMode === 'edit' && selectedDoctor) {
        await updateDoctor.mutateAsync({ id: selectedDoctor.id, request: payload });
      }

      closeForm();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, t('admin.doctors.errors.saveFailed')));
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

  const handleDeactivate = async (doctor: DoctorDto) => {
    setDeactivatingDoctorId(doctor.id);

    try {
      await deactivateDoctor.mutateAsync(doctor.id);
    } catch {
      // Error surfaced via query refetch
    } finally {
      setDeactivatingDoctorId(null);
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
          onDeactivate={(doctor) => void handleDeactivate(doctor)}
        />
      ) : null}

      <DoctorFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        doctor={selectedDoctor}
        isSubmitting={isFormSubmitting}
        submitError={formError}
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
    </PageContainer>
  );
}
