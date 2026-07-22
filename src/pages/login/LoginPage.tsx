import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useToast } from '@/hooks/useToast';

type LoginLocationState = {
  registrationSuccess?: boolean;
  registeredRole?: 'patient' | 'doctor';
};

export function LoginPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const shownRef = useRef(false);

  useEffect(() => {
    if (!state?.registrationSuccess || shownRef.current) {
      return;
    }
    shownRef.current = true;
    const isDoctorRegistration = state.registeredRole === 'doctor';
    toast.success(
      isDoctorRegistration
        ? t('auth.registrationSuccessDoctor')
        : t('auth.registrationSuccessPatient'),
    );
  }, [state?.registrationSuccess, state?.registeredRole, t, toast]);

  return <LoginForm />;
}
