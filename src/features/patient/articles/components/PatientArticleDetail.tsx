import { Button, Card, Result, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState } from '@/components/ui';
import { usePatientArticle } from '@/features/patient/articles/hooks/usePatientArticles';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianDate } from '@/utils/persian-format';

const { Paragraph, Text, Title } = Typography;

interface PatientArticleDetailProps {
  articleId: string;
}

export function PatientArticleDetail({ articleId }: PatientArticleDetailProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = usePatientArticle(articleId);

  if (isLoading) {
    return <LoadingState tip={t('patient.articles.loading')} />;
  }

  if (isError || !data) {
    return (
      <Result
        status="error"
        title={getErrorMessage(error, t('patient.articles.errors.loadFailed'))}
        extra={
          <Space>
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.articles.retry')}
            </Button>
            <Link to={routes.patient.articles}>
              <Button>{t('patient.articles.backToList')}</Button>
            </Link>
          </Space>
        }
      />
    );
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Link to={routes.patient.articles}>
        <Button type="link" style={{ paddingInline: 0 }}>
          {t('patient.articles.backToList')}
        </Button>
      </Link>

      <Card>
        <Title level={3} style={{ marginTop: 0 }}>
          {data.title}
        </Title>
        <Text type="secondary">{formatPersianDate(data.createdAt)}</Text>
        <Paragraph type="secondary" style={{ marginTop: 12 }}>
          {data.summary}
        </Paragraph>
        <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{data.body}</Paragraph>
      </Card>
    </Space>
  );
}
