import { course, getNode } from "@/lib/content";
import { chapterNumber } from "@/lib/content/numbering";
import type { Status } from "@/lib/learning/rules";
import { scopeTitle, type ProgressRow } from "@/lib/learning/summary";

/**
 * Report arithmetic for teachers and admins. Pure: the database layer hands in
 * aggregated counts (never one row per student per section), so these work the
 * same for a class of 20 and an organisation of 20,000.
 */

export type NodeStatusCount = { nodeId: string; status: Status; n: number };

export type ChapterRow = { chapter: number; unitId: string; title: string; track: string; sections: number; learned: number; mastered: number };

/** Per chapter: the share of (student, section) pairs learned or mastered, and mastered alone. 0..1. */
export function chapterMastery(counts: NodeStatusCount[], students: number): ChapterRow[] {
  const by = new Map<string, { done: number; solid: number }>();
  for (const c of counts) {
    const t = by.get(c.nodeId) ?? { done: 0, solid: 0 };
    if (c.status === "LANDED" || c.status === "SOLID") t.done += c.n;
    if (c.status === "SOLID") t.solid += c.n;
    by.set(c.nodeId, t);
  }
  return course.units.map((u) => {
    const cells = Math.max(1, students * u.nodes.length);
    const sum = (k: "done" | "solid") => u.nodes.reduce((s, n) => s + (by.get(n.id)?.[k] ?? 0), 0);
    return {
      chapter: chapterNumber(u),
      unitId: u.id,
      title: u.title,
      track: u.track,
      sections: u.nodes.length,
      learned: students ? sum("done") / cells : 0,
      mastered: students ? sum("solid") / cells : 0,
    };
  });
}

export type AccuracyRow = { nodeId: string; correct: number; total: number };

/** Sections ranked hardest first by share of answers correct; ignores sections with too few answers to judge. */
export function hardestSections(rows: AccuracyRow[], minAnswers = 20, limit = 10) {
  return rows
    .filter((r) => r.total >= minAnswers && getNode(r.nodeId))
    .map((r) => ({ ...r, title: getNode(r.nodeId)!.title, accuracy: r.correct / r.total }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, limit);
}

export type MisconceptionCount = { nodeId: string; misconceptionId: string; n: number };

export function misconceptionTable(rows: MisconceptionCount[], limit = 10) {
  return rows
    .flatMap((r) => {
      const node = getNode(r.nodeId);
      const text = node?.misconceptions[r.misconceptionId];
      return node && text ? [{ nodeId: node.id, title: node.title, text, students: r.n }] : [];
    })
    .sort((a, b) => b.students - a.students || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export type ExamAggregate = { scope: string; attempts: number; takers: number; mean: number; best: number };

export const examTable = (rows: ExamAggregate[]) =>
  rows
    .map((r) => ({ ...r, title: scopeTitle(r.scope), order: r.scope === "mock" ? 999 : course.units.findIndex((u) => u.id === r.scope) }))
    .sort((a, b) => a.order - b.order);

// ---------------------------------------------------------------- gradebook

export type GradebookStudent = {
  name: string;
  email: string;
  classes: string[];
  lastActiveOn: string | null;
  streakDays: number;
  progress: ProgressRow[];
  exams: { scope: string; score: number; total: number }[];
};

export function gradebookHeader(): string[] {
  return ["Name", "Email", "Classes", "Last active", "Streak (days)", "Sections mastered", "Sections learned", ...course.units.map((u) => `Ch ${chapterNumber(u)} ${u.title}`), "Misconceptions held", "Tests taken", "Mean test %"];
}

export function gradebookRow(s: GradebookStudent): string[] {
  const by = new Map(s.progress.map((p) => [p.nodeId, p.status]));
  const done = (st?: Status) => st === "LANDED" || st === "SOLID";
  const all = course.units.flatMap((u) => u.nodes);
  const mean = s.exams.length ? Math.round((100 * s.exams.reduce((t, e) => t + e.score / Math.max(1, e.total), 0)) / s.exams.length) : null;
  return [
    s.name,
    s.email,
    s.classes.join("; "),
    s.lastActiveOn ?? "",
    String(s.streakDays),
    String(all.filter((n) => by.get(n.id) === "SOLID").length),
    String(all.filter((n) => done(by.get(n.id))).length),
    ...course.units.map((u) => `${u.nodes.filter((n) => done(by.get(n.id))).length}/${u.nodes.length}`),
    String(s.progress.filter((p) => p.status === "MISCONCEPTION").length),
    String(s.exams.length),
    mean === null ? "" : String(mean),
  ];
}

/**
 * One CSV line. Quotes fields with commas, quotes or newlines, and defuses
 * spreadsheet formulas: a cell starting with = + - @ (or tab/CR) gets a leading
 * apostrophe, so a student named "=HYPERLINK(...)" can't run in Excel.
 */
export function csvLine(cells: string[]): string {
  return (
    cells
      .map((raw) => {
        const c = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
        return /[",\n\r]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c;
      })
      .join(",") + "\r\n"
  );
}
