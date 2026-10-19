import { z } from "zod";
import { grade, type Response } from "@/lib/check";
import type { ConceptNode, Item } from "./types";

/**
 * Teacher-written questions. The editor submits one of these; it's validated
 * here (shape, misconceptions that exist on the concept, and a self-grade: the
 * stated answer must grade correct) before anything is stored.
 */

const text = z.string().trim().min(1, "Can't be empty.").max(2000);
const short = z.string().trim().max(600);
const num = z.number().finite();

const mc = z.object({
  kind: z.literal("mc"),
  prompt: text,
  options: z
    .array(z.object({ text: text.max(300), correct: z.boolean(), why: short, misconception: z.string().max(80).optional() }))
    .min(2, "Add at least two options.")
    .max(6),
});

const number = z.object({ kind: z.literal("number"), prompt: text, answer: num, tolerance: num.nonnegative().optional(), explain: short });

const vector = z.object({ kind: z.literal("vector"), prompt: text, answer: z.array(num).min(2).max(4), upToScale: z.boolean().optional(), explain: short });

const matrix = z.object({
  kind: z.literal("matrix"),
  prompt: text,
  answer: z.array(z.array(num).min(1).max(4)).min(1).max(4),
  explain: short,
});

const expression = z.object({
  kind: z.literal("expression"),
  prompt: text,
  correct: z.string().trim().min(1).max(200),
  wrong: z.array(z.object({ value: z.string().trim().min(1).max(200), message: short, misconception: z.string().max(80).optional() })).max(5),
  explain: short,
});

export const customItemSchema = z.discriminatedUnion("kind", [mc, number, vector, matrix, expression]);
export type CustomItemInput = z.infer<typeof customItemSchema>;

export function correctResponse(item: Item): Response {
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

/** Turn editor input into a gradeable Item, or explain what's wrong. */
export function toItem(node: ConceptNode, input: unknown, id: string): { item: Item } | { error: string } {
  const parsed = customItemSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: `${issue.path.join(" › ") || "Question"}: ${issue.message}` };
  }
  const d = parsed.data;
  const known = new Set(Object.keys(node.misconceptions));
  const badMis = (m?: string) => m && !known.has(m);

  let item: Item;
  switch (d.kind) {
    case "mc": {
      if (d.options.filter((o) => o.correct).length !== 1) return { error: "Mark exactly one option as correct." };
      if (new Set(d.options.map((o) => o.text)).size !== d.options.length) return { error: "Two options have the same text." };
      if (d.options.some((o) => badMis(o.misconception))) return { error: "Unknown misconception on an option." };
      item = {
        kind: "mc",
        id,
        prompt: d.prompt,
        options: d.options.map((o, i) => ({
          id: "abcdef"[i],
          text: o.text,
          correct: o.correct || undefined,
          why: o.why || (o.correct ? "That's the one." : "Not this one."),
          misconception: o.correct ? undefined : o.misconception || undefined,
        })),
      };
      break;
    }
    case "number":
      item = { kind: "number", id, prompt: d.prompt, answer: d.answer, tolerance: d.tolerance || undefined, explain: d.explain };
      break;
    case "vector":
      item = { kind: "vector", id, prompt: d.prompt, answer: d.answer, upToScale: d.upToScale || undefined, explain: d.explain };
      if (d.upToScale && d.answer.every((x) => x === 0)) return { error: "An any-multiple answer can't be the zero vector." };
      break;
    case "matrix":
      if (new Set(d.answer.map((r) => r.length)).size !== 1) return { error: "Every matrix row needs the same number of entries." };
      item = { kind: "matrix", id, prompt: d.prompt, answer: d.answer, explain: d.explain };
      break;
    case "expression":
      if (d.wrong.some((w) => badMis(w.misconception))) return { error: "Unknown misconception on a wrong answer." };
      item = {
        kind: "expression",
        id,
        prompt: d.prompt,
        forms: [
          ...d.wrong.map((w) => ({ value: w.value, status: "wrong" as const, message: w.message || undefined, misconception: w.misconception || undefined })),
          { value: d.correct, status: "correct" as const },
        ],
        explain: d.explain,
      };
      break;
  }

  // Self-grade: the stated answer must grade correct, and every listed wrong answer must grade wrong.
  try {
    if (item.kind === "expression") {
      // Check wrong forms against the correct one alone first, so the teacher gets the specific reason.
      const correctOnly = { ...item, forms: item.forms.filter((f) => f.status === "correct") };
      for (const f of item.forms.filter((f) => f.status === "wrong")) {
        if (grade(correctOnly, { kind: "expression", text: f.value }).status === "correct") {
          return { error: `"${f.value}" is equivalent to the correct answer, so it can't be a wrong answer.` };
        }
      }
    }
    if (grade(item, correctResponse(item)).status !== "correct") {
      return { error: item.kind === "expression" ? "The correct expression couldn't be read or matches one of the wrong ones." : "The stated answer doesn't grade as correct." };
    }
    if (item.kind === "expression") {
      for (const f of item.forms.filter((f) => f.status === "wrong")) {
        if (grade(item, { kind: "expression", text: f.value }).status !== "wrong") return { error: `"${f.value}" is equivalent to the correct answer, so it can't be a wrong answer.` };
      }
    }
  } catch {
    return { error: "One of the expressions couldn't be read. Use * for multiply and ^ for powers." };
  }
  return { item };
}
