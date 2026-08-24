import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Modal, Select, Space, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  createAddClinicDoctorSchema,
  type AddClinicDoctorSchemaValues,
} from '@/features/clinics/schemas/add-clinic-doctor-schema';
import type { ClinicDoctorCandidateDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text } = Typography;

interface AddClinicDoctorModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  isLoadingCandidates: boolean;
  isCandidatesError: boolean;
  assignedDoctorIds: Set<string>;
  candidates: ClinicDoctorCandidateDto[];
  onRetryCandidates: () => void;
  onClose: () => void;
  onSubmit: (values: AddClinicDoctorSchemaValues) => Promise<void>;
}

export function AddClinicDoctorModal({
  isOpen,
  isSubmitting,
  isLoadingCandidates,
  isCandidatesError,
  assignedDoctorIds,
  candidates,
  onRetryCandidates,
  onClose,
  onSubmit,
}: AddClinicDoctorModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createAddClinicDoctorSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddClinicDoctorSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedDoctorId: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      selectedDoctorId: '',
    });
  }, [isOpen, reset]);

  const availableCandidates = candidates.filter(
    (candidate) => !assignedDoctorIds.has(candidate.doctorId),
  );

  return (
    <Modal
      title={t('clinics.doctors.addTitle')}
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
        {isCandidatesError ? (
          <Alert
            type="error"
            showIcon
            message={t('clinics.doctors.errors.candidatesLoadFailed')}
            action={
              <Button size="small" onClick={onRetryCandidates}>
                {t('clinics.retry')}
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        ) : (
          <Form.Item
            label={t('clinics.doctors.selectDoctor')}
            validateStatus={errors.selectedDoctorId ? 'error' : undefined}
            help={errors.selectedDoctorId?.message}
          >
            <Controller
              name="selectedDoctorId"
              control={control}
              render={({ field }) => (
                <Select
                  allowClear
                  showSearch
                  loading={isLoadingCandidates}
                  disabled={isLoadingCandidates || availableCandidates.length === 0}
                  placeholder={t('clinics.doctors.selectDoctorPlaceholder')}
                  optionFilterProp="label"
                  notFoundContent={t('clinics.doctors.emptyCandidates')}
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
            ? t('clinics.doctors.emptyCandidates')
            : t('clinics.doctors.addHint')}
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
              {isSubmitting ? t('clinics.doctors.adding') : t('clinics.doctors.add')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
