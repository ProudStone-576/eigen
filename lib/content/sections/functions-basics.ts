import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Functions: definition, domain, codomain and range; finding natural domains and ranges; one-one, onto and bijective functions; counting functions; the algebra of functions. */

const P = (n: number, k: number) => { let p = 1; for (let i = 0; i < k; i++) p *= n - i; return p; };
const C = (n: number, k: number) => P(n, k) / P(k, k);
const onto = (m: number, n: number) => { let s = 0; for (let k = 0; k <= n; k++) s += (-1) ** k * C(n, k) * (n - k) ** m; return s; };

const base: ConceptNode = {
  id: "functions-basics",
  title: "Functions: domain, range & types",
  summary: "A function assigns each input in its domain exactly one output in its codomain; the outputs actually reached form the range. The natural domain excludes inputs that break the formula, such as zero denominators, negative square roots and non-positive logarithms. A function is one-one if different inputs give different outputs, onto if it reaches every element of the codomain, and bijective if both, which is exactly when it has an inverse.",
  deps: ["sets-relations", "quadratics"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "range", meaning: "The set of outputs $\\{f(x) : x \\in \\text{domain}\\}$, a subset of the codomain." },
    { term: "one-one (injective)", meaning: "$f(a) = f(b) \\Rightarrow a = b$: no output is hit twice." },
    { term: "onto (surjective)", meaning: "Every element of the codomain is an output: range $=$ codomain." },
  ],
  misconceptions: {
    "range-equals-codomain": "Assumes a function's range is its whole codomain, so every function is onto.",
    "one-one-onto-confused": "Mixes up one-one (no repeated outputs) with onto (every output reached).",
  },
  steps: [
    {
      type: "motivate",
      title: "Inputs, outputs and what can go wrong",
      body: "The formula $\\dfrac{\\sqrt{x - 2}}{x - 5}$ makes sense only for some $x$, and its values never cover every real number. Exam questions ask exactly this: where is a formula defined, what values can it take, and does each output come from just one input? The answers decide whether equations have solutions and whether a function can be reversed.",
      realWorld: {
        title: "Hash functions",
        body: "A hash function maps files to short codes. It can't be one-one (there are more files than codes), so collisions must exist; a good hash makes them extremely hard to find, which is what secures passwords and blockchains.",
      },
    },
    {
      type: "truth",
      statement: "A **function** $f : A \\to B$ gives each $x \\in A$ (the domain) exactly one $f(x) \\in B$ (the codomain); the **range** is the set of values taken. The **natural domain** of a formula excludes zeros of denominators, negative arguments of even roots and non-positive arguments of logarithms. $f$ is **one-one** if $f(a) = f(b)$ forces $a = b$ (every horizontal line meets the graph at most once), **onto** if its range is all of $B$, and **bijective** if both. From an $m$-set to an $n$-set there are $n^m$ functions, $\\dfrac{n!}{(n - m)!}$ one-one functions ($m \\le n$), and $\\sum_{k=0}^n(-1)^k\\binom nk(n - k)^m$ onto functions.",
      body: "To find a **range**, set $y = f(x)$ and ask for which $y$ the equation has a solution in the domain: for $y = \\dfrac{x}{x^2 + 1}$, the quadratic $yx^2 - x + y = 0$ needs discriminant $1 - 4y^2 \\ge 0$, so $-\\tfrac12 \\le y \\le \\tfrac12$ (§{quadratics}). For the **algebra of functions**, $f + g$, $f - g$ and $fg$ are defined on the intersection of the domains; $f/g$ also excludes the zeros of $g$. Whether a function is onto depends on the stated codomain: $x \\mapsto x^2$ from $\\mathbb R$ to $\\mathbb R$ is not onto, but from $\\mathbb R$ to $[0, \\infty)$ it is.",
    },
    {
      type: "predict",
      misconception: "range-equals-codomain",
      item: {
        kind: "mc",
        id: "fnb-predict-1",
        prompt: "$f : \\mathbb R \\to \\mathbb R$, $f(x) = x^2 + 1$. Is $f$ onto?",
        options: [
          { id: "a", text: "No: its range is $[1, \\infty)$, so values below 1 are never reached", correct: true, why: "$x^2 + 1 \\ge 1$." },
          { id: "b", text: "Yes: it is a function into $\\mathbb R$, so it covers $\\mathbb R$", misconception: "range-equals-codomain", why: "Mapping into a set doesn't mean reaching all of it." },
          { id: "c", text: "Yes, because it is continuous", why: "Continuity doesn't make it reach negative values." },
        ],
      },
      reveal: {
        body: "The codomain $\\mathbb R$ is where outputs are allowed to land; the range $[1, \\infty)$ is where they actually land. $f(x) = 0$ has no real solution, so 0 is never reached. Changing the codomain to $[1, \\infty)$ would make $f$ onto, though still not one-one, since $f(2) = f(-2)$.",
      },
      resolve: {
        kind: "mc",
        id: "fnb-resolve-1",
        prompt: "$g : \\mathbb R \\to \\mathbb R$, $g(x) = e^x$. Then $g$ is",
        options: [
          { id: "a", text: "one-one but not onto: its range is $(0, \\infty)$", correct: true, why: "Never 0 or negative." },
          { id: "b", text: "bijective, since every function maps onto its codomain", misconception: "range-equals-codomain", why: "Negative numbers are never reached." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fnb-check-1",
        prompt: "$f : \\{1, 2, 3\\} \\to \\{a, b, c, d\\}$ with $f(1) = a$, $f(2) = b$, $f(3) = c$. Then $f$ is",
        options: [
          { id: "a", text: "one-one but not onto", correct: true, why: "Distinct outputs, but $d$ is never reached." },
          { id: "b", text: "onto but not one-one", misconception: "one-one-onto-confused", why: "One-one is about repeated outputs; onto about coverage." },
          { id: "c", text: "bijective", why: "A 3-set can't cover a 4-set." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fnb-check-2",
        prompt: "The natural domain of $\\dfrac{\\sqrt{x - 2}}{x - 5}$ is",
        options: [
          { id: "a", text: "$x \\ge 2$, $x \\ne 5$", correct: true, why: "Root needs $x \\ge 2$; denominator needs $x \\ne 5$." },
          { id: "b", text: "$x > 5$", why: "Values between 2 and 5 also work." },
          { id: "c", text: "all real $x$ except 5", why: "The square root fails for $x < 2$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A trained model is a function from inputs to predictions; many inputs map to the same label, so a classifier is never one-one. Invertible (bijective) neural networks, used in normalising flows, are built so the map can be run backwards exactly.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "fnb-produce-1", prompt: "How many one-one functions are there from a 3-element set to a 5-element set?", answer: 60, explain: "$5 \\times 4 \\times 3$." },
        { kind: "number", id: "fnb-produce-2", prompt: "How many onto functions are there from a 4-element set to a 3-element set?", answer: 36, explain: "$81 - 3 \\times 16 + 3 \\times 1$." },
        {
          kind: "mc",
          id: "fnb-produce-3",
          prompt: "$f : \\mathbb R \\to [0, \\infty)$, $f(x) = x^2$ is",
          options: [
            { id: "a", text: "onto but not one-one", correct: true, why: "Every $y \\ge 0$ is reached, but $f(-1) = f(1)$." },
            { id: "b", text: "one-one but not onto", misconception: "one-one-onto-confused", why: "Two inputs give each positive output." },
          ],
        },
        {
          kind: "mc",
          id: "fnb-produce-4",
          prompt: "$h : \\mathbb R \\to \\mathbb R$, $h(x) = \\lvert x\\rvert$. Its range is",
          options: [
            { id: "a", text: "$[0, \\infty)$", correct: true, why: "Absolute values are never negative." },
            { id: "b", text: "$\\mathbb R$, its codomain", misconception: "range-equals-codomain", why: "Negative values are never reached." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "fnb-review-1", prompt: "How many functions are there from a 3-element set to a 2-element set?", answer: 8, explain: "$2^3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "testing one-one and onto",
      body: "**One-one**: assume $f(a) = f(b)$ and show $a = b$; or show $f$ is strictly increasing or decreasing; or use the horizontal line test. **Onto**: for an arbitrary $y$ in the codomain, solve $f(x) = y$ and check the solution lies in the domain. For a finite set mapped to itself, one-one and onto are equivalent.",
    },
    {
      type: "definition",
      term: "finding ranges",
      body: "Methods: (1) solve $y = f(x)$ for $x$ and find the $y$ that give a valid $x$; (2) for quadratics complete the square; (3) for $\\dfrac{ax^2 + bx + c}{px^2 + qx + r}$ form a quadratic in $x$ and require a non-negative discriminant; (4) use monotonicity on an interval: a continuous increasing $f$ on $[a, b]$ has range $[f(a), f(b)]$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "counting functions",
      statement: "From a set of size $m$ to a set of size $n$: $n^m$ functions; $n(n - 1)\\cdots(n - m + 1)$ one-one functions if $m \\le n$ (else 0); and $\\sum_{k=0}^{n}(-1)^k\\binom nk(n - k)^m$ onto functions.",
      proof: [
        "Each of the $m$ inputs has $n$ choices; for one-one, the choices shrink by one each time.",
        "Onto by inclusion–exclusion (§{sets-relations}): subtract functions missing at least one output, add back those missing two, and so on.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "monotonic functions are one-one",
      statement: "If $f$ is strictly increasing (or strictly decreasing) on its domain, it is one-one.",
      proof: ["If $a \\ne b$, say $a < b$, then $f(a) < f(b)$, so $f(a) \\ne f(b)$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "domains of combinations",
      statement: "$\\operatorname{dom}(f \\pm g) = \\operatorname{dom}(fg) = \\operatorname{dom}f \\cap \\operatorname{dom}g$; $\\operatorname{dom}(f/g) = \\operatorname{dom}f \\cap \\operatorname{dom}g \\setminus \\{x : g(x) = 0\\}$.",
      proof: ["Each combination needs both $f(x)$ and $g(x)$ to exist, and division needs $g(x) \\ne 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the domain and range of $f(x) = \\sqrt{9 - x^2}$.",
      solution: ["$9 - x^2 \\ge 0$ gives $-3 \\le x \\le 3$.", "$9 - x^2$ takes values in $[0, 9]$, so $f$ takes values in $[0, 3]$."],
      result: "Domain $[-3, 3]$, range $[0, 3]$.",
    },
    {
      type: "example",
      level: 2,
      title: "a range by discriminant",
      problem: "Find the range of $f(x) = \\dfrac{x}{x^2 + 1}$.",
      solution: ["$y(x^2 + 1) = x$ gives $yx^2 - x + y = 0$; for $y \\ne 0$ real $x$ needs $1 - 4y^2 \\ge 0$.", "So $-\\tfrac12 \\le y \\le \\tfrac12$ ($y = 0$ at $x = 0$)."],
      result: "$[-\\tfrac12, \\tfrac12]$.",
    },
    {
      type: "example",
      level: 3,
      title: "counting onto functions",
      problem: "How many functions from $\\{1, 2, 3, 4\\}$ onto $\\{a, b, c\\}$ are there?",
      solution: ["All functions: $3^4 = 81$. Missing a given output: $2^4 = 16$, three ways. Missing two: $1^4 = 1$, three ways.", "$81 - 48 + 3 = 36$."],
      result: "36.",
    },
  ],
  pitfalls: [
    { wrong: "The range is the codomain.", right: "The range is what is actually reached; check by solving $f(x) = y$." },
    { wrong: "Confuse one-one with onto.", right: "One-one: no repeats. Onto: nothing missed." },
    { wrong: "Forget domain restrictions from logs and roots.", right: "List every restriction, then intersect." },
  ],
  formulas: [
    { label: "All functions", tex: "n^m" },
    { label: "One-one", tex: "\\dfrac{n!}{(n - m)!}" },
    { label: "Onto", tex: "\\textstyle\\sum_{k=0}^n(-1)^k\\binom nk(n - k)^m" },
    { label: "Quotient domain", tex: "\\operatorname{dom}f \\cap \\operatorname{dom}g \\setminus \\{g = 0\\}" },
  ],
  exercises: [
    ex(1, num("fnbx-ex-1", "Find the minimum value in the range of $f(x) = x^2 - 4x + 7$.", 3, "Vertex at $x = 2$."), ["$3$; range $[3, \\infty)$."]),
    ex(1, num("fnbx-ex-2", "How many integers are in the domain of $\\sqrt{16 - x^2}$?", 9, "$-4 \\le x \\le 4$."), ["$9$."]),
    ex(2, num("fnbx-ex-3", "How many onto functions are there from a 3-element set to a 2-element set?", 6, "$2^3 - 2$."), ["$6$."]),
    ex(2, num("fnbx-ex-4", "How many one-one functions are there from a 4-element set to itself?", 24, "$4!$."), ["$24$."]),
    ex(2, num("fnbx-ex-5", "The range of $\\dfrac{2x + 1}{x - 3}$ ($x \\ne 3$) is all reals except one value. Find it.", 2, "$y = 2$ has no solution."), ["$y(x - 3) = 2x + 1$ gives $x(y - 2) = 3y + 1$: impossible for $y = 2$."]),
    ex(3, num("fnbx-ex-6", "How many onto functions are there from a 5-element set to a 3-element set?", onto(5, 3), "$243 - 3 \\times 32 + 3 \\times 1$."), ["$150$."]),
    ex(3, num("fnbx-ex-7", "Find the largest value of $f(x) = \\dfrac{x}{x^2 + 4}$.", 0.25, "Discriminant: $1 - 16y^2 \\ge 0$."), ["$\\tfrac14$, at $x = 2$."]),
    ex(3, mc("fnbx-ex-8", "$f : \\mathbb Z \\to \\mathbb Z$, $f(n) = 2n + 1$ is", ["one-one but not onto", "Only odd integers are reached."], [["bijective", "Even integers are missed."], ["onto but not one-one", "Distinct $n$ give distinct values."]]), ["The codomain matters."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const kind = lv === 1 ? "all" : r.pick(["all", "one-one", "onto"] as const);
      let m: number;
      let nn: number;
      if (kind === "onto") {
        nn = r.int(2, 3);
        m = r.int(nn, 5);
      } else {
        m = r.int(2, 4);
        nn = kind === "one-one" ? r.int(m, 6) : r.int(2, 5);
      }
      const v = kind === "all" ? nn ** m : kind === "one-one" ? P(nn, m) : onto(m, nn);
      const how = kind === "all" ? `$${nn}^${m} = ${v}$.` : kind === "one-one" ? `$${nn}!/(${nn} - ${m})! = ${v}$.` : `Inclusion–exclusion: $\\sum_k(-1)^k\\binom{${nn}}{k}(${nn} - k)^{${m}} = ${v}$.`;
      return n(`How many ${kind === "all" ? "" : `${kind} `}functions are there from a set of ${m} elements to a set of ${nn} elements?`, v, how);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const h = r.int(-5, 5);
      const k = r.int(-8, 8);
      const b = -2 * h;
      const c = h * h + k;
      return n(`Find the least value in the range of $x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}$.`, k, `Complete the square: $(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^2 + (${k})$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.int(2, 9);
      return n(`How many integers lie in the natural domain of $\\sqrt{${a * a} - x^2}$?`, 2 * a + 1, `$-${a} \\le x \\le ${a}$: ${2 * a + 1} integers.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { f: "x^2 + 3", rng: "[3, \\infty)" },
        { f: "e^x", rng: "(0, \\infty)" },
        { f: "\\lvert x\\rvert - 2", rng: "[-2, \\infty)" },
        { f: "x^4", rng: "[0, \\infty)" },
      ]);
      return mcNumbers(
        `Is $f : \\mathbb R \\to \\mathbb R$, $f(x) = ${v.f}$ onto?`,
        { text: `No: its range is $${v.rng}$`, why: "Some real numbers are never reached." },
        [{ text: "Yes: its codomain is $\\mathbb R$, so it covers $\\mathbb R$", why: "Range and codomain can differ.", misconception: "range-equals-codomain" }],
      );
    },
  },
];
