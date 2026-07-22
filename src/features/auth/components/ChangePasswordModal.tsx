import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal, Space } from 'antd';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { changePasswordApi } from '@/features/auth/api/auth-api';
import {
  createChangePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/auth/schemas/change-password-schema';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const schema = useMemo(() => createChangePasswordSchema(t), [t]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  const handleAfterClose = () => {
    reset(EMPTY_VALUES);
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);

    try {
      await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success(t('auth.changePassword.success'));
      reset(EMPTY_VALUES);
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, t('auth.changePassword.error')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={t('auth.changePassword.title')}
      open={open}
      onCancel={onClose}
      afterClose={handleAfterClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form layout="vertical" onFinish={() => void handleSubmit(onSubmit)()}>
        <Form.Item
          label={t('auth.changePassword.currentPassword')}
          validateStatus={errors.currentPassword ? 'error' : undefined}
          help={errors.currentPassword?.message}
        >
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => <Input.Password {...field} autoComplete="current-password" />}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.changePassword.newPassword')}
          validateStatus={errors.newPassword ? 'error' : undefined}
          help={errors.newPassword?.message}
        >
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => <Input.Password {...field} autoComplete="new-password" />}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.changePassword.confirmNewPassword')}
          validateStatus={errors.confirmPassword ? 'error' : undefined}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => <Input.Password {...field} autoComplete="new-password" />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t('auth.changePassword.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting ? t('auth.changePassword.submitting') : t('auth.changePassword.submit')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
