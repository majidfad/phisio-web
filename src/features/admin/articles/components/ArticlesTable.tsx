import { Button, Empty, Modal, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

import { AppTable, TableIconActions } from '@/components/ui';
import type { ArticleDto } from '@/features/admin/articles/types/article';
import { formatPersianDate } from '@/utils/persian-format';

interface ArticlesTableProps {
  articles: ArticleDto[];
  showInactiveView: boolean;
  isActivating?: boolean;
  activatingArticleId?: string | null;
  onEdit: (article: ArticleDto) => void;
  onDelete: (article: ArticleDto) => void;
  onActivate: (article: ArticleDto) => void;
}

export function ArticlesTable({
  articles,
  showInactiveView,
  isActivating = false,
  activatingArticleId = null,
  onEdit,
  onDelete,
  onActivate,
}: ArticlesTableProps) {
  const { t } = useTranslation();

  const columns: ColumnsType<ArticleDto> = [
    {
      title: t('admin.articles.columns.title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('admin.articles.columns.summary'),
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: t('admin.articles.columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (value: string) => formatPersianDate(value),
    },
    ...(showInactiveView
      ? [
          {
            title: t('admin.articles.columns.status'),
            key: 'status',
            width: 120,
            render: () => <Tag color="warning">{t('admin.common.status.inactive')}</Tag>,
          } as ColumnsType<ArticleDto>[number],
        ]
      : []),
    {
      title: t('admin.articles.columns.actions'),
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, article) =>
        showInactiveView ? (
          <Button
            type="link"
            loading={isActivating && activatingArticleId === article.articleId}
            onClick={() => onActivate(article)}
          >
            {t('admin.common.actions.activate')}
          </Button>
        ) : (
          <TableIconActions
            editLabel={t('admin.articles.actions.edit')}
            deleteLabel={t('admin.articles.actions.delete')}
            onEdit={() => onEdit(article)}
            onDelete={() => onDelete(article)}
          />
        ),
    },
  ];

  return (
    <AppTable
      rowKey="articleId"
      columns={columns}
      dataSource={articles}
      locale={{
        emptyText: (
          <Empty
            description={
              showInactiveView ? t('admin.articles.emptyInactive') : t('admin.articles.empty')
            }
          />
        ),
      }}
    />
  );
}

interface DeleteArticleDialogProps {
  article: ArticleDto | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteArticleDialog({
  article,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteArticleDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('admin.articles.delete.title')}
      open={Boolean(article)}
      onCancel={onCancel}
      onOk={onConfirm}
      okText={t('admin.articles.delete.confirm')}
      cancelText={t('admin.articles.delete.cancel')}
      confirmLoading={isDeleting}
      okButtonProps={{ danger: true }}
      centered
      destroyOnHidden
    >
      {t('admin.articles.delete.message', { title: article?.title ?? '' })}
    </Modal>
  );
}
