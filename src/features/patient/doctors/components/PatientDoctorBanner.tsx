import { Check } from 'lucide-react';
import { Button, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { denseIconProps } from '@/components/icons/app-icon';
import { routes } from '@/routes/routes';

import { useActiveDoctor } from '../hooks/useActiveDoctor';

const { Text } = Typography;

export function PatientDoctorBanner() {
  const { t } = useTranslation();
  const { activeDoctor, approvedDoctors, pendingDoctors, setSelectedDoctorId, isLoading } =
    useActiveDoctor();

  if (isLoading) {
    return null;
  }

  if (approvedDoctors.length === 0 && pendingDoctors.length === 0) {
    return (
      <div className="status-panel status-panel--empty">
        <div className="status-panel__body">
          <Text strong>{t('patient.doctors.banner.noDoctorTitle')}</Text>
          <Text type="secondary">{t('patient.doctors.banner.noDoctorDescription')}</Text>
        </div>
        <div className="status-panel__actions">
          <Link to={routes.patient.doctors}>
            <Button type="primary" size="small">
              {t('patient.doctors.banner.findDoctor')}
            </Button>
          </Link>
          <Link to={routes.patient.library}>
            <Button size="small">{t('patient.doctors.banner.browseLibrary')}</Button>
          </Link>
          <Link to={routes.patient.articles}>
            <Button size="small">{t('patient.doctors.banner.browseArticles')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (approvedDoctors.length === 0 && pendingDoctors.length > 0) {
    return (
      <div className="status-panel status-panel--pending">
        <div className="status-panel__body">
          <Text strong>{t('patient.doctors.banner.pendingTitle')}</Text>
          <Text type="secondary">
            {t('patient.doctors.banner.pendingDescription', {
              count: pendingDoctors.length,
            })}
          </Text>
        </div>
        <div className="status-panel__actions">
          <Link to={routes.patient.doctors}>
            <Button size="small">{t('patient.doctors.banner.viewRequests')}</Button>
          </Link>
          <Link to={routes.patient.library}>
            <Button size="small">{t('patient.doctors.banner.browseLibrary')}</Button>
          </Link>
          <Link to={routes.patient.articles}>
            <Button size="small">{t('patient.doctors.banner.browseArticles')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="status-panel status-panel--linked">
      <span className="status-panel__icon" aria-hidden>
        <Check {...denseIconProps} strokeWidth={2.5} />
      </span>
      <div className="status-panel__body">
        <div className="status-panel__title-row">
          <Text strong>
            {t('patient.doctors.banner.linkedTitle', {
              doctorName: activeDoctor?.name ?? '',
            })}
          </Text>
          {approvedDoctors.length > 1 ? (
            <Select
              size="small"
              style={{ minWidth: 160 }}
              value={activeDoctor?.doctorId}
              onChange={(value) => setSelectedDoctorId(value)}
              options={approvedDoctors.map((doctor) => ({
                value: doctor.doctorId,
                label: doctor.name,
              }))}
              aria-label={t('patient.doctors.banner.switchLabel')}
            />
          ) : null}
        </div>
        <Text type="secondary">
          {activeDoctor?.specialty
            ? t('patient.doctors.banner.linkedSpecialty', { specialty: activeDoctor.specialty })
            : t('patient.doctors.banner.linkedDescription')}
        </Text>
      </div>
      <div className="status-panel__actions">
        <Link to={routes.patient.doctors}>
          <Button size="small" type="default">
            {t('patient.doctors.banner.manage')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
