import { Button } from 'antd';
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
  useUpdateExercise,
} from '@/features/admin/exercises/hooks/useExercises';
import type { ExerciseFormSchemaValues } from '@/features/admin/exercises/schemas/exercise-form-schema';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

export function ExercisesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: exercises = [], isLoading, isError, error, refetch } = useExercises(listFilter);
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const activateExercise = useActivateExercise();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseDto | null>(null);
  const [activatingExerciseId, setActivatingExerciseId] = useState<string | null>(null);

  const openCreateForm = () => {
    setEditingExercise(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExercise(null);
  };

  const handleFormSubmit = async (values: ExerciseFormSchemaValues) => {
    try {
      const request = {
        title: values.title.trim(),
        description: values.description.trim(),
        instructions: values.instructions.trim(),
        bodyRegion: values.bodyRegion,
        equipment: values.equipment,
        difficulty: values.difficulty,
        mediaType: values.mediaType,
        videoUrl: values.videoUrl || null,
      };
      if (editingExercise) {
        await updateExercise.mutateAsync({
          id: editingExercise.exerciseId,
          request,
          videoFile: values.video?.[0],
        });
      } else {
        await createExercise.mutateAsync({ request, videoFile: values.video?.[0] });
      }

      toast.success(
        t(editingExercise ? 'admin.exercises.success.updated' : 'admin.exercises.success.created'),
      );
      closeForm();
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.exercises.errors.saveFailed')));
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
          onEdit={(exercise) => {
            setEditingExercise(exercise);
            setIsFormOpen(true);
          }}
        />
      ) : null}

      <ExerciseFormModal
        isOpen={isFormOpen}
        isSubmitting={createExercise.isPending || updateExercise.isPending}
        initialValues={
          editingExercise
            ? {
                ...editingExercise,
                description: editingExercise.description ?? '',
                instructions: editingExercise.instructions ?? '',
                videoUrl: editingExercise.videoUrl ?? '',
              }
            : undefined
        }
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
}
