import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createPatientFormSchema,
  type PatientFormSchemaValues,
} from '@/features/admin/patients/schemas/patient-form-schema';
import type { PatientDto } from '@/features/admin/patients/types/patient';

const { Text } = Typography;

interface PatientFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  patient?: PatientDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormSchemaValues) => Promise<void>;
}

export function PatientFormModal({
  isOpen,
  mode,
  patient,
  isSubmitting,
  onClose,
  onSubmit,
}: PatientFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createPatientFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      name: patient?.name ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      email: patient?.email ?? '',
    });
  }, [isOpen, patient, reset]);

  const title =
    mode === 'create' ? t('admin.patients.form.createTitle') : t('admin.patients.form.editTitle');

  return (
    <Modal title={title} open={isOpen} onCancel={onClose} footer={null} destroyOnHidden centered>
      <Form
        layout="vertical"
        onFinish={() =>
          void handleSubmit(async (values) => {
            await onSubmit(values);
          })()
        }
      >
        <Form.Item
          label={t('admin.patients.form.name')}
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="name" />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.patients.form.phone')}
          validateStatus={errors.phoneNumber ? 'error' : undefined}
          help={errors.phoneNumber?.message}
        >
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder={t('auth.phonePlaceholder')}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <>
              {t('admin.patients.form.email')}{' '}
              <Text type="secondary">({t('admin.patients.form.optional')})</Text>
            </>
          }
          validateStatus={errors.email ? 'error' : undefined}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} type="email" autoComplete="email" />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('admin.patients.form.cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting
                ? t('admin.patients.form.saving')
                : mode === 'create'
                  ? t('admin.patients.form.create')
                  : t('admin.patients.form.save')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
