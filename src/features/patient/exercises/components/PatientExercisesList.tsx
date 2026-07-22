import { Button, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
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
import { flattenTodayExercises } from '@/features/patient/exercises/types/patient-exercise';
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

export function PatientExercisesList({
  doctorGroups,
  onCompletionsSaved,
}: PatientExercisesListProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const exercises = useMemo(() => flattenTodayExercises({ doctorGroups }), [doctorGroups]);
  const incompleteExercises = useMemo(
    () => exercises.filter((exercise) => !exercise.completedToday),
    [exercises],
  );
  const [selectedExercise, setSelectedExercise] = useState<PatientExercisePlayback | null>(null);
  const [pendingSelectionIds, setPendingSelectionIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<PatientTodayExerciseItemDto[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const sanitizedPendingIds = useMemo(() => {
    const completedTodayIds = new Set(
      exercises
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
  }, [exercises, pendingSelectionIds]);

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

  const submittableIds = getSubmittableExerciseIds(exercises, sanitizedPendingIds);

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
      setIsFeedbackModalOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error, t('patient.exercises.errors.completionFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
        {incompleteExercises.length > 0 ? (
          <Button
            type="primary"
            size="large"
            block
            onClick={() => {
              setSessionQueue(incompleteExercises);
              setSessionKey((value) => value + 1);
              setIsSessionOpen(true);
            }}
            className="touch-target"
          >
            {t('patient.exercises.session.start')}
          </Button>
        ) : null}

        <Button
          type="link"
          style={{ paddingInline: 0 }}
          onClick={() => setShowChecklist((v) => !v)}
        >
          {showChecklist
            ? t('patient.exercises.hideChecklist')
            : t('patient.exercises.showChecklist')}
        </Button>

        {doctorGroups.map((group) => (
          <section key={group.doctorId}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {t('patient.dashboard.treatingDoctor', { doctorName: group.doctorName })}
            </Text>
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
        ))}
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

      <PatientExerciseSession
        key={sessionKey}
        open={isSessionOpen}
        exercises={sessionQueue}
        onClose={() => setIsSessionOpen(false)}
        onExerciseCompleted={onCompletionsSaved}
        onSessionFinishedWithCompletions={() => {
          toast.success(t('patient.exercises.completionsRecorded'));
          setIsFeedbackModalOpen(true);
        }}
      />

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />

      <DailyFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
