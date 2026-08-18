import { Button, Input } from 'antd';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { AppResult, ConfirmActionModal, LoadingState, PageContainer } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { useDoctors } from '@/features/admin/doctors/hooks/useDoctors';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { useAuth } from '@/features/auth';
import { ClinicFormModal } from '@/features/clinics/components/ClinicFormModal';
import { ClinicsTable } from '@/features/clinics/components/ClinicsTable';
import {
  useClinics,
  useCreateClinic,
  useDisableClinic,
  useUpdateClinic,
} from '@/features/clinics/hooks/useClinics';
import {
  toClinicPhonePayload,
  type ClinicFormSchemaValues,
} from '@/features/clinics/schemas/clinic-form-schema';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { getClinicDetailsPath } from '@/features/clinics/utils/clinic-paths';
import { filterClinics } from '@/features/clinics/utils/filter-clinics';
import { useToast } from '@/hooks/useToast';
import { hasRequiredRole } from '@/routes/utils/role-access';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function ClinicsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = Boolean(user && hasRequiredRole(user, 'Admin'));

  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const showInactiveView = listFilter === 'inactive';

  const { data: clinics = [], isLoading, isError, error, refetch } = useClinics(listFilter);
  const createClinic = useCreateClinic();
  const updateClinic = useUpdateClinic();
  const disableClinic = useDisableClinic();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<ClinicDto | null>(null);
  const [clinicToDisable, setClinicToDisable] = useState<ClinicDto | null>(null);
  const {
    data: doctorCandidates = [],
    isLoading: isLoadingDoctors,
    isError: isDoctorsError,
    refetch: refetchDoctors,
  } = useDoctors('active', isAdmin && formMode === 'create');
  const availableDoctors = useMemo(
    () => doctorCandidates.filter((doctor) => !doctor.isClinicManager),
    [doctorCandidates],
  );

  const filteredClinics = useMemo(
    () => filterClinics(clinics, searchQuery),
    [clinics, searchQuery],
  );

  const openCreateForm = () => {
    setSelectedClinic(null);
    setFormMode('create');
  };

  const openEditForm = (clinic: ClinicDto) => {
    setSelectedClinic(clinic);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedClinic(null);
  };

  const handleFormSubmit = async (values: ClinicFormSchemaValues) => {
    const payload = {
      name: values.name.trim(),
      address: values.address.trim(),
      phoneNumbers: toClinicPhonePayload(values.phoneNumbers),
    };

    try {
      if (formMode === 'create') {
        await createClinic.mutateAsync({
          ...payload,
          ...(isAdmin ? { clinicManagerId: values.clinicManagerId?.trim() } : {}),
        });
        toast.success(t('clinics.success.created'));
        closeForm();
        return;
      }

      if (formMode === 'edit' && selectedClinic) {
        await updateClinic.mutateAsync({ id: selectedClinic.clinicId, request: payload });
        toast.success(t('clinics.success.updated'));
        closeForm();
      }
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('clinics.errors.saveFailed')));
    }
  };

  const handleDisableConfirm = async () => {
    if (!clinicToDisable) {
      return;
    }

    try {
      await disableClinic.mutateAsync(clinicToDisable.clinicId);
      toast.success(t('clinics.success.disabled'));
      setClinicToDisable(null);
    } catch (disableError) {
      toast.error(getErrorMessage(disableError, t('clinics.errors.disableFailed')));
    }
  };

  const isFormSubmitting = createClinic.isPending || updateClinic.isPending;

  return (
    <PageContainer>
      <PageHeader
        title={t('clinics.title')}
        description={t('clinics.description')}
        action={
          !showInactiveView ? (
            <PageHeaderButton label={t('clinics.addButton')} onClick={openCreateForm} />
          ) : undefined
        }
      />

      <div className="patient-filter-bar">
        <Input
          allowClear
          prefix={<Search {...appIconProps} />}
          placeholder={t('clinics.searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label={t('clinics.searchPlaceholder')}
        />
      </div>

      <AdminStatusTabs value={listFilter} onChange={setListFilter} />

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

      {!isLoading && !isError ? (
        <ClinicsTable
          clinics={filteredClinics}
          showInactiveView={showInactiveView}
          emptyDescription={
            searchQuery.trim() && clinics.length > 0 ? t('clinics.emptySearch') : undefined
          }
          isDisabling={disableClinic.isPending}
          disablingClinicId={clinicToDisable?.clinicId ?? null}
          onView={(clinic) => void navigate(getClinicDetailsPath(clinic.clinicId, user))}
          onEdit={openEditForm}
          onDisable={setClinicToDisable}
        />
      ) : null}

      <ClinicFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        clinic={selectedClinic}
        requireClinicManagerId={isAdmin}
        doctors={availableDoctors}
        isLoadingDoctors={isLoadingDoctors}
        isDoctorsError={isDoctorsError}
        isSubmitting={isFormSubmitting}
        onRetryDoctors={() => void refetchDoctors()}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <ConfirmActionModal
        open={clinicToDisable !== null}
        title={t('clinics.disable.title')}
        message={t('clinics.disable.message', { name: clinicToDisable?.name ?? '' })}
        confirmText={t('clinics.disable.confirm')}
        cancelText={t('clinics.disable.cancel')}
        confirming={disableClinic.isPending}
        onCancel={() => setClinicToDisable(null)}
        onConfirm={() => void handleDisableConfirm()}
      />
    </PageContainer>
  );
}
