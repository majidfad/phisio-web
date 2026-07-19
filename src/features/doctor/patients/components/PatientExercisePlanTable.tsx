import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
      title: t('doctor.patients.exercisePlan.columns.video'),
      key: 'video',
      width: 80,
      render: (_, exercise) => {
        const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

        return hasVideo ? (
          <Button
            type="text"
            icon={<PlayCircleOutlined style={{ fontSize: 20, color: 'var(--phisio-primary)' }} />}
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
    return <Empty description={t('doctor.patients.exercisePlan.empty')} />;
  }

  return (
    <>
      <Table
        rowKey="exerciseId"
        columns={columns}
        dataSource={exercises}
        pagination={false}
        size="middle"
      />

      <ExerciseVideoModal
        title={selectedExercise?.exerciseName ?? null}
        videoUrl={selectedExercise?.videoUrl}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
