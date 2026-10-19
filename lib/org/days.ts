export type DayRow = { day: string; answers: number; learners: number };

/** Rows for the last `days` UTC days, oldest first, with days that had no activity filled in as zeros. */
export function fillDays(rows: DayRow[], days: number, today = new Date()): DayRow[] {
  const by = new Map(rows.map((r) => [r.day, r]));
  const out: DayRow[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i)).toISOString().slice(0, 10);
    out.push(by.get(d) ?? { day: d, answers: 0, learners: 0 });
  }
  return out;
}
