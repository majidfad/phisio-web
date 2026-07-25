import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, Modal, Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createExerciseCategoryFormSchema,
  type ExerciseCategoryFormSchemaValues,
} from '@/features/admin/exercise-categories/schemas/exercise-category-form-schema';
import type { ExerciseCategoryDto } from '@/features/admin/exercise-categories/types/exercise-category';

interface ExerciseCategoryFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  category?: ExerciseCategoryDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ExerciseCategoryFormSchemaValues) => Promise<void>;
}

export function ExerciseCategoryFormModal({
  isOpen,
  mode,
  category,
  isSubmitting,
  onClose,
  onSubmit,
}: ExerciseCategoryFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createExerciseCategoryFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseCategoryFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameFa: '',
      nameEn: '',
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      nameFa: category?.nameFa ?? '',
      nameEn: category?.nameEn ?? '',
      sortOrder: category?.sortOrder ?? 0,
    });
  }, [isOpen, category, reset]);

  const title =
    mode === 'create'
      ? t('admin.exerciseCategories.form.createTitle')
      : t('admin.exerciseCategories.form.editTitle');

  return (
    <Modal title={title} open={isOpen} onCancel={onClose} footer={null} destroyOnHidden centered>
      <Form
        layout="vertical"
        onFinish={() =>
          void handleSubmit(async (values) => {
            await onSubmit(values);
          })()
        }
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label={t('admin.exerciseCategories.form.nameFa')}
          validateStatus={errors.nameFa ? 'error' : undefined}
          help={errors.nameFa?.message}
        >
          <Controller
            name="nameFa"
            control={control}
            render={({ field }) => <Input {...field} maxLength={100} autoComplete="off" />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.exerciseCategories.form.nameEn')}
          validateStatus={errors.nameEn ? 'error' : undefined}
          help={errors.nameEn?.message}
        >
          <Controller
            name="nameEn"
            control={control}
            render={({ field }) => <Input {...field} maxLength={100} autoComplete="off" />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.exerciseCategories.form.sortOrder')}
          validateStatus={errors.sortOrder ? 'error' : undefined}
          help={errors.sortOrder?.message}
        >
          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <InputNumber {...field} min={0} style={{ width: '100%' }} />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t('admin.exerciseCategories.form.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {mode === 'create'
                ? t('admin.exerciseCategories.form.create')
                : t('admin.exerciseCategories.form.update')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
