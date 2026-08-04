import { MoreHorizontal, PersonStanding } from 'lucide-react';
import { Button, Dropdown, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';
import { AppResult, WarmEmptyState } from '@/components/ui';
import { PatientExercisesList } from '@/features/patient/exercises/components/PatientExercisesList';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import { hasTodayExercises } from '@/features/patient/exercises/types/patient-exercise';
import { getErrorMessage } from '@/utils/get-error-message';

export function PatientTodayExercisesPanel() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = usePatientTodayExercises();
  const [showChecklist, setShowChecklist] = useState(false);

  const doctorGroups = data?.doctorGroups ?? [];
  const hasExercises = data ? hasTodayExercises(data) : false;

  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'checklist',
      label: showChecklist
        ? t('patient.exercises.hideChecklist')
        : t('patient.exercises.showChecklist'),
      onClick: () => setShowChecklist((value) => !value),
    },
  ];

  return (
    <section className="program-today" aria-label={t('patient.exercises.programTitle')}>
      <header className="program-today__header">
        <div className="program-today__intro">
          <h1 className="program-today__title">{t('patient.exercises.programTitle')}</h1>
          <p className="program-today__subtitle">{t('patient.exercises.programSubtitle')}</p>
        </div>

        {hasExercises ? (
          <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomLeft">
            <Button
              type="text"
              className="program-today__more touch-target"
              icon={<MoreHorizontal {...appIconProps} />}
              aria-label={t('patient.exercises.moreActions')}
            />
          </Dropdown>
        ) : null}
      </header>

      {isLoading ? (
        <div className="program-today__loading">
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('patient.exercises.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.exercises.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && !hasExercises ? (
        <WarmEmptyState
          title={t('patient.exercises.emptyTodayTitle')}
          description={t('patient.exercises.emptyToday')}
          lucideIcon={PersonStanding}
        />
      ) : null}

      {!isLoading && !isError && hasExercises ? (
        <PatientExercisesList
          doctorGroups={doctorGroups}
          showChecklist={showChecklist}
          onCompletionsSaved={refetch}
        />
      ) : null}
    </section>
  );
}
