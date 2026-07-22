import { AppEmpty } from '@/components/ui';
import { CirclePlay } from 'lucide-react';
import { Button, Checkbox, List, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

const { Text } = Typography;

interface ExerciseSelectionListProps {
  exercises: ExerciseDto[];
  selectedExerciseIds: ReadonlySet<string>;
  assignedExerciseIds?: ReadonlySet<string>;
  allowAssignedSelection?: boolean;
  onToggle: (exerciseId: string, checked: boolean) => void;
}

export function ExerciseSelectionList({
  exercises,
  selectedExerciseIds,
  assignedExerciseIds = new Set<string>(),
  allowAssignedSelection = false,
  onToggle,
}: ExerciseSelectionListProps) {
  const { t } = useTranslation();
  const [previewExercise, setPreviewExercise] = useState<ExerciseDto | null>(null);

  if (exercises.length === 0) {
    return <AppEmpty description={t('doctor.patients.exercisePlan.add.empty')} />;
  }

  return (
    <>
      <List
        dataSource={exercises}
        renderItem={(exercise) => {
          const isAssigned =
            !allowAssignedSelection && assignedExerciseIds.has(exercise.exerciseId);
          const isSelected = selectedExerciseIds.has(exercise.exerciseId);
          const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

          return (
            <List.Item
              style={{
                opacity: isAssigned ? 0.6 : 1,
                padding: '12px 0',
              }}
              actions={[
                hasVideo ? (
                  <Button
                    key="play"
                    type="text"
                    icon={<CirclePlay {...appIconProps} />}
                    aria-label={t('doctor.patients.exercisePlan.video.play', {
                      title: exercise.title,
                    })}
                    onClick={() => setPreviewExercise(exercise)}
                  />
                ) : (
                  <Text key="no-video" type="secondary">
                    {t('doctor.patients.exercisePlan.video.none')}
                  </Text>
                ),
                isAssigned ? (
                  <Tag key="assigned">{t('doctor.patients.exercisePlan.add.alreadyAssigned')}</Tag>
                ) : null,
              ]}
            >
              <Checkbox
                checked={isSelected}
                disabled={isAssigned}
                onChange={(event) => onToggle(exercise.exerciseId, event.target.checked)}
              >
                <Space>
                  <Text>{exercise.title}</Text>
                </Space>
              </Checkbox>
            </List.Item>
          );
        }}
      />

      <ExerciseVideoModal
        title={previewExercise?.title ?? null}
        videoUrl={previewExercise?.videoUrl}
        onClose={() => setPreviewExercise(null)}
      />
    </>
  );
}
