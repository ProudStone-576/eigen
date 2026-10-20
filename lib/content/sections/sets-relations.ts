import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Sets (representation, subsets, power sets, operations, De Morgan's laws, Venn diagrams, inclusion–exclusion) and relations (Cartesian products, counting relations, reflexive, symmetric and transitive relations, equivalence relations and classes). */

const base: ConceptNode = {
  id: "sets-relations",
  title: "Sets & relations",
  summary: "A set is a collection of distinct objects; set operations (union, intersection, complement) combine collections, and Venn diagrams with inclusion–exclusion count them without double counting. A relation pairs elements of sets; equivalence relations, which are reflexive, symmetric and transitive, split a set into non-overlapping classes of \"equivalent\" elements.",
  deps: ["linear-equations"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "power set", meaning: "$P(A)$: the set of all subsets of $A$; it has $2^n$ elements if $A$ has $n$." },
    { term: "relation", meaning: "A subset $R$ of $A \\times B$; write $a\\,R\\,b$ when $(a, b) \\in R$." },
    { term: "equivalence relation", meaning: "A relation that is reflexive ($aRa$), symmetric ($aRb \\Rightarrow bRa$) and transitive ($aRb, bRc \\Rightarrow aRc$)." },
  ],
  misconceptions: {
    "venn-add-overlap": "Counts $\\lvert A \\cup B\\rvert$ as $\\lvert A\\rvert + \\lvert B\\rvert$, counting the overlap twice.",
    "symmetric-implies-reflexive": "Believes a symmetric, transitive relation must be reflexive.",
  },
  steps: [
    {
      type: "motivate",
      title: "Counting without double counting",
      body: "In a class of 60, 40 play cricket and 30 play football. That is 70 sports-players in a class of 60, so some play both. How many play neither? Problems like this, and the logic of grouping things that are \"alike\" (same remainder, same shape, same birthday month), rest on sets and relations, the language the rest of the syllabus is written in.",
      realWorld: {
        title: "Database queries",
        body: "SQL's `UNION`, `INTERSECT` and `EXCEPT` are set operations, and a `JOIN` builds a relation between two tables. Search engines answer \"cricket AND NOT football\" with intersections and complements of huge sets of document IDs.",
      },
    },
    {
      type: "truth",
      statement: "For finite sets, $\\lvert A \\cup B\\rvert = \\lvert A\\rvert + \\lvert B\\rvert - \\lvert A \\cap B\\rvert$, and $\\lvert A \\cup B \\cup C\\rvert = \\sum\\lvert A\\rvert - \\sum\\lvert A \\cap B\\rvert + \\lvert A \\cap B \\cap C\\rvert$. **De Morgan**: $(A \\cup B)' = A' \\cap B'$ and $(A \\cap B)' = A' \\cup B'$. A set of $n$ elements has $2^n$ subsets. A relation from $A$ (size $m$) to $B$ (size $n$) is any subset of $A \\times B$, so there are $2^{mn}$ of them. An **equivalence relation** on $A$ partitions $A$ into disjoint **equivalence classes** $[a] = \\{x : xRa\\}$.",
      body: "Write sets in roster form $\\{1, 2, 3\\}$ or set-builder form $\\{x \\in \\mathbb Z : 1 \\le x \\le 3\\}$. $A \\subseteq B$ when every element of $A$ is in $B$; $A - B$ contains elements of $A$ not in $B$. On an $n$-element set: there are $2^{n^2}$ relations, $2^{n^2 - n}$ reflexive ones (the $n$ diagonal pairs are forced) and $2^{n(n+1)/2}$ symmetric ones. Check properties pair by pair: reflexive needs every $(a, a)$; symmetric needs $(b, a)$ whenever $(a, b)$; transitive needs $(a, c)$ whenever $(a, b)$ and $(b, c)$. Congruence modulo $k$ on the integers is an equivalence relation with $k$ classes.",
    },
    {
      type: "predict",
      misconception: "venn-add-overlap",
      item: {
        kind: "mc",
        id: "srl-predict-1",
        prompt: "In a class of 60, 40 play cricket, 30 play football and 15 play both. How many play neither?",
        options: [
          { id: "a", text: "5", correct: true, why: "$\\lvert C \\cup F\\rvert = 40 + 30 - 15 = 55$; $60 - 55 = 5$." },
          { id: "b", text: "None: $40 + 30$ exceeds 60", misconception: "venn-add-overlap", why: "Adding counts both-players twice." },
          { id: "c", text: "20", why: "Subtract the union, not just the overlap." },
        ],
      },
      reveal: {
        body: "Adding 40 and 30 counts each of the 15 who play both twice, so subtract them once: 55 play at least one sport, leaving 5. In a Venn diagram fill the overlap first (15), then cricket only (25) and football only (15); together $25 + 15 + 15 = 55$.",
      },
      resolve: {
        kind: "mc",
        id: "srl-resolve-1",
        prompt: "$\\lvert A\\rvert = 12$, $\\lvert B\\rvert = 9$, $\\lvert A \\cap B\\rvert = 4$. Then $\\lvert A \\cup B\\rvert$ is",
        options: [
          { id: "a", text: "17", correct: true, why: "$12 + 9 - 4$." },
          { id: "b", text: "21", misconception: "venn-add-overlap", why: "Subtract the overlap once." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "srl-check-1",
        prompt: "On $\\{1, 2, 3\\}$, $R = \\{(1, 1), (1, 2), (2, 1), (2, 2)\\}$ is symmetric and transitive. Is it reflexive?",
        options: [
          { id: "a", text: "No: $(3, 3)$ is missing", correct: true, why: "3 is related to nothing, so symmetry and transitivity never force $(3, 3)$." },
          { id: "b", text: "Yes: symmetric and transitive relations are always reflexive", misconception: "symmetric-implies-reflexive", why: "The \"proof\" assumes every element is related to something." },
          { id: "c", text: "Yes, because $(1, 1)$ is in $R$", why: "Every element needs $(a, a)$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "srl-check-2",
        prompt: "How many subsets has $\\{a, b, c, d, e\\}$?",
        options: [
          { id: "a", text: "32", correct: true, why: "$2^5$: each element is in or out." },
          { id: "b", text: "25", why: "That is $5^2$." },
          { id: "c", text: "31", why: "That excludes the empty set (or the set itself)." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Evaluation metrics are set counts: precision is $\\lvert\\text{predicted} \\cap \\text{actual}\\rvert/\\lvert\\text{predicted}\\rvert$ (§{precision-recall}), and the Jaccard index $\\lvert A \\cap B\\rvert/\\lvert A \\cup B\\rvert$ scores segmentation masks and set similarity.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "srl-produce-1", prompt: "How many relations are there from a 2-element set to a 3-element set?", answer: 64, explain: "$2^{2 \\times 3}$." },
        { kind: "number", id: "srl-produce-2", prompt: "How many reflexive relations are there on a 3-element set?", answer: 64, explain: "$2^{9 - 3}$." },
        {
          kind: "mc",
          id: "srl-produce-3",
          prompt: "Of 100 students, 45 study French, 35 German and 10 both. The number studying at least one is",
          options: [
            { id: "a", text: "70", correct: true, why: "$45 + 35 - 10$." },
            { id: "b", text: "80", misconception: "venn-add-overlap", why: "The 10 are counted twice." },
          ],
        },
        {
          kind: "mc",
          id: "srl-produce-4",
          prompt: "A relation is symmetric and transitive. To be sure it is reflexive you also need",
          options: [
            { id: "a", text: "every element to be related to at least one element", correct: true, why: "Then $aRb$, $bRa$ and transitivity give $aRa$." },
            { id: "b", text: "nothing more", misconception: "symmetric-implies-reflexive", why: "Isolated elements break it." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "srl-review-1", prompt: "How many equivalence classes does congruence modulo 5 have on the integers?", answer: 5, explain: "Remainders 0 to 4." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "set operations",
      body: "$A \\cup B$: in $A$ or $B$ (or both). $A \\cap B$: in both. $A'$: in the universal set but not $A$. $A - B = A \\cap B'$. $A \\times B = \\{(a, b) : a \\in A, b \\in B\\}$ has $\\lvert A\\rvert\\lvert B\\rvert$ elements. Sets are **disjoint** when $A \\cap B = \\varnothing$.",
    },
    {
      type: "definition",
      term: "partitions and equivalence classes",
      body: "A **partition** of $A$ is a collection of non-empty, pairwise disjoint subsets whose union is $A$. Every equivalence relation gives a partition (its classes), and every partition gives an equivalence relation (\"in the same part\"). The number of equivalence relations on an $n$-element set is the Bell number: 1, 2, 5, 15, 52 for $n = 1, \\dots, 5$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "inclusion–exclusion for two and three sets",
      statement: "$\\lvert A \\cup B\\rvert = \\lvert A\\rvert + \\lvert B\\rvert - \\lvert A \\cap B\\rvert$; $\\lvert A \\cup B \\cup C\\rvert = \\lvert A\\rvert + \\lvert B\\rvert + \\lvert C\\rvert - \\lvert A \\cap B\\rvert - \\lvert B \\cap C\\rvert - \\lvert C \\cap A\\rvert + \\lvert A \\cap B \\cap C\\rvert$.",
      proof: ["An element in exactly $k$ of the sets is counted $\\binom k1 - \\binom k2 + \\binom k3 = 1$ times on the right (for $k = 1, 2, 3$), exactly once, as on the left."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "counting relations",
      statement: "On an $n$-element set there are $2^{n^2}$ relations, $2^{n^2 - n}$ reflexive relations and $2^{n(n + 1)/2}$ symmetric relations.",
      proof: ["Each of the $n^2$ ordered pairs is in or out. Reflexive: the $n$ pairs $(a, a)$ must be in. Symmetric: choose freely the $n$ diagonal pairs and each of the $\\binom n2$ unordered off-diagonal pairs, $n + \\binom n2 = n(n + 1)/2$ choices."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "equivalence classes partition the set",
      statement: "For an equivalence relation, any two classes are either identical or disjoint, and every element lies in its own class.",
      proof: ["If $x \\in [a] \\cap [b]$ then $xRa$ and $xRb$, so by symmetry and transitivity $aRb$, and then every element of $[a]$ is in $[b]$ and vice versa. Reflexivity gives $a \\in [a]$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "List the power set of $\\{1, 2\\}$.",
      solution: ["Subsets of each size: none, one, two elements.", "$\\{\\varnothing, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$: $2^2 = 4$ subsets."],
      result: "4 subsets.",
    },
    {
      type: "example",
      level: 2,
      title: "three sets",
      problem: "Of 100 people, 50 read A, 40 read B, 30 read C; 15 read A and B, 10 B and C, 12 A and C, and 5 all three. How many read none?",
      solution: ["$\\lvert A \\cup B \\cup C\\rvert = 120 - 37 + 5 = 88$.", "None: $100 - 88 = 12$."],
      result: "12.",
    },
    {
      type: "example",
      level: 3,
      title: "checking properties",
      problem: "On the integers, $aRb$ means $a - b$ is divisible by 3. Show $R$ is an equivalence relation and describe its classes.",
      solution: ["$a - a = 0$ (reflexive); $3 \\mid a - b \\Rightarrow 3 \\mid b - a$ (symmetric); $3 \\mid a - b$ and $3 \\mid b - c$ give $3 \\mid a - c$ (transitive).", "Classes: remainders 0, 1 and 2 on division by 3."],
      result: "Three classes.",
    },
  ],
  pitfalls: [
    { wrong: "$\\lvert A \\cup B\\rvert = \\lvert A\\rvert + \\lvert B\\rvert$.", right: "Subtract the overlap." },
    { wrong: "Symmetric and transitive imply reflexive.", right: "Not if some element is related to nothing." },
    { wrong: "Forget the empty set when counting subsets.", right: "There are $2^n$ subsets, including $\\varnothing$ and $A$." },
  ],
  formulas: [
    { label: "Union", tex: "\\lvert A \\cup B\\rvert = \\lvert A\\rvert + \\lvert B\\rvert - \\lvert A \\cap B\\rvert" },
    { label: "De Morgan", tex: "(A \\cup B)' = A' \\cap B',\\ (A \\cap B)' = A' \\cup B'" },
    { label: "Subsets", tex: "\\lvert P(A)\\rvert = 2^n" },
    { label: "Relations", tex: "2^{mn},\\ 2^{n^2 - n}\\text{ reflexive},\\ 2^{n(n+1)/2}\\text{ symmetric}" },
  ],
  exercises: [
    ex(1, num("srlx-ex-1", "$\\lvert A\\rvert = 20$, $\\lvert B\\rvert = 15$, $\\lvert A \\cup B\\rvert = 28$. Find $\\lvert A \\cap B\\rvert$.", 7, "$35 - 28$."), ["$7$."]),
    ex(1, num("srlx-ex-2", "How many elements has $A \\times B$ if $\\lvert A\\rvert = 4$ and $\\lvert B\\rvert = 6$?", 24, "$4 \\times 6$."), ["$24$."]),
    ex(2, num("srlx-ex-3", "How many symmetric relations are there on a 3-element set?", 64, "$2^{3 \\times 4/2}$."), ["$2^6 = 64$."]),
    ex(2, num("srlx-ex-4", "How many subsets of $\\{1, \\dots, 6\\}$ contain the element 1?", 32, "Fix 1 in; choose the rest freely."), ["$2^5 = 32$."]),
    ex(2, num("srlx-ex-5", "Of 50 students, 30 take maths, 25 physics and 8 neither. How many take both?", 13, "$30 + 25 - 42$."), ["$\\lvert M \\cup P\\rvert = 42$; both $= 13$."]),
    ex(3, num("srlx-ex-6", "How many equivalence relations are there on a 3-element set?", 5, "Count partitions of 3 elements."), ["One class (1), a pair and a single (3), three singletons (1): 5."]),
    ex(3, mc("srlx-ex-7", "\"Is perpendicular to\" on the lines of a plane is", ["symmetric only", "Perpendicularity is mutual, but no line is perpendicular to itself, and two perpendiculars to a line are parallel."], [["an equivalence relation", "It isn't reflexive or transitive."], ["reflexive and symmetric", "A line isn't perpendicular to itself."]]), ["\"Is parallel to\" (counting a line as parallel to itself) is an equivalence relation."]),
    ex(3, mc("srlx-ex-8", "$(A \\cup B)'$ equals", ["$A' \\cap B'$", "De Morgan's law."], [["$A' \\cup B'$", "That is $(A \\cap B)'$."], ["$A \\cap B$", "The complement flips the operation and the sets."]]), ["Outside the union means outside both."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const both = r.int(2, 20);
      const a = both + r.int(3, 30);
      const b = both + r.int(3, 30);
      const total = a + b - both + r.int(0, 15);
      return n(`Of ${total} people, ${a} like tea, ${b} like coffee and ${both} like both. How many like neither?`, total - (a + b - both), `$${total} - (${a} + ${b} - ${both})$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 4);
      const kind = r.pick(["all", "reflexive", "symmetric"] as const);
      const e = kind === "all" ? k * k : kind === "reflexive" ? k * k - k : (k * (k + 1)) / 2;
      return n(`How many ${kind === "all" ? "" : `${kind} `}relations are there on a ${k}-element set?`, 2 ** e, `$2^{${e}} = ${2 ** e}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(3, 9);
      const fixedIn = r.int(0, 2);
      return n(fixedIn === 0 ? `How many subsets (including the empty set) has a set of ${nn} elements?` : `How many subsets of a set of ${nn} elements contain ${fixedIn} particular element${fixedIn > 1 ? "s" : ""}?`, 2 ** (nn - fixedIn), `Choose freely among the other ${nn - fixedIn}: $2^{${nn - fixedIn}}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(10, 40);
      const b = r.int(10, 40);
      const c = r.int(2, Math.min(a, b) - 1);
      return mcNumbers(
        `$\\lvert A\\rvert = ${a}$, $\\lvert B\\rvert = ${b}$, $\\lvert A \\cap B\\rvert = ${c}$. Then $\\lvert A \\cup B\\rvert$ is`,
        { text: `${a + b - c}`, why: "Subtract the overlap once." },
        [{ text: `${a + b}`, why: "That counts the overlap twice.", misconception: "venn-add-overlap" }, { text: `${a + b - 2 * c}`, why: "That removes the overlap entirely." }],
      );
    },
  },
];
