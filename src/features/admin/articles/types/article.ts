export interface ArticleDto {
  articleId: string;
  title: string;
  summary: string;
  body: string;
  createdAt: string;
  isEnabled: boolean;
}

export interface CreateArticleRequest {
  title: string;
  summary: string;
  body: string;
}

export type UpdateArticleRequest = CreateArticleRequest;
