import { Card, Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { EnergyWaveBg } from '@/components/illustrations';
import { ZivanLogo } from '@/components/ui';

const { Content, Footer } = Layout;
const { Text } = Typography;

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Layout className="auth-shell" style={{ minHeight: '100vh' }}>
      <EnergyWaveBg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      <Content
        className="safe-area-top safe-area-bottom"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20, width: '100%', maxWidth: 400 }}>
          <div className="auth-brand-icon">
            <ZivanLogo size={56} />
          </div>
          <Text
            style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--phisio-text)',
              marginBottom: 4,
            }}
          >
            {t('app.name')}
          </Text>
          <Text style={{ fontSize: 14, color: 'var(--phisio-text-secondary)' }}>
            {t('app.tagline')}
          </Text>
        </div>

        <Card className="auth-panel" styles={{ body: { padding: '28px 24px' } }}>
          <Outlet />
        </Card>
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          paddingBottom: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Text style={{ color: 'var(--phisio-text-secondary)' }}>{t('app.tagline')}</Text>
      </Footer>
    </Layout>
  );
}
