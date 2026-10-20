import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Sigma notation and its linearity; sums of the first n natural numbers, squares and cubes; sums of polynomial nth terms; telescoping sums and partial fractions; the method of differences for series whose differences form an AP or GP. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const s1 = (n: number) => (n * (n + 1)) / 2;
const s2 = (n: number) => (n * (n + 1) * (2 * n + 1)) / 6;
const s3 = (n: number) => s1(n) ** 2;

const base: ConceptNode = {
  id: "special-series",
  title: "Special series & summation",
  summary: "Three formulas, for Σk, Σk² and Σk³, sum any series whose nth term is a polynomial in k, because Σ is linear. Series with fractions often telescope: rewrite each term as a difference f(k) − f(k + 1), and almost everything cancels. When a series has no obvious formula, look at its differences: if they form an AP, the nth term is a quadratic.",
  deps: ["geometric-progressions"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "sigma notation", meaning: "$\\sum_{k=1}^{n}a_k = a_1 + a_2 + \\dots + a_n$." },
    { term: "telescoping sum", meaning: "A sum of differences $\\sum(f(k) - f(k + 1))$ in which inner terms cancel, leaving $f(1) - f(n + 1)$." },
    { term: "method of differences", meaning: "Finding a series' general term from the pattern in differences between consecutive terms." },
  ],
  misconceptions: {
    "sum-squares-square": "Thinks $\\sum k^2 = \\left(\\sum k\\right)^2$.",
    "telescope-drop-terms": "Cancels every term of a telescoping sum, forgetting the surviving first and last pieces.",
  },
  steps: [
    {
      type: "motivate",
      title: "Adding without adding",
      body: "How many squares of any size are on a chessboard? $1^2 + 2^2 + \\dots + 8^2$. What is $\\tfrac1{1\\cdot2} + \\tfrac1{2\\cdot3} + \\dots + \\tfrac1{99\\cdot100}$? Both have neat closed forms, and JEE expects you to recognise which tool, power sums or telescoping, a series calls for.",
      realWorld: {
        title: "Cannonball pyramids",
        body: "A square pyramid of stacked cannonballs with $n$ layers holds $1^2 + 2^2 + \\dots + n^2 = \\tfrac{n(n + 1)(2n + 1)}{6}$ balls; sailors once used exactly this to count shot.",
      },
    },
    {
      type: "truth",
      statement: "$\\sum_{k=1}^nk = \\dfrac{n(n + 1)}2$, $\\sum_{k=1}^nk^2 = \\dfrac{n(n + 1)(2n + 1)}6$, $\\sum_{k=1}^nk^3 = \\left(\\dfrac{n(n + 1)}2\\right)^2$. Sigma is **linear**: $\\sum(\\alpha a_k + \\beta b_k) = \\alpha\\sum a_k + \\beta\\sum b_k$, so $\\sum(2k^2 + 3k - 1)$ splits into the three formulas. **Telescoping**: $\\sum_{k=1}^n(f(k) - f(k + 1)) = f(1) - f(n + 1)$; for instance $\\dfrac{1}{k(k + 1)} = \\dfrac1k - \\dfrac1{k + 1}$ gives $\\sum_{k=1}^n\\dfrac{1}{k(k + 1)} = 1 - \\dfrac1{n + 1}$.",
      body: "Note $\\sum k^3 = (\\sum k)^2$, but $\\sum k^2$ is **not** $(\\sum k)^2$. For products of consecutive integers, telescope: $k(k + 1) = \\tfrac13[k(k + 1)(k + 2) - (k - 1)k(k + 1)]$, so $\\sum_{k=1}^nk(k + 1) = \\tfrac{n(n + 1)(n + 2)}{3}$. **Method of differences**: for $2, 5, 10, 17, 26, \\dots$ the differences $3, 5, 7, 9$ form an AP, so $a_n$ is quadratic: $a_n = n^2 + 1$. If the differences form a GP, $a_n$ is $A r^n + B$ (§{geometric-progressions}). For infinite telescoping sums, take the limit of $f(n + 1)$.",
    },
    {
      type: "predict",
      misconception: "sum-squares-square",
      item: {
        kind: "mc",
        id: "sps-predict-1",
        prompt: "$1^2 + 2^2 + \\dots + 10^2$ equals",
        options: [
          { id: "a", text: "385", correct: true, why: "$\\tfrac{10 \\times 11 \\times 21}{6}$." },
          { id: "b", text: "3025, which is $(1 + \\dots + 10)^2$", misconception: "sum-squares-square", why: "Squaring the sum adds all the cross terms $2ij$." },
          { id: "c", text: "100", why: "That is only the last term." },
        ],
      },
      reveal: {
        body: "$(1 + 2 + \\dots + 10)^2 = 55^2 = 3025$ counts each $k^2$ once and every product $ij$ with $i \\ne j$ twice. The sum of squares is just the diagonal part: $\\tfrac{10 \\cdot 11 \\cdot 21}6 = 385$. Curiously, 3025 is the sum of the cubes: $\\sum k^3 = (\\sum k)^2$.",
      },
      resolve: {
        kind: "mc",
        id: "sps-resolve-1",
        prompt: "$\\sum_{k=1}^{5}k^2$ is",
        options: [
          { id: "a", text: "55", correct: true, why: "$1 + 4 + 9 + 16 + 25$." },
          { id: "b", text: "225", misconception: "sum-squares-square", why: "That is $15^2$, the square of the sum." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sps-check-1",
        prompt: "$\\dfrac1{1 \\cdot 2} + \\dfrac1{2 \\cdot 3} + \\dots + \\dfrac{1}{99 \\cdot 100}$ equals",
        options: [
          { id: "a", text: "$\\tfrac{99}{100}$", correct: true, why: "$1 - \\tfrac1{100}$: the first and last pieces survive." },
          { id: "b", text: "0, since everything cancels", misconception: "telescope-drop-terms", why: "The first $\\tfrac11$ and last $-\\tfrac1{100}$ remain." },
          { id: "c", text: "1", why: "The last term subtracts $\\tfrac1{100}$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sps-check-2",
        prompt: "The $n$th term of $2, 5, 10, 17, 26, \\dots$ is",
        options: [
          { id: "a", text: "$n^2 + 1$", correct: true, why: "Differences 3, 5, 7, 9 are in AP." },
          { id: "b", text: "$3n - 1$", why: "The differences aren't constant." },
          { id: "c", text: "$2^n$", why: "$2^3 = 8 \\ne 10$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Counting operations in algorithms uses these sums: comparing every pair of $n$ items costs $\\sum k = \\tfrac{n(n - 1)}2$ steps, which is why naive pairwise methods scale as $n^2$ (§{statistical-computing}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "sps-produce-1", prompt: "Find $1^3 + 2^3 + \\dots + 10^3$.", answer: 3025, explain: "$55^2$." },
        { kind: "number", id: "sps-produce-2", prompt: "How many squares of all sizes are on an $8 \\times 8$ chessboard?", answer: 204, explain: "$\\sum_{k=1}^8k^2$." },
        {
          kind: "mc",
          id: "sps-produce-3",
          prompt: "$\\sum_{k=1}^{n}\\left(\\tfrac1k - \\tfrac1{k + 1}\\right)$ equals",
          options: [
            { id: "a", text: "$1 - \\tfrac1{n + 1}$", correct: true, why: "Only the ends survive." },
            { id: "b", text: "0", misconception: "telescope-drop-terms", why: "The first and last terms don't cancel." },
          ],
        },
        {
          kind: "mc",
          id: "sps-produce-4",
          prompt: "$\\sum_{k=1}^{n}k^2$ compared with $\\left(\\sum_{k=1}^nk\\right)^2$ (for $n \\ge 2$) is",
          options: [
            { id: "a", text: "smaller", correct: true, why: "The square of the sum adds positive cross terms." },
            { id: "b", text: "equal", misconception: "sum-squares-square", why: "Only cubes give $(\\sum k)^2$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "sps-review-1", prompt: "Find $\\sum_{k=1}^{20}k$.", answer: 210, explain: "$20 \\times 21/2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "partial fractions for telescoping",
      body: "$\\dfrac{1}{k(k + d)} = \\dfrac1d\\left(\\dfrac1k - \\dfrac1{k + d}\\right)$ and $\\dfrac{1}{k(k + 1)(k + 2)} = \\dfrac12\\left(\\dfrac{1}{k(k + 1)} - \\dfrac{1}{(k + 1)(k + 2)}\\right)$. With $d > 1$, $d$ terms survive at each end.",
    },
    {
      type: "definition",
      term: "the method of differences",
      body: "List $a_1, a_2, \\dots$, then the differences $\\Delta_k = a_{k+1} - a_k$. Then $a_n = a_1 + \\sum_{k=1}^{n-1}\\Delta_k$. If the first differences are constant, $a_n$ is linear; if the second differences are constant, quadratic; if the differences are in GP with ratio $r$, $a_n = Ar^n + B$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the sum of squares",
      statement: "$\\sum_{k=1}^nk^2 = \\dfrac{n(n + 1)(2n + 1)}{6}$.",
      proof: ["Telescope $(k + 1)^3 - k^3 = 3k^2 + 3k + 1$ over $k = 1, \\dots, n$: $(n + 1)^3 - 1 = 3\\sum k^2 + 3\\cdot\\tfrac{n(n + 1)}2 + n$; solve for $\\sum k^2$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the sum of cubes",
      statement: "$\\sum_{k=1}^nk^3 = \\left(\\dfrac{n(n + 1)}{2}\\right)^2$.",
      proof: ["By induction (§{induction}): the step needs $\\left(\\tfrac{n(n + 1)}2\\right)^2 + (n + 1)^3 = \\left(\\tfrac{(n + 1)(n + 2)}2\\right)^2$, which factorises as $\\tfrac{(n + 1)^2}{4}(n^2 + 4n + 4)$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "products of consecutive integers",
      statement: "$\\sum_{k=1}^nk(k + 1) = \\dfrac{n(n + 1)(n + 2)}3$ and $\\sum_{k=1}^nk(k + 1)(k + 2) = \\dfrac{n(n + 1)(n + 2)(n + 3)}4$.",
      proof: ["Each term is a difference: $k(k + 1) = \\tfrac13[k(k + 1)(k + 2) - (k - 1)k(k + 1)]$, which telescopes."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\sum_{k=1}^{10}(2k^2 + 3k)$.",
      solution: ["$2 \\times 385 + 3 \\times 55$.", "$= 770 + 165 = 935$."],
      result: "935.",
    },
    {
      type: "example",
      level: 2,
      title: "telescoping",
      problem: "Find $\\sum_{k=1}^{n}\\dfrac{1}{(2k - 1)(2k + 1)}$.",
      solution: ["$\\dfrac{1}{(2k - 1)(2k + 1)} = \\tfrac12\\left(\\dfrac1{2k - 1} - \\dfrac1{2k + 1}\\right)$.", "The sum is $\\tfrac12\\left(1 - \\dfrac1{2n + 1}\\right) = \\dfrac{n}{2n + 1}$."],
      result: "$\\dfrac{n}{2n + 1}$.",
    },
    {
      type: "example",
      level: 3,
      title: "the method of differences",
      problem: "Find the sum of the first $n$ terms of $2, 5, 10, 17, \\dots$.",
      solution: ["$a_k = k^2 + 1$.", "$S_n = \\dfrac{n(n + 1)(2n + 1)}6 + n$."],
      result: "$\\dfrac{n(n + 1)(2n + 1)}6 + n$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\sum k^2 = (\\sum k)^2$.", right: "Use $\\tfrac{n(n + 1)(2n + 1)}6$; only $\\sum k^3 = (\\sum k)^2$." },
    { wrong: "Assume every term of a telescoping sum cancels.", right: "Write out the first and last few terms to see what survives." },
    { wrong: "$\\sum(a_kb_k) = \\sum a_k\\sum b_k$.", right: "Sigma is linear, not multiplicative." },
  ],
  formulas: [
    { label: "Naturals", tex: "\\textstyle\\sum k = \\tfrac{n(n + 1)}2" },
    { label: "Squares", tex: "\\textstyle\\sum k^2 = \\tfrac{n(n + 1)(2n + 1)}6" },
    { label: "Cubes", tex: "\\textstyle\\sum k^3 = \\left(\\tfrac{n(n + 1)}2\\right)^2" },
    { label: "Telescoping", tex: "\\textstyle\\sum_{k=1}^n\\tfrac{1}{k(k + 1)} = \\tfrac{n}{n + 1}" },
  ],
  exercises: [
    ex(1, num("spsx-ex-1", "Find $\\sum_{k=1}^{12}k^2$.", s2(12), "$\\tfrac{12 \\times 13 \\times 25}{6}$."), ["$650$."]),
    ex(1, num("spsx-ex-2", "Find $\\sum_{k=1}^{6}k^3$.", s3(6), "$21^2$."), ["$441$."]),
    ex(2, num("spsx-ex-3", "Find $\\sum_{k=1}^{10}k(k + 1)$.", 440, "$\\tfrac{10 \\times 11 \\times 12}{3}$."), ["$440$."]),
    ex(2, fr("spsx-ex-4", "Find $\\sum_{k=1}^{20}\\dfrac{1}{k(k + 1)}$.", 20 / 21, "$1 - \\tfrac1{21}$."), ["$\\tfrac{20}{21}$."]),
    ex(2, num("spsx-ex-5", "The sequence $3, 7, 13, 21, 31, \\dots$ has differences in AP. Find its 10th term.", 111, "$a_n = n^2 + n + 1$."), ["$100 + 10 + 1 = 111$."]),
    ex(3, fr("spsx-ex-6", "Find $\\sum_{k=1}^\\infty\\dfrac{1}{(2k - 1)(2k + 1)}$.", 0.5, "Limit of $\\tfrac{n}{2n + 1}$."), ["$\\tfrac12$."]),
    ex(3, num("spsx-ex-7", "Find $\\sum_{k=1}^{n}(2k - 1)^2$ for $n = 5$.", 165, "$1 + 9 + 25 + 49 + 81$."), ["$165$; in general $\\tfrac{n(2n - 1)(2n + 1)}3$."]),
    ex(3, mc("spsx-ex-8", "$\\sum_{k=1}^n\\dfrac{1}{k(k + 2)}$ telescopes to", ["$\\tfrac12\\left(1 + \\tfrac12 - \\tfrac1{n + 1} - \\tfrac1{n + 2}\\right)$", "With a gap of 2, two terms survive at each end."], [["$\\tfrac12\\left(1 - \\tfrac1{n + 2}\\right)$", "Two terms survive at the start."], ["$1 - \\tfrac1{n + 1}$", "That is for $k(k + 1)$."]]), ["Write out the first few terms to see the pattern."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 25);
      const kind = r.pick(["k", "k^2", "k^3"] as const);
      const v = kind === "k" ? s1(nn) : kind === "k^2" ? s2(nn) : s3(nn);
      return n(`Find $\\sum_{k=1}^{${nn}}${kind}$.`, v, kind === "k" ? `$\\tfrac{${nn} \\times ${nn + 1}}{2}$.` : kind === "k^2" ? `$\\tfrac{${nn} \\times ${nn + 1} \\times ${2 * nn + 1}}{6}$.` : `$\\left(\\tfrac{${nn} \\times ${nn + 1}}{2}\\right)^2$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(4, 15);
      const a = r.int(1, 4);
      const b = r.int(-3, 5);
      const c = r.int(-3, 3);
      const v = a * s2(nn) + b * s1(nn) + c * nn;
      return n(`Find $\\sum_{k=1}^{${nn}}(${a}k^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}k ${c < 0 ? "-" : "+"} ${Math.abs(c)})$.`, v, `$${a}(${s2(nn)}) + (${b})(${s1(nn)}) + (${c})(${nn}) = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 50);
      const v = nn / (nn + 1);
      return n(`Find $\\sum_{k=1}^{${nn}}\\dfrac{1}{k(k + 1)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$1 - \\tfrac{1}{${nn + 1}} = \\tfrac{${nn}}{${nn + 1}}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([4, 5, 6, 8]);
      return mcNumbers(
        `$\\sum_{k=1}^{${nn}}k^2$ equals`,
        { text: `${s2(nn)}`, why: `$\\tfrac{${nn}(${nn + 1})(${2 * nn + 1})}{6}$.` },
        [{ text: `${s1(nn) ** 2}`, why: "That squares the sum.", misconception: "sum-squares-square" }, { text: `${nn * nn}`, why: "That is the last term only." }],
      );
    },
  },
];
