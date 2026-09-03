import {
  Activity,
  ChevronLeft,
  ClipboardList,
  MessageSquare,
  Plus,
  Users,
  UserCheck,
} from 'lucide-react';
import { Button, Col, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { AppResult, HeroCard, LoadingState, PageContainer, StatCard } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RecentPatientsTable } from '@/features/doctor/dashboard/components/RecentPatientsTable';
import { useDoctorDashboard } from '@/features/doctor/dashboard/hooks/useDoctorDashboard';
import { DoctorClinicFilter } from '@/features/doctor/patients/components/DoctorClinicFilter';
import { useDoctorClinics } from '@/features/doctor/patients/hooks/useDoctorPatients';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

export function DoctorHomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const { data: clinics = [] } = useDoctorClinics();
  const { data: dashboard, isLoading, isError, error, refetch } = useDoctorDashboard(clinicId);

  const displayName = user?.name ?? t('layout.defaultUser');

  return (
    <PageContainer className="clinic-dashboard-page">
      <section className="clinic-dashboard" aria-label={t('doctor.dashboard.managementAria')}>
        <HeroCard
          badge={t('doctor.dashboard.badge')}
          title={t('doctor.dashboard.greeting', { name: displayName })}
          description={t('doctor.dashboard.heroDescription')}
          illustration="care"
        >
          <div className="clinic-dashboard__hero-actions">
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              className="clinic-dashboard__cta-primary"
              onClick={() => void navigate(routes.doctor.patients)}
            >
              {t('doctor.dashboard.actions.prescribe')}
            </Button>
            <Button
              size="large"
              icon={<Users size={16} />}
              className="clinic-dashboard__cta-secondary"
              onClick={() => void navigate(routes.doctor.patients)}
            >
              {t('doctor.dashboard.actions.myPatients')}
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
            <DoctorClinicFilter clinics={clinics} value={clinicId} onChange={setClinicId} />
            <Row gutter={[12, 12]} className="clinic-dashboard__stats">
              <Col xs={24} sm={12} lg={8}>
                <StatCard
                  label={t('doctor.dashboard.summary.patientsUnderCare')}
                  value={formatPersianNumber(dashboard.patientsCount)}
                  suffix={t('doctor.dashboard.summary.peopleSuffix')}
                  icon={<Users size={20} />}
                  accent="blue"
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StatCard
                  label={t('doctor.dashboard.summary.pendingRequests')}
                  value={formatPersianNumber(dashboard.pendingRequestsCount)}
                  suffix={t('doctor.dashboard.summary.peopleSuffix')}
                  icon={<UserCheck size={20} />}
                  accent="mint"
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StatCard
                  label={t('doctor.dashboard.summary.assignedExercises')}
                  value={formatPersianNumber(dashboard.assignedExercisesCount)}
                  icon={<ClipboardList size={20} />}
                  accent="peach"
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StatCard
                  label={t('doctor.dashboard.summary.completedExercises')}
                  value={formatPersianNumber(dashboard.completedExercisesCount)}
                  icon={<Activity size={20} />}
                  accent="blue"
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <StatCard
                  label={t('doctor.dashboard.summary.feedback')}
                  value={formatPersianNumber(dashboard.feedbackCount)}
                  icon={<MessageSquare size={20} />}
                  accent="mint"
                />
              </Col>
            </Row>

            <section className="clinic-dashboard__panel" aria-labelledby="doctor-quick-access">
              <h2 id="doctor-quick-access" className="clinic-dashboard__section-title">
                {t('doctor.dashboard.quickAccess')}
              </h2>
              <div className="clinic-dashboard__links">
                <Link to={routes.doctor.patients} className="clinic-dashboard__link">
                  <span className="clinic-dashboard__link-main">
                    <span className="clinic-dashboard__link-icon clinic-dashboard__link-icon--blue">
                      <Users size={18} />
                    </span>
                    <span className="clinic-dashboard__link-text">
                      <span className="clinic-dashboard__link-title">
                        {t('doctor.dashboard.links.patients')}
                      </span>
                      <span className="clinic-dashboard__link-desc">
                        {t('doctor.dashboard.links.patientsDesc')}
                      </span>
                    </span>
                  </span>
                  <ChevronLeft size={16} className="clinic-dashboard__link-chevron" aria-hidden />
                </Link>

                <Link to={routes.doctor.exercises} className="clinic-dashboard__link">
                  <span className="clinic-dashboard__link-main">
                    <span className="clinic-dashboard__link-icon clinic-dashboard__link-icon--teal">
                      <Activity size={18} />
                    </span>
                    <span className="clinic-dashboard__link-text">
                      <span className="clinic-dashboard__link-title">
                        {t('doctor.dashboard.links.exercises')}
                      </span>
                      <span className="clinic-dashboard__link-desc">
                        {t('doctor.dashboard.links.exercisesDesc')}
                      </span>
                    </span>
                  </span>
                  <ChevronLeft size={16} className="clinic-dashboard__link-chevron" aria-hidden />
                </Link>
              </div>
            </section>

            <section className="clinic-dashboard__recent" aria-labelledby="doctor-recent-patients">
              <div className="clinic-dashboard__recent-header">
                <h2 id="doctor-recent-patients" className="clinic-dashboard__section-title">
                  {t('doctor.dashboard.recentPatients.title')}
                </h2>
                <StatusCapsule
                  status="info"
                  label={t('doctor.dashboard.recentPatients.count', {
                    count: formatPersianNumber(dashboard.recentPatients.length),
                  })}
                  showDot={false}
                />
              </div>
              <RecentPatientsTable patients={dashboard.recentPatients} />
            </section>
          </>
        ) : null}
      </section>
    </PageContainer>
  );
}
