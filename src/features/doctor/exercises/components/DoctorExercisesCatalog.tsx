import { Col, Empty, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';

import { DoctorExerciseCard } from './DoctorExerciseCard';

interface DoctorExercisesCatalogProps {
  exercises: DoctorExerciseDto[];
}

export function DoctorExercisesCatalog({ exercises }: DoctorExercisesCatalogProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<DoctorExerciseDto | null>(null);

  if (exercises.length === 0) {
    return <Empty description={t('doctor.exercises.empty')} />;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {exercises.map((exercise) => (
          <Col key={exercise.exerciseId} xs={24} sm={12} lg={8}>
            <DoctorExerciseCard exercise={exercise} onPlay={setSelectedExercise} />
          </Col>
        ))}
      </Row>

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
