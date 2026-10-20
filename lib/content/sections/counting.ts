import { deepen, ex, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Counting: multiplication principle, permutations, combinations, the binomial theorem. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
const C = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
};
const P = (n: number, k: number) => fact(n) / fact(n - k);

const base: ConceptNode = {
  id: "counting",
  title: "Counting: permutations & combinations",
  summary: "Multiply the number of choices at each stage. When order matters, $^nP_r = \\dfrac{n!}{(n - r)!}$; when it doesn't, $\\binom nr = \\dfrac{n!}{r!(n - r)!}$. With equally likely outcomes, a probability is a count of favourable outcomes over a count of all outcomes.",
  deps: [],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "factorial", meaning: "$n! = n(n - 1)\\cdots 2 \\cdot 1$, the number of orders of $n$ distinct objects; $0! = 1$." },
    { term: "permutation", meaning: "An ordered selection: first, second, third… are different positions." },
    { term: "combination", meaning: "An unordered selection: only which items are chosen matters." },
  ],
  misconceptions: {
    "order-confusion": "Uses permutations when order doesn't matter, or combinations when it does.",
    "add-vs-multiply": "Adds the numbers of choices at successive stages instead of multiplying them.",
  },
  steps: [
    {
      type: "motivate",
      title: "Count before you compute",
      body: "The chance of a full house needs two counts: how many five-card hands are full houses, and how many hands there are in all. Listing all 2,598,960 hands is out of the question; the counting rules do it in a line.",
      realWorld: {
        title: "Passwords",
        body: "An 8-character password from 62 letters and digits has $62^8 \\approx 2.2 \\times 10^{14}$ possibilities. That count is what decides how long a brute-force attack would take.",
      },
    },
    {
      type: "truth",
      statement: "**Multiplication principle**: a task with stages offering $n_1, n_2, \\dots$ choices can be done in $n_1n_2\\cdots$ ways. Ordered selections of $r$ from $n$ distinct objects: $^nP_r = \\dfrac{n!}{(n - r)!}$. Unordered selections: $\\binom nr = \\dfrac{n!}{r!\\,(n - r)!}$.",
      body: "Each unordered selection of $r$ items can be put in order in $r!$ ways, so $^nP_r = r!\\binom nr$. Ask one question first: does swapping two of the chosen items give a different outcome? If so, order matters.",
    },
    {
      type: "predict",
      misconception: "order-confusion",
      item: {
        kind: "mc",
        id: "cnt-predict-1",
        prompt: "How many ways are there to choose a committee of 3 from 10 students?",
        options: [
          { id: "a", text: "120", correct: true, why: "$\\binom{10}{3}$." },
          { id: "b", text: "720", misconception: "order-confusion", why: "That counts ordered choices: each committee 6 times." },
          { id: "c", text: "30", why: "That is $10 \\times 3$." },
        ],
      },
      reveal: {
        body: "Asha, Ben and Chen form the same committee as Chen, Ben and Asha. $^{10}P_3 = 720$ counts each committee $3! = 6$ times, once for each order, so there are $720/6 = 120$ committees. If the three places were president, secretary and treasurer, order would matter and 720 would be right.",
      },
      resolve: {
        kind: "mc",
        id: "cnt-resolve-1",
        prompt: "When is $^nP_r$ the right count?",
        options: [
          { id: "a", text: "When rearranging the chosen items gives a different outcome", correct: true, why: "Positions or roles are distinct." },
          { id: "b", text: "Whenever items are chosen from a group", misconception: "order-confusion", why: "For plain selections use $\\binom nr$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cnt-check-1",
        prompt: "A menu has 4 starters, 6 mains and 3 desserts. How many different three-course meals are there?",
        options: [
          { id: "a", text: "72", correct: true, why: "$4 \\times 6 \\times 3$." },
          { id: "b", text: "13", misconception: "add-vs-multiply", why: "Each starter can go with every main and every dessert." },
          { id: "c", text: "24", why: "That leaves out the desserts." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cnt-check-2",
        prompt: "In how many orders can 5 people stand in a queue?",
        options: [
          { id: "a", text: "120", correct: true, why: "$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1$." },
          { id: "b", text: "25", why: "That is $5^2$." },
          { id: "c", text: "15", why: "That is $5 + 4 + 3 + 2 + 1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Counting shows why exhaustive search fails. Choosing the best 10 of 100 features means checking $\\binom{100}{10} \\approx 1.7 \\times 10^{13}$ subsets, which is why feature selection uses greedy steps or the lasso (§{regularization}) instead.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cnt-produce-1", prompt: "Find $\\binom 62$.", answer: 15, explain: "$\\tfrac{6 \\times 5}{2}$." },
        { kind: "number", id: "cnt-produce-2", prompt: "Find $^5P_2$.", answer: 20, explain: "$5 \\times 4$." },
        {
          kind: "mc",
          id: "cnt-produce-3",
          prompt: "A PIN has 4 digits, each 0–9, repeats allowed. How many PINs are there?",
          options: [
            { id: "a", text: "10,000", correct: true, why: "$10^4$." },
            { id: "b", text: "40", misconception: "add-vs-multiply", why: "The digit choices multiply." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cnt-review-1", prompt: "In how many ways can 3 books be chosen from 7?", answer: 35, explain: "$\\binom 73$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "arrangements with repeats",
      body: "$n$ objects of which $n_1$ are alike of one kind, $n_2$ of another, and so on, can be arranged in $\\dfrac{n!}{n_1!\\,n_2!\\cdots}$ distinct orders. MISSISSIPPI has $\\dfrac{11!}{4!\\,4!\\,2!} = 34{,}650$ arrangements.",
    },
    {
      type: "definition",
      term: "circular arrangements, selections with repetition",
      body: "$n$ distinct objects around a circle, where rotations count as the same, can be arranged in $(n - 1)!$ ways; if reflections also count as the same (a necklace), $(n - 1)!/2$. Choosing $r$ items from $n$ kinds with repetition allowed gives $\\binom{n + r - 1}{r}$ selections.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Pascal's identity and symmetry",
      statement: "$\\binom nr = \\binom{n - 1}{r - 1} + \\binom{n - 1}{r}$ and $\\binom nr = \\binom{n}{n - r}$.",
      proof: [
        "Fix one object. A selection of $r$ either contains it (choose the other $r - 1$ from $n - 1$) or doesn't (choose all $r$ from $n - 1$).",
        "Choosing which $r$ to take is the same as choosing which $n - r$ to leave.",
      ],
    },
    {
      type: "theorem",
      name: "binomial theorem",
      statement: "$(a + b)^n = \\displaystyle\\sum_{k=0}^{n}\\binom nk a^{n-k}b^k$. In particular $\\sum_k \\binom nk = 2^n$, the number of subsets of an $n$-element set.",
      proof: [
        "Expanding $(a + b)(a + b)\\cdots(a + b)$ picks $a$ or $b$ from each of the $n$ brackets.",
        "A term $a^{n-k}b^k$ arises once for each way of choosing which $k$ brackets supply $b$: $\\binom nk$ ways. Put $a = b = 1$ for the corollary.",
      ],
    },
    {
      type: "theorem",
      name: "stars and bars",
      statement: "The equation $x_1 + \\dots + x_k = n$ has $\\binom{n + k - 1}{k - 1}$ solutions in non-negative integers, and $\\binom{n - 1}{k - 1}$ in positive integers.",
      proof: [
        "Write a solution as $n$ stars split by $k - 1$ bars: $\\star\\star|\\star|\\star\\star\\star$ is $2 + 1 + 3$. Choosing the bar positions among $n + k - 1$ places counts the solutions.",
        "For positive solutions, first give each $x_i$ one, leaving $n - k$ to share freely.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "complements and overlaps",
      statement: "Count \"at least one\" as all minus none. For overlapping conditions, $|A \\cup B| = |A| + |B| - |A \\cap B|$ (inclusion–exclusion).",
      proof: ["Outcomes in both $A$ and $B$ are counted twice by $|A| + |B|$; subtract them once."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "How many arrangements are there of all four letters of WORD, and of two of its letters?",
      solution: ["All four: $4! = 24$.", "Two in order: $^4P_2 = 4 \\times 3 = 12$."],
      result: "24 and 12.",
    },
    {
      type: "example",
      level: 2,
      title: "a card probability",
      problem: "Five cards are dealt from a shuffled 52-card deck. Find the probability that all five are hearts.",
      solution: ["Favourable hands: $\\binom{13}{5} = 1287$. All hands: $\\binom{52}{5} = 2{,}598{,}960$.", "$P = 1287/2{,}598{,}960 \\approx 0.000495$."],
      result: "About 0.0005.",
    },
    {
      type: "example",
      level: 3,
      title: "a committee with a condition",
      problem: "A committee of 5 is chosen from 6 men and 4 women. In how many ways can it include at least 2 women?",
      solution: [
        "By cases: $\\binom42\\binom63 + \\binom43\\binom62 + \\binom44\\binom61 = 120 + 60 + 6 = 186$.",
        "Check by complement: $\\binom{10}{5} - \\binom65 - \\binom41\\binom64 = 252 - 6 - 60 = 186$.",
      ],
      result: "186.",
    },
    {
      type: "example",
      level: 3,
      title: "round a table",
      problem: "Six people sit round a circular table. In how many ways can two particular people sit together?",
      solution: ["Glue the pair into one block: 5 units round a circle give $4! = 24$ arrangements.", "The pair can sit in 2 orders: $24 \\times 2 = 48$."],
      result: "48.",
    },
    {
      type: "example",
      level: 3,
      title: "sharing identical items",
      problem: "In how many ways can 10 identical sweets be shared among 4 children so that each gets at least one?",
      solution: ["Positive solutions of $x_1 + x_2 + x_3 + x_4 = 10$.", "$\\binom{9}{3} = 84$."],
      result: "84.",
    },
  ],
  pitfalls: [
    { wrong: "Use $^nP_r$ for a committee.", right: "A committee has no order: use $\\binom nr$. Distinct roles make order matter." },
    { wrong: "Arrangements of BANANA $= 6!$.", right: "Divide by the orders of the identical letters: $\\dfrac{6!}{3!\\,2!} = 60$." },
    { wrong: "Count \"at least one woman\" by choosing one woman and then anyone.", right: "That counts committees with two women twice. Use all minus none." },
    { wrong: "$n$ people round a table: $n!$ ways.", right: "Rotations are the same seating: $(n - 1)!$." },
  ],
  formulas: [
    { label: "Permutations", tex: "^nP_r = \\dfrac{n!}{(n - r)!}" },
    { label: "Combinations", tex: "\\binom nr = \\dfrac{n!}{r!\\,(n - r)!}" },
    { label: "With repeats", tex: "\\dfrac{n!}{n_1!\\,n_2!\\cdots}" },
    { label: "Circular", tex: "(n - 1)!" },
    { label: "Stars and bars", tex: "\\binom{n + k - 1}{k - 1}" },
  ],
  exercises: [
    ex(1, num("cntx-ex-1", "Find $6!$.", 720, "$6 \\times 5 \\times 4 \\times 3 \\times 2$."), ["$720$."]),
    ex(1, num("cntx-ex-2", "Find $\\binom 83$.", 56, "$\\tfrac{8 \\cdot 7 \\cdot 6}{6}$."), ["$336/6 = 56$."]),
    ex(1, num("cntx-ex-3", "Gold, silver and bronze go to 3 of 7 runners. In how many ways?", 210, "Order matters."), ["$^7P_3 = 7 \\times 6 \\times 5 = 210$."]),
    ex(2, num("cntx-ex-4", "How many distinct arrangements does BANANA have?", 60, "Three A's, two N's."), ["$\\dfrac{6!}{3!\\,2!} = \\dfrac{720}{12} = 60$."]),
    ex(2, num("cntx-ex-5", "How many subsets has a set of 10 elements?", 1024, "$2^{10}$."), ["Each element is in or out: $2^{10} = 1024$."]),
    ex(2, fr("cntx-ex-6", "Two cards are drawn from a 52-card deck. Find the probability that both are aces.", C(4, 2) / C(52, 2), "$\\binom42/\\binom{52}{2}$."), ["$\\dfrac{6}{1326} = \\dfrac{1}{221} \\approx 0.0045$."]),
    ex(2, num("cntx-ex-7", "In how many ways can 7 people sit round a circular table?", 720, "$(n - 1)!$."), ["$6! = 720$."]),
    ex(3, num("cntx-ex-8", "A committee of 4 is chosen from 5 men and 4 women. In how many ways can it include at least one woman?", C(9, 4) - C(5, 4), "All minus no women."), ["$\\binom94 - \\binom54 = 126 - 5 = 121$."]),
    ex(3, num("cntx-ex-9", "How many solutions has $x + y + z = 10$ in non-negative integers?", C(12, 2), "Stars and bars."), ["$\\binom{12}{2} = 66$."]),
    ex(3, num("cntx-ex-10", "Find the coefficient of $x^3$ in $(1 + 2x)^5$.", C(5, 3) * 8, "$\\binom53 2^3$."), ["$\\binom53(2x)^3 = 10 \\times 8x^3$: 80."]),
    ex(3, num("cntx-ex-11", "How many 4-digit numbers have all digits different?", 9 * 9 * 8 * 7, "The first digit can't be 0."), ["$9 \\times 9 \\times 8 \\times 7 = 4536$."]),
    ex(3, num("cntx-ex-12", "Five people stand in a line. In how many arrangements are two particular people not next to each other?", P(5, 5) - 2 * P(4, 4), "All minus together."), ["Together: $2 \\times 4! = 48$. Not together: $120 - 48 = 72$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });
const WORDS = ["LEVEL", "APPLE", "BANANA", "LETTER", "SUCCESS", "COFFEE", "PEPPER", "BALLOON", "STATISTICS"];

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(5, 6 + 3 * lv);
      const k = r.int(2, Math.min(nn - 1, 2 + lv));
      return n(`Find $\\binom{${nn}}{${k}}$.`, C(nn, k), `$\\dfrac{${nn}!}{${k}!\\,${nn - k}!} = ${C(nn, k)}$.`);
    },
  },
  {
    type: "interpret",
    make: (r, lv) => {
      const nn = r.int(6, 8 + 2 * lv);
      const roles = r.pick([true, false]);
      const k = 3;
      const right = roles ? P(nn, k) : C(nn, k);
      const wrong = roles ? C(nn, k) : P(nn, k);
      const task = roles ? `a captain, a vice-captain and a treasurer` : `a team of 3`;
      return mcNumbers(
        `From ${nn} players, in how many ways can you choose ${task}?`,
        { text: String(right), why: roles ? `Roles are distinct, so order matters: $^{${nn}}P_3 = ${right}$.` : `A team has no order: $\\binom{${nn}}{3} = ${right}$.` },
        [
          { text: String(wrong), why: roles ? "Different roles make the order matter." : "Reordering the same 3 players gives the same team.", misconception: "order-confusion" },
          { text: String(nn * 3), why: "Choices at successive stages multiply." },
        ],
      );
    },
  },
  {
    type: "compute",
    make: (r) => {
      const w = r.pick(WORDS);
      const counts = new Map<string, number>();
      for (const ch of w) counts.set(ch, (counts.get(ch) ?? 0) + 1);
      const repeats = [...counts.values()].filter((c) => c > 1);
      const ans = fact(w.length) / repeats.reduce((p, c) => p * fact(c), 1);
      return n(`How many distinct arrangements are there of the letters of ${w}?`, ans, `$\\dfrac{${w.length}!}{${repeats.map((c) => `${c}!`).join("\\,")}} = ${ans}$.`);
    },
  },
  {
    type: "real-world",
    make: (r, lv) => {
      const a = r.int(2, 5);
      const b = r.int(3, 6);
      const c = lv > 1 ? r.int(2, 4) : 1;
      const total = a * b * c;
      return mcNumbers(
        `A shop sells ${a} phone models${lv > 1 ? `, each in ${b} colours and ${c} storage sizes` : ` in ${b} colours each`}. How many different versions are there?`,
        { text: String(total), why: "Every model goes with every colour (and size): multiply." },
        [{ text: String(a + b + (lv > 1 ? c : 0)), why: "The choices combine, so they multiply.", misconception: "add-vs-multiply" }],
      );
    },
  },
];
