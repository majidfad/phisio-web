import { Button, Card, Input, Select, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppEmpty } from '@/components/ui';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits } from '@/utils/persian-format';

import { usePatientDoctorDirectory } from '../hooks/usePatientDoctors';
import { DoctorPatientStatusCode } from '../types/patient-doctor';

const { Text } = Typography;

export function PatientDoctorsDirectory() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientDoctorDirectory(search, specialty);

  const specialtyOptions = useMemo(() => {
    const values = new Set(
      data.map((doctor) => doctor.specialty.trim()).filter((value) => value.length > 0),
    );
    return Array.from(values)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }));
  }, [data]);

  return (
    <div className="patient-stack patient-stack--loose">
      <div className="patient-filter-bar">
        <Input.Search
          allowClear
          size="large"
          placeholder={t('patient.doctors.searchPlaceholder')}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onSearch={(value) => setSearch(value.trim())}
        />
        <Select
          allowClear
          showSearch
          size="large"
          placeholder={t('patient.doctors.specialtyFilter')}
          value={specialty || undefined}
          onChange={(value) => setSpecialty(value ?? '')}
          options={specialtyOptions}
          optionFilterProp="label"
        />
      </div>

      {isLoading ? <LoadingState tip={t('patient.doctors.loading')} /> : null}

      {isError ? (
        <Card className="patient-media-card">
          <Text type="danger">
            {getErrorMessage(error, t('patient.doctors.errors.loadFailed'))}
          </Text>
          <div className="patient-media-card__footer">
            <Button onClick={() => void refetch()}>{t('patient.doctors.retry')}</Button>
          </div>
        </Card>
      ) : null}

      {!isLoading && !isError && data.length === 0 ? (
        <AppEmpty description={t('patient.doctors.emptyDirectory')} />
      ) : null}

      {!isLoading && !isError ? (
        <div className="patient-stack">
          {data.map((doctor) => (
            <Card key={doctor.doctorId} className="patient-media-card" size="small">
              <div className="patient-media-card__header">
                <h3 className="patient-media-card__title">{doctor.name}</h3>
                <RelationshipTag status={doctor.relationshipStatus} />
              </div>
              {doctor.specialty ? (
                <span className="patient-media-card__meta">{doctor.specialty}</span>
              ) : null}
              {doctor.clinicAddress ? (
                <p className="patient-media-card__body">{doctor.clinicAddress}</p>
              ) : null}
              {doctor.phoneNumber ? (
                <p className="patient-media-card__body" dir="ltr">
                  {convertToPersianDigits(doctor.phoneNumber)}
                </p>
              ) : null}
              <div className="patient-media-card__footer">
                <Link to={`${routes.patient.doctors}/${doctor.doctorId}`}>
                  <Button type="link">{t('patient.doctors.viewProfile')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RelationshipTag({ status }: { status: number | null }) {
  const { t } = useTranslation();

  if (status === DoctorPatientStatusCode.Approved) {
    return <Tag color="success">{t('patient.doctors.status.approved')}</Tag>;
  }
  if (status === DoctorPatientStatusCode.Pending) {
    return <Tag color="warning">{t('patient.doctors.status.pending')}</Tag>;
  }
  if (status === DoctorPatientStatusCode.Rejected) {
    return <Tag color="error">{t('patient.doctors.status.rejected')}</Tag>;
  }
  return <Tag>{t('patient.doctors.status.none')}</Tag>;
}
