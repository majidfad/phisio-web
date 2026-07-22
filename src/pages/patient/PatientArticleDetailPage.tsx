import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/ui';
import { PatientArticleDetail } from '@/features/patient/articles/components/PatientArticleDetail';

export function PatientArticleDetailPage() {
  const { t } = useTranslation();
  const { articleId } = useParams<{ articleId: string }>();

  return (
    <PageContainer>
      <PageHeader
        title={t('patient.articles.detailTitle')}
        description={t('patient.articles.detailDescription')}
      />
      {articleId ? <PatientArticleDetail articleId={articleId} /> : null}
    </PageContainer>
  );
}
