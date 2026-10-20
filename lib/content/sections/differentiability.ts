import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Derivative from first principles; left and right derivatives; differentiability implies continuity but not conversely; corners, cusps and vertical tangents; differentiability of piecewise functions, |f(x)| and [x]; derivatives of x², √x, sin x from first principles. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "differentiability",
  title: "Differentiability",
  summary: "The derivative f′(a) = lim (f(a + h) − f(a))/h as h → 0 is the slope of the tangent at a. It exists only when the left and right derivatives agree. Differentiable functions are continuous, but not conversely: |x| is continuous at 0 with a corner there, slopes −1 and 1. For a piecewise function to be differentiable at a joint, the pieces must meet (continuity) and meet with the same slope.",
  deps: ["continuity"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "first principles", meaning: "Computing $f'(a) = \\lim_{h \\to 0}\\dfrac{f(a + h) - f(a)}h$ directly from the definition." },
    { term: "left and right derivatives", meaning: "$Lf'(a)$ and $Rf'(a)$: the same limit with $h \\to 0^-$ or $h \\to 0^+$." },
    { term: "corner", meaning: "A point where both one-sided derivatives exist but differ, like $\\lvert x\\rvert$ at 0." },
  ],
  misconceptions: {
    "continuous-implies-differentiable": "Thinks every function continuous at a point is differentiable there.",
    "derivative-match-only": "Declares a piecewise function differentiable at a joint because the pieces' derivative formulas agree there, without checking that the pieces meet.",
  },
  steps: [
    {
      type: "motivate",
      title: "Smooth, not just connected",
      body: "A road can be continuous yet have a sharp bend where the direction changes instantly. Differentiability asks for more than an unbroken graph: a well-defined tangent direction at every point. JEE tests this through modulus functions, the greatest integer function, and piecewise functions whose constants must be chosen so the pieces join smoothly.",
      realWorld: {
        title: "Track transitions",
        body: "Railway engineers never join a straight track directly to a circular curve: although the track would be continuous, the sudden change in curvature jolts passengers. Transition curves make not just the position and direction but also the curvature change smoothly.",
      },
    },
    {
      type: "truth",
      statement: "$f'(a) = \\lim_{h \\to 0}\\dfrac{f(a + h) - f(a)}h$ when the limit exists; it exists iff the left derivative $\\lim_{h \\to 0^-}$ and right derivative $\\lim_{h \\to 0^+}$ exist and are equal. **Differentiable at $a$ ⇒ continuous at $a$**; the converse is false. Failures: a **corner** (one-sided derivatives differ, $\\lvert x\\rvert$ at 0), a **cusp** or **vertical tangent** (infinite slope, $x^{2/3}$ or $x^{1/3}$ at 0), or a discontinuity. A piecewise function is differentiable at a joint iff it is continuous there and the one-sided derivatives agree.",
      body: "$\\lvert f(x)\\rvert$ is typically non-differentiable where $f$ crosses zero with nonzero slope: $\\lvert x^2 - 4\\rvert$ has corners at $\\pm2$, but $\\lvert x^3\\rvert$ is differentiable at 0 because $x^3$ touches zero with slope 0. $[x]$ is not even continuous at integers, so not differentiable there. Sums, products, quotients and composites of differentiable functions are differentiable (§{differentiation-methods}). From first principles: $\\dfrac{(a + h)^2 - a^2}h = 2a + h \\to 2a$, and $\\dfrac{\\sin(a + h) - \\sin a}h = \\cos a\\dfrac{\\sin h}h - \\sin a\\dfrac{1 - \\cos h}h \\to \\cos a$ using §{limits}. Geometric meaning: §{derivative}.",
    },
    {
      type: "predict",
      misconception: "continuous-implies-differentiable",
      item: {
        kind: "mc",
        id: "dif-predict-1",
        prompt: "$f(x) = \\lvert x - 2\\rvert$ at $x = 2$ is",
        options: [
          { id: "a", text: "continuous but not differentiable", correct: true, why: "Left derivative $-1$, right derivative $1$." },
          { id: "b", text: "differentiable, because it is continuous", misconception: "continuous-implies-differentiable", why: "Continuity doesn't give a single tangent slope." },
          { id: "c", text: "neither continuous nor differentiable", why: "There's no break in the graph." },
        ],
      },
      reveal: {
        body: "From the right, $\\dfrac{\\lvert h\\rvert}h = 1$; from the left, $\\dfrac{\\lvert h\\rvert}h = -1$. Two different one-sided slopes, so no derivative: the graph is a V with a corner at $x = 2$. Continuity only says the graph is unbroken; differentiability says it is smooth.",
      },
      resolve: {
        kind: "mc",
        id: "dif-resolve-1",
        prompt: "At how many points is $f(x) = \\lvert x\\rvert + \\lvert x - 1\\rvert$ not differentiable?",
        options: [
          { id: "a", text: "2: at $x = 0$ and $x = 1$", correct: true, why: "Each modulus has a corner." },
          { id: "b", text: "None, because $f$ is continuous everywhere", misconception: "continuous-implies-differentiable", why: "Corners are continuous but not differentiable." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dif-check-1",
        prompt: "$f(x) = x^2$ for $x \\le 1$ and $2x$ for $x > 1$. At $x = 1$, $f$ is",
        options: [
          { id: "a", text: "not differentiable: it isn't even continuous ($1 \\ne 2$)", correct: true, why: "The pieces don't meet." },
          { id: "b", text: "differentiable: both pieces have slope 2 at $x = 1$", misconception: "derivative-match-only", why: "Matching slopes are useless if the pieces don't join." },
          { id: "c", text: "differentiable, since each piece is a polynomial", why: "Check the joint." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dif-check-2",
        prompt: "From first principles, the derivative of $x^2$ at $x = 3$ is",
        options: [
          { id: "a", text: "6", correct: true, why: "$\\dfrac{(3 + h)^2 - 9}h = 6 + h \\to 6$." },
          { id: "b", text: "9", why: "That is $f(3)$." },
          { id: "c", text: "3", why: "Expand $(3 + h)^2$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "ReLU $\\max(0, x)$ is continuous but not differentiable at 0, and the L1 penalty $\\lvert w\\rvert$ has the same corner; frameworks use a subgradient there (any slope between the one-sided derivatives). That corner is exactly what makes lasso set weights exactly to zero (§{regularization}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dif-produce-1", prompt: "At how many points is $f(x) = \\lvert x^2 - 4\\rvert$ not differentiable?", answer: 2, explain: "Corners at $x = \\pm2$." },
        { kind: "number", id: "dif-produce-2", prompt: "$f(x) = x^2$ for $x \\le 1$ and $ax + b$ for $x > 1$ is differentiable everywhere. Find $a$.", answer: 2, explain: "Slopes match: $a = 2$ (and $b = -1$ for continuity)." },
        {
          kind: "mc",
          id: "dif-produce-3",
          prompt: "$f(x) = \\lvert\\sin x\\rvert$ at $x = 0$ is",
          options: [
            { id: "a", text: "not differentiable", correct: true, why: "One-sided derivatives $-1$ and $1$." },
            { id: "b", text: "differentiable, since it is continuous", misconception: "continuous-implies-differentiable", why: "It has a corner at 0." },
          ],
        },
        {
          kind: "mc",
          id: "dif-produce-4",
          prompt: "$f(x) = 2x + 1$ for $x \\le 0$ and $2x + 3$ for $x > 0$. At 0, $f$ is",
          options: [
            { id: "a", text: "not differentiable, because it jumps", correct: true, why: "Left value 1, right limit 3." },
            { id: "b", text: "differentiable: both sides have slope 2", misconception: "derivative-match-only", why: "A jump rules out a derivative." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dif-review-1", prompt: "From first principles, find the derivative of $x^3$ at $x = 1$.", answer: 3, explain: "$\\dfrac{(1 + h)^3 - 1}h = 3 + 3h + h^2 \\to 3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "one-sided derivatives at a joint",
      body: "For $f = g$ on the left of $a$ and $f = k$ on the right, with $f$ continuous at $a$: $Lf'(a) = g'(a)$ and $Rf'(a) = k'(a)$ (when $g$, $k$ are differentiable). So, **after** checking continuity, compare the derivatives of the two pieces at $a$. Without continuity the difference quotient on one side blows up.",
    },
    {
      type: "definition",
      term: "where |f| fails",
      body: "If $f(a) = 0$ and $f'(a) \\ne 0$, then $\\lvert f\\rvert$ has a corner at $a$ with one-sided slopes $\\pm f'(a)$. If $f(a) = 0$ and $f'(a) = 0$, then $\\lvert f\\rvert$ is differentiable at $a$ with derivative 0. Counting corners of $\\lvert (x - p)(x - q)\\rvert$ means counting simple roots.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "differentiable implies continuous",
      statement: "If $f'(a)$ exists, then $f$ is continuous at $a$.",
      proof: ["$f(a + h) - f(a) = \\dfrac{f(a + h) - f(a)}h \\cdot h \\to f'(a) \\cdot 0 = 0$ as $h \\to 0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "a continuous function with a corner",
      statement: "$\\lvert x\\rvert$ is continuous at 0 but not differentiable there.",
      proof: ["$\\lvert h\\rvert \\to 0$, so it is continuous.", "$\\dfrac{\\lvert h\\rvert}h$ is $1$ for $h > 0$ and $-1$ for $h < 0$, so the derivative's limit doesn't exist."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "x² sin(1/x)",
      statement: "$f(x) = x^2\\sin\\tfrac1x$ ($f(0) = 0$) is differentiable at 0 with $f'(0) = 0$, though $f'$ is not continuous at 0.",
      proof: ["$\\dfrac{f(h)}h = h\\sin\\tfrac1h \\to 0$ by the sandwich theorem.", "For $x \\ne 0$, $f'(x) = 2x\\sin\\tfrac1x - \\cos\\tfrac1x$, which oscillates as $x \\to 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "From first principles, find the derivative of $\\sqrt x$ at $x = 4$.",
      solution: ["$\\dfrac{\\sqrt{4 + h} - 2}h = \\dfrac{(4 + h) - 4}{h(\\sqrt{4 + h} + 2)} = \\dfrac1{\\sqrt{4 + h} + 2}$ after rationalising.", "As $h \\to 0$ this tends to $\\tfrac14$."],
      result: "$\\tfrac14$.",
    },
    {
      type: "example",
      level: 2,
      title: "x|x| at 0",
      problem: "Is $f(x) = x\\lvert x\\rvert$ differentiable at 0?",
      solution: ["$\\dfrac{f(h) - f(0)}h = \\dfrac{h\\lvert h\\rvert}h = \\lvert h\\rvert$.", "This tends to 0 from both sides, so $f'(0) = 0$: differentiable."],
      result: "Yes, $f'(0) = 0$.",
    },
    {
      type: "example",
      level: 3,
      title: "a smooth join",
      problem: "Find $a, b$ so that $f(x) = x^2$ for $x \\le 1$ and $ax + b$ for $x > 1$ is differentiable at 1.",
      solution: ["Continuity: $1 = a + b$.", "Equal slopes: $2 = a$, so $b = -1$. The line $y = 2x - 1$ is the tangent to $y = x^2$ at $(1, 1)$."],
      result: "$a = 2$, $b = -1$.",
    },
  ],
  pitfalls: [
    { wrong: "Continuous means differentiable.", right: "Corners and cusps are continuous but not differentiable." },
    { wrong: "Matching derivative formulas at a joint suffice.", right: "Check continuity first." },
    { wrong: "$\\lvert f\\rvert$ is non-differentiable at every zero of $f$.", right: "Only where $f$ crosses with nonzero slope." },
  ],
  formulas: [
    { label: "Derivative", tex: "f'(a) = \\lim_{h \\to 0}\\tfrac{f(a + h) - f(a)}h" },
    { label: "Exists iff", tex: "Lf'(a) = Rf'(a)" },
    { label: "Implication", tex: "\\text{differentiable} \\Rightarrow \\text{continuous}" },
  ],
  exercises: [
    ex(1, num("difx-ex-1", "From first principles, find $f'(2)$ for $f(x) = x^2 + 3x$.", 7, "$\\dfrac{(2 + h)^2 + 3(2 + h) - 10}h = 7 + h$."), ["$7$."]),
    ex(1, num("difx-ex-2", "At how many points is $\\lvert x - 1\\rvert + \\lvert x - 3\\rvert$ not differentiable?", 2, "At 1 and 3."), ["$2$."]),
    ex(2, num("difx-ex-3", "At how many points is $\\lvert x^2 - 5x + 6\\rvert$ not differentiable?", 2, "Simple roots 2 and 3."), ["$2$."]),
    ex(2, num("difx-ex-4", "Find the left derivative of $\\lvert x - 2\\rvert$ at $x = 2$.", -1, "Slope of $2 - x$."), ["$-1$."]),
    ex(2, num("difx-ex-5", "$f(x) = ax^2$ for $x \\le 2$ and $4x + b$ for $x > 2$ is differentiable at 2. Find $b$.", -4, "$4a = 4$ gives $a = 1$; then $4 = 8 + b$."), ["$a = 1$, $b = -4$."]),
    ex(3, num("difx-ex-6", "$f(x) = x^2\\sin\\dfrac1x$ for $x \\ne 0$ and $f(0) = 0$. Find $f'(0)$.", 0, "$h\\sin\\tfrac1h \\to 0$."), ["$0$."]),
    ex(3, num("difx-ex-7", "At how many points of $(0, 3)$ is $[x]$ not differentiable?", 2, "At 1 and 2."), ["$2$."]),
    ex(3, fr("difx-ex-8", "From first principles, find the derivative of $\\dfrac1x$ at $x = 2$.", -0.25, "$\\dfrac{\\frac1{2 + h} - \\frac12}h = \\dfrac{-1}{2(2 + h)}$."), ["$-\\tfrac14$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.nonzero(-4, 4);
      const b = r.nonzero(-6, 6);
      const x0 = r.int(-4, 4);
      const v = 2 * a * x0 + b;
      return n(`From first principles, find $f'(${x0})$ for $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x$.`, v, `$\\dfrac{f(${x0} + h) - f(${x0})}h = ${2 * a * x0 + b} + ${a}h \\to ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(1, 4);
      const pts: number[] = [];
      while (pts.length < k) {
        const p = r.int(-5, 5);
        if (!pts.includes(p)) pts.push(p);
      }
      const terms = pts.map((p) => (p === 0 ? "\\lvert x\\rvert" : `\\lvert x ${p < 0 ? "+" : "-"} ${Math.abs(p)}\\rvert`)).join(" + ");
      return n(`At how many points is $${terms}$ not differentiable?`, k, `Each modulus term adds a corner at its own zero: ${pts.join(", ")}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const c = r.nonzero(-4, 4);
      const want = r.pick(["a", "b"] as const);
      return n(`$f(x) = x^2$ for $x \\le ${c}$ and $ax + b$ for $x > ${c}$ is differentiable at ${c}. Find $${want}$.`, want === "a" ? 2 * c : -c * c, `Slopes match: $a = 2(${c}) = ${2 * c}$; continuity: $${c * c} = ${2 * c}(${c}) + b$, so $b = ${-c * c}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.nonzero(-5, 5);
      return mcNumbers(
        `$f(x) = \\lvert x ${p < 0 ? "+" : "-"} ${Math.abs(p)}\\rvert$ at $x = ${p}$ is`,
        { text: "continuous but not differentiable", why: "One-sided slopes $-1$ and $1$." },
        [{ text: "differentiable, because it is continuous", why: "A corner is continuous but has no tangent slope.", misconception: "continuous-implies-differentiable" }, { text: "discontinuous", why: "The V-shape has no break." }],
      );
    },
  },
];
