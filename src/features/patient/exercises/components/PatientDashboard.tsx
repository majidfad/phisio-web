import {
  Book,
  CheckCircle2,
  ChevronLeft,
  CircleDashed,
  Play,
  Stethoscope,
} from 'lucide-react';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import {
  HeroCard,
  LoadingState,
  PageContainer,
  StatCard,
  WarmEmptyState,
} from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { getVideoPreviewSource } from '@/features/admin/exercises/utils/get-video-preview-source';
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
                  {t('patient.dashboard.treatingDoctor', { defaultValue: 'پزشک معالج' })}
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
            <HeroCard
              illustration="recovery"
              badge={t('patient.dashboard.todayOverview')}
              title={t('patient.exercises.progressSummary', {
                done: formatPersianNumber(completed),
                total: formatPersianNumber(total),
              })}
              description={
                allDone
                  ? t('patient.dashboard.allDone')
                  : t('patient.dashboard.remainingExercises', {
                      defaultValue: `${formatPersianNumber(remaining)} تمرین باقی مانده`,
                      count: formatPersianNumber(remaining),
                    })
              }
              progressPercent={percent}
            >
              {allDone ? (
                <Button
                  size="large"
                  type="primary"
                  block
                  onClick={() => void navigate(routes.patient.progress)}
                >
                  {t('patient.dashboard.viewProgress')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<Play size={16} fill="currentColor" />}
                  onClick={() => void navigate(routes.patient.exercises)}
                >
                  {completed > 0
                    ? t('patient.dashboard.continueSession', { defaultValue: 'ادامه جلسه امروز' })
                    : t('patient.dashboard.startSession', { defaultValue: 'شروع جلسه امروز' })}
                </Button>
              )}
            </HeroCard>

            <Row gutter={[10, 10]}>
              <Col xs={12}>
                <StatCard
                  label={t('patient.dashboard.completedStat', { defaultValue: 'تکمیل‌شده' })}
                  value={formatPersianNumber(completed)}
                  icon={<CheckCircle2 size={18} />}
                  accent="mint"
                />
              </Col>
              <Col xs={12}>
                <StatCard
                  label={t('patient.dashboard.remainingStat', { defaultValue: 'باقی‌مانده' })}
                  value={formatPersianNumber(remaining)}
                  icon={<CircleDashed size={18} />}
                  accent="blue"
                />
              </Col>
            </Row>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--phisio-text)',
                  margin: 0,
                }}
              >
                {t('patient.dashboard.todayExercises', { defaultValue: 'تمرین‌های امروز شما' })}
              </h3>

              <div className="exercise-list" role="list">
                {exercises.map((item) => {
                  const preview = getVideoPreviewSource(item.videoUrl, item.mediaType);
                  const youtubeId =
                    preview?.kind === 'iframe' && preview.src.includes('/embed/')
                      ? (preview.src.split('/embed/')[1]?.split(/[?/]/)[0] ?? null)
                      : null;
                  const thumbSrc =
                    preview?.kind === 'image'
                      ? preview.src
                      : youtubeId
                        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                        : null;
                  const metaParts: string[] = [];
                  if (item.sets) metaParts.push(`${formatPersianNumber(item.sets)} ست`);
                  if (item.reps) {
                    metaParts.push(`${convertToPersianDigits(item.reps)} تکرار`);
                  }

                  return (
                    <div
                      key={item.userExerciseId}
                      role="listitem"
                      className={`exercise-row${item.completedToday ? ' exercise-row--completed' : ''}`}
                    >
                      <div className="exercise-row__thumb" aria-hidden={!thumbSrc}>
                        {thumbSrc ? <img src={thumbSrc} alt="" /> : null}
                        {item.completedToday ? (
                          <span className="exercise-row__thumb-overlay">
                            <span className="exercise-row__thumb-done">
                              <CheckCircle2 size={18} strokeWidth={2.5} />
                            </span>
                          </span>
                        ) : null}
                      </div>

                      <div className="exercise-row__body">
                        <bdi
                          className={`exercise-row__name${item.completedToday ? ' exercise-row__name--done' : ''}`}
                        >
                          {item.title}
                        </bdi>
                        {metaParts.length > 0 ? (
                          <span className="exercise-row__meta">{metaParts.join(' · ')}</span>
                        ) : null}
                      </div>

                      <div className="exercise-row__action">
                        {item.completedToday ? (
                          <StatusCapsule
                            status="completed"
                            label={t('patient.exercises.completedToday')}
                            showDot={false}
                          />
                        ) : (
                          <Button
                            type="primary"
                            shape="circle"
                            className="exercise-row__play"
                            icon={<Play size={16} fill="currentColor" />}
                            onClick={() => void navigate(routes.patient.exercises)}
                            aria-label={t('patient.dashboard.startExercise', {
                              defaultValue: 'شروع',
                            })}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
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
