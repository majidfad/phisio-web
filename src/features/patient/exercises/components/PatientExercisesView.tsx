import { PageContainer } from '@/components/ui';
import { PatientTodayExercisesPanel } from '@/features/patient/exercises/components/PatientTodayExercisesPanel';

export function PatientExercisesView() {
  return (
    <PageContainer className="patient-program-page">
      <PatientTodayExercisesPanel />
    </PageContainer>
  );
}
