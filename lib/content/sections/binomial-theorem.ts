import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The binomial theorem for positive integer index: general term, specific coefficients, term independent of x, middle terms, greatest coefficient and numerically greatest term; approximations and remainders; the binomial series for any index. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, r: number) => (r < 0 || r > n ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));

const base: ConceptNode = {
  id: "binomial-theorem",
  title: "The binomial theorem",
  summary: "Expanding (a + b)ⁿ means choosing a or b from each of n brackets; the number of ways to choose b exactly k times is C(n, k). So (a + b)ⁿ = Σ C(n, k) aⁿ⁻ᵏ bᵏ, and the (k + 1)th term is C(n, k) aⁿ⁻ᵏ bᵏ. From this general term come specific coefficients, terms independent of x, middle terms and approximations; for other exponents the expansion becomes an infinite series.",
  deps: ["combinations-advanced", "polynomials"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "general term", meaning: "$T_{k+1} = \\binom nka^{n-k}b^k$ in $(a + b)^n$, for $k = 0, \\dots, n$." },
    { term: "middle term", meaning: "$T_{n/2 + 1}$ if $n$ is even; $T_{(n+1)/2}$ and $T_{(n+3)/2}$ if $n$ is odd." },
    { term: "term independent of $x$", meaning: "The term in which the power of $x$ is 0." },
  ],
  misconceptions: {
    "binomial-term-index": "Writes the $k$th term as $\\binom nka^{n-k}b^k$ instead of $\\binom n{k - 1}a^{n-k+1}b^{k-1}$.",
    "binomial-coefficient-sign": "Forgets to raise the second term's coefficient or sign to its power, for example taking the $x^3$ coefficient of $(x - 2)^5$ as $\\binom52$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Expanding without multiplying",
      body: "Multiplying out $(2x - 3)^{10}$ by hand would take ages, but finding its $x^7$ coefficient takes one line with the general term. JEE asks for coefficients, constant terms, middle terms and the largest term; all come from the same formula.",
      realWorld: {
        title: "Compound interest approximations",
        body: "$(1 + r)^n \\approx 1 + nr + \\tfrac{n(n - 1)}2r^2$ for small $r$: 5% growth over 3 years is about $1 + 0.15 + 0.0075 = 1.1575$, very close to the exact $1.157625$.",
      },
    },
    {
      type: "truth",
      statement: "For a positive integer $n$: $(a + b)^n = \\sum_{k=0}^n\\binom nka^{n-k}b^k$, with $n + 1$ terms. The **general term** is $T_{k+1} = \\binom nka^{n-k}b^k$. In $(x^p + cx^q)^n$, the general term is $\\binom nkc^kx^{p(n-k) + qk}$: set the power of $x$ equal to the target to find $k$. The coefficients $\\binom nk$ are largest in the middle: at $k = \\tfrac n2$ for even $n$, and at $k = \\tfrac{n \\pm 1}2$ for odd $n$.",
      body: "Keep signs and coefficients inside the powers: in $(2x - 3)^n$, $b = -3$, so $b^k = (-3)^k$. The **numerically greatest term** of $(a + b)^n$ (for positive $a, b$) is where $\\dfrac{T_{k+1}}{T_k} = \\dfrac{n - k + 1}{k}\\cdot\\dfrac ba$ drops below 1. Approximations keep the first few terms: $(1.02)^{10} \\approx 1 + 0.2 + 0.018 = 1.218$. Remainders: $7^{100} = (1 + 6)^{100}$, so on division by 36 only the first two terms matter: $1 + 600 \\equiv 1 + 24 = 25$. For **any real index** and $\\lvert x\\rvert < 1$: $(1 + x)^r = 1 + rx + \\dfrac{r(r - 1)}{2!}x^2 + \\dots$, an infinite series; e.g. $(1 - x)^{-1} = 1 + x + x^2 + \\dots$ (§{geometric-progressions}).",
    },
    {
      type: "predict",
      misconception: "binomial-coefficient-sign",
      item: {
        kind: "mc",
        id: "bth-predict-1",
        prompt: "The coefficient of $x^3$ in $(x - 2)^5$ is",
        options: [
          { id: "a", text: "40", correct: true, why: "$k = 2$: $\\binom52(-2)^2 = 10 \\times 4$." },
          { id: "b", text: "10", misconception: "binomial-coefficient-sign", why: "The $(-2)^2$ factor is part of the coefficient." },
          { id: "c", text: "$-40$", why: "$(-2)^2$ is positive." },
        ],
      },
      reveal: {
        body: "$T_{k+1} = \\binom5kx^{5-k}(-2)^k$. For $x^3$, $k = 2$, giving $\\binom52(-2)^2 = 10 \\times 4 = 40$. Everything attached to $b$, its number and its sign, is raised to the power $k$. The $x^2$ coefficient, with $k = 3$, would be $10 \\times (-8) = -80$.",
      },
      resolve: {
        kind: "mc",
        id: "bth-resolve-1",
        prompt: "The coefficient of $x^2$ in $(1 + 3x)^4$ is",
        options: [
          { id: "a", text: "54", correct: true, why: "$\\binom42 3^2 = 6 \\times 9$." },
          { id: "b", text: "6", misconception: "binomial-coefficient-sign", why: "Include $3^2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bth-check-1",
        prompt: "The 4th term of $(a + b)^7$ is",
        options: [
          { id: "a", text: "$\\binom73a^4b^3$", correct: true, why: "$T_{k+1}$ with $k = 3$." },
          { id: "b", text: "$\\binom74a^3b^4$", misconception: "binomial-term-index", why: "The 4th term has $k = 3$, not 4." },
          { id: "c", text: "$\\binom73a^3b^4$", why: "The powers must add to 7 with $b$ to the $k$th." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bth-check-2",
        prompt: "The term independent of $x$ in $\\left(x^2 + \\tfrac1x\\right)^6$ is",
        options: [
          { id: "a", text: "15", correct: true, why: "Power $12 - 3k = 0$ at $k = 4$: $\\binom64 = 15$." },
          { id: "b", text: "20", why: "That is the middle coefficient." },
          { id: "c", text: "There isn't one", why: "$k = 4$ works." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Binomial coefficients count the ways $k$ of $n$ independent trials succeed, giving the binomial distribution (§{binomial}). Polynomial feature expansions of degree $d$ in $p$ variables create $\\binom{p + d}{d}$ features, a count from the same family.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "bth-produce-1", prompt: "Find the coefficient of $x^7$ in $(2x - 1)^{10}$.", answer: -15360, explain: "$k = 3$: $\\binom{10}3 2^7(-1)^3$." },
        { kind: "number", id: "bth-produce-2", prompt: "Find the middle term's coefficient in $(1 + x)^{10}$.", answer: 252, explain: "$\\binom{10}5$." },
        {
          kind: "mc",
          id: "bth-produce-3",
          prompt: "The coefficient of $x$ in $(3 - x)^4$ is",
          options: [
            { id: "a", text: "$-108$", correct: true, why: "$\\binom41 3^3(-1)$." },
            { id: "b", text: "4", misconception: "binomial-coefficient-sign", why: "Include $3^3$ and the sign." },
          ],
        },
        {
          kind: "mc",
          id: "bth-produce-4",
          prompt: "The 6th term of $(x + y)^9$ has $y$ raised to the power",
          options: [
            { id: "a", text: "5", correct: true, why: "$T_6 = T_{5+1}$." },
            { id: "b", text: "6", misconception: "binomial-term-index", why: "The $(k + 1)$th term has $y^k$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "bth-review-1", prompt: "How many terms has the expansion of $(a + b)^{12}$?", answer: 13, explain: "$n + 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "greatest term",
      body: "For $(a + b)^n$ with $a, b > 0$, $\\dfrac{T_{k+1}}{T_k} = \\dfrac{n - k + 1}{k}\\cdot\\dfrac ba$. The terms increase while this ratio exceeds 1, that is while $k < \\dfrac{(n + 1)b}{a + b}$. So the greatest term is $T_{m+1}$ with $m = \\left\\lfloor\\tfrac{(n + 1)b}{a + b}\\right\\rfloor$ (two equal greatest terms if that value is an integer).",
    },
    {
      type: "definition",
      term: "the binomial series",
      body: "For any real $r$ and $\\lvert x\\rvert < 1$: $(1 + x)^r = \\sum_{k \\ge 0}\\binom rkx^k$ with $\\binom rk = \\dfrac{r(r - 1)\\cdots(r - k + 1)}{k!}$. Examples: $(1 + x)^{-1} = 1 - x + x^2 - \\dots$; $(1 + x)^{1/2} = 1 + \\tfrac x2 - \\tfrac{x^2}8 + \\dots$, so $\\sqrt{1.02} \\approx 1.00995$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the binomial theorem",
      statement: "For a positive integer $n$, $(a + b)^n = \\sum_{k=0}^n\\binom nka^{n-k}b^k$.",
      proof: ["Expanding $(a + b)(a + b)\\cdots(a + b)$, each term picks $a$ or $b$ from every bracket. The term $a^{n-k}b^k$ arises once for each choice of the $k$ brackets supplying $b$: $\\binom nk$ times (§{combinations-advanced})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "symmetry and the middle",
      statement: "$\\binom nk = \\binom n{n - k}$, and $\\binom nk$ increases up to the middle and then decreases.",
      proof: ["$\\dfrac{\\binom n{k+1}}{\\binom nk} = \\dfrac{n - k}{k + 1}$, which exceeds 1 exactly when $k < \\tfrac{n - 1}2$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "remainders by the binomial theorem",
      statement: "To find $a^n \\bmod m$, write $a = 1 + d$ (or $a = km \\pm 1$) with $d$ divisible by a factor of $m$, expand, and drop the terms that are multiples of $m$.",
      proof: ["E.g. $7^{100} = (1 + 6)^{100} = 1 + 600 + \\binom{100}{2}36 + \\dots$; modulo 36 only $1 + 600 = 601 \\equiv 25$ survives."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the coefficient of $x^3$ in $(x - 2)^5$.",
      solution: ["$T_{k+1} = \\binom5kx^{5-k}(-2)^k$; $5 - k = 3$ gives $k = 2$.", "$\\binom52(-2)^2 = 40$."],
      result: "40.",
    },
    {
      type: "example",
      level: 2,
      title: "the constant term",
      problem: "Find the term independent of $x$ in $\\left(2x - \\tfrac1{x^2}\\right)^9$.",
      solution: ["$T_{k+1} = \\binom9k(2x)^{9-k}(-x^{-2})^k$, power $9 - 3k = 0$, so $k = 3$.", "$\\binom93 2^6(-1)^3 = 84 \\times 64 \\times (-1) = -5376$."],
      result: "$-5376$.",
    },
    {
      type: "example",
      level: 3,
      title: "a remainder",
      problem: "Find the remainder when $9^{50}$ is divided by 8.",
      solution: ["$9 = 1 + 8$, so $9^{50} = 1 + 50 \\times 8 + (\\text{multiples of } 64)$.", "Every term after the first is a multiple of 8: remainder 1."],
      result: "1.",
    },
  ],
  pitfalls: [
    { wrong: "The $k$th term uses $\\binom nk$.", right: "The $(k + 1)$th term does: $T_{k+1} = \\binom nka^{n-k}b^k$." },
    { wrong: "Drop the coefficient or sign of $b$.", right: "Raise all of $b$ to the power $k$." },
    { wrong: "Use the infinite binomial series for $\\lvert x\\rvert \\ge 1$.", right: "It converges only for $\\lvert x\\rvert < 1$." },
  ],
  formulas: [
    { label: "Binomial theorem", tex: "(a + b)^n = \\textstyle\\sum_{k=0}^n\\binom nka^{n-k}b^k" },
    { label: "General term", tex: "T_{k+1} = \\binom nka^{n-k}b^k" },
    { label: "Ratio of terms", tex: "\\dfrac{T_{k+1}}{T_k} = \\dfrac{n - k + 1}{k}\\cdot\\dfrac ba" },
    { label: "Any index", tex: "(1 + x)^r = 1 + rx + \\tfrac{r(r - 1)}{2}x^2 + \\dots" },
  ],
  exercises: [
    ex(1, num("bthx-ex-1", "Find the coefficient of $x^2$ in $(1 + x)^8$.", 28, "$\\binom82$."), ["$28$."]),
    ex(1, num("bthx-ex-2", "Find the coefficient of $x^4$ in $(x + 3)^6$.", 135, "$\\binom62 3^2$."), ["$15 \\times 9 = 135$."]),
    ex(2, num("bthx-ex-3", "Find the term independent of $x$ in $\\left(x + \\tfrac1x\\right)^8$.", 70, "$\\binom84$."), ["$70$."]),
    ex(2, num("bthx-ex-4", "Find the term independent of $x$ in $\\left(2x - \\tfrac1{x^2}\\right)^9$.", -5376, "$k = 3$."), ["$-5376$."]),
    ex(2, dp("bthx-ex-5", "Approximate $(1.02)^{10}$ using the first three terms.", 1.218, "$1 + 0.2 + 45 \\times 0.0004$."), ["$1.218$ (exact 1.21899...)."]),
    ex(3, num("bthx-ex-6", "Find the remainder when $7^{100}$ is divided by 36.", 25, "$(1 + 6)^{100} = 1 + 600 + (\\text{multiples of } 36)$."), ["$601 = 16 \\times 36 + 25$."]),
    ex(3, num("bthx-ex-7", "Find the coefficient of $x^5$ in $(1 + x)^5 + (1 + x)^6 + \\dots + (1 + x)^{10}$.", C(11, 6), "Hockey stick: $\\sum_{m=5}^{10}\\binom m5 = \\binom{11}6$."), ["$462$."]),
    ex(3, mc("bthx-ex-8", "The expansion of $(1 + x)^{-2}$ for $\\lvert x\\rvert < 1$ begins", ["$1 - 2x + 3x^2 - 4x^3 + \\dots$", "Coefficients $\\binom{-2}{k} = (-1)^k(k + 1)$."], [["$1 + 2x + 3x^2 + \\dots$", "That is $(1 - x)^{-2}$."], ["$1 - 2x + x^2$", "A negative index gives an infinite series."]]), ["Differentiate $(1 + x)^{-1}$ to check."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(4, 9);
      const a = r.pick([1, 2, 3]);
      const b = r.pick([1, 2, 3, -1, -2, -3]);
      const p = r.int(1, nn - 1);
      const k = nn - p;
      const v = C(nn, k) * a ** p * b ** k;
      return n(`Find the coefficient of $x^{${p}}$ in $(${a === 1 ? "" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${nn}}$.`, v, `$k = ${k}$: $\\binom{${nn}}{${k}}(${a})^{${p}}(${b})^{${k}} = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [pa, qa] = r.pick([[1, 1], [2, 1], [1, 2], [3, 1]] as const);
      // (x^pa + x^{-qa})^n: power pa(n-k) - qa k = 0 -> k = pa n/(pa+qa)
      const mult = pa + qa;
      const nn = mult * r.int(2, 4);
      const k = (pa * nn) / mult;
      return n(`Find the term independent of $x$ in $\\left(x${pa === 1 ? "" : `^{${pa}}`} + \\dfrac{1}{x${qa === 1 ? "" : `^{${qa}}`}}\\right)^{${nn}}$.`, C(nn, k), `Power $${pa}(${nn} - k) - ${qa}k = 0$ gives $k = ${k}$: $\\binom{${nn}}{${k}} = ${C(nn, k)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(4, 14);
      return n(`Find the greatest binomial coefficient in the expansion of $(1 + x)^{${nn}}$.`, C(nn, Math.floor(nn / 2)), `$\\binom{${nn}}{${Math.floor(nn / 2)}}$ (the middle${nn % 2 ? " pair" : ""}).`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.int(6, 12);
      const t = r.int(3, nn);
      return mcNumbers(
        `In $(a + b)^{${nn}}$, the ${t}th term contains $b$ to the power`,
        { text: `${t - 1}`, why: `$T_{k+1}$ has $b^k$; here $k = ${t - 1}$.` },
        [{ text: `${t}`, why: "Term numbering starts at $k = 0$.", misconception: "binomial-term-index" }, { text: `${t + 1}`, why: `The ${t}th term has $k = ${t - 1}$.` }],
      );
    },
  },
];
