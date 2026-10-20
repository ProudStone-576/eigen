import { course } from "./index";
import type { Unit } from "./types";

/**
 * Book structure: tracks are Parts (I, II, …), units are Chapters numbered
 * through the whole book, concepts are sections numbered chapter.section.
 */

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const parts: { roman: string; track: string; units: Unit[] }[] = [...new Set(course.units.map((u) => u.track))].map((track, i) => ({
  roman: ROMAN[i] ?? String(i + 1),
  track,
  units: course.units.filter((u) => u.track === track),
}));

const where = new Map<string, { chapter: number; section: number; unit: Unit }>();
course.units.forEach((u, ci) => u.nodes.forEach((n, si) => where.set(n.id, { chapter: ci + 1, section: si + 1, unit: u })));

export const chapterNumber = (unit: Unit) => course.units.indexOf(unit) + 1;
export const partOf = (unit: Unit) => parts.find((p) => p.units.includes(unit))!;

/** "1.2" for the second section of chapter 1. */
export function sectionNumber(nodeId: string): string {
  const w = where.get(nodeId);
  return w ? `${w.chapter}.${w.section}` : "";
}

export function locate(nodeId: string) {
  const w = where.get(nodeId);
  if (!w) return null;
  const part = partOf(w.unit);
  return { ...w, number: `${w.chapter}.${w.section}`, part };
}
