import { Archive, CirclePlay, Pencil } from 'lucide-react';
import { StatusCapsule } from '@/components/ui';
import { Button, Card } from 'antd';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';

interface DoctorExerciseCardProps {
  exercise: DoctorExerciseDto;
  onPlay: (exercise: DoctorExerciseDto) => void;
  onEdit?: (exercise: DoctorExerciseDto) => void;
  onArchive?: (exercise: DoctorExerciseDto) => void;
}

export function DoctorExerciseCard({
  exercise,
  onPlay,
  onEdit,
  onArchive,
}: DoctorExerciseCardProps) {
  const { t } = useTranslation();
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
    <Card className="patient-media-card exercise-card" styles={{ body: { padding: 0 } }}>
      <button
        type="button"
        className="library-card__media"
        disabled={!hasVideo}
        onClick={() => hasVideo && onPlay(exercise)}
        aria-label={
          hasVideo ? t('doctor.exercises.video.play', { title: exercise.title }) : exercise.title
        }
      >
        {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
        <span className="library-card__media-overlay" aria-hidden="true">
          {hasVideo ? <CirclePlay size={32} strokeWidth={1.75} /> : null}
        </span>
      </button>

      <div className="library-card__body">
        <div className="patient-media-card__header">
          <h3 className="patient-media-card__title">{exercise.title}</h3>
          <div className="doctor-exercise-card__actions">
            <Button
              type="text"
              icon={<Pencil {...appIconProps} />}
              aria-label={t('doctor.exercises.editTexts.submit')}
              onClick={() => onEdit?.(exercise)}
            />
            <Button
              type="text"
              danger
              icon={<Archive {...appIconProps} />}
              aria-label={t('admin.exercises.actions.deactivate')}
              onClick={() => onArchive?.(exercise)}
            />
          </div>
        </div>

        {hasDescription ? <p className="patient-media-card__body">{exercise.description}</p> : null}

        <div className="exercise-row__chips doctor-overview__chips">
          <span className="exercise-meta-chip">
            {t(`exerciseMeta.equipment.${exercise.equipment}`)}
          </span>
          <StatusCapsule
            status="info"
            showDot={false}
            label={t(`exerciseMeta.difficulty.${exercise.difficulty}`)}
          />
        </div>
      </div>
    </Card>
  );
}
