import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Moment generating functions: moments, sums of independent variables, uniqueness, the route to the CLT. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "mgf",
  title: "Moment generating functions",
  summary: "The moment generating function $M(t) = E[e^{tX}]$ holds every moment of $X$: $M^{(k)}(0) = E[X^k]$. The MGF of a sum of independent variables is the product of their MGFs, which identifies the distributions of sums and leads to the central limit theorem.",
  deps: ["binomial", "poisson", "uniform-exponential"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "MGF", meaning: "$M_X(t) = E[e^{tX}]$, a function of $t$ that encodes the whole distribution of $X$." },
    { term: "moment", meaning: "$E[X^k]$, the $k$th moment; the mean is the first and $E[X^2]$ the second." },
    { term: "cumulant generating function", meaning: "$K(t) = \\ln M(t)$; $K'(0)$ is the mean and $K''(0)$ the variance." },
  ],
  misconceptions: {
    "mgf-add": "Adds the MGFs of independent variables instead of multiplying them.",
    "mgf-moment-at-1": "Evaluates the MGF's derivatives at $t = 1$ instead of $t = 0$ to get moments.",
  },
  steps: [
    {
      type: "motivate",
      title: "All the moments at once",
      body: "Mean, variance, skewness and kurtosis each need their own sum or integral. One function can hold all of them, and it turns a hard question, what is the distribution of a sum of random variables?, into multiplication.",
      realWorld: {
        title: "Adding up risks",
        body: "An insurer's total payout is the sum of thousands of independent claims. Generating functions (and their cousins, characteristic functions) are how the distribution of such totals is worked out without simulating every claim.",
      },
    },
    {
      type: "truth",
      statement: "The **moment generating function** of $X$ is $M_X(t) = E[e^{tX}]$. Its derivatives at 0 are the moments: $M_X'(0) = E[X]$, $M_X''(0) = E[X^2]$, and in general $M_X^{(k)}(0) = E[X^k]$.",
      body: "If $X$ and $Y$ are independent, $M_{X+Y}(t) = M_X(t)M_Y(t)$. Two distributions whose MGFs agree on an interval around $t = 0$ are the same distribution, so recognising an MGF identifies the distribution.",
    },
    {
      type: "predict",
      misconception: "mgf-add",
      item: {
        kind: "mc",
        id: "mgf-predict-1",
        prompt: "$X \\sim \\mathrm{Po}(2)$ and $Y \\sim \\mathrm{Po}(3)$ are independent, with $M_X(t) = e^{2(e^t - 1)}$ and $M_Y(t) = e^{3(e^t - 1)}$. The MGF of $X + Y$ is",
        options: [
          { id: "a", text: "$e^{5(e^t - 1)}$, so $X + Y \\sim \\mathrm{Po}(5)$", correct: true, why: "Multiply the MGFs: the exponents add." },
          { id: "b", text: "$e^{2(e^t - 1)} + e^{3(e^t - 1)}$", misconception: "mgf-add", why: "That isn't an MGF at all: it equals 2 at $t = 0$." },
          { id: "c", text: "$e^{6(e^t - 1)}$", why: "Multiplying the MGFs adds the exponents 2 and 3." },
        ],
      },
      reveal: {
        body: "$E[e^{t(X + Y)}] = E[e^{tX}e^{tY}] = E[e^{tX}]\\,E[e^{tY}]$, because expectations of independent factors multiply. Then $e^{2(e^t - 1)}e^{3(e^t - 1)} = e^{5(e^t - 1)}$, the MGF of Po(5). A sum of two MGFs fails the basic test: every MGF equals $E[e^0] = 1$ at $t = 0$.",
      },
      resolve: {
        kind: "mc",
        id: "mgf-resolve-1",
        prompt: "Why do the MGFs of independent variables multiply?",
        options: [
          { id: "a", text: "$e^{t(X + Y)} = e^{tX}e^{tY}$, and the expectation of a product of independent factors is the product of expectations", correct: true, why: "Both steps are needed." },
          { id: "b", text: "They don't; they add, as means do", misconception: "mgf-add", why: "Means add; MGFs multiply." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mgf-check-1",
        prompt: "$M_X(t) = (1 - 2t)^{-1}$. How do you find $E[X]$?",
        options: [
          { id: "a", text: "Differentiate and set $t = 0$: $M'(0) = 2$", correct: true, why: "$M'(t) = 2(1 - 2t)^{-2}$." },
          { id: "b", text: "Differentiate and set $t = 1$", misconception: "mgf-moment-at-1", why: "Moments come from $t = 0$, where $e^{tX} = 1$ expands into powers of $X$." },
          { id: "c", text: "Evaluate $M(0)$", why: "That is always 1." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mgf-check-2",
        prompt: "Every moment generating function satisfies $M(0) =$",
        options: [
          { id: "a", text: "1", correct: true, why: "$E[e^{0}] = E[1] = 1$." },
          { id: "b", text: "0", why: "$e^0 = 1$, not 0." },
          { id: "c", text: "$E[X]$", why: "That is $M'(0)$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The concentration bounds used to prove that models generalise, such as Hoeffding's and Chernoff's inequalities, are built from MGFs: they bound $P(\\bar X - \\mu \\ge \\varepsilon)$ by $e^{-t\\varepsilon}M(t)$ and then choose the best $t$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mgf-produce-1", prompt: "$M_X(t) = e^{3t + 2t^2}$. Find $E[X]$.", answer: 3, explain: "A normal MGF $e^{\\mu t + \\sigma^2t^2/2}$ with $\\mu = 3$." },
        { kind: "number", id: "mgf-produce-2", prompt: "$M_X(t) = (0.5 + 0.5e^t)^4$. Find $E[X]$.", answer: 2, explain: "Bin(4, 0.5): $np = 2$." },
        {
          kind: "mc",
          id: "mgf-produce-3",
          prompt: "To get $E[X^2]$ from $M_X$, compute",
          options: [
            { id: "a", text: "$M''(0)$", correct: true, why: "The second derivative at 0." },
            { id: "b", text: "$M''(1)$", misconception: "mgf-moment-at-1", why: "Moments come from $t = 0$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mgf-review-1", prompt: "$M_X(t) = e^{2(e^t - 1)}$. Find $E[X]$.", answer: 2, explain: "The Po(2) MGF." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "standard MGFs",
      body: "Bernoulli($p$): $q + pe^t$. $\\mathrm{Bin}(n, p)$: $(q + pe^t)^n$. $\\mathrm{Po}(\\lambda)$: $e^{\\lambda(e^t - 1)}$. $\\mathrm{Exp}(\\lambda)$: $\\dfrac{\\lambda}{\\lambda - t}$ for $t < \\lambda$. $N(\\mu, \\sigma^2)$: $e^{\\mu t + \\sigma^2t^2/2}$. $U(0, 1)$: $\\dfrac{e^t - 1}{t}$.",
    },
    {
      type: "definition",
      term: "cumulants, characteristic function",
      body: "$K(t) = \\ln M(t)$ has $K'(0) = E[X]$ and $K''(0) = \\operatorname{Var}(X)$. Some distributions (the Cauchy, the lognormal) have no MGF near 0; the **characteristic function** $\\varphi(t) = E[e^{itX}]$ always exists and plays the same role.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "moments from the MGF",
      statement: "$M_X(t) = \\displaystyle\\sum_{k \\ge 0}E[X^k]\\frac{t^k}{k!}$, so $M_X^{(k)}(0) = E[X^k]$.",
      proof: ["Expand $e^{tX} = \\sum_k (tX)^k/k!$ and take expectations term by term. Differentiating $k$ times and setting $t = 0$ leaves only the $t^k$ coefficient times $k!$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "linear changes and sums",
      statement: "$M_{aX + b}(t) = e^{bt}M_X(at)$. For independent $X_1, \\dots, X_n$, $M_{X_1 + \\dots + X_n} = M_{X_1}\\cdots M_{X_n}$. Hence: independent Poissons add to a Poisson, independent normals to a normal, $n$ Bernoullis to a binomial.",
      proof: ["$E[e^{t(aX + b)}] = e^{bt}E[e^{(at)X}]$. For sums, factor the exponential and use independence. Then recognise the product, e.g. $\\prod e^{\\lambda_i(e^t - 1)} = e^{(\\sum\\lambda_i)(e^t - 1)}$."],
    },
    {
      type: "theorem",
      name: "uniqueness and convergence",
      statement: "If $M_X = M_Y$ on an interval around 0, then $X$ and $Y$ have the same distribution. If $M_{X_n}(t) \\to M_X(t)$ near 0, the distributions of $X_n$ approach that of $X$. This is how the central limit theorem (§{clt}) is proved.",
      proof: [
        "Uniqueness and the continuity theorem are proved in advanced courses. For the CLT, the standardised mean of $n$ draws has MGF $\\left(1 + \\tfrac{t^2}{2n} + o\\left(\\tfrac1n\\right)\\right)^n$.",
        "That tends to $e^{t^2/2}$, the MGF of $N(0, 1)$.",
      ],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the MGF of a Bernoulli($p$) variable and use it to find the mean.",
      solution: ["$M(t) = E[e^{tX}] = q \\cdot e^0 + p \\cdot e^t = q + pe^t$.", "$M'(t) = pe^t$, so $E[X] = M'(0) = p$."],
      result: "$q + pe^t$; mean $p$.",
    },
    {
      type: "example",
      level: 2,
      title: "exponential moments",
      problem: "Use $M(t) = \\dfrac{\\lambda}{\\lambda - t}$ to find the mean and variance of $\\mathrm{Exp}(\\lambda)$.",
      solution: ["$M'(t) = \\dfrac{\\lambda}{(\\lambda - t)^2}$ and $M''(t) = \\dfrac{2\\lambda}{(\\lambda - t)^3}$.", "$E[X] = \\tfrac1\\lambda$, $E[X^2] = \\tfrac{2}{\\lambda^2}$, so $\\operatorname{Var}(X) = \\tfrac{2}{\\lambda^2} - \\tfrac{1}{\\lambda^2} = \\tfrac{1}{\\lambda^2}$."],
      result: "Mean $1/\\lambda$, variance $1/\\lambda^2$.",
    },
    {
      type: "example",
      level: 2,
      title: "a linear change",
      problem: "$X \\sim N(1, 4)$. Use MGFs to find the distribution of $Y = 3X + 2$.",
      solution: ["$M_Y(t) = e^{2t}M_X(3t) = e^{2t}e^{3t + 2(3t)^2}$.", "$= e^{5t + 18t^2}$, which is the MGF of $N(5, 36)$."],
      result: "$Y \\sim N(5, 36)$.",
    },
    {
      type: "example",
      level: 3,
      title: "identifying a distribution",
      problem: "$M_X(t) = (0.3 + 0.7e^t)^{10}$. Name the distribution and give its mean and variance.",
      solution: ["It matches $(q + pe^t)^n$ with $n = 10$, $p = 0.7$: $\\mathrm{Bin}(10, 0.7)$.", "Mean $np = 7$ and variance $npq = 2.1$."],
      result: "$\\mathrm{Bin}(10, 0.7)$; 7 and 2.1.",
    },
  ],
  pitfalls: [
    { wrong: "$M_{X+Y} = M_X + M_Y$.", right: "For independent variables the MGFs multiply." },
    { wrong: "Moments are derivatives at $t = 1$.", right: "Evaluate at $t = 0$." },
    { wrong: "Every distribution has an MGF.", right: "Heavy-tailed ones (Cauchy, lognormal) don't; use the characteristic function." },
  ],
  formulas: [
    { label: "Definition", tex: "M_X(t) = E[e^{tX}]" },
    { label: "Moments", tex: "M_X^{(k)}(0) = E[X^k]" },
    { label: "Independent sum", tex: "M_{X+Y} = M_XM_Y" },
    { label: "Linear change", tex: "M_{aX+b}(t) = e^{bt}M_X(at)" },
    { label: "Normal", tex: "e^{\\mu t + \\sigma^2t^2/2}" },
  ],
  exercises: [
    ex(1, num("mgfx-ex-1", "What is $M_X(0)$ for any random variable $X$?", 1, "$E[e^0]$."), ["$E[1] = 1$."]),
    ex(1, num("mgfx-ex-2", "$M_X(t) = (0.4 + 0.6e^t)^5$. Find $E[X]$.", 3, "Bin(5, 0.6)."), ["$np = 5 \\times 0.6 = 3$."]),
    ex(2, num("mgfx-ex-3", "$M_X(t) = e^{4t + 8t^2}$. Find $\\operatorname{Var}(X)$.", 16, "$\\sigma^2/2 = 8$."), ["Matching $e^{\\mu t + \\sigma^2t^2/2}$: $\\sigma^2 = 16$."]),
    ex(2, fr("mgfx-ex-4", "$M_X(t) = \\dfrac{3}{3 - t}$. Find $E[X]$.", 1 / 3, "Exp(3)."), ["$M'(0) = 3/9 = \\tfrac13$."]),
    ex(2, num("mgfx-ex-5", "$M_X(t) = e^{1.5(e^t - 1)}$. Find $\\operatorname{Var}(X)$.", 1.5, "Po(1.5)."), ["A Poisson's variance equals $\\lambda = 1.5$."]),
    ex(2, num("mgfx-ex-6", "$X \\sim \\mathrm{Po}(2)$ and $Y \\sim \\mathrm{Po}(4)$ are independent. $X + Y \\sim \\mathrm{Po}(\\lambda)$; find $\\lambda$.", 6, "Multiply the MGFs."), ["$e^{2(e^t - 1)}e^{4(e^t - 1)} = e^{6(e^t - 1)}$."]),
    ex(3, num("mgfx-ex-7", "$M_X(t) = e^{t + 2t^2}$ and $Y = 2X - 3$. Find $\\operatorname{Var}(Y)$.", 16, "$\\sigma_X^2 = 4$."), ["$\\operatorname{Var}(X) = 4$, so $\\operatorname{Var}(Y) = 4 \\times 4 = 16$."]),
    ex(3, num("mgfx-ex-8", "$M_X(t) = (1 - 2t)^{-1}$. Find $E[X^2]$.", 8, "$M''(0)$."), ["$M'' = 8(1 - 2t)^{-3}$, so $M''(0) = 8$."]),
    ex(3, num("mgfx-ex-9", "$M_X(t) = e^{3(e^t - 1)}$. Using $K(t) = \\ln M(t)$, find $K''(0)$.", 3, "$K(t) = 3(e^t - 1)$."), ["$K''(t) = 3e^t$, so $K''(0) = 3$: the variance."]),
    ex(3, mc("mgfx-ex-10", "The sum of 5 independent $\\mathrm{Exp}(2)$ variables has MGF", ["$\\left(\\dfrac{2}{2 - t}\\right)^5$", "Multiply five copies."], [["$\\dfrac{10}{2 - t}$", "That adds the MGFs."], ["$\\dfrac{2}{2 - 5t}$", "That is the MGF of $5X$, not of a sum of independent copies."]]), ["Independent sum: product of MGFs. This is a gamma distribution with shape 5 and rate 2."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(3, 6 + 4 * lv);
      const p = r.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
      const want = lv === 1 ? "mean" : r.pick(["mean", "variance"] as const);
      const v = want === "mean" ? nn * p : nn * p * (1 - p);
      return n(`$M_X(t) = (${r2(1 - p)} + ${p}e^t)^{${nn}}$. Find the ${want} of $X$${Number.isInteger(v * 100) ? "" : " (2 decimals)"}.`, r2(v), `It is $\\mathrm{Bin}(${nn}, ${p})$: ${want === "mean" ? `$np = ${r2(v)}$` : `$np(1 - p) = ${r2(v)}$`}.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const mu = r.int(-5, 8);
      const s2 = r.pick([1, 2, 4, 6, 9, 10, 16]);
      const a = lv === 3 ? r.pick([2, 3, -2]) : 1;
      const v = a * a * s2;
      const mgf = `e^{${mu}t + ${r2(s2 / 2)}t^2}`;
      return lv === 3
        ? n(`$M_X(t) = ${mgf}$ and $Y = ${a}X + 1$. Find $\\operatorname{Var}(Y)$.`, v, `$\\operatorname{Var}(X) = ${s2}$, so $\\operatorname{Var}(Y) = ${a * a} \\times ${s2} = ${v}$.`)
        : n(`$M_X(t) = ${mgf}$. Find $\\operatorname{Var}(X)$.`, s2, `Matching $e^{\\mu t + \\sigma^2t^2/2}$: $\\sigma^2 = 2 \\times ${r2(s2 / 2)} = ${s2}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(1, 5);
      const b = r.int(1, 5);
      return mcNumbers(
        `$X \\sim \\mathrm{Po}(${a})$ and $Y \\sim \\mathrm{Po}(${b})$ are independent. What is the MGF of $X + Y$?`,
        { text: `$e^{${a + b}(e^t - 1)}$`, why: "Multiply the MGFs: the exponents add." },
        [
          { text: `$e^{${a}(e^t - 1)} + e^{${b}(e^t - 1)}$`, why: "MGFs of independent variables multiply.", misconception: "mgf-add" },
          { text: `$e^{${a * b}(e^t - 1)}$`, why: "Multiplying exponentials adds their exponents." },
        ],
      );
    },
  },
];
