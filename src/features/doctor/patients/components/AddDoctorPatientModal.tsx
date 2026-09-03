import { Alert, Button, Form, Input, Modal, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type {
  DoctorClinicOptionDto,
  DoctorPatientLookupDto,
} from '@/features/doctor/patients/types/doctor-patient';
import { formatDisplayPhone } from '@/utils/persian-format';

const { Text } = Typography;

interface AddDoctorPatientModalProps {
  open: boolean;
  clinics: DoctorClinicOptionDto[];
  isLookingUp: boolean;
  isSubmitting: boolean;
  lookupError: string | null;
  matchedPatient: DoctorPatientLookupDto | null;
  onClose: () => void;
  onLookup: (phoneNumber: string) => Promise<void>;
  onSubmit: (patientId: string, clinicId: string) => Promise<void>;
}

export function AddDoctorPatientModal({
  open,
  clinics,
  isLookingUp,
  isSubmitting,
  lookupError,
  matchedPatient,
  onClose,
  onLookup,
  onSubmit,
}: AddDoctorPatientModalProps) {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clinicId, setClinicId] = useState<string | null>(null);

  const autoClinicId = clinics.length === 1 ? (clinics[0]?.clinicId ?? null) : null;
  const selectedClinicId = clinicId ?? autoClinicId;
  const selectedClinic = clinics.find((clinic) => clinic.clinicId === selectedClinicId);

  const clinicOptions = useMemo(
    () =>
      clinics.map((clinic) => ({
        value: clinic.clinicId,
        label: clinic.address ? `${clinic.name} — ${clinic.address}` : clinic.name,
      })),
    [clinics],
  );

  const handleClose = () => {
    setPhoneNumber('');
    setClinicId(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!matchedPatient || !selectedClinicId) {
      return;
    }

    await onSubmit(matchedPatient.patientId, selectedClinicId);
    setPhoneNumber('');
    setClinicId(null);
  };

  return (
    <Modal
      title={t('doctor.patients.add.title')}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Form layout="vertical" onFinish={() => void handleSubmit()}>
        <Form.Item label={t('doctor.patients.add.phoneLabel')} required>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder={t('doctor.patients.add.phonePlaceholder')}
              dir="ltr"
            />
            <Button
              size="large"
              loading={isLookingUp}
              onClick={() => void onLookup(phoneNumber.trim())}
            >
              {t('doctor.patients.add.search')}
            </Button>
          </Space.Compact>
        </Form.Item>

        {lookupError ? <Alert type="error" showIcon message={lookupError} /> : null}

        {matchedPatient ? (
          <Alert
            type="success"
            showIcon
            message={matchedPatient.patientName}
            description={<Text dir="ltr">{formatDisplayPhone(matchedPatient.phoneNumber)}</Text>}
          />
        ) : null}

        <Form.Item label={t('doctor.patients.add.clinicLabel')} required style={{ marginTop: 16 }}>
          {clinics.length === 1 ? (
            <Text>
              {selectedClinic?.address
                ? `${selectedClinic.name} — ${selectedClinic.address}`
                : (selectedClinic?.name ?? t('doctor.patients.add.noClinics'))}
            </Text>
          ) : (
            <Select
              size="large"
              showSearch
              optionFilterProp="label"
              placeholder={t('doctor.patients.add.clinicPlaceholder')}
              value={selectedClinicId ?? undefined}
              onChange={(value) => setClinicId(value)}
              options={clinicOptions}
            />
          )}
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSubmitting}
            disabled={!matchedPatient || !selectedClinicId}
          >
            {t('doctor.patients.add.submit')}
          </Button>
          <Button size="large" onClick={handleClose}>
            {t('doctor.patients.add.cancel')}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
