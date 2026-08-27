import { Activity, BarChart3, Home, MoreHorizontal, Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appIconProps } from '@/components/icons/app-icon';

import { LandingPatientHomePreview, type PhoneDemoFrame } from './LandingPatientHomePreview';

/** iPhone-style frame with a looping live demo of the real patient home UI. */
export function LandingPhoneMock() {
  const { t } = useTranslation();
  const [frame, setFrame] = useState<PhoneDemoFrame>({ scrollY: 0, showTap: false });

  const onFrameChange = useCallback((next: PhoneDemoFrame) => {
    setFrame(next);
  }, []);

  const dockItems = [
    {
      key: 'home',
      icon: <Home {...appIconProps} size={18} />,
      label: t('layout.nav.dashboard'),
      active: true,
    },
    {
      key: 'exercises',
      icon: <Activity {...appIconProps} size={18} />,
      label: t('layout.nav.myExercises'),
      active: false,
    },
    {
      key: 'doctors',
      icon: <Users {...appIconProps} size={18} />,
      label: t('layout.nav.myDoctors'),
      active: false,
    },
    {
      key: 'progress',
      icon: <BarChart3 {...appIconProps} size={18} />,
      label: t('layout.nav.progress'),
      active: false,
    },
    {
      key: 'more',
      icon: <MoreHorizontal {...appIconProps} size={18} />,
      label: t('layout.nav.more'),
      active: false,
    },
  ] as const;

  return (
    <div className="landing-phone" aria-hidden>
      <div className="landing-phone__aura" />
      <div className="landing-phone__device">
        <span className="landing-phone__side landing-phone__side--silent" />
        <span className="landing-phone__side landing-phone__side--vol-up" />
        <span className="landing-phone__side landing-phone__side--vol-down" />
        <span className="landing-phone__side landing-phone__side--power" />

        <div className="landing-phone__bezel">
          <div className="landing-phone__shine" />
          <div className="landing-phone__island">
            <span className="landing-phone__island-cam" />
            <span className="landing-phone__island-cam landing-phone__island-cam--wide" />
          </div>

          <div className="landing-phone__screen">
            <div className="landing-phone__status">
              <span className="landing-phone__time">{t('landing.phoneMock.time')}</span>
              <span className="landing-phone__status-trail">
                <span className="landing-phone__signal" />
                <span className="landing-phone__wifi" />
                <span className="landing-phone__battery" />
              </span>
            </div>

            <div className="landing-phone__viewport">
              <div
                className="landing-phone__scale"
                style={{ ['--demo-scroll' as string]: `${frame.scrollY}px` }}
              >
                <LandingPatientHomePreview onFrameChange={onFrameChange} />
              </div>

              {frame.showTap ? (
                <span className="landing-phone__tap" aria-hidden>
                  <span className="landing-phone__tap-ring" />
                </span>
              ) : null}
            </div>

            <nav className="dock-nav landing-phone__dock" aria-hidden>
              {dockItems.map((item) => (
                <span
                  key={item.key}
                  className={`dock-nav__item${item.active ? ' dock-nav__item--active' : ''}`}
                >
                  <span className="dock-nav__icon">{item.icon}</span>
                  <span className="dock-nav__label">{item.label}</span>
                </span>
              ))}
            </nav>

            <div className="landing-phone__home-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
