import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** nth roots of unity and of any complex number, their sum and product, the regular-polygon picture, cube roots of unity (ω) and their identities, factorising xⁿ − 1. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "roots-of-unity",
  title: "Roots of unity",
  summary: "The equation zⁿ = 1 has n solutions, the nth roots of unity e^{2πik/n}, spaced evenly around the unit circle as the corners of a regular n-gon. They add to zero. For n = 3 the roots are 1, ω and ω², with ω³ = 1 and 1 + ω + ω² = 0, identities that collapse many JEE problems. The nth roots of any number re^{iθ} are found the same way.",
  deps: ["complex-polar", "polynomials"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "nth root of unity", meaning: "A solution of $z^n = 1$: $z_k = e^{2\\pi ik/n}$ for $k = 0, 1, \\dots, n - 1$." },
    { term: "ω (omega)", meaning: "The cube root of unity $e^{2\\pi i/3} = -\\tfrac12 + \\tfrac{\\sqrt3}2i$; the others are 1 and $\\omega^2 = \\bar\\omega$." },
    { term: "primitive root", meaning: "An nth root of unity whose powers give all n roots." },
  ],
  misconceptions: {
    "only-real-root": "Thinks $z^n = 1$ has only the solution $z = 1$ (or $\\pm1$).",
    "omega-sum-nonzero": "Thinks $1 + \\omega + \\omega^2$ equals 3 (or some nonzero value) rather than 0.",
  },
  steps: [
    {
      type: "motivate",
      title: "Equal slices of a circle",
      body: "How many numbers cube to 1? Only 1 among the reals, but in the complex plane there are three, a third of a turn apart. These roots of unity organise polynomial factorisations, sums like $\\sum\\cos(2\\pi k/n)$, and divisibility questions such as whether $x^2 + x + 1$ divides $x^{100} + x^{50} + 1$.",
      realWorld: {
        title: "The fast Fourier transform",
        body: "The FFT, one of the most important algorithms ever devised, evaluates a polynomial at all nth roots of unity at once, splitting the work recursively because squaring the 2nth roots gives the nth roots.",
      },
    },
    {
      type: "truth",
      statement: "$z^n = 1$ has exactly $n$ roots $z_k = e^{2\\pi ik/n} = \\cos\\tfrac{2\\pi k}n + i\\sin\\tfrac{2\\pi k}n$, $k = 0, \\dots, n - 1$; they are the powers $1, \\zeta, \\zeta^2, \\dots, \\zeta^{n-1}$ of $\\zeta = e^{2\\pi i/n}$. Their **sum is 0** (for $n \\ge 2$) and their product is $(-1)^{n+1}$. Cube roots: $1, \\omega, \\omega^2$ with $\\omega^3 = 1$, $1 + \\omega + \\omega^2 = 0$, $\\bar\\omega = \\omega^2$. The $n$th roots of $w = re^{i\\theta}$ are $r^{1/n}e^{i(\\theta + 2\\pi k)/n}$.",
      body: "Geometrically the roots are the vertices of a regular $n$-gon inscribed in the unit circle, one at 1. The sum is 0 by symmetry, or because $\\sum\\zeta^k = \\dfrac{\\zeta^n - 1}{\\zeta - 1} = 0$ (§{geometric-progressions}). $x^n - 1 = \\prod_k(x - \\zeta^k)$, and $x^2 + x + 1 = (x - \\omega)(x - \\omega^2)$. Reduce powers of $\\omega$ modulo 3: $\\omega^{100} = \\omega^{99}\\omega = \\omega$. Useful: $1 + \\omega = -\\omega^2$, $1 + \\omega^2 = -\\omega$, and $a^3 + b^3 = (a + b)(a + \\omega b)(a + \\omega^2b)$.",
    },
    {
      type: "predict",
      misconception: "only-real-root",
      item: {
        kind: "mc",
        id: "rou-predict-1",
        prompt: "How many complex solutions has $z^4 = 16$, and what are they?",
        options: [
          { id: "a", text: "Four: $2, 2i, -2, -2i$", correct: true, why: "Modulus $16^{1/4} = 2$, arguments $0, \\tfrac\\pi2, \\pi, \\tfrac{3\\pi}2$." },
          { id: "b", text: "Two: $\\pm 2$", misconception: "only-real-root", why: "$(2i)^4 = 16$ as well." },
          { id: "c", text: "One: 2", misconception: "only-real-root", why: "A degree-4 equation has 4 roots." },
        ],
      },
      reveal: {
        body: "Write $16 = 16e^{i0}$: the fourth roots have modulus 2 and arguments $\\tfrac{0 + 2\\pi k}{4}$ for $k = 0, 1, 2, 3$, giving $2, 2i, -2, -2i$, a square. A polynomial of degree $n$ has $n$ complex roots counted with multiplicity, so $z^n = w$ always has $n$ solutions when $w \\ne 0$.",
      },
      resolve: {
        kind: "mc",
        id: "rou-resolve-1",
        prompt: "The number of solutions of $z^6 = 1$ is",
        options: [
          { id: "a", text: "6", correct: true, why: "The vertices of a regular hexagon." },
          { id: "b", text: "2 ($\\pm1$)", misconception: "only-real-root", why: "Four more are non-real." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rou-check-1",
        prompt: "$1 + \\omega + \\omega^2$, where $\\omega$ is a non-real cube root of unity, equals",
        options: [
          { id: "a", text: "0", correct: true, why: "$\\omega^3 - 1 = (\\omega - 1)(\\omega^2 + \\omega + 1) = 0$ with $\\omega \\ne 1$." },
          { id: "b", text: "3", misconception: "omega-sum-nonzero", why: "That would need $\\omega = 1$." },
          { id: "c", text: "1", misconception: "omega-sum-nonzero", why: "The three roots balance around the circle." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rou-check-2",
        prompt: "$\\omega^{100}$ equals",
        options: [
          { id: "a", text: "$\\omega$", correct: true, why: "$100 = 3 \\times 33 + 1$." },
          { id: "b", text: "1", why: "100 isn't a multiple of 3." },
          { id: "c", text: "$\\omega^2$", why: "The remainder is 1, not 2." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Fast convolutions in signal processing and some neural-network layers use the FFT, which is evaluation at roots of unity. Positional encodings built from $e^{2\\pi ik/n}$ give each position a point on a circle, so that position arithmetic becomes rotation.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rou-produce-1", prompt: "Evaluate $(1 - \\omega + \\omega^2)(1 + \\omega - \\omega^2)$.", answer: 4, explain: "$(-2\\omega)(-2\\omega^2) = 4\\omega^3$." },
        { kind: "number", id: "rou-produce-2", prompt: "Find the sum of the 7th roots of unity.", answer: 0, explain: "Sum of all $n$th roots is 0." },
        {
          kind: "mc",
          id: "rou-produce-3",
          prompt: "The solutions of $z^3 = 8$ are",
          options: [
            { id: "a", text: "$2, 2\\omega, 2\\omega^2$", correct: true, why: "Scale the cube roots of unity by 2." },
            { id: "b", text: "2 only", misconception: "only-real-root", why: "There are two non-real roots too." },
          ],
        },
        {
          kind: "mc",
          id: "rou-produce-4",
          prompt: "$1 + \\omega^4 + \\omega^8$ equals",
          options: [
            { id: "a", text: "0", correct: true, why: "$\\omega^4 = \\omega$, $\\omega^8 = \\omega^2$." },
            { id: "b", text: "3", misconception: "omega-sum-nonzero", why: "Reduce the powers modulo 3 first." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rou-review-1", prompt: "Find the product $1 \\cdot \\omega \\cdot \\omega^2$.", answer: 1, explain: "$\\omega^3 = 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "ω identities",
      body: "$\\omega = -\\tfrac12 + \\tfrac{\\sqrt3}2i$, $\\omega^2 = -\\tfrac12 - \\tfrac{\\sqrt3}2i$; $\\omega^3 = 1$, $1 + \\omega + \\omega^2 = 0$, $\\omega\\bar\\omega = 1$. Powers reduce modulo 3. $1 + \\omega^n + \\omega^{2n}$ is 3 if $3 \\mid n$ and 0 otherwise.",
    },
    {
      type: "definition",
      term: "roots of a general number",
      body: "To solve $z^n = w$ with $w = re^{i\\theta}$: $z = r^{1/n}e^{i(\\theta + 2\\pi k)/n}$, $k = 0, \\dots, n - 1$. All roots have modulus $r^{1/n}$, so they form a regular $n$-gon of that radius, rotated by $\\theta/n$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the roots of unity sum to zero",
      statement: "For $n \\ge 2$, $\\sum_{k=0}^{n-1}e^{2\\pi ik/n} = 0$.",
      proof: ["With $\\zeta = e^{2\\pi i/n} \\ne 1$, the sum is a geometric series $\\dfrac{\\zeta^n - 1}{\\zeta - 1} = \\dfrac{1 - 1}{\\zeta - 1} = 0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "product of the roots",
      statement: "The product of the $n$th roots of unity is $(-1)^{n+1}$.",
      proof: ["They are the roots of $z^n - 1$; by Vieta the product is $(-1)^n \\times$ (constant term) $= (-1)^n(-1)$ (§{polynomials})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "divisibility by $x^2 + x + 1$",
      statement: "$p(x)$ is divisible by $x^2 + x + 1$ iff $p(\\omega) = 0$ (for real coefficients, then $p(\\omega^2) = 0$ too).",
      proof: ["$x^2 + x + 1 = (x - \\omega)(x - \\omega^2)$; apply the factor theorem to each root."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $z^4 = 16$.",
      solution: ["$\\lvert z\\rvert = 2$ and $4\\arg z = 2\\pi k$.", "$z = 2, 2i, -2, -2i$."],
      result: "$\\pm2, \\pm2i$.",
    },
    {
      type: "example",
      level: 2,
      title: "simplifying with ω",
      problem: "Simplify $(1 + \\omega)^5$.",
      solution: ["$1 + \\omega = -\\omega^2$.", "$(-\\omega^2)^5 = -\\omega^{10} = -\\omega$."],
      result: "$-\\omega$.",
    },
    {
      type: "example",
      level: 3,
      title: "divisibility",
      problem: "Is $x^{100} + x^{50} + 1$ divisible by $x^2 + x + 1$?",
      solution: ["$\\omega^{100} = \\omega$ and $\\omega^{50} = \\omega^2$ (since $50 = 48 + 2$).", "$\\omega + \\omega^2 + 1 = 0$, so yes."],
      result: "Yes.",
    },
  ],
  pitfalls: [
    { wrong: "$z^n = 1$ has only $z = 1$.", right: "It has $n$ complex roots." },
    { wrong: "$1 + \\omega + \\omega^2 = 3$.", right: "It is 0." },
    { wrong: "Forget to reduce powers of $\\omega$ modulo 3.", right: "$\\omega^{3k+r} = \\omega^r$." },
  ],
  formulas: [
    { label: "Roots", tex: "z_k = e^{2\\pi ik/n},\\ k = 0, \\dots, n - 1" },
    { label: "Sum, product", tex: "\\textstyle\\sum z_k = 0,\\ \\prod z_k = (-1)^{n+1}" },
    { label: "Omega", tex: "\\omega^3 = 1,\\ 1 + \\omega + \\omega^2 = 0" },
    { label: "General", tex: "w^{1/n} = r^{1/n}e^{i(\\theta + 2\\pi k)/n}" },
  ],
  exercises: [
    ex(1, num("roux-ex-1", "How many solutions has $z^5 = 1$?", 5, "Degree 5."), ["$5$."]),
    ex(1, num("roux-ex-2", "Find $\\lvert z\\rvert$ for any solution of $z^5 = 32$.", 2, "$32^{1/5}$."), ["$2$."]),
    ex(2, num("roux-ex-3", "Evaluate $(1 + \\omega)(1 + \\omega^2)$.", 1, "Expand: $1 + \\omega + \\omega^2 + \\omega^3$."), ["$0 + 1 = 1$."]),
    ex(2, dp("roux-ex-4", "Find the real part of the 6th root of unity with argument $\\tfrac{2\\pi}6$.", 0.5, "$\\cos 60°$."), ["$0.5$."]),
    ex(2, num("roux-ex-5", "Find the product of the 4th roots of unity.", -1, "$(-1)^{5}$."), ["$1 \\cdot i \\cdot (-1) \\cdot (-i) = -1$."]),
    ex(3, num("roux-ex-6", "Evaluate $(1 + \\omega - \\omega^2)^3 - (1 - \\omega + \\omega^2)^3$.", 0, "$(-2\\omega^2)^3 - (-2\\omega)^3$."), ["$-8 + 8 = 0$."]),
    ex(3, num("roux-ex-7", "Find $\\sum_{k=0}^{8}\\omega^k$.", 0, "Three full cycles."), ["$3(1 + \\omega + \\omega^2) = 0$."]),
    ex(3, mc("roux-ex-8", "The 5th roots of unity in the Argand plane form", ["a regular pentagon on the unit circle with a vertex at 1", "Equally spaced arguments $2\\pi k/5$."], [["a straight line", "They all have modulus 1."], ["a pentagon with a vertex at $i$", "One root is 1."]]), ["Rotate by $\\tfrac{2\\pi}5$ to move between them."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(4, 3000);
      return n(`$\\omega^{${k}} = \\omega^m$ with $m \\in \\{0, 1, 2\\}$. Find $m$.`, k % 3, `$${k} = 3 \\times ${Math.floor(k / 3)} + ${k % 3}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const base_ = r.pick([2, 3]);
      const nn = r.int(2, 6);
      const w = base_ ** nn;
      const want = r.pick(["count", "modulus"] as const);
      return n(want === "count" ? `How many complex solutions has $z^{${nn}} = ${w}$?` : `Find $\\lvert z\\rvert$ for the solutions of $z^{${nn}} = ${w}$.`, want === "count" ? nn : base_, want === "count" ? `A degree-${nn} equation has ${nn} roots.` : `$${w}^{1/${nn}} = ${base_}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(2, 9);
      const want = r.pick(["sum", "product"] as const);
      return n(`Find the ${want} of the ${nn}th roots of unity.`, want === "sum" ? 0 : (-1) ** (nn + 1), want === "sum" ? "They sum to 0." : `$(-1)^{${nn + 1}}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([1, 2, 4, 5, 7]);
      return mcNumbers(
        `For a non-real cube root of unity $\\omega$, $1 + \\omega^{${k}} + \\omega^{${2 * k}}$ equals`,
        { text: "0", why: `${k} isn't a multiple of 3, so this is $1 + \\omega + \\omega^2$ in some order.` },
        [{ text: "3", why: "That needs $3 \\mid k$.", misconception: "omega-sum-nonzero" }, { text: "1", why: "The three terms cancel.", misconception: "omega-sum-nonzero" }],
      );
    },
  },
];
