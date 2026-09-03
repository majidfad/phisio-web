import { Button, Card, Descriptions, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import { ConfirmActionModal, LoadingState, AppResult, StatusCapsule } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits } from '@/utils/persian-format';

import {
  useCancelDoctorRequest,
  usePatientDoctorClinics,
  usePatientDoctorProfile,
  useRequestDoctorLink,
  useUnlinkDoctor,
} from '../hooks/usePatientDoctors';
import {
  DoctorPatientStatusCode,
  type PatientDoctorClinicOptionDto,
} from '../types/patient-doctor';

function resolveSelectedClinicId(
  clinics: PatientDoctorClinicOptionDto[] | undefined,
  preferredClinicId: string | null,
  userSelectedClinicId: string | null,
): string | null {
  if (!clinics?.length) {
    return null;
  }

  if (userSelectedClinicId && clinics.some((clinic) => clinic.clinicId === userSelectedClinicId)) {
    return userSelectedClinicId;
  }

  if (preferredClinicId && clinics.some((clinic) => clinic.clinicId === preferredClinicId)) {
    return preferredClinicId;
  }

  if (clinics.length === 1) {
    return clinics[0]?.clinicId ?? null;
  }

  return null;
}

interface PatientDoctorProfileViewProps {
  doctorId: string;
}

type PendingConfirm = 'cancel' | 'unlink' | null;

export function PatientDoctorProfileView({ doctorId }: PatientDoctorProfileViewProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const preferredClinicId = searchParams.get('clinicId');
  const clinicsQuery = usePatientDoctorClinics(doctorId);
  const [userSelectedClinicId, setUserSelectedClinicId] = useState<string | null>(
    preferredClinicId,
  );
  const selectedClinicId = resolveSelectedClinicId(
    clinicsQuery.data,
    preferredClinicId,
    userSelectedClinicId,
  );

  const { data, isLoading, isError, error, refetch } = usePatientDoctorProfile(
    doctorId,
    selectedClinicId,
  );
  const requestLink = useRequestDoctorLink();
  const cancelRequest = useCancelDoctorRequest();
  const unlink = useUnlinkDoctor();
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);

  const selectedClinic = useMemo(
    () => clinicsQuery.data?.find((clinic) => clinic.clinicId === selectedClinicId) ?? null,
    [clinicsQuery.data, selectedClinicId],
  );

  const status = selectedClinic?.relationshipStatus ?? data?.relationshipStatus ?? null;
  const isPending =
    requestLink.isPending || cancelRequest.isPending || unlink.isPending || clinicsQuery.isLoading;

  if (clinicsQuery.isLoading || isLoading) {
    return <LoadingState tip={t('patient.doctors.loading')} />;
  }

  if (clinicsQuery.isError || isError || !data) {
    return (
      <AppResult
        status="error"
        title={getErrorMessage(clinicsQuery.error ?? error, t('patient.doctors.errors.loadFailed'))}
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

  const handleRequest = async () => {
    if (!selectedClinicId) {
      return;
    }

    try {
      await requestLink.mutateAsync({ doctorId, clinicId: selectedClinicId });
      toast.success(t('patient.doctors.success.requested'));
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.requestFailed')));
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedClinicId) {
      return;
    }

    try {
      await cancelRequest.mutateAsync({ doctorId, clinicId: selectedClinicId });
      toast.success(t('patient.doctors.success.cancelled'));
      setPendingConfirm(null);
    } catch (submitError) {
      toast.error(getErrorMessage(submitError, t('patient.doctors.errors.cancelFailed')));
    }
  };

  const handleUnlinkConfirm = async () => {
    if (!selectedClinicId) {
      return;
    }

    try {
      await unlink.mutateAsync({ doctorId, clinicId: selectedClinicId });
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
          <Descriptions.Item label={t('patient.doctors.fields.clinic')}>
            {clinicsQuery.data && clinicsQuery.data.length > 1 ? (
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: '100%' }}
                value={selectedClinicId ?? undefined}
                placeholder={t('patient.doctors.selectClinicPlaceholder')}
                onChange={(value) => setUserSelectedClinicId(value ?? null)}
                options={clinicsQuery.data.map((clinic) => ({
                  value: clinic.clinicId,
                  label: clinic.address ? `${clinic.name} — ${clinic.address}` : clinic.name,
                }))}
              />
            ) : clinicsQuery.data && clinicsQuery.data.length === 1 ? (
              selectedClinic?.address ? (
                `${selectedClinic.name} — ${selectedClinic.address}`
              ) : (
                (selectedClinic?.name ?? t('patient.doctors.emptyClinics'))
              )
            ) : (
              t('patient.doctors.emptyClinics')
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.specialty')}>
            {data.specialty || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.license')}>
            {data.medicalLicenseNumber || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={t('patient.doctors.fields.address')}>
            {selectedClinic?.address || data.clinicAddress || '—'}
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
              <StatusCapsule
                status="info"
                label={t('patient.doctors.status.none')}
                showDot={false}
              />
            )}
          </Descriptions.Item>
        </Descriptions>

        <div className="patient-media-card__actions">
          {status == null || status === DoctorPatientStatusCode.Rejected ? (
            <Button
              type="primary"
              size="large"
              loading={isPending}
              disabled={!selectedClinicId}
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
