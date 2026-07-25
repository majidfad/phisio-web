import { ArrowLeft, ArrowRight, Check, Info, X } from 'lucide-react';
import { Button, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseMediaPlayer } from '@/features/patient/exercises/components/ExerciseMediaPlayer';
import { useWorkoutSetTimer } from '@/features/patient/exercises/hooks/useWorkoutSetTimer';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

const { Text, Paragraph } = Typography;

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
  const [infoOpen, setInfoOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setIndex(0);
      setCompletedCount(0);
      setIsCompleting(false);
      setExerciseKey(0);
      setInfoOpen(false);
    }
  }

  const isRtl = i18n.language.startsWith('fa');
  const formatCount = (value: number) => (isRtl ? formatPersianNumber(value) : String(value));

  const current = exercises[index] ?? null;
  const total = exercises.length;
  const isLast = index >= total - 1;
  const isFirst = index <= 0;
  const totalSets = Math.max(current?.sets ?? 1, 1);
  const hasInfo = Boolean(current?.instructions?.trim() || current?.patientCue?.trim());

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
    setInfoOpen(false);
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

  const handleNext = () => {
    if (isCompleting) {
      return;
    }
    advanceOrFinish(completedCount);
  };

  const handlePrev = () => {
    if (isCompleting || isFirst) {
      return;
    }
    setInfoOpen(false);
    setIndex((value) => Math.max(0, value - 1));
    setExerciseKey((value) => value + 1);
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

  const resting = timer.phase === 'rest' && timer.secondsLeft !== null;
  const holding = timer.phase === 'work' && timer.secondsLeft !== null;
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;

  const progressDots = (
    <div
      className="workout-session__dots"
      role="status"
      aria-label={t('patient.exercises.session.progress', {
        current: formatCount(Math.min(index + 1, total)),
        total: formatCount(total),
      })}
    >
      {Array.from({ length: total }, (_, dotIndex) => (
        <span
          key={dotIndex}
          className={
            dotIndex === index
              ? 'workout-session__dot workout-session__dot--active'
              : dotIndex < index
                ? 'workout-session__dot workout-session__dot--done'
                : 'workout-session__dot'
          }
        />
      ))}
    </div>
  );

  if (resting) {
    return (
      <div
        className="workout-session workout-session--overlay workout-session--rest"
        role="dialog"
        aria-modal="true"
      >
        <header className="workout-session__chrome workout-session__chrome--top">
          <button
            type="button"
            className="workout-session__glass-btn"
            onClick={handleExit}
            disabled={isCompleting}
            aria-label={t('patient.exercises.session.exit')}
          >
            <X size={20} strokeWidth={1.75} />
          </button>
          {progressDots}
          <span className="workout-session__glass-spacer" aria-hidden="true" />
        </header>

        <div className="workout-session__rest-screen" aria-live="polite">
          <span className="workout-session__rest-label">
            {t('patient.exercises.session.restPhase')}
          </span>
          <div className="workout-session__count">{formatCount(timer.secondsLeft ?? 0)}</div>
          <button
            type="button"
            className="workout-session__text-action"
            onClick={timer.skipTimer}
            disabled={isCompleting}
          >
            {t('patient.exercises.session.skipTimer')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-session workout-session--overlay" role="dialog" aria-modal="true">
      {total === 0 || !current ? (
        <Text type="secondary" className="workout-session__empty">
          {t('patient.exercises.session.allDone')}
        </Text>
      ) : (
        <div
          key={`${current.userExerciseId}-${exerciseKey}`}
          className="workout-session__stage workout-session__stage--enter"
        >
          <div className="workout-session__media">
            <ExerciseMediaPlayer
              title={current.title}
              videoUrl={current.videoUrl}
              mediaType={current.mediaType}
              continuous
              className="workout-session__media-el"
            />
          </div>

          <header className="workout-session__chrome workout-session__chrome--top">
            <button
              type="button"
              className="workout-session__glass-btn"
              onClick={handleExit}
              disabled={isCompleting}
              aria-label={t('patient.exercises.session.exit')}
            >
              <X size={20} strokeWidth={1.75} />
            </button>
            {progressDots}
            {hasInfo ? (
              <button
                type="button"
                className="workout-session__glass-btn"
                onClick={() => setInfoOpen(true)}
                aria-label={t('patient.exercises.session.showInstructions')}
              >
                <Info size={20} strokeWidth={1.75} />
              </button>
            ) : (
              <span className="workout-session__glass-spacer" aria-hidden="true" />
            )}
          </header>

          <div className="workout-session__chrome workout-session__chrome--bottom">
            <div className="workout-session__meta">
              <h2 className="workout-session__title">{current.title}</h2>
              {holding ? (
                <div
                  className="workout-session__count workout-session__count--hold"
                  aria-live="polite"
                >
                  {formatCount(timer.secondsLeft ?? 0)}
                </div>
              ) : null}
            </div>

            <div className="workout-session__transport">
              <button
                type="button"
                className="workout-session__nav-ghost"
                onClick={handlePrev}
                disabled={isCompleting || isFirst}
                aria-label={t('patient.exercises.session.prev')}
              >
                <PrevIcon size={24} strokeWidth={1.75} />
              </button>

              <Button
                type="primary"
                shape="round"
                size="large"
                className="workout-session__cta-pill"
                loading={isCompleting}
                onClick={timer.completeSetManually}
                icon={<Check size={18} strokeWidth={2} />}
              >
                {timer.currentSet >= totalSets
                  ? t('patient.exercises.session.markDone')
                  : t('patient.exercises.session.completeSet')}
              </Button>

              <button
                type="button"
                className="workout-session__nav-ghost"
                onClick={handleNext}
                disabled={isCompleting}
                aria-label={
                  isLast
                    ? t('patient.exercises.session.finish')
                    : t('patient.exercises.session.next')
                }
              >
                {isLast ? (
                  <Check size={24} strokeWidth={2} />
                ) : (
                  <NextIcon size={24} strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {infoOpen && current ? (
        <div className="workout-session__info" role="dialog" aria-modal="true">
          <button
            type="button"
            className="workout-session__info-backdrop"
            aria-label={t('patient.exercises.session.hideInstructions')}
            onClick={() => setInfoOpen(false)}
          />
          <div className="workout-session__info-sheet">
            <div className="workout-session__info-header">
              <h3 className="workout-session__info-title">{current.title}</h3>
              <button
                type="button"
                className="workout-session__glass-btn workout-session__glass-btn--on-sheet"
                onClick={() => setInfoOpen(false)}
                aria-label={t('patient.exercises.session.hideInstructions')}
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            {current.patientCue ? (
              <Paragraph className="workout-session__cue">{current.patientCue}</Paragraph>
            ) : null}
            {current.instructions ? (
              <Paragraph type="secondary" className="workout-session__instructions">
                {current.instructions}
              </Paragraph>
            ) : null}
            <Text type="secondary" className="workout-session__doctor-note">
              {t('patient.exercises.session.withDoctor', { doctorName })}
            </Text>
          </div>
        </div>
      ) : null}
    </div>
  );
}
