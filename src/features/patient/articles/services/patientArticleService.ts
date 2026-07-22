import { httpClient } from '@/api/http-client';

import type { ArticleDto } from '@/features/admin/articles/types/article';

const PATIENT_ARTICLES_BASE = '/patient/articles';

export const patientArticleService = {
  async getAll(): Promise<ArticleDto[]> {
    const { data } = await httpClient.get<ArticleDto[]>(PATIENT_ARTICLES_BASE);
    return data;
  },

  async getById(articleId: string): Promise<ArticleDto> {
    const { data } = await httpClient.get<ArticleDto>(`${PATIENT_ARTICLES_BASE}/${articleId}`);
    return data;
  },
};
