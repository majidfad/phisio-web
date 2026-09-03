import {
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  BarChart3,
  Building2,
  Tags,
  Users,
  User,
} from 'lucide-react';
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Tag, Typography } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { LanguageToggle } from '@/components/LanguageToggle';
import { NavCard } from '@/components/navigation/NavCard';
import { AppBrand, ThemeToggleButton } from '@/components/ui';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { NotificationBell } from '@/features/notifications';
import { convertToPersianDigits } from '@/utils/persian-format';

import type { RoleLayoutConfig } from '../config/role-layout-config.types';

const { Header, Content, Sider } = Layout;

const NAV_ICONS: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard {...appIconProps} />,
  clinics: <Building2 {...appIconProps} />,
  doctors: <Users {...appIconProps} />,
  patients: <User {...appIconProps} />,
  articles: <BookOpen {...appIconProps} />,
  exercises: <FileText {...appIconProps} />,
  exerciseCategories: <Tags {...appIconProps} />,
  assignments: <FileText {...appIconProps} />,
  overview: <LayoutDashboard {...appIconProps} />,
  progress: <BarChart3 {...appIconProps} />,
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
          icon: NAV_ICONS[item.id] ?? <LayoutDashboard {...appIconProps} />,
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
      icon: <Lock {...appIconProps} />,
      label: t('layout.changePassword'),
      onClick: () => setChangePasswordOpen(true),
    },
    {
      key: 'logout',
      icon: <LogOut {...appIconProps} />,
      label: t('layout.signOut'),
      danger: true,
      onClick: logout,
    },
  ];

  const siderCollapsed = collapsed && !isMobile;

  const navCards = (
    <nav className="app-sider__nav" aria-label={t(config.navAriaLabelKey)}>
      {navItems.map((item) => (
        <NavCard
          key={item.key}
          to={item.key}
          icon={item.icon}
          label={item.label}
          collapsed={siderCollapsed}
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
          width={240}
          collapsedWidth={72}
          className="app-sider"
          trigger={null}
        >
          <div className={`app-sider__top${collapsed ? ' app-sider__top--collapsed' : ''}`}>
            <AppBrand collapsed={collapsed} size={collapsed ? 32 : 36} />
            <Button
              type="text"
              className="app-sider__collapse-btn"
              icon={
                collapsed ? (
                  <PanelLeftOpen {...appIconProps} />
                ) : (
                  <PanelLeftClose {...appIconProps} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? t('layout.openNav') : t('layout.closeNav')}
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
                icon={<PanelLeftOpen {...appIconProps} />}
                onClick={() => setDrawerOpen(true)}
                aria-label={t('layout.openNav')}
              />
            ) : null}
            {isMobile ? <AppBrand size={28} /> : null}
            <Tag
              style={{
                margin: 0,
                border: '1px solid var(--phisio-border)',
                background: 'var(--phisio-bg-elevated)',
                color: 'var(--phisio-text-secondary)',
                fontWeight: 600,
                borderRadius: 'var(--phisio-radius-sm)',
              }}
            >
              {t(config.roleLabelKey)}
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <LanguageToggle className="landing-lang app-lang-toggle" />
            <NotificationBell />
            <ThemeToggleButton />
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <button
                type="button"
                className="touch-target app-header__user"
                aria-label={displayName}
              >
                <Avatar
                  size={32}
                  style={{
                    background: 'var(--phisio-primary-soft)',
                    color: 'var(--phisio-primary)',
                  }}
                  icon={<User {...appIconProps} />}
                />
                {!isMobile ? (
                  <Typography.Text
                    ellipsis
                    style={{ maxWidth: 140, color: 'inherit', fontWeight: 600 }}
                  >
                    {displayName}
                  </Typography.Text>
                ) : null}
              </button>
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
        styles={{
          body: { padding: '12px 12px 24px', background: 'var(--phisio-surface)' },
          header: {
            background: 'transparent',
            borderBottom: '1px solid var(--phisio-border)',
          },
        }}
      >
        <AppBrand />
        {navCards}
      </Drawer>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </Layout>
  );
}
