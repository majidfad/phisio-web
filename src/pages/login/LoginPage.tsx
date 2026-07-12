import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';

type LoginLocationState = {
  registrationSuccess?: boolean;
};

export function LoginPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const registrationSuccess = (location.state as LoginLocationState | null)?.registrationSuccess;

  return (
    <div>
      {registrationSuccess ? (
        <Alert
          type="success"
          message={t('auth.registrationSuccess')}
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <LoginForm />
    </div>
  );
}
