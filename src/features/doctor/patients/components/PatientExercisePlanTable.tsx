import { AppEmpty } from '@/components/ui';
import { CirclePlay } from 'lucide-react';
import { Button, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { DoctorPatientExerciseDto } from '@/features/doctor/patients/types/patient-exercise-plan';

const { Text } = Typography;

interface PatientExercisePlanTableProps {
  exercises: DoctorPatientExerciseDto[];
}

function formatAssignedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function PatientExercisePlanTable({ exercises }: PatientExercisePlanTableProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<DoctorPatientExerciseDto | null>(null);

  const columns: ColumnsType<DoctorPatientExerciseDto> = [
    {
      title: t('doctor.patients.exercisePlan.columns.title'),
      dataIndex: 'exerciseName',
      key: 'exerciseName',
    },
    {
      title: t('doctor.patients.exercisePlan.columns.dosage'),
      key: 'dosage',
      render: (_, exercise) => (
        <Space wrap size={[4, 4]}>
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
            <Tag className="exercise-dosage-chip">{t(`exerciseMeta.side.${exercise.side}`)}</Tag>
          ) : null}
          {!exercise.sets && !exercise.reps && !exercise.holdSeconds && !exercise.restSeconds ? (
            <Text type="secondary">—</Text>
          ) : null}
        </Space>
      ),
    },
    {
      title: t('doctor.patients.exercisePlan.columns.video'),
      key: 'video',
      width: 80,
      render: (_, exercise) => {
        const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

        return hasVideo ? (
          <Button
            type="text"
            icon={<CirclePlay {...appIconProps} size={20} color="var(--phisio-primary)" />}
            aria-label={t('doctor.patients.exercisePlan.video.play', {
              title: exercise.exerciseName,
            })}
            onClick={() => setSelectedExercise(exercise)}
          />
        ) : (
          <Text type="secondary">{t('doctor.patients.exercisePlan.video.none')}</Text>
        );
      },
    },
    {
      title: t('doctor.patients.exercisePlan.columns.assignedAt'),
      dataIndex: 'assignedAt',
      key: 'assignedAt',
      width: 140,
      render: (value: string) => formatAssignedAt(value),
    },
  ];

  if (exercises.length === 0) {
    return <AppEmpty description={t('doctor.patients.exercisePlan.empty')} />;
  }

  return (
    <>
      <Table
        rowKey="userExerciseId"
        columns={columns}
        dataSource={exercises}
        pagination={false}
        size="middle"
      />

      <ExerciseVideoModal
        title={selectedExercise?.exerciseName ?? null}
        videoUrl={selectedExercise?.videoUrl}
        mediaType={selectedExercise?.mediaType}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
