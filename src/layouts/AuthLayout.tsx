import { Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { ThemeToggleButton, ZivanLogo } from '@/components/ui';

const { Content } = Layout;
const { Text } = Typography;

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Layout className="auth-shell">
      <div className="auth-shell__topbar">
        <ThemeToggleButton />
      </div>

      <Content className="auth-shell__content safe-area-top safe-area-bottom">
        <header className="auth-brand">
          <div className="auth-brand-icon">
            <ZivanLogo size={64} />
          </div>
          <Text className="auth-brand__name">{t('app.name')}</Text>
          <Text className="auth-brand__tagline">{t('app.tagline')}</Text>
        </header>

        <div className="auth-panel">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
