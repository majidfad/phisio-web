import { Alert, Button, Space, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import { DailyFeedbackModal } from '@/features/patient/feedback/components/DailyFeedbackModal';
import { PatientExerciseListItem } from '@/features/patient/exercises/components/PatientExerciseListItem';
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
  const exercises = useMemo(() => flattenTodayExercises({ doctorGroups }), [doctorGroups]);
  const [selectedExercise, setSelectedExercise] = useState<PatientExercisePlayback | null>(null);
  const [pendingSelectionIds, setPendingSelectionIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

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
    });
  };

  const submittableIds = getSubmittableExerciseIds(exercises, sanitizedPendingIds);

  const handleSubmit = async () => {
    if (submittableIds.length === 0) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await patientExerciseService.completeExercises({
        userExerciseIds: submittableIds,
      });

      setPendingSelectionIds(new Set());
      setSuccessMessage(t('patient.exercises.completionsRecorded'));
      await onCompletionsSaved();
      setIsFeedbackModalOpen(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error, t('patient.exercises.errors.completionFailed')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
        {successMessage ? <Alert type="success" message={successMessage} showIcon /> : null}
        {submitError ? <Alert type="error" message={submitError} showIcon /> : null}

        {doctorGroups.map((group) => (
          <section key={group.doctorId}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {t('patient.dashboard.treatingDoctor', { doctorName: group.doctorName })}
            </Text>
            <div role="list">
              {group.exercises.map((exercise) => (
                <div key={exercise.userExerciseId} role="listitem">
                  <PatientExerciseListItem
                    exercise={exercise}
                    isChecked={isExerciseCheckboxChecked(exercise, sanitizedPendingIds)}
                    isDisabled={exercise.completedToday || isSubmitting}
                    onToggle={(item, checked) => handleToggle(item, checked)}
                    onPlay={handlePlay}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </Space>

      <div style={{ marginTop: 24, position: 'sticky', bottom: 72 }}>
        <Button
          type="primary"
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

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        onClose={() => setSelectedExercise(null)}
      />

      <DailyFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
