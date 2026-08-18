import { Check, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { formatPersianNumber } from '@/utils/persian-format';

interface PatientExerciseListItemProps {
  exercise: PatientTodayExerciseItemDto;
  isChecked: boolean;
  isDisabled: boolean;
  showCheckbox?: boolean;
  onToggle: (exercise: PatientTodayExerciseItemDto, checked: boolean) => void;
  onPlay: (exercise: PatientTodayExerciseItemDto) => void;
}

export function PatientExerciseListItem({
  exercise,
  isChecked,
  isDisabled,
  showCheckbox = false,
  onToggle,
  onPlay,
}: PatientExerciseListItemProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('fa');
  const formatCount = (value: number) => (isRtl ? formatPersianNumber(value) : String(value));
  const formatReps = (value: string) => {
    const asNumber = Number(value);
    if (Number.isFinite(asNumber) && value.trim() !== '') {
      return formatCount(asNumber);
    }
    return value;
  };

  const hasMedia = Boolean(exercise.videoUrl);
  const preview = getVideoPreviewSource(exercise.videoUrl, exercise.mediaType);
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

  const metaParts: string[] = [];
  if (exercise.sets) {
    metaParts.push(`${formatCount(exercise.sets)} ${t('patient.exercises.chip.sets')}`);
  }
  if (exercise.reps) {
    metaParts.push(`${formatReps(exercise.reps)} ${t('patient.exercises.chip.reps')}`);
  }

  const handleOpen = () => {
    if (hasMedia) {
      onPlay(exercise);
    }
  };

  return (
    <div
      className={`exercise-row touch-active${hasMedia ? ' exercise-row--clickable' : ''}${exercise.completedToday ? ' exercise-row--completed' : ''}${isChecked ? ' exercise-row--selected' : ''}`}
      role={hasMedia ? 'button' : 'group'}
      tabIndex={hasMedia ? 0 : undefined}
      aria-label={
        hasMedia ? t('patient.exercises.video.watch', { title: exercise.title }) : exercise.title
      }
      onClick={hasMedia ? handleOpen : undefined}
      onKeyDown={
        hasMedia
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpen();
              }
            }
          : undefined
      }
    >
      {showCheckbox ? (
        <button
          type="button"
          className={`kit-select-toggle${isChecked ? ' kit-select-toggle--on' : ''}`}
          disabled={isDisabled}
          aria-pressed={isChecked}
          aria-label={exercise.title}
          onClick={(event) => {
            event.stopPropagation();
            onToggle(exercise, !isChecked);
          }}
        >
          {isChecked ? <Check size={14} strokeWidth={2.5} /> : null}
        </button>
      ) : null}

      <div className="exercise-row__thumb" aria-hidden="true">
        {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
        {exercise.completedToday ? (
          <span className="exercise-row__thumb-overlay">
            <span className="exercise-row__thumb-done">
              <Check size={18} strokeWidth={2.5} />
            </span>
          </span>
        ) : null}
      </div>

      <div className="exercise-row__body">
        <bdi
          className={`exercise-row__name${exercise.completedToday ? ' exercise-row__name--done' : ''}`}
        >
          {exercise.title}
        </bdi>
        {metaParts.length > 0 ? (
          <span className="exercise-row__meta">{metaParts.join(' · ')}</span>
        ) : null}
      </div>

      <div className="exercise-row__action" aria-hidden="true">
        {exercise.completedToday ? (
          <StatusCapsule
            status="completed"
            label={t('patient.exercises.completedToday')}
            showDot={false}
          />
        ) : hasMedia ? (
          <span className="exercise-row__play">
            <Play size={16} fill="currentColor" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
