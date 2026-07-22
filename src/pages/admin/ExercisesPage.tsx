import { Alert, Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppResult } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { ExerciseFormModal } from '@/features/admin/exercises/components/ExerciseFormModal';
import { ExercisesTable } from '@/features/admin/exercises/components/ExercisesTable';
import {
  useActivateExercise,
  useCreateExercise,
  useExercises,
} from '@/features/admin/exercises/hooks/useExercises';
import type { ExerciseFormSchemaValues } from '@/features/admin/exercises/schemas/exercise-form-schema';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { getErrorMessage } from '@/utils/get-error-message';

export function ExercisesPage() {
  const { t } = useTranslation();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: exercises = [], isLoading, isError, error, refetch } = useExercises(listFilter);
  const createExercise = useCreateExercise();
  const activateExercise = useActivateExercise();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activatingExerciseId, setActivatingExerciseId] = useState<string | null>(null);

  const openCreateForm = () => {
    setFormError(null);
    setSuccessMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (values: ExerciseFormSchemaValues) => {
    setFormError(null);
    setSuccessMessage(null);

    const videoFile = values.video[0];

    if (!videoFile) {
      setFormError(t('admin.exercises.validation.videoRequired'));
      return;
    }

    try {
      await createExercise.mutateAsync({
        name: values.name.trim(),
        videoFile,
      });

      setSuccessMessage(t('admin.exercises.success.created'));
      closeForm();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, t('admin.exercises.errors.saveFailed')));
    }
  };

  const handleActivate = async (exercise: ExerciseDto) => {
    setActivatingExerciseId(exercise.exerciseId);

    try {
      await activateExercise.mutateAsync(exercise.exerciseId);
    } catch {
      // Error surfaced via query refetch state if needed.
    } finally {
      setActivatingExerciseId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.exercises.title')}
        description={t('admin.exercises.description')}
        action={
          !showInactiveView ? (
            <PageHeaderButton label={t('admin.exercises.addButton')} onClick={openCreateForm} />
          ) : undefined
        }
      />

      <AdminStatusTabs value={listFilter} onChange={setListFilter} />

      {successMessage ? (
        <Alert type="success" message={successMessage} showIcon style={{ marginBottom: 16 }} />
      ) : null}

      {isLoading ? <LoadingState tip={t('admin.exercises.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('admin.exercises.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.exercises.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <ExercisesTable
          exercises={exercises}
          showInactiveView={showInactiveView}
          isActivating={activateExercise.isPending}
          activatingExerciseId={activatingExerciseId}
          onActivate={(exercise) => void handleActivate(exercise)}
        />
      ) : null}

      <ExerciseFormModal
        isOpen={isFormOpen}
        isSubmitting={createExercise.isPending}
        submitError={formError}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
}
