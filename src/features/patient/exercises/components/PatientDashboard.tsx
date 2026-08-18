import { Book, CheckCircle2, ChevronLeft, CircleDashed, Play, Stethoscope } from 'lucide-react';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { HeroCard, LoadingState, PageContainer, StatCard, WarmEmptyState } from '@/components/ui';
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
    <PageContainer className="patient-home-page">
      <section className="home-today" aria-label={t('patient.dashboard.todayOverview')}>
        <header className="home-today__intro">
          <h1 className="home-today__title">
            {t('patient.dashboard.greetingWithName', { name: displayName, greeting })}
          </h1>
          <p className="home-today__subtitle">{encouragement}</p>
        </header>

        {hasLinkedDoctor && activeDoctor ? (
          <Link to={routes.patient.doctors} className="home-doctor-chip">
            <div className="home-doctor-chip__main">
              <span className="home-doctor-chip__icon">
                <Stethoscope size={18} />
              </span>
              <span className="home-doctor-chip__text">
                <span className="home-doctor-chip__label">
                  {t('patient.dashboard.treatingDoctor', { defaultValue: 'پزشک معالج' })}
                </span>
                <span className="home-doctor-chip__name">{activeDoctor.name}</span>
              </span>
            </div>
            <span className="home-doctor-chip__action">
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
              <div className="home-today__empty-actions">
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

            <Row gutter={[12, 12]} className="home-today__stats">
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

            <div className="home-today__list">
              <h3 className="home-today__section-title">
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

                  const openSession = () => {
                    void navigate(routes.patient.exercises);
                  };

                  return (
                    <div
                      key={item.userExerciseId}
                      role="button"
                      tabIndex={0}
                      className={`exercise-row exercise-row--clickable${item.completedToday ? ' exercise-row--completed' : ''}`}
                      onClick={openSession}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openSession();
                        }
                      }}
                      aria-label={
                        item.completedToday
                          ? item.title
                          : t('patient.dashboard.startExercise', {
                              defaultValue: 'شروع',
                            })
                      }
                    >
                      <div className="exercise-row__thumb" aria-hidden="true">
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

                      <div className="exercise-row__action" aria-hidden="true">
                        {item.completedToday ? (
                          <StatusCapsule
                            status="completed"
                            label={t('patient.exercises.completedToday')}
                            showDot={false}
                          />
                        ) : (
                          <span className="exercise-row__play">
                            <Play size={16} fill="currentColor" />
                          </span>
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
