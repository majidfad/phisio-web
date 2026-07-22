import { SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Result } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { PatientExerciseLibraryCatalog } from '@/features/patient/library/components/PatientExerciseLibraryCatalog';
import { usePatientExerciseLibrary } from '@/features/patient/library/hooks/usePatientExerciseLibrary';
import { getErrorMessage } from '@/utils/get-error-message';

export function PatientLibraryPage() {
  const { t } = useTranslation();
  const { data: exercises = [], isLoading, isError, error, refetch } = usePatientExerciseLibrary();
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
        title={t('patient.library.title')}
        description={t('patient.library.description')}
      />

      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined />}
        placeholder={t('patient.library.searchPlaceholder')}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        style={{ marginBottom: 20, maxWidth: 480 }}
      />

      {isLoading ? <LoadingState tip={t('patient.library.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('patient.library.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.library.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && filteredExercises.length === 0 ? (
        <Empty description={t('patient.library.empty')} />
      ) : null}

      {!isLoading && !isError && filteredExercises.length > 0 ? (
        <PatientExerciseLibraryCatalog exercises={filteredExercises} />
      ) : null}
    </PageContainer>
  );
}
