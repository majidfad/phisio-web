import { Button, Card, Input } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppEmpty, AppResult } from '@/components/ui';
import { usePatientArticles } from '@/features/patient/articles/hooks/usePatientArticles';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianDate } from '@/utils/persian-format';

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
    <div className="patient-stack patient-stack--loose" style={{ paddingBottom: 88 }}>
      <div className="patient-filter-bar">
        <Input.Search
          allowClear
          size="large"
          placeholder={t('patient.articles.searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? <LoadingState tip={t('patient.articles.loading')} /> : null}

      {isError ? (
        <AppResult
          status="error"
          title={getErrorMessage(error, t('patient.articles.errors.loadFailed'))}
          extra={
            <Button type="primary" size="large" onClick={() => void refetch()}>
              {t('patient.articles.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && filteredArticles.length === 0 ? (
        <AppEmpty description={t('patient.articles.empty')} />
      ) : null}

      {!isLoading && !isError ? (
        <div className="patient-stack">
          {filteredArticles.map((article) => (
            <Card key={article.articleId} className="patient-media-card" size="small">
              <bdi
                className="patient-media-card__title"
                style={{
                  display: 'block',
                  unicodeBidi: 'plaintext',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {article.title}
              </bdi>
              <span className="patient-media-card__meta">
                {formatPersianDate(article.createdAt)}
              </span>
              <p
                className="patient-media-card__body"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {article.summary}
              </p>
              <div className="patient-media-card__footer">
                <Link to={`${routes.patient.articles}/${article.articleId}`}>
                  <Button type="link">{t('patient.articles.readMore')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
