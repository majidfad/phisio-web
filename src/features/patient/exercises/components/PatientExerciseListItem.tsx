import { Check, CirclePlay } from 'lucide-react';
import { Button, Checkbox, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';

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
  showCheckbox = true,
  onToggle,
  onPlay,
}: PatientExerciseListItemProps) {
  const { t } = useTranslation();
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

  const dosageLine = useMemo(() => {
    const parts: string[] = [];
    if (exercise.sets) {
      parts.push(t('patient.exercises.dosage.sets', { count: exercise.sets }));
    }
    if (exercise.reps) {
      parts.push(t('patient.exercises.dosage.reps', { count: exercise.reps }));
    }
    if (exercise.holdSeconds) {
      parts.push(t('patient.exercises.dosage.hold', { count: exercise.holdSeconds }));
    }
    if (exercise.restSeconds) {
      parts.push(t('patient.exercises.dosage.rest', { count: exercise.restSeconds }));
    }
    if (exercise.side) {
      parts.push(t(`exerciseMeta.side.${exercise.side}`));
    }
    return parts.join(' · ');
  }, [exercise, t]);

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

      {thumbSrc ? (
        <button
          type="button"
          className="exercise-row__thumb"
          onClick={() => onPlay(exercise)}
          aria-label={t('patient.exercises.video.watch', { title: exercise.title })}
        >
          <img src={thumbSrc} alt="" />
        </button>
      ) : null}

      <div className="exercise-row__body">
        <div className="exercise-row__title">
          <Text
            strong
            style={{
              fontSize: 15,
              lineHeight: 1.45,
              color: exercise.completedToday ? 'var(--phisio-text-secondary)' : undefined,
            }}
          >
            {exercise.title}
          </Text>
          {exercise.completedToday ? (
            <span className="exercise-row__done">
              <Check size={14} strokeWidth={2.5} aria-hidden />
              {t('patient.exercises.completedToday')}
            </span>
          ) : null}
        </div>

        {dosageLine ? (
          <Text type="secondary" className="exercise-row__dosage">
            {dosageLine}
          </Text>
        ) : null}

        {exercise.patientCue ? (
          <Text type="secondary" className="exercise-row__cue">
            {exercise.patientCue}
          </Text>
        ) : null}
      </div>

      {hasMedia ? (
        <Button
          type="text"
          icon={<CirclePlay {...appIconProps} />}
          onClick={() => onPlay(exercise)}
          className="touch-target exercise-row__play"
          aria-label={t('patient.exercises.video.watch', { title: exercise.title })}
        />
      ) : null}
    </div>
  );
}
