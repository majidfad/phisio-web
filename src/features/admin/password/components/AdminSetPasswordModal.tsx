import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Modal, Space } from 'antd';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AdminPasswordFormFields } from '@/features/admin/password/components/AdminPasswordFormFields';
import {
  createAdminPasswordFieldsSchema,
  EMPTY_ADMIN_PASSWORD_FIELDS,
  toAdminSetPasswordRequest,
  type AdminPasswordFields,
} from '@/features/admin/password/schemas/admin-password-schema';
import type { AdminSetPasswordRequest } from '@/features/admin/password/types/admin-password';

interface AdminSetPasswordModalProps {
  open: boolean;
  userName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (request: AdminSetPasswordRequest) => Promise<void>;
}

export function AdminSetPasswordModal({
  open,
  userName,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminSetPasswordModalProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createAdminPasswordFieldsSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminPasswordFields>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_ADMIN_PASSWORD_FIELDS,
  });

  const passwordMode = useWatch({ control, name: 'passwordMode' });

  useEffect(() => {
    if (open) {
      reset(EMPTY_ADMIN_PASSWORD_FIELDS);
    }
  }, [open, reset]);

  return (
    <Modal
      title={t('admin.password.setTitle', { name: userName })}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form
        layout="vertical"
        onFinish={() =>
          void handleSubmit(async (values) => {
            await onSubmit(toAdminSetPasswordRequest(values));
          })()
        }
      >
        <AdminPasswordFormFields control={control} errors={errors} passwordMode={passwordMode} />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={isSubmitting}>
              {t('admin.password.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isSubmitting ? t('admin.password.saving') : t('admin.password.submit')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
