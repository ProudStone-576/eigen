import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The principle of mathematical induction: base case and inductive step; proofs of sum formulas, divisibility and inequalities; strong induction; common errors. */

const base: ConceptNode = {
  id: "induction",
  title: "Mathematical induction",
  summary: "To prove a statement P(n) for every natural number n, prove it for the first case, then prove that whenever it holds for n = k it also holds for n = k + 1. Like a row of dominoes, the first falls and each knocks over the next, so all fall. Induction proves sum formulas, divisibility facts and inequalities, but both parts are essential.",
  deps: ["special-series"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "base case", meaning: "The proof of $P(n_0)$ for the first value $n_0$." },
    { term: "inductive hypothesis", meaning: "The assumption that $P(k)$ holds, used to prove $P(k + 1)$." },
    { term: "strong induction", meaning: "Assuming $P(n_0), \\dots, P(k)$ all hold in order to prove $P(k + 1)$." },
  ],
  misconceptions: {
    "induction-no-base": "Thinks proving the inductive step alone is enough.",
    "induction-assumes-conclusion": "Thinks assuming $P(k)$ in the inductive step is circular reasoning.",
  },
  steps: [
    {
      type: "motivate",
      title: "Infinitely many cases, two proofs",
      body: "Checking $1 + 3 + 5 + \\dots + (2n - 1) = n^2$ for $n = 1, 2, 3, \\dots, 1000$ proves nothing about $n = 1001$. Induction proves it for every $n$ at once by showing the pattern can never break: true at the start, and each case passes truth to the next.",
      realWorld: {
        title: "Proving programs correct",
        body: "Software verification proves loops correct by induction: a property that holds before the first pass and is preserved by each pass (a loop invariant) holds when the loop ends. Recursive algorithms are proved correct the same way.",
      },
    },
    {
      type: "truth",
      statement: "**Principle of induction**: if (1) $P(n_0)$ is true and (2) for every $k \\ge n_0$, $P(k)$ implies $P(k + 1)$, then $P(n)$ is true for all $n \\ge n_0$. **Strong induction**: (2) may assume $P(n_0), \\dots, P(k)$. In the inductive step you **assume** $P(k)$, which is legitimate because you are proving the implication, not $P(k)$ itself.",
      body: "Template: state $P(n)$; verify the base case; assume $P(k)$; write $P(k + 1)$ and transform it using $P(k)$ until it is proved. For a sum, add the next term to both sides of $P(k)$. For divisibility such as $3 \\mid n^3 - n$ or $7 \\mid 8^n - 1$, write the $(k + 1)$th expression as (multiple of the divisor) + (the $k$th expression). For inequalities such as $2^n > n^2$, the base case may be $n = 5$, not $n = 1$; check where the claim actually starts. Both parts matter: \"$n^2 + n + 1$ is even\" has a valid inductive step but no true base case, and is false for every $n$.",
    },
    {
      type: "predict",
      misconception: "induction-no-base",
      item: {
        kind: "mc",
        id: "mid-predict-1",
        prompt: "Claim: $n^2 + n + 1$ is even for all $n \\ge 1$. If it is even for $n = k$, then $(k + 1)^2 + (k + 1) + 1 = (k^2 + k + 1) + 2(k + 1)$ is even too. So the claim",
        options: [
          { id: "a", text: "is false: the step is valid, but there is no true base case ($n = 1$ gives 3)", correct: true, why: "A step with no starting domino proves nothing." },
          { id: "b", text: "is proved by induction", misconception: "induction-no-base", why: "The base case is missing, and fails." },
          { id: "c", text: "is true only for even $n$", why: "$n^2 + n$ is always even, so $n^2 + n + 1$ is always odd." },
        ],
      },
      reveal: {
        body: "The implication \"even for $k$ ⇒ even for $k + 1$\" is correct, but it never gets started: $n^2 + n = n(n + 1)$ is always even, so $n^2 + n + 1$ is always odd. A chain of implications only matters if its first link is true. Always prove the base case.",
      },
      resolve: {
        kind: "mc",
        id: "mid-resolve-1",
        prompt: "An induction proof shows $P(k) \\Rightarrow P(k + 1)$ for all $k \\ge 1$ but never checks $P(1)$. It proves",
        options: [
          { id: "a", text: "nothing yet about any $P(n)$", correct: true, why: "Without a true start, nothing follows." },
          { id: "b", text: "$P(n)$ for all $n$", misconception: "induction-no-base", why: "The base case is essential." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mid-check-1",
        prompt: "In the inductive step we assume $P(k)$ and deduce $P(k + 1)$. This is",
        options: [
          { id: "a", text: "valid: we are proving the implication $P(k) \\Rightarrow P(k + 1)$, not $P(k)$", correct: true, why: "The base case supplies the first true $P$." },
          { id: "b", text: "circular, because it assumes what we want to prove", misconception: "induction-assumes-conclusion", why: "We assume one case to prove the next, not the general claim." },
          { id: "c", text: "valid only if $k = 1$", why: "The step must work for every $k$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mid-check-2",
        prompt: "To prove $7 \\mid 8^n - 1$, the inductive step writes $8^{k+1} - 1$ as",
        options: [
          { id: "a", text: "$8(8^k - 1) + 7$", correct: true, why: "Both parts are multiples of 7 if $7 \\mid 8^k - 1$." },
          { id: "b", text: "$8^k - 1 + 8$", why: "$8^{k+1} \\ne 8^k + 8$." },
          { id: "c", text: "$(8^k - 1)^2$", why: "That isn't equal to $8^{k+1} - 1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Convergence proofs for iterative algorithms, such as showing each gradient-descent step reduces the loss by a guaranteed amount (§{gradient-descent}), are inductions over iterations. Recurrent networks are analysed by unrolling them step by step, which is also inductive reasoning.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mid-produce-1", prompt: "Find the smallest $n \\ge 1$ from which $2^n > n^2$ holds for all larger $n$ too.", answer: 5, explain: "$2^4 = 16 = 4^2$; $2^5 = 32 > 25$." },
        { kind: "number", id: "mid-produce-2", prompt: "By $1 + 3 + \\dots + (2n - 1) = n^2$, find the sum of the first 12 odd numbers.", answer: 144, explain: "$12^2$." },
        {
          kind: "mc",
          id: "mid-produce-3",
          prompt: "A student proves only the inductive step for \"$4 \\mid 5^n + 1$\", using $5^{k+1} + 1 = 5(5^k + 1) - 4$. The claim is",
          options: [
            { id: "a", text: "unproved, and in fact false: $n = 1$ gives 6", correct: true, why: "The step is valid, but no case starts the chain." },
            { id: "b", text: "proved", misconception: "induction-no-base", why: "An inductive step alone proves nothing." },
          ],
        },
        {
          kind: "mc",
          id: "mid-produce-4",
          prompt: "Assuming $\\sum_{i=1}^ki = \\tfrac{k(k + 1)}2$ to prove the case $k + 1$ is",
          options: [
            { id: "a", text: "the inductive hypothesis, a legitimate step", correct: true, why: "It is used, together with the base case, to prove every case." },
            { id: "b", text: "circular reasoning", misconception: "induction-assumes-conclusion", why: "We only assume it for one $k$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mid-review-1", prompt: "For $n = 4$, evaluate $n^3 - n$ and check it is divisible by 3. Give the quotient.", answer: 20, explain: "$60/3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "strong induction",
      body: "Assume $P(n_0), P(n_0 + 1), \\dots, P(k)$ and prove $P(k + 1)$. Useful when $P(k + 1)$ depends on earlier cases than $P(k)$: every integer $n \\ge 2$ is a product of primes (factor $n$ into smaller parts, both covered by the hypothesis), and statements about sequences defined by $a_{n+1} = a_n + a_{n-1}$ need two base cases.",
    },
    {
      type: "definition",
      term: "where induction goes wrong",
      body: "(1) Missing or false base case. (2) An inductive step that silently fails for a small $k$: the \"all horses are the same colour\" argument breaks going from $k = 1$ to $k = 2$, because two groups of one horse needn't overlap. (3) Proving $P(k + 1) \\Rightarrow P(k)$ instead of the forward direction.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "sum of odd numbers",
      statement: "$1 + 3 + 5 + \\dots + (2n - 1) = n^2$ for all $n \\ge 1$.",
      proof: ["Base: $1 = 1^2$. Step: if $1 + \\dots + (2k - 1) = k^2$, adding $2k + 1$ gives $k^2 + 2k + 1 = (k + 1)^2$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "a divisibility result",
      statement: "$3 \\mid n^3 - n$ for every $n \\ge 1$.",
      proof: ["Base: $1 - 1 = 0$. Step: $(k + 1)^3 - (k + 1) = (k^3 - k) + 3k^2 + 3k$, a multiple of 3 if $k^3 - k$ is. (Directly: $n^3 - n = (n - 1)n(n + 1)$, three consecutive integers.)"],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "an inequality",
      statement: "$2^n > n^2$ for all $n \\ge 5$.",
      proof: ["Base: $32 > 25$. Step: if $2^k > k^2$ with $k \\ge 5$, then $2^{k+1} > 2k^2 \\ge (k + 1)^2$, because $k^2 - 2k - 1 > 0$ for $k \\ge 3$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Prove $\\sum_{i=1}^ni = \\dfrac{n(n + 1)}2$.",
      solution: ["Base $n = 1$: $1 = \\tfrac{1 \\cdot 2}2$.", "Step: $\\tfrac{k(k + 1)}2 + (k + 1) = \\tfrac{(k + 1)(k + 2)}2$."],
      result: "True for all $n \\ge 1$.",
    },
    {
      type: "example",
      level: 2,
      title: "divisibility",
      problem: "Prove $7 \\mid 8^n - 1$ for all $n \\ge 1$.",
      solution: ["Base: $8 - 1 = 7$.", "Step: $8^{k+1} - 1 = 8(8^k - 1) + 7$; both terms are multiples of 7."],
      result: "Proved.",
    },
    {
      type: "example",
      level: 3,
      title: "a recursive sequence",
      problem: "$a_1 = 1$, $a_{n+1} = 2a_n + 1$. Prove $a_n = 2^n - 1$.",
      solution: ["Base: $a_1 = 1 = 2^1 - 1$.", "Step: $a_{k+1} = 2(2^k - 1) + 1 = 2^{k+1} - 1$."],
      result: "$a_n = 2^n - 1$.",
    },
  ],
  pitfalls: [
    { wrong: "Skip the base case.", right: "Always verify $P(n_0)$; a valid step can't rescue a false start." },
    { wrong: "Think assuming $P(k)$ is circular.", right: "It is the hypothesis of the implication being proved." },
    { wrong: "Start an inequality at $n = 1$ when it only holds from $n = 5$.", right: "Find the true starting point." },
  ],
  formulas: [
    { label: "Principle", tex: "P(n_0) \\wedge [P(k) \\Rightarrow P(k + 1)] \\Rightarrow \\forall n \\ge n_0\\, P(n)" },
    { label: "Odd sum", tex: "\\textstyle\\sum_{i=1}^n(2i - 1) = n^2" },
    { label: "Divisibility step", tex: "8^{k+1} - 1 = 8(8^k - 1) + 7" },
  ],
  exercises: [
    ex(1, num("midx-ex-1", "Check the base case of $\\sum_{i=1}^ni^2 = \\tfrac{n(n + 1)(2n + 1)}6$: evaluate the right side at $n = 1$.", 1, "$\\tfrac{1 \\cdot 2 \\cdot 3}6$."), ["$1$, matching $1^2$."]),
    ex(1, num("midx-ex-2", "$a_1 = 1$, $a_{n+1} = 2a_n + 1$. Find $a_6$.", 63, "$2^6 - 1$."), ["$63$."]),
    ex(2, num("midx-ex-3", "Find the remainder when $8^{10} - 1$ is divided by 7.", 0, "Always divisible."), ["$0$."]),
    ex(2, num("midx-ex-4", "In the step for $3 \\mid n^3 - n$, $(k + 1)^3 - (k + 1) = (k^3 - k) + 3(\\,\\dots\\,)$. What is the bracket when $k = 2$?", 6, "$k^2 + k$."), ["$4 + 2 = 6$."]),
    ex(2, num("midx-ex-5", "For which least $n$ does $n! > 2^n$ hold (and then for all larger $n$)?", 4, "$24 > 16$."), ["$3! = 6 < 8$, $4! = 24 > 16$."]),
    ex(3, num("midx-ex-6", "$a_1 = 2$, $a_{n+1} = 3a_n - 2$. Guess a formula and find $a_{10}$.", 3 ** 9 + 1, "$a_n = 3^{n-1} + 1$."), ["$3^9 + 1 = 19684$."]),
    ex(3, mc("midx-ex-7", "The \"all horses are the same colour\" induction fails because", ["the step from $k = 1$ to $k = 2$ needs two overlapping groups, but groups of one horse don't overlap", "The step isn't valid for every $k$."], [["the base case is false", "One horse is one colour."], ["induction is invalid", "Induction is fine; this step isn't."]]), ["Check the step for the smallest $k$."]),
    ex(3, mc("midx-ex-8", "To prove every integer $n \\ge 2$ is a product of primes, the natural method is", ["strong induction", "$n$ splits into two smaller factors, each covered by the hypothesis."], [["ordinary induction from $n - 1$", "$n$ and $n - 1$ share no useful factorisation."], ["a single example", "That proves nothing general."]]), ["Assume all smaller cases."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a1 = r.int(1, 4);
      const m = r.pick([2, 3]);
      const c = r.int(-2, 3);
      const k = r.int(4, 9);
      let a = a1;
      for (let i = 1; i < k; i++) a = m * a + c;
      return n(`$a_1 = ${a1}$ and $a_{n+1} = ${m}a_n ${c < 0 ? "-" : "+"} ${Math.abs(c)}$. Find $a_{${k}}$.`, a, `Iterate (or prove a closed form by induction): $a_{${k}} = ${a}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.pick([4, 5, 6, 8, 9, 11]);
      const k = r.int(2, 9);
      return n(`$${b}^n - 1$ is divisible by ${b - 1} for every $n$. Find the remainder when $${b}^{${k}} - 1$ is divided by ${b - 1}.`, 0, `$${b}^{k+1} - 1 = ${b}(${b}^k - 1) + ${b - 1}$: always divisible.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 30);
      return n(`Use $1 + 3 + \\dots + (2n - 1) = n^2$ to find the sum of the first ${nn} odd numbers.`, nn * nn, `$${nn}^2$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { claim: "$n^2 + n + 1$ is even", why: "$n = 1$ gives 3" },
        { claim: "$4^n + 1$ is divisible by 3", why: "$n = 1$ gives 5" },
        { claim: "$7^n + 1$ is divisible by 6", why: "$n = 1$ gives 8" },
        { claim: "$5^n + 1$ is divisible by 4", why: "$n = 1$ gives 6" },
      ]);
      return mcNumbers(
        `A \"proof\" of \"${v.claim} for all $n \\ge 1$\" gives only a (valid) inductive step. This shows`,
        { text: "nothing: the base case must also hold, and here it fails", why: `${v.why}.` },
        [{ text: "the claim for all $n$", why: "The step alone proves nothing.", misconception: "induction-no-base" }],
      );
    },
  },
];
