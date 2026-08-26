import { ChevronLeft, Stethoscope, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { RegistrationRole } from '@/features/auth/schemas/register-schema';
import { routes } from '@/routes/routes';

const { Text } = Typography;

function roleFromSearch(value: string | null): RegistrationRole | null {
  if (value === 'doctor' || value === 'patient') {
    return value;
  }
  return null;
}

export function RegisterPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<RegistrationRole | null>(() =>
    roleFromSearch(searchParams.get('role')),
  );

  if (role) {
    return <RegisterForm role={role} onBack={() => setRole(null)} />;
  }

  return (
    <div className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">{t('auth.registerTitle')}</h1>
        <p className="auth-form__subtitle">{t('auth.selectRoleDescription')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RoleChoiceCard
          icon={<User size={20} />}
          title={t('auth.rolePatient')}
          description="ثبت‌نام به‌عنوان بیمار و دریافت برنامه تمرینی"
          accent="blue"
          onClick={() => setRole('patient')}
        />
        <RoleChoiceCard
          icon={<Stethoscope size={20} />}
          title={t('auth.roleDoctor')}
          description="ثبت‌نام به‌عنوان پزشک یا فیزیوتراپیست"
          accent="mint"
          onClick={() => setRole('doctor')}
        />
      </div>

      <div className="auth-form__footer">
        <Text type="secondary">{t('auth.haveAccountPrompt')} </Text>
        <Link to={routes.login}>{t('auth.signInLink')}</Link>
      </div>
    </div>
  );
}

function RoleChoiceCard({
  icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  accent: 'blue' | 'mint';
  onClick: () => void;
}) {
  const tone =
    accent === 'mint'
      ? { bg: 'var(--phisio-accent-soft)', color: 'var(--phisio-teal)' }
      : { bg: 'var(--phisio-primary-soft)', color: 'var(--phisio-primary)' };

  return (
    <button type="button" onClick={onClick} className="tactile-press auth-role-card">
      <span
        className="auth-role-card__icon"
        style={{ backgroundColor: tone.bg, color: tone.color }}
      >
        {icon}
      </span>
      <span className="auth-role-card__copy">
        <span className="auth-role-card__title">{title}</span>
        <span className="auth-role-card__desc">{description}</span>
      </span>
      <ChevronLeft size={18} className="auth-role-card__chevron" aria-hidden />
    </button>
  );
}
