import { course } from "./index";
import { parts } from "./numbering";
import type { ConceptNode, Unit } from "./types";
import type { Status } from "@/lib/learning/rules";

/**
 * Public course pages: a Part is a course, a chapter is its unit. URLs are
 * /courses/<part-slug> and /courses/<part-slug>/<unit-id>.
 */

export type Part = (typeof parts)[number];

export const partSlug = (p: Part) =>
  p.track
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const partBySlug = (slug: string): Part | null => parts.find((p) => partSlug(p) === slug) ?? null;
export const partOfUnit = (u: Unit): Part => parts.find((p) => p.units.includes(u))!;
export const unitInPart = (p: Part, unitId: string): Unit | null => p.units.find((u) => u.id === unitId) ?? null;

export const courseHref = (p: Part) => `/courses/${partSlug(p)}`;
export const chapterHref = (u: Unit) => `${courseHref(partOfUnit(u))}/${u.id}`;

/** One square per section, then the chapter test. */
export type GridCell = { kind: "section"; node: ConceptNode } | { kind: "test"; unitId: string };
export const gridCells = (u: Unit): GridCell[] => [...u.nodes.map((node) => ({ kind: "section" as const, node })), { kind: "test", unitId: u.id }];

export function tally(nodes: ConceptNode[], status: (id: string) => Status): Record<Status, number> {
  const t: Record<Status, number> = { SOLID: 0, LANDED: 0, EDGE: 0, MISCONCEPTION: 0, UNKNOWN: 0 };
  for (const n of nodes) t[status(n.id)]++;
  return t;
}

/** Previous and next chapter in book order, crossing parts. */
export function chapterNeighbours(u: Unit): { prev: Unit | null; next: Unit | null } {
  const i = course.units.indexOf(u);
  return { prev: course.units[i - 1] ?? null, next: course.units[i + 1] ?? null };
}
