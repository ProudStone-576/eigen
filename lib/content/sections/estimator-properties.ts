import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Bias, variance, mean squared error, consistency, efficiency, identifiability. */

const base: ConceptNode = {
  id: "estimator-properties",
  title: "Properties of estimators",
  summary: "An estimator is judged by its bias, its variance and their combination, the mean squared error: MSE = bias² + variance. A good estimator is consistent, homing in on the truth as n grows; of two unbiased estimators, the one with smaller variance is more efficient.",
  deps: ["mle", "standard-error"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "estimator", meaning: "A rule for computing a guess at a parameter from a sample; its value on a particular sample is the estimate." },
    { term: "mean squared error", meaning: "$E[(\\hat\\theta - \\theta)^2]$: the average squared distance from the truth." },
    { term: "consistent", meaning: "Converging in probability to the true value as the sample grows." },
  ],
  misconceptions: {
    "unbiased-best": "Thinks an unbiased estimator is always better than a biased one.",
    "consistent-unbiased": "Confuses consistency (converging to the truth as n grows) with unbiasedness (being right on average at a fixed n).",
  },
  steps: [
    {
      type: "motivate",
      title: "Grading estimators",
      body: "Two pollsters estimate the same proportion by different rules. One is right on average but jumps around; the other is slightly off but steady. Which rule is better depends on how errors are scored, and statisticians usually score them by mean squared error.",
      realWorld: {
        title: "Navigation",
        body: "A phone combines a noisy but unbiased satellite fix with a smooth but slowly drifting motion estimate. The Kalman filter weights the two to minimise mean squared error, accepting a little bias for a lot less noise.",
      },
    },
    {
      type: "truth",
      statement: "For an estimator $\\hat\\theta$ of $\\theta$: **bias** $= E[\\hat\\theta] - \\theta$, **variance** $= \\operatorname{Var}(\\hat\\theta)$, and **mean squared error** $\\text{MSE} = E[(\\hat\\theta - \\theta)^2] = \\text{bias}^2 + \\text{variance}$. $\\hat\\theta_n$ is **consistent** if $P(|\\hat\\theta_n - \\theta| > \\varepsilon) \\to 0$ for every $\\varepsilon > 0$.",
      body: "If both the bias and the variance tend to 0 as $n$ grows, the estimator is consistent. Of two unbiased estimators the one with smaller variance is more **efficient**; their **relative efficiency** is the ratio of their variances.",
    },
    {
      type: "predict",
      misconception: "unbiased-best",
      item: {
        kind: "mc",
        id: "est-predict-1",
        prompt: "Estimator A is unbiased with variance 4. Estimator B has bias 1 and variance 1. Which has the smaller MSE?",
        options: [
          { id: "a", text: "B: MSE 2 against 4", correct: true, why: "$1^2 + 1$ against $0 + 4$." },
          { id: "b", text: "A, because it is unbiased", misconception: "unbiased-best", why: "Unbiasedness says nothing about how far off a single estimate typically is." },
          { id: "c", text: "They are equal", why: "Their MSEs are 2 and 4." },
        ],
      },
      reveal: {
        body: "A is centred on the truth but typically misses by about 2 in one direction or the other; B is centred 1 away but rarely strays much further. Squared error adds the two parts: $0 + 4$ for A, $1 + 1$ for B. Shrinkage estimators and ridge regression (§{regularization}) win in exactly this way.",
      },
      resolve: {
        kind: "mc",
        id: "est-resolve-1",
        prompt: "What does the MSE measure?",
        options: [
          { id: "a", text: "The average squared distance from the truth: bias² plus variance", correct: true, why: "Both systematic and random error count." },
          { id: "b", text: "Only the bias; unbiased estimators are best", misconception: "unbiased-best", why: "Variance is part of the error too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "est-check-1",
        prompt: "An estimator of $\\mu$ is $\\bar x + 1/n$. It is",
        options: [
          { id: "a", text: "biased at every $n$, but consistent", correct: true, why: "The bias $1/n$ and the variance $\\sigma^2/n$ both tend to 0." },
          { id: "b", text: "inconsistent, because it is biased", misconception: "consistent-unbiased", why: "A bias that shrinks to 0 doesn't stop consistency." },
          { id: "c", text: "unbiased", why: "Its expectation is $\\mu + 1/n$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "est-check-2",
        prompt: "Two unbiased estimators have variances 2 and 8. How many times as efficient is the first?",
        options: [
          { id: "a", text: "4", correct: true, why: "$8/2$: the second needs four times the data to match it." },
          { id: "b", text: "0.25", why: "That is the ratio the other way up." },
          { id: "c", text: "6", why: "Efficiency is a ratio, not a difference." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model's expected test error is an MSE, and the bias–variance decomposition (§{bias-variance}) is this same identity applied to predictions. Regularisation, early stopping and ensembling all trade a little bias for a larger cut in variance.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "est-produce-1", prompt: "An estimator has bias 2 and variance 5. Find its MSE.", answer: 9, explain: "$4 + 5$." },
        { kind: "number", id: "est-produce-2", prompt: "Find the MSE of $\\bar x$ from $n = 25$ observations with $\\sigma^2 = 100$.", answer: 4, explain: "Unbiased, variance $\\sigma^2/n$." },
        {
          kind: "mc",
          id: "est-produce-3",
          prompt: "Using the first observation $X_1$ alone to estimate $\\mu$ gives an estimator that is",
          options: [
            { id: "a", text: "unbiased but not consistent", correct: true, why: "Its variance stays $\\sigma^2$ however large $n$ is." },
            { id: "b", text: "consistent, because it is unbiased", misconception: "consistent-unbiased", why: "Unbiasedness alone doesn't make an estimator converge." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "est-review-1", prompt: "An unbiased estimator has standard deviation 3. Find its MSE.", answer: 9, explain: "MSE = variance when unbiased." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "asymptotic unbiasedness, identifiability",
      body: "$\\hat\\theta_n$ is **asymptotically unbiased** if its bias tends to 0. A parameter is **identifiable** if different values give different distributions of the data; otherwise no estimator can tell them apart, however much data there is. In $y = (a + b)x + \\varepsilon$, only $a + b$ is identifiable.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "MSE = bias² + variance",
      statement: "$E[(\\hat\\theta - \\theta)^2] = (E[\\hat\\theta] - \\theta)^2 + \\operatorname{Var}(\\hat\\theta)$.",
      proof: ["Write $\\hat\\theta - \\theta = (\\hat\\theta - E\\hat\\theta) + (E\\hat\\theta - \\theta)$. Squaring, the cross term has expectation 0 because $E[\\hat\\theta - E\\hat\\theta] = 0$, and the second part is a constant."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "a test for consistency",
      statement: "If $\\text{MSE}(\\hat\\theta_n) \\to 0$, in particular if both bias and variance tend to 0, then $\\hat\\theta_n$ is consistent.",
      proof: ["By Markov's inequality on $(\\hat\\theta_n - \\theta)^2$ (§{lln-inequalities}): $P(|\\hat\\theta_n - \\theta| \\ge \\varepsilon) \\le \\text{MSE}/\\varepsilon^2 \\to 0$."],
    },
    {
      type: "theorem",
      name: "dividing by n or by n − 1",
      statement: "$\\hat\\sigma^2 = \\tfrac1n\\sum(x_i - \\bar x)^2$ has $E[\\hat\\sigma^2] = \\tfrac{n - 1}{n}\\sigma^2$, so $s^2 = \\tfrac{1}{n - 1}\\sum(x_i - \\bar x)^2$ is unbiased. Both are consistent.",
      proof: [
        "$\\sum(x_i - \\bar x)^2 = \\sum(x_i - \\mu)^2 - n(\\bar x - \\mu)^2$.",
        "Its expectation is $n\\sigma^2 - n\\cdot\\tfrac{\\sigma^2}{n} = (n - 1)\\sigma^2$. Both biases and variances shrink to 0 as $n$ grows.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "estimating the top of a uniform",
      statement: "For $U(0, \\theta)$, $M = \\max X_i$ has $E[M] = \\tfrac{n}{n + 1}\\theta$. The unbiased $\\tfrac{n + 1}{n}M$ has variance $\\dfrac{\\theta^2}{n(n + 2)}$, far below the $\\dfrac{\\theta^2}{3n}$ of the method-of-moments estimate $2\\bar x$.",
      proof: ["$P(M \\le m) = (m/\\theta)^n$, so $M$ has density $nm^{n-1}/\\theta^n$; integrate to get its mean and variance. For $2\\bar x$, $\\operatorname{Var} = 4\\cdot\\tfrac{\\theta^2}{12n}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the MSE of $\\bar x$ as an estimator of $\\mu$.",
      solution: ["$\\bar x$ is unbiased, so MSE = variance.", "$\\operatorname{Var}(\\bar x) = \\sigma^2/n$."],
      result: "$\\sigma^2/n$.",
    },
    {
      type: "example",
      level: 2,
      title: "a biased variance",
      problem: "With $n = 10$ and $\\sigma^2 = 20$, find the expected value and bias of $\\hat\\sigma^2$ (dividing by $n$).",
      solution: ["$E[\\hat\\sigma^2] = \\tfrac{9}{10} \\times 20 = 18$.", "Bias $18 - 20 = -2$: it underestimates on average."],
      result: "18; bias $-2$.",
    },
    {
      type: "example",
      level: 3,
      title: "comparing estimators",
      problem: "For $U(0, \\theta)$ with $n = 10$, compare the variances of $2\\bar x$ and $\\tfrac{11}{10}\\max X_i$.",
      solution: ["$\\operatorname{Var}(2\\bar x) = \\theta^2/30$.", "$\\operatorname{Var}\\left(\\tfrac{11}{10}M\\right) = \\theta^2/120$: four times as efficient, and the gap grows with $n$."],
      result: "The maximum-based estimator is 4 times as efficient.",
    },
    {
      type: "example",
      level: 3,
      title: "deliberate shrinkage",
      problem: "Estimate $\\mu$ by $c\\bar x$ with $\\mu = 2$ and $\\sigma^2/n = 1$. Find the $c$ with the smallest MSE.",
      solution: ["MSE $= (c - 1)^2\\mu^2 + c^2\\sigma^2/n = 4(c - 1)^2 + c^2$.", "Setting the derivative $8(c - 1) + 2c$ to 0 gives $c = 0.8$, with MSE $0.16 + 0.64 = 0.8 < 1$."],
      result: "$c = 0.8$.",
    },
  ],
  pitfalls: [
    { wrong: "Unbiased is always better.", right: "Compare MSEs: a small bias can buy a large cut in variance." },
    { wrong: "A biased estimator can't be consistent.", right: "It can, if the bias shrinks to 0 as $n$ grows." },
    { wrong: "$s$ is unbiased for $\\sigma$ because $s^2$ is unbiased for $\\sigma^2$.", right: "Unbiasedness doesn't survive nonlinear transformations: $E[s] < \\sigma$." },
  ],
  formulas: [
    { label: "MSE", tex: "\\text{MSE} = \\text{bias}^2 + \\text{variance}" },
    { label: "Consistency check", tex: "P(|\\hat\\theta - \\theta| \\ge \\varepsilon) \\le \\text{MSE}/\\varepsilon^2" },
    { label: "Variance estimator", tex: "E\\left[\\tfrac1n\\textstyle\\sum(x_i - \\bar x)^2\\right] = \\tfrac{n - 1}{n}\\sigma^2" },
    { label: "Relative efficiency", tex: "\\operatorname{Var}(\\hat\\theta_2)/\\operatorname{Var}(\\hat\\theta_1)" },
  ],
  exercises: [
    ex(1, num("estx-ex-1", "$E[\\hat\\theta] = 12$ and $\\theta = 10$. Find the bias.", 2, "$E[\\hat\\theta] - \\theta$."), ["$2$."]),
    ex(1, num("estx-ex-2", "An estimator has bias 1 and variance 3. Find its MSE.", 4, "$1 + 3$."), ["$4$."]),
    ex(2, num("estx-ex-3", "With $n = 5$ and $\\sigma^2 = 10$, find $E[\\hat\\sigma^2]$, dividing by $n$.", 8, "$\\tfrac45 \\times 10$."), ["$8$."]),
    ex(2, num("estx-ex-4", "Unbiased estimators have variances 3 and 12. How many times as efficient is the first?", 4, "$12/3$."), ["$4$."]),
    ex(2, num("estx-ex-5", "Find the MSE of $\\bar x$ for $n = 16$ and $\\sigma = 8$.", 4, "$64/16$."), ["$4$."]),
    ex(3, num("estx-ex-6", "Estimate $\\mu$ by $c\\bar x$ with $\\mu = 3$ and $\\sigma^2/n = 1$. Find the MSE-minimising $c$.", 0.9, "$c = \\mu^2/(\\mu^2 + \\sigma^2/n)$."), ["$9/(9 + 1) = 0.9$."]),
    ex(3, num("estx-ex-7", "For $U(0, \\theta)$ with $n = 4$, $E[\\max X_i] = k\\theta$. Find $k$.", 0.8, "$n/(n + 1)$."), ["$4/5 = 0.8$."]),
    ex(3, num("estx-ex-8", "For $U(0, \\theta)$ with $n = 10$, find $\\operatorname{Var}(2\\bar x)/\\operatorname{Var}\\left(\\tfrac{11}{10}\\max X_i\\right)$.", 4, "$\\tfrac{\\theta^2/30}{\\theta^2/120}$."), ["$120/30 = 4$."]),
    ex(3, mc("estx-ex-9", "$s^2$ is unbiased for $\\sigma^2$. Then $s$ as an estimator of $\\sigma$ is", ["biased low", "$E[s] < \\sqrt{E[s^2]} = \\sigma$."], [["unbiased", "Square roots don't preserve expectations."], ["biased high", "The square root is concave, so it pulls the mean down."]]), ["By Jensen's inequality, $E[\\sqrt{s^2}] \\le \\sqrt{E[s^2]}$, with equality only if $s^2$ never varies."]),
    ex(3, mc("estx-ex-10", "In the model $y = (a + b)x + \\varepsilon$, more data", ["still can't separate $a$ from $b$", "Only their sum is identifiable."], [["eventually pins down $a$ and $b$", "Every pair with the same sum fits equally well."], ["identifies $a$ but not $b$", "They enter symmetrically."]]), ["Different $(a, b)$ with the same sum give the same distribution of the data."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const b = r.int(-3, 3);
      const v = r.int(1, 5 * lv + 5);
      return n(`An estimator has bias ${b} and variance ${v}. Find its MSE.`, b * b + v, `$(${b})^2 + ${v} = ${b * b + v}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(3, 6 + 6 * lv);
      const s2 = r.int(2, 30);
      const e = ((nn - 1) / nn) * s2;
      return n(`With $n = ${nn}$ and $\\sigma^2 = ${s2}$, find $E[\\hat\\sigma^2]$ where $\\hat\\sigma^2$ divides by $n$ (2 decimals).`, r2(e), `$\\tfrac{${nn - 1}}{${nn}} \\times ${s2} \\approx ${r2(e)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r, lv) => {
      const va = r.int(3, 9 + lv);
      const bb = r.int(1, 2);
      const vb = r.int(1, va - 1);
      const ma = va;
      const mb = bb * bb + vb;
      if (ma === mb) return n(`Estimator A is unbiased with variance ${va}. Estimator B has bias ${bb} and variance ${vb}. Find B's MSE.`, mb, `$${bb}^2 + ${vb} = ${mb}$.`);
      return mcNumbers(
        `Estimator A is unbiased with variance ${va}. Estimator B has bias ${bb} and variance ${vb}. Which has the smaller MSE?`,
        { text: ma < mb ? "A" : "B", why: `MSEs: A ${ma}, B ${bb * bb} + ${vb} = ${mb}.` },
        [{ text: ma < mb ? "B" : "A", why: `Compare bias² + variance: ${ma} against ${mb}.`, ...(ma > mb ? { misconception: "unbiased-best" } : {}) }],
      );
    },
  },
];
