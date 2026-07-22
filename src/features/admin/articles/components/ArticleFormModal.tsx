import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal, Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createArticleFormSchema,
  type ArticleFormSchemaValues,
} from '@/features/admin/articles/schemas/article-form-schema';
import type { ArticleDto } from '@/features/admin/articles/types/article';

interface ArticleFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  article?: ArticleDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ArticleFormSchemaValues) => Promise<void>;
}

export function ArticleFormModal({
  isOpen,
  mode,
  article,
  isSubmitting,
  onClose,
  onSubmit,
}: ArticleFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createArticleFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      summary: '',
      body: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      title: article?.title ?? '',
      summary: article?.summary ?? '',
      body: article?.body ?? '',
    });
  }, [isOpen, article, reset]);

  const title =
    mode === 'create' ? t('admin.articles.form.createTitle') : t('admin.articles.form.editTitle');

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
          label={t('admin.articles.form.title')}
          validateStatus={errors.title ? 'error' : undefined}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} maxLength={200} />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.articles.form.summary')}
          validateStatus={errors.summary ? 'error' : undefined}
          help={errors.summary?.message}
        >
          <Controller
            name="summary"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={2} maxLength={500} />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.articles.form.body')}
          validateStatus={errors.body ? 'error' : undefined}
          help={errors.body?.message}
        >
          <Controller
            name="body"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={8} maxLength={20000} />}
          />
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>{t('admin.articles.form.cancel')}</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {mode === 'create' ? t('admin.articles.form.create') : t('admin.articles.form.save')}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
