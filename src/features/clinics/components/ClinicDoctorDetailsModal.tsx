import { Button, Modal, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AppResult, LoadingState, StatusCapsule } from '@/components/ui';
import { ClinicAdherenceStats } from '@/features/clinics/components/ClinicAdherenceStats';
import { ClinicPatientsTable } from '@/features/clinics/components/ClinicPatientsTable';
import { useClinicAdherence, useClinicPatients } from '@/features/clinics/hooks/useClinics';
import type { ClinicDoctorMemberDto } from '@/features/clinics/types/clinic';
import { normalizeUserRole } from '@/features/auth/utils/normalize-user-role';
import {
  mergePatientsWithAdherence,
  toAdherenceLookup,
} from '@/features/clinics/utils/clinic-patient-adherence';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text } = Typography;

interface ClinicDoctorDetailsModalProps {
  open: boolean;
  clinicId: string | undefined;
  doctor: ClinicDoctorMemberDto | null;
  onClose: () => void;
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

function roleLabel(role: ClinicDoctorMemberDto['role'], t: (key: string) => string): string {
  const normalized = normalizeUserRole(role);
  if (normalized === 'ClinicManager') {
    return t('layout.roles.clinicManager');
  }

  if (normalized === 'Doctor') {
    return t('layout.roles.doctor');
  }

  return t('clinics.notSet');
}

export function ClinicDoctorDetailsModal({
  open,
  clinicId,
  doctor,
  onClose,
}: ClinicDoctorDetailsModalProps) {
  const { t } = useTranslation();
  const doctorId = open ? doctor?.doctorId : undefined;
  const {
    data: patients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useClinicPatients(open ? clinicId : undefined, doctorId);
  const adherenceQuery = useClinicAdherence(open ? clinicId : undefined, doctorId);

  const patientsWithAdherence = useMemo(
    () =>
      mergePatientsWithAdherence(patients, toAdherenceLookup(adherenceQuery.data?.patients ?? [])),
    [patients, adherenceQuery.data?.patients],
  );

  return (
    <Modal
      title={t('clinics.doctors.details.title')}
      open={open && doctor !== null}
      onCancel={onClose}
      footer={<Button onClick={onClose}>{t('clinics.form.close')}</Button>}
      destroyOnHidden
      centered
      width={800}
    >
      {doctor ? (
        <Space orientation="vertical" size={20} style={{ width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              padding: 16,
              border: '1px solid var(--phisio-border)',
              borderRadius: 'var(--phisio-radius-md)',
              background: 'var(--phisio-surface)',
            }}
          >
            <div style={fieldStyle}>
              <span style={labelStyle}>{t('clinics.doctors.details.fields.name')}</span>
              <span style={valueStyle}>
                <Space size={8} wrap>
                  <bdi style={{ unicodeBidi: 'plaintext' }}>{doctor.name}</bdi>
                  {doctor.isClinicManager ? (
                    <StatusCapsule
                      status="info"
                      label={t('clinics.doctors.managerBadge')}
                      showDot={false}
                    />
                  ) : null}
                </Space>
              </span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>{t('clinics.doctors.details.fields.phone')}</span>
              <span style={valueStyle} dir="ltr">
                {formatDisplayPhone(doctor.phoneNumber)}
              </span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>{t('clinics.doctors.details.fields.specialty')}</span>
              <span style={valueStyle}>{doctor.specialty || t('clinics.notSet')}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>{t('clinics.doctors.details.fields.license')}</span>
              <span style={valueStyle}>{doctor.medicalLicenseNumber || t('clinics.notSet')}</span>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>{t('clinics.doctors.details.fields.role')}</span>
              <span style={valueStyle}>{roleLabel(doctor.role, t)}</span>
            </div>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('clinics.adherence.title')}
            </Text>
            <ClinicAdherenceStats clinicId={clinicId} doctorId={doctor.doctorId} compact />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('clinics.doctors.details.patientsTitle')}
            </Text>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              {t('clinics.doctors.details.patientsDescription')}
            </Text>

            {isLoading ? <LoadingState tip={t('clinics.patients.loading')} /> : null}

            {isError ? (
              <AppResult
                status="error"
                title={getErrorMessage(error, t('clinics.patients.errors.loadFailed'))}
                extra={
                  <Button type="primary" onClick={() => void refetch()}>
                    {t('clinics.retry')}
                  </Button>
                }
              />
            ) : null}

            {!isLoading && !isError ? (
              <ClinicPatientsTable
                patients={patientsWithAdherence}
                hideDoctorColumn
                showAdherenceColumn
              />
            ) : null}
          </div>
        </Space>
      ) : null}
    </Modal>
  );
}
