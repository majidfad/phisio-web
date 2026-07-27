import { AppResult, LoadingState, WarmEmptyState } from '@/components/ui';
import { CirclePlay } from 'lucide-react';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import { useDoctorExerciseCatalog } from '@/features/doctor/exercises/hooks/useDoctorExercises';
import { getErrorMessage } from '@/utils/get-error-message';

interface CatalogPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDto) => void;
}

export function CatalogPickerModal({ open, onClose, onSelect }: CatalogPickerModalProps) {
  const { t } = useTranslation();
  const {
    data: exercises = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorExerciseCatalog(open);
  const [previewExercise, setPreviewExercise] = useState<ExerciseDto | null>(null);

  return (
    <>
      <Modal
        title={t('doctor.exercises.addFromCatalog.title')}
        open={open}
        onCancel={onClose}
        footer={null}
        width={640}
        destroyOnHidden
        centered
      >
        {isLoading ? <LoadingState tip={t('doctor.exercises.loading')} /> : null}

        {isError ? (
          <AppResult
            status="error"
            title={getErrorMessage(error, t('doctor.exercises.errors.loadFailed'))}
            extra={
              <Button type="primary" size="large" onClick={() => void refetch()}>
                {t('doctor.exercises.retry')}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && exercises.length === 0 ? (
          <WarmEmptyState description={t('doctor.exercises.addFromCatalog.empty')} />
        ) : null}

        {!isLoading && !isError && exercises.length > 0 ? (
          <div className="catalog-picker-list">
            {exercises.map((exercise) => {
              const hasVideo = Boolean(
                getVideoPreviewSource(exercise.videoUrl, exercise.mediaType),
              );

              return (
                <div key={exercise.exerciseId} className="catalog-picker-item">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 className="catalog-picker-item__title">{exercise.title}</h4>
                    <p className="catalog-picker-item__desc">
                      {exercise.description || exercise.instructions || '—'}
                    </p>
                  </div>
                  <div className="exercise-select-item__actions">
                    {hasVideo ? (
                      <Button
                        type="text"
                        icon={<CirclePlay {...appIconProps} />}
                        aria-label={t('doctor.exercises.video.play', { title: exercise.title })}
                        onClick={() => setPreviewExercise(exercise)}
                      />
                    ) : null}
                    <Button
                      type="primary"
                      onClick={() => {
                        onSelect(exercise);
                        onClose();
                      }}
                    >
                      {t('doctor.exercises.addFromCatalog.select')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </Modal>

      <ExerciseVideoModal
        title={previewExercise?.title ?? null}
        videoUrl={previewExercise?.videoUrl}
        mediaType={previewExercise?.mediaType}
        onClose={() => setPreviewExercise(null)}
      />
    </>
  );
}
