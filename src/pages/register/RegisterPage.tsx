import { Stethoscope, User } from 'lucide-react';
import { Button, Space, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { RegistrationRole } from '@/features/auth/schemas/register-schema';
import { routes } from '@/routes/routes';

const { Title, Text } = Typography;

export function RegisterPage() {
  const { t } = useTranslation();
  const [role, setRole] = useState<RegistrationRole | null>(null);

  if (role) {
    return <RegisterForm role={role} onBack={() => setRole(null)} />;
  }

  return (
    <div style={{ width: '100%' }}>
      <Title level={4} className="auth-form__title">
        {t('auth.registerTitle')}
      </Title>

      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
        {t('auth.selectRoleDescription')}
      </Text>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Button
          block
          size="large"
          icon={<User {...appIconProps} />}
          style={{ height: 56 }}
          onClick={() => setRole('patient')}
        >
          {t('auth.rolePatient')}
        </Button>

        <Button
          block
          size="large"
          icon={<Stethoscope {...appIconProps} />}
          style={{ height: 56 }}
          onClick={() => setRole('doctor')}
        >
          {t('auth.roleDoctor')}
        </Button>
      </Space>

      <div className="auth-form__footer">
        <Link to={routes.login}>
          <Text type="secondary">{t('auth.signInLink')}</Text>
        </Link>
      </div>
    </div>
  );
}
