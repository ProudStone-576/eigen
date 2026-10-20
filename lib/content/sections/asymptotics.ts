import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Measure-theoretic foundations; modes of convergence; asymptotic normality of estimators; the continuous mapping theorem, Slutsky's theorem and the delta method. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "asymptotics",
  title: "Asymptotics & the delta method",
  summary: "Exact sampling distributions are rare, so statistics leans on what happens as the sample grows. Estimators converge to their targets, and suitably scaled their errors become normal. Three tools carry these results through calculations: the continuous mapping theorem, Slutsky's theorem and the delta method, which gives the standard error of any smooth function of an estimator.",
  deps: ["clt", "lln-inequalities", "fisher-information"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "convergence in probability", meaning: "$X_n \\xrightarrow{p} X$: $P(\\lvert X_n - X\\rvert > \\varepsilon) \\to 0$ for every $\\varepsilon > 0$." },
    { term: "convergence in distribution", meaning: "$X_n \\xrightarrow{d} X$: the CDFs converge, $F_n(x) \\to F(x)$, at every continuity point of $F$." },
    { term: "asymptotically normal", meaning: "$\\sqrt n(\\hat\\theta_n - \\theta) \\xrightarrow{d} N(0, \\sigma^2)$ for some asymptotic variance $\\sigma^2$." },
  ],
  misconceptions: {
    "dist-means-close": "Thinks convergence in distribution means the random variables themselves get close to the limit variable.",
    "transform-same-se": "Assumes a function of an estimator has the same standard error as the estimator, ignoring the function's slope.",
  },
  steps: [
    {
      type: "motivate",
      title: "The error bar of a ratio",
      body: "You estimate a mean as 2.0 with standard error 0.1, but the quantity you actually need is its square, or its logarithm, or the ratio of two means. What is the standard error of that? Asymptotic theory answers such questions for almost any estimator, and is the reason \"estimate ± 1.96 SE\" works far beyond the textbook cases.",
      realWorld: {
        title: "Odds ratios and risk ratios",
        body: "Confidence intervals for odds and risk ratios in medical papers are computed on the log scale with delta-method standard errors, then exponentiated. That is why such intervals are asymmetric around the estimate.",
      },
    },
    {
      type: "truth",
      statement: "**Continuous mapping**: if $X_n \\to X$ (in probability or distribution) and $g$ is continuous, then $g(X_n) \\to g(X)$ in the same sense. **Slutsky**: if $X_n \\xrightarrow{d} X$ and $Y_n \\xrightarrow{p} c$, then $X_n + Y_n \\xrightarrow{d} X + c$ and $X_nY_n \\xrightarrow{d} cX$. **Delta method**: if $\\sqrt n(\\hat\\theta - \\theta) \\xrightarrow{d} N(0, \\sigma^2)$ and $g'(\\theta) \\ne 0$, then $\\sqrt n(g(\\hat\\theta) - g(\\theta)) \\xrightarrow{d} N(0, g'(\\theta)^2\\sigma^2)$, so $\\text{SE}(g(\\hat\\theta)) \\approx \\lvert g'(\\hat\\theta)\\rvert\\,\\text{SE}(\\hat\\theta)$.",
      body: "Almost-sure convergence implies convergence in probability, which implies convergence in distribution; the reverse implications fail in general. Under regularity conditions the MLE is asymptotically normal with variance $1/I(\\theta)$ per observation (§{fisher-information}). Slutsky is why replacing $\\sigma$ by $s$ in a z-statistic leaves its limit $N(0, 1)$ unchanged. These results rest on **measure-theoretic probability**: a probability space $(\\Omega, \\mathcal F, P)$, with random variables as measurable functions on $\\Omega$, which makes \"$X_n(\\omega) \\to X(\\omega)$ for almost every $\\omega$\" precise.",
    },
    {
      type: "predict",
      misconception: "transform-same-se",
      item: {
        kind: "mc",
        id: "asy-predict-1",
        prompt: "$\\hat\\mu = 2.0$ with standard error 0.1. The standard error of $\\hat\\mu^2$ is about",
        options: [
          { id: "a", text: "0.4", correct: true, why: "$\\lvert g'(\\mu)\\rvert\\,\\text{SE} = 2 \\times 2 \\times 0.1$." },
          { id: "b", text: "0.1, the same as $\\hat\\mu$", misconception: "transform-same-se", why: "Squaring stretches errors by the slope $2\\mu$." },
          { id: "c", text: "0.01", why: "That squares the SE instead." },
        ],
      },
      reveal: {
        body: "Near $\\mu = 2$, $g(x) = x^2$ behaves like a line with slope $g'(2) = 4$: a 0.1 wobble in $\\hat\\mu$ becomes about a 0.4 wobble in $\\hat\\mu^2$. That linearisation is the delta method. A function that is flat near $\\theta$ shrinks errors; a steep one magnifies them.",
      },
      resolve: {
        kind: "mc",
        id: "asy-resolve-1",
        prompt: "The delta-method SE of $g(\\hat\\theta)$ is",
        options: [
          { id: "a", text: "$\\lvert g'(\\hat\\theta)\\rvert$ times the SE of $\\hat\\theta$", correct: true, why: "Errors scale with the local slope." },
          { id: "b", text: "the SE of $\\hat\\theta$", misconception: "transform-same-se", why: "That ignores how $g$ stretches." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "asy-check-1",
        prompt: "$X_n \\sim N(0, 1)$ independently for every $n$, and $Z \\sim N(0, 1)$. Then $X_n \\xrightarrow{d} Z$. Does $X_n - Z$ shrink to 0?",
        options: [
          { id: "a", text: "No: convergence in distribution only says the distributions match", correct: true, why: "$X_n - Z$ is $N(0, 2)$ for every $n$." },
          { id: "b", text: "Yes, converging in distribution means getting close", misconception: "dist-means-close", why: "That would be convergence in probability." },
          { id: "c", text: "Yes, by the law of large numbers", why: "Nothing is being averaged." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "asy-check-2",
        prompt: "Why is $\\dfrac{\\bar X - \\mu}{S/\\sqrt n}$ approximately $N(0, 1)$ for large $n$, even for non-normal data?",
        options: [
          { id: "a", text: "The CLT handles $\\sqrt n(\\bar X - \\mu)/\\sigma$, and $S \\xrightarrow{p} \\sigma$, so Slutsky applies", correct: true, why: "Replacing $\\sigma$ by a consistent $S$ doesn't change the limit." },
          { id: "b", text: "Because the data are normal", why: "They needn't be." },
          { id: "c", text: "Because $S = \\sigma$ exactly", why: "Only in the limit." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Delta-method and Slutsky arguments give standard errors for derived metrics: the ratio of two click-through rates in an A/B test, a relative lift, or an F1 score. Many experimentation platforms compute ratio-metric variances exactly this way.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "asy-produce-1", prompt: "$\\hat\\theta = 5$ with SE 0.5. Find the delta-method SE of $\\ln\\hat\\theta$.", answer: 0.1, explain: "$0.5/5$." },
        { kind: "number", id: "asy-produce-2", prompt: "$\\hat p = 0.2$ from $n = 100$ Bernoulli trials. Find the delta-method SE of the log-odds $\\ln\\tfrac{\\hat p}{1 - \\hat p}$.", answer: 0.25, explain: "$1/\\sqrt{np(1 - p)} = 1/4$." },
        {
          kind: "mc",
          id: "asy-produce-3",
          prompt: "An estimate is 10 with SE 1. The SE of its square root is about",
          options: [
            { id: "a", text: "0.158", correct: true, why: "$\\tfrac{1}{2\\sqrt{10}} \\times 1$." },
            { id: "b", text: "1, unchanged", misconception: "transform-same-se", why: "The square root compresses errors near 10." },
          ],
        },
        {
          kind: "mc",
          id: "asy-produce-4",
          prompt: "$X_n \\xrightarrow{d} N(0, 1)$. This guarantees",
          options: [
            { id: "a", text: "probabilities like $P(X_n \\le 1.96)$ approach $\\Phi(1.96)$", correct: true, why: "It is a statement about distributions." },
            { id: "b", text: "$X_n$ gets close to some fixed standard normal variable", misconception: "dist-means-close", why: "No coupling to a particular variable is implied." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "asy-review-1", prompt: "$\\hat\\mu = 3$ with SE 0.2. Find the delta-method SE of $\\hat\\mu^2$.", answer: 1.2, explain: "$2 \\times 3 \\times 0.2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "modes of convergence",
      body: "**Almost surely**: $P(\\lim X_n = X) = 1$. **In probability**: $P(\\lvert X_n - X\\rvert > \\varepsilon) \\to 0$. **In $L^2$**: $E[(X_n - X)^2] \\to 0$. **In distribution**: $F_{X_n}(x) \\to F_X(x)$ at continuity points. Almost sure and $L^2$ each imply in probability, which implies in distribution; convergence in distribution to a constant implies convergence in probability to it.",
    },
    {
      type: "definition",
      term: "the multivariate delta method",
      body: "If $\\sqrt n(\\hat{\\vec\\theta} - \\vec\\theta) \\xrightarrow{d} N(\\vec 0, \\Sigma)$ and $g$ is differentiable with gradient $\\nabla g$, then $\\operatorname{Var}(g(\\hat{\\vec\\theta})) \\approx \\tfrac1n\\nabla g^{\\mathsf T}\\Sigma\\nabla g$. For a ratio $\\hat\\mu_1/\\hat\\mu_2$ of independent means, $\\operatorname{Var} \\approx \\dfrac{1}{\\mu_2^2}\\operatorname{Var}(\\hat\\mu_1) + \\dfrac{\\mu_1^2}{\\mu_2^4}\\operatorname{Var}(\\hat\\mu_2)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the delta method",
      statement: "If $\\sqrt n(\\hat\\theta - \\theta) \\xrightarrow{d} N(0, \\sigma^2)$ and $g$ is differentiable at $\\theta$, then $\\sqrt n(g(\\hat\\theta) - g(\\theta)) \\xrightarrow{d} N(0, g'(\\theta)^2\\sigma^2)$.",
      proof: [
        "Taylor: $g(\\hat\\theta) = g(\\theta) + g'(\\tilde\\theta)(\\hat\\theta - \\theta)$ for some $\\tilde\\theta$ between them.",
        "$\\hat\\theta \\xrightarrow{p} \\theta$, so $g'(\\tilde\\theta) \\xrightarrow{p} g'(\\theta)$ by continuous mapping; Slutsky finishes it.",
      ],
    },
    {
      type: "theorem",
      name: "asymptotic normality of the MLE",
      statement: "Under regularity conditions (identifiable model, support not depending on $\\theta$, smooth log-likelihood), $\\sqrt n(\\hat\\theta_{\\text{MLE}} - \\theta) \\xrightarrow{d} N(0, 1/I(\\theta))$, where $I$ is the Fisher information per observation.",
      proof: ["Expand the score around $\\theta$: $0 = U(\\hat\\theta) \\approx U(\\theta) - nI(\\theta)(\\hat\\theta - \\theta)$. The CLT makes $U(\\theta)/\\sqrt n \\to N(0, I(\\theta))$; divide through (§{clt})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "variance-stabilising transformations",
      statement: "If $\\operatorname{Var}(\\hat\\theta) \\approx v(\\theta)/n$, choosing $g$ with $g'(\\theta) \\propto 1/\\sqrt{v(\\theta)}$ makes $\\operatorname{Var}(g(\\hat\\theta))$ roughly constant: $\\sqrt{x}$ for Poisson counts, $\\arcsin\\sqrt p$ for proportions, Fisher's $\\tanh^{-1}r$ for correlations.",
      proof: ["By the delta method, $\\operatorname{Var}(g(\\hat\\theta)) \\approx g'(\\theta)^2v(\\theta)/n$, constant for that choice."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$\\hat\\theta = 5$ with SE 0.5. Find a 95% CI for $\\ln\\theta$, then for $\\theta$ by exponentiating.",
      solution: ["SE of $\\ln\\hat\\theta \\approx 0.5/5 = 0.1$; CI $\\ln 5 \\pm 0.196 = [1.413, 1.805]$.", "Exponentiate: $[4.11, 6.08]$, asymmetric around 5."],
      result: "$[4.11, 6.08]$.",
    },
    {
      type: "example",
      level: 2,
      title: "log-odds",
      problem: "$\\hat p = 0.2$ from 100 trials. Find the SE of the log-odds.",
      solution: ["$g(p) = \\ln\\tfrac{p}{1 - p}$, $g'(p) = \\tfrac{1}{p(1 - p)}$; SE$(\\hat p) = \\sqrt{p(1 - p)/n}$.", "SE $= \\dfrac{1}{p(1 - p)}\\sqrt{\\dfrac{p(1 - p)}{n}} = \\dfrac{1}{\\sqrt{np(1 - p)}} = \\dfrac{1}{4} = 0.25$."],
      result: "0.25.",
    },
    {
      type: "example",
      level: 3,
      title: "a ratio of means",
      problem: "Independent estimates $\\hat\\mu_1 = 6$ (SE 0.3) and $\\hat\\mu_2 = 3$ (SE 0.2). Find the SE of $\\hat\\mu_1/\\hat\\mu_2$.",
      solution: ["Var $\\approx \\tfrac{1}{9}(0.09) + \\tfrac{36}{81}(0.04) = 0.01 + 0.01778 = 0.02778$.", "SE $\\approx 0.167$ for the ratio estimate 2."],
      result: "About 0.167.",
    },
  ],
  pitfalls: [
    { wrong: "Use the same SE after transforming an estimate.", right: "Multiply by $\\lvert g'(\\hat\\theta)\\rvert$." },
    { wrong: "Convergence in distribution means the variables get close.", right: "Only their distributions do." },
    { wrong: "Apply the delta method where $g'(\\theta) = 0$.", right: "The first-order term vanishes; a second-order expansion is needed." },
  ],
  formulas: [
    { label: "Delta method", tex: "\\text{SE}(g(\\hat\\theta)) \\approx \\lvert g'(\\hat\\theta)\\rvert\\,\\text{SE}(\\hat\\theta)" },
    { label: "Slutsky", tex: "X_n \\xrightarrow{d} X,\\ Y_n \\xrightarrow{p} c \\Rightarrow X_nY_n \\xrightarrow{d} cX" },
    { label: "MLE", tex: "\\sqrt n(\\hat\\theta - \\theta) \\xrightarrow{d} N(0, 1/I(\\theta))" },
    { label: "Log-odds SE", tex: "1/\\sqrt{np(1 - p)}" },
  ],
  exercises: [
    ex(1, num("asyx-ex-1", "$\\hat\\theta = 4$ with SE 0.2. Find the delta-method SE of $\\ln\\hat\\theta$.", 0.05, "$0.2/4$."), ["$0.05$."]),
    ex(1, num("asyx-ex-2", "$\\hat\\theta = 2$ with SE 0.3. Find the delta-method SE of $3\\hat\\theta + 7$.", 0.9, "Slope 3."), ["$0.9$: linear functions are exact."]),
    ex(2, dp("asyx-ex-3", "$\\hat\\lambda = 9$ with SE 0.6. Find the delta-method SE of $\\sqrt{\\hat\\lambda}$.", 0.6 / (2 * 3), "$\\tfrac{1}{2\\sqrt\\lambda}$."), ["$0.6/6 = 0.1$."]),
    ex(2, dp("asyx-ex-4", "$\\hat p = 0.5$ from 400 trials. Find the SE of the log-odds.", 1 / Math.sqrt(400 * 0.25), "$1/\\sqrt{np(1 - p)}$."), ["$1/10 = 0.1$."]),
    ex(2, dp("asyx-ex-5", "$\\hat\\theta = 2$ with SE 0.1. Find the delta-method SE of $1/\\hat\\theta$.", 0.1 / 4, "$\\lvert -1/\\theta^2\\rvert$."), ["$0.025$."]),
    ex(3, dp("asyx-ex-6", "Independent $\\hat\\mu_1 = 10$ (SE 0.5) and $\\hat\\mu_2 = 5$ (SE 0.25). Find the SE of $\\hat\\mu_1/\\hat\\mu_2$.", Math.sqrt(0.25 / 25 + (100 / 625) * 0.0625), "Use the ratio formula."), ["$\\sqrt{0.01 + 0.01} \\approx 0.141$."]),
    ex(3, mc("asyx-ex-7", "An exponential sample has $\\bar X \\to \\mu$. The MLE of the rate is $1/\\bar X$. By continuous mapping it", ["converges in probability to $1/\\mu$", "$g(x) = 1/x$ is continuous at $\\mu > 0$."], [["has no limit", "Continuous mapping gives one."], ["converges to $\\mu$", "It targets the rate $1/\\mu$."]]), ["Consistency carries through continuous functions."]),
    ex(3, mc("asyx-ex-8", "For $g(\\theta) = \\theta^2$ at $\\theta = 0$, the first-order delta method gives SE 0. In truth $n\\hat\\theta^2$", ["has a scaled $\\chi^2_1$ limit, needing a second-order expansion", "$g'(0) = 0$ kills the linear term."], [["is exactly 0", "It is random."], ["is normal", "It is a squared normal."]]), ["The second-order delta method handles $g'(\\theta) = 0$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const th = r.pick([2, 3, 4, 5, 8, 10]);
      const se = r.pick([0.1, 0.2, 0.25, 0.5]);
      const fs = [
        { tex: "\\ln\\hat\\theta", d: 1 / th, how: `1/${th}` },
        { tex: "\\hat\\theta^2", d: 2 * th, how: `2 \\times ${th}` },
        { tex: "\\sqrt{\\hat\\theta}", d: 1 / (2 * Math.sqrt(th)), how: `1/(2\\sqrt{${th}})` },
        { tex: "1/\\hat\\theta", d: 1 / (th * th), how: `1/${th}^2` },
        { tex: "e^{\\hat\\theta/10}", d: Math.exp(th / 10) / 10, how: `e^{${th}/10}/10` },
      ];
      const f = r.pick(lv === 1 ? fs.slice(0, 2) : fs);
      const v = f.d * se;
      return n(`$\\hat\\theta = ${th}$ with standard error ${se}. Find the delta-method SE of $${f.tex}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\lvert g'(\\hat\\theta)\\rvert \\times ${se} = ${f.how} \\times ${se} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([100, 200, 400, 500, 1000]);
      const p = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const v = 1 / Math.sqrt(nn * p * (1 - p));
      return n(`$\\hat p = ${p}$ from ${nn} trials. Find the delta-method SE of the log-odds (3 decimals).`, Math.round(v * 1000) / 1000, `$1/\\sqrt{${nn} \\times ${p} \\times ${r2(1 - p)}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const th = r.pick([4, 5, 10, 20]);
      const se = r.pick([0.4, 0.5, 1]);
      return mcNumbers(
        `$\\hat\\theta = ${th}$ with SE ${se}. A colleague reports $\\ln\\hat\\theta$ with SE ${se}. The right SE is about`,
        { text: `${r2(se / th)}`, why: `Delta method: ${se}/${th}.` },
        [{ text: `${se}`, why: "The log compresses errors by the factor $1/\\theta$.", misconception: "transform-same-se" }],
      );
    },
  },
];
