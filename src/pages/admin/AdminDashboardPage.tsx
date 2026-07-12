import { Button, Col, Result, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { HeroCard, LoadingState, PageContainer, PageSection } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DashboardNavButton } from '@/features/admin/components/DashboardNavButton';
import { SummaryCard } from '@/features/admin/components/SummaryCard';
import { useDashboardStats } from '@/features/admin/dashboard/hooks/useDashboardStats';
import {
  adminDashboardNavItems,
  adminDashboardSummary,
} from '@/features/admin/constants/dashboard-data';
import { getErrorMessage } from '@/utils/get-error-message';

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  const displayName = user?.name ?? t('layout.defaultUser');

  return (
    <PageContainer>
      <HeroCard
        badge={t('admin.dashboard.badge')}
        title={t('admin.dashboard.greeting', { name: displayName })}
        description={t('admin.dashboard.heroDescription')}
        illustration="admin"
      />

      {isLoading ? <LoadingState tip={t('admin.dashboard.loading')} /> : null}

      {isError ? (
        <Result
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
        <PageSection title={t('admin.dashboard.summaryTitle')}>
          <Row gutter={[16, 16]}>
            {adminDashboardSummary.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8}>
                <SummaryCard label={t(item.labelKey)} value={stats[item.valueKey]} to={item.to} />
              </Col>
            ))}
          </Row>
        </PageSection>
      ) : null}

      <PageSection title={t('admin.dashboard.quickActions')}>
        <Row gutter={[16, 16]}>
          {adminDashboardNavItems.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8}>
              <DashboardNavButton id={item.id} label={t(item.labelKey)} to={item.to} />
            </Col>
          ))}
        </Row>
      </PageSection>
    </PageContainer>
  );
}
