import { Download, X } from 'lucide-react';
import { Button, Card } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const DISMISS_STORAGE_KEY = 'phisio.pwaInstallDismissed';

export function PwaInstallPrompt() {
  const { t } = useTranslation();
  const location = useLocation();
  const { canInstall, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const isPatientRoute = location.pathname.startsWith('/patient');

  if (!canInstall || dismissed) {
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
    const accepted = await install();
    if (accepted) {
      dismiss();
    }
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
