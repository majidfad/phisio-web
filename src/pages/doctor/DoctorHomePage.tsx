import { Button, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { HeroCard, LoadingState, PageContainer, PageSection, AppResult } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DashboardNavButton } from '@/features/admin/components/DashboardNavButton';
import { SummaryCard } from '@/features/admin/components/SummaryCard';
import { RecentPatientsTable } from '@/features/doctor/dashboard/components/RecentPatientsTable';
import {
  doctorDashboardNavItems,
  doctorDashboardSummary,
} from '@/features/doctor/dashboard/constants/dashboard-data';
import { useDoctorDashboard } from '@/features/doctor/dashboard/hooks/useDoctorDashboard';
import { getErrorMessage } from '@/utils/get-error-message';

export function DoctorHomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: dashboard, isLoading, isError, error, refetch } = useDoctorDashboard();

  const displayName = user?.name ?? t('layout.defaultUser');

  return (
    <PageContainer>
      <HeroCard
        badge={t('doctor.dashboard.badge')}
        title={t('doctor.dashboard.greeting', { name: displayName })}
        description={t('doctor.dashboard.heroDescription')}
        illustration="care"
      />

      {isLoading ? <LoadingState tip={t('doctor.dashboard.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('doctor.dashboard.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('doctor.dashboard.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && dashboard ? (
        <>
          <PageSection title={t('doctor.dashboard.summaryTitle')}>
            <Row gutter={[16, 16]}>
              {doctorDashboardSummary.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8}>
                  <SummaryCard
                    label={t(item.labelKey)}
                    value={dashboard[item.valueKey]}
                    to={item.to}
                  />
                </Col>
              ))}
            </Row>
          </PageSection>

          <PageSection title={t('doctor.dashboard.quickActions')}>
            <Row gutter={[16, 16]}>
              {doctorDashboardNavItems.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8}>
                  <DashboardNavButton id={item.id} label={t(item.labelKey)} to={item.to} />
                </Col>
              ))}
            </Row>
          </PageSection>

          <PageSection title={t('doctor.dashboard.recentPatients.title')}>
            <RecentPatientsTable patients={dashboard.recentPatients} />
          </PageSection>
        </>
      ) : null}
    </PageContainer>
  );
}
