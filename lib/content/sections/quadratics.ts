import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Quadratic equations and expressions: the formula and discriminant, relations between roots and coefficients, forming equations, symmetric functions of roots, the parabola's vertex, sign of a quadratic, quadratic inequalities, location of roots, common roots. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "quadratics",
  title: "Quadratic equations & expressions",
  summary: "Every quadratic ax² + bx + c can be solved by completing the square, which gives the quadratic formula. The discriminant b² − 4ac says how many real roots there are; the sum and product of the roots come straight from the coefficients. The graph is a parabola, and its vertex and the sign of a decide maximum or minimum values and how quadratic inequalities are solved.",
  deps: ["polynomials"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "discriminant", meaning: "$D = b^2 - 4ac$: positive for two real roots, zero for one repeated root, negative for no real roots." },
    { term: "vertex", meaning: "The turning point of $y = ax^2 + bx + c$, at $x = -\\dfrac b{2a}$, $y = -\\dfrac D{4a}$." },
    { term: "Vieta's formulas", meaning: "For $ax^2 + bx + c = 0$ with roots $\\alpha, \\beta$: $\\alpha + \\beta = -b/a$, $\\alpha\\beta = c/a$." },
  ],
  misconceptions: {
    "quad-inequality-between": "Solves $(x - p)(x - q) > 0$ as $p < x < q$, the interval between the roots.",
    "vieta-sign": "Takes the sum of the roots as $b/a$ instead of $-b/a$.",
  },
  steps: [
    {
      type: "motivate",
      title: "The most useful equation",
      body: "A ball thrown upward follows $h = 20t - 5t^2$: when does it land, and how high does it go? A farmer with 100 m of fence wants the biggest rectangular pen. Both are quadratics, and so is every question about where a parabola crosses a line. JEE builds whole problems around the roots, their sum and product, and where they lie.",
      realWorld: {
        title: "Projectiles",
        body: "Without air resistance, any thrown object's height is a quadratic in time. Its maximum height is the vertex of the parabola, and the time of flight is the gap between the roots.",
      },
    },
    {
      type: "truth",
      statement: "$ax^2 + bx + c = 0$ ($a \\ne 0$) has roots $x = \\dfrac{-b \\pm \\sqrt{D}}{2a}$ with $D = b^2 - 4ac$. The roots satisfy $\\alpha + \\beta = -\\dfrac ba$ and $\\alpha\\beta = \\dfrac ca$, and the quadratic with roots $\\alpha, \\beta$ is $x^2 - (\\alpha + \\beta)x + \\alpha\\beta = 0$. Completing the square, $ax^2 + bx + c = a\\left(x + \\dfrac b{2a}\\right)^2 - \\dfrac D{4a}$: the vertex is $\\left(-\\dfrac b{2a}, -\\dfrac D{4a}\\right)$, a minimum if $a > 0$ and a maximum if $a < 0$.",
      body: "**Sign of a quadratic** (with $a > 0$): if $D < 0$ it is positive for all $x$; otherwise it is negative strictly between the roots and positive outside them. So $(x - p)(x - q) > 0$ with $p < q$ means $x < p$ or $x > q$. **Symmetric functions** of roots reduce to the sum and product: $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$, $\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)$, $\\lvert\\alpha - \\beta\\rvert = \\sqrt D/\\lvert a\\rvert$. **Location of roots**: both roots of $f(x) = ax^2 + bx + c$ exceed $k$ exactly when $D \\ge 0$, $af(k) > 0$ and $-\\dfrac b{2a} > k$; $k$ lies between the roots exactly when $af(k) < 0$.",
    },
    {
      type: "predict",
      misconception: "quad-inequality-between",
      item: {
        kind: "mc",
        id: "qdr-predict-1",
        prompt: "Solve $x^2 - 5x + 6 > 0$.",
        options: [
          { id: "a", text: "$x < 2$ or $x > 3$", correct: true, why: "The upward parabola is above the axis outside its roots." },
          { id: "b", text: "$2 < x < 3$", misconception: "quad-inequality-between", why: "Between the roots, $(x - 2)(x - 3)$ is negative." },
          { id: "c", text: "$x > 3$ only", why: "It is also positive for $x < 2$." },
        ],
      },
      reveal: {
        body: "$x^2 - 5x + 6 = (x - 2)(x - 3)$. For $x$ between 2 and 3 the factors have opposite signs, so the product is negative; outside, they share a sign and the product is positive. Picture the parabola opening upward: it dips below the axis only between its roots. Test a point: $x = 0$ gives $6 > 0$, so the outside region is the answer.",
      },
      resolve: {
        kind: "mc",
        id: "qdr-resolve-1",
        prompt: "Solve $(x + 1)(x - 4) \\ge 0$.",
        options: [
          { id: "a", text: "$x \\le -1$ or $x \\ge 4$", correct: true, why: "Outside the roots, including them." },
          { id: "b", text: "$-1 \\le x \\le 4$", misconception: "quad-inequality-between", why: "That is where the product is $\\le 0$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qdr-check-1",
        prompt: "For $2x^2 - 3x - 5 = 0$, the sum of the roots is",
        options: [
          { id: "a", text: "$\\tfrac32$", correct: true, why: "$-b/a = 3/2$." },
          { id: "b", text: "$-\\tfrac32$", misconception: "vieta-sign", why: "The sum is minus $b/a$." },
          { id: "c", text: "$-\\tfrac52$", why: "That is the product." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qdr-check-2",
        prompt: "For which $k$ does $x^2 + kx + 4 = 0$ have real roots?",
        options: [
          { id: "a", text: "$k \\le -4$ or $k \\ge 4$", correct: true, why: "$k^2 - 16 \\ge 0$." },
          { id: "b", text: "$-4 \\le k \\le 4$", misconception: "quad-inequality-between", why: "That makes $D \\le 0$." },
          { id: "c", text: "$k \\ge 4$ only", why: "$k = -5$ works too." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Squared-error loss is a quadratic in each parameter, so its minimum sits at a vertex found by setting the derivative to zero (§{least-squares}). Quadratic approximations of loss surfaces also explain why the learning rate must be below a threshold for gradient descent to converge.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "qdr-produce-1", prompt: "Find the minimum value of $x^2 - 6x + 5$.", answer: -4, explain: "Vertex at $x = 3$: $9 - 18 + 5$." },
        { kind: "number", id: "qdr-produce-2", prompt: "The roots of $x^2 - 7x + 10 = 0$ are $\\alpha, \\beta$. Find $\\alpha^2 + \\beta^2$.", answer: 29, explain: "$49 - 20$." },
        {
          kind: "mc",
          id: "qdr-produce-3",
          prompt: "Solve $x^2 - 9 < 0$.",
          options: [
            { id: "a", text: "$-3 < x < 3$", correct: true, why: "Negative between the roots." },
            { id: "b", text: "$x < -3$ or $x > 3$", misconception: "quad-inequality-between", why: "That is where $x^2 - 9 > 0$." },
          ],
        },
        {
          kind: "mc",
          id: "qdr-produce-4",
          prompt: "The roots of $3x^2 + 6x - 2 = 0$ sum to",
          options: [
            { id: "a", text: "$-2$", correct: true, why: "$-6/3$." },
            { id: "b", text: "2", misconception: "vieta-sign", why: "Sum $= -b/a$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "qdr-review-1", prompt: "Find the discriminant of $2x^2 + 3x - 2$.", answer: 25, explain: "$9 + 16$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "completing the square",
      body: "$ax^2 + bx + c = a\\left[\\left(x + \\dfrac{b}{2a}\\right)^2 - \\dfrac{b^2 - 4ac}{4a^2}\\right]$. Setting it to zero and taking square roots gives the quadratic formula; reading off the bracket gives the vertex form $a(x - h)^2 + k$ used on the SAT to find maximum and minimum values.",
    },
    {
      type: "definition",
      term: "common roots",
      body: "$a_1x^2 + b_1x + c_1 = 0$ and $a_2x^2 + b_2x + c_2 = 0$ share exactly one root when $(c_1a_2 - c_2a_1)^2 = (a_1b_2 - a_2b_1)(b_1c_2 - b_2c_1)$; they share both when $\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} = \\dfrac{c_1}{c_2}$. In practice, subtract suitable multiples to eliminate $x^2$ and solve for the common root.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the quadratic formula",
      statement: "If $a \\ne 0$, the solutions of $ax^2 + bx + c = 0$ are $x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ (real when $b^2 - 4ac \\ge 0$).",
      proof: [
        "Divide by $a$ and complete the square: $\\left(x + \\dfrac b{2a}\\right)^2 = \\dfrac{b^2 - 4ac}{4a^2}$.",
        "Take square roots: $x + \\dfrac b{2a} = \\pm\\dfrac{\\sqrt{b^2 - 4ac}}{2a}$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Vieta's formulas",
      statement: "If $\\alpha, \\beta$ are the roots of $ax^2 + bx + c = 0$, then $\\alpha + \\beta = -b/a$ and $\\alpha\\beta = c/a$.",
      proof: ["$ax^2 + bx + c = a(x - \\alpha)(x - \\beta) = a[x^2 - (\\alpha + \\beta)x + \\alpha\\beta]$; compare coefficients."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "location of roots",
      statement: "For $f(x) = ax^2 + bx + c$: both roots $> k$ iff $D \\ge 0$, $af(k) > 0$, $-\\tfrac b{2a} > k$; both roots $< k$ iff $D \\ge 0$, $af(k) > 0$, $-\\tfrac b{2a} < k$; $k$ strictly between the roots iff $af(k) < 0$; exactly one root in $(k_1, k_2)$ iff $f(k_1)f(k_2) < 0$.",
      proof: ["Read each condition from the parabola: the sign of $f(k)$ relative to $a$ says whether $k$ is outside or inside the roots, and the vertex says which side."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $2x^2 + 3x - 2 = 0$.",
      solution: ["$D = 9 + 16 = 25$.", "$x = \\dfrac{-3 \\pm 5}{4}$: $\\tfrac12$ or $-2$."],
      result: "$x = \\tfrac12$ or $-2$.",
    },
    {
      type: "example",
      level: 2,
      title: "symmetric functions",
      problem: "The roots of $2x^2 - 3x - 5 = 0$ are $\\alpha, \\beta$. Find $\\alpha^2 + \\beta^2$ and $\\tfrac1\\alpha + \\tfrac1\\beta$.",
      solution: ["$\\alpha + \\beta = \\tfrac32$, $\\alpha\\beta = -\\tfrac52$; $\\alpha^2 + \\beta^2 = \\tfrac94 + 5 = \\tfrac{29}4$.", "$\\tfrac1\\alpha + \\tfrac1\\beta = \\dfrac{\\alpha + \\beta}{\\alpha\\beta} = -\\tfrac35$."],
      result: "$\\tfrac{29}{4}$ and $-\\tfrac35$.",
    },
    {
      type: "example",
      level: 3,
      title: "location of roots",
      problem: "For which $k$ are both roots of $x^2 - 2kx + k^2 - 1 = 0$ greater than 1?",
      solution: ["$D = 4 > 0$. $f(1) = k^2 - 2k > 0$ gives $k < 0$ or $k > 2$; the vertex $x = k$ must exceed 1.", "Together: $k > 2$. (Check: roots are $k \\pm 1$, both $> 1$ iff $k > 2$.)"],
      result: "$k > 2$.",
    },
  ],
  pitfalls: [
    { wrong: "$(x - p)(x - q) > 0$ means $p < x < q$.", right: "It means outside the roots (for $p < q$)." },
    { wrong: "The sum of the roots is $b/a$.", right: "It is $-b/a$." },
    { wrong: "Divide an inequality by an expression of unknown sign.", right: "Move everything to one side and study the sign." },
  ],
  formulas: [
    { label: "Roots", tex: "x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
    { label: "Vieta", tex: "\\alpha + \\beta = -\\tfrac ba,\\ \\alpha\\beta = \\tfrac ca" },
    { label: "Vertex", tex: "\\left(-\\tfrac b{2a}, -\\tfrac D{4a}\\right)" },
    { label: "Root gap", tex: "\\lvert\\alpha - \\beta\\rvert = \\sqrt D/\\lvert a\\rvert" },
  ],
  exercises: [
    ex(1, num("qdrx-ex-1", "Find the larger root of $x^2 - x - 12 = 0$.", 4, "$(x - 4)(x + 3)$."), ["$4$."]),
    ex(1, num("qdrx-ex-2", "Find the product of the roots of $3x^2 - 7x + 6 = 0$.", 2, "$c/a$."), ["$2$."]),
    ex(2, fr("qdrx-ex-3", "Roots $\\alpha, \\beta$ of $x^2 - 4x + 1 = 0$. Find $\\tfrac1\\alpha + \\tfrac1\\beta$.", 4, "$(\\alpha + \\beta)/\\alpha\\beta$."), ["$4/1 = 4$."]),
    ex(2, num("qdrx-ex-4", "A ball's height is $h = 20t - 5t^2$ metres. Find its maximum height.", 20, "Vertex at $t = 2$."), ["$40 - 20 = 20$ m."]),
    ex(2, num("qdrx-ex-5", "How many integers $x$ satisfy $x^2 - 3x - 10 \\le 0$?", 8, "$-2 \\le x \\le 5$."), ["$-2, \\dots, 5$: 8 integers."]),
    ex(3, num("qdrx-ex-6", "Roots $\\alpha, \\beta$ of $x^2 - 3x + 1 = 0$. Find $\\alpha^3 + \\beta^3$.", 18, "$27 - 3 \\times 1 \\times 3$."), ["$18$."]),
    ex(3, num("qdrx-ex-7", "Find the least integer $k$ for which $x^2 - 2(k - 1)x + k + 5 = 0$ has both roots positive and real.", 4, "$D \\ge 0$: $k \\le -1$ or $k \\ge 4$; sum $> 0$ and product $> 0$ need $k > 1$."), ["$k \\ge 4$, so 4."]),
    ex(3, mc("qdrx-ex-8", "For all real $x$, $x^2 + kx + 9 > 0$ exactly when", ["$-6 < k < 6$", "$D = k^2 - 36 < 0$."], [["$k > 6$", "Then $D > 0$ and it is negative somewhere."], ["$k \\ne 0$", "The discriminant decides it."]]), ["Upward parabola with no real roots."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const fac = (v: number) => (v === 0 ? "x" : `(x ${v < 0 ? "+" : "-"} ${Math.abs(v)})`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const p = r.int(-7, 7);
      let q = r.int(-7, 7);
      if (q === p) q += 1;
      const a = r.pick([1, 1, 2, 3]);
      const b = -a * (p + q);
      const c = a * p * q;
      const want = r.pick(["sum of squares", "larger root"] as const);
      const v = want === "larger root" ? Math.max(p, q) : p * p + q * q;
      const term = (k: number, s: string) => (k === 0 ? "" : ` ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 && s ? "" : Math.abs(k)}${s}`);
      return n(`For $${a === 1 ? "" : a}x^2${term(b, "x")}${term(c, "")} = 0$, find the ${want === "larger root" ? "larger root" : "sum of the squares of the roots"}.`, v, want === "larger root" ? `Roots $${p}$ and $${q}$.` : `$(\\alpha + \\beta)^2 - 2\\alpha\\beta = ${(p + q) ** 2} - ${2 * p * q} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const h = r.int(-5, 5);
      const k = r.int(-9, 9);
      const a = r.pick([1, 2, -1, -2]);
      const b = -2 * a * h;
      const c = a * h * h + k;
      const term = (m: number, s: string) => (m === 0 ? "" : ` ${m < 0 ? "-" : "+"} ${Math.abs(m) === 1 && s ? "" : Math.abs(m)}${s}`);
      return n(`Find the ${a > 0 ? "minimum" : "maximum"} value of $${a === 1 ? "" : a === -1 ? "-" : a}x^2${term(b, "x")}${term(c, "")}$.`, k, `Vertex at $x = ${h}$; value $${k}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(-6, 4);
      const q = p + r.int(1, 7);
      const strict = r.pick([true, false]);
      const v = strict ? q - p - 1 : q - p + 1;
      return n(`How many integers satisfy $${fac(p)}${fac(q)} ${strict ? "<" : "\\le"} 0$?`, v, `The product is ${strict ? "negative strictly" : "non-positive"} between ${p} and ${q}: ${v} integers.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.int(-5, 2);
      const q = p + r.int(2, 6);
      return mcNumbers(
        `Solve $${fac(p)}${fac(q)} > 0$.`,
        { text: `$x < ${p}$ or $x > ${q}$`, why: "An upward parabola is positive outside its roots." },
        [{ text: `$${p} < x < ${q}$`, why: "That is where it is negative.", misconception: "quad-inequality-between" }],
      );
    },
  },
];
