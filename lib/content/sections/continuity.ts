import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Continuity at a point and on an interval; types of discontinuity (removable, jump, infinite, oscillatory); continuity of sums, products, quotients and composites; continuity of standard functions, |x| and [x]; making piecewise functions continuous; the intermediate value and extreme value theorems. */

const base: ConceptNode = {
  id: "continuity",
  title: "Continuity",
  summary: "A function is continuous at a when three things hold: f(a) is defined, the limit as x → a exists, and the two are equal. A graph you can draw without lifting the pen is continuous. Polynomials, sin, cos, eˣ and ln are continuous where defined, and so are their sums, products, quotients and composites. On a closed interval a continuous function takes every value between f(a) and f(b), so a sign change guarantees a root.",
  deps: ["limits"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "removable discontinuity", meaning: "The limit exists but differs from $f(a)$ (or $f(a)$ is undefined); redefining $f(a)$ fixes it." },
    { term: "jump discontinuity", meaning: "Both one-sided limits exist but differ, as for $[x]$ at an integer." },
    { term: "greatest integer function", meaning: "$[x]$ (also $\\lfloor x\\rfloor$): the largest integer $\\le x$; it jumps at every integer." },
  ],
  misconceptions: {
    "continuous-if-defined": "Thinks $f$ is continuous at $a$ whenever $f(a)$ is defined.",
    "ivt-converse": "Thinks that if $f(a)$ and $f(b)$ have the same sign, $f$ has no root between $a$ and $b$.",
  },
  steps: [
    {
      type: "motivate",
      title: "No sudden jumps",
      body: "Temperature during a day changes continuously: to go from 10° to 20° it must pass through 15°. That intuition, made precise, guarantees that equations have solutions and that maxima exist. In JEE, continuity questions ask you to choose constants so that the pieces of a function join up, or to locate the points where a function breaks.",
      realWorld: {
        title: "Root finding by bisection",
        body: "Calculators and solvers find roots by bisection: if $f(a) < 0 < f(b)$ and $f$ is continuous, check the midpoint, keep the half with a sign change, and repeat. Each step halves the interval, and continuity guarantees a root is trapped inside.",
      },
    },
    {
      type: "truth",
      statement: "$f$ is **continuous at $a$** iff $f(a)$ is defined, $\\lim_{x \\to a}f(x)$ exists, and $\\lim_{x \\to a}f(x) = f(a)$; for piecewise functions, check $\\lim_{x \\to a^-}f = \\lim_{x \\to a^+}f = f(a)$. Sums, differences, products, quotients (where the denominator $\\ne 0$) and composites of continuous functions are continuous. **Intermediate value theorem**: if $f$ is continuous on $[a, b]$, it takes every value between $f(a)$ and $f(b)$; in particular, $f(a)f(b) < 0$ forces a root in $(a, b)$. **Extreme value theorem**: a continuous function on a closed interval attains a maximum and a minimum.",
      body: "Discontinuities come in kinds: **removable** (limit exists, but $\\ne f(a)$ or $f(a)$ undefined), **jump** (unequal one-sided limits), **infinite** (a vertical asymptote, as $\\tfrac1x$ at 0), and **oscillatory** ($\\sin\\tfrac1x$ at 0). $\\lvert x\\rvert$ is continuous everywhere; $[x]$ is discontinuous at every integer, continuous from the right there. The IVT's converse fails: the same sign at both ends doesn't rule out roots, since $f$ could cross zero twice. To make a piecewise function continuous, equate the one-sided limits with the value at each joint and solve for the constants. Whether the joined function is also smooth is the question of §{differentiability}.",
    },
    {
      type: "predict",
      misconception: "continuous-if-defined",
      item: {
        kind: "mc",
        id: "cty-predict-1",
        prompt: "$f(x) = \\dfrac{x^2 - 1}{x - 1}$ for $x \\ne 1$, and $f(1) = 3$. Is $f$ continuous at 1?",
        options: [
          { id: "a", text: "No: the limit is 2, but $f(1) = 3$", correct: true, why: "Limit and value must agree." },
          { id: "b", text: "Yes: $f(1)$ is defined", misconception: "continuous-if-defined", why: "Being defined is only the first of three conditions." },
          { id: "c", text: "No: $f(1)$ is undefined", why: "It is defined, as 3." },
        ],
      },
      reveal: {
        body: "For $x \\ne 1$, $f(x) = x + 1$, so $\\lim_{x \\to 1}f(x) = 2$. The value $f(1) = 3$ sits off the line: the graph has a hole at $(1, 2)$ and an isolated dot at $(1, 3)$. This is a removable discontinuity; redefining $f(1) = 2$ makes $f$ continuous.",
      },
      resolve: {
        kind: "mc",
        id: "cty-resolve-1",
        prompt: "Is $[x]$ (the greatest integer function) continuous at $x = 2$?",
        options: [
          { id: "a", text: "No: the left limit is 1 and the right limit is 2", correct: true, why: "A jump discontinuity." },
          { id: "b", text: "Yes, because $[2] = 2$ is defined", misconception: "continuous-if-defined", why: "The limit must exist and equal the value." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cty-check-1",
        prompt: "$f(x) = x^3 - 4x + 1$. Which interval must contain a root?",
        options: [
          { id: "a", text: "$(0, 1)$", correct: true, why: "$f(0) = 1 > 0$ and $f(1) = -2 < 0$." },
          { id: "b", text: "$(-1, 0)$", why: "$f(-1) = 4$ and $f(0) = 1$: no sign change, so the IVT guarantees nothing." },
          { id: "c", text: "$(1, 1.5)$", why: "$f(1) = -2$ and $f(1.5) = -1.625$: no sign change." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cty-check-2",
        prompt: "$f(x) = x^2 - \\tfrac14$ has $f(-1) = f(1) = \\tfrac34 > 0$. On $(-1, 1)$, $f$",
        options: [
          { id: "a", text: "has roots anyway, at $x = \\pm\\tfrac12$", correct: true, why: "It dips below zero and comes back." },
          { id: "b", text: "has no roots, since the end values have the same sign", misconception: "ivt-converse", why: "The IVT only guarantees roots; it never rules them out." },
          { id: "c", text: "is discontinuous", why: "Polynomials are continuous." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gradient-based training needs the loss to be continuous in the parameters; accuracy, a step function of the outputs, is discontinuous, which is why models are trained on smooth surrogate losses (§{loss-functions}) and only evaluated on accuracy. The ReLU $\\max(0, x)$ is continuous but has a corner at 0.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cty-produce-1", prompt: "$f(x) = kx + 1$ for $x \\le 2$ and $x^2 - 1$ for $x > 2$. Find $k$ making $f$ continuous.", answer: 1, explain: "$2k + 1 = 3$." },
        { kind: "number", id: "cty-produce-2", prompt: "$f(x) = \\dfrac{\\sin 4x}x$ for $x \\ne 0$ and $f(0) = k$. Find $k$ making $f$ continuous at 0.", answer: 4, explain: "The limit is 4." },
        {
          kind: "mc",
          id: "cty-produce-3",
          prompt: "$f(x) = \\dfrac{\\lvert x\\rvert}x$ for $x \\ne 0$ and $f(0) = 1$. At 0, $f$ is",
          options: [
            { id: "a", text: "discontinuous: the one-sided limits are $-1$ and $1$", correct: true, why: "A jump." },
            { id: "b", text: "continuous, because $f(0)$ is defined", misconception: "continuous-if-defined", why: "The two-sided limit doesn't exist." },
          ],
        },
        {
          kind: "mc",
          id: "cty-produce-4",
          prompt: "$f$ is continuous on $[0, 3]$ with $f(0) = 2$ and $f(3) = 2$. Then $f$",
          options: [
            { id: "a", text: "may or may not have a zero in $(0, 3)$", correct: true, why: "Equal end values give no guarantee either way." },
            { id: "b", text: "has no zero in $(0, 3)$", misconception: "ivt-converse", why: "It could dip below zero and return." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cty-review-1", prompt: "How many points of discontinuity does $[x]$ have in the open interval $(0, 4)$?", answer: 3, explain: "At 1, 2 and 3." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "continuity on an interval",
      body: "$f$ is continuous on $(a, b)$ if it is continuous at every point there, and on $[a, b]$ if additionally $\\lim_{x \\to a^+}f = f(a)$ and $\\lim_{x \\to b^-}f = f(b)$. $\\sqrt x$ is continuous on $[0, \\infty)$ in this sense.",
    },
    {
      type: "definition",
      term: "composites",
      body: "If $g$ is continuous at $a$ and $f$ at $g(a)$, then $f \\circ g$ is continuous at $a$ (§{composition-inverse}), so limits pass inside continuous functions: $\\lim e^{g(x)} = e^{\\lim g(x)}$. This is how $\\lvert f\\rvert$, $\\sin(f)$ and $e^f$ inherit continuity from $f$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the intermediate value theorem",
      statement: "If $f$ is continuous on $[a, b]$ and $k$ lies between $f(a)$ and $f(b)$, then $f(c) = k$ for some $c \\in [a, b]$.",
      proof: ["Let $c = \\sup\\{x \\in [a, b] : f(x) < k\\}$ (taking $f(a) < k < f(b)$).", "Continuity rules out both $f(c) < k$ (points just right of $c$ would also have $f < k$) and $f(c) > k$ (points just left would too), so $f(c) = k$."],
    },
    {
      type: "theorem",
      name: "the extreme value theorem",
      statement: "A function continuous on a closed bounded interval $[a, b]$ attains a greatest and a least value there.",
      proof: ["A standard result of real analysis, relying on the completeness of the real numbers.", "Both hypotheses matter: $\\tfrac1x$ on $(0, 1]$ and $x$ on $[0, 1)$ attain no maximum."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "algebra of continuous functions",
      statement: "If $f$ and $g$ are continuous at $a$, so are $f \\pm g$, $fg$, $kf$, and $f/g$ when $g(a) \\ne 0$.",
      proof: ["Each follows from the corresponding rule for limits (§{limits}): e.g. $\\lim fg = \\lim f \\cdot \\lim g = f(a)g(a)$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$f(x) = \\dfrac{x^2 - 9}{x - 3}$ for $x \\ne 3$ and $f(3) = k$. Find $k$ for continuity.",
      solution: ["For $x \\ne 3$, $f(x) = x + 3$, so the limit at 3 is 6.", "Continuity needs $k = 6$."],
      result: "$k = 6$.",
    },
    {
      type: "example",
      level: 2,
      title: "two constants",
      problem: "$f(x) = ax + 1$ for $x < 1$, $f(1) = 3$, and $f(x) = x^2 + b$ for $x > 1$. Find $a$ and $b$ for continuity at 1.",
      solution: ["Left limit $a + 1 = 3$, so $a = 2$.", "Right limit $1 + b = 3$, so $b = 2$."],
      result: "$a = b = 2$.",
    },
    {
      type: "example",
      level: 3,
      title: "locating a root",
      problem: "Show that $x^3 - 4x + 1 = 0$ has a root between 0 and 1.",
      solution: ["$f(x) = x^3 - 4x + 1$ is a polynomial, so continuous on $[0, 1]$.", "$f(0) = 1 > 0$ and $f(1) = -2 < 0$; by the IVT, $f(c) = 0$ for some $c \\in (0, 1)$."],
      result: "A root lies in $(0, 1)$.",
    },
  ],
  pitfalls: [
    { wrong: "Defined at $a$ means continuous at $a$.", right: "Also need the limit to exist and equal $f(a)$." },
    { wrong: "Same sign at both ends means no root.", right: "The IVT guarantees roots on a sign change; it never excludes them." },
    { wrong: "Check only one side at a joint.", right: "Both one-sided limits must equal the value." },
  ],
  formulas: [
    { label: "Continuity", tex: "\\lim_{x \\to a^-}f = \\lim_{x \\to a^+}f = f(a)" },
    { label: "IVT", tex: "f(a)f(b) < 0 \\Rightarrow \\exists c \\in (a, b): f(c) = 0" },
  ],
  exercises: [
    ex(1, num("ctyx-ex-1", "$f(x) = \\dfrac{x^2 - 16}{x - 4}$ for $x \\ne 4$, $f(4) = k$. Find $k$ for continuity.", 8, "$x + 4 \\to 8$."), ["$8$."]),
    ex(1, num("ctyx-ex-2", "$f(x) = \\dfrac{\\sin 3x}x$ for $x \\ne 0$, $f(0) = k$. Find $k$ for continuity.", 3, "Standard limit."), ["$3$."]),
    ex(2, num("ctyx-ex-3", "How many points of discontinuity does $[x]$ have in $(0, 5)$?", 4, "1, 2, 3, 4."), ["$4$."]),
    ex(2, num("ctyx-ex-4", "$f(x) = kx^2$ for $x \\le 2$ and $3x + 4$ for $x > 2$. Find $k$ for continuity.", 2.5, "$4k = 10$."), ["$2.5$."]),
    ex(2, num("ctyx-ex-5", "$f(x) = \\dfrac{1 - \\cos x}{x^2}$ for $x \\ne 0$, $f(0) = k$. Find $k$ for continuity.", 0.5, "Standard limit."), ["$\\tfrac12$."]),
    ex(3, num("ctyx-ex-6", "$f(x) = x^2 + a$ for $x < 2$ and $ax + 1$ for $x \\ge 2$. Find $a$ for continuity.", 3, "$4 + a = 2a + 1$."), ["$3$."]),
    ex(3, num("ctyx-ex-7", "$f(x) = \\dfrac{e^{2x} - 1}x$ for $x \\ne 0$, $f(0) = k$. Find $k$ for continuity.", 2, "Standard limit."), ["$2$."]),
    ex(3, mc("ctyx-ex-8", "$f(x) = x\\sin\\dfrac1x$ for $x \\ne 0$ and $f(0) = 0$. At 0, $f$ is", ["continuous", "$\\lvert f(x)\\rvert \\le \\lvert x\\rvert \\to 0 = f(0)$."], [["discontinuous, because $\\sin\\tfrac1x$ oscillates", "The factor $x$ squeezes it."], ["undefined", "$f(0) = 0$ is given."]]), ["Sandwich: the limit is 0."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-7, 7);
      return n(`$f(x) = \\dfrac{x^2 - ${a * a}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}$ for $x \\ne ${a}$ and $f(${a}) = k$. Find $k$ for continuity.`, 2 * a, `$f(x) = x + ${a}$ away from ${a}, so $k = ${2 * a}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([1, 2, 4, 5]);
      const c1 = r.nonzero(-5, 5);
      const c2 = r.nonzero(-5, 5);
      const k = (a * a + c2 - c1) / a;
      return n(`$f(x) = kx ${c1 < 0 ? "-" : "+"} ${Math.abs(c1)}$ for $x \\le ${a}$ and $x^2 ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)}$ for $x > ${a}$. Find $k$ for continuity (3 decimals).`, Math.round(k * 1000) / 1000, `$${a}k ${c1 < 0 ? "-" : "+"} ${Math.abs(c1)} = ${a * a + c2}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(2, 9);
      const fn = r.pick([["\\sin", 1], ["\\tan", 1], ["e^{", 0]] as const);
      const expr = fn[1] ? `\\dfrac{${fn[0]} ${p}x}x` : `\\dfrac{e^{${p}x} - 1}x`;
      return n(`$f(x) = ${expr}$ for $x \\ne 0$ and $f(0) = k$. Find $k$ for continuity.`, p, `The limit at 0 is ${p}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.int(-3, 4);
      return mcNumbers(
        `Is $[x]$ continuous at $x = ${k}$?`,
        { text: `No: the left limit is ${k - 1} and the right limit is ${k}`, why: "A jump at every integer." },
        [{ text: `Yes, because $[${k}] = ${k}$ is defined`, why: "The two-sided limit doesn't exist.", misconception: "continuous-if-defined" }, { text: "Yes: $[x]$ is continuous everywhere", why: "It jumps at integers." }],
      );
    },
  },
];
