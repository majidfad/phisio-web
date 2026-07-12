import { SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Result } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { DoctorExercisesCatalog } from '@/features/doctor/exercises/components/DoctorExercisesCatalog';
import { useDoctorExercises } from '@/features/doctor/exercises/hooks/useDoctorExercises';
import { getErrorMessage } from '@/utils/get-error-message';

export function DoctorExercisesPage() {
  const { t } = useTranslation();
  const { data: exercises = [], isLoading, isError, error, refetch } = useDoctorExercises();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return exercises;
    }

    return exercises.filter(
      (exercise) =>
        exercise.title.toLowerCase().includes(query) ||
        exercise.description?.toLowerCase().includes(query),
    );
  }, [exercises, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title={t('doctor.exercises.title')}
        description={t('doctor.exercises.description')}
      />

      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined />}
        placeholder={t('doctor.exercises.searchPlaceholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 480 }}
      />

      {isLoading ? <LoadingState tip={t('doctor.exercises.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('doctor.exercises.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.exercises.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && filteredExercises.length === 0 ? (
        <Empty description={t('doctor.exercises.empty')} />
      ) : null}

      {!isLoading && !isError && filteredExercises.length > 0 ? (
        <DoctorExercisesCatalog exercises={filteredExercises} />
      ) : null}
    </PageContainer>
  );
}
