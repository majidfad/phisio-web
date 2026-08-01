import { CheckCircle2, Circle } from 'lucide-react';
import { Card, Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { HeroCard, LoadingState, PageContainer, StatCard, WarmEmptyState } from '@/components/ui';
import { StatusCapsule } from '@/components/ui/StatusCapsule';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePatientTodayExercises } from '@/features/patient/exercises/hooks/usePatientExercises';
import { flattenTodayExercises } from '@/features/patient/exercises/types/patient-exercise';
import { convertToPersianDigits, formatPersianNumber } from '@/utils/persian-format';

export function PatientProgressView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = usePatientTodayExercises();

  const exercises = data ? flattenTodayExercises(data) : [];
  const total = exercises.length;
  const completed = exercises.filter((e) => e.completedToday).length;
  const remaining = Math.max(total - completed, 0);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const displayName =
    user?.name ??
    (user?.phoneNumber ? convertToPersianDigits(user.phoneNumber) : t('layout.defaultUser'));

  return (
    <PageContainer>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '88px',
        }}
        aria-label="گزارش پیشرفت تمرینات"
      >
        <HeroCard
          badge="پیشرفت"
          title={`گزارش پیشرفت ${displayName}`}
          description="وضعیت تمرین‌های امروز و میزان تکمیل برنامه"
          illustration="progress"
          progressPercent={percent}
        />

        {isLoading ? <LoadingState tip={t('patient.exercises.loading')} /> : null}

        {!isLoading && total === 0 ? (
          <WarmEmptyState
            title={t('patient.exercises.emptyTodayTitle')}
            description={t('patient.dashboard.noExercisesToday')}
          />
        ) : null}

        {!isLoading && total > 0 ? (
          <>
            <Row gutter={[12, 12]}>
              <Col xs={12} sm={8}>
                <StatCard
                  label="تکمیل‌شده امروز"
                  value={formatPersianNumber(completed)}
                  suffix="تمرین"
                  icon={<CheckCircle2 size={18} />}
                  accent="mint"
                />
              </Col>
              <Col xs={12} sm={8}>
                <StatCard
                  label="باقی‌مانده"
                  value={formatPersianNumber(remaining)}
                  suffix="تمرین"
                  icon={<Circle size={18} />}
                  accent="blue"
                />
              </Col>
              <Col xs={24} sm={8}>
                <StatCard
                  label="پیشرفت امروز"
                  value={`${formatPersianNumber(percent)}٪`}
                  icon={<CheckCircle2 size={18} />}
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  gap: '8px',
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
                  پیشرفت جلسه امروز
                </h3>
                <StatusCapsule
                  status={percent === 100 ? 'completed' : 'active'}
                  label={`${formatPersianNumber(percent)}٪`}
                  showDot={false}
                />
              </div>

              <div
                style={{
                  height: '10px',
                  borderRadius: 'var(--phisio-radius-pill)',
                  backgroundColor: 'var(--phisio-bg-elevated)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    borderRadius: 'var(--phisio-radius-pill)',
                    background: 'var(--phisio-brand-gradient)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 'var(--phisio-font-meta)',
                  color: 'var(--phisio-text-secondary)',
                }}
              >
                {formatPersianNumber(completed)} از {formatPersianNumber(total)} تمرین امروز انجام
                شده
              </p>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--phisio-text)',
                  margin: 0,
                }}
              >
                تمرین‌های امروز
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exercises.map((item) => (
                  <div
                    key={item.userExerciseId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--phisio-radius-md)',
                      backgroundColor: 'var(--phisio-surface)',
                      border: '1px solid var(--phisio-border)',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--phisio-radius-sm)',
                          backgroundColor: item.completedToday
                            ? 'var(--phisio-accent-soft)'
                            : 'var(--phisio-primary-soft)',
                          color: item.completedToday
                            ? 'var(--phisio-teal)'
                            : 'var(--phisio-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.completedToday ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          minWidth: 0,
                        }}
                      >
                        <bdi
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--phisio-text)',
                            unicodeBidi: 'plaintext',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                          }}
                        >
                          {item.title}
                        </bdi>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--phisio-text-secondary)',
                          }}
                        >
                          {item.sets ? `${formatPersianNumber(item.sets)} ست` : ''}
                          {item.reps ? ` × ${convertToPersianDigits(item.reps)}` : ''}
                        </span>
                      </div>
                    </div>
                    <StatusCapsule
                      status={item.completedToday ? 'completed' : 'pending'}
                      label={item.completedToday ? 'تکمیل شد' : 'باقی‌مانده'}
                      showDot={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </PageContainer>
  );
}
