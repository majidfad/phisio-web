import { CheckCircle2, CircleDashed, Play, Stethoscope } from 'lucide-react';
import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { HeroCard, StatCard } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { formatPersianNumber } from '@/utils/persian-format';

const MOCK_EXERCISES = [
  {
    id: '1',
    titleKey: 'landing.phoneMock.exercise2Title',
    metaKey: 'landing.phoneMock.exercise2Meta',
    completedToday: true,
    thumbTone: 'mint' as const,
  },
  {
    id: '2',
    titleKey: 'landing.phoneMock.exercise1Title',
    metaKey: 'landing.phoneMock.exercise1Meta',
    completedToday: false,
    thumbTone: 'blue' as const,
    active: true,
  },
  {
    id: '3',
    titleKey: 'landing.phoneMock.exercise3Title',
    metaKey: 'landing.phoneMock.exercise3Meta',
    completedToday: false,
    thumbTone: 'peach' as const,
  },
] as const;

/** Static clone of patient home UI classes — decorative landing hero only. */
export function LandingPatientHomePreview() {
  const { t } = useTranslation();

  const total = MOCK_EXERCISES.length;
  const completed = MOCK_EXERCISES.filter((item) => item.completedToday).length;
  const remaining = total - completed;
  const percent = Math.round((completed / total) * 100);
  const displayName = t('landing.phoneMock.patientName');
  const greeting = t('patient.dashboard.greetingMorning');

  return (
    <section className="home-today landing-phone-preview" aria-hidden>
      <header className="home-today__intro landing-phone-preview__item">
        <h1 className="home-today__title">
          {t('patient.dashboard.greetingWithName', { name: displayName, greeting })}
        </h1>
        <p className="home-today__subtitle">{t('patient.dashboard.goodStart')}</p>
      </header>

      <div className="home-doctor-chip landing-phone-preview__item">
        <div className="home-doctor-chip__main">
          <span className="home-doctor-chip__icon">
            <Stethoscope size={16} />
          </span>
          <span className="home-doctor-chip__text">
            <span className="home-doctor-chip__label">{t('patient.dashboard.treatingDoctor')}</span>
            <span className="home-doctor-chip__name">{t('landing.phoneMock.doctorName')}</span>
          </span>
        </div>
      </div>

      <div className="landing-phone-preview__item">
        <HeroCard
          illustration="recovery"
          badge={t('patient.dashboard.todayOverview')}
          title={t('patient.exercises.progressSummary', {
            done: formatPersianNumber(completed),
            total: formatPersianNumber(total),
          })}
          description={t('patient.dashboard.remainingCount', {
            count: formatPersianNumber(remaining),
          })}
          progressPercent={percent}
        >
          <Button
            type="primary"
            size="large"
            block
            icon={<Play size={14} fill="currentColor" />}
            tabIndex={-1}
          >
            {t('patient.dashboard.continueSession')}
          </Button>
        </HeroCard>
      </div>

      <Row gutter={[8, 8]} className="home-today__stats landing-phone-preview__item">
        <Col xs={12}>
          <StatCard
            label={t('patient.dashboard.completedToday')}
            value={formatPersianNumber(completed)}
            icon={<CheckCircle2 size={16} />}
            accent="mint"
          />
        </Col>
        <Col xs={12}>
          <StatCard
            label={t('patient.dashboard.remaining')}
            value={formatPersianNumber(remaining)}
            icon={<CircleDashed size={16} />}
            accent="blue"
          />
        </Col>
      </Row>

      <div className="home-today__list landing-phone-preview__item">
        <h3 className="home-today__section-title">{t('landing.phoneMock.todayTitle')}</h3>

        <div className="exercise-list" role="presentation">
          {MOCK_EXERCISES.map((item) => {
            return (
              <div
                key={item.id}
                className={`exercise-row${item.completedToday ? ' exercise-row--completed' : ''}${
                  'active' in item && item.active ? ' landing-phone-preview__row--active' : ''
                }`}
              >
                <div
                  className={`exercise-row__thumb landing-phone-preview__thumb landing-phone-preview__thumb--${item.thumbTone}`}
                  aria-hidden
                >
                  {item.completedToday ? (
                    <span className="exercise-row__thumb-overlay">
                      <span className="exercise-row__thumb-done">
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                      </span>
                    </span>
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                </div>

                <div className="exercise-row__body">
                  <bdi
                    className={`exercise-row__name${item.completedToday ? ' exercise-row__name--done' : ''}`}
                  >
                    {t(item.titleKey)}
                  </bdi>
                  <span className="exercise-row__meta">{t(item.metaKey)}</span>
                </div>

                <div className="exercise-row__action" aria-hidden>
                  {item.completedToday ? (
                    <StatusCapsule
                      status="completed"
                      label={t('patient.exercises.completedToday')}
                      showDot={false}
                    />
                  ) : (
                    <span className="exercise-row__play">
                      <Play size={14} fill="currentColor" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
