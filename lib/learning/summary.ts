import { allNodes, course, getNode } from "@/lib/content";
import type { Status } from "./rules";

/**
 * Plain summaries of a student's progress, for the account page, the
 * teacher's class overview and assignments. Pure: give it progress rows.
 */

export type ProgressRow = { nodeId: string; status: Status; misconceptionId: string | null };

/** Human name for a test scope: a unit id or "mock". */
export const scopeTitle = (scope: string) => (scope === "mock" ? "Mock exam" : `Unit test: ${course.units.find((u) => u.id === scope)?.title ?? scope}`);

const done = (s: Status | undefined) => s === "LANDED" || s === "SOLID";

export function statusCounts(rows: ProgressRow[]) {
  const by = new Map(rows.map((r) => [r.nodeId, r.status]));
  const count = (s: Status) => allNodes.filter((n) => (by.get(n.id) ?? "UNKNOWN") === s).length;
  return { total: allNodes.length, solid: count("SOLID"), landed: count("LANDED"), edge: count("EDGE"), misconception: count("MISCONCEPTION"), unknown: count("UNKNOWN") };
}

/** Per track: how many concepts are landed or solid. */
export function trackProgress(rows: ProgressRow[]) {
  const by = new Map(rows.map((r) => [r.nodeId, r.status]));
  const tracks = [...new Set(course.units.map((u) => u.track))];
  return tracks.map((track) => {
    const nodes = course.units.filter((u) => u.track === track).flatMap((u) => u.nodes);
    return { track, done: nodes.filter((n) => done(by.get(n.id))).length, solid: nodes.filter((n) => by.get(n.id) === "SOLID").length, total: nodes.length };
  });
}

/** Misconceptions a student holds right now, in plain words. */
export function liveMisconceptions(rows: ProgressRow[]) {
  return rows.flatMap((r) => {
    if (r.status !== "MISCONCEPTION" || !r.misconceptionId) return [];
    const node = getNode(r.nodeId);
    if (!node) return [];
    return [{ nodeId: node.id, title: node.title, id: r.misconceptionId, text: node.misconceptions[r.misconceptionId] ?? r.misconceptionId }];
  });
}

/** Across the class: which misconceptions the most students hold right now. */
export function classMisconceptions(byStudent: ProgressRow[][]) {
  const tally = new Map<string, { nodeId: string; title: string; text: string; students: number }>();
  for (const rows of byStudent)
    for (const m of liveMisconceptions(rows)) {
      const key = `${m.nodeId}:${m.id}`;
      const t = tally.get(key) ?? { nodeId: m.nodeId, title: m.title, text: m.text, students: 0 };
      t.students++;
      tally.set(key, t);
    }
  return [...tally.values()].sort((a, b) => b.students - a.students || a.title.localeCompare(b.title));
}

export type AssignmentLike = { nodeIds: string[]; unitId: string | null; createdAt: Date; dueAt: Date | null };
export type ExamLike = { scope: string; createdAt: Date; score: number; total: number };

/**
 * A student's progress on an assignment. A concept counts once it's LANDED or
 * SOLID; the unit test counts once taken after the assignment was set.
 */
export function assignmentProgress(a: AssignmentLike, rows: ProgressRow[], exams: ExamLike[], now = new Date()) {
  const by = new Map(rows.map((r) => [r.nodeId, r.status]));
  const nodeIds = a.nodeIds.filter((id) => getNode(id));
  const conceptsDone = nodeIds.filter((id) => done(by.get(id))).length;
  const exam = a.unitId ? (exams.filter((e) => e.scope === a.unitId && e.createdAt >= a.createdAt).sort((x, y) => y.score / y.total - x.score / x.total)[0] ?? null) : null;
  const steps = nodeIds.length + (a.unitId ? 1 : 0);
  const stepsDone = conceptsDone + (exam ? 1 : 0);
  return {
    conceptsDone,
    concepts: nodeIds.length,
    exam,
    complete: steps > 0 && stepsDone === steps,
    fraction: steps ? stepsDone / steps : 1,
    next: nodeIds.find((id) => !done(by.get(id))) ?? null,
    overdue: !!a.dueAt && a.dueAt < now && stepsDone < steps,
  };
}
