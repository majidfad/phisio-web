import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExerciseVideoModal } from '@/features/admin/exercises/components/ExerciseVideoModal';
import type { ExerciseDto } from '@/features/admin/exercises/types/exercise';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';

const { Text, Paragraph } = Typography;

interface PatientExerciseLibraryCatalogProps {
  exercises: ExerciseDto[];
}

export function PatientExerciseLibraryCatalog({ exercises }: PatientExerciseLibraryCatalogProps) {
  const { t } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDto | null>(null);

  if (exercises.length === 0) {
    return <Empty description={t('patient.library.empty')} />;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {exercises.map((exercise) => {
          const hasDescription = Boolean(exercise.description?.trim());
          const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

          return (
            <Col key={exercise.exerciseId} xs={24} sm={12} lg={8}>
              <Card
                className="exercise-card"
                title={exercise.title}
                extra={
                  hasVideo ? (
                    <Button
                      type="text"
                      icon={
                        <PlayCircleOutlined
                          className="phisio-icon-primary"
                          style={{ fontSize: 22 }}
                        />
                      }
                      aria-label={t('patient.library.video.play', { title: exercise.title })}
                      onClick={() => setSelectedExercise(exercise)}
                    />
                  ) : (
                    <Text type="secondary">{t('patient.library.video.none')}</Text>
                  )
                }
                style={{ height: '100%' }}
              >
                {hasDescription ? (
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {exercise.description}
                  </Paragraph>
                ) : null}
              </Card>
            </Col>
          );
        })}
      </Row>

      <ExerciseVideoModal
        title={selectedExercise?.title ?? null}
        videoUrl={selectedExercise?.videoUrl}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}
