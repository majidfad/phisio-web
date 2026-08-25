import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Modal, Select, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createChangeClinicManagerSchema,
  type ChangeClinicManagerSchemaValues,
} from '@/features/clinics/schemas/change-clinic-manager-schema';
import type { ClinicDoctorCandidateDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text } = Typography;

interface ChangeClinicManagerModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  isLoadingCandidates: boolean;
  isCandidatesError: boolean;
  currentManagerId: string;
  currentManagerName?: string | null;
  candidates: ClinicDoctorCandidateDto[];
  onRetryCandidates: () => void;
  onClose: () => void;
  onSubmit: (values: ChangeClinicManagerSchemaValues) => Promise<void>;
}

export function ChangeClinicManagerModal({
  isOpen,
  isSubmitting,
  isLoadingCandidates,
  isCandidatesError,
  currentManagerId,
  currentManagerName,
  candidates,
  onRetryCandidates,
  onClose,
  onSubmit,
}: ChangeClinicManagerModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createChangeClinicManagerSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeClinicManagerSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clinicManagerId: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      clinicManagerId: '',
    });
  }, [isOpen, reset]);

  const availableCandidates = candidates.filter(
    (candidate) => candidate.doctorId !== currentManagerId,
  );

  return (
    <Modal
      title={t('clinics.changeManager.title')}
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
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          {t('clinics.changeManager.currentManager', {
            name: currentManagerName?.trim() || t('clinics.notSet'),
          })}
        </Text>

        {isCandidatesError ? (
          <Alert
            type="error"
            showIcon
            message={t('clinics.form.clinicManagerLoadFailed')}
            action={
              <Button size="small" onClick={onRetryCandidates}>
                {t('clinics.retry')}
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Form.Item
            label={t('clinics.changeManager.selectManager')}
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
                  loading={isLoadingCandidates}
                  disabled={isLoadingCandidates || availableCandidates.length === 0}
                  placeholder={t('clinics.form.clinicManagerPlaceholder')}
                  optionFilterProp="label"
                  notFoundContent={t('clinics.changeManager.emptyCandidates')}
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value ?? '')}
                  onBlur={field.onBlur}
                  options={availableCandidates.map((doctor) => ({
                    value: doctor.doctorId,
                    label: `${doctor.name} — ${formatDisplayPhone(doctor.phoneNumber)}`,
                  }))}
                />
              )}
            />
          </Form.Item>
        )}

        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          {availableCandidates.length === 0 && !isLoadingCandidates && !isCandidatesError
            ? t('clinics.changeManager.emptyCandidates')
            : t('clinics.changeManager.hint')}
        </Text>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('clinics.form.cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={
                isLoadingCandidates || isCandidatesError || availableCandidates.length === 0
              }
            >
              {isSubmitting
                ? t('clinics.changeManager.saving')
                : t('clinics.changeManager.confirm')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
