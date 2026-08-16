import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Typography } from 'antd';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { createLoginSchema, type LoginFormValues } from '@/features/auth/schemas/login-schema';
import { useToast } from '@/hooks/useToast';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';

const { Text } = Typography;

export function LoginForm() {
  const { t } = useTranslation();
  const toast = useToast();
  const { login } = useAuth();
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
    try {
      await login({
        phoneNumber: values.phoneNumber.trim(),
        password: values.password,
      });
    } catch (error) {
      const message = getErrorMessage(error, t('auth.unableToSignIn'));
      toast.error(
        message === 'Your account has not been approved yet.'
          ? t('auth.accountNotApproved')
          : message,
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">{t('auth.signIn')}</h1>
        <p className="auth-form__subtitle">{t('auth.signInDescription')}</p>
      </div>

      <Form layout="vertical" component={false} className="auth-form__fields">
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

      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={isSubmitting}
        className="auth-form__submit"
      >
        {isSubmitting ? t('auth.signingIn') : t('auth.signInButton')}
      </Button>

      <div className="auth-form__footer">
        <Text type="secondary">{t('auth.noAccountPrompt')} </Text>
        <Link to={routes.register}>{t('auth.registerLink')}</Link>
      </div>
    </form>
  );
}
