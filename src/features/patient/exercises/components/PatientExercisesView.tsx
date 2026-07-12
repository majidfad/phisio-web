import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/ui';
import { PatientTodayExercisesPanel } from '@/features/patient/exercises/components/PatientTodayExercisesPanel';

export function PatientExercisesView() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t('patient.exercises.todayTitle')}
        description={t('patient.exercises.description')}
      />
      <PatientTodayExercisesPanel />
    </PageContainer>
  );
}
