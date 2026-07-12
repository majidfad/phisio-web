/** Matches backend CompletionDate (UTC) for daily completion lookups. */
export function getUtcDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
