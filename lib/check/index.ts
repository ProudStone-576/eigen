import type { Item, Mat } from "@/lib/content/types";
import { equivalent, numbersEqual, parseExpression } from "./expression";

/**
 * - correct / wrong: graded, counts toward progress.
 * - invalid: empty or unparseable. Not a wrong answer; the student retries.
 * - ungraded: well-formed but off-target (e.g. used a variable that is not in
 *   the problem). Hint only, no penalty.
 */
export type GradeStatus = "correct" | "wrong" | "invalid" | "ungraded";

export type Grade = {
  status: GradeStatus;
  message: string | null;
  misconception: string | null;
  /** Shown once graded: why the right answer is right. */
  explain: string | null;
  /** Per-option explanations for multiple choice. */
  optionWhy?: Record<string, string>;
  correctOptionId?: string;
};

export type Response =
  | { kind: "mc"; optionId: string }
  | { kind: "number"; text: string }
  | { kind: "expression"; text: string }
  | { kind: "vector"; values: string[] }
  | { kind: "matrix"; values: string[][] };

/** Option id for "I'm not sure". */
export const IDK = "idk";

const invalid = (message: string): Grade => ({ status: "invalid", message, misconception: null, explain: null });

/** A number typed as 3, -1.5, 3/4, 2pi, sqrt(2). No variables allowed. */
export function parseNumber(text: string): number | null {
  const parsed = parseExpression(text);
  if (!parsed.ok || parsed.vars.length) return null;
  try {
    const value = parsed.node.compile().evaluate();
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function parseGrid(values: string[][]): Mat | null {
  const out: Mat = [];
  for (const row of values) {
    const r: number[] = [];
    for (const cell of row) {
      const n = parseNumber(cell);
      if (n === null) return null;
      r.push(n);
    }
    out.push(r);
  }
  return out;
}

/** u = k·v for some non-zero k. */
function parallel(u: number[], v: number[]): boolean {
  if (u.length !== v.length) return false;
  const k = v.findIndex((x) => !numbersEqual(x, 0));
  if (k < 0 || numbersEqual(u[k], 0)) return false;
  const scale = u[k] / v[k];
  return u.every((x, i) => numbersEqual(x, scale * v[i]));
}

function sameGrid(a: Mat, b: Mat): boolean {
  return a.length === b.length && a.every((row, i) => row.length === b[i].length && row.every((x, j) => numbersEqual(x, b[i][j])));
}

export function grade(item: Item, response: Response): Grade {
  if (response.kind !== item.kind) return invalid("That answer is for a different question.");

  switch (item.kind) {
    case "mc": {
      const r = response as Extract<Response, { kind: "mc" }>;
      const right = item.options.find((o) => o.correct)!;
      if (r.optionId === IDK) {
        // An honest blank: counts as not-known, never as a misconception.
        return {
          status: "wrong",
          message: "Honest answer, and a useful one: a blank is easier to fill than a wrong idea is to remove.",
          misconception: null,
          explain: right.why,
          optionWhy: Object.fromEntries(item.options.map((o) => [o.id, o.why])),
          correctOptionId: right.id,
        };
      }
      const chosen = item.options.find((o) => o.id === r.optionId);
      if (!chosen) return invalid("Pick one of the options.");
      return {
        status: chosen.correct ? "correct" : "wrong",
        message: null,
        misconception: chosen.correct ? null : (chosen.misconception ?? null),
        explain: right.why,
        optionWhy: Object.fromEntries(item.options.map((o) => [o.id, o.why])),
        correctOptionId: right.id,
      };
    }

    case "number": {
      const n = parseNumber((response as Extract<Response, { kind: "number" }>).text);
      if (n === null) return invalid("Type a number, like 3, -1.5 or 3/4.");
      const ok = item.tolerance ? Math.abs(n - item.answer) <= item.tolerance : numbersEqual(n, item.answer);
      return { status: ok ? "correct" : "wrong", message: null, misconception: null, explain: item.explain };
    }

    case "vector":
    case "matrix": {
      const grid =
        response.kind === "vector"
          ? parseGrid(response.values.map((v) => [v]))
          : response.kind === "matrix"
            ? parseGrid(response.values)
            : null;
      if (!grid) return invalid("Fill every box with a number.");
      const answer: Mat = item.kind === "vector" ? item.answer.map((x) => [x]) : item.answer;
      if (grid.length !== answer.length || grid[0]?.length !== answer[0].length) {
        return { status: "wrong", message: "That has the wrong size.", misconception: null, explain: item.explain };
      }
      if (sameGrid(grid, answer)) return { status: "correct", message: null, misconception: null, explain: item.explain };
      // Traps first: a specific wrong answer carries its misconception.
      for (const trap of item.traps ?? []) {
        const t: Mat = item.kind === "vector" ? (trap.answer as number[]).map((x) => [x]) : (trap.answer as Mat);
        if (sameGrid(grid, t)) return { status: "wrong", message: trap.message, misconception: trap.misconception, explain: item.explain };
      }
      if (item.kind === "vector" && item.upToScale) {
        const v = grid.map((r) => r[0]);
        if (v.every((x) => numbersEqual(x, 0))) {
          return { status: "wrong", message: "The zero vector never counts: it has no direction.", misconception: null, explain: item.explain };
        }
        if (parallel(v, item.answer)) {
          return { status: "correct", message: "Any non-zero multiple works; this is one of them.", misconception: null, explain: item.explain };
        }
      }
      return { status: "wrong", message: null, misconception: null, explain: item.explain };
    }

    case "expression": {
      const student = parseExpression((response as Extract<Response, { kind: "expression" }>).text);
      if (!student.ok) return invalid("I couldn't read that. Check the brackets and symbols.");
      for (const form of item.forms) {
        const target = parseExpression(form.value);
        if (!target.ok) throw new Error(`Content error: unparseable answer form "${form.value}" in ${item.id}`);
        const unknown = student.vars.filter((v) => !target.vars.includes(v));
        if (unknown.length) {
          if (form.status !== "correct") continue;
          const lower = target.vars.map((v) => v.toLowerCase());
          const caseOnly = unknown.every((v) => lower.includes(v.toLowerCase()));
          // "ax" reads as one variable named ax. The student almost always meant a times x.
          const glued = unknown.every((v) => v.length > 1 && [...v].every((ch) => target.vars.includes(ch)));
          return {
            status: "ungraded",
            message: caseOnly
              ? "Check upper vs lower case in your variable names."
              : glued
                ? `Put * between letters: write ${[...unknown[0]].join("*")}, not ${unknown[0]}.`
                : `This problem doesn't use ${unknown.join(", ")}.`,
            misconception: null,
            explain: null,
          };
        }
        const vars = [...new Set([...student.vars, ...target.vars])];
        if (equivalent(student.node, target.node, vars)) {
          return form.status === "correct"
            ? { status: "correct", message: null, misconception: null, explain: item.explain }
            : { status: "wrong", message: form.message ?? null, misconception: form.misconception ?? null, explain: item.explain };
        }
      }
      return { status: "wrong", message: null, misconception: null, explain: item.explain };
    }
  }
}
