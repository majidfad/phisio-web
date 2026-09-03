import { Button, Col, Input, Modal, Row, Select, Space, Typography, TimePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { JalaliDatePicker } from '@/components/JalaliDatePicker';
import { AppResult } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/get-error-message';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import { useDoctorPatients } from '@/features/doctor/patients/hooks/useDoctorPatients';
import { useRegisterPatientVisit } from '@/features/visits/hooks/usePatientVisits';
import type { PatientCondition, VisitType } from '@/features/visits/types/patient-visit';

const { Text } = Typography;

interface AddPatientVisitModalProps {
  open: boolean;
  /** Pass a pre-selected patient (e.g. from PatientOverviewDrawer), or null to let the doctor pick one. */
  patient: DoctorPatientDto | null;
  onClose: () => void;
}

function toIsoDateTime(isoDate: string, time: Dayjs): string {
  const timePart = time.format('HH:mm');
  const dt = new Date(`${isoDate}T${timePart}:00`);
  return dt.toISOString();
}

export function AddPatientVisitModal({ open, patient, onClose }: AddPatientVisitModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();

  const doctorId = user?.userId ?? null;

  const [visitDate, setVisitDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [visitTime, setVisitTime] = useState<Dayjs>(() => dayjs().hour(9).minute(0).second(0));
  const [visitType, setVisitType] = useState<VisitType | null>(null);
  const [patientCondition, setPatientCondition] = useState<PatientCondition | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Only fetch the patient list when no patient is pre-selected and the modal is open.
  const { data: patientsData, isLoading: isPatientsLoading } = useDoctorPatients();

  const patientOptions = useMemo(
    () =>
      (patientsData ?? []).map((p) => ({
        value: p.patientId,
        label: `${p.patientName} — ${p.clinicName}`,
        patient: p,
      })),
    [patientsData],
  );

  // Resolve which patient will be used for submission.
  const resolvedPatient: DoctorPatientDto | null = useMemo(() => {
    if (patient) return patient;
    if (!selectedPatientId) return null;
    return patientsData?.find((p) => p.patientId === selectedPatientId) ?? null;
  }, [patient, selectedPatientId, patientsData]);

  const canSubmit = Boolean(doctorId && resolvedPatient && visitDate && visitDate.length > 0);

  const registerVisit = useRegisterPatientVisit();

  const handleSubmit = async () => {
    if (!resolvedPatient || !doctorId) return;

    const payload = {
      patientId: resolvedPatient.patientId,
      doctorId,
      clinicId: resolvedPatient.clinicId,
      visitAt: toIsoDateTime(visitDate, visitTime),
      visitType: visitType ?? null,
      patientCondition: patientCondition ?? null,
      doctorNotes: notes.trim() === '' ? null : notes.trim(),
    };

    try {
      await registerVisit.mutateAsync(payload);
      toast.success(t('doctor.patients.visits.add.success'));
      onClose();
      setNotes('');
      setVisitType(null);
      setPatientCondition(null);
      setSelectedPatientId(null);
    } catch (err) {
      toast.error(getErrorMessage(err, t('doctor.patients.visits.add.error')));
    }
  };

  const headerTitle = useMemo(
    () => patient?.patientName ?? t('doctor.patients.visits.add.title'),
    [patient, t],
  );

  return (
    <Modal
      title={headerTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={720}
    >
      {registerVisit.isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(registerVisit.error, t('doctor.patients.visits.add.error'))}
        />
      ) : null}

      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        {/* Patient selector — only shown when no patient is pre-selected */}
        {!patient ? (
          <div>
            <Text strong>{t('doctor.patients.visits.add.patientLabel')}</Text>
            <div style={{ marginTop: 8 }}>
              <Select
                showSearch
                allowClear
                loading={isPatientsLoading}
                placeholder={t('doctor.patients.visits.add.patientPlaceholder')}
                value={selectedPatientId ?? undefined}
                onChange={(val: string | undefined) => setSelectedPatientId(val ?? null)}
                options={patientOptions}
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
          </div>
        ) : null}

        <div>
          <Text strong>{t('doctor.patients.visits.add.dateLabel')}</Text>
          <div style={{ marginTop: 8 }}>
            <JalaliDatePicker value={visitDate} onChange={setVisitDate} />
          </div>
        </div>

        <div>
          <Text strong>{t('doctor.patients.visits.add.timeLabel')}</Text>
          <div style={{ marginTop: 8 }}>
            <TimePicker
              value={visitTime}
              onChange={(value) => {
                if (value) setVisitTime(value);
              }}
              format="HH:mm"
              minuteStep={15}
              needConfirm={false}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Text strong>{t('doctor.patients.visits.add.visitTypeLabel')}</Text>
            <div style={{ marginTop: 8 }}>
              <Select
                allowClear
                placeholder={t('doctor.patients.visits.add.visitTypePlaceholder')}
                value={visitType ?? undefined}
                onChange={(val: VisitType | undefined) => setVisitType(val ?? null)}
                style={{ width: '100%' }}
                options={[
                  { value: 1, label: t('visitType.initial') },
                  { value: 2, label: t('visitType.followUp') },
                  { value: 3, label: t('visitType.emergency') },
                  { value: 4, label: t('visitType.discharge') },
                ]}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <Text strong>{t('doctor.patients.visits.add.patientConditionLabel')}</Text>
            <div style={{ marginTop: 8 }}>
              <Select
                allowClear
                placeholder={t('doctor.patients.visits.add.patientConditionPlaceholder')}
                value={patientCondition ?? undefined}
                onChange={(val: PatientCondition | undefined) => setPatientCondition(val ?? null)}
                style={{ width: '100%' }}
                options={[
                  { value: 1, label: t('patientCondition.improved') },
                  { value: 2, label: t('patientCondition.unchanged') },
                  { value: 3, label: t('patientCondition.worsened') },
                ]}
              />
            </div>
          </Col>
        </Row>

        <div>
          <Text strong>{t('doctor.patients.visits.add.notesLabel')}</Text>
          <div style={{ marginTop: 8 }}>
            <Input.TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('doctor.patients.visits.add.notesPlaceholder')}
              maxLength={2000}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onClose}>{t('clinics.form.close')}</Button>
          <Button
            type="primary"
            loading={registerVisit.isPending}
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {t('doctor.patients.visits.add.submit')}
          </Button>
        </div>
      </Space>
    </Modal>
  );
}
