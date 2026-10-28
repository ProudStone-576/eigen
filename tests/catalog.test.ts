import { describe, expect, it } from "vitest";
import { course } from "@/lib/content";
import { chapterHref, chapterNeighbours, courseHref, gridCells, partBySlug, partSlug, tally, unitInPart } from "@/lib/content/catalog";
import { parts } from "@/lib/content/numbering";

describe("course catalogue", () => {
  it("gives every part a unique slug that finds it again", () => {
    const slugs = parts.map((p) => partSlug(p));
    expect(new Set(slugs).size).toBe(parts.length);
    for (const p of parts) {
      expect(partSlug(p)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(partBySlug(partSlug(p))).toBe(p);
    }
    expect(partBySlug("no-such-part")).toBeNull();
  });

  it("links courses and chapters by slug and unit id", () => {
    const p = parts[0];
    const u = p.units[0];
    expect(courseHref(p)).toBe(`/courses/${partSlug(p)}`);
    expect(chapterHref(u)).toBe(`/courses/${partSlug(p)}/${u.id}`);
    expect(unitInPart(p, u.id)).toBe(u);
    expect(unitInPart(p, parts[1]?.units[0]?.id ?? "x")).toBeNull();
  });

  it("lays out a chapter's grid as its sections, then the chapter test", () => {
    const u = course.units[0];
    const cells = gridCells(u);
    expect(cells).toHaveLength(u.nodes.length + 1);
    expect(cells.slice(0, -1).map((c) => c.kind === "section" && c.node.id)).toEqual(u.nodes.map((n) => n.id));
    expect(cells.at(-1)).toEqual({ kind: "test", unitId: u.id });
  });

  it("counts sections by status, treating missing ones as not started", () => {
    const u = course.units[0];
    const [a, b] = u.nodes;
    const t = tally(u.nodes, (id) => (id === a.id ? "SOLID" : id === b?.id ? "LANDED" : "UNKNOWN"));
    expect(t.SOLID).toBe(1);
    expect(t.LANDED).toBe(b ? 1 : 0);
    expect(t.SOLID + t.LANDED + t.EDGE + t.MISCONCEPTION + t.UNKNOWN).toBe(u.nodes.length);
  });

  it("walks chapters in book order across parts", () => {
    const first = chapterNeighbours(course.units[0]);
    expect(first.prev).toBeNull();
    expect(first.next).toBe(course.units[1]);
    const last = chapterNeighbours(course.units.at(-1)!);
    expect(last.next).toBeNull();
    expect(last.prev).toBe(course.units.at(-2));
  });
});
