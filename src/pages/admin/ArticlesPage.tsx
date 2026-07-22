import { Button, Result } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, PageHeaderButton } from '@/components/PageHeader';
import { LoadingState, PageContainer } from '@/components/ui';
import { AdminStatusTabs } from '@/features/admin/components/AdminStatusTabs';
import {
  ArticleFormModal,
} from '@/features/admin/articles/components/ArticleFormModal';
import {
  ArticlesTable,
  DeleteArticleDialog,
} from '@/features/admin/articles/components/ArticlesTable';
import {
  useActivateArticle,
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from '@/features/admin/articles/hooks/useArticles';
import type { ArticleFormSchemaValues } from '@/features/admin/articles/schemas/article-form-schema';
import type { ArticleDto } from '@/features/admin/articles/types/article';
import type { AdminListFilter } from '@/features/admin/types/admin-list-filter';
import { getErrorMessage } from '@/utils/get-error-message';

type FormMode = 'create' | 'edit';

export function ArticlesPage() {
  const { t } = useTranslation();
  const [listFilter, setListFilter] = useState<AdminListFilter>('active');
  const showInactiveView = listFilter === 'inactive';

  const { data: articles = [], isLoading, isError, error, refetch } = useArticles(listFilter);
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const activateArticle = useActivateArticle();

  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<ArticleDto | null>(null);
  const [activatingArticleId, setActivatingArticleId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateForm = () => {
    setSelectedArticle(null);
    setFormError(null);
    setFormMode('create');
  };

  const openEditForm = (article: ArticleDto) => {
    setSelectedArticle(article);
    setFormError(null);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedArticle(null);
    setFormError(null);
  };

  const handleFormSubmit = async (values: ArticleFormSchemaValues) => {
    setFormError(null);
    const payload = {
      title: values.title.trim(),
      summary: values.summary.trim(),
      body: values.body.trim(),
    };

    try {
      if (formMode === 'create') {
        await createArticle.mutateAsync(payload);
      } else if (formMode === 'edit' && selectedArticle) {
        await updateArticle.mutateAsync({ id: selectedArticle.articleId, request: payload });
      }
      closeForm();
    } catch (submitError) {
      setFormError(getErrorMessage(submitError, t('admin.articles.errors.saveFailed')));
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) {
      return;
    }

    try {
      await deleteArticle.mutateAsync(articleToDelete.articleId);
      setArticleToDelete(null);
    } catch {
      // Keep dialog open; errors surface via mutation if needed.
    }
  };

  const handleActivate = async (article: ArticleDto) => {
    setActivatingArticleId(article.articleId);
    try {
      await activateArticle.mutateAsync(article.articleId);
    } finally {
      setActivatingArticleId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('admin.articles.title')}
        description={t('admin.articles.description')}
        action={
          showInactiveView ? undefined : (
            <PageHeaderButton label={t('admin.articles.addButton')} onClick={openCreateForm} />
          )
        }
      />

      <AdminStatusTabs value={listFilter} onChange={setListFilter} />

      {isLoading ? <LoadingState tip={t('admin.articles.loading')} /> : null}

      {isError ? (
        <Result
          status="error"
          title={getErrorMessage(error, t('admin.articles.errors.loadFailed'))}
          extra={
            <Button type="primary" onClick={() => void refetch()}>
              {t('admin.articles.retry')}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError ? (
        <ArticlesTable
          articles={articles}
          showInactiveView={showInactiveView}
          isActivating={activateArticle.isPending}
          activatingArticleId={activatingArticleId}
          onEdit={openEditForm}
          onDelete={setArticleToDelete}
          onActivate={(article) => void handleActivate(article)}
        />
      ) : null}

      <ArticleFormModal
        isOpen={formMode !== null}
        mode={formMode ?? 'create'}
        article={selectedArticle}
        isSubmitting={createArticle.isPending || updateArticle.isPending}
        submitError={formError}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <DeleteArticleDialog
        article={articleToDelete}
        isDeleting={deleteArticle.isPending}
        onCancel={() => setArticleToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </PageContainer>
  );
}
