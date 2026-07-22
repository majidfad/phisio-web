import { Button, Card, Input, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppEmpty, AppResult } from '@/components/ui';
import { usePatientArticles } from '@/features/patient/articles/hooks/usePatientArticles';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianDate } from '@/utils/persian-format';

const { Paragraph, Text, Title } = Typography;

export function PatientArticlesList() {
  const { t } = useTranslation();
  const { data: articles = [], isLoading, isError, error, refetch } = usePatientArticles();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return articles;
    }

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query),
    );
  }, [articles, searchQuery]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Input.Search
        allowClear
        placeholder={t('patient.articles.searchPlaceholder')}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        style={{ maxWidth: 480 }}
      />

      {isLoading ? <LoadingState tip={t('patient.articles.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('patient.articles.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('patient.articles.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && filteredArticles.length === 0 ? (
        <AppEmpty description={t('patient.articles.empty')} />
      ) : null}

      {!isLoading && !isError
        ? filteredArticles.map((article) => (
            <Card key={article.articleId} size="small">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Title level={5} style={{ margin: 0 }}>
                  {article.title}
                </Title>
                <Text type="secondary">{formatPersianDate(article.createdAt)}</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {article.summary}
                </Paragraph>
                <Link to={`${routes.patient.articles}/${article.articleId}`}>
                  <Button type="link" style={{ paddingInline: 0 }}>
                    {t('patient.articles.readMore')}
                  </Button>
                </Link>
              </Space>
            </Card>
          ))
        : null}
    </Space>
  );
}
