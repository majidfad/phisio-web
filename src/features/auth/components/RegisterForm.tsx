import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { registerApi } from '@/features/auth/api/auth-api';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/register-schema';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';

const { Title, Text } = Typography;

export function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await registerApi({
        name: values.name.trim(),
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      navigate(routes.login, {
        replace: true,
        state: { registrationSuccess: true },
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error, t('auth.unableToRegister')));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate style={{ width: '100%' }}>
      <Title level={4} className="auth-form__title">
        {t('auth.registerButton')}
      </Title>

      {submitError ? (
        <Alert type="error" message={submitError} showIcon className="auth-form__alert" />
      ) : null}

      <Form layout="vertical" component={false}>
        <Form.Item
          label={t('auth.fullName')}
          validateStatus={errors.name ? 'error' : undefined}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="name" size="large" />}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.mobileNumber')}
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
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.password')}
          validateStatus={errors.password ? 'error' : undefined}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} autoComplete="new-password" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.confirmPassword')}
          validateStatus={errors.confirmPassword ? 'error' : undefined}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} autoComplete="new-password" size="large" />
            )}
          />
        </Form.Item>
      </Form>

      <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
        {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
      </Button>

      <div className="auth-form__footer">
        <Link to={routes.login}>
          <Text type="secondary">{t('auth.signInLink')}</Text>
        </Link>
      </div>
    </form>
  );
}
