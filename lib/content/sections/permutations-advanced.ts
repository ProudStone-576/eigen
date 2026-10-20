import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The fundamental principles of counting; factorials and nPr; permutations with repetition, with identical objects, with restrictions (together, apart, fixed positions); circular permutations and necklaces; rank of a word. */

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const P = (n: number, r: number) => fact(n) / fact(n - r);

const base: ConceptNode = {
  id: "permutations-advanced",
  title: "Permutations",
  summary: "A permutation is an arrangement in which order matters. Multiply the choices at each stage (the multiplication principle), add the counts of separate cases (the addition principle). Identical objects divide out their own rearrangements; objects that must stay together are glued into one block; objects that must stay apart are placed in the gaps. Around a circle, rotations are the same arrangement, so n objects have (n − 1)! circular arrangements.",
  deps: ["functions-basics"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "$^nP_r$", meaning: "The number of ordered arrangements of $r$ objects chosen from $n$ distinct ones: $\\dfrac{n!}{(n - r)!}$." },
    { term: "multiplication principle", meaning: "If one choice can be made in $m$ ways and then another in $n$ ways, together they can be made in $mn$ ways." },
    { term: "circular permutation", meaning: "An arrangement around a circle where rotations count as the same." },
  ],
  misconceptions: {
    "circular-linear": "Counts arrangements around a circle as $n!$, treating rotations as different.",
    "identical-overcount": "Treats identical objects as different, so counts arrangements of a word with repeated letters as $n!$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Counting arrangements",
      body: "How many ways can 8 people sit in a row? Around a round table? How many different words can be made from the letters of MISSISSIPPI? Counting is the foundation of probability, and JEE tests it with traps: identical objects, restrictions, and circular symmetry.",
      realWorld: {
        title: "Password strength",
        body: "An 8-character password from 62 letters and digits has $62^8 \\approx 2.2 \\times 10^{14}$ possibilities (repetition allowed); requiring all characters different gives $^{62}P_8 \\approx 1.4 \\times 10^{14}$. Counting arguments set how long brute-force attacks take.",
      },
    },
    {
      type: "truth",
      statement: "$n$ distinct objects can be arranged in $n!$ ways; choosing and arranging $r$ of them gives $^nP_r = \\dfrac{n!}{(n - r)!}$; with repetition allowed, $n^r$. If the $n$ objects include $p$ alike of one kind, $q$ alike of another, and so on, the arrangements number $\\dfrac{n!}{p!\\,q!\\cdots}$. Around a circle, $n$ distinct objects have $(n - 1)!$ arrangements; if clockwise and anticlockwise are the same (a necklace or garland), $\\dfrac{(n - 1)!}{2}$.",
      body: "**Together**: glue the objects that must be adjacent into one block, arrange the blocks, then arrange inside the block. **Apart**: arrange the others first, then choose gaps (including the ends) for the separated objects: with $m$ others there are $m + 1$ gaps. **Fixed positions**: fill the restricted places first. When cases don't overlap, add; when stages follow each other, multiply; and when \"at least\" appears, subtract the complement from the total. The **rank of a word** in dictionary order counts the words that come before it, letter by letter.",
    },
    {
      type: "predict",
      misconception: "circular-linear",
      item: {
        kind: "mc",
        id: "pma-predict-1",
        prompt: "In how many ways can 5 people sit around a round table (only relative positions matter)?",
        options: [
          { id: "a", text: "24", correct: true, why: "$(5 - 1)! = 24$." },
          { id: "b", text: "120", misconception: "circular-linear", why: "Each seating is counted 5 times, once per rotation." },
          { id: "c", text: "12", why: "That divides by 2 as well, which is for necklaces." },
        ],
      },
      reveal: {
        body: "Of the $5! = 120$ row-style listings, each circular seating appears 5 times, as the table can be rotated so any of the 5 people sits in the \"first\" chair. So there are $120/5 = 24$. Equivalently, fix one person's seat and arrange the other 4: $4! = 24$. For a necklace, flipping it over also gives the same arrangement, halving again.",
      },
      resolve: {
        kind: "mc",
        id: "pma-resolve-1",
        prompt: "Seven beads of different colours are strung on a ring (it can be flipped). The number of distinct rings is",
        options: [
          { id: "a", text: "360", correct: true, why: "$\\tfrac{6!}{2}$." },
          { id: "b", text: "5040", misconception: "circular-linear", why: "Rotations and flips give the same ring." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pma-check-1",
        prompt: "How many distinct arrangements has the word BOOK?",
        options: [
          { id: "a", text: "12", correct: true, why: "$\\tfrac{4!}{2!}$." },
          { id: "b", text: "24", misconception: "identical-overcount", why: "Swapping the two O's gives the same word." },
          { id: "c", text: "6", why: "Divide by $2!$ only." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pma-check-2",
        prompt: "4 boys and 3 girls stand in a row with all the girls together. The number of arrangements is",
        options: [
          { id: "a", text: "720", correct: true, why: "Block of girls plus 4 boys: $5! \\times 3!$." },
          { id: "b", text: "5040", why: "That ignores the condition." },
          { id: "c", text: "120", why: "The girls can be arranged inside their block." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Permutation tests shuffle labels to build a null distribution (§{permutation-tests}); the number of distinct shuffles of $n$ labels with $k$ of one kind is $\\binom nk$, and with many groups a multinomial coefficient. Search over orderings, such as feature orders or schedules, grows like $n!$, which is why exhaustive search is rarely possible.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pma-produce-1", prompt: "How many distinct arrangements has the word MISSISSIPPI?", answer: 34650, explain: "$\\tfrac{11!}{4!\\,4!\\,2!}$." },
        { kind: "number", id: "pma-produce-2", prompt: "4 boys and 3 girls stand in a row with no two girls adjacent. How many arrangements?", answer: 1440, explain: "$4! \\times {}^5P_3$." },
        {
          kind: "mc",
          id: "pma-produce-3",
          prompt: "8 people sit around a round table. The number of seatings is",
          options: [
            { id: "a", text: "$7!$", correct: true, why: "Fix one person, arrange the rest." },
            { id: "b", text: "$8!$", misconception: "circular-linear", why: "Rotations are the same seating." },
          ],
        },
        {
          kind: "mc",
          id: "pma-produce-4",
          prompt: "The number of distinct arrangements of AABBB is",
          options: [
            { id: "a", text: "10", correct: true, why: "$\\tfrac{5!}{2!\\,3!}$." },
            { id: "b", text: "120", misconception: "identical-overcount", why: "Identical letters can't be told apart." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "pma-review-1", prompt: "Find $^{7}P_{3}$.", answer: 210, explain: "$7 \\times 6 \\times 5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the gap method",
      body: "To keep $k$ objects apart, first arrange the other $m$ objects in a row ($m!$ ways if distinct). This leaves $m + 1$ gaps (between and at the ends); choose and order $k$ of them: $^{m+1}P_k$ ways. Multiply. Around a circle, $m$ objects leave only $m$ gaps.",
    },
    {
      type: "definition",
      term: "rank of a word",
      body: "List the letters alphabetically. For each position, count the words that start with the fixed letters so far followed by a smaller available letter, and add them up; the word's rank is this total plus 1. For example, among arrangements of ABC, the word BCA comes after the two starting with A and after BAC: rank 4.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "arrangements with identical objects",
      statement: "$n$ objects, of which $p_1$ are alike, $p_2$ alike, …, $p_k$ alike ($\\sum p_i = n$), can be arranged in $\\dfrac{n!}{p_1!\\,p_2!\\cdots p_k!}$ ways.",
      proof: ["Label the alike objects to make them distinct: $n!$ arrangements. Each unlabelled arrangement appears $p_1!p_2!\\cdots p_k!$ times (rearranging labels within each kind)."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "circular arrangements",
      statement: "$n$ distinct objects around a circle: $(n - 1)!$; if reflections are also identified, $\\tfrac12(n - 1)!$ for $n \\ge 3$.",
      proof: ["Each circular arrangement corresponds to $n$ linear ones (its rotations); with reflections each corresponds to $2n$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "counting principles",
      statement: "Multiply for successive independent stages; add for disjoint cases; for \"at least\" or \"not all\", count the complement and subtract from the total.",
      proof: ["These are the rules for sizes of Cartesian products, disjoint unions and complements (§{sets-relations})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "How many 4-digit numbers have all digits different?",
      solution: ["First digit: 9 choices (not 0). Then 9, 8, 7 for the rest.", "$9 \\times 9 \\times 8 \\times 7 = 4536$."],
      result: "4536.",
    },
    {
      type: "example",
      level: 2,
      title: "keeping apart",
      problem: "4 boys and 3 girls in a row, no two girls together.",
      solution: ["Arrange the boys: $4! = 24$, leaving 5 gaps.", "Place the girls in 3 of the gaps, in order: $^5P_3 = 60$. Total $1440$."],
      result: "1440.",
    },
    {
      type: "example",
      level: 3,
      title: "rank in the dictionary",
      problem: "Find the rank of SMALL among the arrangements of its letters in dictionary order.",
      solution: ["Letters A, L, L, M, S. Words starting A: $\\tfrac{4!}{2!} = 12$; L: $4! = 24$; M: $\\tfrac{4!}{2!} = 12$. Then S A…: $\\tfrac{3!}{2!} = 3$; S L…: $3! = 6$; then S M A L L.", "$12 + 24 + 12 + 3 + 6 = 57$ words before it, so its rank is 58."],
      result: "58.",
    },
  ],
  pitfalls: [
    { wrong: "Count circular seatings as $n!$.", right: "Use $(n - 1)!$ (halve again for necklaces)." },
    { wrong: "Treat repeated letters as different.", right: "Divide by the factorials of the repeat counts." },
    { wrong: "Use the gap method with too few gaps.", right: "$m$ objects in a row leave $m + 1$ gaps." },
  ],
  formulas: [
    { label: "Permutations", tex: "{}^nP_r = \\dfrac{n!}{(n - r)!}" },
    { label: "Repetition", tex: "n^r" },
    { label: "Identical", tex: "\\dfrac{n!}{p_1!\\,p_2!\\cdots}" },
    { label: "Circular", tex: "(n - 1)!,\\ \\tfrac12(n - 1)!" },
  ],
  exercises: [
    ex(1, num("pmax-ex-1", "How many 3-letter codes can be made from 26 letters if repetition is allowed?", 17576, "$26^3$."), ["$17576$."]),
    ex(1, num("pmax-ex-2", "How many arrangements has the word LEVEL?", 30, "$\\tfrac{5!}{2!\\,2!}$."), ["$30$."]),
    ex(2, num("pmax-ex-3", "In how many ways can 6 people sit at a round table if two particular people must sit together?", 48, "Glue them: $4! \\times 2$."), ["$48$."]),
    ex(2, num("pmax-ex-4", "How many 5-digit numbers greater than 50000 can be formed from 1, 2, 3, 5, 7 without repetition?", 48, "First digit 5 or 7."), ["$2 \\times 4! = 48$."]),
    ex(2, num("pmax-ex-5", "How many arrangements of ARRANGE have the two R's together?", 360, "Treat RR as one: $\\tfrac{6!}{2!}$ for the A's."), ["$360$."]),
    ex(3, num("pmax-ex-6", "Find the rank of SMALL in dictionary order among its arrangements.", 58, "Count words before it."), ["$58$."]),
    ex(3, num("pmax-ex-7", "In how many ways can 5 boys and 5 girls sit around a round table with boys and girls alternating?", 2880, "Boys: $4!$; girls in the 5 gaps: $5!$."), ["$24 \\times 120 = 2880$."]),
    ex(3, mc("pmax-ex-8", "How many 4-digit even numbers can be formed from 0, 1, 2, 3, 4, 5 without repetition?", ["156", "Last digit 0: $5 \\times 4 \\times 3 = 60$; last 2 or 4: $2 \\times 4 \\times 4 \\times 3 = 96$."], [["180", "That ignores the leading-zero restriction."], ["120", "Count the two cases separately."]]), ["Split by whether the last digit is 0."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(4, 10);
      const k = r.int(2, Math.min(5, nn));
      return n(`Find $^{${nn}}P_{${k}}$.`, P(nn, k), `$\\dfrac{${nn}!}{${nn - k}!} = ${P(nn, k)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const w = r.pick(["BANANA", "LETTER", "BALLOON", "COFFEE", "STATISTICS", "ASSESS", "PEPPER", "COMMITTEE"]);
      const counts: Record<string, number> = {};
      for (const ch of w) counts[ch] = (counts[ch] ?? 0) + 1;
      const den = Object.values(counts).reduce((s, c) => s * fact(c), 1);
      const v = fact(w.length) / den;
      return n(`How many distinct arrangements has the word ${w}?`, v, `$\\dfrac{${w.length}!}{${Object.values(counts).filter((c) => c > 1).map((c) => `${c}!`).join("\\,")}} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(4, 9);
      const neck = r.pick([false, false, true]);
      const v = neck ? fact(nn - 1) / 2 : fact(nn - 1);
      return n(neck ? `How many different necklaces can be made from ${nn} beads of different colours?` : `In how many ways can ${nn} people sit around a round table?`, v, neck ? `$\\tfrac{(${nn} - 1)!}{2}$.` : `$(${nn} - 1)!$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.int(3, 6);
      const g = r.int(2, b + 1);
      const v = fact(b) * P(b + 1, g);
      return n(`${b} boys and ${g} girls stand in a row with no two girls adjacent. How many arrangements?`, v, `$${b}! \\times {}^{${b + 1}}P_{${g}} = ${v}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.int(4, 8);
      return mcNumbers(
        `${nn} friends sit around a circular table. The number of distinct seatings is`,
        { text: `${fact(nn - 1)}`, why: `$(${nn} - 1)!$: rotations are the same.` },
        [{ text: `${fact(nn)}`, why: "That counts each seating once per rotation.", misconception: "circular-linear" }, { text: `${fact(nn - 1) / 2}`, why: "Seatings aren't identified with their mirror images." }],
      );
    },
  },
];
