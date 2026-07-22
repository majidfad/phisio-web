import {
  DashboardOutlined,
  FileTextOutlined,
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Tag, Typography } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { NavCard } from '@/components/navigation/NavCard';
import { AppBrand, ThemeToggleButton } from '@/components/ui';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { convertToPersianDigits } from '@/utils/persian-format';

import type { RoleLayoutConfig } from '../config/role-layout-config.types';

const { Header, Content, Sider } = Layout;

const NAV_ICONS: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  doctors: <TeamOutlined />,
  patients: <UserOutlined />,
  articles: <ReadOutlined />,
  exercises: <FileTextOutlined />,
  assignments: <FileTextOutlined />,
  overview: <DashboardOutlined />,
  progress: <DashboardOutlined />,
};

interface AntDesignRoleShellProps {
  config: RoleLayoutConfig;
}

export function AntDesignRoleShell({ config }: AntDesignRoleShellProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  const navItems = useMemo(
    () =>
      config.navItems
        .filter((item) => item.to)
        .map((item) => ({
          key: item.to!,
          id: item.id,
          icon: NAV_ICONS[item.id] ?? <DashboardOutlined />,
          label: t(item.labelKey),
        })),
    [config.navItems, t],
  );

  const selectedKey =
    navItems.find((item) => location.pathname === item.key)?.key ??
    navItems.find((item) => location.pathname.startsWith(item.key) && item.key !== '/')?.key ??
    navItems[0]?.key;

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

  const navCards = (
    <nav aria-label={t(config.navAriaLabelKey)}>
      {navItems.map((item) => (
        <NavCard
          key={item.key}
          to={item.key}
          icon={item.icon}
          label={collapsed && !isMobile ? '' : item.label}
          active={selectedKey === item.key}
          onClick={() => setDrawerOpen(false)}
        />
      ))}
    </nav>
  );

  return (
    <Layout className={config.layoutClassName} style={{ minHeight: '100vh' }}>
      {!isMobile ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={272}
          className="app-sider"
          trigger={null}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 4px 0',
            }}
          >
            <AppBrand collapsed={collapsed} />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? t('layout.openNav') : t('layout.openNav')}
            />
          </div>
          {navCards}
        </Sider>
      ) : null}

      <Layout>
        <Header className="app-header safe-area-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
                aria-label={t('layout.openNav')}
              />
            ) : null}
            {isMobile ? <span className="app-header__brand">{t('app.name')}</span> : null}
            <Tag
              style={{
                margin: 0,
                border: '1px solid var(--phisio-border-glow)',
                background: 'var(--phisio-primary-soft)',
                color: 'var(--phisio-primary)',
                fontWeight: 700,
              }}
            >
              {t(config.roleLabelKey)}
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ThemeToggleButton />
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Button
                type="text"
                style={{
                  height: 46,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--phisio-text)',
                }}
              >
                <Avatar
                  size={34}
                  style={{
                    background: 'var(--phisio-primary-soft)',
                    color: 'var(--phisio-primary)',
                    border: '1px solid var(--phisio-border-glow)',
                  }}
                  icon={<UserOutlined />}
                />
                <Typography.Text ellipsis style={{ maxWidth: 140, color: 'inherit' }}>
                  {displayName}
                </Typography.Text>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content>
          <div className="app-content">
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Drawer
        title={t('layout.menu')}
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={300}
        styles={{ body: { padding: '12px 16px 24px', background: 'var(--phisio-bg-elevated)' } }}
      >
        <AppBrand />
        {navCards}
      </Drawer>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </Layout>
  );
}
