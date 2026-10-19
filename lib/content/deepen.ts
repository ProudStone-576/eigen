import type { ConceptNode, Exercise, Item, Level, McItem, Step } from "./types";

/**
 * Exam-depth material for a section, slotted into the lesson in textbook
 * order: definitions after the opening question, theorems and worked examples
 * after the key result, common errors and a formula box before the mastery
 * check, exercises at the end.
 */
export type Depth = {
  definitions?: Extract<Step, { type: "definition" }>[];
  theorems?: Extract<Step, { type: "theorem" }>[];
  examples?: Extract<Step, { type: "example" }>[];
  pitfalls?: Extract<Step, { type: "pitfalls" }>["items"];
  formulas?: Extract<Step, { type: "formulas" }>["rows"];
  exercises?: Exercise[];
};

export function deepen(node: ConceptNode, d: Depth | undefined): ConceptNode {
  if (!d) return node;
  const steps = [...node.steps];
  const at = (pred: (s: Step) => boolean) => steps.findIndex(pred);
  const insert = (i: number, add: Step[]) => add.length && steps.splice(i, 0, ...add);

  // Definitions: straight after the opening motivation.
  const mot = at((s) => s.type === "motivate");
  insert(mot + 1, d.definitions ?? []);
  // Theorems, then worked examples: after the key result (or the first figure).
  const anchor = Math.max(at((s) => s.type === "truth"), at((s) => s.type === "explore"));
  insert(anchor >= 0 ? anchor + 1 : mot + 1 + (d.definitions?.length ?? 0), [...(d.theorems ?? []), ...(d.examples ?? [])]);
  // Common errors and formulas: just before the mastery check.
  const produce = at((s) => s.type === "produce");
  const before: Step[] = [];
  if (d.pitfalls?.length) before.push({ type: "pitfalls", items: d.pitfalls });
  if (d.formulas?.length) before.push({ type: "formulas", rows: d.formulas });
  insert(produce >= 0 ? produce : steps.length, before);
  // Exercises close the section.
  if (d.exercises?.length) steps.push({ type: "exercises", items: d.exercises });
  return { ...node, steps };
}

// ---------- Compact builders for exercise items ----------

export const num = (id: string, prompt: string, answer: number, explain: string, tolerance?: number): Item => ({
  kind: "number",
  id,
  prompt,
  answer,
  explain,
  ...(tolerance ? { tolerance } : {}),
});
export const vec = (id: string, prompt: string, answer: number[], explain: string, upToScale = false): Item => ({
  kind: "vector",
  id,
  prompt,
  answer,
  explain,
  ...(upToScale ? { upToScale } : {}),
});
export const mat = (id: string, prompt: string, answer: number[][], explain: string): Item => ({ kind: "matrix", id, prompt, answer, explain });
export const mc = (id: string, prompt: string, correct: [string, string], wrong: [string, string][]): McItem => ({
  kind: "mc",
  id,
  prompt,
  options: [{ id: "a", text: correct[0], correct: true, why: correct[1] }, ...wrong.map(([text, why], i) => ({ id: "bcdef"[i], text, why }))],
});
export const ex = (level: Level, item: Item, solution: string[]): Exercise => ({ level, item, solution });
