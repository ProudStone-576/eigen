/**
 * The learning system's rules (Desktop/learning/.claude/skills/teach) as pure
 * functions. Pages and actions call these; nothing else decides status.
 *
 * Status ladder: UNKNOWN -> EDGE -> LANDED -> SOLID.
 * - A passed check makes a node LANDED, never SOLID.
 * - Only unaided production makes it SOLID, and starts spaced review.
 * - Picking a diagnostic wrong answer marks a MISCONCEPTION, which must be
 *   dislodged (predict -> conflict -> resolve), not topped up.
 * - A failed review means it was not solid: back to EDGE, interval resets.
 */

export type Status = "UNKNOWN" | "EDGE" | "LANDED" | "SOLID" | "MISCONCEPTION";

export type Progress = {
  status: Status;
  misconceptionId: string | null;
  intervalDays: number;
  reviewStreak: number;
  dueAt: Date | null;
};

export type LearningEvent =
  | { type: "opened" }
  | { type: "check"; correct: boolean; misconception: string | null }
  | { type: "resolved"; misconception: string; correct: boolean }
  | { type: "produce"; correct: boolean }
  | { type: "review"; correct: boolean }
  | { type: "testout"; correct: boolean };

export const FRESH: Progress = { status: "UNKNOWN", misconceptionId: null, intervalDays: 0, reviewStreak: 0, dueAt: null };

export const MAX_INTERVAL_DAYS = 90;
const DAY_MS = 86_400_000;

/** 1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 64 -> 90 (cap). */
export function nextInterval(current: number): number {
  return Math.min(Math.max(1, current * 2), MAX_INTERVAL_DAYS);
}

function due(now: Date, days: number): Date {
  return new Date(now.getTime() + days * DAY_MS);
}

function becomeSolid(p: Progress, now: Date): Progress {
  return { ...p, status: "SOLID", misconceptionId: null, intervalDays: 1, reviewStreak: 0, dueAt: due(now, 1) };
}

export function apply(p: Progress, e: LearningEvent, now: Date): Progress {
  switch (e.type) {
    case "opened":
      return p.status === "UNKNOWN" ? { ...p, status: "EDGE" } : p;

    case "check":
      if (p.status === "SOLID") return p; // re-reading a solid lesson can't demote it; review does that
      if (e.correct) return p.status === "MISCONCEPTION" ? p : { ...p, status: "LANDED" };
      if (e.misconception) return { ...p, status: "MISCONCEPTION", misconceptionId: e.misconception };
      return { ...p, status: p.status === "LANDED" ? "LANDED" : "EDGE" };

    case "resolved":
      // Dislodged only when the student resolves the specific misconception held.
      if (p.status === "MISCONCEPTION" && p.misconceptionId === e.misconception && e.correct) {
        return { ...p, status: "LANDED", misconceptionId: null };
      }
      return p;

    case "produce":
      if (p.status === "MISCONCEPTION") return p; // never build on a live misconception
      return e.correct ? (p.status === "SOLID" ? p : becomeSolid(p, now)) : p;

    case "review":
      if (e.correct) {
        const intervalDays = nextInterval(p.intervalDays);
        return { ...p, status: "SOLID", intervalDays, reviewStreak: p.reviewStreak + 1, dueAt: due(now, intervalDays) };
      }
      return { ...p, status: "EDGE", intervalDays: 1, reviewStreak: 0, dueAt: due(now, 1) };

    case "testout":
      // Producing cold, before the lesson, is production. Missing it just means: take the lesson.
      return e.correct && p.status !== "MISCONCEPTION" ? becomeSolid(p, now) : p;
  }
}

/** A node opens once every dependency is LANDED or SOLID. */
export function isUnlocked(deps: string[], statusOf: (id: string) => Status): boolean {
  return deps.every((d) => {
    const s = statusOf(d);
    return s === "LANDED" || s === "SOLID";
  });
}

export function isDue(p: Progress, now: Date): boolean {
  return p.status === "SOLID" && p.dueAt !== null && p.dueAt.getTime() <= now.getTime();
}

// ---------- XP and streak ----------

export const XP = { check: 10, resolved: 15, produce: 25, review: 5, testout: 40 } as const;

/** Calendar day in the student's timezone, as YYYY-MM-DD. */
export function localDay(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function nextStreak(lastActiveOn: string | null, today: string, streakDays: number): number {
  if (lastActiveOn === today) return streakDays;
  if (lastActiveOn) {
    const gap = (Date.parse(today) - Date.parse(lastActiveOn)) / DAY_MS;
    if (gap === 1) return streakDays + 1;
  }
  return 1;
}
