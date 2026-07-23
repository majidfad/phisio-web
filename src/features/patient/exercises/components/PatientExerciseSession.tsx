import { Button, Progress, Space, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseMediaPlayer } from '@/features/patient/exercises/components/ExerciseMediaPlayer';
import { useWorkoutSetTimer } from '@/features/patient/exercises/hooks/useWorkoutSetTimer';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

const { Text, Title, Paragraph } = Typography;

interface PatientExerciseSessionProps {
  open: boolean;
  doctorName: string;
  exercises: PatientTodayExerciseItemDto[];
  onClose: () => void;
  onExerciseCompleted: () => Promise<unknown>;
  onSessionFinishedWithCompletions: (completedCount: number) => void;
}

export function PatientExerciseSession({
  open,
  doctorName,
  exercises,
  onClose,
  onExerciseCompleted,
  onSessionFinishedWithCompletions,
}: PatientExerciseSessionProps) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [index, setIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setIndex(0);
      setCompletedCount(0);
      setIsCompleting(false);
      setExerciseKey(0);
    }
  }

  const formatCount = (value: number) =>
    i18n.language.startsWith('fa') ? formatPersianNumber(value) : String(value);

  const current = exercises[index] ?? null;
  const total = exercises.length;
  const isLast = index >= total - 1;
  const progressPercent =
    total > 0 ? Math.round(((index + (current ? 0.35 : 0)) / total) * 100) : 0;
  const totalSets = Math.max(current?.sets ?? 1, 1);

  const finishSession = (didCompleteAny: boolean, count: number) => {
    onClose();
    if (didCompleteAny) {
      onSessionFinishedWithCompletions(count);
    }
  };

  const advanceOrFinish = (nextCompletedCount: number) => {
    if (isLast || total === 0) {
      finishSession(nextCompletedCount > 0, nextCompletedCount);
      return;
    }
    setIndex((value) => value + 1);
    setExerciseKey((value) => value + 1);
  };

  const handleMarkDone = async () => {
    if (!current || isCompleting) {
      return;
    }

    setIsCompleting(true);
    try {
      await patientExerciseService.completeExercises({
        userExerciseIds: [current.userExerciseId],
      });
      const nextCompletedCount = completedCount + 1;
      setCompletedCount(nextCompletedCount);
      await onExerciseCompleted();
      advanceOrFinish(nextCompletedCount);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.exercises.errors.completionFailed')));
    } finally {
      setIsCompleting(false);
    }
  };

  const timer = useWorkoutSetTimer({
    holdSeconds: current?.holdSeconds ?? null,
    restSeconds: current?.restSeconds ?? null,
    totalSets,
    enabled: open && Boolean(current) && !isCompleting,
    resetKey: `${current?.userExerciseId ?? 'none'}-${exerciseKey}`,
    onExerciseComplete: () => {
      void handleMarkDone();
    },
  });

  const handleSkip = () => {
    if (isCompleting) {
      return;
    }
    advanceOrFinish(completedCount);
  };

  const handleExit = () => {
    if (isCompleting) {
      return;
    }
    finishSession(completedCount > 0, completedCount);
  };

  if (!open) {
    return null;
  }

  const timerLabel =
    timer.phase === 'rest'
      ? t('patient.exercises.session.restPhase')
      : t('patient.exercises.session.holdPhase');

  return (
    <div className="workout-session" role="dialog" aria-modal="true">
      <header className="workout-session__header">
        <div>
          <Text type="secondary" className="workout-session__doctor">
            {t('patient.exercises.session.withDoctor', { doctorName })}
          </Text>
          <Text className="workout-session__progress-label">
            {t('patient.exercises.session.progress', {
              current: formatCount(Math.min(index + 1, total)),
              total: formatCount(total),
            })}
          </Text>
        </div>
        <Button type="text" onClick={handleExit} disabled={isCompleting}>
          {t('patient.exercises.session.exit')}
        </Button>
      </header>

      <Progress
        percent={progressPercent}
        showInfo={false}
        strokeColor="var(--phisio-primary)"
        trailColor="var(--phisio-border)"
        strokeWidth={6}
        style={{ marginBottom: 12 }}
      />

      {total === 0 || !current ? (
        <Text type="secondary">{t('patient.exercises.session.allDone')}</Text>
      ) : (
        <div key={`${current.userExerciseId}-${exerciseKey}`} className="workout-session__body">
          <div className="workout-session__media">
            <ExerciseMediaPlayer
              title={current.title}
              videoUrl={current.videoUrl}
              mediaType={current.mediaType}
              autoPlay
              maxHeight="34vh"
            />
          </div>

          <Title level={3} className="workout-session__title">
            {current.title}
          </Title>

          <div
            className="workout-session__stats"
            aria-label={t('patient.exercises.session.dosage')}
          >
            <div className="workout-stat">
              <span className="workout-stat__value">{formatCount(timer.currentSet)}</span>
              <span className="workout-stat__label">
                {t('patient.exercises.session.setOf', { total: formatCount(totalSets) })}
              </span>
            </div>
            {current.reps ? (
              <div className="workout-stat">
                <span className="workout-stat__value">{current.reps}</span>
                <span className="workout-stat__label">{t('patient.exercises.session.reps')}</span>
              </div>
            ) : null}
            {current.holdSeconds ? (
              <div className="workout-stat">
                <span className="workout-stat__value">{formatCount(current.holdSeconds)}</span>
                <span className="workout-stat__label">{t('patient.exercises.session.hold')}</span>
              </div>
            ) : null}
            {current.restSeconds ? (
              <div className="workout-stat">
                <span className="workout-stat__value">{formatCount(current.restSeconds)}</span>
                <span className="workout-stat__label">{t('patient.exercises.session.rest')}</span>
              </div>
            ) : null}
            {current.side ? (
              <div className="workout-stat">
                <span className="workout-stat__value">
                  {t(`exerciseMeta.side.${current.side}`)}
                </span>
                <span className="workout-stat__label">{t('patient.exercises.session.side')}</span>
              </div>
            ) : null}
          </div>

          {timer.secondsLeft !== null ? (
            <div className={`workout-timer workout-timer--${timer.phase}`}>
              <Text className="workout-timer__label">{timerLabel}</Text>
              <div className="workout-timer__ring" aria-live="polite">
                {formatCount(timer.secondsLeft)}
              </div>
              <Button type="link" onClick={timer.skipTimer} disabled={isCompleting}>
                {t('patient.exercises.session.skipTimer')}
              </Button>
            </div>
          ) : (
            <div className="workout-timer workout-timer--manual">
              <Text type="secondary">
                {t('patient.exercises.session.setHint', {
                  set: formatCount(timer.currentSet),
                  total: formatCount(totalSets),
                })}
              </Text>
            </div>
          )}

          {current.patientCue ? (
            <Paragraph className="workout-session__cue">{current.patientCue}</Paragraph>
          ) : null}
          {current.instructions ? (
            <Paragraph type="secondary" className="workout-session__instructions">
              {current.instructions}
            </Paragraph>
          ) : null}

          <Space direction="vertical" size={10} className="workout-session__actions">
            {timer.secondsLeft === null ? (
              <Button
                type="primary"
                size="large"
                block
                loading={isCompleting}
                onClick={timer.completeSetManually}
                className="touch-target"
              >
                {timer.currentSet >= totalSets
                  ? t('patient.exercises.session.markDone')
                  : t('patient.exercises.session.completeSet')}
              </Button>
            ) : null}
            <Button size="large" block disabled={isCompleting} onClick={handleSkip}>
              {t('patient.exercises.session.skip')}
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}
