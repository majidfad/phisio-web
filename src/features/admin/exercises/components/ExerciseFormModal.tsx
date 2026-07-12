import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input, Modal, Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createExerciseFormSchema,
  type ExerciseFormSchemaValues,
} from '@/features/admin/exercises/schemas/exercise-form-schema';

interface ExerciseFormModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (values: ExerciseFormSchemaValues) => Promise<void>;
}

export function ExerciseFormModal({
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: ExerciseFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createExerciseFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      name: '',
    });
  }, [isOpen, reset]);

  return (
    <Modal
      title={t('admin.exercises.form.createTitle')}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        layout="vertical"
        onFinish={() =>
          void handleSubmit(async (values) => {
            await onSubmit(values);
          })()
        }
      >
        {submitError ? (
          <Alert type="error" message={submitError} showIcon style={{ marginBottom: 16 }} />
        ) : null}

        <Form.Item
          label={t('admin.exercises.form.name')}
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="off" />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.exercises.form.video')}
          validateStatus={errors.video ? 'error' : undefined}
          help={errors.video?.message as string | undefined}
        >
          <Controller
            name="video"
            control={control}
            render={({ field: { onChange, onBlur, ref } }) => (
              <input
                type="file"
                accept="video/mp4,.mp4"
                onChange={(e) => onChange(e.target.files)}
                onBlur={onBlur}
                ref={ref}
              />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t('admin.exercises.form.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting ? t('admin.exercises.form.saving') : t('admin.exercises.form.create')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
