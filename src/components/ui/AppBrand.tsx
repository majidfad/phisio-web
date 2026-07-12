import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface AppBrandProps {
  collapsed?: boolean;
  showLogo?: boolean;
}

export function AppBrand({ collapsed = false, showLogo = true }: AppBrandProps) {
  const { t } = useTranslation();

  return (
    <div className="app-sider__brand">
      {showLogo ? <span className="app-sider__logo">P</span> : null}
      {!collapsed ? (
        <Text strong className="app-header__brand">
          {t('app.name')}
        </Text>
      ) : null}
    </div>
  );
}
