import { Alert, Button, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { routes } from '@/routes/routes';

import { useActiveDoctor } from '../hooks/useActiveDoctor';

export function PatientDoctorBanner() {
  const { t } = useTranslation();
  const { activeDoctor, approvedDoctors, pendingDoctors, setSelectedDoctorId, isLoading } =
    useActiveDoctor();

  if (isLoading) {
    return null;
  }

  if (approvedDoctors.length === 0 && pendingDoctors.length === 0) {
    return (
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={t('patient.doctors.banner.noDoctorTitle')}
        description={t('patient.doctors.banner.noDoctorDescription')}
        action={
          <Space wrap>
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
          </Space>
        }
      />
    );
  }

  if (approvedDoctors.length === 0 && pendingDoctors.length > 0) {
    return (
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message={t('patient.doctors.banner.pendingTitle')}
        description={t('patient.doctors.banner.pendingDescription', {
          count: pendingDoctors.length,
        })}
        action={
          <Space wrap>
            <Link to={routes.patient.doctors}>
              <Button size="small">{t('patient.doctors.banner.viewRequests')}</Button>
            </Link>
            <Link to={routes.patient.library}>
              <Button size="small">{t('patient.doctors.banner.browseLibrary')}</Button>
            </Link>
            <Link to={routes.patient.articles}>
              <Button size="small">{t('patient.doctors.banner.browseArticles')}</Button>
            </Link>
          </Space>
        }
      />
    );
  }

  return (
    <Alert
      type="success"
      showIcon
      style={{ marginBottom: 16 }}
      message={
        <Space wrap>
          <Typography.Text strong>
            {t('patient.doctors.banner.linkedTitle', {
              doctorName: activeDoctor?.name ?? '',
            })}
          </Typography.Text>
          {approvedDoctors.length > 1 ? (
            <Select
              size="small"
              style={{ minWidth: 180 }}
              value={activeDoctor?.doctorId}
              onChange={(value) => setSelectedDoctorId(value)}
              options={approvedDoctors.map((doctor) => ({
                value: doctor.doctorId,
                label: doctor.name,
              }))}
              aria-label={t('patient.doctors.banner.switchLabel')}
            />
          ) : null}
        </Space>
      }
      description={
        activeDoctor?.specialty
          ? t('patient.doctors.banner.linkedSpecialty', { specialty: activeDoctor.specialty })
          : t('patient.doctors.banner.linkedDescription')
      }
      action={
        <Link to={routes.patient.doctors}>
          <Button size="small">{t('patient.doctors.banner.manage')}</Button>
        </Link>
      }
    />
  );
}
