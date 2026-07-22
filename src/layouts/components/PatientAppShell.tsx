import {
  Book,
  BookOpen,
  BarChart3,
  Ellipsis,
  Home,
  Lock,
  LogOut,
  Stethoscope,
  Users,
  User,
} from 'lucide-react';
import { Avatar, Drawer, Dropdown, Grid, Layout, List } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { appIconProps } from '@/components/icons/app-icon';
import { DockNav } from '@/components/navigation';
import { NavCard } from '@/components/navigation/NavCard';
import { AppBrand, ThemeToggleButton } from '@/components/ui';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { patientLayoutConfig } from '@/layouts/config/role-layout-config';
import { routes } from '@/routes/routes';
import { convertToPersianDigits } from '@/utils/persian-format';

const { Header, Content, Sider } = Layout;

const MORE_KEY = '__more__';

interface ShellNavItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export function PatientAppShell() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  const allNavItems = useMemo<ShellNavItem[]>(
    () => [
      {
        key: routes.patient.root,
        icon: <Home {...appIconProps} />,
        label: t('layout.nav.dashboard'),
      },
      {
        key: routes.patient.exercises,
        icon: <Stethoscope {...appIconProps} />,
        label: t('layout.nav.myExercises'),
      },
      {
        key: routes.patient.doctors,
        icon: <Users {...appIconProps} />,
        label: t('layout.nav.myDoctors'),
      },
      {
        key: routes.patient.progress,
        icon: <BarChart3 {...appIconProps} />,
        label: t('layout.nav.progress'),
      },
      {
        key: routes.patient.library,
        icon: <Book {...appIconProps} />,
        label: t('layout.nav.library'),
      },
      {
        key: routes.patient.articles,
        icon: <BookOpen {...appIconProps} />,
        label: t('layout.nav.articles'),
      },
    ],
    [t],
  );

  const primaryKeys = useMemo(
    () =>
      new Set([
        routes.patient.root,
        routes.patient.exercises,
        routes.patient.doctors,
        routes.patient.progress,
      ]),
    [],
  );

  const primaryNavItems = useMemo(
    () => allNavItems.filter((item) => primaryKeys.has(item.key)),
    [allNavItems, primaryKeys],
  );

  const moreNavItems = useMemo(
    () => allNavItems.filter((item) => !primaryKeys.has(item.key)),
    [allNavItems, primaryKeys],
  );

  const selectedKey = useMemo(() => {
    const exact = allNavItems.find((item) => location.pathname === item.key)?.key;
    if (exact) {
      return exact;
    }
    if (location.pathname.startsWith(routes.patient.doctors)) return routes.patient.doctors;
    if (location.pathname.startsWith(routes.patient.library)) return routes.patient.library;
    if (location.pathname.startsWith(routes.patient.articles)) return routes.patient.articles;
    if (location.pathname.startsWith(routes.patient.exercises)) return routes.patient.exercises;
    if (location.pathname.startsWith(routes.patient.progress)) return routes.patient.progress;
    return routes.patient.root;
  }, [allNavItems, location.pathname]);

  const moreSelected = moreNavItems.some((item) => item.key === selectedKey);

  const dockItems = useMemo(
    () => [
      ...primaryNavItems,
      {
        key: MORE_KEY,
        icon: <Ellipsis {...appIconProps} />,
        label: t('layout.nav.more'),
        onSelect: () => setMoreOpen(true),
      },
    ],
    [primaryNavItems, t],
  );

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

  return (
    <Layout className={patientLayoutConfig.layoutClassName} style={{ minHeight: '100vh' }}>
      <Header className="app-header safe-area-top">
        <AppBrand size={isMobile ? 32 : 36} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!isMobile ? <ThemeToggleButton /> : null}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <button
              type="button"
              className="touch-target touch-active app-header__user"
              aria-label={displayName}
            >
              <Avatar
                size={isMobile ? 36 : 38}
                style={{
                  background: 'var(--phisio-primary-soft)',
                  color: 'var(--phisio-primary)',
                  border: '1px solid var(--phisio-border)',
                }}
                icon={<User {...appIconProps} />}
              />
              {!isMobile ? <span className="app-header__user-name">{displayName}</span> : null}
            </button>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {!isMobile ? (
          <Sider width={260} className="app-sider">
            <nav aria-label={t(patientLayoutConfig.navAriaLabelKey)} style={{ paddingTop: 8 }}>
              {allNavItems.map((item) => (
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
          items={dockItems}
          selectedKey={moreSelected ? MORE_KEY : selectedKey}
          ariaLabel={t(patientLayoutConfig.navAriaLabelKey)}
        />
      ) : null}

      <Drawer
        title={t('layout.nav.more')}
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        placement="bottom"
        height="auto"
        className="patient-more-drawer"
        destroyOnHidden
      >
        <List
          dataSource={moreNavItems}
          renderItem={(item) => (
            <List.Item
              className="patient-more-drawer__item touch-target touch-active"
              onClick={() => {
                setMoreOpen(false);
                void navigate(item.key);
              }}
            >
              <List.Item.Meta avatar={item.icon} title={item.label} />
            </List.Item>
          )}
        />
        <div className="patient-more-drawer__theme">
          <ThemeToggleButton />
          <span>{t('layout.appearance')}</span>
        </div>
      </Drawer>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </Layout>
  );
}
