import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AdminPasswordFormFields } from '@/features/admin/password/components/AdminPasswordFormFields';
import { EMPTY_ADMIN_PASSWORD_FIELDS } from '@/features/admin/password/schemas/admin-password-schema';
import {
  createDoctorFormSchema,
  type DoctorFormSchemaValues,
} from '@/features/admin/doctors/schemas/doctor-form-schema';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';

const { Text } = Typography;

interface DoctorFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  doctor?: DoctorDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: DoctorFormSchemaValues) => Promise<void>;
}

export function DoctorFormModal({
  isOpen,
  mode,
  doctor,
  isSubmitting,
  onClose,
  onSubmit,
}: DoctorFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createDoctorFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      specialty: '',
      medicalLicenseNumber: '',
      clinicAddress: '',
      ...EMPTY_ADMIN_PASSWORD_FIELDS,
    },
  });

  const passwordMode = useWatch({ control, name: 'passwordMode' });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      name: doctor?.name ?? '',
      phoneNumber: doctor?.phoneNumber ?? '',
      email: doctor?.email ?? '',
      specialty: doctor?.specialty ?? '',
      medicalLicenseNumber: doctor?.medicalLicenseNumber ?? '',
      clinicAddress: doctor?.clinicAddress ?? '',
      ...EMPTY_ADMIN_PASSWORD_FIELDS,
    });
  }, [isOpen, doctor, reset]);

  const title =
    mode === 'create' ? t('admin.doctors.form.createTitle') : t('admin.doctors.form.editTitle');

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
          label={t('admin.doctors.form.name')}
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
          label={t('admin.doctors.form.phone')}
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
              {t('admin.doctors.form.email')}{' '}
              <Text type="secondary">({t('admin.doctors.form.optional')})</Text>
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

        <Form.Item
          label={t('admin.doctors.form.specialty')}
          validateStatus={errors.specialty ? 'error' : undefined}
          help={errors.specialty?.message}
        >
          <Controller
            name="specialty"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.doctors.form.license')}
          validateStatus={errors.medicalLicenseNumber ? 'error' : undefined}
          help={errors.medicalLicenseNumber?.message}
        >
          <Controller
            name="medicalLicenseNumber"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>

        <Form.Item
          label={t('admin.doctors.form.address')}
          validateStatus={errors.clinicAddress ? 'error' : undefined}
          help={errors.clinicAddress?.message}
        >
          <Controller
            name="clinicAddress"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} />}
          />
        </Form.Item>

        {mode === 'create' ? (
          <AdminPasswordFormFields
            control={control as never}
            errors={errors}
            passwordMode={passwordMode ?? 'generate'}
          />
        ) : null}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('admin.doctors.form.cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting
                ? t('admin.doctors.form.saving')
                : mode === 'create'
                  ? t('admin.doctors.form.create')
                  : t('admin.doctors.form.save')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
