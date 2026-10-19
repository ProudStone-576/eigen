import { describe, expect, it } from "vitest";
import { allNodes, findItem, getNode, misconceptionsOf, publicItem } from "@/lib/content";
import { generate, TEMPLATED, templatesFor, type Level } from "@/lib/content/templates";
import { grade, type Response } from "@/lib/check";
import type { Item } from "@/lib/content/types";
import { apply, FRESH, PRACTICE_STREAK, type Progress } from "@/lib/learning/rules";

const SEEDS = Array.from({ length: 250 }, (_, i) => i * 7919 + 13);

function correctResponse(item: Item): Response {
  switch (item.kind) {
    case "mc":
      return { kind: "mc", optionId: item.options.find((o) => o.correct)!.id };
    case "number":
      return { kind: "number", text: String(item.answer) };
    case "expression":
      return { kind: "expression", text: item.forms.find((f) => f.status === "correct")!.value };
    case "vector":
      return { kind: "vector", values: item.answer.map(String) };
    case "matrix":
      return { kind: "matrix", values: item.answer.map((r) => r.map(String)) };
  }
}

it("every concept has at least one practice generator", () => {
  const missing = allNodes.filter((n) => !templatesFor(n.id).length).map((n) => n.id);
  expect(missing).toEqual([]);
});

it("generators only exist for real concepts", () => {
  for (const id of TEMPLATED) expect(getNode(id), id).toBeTruthy();
});

describe.each(TEMPLATED.map((id) => [id] as const))("generators for %s", (nodeId) => {
  const node = getNode(nodeId)!;
  // Every template at every level.
  const items = templatesFor(nodeId).flatMap((_, t) =>
    ([1, 2, 3] as Level[]).flatMap((level) => SEEDS.slice(0, 90).map((s) => generate(nodeId, s, { template: t, level })!)),
  );

  it("stated answers grade correct", () => {
    for (const i of items) expect(grade(i, correctResponse(i)).status, `${i.id}: ${i.prompt}`).toBe("correct");
  });

  it("traps and wrong forms grade wrong, with misconceptions the concept defines", () => {
    const defined = Object.keys(node.misconceptions);
    for (const i of items) {
      for (const m of misconceptionsOf(i)) expect(defined, `${i.id} -> ${m}`).toContain(m);
      if (i.kind === "vector" || i.kind === "matrix") {
        for (const t of i.traps ?? []) {
          const values = i.kind === "vector" ? (t.answer as number[]).map(String) : (t.answer as number[][]).map((r) => r.map(String));
          const g = grade(i, { kind: i.kind, values } as Response);
          expect(g.status, `${i.id} trap ${JSON.stringify(t.answer)}`).toBe("wrong");
        }
      }
      if (i.kind === "expression") {
        for (const f of i.forms.filter((f) => f.status === "wrong")) {
          expect(grade(i, { kind: "expression", text: f.value }).status, `${i.id}: ${f.value}`).toBe("wrong");
        }
      }
      if (i.kind === "mc") {
        expect(i.options.filter((o) => o.correct)).toHaveLength(1);
        expect(new Set(i.options.map((o) => o.text)).size, i.id).toBe(i.options.length);
      }
    }
  });

  it("ids rebuild the same question, and the public view leaks no answers", () => {
    for (const i of items.slice(0, 40)) {
      expect(findItem(node, i.id)?.item).toEqual(i);
      expect(findItem(node, i.id)?.context).toBe("practice");
      expect(JSON.stringify(publicItem(i))).not.toMatch(/"correct":|"answer":|"traps":|"forms":|"why":|"explain":/);
    }
  });

  it("produces some variety", () => {
    expect(new Set(items.map((i) => i.prompt)).size).toBeGreaterThan(5);
  });

  it("every item is tagged with its question type", () => {
    for (const i of items) expect(i.tag, i.id).toBeTruthy();
  });

  it("multiple choice always keeps at least two distinct options", () => {
    for (const i of items) if (i.kind === "mc") expect(i.options.length, `${i.id}: ${i.prompt}`).toBeGreaterThanOrEqual(2);
  });
});

it("old 4-part ids (before difficulty levels) still rebuild, as level 1", () => {
  const old = "gen~determinant~0~12345";
  const item = findItem(getNode("determinant")!, old)?.item;
  expect(item?.id).toBe(old);
  expect(item).toEqual(generate("determinant", 12345, { template: 0, level: 1 }) && { ...generate("determinant", 12345, { template: 0, level: 1 })!, id: old });
});

it("most core concepts offer several kinds of question", () => {
  const multi = TEMPLATED.filter((id) => new Set(templatesFor(id).map((t) => t.type)).size >= 2);
  expect(multi.length).toBeGreaterThanOrEqual(25);
});

it("a generated id can't be graded as a different concept", () => {
  const item = generate("vector", 42)!;
  expect(findItem(getNode("scalar")!, item.id)).toBeNull();
});

describe("practice mastery rule", () => {
  const now = new Date("2026-10-19T12:00:00Z");
  it(`needs ${PRACTICE_STREAK} in a row and makes the concept solid`, () => {
    const landed: Progress = { ...FRESH, status: "LANDED" };
    expect(apply(landed, { type: "practice-mastered" }, now).status).toBe("SOLID");
  });
  it("never skips past a live misconception", () => {
    const held: Progress = { ...FRESH, status: "MISCONCEPTION", misconceptionId: "x" };
    expect(apply(held, { type: "practice-mastered" }, now).status).toBe("MISCONCEPTION");
  });
});
