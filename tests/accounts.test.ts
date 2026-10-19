import { describe, expect, it } from "vitest";
import { afterFailedLogin, isLocked, LOCK_MINUTES, MAX_FAILED_LOGINS, minutesLeft, temporaryPassword } from "@/lib/auth/lockout";
import { assignmentProgress, classMisconceptions, liveMisconceptions, scopeTitle, statusCounts, trackProgress, type ProgressRow } from "@/lib/learning/summary";
import { searchConcepts, type SearchEntry } from "@/components/nav/Search";
import { allNodes, course } from "@/lib/content";

describe("login lockout", () => {
  const now = new Date("2026-10-19T10:00:00Z");
  it("locks after 5 wrong passwords in a row, for 15 minutes", () => {
    let state = { failedLogins: 0, lockedUntil: null as Date | null };
    for (let i = 1; i < MAX_FAILED_LOGINS; i++) {
      state = afterFailedLogin(state.failedLogins, now);
      expect(state.lockedUntil).toBeNull();
    }
    state = afterFailedLogin(state.failedLogins, now);
    expect(state.lockedUntil!.getTime() - now.getTime()).toBe(LOCK_MINUTES * 60_000);
    expect(state.failedLogins).toBe(0);
    expect(isLocked(state.lockedUntil, now)).toBe(true);
    expect(isLocked(state.lockedUntil, new Date(now.getTime() + LOCK_MINUTES * 60_000 + 1))).toBe(false);
    expect(minutesLeft(state.lockedUntil!, now)).toBe(15);
  });
  it("temporary passwords are word-word-4 digits, 8+ characters, and vary", () => {
    const ps = Array.from({ length: 50 }, temporaryPassword);
    for (const p of ps) {
      expect(p).toMatch(/^[a-z]+-[a-z]+-\d{4}$/);
      expect(p.length).toBeGreaterThanOrEqual(8);
    }
    expect(new Set(ps).size).toBeGreaterThan(40);
  });
});

describe("progress summaries", () => {
  const rows: ProgressRow[] = [
    { nodeId: "vector", status: "SOLID", misconceptionId: null },
    { nodeId: "vector-add", status: "LANDED", misconceptionId: null },
    { nodeId: "scalar", status: "MISCONCEPTION", misconceptionId: Object.keys(allNodes.find((n) => n.id === "scalar")!.misconceptions)[0] },
  ];
  it("counts statuses across all concepts", () => {
    const c = statusCounts(rows);
    expect([c.solid, c.landed, c.misconception, c.total]).toEqual([1, 1, 1, allNodes.length]);
    expect(c.unknown).toBe(allNodes.length - 3);
  });
  it("groups landed/solid by track", () => {
    const la = trackProgress(rows).find((t) => t.track === "Linear algebra")!;
    expect([la.done, la.solid]).toEqual([2, 1]);
    expect(trackProgress(rows).reduce((s, t) => s + t.total, 0)).toBe(allNodes.length);
  });
  it("names live misconceptions in plain words and tallies them across the class", () => {
    const m = liveMisconceptions(rows);
    expect(m).toHaveLength(1);
    expect(m[0].text.length).toBeGreaterThan(10);
    const tally = classMisconceptions([rows, rows, [rows[0]]]);
    expect(tally[0].students).toBe(2);
  });
  it("names test scopes", () => {
    expect(scopeTitle("mock")).toBe("Mock exam");
    expect(scopeTitle(course.units[0].id)).toBe(`Unit test: ${course.units[0].title}`);
  });
});

describe("assignment progress", () => {
  const set = new Date("2026-10-10T00:00:00Z");
  const a = { nodeIds: ["vector", "vector-add", "scalar"], unitId: "la-1", createdAt: set, dueAt: new Date("2026-10-17T23:59:00Z") };
  const rows: ProgressRow[] = [
    { nodeId: "vector", status: "SOLID", misconceptionId: null },
    { nodeId: "vector-add", status: "EDGE", misconceptionId: null },
  ];
  it("counts landed/solid concepts and points to the next unfinished one", () => {
    const p = assignmentProgress(a, rows, [], new Date("2026-10-12T00:00:00Z"));
    expect([p.conceptsDone, p.concepts, p.next, p.complete, p.overdue]).toEqual([1, 3, "vector-add", false, false]);
    expect(p.fraction).toBeCloseTo(1 / 4);
  });
  it("only counts a test taken after the assignment was set, and flags overdue work", () => {
    const old = { scope: "la-1", createdAt: new Date("2026-10-01T00:00:00Z"), score: 9, total: 10 };
    const fresh = { scope: "la-1", createdAt: new Date("2026-10-11T00:00:00Z"), score: 7, total: 10 };
    expect(assignmentProgress(a, rows, [old], new Date("2026-10-18T00:00:00Z")).exam).toBeNull();
    const p = assignmentProgress(a, rows, [old, fresh], new Date("2026-10-18T00:00:00Z"));
    expect(p.exam?.score).toBe(7);
    expect(p.overdue).toBe(true);
  });
  it("is complete when every concept is landed and the test is taken", () => {
    const all: ProgressRow[] = a.nodeIds.map((nodeId) => ({ nodeId, status: "LANDED", misconceptionId: null }));
    const p = assignmentProgress(a, all, [{ scope: "la-1", createdAt: new Date("2026-10-12T00:00:00Z"), score: 5, total: 10 }]);
    expect([p.complete, p.fraction, p.next]).toEqual([true, 1, null]);
  });
});

describe("concept search", () => {
  const entries: SearchEntry[] = course.units.flatMap((u) => u.nodes.map((n) => ({ id: n.id, title: n.title, where: `${u.track} · ${u.title}`, terms: n.glossary.map((g) => g.term) })));
  it("finds by title first", () => {
    expect(searchConcepts(entries, "eigen")[0].title.toLowerCase()).toMatch(/^eigen/);
    expect(searchConcepts(entries, "bayes")[0].id).toBe("bayes");
  });
  it("finds by glossary term", () => {
    expect(searchConcepts(entries, "IQR").some((e) => e.id === "quartiles-iqr")).toBe(true);
  });
  it("returns nothing for nonsense", () => {
    expect(searchConcepts(entries, "zzqx")).toEqual([]);
  });
});
