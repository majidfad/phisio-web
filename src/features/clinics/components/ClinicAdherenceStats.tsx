import { Button, Col, Row } from 'antd';
import { Activity, CalendarDays, CalendarRange } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AppResult, LoadingState, StatCard } from '@/components/ui';
import { useClinicAdherence } from '@/features/clinics/hooks/useClinics';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianNumber } from '@/utils/persian-format';

interface ClinicAdherenceStatsProps {
  clinicId: string | undefined;
  doctorId?: string;
  compact?: boolean;
}

export function ClinicAdherenceStats({
  clinicId,
  doctorId,
  compact = false,
}: ClinicAdherenceStatsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useClinicAdherence(clinicId, doctorId);

  if (isLoading) {
    return <LoadingState tip={t('clinics.adherence.loading')} />;
  }

  if (isError) {
    return (
      <AppResult
        status="error"
        title={getErrorMessage(error, t('clinics.adherence.errors.loadFailed'))}
        extra={
          <Button type="primary" onClick={() => void refetch()}>
            {t('clinics.retry')}
          </Button>
        }
      />
    );
  }

  if (!data) {
    return null;
  }

  const colSpan = compact ? { xs: 24, sm: 8 } : { xs: 24, sm: 12, lg: 8 };

  return (
    <Row gutter={[12, 12]}>
      <Col {...colSpan}>
        <StatCard
          label={t('clinics.adherence.today')}
          value={`${formatPersianNumber(data.today.adherencePercentage)}%`}
          icon={<CalendarDays size={20} />}
          accent="blue"
        />
      </Col>
      <Col {...colSpan}>
        <StatCard
          label={t('clinics.adherence.last7Days')}
          value={`${formatPersianNumber(data.last7Days.adherencePercentage)}%`}
          icon={<Activity size={20} />}
          accent="mint"
        />
      </Col>
      <Col {...colSpan}>
        <StatCard
          label={t('clinics.adherence.last30Days')}
          value={`${formatPersianNumber(data.last30Days.adherencePercentage)}%`}
          icon={<CalendarRange size={20} />}
          accent="peach"
        />
      </Col>
    </Row>
  );
}
