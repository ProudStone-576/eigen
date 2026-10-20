import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Trigonometric equations: principal and general solutions of sin, cos and tan equations; equations reducible to quadratics; a sin x + b cos x = c; counting solutions in an interval; extraneous roots from squaring; simple trigonometric inequalities. */

const base: ConceptNode = {
  id: "trig-equations",
  title: "Trigonometric equations",
  summary: "Because trig functions repeat, an equation such as sin x = ½ has infinitely many solutions. The general solution captures them all in one formula; counting how many fall in an interval is a favourite exam question. Many equations reduce to a quadratic in sin x or cos x, and equations of the form a sin x + b cos x = c have solutions only when |c| ≤ √(a² + b²).",
  deps: ["trig-identities", "quadratics"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "principal solution", meaning: "A solution in a basic interval, usually $[0, 2\\pi)$." },
    { term: "general solution", meaning: "A formula in an integer $n$ listing every solution." },
    { term: "extraneous root", meaning: "A value produced by squaring or other non-reversible steps that doesn't satisfy the original equation." },
  ],
  misconceptions: {
    "one-solution-trig": "Gives only the calculator's principal value, missing the other solutions in the interval.",
    "squaring-extraneous": "Squares both sides of a trig equation and keeps every resulting root without checking.",
  },
  steps: [
    {
      type: "motivate",
      title: "Infinitely many answers",
      body: "When is a Ferris wheel seat 30 m above the ground? Every lap it passes that height twice, once going up and once coming down, and the wheel keeps turning. Trig equations have the same structure: a calculator gives one answer, but the full solution needs symmetry and periodicity.",
      realWorld: {
        title: "Tides",
        body: "Harbour depths follow roughly $d = 5 + 3\\sin(\\tfrac{\\pi t}{6})$ metres over a 12-hour cycle. Finding the times a ship can enter, when $d \\ge 6.5$, means solving $\\sin(\\tfrac{\\pi t}6) \\ge \\tfrac12$ for every cycle.",
      },
    },
    {
      type: "truth",
      statement: "**General solutions** (with $n \\in \\mathbb Z$): $\\sin x = \\sin\\alpha \\iff x = n\\pi + (-1)^n\\alpha$; $\\cos x = \\cos\\alpha \\iff x = 2n\\pi \\pm \\alpha$; $\\tan x = \\tan\\alpha \\iff x = n\\pi + \\alpha$. Special cases: $\\sin x = 0 \\iff x = n\\pi$; $\\cos x = 0 \\iff x = (2n + 1)\\tfrac\\pi2$; $\\sin^2x = \\sin^2\\alpha \\iff x = n\\pi \\pm \\alpha$. $a\\sin x + b\\cos x = c$ has solutions if and only if $\\lvert c\\rvert \\le \\sqrt{a^2 + b^2}$ (§{trig-identities}).",
      body: "Method: rewrite with one function (using identities), factorise or treat as a quadratic in $\\sin x$ or $\\cos x$, reject values outside $[-1, 1]$, then write the general solution and list the members in the required interval. In $[0, 2\\pi)$, $\\sin x = k$ with $0 < k < 1$ has two solutions, $\\alpha$ and $\\pi - \\alpha$; $\\cos x = k$ has $\\alpha$ and $2\\pi - \\alpha$. Squaring (for example to handle $\\sin x + \\cos x = 1$) can introduce extraneous roots, so check each. For inequalities, solve the equation for the boundary points, then read the region from the graph.",
    },
    {
      type: "predict",
      misconception: "one-solution-trig",
      item: {
        kind: "mc",
        id: "teq-predict-1",
        prompt: "Solve $\\sin x = \\tfrac12$ for $0 \\le x < 2\\pi$.",
        options: [
          { id: "a", text: "$x = \\tfrac\\pi6$ or $\\tfrac{5\\pi}6$", correct: true, why: "Sine is positive in quadrants I and II." },
          { id: "b", text: "$x = \\tfrac\\pi6$", misconception: "one-solution-trig", why: "$\\sin(\\pi - \\tfrac\\pi6)$ is also $\\tfrac12$." },
          { id: "c", text: "$x = \\tfrac\\pi6$ or $\\tfrac{7\\pi}6$", why: "Sine is negative at $\\tfrac{7\\pi}6$." },
        ],
      },
      reveal: {
        body: "On the unit circle, the horizontal line $y = \\tfrac12$ cuts the circle twice: at $\\tfrac\\pi6$ and at $\\pi - \\tfrac\\pi6 = \\tfrac{5\\pi}6$. The general solution $x = n\\pi + (-1)^n\\tfrac\\pi6$ gives both ($n = 0, 1$) and every repeat. A calculator's $\\sin^{-1}$ returns only the principal value.",
      },
      resolve: {
        kind: "mc",
        id: "teq-resolve-1",
        prompt: "How many solutions has $\\cos x = 0.3$ in $[0, 2\\pi)$?",
        options: [
          { id: "a", text: "2", correct: true, why: "$\\alpha$ and $2\\pi - \\alpha$." },
          { id: "b", text: "1", misconception: "one-solution-trig", why: "Cosine takes each value in $(-1, 1)$ twice per period." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "teq-check-1",
        prompt: "Solving $\\sin x + \\cos x = 1$ by squaring gives $2\\sin x\\cos x = 0$, so $x = 0, \\tfrac\\pi2, \\pi, \\tfrac{3\\pi}2$ in $[0, 2\\pi)$. The actual solutions are",
        options: [
          { id: "a", text: "$0$ and $\\tfrac\\pi2$ only", correct: true, why: "At $\\pi$ and $\\tfrac{3\\pi}2$ the sum is $-1$." },
          { id: "b", text: "all four values", misconception: "squaring-extraneous", why: "Squaring also solves $\\sin x + \\cos x = -1$." },
          { id: "c", text: "none", why: "$x = 0$ works: $0 + 1 = 1$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "teq-check-2",
        prompt: "Does $3\\sin x + 4\\cos x = 6$ have real solutions?",
        options: [
          { id: "a", text: "No: the left side never exceeds 5", correct: true, why: "$\\sqrt{9 + 16} = 5 < 6$." },
          { id: "b", text: "Yes, at $x = \\tfrac\\pi4$", why: "There it equals $\\tfrac{7}{\\sqrt2} \\approx 4.95$." },
          { id: "c", text: "Yes, infinitely many", why: "6 is out of range." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Periodic signals, such as daily or weekly seasonality, are modelled with sine and cosine features, and finding when a fitted seasonal component crosses a threshold is a trig equation (§{ts-components}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "teq-produce-1", prompt: "How many solutions has $\\sin 2x = 0$ in $[0, 2\\pi]$?", answer: 5, explain: "$x = k\\pi/2$, $k = 0, \\dots, 4$." },
        { kind: "number", id: "teq-produce-2", prompt: "How many solutions has $2\\cos^2x - 3\\cos x + 1 = 0$ in $[0, 2\\pi]$?", answer: 4, explain: "$\\cos x = 1$ or $\\tfrac12$: $0, \\tfrac\\pi3, \\tfrac{5\\pi}3, 2\\pi$." },
        {
          kind: "mc",
          id: "teq-produce-3",
          prompt: "All solutions of $\\tan x = \\sqrt3$ are",
          options: [
            { id: "a", text: "$x = n\\pi + \\tfrac\\pi3$", correct: true, why: "Tangent has period $\\pi$." },
            { id: "b", text: "$x = \\tfrac\\pi3$", misconception: "one-solution-trig", why: "That is only the principal value." },
          ],
        },
        {
          kind: "mc",
          id: "teq-produce-4",
          prompt: "Squaring $\\cos x = \\sin x - 1$ gives candidates; checking them is necessary because",
          options: [
            { id: "a", text: "squaring also admits solutions of $\\cos x = -(\\sin x - 1)$", correct: true, why: "Extraneous roots appear." },
            { id: "b", text: "it isn't: every root of the squared equation works", misconception: "squaring-extraneous", why: "Squaring isn't reversible." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "teq-review-1", prompt: "How many solutions has $\\cos x = -\\tfrac12$ in $[0, 4\\pi)$?", answer: 4, explain: "Two per period." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "reducing to one function",
      body: "Use $\\sin^2x = 1 - \\cos^2x$, $\\cos 2x = 1 - 2\\sin^2x$, $\\sec^2x = 1 + \\tan^2x$ to write everything in one ratio; or factorise (e.g. $\\sin 2x = \\sin x$ becomes $\\sin x(2\\cos x - 1) = 0$). Never divide by $\\sin x$ or $\\cos x$ without first setting aside the case where it is 0, or solutions are lost.",
    },
    {
      type: "definition",
      term: "trigonometric inequalities",
      body: "Solve the boundary equation, then use the graph over one period. For $\\sin x > \\tfrac12$: between $\\tfrac\\pi6$ and $\\tfrac{5\\pi}6$, plus $2n\\pi$. For $\\cos x \\le -\\tfrac12$: $[\\tfrac{2\\pi}3, \\tfrac{4\\pi}3] + 2n\\pi$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "general solution of sin x = sin α",
      statement: "$\\sin x = \\sin\\alpha$ if and only if $x = n\\pi + (-1)^n\\alpha$ for some integer $n$.",
      proof: ["$\\sin x - \\sin\\alpha = 2\\cos\\tfrac{x + \\alpha}2\\sin\\tfrac{x - \\alpha}2 = 0$ gives $x = 2k\\pi + \\alpha$ or $x = (2k + 1)\\pi - \\alpha$; these combine as $n\\pi + (-1)^n\\alpha$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "general solution of cos x = cos α",
      statement: "$\\cos x = \\cos\\alpha$ if and only if $x = 2n\\pi \\pm \\alpha$.",
      proof: ["$\\cos x - \\cos\\alpha = -2\\sin\\tfrac{x + \\alpha}2\\sin\\tfrac{x - \\alpha}2 = 0$ gives $x = 2n\\pi - \\alpha$ or $x = 2n\\pi + \\alpha$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "solvability of a sin x + b cos x = c",
      statement: "Solutions exist iff $\\lvert c\\rvert \\le \\sqrt{a^2 + b^2}$; then $\\sin(x + \\alpha) = c/R$ with $R = \\sqrt{a^2 + b^2}$.",
      proof: ["The left side equals $R\\sin(x + \\alpha)$, whose range is $[-R, R]$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $2\\sin^2x = 1$ for $0 \\le x \\le \\pi$.",
      solution: ["$\\sin x = \\pm\\tfrac1{\\sqrt2}$; on $[0, \\pi]$ sine is non-negative.", "$x = \\tfrac\\pi4$ or $\\tfrac{3\\pi}4$."],
      result: "$\\tfrac\\pi4, \\tfrac{3\\pi}4$.",
    },
    {
      type: "example",
      level: 2,
      title: "a quadratic in cos x",
      problem: "Solve $2\\cos^2x - 3\\cos x + 1 = 0$ in general.",
      solution: ["$(2\\cos x - 1)(\\cos x - 1) = 0$: $\\cos x = \\tfrac12$ or 1.", "$x = 2n\\pi \\pm \\tfrac\\pi3$ or $x = 2n\\pi$."],
      result: "$x = 2n\\pi$ or $2n\\pi \\pm \\tfrac\\pi3$.",
    },
    {
      type: "example",
      level: 3,
      title: "the amplitude form",
      problem: "Solve $\\sqrt3\\sin x + \\cos x = \\sqrt2$.",
      solution: ["$2\\sin(x + \\tfrac\\pi6) = \\sqrt2$, so $\\sin(x + \\tfrac\\pi6) = \\tfrac1{\\sqrt2}$.", "$x + \\tfrac\\pi6 = n\\pi + (-1)^n\\tfrac\\pi4$, so $x = n\\pi + (-1)^n\\tfrac\\pi4 - \\tfrac\\pi6$."],
      result: "$x = n\\pi + (-1)^n\\tfrac\\pi4 - \\tfrac\\pi6$.",
    },
  ],
  pitfalls: [
    { wrong: "Stop at the calculator's value.", right: "Use symmetry and periodicity to list every solution." },
    { wrong: "Divide by $\\sin x$ or $\\cos x$.", right: "Factorise instead, or treat the zero case separately." },
    { wrong: "Keep all roots after squaring.", right: "Check each in the original equation." },
  ],
  formulas: [
    { label: "Sine", tex: "\\sin x = \\sin\\alpha \\iff x = n\\pi + (-1)^n\\alpha" },
    { label: "Cosine", tex: "\\cos x = \\cos\\alpha \\iff x = 2n\\pi \\pm \\alpha" },
    { label: "Tangent", tex: "\\tan x = \\tan\\alpha \\iff x = n\\pi + \\alpha" },
    { label: "Solvable", tex: "\\lvert c\\rvert \\le \\sqrt{a^2 + b^2}" },
  ],
  exercises: [
    ex(1, num("teqx-ex-1", "How many solutions has $\\tan x = 1$ in $[0, 2\\pi)$?", 2, "$\\tfrac\\pi4$ and $\\tfrac{5\\pi}4$."), ["$2$."]),
    ex(1, num("teqx-ex-2", "How many solutions has $\\sin x = 2$?", 0, "Out of range."), ["$0$."]),
    ex(2, num("teqx-ex-3", "How many solutions has $\\sin 2x = \\sin x$ in $[0, 2\\pi)$?", 4, "$\\sin x(2\\cos x - 1) = 0$: $0, \\pi, \\tfrac\\pi3, \\tfrac{5\\pi}3$."), ["$4$."]),
    ex(2, num("teqx-ex-4", "How many solutions has $\\cos x = -\\tfrac12$ in $[0, 4\\pi]$?", 4, "Two per period."), ["$4$."]),
    ex(2, num("teqx-ex-5", "How many solutions has $\\sin 3x = 1$ in $[0, 2\\pi)$?", 3, "$3x = \\tfrac\\pi2 + 2k\\pi$ for $3x \\in [0, 6\\pi)$."), ["$x = \\tfrac\\pi6, \\tfrac{5\\pi}6, \\tfrac{3\\pi}2$."]),
    ex(3, num("teqx-ex-6", "Find the largest integer $c$ for which $5\\sin x + 12\\cos x = c$ has a solution.", 13, "$R = 13$."), ["$13$."]),
    ex(3, num("teqx-ex-7", "How many solutions has $\\sin x + \\cos x = 1$ in $[0, 2\\pi)$?", 2, "Reject the extraneous $\\pi$ and $\\tfrac{3\\pi}2$."), ["$0$ and $\\tfrac\\pi2$."]),
    ex(3, mc("teqx-ex-8", "The solution of $\\sin x > \\tfrac12$ in $[0, 2\\pi)$ is", ["$\\tfrac\\pi6 < x < \\tfrac{5\\pi}6$", "Between the two boundary solutions, where sine is above $\\tfrac12$."], [["$x > \\tfrac\\pi6$", "Sine falls below $\\tfrac12$ after $\\tfrac{5\\pi}6$."], ["$x < \\tfrac\\pi6$ or $x > \\tfrac{5\\pi}6$", "That is where it is below."]]), ["Read it from the graph."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      const periods = r.int(1, 3);
      const fn = r.pick(["sin", "cos"] as const);
      const val = r.pick(["0.3", "-0.6", "\\tfrac12", "-\\tfrac{\\sqrt3}{2}"]);
      // f(kx) = val with |val| < 1: 2 solutions per period of f(kx), which is 2π/k; over [0, 2π·periods) there are k·periods periods
      return n(`How many solutions has $\\${fn} ${k === 1 ? "" : k}x = ${val}$ in $[0, ${2 * periods}\\pi)$?`, 2 * k * periods, `Each period of length $\\tfrac{2\\pi}{${k}}$ has 2 solutions; there are ${k * periods} periods.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, R] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]] as const);
      return n(`Find the largest integer $c$ for which $${a}\\sin x + ${b}\\cos x = c$ has a solution.`, R, `$\\sqrt{${a * a} + ${b * b}} = ${R}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      const fn = r.pick(["sin", "tan"] as const);
      const v = fn === "sin" ? 2 * k : 2 * k;
      return n(`How many solutions has $\\${fn} ${k === 1 ? "" : k}x = 0$ in $[0, 2\\pi)$?`, v, fn === "sin" ? `$${k}x = m\\pi$ with $${k}x \\in [0, ${2 * k}\\pi)$: ${v} values.` : `$${k}x = m\\pi$ gives the same ${v} values.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { eq: "\\sin x = \\tfrac{\\sqrt3}{2}", right: "\\tfrac\\pi3, \\tfrac{2\\pi}3", wrong: "\\tfrac\\pi3" },
        { eq: "\\cos x = \\tfrac12", right: "\\tfrac\\pi3, \\tfrac{5\\pi}3", wrong: "\\tfrac\\pi3" },
        { eq: "\\tan x = -1", right: "\\tfrac{3\\pi}4, \\tfrac{7\\pi}4", wrong: "\\tfrac{3\\pi}4" },
        { eq: "\\sin x = -\\tfrac12", right: "\\tfrac{7\\pi}6, \\tfrac{11\\pi}6", wrong: "\\tfrac{7\\pi}6" },
      ]);
      return mcNumbers(
        `The solutions of $${v.eq}$ in $[0, 2\\pi)$ are`,
        { text: `$${v.right}$`, why: "Two solutions per period, by symmetry." },
        [{ text: `$${v.wrong}$ only`, why: "The other symmetric solution is missing.", misconception: "one-solution-trig" }],
      );
    },
  },
];
