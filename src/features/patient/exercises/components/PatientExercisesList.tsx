import { Button, Space, Typography } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import { DailyFeedbackModal } from '@/features/patient/feedback/components/DailyFeedbackModal';
import { PatientExerciseListItem } from '@/features/patient/exercises/components/PatientExerciseListItem';
import { PatientExerciseSession } from '@/features/patient/exercises/components/PatientExerciseSession';
import { patientExerciseService } from '@/features/patient/exercises/services/patientExerciseService';
import type {
  PatientDoctorExerciseGroupDto,
  PatientExercisePlayback,
  PatientTodayExerciseItemDto,
} from '@/features/patient/exercises/types/patient-exercise';
import {
  getSubmittableExerciseIds,
  isExerciseCheckboxChecked,
} from '@/features/patient/exercises/utils/exercise-checkbox-state';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text } = Typography;

interface PatientExercisesListProps {
  doctorGroups: PatientDoctorExerciseGroupDto[];
  onCompletionsSaved: () => Promise<unknown>;
}

interface ActiveSession {
  doctorId: string;
  doctorName: string;
  exercises: PatientTodayExerciseItemDto[];
  key: number;
}

interface FeedbackContext {
  doctorId: string;
  doctorName: string;
  completedCount: number;
}

export function PatientExercisesList({
  doctorGroups,
  onCompletionsSaved,
}: PatientExercisesListProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [selectedExercise, setSelectedExercise] = useState<PatientExercisePlayback | null>(null);
  const [pendingSelectionIds, setPendingSelectionIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [feedbackContext, setFeedbackContext] = useState<FeedbackContext | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const sessionKeyRef = useRef(0);

  const allExercises = useMemo(
    () => doctorGroups.flatMap((group) => group.exercises),
    [doctorGroups],
  );

  const sanitizedPendingIds = useMemo(() => {
    const completedTodayIds = new Set(
      allExercises
        .filter((exercise) => exercise.completedToday)
        .map((exercise) => exercise.userExerciseId),
    );

    const next = new Set<string>();
    for (const id of pendingSelectionIds) {
      if (!completedTodayIds.has(id)) {
        next.add(id);
      }
    }

    return next;
  }, [allExercises, pendingSelectionIds]);

  const handleToggle = (exercise: PatientTodayExerciseItemDto, checked: boolean) => {
    if (exercise.completedToday) {
      return;
    }

    setPendingSelectionIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(exercise.userExerciseId);
      } else {
        next.delete(exercise.userExerciseId);
      }
      return next;
    });
  };

  const handlePlay = (exercise: PatientTodayExerciseItemDto) => {
    setSelectedExercise({
      title: exercise.title,
      videoUrl: exercise.videoUrl,
      mediaType: exercise.mediaType,
    });
  };

  const submittableIds = getSubmittableExerciseIds(allExercises, sanitizedPendingIds);

  const handleSubmit = async () => {
    if (submittableIds.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await patientExerciseService.completeExercises({
        userExerciseIds: submittableIds,
      });

      setPendingSelectionIds(new Set());
      toast.success(t('patient.exercises.completionsRecorded'));
      await onCompletionsSaved();
      const firstGroup = doctorGroups[0];
      if (firstGroup) {
        setFeedbackContext({
          doctorId: firstGroup.doctorId,
          doctorName: firstGroup.doctorName,
          completedCount: submittableIds.length,
        });
      }
    } catch (error) {
      toast.error(getErrorMessage(error, t('patient.exercises.errors.completionFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDoctorSession = (group: PatientDoctorExerciseGroupDto) => {
    const incomplete = group.exercises.filter((exercise) => !exercise.completedToday);
    if (incomplete.length === 0) {
      return;
    }

    setActiveSession({
      doctorId: group.doctorId,
      doctorName: group.doctorName,
      exercises: incomplete,
      key: ++sessionKeyRef.current,
    });
  };

  return (
    <>
      <Space direction="vertical" size={20} style={{ width: '100%', marginTop: 16 }}>
        <Button
          type="link"
          style={{ paddingInline: 0 }}
          onClick={() => setShowChecklist((v) => !v)}
        >
          {showChecklist
            ? t('patient.exercises.hideChecklist')
            : t('patient.exercises.showChecklist')}
        </Button>

        {doctorGroups.map((group) => {
          const incompleteCount = group.exercises.filter(
            (exercise) => !exercise.completedToday,
          ).length;

          return (
            <section key={group.doctorId} className="workout-doctor-group">
              <div className="workout-doctor-group__header">
                <Text strong>
                  {t('patient.dashboard.treatingDoctor', { doctorName: group.doctorName })}
                </Text>
                {incompleteCount > 0 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => startDoctorSession(group)}
                    className="touch-target"
                  >
                    {t('patient.exercises.session.startForDoctor', {
                      count: incompleteCount,
                    })}
                  </Button>
                ) : (
                  <Text type="secondary">{t('patient.exercises.session.doctorDone')}</Text>
                )}
              </div>
              <div className="exercise-list" role="list">
                {group.exercises.map((exercise) => (
                  <div key={exercise.userExerciseId} role="listitem">
                    <PatientExerciseListItem
                      exercise={exercise}
                      isChecked={isExerciseCheckboxChecked(exercise, sanitizedPendingIds)}
                      isDisabled={!showChecklist || exercise.completedToday || isSubmitting}
                      showCheckbox={showChecklist}
                      onToggle={(item, checked) => handleToggle(item, checked)}
                      onPlay={handlePlay}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </Space>

      {showChecklist ? (
        <div className="patient-sticky-cta">
          <Button
            type="default"
            block
            size="large"
            disabled={submittableIds.length === 0 || isSubmitting}
            loading={isSubmitting}
            onClick={() => void handleSubmit()}
            className="touch-target"
          >
            {isSubmitting
              ? t('patient.exercises.submittingCompletions')
              : t('patient.exercises.submitCompletions')}
          </Button>
        </div>
      ) : null}

      {activeSession ? (
        <PatientExerciseSession
          key={activeSession.key}
          open
          doctorName={activeSession.doctorName}
          exercises={activeSession.exercises}
          onClose={() => setActiveSession(null)}
          onExerciseCompleted={onCompletionsSaved}
          onSessionFinishedWithCompletions={(completedCount) => {
            toast.success(t('patient.exercises.completionsRecorded'));
            setFeedbackContext({
              doctorId: activeSession.doctorId,
              doctorName: activeSession.doctorName,
              completedCount,
            });
          }}
        />
      ) : null}

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />

      <DailyFeedbackModal
        isOpen={Boolean(feedbackContext)}
        doctorId={feedbackContext?.doctorId}
        doctorName={feedbackContext?.doctorName}
        completedCount={feedbackContext?.completedCount}
        onClose={() => setFeedbackContext(null)}
      />
    </>
  );
}
