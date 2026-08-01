import { Activity, BookOpen, ChevronLeft, Plus, Shield, Users, UserCheck } from 'lucide-react';
import { Button, Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { AppResult, HeroCard, LoadingState, PageContainer, StatCard } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardStats } from '@/features/admin/dashboard/hooks/useDashboardStats';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

const CMS_LINKS = [
  {
    label: 'پزشکان',
    desc: 'مدارک و مجوز',
    to: routes.admin.doctors,
    accent: 'blue' as const,
    icon: UserCheck,
  },
  {
    label: 'بیماران',
    desc: 'کاربری و پرونده',
    to: routes.admin.patients,
    accent: 'mint' as const,
    icon: Users,
  },
  {
    label: 'تمرینات',
    desc: 'ویدیو و محتوا',
    to: routes.admin.exercises,
    accent: 'peach' as const,
    icon: Activity,
  },
  {
    label: 'دسته‌بندی',
    desc: 'گروه حرکات',
    to: routes.admin.exerciseCategories,
    accent: 'blue' as const,
    icon: Shield,
  },
  {
    label: 'مقالات',
    desc: 'محتوای آموزشی',
    to: routes.admin.articles,
    accent: 'mint' as const,
    icon: BookOpen,
  },
];

const ACCENT_STYLE = {
  blue: { bg: 'var(--phisio-primary-soft)', color: 'var(--phisio-primary)' },
  mint: { bg: 'var(--phisio-accent-soft)', color: 'var(--phisio-teal)' },
  peach: { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--phisio-warning)' },
} as const;

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  const displayName = user?.name ?? t('layout.defaultUser');

  return (
    <PageContainer>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '80px',
        }}
        aria-label="پنل مدیریتی سامانه"
      >
        <HeroCard
          badge="مدیریت سیستم"
          title={t('admin.dashboard.greeting', { name: displayName })}
          description="نظارت بر پزشکان، بیماران، تمرینات و محتوای آموزشی"
          illustration="admin"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              style={{
                borderRadius: 'var(--phisio-radius-pill)',
                height: '40px',
                padding: '0 18px',
                fontWeight: 600,
              }}
              onClick={() => void navigate(routes.admin.exercises)}
            >
              افزودن تمرین
            </Button>
            <Button
              size="large"
              icon={<Shield size={16} />}
              style={{
                borderRadius: 'var(--phisio-radius-md)',
                height: '40px',
                padding: '0 18px',
                fontWeight: 600,
                borderColor: 'var(--phisio-border)',
                color: 'var(--phisio-text)',
              }}
              onClick={() => void navigate(routes.admin.doctors)}
            >
              تایید پزشکان
            </Button>
          </div>
        </HeroCard>

        {isLoading ? <LoadingState tip={t('admin.dashboard.loading')} /> : null}

        {isError ? (
          <AppResult
            status="error"
            title={getErrorMessage(error, t('admin.dashboard.errors.loadFailed'))}
            extra={
              <Button type="primary" onClick={() => void refetch()}>
                {t('admin.dashboard.retry')}
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && stats ? (
          <>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={8}>
                <StatCard
                  label={t('admin.dashboard.summary.patients')}
                  value={formatPersianNumber(stats.patientCount)}
                  icon={<Users size={20} />}
                  accent="blue"
                  to={routes.admin.patients}
                />
              </Col>
              <Col xs={24} sm={8}>
                <StatCard
                  label={t('admin.dashboard.summary.doctors')}
                  value={formatPersianNumber(stats.doctorCount)}
                  icon={<UserCheck size={20} />}
                  accent="mint"
                  to={routes.admin.doctors}
                />
              </Col>
              <Col xs={24} sm={8}>
                <StatCard
                  label={t('admin.dashboard.summary.exercises')}
                  value={formatPersianNumber(stats.exerciseCount)}
                  icon={<Activity size={20} />}
                  accent="blue"
                  to={routes.admin.exercises}
                />
              </Col>
            </Row>

            <Card
              style={{
                borderRadius: 'var(--phisio-radius-md)',
                backgroundColor: 'var(--phisio-surface)',
                border: '1px solid var(--phisio-border)',
                boxShadow: 'var(--phisio-shadow-sm)',
              }}
              styles={{ body: { padding: '16px' } }}
            >
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--phisio-text)',
                  margin: '0 0 12px',
                }}
              >
                دسترسی سریع CMS
              </h3>

              <Row gutter={[10, 10]}>
                {CMS_LINKS.map((item) => {
                  const ItemIcon = item.icon;
                  const tone = ACCENT_STYLE[item.accent];
                  return (
                    <Col key={item.to} xs={24} sm={12} md={8}>
                      <Link
                        to={item.to}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 'var(--phisio-radius-md)',
                          backgroundColor: 'var(--phisio-bg-elevated)',
                          border: '1px solid var(--phisio-border)',
                          textDecoration: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              padding: '8px',
                              borderRadius: 'var(--phisio-radius-sm)',
                              backgroundColor: tone.bg,
                              color: tone.color,
                            }}
                          >
                            <ItemIcon size={18} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--phisio-text)',
                              }}
                            >
                              {item.label}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--phisio-font-meta)',
                                color: 'var(--phisio-text-secondary)',
                              }}
                            >
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <ChevronLeft size={16} style={{ color: 'var(--phisio-text-secondary)' }} />
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </>
        ) : null}
      </section>
    </PageContainer>
  );
}
