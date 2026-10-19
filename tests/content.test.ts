import { describe, expect, it } from "vitest";
import { allNodes, findItem, getNode, misconceptionsOf, publicItem, publicSteps } from "@/lib/content";
import { grade, type Response } from "@/lib/check";
import type { ConceptNode, Item } from "@/lib/content/types";

function itemsOf(n: ConceptNode): Item[] {
  return [
    ...n.steps.flatMap((s) =>
      s.type === "check" ? [s.item] : s.type === "predict" ? [s.item, s.resolve] : s.type === "produce" ? s.items : [],
    ),
    ...n.review,
  ];
}

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

describe("concept graph", () => {
  it("every dependency exists earlier, so the graph has no cycles", () => {
    const seen = new Set<string>();
    for (const n of allNodes) {
      for (const d of n.deps) expect(seen.has(d), `${n.id} depends on ${d}`).toBe(true);
      seen.add(n.id);
    }
  });
  it("node ids and item ids are unique", () => {
    expect(new Set(allNodes.map((n) => n.id)).size).toBe(allNodes.length);
    const ids = allNodes.flatMap((n) => itemsOf(n).map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(allNodes.map((n) => [n.id, n] as const))("node %s", (_id, node) => {
  it("has a produce step and a review pool", () => {
    expect(node.steps.some((s) => s.type === "produce")).toBe(true);
    expect(node.review.length).toBeGreaterThan(0);
  });
  it("every multiple choice has exactly one correct option", () => {
    for (const i of itemsOf(node)) if (i.kind === "mc") expect(i.options.filter((o) => o.correct), i.id).toHaveLength(1);
  });
  it("every referenced misconception is defined on the node", () => {
    const defined = Object.keys(node.misconceptions);
    for (const i of itemsOf(node)) {
      const refs =
        i.kind === "mc"
          ? i.options.map((o) => o.misconception)
          : i.kind === "expression"
            ? i.forms.map((f) => f.misconception)
            : i.kind === "vector" || i.kind === "matrix"
              ? (i.traps ?? []).map((t) => t.misconception)
              : [];
      for (const r of refs) if (r) expect(defined, `${i.id} -> ${r}`).toContain(r);
    }
    for (const s of node.steps) if (s.type === "predict") expect(defined).toContain(s.misconception);
  });
  it("the stated answer to every item grades correct", () => {
    for (const i of itemsOf(node)) expect(grade(i, correctResponse(i)).status, i.id).toBe("correct");
  });
  it("every trap grades wrong with its misconception", () => {
    for (const i of itemsOf(node)) {
      if (i.kind !== "vector" && i.kind !== "matrix") continue;
      for (const t of i.traps ?? []) {
        const values = i.kind === "vector" ? (t.answer as number[]).map(String) : (t.answer as number[][]).map((r) => r.map(String));
        const r = grade(i, { kind: i.kind, values } as Response);
        expect(r.status, i.id).toBe("wrong");
        expect(r.misconception, i.id).toBe(t.misconception);
      }
    }
  });
  it("every wrong expression form grades wrong, not correct", () => {
    for (const i of itemsOf(node)) {
      if (i.kind !== "expression") continue;
      for (const f of i.forms.filter((f) => f.status === "wrong")) {
        expect(grade(i, { kind: "expression", text: f.value }).status, `${i.id}: ${f.value}`).toBe("wrong");
      }
    }
  });
  it("every misconception a lesson can mark can also be dislodged in that lesson", () => {
    // Marked by a wrong check/predict answer. Dislodged by a predict sequence for it,
    // or by a correct answer to a *different* non-review item that targets it.
    const lessonItems = itemsOf(node).filter((i) => !node.review.includes(i));
    for (const s of node.steps) {
      const marker = s.type === "check" ? s.item : s.type === "predict" ? s.item : null;
      if (!marker) continue;
      for (const m of misconceptionsOf(marker)) {
        const viaPredict = node.steps.some((p) => p.type === "predict" && p.misconception === m);
        const viaOther = lessonItems.some((i) => i !== marker && misconceptionsOf(i).includes(m));
        expect(viaPredict || viaOther, `${node.id}: "${m}" from ${marker.id} has no way out`).toBe(true);
      }
    }
  });
  it("findItem locates every item", () => {
    for (const i of itemsOf(node)) expect(findItem(node, i.id)?.item).toBe(i);
  });
  it("public steps never leak answers", () => {
    const json = JSON.stringify(publicSteps(node));
    expect(json).not.toMatch(/"correct":|"answer":|"traps":|"forms":|"why":|"explain":/);
  });
});

it("getNode resolves", () => expect(getNode("vector")?.title).toBeTruthy());

it("shuffled options keep every option and don't always put the right one first", () => {
  const mcs = allNodes.flatMap(itemsOf).filter((i) => i.kind === "mc");
  let firstIsRight = 0;
  for (const i of mcs) {
    const pub = publicItem(i) as { options: { id: string }[] };
    expect(pub.options.map((o) => o.id).sort()).toEqual(i.options.map((o) => o.id).sort());
    expect(publicItem(i)).toEqual(pub); // stable
    if (pub.options[0].id === i.options.find((o) => o.correct)!.id) firstIsRight++;
  }
  expect(firstIsRight).toBeLessThan(mcs.length * 0.7);
});

it("'I'm not sure' grades as not-known, never as a misconception", () => {
  const item = getNode("vector")!.steps.find((s) => s.type === "check")!;
  if (item.type !== "check") throw new Error();
  const r = grade(item.item, { kind: "mc", optionId: "idk" });
  expect([r.status, r.misconception, r.correctOptionId]).toEqual(["wrong", null, "a"]);
});
