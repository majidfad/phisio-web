import { Button, Card, Descriptions, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppResult } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits } from '@/utils/persian-format';

import {
  useCancelDoctorRequest,
  usePatientDoctorProfile,
  useRequestDoctorLink,
  useUnlinkDoctor,
} from '../hooks/usePatientDoctors';
import { DoctorPatientStatusCode } from '../types/patient-doctor';

interface PatientDoctorProfileViewProps {
  doctorId: string;
}

export function PatientDoctorProfileView({ doctorId }: PatientDoctorProfileViewProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, isLoading, isError, error, refetch } = usePatientDoctorProfile(doctorId);
  const requestLink = useRequestDoctorLink();
  const cancelRequest = useCancelDoctorRequest();
  const unlink = useUnlinkDoctor();

  if (isLoading) {
    return <LoadingState tip={t('patient.doctors.loading')} />;
  }

  if (isError || !data) {
    return (
      <AppResult
        status="error"
        title={getErrorMessage(error, t('patient.doctors.errors.loadFailed'))}
        extra={
          <Space>
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.doctors.retry')}
            </Button>
            <Link to={routes.patient.doctors}>
              <Button>{t('patient.doctors.backToDirectory')}</Button>
            </Link>
          </Space>
        }
      />
    );
  }

  const status = data.relationshipStatus;
  const isPending = requestLink.isPending || cancelRequest.isPending || unlink.isPending;

  const handleRequest = async () => {
    try {
      await requestLink.mutateAsync(doctorId);
      toast.success(t('patient.doctors.success.requested'));
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.requestFailed')));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelRequest.mutateAsync(doctorId);
      toast.success(t('patient.doctors.success.cancelled'));
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.cancelFailed')));
    }
  };

  const handleUnlink = async () => {
    try {
      await unlink.mutateAsync(doctorId);
      toast.success(t('patient.doctors.success.unlinked'));
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.unlinkFailed')));
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Link to={routes.patient.doctors}>
        <Button type="link" style={{ paddingInline: 0 }}>
          {t('patient.doctors.backToDirectory')}
        </Button>
      </Link>

      <Card title={data.name}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('patient.doctors.fields.specialty')}>
            {data.specialty || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.license')}>
            {data.medicalLicenseNumber || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.clinic')}>
            {data.clinicAddress || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.phone')}>
            <span dir="ltr">
              {data.phoneNumber ? convertToPersianDigits(data.phoneNumber) : '—'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.status')}>
            {status === DoctorPatientStatusCode.Approved ? (
              <Tag color="success">{t('patient.doctors.status.approved')}</Tag>
            ) : status === DoctorPatientStatusCode.Pending ? (
              <Tag color="warning">{t('patient.doctors.status.pending')}</Tag>
            ) : status === DoctorPatientStatusCode.Rejected ? (
              <Tag color="error">{t('patient.doctors.status.rejected')}</Tag>
            ) : (
              <Tag>{t('patient.doctors.status.none')}</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Space wrap style={{ marginTop: 16 }}>
          {status == null || status === DoctorPatientStatusCode.Rejected ? (
            <Button type="primary" loading={isPending} onClick={() => void handleRequest()}>
              {t('patient.doctors.actions.request')}
            </Button>
          ) : null}
          {status === DoctorPatientStatusCode.Pending ? (
            <Button danger loading={isPending} onClick={() => void handleCancel()}>
              {t('patient.doctors.actions.cancelRequest')}
            </Button>
          ) : null}
          {status === DoctorPatientStatusCode.Approved ? (
            <Button danger loading={isPending} onClick={() => void handleUnlink()}>
              {t('patient.doctors.actions.unlink')}
            </Button>
          ) : null}
        </Space>
      </Card>
    </Space>
  );
}
