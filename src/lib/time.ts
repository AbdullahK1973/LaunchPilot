export function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000);
}
