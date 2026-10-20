import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Harmonic progressions; arithmetic, geometric and harmonic means; the AM–GM–HM inequality and its equality case; optimisation with AM–GM; the Cauchy–Schwarz inequality. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "means-inequalities",
  title: "Means & inequalities",
  summary: "For positive numbers, the arithmetic mean is never less than the geometric mean, which is never less than the harmonic mean, with equality only when all the numbers are equal. This one inequality settles many maximum and minimum problems without calculus: a fixed sum makes the product largest when the parts are equal. Reciprocals of an arithmetic progression form a harmonic progression.",
  deps: ["geometric-progressions", "quadratics"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "harmonic progression", meaning: "A sequence whose reciprocals form an AP, such as $1, \\tfrac12, \\tfrac13, \\dots$." },
    { term: "harmonic mean", meaning: "$H = \\dfrac{n}{\\sum 1/a_i}$; for two numbers $\\dfrac{2ab}{a + b}$." },
    { term: "AM–GM inequality", meaning: "$\\dfrac{a_1 + \\dots + a_n}{n} \\ge \\sqrt[n]{a_1\\cdots a_n}$ for $a_i \\ge 0$, equality iff all equal." },
  ],
  misconceptions: {
    "amgm-negatives": "Applies AM–GM to numbers that may be negative.",
    "amgm-equality-ignored": "Claims a bound from AM–GM is the minimum without checking that equality can occur.",
  },
  steps: [
    {
      type: "motivate",
      title: "The best rectangle",
      body: "With 40 m of fencing, which rectangle has the largest area? With a fixed volume, which box uses least material? AM–GM answers instantly: make the parts equal. JEE uses the inequality both to optimise and to prove other inequalities, and expects you to know exactly when it applies.",
      realWorld: {
        title: "Average speed again",
        body: "Driving equal distances at different speeds gives an average speed equal to the harmonic mean, which is always at most the arithmetic mean: by HM ≤ AM, varying your speed never helps your average.",
      },
    },
    {
      type: "truth",
      statement: "For positive $a_1, \\dots, a_n$: $\\text{AM} = \\dfrac{\\sum a_i}{n} \\ge \\text{GM} = \\sqrt[n]{\\prod a_i} \\ge \\text{HM} = \\dfrac{n}{\\sum 1/a_i}$, with equality throughout iff all $a_i$ are equal. For two numbers $G^2 = AH$. Consequences: for $x > 0$, $x + \\tfrac1x \\ge 2$; with a fixed sum the product is largest when the terms are equal; with a fixed product the sum is smallest when they are equal. **Cauchy–Schwarz**: $(\\sum a_ib_i)^2 \\le (\\sum a_i^2)(\\sum b_i^2)$.",
      body: "A sequence is a **harmonic progression** when its reciprocals are in AP; the $n$th term of the HP with reciprocals $a, a + d, \\dots$ is $\\dfrac1{a + (n - 1)d}$, and there is no simple sum formula. To use AM–GM for a minimum, split the expression into positive parts whose **product is constant**, then check equality can be reached: $x + \\tfrac4x \\ge 2\\sqrt4 = 4$, attained at $x = 2$. If the parts can't be equal under the constraints, the bound isn't the minimum. AM–GM needs non-negative numbers: $x + \\tfrac1x \\ge 2$ fails for $x < 0$.",
    },
    {
      type: "predict",
      misconception: "amgm-equality-ignored",
      item: {
        kind: "mc",
        id: "mni-predict-1",
        prompt: "For $x \\ge 3$, what is the least value of $x + \\tfrac1x$?",
        options: [
          { id: "a", text: "$\\tfrac{10}3$, at $x = 3$", correct: true, why: "The function increases for $x > 1$; equality $x = 1$ isn't allowed." },
          { id: "b", text: "2, by AM–GM", misconception: "amgm-equality-ignored", why: "AM–GM's bound needs $x = 1$, which is excluded." },
          { id: "c", text: "3", why: "$3 + \\tfrac13 > 3$." },
        ],
      },
      reveal: {
        body: "AM–GM gives $x + \\tfrac1x \\ge 2$ with equality only at $x = 1$. With $x \\ge 3$ that point is out of reach, so 2 is a true lower bound but not attained. On $[3, \\infty)$ the expression increases, so its least value is at $x = 3$: $\\tfrac{10}3$. A bound is the minimum only if equality can actually happen.",
      },
      resolve: {
        kind: "mc",
        id: "mni-resolve-1",
        prompt: "AM–GM shows $x + \\tfrac9x \\ge 6$ for $x > 0$. This is the minimum because",
        options: [
          { id: "a", text: "equality holds at $x = 3$, which is allowed", correct: true, why: "$x = \\tfrac9x$ at $x = 3$." },
          { id: "b", text: "AM–GM bounds are always minima", misconception: "amgm-equality-ignored", why: "Only when equality is attainable." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mni-check-1",
        prompt: "Is $x + \\tfrac1x \\ge 2$ true for all real $x \\ne 0$?",
        options: [
          { id: "a", text: "No: for $x < 0$ the sum is at most $-2$", correct: true, why: "AM–GM needs positive terms." },
          { id: "b", text: "Yes, by AM–GM", misconception: "amgm-negatives", why: "AM–GM only applies to non-negative numbers." },
          { id: "c", text: "Yes, since squares are positive", why: "At $x = -1$ the sum is $-2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mni-check-2",
        prompt: "Two positive numbers have AM 5 and GM 4. Their HM is",
        options: [
          { id: "a", text: "3.2", correct: true, why: "$H = G^2/A = 16/5$." },
          { id: "b", text: "3", why: "Use $G^2 = AH$." },
          { id: "c", text: "4.5", why: "HM is the smallest of the three." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The F1 score is the harmonic mean of precision and recall, so it is dragged down by whichever is smaller (§{precision-recall}). Cauchy–Schwarz bounds cosine similarity between $-1$ and 1, and Jensen's inequality, a cousin of AM–GM, underlies the evidence lower bound in variational inference.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mni-produce-1", prompt: "Find the least value of $x + \\tfrac4x$ for $x > 0$.", answer: 4, explain: "AM–GM, equality at $x = 2$." },
        { kind: "number", id: "mni-produce-2", prompt: "$x + y = 10$ with $x, y > 0$. Find the greatest value of $xy$.", answer: 25, explain: "Equal parts: $5 \\times 5$." },
        {
          kind: "mc",
          id: "mni-produce-3",
          prompt: "For $x < 0$, the expression $x + \\tfrac1x$ is",
          options: [
            { id: "a", text: "at most $-2$", correct: true, why: "Apply AM–GM to $-x$ and $-\\tfrac1x$." },
            { id: "b", text: "at least 2", misconception: "amgm-negatives", why: "Both terms are negative." },
          ],
        },
        {
          kind: "mc",
          id: "mni-produce-4",
          prompt: "For $0 < x \\le 1$, the least value of $x + \\tfrac{4}{x}$ is",
          options: [
            { id: "a", text: "5, at $x = 1$", correct: true, why: "Equality $x = 2$ is excluded; the expression decreases up to $x = 1$." },
            { id: "b", text: "4", misconception: "amgm-equality-ignored", why: "That needs $x = 2$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mni-review-1", prompt: "Find the harmonic mean of 4 and 12.", answer: 6, explain: "$\\tfrac{2 \\times 48}{16}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "weighted AM–GM",
      body: "For positive $a_i$ and weights $w_i > 0$ with $\\sum w_i = 1$: $\\sum w_ia_i \\ge \\prod a_i^{w_i}$. Splitting terms helps: to minimise $x^2 + \\tfrac{2}{x}$ for $x > 0$, write it as $x^2 + \\tfrac1x + \\tfrac1x \\ge 3\\sqrt[3]{1} = 3$, with equality at $x = 1$.",
    },
    {
      type: "definition",
      term: "Cauchy–Schwarz",
      body: "$(a_1b_1 + \\dots + a_nb_n)^2 \\le (a_1^2 + \\dots + a_n^2)(b_1^2 + \\dots + b_n^2)$, with equality iff the vectors are proportional. It is $\\lvert u \\cdot v\\rvert \\le \\lvert u\\rvert\\lvert v\\rvert$ (§{vector}). Example: if $x^2 + y^2 = 1$ then $3x + 4y \\le 5$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "AM ≥ GM for two numbers",
      statement: "For $a, b \\ge 0$, $\\dfrac{a + b}2 \\ge \\sqrt{ab}$, with equality iff $a = b$.",
      proof: ["$\\dfrac{a + b}2 - \\sqrt{ab} = \\dfrac{(\\sqrt a - \\sqrt b)^2}{2} \\ge 0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "GM ≥ HM",
      statement: "For positive $a, b$: $\\sqrt{ab} \\ge \\dfrac{2ab}{a + b}$, and $G^2 = AH$.",
      proof: ["$AH = \\dfrac{a + b}{2} \\cdot \\dfrac{2ab}{a + b} = ab = G^2$; since $A \\ge G$, $H = G^2/A \\le G$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "optimising with AM–GM",
      statement: "Fixed sum: the product is greatest when the parts are equal. Fixed product: the sum is least when the parts are equal. Always check that the equal-parts point is allowed.",
      proof: ["Equality in AM–GM occurs exactly when all terms are equal."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the least value of $x + \\tfrac4x$ for $x > 0$.",
      solution: ["$x + \\tfrac4x \\ge 2\\sqrt{x \\cdot \\tfrac4x} = 4$.", "Equality when $x = \\tfrac4x$, $x = 2$, allowed."],
      result: "4.",
    },
    {
      type: "example",
      level: 2,
      title: "a box",
      problem: "A closed box with a square base has volume 8 m³. Find the least surface area.",
      solution: ["Base side $x$, height $8/x^2$: $S = 2x^2 + \\dfrac{32}{x} = 2x^2 + \\dfrac{16}x + \\dfrac{16}x \\ge 3\\sqrt[3]{2 \\times 256} = 3 \\times 8 = 24$.", "Equality at $2x^2 = 16/x$, $x = 2$: a cube."],
      result: "24 m².",
    },
    {
      type: "example",
      level: 3,
      title: "a classic product",
      problem: "For positive $a, b$, show $(a + b)\\left(\\tfrac1a + \\tfrac1b\\right) \\ge 4$.",
      solution: ["AM–GM on each bracket: $a + b \\ge 2\\sqrt{ab}$ and $\\tfrac1a + \\tfrac1b \\ge \\tfrac2{\\sqrt{ab}}$.", "Multiply: the product is at least 4, with equality iff $a = b$."],
      result: "Minimum 4.",
    },
  ],
  pitfalls: [
    { wrong: "Apply AM–GM to negative numbers.", right: "Check every term is non-negative." },
    { wrong: "Take the AM–GM bound as the minimum without checking.", right: "Equality must be attainable under the constraints." },
    { wrong: "Split an expression into parts whose product isn't constant.", right: "Choose parts so the product is fixed." },
  ],
  formulas: [
    { label: "Means", tex: "\\text{AM} \\ge \\text{GM} \\ge \\text{HM}" },
    { label: "Two numbers", tex: "G^2 = AH,\\ H = \\dfrac{2ab}{a + b}" },
    { label: "Reciprocal", tex: "x + \\tfrac1x \\ge 2\\ (x > 0)" },
    { label: "Cauchy–Schwarz", tex: "(\\textstyle\\sum a_ib_i)^2 \\le \\sum a_i^2\\sum b_i^2" },
  ],
  exercises: [
    ex(1, num("mnix-ex-1", "Find the geometric mean of 4 and 9.", 6, "$\\sqrt{36}$."), ["$6$."]),
    ex(1, num("mnix-ex-2", "Find the least value of $x + \\tfrac{9}{x}$ for $x > 0$.", 6, "$2\\sqrt9$."), ["$6$."]),
    ex(2, num("mnix-ex-3", "$2x + 3y = 12$ with $x, y > 0$. Find the greatest value of $xy$.", 6, "$2x \\cdot 3y \\le 36$."), ["$6xy \\le \\left(\\tfrac{12}{2}\\right)^2 = 36$, so $xy \\le 6$."]),
    ex(2, dp("mnix-ex-4", "The HM of two numbers is 4.8 and their GM is 6. Find their AM.", 7.5, "$A = G^2/H$."), ["$36/4.8 = 7.5$."]),
    ex(2, num("mnix-ex-5", "The 5th term of a harmonic progression with first two terms $\\tfrac12$ and $\\tfrac15$ is $\\tfrac1k$. Find $k$.", 14, "Reciprocals 2, 5, 8, …"), ["$2 + 4 \\times 3 = 14$."]),
    ex(3, num("mnix-ex-6", "Find the least value of $x^2 + \\tfrac{16}{x}$ for $x > 0$.", 12, "Split $\\tfrac{16}x = \\tfrac8x + \\tfrac8x$."), ["$\\ge 3\\sqrt[3]{64} = 12$ at $x = 2$."]),
    ex(3, num("mnix-ex-7", "If $x^2 + y^2 = 1$, find the greatest value of $3x + 4y$.", 5, "Cauchy–Schwarz."), ["$\\sqrt{(9 + 16)(1)} = 5$."]),
    ex(3, mc("mnix-ex-8", "For positive $a, b, c$ with $a + b + c = 3$, the greatest value of $abc$ is", ["1", "AM–GM: $abc \\le 1$, at $a = b = c = 1$."], [["3", "That is the sum."], ["$\\tfrac{27}{8}$", "Check $\\left(\\tfrac33\\right)^3$."]]), ["Equal parts maximise the product."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([1, 4, 9, 16, 25, 36]);
      const a = r.pick([1, 1, 4, 9]);
      const v = 2 * Math.sqrt(a * k);
      return n(`Find the least value of $${a === 1 ? "" : a}x + \\dfrac{${k}}{x}$ for $x > 0$ (3 decimals).`, Math.round(v * 1000) / 1000, `AM–GM: $\\ge 2\\sqrt{${a * k}}$, attained at $x = ${r2(Math.sqrt(k / a))}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = r.int(4, 30);
      return n(`Two positive numbers add to ${s}. Find the greatest possible product (2 decimals).`, r2((s / 2) ** 2), `Equal parts: $(${s}/2)^2$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 20);
      const b = r.int(2, 20);
      const want = r.pick(["AM", "GM", "HM"] as const);
      const v = want === "AM" ? (a + b) / 2 : want === "GM" ? Math.sqrt(a * b) : (2 * a * b) / (a + b);
      return n(`Find the ${want} of ${a} and ${b} (3 decimals).`, Math.round(v * 1000) / 1000, want === "AM" ? `$(${a} + ${b})/2$.` : want === "GM" ? `$\\sqrt{${a * b}}$.` : `$\\dfrac{2 \\times ${a * b}}{${a + b}}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const m = r.pick([2, 3, 4]);
      const k = m * m;
      const lo = m + r.int(1, 3);
      return mcNumbers(
        `For $x \\ge ${lo}$, the least value of $x + \\dfrac{${k}}{x}$ is`,
        { text: `$${lo} + \\tfrac{${k}}{${lo}}$, at $x = ${lo}$`, why: `AM–GM's equality point $x = ${m}$ is excluded, and the expression increases beyond it.` },
        [{ text: `${2 * m}`, why: `That needs $x = ${m}$.`, misconception: "amgm-equality-ignored" }],
      );
    },
  },
];
