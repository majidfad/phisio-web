import { AppResult, AppTable, LoadingState, WarmEmptyState } from '@/components/ui';
import { Button, Card, Col, Modal, Row, Space, Statistic, Tag, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PatientExerciseStatsPanel } from '@/features/doctor/patients/components/PatientExerciseStatsPanel';
import { usePatientExerciseHistory } from '@/features/doctor/patients/hooks/useDoctorPatients';
import type { DoctorPatientDto } from '@/features/doctor/patients/types/doctor-patient';
import type {
  PatientExerciseHistoryDayDto,
  PatientExerciseHistoryExerciseDto,
} from '@/features/doctor/patients/types/patient-exercise-history';
import {
  formatImprovementScoreDisplay,
  formatPatientCommentDisplay,
  hasPatientFeedback,
} from '@/features/doctor/patients/utils/exercise-history-feedback-display';
import { getErrorMessage } from '@/utils/get-error-message';
import {
  formatDisplayPhone,
  formatPersianCalendarDate,
  formatPersianNumber,
} from '@/utils/persian-format';

const { Text } = Typography;

interface PatientExerciseHistoryModalProps {
  patient: DoctorPatientDto | null;
  onClose: () => void;
}

function DayExpandedRow({ day }: { day: PatientExerciseHistoryDayDto }) {
  const { t } = useTranslation();
  const showFeedbackDetails = hasPatientFeedback(
    day.improvementScore,
    day.comment,
    day.hardnessScore,
  );
  const dosageKey = 'doctor.patients.exercisePlan.dosage';

  const detailColumns: ColumnsType<PatientExerciseHistoryExerciseDto> = [
    {
      title: t('doctor.patients.exerciseHistory.detailColumns.title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('doctor.patients.exerciseHistory.detailColumns.status'),
      key: 'status',
      render: (_, exercise) =>
        exercise.isCompleted
          ? t('doctor.patients.exerciseHistory.exerciseStatus.completed')
          : t('doctor.patients.exerciseHistory.exerciseStatus.missed'),
    },
    {
      title: t('doctor.patients.exerciseHistory.detailColumns.dosage'),
      key: 'dosage',
      render: (_, exercise) => (
        <Space wrap size={[4, 4]}>
          {exercise.sets != null ? (
            <Tag>{t('patient.exercises.dosage.sets', { count: exercise.sets })}</Tag>
          ) : null}
          {exercise.reps ? (
            <Tag>{t('patient.exercises.dosage.reps', { count: exercise.reps })}</Tag>
          ) : null}
        </Space>
      ),
    },
    {
      title: t(`${dosageKey}.patientCue`),
      dataIndex: 'patientCue',
      key: 'patientCue',
      ellipsis: true,
      render: (value: string | null) => value?.trim() || '—',
    },
    {
      title: t(`${dosageKey}.clinicianNote`),
      dataIndex: 'clinicianNote',
      key: 'clinicianNote',
      ellipsis: true,
      render: (value: string | null) => value?.trim() || '—',
    },
  ];

  return (
    <div className="patient-stack">
      {showFeedbackDetails ? (
        <section
          className="doctor-history-feedback"
          aria-label={t('doctor.patients.exerciseHistory.feedbackSection')}
        >
          <div>
            <Text type="secondary">
              {t('doctor.patients.exerciseHistory.detailFeedback.score')}
            </Text>{' '}
            <Text>{formatImprovementScoreDisplay(day.improvementScore)}</Text>
          </div>
          <div>
            <Text type="secondary">
              {t('doctor.patients.exerciseHistory.detailFeedback.hardness')}
            </Text>{' '}
            <Text>{formatImprovementScoreDisplay(day.hardnessScore)}</Text>
          </div>
          <div>
            <Text type="secondary">
              {t('doctor.patients.exerciseHistory.detailFeedback.comment')}
            </Text>
            {day.comment?.trim() ? (
              <blockquote className="doctor-history-feedback__quote">
                {day.comment.trim()}
              </blockquote>
            ) : (
              <Text style={{ display: 'block', marginTop: 4 }}>
                {formatPatientCommentDisplay(day.comment)}
              </Text>
            )}
          </div>
        </section>
      ) : null}

      <AppTable
        size="small"
        pagination={false}
        rowKey="userExerciseId"
        dataSource={day.exercises}
        columns={detailColumns}
      />
    </div>
  );
}

export function PatientExerciseHistoryModal({
  patient,
  onClose,
}: PatientExerciseHistoryModalProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError, error, refetch, isFetching } = usePatientExerciseHistory(
    patient?.patientId ?? null,
    { page, pageSize },
    patient?.clinicId,
  );

  const summary = data?.summary;
  const hasHistory = (data?.totalDays ?? 0) > 0 || (summary?.assignedExerciseCount ?? 0) > 0;

  const columns: ColumnsType<PatientExerciseHistoryDayDto> = [
    {
      title: t('doctor.patients.exerciseHistory.columns.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatPersianCalendarDate(date),
    },
    {
      title: t('doctor.patients.exerciseHistory.columns.completedCount'),
      dataIndex: 'completedExerciseCount',
      key: 'completedExerciseCount',
      render: (count: number) => formatPersianNumber(count),
    },
    {
      title: t('doctor.patients.exerciseHistory.columns.improvementScore'),
      dataIndex: 'improvementScore',
      key: 'improvementScore',
      render: (score) => formatImprovementScoreDisplay(score),
    },
    {
      title: t('doctor.patients.exerciseHistory.columns.hardnessScore'),
      dataIndex: 'hardnessScore',
      key: 'hardnessScore',
      render: (score) => formatImprovementScoreDisplay(score),
    },
    {
      title: t('doctor.patients.exerciseHistory.columns.patientComment'),
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment) => formatPatientCommentDisplay(comment),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  return (
    <Modal
      title={t('doctor.patients.exerciseHistory.title')}
      open={Boolean(patient)}
      onCancel={onClose}
      footer={null}
      width={1040}
      destroyOnHidden
      centered
      afterOpenChange={(open) => {
        if (!open) {
          setPage(1);
          setPageSize(10);
        }
      }}
    >
      {patient ? (
        <div className="patient-stack patient-stack--loose">
          <Card
            className="patient-media-card"
            size="small"
            aria-label={t('doctor.patients.exerciseHistory.patientInfo')}
          >
            <div className="doctor-history-patient">
              <div className="doctor-history-patient__line">
                <span className="doctor-history-patient__label">
                  {t('doctor.patients.exerciseHistory.patientName')}
                </span>
                <Text strong>{data?.patient.patientName ?? patient.patientName}</Text>
              </div>
              <div className="doctor-history-patient__line">
                <span className="doctor-history-patient__label">
                  {t('doctor.patients.exerciseHistory.patientPhone')}
                </span>
                <Text dir="ltr">
                  {formatDisplayPhone(data?.patient.phoneNumber ?? patient.phoneNumber)}
                </Text>
              </div>
            </div>
          </Card>

          {isLoading ? <LoadingState tip={t('doctor.patients.exerciseHistory.loading')} /> : null}

          {isError ? (
            <AppResult
              status="error"
              title={getErrorMessage(error, t('doctor.patients.exerciseHistory.errors.loadFailed'))}
              extra={
                <Button type="primary" size="large" onClick={() => void refetch()}>
                  {t('doctor.patients.exerciseHistory.retry')}
                </Button>
              }
            />
          ) : null}

          {!isLoading && !isError && summary ? (
            <>
              <Row gutter={[12, 12]} aria-label={t('doctor.patients.exerciseHistory.summaryTitle')}>
                <Col xs={12} sm={6}>
                  <Card className="energy-stat-card energy-stat-card--primary" size="small">
                    <Statistic
                      title={t('doctor.patients.exerciseHistory.summary.assignedExercises')}
                      value={formatPersianNumber(summary.assignedExerciseCount)}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="energy-stat-card energy-stat-card--primary" size="small">
                    <Statistic
                      title={t('doctor.patients.exerciseHistory.summary.completedDays')}
                      value={formatPersianNumber(summary.completedDaysCount)}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="energy-stat-card energy-stat-card--accent" size="small">
                    <Statistic
                      title={t('doctor.patients.exerciseHistory.summary.missedDays')}
                      value={formatPersianNumber(summary.missedDaysCount)}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className="energy-stat-card energy-stat-card--primary" size="small">
                    <Statistic
                      title={t('doctor.patients.exerciseHistory.summary.adherence')}
                      value={t('doctor.patients.exerciseHistory.summary.adherenceValue', {
                        value: formatPersianNumber(summary.adherencePercentage),
                      })}
                    />
                  </Card>
                </Col>
              </Row>

              <Card className="patient-media-card" size="small">
                <PatientExerciseStatsPanel
                  patientId={patient.patientId}
                  clinicId={patient.clinicId}
                  variant="history"
                />
              </Card>

              {!hasHistory ? (
                <WarmEmptyState description={t('doctor.patients.exerciseHistory.empty')} />
              ) : (
                <AppTable
                  rowKey="date"
                  columns={columns}
                  dataSource={data?.dailyHistory ?? []}
                  loading={isFetching}
                  pagination={{
                    current: page,
                    pageSize,
                    total: data?.totalDays ?? 0,
                    showSizeChanger: true,
                  }}
                  onChange={handleTableChange}
                  size="middle"
                  expandable={{
                    expandedRowRender: (day) => <DayExpandedRow day={day} />,
                  }}
                />
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
