import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Increasing and decreasing functions; the derivative test for monotonicity; strictly increasing functions whose derivative vanishes at isolated points; intervals of increase and decrease by sign charts; conditions for monotonicity on all of ℝ; proving inequalities and comparing numbers with monotonic functions. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "monotonicity",
  title: "Increasing & decreasing functions",
  summary: "A function is increasing on an interval if larger inputs give larger outputs. The derivative decides it: f′ > 0 on an interval makes f strictly increasing there, and f′ < 0 strictly decreasing. A derivative that vanishes only at isolated points doesn't spoil this, so x³ is strictly increasing. Sign charts of f′ split the line into intervals of increase and decrease, and monotonic functions prove inequalities: if g(0) = 0 and g′ > 0, then g(x) > 0 for x > 0.",
  deps: ["tangents-normals"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "strictly increasing", meaning: "$x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$ on the interval; \"non-decreasing\" allows $f(x_1) = f(x_2)$." },
    { term: "critical point", meaning: "A point where $f'(x) = 0$ or $f'$ doesn't exist; monotonicity can change only there (or at discontinuities)." },
    { term: "sign chart", meaning: "A number line marked with the critical points and the sign of $f'$ on each interval between them." },
  ],
  misconceptions: {
    "strict-needs-positive-derivative": "Thinks a strictly increasing function must have $f'(x) > 0$ at every point, so a single zero of $f'$ breaks strict monotonicity.",
    "monotonic-from-endpoints": "Concludes $f$ is increasing on $[a, b]$ just because $f(b) > f(a)$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Uphill and downhill",
      body: "Where is a profit function rising? On which intervals is a population shrinking? The sign of the derivative answers at once, and that turns monotonicity into a tool: proving inequalities like $e^x \\ge 1 + x$, showing equations have exactly one root, and deciding which of $e^\\pi$ and $\\pi^e$ is larger without a calculator.",
      realWorld: {
        title: "Monotone constraints",
        body: "Credit-scoring models are often required to be monotone in some inputs (a higher income should never lower the score). Gradient-boosting libraries enforce this by constraining each feature's effect to be non-decreasing, checked exactly as here, by the sign of a derivative or of successive differences.",
      },
    },
    {
      type: "truth",
      statement: "Let $f$ be continuous on $[a, b]$ and differentiable on $(a, b)$. If $f' > 0$ on $(a, b)$, $f$ is **strictly increasing** on $[a, b]$; if $f' < 0$, strictly decreasing; if $f' = 0$, constant. More generally, if $f' \\ge 0$ and $f' = 0$ only at isolated points, $f$ is still strictly increasing (e.g. $x^3$, or $x - \\sin x$). **Method**: find the critical points, mark them on a line, test the sign of $f'$ on each interval. **Monotonic on all of ℝ**: for $f'(x) = px^2 + qx + r$ with $p > 0$, $f' \\ge 0$ everywhere iff $q^2 - 4pr \\le 0$ (§{quadratics}).",
      body: "Inequalities: to show $g(x) > h(x)$ for $x > 0$, let $\\varphi = g - h$; if $\\varphi(0) = 0$ and $\\varphi' > 0$ for $x > 0$, then $\\varphi(x) > 0$. This gives $\\sin x < x$, $\\ln(1 + x) < x$ and $e^x > 1 + x$ for $x > 0$. A strictly monotonic function is one-one, so an equation $f(x) = k$ has at most one root, and exactly one if $k$ is between the end values (§{continuity}). Comparing $a^b$ with $b^a$: $\\dfrac{\\ln x}x$ increases on $(0, e)$ and decreases on $(e, \\infty)$. The values of $f$ at the ends say nothing about monotonicity in between: $x^2$ on $[-1, 2]$ falls and then rises.",
    },
    {
      type: "predict",
      misconception: "strict-needs-positive-derivative",
      item: {
        kind: "mc",
        id: "mon-predict-1",
        prompt: "$f(x) = x^3$ has $f'(0) = 0$. On $\\mathbb R$, $f$ is",
        options: [
          { id: "a", text: "strictly increasing", correct: true, why: "$f' > 0$ except at the single point 0." },
          { id: "b", text: "not strictly increasing, because $f'(0) = 0$", misconception: "strict-needs-positive-derivative", why: "If $x_1 < x_2$ then $x_1^3 < x_2^3$; one flat point doesn't create a flat stretch." },
          { id: "c", text: "decreasing near 0", why: "$f' \\ge 0$ everywhere." },
        ],
      },
      reveal: {
        body: "For $x_1 < x_2$, $x_1^3 < x_2^3$: the definition of strictly increasing holds. The tangent is momentarily horizontal at 0, but on any interval, however small, $f' > 0$ except at one point, so $f$ still rises. Strict monotonicity fails only when $f' = 0$ on a whole interval.",
      },
      resolve: {
        kind: "mc",
        id: "mon-resolve-1",
        prompt: "$f(x) = x - \\sin x$ has $f'(x) = 1 - \\cos x \\ge 0$, with $f' = 0$ at $x = 0, \\pm2\\pi, \\dots$. Then $f$ is",
        options: [
          { id: "a", text: "strictly increasing on $\\mathbb R$", correct: true, why: "The zeros of $f'$ are isolated." },
          { id: "b", text: "not strictly increasing, since $f'(0) = 0$", misconception: "strict-needs-positive-derivative", why: "Isolated zeros of $f'$ don't stop strict increase." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mon-check-1",
        prompt: "$f(x) = x^2$ has $f(2) = 4 > f(-1) = 1$. On $[-1, 2]$, $f$ is",
        options: [
          { id: "a", text: "not monotonic: it decreases on $[-1, 0]$ and increases on $[0, 2]$", correct: true, why: "$f' = 2x$ changes sign at 0." },
          { id: "b", text: "increasing, because $f(2) > f(-1)$", misconception: "monotonic-from-endpoints", why: "End values don't show what happens in between." },
          { id: "c", text: "decreasing", why: "It rises on $[0, 2]$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mon-check-2",
        prompt: "$f(x) = x^3 - 3x$ is increasing on",
        options: [
          { id: "a", text: "$(-\\infty, -1]$ and $[1, \\infty)$", correct: true, why: "$f' = 3(x^2 - 1) \\ge 0$ for $\\lvert x\\rvert \\ge 1$." },
          { id: "b", text: "$[-1, 1]$", why: "There $f' \\le 0$: it decreases." },
          { id: "c", text: "all of $\\mathbb R$", why: "$f'(0) = -3 < 0$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Activation functions like the sigmoid and tanh are strictly increasing, so they preserve the order of their inputs; the ROC curve (§{roc-auc}) depends only on the ranking of scores, which is why any strictly increasing transformation of a classifier's scores leaves its AUC unchanged.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mon-produce-1", prompt: "$f(x) = 2x^3 - 9x^2 + 12x$ is decreasing exactly on $[a, b]$. Find $a + b$.", answer: 3, explain: "$f' = 6(x - 1)(x - 2) \\le 0$ on $[1, 2]$." },
        { kind: "number", id: "mon-produce-2", prompt: "Find the least $k$ for which $f(x) = kx - \\sin x$ is increasing on $\\mathbb R$.", answer: 1, explain: "$k - \\cos x \\ge 0$ for all $x$ needs $k \\ge 1$." },
        {
          kind: "mc",
          id: "mon-produce-3",
          prompt: "$f(x) = (x - 1)^3$ on $\\mathbb R$ is",
          options: [
            { id: "a", text: "strictly increasing", correct: true, why: "A shifted $x^3$." },
            { id: "b", text: "not strictly increasing, because $f'(1) = 0$", misconception: "strict-needs-positive-derivative", why: "The zero of $f'$ is isolated." },
          ],
        },
        {
          kind: "mc",
          id: "mon-produce-4",
          prompt: "$f$ is continuous with $f(0) = 0$ and $f(3) = 5$. On $[0, 3]$, $f$ is",
          options: [
            { id: "a", text: "not necessarily increasing", correct: true, why: "It could rise above 5 and come back, or dip first." },
            { id: "b", text: "increasing", misconception: "monotonic-from-endpoints", why: "End values alone don't determine monotonicity." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mon-review-1", prompt: "$f(x) = x^2 - 4x$ is decreasing on $(-\\infty, c]$. Find $c$.", answer: 2, explain: "$f' = 2x - 4 \\le 0$ for $x \\le 2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "monotonic on an interval",
      body: "$f$ is **increasing** (non-decreasing) on $I$ if $x_1 < x_2 \\Rightarrow f(x_1) \\le f(x_2)$, **strictly** increasing with $<$; similarly decreasing. Monotonicity is a property of an interval, not a point: \"increasing at $a$\" means increasing on some interval around $a$.",
    },
    {
      type: "definition",
      term: "comparing numbers",
      body: "To compare $e^\\pi$ and $\\pi^e$, take logs: compare $\\pi$ and $e\\ln\\pi$, i.e. $\\dfrac{\\ln e}e$ and $\\dfrac{\\ln\\pi}\\pi$. Since $\\dfrac{\\ln x}x$ has derivative $\\dfrac{1 - \\ln x}{x^2} < 0$ for $x > e$, $\\dfrac{\\ln\\pi}\\pi < \\dfrac1e$, so $\\pi^e < e^\\pi$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the monotonicity test",
      statement: "If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$ and $f' > 0$ there, then $f$ is strictly increasing on $[a, b]$.",
      proof: ["For $a \\le x_1 < x_2 \\le b$, the mean value theorem (§{mean-value-theorems}) gives $f(x_2) - f(x_1) = f'(c)(x_2 - x_1)$ for some $c \\in (x_1, x_2)$.", "Both factors are positive, so $f(x_2) > f(x_1)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "isolated zeros of f′",
      statement: "If $f' \\ge 0$ on an interval and $f' = 0$ only at finitely many points, then $f$ is strictly increasing there.",
      proof: ["Between consecutive zeros $f' > 0$, so $f$ strictly increases on each piece, including its endpoints by continuity.", "Chaining the pieces, $f$ strictly increases on the whole interval."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "e^x ≥ 1 + x",
      statement: "$e^x \\ge 1 + x$ for all real $x$, with equality only at $x = 0$.",
      proof: ["$\\varphi(x) = e^x - 1 - x$ has $\\varphi' = e^x - 1$, negative for $x < 0$ and positive for $x > 0$.", "So $\\varphi$ decreases to $\\varphi(0) = 0$ and then increases: $\\varphi \\ge 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the intervals of increase and decrease of $f(x) = x^3 - 3x^2 - 9x + 5$.",
      solution: ["$f' = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$.", "$f' > 0$ for $x < -1$ and $x > 3$, $f' < 0$ on $(-1, 3)$."],
      result: "Increasing on $(-\\infty, -1]$ and $[3, \\infty)$; decreasing on $[-1, 3]$.",
    },
    {
      type: "example",
      level: 2,
      title: "monotonic everywhere",
      problem: "For which $a$ is $f(x) = x^3 + ax^2 + 3x + 1$ increasing on $\\mathbb R$?",
      solution: ["$f' = 3x^2 + 2ax + 3 \\ge 0$ for all $x$ iff its discriminant $4a^2 - 36 \\le 0$.", "So $-3 \\le a \\le 3$ (at $a = \\pm3$, $f'$ has a single zero, which is allowed)."],
      result: "$\\lvert a\\rvert \\le 3$.",
    },
    {
      type: "example",
      level: 3,
      title: "an inequality",
      problem: "Show that $\\ln(1 + x) < x$ for $x > 0$.",
      solution: ["$\\varphi(x) = x - \\ln(1 + x)$ has $\\varphi(0) = 0$ and $\\varphi'(x) = 1 - \\dfrac1{1 + x} = \\dfrac x{1 + x} > 0$ for $x > 0$.", "So $\\varphi$ is strictly increasing on $[0, \\infty)$ and $\\varphi(x) > 0$ for $x > 0$."],
      result: "$\\ln(1 + x) < x$.",
    },
  ],
  pitfalls: [
    { wrong: "One zero of $f'$ breaks strict increase.", right: "Only a whole interval of zeros does." },
    { wrong: "$f(b) > f(a)$ means increasing on $[a, b]$.", right: "Check the sign of $f'$ throughout." },
    { wrong: "Forget points where $f'$ is undefined.", right: "They are critical points too (e.g. $\\lvert x\\rvert$ at 0)." },
  ],
  formulas: [
    { label: "Test", tex: "f' > 0 \\Rightarrow \\text{strictly increasing}" },
    { label: "Everywhere", tex: "px^2 + qx + r \\ge 0\\ \\forall x \\iff p > 0,\\ q^2 \\le 4pr" },
    { label: "Inequalities", tex: "\\sin x < x,\\ \\ln(1 + x) < x\\ (x > 0)" },
  ],
  exercises: [
    ex(1, num("monx-ex-1", "$f(x) = x^2 - 6x$ is increasing on $[c, \\infty)$. Find $c$.", 3, "$2x - 6 \\ge 0$."), ["$3$."]),
    ex(1, num("monx-ex-2", "$f(x) = 2x^3 - 9x^2 + 12x + 1$ is decreasing on $[a, b]$. Find $b$.", 2, "$f' = 6(x - 1)(x - 2)$."), ["$2$."]),
    ex(2, num("monx-ex-3", "$f(x) = x^3 - 12x$ increases on $(-\\infty, -p]$ and $[p, \\infty)$. Find $p$.", 2, "$3x^2 - 12 \\ge 0$."), ["$2$."]),
    ex(2, num("monx-ex-4", "Find the largest $a$ for which $x^3 + ax^2 + 3x + 1$ is increasing on $\\mathbb R$.", 3, "$4a^2 \\le 36$."), ["$3$."]),
    ex(2, num("monx-ex-5", "Find the least $k$ for which $kx - \\sin x$ is increasing on $\\mathbb R$.", 1, "$k \\ge \\cos x$ for all $x$."), ["$1$."]),
    ex(3, dp("monx-ex-6", "$f(x) = \\dfrac{\\ln x}x$ is increasing on $(0, c]$. Find $c$.", Math.E, "$f' = \\dfrac{1 - \\ln x}{x^2}$."), ["$c = e \\approx 2.718$."]),
    ex(3, num("monx-ex-7", "$f(x) = xe^{-x}$ is increasing on $(-\\infty, c]$. Find $c$.", 1, "$f' = (1 - x)e^{-x}$."), ["$1$."]),
    ex(3, mc("monx-ex-8", "Which is larger, $e^\\pi$ or $\\pi^e$?", ["$e^\\pi$", "$\\tfrac{\\ln x}x$ decreases for $x > e$, so $\\tfrac{\\ln\\pi}\\pi < \\tfrac1e$."], [["$\\pi^e$", "Compare $\\tfrac{\\ln\\pi}\\pi$ with $\\tfrac{\\ln e}e$."], ["They are equal", "Equality would need $\\tfrac{\\ln\\pi}\\pi = \\tfrac{\\ln e}e$, but $\\tfrac{\\ln x}x$ is strictly decreasing beyond $e$."]]), ["$e^\\pi \\approx 23.14 > \\pi^e \\approx 22.46$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });
/** A linear factor $(x - p)$ with the sign folded in. */
const lf = (p: number) => (p === 0 ? "x" : `(x ${p < 0 ? "+" : "-"} ${Math.abs(p)})`);
/** A signed term such as " - 6x^2", or "" when the coefficient is 0. */
const term = (k: number, v: string) => (k === 0 ? "" : ` ${k < 0 ? "-" : "+"} ${Math.abs(k)}${v}`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const p = r.int(-4, 3);
      const q = p + r.int(1, 4);
      const want = r.pick(["a", "b", "sum"] as const);
      const v = want === "a" ? p : want === "b" ? q : p + q;
      return n(`$f(x) = 2x^3${term(-3 * (p + q), "x^2")}${term(6 * p * q, "x")}$ is decreasing exactly on $[a, b]$. Find ${want === "sum" ? "$a + b$" : `$${want}$`}.`, v, `$f' = 6${lf(p)}${lf(q)}$, negative between the roots ${p} and ${q}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      return n(`Find the largest $a$ for which $f(x) = x^3 + ax^2 + ${3 * k * k}x + 1$ is increasing on $\\mathbb R$.`, 3 * k, `$f' = 3x^2 + 2ax + ${3 * k * k} \\ge 0$ needs $4a^2 \\le 12 \\times ${3 * k * k}$, so $\\lvert a\\rvert \\le ${3 * k}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-4, 4);
      const p = r.nonzero(-6, 6);
      return n(`$f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2${term(-2 * a * p, "x")}$ is ${a > 0 ? "decreasing" : "increasing"} on $(-\\infty, c]$. Find $c$.`, p, `$f' = ${2 * a}${lf(p)}$ changes sign at ${p}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.nonzero(-4, 4);
      const k = r.pick([3, 5]);
      return mcNumbers(
        `$f(x) = ${lf(p)}^{${k}}$ on $\\mathbb R$ is`,
        { text: "strictly increasing", why: `$f' = ${k}${lf(p)}^{${k - 1}} \\ge 0$, zero only at ${p}.` },
        [{ text: `not strictly increasing, because $f'(${p}) = 0$`, why: "An isolated zero of $f'$ doesn't stop strict increase.", misconception: "strict-needs-positive-derivative" }, { text: "decreasing", why: `$f' \\ge 0$.` }],
      );
    },
  },
];
