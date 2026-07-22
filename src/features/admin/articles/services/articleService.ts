import { httpClient } from '@/api/http-client';

import type { ArticleDto, CreateArticleRequest, UpdateArticleRequest } from '../types/article';

const ARTICLES_BASE = '/admin/articles';

export const articleService = {
  async getAll(isEnabled = true): Promise<ArticleDto[]> {
    const { data } = await httpClient.get<ArticleDto[]>(ARTICLES_BASE, {
      params: { isEnabled },
    });
    return data;
  },

  async getById(id: string): Promise<ArticleDto> {
    const { data } = await httpClient.get<ArticleDto>(`${ARTICLES_BASE}/${id}`);
    return data;
  },

  async create(request: CreateArticleRequest): Promise<ArticleDto> {
    const { data } = await httpClient.post<ArticleDto>(ARTICLES_BASE, request);
    return data;
  },

  async update(id: string, request: UpdateArticleRequest): Promise<ArticleDto> {
    const { data } = await httpClient.put<ArticleDto>(`${ARTICLES_BASE}/${id}`, request);
    return data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${ARTICLES_BASE}/${id}`);
  },

  async activate(id: string): Promise<void> {
    await httpClient.patch(`${ARTICLES_BASE}/${id}/activate`);
  },
};
