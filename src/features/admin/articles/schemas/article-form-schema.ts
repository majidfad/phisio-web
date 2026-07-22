import { z } from 'zod';

export function createArticleFormSchema(t: (key: string) => string) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t('admin.articles.validation.titleRequired'))
      .max(200, t('admin.articles.validation.titleMax')),
    summary: z
      .string()
      .trim()
      .min(1, t('admin.articles.validation.summaryRequired'))
      .max(500, t('admin.articles.validation.summaryMax')),
    body: z
      .string()
      .trim()
      .min(1, t('admin.articles.validation.bodyRequired'))
      .max(20000, t('admin.articles.validation.bodyMax')),
  });
}

export type ArticleFormSchemaValues = z.infer<ReturnType<typeof createArticleFormSchema>>;
