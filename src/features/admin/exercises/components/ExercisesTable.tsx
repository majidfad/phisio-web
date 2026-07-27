import { CirclePlay } from 'lucide-react';
import { Button, Modal, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import { AppTable, WarmEmptyState, TableIconActions } from '@/components/ui';
import { getCategoryDisplayName } from '@/features/admin/exercise-categories/utils/get-category-display-name';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { formatExerciseDate } from '@/features/admin/exercises/utils/format-exercise-date';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

interface ExercisesTableProps {
  exercises: ExerciseDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingExerciseId?: string | null;
  onActivate: (exercise: ExerciseDto) => void;
  onEdit: (exercise: ExerciseDto) => void;
  onDelete: (exercise: ExerciseDto) => void;
}

export function ExercisesTable({
  exercises,
  showInactiveView,
  isActivating = false,
  activatingExerciseId = null,
  onActivate,
  onEdit,
  onDelete,
}: ExercisesTableProps) {
  const { t, i18n } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);

  const columns: ColumnsType<ExerciseDto> = [
    {
      title: t('admin.exercises.columns.title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('admin.exercises.columns.categories'),
      key: 'categories',
      width: 220,
      render: (_, exercise) =>
        exercise.categories?.length ? (
          <Space size={[4, 4]} wrap>
            {exercise.categories.map((category) => (
              <Tag key={category.exerciseCategoryId}>
                {getCategoryDisplayName(category, i18n.language)}
              </Tag>
            ))}
          </Space>
        ) : (
          <span>—</span>
        ),
    },
    {
      title: t('admin.exercises.columns.video'),
      key: 'video',
      width: 90,
      align: 'center',
      render: (_, exercise) => {
        const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

        return hasVideo ? (
          <Button
            type="text"
            className="table-icon-actions__btn table-icon-actions__btn--edit"
            icon={<CirclePlay {...denseIconProps} />}
            aria-label={t('admin.exercises.video.play', { title: exercise.title })}
            onClick={() => setSelectedExercise(exercise)}
          />
        ) : (
          <span>{t('admin.exercises.video.none')}</span>
        );
      },
    },
    {
      title: t('admin.exercises.columns.createdAt'),
      key: 'createdAt',
      width: 130,
      render: (_, exercise) => formatExerciseDate(exercise.createdAt),
    },
    {
      title: t('admin.exercises.columns.status'),
      key: 'status',
      width: 110,
      render: () =>
        showInactiveView ? (
          <Tag>{t('admin.common.status.inactive')}</Tag>
        ) : (
          <Tag color="success">{t('admin.exercises.status.active')}</Tag>
        ),
    },
    {
      title: t('admin.doctors.columns.actions'),
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, exercise) =>
        showInactiveView ? (
          <Button
            type="link"
            loading={isActivating && activatingExerciseId === exercise.exerciseId}
            onClick={() => onActivate(exercise)}
          >
            {t('admin.common.actions.activate')}
          </Button>
        ) : (
          <TableIconActions
            editLabel={t('admin.exercises.actions.edit')}
            deleteLabel={t('admin.exercises.actions.deactivate')}
            onEdit={() => onEdit(exercise)}
            onDelete={() => onDelete(exercise)}
          />
        ),
    },
  ];

  if (exercises.length === 0) {
    return (
      <WarmEmptyState
        description={t(
          showInactiveView ? 'admin.exercises.emptyInactive' : 'admin.exercises.empty',
        )}
      />
    );
  }

  return (
    <>
      <AppTable
        rowKey="exerciseId"
        columns={columns}
        dataSource={exercises}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        size="middle"
      />

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}

interface DeleteExerciseDialogProps {
  exercise: ExerciseDto | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteExerciseDialog({
  exercise,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteExerciseDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('admin.exercises.delete.title')}
      open={Boolean(exercise)}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={t('admin.exercises.delete.confirm')}
      cancelText={t('admin.exercises.delete.cancel')}
      confirmLoading={isDeleting}
      okButtonProps={{ danger: true }}
      centered
      destroyOnHidden
    >
      {t('admin.exercises.delete.message', { title: exercise?.title ?? '' })}
    </Modal>
  );
}
