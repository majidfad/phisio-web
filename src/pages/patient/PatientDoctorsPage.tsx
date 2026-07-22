import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/ui';
import { PatientDoctorsDirectory } from '@/features/patient/doctors/components/PatientDoctorsDirectory';

export function PatientDoctorsPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t('patient.doctors.title')}
        description={t('patient.doctors.description')}
      />
      <PatientDoctorsDirectory />
    </PageContainer>
  );
}
