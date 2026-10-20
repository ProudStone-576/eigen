import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Arithmetic progressions: nth term, sum of n terms, arithmetic means and inserting means, recovering terms from sums, choosing symmetric terms, properties of APs. */

const base: ConceptNode = {
  id: "arithmetic-progressions",
  title: "Arithmetic progressions",
  summary: "An arithmetic progression adds the same common difference d at every step: a, a + d, a + 2d, …. Its nth term is a + (n − 1)d, and the sum of n terms is n/2 times the first plus the last, Gauss's trick of pairing terms from the two ends. Many problems become simple by naming three terms a − d, a, a + d.",
  deps: ["linear-equations"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "common difference", meaning: "$d = a_{n+1} - a_n$, the same for every $n$." },
    { term: "arithmetic mean", meaning: "$\\tfrac{a + b}{2}$; $a$, $A$, $b$ form an AP exactly when $A = \\tfrac{a + b}2$." },
    { term: "$S_n$", meaning: "The sum of the first $n$ terms." },
  ],
  misconceptions: {
    "nth-term-nd": "Uses $a_n = a + nd$ instead of $a + (n - 1)d$.",
    "ap-sum-last": "Takes the sum of an AP as $n$ times the last term, or $n(a + l)$ without the factor $\\tfrac12$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Steady steps",
      body: "Seats in a stadium: 20 in the first row, 24 in the next, 28 after that. How many in the 30th row, and in all 30 rows? Salaries with fixed annual increments, stacked pipes, instalment plans: all are arithmetic progressions, and their two formulas answer every question about them.",
      realWorld: {
        title: "Gauss and the schoolroom",
        body: "The young Carl Friedrich Gauss is said to have added 1 to 100 instantly by pairing $1 + 100$, $2 + 99$, …: fifty pairs of 101, so 5,050. That pairing is the proof of the AP sum formula.",
      },
    },
    {
      type: "truth",
      statement: "The AP $a, a + d, a + 2d, \\dots$ has $n$th term $a_n = a + (n - 1)d$ and sum $S_n = \\dfrac n2\\left[2a + (n - 1)d\\right] = \\dfrac n2(a + l)$, where $l = a_n$ is the last term. Conversely, $a_n = S_n - S_{n-1}$, and a sequence is an AP exactly when $S_n$ is a quadratic in $n$ with no constant term.",
      body: "Three numbers in AP are conveniently $a - d, a, a + d$ (their sum $3a$ gives $a$ at once); four are $a - 3d, a - d, a + d, a + 3d$. Inserting $k$ arithmetic means between $p$ and $q$ makes an AP of $k + 2$ terms, so $d = \\dfrac{q - p}{k + 1}$. Terms equidistant from the two ends have the same sum: $a_1 + a_n = a_2 + a_{n-1} = \\dots$. Adding a constant to every term, or multiplying every term by a constant, keeps an AP.",
    },
    {
      type: "predict",
      misconception: "nth-term-nd",
      item: {
        kind: "mc",
        id: "apr-predict-1",
        prompt: "The AP $3, 7, 11, \\dots$ has 20th term",
        options: [
          { id: "a", text: "79", correct: true, why: "$3 + 19 \\times 4$." },
          { id: "b", text: "83", misconception: "nth-term-nd", why: "From the 1st to the 20th term there are 19 steps, not 20." },
          { id: "c", text: "80", why: "That is $20 \\times 4$." },
        ],
      },
      reveal: {
        body: "The first term has had no differences added; the second has one; the 20th has 19. So $a_{20} = 3 + 19 \\times 4 = 79$. The \"$n - 1$\" counts the gaps between terms, like fence posts and fence panels.",
      },
      resolve: {
        kind: "mc",
        id: "apr-resolve-1",
        prompt: "In the AP $10, 7, 4, \\dots$ the 15th term is",
        options: [
          { id: "a", text: "$-32$", correct: true, why: "$10 + 14 \\times (-3)$." },
          { id: "b", text: "$-35$", misconception: "nth-term-nd", why: "Use 14 steps." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "apr-check-1",
        prompt: "An AP has first term 5, last term 95 and 31 terms. Its sum is",
        options: [
          { id: "a", text: "1550", correct: true, why: "$\\tfrac{31}{2}(5 + 95)$." },
          { id: "b", text: "3100", misconception: "ap-sum-last", why: "That forgets the $\\tfrac12$: $n(a + l)$ counts every pair twice." },
          { id: "c", text: "2945", misconception: "ap-sum-last", why: "That is $31 \\times 95$, as if all terms equalled the last." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "apr-check-2",
        prompt: "$S_n = 3n^2 + 2n$. The $n$th term is",
        options: [
          { id: "a", text: "$6n - 1$", correct: true, why: "$S_n - S_{n-1} = 6n - 1$." },
          { id: "b", text: "$3n + 2$", why: "That divides $S_n$ by $n$." },
          { id: "c", text: "$6n + 2$", why: "Subtract $S_{n-1}$ carefully." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A linearly decaying learning rate follows an AP, and the total \"learning\" over training is its sum. Evenly spaced grids of hyperparameters, timestamps or positions are APs too, and their averages are simply the mean of the first and last values.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "apr-produce-1", prompt: "Find the sum of the first 20 terms of $3, 7, 11, \\dots$.", answer: 820, explain: "$10(6 + 76)$." },
        { kind: "number", id: "apr-produce-2", prompt: "How many three-digit numbers are divisible by 7?", answer: 128, explain: "$105, 112, \\dots, 994$: $\\tfrac{994 - 105}{7} + 1$." },
        {
          kind: "mc",
          id: "apr-produce-3",
          prompt: "The $n$th term of an AP with first term $a$ and difference $d$ is",
          options: [
            { id: "a", text: "$a + (n - 1)d$", correct: true, why: "$n - 1$ steps from the first term." },
            { id: "b", text: "$a + nd$", misconception: "nth-term-nd", why: "That is the $(n + 1)$th term." },
          ],
        },
        {
          kind: "mc",
          id: "apr-produce-4",
          prompt: "The sum $2 + 4 + \\dots + 100$ is",
          options: [
            { id: "a", text: "2550", correct: true, why: "$\\tfrac{50}{2}(2 + 100)$." },
            { id: "b", text: "5100", misconception: "ap-sum-last", why: "Halve $n(a + l)$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "apr-review-1", prompt: "Find the sum $1 + 2 + \\dots + 100$.", answer: 5050, explain: "$\\tfrac{100}{2}(101)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "arithmetic means",
      body: "Between $p$ and $q$, the $k$ arithmetic means $A_1, \\dots, A_k$ make $p, A_1, \\dots, A_k, q$ an AP with $d = \\dfrac{q - p}{k + 1}$, and their sum is $k \\cdot \\dfrac{p + q}2$. For example, 5 means between 2 and 20 have $d = 3$: 5, 8, 11, 14, 17.",
    },
    {
      type: "definition",
      term: "recognising an AP",
      body: "A sequence is an AP iff $a_{n+1} - a_n$ is constant, iff $a_n$ is linear in $n$, iff $S_n = An^2 + Bn$. Then $d = 2A$ and $a_1 = A + B$. Three terms $x, y, z$ are in AP iff $2y = x + z$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the sum of an AP",
      statement: "$S_n = \\dfrac n2[2a + (n - 1)d] = \\dfrac n2(a + l)$.",
      proof: ["Write $S_n$ forwards and backwards and add: each of the $n$ columns sums to $a + l$, so $2S_n = n(a + l)$. Substitute $l = a + (n - 1)d$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "terms from sums",
      statement: "$a_1 = S_1$ and $a_n = S_n - S_{n-1}$ for $n \\ge 2$.",
      proof: ["$S_n$ and $S_{n-1}$ share the first $n - 1$ terms."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "symmetric choices",
      statement: "For three terms in AP with known sum, take $a - d, a, a + d$; for four, $a - 3d, a - d, a + d, a + 3d$ (common difference $2d$).",
      proof: ["The sum then involves only $a$, which it determines immediately."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the 20th term and the sum of the first 20 terms of $3, 7, 11, \\dots$.",
      solution: ["$a_{20} = 3 + 19 \\times 4 = 79$.", "$S_{20} = 10(3 + 79) = 820$."],
      result: "79 and 820.",
    },
    {
      type: "example",
      level: 2,
      title: "three terms",
      problem: "Three numbers in AP have sum 15 and product 80. Find them.",
      solution: ["Take $a - d, a, a + d$: $3a = 15$, $a = 5$.", "$(5 - d)5(5 + d) = 80$ gives $25 - d^2 = 16$, $d = \\pm3$: the numbers are 2, 5, 8."],
      result: "2, 5, 8.",
    },
    {
      type: "example",
      level: 3,
      title: "multiples in a range",
      problem: "Find the sum of all three-digit multiples of 7.",
      solution: ["First 105, last 994, count $\\tfrac{994 - 105}{7} + 1 = 128$.", "$S = 64(105 + 994) = 70{,}336$."],
      result: "70,336.",
    },
  ],
  pitfalls: [
    { wrong: "$a_n = a + nd$.", right: "$a_n = a + (n - 1)d$." },
    { wrong: "$S_n = n(a + l)$ or $n \\times l$.", right: "$S_n = \\tfrac n2(a + l)$." },
    { wrong: "Count terms as $(l - a)/d$.", right: "There are $(l - a)/d + 1$ terms." },
  ],
  formulas: [
    { label: "nth term", tex: "a_n = a + (n - 1)d" },
    { label: "Sum", tex: "S_n = \\tfrac n2[2a + (n - 1)d] = \\tfrac n2(a + l)" },
    { label: "Number of terms", tex: "n = \\dfrac{l - a}{d} + 1" },
    { label: "From sums", tex: "a_n = S_n - S_{n-1}" },
  ],
  exercises: [
    ex(1, num("aprx-ex-1", "Find the 10th term of $5, 9, 13, \\dots$.", 41, "$5 + 9 \\times 4$."), ["$41$."]),
    ex(1, num("aprx-ex-2", "Find the sum of the first 15 odd numbers.", 225, "$\\tfrac{15}2(1 + 29)$."), ["$225$."]),
    ex(2, num("aprx-ex-3", "An AP has $a_4 = 11$ and $a_9 = 26$. Find $a_{20}$.", 59, "$5d = 15$."), ["$d = 3$, $a = 2$, $a_{20} = 59$."]),
    ex(2, num("aprx-ex-4", "How many terms of $24, 21, 18, \\dots$ must be added for a sum of 78?", 4, "$\\tfrac n2(51 - 3n) = 78$ gives $n = 4$ or 13."), ["Both 4 and 13 give 78 (the terms after 4 sum to 0); the least is 4."]),
    ex(2, num("aprx-ex-5", "Find the common difference when 5 arithmetic means are inserted between 2 and 20.", 3, "$18/6$."), ["$3$."]),
    ex(3, num("aprx-ex-6", "$S_n = 2n^2 + 5n$. Find the 10th term.", 43, "$S_{10} - S_9 = 250 - 207$."), ["$43$."]),
    ex(3, num("aprx-ex-7", "Find the sum of the integers from 1 to 200 that are not multiples of 5.", 16000, "$20100 - 5(1 + \\dots + 40)$."), ["$20100 - 4100 = 16000$."]),
    ex(3, mc("aprx-ex-8", "If $\\tfrac1{b + c}, \\tfrac1{c + a}, \\tfrac1{a + b}$ are in AP, then", ["$a^2, b^2, c^2$ are in AP", "Clearing denominators gives $2b^2 = a^2 + c^2$."], [["$a, b, c$ are in AP", "Check the algebra."], ["$a, b, c$ are equal", "Not necessarily."]]), ["A classic manipulation."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.int(-10, 20);
      const d = r.nonzero(-6, 9);
      const nn = r.int(8, 40);
      const want = r.pick(["term", "sum"] as const);
      const v = want === "term" ? a + (nn - 1) * d : (nn * (2 * a + (nn - 1) * d)) / 2;
      return n(`For the AP $${a}, ${a + d}, ${a + 2 * d}, \\dots$, find the ${want === "term" ? `${nn}th term` : `sum of the first ${nn} terms`}.`, v, want === "term" ? `$${a} + ${nn - 1} \\times (${d}) = ${v}$.` : `$\\tfrac{${nn}}{2}[2(${a}) + ${nn - 1}(${d})] = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([3, 4, 6, 7, 8, 9, 11, 13]);
      const lo = r.pick([10, 100]);
      const hi = lo === 10 ? 99 : 999;
      const first = Math.ceil(lo / k) * k;
      const last = Math.floor(hi / k) * k;
      const count = (last - first) / k + 1;
      return n(`How many ${lo === 10 ? "two" : "three"}-digit numbers are divisible by ${k}?`, count, `From ${first} to ${last} in steps of ${k}: $\\tfrac{${last} - ${first}}{${k}} + 1 = ${count}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const A = r.int(1, 5);
      const B = r.int(-5, 6);
      const k = r.int(5, 20);
      const v = A * k * k + B * k - (A * (k - 1) ** 2 + B * (k - 1));
      return n(`$S_n = ${A}n^2 ${B < 0 ? "-" : "+"} ${Math.abs(B)}n$. Find the ${k}th term.`, v, `$S_{${k}} - S_{${k - 1}} = ${v}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(1, 9);
      const d = r.int(2, 6);
      const nn = r.int(10, 30);
      return mcNumbers(
        `The ${nn}th term of the AP with first term ${a} and difference ${d} is`,
        { text: `${a + (nn - 1) * d}`, why: `$${a} + ${nn - 1} \\times ${d}$.` },
        [{ text: `${a + nn * d}`, why: `That adds ${nn} differences instead of ${nn - 1}.`, misconception: "nth-term-nd" }, { text: `${a + (nn - 2) * d}`, why: `That adds ${nn - 2} differences; the ${nn}th term needs ${nn - 1}.` }],
      );
    },
  },
];
