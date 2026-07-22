import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/ui';
import { PatientArticlesList } from '@/features/patient/articles/components/PatientArticlesList';

export function PatientArticlesPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <PageHeader
        title={t('patient.articles.title')}
        description={t('patient.articles.description')}
      />
      <PatientArticlesList />
    </PageContainer>
  );
}
