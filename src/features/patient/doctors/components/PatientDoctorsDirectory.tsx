import { Button, Card, Empty, Input, Select, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState } from '@/components/ui';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits } from '@/utils/persian-format';

import { usePatientDoctorDirectory } from '../hooks/usePatientDoctors';
import { DoctorPatientStatusCode } from '../types/patient-doctor';

const { Text, Title } = Typography;

export function PatientDoctorsDirectory() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const { data = [], isLoading, isError, error, refetch } = usePatientDoctorDirectory(
    search,
    specialty,
  );

  const specialtyOptions = useMemo(() => {
    const values = new Set(
      data.map((doctor) => doctor.specialty.trim()).filter((value) => value.length > 0),
    );
    return Array.from(values)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }));
  }, [data]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Space wrap style={{ width: '100%' }}>
        <Input.Search
          allowClear
          placeholder={t('patient.doctors.searchPlaceholder')}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onSearch={(value) => setSearch(value.trim())}
          style={{ minWidth: 220, maxWidth: 360 }}
        />
        <Select
          allowClear
          showSearch
          placeholder={t('patient.doctors.specialtyFilter')}
          style={{ minWidth: 180 }}
          value={specialty || undefined}
          onChange={(value) => setSpecialty(value ?? '')}
          options={specialtyOptions}
          optionFilterProp="label"
        />
      </Space>

      {isLoading ? <LoadingState tip={t('patient.doctors.loading')} /> : null}

      {isError ? (
        <Card>
          <Text type="danger">{getErrorMessage(error, t('patient.doctors.errors.loadFailed'))}</Text>
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => void refetch()}>{t('patient.doctors.retry')}</Button>
          </div>
        </Card>
      ) : null}

      {!isLoading && !isError && data.length === 0 ? (
        <Empty description={t('patient.doctors.emptyDirectory')} />
      ) : null}

      {!isLoading && !isError
        ? data.map((doctor) => (
            <Card key={doctor.doctorId} size="small">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {doctor.name}
                  </Title>
                  <RelationshipTag status={doctor.relationshipStatus} />
                </Space>
                {doctor.specialty ? <Text type="secondary">{doctor.specialty}</Text> : null}
                {doctor.clinicAddress ? <Text>{doctor.clinicAddress}</Text> : null}
                {doctor.phoneNumber ? (
                  <Text dir="ltr">{convertToPersianDigits(doctor.phoneNumber)}</Text>
                ) : null}
                <Link to={`${routes.patient.doctors}/${doctor.doctorId}`}>
                  <Button type="link" style={{ paddingInline: 0 }}>
                    {t('patient.doctors.viewProfile')}
                  </Button>
                </Link>
              </Space>
            </Card>
          ))
        : null}
    </Space>
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
