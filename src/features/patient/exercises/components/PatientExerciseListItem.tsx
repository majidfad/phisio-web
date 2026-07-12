import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Space, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { PatientTodayExerciseItemDto } from '@/features/patient/exercises/types/patient-exercise';

const { Text } = Typography;

interface PatientExerciseListItemProps {
  exercise: PatientTodayExerciseItemDto;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (exercise: PatientTodayExerciseItemDto, checked: boolean) => void;
  onPlay: (exercise: PatientTodayExerciseItemDto) => void;
}

export function PatientExerciseListItem({
  exercise,
  isChecked,
  isDisabled,
  onToggle,
  onPlay,
}: PatientExerciseListItemProps) {
  const { t } = useTranslation();
  return (
    <Card
      size="small"
      className={`exercise-card touch-active${exercise.completedToday ? ' exercise-card--completed' : ''}`}
      styles={{ body: { padding: '16px 18px' } }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 48,
        }}
      >
        <Space align="start" size={14}>
          <Checkbox
            checked={isChecked}
            disabled={isDisabled}
            onChange={(e) => onToggle(exercise, e.target.checked)}
            style={{ marginTop: 4, transform: 'scale(1.15)' }}
            aria-label={exercise.title}
          />
          <div>
            <Text
              strong
              delete={exercise.completedToday}
              style={{ fontSize: 16, display: 'block', lineHeight: 1.4 }}
            >
              {exercise.title}
            </Text>
            {exercise.completedToday ? (
              <Tag color="success" style={{ marginTop: 6 }}>
                {t('patient.exercises.completedToday')}
              </Tag>
            ) : null}
          </div>
        </Space>

        <Button
          type="primary"
          ghost
          icon={<PlayCircleOutlined />}
          onClick={() => onPlay(exercise)}
          className="touch-target"
          aria-label={t('patient.exercises.video.watch', { title: exercise.title })}
        >
          {t('patient.exercises.video.watchLabel')}
        </Button>
      </div>
    </Card>
  );
}
