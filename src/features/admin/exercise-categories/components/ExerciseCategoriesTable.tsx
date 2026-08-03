import { Button, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable, StatusCapsule, TableIconActions, AppEmpty } from '@/components/ui';
import type { ExerciseCategoryDto } from '@/features/admin/exercise-categories/types/exercise-category';
import { getCategoryDisplayName } from '@/features/admin/exercise-categories/utils/get-category-display-name';
import { formatPersianDate } from '@/utils/persian-format';

interface ExerciseCategoriesTableProps {
  categories: ExerciseCategoryDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingCategoryId?: string | null;
  onEdit: (category: ExerciseCategoryDto) => void;
  onDelete: (category: ExerciseCategoryDto) => void;
  onActivate: (category: ExerciseCategoryDto) => void;
}

export function ExerciseCategoriesTable({
  categories,
  showInactiveView,
  isActivating = false,
  activatingCategoryId = null,
  onEdit,
  onDelete,
  onActivate,
}: ExerciseCategoriesTableProps) {
  const { t, i18n } = useTranslation();

  const columns: ColumnsType<ExerciseCategoryDto> = [
    {
      title: t('admin.exerciseCategories.columns.name'),
      key: 'name',
      ellipsis: true,
      render: (_, category) => getCategoryDisplayName(category, i18n.language),
    },
    {
      title: t('admin.exerciseCategories.columns.nameFa'),
      dataIndex: 'nameFa',
      key: 'nameFa',
      ellipsis: true,
    },
    {
      title: t('admin.exerciseCategories.columns.nameEn'),
      dataIndex: 'nameEn',
      key: 'nameEn',
      ellipsis: true,
    },
    {
      title: t('admin.exerciseCategories.columns.sortOrder'),
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
    },
    {
      title: t('admin.exerciseCategories.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (value: string) => formatPersianDate(value),
    },
    ...(showInactiveView
      ? [
          {
            title: t('admin.exerciseCategories.columns.status'),
            key: 'status',
            width: 120,
            render: () => (
              <StatusCapsule status="cancelled" label={t('admin.common.status.inactive')} showDot={false} />
            ),
          } as ColumnsType<ExerciseCategoryDto>[number],
        ]
      : []),
    {
      title: t('admin.exerciseCategories.columns.actions'),
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, category) =>
        showInactiveView ? (
          <Button
            type="link"
            loading={isActivating && activatingCategoryId === category.exerciseCategoryId}
            onClick={() => onActivate(category)}
          >
            {t('admin.common.actions.activate')}
          </Button>
        ) : (
          <TableIconActions
            editLabel={t('admin.exerciseCategories.actions.edit')}
            deleteLabel={t('admin.exerciseCategories.actions.delete')}
            onEdit={() => onEdit(category)}
            onDelete={() => onDelete(category)}
          />
        ),
    },
  ];

  return (
    <AppTable
      rowKey="exerciseCategoryId"
      columns={columns}
      dataSource={categories}
      locale={{
        emptyText: (
          <AppEmpty
            description={
              showInactiveView
                ? t('admin.exerciseCategories.emptyInactive')
                : t('admin.exerciseCategories.empty')
            }
          />
        ),
      }}
    />
  );
}

interface DeleteExerciseCategoryDialogProps {
  category: ExerciseCategoryDto | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteExerciseCategoryDialog({
  category,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteExerciseCategoryDialogProps) {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      title={t('admin.exerciseCategories.delete.title')}
      open={Boolean(category)}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={t('admin.exerciseCategories.delete.confirm')}
      cancelText={t('admin.exerciseCategories.delete.cancel')}
      confirmLoading={isDeleting}
      okButtonProps={{ danger: true }}
      centered
      destroyOnHidden
    >
      {t('admin.exerciseCategories.delete.message', {
        name: category ? getCategoryDisplayName(category, i18n.language) : '',
      })}
    </Modal>
  );
}
