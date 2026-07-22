import { BarChart3 } from 'lucide-react';
import { Col, Progress, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import {
  HeroCard,
  LoadingState,
  PageContainer,
  PageSection,
  StatCard,
  WarmEmptyState,
} from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import { flattenTodayExercises } from '@/features/patient/exercises/types/patient-exercise';
import { PHISIO_COLORS } from '@/theme/phisio-theme';
import { convertToPersianDigits, formatPersianNumber } from '@/utils/persian-format';

export function PatientProgressView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = usePatientTodayExercises();

  const exercises = data ? flattenTodayExercises(data) : [];
  const total = exercises.length;
  const completed = exercises.filter((e) => e.completedToday).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  return (
    <PageContainer>
      <HeroCard
        badge={t('patient.progress.badge')}
        title={t('patient.progress.title')}
        description={t('patient.progress.subtitle', { name: displayName })}
        illustration="progress"
      />

      {isLoading ? <LoadingState tip={t('patient.exercises.loading')} /> : null}

      {!isLoading && total === 0 ? (
        <WarmEmptyState
          title={t('patient.progress.emptyTitle')}
          description={t('patient.progress.emptyDescription')}
          lucideIcon={BarChart3}
        />
      ) : null}

      {!isLoading && total > 0 ? (
        <PageSection title={t('patient.progress.todaySection')}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <StatCard
                label={t('patient.dashboard.completedToday')}
                value={`${formatPersianNumber(completed)} / ${formatPersianNumber(total)}`}
                accent="mint"
              />
            </Col>
            <Col xs={24} sm={12}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  borderRadius: 16,
                  border: '1px solid var(--phisio-border-soft)',
                  background: 'var(--phisio-surface)',
                  boxShadow: 'var(--phisio-shadow-card)',
                }}
              >
                <Progress
                  type="dashboard"
                  percent={percent}
                  format={(p) => `${formatPersianNumber(p ?? 0)}%`}
                  strokeColor={{
                    '0%': PHISIO_COLORS.primary,
                    '100%': PHISIO_COLORS.teal,
                  }}
                  size={140}
                />
              </div>
            </Col>
          </Row>
        </PageSection>
      ) : null}
    </PageContainer>
  );
}
