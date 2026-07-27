import { Check, CirclePlay } from 'lucide-react';
import { Checkbox, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { formatPersianNumber } from '@/utils/persian-format';

const { Text } = Typography;

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

  const handleOpen = () => {
    if (hasMedia) {
      onPlay(exercise);
    }
  };

  return (
    <div
      className={`exercise-row touch-active${exercise.completedToday ? ' exercise-row--completed' : ''}`}
      role="group"
      aria-label={exercise.title}
    >
      {showCheckbox ? (
        <Checkbox
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => onToggle(exercise, e.target.checked)}
          className="exercise-row__check"
          aria-label={exercise.title}
        />
      ) : null}

      <button
        type="button"
        className="exercise-row__thumb"
        onClick={handleOpen}
        disabled={!hasMedia}
        aria-label={
          hasMedia ? t('patient.exercises.video.watch', { title: exercise.title }) : exercise.title
        }
      >
        {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
        <span className="exercise-row__thumb-overlay" aria-hidden="true">
          {exercise.completedToday ? (
            <span className="exercise-row__thumb-done">
              <Check size={18} strokeWidth={2.5} />
            </span>
          ) : hasMedia ? (
            <CirclePlay size={28} strokeWidth={1.75} />
          ) : null}
        </span>
      </button>

      <div className="exercise-row__body">
        <Text
          strong
          className={`exercise-row__name${exercise.completedToday ? ' exercise-row__name--done' : ''}`}
        >
          {exercise.title}
        </Text>

        <div className="exercise-row__chips">
          {exercise.sets ? (
            <span className="exercise-chip">
              <span className="exercise-chip__value">{formatCount(exercise.sets)}</span>
              <span className="exercise-chip__label">{t('patient.exercises.chip.sets')}</span>
            </span>
          ) : null}
          {exercise.reps ? (
            <span className="exercise-chip">
              <span className="exercise-chip__value">{formatReps(exercise.reps)}</span>
              <span className="exercise-chip__label">{t('patient.exercises.chip.reps')}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
