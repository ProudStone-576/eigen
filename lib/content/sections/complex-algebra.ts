import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Complex numbers: i, real and imaginary parts, the Argand plane, arithmetic and division by the conjugate, modulus and conjugate properties, powers of i, square roots of complex numbers, quadratics with complex roots. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "complex-algebra",
  title: "Complex numbers & the Argand plane",
  summary: "Adding one number i with i² = −1 lets every quadratic, indeed every polynomial, have roots. A complex number a + bi is a point (a, b) in the Argand plane. Add and multiply as with polynomials, replacing i² by −1; divide by multiplying top and bottom by the conjugate a − bi. The modulus |z| = √(a² + b²) is the distance from the origin, and z·z̄ = |z|².",
  deps: ["quadratics", "plane-geometry"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "complex number", meaning: "$z = a + bi$ with $a = \\operatorname{Re}z$, $b = \\operatorname{Im}z$ real and $i^2 = -1$." },
    { term: "conjugate", meaning: "$\\bar z = a - bi$: the reflection of $z$ in the real axis." },
    { term: "modulus", meaning: "$\\lvert z\\rvert = \\sqrt{a^2 + b^2}$: the distance from 0 to $z$." },
  ],
  misconceptions: {
    "sqrt-negatives-multiply": "Uses $\\sqrt a\\sqrt b = \\sqrt{ab}$ for negative $a, b$, getting $\\sqrt{-4}\\sqrt{-9} = 6$.",
    "modulus-additive": "Thinks $\\lvert z_1 + z_2\\rvert = \\lvert z_1\\rvert + \\lvert z_2\\rvert$ always.",
  },
  steps: [
    {
      type: "motivate",
      title: "A number whose square is negative",
      body: "$x^2 + 2x + 5 = 0$ has no real solution, yet the quadratic formula produces $-1 \\pm \\sqrt{-4}$. Declaring $i = \\sqrt{-1}$ makes that $-1 \\pm 2i$, and the arithmetic works perfectly. Complex numbers then turn out to be the natural language for rotations, waves and electrical circuits, and they are a full JEE chapter.",
      realWorld: {
        title: "Electrical engineering",
        body: "Engineers write alternating voltages and currents as complex numbers so that resistors, capacitors and inductors all become complex \"impedances\" that combine like ordinary resistances; they write $j$ for $i$ to avoid clashing with current.",
      },
    },
    {
      type: "truth",
      statement: "With $i^2 = -1$: $(a + bi) \\pm (c + di) = (a \\pm c) + (b \\pm d)i$ and $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$. Divide using the conjugate: $\\dfrac{a + bi}{c + di} = \\dfrac{(a + bi)(c - di)}{c^2 + d^2}$. Properties: $z\\bar z = \\lvert z\\rvert^2$, $\\overline{z_1z_2} = \\bar z_1\\bar z_2$, $\\lvert z_1z_2\\rvert = \\lvert z_1\\rvert\\lvert z_2\\rvert$, and the **triangle inequality** $\\lvert z_1 + z_2\\rvert \\le \\lvert z_1\\rvert + \\lvert z_2\\rvert$. Powers of $i$ cycle with period 4: $i, -1, -i, 1$.",
      body: "Two complex numbers are equal only if their real parts and their imaginary parts are equal, which turns one complex equation into two real ones. In the **Argand plane**, $z = a + bi$ is the point $(a, b)$, addition is vector addition and $\\lvert z_1 - z_2\\rvert$ is the distance between points. A real quadratic with $D < 0$ has roots $\\dfrac{-b \\pm i\\sqrt{-D}}{2a}$, a **conjugate pair** (§{quadratics}). To find $\\sqrt{a + bi}$, solve $(x + iy)^2 = a + bi$: $x^2 - y^2 = a$, $2xy = b$, and $x^2 + y^2 = \\sqrt{a^2 + b^2}$. Careful: $\\sqrt a\\sqrt b = \\sqrt{ab}$ needs $a, b \\ge 0$; $\\sqrt{-4}\\sqrt{-9} = 2i \\cdot 3i = -6$.",
    },
    {
      type: "predict",
      misconception: "sqrt-negatives-multiply",
      item: {
        kind: "mc",
        id: "cxa-predict-1",
        prompt: "$\\sqrt{-4} \\times \\sqrt{-9}$ equals",
        options: [
          { id: "a", text: "$-6$", correct: true, why: "$2i \\times 3i = 6i^2$." },
          { id: "b", text: "6, since $\\sqrt{(-4)(-9)} = \\sqrt{36}$", misconception: "sqrt-negatives-multiply", why: "That rule only holds for non-negative numbers." },
          { id: "c", text: "$6i$", why: "$i \\times i = -1$, not $i$." },
        ],
      },
      reveal: {
        body: "Write each root with $i$ first: $\\sqrt{-4} = 2i$ and $\\sqrt{-9} = 3i$, so the product is $6i^2 = -6$. The rule $\\sqrt a\\sqrt b = \\sqrt{ab}$ fails for negatives; otherwise $-1 = i \\cdot i = \\sqrt{-1}\\sqrt{-1} = \\sqrt 1 = 1$, a contradiction.",
      },
      resolve: {
        kind: "mc",
        id: "cxa-resolve-1",
        prompt: "$\\sqrt{-2}\\sqrt{-8}$ equals",
        options: [
          { id: "a", text: "$-4$", correct: true, why: "$i\\sqrt2 \\cdot i\\sqrt8 = -4$." },
          { id: "b", text: "4", misconception: "sqrt-negatives-multiply", why: "Convert to $i$ form before multiplying." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxa-check-1",
        prompt: "$\\lvert z_1\\rvert = 3$ and $\\lvert z_2\\rvert = 4$. The value of $\\lvert z_1 + z_2\\rvert$ is",
        options: [
          { id: "a", text: "between 1 and 7, depending on the angle between them", correct: true, why: "Triangle inequality: $\\lvert\\lvert z_1\\rvert - \\lvert z_2\\rvert\\rvert \\le \\lvert z_1 + z_2\\rvert \\le \\lvert z_1\\rvert + \\lvert z_2\\rvert$." },
          { id: "b", text: "always 7", misconception: "modulus-additive", why: "Only when they point the same way." },
          { id: "c", text: "always 5", why: "Only when they are perpendicular." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cxa-check-2",
        prompt: "$\\dfrac{2 + i}{1 - i}$ equals",
        options: [
          { id: "a", text: "$\\tfrac12 + \\tfrac32i$", correct: true, why: "$\\dfrac{(2 + i)(1 + i)}{2} = \\dfrac{1 + 3i}{2}$." },
          { id: "b", text: "$2 - i$", why: "Multiply by the conjugate of the denominator." },
          { id: "c", text: "$1 + 3i$", why: "Divide by $\\lvert 1 - i\\rvert^2 = 2$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The discrete Fourier transform, behind audio features and fast convolutions, works with complex numbers: each frequency component is a complex number whose modulus is the strength and whose argument is the phase. Some neural networks for signals use complex-valued weights.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cxa-produce-1", prompt: "$(3 + 2i)(1 - 4i) = a + bi$. Find $a$.", answer: 11, explain: "$3 + 8 = 11$; $b = -10$." },
        { kind: "number", id: "cxa-produce-2", prompt: "$i^{2023} = a + bi$. Find $b$.", answer: -1, explain: "$2023 = 4 \\times 505 + 3$: $i^3 = -i$." },
        {
          kind: "mc",
          id: "cxa-produce-3",
          prompt: "$\\sqrt{-1}\\cdot\\sqrt{-1}$ equals",
          options: [
            { id: "a", text: "$-1$", correct: true, why: "$i \\cdot i$." },
            { id: "b", text: "1", misconception: "sqrt-negatives-multiply", why: "That misuses $\\sqrt a\\sqrt b = \\sqrt{ab}$." },
          ],
        },
        {
          kind: "mc",
          id: "cxa-produce-4",
          prompt: "For $z_1 = 3$ and $z_2 = -4$, $\\lvert z_1 + z_2\\rvert$ is",
          options: [
            { id: "a", text: "1", correct: true, why: "$\\lvert -1\\rvert$." },
            { id: "b", text: "7", misconception: "modulus-additive", why: "They point in opposite directions." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cxa-review-1", prompt: "Find $\\lvert 3 - 4i\\rvert$.", answer: 5, explain: "$\\sqrt{9 + 16}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "conjugate properties",
      body: "$z + \\bar z = 2\\operatorname{Re}z$, $z - \\bar z = 2i\\operatorname{Im}z$; $z$ is real iff $z = \\bar z$ and purely imaginary iff $z = -\\bar z$. $\\overline{z_1 \\pm z_2} = \\bar z_1 \\pm \\bar z_2$, $\\overline{z_1/z_2} = \\bar z_1/\\bar z_2$, $\\lvert\\bar z\\rvert = \\lvert z\\rvert$. If a polynomial has real coefficients, its non-real roots come in conjugate pairs.",
    },
    {
      type: "definition",
      term: "square roots",
      body: "The square roots of $a + bi$ are $\\pm(x + iy)$ with $x = \\sqrt{\\dfrac{\\lvert z\\rvert + a}{2}}$, $y = \\operatorname{sgn}(b)\\sqrt{\\dfrac{\\lvert z\\rvert - a}{2}}$. For $5 + 12i$: $\\lvert z\\rvert = 13$, $x = 3$, $y = 2$, so $\\pm(3 + 2i)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "modulus is multiplicative",
      statement: "$\\lvert z_1z_2\\rvert = \\lvert z_1\\rvert\\lvert z_2\\rvert$ and $\\left\\lvert\\dfrac{z_1}{z_2}\\right\\rvert = \\dfrac{\\lvert z_1\\rvert}{\\lvert z_2\\rvert}$.",
      proof: ["$\\lvert z_1z_2\\rvert^2 = z_1z_2\\overline{z_1z_2} = z_1\\bar z_1 \\cdot z_2\\bar z_2 = \\lvert z_1\\rvert^2\\lvert z_2\\rvert^2$."],
    },
    {
      type: "theorem",
      name: "the triangle inequality",
      statement: "$\\big\\lvert\\lvert z_1\\rvert - \\lvert z_2\\rvert\\big\\rvert \\le \\lvert z_1 + z_2\\rvert \\le \\lvert z_1\\rvert + \\lvert z_2\\rvert$, with equality on the right iff one is a non-negative multiple of the other.",
      proof: ["$\\lvert z_1 + z_2\\rvert^2 = \\lvert z_1\\rvert^2 + \\lvert z_2\\rvert^2 + 2\\operatorname{Re}(z_1\\bar z_2)$ and $\\operatorname{Re}(z_1\\bar z_2) \\le \\lvert z_1\\bar z_2\\rvert = \\lvert z_1\\rvert\\lvert z_2\\rvert$. Geometrically, a side of a triangle is at most the sum of the other two."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "conjugate roots",
      statement: "If $p$ has real coefficients and $p(z) = 0$, then $p(\\bar z) = 0$.",
      proof: ["$p(\\bar z) = \\overline{p(z)}$ because conjugation respects sums and products and leaves real coefficients alone; so $p(\\bar z) = \\bar 0 = 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Simplify $(3 + 2i)(1 - 4i)$.",
      solution: ["$3 - 12i + 2i - 8i^2$.", "$= 3 - 10i + 8 = 11 - 10i$."],
      result: "$11 - 10i$.",
    },
    {
      type: "example",
      level: 2,
      title: "equating parts",
      problem: "Find real $x, y$ with $(x + iy)(2 - i) = 4 + 3i$.",
      solution: ["$(2x + y) + (2y - x)i = 4 + 3i$.", "$2x + y = 4$, $-x + 2y = 3$: $x = 1$, $y = 2$."],
      result: "$x = 1$, $y = 2$.",
    },
    {
      type: "example",
      level: 3,
      title: "a square root",
      problem: "Find the square roots of $-15 - 8i$.",
      solution: ["$\\lvert z\\rvert = 17$: $x^2 = \\tfrac{17 - 15}{2} = 1$, $y^2 = \\tfrac{17 + 15}2 = 16$.", "$2xy = -8$ needs opposite signs: $\\pm(1 - 4i)$. Check: $(1 - 4i)^2 = 1 - 8i - 16 = -15 - 8i$."],
      result: "$\\pm(1 - 4i)$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\sqrt{-a}\\sqrt{-b} = \\sqrt{ab}$.", right: "Write $i\\sqrt a \\cdot i\\sqrt b = -\\sqrt{ab}$." },
    { wrong: "$\\lvert z_1 + z_2\\rvert = \\lvert z_1\\rvert + \\lvert z_2\\rvert$.", right: "Only when they point the same way; in general use $\\le$." },
    { wrong: "Divide by a complex number directly.", right: "Multiply top and bottom by the conjugate." },
  ],
  formulas: [
    { label: "Product", tex: "(a + bi)(c + di) = (ac - bd) + (ad + bc)i" },
    { label: "Quotient", tex: "\\dfrac{z_1}{z_2} = \\dfrac{z_1\\bar z_2}{\\lvert z_2\\rvert^2}" },
    { label: "Modulus", tex: "\\lvert z\\rvert^2 = z\\bar z = a^2 + b^2" },
    { label: "Powers of $i$", tex: "i^{4k} = 1,\\ i^{4k+1} = i,\\ i^{4k+2} = -1,\\ i^{4k+3} = -i" },
  ],
  exercises: [
    ex(1, num("cxax-ex-1", "Find $\\operatorname{Re}\\left((1 + i)^2\\right)$.", 0, "$(1 + i)^2 = 2i$."), ["$0$."]),
    ex(1, num("cxax-ex-2", "Evaluate $i^{50}$.", -1, "$50 = 4 \\times 12 + 2$."), ["$-1$."]),
    ex(2, dp("cxax-ex-3", "Find $\\lvert(1 + i)(2 - i)\\rvert$.", Math.sqrt(10), "$\\sqrt2 \\cdot \\sqrt5$."), ["$\\sqrt{10} \\approx 3.162$."]),
    ex(2, num("cxax-ex-4", "$\\dfrac{3 + 4i}{1 + 2i} = a + bi$. Find $a$.", 2.2, "$\\dfrac{(3 + 4i)(1 - 2i)}{5} = \\dfrac{11 - 2i}{5}$."), ["$2.2$."]),
    ex(2, num("cxax-ex-5", "The roots of $x^2 + 2x + 5 = 0$ are $p \\pm qi$ with $q > 0$. Find $q$.", 2, "$-1 \\pm 2i$."), ["$2$."]),
    ex(3, num("cxax-ex-6", "A square root of $5 + 12i$ is $x + iy$ with $x > 0$. Find $x + y$.", 5, "$3 + 2i$."), ["$5$."]),
    ex(3, num("cxax-ex-7", "Find $\\sum_{k=1}^{100}i^k$.", 0, "Each block of 4 sums to 0."), ["$0$."]),
    ex(3, mc("cxax-ex-8", "A cubic with real coefficients has roots $2$ and $1 + 3i$. Its third root is", ["$1 - 3i$", "Non-real roots come in conjugate pairs."], [["$-1 - 3i$", "Conjugate, not negative."], ["$3i$", "It must pair with $1 + 3i$."]]), ["Real coefficients force conjugates."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const cx = (a: number, b: number) => (b === 0 ? `${a}` : a === 0 ? `${b === 1 ? "" : b === -1 ? "-" : b}i` : `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, d] = [r.int(-5, 5), r.nonzero(-5, 5), r.int(-5, 5), r.nonzero(-5, 5)];
      const want = r.pick(["Re", "Im"] as const);
      const re = a * c - b * d;
      const im = a * d + b * c;
      return n(`Find $\\operatorname{${want}}\\left((${cx(a, b)})(${cx(c, d)})\\right)$.`, want === "Re" ? re : im, `$(${cx(a, b)})(${cx(c, d)}) = ${cx(re, im)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b] = r.pick([[3, 4], [5, 12], [8, 15], [6, 8], [1, 1], [2, 3]] as const);
      const sa = r.pick([1, -1]);
      const sb = r.pick([1, -1]);
      const v = Math.sqrt(a * a + b * b);
      return n(`Find $\\lvert ${cx(sa * a, sb * b)}\\rvert$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sqrt{${a * a} + ${b * b}}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(5, 2030);
      const m = k % 4;
      const want = r.pick(["Re", "Im"] as const);
      const [re, im] = [[1, 0], [0, 1], [-1, 0], [0, -1]][m];
      return n(`Find $\\operatorname{${want}}(i^{${k}})$.`, want === "Re" ? re : im, `$${k} = 4 \\times ${Math.floor(k / 4)} + ${m}$, so $i^{${k}} = i^{${m}} = ${cx(re, im)}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b] = r.pick([[4, 9], [2, 8], [9, 16], [3, 12]] as const);
      const p = Math.sqrt(a * b);
      return mcNumbers(
        `$\\sqrt{-${a}}\\cdot\\sqrt{-${b}}$ equals`,
        { text: `$${-p}$`, why: `$i\\sqrt{${a}}\\cdot i\\sqrt{${b}} = -\\sqrt{${a * b}}$.` },
        [{ text: `$${p}$`, why: "$\\sqrt a\\sqrt b = \\sqrt{ab}$ fails for negatives.", misconception: "sqrt-negatives-multiply" }, { text: `$${p}i$`, why: "$i \\cdot i = -1$." }],
      );
    },
  },
];
