import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal, Select, Space, Spin, Typography } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { denseIconProps } from '@/components/icons/app-icon';
import type { DoctorDto } from '@/features/admin/doctors/types/doctor';
import {
  createClinicFormSchema,
  type ClinicFormSchemaValues,
} from '@/features/clinics/schemas/clinic-form-schema';
import type { ClinicDto } from '@/features/clinics/types/clinic';

const { Text } = Typography;

interface ClinicFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  clinic?: ClinicDto | null;
  requireClinicManagerId: boolean;
  doctors: Pick<DoctorDto, 'id' | 'name'>[];
  isLoadingDoctors: boolean;
  isDoctorsError: boolean;
  isSubmitting: boolean;
  onRetryDoctors: () => void;
  onClose: () => void;
  onSubmit: (values: ClinicFormSchemaValues) => Promise<void>;
}

const EMPTY_PHONE = { value: '' };

export function ClinicFormModal({
  isOpen,
  mode,
  clinic,
  requireClinicManagerId,
  doctors,
  isLoadingDoctors,
  isDoctorsError,
  isSubmitting,
  onRetryDoctors,
  onClose,
  onSubmit,
}: ClinicFormModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(
    () => createClinicFormSchema(t, requireClinicManagerId && mode === 'create'),
    [t, requireClinicManagerId, mode],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClinicFormSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      phoneNumbers: [EMPTY_PHONE],
      clinicManagerId: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      name: clinic?.name ?? '',
      address: clinic?.address ?? '',
      phoneNumbers:
        clinic?.phoneNumbers && clinic.phoneNumbers.length > 0
          ? clinic.phoneNumbers.map((value) => ({ value }))
          : [EMPTY_PHONE],
      clinicManagerId: clinic?.clinicManagerId ?? '',
    });
  }, [isOpen, clinic, reset]);

  const title = mode === 'create' ? t('clinics.form.createTitle') : t('clinics.form.editTitle');

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
          label={t('clinics.form.name')}
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="organization" />}
          />
        </Form.Item>

        <Form.Item
          label={t('clinics.form.address')}
          validateStatus={errors.address ? 'error' : undefined}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input.TextArea {...field} rows={3} />}
          />
        </Form.Item>

        <Form.Item label={t('clinics.form.phones')}>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            {fields.map((item, index) => (
              <Space.Compact key={item.id} style={{ width: '100%' }}>
                <Form.Item
                  validateStatus={errors.phoneNumbers?.[index]?.value ? 'error' : undefined}
                  help={errors.phoneNumbers?.[index]?.value?.message}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Controller
                    name={`phoneNumbers.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        placeholder={t('auth.phonePlaceholder')}
                      />
                    )}
                  />
                </Form.Item>
                <Button
                  icon={<Trash2 {...denseIconProps} />}
                  aria-label={t('clinics.form.removePhone')}
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                />
              </Space.Compact>
            ))}
            <Button
              type="dashed"
              icon={<Plus {...denseIconProps} />}
              onClick={() => append({ value: '' })}
            >
              {t('clinics.form.addPhone')}
            </Button>
          </Space>
        </Form.Item>

        {requireClinicManagerId && mode === 'create' ? (
          <Form.Item
            label={t('clinics.form.clinicManagerId')}
            validateStatus={errors.clinicManagerId ? 'error' : undefined}
            help={errors.clinicManagerId?.message}
          >
            <Controller
              name="clinicManagerId"
              control={control}
              render={({ field }) => (
                <Select
                  allowClear
                  showSearch
                  loading={isLoadingDoctors}
                  disabled={isDoctorsError}
                  placeholder={t('clinics.form.clinicManagerPlaceholder')}
                  optionFilterProp="label"
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value ?? '')}
                  onBlur={field.onBlur}
                  notFoundContent={
                    isLoadingDoctors ? <Spin size="small" /> : t('clinics.form.clinicManagerEmpty')
                  }
                  options={doctors.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                  }))}
                />
              )}
            />
            {isDoctorsError ? (
              <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                <Text type="danger">{t('clinics.form.clinicManagerLoadFailed')}</Text>
                <Button size="small" onClick={onRetryDoctors}>
                  {t('clinics.retry')}
                </Button>
              </Space>
            ) : null}
          </Form.Item>
        ) : null}

        {mode === 'edit' ? (
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            {t('clinics.form.managerUnchanged')}
          </Text>
        ) : null}

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('clinics.form.cancel')}</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting
                ? t('clinics.form.saving')
                : mode === 'create'
                  ? t('clinics.form.create')
                  : t('clinics.form.save')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
