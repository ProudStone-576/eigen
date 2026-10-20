import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Combinations: nCr and its properties; selections with restrictions ("at least", "at most", including or excluding particular items); geometric counting (lines, triangles, diagonals); distributing identical objects (stars and bars); distinct objects into boxes; dividing into groups; derangements. */

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, r: number) => (r < 0 || r > n ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));
const derange = (n: number) => { let s = 0; for (let k = 0; k <= n; k++) s += ((-1) ** k * fact(n)) / fact(k); return Math.round(s); };

const base: ConceptNode = {
  id: "combinations-advanced",
  title: "Combinations & distributions",
  summary: "A combination is a selection in which order doesn't matter: choosing r from n can be done in C(n, r) = n!/(r!(n − r)!) ways. Selections with conditions are counted directly or by complement. Distributing identical objects into boxes is counted by \"stars and bars\", and the number of ways to put n letters into n envelopes with none in the right one is a derangement number.",
  deps: ["permutations-advanced"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "$\\binom nr$", meaning: "The number of ways to choose $r$ objects from $n$ distinct ones, ignoring order: $\\dfrac{n!}{r!(n - r)!}$." },
    { term: "stars and bars", meaning: "Counting ways to split $n$ identical objects into $k$ groups by arranging $n$ stars and $k - 1$ bars." },
    { term: "derangement", meaning: "A permutation leaving no object in its original place; there are $D_n = n!\\sum_{k=0}^n\\frac{(-1)^k}{k!}$ of them." },
  ],
  misconceptions: {
    "order-matters-selection": "Uses permutations to count selections, such as committees, where order doesn't matter.",
    "stars-bars-wrong": "Counts distributions of identical objects into $k$ boxes as $\\binom nk$ or $k^n$ instead of $\\binom{n + k - 1}{k - 1}$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Choosing, not arranging",
      body: "A committee of 3 from 10 people: is Asha–Bina–Chetan different from Chetan–Asha–Bina? No, so dividing the $^{10}P_3 = 720$ arrangements by the $3! = 6$ orders gives 120 committees. Most counting problems hinge on recognising whether order matters, and whether the objects or the boxes are identical.",
      realWorld: {
        title: "Lotteries",
        body: "A 6-from-49 lottery has $\\binom{49}{6} = 13{,}983{,}816$ possible tickets, so a single ticket wins the jackpot with probability about 1 in 14 million.",
      },
    },
    {
      type: "truth",
      statement: "$\\binom nr = \\dfrac{n!}{r!(n - r)!} = \\dfrac{{}^nP_r}{r!}$, with $\\binom nr = \\binom n{n - r}$ and **Pascal's rule** $\\binom nr + \\binom n{r - 1} = \\binom{n + 1}r$. Choosing $r$ from $n$ with $p$ particular items always included: $\\binom{n - p}{r - p}$; always excluded: $\\binom{n - p}r$. **Stars and bars**: $n$ identical objects into $k$ distinct boxes can be placed in $\\binom{n + k - 1}{k - 1}$ ways, or $\\binom{n - 1}{k - 1}$ if every box gets at least one. $n$ distinct objects into $k$ distinct boxes: $k^n$.",
      body: "\"At least one\" problems are usually easiest by complement: total minus none. **Geometry**: $n$ points with no three collinear determine $\\binom n2$ lines and $\\binom n3$ triangles; an $n$-gon has $\\binom n2 - n = \\tfrac{n(n - 3)}2$ diagonals. **Groups**: $2n$ people into $n$ unlabelled pairs: $\\dfrac{(2n)!}{2^nn!}$; into two labelled teams of $n$: $\\binom{2n}{n}$, unlabelled: half that. **Derangements**: $D_1 = 0$, $D_2 = 1$, $D_3 = 2$, $D_4 = 9$, $D_5 = 44$, with $D_n \\approx n!/e$. The number of non-negative integer solutions of $x_1 + \\dots + x_k = n$ is the stars-and-bars count $\\binom{n + k - 1}{k - 1}$.",
    },
    {
      type: "predict",
      misconception: "stars-bars-wrong",
      item: {
        kind: "mc",
        id: "cmb-predict-1",
        prompt: "In how many ways can 10 identical sweets be shared among 3 children (some may get none)?",
        options: [
          { id: "a", text: "66", correct: true, why: "$\\binom{12}{2}$: arrange 10 stars and 2 bars." },
          { id: "b", text: "$3^{10} = 59049$", misconception: "stars-bars-wrong", why: "That treats the sweets as different." },
          { id: "c", text: "$\\binom{10}{3} = 120$", misconception: "stars-bars-wrong", why: "That chooses 3 sweets, not a split." },
        ],
      },
      reveal: {
        body: "Line up the 10 sweets and insert 2 dividers: everything left of the first divider goes to child 1, between them to child 2, after the second to child 3. Each sharing is one arrangement of 10 stars and 2 bars, and there are $\\binom{12}2 = 66$ of those. If every child must get at least one, give each one first and share the remaining 7: $\\binom92 = 36$.",
      },
      resolve: {
        kind: "mc",
        id: "cmb-resolve-1",
        prompt: "The number of non-negative integer solutions of $x + y + z + w = 6$ is",
        options: [
          { id: "a", text: "84", correct: true, why: "$\\binom{9}{3}$." },
          { id: "b", text: "$\\binom64 = 15$", misconception: "stars-bars-wrong", why: "Use $\\binom{n + k - 1}{k - 1}$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cmb-check-1",
        prompt: "A committee of 3 is chosen from 10 people. The number of committees is",
        options: [
          { id: "a", text: "120", correct: true, why: "$\\binom{10}3$." },
          { id: "b", text: "720", misconception: "order-matters-selection", why: "That counts ordered selections." },
          { id: "c", text: "30", why: "That is $10 \\times 3$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cmb-check-2",
        prompt: "How many diagonals has a decagon?",
        options: [
          { id: "a", text: "35", correct: true, why: "$\\binom{10}2 - 10$." },
          { id: "b", text: "45", why: "That includes the sides." },
          { id: "c", text: "70", why: "Each diagonal joins two vertices once." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Choosing $k$ features from $p$ has $\\binom pk$ options, which explodes quickly: best-subset selection over 40 features would check about $10^{12}$ models, which is why the lasso and stepwise methods exist (§{regularization}). Cross-validation folds are combinations too.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cmb-produce-1", prompt: "From 6 men and 4 women, how many committees of 5 include at least 1 woman?", answer: 246, explain: "$\\binom{10}5 - \\binom65 = 252 - 6$." },
        { kind: "number", id: "cmb-produce-2", prompt: "How many derangements of 4 letters into 4 addressed envelopes are there?", answer: 9, explain: "$D_4 = 24(1 - 1 + \\tfrac12 - \\tfrac16 + \\tfrac1{24})$." },
        {
          kind: "mc",
          id: "cmb-produce-3",
          prompt: "Choosing a 4-member team from 9 players counts",
          options: [
            { id: "a", text: "$\\binom94 = 126$", correct: true, why: "Order doesn't matter." },
            { id: "b", text: "$^9P_4 = 3024$", misconception: "order-matters-selection", why: "Each team is counted $4!$ times." },
          ],
        },
        {
          kind: "mc",
          id: "cmb-produce-4",
          prompt: "8 identical balls into 4 distinct boxes with every box non-empty can be done in",
          options: [
            { id: "a", text: "$\\binom73 = 35$ ways", correct: true, why: "Give each one, then share the other 4: $\\binom{7}{3}$." },
            { id: "b", text: "$4^8$ ways", misconception: "stars-bars-wrong", why: "The balls are identical." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cmb-review-1", prompt: "Find $\\binom{8}{3}$.", answer: 56, explain: "$\\tfrac{8 \\times 7 \\times 6}{6}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "dividing into groups",
      body: "$n$ distinct objects into groups of sizes $a, b, c$ (distinct sizes): $\\dfrac{n!}{a!\\,b!\\,c!}$. If $m$ groups have the same size and are unlabelled, divide by $m!$: 6 people into 3 unlabelled pairs is $\\dfrac{6!}{2!2!2!\\,3!} = 15$. If the groups are then given to labelled places, multiply back by $m!$.",
    },
    {
      type: "definition",
      term: "derangements",
      body: "By inclusion–exclusion (§{sets-relations}), the permutations of $n$ objects fixing none of them number $D_n = n!\\left(1 - \\tfrac1{1!} + \\tfrac1{2!} - \\dots + \\tfrac{(-1)^n}{n!}\\right)$, which also satisfy $D_n = (n - 1)(D_{n-1} + D_{n-2})$. The chance a random permutation is a derangement tends to $1/e \\approx 0.368$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "Pascal's rule",
      statement: "$\\binom nr + \\binom n{r - 1} = \\binom{n + 1}r$.",
      proof: ["Choose $r$ from $n + 1$ objects, one of them special: either the special one is excluded ($\\binom nr$ ways) or included with $r - 1$ others ($\\binom n{r - 1}$ ways)."],
    },
    {
      type: "theorem",
      name: "stars and bars",
      statement: "The number of solutions of $x_1 + \\dots + x_k = n$ in non-negative integers is $\\binom{n + k - 1}{k - 1}$; in positive integers, $\\binom{n - 1}{k - 1}$.",
      proof: ["Each solution is a row of $n$ stars and $k - 1$ bars; choose the bar positions among $n + k - 1$ places. For positive solutions, substitute $y_i = x_i - 1 \\ge 0$, which sum to $n - k$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "which formula",
      statement: "Distinct objects, order matters: permutations. Distinct objects, order doesn't: combinations. Identical objects into distinct boxes: stars and bars. Distinct objects into distinct boxes: $k^n$ (or onto-function counts if none may be empty, §{functions-basics}).",
      proof: ["Each matches the structure being counted: sequences, subsets, multisets, or functions."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "From 6 men and 4 women, how many 5-member committees have exactly 2 women?",
      solution: ["Choose the women: $\\binom42 = 6$; the men: $\\binom63 = 20$.", "$6 \\times 20 = 120$."],
      result: "120.",
    },
    {
      type: "example",
      level: 2,
      title: "triangles from points",
      problem: "12 points lie in a plane, 5 of them on one line and no other three collinear. How many triangles do they form?",
      solution: ["All triples: $\\binom{12}3 = 220$.", "Subtract the collinear triples on the line: $\\binom53 = 10$. Total 210."],
      result: "210.",
    },
    {
      type: "example",
      level: 3,
      title: "bounded stars and bars",
      problem: "How many solutions has $x + y + z = 10$ with $0 \\le x, y, z \\le 5$?",
      solution: ["Without the upper bound: $\\binom{12}{2} = 66$. Solutions with $x \\ge 6$: set $x' = x - 6$, so $x' + y + z = 4$: $\\binom62 = 15$; same for $y$, $z$.", "Two variables $\\ge 6$ would need a sum of at least 12, impossible. So $66 - 45 = 21$."],
      result: "21.",
    },
  ],
  pitfalls: [
    { wrong: "Use permutations for selections.", right: "If order doesn't matter, divide by $r!$: use $\\binom nr$." },
    { wrong: "Share identical objects with $k^n$ or $\\binom nk$.", right: "Use stars and bars, $\\binom{n + k - 1}{k - 1}$." },
    { wrong: "Count \"at least one\" by adding many cases.", right: "Total minus none is usually quicker." },
  ],
  formulas: [
    { label: "Combinations", tex: "\\binom nr = \\dfrac{n!}{r!(n - r)!}" },
    { label: "Pascal", tex: "\\binom nr + \\binom n{r - 1} = \\binom{n + 1}r" },
    { label: "Stars and bars", tex: "\\binom{n + k - 1}{k - 1},\\ \\binom{n - 1}{k - 1}\\text{ if all} \\ge 1" },
    { label: "Derangements", tex: "D_n = n!\\textstyle\\sum_{k=0}^n\\frac{(-1)^k}{k!}" },
  ],
  exercises: [
    ex(1, num("cmbx-ex-1", "Find $\\binom{12}{10}$.", 66, "$\\binom{12}{2}$."), ["$66$."]),
    ex(1, num("cmbx-ex-2", "How many lines are determined by 9 points, no three collinear?", 36, "$\\binom92$."), ["$36$."]),
    ex(2, num("cmbx-ex-3", "A test has 10 questions; a student must answer 7, including the first 3. How many choices?", 35, "$\\binom74$."), ["$35$."]),
    ex(2, num("cmbx-ex-4", "How many positive integer solutions has $a + b + c = 12$?", 55, "$\\binom{11}2$."), ["$55$."]),
    ex(2, num("cmbx-ex-5", "In how many ways can 6 people be split into 3 unlabelled pairs?", 15, "$\\dfrac{6!}{(2!)^3 3!}$."), ["$15$."]),
    ex(3, num("cmbx-ex-6", "How many derangements of 5 objects are there?", derange(5), "$120(1 - 1 + \\tfrac12 - \\tfrac16 + \\tfrac1{24} - \\tfrac1{120})$."), ["$44$."]),
    ex(3, num("cmbx-ex-7", "How many solutions has $x + y + z = 10$ with $0 \\le x, y, z \\le 5$?", 21, "Subtract cases with a variable $\\ge 6$."), ["$66 - 3 \\times 15 = 21$."]),
    ex(3, mc("cmbx-ex-8", "The number of ways to choose 3 people from 10 for president, secretary and treasurer is", ["720", "The roles make order matter: $^{10}P_3$."], [["120", "Distinct roles mean order matters."], ["1000", "No one can hold two roles."]]), ["Labelled positions: permutations."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 15);
      const k = r.int(2, nn - 2);
      return n(`Find $\\binom{${nn}}{${k}}$.`, C(nn, k), `$\\dfrac{${nn}!}{${k}!\\,${nn - k}!} = ${C(nn, k)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.int(4, 8);
      const w = r.int(3, 6);
      const k = r.int(3, Math.min(6, m + w - 1));
      const v = C(m + w, k) - C(m, k);
      return n(`From ${m} men and ${w} women, how many committees of ${k} include at least one woman?`, v, `$\\binom{${m + w}}{${k}} - \\binom{${m}}{${k}} = ${C(m + w, k)} - ${C(m, k)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 15);
      const k = r.int(2, 5);
      const pos = r.pick([true, false]);
      const v = pos ? C(nn - 1, k - 1) : C(nn + k - 1, k - 1);
      return n(`In how many ways can ${nn} identical coins be shared among ${k} children${pos ? ", each getting at least one" : ""}?`, v, pos ? `$\\binom{${nn - 1}}{${k - 1}}$.` : `$\\binom{${nn + k - 1}}{${k - 1}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(5, 20);
      const want = r.pick(["diagonals", "triangles"] as const);
      return n(want === "diagonals" ? `How many diagonals has a convex polygon with ${nn} sides?` : `How many triangles can be formed from ${nn} points with no three collinear?`, want === "diagonals" ? (nn * (nn - 3)) / 2 : C(nn, 3), want === "diagonals" ? `$\\tfrac{${nn}(${nn} - 3)}{2}$.` : `$\\binom{${nn}}{3}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.int(7, 12);
      const k = r.int(3, 5);
      return mcNumbers(
        `A ${k}-person study group is chosen from ${nn} students. The number of possible groups is`,
        { text: `${C(nn, k)}`, why: `$\\binom{${nn}}{${k}}$: a group has no order.` },
        [{ text: `${C(nn, k) * fact(k)}`, why: "That counts ordered choices.", misconception: "order-matters-selection" }],
      );
    },
  },
];
