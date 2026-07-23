import { Library } from 'lucide-react';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';

const { Text } = Typography;

type TextsModalMode = 'add' | 'edit';

interface ExerciseTextsSource {
  title: string;
  description?: string | null;
  instructions?: string | null;
}

interface DoctorExerciseTextsModalProps {
  exercise: ExerciseTextsSource | null;
  mode: TextsModalMode;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: { description: string; instructions: string }) => Promise<void>;
}

export function DoctorExerciseTextsModal({
  exercise,
  mode,
  isSubmitting,
  onClose,
  onSubmit,
}: DoctorExerciseTextsModalProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [trackedExercise, setTrackedExercise] = useState(exercise);
  const i18nKey = mode === 'edit' ? 'doctor.exercises.editTexts' : 'doctor.exercises.addToLibrary';

  if (exercise !== trackedExercise) {
    setTrackedExercise(exercise);
    setDescription(exercise?.description ?? '');
    setInstructions(exercise?.instructions ?? '');
  }

  return (
    <Modal
      title={t(`${i18nKey}.title`)}
      open={Boolean(exercise)}
      onCancel={onClose}
      destroyOnHidden
      centered
      footer={[
        <Button key="cancel" disabled={isSubmitting} onClick={onClose}>
          {t(`${i18nKey}.cancel`)}
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={mode === 'add' ? <Library {...appIconProps} /> : undefined}
          loading={isSubmitting}
          onClick={() =>
            void onSubmit({
              description: description.trim(),
              instructions: instructions.trim(),
            })
          }
        >
          {t(`${i18nKey}.submit`)}
        </Button>,
      ]}
    >
      {exercise ? (
        <Form layout="vertical">
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {t(`${i18nKey}.hint`, { title: exercise.title })}
          </Text>
          <Form.Item label={t('admin.exercises.form.description')} required>
            <Input.TextArea
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Item>
          <Form.Item label={t('admin.exercises.form.instructions')} required>
            <Input.TextArea
              rows={4}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
}
