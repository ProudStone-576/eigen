import { describe, expect, it } from "vitest";
import { getNode } from "@/lib/content";
import { PLANNED, STATISTICS_SYLLABUS } from "@/lib/content/syllabus/statistics";

const topics = STATISTICS_SYLLABUS.flatMap((a) => a.topics.map(([name, section]) => ({ area: a.title, name, section })));

describe("statistics syllabus map", () => {
  it("maps every topic to a real section or a planned one", () => {
    for (const t of topics) expect(getNode(t.section) || PLANNED[t.section], `${t.area}: ${t.name} -> ${t.section}`).toBeTruthy();
  });

  it("drops a section from PLANNED once it is written", () => {
    for (const id of Object.keys(PLANNED)) expect(getNode(id), `${id} exists; remove it from PLANNED`).toBeUndefined();
  });

  it("uses every planned section", () => {
    const used = new Set(topics.map((t) => t.section));
    for (const id of Object.keys(PLANNED)) expect(used.has(id), id).toBe(true);
  });

  it("lists each topic once per area", () => {
    for (const a of STATISTICS_SYLLABUS) {
      const names = a.topics.map(([n]) => n);
      expect(new Set(names).size, a.title).toBe(names.length);
    }
  });

  it("reports coverage", () => {
    const covered = topics.filter((t) => getNode(t.section));
    console.log(`Statistics syllabus: ${covered.length} of ${topics.length} topics covered by written sections; ${Object.keys(PLANNED).length} sections planned.`);
    expect(covered.length).toBeGreaterThan(0);
  });
});
