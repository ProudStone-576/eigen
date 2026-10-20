import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Score, Fisher information, the Cramér–Rao bound, efficiency, asymptotic normality of the MLE. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "fisher-information",
  title: "Fisher information & the Cramér–Rao bound",
  summary: "Fisher information measures how sharply the log-likelihood curves around the truth: the more curvature, the more the data pin the parameter down. No unbiased estimator can have variance below 1/(nI(θ)), and for large n the MLE reaches that bound, with SE ≈ 1/√(nI(θ̂)).",
  deps: ["mle", "estimator-properties"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "score", meaning: "The derivative of the log-likelihood with respect to the parameter." },
    { term: "Fisher information", meaning: "The variance of the score, or minus the expected curvature of the log-likelihood." },
    { term: "efficient", meaning: "An unbiased estimator whose variance equals the Cramér–Rao bound." },
  ],
  misconceptions: {
    "flat-likelihood-precise": "Thinks a flat, wide log-likelihood curve means a precise or robust estimate.",
    "crlb-any-estimator": "Thinks the Cramér–Rao bound limits every estimator, including biased ones.",
  },
  steps: [
    {
      type: "motivate",
      title: "How much do the data say?",
      body: "Seven heads in ten tosses and 700 in 1,000 both suggest $p \\approx 0.7$, but the second pins $p$ down far more tightly. Fisher information turns \"how tightly\" into a number, and gives the smallest standard error any unbiased method can achieve.",
      realWorld: {
        title: "Optimal designs",
        body: "Engineers choose where to take measurements, such as which drug doses to test, to maximise the Fisher information about the parameters that matter. That is what an \"optimal design\" of an experiment means.",
      },
    },
    {
      type: "explore",
      title: "How sharp is the peak?",
      body: "The likelihood of $p$ after a run of coin tosses.",
      widget: { kind: "likelihood", heads: 7, flips: 10 },
      task: "Find the peak, then notice how wide the curve is around it. With ten times as many tosses at the same proportion, the curve would be about $\\sqrt{10} \\approx 3.2$ times narrower.",
    },
    {
      type: "truth",
      statement: "The **score** is $U(\\theta) = \\dfrac{\\partial}{\\partial\\theta}\\ln f(X; \\theta)$; at the true $\\theta$ its mean is 0. The **Fisher information** in one observation is $I(\\theta) = \\operatorname{Var}(U) = -E\\!\\left[\\dfrac{\\partial^2}{\\partial\\theta^2}\\ln f(X; \\theta)\\right]$; $n$ independent observations carry $nI(\\theta)$. **Cramér–Rao**: every unbiased $\\hat\\theta$ has $\\operatorname{Var}(\\hat\\theta) \\ge \\dfrac{1}{nI(\\theta)}$.",
      body: "For large $n$ the MLE is approximately $N\\!\\left(\\theta, \\tfrac{1}{nI(\\theta)}\\right)$: unbiased and efficient in the limit. So $\\text{SE}(\\hat\\theta) \\approx 1/\\sqrt{nI(\\hat\\theta)}$, or $1/\\sqrt{-\\ell''(\\hat\\theta)}$ using the observed curvature of the log-likelihood $\\ell$.",
    },
    {
      type: "predict",
      misconception: "flat-likelihood-precise",
      item: {
        kind: "mc",
        id: "fis-predict-1",
        prompt: "Two studies give log-likelihood curves for $p$ peaking at the same value. One is sharply peaked; the other is wide and flat. Which estimate is more precise?",
        options: [
          { id: "a", text: "The sharp one: high curvature means high information and a small SE", correct: true, why: "$\\text{SE} \\approx 1/\\sqrt{-\\ell''}$." },
          { id: "b", text: "The flat one: many values fit almost equally well, so it is robust", misconception: "flat-likelihood-precise", why: "Many values fitting equally well means the data can't tell them apart." },
          { id: "c", text: "Equal: the peaks are in the same place", why: "Location and precision are different things." },
        ],
      },
      reveal: {
        body: "A flat curve means a wide range of $p$ explains the data nearly as well as the peak does: the estimate is uncertain. The curvature $-\\ell''(\\hat p)$ is the observed information, and its reciprocal square root is the SE. Seven heads in ten gives SE $\\approx \\sqrt{0.21/10} \\approx 0.145$; 700 in 1,000 gives about 0.0145.",
      },
      resolve: {
        kind: "mc",
        id: "fis-resolve-1",
        prompt: "What does a sharply curved log-likelihood tell you?",
        options: [
          { id: "a", text: "The data pin the parameter down tightly", correct: true, why: "Large information, small standard error." },
          { id: "b", text: "The estimate is fragile and imprecise", misconception: "flat-likelihood-precise", why: "It is the flat curve that signals imprecision." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fis-check-1",
        prompt: "An estimator's variance is below the Cramér–Rao bound. This is",
        options: [
          { id: "a", text: "possible only if the estimator is biased", correct: true, why: "The bound applies to unbiased estimators." },
          { id: "b", text: "impossible for any estimator", misconception: "crlb-any-estimator", why: "A biased estimator such as the constant 0.5 has variance 0." },
          { id: "c", text: "always a calculation error", why: "Shrinkage estimators routinely do it." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fis-check-2",
        prompt: "Find the Fisher information in one Bernoulli($p$) observation at $p = 0.5$.",
        options: [
          { id: "a", text: "4", correct: true, why: "$1/(p(1 - p)) = 1/0.25$." },
          { id: "b", text: "0.25", why: "That is $p(1 - p)$, its reciprocal." },
          { id: "c", text: "2", why: "Use $I(p) = 1/(p(1 - p))$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Natural-gradient methods precondition gradient descent with the Fisher information matrix. Elastic weight consolidation uses it to stop a network forgetting an old task: weights carrying high information about the old task are held near their old values while it learns a new one.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "fis-produce-1", prompt: "For Po($\\lambda$), $I(\\lambda) = 1/\\lambda$. Find the Cramér–Rao bound for $n = 50$ and $\\lambda = 4$.", answer: 0.08, explain: "$\\lambda/n = 4/50$." },
        { kind: "number", id: "fis-produce-2", prompt: "$\\hat p = 0.2$ from $n = 100$ Bernoulli trials. Find the SE from the information, $1/\\sqrt{nI(\\hat p)}$.", answer: 0.04, explain: "$\\sqrt{0.16/100}$." },
        {
          kind: "mc",
          id: "fis-produce-3",
          prompt: "The Cramér–Rao bound applies to",
          options: [
            { id: "a", text: "unbiased estimators", correct: true, why: "Biased ones can go below it." },
            { id: "b", text: "every estimator", misconception: "crlb-any-estimator", why: "A constant has variance 0." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "fis-review-1", prompt: "Each observation carries information 2. How much do 30 independent observations carry?", answer: 60, explain: "Information adds: $nI$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "observed information, efficiency",
      body: "The **observed information** is $J(\\hat\\theta) = -\\ell''(\\hat\\theta)$, the curvature of the actual log-likelihood at its peak. The **efficiency** of an unbiased estimator is $\\dfrac{1/(nI(\\theta))}{\\operatorname{Var}(\\hat\\theta)} \\le 1$. An unbiased estimator with the smallest possible variance for every $\\theta$ is a **minimum variance unbiased estimator** (MVUE).",
    },
    {
      type: "definition",
      term: "several parameters",
      body: "With parameters $\\theta_1, \\dots, \\theta_p$, the **information matrix** has entries $I_{jk} = -E\\!\\left[\\tfrac{\\partial^2\\ell}{\\partial\\theta_j\\partial\\theta_k}\\right]$, and the MLE's approximate covariance is its inverse divided by $n$. The **profile likelihood** for one parameter maximises over the others at each of its values.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the score has mean zero",
      statement: "$E[U(\\theta)] = 0$, and $\\operatorname{Var}(U) = -E[\\ell'']$, so both formulas give the same $I(\\theta)$.",
      proof: [
        "$E[U] = \\int \\dfrac{f'}{f}f\\,dx = \\int f'\\,dx = \\dfrac{d}{d\\theta}\\int f\\,dx = \\dfrac{d}{d\\theta}1 = 0$.",
        "Differentiating $\\int \\ell' f\\,dx = 0$ once more gives $\\int \\ell'' f\\,dx + \\int (\\ell')^2 f\\,dx = 0$.",
      ],
    },
    {
      type: "theorem",
      name: "Cramér–Rao lower bound",
      statement: "If $\\hat\\theta$ is unbiased for $\\theta$, then $\\operatorname{Var}(\\hat\\theta) \\ge \\dfrac{1}{nI(\\theta)}$.",
      proof: [
        "Let $U$ be the score of the whole sample, with variance $nI(\\theta)$. Differentiating $E[\\hat\\theta] = \\theta$ gives $\\operatorname{Cov}(\\hat\\theta, U) = 1$.",
        "By the bound $|\\rho| \\le 1$ (§{covariance}), $1 = \\operatorname{Cov}^2 \\le \\operatorname{Var}(\\hat\\theta)\\operatorname{Var}(U)$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "standard examples",
      statement: "Bernoulli: $I(p) = \\dfrac{1}{p(1 - p)}$. Poisson: $I(\\lambda) = \\dfrac1\\lambda$. Normal mean with known $\\sigma$: $I(\\mu) = \\dfrac{1}{\\sigma^2}$. Exponential rate: $I(\\lambda) = \\dfrac{1}{\\lambda^2}$. In the first three, the MLE ($\\hat p$, $\\bar x$, $\\bar x$) attains the bound exactly.",
      proof: ["Bernoulli: $\\ell = x\\ln p + (1 - x)\\ln(1 - p)$, so $-\\ell'' = \\tfrac{x}{p^2} + \\tfrac{1 - x}{(1 - p)^2}$, with expectation $\\tfrac1p + \\tfrac{1}{1 - p}$. The others are similar."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "Wald interval",
      statement: "For large $n$, $\\hat\\theta_{\\text{MLE}} \\pm 1.96/\\sqrt{nI(\\hat\\theta)}$ is an approximate 95% confidence interval.",
      proof: ["It uses the asymptotic normality of the MLE, $\\hat\\theta \\approx N(\\theta, 1/(nI(\\theta)))$, with $\\theta$ replaced by $\\hat\\theta$ in the information."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Show that $\\hat p$ attains the Cramér–Rao bound for Bernoulli data.",
      solution: ["$nI(p) = \\dfrac{n}{p(1 - p)}$, so the bound is $\\dfrac{p(1 - p)}{n}$.", "$\\operatorname{Var}(\\hat p) = \\dfrac{p(1 - p)}{n}$: equal, so $\\hat p$ is efficient."],
      result: "Variance equals the bound.",
    },
    {
      type: "example",
      level: 2,
      title: "a normal mean",
      problem: "$\\sigma = 6$ is known and $n = 36$. Find the smallest possible variance of an unbiased estimator of $\\mu$.",
      solution: ["$I(\\mu) = 1/36$ per observation; $nI = 1$.", "Bound $1/1 = 1$, attained by $\\bar x$ since $\\sigma^2/n = 1$."],
      result: "1.",
    },
    {
      type: "example",
      level: 3,
      title: "an exponential rate",
      problem: "25 waiting times average $\\bar x = 2$ minutes. Find the MLE of the rate, its approximate SE and a 95% Wald interval.",
      solution: [
        "$\\hat\\lambda = 1/\\bar x = 0.5$. With $I(\\lambda) = 1/\\lambda^2$, $\\text{SE} \\approx \\hat\\lambda/\\sqrt n = 0.5/5 = 0.1$.",
        "$0.5 \\pm 1.96 \\times 0.1 = (0.304, 0.696)$ per minute.",
      ],
      result: "$0.5$, SE 0.1, interval about $(0.30, 0.70)$.",
    },
  ],
  pitfalls: [
    { wrong: "A flat likelihood means a solid estimate.", right: "It means the data barely distinguish parameter values: low information, large SE." },
    { wrong: "No estimator can beat the Cramér–Rao bound.", right: "Only unbiased ones are bound by it." },
    { wrong: "Information is a fixed number for a model.", right: "It usually depends on $\\theta$; evaluate it at $\\hat\\theta$." },
  ],
  formulas: [
    { label: "Information", tex: "I(\\theta) = -E\\!\\left[\\tfrac{\\partial^2}{\\partial\\theta^2}\\ln f(X; \\theta)\\right]" },
    { label: "Cramér–Rao", tex: "\\operatorname{Var}(\\hat\\theta) \\ge \\dfrac{1}{nI(\\theta)}" },
    { label: "MLE SE", tex: "\\text{SE} \\approx 1/\\sqrt{nI(\\hat\\theta)}" },
    { label: "Bernoulli, Poisson", tex: "I(p) = \\tfrac{1}{p(1 - p)},\\quad I(\\lambda) = \\tfrac1\\lambda" },
  ],
  exercises: [
    ex(1, num("fisx-ex-1", "Find the Fisher information about $\\mu$ in one $N(\\mu, 4)$ observation.", 0.25, "$1/\\sigma^2$."), ["$1/4$."]),
    ex(1, num("fisx-ex-2", "20 independent observations each carry information 0.25. Find the total.", 5, "$nI$."), ["$5$."]),
    ex(2, num("fisx-ex-3", "$\\sigma^2 = 9$ and $n = 36$. Find the Cramér–Rao bound for unbiased estimators of $\\mu$.", 0.25, "$\\sigma^2/n$."), ["$9/36 = 0.25$."]),
    ex(2, num("fisx-ex-4", "Find the Fisher information in one Bernoulli observation at $p = 0.2$.", 6.25, "$1/(0.2 \\times 0.8)$."), ["$1/0.16 = 6.25$."]),
    ex(2, num("fisx-ex-5", "Find the Cramér–Rao bound for $p = 0.2$ and $n = 100$.", 0.0016, "$p(1 - p)/n$."), ["$0.16/100 = 0.0016$."]),
    ex(2, num("fisx-ex-6", "100 exponential waits average $\\bar x = 4$. Find the approximate SE of $\\hat\\lambda = 1/\\bar x$.", 0.025, "$\\hat\\lambda/\\sqrt n$."), ["$\\hat\\lambda = 0.25$, SE $= 0.25/10 = 0.025$."]),
    ex(3, dp("fisx-ex-7", "Same data. Find the upper end of the 95% Wald interval for $\\lambda$.", 0.25 + 1.96 * 0.025, "$\\hat\\lambda + 1.96\\,\\text{SE}$."), ["$0.25 + 0.049 = 0.299$."]),
    ex(3, num("fisx-ex-8", "An unbiased estimator has variance 0.5 and the Cramér–Rao bound is 0.4. Find its efficiency.", 0.8, "Bound / variance."), ["$0.4/0.5 = 0.8$."]),
    ex(3, dp("fisx-ex-9", "7 heads in 10 tosses. Find the observed information $-\\ell''(\\hat p)$ at $\\hat p = 0.7$.", 10 / 0.21, "$n/(\\hat p(1 - \\hat p))$."), ["$-\\ell''(p) = \\tfrac{7}{p^2} + \\tfrac{3}{(1 - p)^2}$, which at $0.7$ is $\\tfrac{10}{0.21} \\approx 47.619$."]),
    ex(3, mc("fisx-ex-10", "The estimator \"always say $\\hat p = 0.5$\" has variance 0, below the Cramér–Rao bound. Why is this allowed?", ["It is biased whenever $p \\neq 0.5$", "The bound is for unbiased estimators."], [["The bound is wrong for coins", "It holds; it just doesn't apply."], ["Its variance is not really 0", "A constant has variance 0."]]), ["It never varies, but it is wrong by $0.5 - p$ on average."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const kind = r.pick(lv === 1 ? (["normal", "poisson"] as const) : (["normal", "poisson", "bernoulli"] as const));
      const nn = r.pick([20, 25, 40, 50, 100]);
      if (kind === "normal") {
        const s2 = r.pick([4, 9, 16, 25]);
        return n(`$\\sigma^2 = ${s2}$ is known and $n = ${nn}$. Find the Cramér–Rao bound for unbiased estimators of $\\mu$ (4 decimals).`, Math.round((s2 / nn) * 10000) / 10000, `$I(\\mu) = 1/\\sigma^2$, so the bound is $\\sigma^2/n = ${s2}/${nn}$.`, 0.0001);
      }
      if (kind === "poisson") {
        const l = r.pick([1, 2, 3, 4, 5]);
        return n(`Poisson data with $\\lambda = ${l}$ and $n = ${nn}$. Find the Cramér–Rao bound (4 decimals).`, Math.round((l / nn) * 10000) / 10000, `$I(\\lambda) = 1/\\lambda$, so the bound is $\\lambda/n = ${l}/${nn}$.`, 0.0001);
      }
      const p = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const b = (p * (1 - p)) / nn;
      return n(`Bernoulli data with $p = ${p}$ and $n = ${nn}$. Find the Cramér–Rao bound (4 decimals).`, Math.round(b * 10000) / 10000, `$I(p) = 1/(p(1 - p))$, so the bound is $p(1 - p)/n = ${r2(p * (1 - p))}/${nn}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.pick([25, 36, 49, 64, 100]);
      const xbar = r.pick([0.5, 1, 2, 4, 5]);
      const l = 1 / xbar;
      const se = l / Math.sqrt(nn);
      const upper = lv === 3;
      const v = upper ? l + 1.96 * se : se;
      return n(`${nn} exponential waiting times average ${xbar}. Find the ${upper ? "upper end of the 95% Wald interval for" : "approximate SE of"} $\\hat\\lambda = 1/\\bar x$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\hat\\lambda = ${r2(l)}$, SE $= \\hat\\lambda/\\sqrt n = ${Math.round(se * 10000) / 10000}$${upper ? `, so $${r2(l)} + 1.96 \\times ${Math.round(se * 10000) / 10000}$` : ""}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([3, 5, 10, 20]);
      return mcNumbers(
        `Study B uses ${k * k} times as many observations as study A, with the same model. How do the widths of their likelihood curves compare?`,
        { text: `B's is about ${k} times narrower`, why: `Information grows like $n$, so the SE shrinks like $1/\\sqrt n$: a factor of $\\sqrt{${k * k}} = ${k}$.` },
        [
          { text: `B's is about ${k * k} times narrower`, why: "Width follows the SE, which scales with $1/\\sqrt n$." },
          { text: "B's is wider, so B is more robust", why: "More data sharpens the curve; a wide curve means less certainty.", misconception: "flat-likelihood-precise" },
        ],
      );
    },
  },
];
