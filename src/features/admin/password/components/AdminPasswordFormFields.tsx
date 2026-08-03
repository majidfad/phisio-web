import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Form, Input, Segmented } from 'antd';
import { useTranslation } from 'react-i18next';

import type { AdminPasswordFields } from '@/features/admin/password/schemas/admin-password-schema';

interface AdminPasswordFormFieldsProps {
  control: Control<AdminPasswordFields>;
  errors: FieldErrors<AdminPasswordFields>;
  passwordMode: AdminPasswordFields['passwordMode'];
}

export function AdminPasswordFormFields({
  control,
  errors,
  passwordMode,
}: AdminPasswordFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item label={t('admin.password.modeLabel')}>
        <Controller
          name="passwordMode"
          control={control}
          render={({ field }) => (
            <Segmented
              block
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={[
                { label: t('admin.password.modeGenerate'), value: 'generate' },
                { label: t('admin.password.modeSet'), value: 'set' },
              ]}
            />
          )}
        />
      </Form.Item>

      {passwordMode === 'set' ? (
        <>
          <Form.Item
            label={t('admin.password.password')}
            validateStatus={errors.password ? 'error' : undefined}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} autoComplete="new-password" />}
            />
          </Form.Item>

          <Form.Item
            label={t('admin.password.confirmPassword')}
            validateStatus={errors.confirmPassword ? 'error' : undefined}
            help={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} autoComplete="new-password" />}
            />
          </Form.Item>
        </>
      ) : (
        <Form.Item>
          <span style={{ color: 'var(--ant-color-text-secondary)' }}>
            {t('admin.password.generateHint')}
          </span>
        </Form.Item>
      )}
    </>
  );
}
