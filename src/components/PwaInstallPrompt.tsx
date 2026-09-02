import { Download, X } from 'lucide-react';
import { Button, Card } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { getSiteMode, isAppPath } from '@/constants/site';
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
  const siteMode = getSiteMode();
  const isAppContext =
    siteMode === 'app' || (siteMode === 'combined' && isAppPath(location.pathname));

  if (!isAppContext || !canInstall || dismissed) {
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
      className={`pwa-install-prompt${isPatientRoute ? ' pwa-install-prompt--above-tabs' : ''}`}
      styles={{ body: { padding: '10px 12px' } }}
    >
      <div className="pwa-install-prompt__row">
        <div className="pwa-install-prompt__copy">
          <img
            src="/icons/zivan-192.png"
            alt=""
            width={28}
            height={28}
            className="pwa-install-prompt__mark"
          />
          <span className="pwa-install-prompt__text">{t('pwa.installPrompt')}</span>
        </div>
        <div className="pwa-install-prompt__actions">
          <Button
            type="primary"
            size="small"
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
