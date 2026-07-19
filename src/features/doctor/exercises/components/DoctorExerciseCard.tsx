import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';
const { Text, Paragraph } = Typography;

interface DoctorExerciseCardProps {
  exercise: DoctorExerciseDto;
  onPlay: (exercise: DoctorExerciseDto) => void;
}

export function DoctorExerciseCard({ exercise, onPlay }: DoctorExerciseCardProps) {
  const { t } = useTranslation();
  const hasDescription = Boolean(exercise.description?.trim());
  const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

  return (
    <Card
      className="exercise-card"
      title={exercise.title}
      extra={
        hasVideo ? (
          <Button
            type="text"
            icon={<PlayCircleOutlined className="phisio-icon-primary" style={{ fontSize: 22 }} />}
            aria-label={t('doctor.exercises.video.play', { title: exercise.title })}
            onClick={() => onPlay(exercise)}
          />
        ) : (
          <Text type="secondary">{t('doctor.exercises.video.none')}</Text>
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
  );
}
