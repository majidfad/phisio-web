import { Check, Play } from 'lucide-react';
import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StatusCapsule, WarmEmptyState } from '@/components/ui';
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
      <div className="exercise-list" role="list">
        {exercises.map((exercise) => {
          const isAssigned =
            !allowAssignedSelection && assignedExerciseIds.has(exercise.exerciseId);
          const isSelected = selectedExerciseIds.has(exercise.exerciseId);
          const preview = getVideoPreviewSource(exercise.videoUrl, exercise.mediaType);
          const hasVideo = Boolean(preview);
          const youtubeId =
            preview?.kind === 'iframe' && preview.src.includes('/embed/')
              ? (preview.src.split('/embed/')[1]?.split(/[?/]/)[0] ?? null)
              : null;
          const thumbSrc =
            preview?.kind === 'image'
              ? preview.src
              : youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : null;

          return (
            <div
              key={exercise.exerciseId}
              role="listitem"
              className={`exercise-row${isSelected ? ' exercise-row--selected' : ''}${isAssigned ? ' exercise-row--completed' : ''}`}
            >
              <button
                type="button"
                className={`kit-select-toggle${isSelected ? ' kit-select-toggle--on' : ''}`}
                disabled={isAssigned}
                aria-pressed={isSelected}
                aria-label={exercise.title}
                onClick={() => onToggle(exercise.exerciseId, !isSelected)}
              >
                {isSelected ? <Check size={14} strokeWidth={2.5} /> : null}
              </button>

              <button
                type="button"
                className="exercise-row__thumb"
                disabled={!hasVideo}
                onClick={() => hasVideo && setPreviewExercise(exercise)}
                aria-label={
                  hasVideo
                    ? t('doctor.patients.exercisePlan.video.play', { title: exercise.title })
                    : exercise.title
                }
              >
                {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
              </button>

              <div className="exercise-row__body">
                <bdi className="exercise-row__name">{exercise.title}</bdi>
                {isAssigned ? (
                  <StatusCapsule
                    status="info"
                    showDot={false}
                    label={t('doctor.patients.exercisePlan.add.alreadyAssigned')}
                  />
                ) : (
                  <span className="exercise-row__meta">
                    {t(`exerciseMeta.difficulty.${exercise.difficulty}`, {
                      defaultValue: String(exercise.difficulty),
                    })}
                  </span>
                )}
              </div>

              <div className="exercise-row__action">
                {hasVideo ? (
                  <Button
                    type="primary"
                    shape="circle"
                    className="exercise-row__play"
                    icon={<Play size={16} fill="currentColor" />}
                    aria-label={t('doctor.patients.exercisePlan.video.play', {
                      title: exercise.title,
                    })}
                    onClick={() => setPreviewExercise(exercise)}
                  />
                ) : null}
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
