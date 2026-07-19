import {
  HomeOutlined,
  LineChartOutlined,
  LockOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Grid, Layout, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { DockNav } from '@/components/navigation';
import { NavCard } from '@/components/navigation/NavCard';
import { AppBrand } from '@/components/ui';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { patientLayoutConfig } from '@/layouts/config/role-layout-config';
import { routes } from '@/routes/routes';
import { convertToPersianDigits } from '@/utils/persian-format';

const { Header, Content, Sider } = Layout;

export function PatientAppShell() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  const navItems = useMemo(
    () => [
      { key: routes.patient.root, icon: <HomeOutlined />, label: t('layout.nav.dashboard') },
      {
        key: routes.patient.exercises,
        icon: <MedicineBoxOutlined />,
        label: t('layout.nav.myExercises'),
      },
      {
        key: routes.patient.progress,
        icon: <LineChartOutlined />,
        label: t('layout.nav.progress'),
      },
    ],
    [t],
  );

  const selectedKey =
    navItems.find((item) => location.pathname === item.key)?.key ??
    (location.pathname.startsWith(routes.patient.exercises)
      ? routes.patient.exercises
      : location.pathname.startsWith(routes.patient.progress)
        ? routes.patient.progress
        : routes.patient.root);

  const userMenuItems = [
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: t('layout.changePassword'),
      onClick: () => setChangePasswordOpen(true),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('layout.signOut'),
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout className={patientLayoutConfig.layoutClassName} style={{ minHeight: '100vh' }}>
      <Header className="app-header safe-area-top">
        <AppBrand showLogo={false} />
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <button
            type="button"
            className="touch-target touch-active"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '4px 8px',
              color: 'var(--phisio-text)',
            }}
            aria-label={displayName}
          >
            <Avatar
              size={38}
              style={{
                background: 'var(--phisio-primary-soft)',
                color: 'var(--phisio-primary)',
                border: '1px solid var(--phisio-border-glow)',
              }}
              icon={<UserOutlined />}
            />
            <Typography.Text ellipsis style={{ maxWidth: 120, fontWeight: 600, color: 'inherit' }}>
              {displayName}
            </Typography.Text>
          </button>
        </Dropdown>
      </Header>

      <Layout>
        {!isMobile ? (
          <Sider width={260} className="app-sider">
            <AppBrand />
            <nav aria-label={t(patientLayoutConfig.navAriaLabelKey)}>
              {navItems.map((item) => (
                <NavCard
                  key={item.key}
                  to={item.key}
                  icon={item.icon}
                  label={item.label}
                  active={selectedKey === item.key}
                />
              ))}
            </nav>
          </Sider>
        ) : null}

        <Content className={isMobile ? 'patient-content-with-tabs' : undefined}>
          <div className="app-content">
            <Outlet />
          </div>
        </Content>
      </Layout>

      {isMobile ? (
        <DockNav
          items={navItems}
          selectedKey={selectedKey}
          ariaLabel={t(patientLayoutConfig.navAriaLabelKey)}
        />
      ) : null}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </Layout>
  );
}
