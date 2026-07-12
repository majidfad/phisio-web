import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { createLoginSchema, type LoginFormValues } from '@/features/auth/schemas/login-schema';
import { routes } from '@/routes/routes';
import { getHomeRouteForUser } from '@/routes/utils/role-access';
import { getErrorMessage } from '@/utils/get-error-message';

const { Title, Text } = Typography;

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const user = await login({
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });

      navigate(getHomeRouteForUser(user), { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error, t('auth.unableToSignIn')));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate style={{ width: '100%' }}>
      <Title level={4} className="auth-form__title">
        {t('auth.signInButton')}
      </Title>

      {submitError ? (
        <Alert type="error" message={submitError} showIcon className="auth-form__alert" />
      ) : null}

      <Form layout="vertical" component={false}>
        <Form.Item
          label={t('auth.phoneNumber')}
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
              <Input.Password {...field} autoComplete="current-password" size="large" />
            )}
          />
        </Form.Item>
      </Form>

      <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
        {isSubmitting ? t('auth.signingIn') : t('auth.signInButton')}
      </Button>

      <div className="auth-form__footer">
        <Link to={routes.register}>
          <Text type="secondary">{t('auth.registerLink')}</Text>
        </Link>
      </div>
    </form>
  );
}
