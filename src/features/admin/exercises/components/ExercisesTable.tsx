import { CirclePlay } from 'lucide-react';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import { AppTable, AppEmpty } from '@/components/ui';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { formatExerciseDate } from '@/features/admin/exercises/utils/format-exercise-date';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

interface ExercisesTableProps {
  exercises: ExerciseDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingExerciseId?: string | null;
  onActivate: (exercise: ExerciseDto) => void;
}

export function ExercisesTable({
  exercises,
  showInactiveView,
  isActivating = false,
  activatingExerciseId = null,
  onActivate,
}: ExercisesTableProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);

  const columns: ColumnsType<ExerciseDto> = [
    {
      title: t('admin.exercises.columns.title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
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
    ...(showInactiveView
      ? [
          {
            title: t('admin.doctors.columns.actions'),
            key: 'actions',
            width: 120,
            align: 'center' as const,
            render: (_: unknown, exercise: ExerciseDto) => (
              <Button
                type="link"
                loading={isActivating && activatingExerciseId === exercise.exerciseId}
                onClick={() => onActivate(exercise)}
              >
                {t('admin.common.actions.activate')}
              </Button>
            ),
          },
        ]
      : []),
  ];

  if (exercises.length === 0) {
    return (
      <AppEmpty
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
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
