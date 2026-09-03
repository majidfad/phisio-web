import { CheckCircle2, CircleDashed, Play, Stethoscope } from 'lucide-react';
import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HeroCard, StatCard } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { formatPersianNumber } from '@/utils/persian-format';

type DemoExercise = {
  id: string;
  titleKey: string;
  metaKey: string;
  thumbTone: 'mint' | 'blue' | 'peach';
};

const DEMO_EXERCISES: DemoExercise[] = [
  {
    id: '1',
    titleKey: 'landing.phoneMock.exercise2Title',
    metaKey: 'landing.phoneMock.exercise2Meta',
    thumbTone: 'mint',
  },
  {
    id: '2',
    titleKey: 'landing.phoneMock.exercise1Title',
    metaKey: 'landing.phoneMock.exercise1Meta',
    thumbTone: 'blue',
  },
  {
    id: '3',
    titleKey: 'landing.phoneMock.exercise3Title',
    metaKey: 'landing.phoneMock.exercise3Meta',
    thumbTone: 'peach',
  },
];

type DemoPhase =
  'intro' | 'scroll-down' | 'focus' | 'tap' | 'complete' | 'hold' | 'scroll-up' | 'reset';

export type PhoneDemoFrame = {
  /** Vertical shift of the phone content (px, design space). */
  scrollY: number;
  /** Show the tap ripple over the active exercise. */
  showTap: boolean;
};

interface LandingPatientHomePreviewProps {
  onFrameChange?: (frame: PhoneDemoFrame) => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Live product demo of the patient home — plays a short looping “screen recording”
 * (scroll → tap → complete exercise → progress update) using real app UI classes.
 */
export function LandingPatientHomePreview({ onFrameChange }: LandingPatientHomePreviewProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<DemoPhase>('intro');
  const [completedIds, setCompletedIds] = useState<ReadonlySet<string>>(() => new Set(['1']));
  const [activeId, setActiveId] = useState<string | null>('2');

  useEffect(() => {
    if (prefersReducedMotion()) {
      onFrameChange?.({ scrollY: 0, showTap: false });
      return;
    }

    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled) {
        if (cancelled) break;
        setCompletedIds(new Set(['1']));
        setActiveId('2');
        setPhase('intro');
        onFrameChange?.({ scrollY: 0, showTap: false });
        await wait(1100);

        if (cancelled) break;
        setPhase('scroll-down');
        onFrameChange?.({ scrollY: -118, showTap: false });
        await wait(1200);

        if (cancelled) break;
        setPhase('focus');
        await wait(700);

        if (cancelled) break;
        setPhase('tap');
        onFrameChange?.({ scrollY: -118, showTap: true });
        await wait(480);

        if (cancelled) break;
        setPhase('complete');
        onFrameChange?.({ scrollY: -118, showTap: false });
        setCompletedIds(new Set(['1', '2']));
        setActiveId('3');
        await wait(1400);

        if (cancelled) break;
        setPhase('hold');
        await wait(900);

        if (cancelled) break;
        setPhase('scroll-up');
        onFrameChange?.({ scrollY: 0, showTap: false });
        await wait(1100);

        if (cancelled) break;
        setPhase('reset');
        await wait(500);
      }
    };

    void runLoop();

    return () => {
      cancelled = true;
      for (const id of timers) {
        window.clearTimeout(id);
      }
    };
  }, [onFrameChange]);

  const total = DEMO_EXERCISES.length;
  const completed = completedIds.size;
  const remaining = total - completed;
  const percent = Math.round((completed / total) * 100);
  const displayName = t('landing.phoneMock.patientName');
  const greeting = t('patient.dashboard.greetingMorning');
  const justCompleted = phase === 'complete' || phase === 'hold';

  return (
    <section
      className={`home-today landing-phone-preview${justCompleted ? ' landing-phone-preview--success' : ''}`}
      data-phase={phase}
      aria-hidden
    >
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
          {DEMO_EXERCISES.map((item) => {
            const done = completedIds.has(item.id);
            const isActive = activeId === item.id && !done;
            return (
              <div
                key={item.id}
                className={`exercise-row${done ? ' exercise-row--completed' : ''}${
                  isActive ? ' landing-phone-preview__row--active' : ''
                }${phase === 'tap' && isActive ? ' landing-phone-preview__row--tapping' : ''}`}
                data-demo-row={item.id}
              >
                <div
                  className={`exercise-row__thumb landing-phone-preview__thumb landing-phone-preview__thumb--${item.thumbTone}`}
                  aria-hidden
                >
                  {done ? (
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
                  <bdi className={`exercise-row__name${done ? ' exercise-row__name--done' : ''}`}>
                    {t(item.titleKey)}
                  </bdi>
                  <span className="exercise-row__meta">{t(item.metaKey)}</span>
                </div>

                <div className="exercise-row__action" aria-hidden>
                  {done ? (
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
