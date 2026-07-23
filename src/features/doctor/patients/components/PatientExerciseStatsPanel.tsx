import { LoadingState } from '@/components/ui';
import { Progress, Segmented, Space, Typography } from 'antd';
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

const { Text, Title } = Typography;

export type PatientExerciseStatsPanelVariant = 'overview' | 'history';

interface PatientExerciseStatsPanelProps {
  patientId: string;
  variant: PatientExerciseStatsPanelVariant;
}

export function PatientExerciseStatsPanel({ patientId, variant }: PatientExerciseStatsPanelProps) {
  const { t } = useTranslation();
  const [rangeDays, setRangeDays] = useState<ExerciseStatsRangeDays>(30);
  const range = useMemo(() => statsRangeFromDays(rangeDays), [rangeDays]);
  const { data, isLoading, isError, refetch } = usePatientExerciseStats(patientId, range);

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
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Title level={5} style={{ margin: 0 }}>
          {t('doctor.patients.stats.title')}
        </Title>
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
          <a
            href="#retry-stats"
            onClick={(event) => {
              event.preventDefault();
              void refetch();
            }}
          >
            {t('doctor.patients.retry')}
          </a>
        </Text>
      ) : null}

      {data && !isLoading ? (
        data.daily.length === 0 ? (
          <Text type="secondary">{t('doctor.patients.stats.empty')}</Text>
        ) : (
          <>
            <Space wrap size={[8, 8]}>
              <Text>
                {t('doctor.patients.stats.summary.adherence', {
                  percent: formatPersianNumber(data.summary.adherencePercentage),
                })}
              </Text>
              <Text type="secondary">·</Text>
              <Text>
                {t('doctor.patients.stats.summary.exerciseCompletion', {
                  percent: formatPersianNumber(data.summary.exerciseCompletionPercentage),
                })}
              </Text>
              {data.summary.averageImprovementScore != null ? (
                <>
                  <Text type="secondary">·</Text>
                  <Text>
                    {t('doctor.patients.stats.summary.avgImprovement', {
                      value: formatPersianNumber(data.summary.averageImprovementScore),
                    })}
                  </Text>
                </>
              ) : null}
              {data.summary.averageHardnessScore != null ? (
                <>
                  <Text type="secondary">·</Text>
                  <Text>
                    {t('doctor.patients.stats.summary.avgHardness', {
                      value: formatPersianNumber(data.summary.averageHardnessScore),
                    })}
                  </Text>
                </>
              ) : null}
            </Space>

            {variant === 'overview' && weeklyChartData.length > 0 ? (
              <div>
                <Text type="secondary">{t('doctor.patients.stats.charts.weeklyAdherence')}</Text>
                <div style={{ width: '100%', height: 200, marginTop: 8 }}>
                  <ResponsiveContainer>
                    <BarChart data={weeklyChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
                      <Tooltip />
                      <Bar
                        dataKey="adherence"
                        name={t('doctor.patients.stats.charts.adherenceSeries')}
                        fill="var(--phisio-primary, #1677ff)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}

            {variant === 'history' && completenessChartData.length > 0 ? (
              <div>
                <Text type="secondary">{t('doctor.patients.stats.charts.dailyCompleteness')}</Text>
                <div style={{ width: '100%', height: 200, marginTop: 8 }}>
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
                        fill="var(--phisio-success, #52c41a)"
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
                <Text type="secondary">{t('doctor.patients.stats.charts.feedbackTrend')}</Text>
                <div style={{ width: '100%', height: 200, marginTop: 8 }}>
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
                        stroke="var(--phisio-primary, #1677ff)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="hardness"
                        name={t('doctor.patients.stats.charts.hardnessSeries')}
                        stroke="var(--phisio-warning, #fa8c16)"
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
                <Text type="secondary">{t('doctor.patients.stats.needsAttention')}</Text>
                <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
                  {attentionExercises.map((exercise) => (
                    <div key={exercise.exerciseId}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
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
                </Space>
              </div>
            ) : null}
          </>
        )
      ) : null}
    </Space>
  );
}
