import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setDismissed(true);
  };

  return (
    <Card
      className="energy-stat-card safe-area-bottom"
      style={{
        position: 'fixed',
        bottom: 100,
        left: 16,
        right: 16,
        zIndex: 99,
        margin: 0,
      }}
      styles={{ body: { padding: '14px 16px' } }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <span style={{ fontSize: 14, color: 'var(--phisio-text)' }}>{t('pwa.installPrompt')}</span>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => void handleInstall()}
          className="touch-active"
        >
          {t('pwa.install')}
        </Button>
      </div>
    </Card>
  );
}
