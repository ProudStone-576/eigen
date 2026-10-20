import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Geometric progressions: nth term, finite sums, infinite sums and convergence, geometric means, recurring decimals, arithmetico-geometric series. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "geometric-progressions",
  title: "Geometric progressions",
  summary: "A geometric progression multiplies by the same ratio r each step: a, ar, ar², …. Its nth term is arⁿ⁻¹ and the sum of n terms is a(rⁿ − 1)/(r − 1). When |r| < 1 the terms shrink fast enough that the infinite sum is finite, a/(1 − r), which explains recurring decimals and many probability and physics series.",
  deps: ["arithmetic-progressions", "exponents-logs"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "common ratio", meaning: "$r = a_{n+1}/a_n$, the same for every $n$." },
    { term: "geometric mean", meaning: "$\\sqrt{ab}$ for positive $a, b$; $a, G, b$ form a GP exactly when $G^2 = ab$." },
    { term: "convergent series", meaning: "An infinite sum whose partial sums approach a finite limit." },
  ],
  misconceptions: {
    "infinite-gp-diverge": "Uses $\\dfrac a{1 - r}$ for an infinite GP even when $\\lvert r\\rvert \\ge 1$.",
    "gp-ratio-difference": "Finds the common ratio by subtracting consecutive terms instead of dividing.",
  },
  steps: [
    {
      type: "motivate",
      title: "Growth by multiplication",
      body: "A rumour doubles its audience every hour; a ball bounces to 60% of its previous height; a loan grows 1% a month. Each is a geometric progression. Their sums answer \"how many in total?\" and \"how far does the ball travel?\", and the infinite sum explains why $0.999\\ldots = 1$.",
      realWorld: {
        title: "Loan instalments",
        body: "An EMI (equated monthly instalment) is found by setting the loan equal to the sum of the instalments' present values, a geometric series with ratio $1/(1 + i)$: $\\text{EMI} = \\dfrac{Pi(1 + i)^n}{(1 + i)^n - 1}$.",
      },
    },
    {
      type: "truth",
      statement: "The GP $a, ar, ar^2, \\dots$ has $n$th term $a_n = ar^{n-1}$ and, for $r \\ne 1$, sum $S_n = \\dfrac{a(r^n - 1)}{r - 1} = \\dfrac{a(1 - r^n)}{1 - r}$. If $\\lvert r\\rvert < 1$, then $r^n \\to 0$ and the **infinite sum** is $S_\\infty = \\dfrac{a}{1 - r}$; if $\\lvert r\\rvert \\ge 1$ (and $a \\ne 0$) the series diverges.",
      body: "Three positive numbers in GP: $\\tfrac ar, a, ar$, with product $a^3$. Inserting $k$ geometric means between $p$ and $q$ gives ratio $r = (q/p)^{1/(k+1)}$. Recurring decimals are infinite GPs: $0.\\overline{36} = \\tfrac{36}{100} + \\tfrac{36}{100^2} + \\dots = \\tfrac{36}{99} = \\tfrac4{11}$. An **arithmetico-geometric** series $\\sum(a + (k - 1)d)r^{k-1}$ with $\\lvert r\\rvert < 1$ sums to $\\dfrac{a}{1 - r} + \\dfrac{dr}{(1 - r)^2}$: multiply by $r$, subtract, and sum the GP that appears. Logarithms find how many terms are needed: $ar^{n-1} > K$ gives $n > 1 + \\dfrac{\\ln(K/a)}{\\ln r}$ (§{exponents-logs}).",
    },
    {
      type: "predict",
      misconception: "infinite-gp-diverge",
      item: {
        kind: "mc",
        id: "gpr-predict-1",
        prompt: "What is $1 + 2 + 4 + 8 + \\dots$ (forever)?",
        options: [
          { id: "a", text: "It has no finite value: the terms grow, so the series diverges", correct: true, why: "$\\lvert r\\rvert = 2 \\ge 1$." },
          { id: "b", text: "$-1$, from $\\dfrac{a}{1 - r} = \\dfrac{1}{1 - 2}$", misconception: "infinite-gp-diverge", why: "That formula needs $\\lvert r\\rvert < 1$." },
          { id: "c", text: "2", why: "That is $1 + \\tfrac12 + \\tfrac14 + \\dots$." },
        ],
      },
      reveal: {
        body: "The partial sums are $1, 3, 7, 15, \\dots = 2^n - 1$, which grow without bound. The formula $S_\\infty = \\dfrac a{1 - r}$ comes from letting $r^n \\to 0$, which only happens when $\\lvert r\\rvert < 1$. Plugging $r = 2$ in anyway gives the nonsense $-1$.",
      },
      resolve: {
        kind: "mc",
        id: "gpr-resolve-1",
        prompt: "The infinite sum $3 - 3 + 3 - 3 + \\dots$",
        options: [
          { id: "a", text: "doesn't exist: the partial sums alternate 3, 0, 3, 0", correct: true, why: "$r = -1$, so $\\lvert r\\rvert = 1$." },
          { id: "b", text: "is $\\tfrac32$, from $\\dfrac{3}{1 - (-1)}$", misconception: "infinite-gp-diverge", why: "The formula needs $\\lvert r\\rvert < 1$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gpr-check-1",
        prompt: "The sequence $2, 6, 18, \\dots$ has common ratio",
        options: [
          { id: "a", text: "3", correct: true, why: "$6/2$." },
          { id: "b", text: "4", misconception: "gp-ratio-difference", why: "That is the difference $6 - 2$." },
          { id: "c", text: "12", why: "That is $18 - 6$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gpr-check-2",
        prompt: "$0.\\overline{36}$ as a fraction is",
        options: [
          { id: "a", text: "$\\tfrac4{11}$", correct: true, why: "$\\tfrac{0.36}{1 - 0.01} = \\tfrac{36}{99}$." },
          { id: "b", text: "$\\tfrac{9}{25}$", why: "That is $0.36$ exactly, not recurring." },
          { id: "c", text: "$\\tfrac{36}{100}$", why: "The repeats add more." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Discounted rewards in reinforcement learning are geometric series: with discount $\\gamma < 1$, a constant reward $R$ forever is worth $\\dfrac{R}{1 - \\gamma}$. Exponential moving averages weight past values geometrically (§{exponential-smoothing}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "gpr-produce-1", prompt: "Find the 8th term of $2, 6, 18, \\dots$.", answer: 4374, explain: "$2 \\times 3^7$." },
        { kind: "number", id: "gpr-produce-2", prompt: "A ball dropped from 10 m rebounds to 60% of its height each time. Find the total distance travelled, in metres.", answer: 40, explain: "$10 + 2 \\times \\tfrac{6}{1 - 0.6}$." },
        {
          kind: "mc",
          id: "gpr-produce-3",
          prompt: "$5 + 10 + 20 + \\dots$ continued forever is",
          options: [
            { id: "a", text: "divergent", correct: true, why: "$r = 2$." },
            { id: "b", text: "$-5$", misconception: "infinite-gp-diverge", why: "$\\tfrac{a}{1 - r}$ needs $\\lvert r\\rvert < 1$." },
          ],
        },
        {
          kind: "mc",
          id: "gpr-produce-4",
          prompt: "$81, 27, 9, \\dots$ has common ratio",
          options: [
            { id: "a", text: "$\\tfrac13$", correct: true, why: "$27/81$." },
            { id: "b", text: "$-54$", misconception: "gp-ratio-difference", why: "Divide, don't subtract." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "gpr-review-1", prompt: "Find $1 + \\tfrac12 + \\tfrac14 + \\dots$.", answer: 2, explain: "$\\tfrac1{1 - 1/2}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "geometric means",
      body: "$k$ geometric means between positive $p$ and $q$ make $p, G_1, \\dots, G_k, q$ a GP with $r = (q/p)^{1/(k+1)}$; their product is $(\\sqrt{pq})^k$. Between 2 and 162, three means: $r = 81^{1/4} = 3$, giving 6, 18, 54.",
    },
    {
      type: "definition",
      term: "arithmetico-geometric series",
      body: "$S = a + (a + d)r + (a + 2d)r^2 + \\dots$. Then $S - rS = a + d(r + r^2 + \\dots)$, so for $\\lvert r\\rvert < 1$, $S = \\dfrac{a}{1 - r} + \\dfrac{dr}{(1 - r)^2}$. Example: $\\sum_{k \\ge 1}\\dfrac{k}{2^k} = 2$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the finite GP sum",
      statement: "For $r \\ne 1$, $a + ar + \\dots + ar^{n-1} = \\dfrac{a(1 - r^n)}{1 - r}$.",
      proof: ["Multiply $S_n$ by $r$ and subtract: $S_n - rS_n = a - ar^n$, since all middle terms cancel."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the infinite GP",
      statement: "If $\\lvert r\\rvert < 1$, $\\sum_{k=0}^\\infty ar^k = \\dfrac{a}{1 - r}$; if $\\lvert r\\rvert \\ge 1$ and $a \\ne 0$, the series diverges.",
      proof: ["$S_n = \\dfrac{a(1 - r^n)}{1 - r}$ and $r^n \\to 0$ exactly when $\\lvert r\\rvert < 1$. Otherwise the terms don't tend to 0, so the sums can't settle."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "recurring decimals",
      statement: "$0.\\overline{d_1d_2\\dots d_k} = \\dfrac{d_1d_2\\dots d_k}{10^k - 1}$.",
      proof: ["It is the GP $\\dfrac{N}{10^k} + \\dfrac{N}{10^{2k}} + \\dots = \\dfrac{N/10^k}{1 - 10^{-k}}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the sum of the first 8 terms of $2, 6, 18, \\dots$.",
      solution: ["$S_8 = \\dfrac{2(3^8 - 1)}{3 - 1}$.", "$= 3^8 - 1 = 6560$."],
      result: "6560.",
    },
    {
      type: "example",
      level: 2,
      title: "a bouncing ball",
      problem: "A ball falls 10 m and each rebound reaches 60% of the previous height. Find the total distance.",
      solution: ["Down 10, then up and down $6, 3.6, \\dots$ each twice.", "$10 + 2 \\times \\dfrac{6}{1 - 0.6} = 10 + 30 = 40$ m."],
      result: "40 m.",
    },
    {
      type: "example",
      level: 3,
      title: "an AGP",
      problem: "Find $\\sum_{k=1}^\\infty\\dfrac{k}{2^k}$.",
      solution: ["$S = \\tfrac12 + \\tfrac2{4} + \\tfrac3{8} + \\dots$; $\\tfrac12S = \\tfrac14 + \\tfrac28 + \\dots$.", "$S - \\tfrac12S = \\tfrac12 + \\tfrac14 + \\tfrac18 + \\dots = 1$, so $S = 2$."],
      result: "2.",
    },
  ],
  pitfalls: [
    { wrong: "Use $\\dfrac a{1 - r}$ whatever $r$ is.", right: "Only for $\\lvert r\\rvert < 1$." },
    { wrong: "Find $r$ by subtraction.", right: "$r = a_{n+1}/a_n$." },
    { wrong: "Count $n$ terms as $ar^n$ for the last.", right: "The $n$th term is $ar^{n-1}$." },
  ],
  formulas: [
    { label: "nth term", tex: "a_n = ar^{n-1}" },
    { label: "Finite sum", tex: "S_n = \\dfrac{a(1 - r^n)}{1 - r}" },
    { label: "Infinite sum", tex: "S_\\infty = \\dfrac a{1 - r},\\ \\lvert r\\rvert < 1" },
    { label: "AGP", tex: "\\dfrac{a}{1 - r} + \\dfrac{dr}{(1 - r)^2}" },
  ],
  exercises: [
    ex(1, num("gprx-ex-1", "Find the 6th term of $3, 6, 12, \\dots$.", 96, "$3 \\times 2^5$."), ["$96$."]),
    ex(1, num("gprx-ex-2", "Find $\\sum_{k=0}^{\\infty}\\left(\\tfrac13\\right)^k$.", 1.5, "$\\tfrac1{1 - 1/3}$."), ["$1.5$."]),
    ex(2, num("gprx-ex-3", "Find the sum of the first 10 terms of $1, 2, 4, \\dots$.", 1023, "$2^{10} - 1$."), ["$1023$."]),
    ex(2, fr("gprx-ex-4", "Write $0.\\overline{27}$ as a fraction.", 27 / 99, "$27/99$."), ["$\\tfrac3{11}$."]),
    ex(2, num("gprx-ex-5", "Three geometric means are inserted between 2 and 162. Find the middle one.", 18, "$r = 3$."), ["$6, 18, 54$: the middle is 18."]),
    ex(3, num("gprx-ex-6", "Find $\\sum_{k=1}^\\infty\\dfrac{2k - 1}{3^{k-1}}$.", 3, "AGP with $a = 1$, $d = 2$, $r = \\tfrac13$."), ["$\\dfrac1{2/3} + \\dfrac{2/3}{4/9} = 1.5 + 1.5 = 3$."]),
    ex(3, num("gprx-ex-7", "What is the least $n$ for which $1 + 2 + 4 + \\dots + 2^{n-1}$ exceeds 1000?", 10, "$2^n - 1 > 1000$."), ["$2^{10} - 1 = 1023$."]),
    ex(3, mc("gprx-ex-8", "The infinite GP $1 + x + x^2 + \\dots$ converges exactly when", ["$-1 < x < 1$", "$\\lvert r\\rvert < 1$."], [["$x < 1$", "$x = -2$ diverges."], ["$x \\ne 1$", "Any $\\lvert x\\rvert \\ge 1$ diverges."]]), ["Then its sum is $\\tfrac1{1 - x}$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([1, 2, 3, 5]);
      const q = r.pick([2, 3, -2]);
      const nn = r.int(4, 9);
      const want = r.pick(["term", "sum"] as const);
      const v = want === "term" ? a * q ** (nn - 1) : (a * (q ** nn - 1)) / (q - 1);
      return n(`For the GP $${a}, ${a * q}, ${a * q * q}, \\dots$, find the ${want === "term" ? `${nn}th term` : `sum of the first ${nn} terms`}.`, v, want === "term" ? `$${a} \\times (${q})^{${nn - 1}} = ${v}$.` : `$\\dfrac{${a}((${q})^{${nn}} - 1)}{${q} - 1} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(1, 20);
      const [num_, den] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [2, 5]] as const);
      const q = num_ / den;
      const v = a / (1 - q);
      return n(`Find the sum to infinity of the GP with first term ${a} and ratio $${num_ < 0 ? "-" : ""}\\tfrac{${Math.abs(num_)}}{${den}}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{${a}}{1 - (${r2(q)})} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const h = r.pick([5, 10, 12, 20]);
      const f = r.pick([0.5, 0.6, 0.75, 0.8]);
      const v = h + (2 * h * f) / (1 - f);
      return n(`A ball dropped from ${h} m rebounds to ${Math.round(f * 100)}% of its previous height each time. Find the total distance travelled in metres (2 decimals).`, r2(v), `$${h} + 2 \\times \\dfrac{${r2(h * f)}}{1 - ${f}} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.pick([1, 2, 3]);
      const q = r.pick([2, 3, -2, 4]);
      return mcNumbers(
        `The infinite series $${a} + ${a * q} + ${a * q * q} + \\dots$ is`,
        { text: "divergent: its terms don't shrink", why: `$\\lvert r\\rvert = ${Math.abs(q)} \\ge 1$.` },
        [{ text: `$${r2(a / (1 - q))}$`, why: "That misuses $\\tfrac{a}{1 - r}$.", misconception: "infinite-gp-diverge" }],
      );
    },
  },
];
