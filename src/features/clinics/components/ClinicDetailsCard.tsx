import { useTranslation } from 'react-i18next';

import { StatusCapsule } from '@/components/ui';
import type { ClinicDto } from '@/features/clinics/types/clinic';
import { formatDisplayPhone, formatPersianNumber } from '@/utils/persian-format';

interface ClinicDetailsCardProps {
  clinic: ClinicDto;
  doctorCount: number;
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 4,
  minWidth: 0,
};

const labelStyle = {
  fontSize: 'var(--phisio-font-meta)',
  fontWeight: 600,
  color: 'var(--phisio-text-secondary)',
};

const valueStyle = {
  fontSize: 'var(--phisio-font-body)',
  color: 'var(--phisio-text)',
  lineHeight: 1.55,
};

export function ClinicDetailsCard({ clinic, doctorCount }: ClinicDetailsCardProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        padding: 16,
        border: '1px solid var(--phisio-border)',
        borderRadius: 'var(--phisio-radius-md)',
        background: 'var(--phisio-surface)',
        boxShadow: 'var(--phisio-shadow-sm)',
      }}
    >
      <div style={fieldStyle}>
        <span style={labelStyle}>{t('clinics.details.name')}</span>
        <span style={valueStyle}>
          <bdi style={{ unicodeBidi: 'plaintext' }}>{clinic.name}</bdi>
        </span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>{t('clinics.details.address')}</span>
        <span style={valueStyle}>{clinic.address}</span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>{t('clinics.details.phones')}</span>
        <span style={valueStyle} dir="ltr">
          {clinic.phoneNumbers.length === 0
            ? t('clinics.notSet')
            : clinic.phoneNumbers.map((phone) => formatDisplayPhone(phone)).join('، ')}
        </span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>{t('clinics.details.doctorCount')}</span>
        <span style={valueStyle}>{formatPersianNumber(doctorCount)}</span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>{t('clinics.details.status')}</span>
        <span>
          <StatusCapsule
            status={clinic.isEnabled ? 'active' : 'cancelled'}
            label={
              clinic.isEnabled ? t('admin.common.tabs.active') : t('admin.common.status.inactive')
            }
            showDot={false}
          />
        </span>
      </div>
    </div>
  );
}
