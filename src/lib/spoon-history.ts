import { getDateKey } from "@/constants/date";

export interface DayRecord {
  used: number;
  base: number;
}

const HISTORY_RETENTION_DAYS = 90;

// Removes entries older than 90 days (keeps AsyncStorage small)
export function pruneHistory(
  history: Record<string, DayRecord>,
): Record<string, DayRecord> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - HISTORY_RETENTION_DAYS);
  const cutoffKey = getDateKey(cutoff);
  return Object.fromEntries(
    Object.entries(history).filter(([dateKey]) => dateKey >= cutoffKey),
  );
}

// Counts consecutive days (including today, going back) where used > base.
// Returns 0 if today is not overspent.
export function getCrashStreak(history: Record<string, DayRecord>): number {
  let streak = 0;
  const date = new Date();
  for (;;) {
    const record = history[getDateKey(date)];
    if (!record || record.used <= record.base) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}
