import { PersonStanding } from 'lucide-react';
import { Button, Skeleton, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { AppResult, WarmEmptyState } from '@/components/ui';
import { PatientExercisesList } from '@/features/patient/exercises/components/PatientExercisesList';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import { hasTodayExercises } from '@/features/patient/exercises/types/patient-exercise';
import { getErrorMessage } from '@/utils/get-error-message';

export function PatientTodayExercisesPanel() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = usePatientTodayExercises();

  const doctorGroups = data?.doctorGroups ?? [];
  const hasExercises = data ? hasTodayExercises(data) : false;

  if (isLoading) {
    return (
      <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 16 }}>
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </Space>
    );
  }

  if (isError) {
    return (
      <AppResult
        status="error"
        title={getErrorMessage(error, t('patient.exercises.errors.loadFailed'))}
        extra={
          <Button type="primary" onClick={() => void refetch()}>
            {t('patient.exercises.retry')}
          </Button>
        }
      />
    );
  }

  if (!hasExercises) {
    return (
      <WarmEmptyState
        title={t('patient.exercises.emptyTodayTitle')}
        description={t('patient.exercises.emptyToday')}
        lucideIcon={PersonStanding}
      />
    );
  }

  return <PatientExercisesList doctorGroups={doctorGroups} onCompletionsSaved={refetch} />;
}
