import { AppEmpty } from '@/components/ui';
import { CirclePlay } from 'lucide-react';
import { Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

interface PatientExerciseLibraryCatalogProps {
  exercises: ExerciseDto[];
}

export function PatientExerciseLibraryCatalog({ exercises }: PatientExerciseLibraryCatalogProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);

  if (exercises.length === 0) {
    return <AppEmpty description={t('patient.library.empty')} />;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {exercises.map((exercise) => {
          const hasDescription = Boolean(exercise.description?.trim());
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
            <Col key={exercise.exerciseId} xs={24} sm={12} lg={8}>
              <Card className="patient-media-card exercise-card" styles={{ body: { padding: 0 } }}>
                <button
                  type="button"
                  className="library-card__media"
                  disabled={!hasVideo}
                  onClick={() => hasVideo && setSelectedExercise(exercise)}
                  aria-label={
                    hasVideo
                      ? t('patient.library.video.play', { title: exercise.title })
                      : exercise.title
                  }
                >
                  {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
                  <span className="library-card__media-overlay" aria-hidden="true">
                    {hasVideo ? <CirclePlay size={32} strokeWidth={1.75} /> : null}
                  </span>
                </button>
                <div className="library-card__body">
                  <h3 className="patient-media-card__title">{exercise.title}</h3>
                  {hasDescription ? (
                    <p className="patient-media-card__body">{exercise.description}</p>
                  ) : null}
                  {!hasDescription && !hasVideo ? (
                    <span className="patient-media-card__meta">
                      {t('patient.library.video.none')}
                    </span>
                  ) : null}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
