import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer, AppResult } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import { ExerciseCategoryFormModal } from '@/features/admin/exercise-categories/components/ExerciseCategoryFormModal';
import {
  DeleteExerciseCategoryDialog,
  ExerciseCategoriesTable,
} from '@/features/admin/exercise-categories/components/ExerciseCategoriesTable';
import {
  useActivateExerciseCategory,
  useCreateExerciseCategory,
  useDeleteExerciseCategory,
  useExerciseCategories,
  useUpdateExerciseCategory,
} from '@/features/admin/exercise-categories/hooks/useExerciseCategories';
import type { ExerciseCategoryFormSchemaValues } from '@/features/admin/exercise-categories/schemas/exercise-category-form-schema';
import type { ExerciseCategoryDto } from '@/features/admin/exercise-categories/types/exercise-category';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function ExerciseCategoriesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: categories = [], isLoading, isError, error, refetch } =
    useExerciseCategories(listFilter);
  const createCategory = useCreateExerciseCategory();
  const updateCategory = useUpdateExerciseCategory();
  const deleteCategory = useDeleteExerciseCategory();
  const activateCategory = useActivateExerciseCategory();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategoryDto | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ExerciseCategoryDto | null>(null);
  const [activatingCategoryId, setActivatingCategoryId] = useState<string | null>(null);

  const openCreateForm = () => {
    setSelectedCategory(null);
    setFormMode('create');
  };

  const openEditForm = (category: ExerciseCategoryDto) => {
    setSelectedCategory(category);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedCategory(null);
  };

  const handleFormSubmit = async (values: ExerciseCategoryFormSchemaValues) => {
    const payload = {
      nameFa: values.nameFa.trim(),
      nameEn: values.nameEn.trim(),
      sortOrder: values.sortOrder,
    };

    try {
      if (formMode === 'create') {
        await createCategory.mutateAsync(payload);
      } else if (formMode === 'edit' && selectedCategory) {
        await updateCategory.mutateAsync({
          id: selectedCategory.exerciseCategoryId,
          request: payload,
        });
      }
      closeForm();
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('admin.exerciseCategories.errors.saveFailed')));
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(categoryToDelete.exerciseCategoryId);
      setCategoryToDelete(null);
    } catch {
      // Keep dialog open.
    }
  };

  const handleActivate = async (category: ExerciseCategoryDto) => {
    setActivatingCategoryId(category.exerciseCategoryId);
    try {
      await activateCategory.mutateAsync(category.exerciseCategoryId);
    } finally {
      setActivatingCategoryId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.exerciseCategories.title')}
        description={t('admin.exerciseCategories.description')}
        action={
          showInactiveView ? undefined : (
            <PageHeaderButton
              label={t('admin.exerciseCategories.addButton')}
              onClick={openCreateForm}
            />
          )
        }
      />

      <AdminStatusTabs value={listFilter} onChange={setListFilter} />

      {isLoading ? <LoadingState tip={t('admin.exerciseCategories.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('admin.exerciseCategories.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.exerciseCategories.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <ExerciseCategoriesTable
          categories={categories}
          showInactiveView={showInactiveView}
          isActivating={activateCategory.isPending}
          activatingCategoryId={activatingCategoryId}
          onEdit={openEditForm}
          onDelete={setCategoryToDelete}
          onActivate={(category) => void handleActivate(category)}
        />
      ) : null}

      <ExerciseCategoryFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        category={selectedCategory}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteExerciseCategoryDialog
        category={categoryToDelete}
        isDeleting={deleteCategory.isPending}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </PageContainer>
  );
}
