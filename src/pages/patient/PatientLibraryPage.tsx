import { Search } from 'lucide-react';
import { Button, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { LoadingState, PageContainer, AppEmpty, AppResult } from '@/components/ui';
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
    <PageContainer className="patient-library-page">
      <section className="library-today" aria-label={t('patient.library.title')}>
        <header className="library-today__intro">
          <h1 className="library-today__title">{t('patient.library.title')}</h1>
          <p className="library-today__subtitle">{t('patient.library.subtitle')}</p>
        </header>

        <div className="library-today__search">
          <Input
            size="large"
            allowClear
            prefix={<Search {...appIconProps} />}
            placeholder={t('patient.library.searchPlaceholder')}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label={t('patient.library.searchPlaceholder')}
          />
        </div>

        {isLoading ? <LoadingState tip={t('patient.library.loading')} /> : null}

        {isError ? (
          <AppResult
            status="error"
            title={getErrorMessage(error, t('patient.library.errors.loadFailed'))}
            extra={
              <Button type="primary" size="large" onClick={() => void refetch()}>
                {t('patient.library.retry')}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && exercises.length === 0 ? (
          <AppEmpty description={t('patient.library.empty')} />
        ) : null}

        {!isLoading && !isError && exercises.length > 0 && filteredExercises.length === 0 ? (
          <AppEmpty description={t('patient.library.emptySearch')} />
        ) : null}

        {!isLoading && !isError && filteredExercises.length > 0 ? (
          <PatientExerciseLibraryCatalog exercises={filteredExercises} />
        ) : null}
      </section>
    </PageContainer>
  );
}
