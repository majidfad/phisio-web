import { LoadingState } from '@/components/ui';
import { Button, Progress, Segmented, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { usePatientExerciseStats } from '@/features/doctor/patients/hooks/useDoctorPatients';
import {
  statsRangeFromDays,
  type ExerciseStatsRangeDays,
} from '@/features/doctor/patients/types/patient-exercise-stats';
import { formatPersianCalendarDate, formatPersianNumber } from '@/utils/persian-format';

const { Text } = Typography;

export type PatientExerciseStatsPanelVariant = 'overview' | 'history';

interface PatientExerciseStatsPanelProps {
  patientId: string;
  clinicId?: string | null;
  variant: PatientExerciseStatsPanelVariant;
}

export function PatientExerciseStatsPanel({
  patientId,
  clinicId,
  variant,
}: PatientExerciseStatsPanelProps) {
  const { t } = useTranslation();
  const [rangeDays, setRangeDays] = useState<ExerciseStatsRangeDays>(30);
  const range = useMemo(() => statsRangeFromDays(rangeDays), [rangeDays]);
  const { data, isLoading, isError, refetch } = usePatientExerciseStats(patientId, range, clinicId);

  const weeklyChartData = useMemo(
    () =>
      (data?.weekly ?? []).map((week) => ({
        label: formatPersianCalendarDate(week.weekStart),
        adherence: week.adherencePercentage,
        completed: week.completedDays,
        scheduled: week.scheduledDays,
      })),
    [data?.weekly],
  );

  const feedbackChartData = useMemo(
    () =>
      (data?.daily ?? [])
        .filter((day) => day.improvementScore != null || day.hardnessScore != null)
        .map((day) => ({
          label: formatPersianCalendarDate(day.date),
          improvement: day.improvementScore,
          hardness: day.hardnessScore,
        })),
    [data?.daily],
  );

  const completenessChartData = useMemo(
    () =>
      (data?.daily ?? []).map((day) => ({
        label: formatPersianCalendarDate(day.date),
        completed: day.completedCount,
        remaining: Math.max(day.scheduledCount - day.completedCount, 0),
      })),
    [data?.daily],
  );

  const attentionExercises = useMemo(
    () => (data?.exercises ?? []).filter((item) => item.completionPercentage < 100).slice(0, 5),
    [data?.exercises],
  );

  return (
    <div className="doctor-stats-panel">
      <div className="doctor-stats-panel__header">
        <h3 className="doctor-stats-panel__title">{t('doctor.patients.stats.title')}</h3>
        <Segmented<ExerciseStatsRangeDays>
          value={rangeDays}
          onChange={setRangeDays}
          options={[
            { label: t('doctor.patients.stats.range.days7'), value: 7 },
            { label: t('doctor.patients.stats.range.days30'), value: 30 },
            { label: t('doctor.patients.stats.range.days90'), value: 90 },
          ]}
        />
      </div>

      {isLoading ? <LoadingState tip={t('doctor.patients.stats.loading')} /> : null}

      {isError ? (
        <Text type="danger">
          {t('doctor.patients.stats.loadFailed')}{' '}
          <Button
            type="link"
            onClick={() => void refetch()}
            style={{ paddingInline: 0, height: 'auto' }}
          >
            {t('doctor.patients.retry')}
          </Button>
        </Text>
      ) : null}

      {data && !isLoading ? (
        data.daily.length === 0 ? (
          <Text type="secondary">{t('doctor.patients.stats.empty')}</Text>
        ) : (
          <>
            <div className="doctor-stats-panel__summary">
              <span>
                {t('doctor.patients.stats.summary.adherence', {
                  percent: formatPersianNumber(data.summary.adherencePercentage),
                })}
              </span>
              <span className="doctor-stats-panel__summary-sep">·</span>
              <span>
                {t('doctor.patients.stats.summary.exerciseCompletion', {
                  percent: formatPersianNumber(data.summary.exerciseCompletionPercentage),
                })}
              </span>
              {data.summary.averageImprovementScore != null ? (
                <>
                  <span className="doctor-stats-panel__summary-sep">·</span>
                  <span>
                    {t('doctor.patients.stats.summary.avgImprovement', {
                      value: formatPersianNumber(data.summary.averageImprovementScore),
                    })}
                  </span>
                </>
              ) : null}
              {data.summary.averageHardnessScore != null ? (
                <>
                  <span className="doctor-stats-panel__summary-sep">·</span>
                  <span>
                    {t('doctor.patients.stats.summary.avgHardness', {
                      value: formatPersianNumber(data.summary.averageHardnessScore),
                    })}
                  </span>
                </>
              ) : null}
            </div>

            {variant === 'overview' && weeklyChartData.length > 0 ? (
              <div>
                <span className="doctor-stats-panel__chart-label">
                  {t('doctor.patients.stats.charts.weeklyAdherence')}
                </span>
                <div className="doctor-stats-panel__chart">
                  <ResponsiveContainer>
                    <BarChart data={weeklyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
                      <Tooltip />
                      <Bar
                        dataKey="adherence"
                        name={t('doctor.patients.stats.charts.adherenceSeries')}
                        fill="var(--phisio-primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}

            {variant === 'history' && completenessChartData.length > 0 ? (
              <div>
                <span className="doctor-stats-panel__chart-label">
                  {t('doctor.patients.stats.charts.dailyCompleteness')}
                </span>
                <div className="doctor-stats-panel__chart">
                  <ResponsiveContainer>
                    <BarChart data={completenessChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        stackId="session"
                        name={t('doctor.patients.stats.charts.completedSeries')}
                        fill="var(--phisio-success)"
                      />
                      <Bar
                        dataKey="remaining"
                        stackId="session"
                        name={t('doctor.patients.stats.charts.remainingSeries')}
                        fill="var(--phisio-border, #d9d9d9)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}

            {feedbackChartData.length > 0 ? (
              <div>
                <span className="doctor-stats-panel__chart-label">
                  {t('doctor.patients.stats.charts.feedbackTrend')}
                </span>
                <div className="doctor-stats-panel__chart">
                  <ResponsiveContainer>
                    <LineChart data={feedbackChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} width={28} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="improvement"
                        name={t('doctor.patients.stats.charts.improvementSeries')}
                        stroke="var(--phisio-primary)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="hardness"
                        name={t('doctor.patients.stats.charts.hardnessSeries')}
                        stroke="var(--phisio-warning)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <Text type="secondary">{t('doctor.patients.stats.noFeedback')}</Text>
            )}

            {variant === 'overview' && attentionExercises.length > 0 ? (
              <div>
                <span className="doctor-stats-panel__chart-label">
                  {t('doctor.patients.stats.needsAttention')}
                </span>
                <div className="patient-stack">
                  {attentionExercises.map((exercise) => (
                    <div key={exercise.exerciseId}>
                      <div className="doctor-stats-panel__attention-row">
                        <Text ellipsis style={{ maxWidth: '70%' }}>
                          {exercise.title}
                        </Text>
                        <Text type="secondary">
                          {formatPersianNumber(exercise.completedCount)}/
                          {formatPersianNumber(exercise.assignedCount)}
                        </Text>
                      </div>
                      <Progress
                        percent={exercise.completionPercentage}
                        size="small"
                        status={exercise.completionPercentage < 50 ? 'exception' : 'active'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )
      ) : null}
    </div>
  );
}
