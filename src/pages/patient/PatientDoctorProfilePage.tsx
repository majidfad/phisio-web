import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/ui';
import { PatientDoctorProfileView } from '@/features/patient/doctors/components/PatientDoctorProfileView';

export function PatientDoctorProfilePage() {
  const { t } = useTranslation();
  const { doctorId } = useParams<{ doctorId: string }>();

  return (
    <PageContainer>
      <PageHeader
        title={t('patient.doctors.profileTitle')}
        description={t('patient.doctors.profileDescription')}
      />
      {doctorId ? <PatientDoctorProfileView doctorId={doctorId} /> : null}
    </PageContainer>
  );
}
