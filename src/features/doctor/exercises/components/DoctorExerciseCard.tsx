import { Archive, CirclePlay, Pencil } from 'lucide-react';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
import type { DoctorExerciseDto } from '@/features/doctor/exercises/types/doctor-exercise';

const { Text, Paragraph } = Typography;

interface DoctorExerciseCardProps {
  exercise: DoctorExerciseDto;
  onPlay: (exercise: DoctorExerciseDto) => void;
  onEdit?: (exercise: DoctorExerciseDto) => void;
  onArchive?: (exercise: DoctorExerciseDto) => void;
}

export function DoctorExerciseCard({
  exercise,
  onPlay,
  onEdit,
  onArchive,
}: DoctorExerciseCardProps) {
  const { t } = useTranslation();
  const hasDescription = Boolean(exercise.description?.trim());
  const hasVideo = Boolean(getVideoPreviewSource(exercise.videoUrl));

  return (
    <Card
      className="exercise-card"
      title={exercise.title}
      extra={
        <Space size={0}>
          {hasVideo ? (
            <Button
              type="text"
              icon={<CirclePlay {...appIconProps} className="phisio-icon-primary" size={22} />}
              aria-label={t('doctor.exercises.video.play', { title: exercise.title })}
              onClick={() => onPlay(exercise)}
            />
          ) : (
            <Text type="secondary">{t('doctor.exercises.video.none')}</Text>
          )}
          <Button
            type="text"
            icon={<Pencil {...appIconProps} />}
            onClick={() => onEdit?.(exercise)}
          />
          <Button
            type="text"
            danger
            icon={<Archive {...appIconProps} />}
            onClick={() => onArchive?.(exercise)}
          />
        </Space>
      }
      style={{ height: '100%' }}
    >
      {hasDescription ? (
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {exercise.description}
        </Paragraph>
      ) : null}
      <Space wrap size={[4, 4]} style={{ marginTop: hasDescription ? 12 : 0 }}>
        <Tag>{t(`exerciseMeta.bodyRegion.${exercise.bodyRegion}`)}</Tag>
        <Tag>{t(`exerciseMeta.equipment.${exercise.equipment}`)}</Tag>
        <Tag color="blue">{t(`exerciseMeta.difficulty.${exercise.difficulty}`)}</Tag>
      </Space>
    </Card>
  );
}
