import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminListFilterToIsEnabled,
  type AdminListFilter,
} from '@/features/admin/types/admin-list-filter';

import { articleService } from '../services/articleService';
import type { CreateArticleRequest, UpdateArticleRequest } from '../types/article';

import { articleQueryKeys } from './article-query-keys';

export function useArticles(filter: AdminListFilter = 'active') {
  const isEnabled = adminListFilterToIsEnabled(filter);

  return useQuery({
    queryKey: articleQueryKeys.list(isEnabled),
    queryFn: () => articleService.getAll(isEnabled),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateArticleRequest) => articleService.create(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateArticleRequest }) =>
      articleService.update(id, request),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: articleQueryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
    },
  });
}

export function useActivateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articleService.activate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articleQueryKeys.lists() });
    },
  });
}
