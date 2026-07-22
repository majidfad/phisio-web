import { Button, Drawer, Progress, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseMediaPlayer } from '@/features/patient/exercises/components/ExerciseMediaPlayer';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';
import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

const { Text, Title, Paragraph } = Typography;

interface PatientExerciseSessionProps {
  open: boolean;
  /** Incomplete exercises snapshot for this session (stable for the run). */
  exercises: PatientTodayExerciseItemDto[];
  onClose: () => void;
  onExerciseCompleted: () => Promise<unknown>;
  onSessionFinishedWithCompletions: () => void;
}

export function PatientExerciseSession({
  open,
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

  const formatCount = (value: number) =>
    i18n.language.startsWith('fa') ? formatPersianNumber(value) : String(value);

  const current = exercises[index] ?? null;
  const total = exercises.length;
  const isLast = index >= total - 1;
  const progressPercent = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

  const finishSession = (didCompleteAny: boolean) => {
    onClose();
    if (didCompleteAny) {
      onSessionFinishedWithCompletions();
    }
  };

  const advanceOrFinish = (nextCompletedCount: number) => {
    if (isLast || total === 0) {
      finishSession(nextCompletedCount > 0);
      return;
    }
    setIndex((value) => value + 1);
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
    finishSession(completedCount > 0);
  };

  const dosageLine = current
    ? [
        current.sets ? t('patient.exercises.dosage.sets', { count: current.sets }) : null,
        current.reps ? t('patient.exercises.dosage.reps', { count: current.reps }) : null,
        current.holdSeconds
          ? t('patient.exercises.dosage.hold', { count: current.holdSeconds })
          : null,
        current.restSeconds
          ? t('patient.exercises.dosage.rest', { count: current.restSeconds })
          : null,
        current.side ? t(`exerciseMeta.side.${current.side}`) : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';

  return (
    <Drawer
      open={open}
      onClose={handleExit}
      placement="bottom"
      height="94%"
      title={t('patient.exercises.session.title')}
      destroyOnHidden
      className="exercise-session-drawer"
      styles={{ body: { display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 } }}
      extra={
        <Button type="text" onClick={handleExit} disabled={isCompleting}>
          {t('patient.exercises.session.exit')}
        </Button>
      }
    >
      {total === 0 || !current ? (
        <Text type="secondary">{t('patient.exercises.session.allDone')}</Text>
      ) : (
        <>
          <div className="exercise-session__progress">
            <Text type="secondary">
              {t('patient.exercises.session.progress', {
                current: formatCount(index + 1),
                total: formatCount(total),
              })}
            </Text>
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor="var(--phisio-primary)"
              trailColor="var(--phisio-border)"
              strokeWidth={8}
            />
          </div>

          <Title level={4} style={{ margin: 0 }}>
            {current.title}
          </Title>

          <div className="exercise-session__media">
            <ExerciseMediaPlayer
              title={current.title}
              videoUrl={current.videoUrl}
              mediaType={current.mediaType}
              autoPlay
            />
          </div>

          {dosageLine ? (
            <Text type="secondary" className="exercise-session__dosage">
              {dosageLine}
            </Text>
          ) : null}

          {current.patientCue ? (
            <Paragraph style={{ marginBottom: 0 }}>{current.patientCue}</Paragraph>
          ) : null}
          {current.instructions ? (
            <Paragraph type="secondary" style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
              {current.instructions}
            </Paragraph>
          ) : null}

          <div className="exercise-session__actions">
            <Button
              type="primary"
              size="large"
              block
              loading={isCompleting}
              onClick={() => void handleMarkDone()}
              className="touch-target"
            >
              {t('patient.exercises.session.markDone')}
            </Button>
            <Button size="large" block disabled={isCompleting} onClick={handleSkip}>
              {t('patient.exercises.session.skip')}
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
}
