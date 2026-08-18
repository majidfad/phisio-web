import { ChevronLeft, Stethoscope, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { RegistrationRole } from '@/features/auth/schemas/register-schema';
import { routes } from '@/routes/routes';

const { Text } = Typography;

export function RegisterPage() {
  const { t } = useTranslation();
  const [role, setRole] = useState<RegistrationRole | null>(null);

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
    <button
      type="button"
      onClick={onClick}
      className="tactile-press"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
        padding: '14px 16px',
        borderRadius: 'var(--phisio-radius-md)',
        border: '1px solid var(--phisio-border)',
        background: 'var(--phisio-bg-elevated)',
        cursor: 'pointer',
        textAlign: 'start',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--phisio-radius-sm)',
            backgroundColor: tone.bg,
            color: tone.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--phisio-text)' }}>
            {title}
          </span>
          <span
            style={{
              fontSize: 'var(--phisio-font-meta)',
              color: 'var(--phisio-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            {description}
          </span>
        </div>
      </div>
      <ChevronLeft size={18} style={{ color: 'var(--phisio-text-secondary)', flexShrink: 0 }} />
    </button>
  );
}
