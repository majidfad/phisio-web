import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

import type { DoctorClinicOptionDto } from '@/features/doctor/patients/types/doctor-patient';
import { formatPersianNumber } from '@/utils/persian-format';

interface DoctorClinicFilterProps {
  clinics: DoctorClinicOptionDto[];
  value: string | null;
  onChange: (clinicId: string | null) => void;
  countKey?: 'activePatientCount' | 'pendingRequestCount';
}

export function DoctorClinicFilter({
  clinics,
  value,
  onChange,
  countKey = 'activePatientCount',
}: DoctorClinicFilterProps) {
  const { t } = useTranslation();

  if (clinics.length <= 1) {
    return null;
  }

  return (
    <div className="patient-filter-bar">
      <Select
        size="large"
        value={value ?? 'all'}
        onChange={(next) => onChange(next === 'all' ? null : next)}
        optionFilterProp="label"
        options={[
          { value: 'all', label: t('doctor.patients.clinicFilter.all') },
          ...clinics.map((clinic) => ({
            value: clinic.clinicId,
            label: `${clinic.name} (${formatPersianNumber(clinic[countKey])})`,
          })),
        ]}
      />
    </div>
  );
}
