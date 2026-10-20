import { describe, expect, it } from "vitest";
import { getNode } from "@/lib/content";
import { MATH_PLANNED, MATHEMATICS_SYLLABUS } from "@/lib/content/syllabus/mathematics";
import { PLANNED, STATISTICS_SYLLABUS, type Area } from "@/lib/content/syllabus/statistics";

const maps: { name: string; areas: Area[]; planned: Record<string, unknown> }[] = [
  { name: "Statistics", areas: STATISTICS_SYLLABUS, planned: PLANNED },
  { name: "Mathematics", areas: MATHEMATICS_SYLLABUS, planned: MATH_PLANNED },
];

for (const { name, areas, planned } of maps) {
  const topics = areas.flatMap((a) => a.topics.map(([topic, section]) => ({ area: a.title, name: topic, section })));

  describe(`${name.toLowerCase()} syllabus map`, () => {
    it("maps every topic to a real section or a planned one", () => {
      for (const t of topics) expect(getNode(t.section) || planned[t.section], `${t.area}: ${t.name} -> ${t.section}`).toBeTruthy();
    });

    it("drops a section from the plan once it is written", () => {
      for (const id of Object.keys(planned)) expect(getNode(id), `${id} exists; remove it from the plan`).toBeUndefined();
    });

    it("uses every planned section", () => {
      const used = new Set(topics.map((t) => t.section));
      for (const id of Object.keys(planned)) expect(used.has(id), id).toBe(true);
    });

    it("lists each topic once per area", () => {
      for (const a of areas) {
        const names = a.topics.map(([n]) => n);
        expect(new Set(names).size, a.title).toBe(names.length);
      }
    });

    it("reports coverage", () => {
      const covered = topics.filter((t) => getNode(t.section));
      console.log(`${name} syllabus: ${covered.length} of ${topics.length} topics covered by written sections; ${Object.keys(planned).length} sections planned.`);
      expect(topics.length).toBeGreaterThan(0);
    });
  });
}
