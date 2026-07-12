import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  tip?: string;
}

export function LoadingState({ tip }: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
        gap: 12,
      }}
    >
      <Spin size="large" />
      <span style={{ color: 'var(--phisio-text-secondary)', fontSize: 14 }}>
        {tip ?? t('common.loading')}
      </span>
    </div>
  );
}
