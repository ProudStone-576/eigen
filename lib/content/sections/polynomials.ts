import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Polynomials: operations and identities, division, the remainder and factor theorems, rational roots, factorising cubics, relations between roots and coefficients of cubics, rational expressions. */

const evalP = (cs: number[], x: number) => cs.reduce((s, c) => s * x + c, 0);

const base: ConceptNode = {
  id: "polynomials",
  title: "Polynomials & the remainder theorem",
  summary: "A polynomial is a sum of powers of x with constant coefficients. Dividing one polynomial by another works like long division of numbers, and the remainder theorem gives a shortcut: the remainder on dividing p(x) by x − a is just p(a). So a is a root exactly when x − a is a factor, which is the key to factorising cubics and higher polynomials.",
  deps: ["linear-equations"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "degree", meaning: "The highest power of $x$ with a nonzero coefficient." },
    { term: "root", meaning: "A value $a$ with $p(a) = 0$; equivalently, $x - a$ is a factor of $p(x)$." },
    { term: "rational expression", meaning: "A quotient $p(x)/q(x)$ of polynomials, defined where $q(x) \\ne 0$." },
  ],
  misconceptions: {
    "remainder-wrong-sign": "Evaluates $p(2)$ for the remainder on division by $x + 2$, instead of $p(-2)$.",
    "cancel-terms": "Cancels terms rather than factors in a fraction, for example writing $\\dfrac{x + 3}{x + 5} = \\dfrac35$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Roots and factors",
      body: "To solve $x^3 - 6x^2 + 11x - 6 = 0$ there is no simple formula to hand, but trying $x = 1$ gives 0, so $x - 1$ is a factor, and what remains is a quadratic. This trial-and-factor approach, built on the remainder theorem, cracks most cubic and quartic equations set in exams.",
      realWorld: {
        title: "Error-correcting codes",
        body: "QR codes and CDs protect data with Reed–Solomon codes, which treat a message as the coefficients of a polynomial; damaged data can be recovered because a polynomial of degree $n$ is fixed by its values at $n + 1$ points.",
      },
    },
    {
      type: "truth",
      statement: "**Division algorithm**: for polynomials $p$ and $d \\ne 0$ there are unique $q$ and $r$ with $p(x) = d(x)q(x) + r(x)$ and $\\deg r < \\deg d$. **Remainder theorem**: the remainder on dividing $p(x)$ by $x - a$ is $p(a)$. **Factor theorem**: $x - a$ is a factor of $p(x)$ if and only if $p(a) = 0$. **Rational root theorem**: if $p/q$ in lowest terms is a root of a polynomial with integer coefficients, then $p$ divides the constant term and $q$ divides the leading coefficient.",
      body: "To factorise a cubic, test small divisors of the constant term, divide out the factor found (by long or synthetic division), then factorise the quadratic left over (§{quadratics}). For $ax^3 + bx^2 + cx + d$ with roots $\\alpha, \\beta, \\gamma$: $\\alpha + \\beta + \\gamma = -\\dfrac ba$, $\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha = \\dfrac ca$, $\\alpha\\beta\\gamma = -\\dfrac da$. Key identities: $(a \\pm b)^3 = a^3 \\pm 3a^2b + 3ab^2 \\pm b^3$ and $a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$. Simplify a rational expression by factorising top and bottom and cancelling **common factors**, noting the values excluded from its domain.",
    },
    {
      type: "predict",
      misconception: "remainder-wrong-sign",
      item: {
        kind: "mc",
        id: "pnm-predict-1",
        prompt: "Find the remainder when $p(x) = 2x^3 + 3x^2 - 5x + 1$ is divided by $x + 2$.",
        options: [
          { id: "a", text: "7, which is $p(-2)$", correct: true, why: "$x + 2 = x - (-2)$." },
          { id: "b", text: "19, which is $p(2)$", misconception: "remainder-wrong-sign", why: "Dividing by $x + 2$ means $a = -2$." },
          { id: "c", text: "0", why: "$p(-2) \\ne 0$, so $x + 2$ is not a factor." },
        ],
      },
      reveal: {
        body: "Write the divisor as $x - a$: $x + 2 = x - (-2)$, so $a = -2$ and the remainder is $p(-2) = -16 + 12 + 10 + 1 = 7$. In general the remainder on division by $x - a$ is the value where the divisor is zero. For a divisor $2x - 1$, use $p(\\tfrac12)$.",
      },
      resolve: {
        kind: "mc",
        id: "pnm-resolve-1",
        prompt: "The remainder of $p(x)$ divided by $x + 5$ is",
        options: [
          { id: "a", text: "$p(-5)$", correct: true, why: "The divisor is zero at $x = -5$." },
          { id: "b", text: "$p(5)$", misconception: "remainder-wrong-sign", why: "Use the root of the divisor." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pnm-check-1",
        prompt: "Simplify $\\dfrac{x^2 - 9}{x^2 + 5x + 6}$.",
        options: [
          { id: "a", text: "$\\dfrac{x - 3}{x + 2}$, for $x \\ne -3, -2$", correct: true, why: "$\\dfrac{(x - 3)(x + 3)}{(x + 2)(x + 3)}$: cancel the common factor." },
          { id: "b", text: "$\\dfrac{-9}{5x + 6}$", misconception: "cancel-terms", why: "Only common factors cancel, not the $x^2$ terms." },
          { id: "c", text: "$\\dfrac{x - 9}{x + 6}$", misconception: "cancel-terms", why: "Terms can't be cancelled across a sum." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pnm-check-2",
        prompt: "The roots of $2x^3 - 3x^2 + 4x - 5 = 0$ have product",
        options: [
          { id: "a", text: "$\\tfrac52$", correct: true, why: "$-d/a = 5/2$." },
          { id: "b", text: "$-\\tfrac52$", why: "For a cubic, product $= -d/a$." },
          { id: "c", text: "$\\tfrac32$", why: "That is the sum of the roots." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Polynomial features let a linear model fit curves, and polynomial interpolation shows overfitting starkly: a degree-$(n - 1)$ polynomial passes through any $n$ points but wiggles wildly between them (§{bias-variance}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pnm-produce-1", prompt: "$x - 2$ is a factor of $x^3 + kx^2 - 4x + 4$. Find $k$.", answer: -1, explain: "$8 + 4k - 8 + 4 = 0$." },
        { kind: "number", id: "pnm-produce-2", prompt: "Find the sum of the roots of $x^3 - 6x^2 + 11x - 6 = 0$.", answer: 6, explain: "$-b/a$; the roots are 1, 2, 3." },
        {
          kind: "mc",
          id: "pnm-produce-3",
          prompt: "The remainder of $x^4 - 3x + 2$ on division by $x + 1$ is",
          options: [
            { id: "a", text: "6", correct: true, why: "$p(-1) = 1 + 3 + 2$." },
            { id: "b", text: "0", misconception: "remainder-wrong-sign", why: "That is $p(1)$." },
          ],
        },
        {
          kind: "mc",
          id: "pnm-produce-4",
          prompt: "$\\dfrac{2x + 6}{x + 3}$ simplifies to",
          options: [
            { id: "a", text: "2, for $x \\ne -3$", correct: true, why: "$\\dfrac{2(x + 3)}{x + 3}$." },
            { id: "b", text: "$\\dfrac{2x + 2}{x}$", misconception: "cancel-terms", why: "Factor first; don't cancel the 3s." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "pnm-review-1", prompt: "Find the remainder when $x^3 - 2x + 7$ is divided by $x - 2$.", answer: 11, explain: "$8 - 4 + 7$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "synthetic division",
      body: "To divide $p(x) = a_nx^n + \\dots + a_0$ by $x - a$: bring down $a_n$; repeatedly multiply the last number by $a$ and add it to the next coefficient. The final number is the remainder $p(a)$; the others are the quotient's coefficients. This is evaluating $p(a)$ by nesting: $(\\dots((a_na + a_{n-1})a + a_{n-2})\\dots)$.",
    },
    {
      type: "definition",
      term: "remainders for quadratic divisors",
      body: "Dividing by a quadratic leaves a remainder $Ax + B$ of degree at most 1. If the divisor is $(x - \\alpha)(x - \\beta)$ with $\\alpha \\ne \\beta$, find $A$ and $B$ from $p(\\alpha) = A\\alpha + B$ and $p(\\beta) = A\\beta + B$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the remainder theorem",
      statement: "The remainder on dividing $p(x)$ by $x - a$ is $p(a)$.",
      proof: ["By the division algorithm, $p(x) = (x - a)q(x) + r$ with $r$ a constant (degree below 1). Put $x = a$: $p(a) = r$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Vieta for cubics",
      statement: "If $ax^3 + bx^2 + cx + d = a(x - \\alpha)(x - \\beta)(x - \\gamma)$, then $\\sum\\alpha = -b/a$, $\\sum\\alpha\\beta = c/a$ and $\\alpha\\beta\\gamma = -d/a$.",
      proof: ["Expand the right side: $a[x^3 - (\\sum\\alpha)x^2 + (\\sum\\alpha\\beta)x - \\alpha\\beta\\gamma]$ and compare coefficients."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "factorising a cubic",
      statement: "Try divisors of the constant term (and, by the rational root theorem, fractions $p/q$). Once $p(a) = 0$, divide by $x - a$ and factorise the quadratic quotient.",
      proof: ["Each root found lowers the degree by one, by the factor theorem."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Factorise $x^3 - 6x^2 + 11x - 6$.",
      solution: ["$p(1) = 1 - 6 + 11 - 6 = 0$, so $x - 1$ is a factor; dividing gives $x^2 - 5x + 6$.", "$x^2 - 5x + 6 = (x - 2)(x - 3)$."],
      result: "$(x - 1)(x - 2)(x - 3)$.",
    },
    {
      type: "example",
      level: 2,
      title: "a quadratic divisor",
      problem: "$p(x)$ leaves remainder 5 on division by $x - 1$ and 9 on division by $x - 2$. Find its remainder on division by $(x - 1)(x - 2)$.",
      solution: ["Remainder $Ax + B$: $A + B = 5$ and $2A + B = 9$.", "$A = 4$, $B = 1$."],
      result: "$4x + 1$.",
    },
    {
      type: "example",
      level: 3,
      title: "a symmetric function of roots",
      problem: "The roots of $x^3 - 2x^2 - 5x + 6 = 0$ are $\\alpha, \\beta, \\gamma$. Find $\\alpha^2 + \\beta^2 + \\gamma^2$.",
      solution: ["$\\sum\\alpha = 2$, $\\sum\\alpha\\beta = -5$.", "$\\sum\\alpha^2 = (\\sum\\alpha)^2 - 2\\sum\\alpha\\beta = 4 + 10 = 14$."],
      result: "14.",
    },
  ],
  pitfalls: [
    { wrong: "Remainder on dividing by $x + a$ is $p(a)$.", right: "It is $p(-a)$." },
    { wrong: "Cancel terms in a fraction.", right: "Factorise and cancel common factors only." },
    { wrong: "Forget excluded values after cancelling.", right: "The simplified form isn't defined where the original denominator was 0." },
  ],
  formulas: [
    { label: "Division", tex: "p(x) = d(x)q(x) + r(x),\\ \\deg r < \\deg d" },
    { label: "Remainder theorem", tex: "p(x) \\div (x - a) \\Rightarrow r = p(a)" },
    { label: "Cubic roots", tex: "\\sum\\alpha = -\\tfrac ba,\\ \\sum\\alpha\\beta = \\tfrac ca,\\ \\alpha\\beta\\gamma = -\\tfrac da" },
    { label: "Cubes", tex: "a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)" },
  ],
  exercises: [
    ex(1, num("pnmx-ex-1", "Find $p(3)$ for $p(x) = x^3 - 4x^2 + x + 5$.", -1, "$27 - 36 + 3 + 5$."), ["$-1$."]),
    ex(1, num("pnmx-ex-2", "Find the degree of $(x^2 + 1)(x^3 - x)$.", 5, "Degrees add."), ["$5$."]),
    ex(2, num("pnmx-ex-3", "Find $k$ if $x + 1$ is a factor of $2x^3 + kx^2 - x + 3$.", -2, "$p(-1) = -2 + k + 1 + 3 = 0$."), ["$k = -2$."]),
    ex(2, num("pnmx-ex-4", "The roots of $x^3 + 2x^2 - x - 2 = 0$ are $\\alpha, \\beta, \\gamma$. Find $\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha$.", -1, "$c/a$."), ["$-1$; the roots are $1, -1, -2$."]),
    ex(2, num("pnmx-ex-5", "Find the largest root of $x^3 - 7x + 6 = 0$.", 2, "$p(1) = 0$; quotient $x^2 + x - 6$."), ["Roots $1, 2, -3$."]),
    ex(3, num("pnmx-ex-6", "$p(x)$ leaves remainder 3 when divided by $x - 1$ and $-1$ when divided by $x + 1$. Its remainder on division by $x^2 - 1$ is $Ax + B$. Find $A$.", 2, "$A + B = 3$, $-A + B = -1$."), ["$A = 2$, $B = 1$."]),
    ex(3, num("pnmx-ex-7", "The roots of $x^3 - 3x^2 + x + 1 = 0$ are $\\alpha, \\beta, \\gamma$. Find $\\alpha^2 + \\beta^2 + \\gamma^2$.", 7, "$9 - 2$."), ["$(\\sum\\alpha)^2 - 2\\sum\\alpha\\beta = 9 - 2 = 7$."]),
    ex(3, mc("pnmx-ex-8", "A cubic with integer coefficients has leading coefficient 2 and constant term 3. Which could be a rational root?", ["$\\tfrac32$", "Numerator divides 3, denominator divides 2."], [["$\\tfrac23$", "The denominator must divide the leading coefficient 2."], ["$\\tfrac15$", "5 divides neither."]]), ["Candidates: $\\pm1, \\pm3, \\pm\\tfrac12, \\pm\\tfrac32$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const poly = (cs: number[]) => {
  const deg = cs.length - 1;
  return cs
    .map((c, i) => ({ c, p: deg - i }))
    .filter(({ c }) => c !== 0)
    .map(({ c, p }, j) => {
      const sign = c < 0 ? "-" : j === 0 ? "" : "+";
      const abs = Math.abs(c);
      const coef = abs === 1 && p > 0 ? "" : `${abs}`;
      const pow = p === 0 ? "" : p === 1 ? "x" : `x^${p}`;
      return `${j === 0 ? sign : ` ${sign} `}${coef}${pow}`;
    })
    .join("");
};

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const cs = [r.nonzero(-3, 3), r.int(-5, 5), r.int(-6, 6), r.int(-9, 9)];
      const a = r.nonzero(-3, 3);
      const v = evalP(cs, a);
      return n(`Find the remainder when $${poly(cs)}$ is divided by $x ${a < 0 ? "+" : "-"} ${Math.abs(a)}$.`, v, `Remainder theorem: $p(${a}) = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [p, q, s] = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      const b = -(p + q + s);
      const c = p * q + q * s + s * p;
      const d = -(p * q * s);
      const want = r.pick(["sum", "product", "pair"] as const);
      const v = want === "sum" ? p + q + s : want === "product" ? p * q * s : c;
      return n(`For the roots of $${poly([1, b, c, d])} = 0$, find ${want === "sum" ? "their sum" : want === "product" ? "their product" : "$\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha$"}.`, v, want === "sum" ? `$-b/a = ${v}$.` : want === "product" ? `$-d/a = ${v}$.` : `$c/a = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const root = r.nonzero(-3, 3);
      const cs = [r.nonzero(-2, 3), r.int(-5, 5), r.nonzero(-6, 6), 0];
      const k = -evalP(cs, root);
      return n(`$x ${root < 0 ? "+" : "-"} ${Math.abs(root)}$ is a factor of $${poly(cs)} + k$. Find $k$.`, k, `Factor theorem: $p(${root}) = ${-k} + k = 0$, so $k = ${k}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(2, 7);
      return mcNumbers(
        `The remainder when $p(x)$ is divided by $x + ${a}$ equals`,
        { text: `$p(-${a})$`, why: `The divisor vanishes at $x = -${a}$.` },
        [{ text: `$p(${a})$`, why: "Use the root of the divisor.", misconception: "remainder-wrong-sign" }, { text: "$p(0)$", why: "That is the constant term." }],
      );
    },
  },
];
