import { WarmEmptyState } from '@/components/ui';
import { CirclePlay } from 'lucide-react';
import { Button, Checkbox, Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

interface ExerciseSelectionListProps {
  exercises: DoctorExerciseDto[];
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
  const [previewExercise, setPreviewExercise] = useState<DoctorExerciseDto | null>(null);

  if (exercises.length === 0) {
    return <WarmEmptyState description={t('doctor.patients.exercisePlan.add.empty')} />;
  }

  return (
    <>
      <div className="patient-stack">
        {exercises.map((exercise) => {
          const isAssigned =
            !allowAssignedSelection && assignedExerciseIds.has(exercise.exerciseId);
          const isSelected = selectedExerciseIds.has(exercise.exerciseId);
          const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl, exercise.mediaType));

          return (
            <div
              key={exercise.exerciseId}
              className={`exercise-select-item${isAssigned ? ' exercise-select-item--assigned' : ''}`}
            >
              <div className="exercise-select-item__main">
                <Checkbox
                  checked={isSelected}
                  disabled={isAssigned}
                  onChange={(event) => onToggle(exercise.exerciseId, event.target.checked)}
                >
                  <span className="exercise-select-item__title">{exercise.title}</span>
                </Checkbox>
              </div>

              <div className="exercise-select-item__actions">
                {isAssigned ? (
                  <Tag>{t('doctor.patients.exercisePlan.add.alreadyAssigned')}</Tag>
                ) : null}
                {hasVideo ? (
                  <Button
                    type="text"
                    icon={<CirclePlay {...appIconProps} />}
                    aria-label={t('doctor.patients.exercisePlan.video.play', {
                      title: exercise.title,
                    })}
                    onClick={() => setPreviewExercise(exercise)}
                  />
                ) : (
                  <span className="doctor-history-patient__label">
                    {t('doctor.patients.exercisePlan.video.none')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ExerciseVideoModal
        title={previewExercise?.title ?? null}
        videoUrl={previewExercise?.videoUrl}
        mediaType={previewExercise?.mediaType}
        onClose={() => setPreviewExercise(null)}
      />
    </>
  );
}
