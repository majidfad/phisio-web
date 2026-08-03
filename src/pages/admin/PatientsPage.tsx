import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppResult } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { DeletePatientDialog } from '@/features/admin/patients/components/DeletePatientDialog';
import { PatientFormModal } from '@/features/admin/patients/components/PatientFormModal';
import { PatientsTable } from '@/features/admin/patients/components/PatientsTable';
import {
  useActivatePatient,
  useCreatePatient,
  useDeletePatient,
  usePatients,
  useSetPatientPassword,
  useUpdatePatient,
} from '@/features/admin/patients/hooks/usePatients';
import type { PatientFormSchemaValues } from '@/features/admin/patients/schemas/patient-form-schema';
import type { PatientDto } from '@/features/admin/patients/types/patient';
import { AdminGeneratedPasswordModal } from '@/features/admin/password/components/AdminGeneratedPasswordModal';
import { AdminSetPasswordModal } from '@/features/admin/password/components/AdminSetPasswordModal';
import { toAdminSetPasswordRequest } from '@/features/admin/password/schemas/admin-password-schema';
import type { AdminSetPasswordRequest } from '@/features/admin/password/types/admin-password';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function PatientsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: patients = [], isLoading, isError, error, refetch } = usePatients(listFilter);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();
  const activatePatient = useActivatePatient();
  const setPatientPassword = useSetPatientPassword();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<PatientDto | null>(null);
  const [patientForPassword, setPatientForPassword] = useState<PatientDto | null>(null);
  const [activatingPatientId, setActivatingPatientId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [generatedPasswordUserName, setGeneratedPasswordUserName] = useState('');

  const openCreateForm = () => {
    setSelectedPatient(null);
    setFormMode('create');
  };

  const openEditForm = (patient: PatientDto) => {
    setSelectedPatient(patient);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedPatient(null);
  };

  const showGeneratedPassword = (password: string | null | undefined, userName: string) => {
    if (!password) {
      return;
    }

    setGeneratedPasswordUserName(userName);
    setGeneratedPassword(password);
  };

  const handleFormSubmit = async (values: PatientFormSchemaValues) => {
    const profilePayload = {
      name: values.name.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim() === '' ? null : values.email.trim(),
    };

    try {
      if (formMode === 'create') {
        const passwordPayload = toAdminSetPasswordRequest(values);
        const result = await createPatient.mutateAsync({
          ...profilePayload,
          ...passwordPayload,
        });
        closeForm();
        showGeneratedPassword(result.generatedPassword, result.patient.name);
        return;
      }

      if (formMode === 'edit' && selectedPatient) {
        await updatePatient.mutateAsync({ id: selectedPatient.id, request: profilePayload });
        closeForm();
      }
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.patients.errors.saveFailed')));
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

  const handleSetPassword = async (request: AdminSetPasswordRequest) => {
    if (!patientForPassword) {
      return;
    }

    try {
      const result = await setPatientPassword.mutateAsync({
        id: patientForPassword.id,
        request,
      });
      const userName = patientForPassword.name;
      setPatientForPassword(null);
      toast.success(t('admin.password.success'));
      showGeneratedPassword(result.generatedPassword, userName);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.password.error')));
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
        <AppResult
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
          onChangePassword={setPatientForPassword}
        />
      ) : null}

      <PatientFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        patient={selectedPatient}
        isSubmitting={isFormSubmitting}
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

      <AdminSetPasswordModal
        open={patientForPassword !== null}
        userName={patientForPassword?.name ?? ''}
        isSubmitting={setPatientPassword.isPending}
        onClose={() => setPatientForPassword(null)}
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
