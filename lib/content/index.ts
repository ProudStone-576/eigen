import type { ConceptNode, Course, Item, McItem, Step } from "./types";
import { unit1 } from "./linear-algebra/unit1";
import { unit2 } from "./linear-algebra/unit2";
import { unit3 } from "./linear-algebra/unit3";
import { unit4 } from "./statistics/unit4";
import { unit5 } from "./statistics/unit5";
import { unit6 } from "./calculus/unit6";
import { unit7 } from "./networks/unit7";
import { describingUnit } from "./statistics/describing";
import { collectingUnit } from "./statistics/collecting";
import { estimationUnit } from "./statistics/estimation";
import { distributionsUnit } from "./statistics/distributions";
import { inferenceUnit } from "./statistics/inference";
import { evaluationUnit } from "./ml/evaluation";
import { regressionUnit } from "./modelling/regression";
import { anovaUnit } from "./modelling/anova";
import { nonparametricUnit } from "./modelling/nonparametric";
import { bayesianUnit } from "./modelling/bayesian";
import { multivariateUnit } from "./modelling/multivariate";
import { timeSeriesUnit } from "./modelling/time-series";
import { causalUnit } from "./modelling/causal";
import { survivalUnit } from "./modelling/survival";
import { fromGeneratedId } from "./templates";

export const course: Course = {
  id: "math-for-ml",
  title: "Math for Machine Learning",
  units: [unit1, unit2, unit3, describingUnit, collectingUnit, unit4, unit5, distributionsUnit, inferenceUnit, estimationUnit, unit6, unit7, evaluationUnit, regressionUnit, anovaUnit, nonparametricUnit, bayesianUnit, multivariateUnit, timeSeriesUnit, causalUnit, survivalUnit],
};

export const allNodes: ConceptNode[] = course.units.flatMap((u) => u.nodes);
const byId = new Map(allNodes.map((n) => [n.id, n]));

// ---------- Cross-references ----------
// Content cites other sections as §{node-id}; the number is filled in here from the
// book's current order, so chapters and sections can be reordered without editing text.

const sectionNo = new Map<string, string>();
course.units.forEach((u, ci) => u.nodes.forEach((n, si) => sectionNo.set(n.id, `${ci + 1}.${si + 1}`)));

export function resolveRefs(text: string): string {
  return text.replace(/§\{([a-z0-9-]+)\}/g, (ref, id: string) => {
    const no = sectionNo.get(id);
    if (!no) throw new Error(`Unknown section reference ${ref}`);
    return `§${no}`;
  });
}

function resolveAll(x: unknown): void {
  if (!x || typeof x !== "object") return;
  const o = x as Record<string, unknown>;
  for (const k of Object.keys(o)) {
    if (typeof o[k] === "string") o[k] = resolveRefs(o[k]);
    else resolveAll(o[k]);
  }
}
allNodes.forEach(resolveAll);

export function getNode(id: string): ConceptNode | undefined {
  return byId.get(id);
}

/** Where an item sits, so grading knows which progress rule applies. */
export type ItemContext = "check" | "predict" | "resolve" | "produce" | "review" | "practice" | "exercise";

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
    if (step.type === "exercises") {
      const ex = step.items.find((e) => e.item.id === itemId);
      if (ex) return { item: ex.item, context: "exercise" };
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

export type PublicItem = { tag?: string } & (
  | { kind: "mc"; id: string; prompt: string; options: { id: string; text: string }[] }
  | { kind: "number" | "expression"; id: string; prompt: string }
  | { kind: "vector"; id: string; prompt: string; size: number }
  | { kind: "matrix"; id: string; prompt: string; rows: number; cols: number }
);

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
  const pub = publicItemBody(item);
  return item.tag ? { ...pub, tag: item.tag } : pub;
}

function publicItemBody(item: Item): PublicItem {
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
  | Exclude<Step, { type: "check" } | { type: "predict" } | { type: "produce" } | { type: "exercises" }>
  | { type: "check"; item: Extract<PublicItem, { kind: "mc" }> }
  | {
      type: "predict";
      item: Extract<PublicItem, { kind: "mc" }>;
      reveal: Extract<Step, { type: "predict" }>["reveal"];
      resolve: Extract<PublicItem, { kind: "mc" }>;
    }
  | { type: "produce"; body: string; items: PublicItem[] }
  | { type: "exercises"; items: { level: 1 | 2 | 3; item: PublicItem }[] };

/** The worked solution of an exercise: sent only after the student has attempted it. */
export function exerciseSolution(node: ConceptNode, itemId: string): string[] | null {
  for (const s of node.steps) if (s.type === "exercises") for (const e of s.items) if (e.item.id === itemId) return e.solution;
  return null;
}

export function publicSteps(node: ConceptNode): PublicStep[] {
  return node.steps.map((s): PublicStep => {
    switch (s.type) {
      case "check":
        return { type: "check", item: pubMc(s.item) };
      case "predict":
        return { type: "predict", item: pubMc(s.item), reveal: s.reveal, resolve: pubMc(s.resolve) };
      case "produce":
        return { type: "produce", body: s.body, items: s.items.map(publicItem) };
      case "exercises":
        return { type: "exercises", items: s.items.map((e) => ({ level: e.level, item: publicItem(e.item) })) };
      default:
        return s;
    }
  });
}
