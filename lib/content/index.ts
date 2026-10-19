import type { ConceptNode, Course, Item, McItem, Step } from "./types";
import { unit1 } from "./linear-algebra/unit1";
import { unit2 } from "./linear-algebra/unit2";
import { unit3 } from "./linear-algebra/unit3";
import { unit4 } from "./statistics/unit4";
import { unit5 } from "./statistics/unit5";
import { unit6 } from "./calculus/unit6";
import { fromGeneratedId } from "./generators";

export const course: Course = {
  id: "math-for-ml",
  title: "Math for Machine Learning",
  units: [unit1, unit2, unit3, unit4, unit5, unit6],
};

export const allNodes: ConceptNode[] = course.units.flatMap((u) => u.nodes);
const byId = new Map(allNodes.map((n) => [n.id, n]));

export function getNode(id: string): ConceptNode | undefined {
  return byId.get(id);
}

/** Where an item sits, so grading knows which progress rule applies. */
export type ItemContext = "check" | "predict" | "resolve" | "produce" | "review" | "practice";

export function findItem(node: ConceptNode, itemId: string): { item: Item; context: ItemContext; misconception?: string } | null {
  if (itemId.startsWith("gen~")) {
    const gen = fromGeneratedId(itemId);
    return gen && gen.nodeId === node.id ? { item: gen.item, context: "practice" } : null;
  }
  for (const step of node.steps) {
    if (step.type === "check" && step.item.id === itemId) return { item: step.item, context: "check" };
    if (step.type === "predict") {
      if (step.item.id === itemId) return { item: step.item, context: "predict", misconception: step.misconception };
      if (step.resolve.id === itemId) return { item: step.resolve, context: "resolve", misconception: step.misconception };
    }
    if (step.type === "produce") {
      const item = step.items.find((i) => i.id === itemId);
      if (item) return { item, context: "produce" };
    }
  }
  const item = node.review.find((i) => i.id === itemId);
  return item ? { item, context: "review" } : null;
}

/** Misconceptions an item is built to catch: diagnostic options, traps, wrong forms. */
export function misconceptionsOf(item: Item): string[] {
  const ids =
    item.kind === "mc"
      ? item.options.map((o) => o.misconception)
      : item.kind === "expression"
        ? item.forms.map((f) => f.misconception)
        : item.kind === "vector" || item.kind === "matrix"
          ? (item.traps ?? []).map((t) => t.misconception)
          : [];
  return ids.filter((x): x is string => !!x);
}

export const targets = (item: Item, misconception: string) => misconceptionsOf(item).includes(misconception);

// ---------- What the browser is allowed to see ----------
// Answers, traps and explanations stay on the server until a response is graded.

export type PublicItem =
  | { kind: "mc"; id: string; prompt: string; options: { id: string; text: string }[] }
  | { kind: "number" | "expression"; id: string; prompt: string }
  | { kind: "vector"; id: string; prompt: string; size: number }
  | { kind: "matrix"; id: string; prompt: string; rows: number; cols: number };

/** Stable per-item shuffle, so the correct option isn't always first but the order never jumps around. */
function shuffled<T>(xs: T[], seedText: string): T[] {
  let seed = 0;
  for (const ch of seedText) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1103515245) + 12345) | 0;
    const j = (seed >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function publicItem(item: Item): PublicItem {
  switch (item.kind) {
    case "mc":
      return {
        kind: "mc",
        id: item.id,
        prompt: item.prompt,
        options: shuffled(item.options, item.id).map((o) => ({ id: o.id, text: o.text })),
      };
    case "number":
    case "expression":
      return { kind: item.kind, id: item.id, prompt: item.prompt };
    case "vector":
      return { kind: "vector", id: item.id, prompt: item.prompt, size: item.answer.length };
    case "matrix":
      return { kind: "matrix", id: item.id, prompt: item.prompt, rows: item.answer.length, cols: item.answer[0].length };
  }
}

const pubMc = (i: McItem) => publicItem(i) as Extract<PublicItem, { kind: "mc" }>;

export type PublicStep =
  | Exclude<Step, { type: "check" } | { type: "predict" } | { type: "produce" }>
  | { type: "check"; item: Extract<PublicItem, { kind: "mc" }> }
  | {
      type: "predict";
      item: Extract<PublicItem, { kind: "mc" }>;
      reveal: Extract<Step, { type: "predict" }>["reveal"];
      resolve: Extract<PublicItem, { kind: "mc" }>;
    }
  | { type: "produce"; body: string; items: PublicItem[] };

export function publicSteps(node: ConceptNode): PublicStep[] {
  return node.steps.map((s): PublicStep => {
    switch (s.type) {
      case "check":
        return { type: "check", item: pubMc(s.item) };
      case "predict":
        return { type: "predict", item: pubMc(s.item), reveal: s.reveal, resolve: pubMc(s.resolve) };
      case "produce":
        return { type: "produce", body: s.body, items: s.items.map(publicItem) };
      default:
        return s;
    }
  });
}
