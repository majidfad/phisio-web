import { BookOpen, Book, Stethoscope } from 'lucide-react';
import { Button, Progress, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { LoadingState, PageContainer, WarmEmptyState } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useActiveDoctor } from '@/features/patient/doctors/hooks/useActiveDoctor';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import {
  flattenTodayExercises,
  hasTodayExercises,
} from '@/features/patient/exercises/types/patient-exercise';
import { routes } from '@/routes/routes';
import { convertToPersianDigits, formatPersianNumber } from '@/utils/persian-format';

const { Text, Title } = Typography;

export function PatientDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = usePatientTodayExercises();
  const { activeDoctor, approvedDoctors, isLoading: isDoctorsLoading } = useActiveDoctor();

  const exercises = data ? flattenTodayExercises(data) : [];
  const total = exercises.length;
  const completed = exercises.filter((e) => e.completedToday).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const hasExercises = data ? hasTodayExercises(data) : false;
  const hasLinkedDoctor = approvedDoctors.length > 0;
  const remaining = Math.max(total - completed, 0);
  const allDone = hasExercises && completed === total && total > 0;

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  const greeting = userGreeting(t);
  const encouragement = getEncouragementMessage(t, percent, total, hasLinkedDoctor);

  return (
    <PageContainer>
      <section className="home-today" aria-label={t('patient.dashboard.todayOverview')}>
        <div className="home-today__greeting">
          <Title level={3} className="home-today__title">
            {t('patient.dashboard.greetingWithName', { name: displayName, greeting })}
          </Title>
          <Text type="secondary" className="home-today__subtitle">
            {encouragement}
          </Text>
        </div>

        {hasLinkedDoctor && activeDoctor ? (
          <Link to={routes.patient.doctors} className="home-doctor-chip">
            <span className="home-doctor-chip__label">
              {t('patient.dashboard.treatingDoctor', { doctorName: activeDoctor.name })}
            </span>
            <span className="home-doctor-chip__action">{t('patient.doctors.banner.manage')}</span>
          </Link>
        ) : null}

        {isLoading || isDoctorsLoading ? (
          <LoadingState tip={t('patient.exercises.loading')} />
        ) : null}

        {!isLoading && !isDoctorsLoading && !hasLinkedDoctor ? (
          <WarmEmptyState
            lucideIcon={Stethoscope}
            title={t('patient.doctors.banner.noDoctorTitle')}
            description={t('patient.dashboard.noDoctorEncouragement')}
            action={
              <div className="home-today__actions">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => void navigate(routes.patient.doctors)}
                >
                  {t('patient.doctors.banner.findDoctor')}
                </Button>
                <Button
                  size="large"
                  icon={<Book {...appIconProps} />}
                  onClick={() => void navigate(routes.patient.library)}
                >
                  {t('patient.dashboard.goToLibrary')}
                </Button>
                <Button
                  size="large"
                  icon={<BookOpen {...appIconProps} />}
                  onClick={() => void navigate(routes.patient.articles)}
                >
                  {t('patient.dashboard.goToArticles')}
                </Button>
              </div>
            }
          />
        ) : null}

        {!isLoading && !isDoctorsLoading && hasLinkedDoctor && !hasExercises ? (
          <WarmEmptyState
            title={t('patient.exercises.emptyTodayTitle')}
            description={t('patient.dashboard.noExercisesToday')}
          />
        ) : null}

        {!isLoading && !isDoctorsLoading && hasExercises ? (
          <div className="home-session-card">
            <div className="home-session-card__progress">
              <div className="home-session-card__stats">
                <Text strong>
                  {t('patient.dashboard.completedToday')}: {formatPersianNumber(completed)} /{' '}
                  {formatPersianNumber(total)}
                </Text>
                <Text type="secondary">
                  {allDone
                    ? t('patient.dashboard.allDone')
                    : t('patient.dashboard.remainingCount', { count: remaining })}
                </Text>
              </div>
              <Progress
                percent={percent}
                showInfo={false}
                strokeColor="var(--phisio-primary)"
                trailColor="var(--phisio-border)"
                strokeWidth={10}
              />
            </div>

            {allDone ? (
              <Button size="large" block onClick={() => void navigate(routes.patient.progress)}>
                {t('patient.dashboard.viewProgress')}
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                block
                className="touch-target"
                onClick={() => void navigate(routes.patient.exercises)}
              >
                {completed > 0
                  ? t('patient.dashboard.continueSession')
                  : t('patient.exercises.session.start')}
              </Button>
            )}
          </div>
        ) : null}
      </section>
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
  hasLinkedDoctor: boolean,
): string {
  if (!hasLinkedDoctor) return t('patient.dashboard.noDoctorEncouragement');
  if (total === 0) return t('patient.dashboard.noExercisesToday');
  if (percent === 100) return t('patient.dashboard.allDone');
  if (percent >= 50) return t('patient.dashboard.keepGoing');
  if (percent > 0) return t('patient.dashboard.goodStart');
  return t('patient.dashboard.subtitle');
}
