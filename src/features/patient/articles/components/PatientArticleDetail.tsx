import { Button, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LoadingState, AppResult } from '@/components/ui';
import { usePatientArticle } from '@/features/patient/articles/hooks/usePatientArticles';
import { routes } from '@/routes/routes';
import { getErrorMessage } from '@/utils/get-error-message';
import { formatPersianDate } from '@/utils/persian-format';

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
      <AppResult
        status="error"
        title={getErrorMessage(error, t('patient.articles.errors.loadFailed'))}
        extra={
          <div className="patient-filter-bar">
            <Button type="primary" size="large" onClick={() => void refetch()}>
              {t('patient.articles.retry')}
            </Button>
            <Link to={routes.patient.articles}>
              <Button size="large">{t('patient.articles.backToList')}</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="patient-stack patient-stack--loose">
      <div className="patient-media-card__footer">
        <Link to={routes.patient.articles}>
          <Button type="link">{t('patient.articles.backToList')}</Button>
        </Link>
      </div>

      <Card className="patient-media-card">
        <h2 className="patient-media-card__title patient-media-card__title--lg">{data.title}</h2>
        <span className="patient-media-card__meta">{formatPersianDate(data.createdAt)}</span>
        <p className="patient-media-card__body">{data.summary}</p>
        <p className="patient-media-card__body patient-media-card__body--prose">{data.body}</p>
      </Card>
    </div>
  );
}
