import { Button, Result } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { DeletePatientDialog } from '@/features/admin/patients/components/DeletePatientDialog';
import { PatientFormModal } from '@/features/admin/patients/components/PatientFormModal';
import { PatientsTable } from '@/features/admin/patients/components/PatientsTable';
import {
  useActivatePatient,
  useCreatePatient,
  useDeletePatient,
  usePatients,
  useUpdatePatient,
} from '@/features/admin/patients/hooks/usePatients';
import type { PatientFormSchemaValues } from '@/features/admin/patients/schemas/patient-form-schema';
import type { PatientDto } from '@/features/admin/patients/types/patient';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function PatientsPage() {
  const { t } = useTranslation();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: patients = [], isLoading, isError, error, refetch } = usePatients(listFilter);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();
  const activatePatient = useActivatePatient();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<PatientDto | null>(null);
  const [activatingPatientId, setActivatingPatientId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateForm = () => {
    setSelectedPatient(null);
    setFormError(null);
    setFormMode('create');
  };

  const openEditForm = (patient: PatientDto) => {
    setSelectedPatient(patient);
    setFormError(null);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedPatient(null);
    setFormError(null);
  };

  const handleFormSubmit = async (values: PatientFormSchemaValues) => {
    setFormError(null);

    const payload = {
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim() === '' ? null : values.email.trim(),
    };

    try {
      if (formMode === 'create') {
        await createPatient.mutateAsync(payload);
      } else if (formMode === 'edit' && selectedPatient) {
        await updatePatient.mutateAsync({ id: selectedPatient.id, request: payload });
      }

      closeForm();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, t('admin.patients.errors.saveFailed')));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) {
      return;
    }

    try {
      await deletePatient.mutateAsync(patientToDelete.id);
      setPatientToDelete(null);
    } catch {
      // Keep dialog open; list error state handles visibility on refetch failure.
    }
  };

  const handleActivate = async (patient: PatientDto) => {
    setActivatingPatientId(patient.id);

    try {
      await activatePatient.mutateAsync(patient.id);
    } catch {
      // Error surfaced via query refetch state if needed.
    } finally {
      setActivatingPatientId(null);
    }
  };

  const isFormSubmitting = createPatient.isPending || updatePatient.isPending;

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.patients.title')}
        description={t('admin.patients.description')}
        action={
          !showInactiveView ? (
            <PageHeaderButton label={t('admin.patients.addButton')} onClick={openCreateForm} />
          ) : undefined
        }
      />

      <AdminStatusTabs value={listFilter} onChange={setListFilter} />

      {isLoading ? <LoadingState tip={t('admin.patients.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('admin.patients.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.patients.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <PatientsTable
          patients={patients}
          showInactiveView={showInactiveView}
          isActivating={activatePatient.isPending}
          activatingPatientId={activatingPatientId}
          onEdit={openEditForm}
          onDelete={(patient) => setPatientToDelete(patient)}
          onActivate={(patient) => void handleActivate(patient)}
        />
      ) : null}

      <PatientFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        patient={selectedPatient}
        isSubmitting={isFormSubmitting}
        submitError={formError}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeletePatientDialog
        isOpen={patientToDelete !== null}
        patientName={patientToDelete?.name ?? ''}
        isDeleting={deletePatient.isPending}
        onClose={() => setPatientToDelete(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </PageContainer>
  );
}
