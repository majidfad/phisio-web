import {
  Activity,
  BookOpen,
  Building2,
  ChevronLeft,
  Plus,
  Shield,
  Users,
  UserCheck,
} from 'lucide-react';
import { Button, Col, Row } from 'antd';
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
    labelKey: 'admin.dashboard.cms.clinics',
    descKey: 'admin.dashboard.cms.clinicsDesc',
    to: routes.admin.clinics,
    accent: 'blue' as const,
    icon: Building2,
  },
  {
    labelKey: 'admin.dashboard.cms.doctors',
    descKey: 'admin.dashboard.cms.doctorsDesc',
    to: routes.admin.doctors,
    accent: 'blue' as const,
    icon: UserCheck,
  },
  {
    labelKey: 'admin.dashboard.cms.patients',
    descKey: 'admin.dashboard.cms.patientsDesc',
    to: routes.admin.patients,
    accent: 'mint' as const,
    icon: Users,
  },
  {
    labelKey: 'admin.dashboard.cms.exercises',
    descKey: 'admin.dashboard.cms.exercisesDesc',
    to: routes.admin.exercises,
    accent: 'peach' as const,
    icon: Activity,
  },
  {
    labelKey: 'admin.dashboard.cms.categories',
    descKey: 'admin.dashboard.cms.categoriesDesc',
    to: routes.admin.exerciseCategories,
    accent: 'blue' as const,
    icon: Shield,
  },
  {
    labelKey: 'admin.dashboard.cms.articles',
    descKey: 'admin.dashboard.cms.articlesDesc',
    to: routes.admin.articles,
    accent: 'mint' as const,
    icon: BookOpen,
  },
];

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  const displayName = user?.name ?? t('layout.defaultUser');

  return (
    <PageContainer className="clinic-dashboard-page">
      <section className="clinic-dashboard" aria-label={t('admin.dashboard.managementAria')}>
        <HeroCard
          badge={t('admin.dashboard.badge')}
          title={t('admin.dashboard.greeting', { name: displayName })}
          description={t('admin.dashboard.heroDescription')}
          illustration="admin"
        >
          <div className="clinic-dashboard__hero-actions">
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              className="clinic-dashboard__cta-primary"
              onClick={() => void navigate(routes.admin.exercises)}
            >
              {t('admin.dashboard.actions.addExercise')}
            </Button>
            <Button
              size="large"
              icon={<Shield size={16} />}
              className="clinic-dashboard__cta-secondary"
              onClick={() => void navigate(routes.admin.doctors)}
            >
              {t('admin.dashboard.actions.approveDoctors')}
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
            <Row gutter={[12, 12]} className="clinic-dashboard__stats">
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

            <section className="clinic-dashboard__panel" aria-labelledby="admin-quick-access">
              <h2 id="admin-quick-access" className="clinic-dashboard__section-title">
                {t('admin.dashboard.quickAccess')}
              </h2>
              <div className="clinic-dashboard__links clinic-dashboard__links--grid">
                {CMS_LINKS.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className="clinic-dashboard__link">
                      <span className="clinic-dashboard__link-main">
                        <span
                          className={`clinic-dashboard__link-icon clinic-dashboard__link-icon--${item.accent}`}
                        >
                          <ItemIcon size={18} />
                        </span>
                        <span className="clinic-dashboard__link-text">
                          <span className="clinic-dashboard__link-title">{t(item.labelKey)}</span>
                          <span className="clinic-dashboard__link-desc">{t(item.descKey)}</span>
                        </span>
                      </span>
                      <ChevronLeft
                        size={16}
                        className="clinic-dashboard__link-chevron"
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </PageContainer>
  );
}
