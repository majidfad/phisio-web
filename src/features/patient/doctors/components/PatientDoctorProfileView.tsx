import { Button, Card, Descriptions } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ConfirmActionModal, LoadingState, AppResult, StatusCapsule } from '@/components/ui';
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

type PendingConfirm = 'cancel' | 'unlink' | null;

export function PatientDoctorProfileView({ doctorId }: PatientDoctorProfileViewProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { data, isLoading, isError, error, refetch } = usePatientDoctorProfile(doctorId);
  const requestLink = useRequestDoctorLink();
  const cancelRequest = useCancelDoctorRequest();
  const unlink = useUnlinkDoctor();
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);

  if (isLoading) {
    return <LoadingState tip={t('patient.doctors.loading')} />;
  }

  if (isError || !data) {
    return (
      <AppResult
        status="error"
        title={getErrorMessage(error, t('patient.doctors.errors.loadFailed'))}
        extra={
          <>
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.doctors.retry')}
            </Button>
            <Link to={routes.patient.doctors}>
              <Button>{t('patient.doctors.backToDirectory')}</Button>
            </Link>
          </>
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

  const handleCancelConfirm = async () => {
    try {
      await cancelRequest.mutateAsync(doctorId);
      toast.success(t('patient.doctors.success.cancelled'));
      setPendingConfirm(null);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.cancelFailed')));
    }
  };

  const handleUnlinkConfirm = async () => {
    try {
      await unlink.mutateAsync(doctorId);
      toast.success(t('patient.doctors.success.unlinked'));
      setPendingConfirm(null);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.unlinkFailed')));
    }
  };

  return (
    <div className="patient-stack patient-stack--loose">
      <div className="patient-media-card__footer">
        <Link to={routes.patient.doctors}>
          <Button type="link">{t('patient.doctors.backToDirectory')}</Button>
        </Link>
      </div>

      <Card className="patient-media-card" title={data.name}>
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
              <StatusCapsule
                status="active"
                label={t('patient.doctors.status.approved')}
                showDot={false}
              />
            ) : status === DoctorPatientStatusCode.Pending ? (
              <StatusCapsule
                status="pending"
                label={t('patient.doctors.status.pending')}
                showDot={false}
              />
            ) : status === DoctorPatientStatusCode.Rejected ? (
              <StatusCapsule
                status="cancelled"
                label={t('patient.doctors.status.rejected')}
                showDot={false}
              />
            ) : (
              <StatusCapsule status="info" label={t('patient.doctors.status.none')} showDot={false} />
            )}
          </Descriptions.Item>
        </Descriptions>

        <div className="patient-media-card__actions">
          {status == null || status === DoctorPatientStatusCode.Rejected ? (
            <Button
              type="primary"
              size="large"
              loading={isPending}
              onClick={() => void handleRequest()}
            >
              {t('patient.doctors.actions.request')}
            </Button>
          ) : null}
          {status === DoctorPatientStatusCode.Pending ? (
            <Button
              danger
              size="large"
              loading={isPending}
              onClick={() => setPendingConfirm('cancel')}
            >
              {t('patient.doctors.actions.cancelRequest')}
            </Button>
          ) : null}
          {status === DoctorPatientStatusCode.Approved ? (
            <Button
              danger
              size="large"
              loading={isPending}
              onClick={() => setPendingConfirm('unlink')}
            >
              {t('patient.doctors.actions.unlink')}
            </Button>
          ) : null}
        </div>
      </Card>

      <ConfirmActionModal
        open={pendingConfirm === 'cancel'}
        title={t('patient.doctors.confirmCancelRequest.title')}
        message={t('patient.doctors.confirmCancelRequest.message')}
        confirmText={t('patient.doctors.confirmCancelRequest.confirm')}
        cancelText={t('patient.doctors.confirmCancelRequest.cancel')}
        confirming={cancelRequest.isPending}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={() => void handleCancelConfirm()}
      />

      <ConfirmActionModal
        open={pendingConfirm === 'unlink'}
        title={t('patient.doctors.confirmUnlink.title')}
        message={t('patient.doctors.confirmUnlink.message')}
        confirmText={t('patient.doctors.confirmUnlink.confirm')}
        cancelText={t('patient.doctors.confirmUnlink.cancel')}
        confirming={unlink.isPending}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={() => void handleUnlinkConfirm()}
      />
    </div>
  );
}
