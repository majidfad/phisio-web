import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';

type LoginLocationState = {
  registrationSuccess?: boolean;
  registeredRole?: 'patient' | 'doctor';
};

export function LoginPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const registrationSuccess = state?.registrationSuccess;
  const isDoctorRegistration = state?.registeredRole === 'doctor';

  return (
    <div>
      {registrationSuccess ? (
        <Alert
          type={isDoctorRegistration ? 'info' : 'success'}
          message={
            isDoctorRegistration
              ? t('auth.registrationSuccessDoctor')
              : t('auth.registrationSuccessPatient')
          }
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <LoginForm />
    </div>
  );
}
