import { describe, expect, it } from "vitest";
import { apply, FRESH, isDue, isUnlocked, nextInterval, nextStreak, type LearningEvent, type Progress } from "@/lib/learning/rules";

const now = new Date("2026-10-19T12:00:00Z");
const run = (events: LearningEvent[], start: Progress = FRESH) => events.reduce((p, e) => apply(p, e, now), start);

describe("status ladder", () => {
  it("opening a lesson moves UNKNOWN to EDGE", () => {
    expect(run([{ type: "opened" }]).status).toBe("EDGE");
  });
  it("a passed check is LANDED, never SOLID", () => {
    expect(run([{ type: "opened" }, { type: "check", correct: true, misconception: null }]).status).toBe("LANDED");
  });
  it("only production makes SOLID, and schedules review in 1 day", () => {
    const p = run([{ type: "opened" }, { type: "check", correct: true, misconception: null }, { type: "produce", correct: true }]);
    expect(p.status).toBe("SOLID");
    expect(p.intervalDays).toBe(1);
    expect(p.dueAt!.getTime() - now.getTime()).toBe(86_400_000);
  });
});

describe("misconceptions", () => {
  const held = run([{ type: "opened" }, { type: "check", correct: false, misconception: "rows" }]);
  it("a diagnostic wrong answer marks MISCONCEPTION", () => {
    expect(held.status).toBe("MISCONCEPTION");
    expect(held.misconceptionId).toBe("rows");
  });
  it("cannot be topped up by a correct check or production", () => {
    expect(apply(held, { type: "check", correct: true, misconception: null }, now).status).toBe("MISCONCEPTION");
    expect(apply(held, { type: "produce", correct: true }, now).status).toBe("MISCONCEPTION");
  });
  it("is dislodged only by resolving that same misconception", () => {
    expect(apply(held, { type: "resolved", misconception: "other", correct: true }, now).status).toBe("MISCONCEPTION");
    expect(apply(held, { type: "resolved", misconception: "rows", correct: false }, now).status).toBe("MISCONCEPTION");
    expect(apply(held, { type: "resolved", misconception: "rows", correct: true }, now).status).toBe("LANDED");
  });
});

describe("spaced review", () => {
  it("doubles to a 90-day cap", () => {
    expect([0, 1, 2, 4, 8, 16, 32, 64, 90].map(nextInterval)).toEqual([1, 2, 4, 8, 16, 32, 64, 90, 90]);
  });
  it("a miss resets to 1 day and drops to EDGE", () => {
    const solid: Progress = { status: "SOLID", misconceptionId: null, intervalDays: 16, reviewStreak: 4, dueAt: now };
    const p = apply(solid, { type: "review", correct: false }, now);
    expect([p.status, p.intervalDays, p.reviewStreak]).toEqual(["EDGE", 1, 0]);
  });
  it("is due only when SOLID and past due", () => {
    expect(isDue({ ...FRESH, status: "SOLID", dueAt: now }, now)).toBe(true);
    expect(isDue({ ...FRESH, status: "EDGE", dueAt: now }, now)).toBe(false);
  });
});

describe("unlock and streak", () => {
  it("needs every dependency LANDED or SOLID", () => {
    const s: Record<string, Progress["status"]> = { a: "SOLID", b: "LANDED", c: "EDGE" };
    expect(isUnlocked(["a", "b"], (id) => s[id])).toBe(true);
    expect(isUnlocked(["a", "c"], (id) => s[id])).toBe(false);
  });
  it("counts consecutive days", () => {
    expect(nextStreak("2026-10-18", "2026-10-19", 3)).toBe(4);
    expect(nextStreak("2026-10-19", "2026-10-19", 3)).toBe(3);
    expect(nextStreak("2026-10-16", "2026-10-19", 3)).toBe(1);
    expect(nextStreak(null, "2026-10-19", 0)).toBe(1);
  });
});
