import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Empirical process theory (Glivenko–Cantelli, Donsker, DKW bands), U-statistics (Hoeffding), influence functions and semiparametric efficiency. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const dkw = (nn: number, alpha: number) => Math.sqrt(Math.log(2 / alpha) / (2 * nn));
const ustat = (xs: number[], h: (a: number, b: number) => number) => {
  let s = 0;
  let c = 0;
  for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) { s += h(xs[i], xs[j]); c++; }
  return s / c;
};

const base: ConceptNode = {
  id: "advanced-asymptotics",
  title: "Empirical processes, U-statistics & semiparametrics",
  summary: "Some of the most useful asymptotic results are about whole functions rather than single numbers. The empirical CDF converges to the true CDF uniformly, with a simultaneous confidence band. U-statistics, averages over all pairs, are unbiased and asymptotically normal. And semiparametric theory studies estimating a few parameters of interest while leaving the rest of the model completely unspecified, using influence functions.",
  deps: ["asymptotics", "rank-tests", "propensity-scores"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "empirical CDF", meaning: "$F_n(x) = \\tfrac1n\\#\\{i : X_i \\le x\\}$, the proportion of observations at or below $x$." },
    { term: "U-statistic", meaning: "An average of a symmetric kernel $h$ over all subsets of $m$ observations, unbiased for $E[h]$." },
    { term: "influence function", meaning: "$\\varphi(x)$ such that $\\hat\\theta - \\theta \\approx \\tfrac1n\\sum_i\\varphi(X_i)$: each observation's first-order effect on the estimate." },
  ],
  misconceptions: {
    "pointwise-band": "Uses pointwise confidence intervals at each $x$ as if they were a simultaneous band for the whole CDF.",
    "nuisance-free": "Thinks plugging a flexibly estimated nuisance function into an estimator has no effect on its bias or variance.",
  },
  steps: [
    {
      type: "motivate",
      title: "Beyond one number",
      body: "A histogram or empirical CDF estimates a whole distribution. How far can it be from the truth anywhere? A rank test averages comparisons over all pairs of observations. How variable is that? An average treatment effect is estimated after modelling outcomes and propensities with machine learning. Can we still get valid confidence intervals? These questions need asymptotics for functions, pairs and infinite-dimensional nuisances.",
      realWorld: {
        title: "Kolmogorov–Smirnov",
        body: "The Kolmogorov–Smirnov test of whether data follow a given distribution uses the largest gap between the empirical and hypothesised CDFs (§{normality-tests}); its null distribution comes from empirical process theory.",
      },
    },
    {
      type: "truth",
      statement: "**Glivenko–Cantelli**: $\\sup_x\\lvert F_n(x) - F(x)\\rvert \\to 0$ almost surely. **DKW inequality**: $P(\\sup_x\\lvert F_n(x) - F(x)\\rvert > \\varepsilon) \\le 2e^{-2n\\varepsilon^2}$, so $F_n \\pm \\varepsilon$ with $\\varepsilon = \\sqrt{\\ln(2/\\alpha)/(2n)}$ is a $1 - \\alpha$ **simultaneous** band. **Donsker**: $\\sqrt n(F_n - F)$ converges to a Brownian bridge. A **U-statistic** $U = \\binom{n}{m}^{-1}\\sum h(X_{i_1}, \\dots, X_{i_m})$ is unbiased for $E[h]$, and $\\sqrt n(U - \\theta) \\xrightarrow{d} N(0, m^2\\zeta_1)$, with $\\zeta_1 = \\operatorname{Var}(E[h \\mid X_1])$ (Hoeffding).",
      body: "The sample variance is the U-statistic with $h(x, y) = (x - y)^2/2$; the Mann–Whitney statistic (§{rank-tests}) uses $h = \\mathbf 1[x < y]$. **Semiparametric** models have a finite-dimensional target $\\theta$ and an infinite-dimensional nuisance $\\eta$: Cox's baseline hazard, or the outcome and propensity functions behind an average treatment effect (§{propensity-scores}). Regular estimators are **asymptotically linear**, $\\hat\\theta - \\theta = \\tfrac1n\\sum\\varphi(X_i) + o_p(n^{-1/2})$, with variance $E[\\varphi^2]/n$; the **efficient influence function** gives the smallest possible variance. Estimators built on it, such as AIPW, are insensitive to small errors in $\\hat\\eta$, which is what allows flexible nuisance estimation with cross-fitting.",
    },
    {
      type: "predict",
      misconception: "pointwise-band",
      item: {
        kind: "mc",
        id: "aas-predict-1",
        prompt: "From 200 observations you draw 95% pointwise intervals for $F(x)$ at each of 50 values of $x$. The chance that the true CDF lies inside all 50 at once is",
        options: [
          { id: "a", text: "less than 95%: you need a simultaneous band, such as DKW's $\\pm 0.096$", correct: true, why: "Many 95% intervals can't all hold with probability 95%." },
          { id: "b", text: "95%, since each interval is 95%", misconception: "pointwise-band", why: "Coverage at each point doesn't give joint coverage." },
          { id: "c", text: "exactly $0.95^{50}$", why: "The intervals are strongly dependent, so not that either." },
        ],
      },
      reveal: {
        body: "Each pointwise interval misses 5% of the time, and the misses at different $x$ don't all coincide, so joint coverage is lower. The DKW band is wider, $\\varepsilon = \\sqrt{\\ln 40/400} \\approx 0.096$ for $n = 200$, and covers the whole curve with probability at least 95%. The same issue arises for regression curves and survival curves: pointwise and simultaneous bands answer different questions (§{multiple-testing}).",
      },
      resolve: {
        kind: "mc",
        id: "aas-resolve-1",
        prompt: "To claim the whole CDF lies in a band with 95% confidence, use",
        options: [
          { id: "a", text: "a simultaneous band such as DKW", correct: true, why: "It controls the largest deviation." },
          { id: "b", text: "95% pointwise intervals joined up", misconception: "pointwise-band", why: "They cover each point, not all points together." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "aas-check-1",
        prompt: "An analyst estimates an average treatment effect by plugging an overfitted random-forest outcome model into $\\tfrac1n\\sum(\\hat\\mu_1(X_i) - \\hat\\mu_0(X_i))$, with no cross-fitting or correction, and uses the usual SE. The result",
        options: [
          { id: "a", text: "can be biased with too-narrow intervals: nuisance errors feed straight into the estimate", correct: true, why: "Plug-in estimators aren't orthogonal to nuisance errors." },
          { id: "b", text: "is fine: the nuisance model doesn't affect the target's inference", misconception: "nuisance-free", why: "First-order nuisance errors bias the plug-in estimate." },
          { id: "c", text: "is exactly unbiased", why: "Regularisation and overfitting bias it." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "aas-check-2",
        prompt: "The U-statistic with kernel $h(x, y) = (x - y)^2/2$ on the data 1, 3, 5 equals",
        options: [
          { id: "a", text: "4, the sample variance", correct: true, why: "Pairs give 2, 8, 2; their mean is 4." },
          { id: "b", text: "2.67", why: "That divides by $n$ instead of averaging over pairs." },
          { id: "c", text: "12", why: "That is the sum, not the average." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Empirical process theory underlies uniform generalisation bounds (§{learning-theory} builds on it). Influence functions are used to trace a model's predictions back to the training points that most affected them, and to debug data. Double machine learning is semiparametric theory put to work.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "aas-produce-1", prompt: "Find the DKW 95% band half-width for $n = 200$ to 3 decimals.", answer: Math.round(dkw(200, 0.05) * 1000) / 1000, tolerance: 0.001, explain: "$\\sqrt{\\ln 40/400}$." },
        { kind: "number", id: "aas-produce-2", prompt: "Find the U-statistic with kernel $\\lvert x - y\\rvert$ (Gini mean difference) for 1, 3, 5, to 3 decimals.", answer: Math.round((8 / 3) * 1000) / 1000, tolerance: 0.001, explain: "$(2 + 4 + 2)/3$." },
        {
          kind: "mc",
          id: "aas-produce-3",
          prompt: "Survival curves are shown with 95% pointwise intervals. Claiming the true curve lies within them everywhere is",
          options: [
            { id: "a", text: "not justified: that needs a simultaneous band", correct: true, why: "Joint coverage is lower." },
            { id: "b", text: "justified at 95%", misconception: "pointwise-band", why: "Pointwise coverage isn't joint coverage." },
          ],
        },
        {
          kind: "mc",
          id: "aas-produce-4",
          prompt: "Why does AIPW with cross-fitting tolerate flexible nuisance models?",
          options: [
            { id: "a", text: "Its estimating equation is orthogonal: nuisance errors enter only as products, a second-order effect", correct: true, why: "Small errors in each model barely move the estimate." },
            { id: "b", text: "Nuisance models never affect any estimator", misconception: "nuisance-free", why: "Plug-in estimators are affected at first order." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "aas-review-1", prompt: "The sample mean has influence function $\\varphi(x) = x - \\mu$. If $\\operatorname{Var}(X) = 9$ and $n = 100$, find the asymptotic variance of $\\bar X$.", answer: 0.09, explain: "$E[\\varphi^2]/n$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Brownian bridge and Donsker's theorem",
      body: "A **Brownian bridge** $B(t)$ on $[0, 1]$ is a Gaussian process with $B(0) = B(1) = 0$ and $\\operatorname{Cov}(B(s), B(t)) = s(1 - t)$ for $s \\le t$. Donsker's theorem says $\\sqrt n(F_n(x) - F(x))$ behaves like $B(F(x))$; so $\\sqrt n\\sup_x\\lvert F_n - F\\rvert$ has the Kolmogorov distribution, whose 95% point is about 1.36.",
    },
    {
      type: "definition",
      term: "influence functions",
      body: "For a functional $\\theta = T(F)$, the influence function $\\varphi(x)$ is the derivative of $T$ in the direction of a point mass at $x$. Mean: $x - \\mu$. Variance: $(x - \\mu)^2 - \\sigma^2$. Median: $\\dfrac{\\operatorname{sign}(x - m)}{2f(m)}$. Bounded influence functions mark robust estimators (§{robust-estimation}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "the DKW band",
      statement: "With probability at least $1 - \\alpha$, $\\sup_x\\lvert F_n(x) - F(x)\\rvert \\le \\varepsilon_n = \\sqrt{\\dfrac{\\ln(2/\\alpha)}{2n}}$.",
      proof: ["Set the DKW bound $2e^{-2n\\varepsilon^2}$ equal to $\\alpha$ and solve for $\\varepsilon$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "U-statistics are unbiased",
      statement: "If $h$ is symmetric with $E[h(X_1, \\dots, X_m)] = \\theta$, the U-statistic is unbiased for $\\theta$; with $m = 2$, its variance is about $4\\zeta_1/n$.",
      proof: ["Each term has mean $\\theta$, so their average does. Hoeffding's decomposition projects $U$ onto sums of single observations, giving the leading variance term."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "variance from the influence function",
      statement: "If $\\hat\\theta - \\theta = \\tfrac1n\\sum\\varphi(X_i) + o_p(n^{-1/2})$ with $E[\\varphi] = 0$, then $\\sqrt n(\\hat\\theta - \\theta) \\xrightarrow{d} N(0, E[\\varphi^2])$, and $\\tfrac1n\\sum\\hat\\varphi(X_i)^2/n$ estimates the variance.",
      proof: ["Apply the CLT to the average of the $\\varphi(X_i)$ and Slutsky to the remainder (§{asymptotics})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the 95% DKW band half-width for $n = 200$ and for $n = 800$.",
      solution: ["$n = 200$: $\\sqrt{\\ln 40/400} = \\sqrt{3.689/400} \\approx 0.096$.", "$n = 800$: $\\sqrt{3.689/1600} \\approx 0.048$: four times the data halves the width."],
      result: "0.096 and 0.048.",
    },
    {
      type: "example",
      level: 2,
      title: "the sample variance as a U-statistic",
      problem: "Compute the U-statistic with $h(x, y) = (x - y)^2/2$ for 1, 3, 5, and check it equals $s^2$.",
      solution: ["Pairs: $(1, 3) \\to 2$, $(1, 5) \\to 8$, $(3, 5) \\to 2$; average 4.", "$s^2 = \\tfrac{(1 - 3)^2 + 0 + (5 - 3)^2}{2} = 4$."],
      result: "Both 4.",
    },
    {
      type: "example",
      level: 3,
      title: "the influence function of the median",
      problem: "For a standard normal, $f(0) \\approx 0.399$. Find the asymptotic variance of the sample median with $n = 100$, and compare with the mean.",
      solution: ["$\\varphi = \\pm\\dfrac{1}{2 \\times 0.399} = \\pm 1.253$, so $E[\\varphi^2] \\approx 1.571$.", "Median variance $\\approx 0.0157$ against $0.01$ for the mean: the median is about 64% as efficient for normal data."],
      result: "About 0.0157.",
    },
  ],
  pitfalls: [
    { wrong: "Treat pointwise intervals as a band for the whole curve.", right: "Use a simultaneous band (DKW, Kolmogorov, bootstrap)." },
    { wrong: "Plug machine-learning nuisance estimates into a naive estimator.", right: "Use an orthogonal (efficient-influence-function) estimator with cross-fitting." },
    { wrong: "Ignore the dependence between terms of a U-statistic.", right: "Use Hoeffding's variance, not the naive one for independent terms." },
  ],
  formulas: [
    { label: "DKW", tex: "P(\\sup\\lvert F_n - F\\rvert > \\varepsilon) \\le 2e^{-2n\\varepsilon^2}" },
    { label: "Band width", tex: "\\varepsilon_n = \\sqrt{\\ln(2/\\alpha)/(2n)}" },
    { label: "U-statistic", tex: "U = \\binom nm^{-1}\\textstyle\\sum h(X_{i_1}, \\dots, X_{i_m})" },
    { label: "Asymptotic linearity", tex: "\\hat\\theta - \\theta \\approx \\tfrac1n\\textstyle\\sum\\varphi(X_i)" },
  ],
  exercises: [
    ex(1, num("aasx-ex-1", "Data 2, 5, 5, 8, 9. Find $F_5(5)$.", 0.6, "3 of 5 are $\\le 5$."), ["$0.6$."]),
    ex(1, num("aasx-ex-2", "How many pairs does a U-statistic of order 2 average over with $n = 10$?", 45, "$\\binom{10}{2}$."), ["$45$."]),
    ex(2, dp("aasx-ex-3", "Find the 90% DKW band half-width for $n = 500$.", dkw(500, 0.1), "$\\sqrt{\\ln 20/1000}$."), ["$\\approx 0.055$."]),
    ex(2, dp("aasx-ex-4", "Find the U-statistic with $h(x, y) = (x - y)^2/2$ for 2, 4, 6, 8.", ustat([2, 4, 6, 8], (a, b) => (a - b) ** 2 / 2), "Average over 6 pairs."), ["Pairs give 2, 8, 18, 2, 8, 2: mean $40/6 \\approx 6.667 = s^2$."]),
    ex(2, num("aasx-ex-5", "How large must $n$ be for the 95% DKW half-width to be at most 0.05?", Math.ceil(Math.log(40) / (2 * 0.0025)), "$n \\ge \\ln 40/(2\\varepsilon^2)$."), ["$3.689/0.005 = 737.8$, so 738."]),
    ex(3, dp("aasx-ex-6", "Mann–Whitney as a U-statistic: $\\hat\\theta = $ fraction of pairs $(x_i, y_j)$ with $x_i < y_j$. With $x = (1, 4)$ and $y = (2, 5, 6)$, find it.", 5 / 6, "Count pairs."), ["$1 < 2, 5, 6$ (3); $4 < 5, 6$ (2): $5/6$."]),
    ex(3, mc("aasx-ex-7", "The influence function of the sample mean is unbounded, while the median's is bounded. This means", ["one wild observation can move the mean arbitrarily far, but not the median", "Bounded influence means robustness."], [["the mean is more robust", "Unbounded influence is the opposite."], ["both are equally robust", "Their influence functions differ."]]), ["Influence functions quantify robustness."]),
    ex(3, mc("aasx-ex-8", "The Cox model is semiparametric because", ["the hazard ratio is a finite-dimensional parameter while the baseline hazard is left unspecified", "A parametric part and a nonparametric part."], [["it has no parameters", "It has $\\beta$."], ["it assumes a Weibull baseline", "That would make it parametric."]]), ["The partial likelihood removes the nuisance baseline."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([50, 100, 200, 400, 1000, 2500]);
      const a = r.pick([0.01, 0.05, 0.1]);
      const v = dkw(nn, a);
      return n(`Find the ${Math.round((1 - a) * 100)}% DKW band half-width for $n = ${nn}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sqrt{\\ln(${Math.round(2 / a)})/${2 * nn}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const xs = Array.from({ length: k }, () => r.int(0, 12));
      const gini = lv === 3;
      const v = ustat(xs, gini ? (a, b) => Math.abs(a - b) : (a, b) => (a - b) ** 2 / 2);
      return n(`Find the U-statistic with kernel $${gini ? "\\lvert x - y\\rvert" : "(x - y)^2/2"}$ for the data ${xs.join(", ")} (3 decimals).`, Math.round(v * 1000) / 1000, `Average $h$ over all $\\binom{${k}}{2}$ pairs: $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([20, 50, 100]);
      return mcNumbers(
        `95% pointwise intervals for a CDF are computed at ${k} points. The probability that all ${k} cover the true CDF at once is`,
        { text: "below 95%", why: "Joint coverage needs a simultaneous band." },
        [
          { text: "95%", why: "Pointwise coverage isn't joint.", misconception: "pointwise-band" },
          { text: "above 95%", why: "More intervals give more chances to miss." },
        ],
      );
    },
  },
];
