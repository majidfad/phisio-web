import { Check, CirclePlay } from 'lucide-react';
import { Button, Card, Checkbox, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { appIconProps, denseIconProps } from '@/components/icons/app-icon';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';

const { Text } = Typography;

interface PatientExerciseListItemProps {
  exercise: PatientTodayExerciseItemDto;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (exercise: PatientTodayExerciseItemDto, checked: boolean) => void;
  onPlay: (exercise: PatientTodayExerciseItemDto) => void;
}

export function PatientExerciseListItem({
  exercise,
  isChecked,
  isDisabled,
  onToggle,
  onPlay,
}: PatientExerciseListItemProps) {
  const { t } = useTranslation();
  const hasMedia = Boolean(exercise.videoUrl);

  return (
    <Card
      size="small"
      className={`exercise-card touch-active${exercise.completedToday ? ' exercise-card--completed' : ''}`}
      styles={{ body: { padding: '16px 18px' } }}
      style={{ marginBottom: 12 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
          <Checkbox
            checked={isChecked}
            disabled={isDisabled}
            onChange={(e) => onToggle(exercise, e.target.checked)}
            style={{ marginTop: 4, transform: 'scale(1.15)' }}
            aria-label={exercise.title}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text
                strong
                style={{
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: exercise.completedToday ? 'var(--phisio-text-secondary)' : undefined,
                }}
              >
                {exercise.title}
              </Text>
              {exercise.completedToday ? (
                <Tag
                  color="success"
                  icon={<Check {...denseIconProps} />}
                  style={{ marginInlineEnd: 0 }}
                >
                  {t('patient.exercises.completedToday')}
                </Tag>
              ) : null}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 10,
              }}
            >
              {exercise.sets ? (
                <Tag className="exercise-dosage-chip">
                  {t('patient.exercises.dosage.sets', { count: exercise.sets })}
                </Tag>
              ) : null}
              {exercise.reps ? (
                <Tag className="exercise-dosage-chip">
                  {t('patient.exercises.dosage.reps', { count: exercise.reps })}
                </Tag>
              ) : null}
              {exercise.holdSeconds ? (
                <Tag className="exercise-dosage-chip">
                  {t('patient.exercises.dosage.hold', { count: exercise.holdSeconds })}
                </Tag>
              ) : null}
              {exercise.restSeconds ? (
                <Tag className="exercise-dosage-chip">
                  {t('patient.exercises.dosage.rest', { count: exercise.restSeconds })}
                </Tag>
              ) : null}
              {exercise.side ? (
                <Tag className="exercise-dosage-chip">
                  {t(`exerciseMeta.side.${exercise.side}`)}
                </Tag>
              ) : null}
            </div>

            {exercise.patientCue ? (
              <Text
                type="secondary"
                style={{ display: 'block', marginTop: 10, fontSize: 13, lineHeight: 1.5 }}
              >
                {exercise.patientCue}
              </Text>
            ) : null}
          </div>
        </div>

        {hasMedia ? (
          <Button
            type="default"
            icon={<CirclePlay {...appIconProps} />}
            onClick={() => onPlay(exercise)}
            className="touch-target exercise-play-button"
            aria-label={t('patient.exercises.video.watch', { title: exercise.title })}
          >
            {t('patient.exercises.video.watchLabel')}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
