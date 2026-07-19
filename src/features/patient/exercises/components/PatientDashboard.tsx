import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Progress, Row, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  FocusCard,
  HeroCard,
  LoadingState,
  PageContainer,
  PageSection,
  StatCard,
} from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import {
  flattenTodayExercises,
  hasTodayExercises,
} from '@/features/patient/exercises/types/patient-exercise';
import { routes } from '@/routes/routes';
import { PHISIO_COLORS } from '@/theme/phisio-theme';
import { convertToPersianDigits, formatPersianNumber } from '@/utils/persian-format';

export function PatientDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = usePatientTodayExercises();

  const exercises = data ? flattenTodayExercises(data) : [];
  const total = exercises.length;
  const completed = exercises.filter((e) => e.completedToday).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const hasExercises = data ? hasTodayExercises(data) : false;

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  const greeting = userGreeting(t);
  const encouragement = getEncouragementMessage(t, percent, total);

  return (
    <PageContainer>
      <HeroCard
        badge={t('patient.dashboard.badge')}
        title={t('patient.dashboard.greetingWithName', { name: displayName, greeting })}
        description={encouragement}
        illustration={percent === 100 && total > 0 ? 'progress' : 'recovery'}
      />

      {isLoading ? <LoadingState tip={t('patient.exercises.loading')} /> : null}

      {!isLoading ? (
        <PageSection title={t('patient.dashboard.todayOverview')}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                className="energy-stat-card energy-progress-card"
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <Progress
                    type="circle"
                    percent={percent}
                    format={(p) => formatPersianNumber(p ?? 0)}
                    strokeColor={{
                      '0%': PHISIO_COLORS.primary,
                      '100%': PHISIO_COLORS.coral,
                    }}
                    size={108}
                    strokeWidth={8}
                  />
                  <Statistic
                    title={t('patient.dashboard.completedToday')}
                    value={formatPersianNumber(completed)}
                    suffix={`/ ${formatPersianNumber(total)}`}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12}>
              <StatCard
                label={t('patient.dashboard.remaining')}
                value={formatPersianNumber(total - completed)}
                accent="peach"
              />
            </Col>

            {hasExercises && completed < total ? (
              <Col xs={24}>
                <FocusCard hoverable onClick={() => void navigate(routes.patient.exercises)}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        {t('patient.dashboard.startExercises')}
                      </Typography.Title>
                      <Typography.Text type="secondary">
                        {t('patient.dashboard.startExercisesHint')}
                      </Typography.Text>
                    </div>
                    <Button type="primary" icon={<ArrowRightOutlined />} size="large">
                      {t('patient.dashboard.goToExercises')}
                    </Button>
                  </div>
                </FocusCard>
              </Col>
            ) : null}

            {hasExercises && completed === total && total > 0 ? (
              <Col xs={24}>
                <StatCard label={t('patient.dashboard.allDone')} value="✓" accent="mint" />
              </Col>
            ) : null}
          </Row>
        </PageSection>
      ) : null}
    </PageContainer>
  );
}

function userGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('patient.dashboard.greetingMorning');
  if (hour < 18) return t('patient.dashboard.greetingAfternoon');
  return t('patient.dashboard.greetingEvening');
}

function getEncouragementMessage(
  t: (key: string, options?: Record<string, unknown>) => string,
  percent: number,
  total: number,
): string {
  if (total === 0) return t('patient.dashboard.noExercisesToday');
  if (percent === 100) return t('patient.dashboard.allDone');
  if (percent >= 50) return t('patient.dashboard.keepGoing');
  if (percent > 0) return t('patient.dashboard.goodStart');
  return t('patient.dashboard.subtitle');
}
