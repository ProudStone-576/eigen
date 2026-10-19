import katex from "katex";
import { describe, expect, it } from "vitest";
import { allNodes } from "@/lib/content";
import { generate, templatesFor, type Level } from "@/lib/content/templates";
import type { ConceptNode, Item } from "@/lib/content/types";

/** Every piece of student-facing text that may contain math. */
function texts(item: Item): string[] {
  const out = [item.prompt];
  if (item.kind === "mc") for (const o of item.options) out.push(o.text, o.why);
  else out.push(item.explain);
  if ((item.kind === "vector" || item.kind === "matrix") && item.traps) for (const t of item.traps) out.push(t.message);
  if (item.kind === "expression") for (const f of item.forms) if (f.message) out.push(f.message);
  return out;
}

function stepTexts(node: ConceptNode): string[] {
  const out: string[] = [node.summary, ...node.glossary.map((g) => g.meaning)];
  for (const s of node.steps) {
    if (s.type === "definition") out.push(s.term, s.body);
    if (s.type === "theorem") out.push(s.statement, ...(s.proof ?? []), s.name ?? "");
    if (s.type === "example") out.push(s.problem, ...s.solution, s.result, s.title ?? "");
    if (s.type === "pitfalls") out.push(...s.items.flatMap((p) => [p.wrong, p.right]));
    if (s.type === "formulas") out.push(...s.rows.flatMap((r) => [r.label, `$${r.tex}$`]));
    if (s.type === "exercises") out.push(...s.items.flatMap((e) => [...texts(e.item), ...e.solution]));
    if (s.type === "motivate") out.push(s.body, s.realWorld.body);
    if (s.type === "explore") out.push(s.body, s.task);
    if (s.type === "truth") out.push(s.statement, s.body);
    if (s.type === "connect" || s.type === "ml") out.push(s.body);
    if (s.type === "predict") out.push(s.reveal.body, ...texts(s.item), ...texts(s.resolve));
    if (s.type === "check") out.push(...texts(s.item));
    if (s.type === "produce") out.push(s.body, ...s.items.flatMap(texts));
  }
  out.push(...node.review.flatMap(texts));
  return out;
}

function checkMath(text: string, where: string) {
  // Control characters mean a single backslash got eaten in a JS string (\v, \t, \b, \f…).
  // Tabs count too: "\theta" in a plain JS string is a tab followed by "heta".
  expect(/[\u0000-\u0009\u000b\u000c\u000e-\u001f]/.test(text), `${where}: control character in ${JSON.stringify(text)}`).toBe(false);
  // A stray "$" (a price written without \$) silently swallows prose into maths.
  const plain = text.replace(/\\\$/g, "");
  expect((plain.match(/\$/g) ?? []).length % 2, `${where}: unbalanced $ in ${JSON.stringify(text)}`).toBe(0);
  for (const m of plain.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
    const words = (m[1] ?? m[2]).replace(/\\(text|mathrm|operatorname|begin|end)\{[^}]*\}/g, "").replace(/\\[a-zA-Z]+/g, "");
    // Lowercase only: vertex names such as ABCD are legitimate maths.
    expect(/[a-z]{4,}/.test(words), `${where}: prose inside maths: ${m[0]}`).toBe(false);
    // "\neq" or "\nabla" written with one backslash becomes a newline.
    expect((m[1] ?? m[2]).includes("\n"), `${where}: newline inside maths (lost backslash?): ${JSON.stringify(m[0])}`).toBe(false);
  }
  for (const m of plain.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
    const src = m[1] ?? m[2];
    expect(() => katex.renderToString(src, { throwOnError: true, strict: "ignore" }), `${where}: ${src}`).not.toThrow();
  }
}

describe("all math renders", () => {
  it("in every lesson", () => {
    for (const n of allNodes) for (const t of stepTexts(n)) checkMath(t, n.id);
  });

  it("in every generated question, every template, every level", { timeout: 120_000 }, () => {
    for (const n of allNodes) {
      templatesFor(n.id).forEach((_, t) => {
        for (const level of [1, 2, 3] as Level[]) {
          for (let seed = 1; seed <= 25; seed++) {
            const item = generate(n.id, seed * 104729, { template: t, level })!;
            for (const text of texts(item)) checkMath(text, item.id);
          }
        }
      });
    }
  });
});
