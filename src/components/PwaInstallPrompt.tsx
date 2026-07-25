import { Download, X } from 'lucide-react';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_STORAGE_KEY = 'phisio.pwaInstallDismissed';

function isRunningAsInstalledPwa(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const displayStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;

  const iosStandalone =
    'standalone' in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return displayStandalone || iosStandalone;
}

export function PwaInstallPrompt() {
  const { t } = useTranslation();
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [installed, setInstalled] = useState(() => isRunningAsInstalledPwa());

  const isPatientRoute = location.pathname.startsWith('/patient');

  useEffect(() => {
    if (installed) {
      return;
    }

    const onBeforeInstall = (e: Event) => {
      // Never offer install while already running as an installed PWA.
      if (isRunningAsInstalledPwa()) {
        setInstalled(true);
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    const onDisplayModeChange = () => {
      if (isRunningAsInstalledPwa()) {
        setInstalled(true);
        setDeferredPrompt(null);
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', onDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
      mediaQuery.removeEventListener('change', onDisplayModeChange);
    };
  }, [installed]);

  if (installed || !deferredPrompt || dismissed) {
    return null;
  }

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, '1');
    } catch {
      // Ignore storage failures (private mode).
    }
  };

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setInstalled(true);
    }
    dismiss();
  };

  return (
    <Card
      className={`pwa-install-prompt energy-stat-card${isPatientRoute ? ' pwa-install-prompt--above-tabs' : ''}`}
      styles={{ body: { padding: '12px 14px' } }}
    >
      <div className="pwa-install-prompt__row">
        <div className="pwa-install-prompt__copy">
          <img
            src="/brand/zivan-mark.png"
            alt=""
            width={32}
            height={32}
            className="pwa-install-prompt__mark"
          />
          <span className="pwa-install-prompt__text">{t('pwa.installPrompt')}</span>
        </div>
        <div className="pwa-install-prompt__actions">
          <Button
            type="primary"
            size="middle"
            icon={<Download {...appIconProps} />}
            onClick={() => void handleInstall()}
            className="touch-active"
          >
            {t('pwa.install')}
          </Button>
          <Button
            type="text"
            shape="circle"
            aria-label={t('pwa.dismiss', { defaultValue: 'Dismiss' })}
            icon={<X {...appIconProps} />}
            onClick={dismiss}
          />
        </div>
      </div>
    </Card>
  );
}
