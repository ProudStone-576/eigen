import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Properties of binomial coefficients: sums by substituting x = ±1, even and odd sums, weighted sums by differentiation and integration, Vandermonde's identity, sums of squares, the hockey-stick identity, Pascal's triangle. */

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, r: number) => (r < 0 || r > n ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));

const base: ConceptNode = {
  id: "binomial-coefficients",
  title: "Binomial coefficients & identities",
  summary: "The coefficients C(n, k) satisfy a web of identities, almost all from one idea: substitute a clever value into (1 + x)ⁿ, or differentiate or integrate it first. x = 1 gives Σ C(n, k) = 2ⁿ; x = −1 shows the alternating sum is 0. Comparing coefficients of two expansions gives Vandermonde's identity and Σ C(n, k)² = C(2n, n).",
  deps: ["binomial-theorem", "special-series"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "Pascal's triangle", meaning: "The triangle of binomial coefficients, each the sum of the two above it." },
    { term: "Vandermonde's identity", meaning: "$\\sum_k\\binom mk\\binom n{r - k} = \\binom{m + n}r$." },
    { term: "hockey-stick identity", meaning: "$\\sum_{i=r}^n\\binom ir = \\binom{n + 1}{r + 1}$." },
  ],
  misconceptions: {
    "binomial-sum-wrong": "Thinks $\\sum_k\\binom nk$ is $n$, $n + 1$ or $n!$ rather than $2^n$.",
    "alternating-nonzero": "Expects the alternating sum $\\binom n0 - \\binom n1 + \\binom n2 - \\dots$ to be nonzero.",
  },
  steps: [
    {
      type: "motivate",
      title: "One expansion, many identities",
      body: "How many subsets does a 10-element set have? Add up $\\binom{10}{0} + \\binom{10}{1} + \\dots + \\binom{10}{10}$, or just notice each element is in or out: $2^{10}$. JEE questions on binomial coefficients reward spotting which substitution or comparison turns a sum into a single number.",
      realWorld: {
        title: "Error-correcting codes",
        body: "A message of $n$ bits has $\\binom nk$ patterns of exactly $k$ errors; code designers sum these, $\\sum_{k \\le t}\\binom nk$, to bound how many messages a code can protect against up to $t$ errors (the Hamming bound).",
      },
    },
    {
      type: "truth",
      statement: "From $(1 + x)^n = \\sum\\binom nkx^k$: at $x = 1$, $\\sum_k\\binom nk = 2^n$; at $x = -1$, $\\sum_k(-1)^k\\binom nk = 0$, so the even-indexed and odd-indexed coefficients each sum to $2^{n-1}$. Differentiating, $n(1 + x)^{n-1} = \\sum k\\binom nkx^{k-1}$, so $\\sum_kk\\binom nk = n2^{n-1}$. Comparing coefficients of $x^r$ in $(1 + x)^m(1 + x)^n = (1 + x)^{m+n}$ gives **Vandermonde**, and with $m = n = r$, $\\sum_k\\binom nk^2 = \\binom{2n}n$.",
      body: "Other tools: $k\\binom nk = n\\binom{n - 1}{k - 1}$ (choose a committee and its leader in two orders); integrate $(1 + x)^n$ from 0 to 1 to get $\\sum\\dfrac{1}{k + 1}\\binom nk = \\dfrac{2^{n+1} - 1}{n + 1}$; the **hockey-stick** identity $\\sum_{i=r}^n\\binom ir = \\binom{n + 1}{r + 1}$ follows by repeated Pascal's rule (§{combinations-advanced}). In Pascal's triangle, row $n$ sums to $2^n$ and the shallow diagonals sum to Fibonacci numbers.",
    },
    {
      type: "predict",
      misconception: "binomial-sum-wrong",
      item: {
        kind: "mc",
        id: "bco-predict-1",
        prompt: "$\\binom{10}{0} + \\binom{10}{1} + \\dots + \\binom{10}{10}$ equals",
        options: [
          { id: "a", text: "1024", correct: true, why: "$2^{10}$: put $x = 1$ in $(1 + x)^{10}$." },
          { id: "b", text: "11, one for each term", misconception: "binomial-sum-wrong", why: "The coefficients are mostly much larger than 1." },
          { id: "c", text: "$10! = 3{,}628{,}800$", misconception: "binomial-sum-wrong", why: "That counts arrangements, not subsets." },
        ],
      },
      reveal: {
        body: "Each $\\binom{10}{k}$ counts the subsets of size $k$ of a 10-element set, so the total counts all subsets: each element is in or out, $2^{10} = 1024$. Algebraically, set $x = 1$ in $(1 + x)^{10} = \\sum\\binom{10}kx^k$.",
      },
      resolve: {
        kind: "mc",
        id: "bco-resolve-1",
        prompt: "$\\sum_{k=0}^{7}\\binom7k$ equals",
        options: [
          { id: "a", text: "128", correct: true, why: "$2^7$." },
          { id: "b", text: "8", misconception: "binomial-sum-wrong", why: "That counts the terms, not their values." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bco-check-1",
        prompt: "$\\binom60 - \\binom61 + \\binom62 - \\binom63 + \\binom64 - \\binom65 + \\binom66$ equals",
        options: [
          { id: "a", text: "0", correct: true, why: "$(1 - 1)^6$." },
          { id: "b", text: "64", misconception: "alternating-nonzero", why: "That is the sum without the signs." },
          { id: "c", text: "2", misconception: "alternating-nonzero", why: "Put $x = -1$ in $(1 + x)^6$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bco-check-2",
        prompt: "$\\sum_{k=0}^{5}\\binom5k^2$ equals",
        options: [
          { id: "a", text: "252", correct: true, why: "$\\binom{10}5$." },
          { id: "b", text: "1024", why: "That is $(2^5)^2$." },
          { id: "c", text: "32", why: "That is the plain sum." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The number of subsets of $n$ features is $2^n$, the size of a full model search space; the number of interaction terms of order up to $d$ is a partial sum of binomial coefficients. Shapley values weight subsets by $\\dfrac{\\lvert S\\rvert!(p - \\lvert S\\rvert - 1)!}{p!}$, normalised using these identities (§{interpretability}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "bco-produce-1", prompt: "Find $\\sum_{k=0}^{8}k\\binom8k$.", answer: 1024, explain: "$8 \\times 2^7$." },
        { kind: "number", id: "bco-produce-2", prompt: "Find $\\binom90 + \\binom92 + \\binom94 + \\binom96 + \\binom98$.", answer: 256, explain: "$2^{9-1}$." },
        {
          kind: "mc",
          id: "bco-produce-3",
          prompt: "$\\sum_{k=0}^{n}\\binom nk$ is",
          options: [
            { id: "a", text: "$2^n$", correct: true, why: "Subsets of an $n$-set." },
            { id: "b", text: "$n + 1$", misconception: "binomial-sum-wrong", why: "That counts terms." },
          ],
        },
        {
          kind: "mc",
          id: "bco-produce-4",
          prompt: "$\\sum_{k=0}^{n}(-1)^k\\binom nk$ for $n \\ge 1$ is",
          options: [
            { id: "a", text: "0", correct: true, why: "$(1 - 1)^n$." },
            { id: "b", text: "$(-1)^n$", misconception: "alternating-nonzero", why: "Every term is included; the total is $(1 - 1)^n$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "bco-review-1", prompt: "Find $\\sum_{k=0}^{6}\\binom6k$.", answer: 64, explain: "$2^6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the substitution toolkit",
      body: "Put $x = 1$ for plain sums, $x = -1$ for alternating sums, $x = i$ or a cube root of unity $\\omega$ to pick out every fourth or third coefficient (§{roots-of-unity}); differentiate to bring down a factor $k$; integrate to divide by $k + 1$; multiply two expansions and compare coefficients for products of binomial coefficients.",
    },
    {
      type: "definition",
      term: "combinatorial proofs",
      body: "Prove an identity by counting one set in two ways. $k\\binom nk = n\\binom{n - 1}{k - 1}$: choose a $k$-person committee and then its chair, or choose the chair first and then the other $k - 1$. Vandermonde: choose $r$ people from $m$ men and $n$ women by how many men are chosen.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "even and odd sums",
      statement: "$\\binom n0 + \\binom n2 + \\binom n4 + \\dots = \\binom n1 + \\binom n3 + \\dots = 2^{n-1}$ for $n \\ge 1$.",
      proof: ["Add and subtract the expansions at $x = 1$ and $x = -1$: their sum $2^n + 0$ is twice the even sum."],
    },
    {
      type: "theorem",
      name: "Vandermonde's identity",
      statement: "$\\sum_{k=0}^r\\binom mk\\binom n{r - k} = \\binom{m + n}r$; in particular $\\sum_{k=0}^n\\binom nk^2 = \\binom{2n}n$.",
      proof: ["The coefficient of $x^r$ in $(1 + x)^m(1 + x)^n$ is the left side and in $(1 + x)^{m+n}$ the right side. For the special case use $\\binom n{n - k} = \\binom nk$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the hockey stick",
      statement: "$\\binom rr + \\binom{r + 1}r + \\dots + \\binom nr = \\binom{n + 1}{r + 1}$.",
      proof: ["Replace $\\binom rr$ by $\\binom{r + 1}{r + 1}$ and apply Pascal's rule repeatedly: the sum collapses to $\\binom{n + 1}{r + 1}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find $\\sum_{k=0}^{10}\\binom{10}k$ and $\\sum_{k=0}^{10}(-1)^k\\binom{10}k$.",
      solution: ["$x = 1$ in $(1 + x)^{10}$: 1024.", "$x = -1$: 0."],
      result: "1024 and 0.",
    },
    {
      type: "example",
      level: 2,
      title: "a weighted sum",
      problem: "Find $\\sum_{k=1}^{n}k\\binom nk$.",
      solution: ["Differentiate $(1 + x)^n$: $n(1 + x)^{n-1} = \\sum k\\binom nkx^{k-1}$.", "Put $x = 1$: $n2^{n-1}$."],
      result: "$n2^{n-1}$.",
    },
    {
      type: "example",
      level: 3,
      title: "sum of products",
      problem: "Find $\\binom{10}{0}\\binom{10}{1} + \\binom{10}{1}\\binom{10}{2} + \\dots + \\binom{10}{9}\\binom{10}{10}$.",
      solution: ["$\\sum_k\\binom{10}k\\binom{10}{k + 1} = \\sum_k\\binom{10}k\\binom{10}{9 - k}$.", "Vandermonde with $r = 9$: $\\binom{20}{9} = 167{,}960$."],
      result: "167,960.",
    },
  ],
  pitfalls: [
    { wrong: "$\\sum\\binom nk = n + 1$.", right: "It is $2^n$." },
    { wrong: "Alternating sums of a full row are nonzero.", right: "They are 0, from $(1 - 1)^n$." },
    { wrong: "$\\sum\\binom nk^2 = 4^n$.", right: "It is $\\binom{2n}n$." },
  ],
  formulas: [
    { label: "Row sum", tex: "\\textstyle\\sum\\binom nk = 2^n" },
    { label: "Alternating", tex: "\\textstyle\\sum(-1)^k\\binom nk = 0" },
    { label: "Weighted", tex: "\\textstyle\\sum k\\binom nk = n2^{n-1}" },
    { label: "Squares", tex: "\\textstyle\\sum\\binom nk^2 = \\binom{2n}n" },
  ],
  exercises: [
    ex(1, num("bcox-ex-1", "Find $\\sum_{k=0}^{5}\\binom5k$.", 32, "$2^5$."), ["$32$."]),
    ex(1, num("bcox-ex-2", "Find $\\binom71 + \\binom73 + \\binom75 + \\binom77$.", 64, "$2^6$."), ["$64$."]),
    ex(2, num("bcox-ex-3", "Find $\\sum_{k=0}^{4}\\binom4k^2$.", 70, "$\\binom84$."), ["$70$."]),
    ex(2, num("bcox-ex-4", "Find $\\sum_{k=0}^{6}k\\binom6k$.", 192, "$6 \\times 2^5$."), ["$192$."]),
    ex(2, num("bcox-ex-5", "Find $\\binom33 + \\binom43 + \\binom53 + \\binom63 + \\binom73$.", C(8, 4), "Hockey stick."), ["$\\binom84 = 70$."]),
    ex(3, num("bcox-ex-6", "Find $\\sum_{k=0}^{5}\\binom5k\\binom5{k+1}$.", C(10, 4), "$\\sum\\binom5k\\binom5{4 - k}$."), ["$\\binom{10}4 = 210$."]),
    ex(3, num("bcox-ex-7", "Find $\\sum_{k=0}^{4}\\dfrac{1}{k + 1}\\binom4k$. Give the answer as a decimal.", 31 / 5, "$\\tfrac{2^5 - 1}{5}$."), ["$6.2$."]),
    ex(3, mc("bcox-ex-8", "$\\binom{n}{0}^2 - \\binom n1^2 + \\binom n2^2 - \\dots$ for odd $n$ equals", ["0", "Terms pair off: $\\binom nk^2$ and $\\binom n{n - k}^2$ have opposite signs."], [["$\\binom{2n}n$", "That is the sum without signs."], ["1", "The pairing leaves nothing."]]), ["For even $n = 2m$ it equals $(-1)^m\\binom{2m}{m}$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(3, 12);
      const kind = r.pick(["all", "even", "odd", "alt"] as const);
      const v = kind === "all" ? 2 ** nn : kind === "alt" ? 0 : 2 ** (nn - 1);
      return n(kind === "all" ? `Find $\\sum_{k=0}^{${nn}}\\binom{${nn}}{k}$.` : kind === "alt" ? `Find $\\sum_{k=0}^{${nn}}(-1)^k\\binom{${nn}}{k}$.` : `Find the sum of the ${kind}-indexed coefficients $\\binom{${nn}}{k}$.`, v, kind === "all" ? `$2^{${nn}}$.` : kind === "alt" ? `$(1 - 1)^{${nn}} = 0$.` : `$2^{${nn - 1}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(3, 10);
      const kind = r.pick(["k", "sq"] as const);
      const v = kind === "k" ? nn * 2 ** (nn - 1) : C(2 * nn, nn);
      return n(kind === "k" ? `Find $\\sum_{k=0}^{${nn}}k\\binom{${nn}}{k}$.` : `Find $\\sum_{k=0}^{${nn}}\\binom{${nn}}{k}^2$.`, v, kind === "k" ? `$${nn} \\times 2^{${nn - 1}}$.` : `$\\binom{${2 * nn}}{${nn}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const rr = r.int(1, 4);
      const nn = rr + r.int(2, 6);
      return n(`Find $\\sum_{i=${rr}}^{${nn}}\\binom{i}{${rr}}$.`, C(nn + 1, rr + 1), `Hockey stick: $\\binom{${nn + 1}}{${rr + 1}}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.int(4, 9);
      return mcNumbers(
        `The sum of all the binomial coefficients in $(1 + x)^{${nn}}$ is`,
        { text: `${2 ** nn}`, why: "Set $x = 1$." },
        [{ text: `${nn + 1}`, why: "That counts the terms.", misconception: "binomial-sum-wrong" }, { text: `${fact(nn)}`, why: "Factorials count arrangements.", misconception: "binomial-sum-wrong" }],
      );
    },
  },
];
