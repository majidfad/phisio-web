export function formatImprovementScoreDisplay(score: number | null | undefined): string {
  if (score == null) {
    return '—';
  }

  return '⭐'.repeat(score);
}

export function formatPatientCommentDisplay(comment: string | null | undefined): string {
  if (!comment?.trim()) {
    return '—';
  }

  return comment.trim();
}

export function hasPatientFeedback(
  improvementScore: number | null | undefined,
  comment: string | null | undefined,
): boolean {
  return improvementScore != null || Boolean(comment?.trim());
}
