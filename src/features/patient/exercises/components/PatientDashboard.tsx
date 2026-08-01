import {
  Activity,
  Book,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Play,
  Stethoscope,
} from 'lucide-react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { ExerciseProgressRing, LoadingState, PageContainer, WarmEmptyState } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useActiveDoctor } from '@/features/patient/doctors/hooks/useActiveDoctor';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import {
  flattenTodayExercises,
  hasTodayExercises,
} from '@/features/patient/exercises/types/patient-exercise';
import { routes } from '@/routes/routes';
import { convertToPersianDigits, formatPersianNumber } from '@/utils/persian-format';

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
      <section
        className="home-today"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '88px',
        }}
        aria-label={t('patient.dashboard.todayOverview')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1
            style={{
              fontSize: 'var(--phisio-font-title)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--phisio-text)',
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {t('patient.dashboard.greetingWithName', { name: displayName, greeting })}
          </h1>
          <p
            style={{
              fontSize: 'var(--phisio-font-meta)',
              color: 'var(--phisio-text-secondary)',
              margin: 0,
            }}
          >
            {encouragement}
          </p>
        </div>

        {hasLinkedDoctor && activeDoctor ? (
          <Link
            to={routes.patient.doctors}
            className="hover-lift"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--phisio-radius-md)',
              backgroundColor: 'var(--phisio-surface)',
              border: '1px solid var(--phisio-border)',
              boxShadow: 'var(--phisio-shadow-sm)',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--phisio-radius-sm)',
                  backgroundColor: 'var(--phisio-primary-soft)',
                  color: 'var(--phisio-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Stethoscope size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--phisio-text-secondary)',
                  }}
                >
                  پزشک معالج
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--phisio-text)' }}>
                  {activeDoctor.name}
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--phisio-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                flexShrink: 0,
              }}
            >
              {t('patient.doctors.banner.manage')} <ChevronLeft size={16} />
            </span>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
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
          <>
            <div
              style={{
                borderRadius: 'var(--phisio-radius-lg)',
                padding: '20px 16px',
                backgroundColor: 'var(--phisio-surface)',
                border: '1px solid var(--phisio-border)',
                boxShadow: 'var(--phisio-shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
              }}
            >
              <ExerciseProgressRing
                percent={percent}
                size={112}
                strokeWidth={9}
                label={`${formatPersianNumber(percent)}٪`}
                sublabel="پیشرفت امروز"
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                <span
                  style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--phisio-text)' }}
                >
                  {`انجام‌شده امروز: ${formatPersianNumber(completed)} از ${formatPersianNumber(total)}`}
                </span>
                <span
                  style={{
                    fontSize: 'var(--phisio-font-meta)',
                    fontWeight: 500,
                    color: 'var(--phisio-text-secondary)',
                  }}
                >
                  {allDone
                    ? 'تمام تمرین‌های امروز تکمیل شد'
                    : `${formatPersianNumber(remaining)} تمرین باقی مانده`}
                </span>
              </div>

              {allDone ? (
                <Button
                  size="large"
                  type="primary"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '44px',
                    borderRadius: 'var(--phisio-radius-pill)',
                    fontWeight: 600,
                  }}
                  onClick={() => void navigate(routes.patient.progress)}
                >
                  {t('patient.dashboard.viewProgress')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<Play size={16} fill="currentColor" />}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '44px',
                    borderRadius: 'var(--phisio-radius-pill)',
                    fontWeight: 600,
                  }}
                  onClick={() => void navigate(routes.patient.exercises)}
                >
                  {completed > 0 ? 'ادامه جلسه امروز' : 'شروع جلسه امروز'}
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--phisio-text)',
                  margin: 0,
                }}
              >
                تمرین‌های امروز شما
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {exercises.map((item) => (
                  <div
                    key={item.userExerciseId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--phisio-radius-md)',
                      backgroundColor: 'var(--phisio-surface)',
                      border: '1px solid var(--phisio-border)',
                      direction: 'rtl',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          minWidth: '42px',
                          borderRadius: 'var(--phisio-radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: item.completedToday
                            ? 'var(--phisio-accent-soft)'
                            : 'var(--phisio-primary-soft)',
                          color: item.completedToday
                            ? 'var(--phisio-teal)'
                            : 'var(--phisio-primary)',
                          flexShrink: 0,
                        }}
                      >
                        {item.completedToday ? <CheckCircle2 size={22} /> : <Activity size={22} />}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <bdi
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--phisio-text)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            unicodeBidi: 'plaintext',
                            display: 'block',
                          }}
                        >
                          {item.title}
                        </bdi>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'var(--phisio-text-secondary)',
                          }}
                        >
                          {item.sets ? `${formatPersianNumber(item.sets)} ست` : ''}
                          {item.reps ? ` × ${convertToPersianDigits(item.reps)} تکرار` : ''}
                        </span>
                      </div>
                    </div>

                    <div style={{ flexShrink: 0, marginInlineStart: '8px' }}>
                      {item.completedToday ? (
                        <StatusCapsule status="completed" label="تکمیل شد" showDot={false} />
                      ) : (
                        <Button
                          type="primary"
                          size="middle"
                          icon={<Play size={14} fill="currentColor" />}
                          style={{
                            borderRadius: 'var(--phisio-radius-pill)',
                            height: '34px',
                            padding: '0 14px',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                          onClick={() => void navigate(routes.patient.exercises)}
                        >
                          شروع
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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
