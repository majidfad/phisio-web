import { Activity, ChevronLeft, Plus, Users, UserCheck } from 'lucide-react';
import { Button, Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { AppResult, HeroCard, LoadingState, PageContainer, StatCard } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RecentPatientsTable } from '@/features/doctor/dashboard/components/RecentPatientsTable';
import { useDoctorDashboard } from '@/features/doctor/dashboard/hooks/useDoctorDashboard';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

export function DoctorHomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard, isLoading, isError, error, refetch } = useDoctorDashboard();

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
        aria-label="داشبورد اختصاصی پزشک"
      >
        <HeroCard
          badge="پنل پزشک"
          title={`خوش آمدید، ${displayName}`}
          description="مدیریت بیماران، پایبندی روزانه و تجویز برنامه تمرینی"
          illustration="care"
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
              onClick={() => void navigate(routes.doctor.patients)}
            >
              تجویز نسخه جدید
            </Button>
            <Button
              size="large"
              icon={<Users size={16} />}
              style={{
                borderRadius: 'var(--phisio-radius-md)',
                height: '40px',
                padding: '0 18px',
                fontWeight: 600,
                borderColor: 'var(--phisio-border)',
                color: 'var(--phisio-text)',
              }}
              onClick={() => void navigate(routes.doctor.patients)}
            >
              فهرست بیماران
            </Button>
          </div>
        </HeroCard>

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
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <StatCard
                  label="بیماران تحت نظر"
                  value={formatPersianNumber(dashboard.patientsCount)}
                  suffix="نفر"
                  icon={<Users size={20} />}
                  accent="blue"
                />
              </Col>
              <Col xs={24} sm={12}>
                <StatCard
                  label="بیماران اخیر"
                  value={formatPersianNumber(dashboard.recentPatients.length)}
                  suffix="نفر"
                  icon={<UserCheck size={20} />}
                  accent="mint"
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
                  marginBottom: '12px',
                  marginTop: 0,
                }}
              >
                دسترسی سریع
              </h3>
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={12}>
                  <Link
                    to={routes.doctor.patients}
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
                          backgroundColor: 'var(--phisio-primary-soft)',
                          color: 'var(--phisio-primary)',
                        }}
                      >
                        <Users size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{ fontSize: '14px', fontWeight: 600, color: 'var(--phisio-text)' }}
                        >
                          بیماران و درخواست‌ها
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--phisio-font-meta)',
                            color: 'var(--phisio-text-secondary)',
                          }}
                        >
                          سوابق و تایید اتصال
                        </span>
                      </div>
                    </div>
                    <ChevronLeft size={16} style={{ color: 'var(--phisio-text-secondary)' }} />
                  </Link>
                </Col>
                <Col xs={24} sm={12}>
                  <Link
                    to={routes.doctor.exercises}
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
                          backgroundColor: 'var(--phisio-accent-soft)',
                          color: 'var(--phisio-teal)',
                        }}
                      >
                        <Activity size={18} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{ fontSize: '14px', fontWeight: 600, color: 'var(--phisio-text)' }}
                        >
                          بانک تمرینات
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--phisio-font-meta)',
                            color: 'var(--phisio-text-secondary)',
                          }}
                        >
                          حرکات و ویدیوها
                        </span>
                      </div>
                    </div>
                    <ChevronLeft size={16} style={{ color: 'var(--phisio-text-secondary)' }} />
                  </Link>
                </Col>
              </Row>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: 'var(--phisio-text)',
                    margin: 0,
                  }}
                >
                  بیماران اخیر
                </h3>
                <StatusCapsule
                  status="info"
                  label={`${formatPersianNumber(dashboard.recentPatients.length)} نفر`}
                  showDot={false}
                />
              </div>
              <RecentPatientsTable patients={dashboard.recentPatients} />
            </div>
          </>
        ) : null}
      </section>
    </PageContainer>
  );
}
