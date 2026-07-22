import { useQuery } from '@tanstack/react-query';

import { patientArticleService } from '../services/patientArticleService';

export const patientArticleQueryKeys = {
  all: ['patient-articles'] as const,
  list: () => [...patientArticleQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...patientArticleQueryKeys.all, 'detail', id] as const,
};

export function usePatientArticles() {
  return useQuery({
    queryKey: patientArticleQueryKeys.list(),
    queryFn: () => patientArticleService.getAll(),
  });
}

export function usePatientArticle(articleId: string | null) {
  return useQuery({
    queryKey: patientArticleQueryKeys.detail(articleId ?? ''),
    queryFn: () => patientArticleService.getById(articleId!),
    enabled: Boolean(articleId),
  });
}
