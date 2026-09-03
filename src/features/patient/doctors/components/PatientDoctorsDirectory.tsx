import { Button, Card, Input, Select, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppEmpty, PageSection, StatusCapsule } from '@/components/ui';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { convertToPersianDigits } from '@/utils/persian-format';

import { useMyDoctors, usePatientDoctorDirectory } from '../hooks/usePatientDoctors';
import {
  DoctorPatientStatusCode,
  type PatientDoctorDirectoryItemDto,
  type PatientLinkedDoctorDto,
} from '../types/patient-doctor';

const { Text } = Typography;

export function PatientDoctorsDirectory() {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const isSearching = search.trim().length > 0;

  const {
    data: myDoctors = [],
    isLoading: isMineLoading,
    isError: isMineError,
    error: mineError,
    refetch: refetchMine,
  } = useMyDoctors();

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    refetch: refetchSearch,
  } = usePatientDoctorDirectory(search, specialty);

  const specialtyOptions = useMemo(() => {
    const source = isSearching
      ? searchResults.map((doctor) => doctor.specialty)
      : myDoctors.map((doctor) => doctor.specialty);
    const values = new Set(source.map((value) => value.trim()).filter((value) => value.length > 0));
    return Array.from(values)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value }));
  }, [isSearching, myDoctors, searchResults]);

  const handleSearch = (value: string) => {
    const nextSearch = value.trim();
    setSearch(nextSearch);
    if (!nextSearch) {
      setSpecialty('');
    }
  };

  return (
    <div className="patient-stack patient-stack--loose">
      <div className="patient-filter-bar">
        <Input.Search
          allowClear
          size="large"
          placeholder={t('patient.doctors.searchPlaceholder')}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onSearch={handleSearch}
          onClear={() => handleSearch('')}
        />
        {isSearching ? (
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
        ) : null}
      </div>

      <PageSection title={t('patient.doctors.connectedTitle')}>
        {isMineLoading ? <LoadingState tip={t('patient.doctors.loading')} /> : null}

        {isMineError ? (
          <Card className="patient-media-card">
            <Text type="danger">
              {getErrorMessage(mineError, t('patient.doctors.errors.loadFailed'))}
            </Text>
            <div className="patient-media-card__footer">
              <Button onClick={() => void refetchMine()}>{t('patient.doctors.retry')}</Button>
            </div>
          </Card>
        ) : null}

        {!isMineLoading && !isMineError && myDoctors.length === 0 ? (
          <AppEmpty description={t('patient.doctors.emptyConnected')} />
        ) : null}

        {!isMineLoading && !isMineError ? (
          <div className="patient-stack">
            {myDoctors.map((doctor) => (
              <ConnectedDoctorCard key={`${doctor.doctorId}:${doctor.clinicId}`} doctor={doctor} />
            ))}
          </div>
        ) : null}
      </PageSection>

      {isSearching ? (
        <PageSection
          title={t('patient.doctors.searchResultsTitle')}
          description={t('patient.doctors.searchResultsDescription', { query: search })}
        >
          {isSearchLoading ? <LoadingState tip={t('patient.doctors.loading')} /> : null}

          {isSearchError ? (
            <Card className="patient-media-card">
              <Text type="danger">
                {getErrorMessage(searchError, t('patient.doctors.errors.loadFailed'))}
              </Text>
              <div className="patient-media-card__footer">
                <Button onClick={() => void refetchSearch()}>{t('patient.doctors.retry')}</Button>
              </div>
            </Card>
          ) : null}

          {!isSearchLoading && !isSearchError && searchResults.length === 0 ? (
            <AppEmpty description={t('patient.doctors.emptyDirectory')} />
          ) : null}

          {!isSearchLoading && !isSearchError ? (
            <div className="patient-stack">
              {searchResults.map((doctor) => (
                <DirectoryDoctorCard key={doctor.doctorId} doctor={doctor} />
              ))}
            </div>
          ) : null}
        </PageSection>
      ) : null}
    </div>
  );
}

function ConnectedDoctorCard({ doctor }: { doctor: PatientLinkedDoctorDto }) {
  const { t } = useTranslation();

  return (
    <Card className="patient-media-card" size="small">
      <div className="patient-media-card__header">
        <h3 className="patient-media-card__title">{doctor.name}</h3>
        <RelationshipTag status={doctor.status} />
      </div>
      {doctor.specialty ? (
        <span className="patient-media-card__meta">{doctor.specialty}</span>
      ) : null}
      {doctor.clinicName ? <p className="patient-media-card__body">{doctor.clinicName}</p> : null}
      {doctor.phoneNumber ? (
        <p className="patient-media-card__body" dir="ltr">
          {convertToPersianDigits(doctor.phoneNumber)}
        </p>
      ) : null}
      <div className="patient-media-card__footer">
        <Link
          to={`${routes.patient.doctors}/${doctor.doctorId}?clinicId=${encodeURIComponent(doctor.clinicId)}`}
        >
          <Button type="link">{t('patient.doctors.viewProfile')}</Button>
        </Link>
      </div>
    </Card>
  );
}

function DirectoryDoctorCard({ doctor }: { doctor: PatientDoctorDirectoryItemDto }) {
  const { t } = useTranslation();

  return (
    <Card className="patient-media-card" size="small">
      <div className="patient-media-card__header">
        <h3 className="patient-media-card__title">{doctor.name}</h3>
        <RelationshipTag status={doctor.relationshipStatus} />
      </div>
      {doctor.specialty ? (
        <span className="patient-media-card__meta">{doctor.specialty}</span>
      ) : null}
      <DoctorClinicsSummary clinics={doctor.clinics} />
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
  );
}

function DoctorClinicsSummary({ clinics }: { clinics: PatientDoctorDirectoryItemDto['clinics'] }) {
  const { t } = useTranslation();

  if (!clinics?.length) {
    return null;
  }

  if (clinics.length === 1) {
    const clinic = clinics[0];
    return (
      <p className="patient-media-card__body">
        {clinic.address ? `${clinic.name} — ${clinic.address}` : clinic.name}
      </p>
    );
  }

  return (
    <p className="patient-media-card__body">
      {t('patient.doctors.clinicCount', { count: clinics.length })}
      {': '}
      {clinics.map((clinic) => clinic.name).join('، ')}
    </p>
  );
}

function RelationshipTag({ status }: { status: number | null }) {
  const { t } = useTranslation();

  if (status === DoctorPatientStatusCode.Approved) {
    return (
      <StatusCapsule status="active" label={t('patient.doctors.status.approved')} showDot={false} />
    );
  }
  if (status === DoctorPatientStatusCode.Pending) {
    return (
      <StatusCapsule status="pending" label={t('patient.doctors.status.pending')} showDot={false} />
    );
  }
  if (status === DoctorPatientStatusCode.Rejected) {
    return (
      <StatusCapsule
        status="cancelled"
        label={t('patient.doctors.status.rejected')}
        showDot={false}
      />
    );
  }
  return <StatusCapsule status="info" label={t('patient.doctors.status.none')} showDot={false} />;
}
