import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mathematical statistics: sufficient statistics and the factorisation theorem, minimal sufficiency, exponential families, Rao–Blackwell, completeness, Lehmann–Scheffé, ancillary statistics and Basu's theorem, the likelihood principle. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "sufficiency",
  title: "Sufficiency & exponential families",
  summary: "A sufficient statistic compresses the data without losing any information about the parameter: once you know it, the rest of the data tell you nothing more. The factorisation theorem finds sufficient statistics, exponential families have them built in, and the Rao–Blackwell and Lehmann–Scheffé theorems turn them into the best unbiased estimators.",
  deps: ["estimator-properties", "fisher-information", "mle"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "sufficient statistic", meaning: "$T(X)$ such that the conditional distribution of the data given $T$ doesn't depend on $\\theta$." },
    { term: "complete", meaning: "$T$ is complete if $E_\\theta[g(T)] = 0$ for all $\\theta$ forces $g(T) = 0$." },
    { term: "ancillary statistic", meaning: "A statistic whose distribution doesn't depend on $\\theta$." },
  ],
  misconceptions: {
    "mean-always-sufficient": "Thinks the sample mean is sufficient for the parameter of any model.",
    "sufficient-means-unbiased": "Thinks a sufficient statistic must itself be an unbiased estimator of the parameter.",
  },
  steps: [
    {
      type: "motivate",
      title: "What can you throw away?",
      body: "A quality inspector tests 1,000 bulbs and records which failed. To estimate the failure rate, does the order of the failures matter? Which bulbs? Intuition says only the number of failures counts. Sufficiency makes that precise: it says exactly which summaries keep all the information about a parameter, and it underlies the search for the best possible estimators.",
      realWorld: {
        title: "Fisher's discovery",
        body: "R. A. Fisher introduced sufficiency in 1922, in the paper that also founded maximum likelihood. He showed that for normal data, the sample mean and variance together hold all the information; the individual values add nothing about $\\mu$ and $\\sigma$.",
      },
    },
    {
      type: "truth",
      statement: "**Factorisation theorem**: $T(X)$ is sufficient for $\\theta$ if and only if the joint density factors as $f(\\vec x; \\theta) = g(T(\\vec x); \\theta)\\,h(\\vec x)$. A one-parameter **exponential family** has $f(x; \\theta) = h(x)\\exp(\\eta(\\theta)T(x) - A(\\theta))$, and then $\\sum_iT(x_i)$ is sufficient. **Rao–Blackwell**: if $\\delta$ is any estimator and $T$ is sufficient, $\\tilde\\delta = E[\\delta \\mid T]$ has the same bias and $\\text{MSE}(\\tilde\\delta) \\le \\text{MSE}(\\delta)$. **Lehmann–Scheffé**: an unbiased estimator that is a function of a **complete** sufficient statistic is the unique minimum-variance unbiased estimator (UMVUE).",
      body: "Examples: Bernoulli or Poisson, $\\sum x_i$; normal with both parameters, $(\\sum x_i, \\sum x_i^2)$; uniform on $(0, \\theta)$, the maximum $X_{(n)}$, because the density is $\\theta^{-n}\\mathbf{1}[x_{(n)} \\le \\theta]$. Most textbook families (binomial, Poisson, normal, gamma, beta) are exponential families, and their natural sufficient statistics are complete. An **ancillary** statistic carries no information about $\\theta$ on its own; **Basu's theorem** says a complete sufficient statistic is independent of every ancillary one, which is why $\\bar X$ and $S^2$ are independent for normal data. The **likelihood principle** holds that all the evidence about $\\theta$ is in the likelihood, which depends on the data only through a sufficient statistic (§{mle}).",
    },
    {
      type: "predict",
      misconception: "mean-always-sufficient",
      item: {
        kind: "mc",
        id: "suf-predict-1",
        prompt: "Data are uniform on $(0, \\theta)$: 2.1, 0.4, 7.8, 3.0. Which statistic captures all the information about $\\theta$?",
        options: [
          { id: "a", text: "The maximum, 7.8", correct: true, why: "The likelihood is $\\theta^{-4}$ for $\\theta \\ge 7.8$ and 0 otherwise." },
          { id: "b", text: "The mean, 3.325, as for any model", misconception: "mean-always-sufficient", why: "The likelihood depends on the data only through the maximum." },
          { id: "c", text: "The minimum, 0.4", why: "The minimum says little about the upper end." },
        ],
      },
      reveal: {
        body: "Each observation contributes $\\theta^{-1}\\mathbf{1}[x_i \\le \\theta]$, so the likelihood is $\\theta^{-n}\\mathbf{1}[\\max x_i \\le \\theta]$: it depends on the data only through the maximum. By factorisation, $X_{(n)}$ is sufficient. The mean is not: two samples with the same mean but different maxima support different values of $\\theta$. The UMVUE is $\\tfrac{n + 1}{n}X_{(n)} = 9.75$ here.",
      },
      resolve: {
        kind: "mc",
        id: "suf-resolve-1",
        prompt: "Whether the sample mean is sufficient depends on",
        options: [
          { id: "a", text: "the model: check the factorisation of its likelihood", correct: true, why: "It is sufficient for Poisson or normal means, not for uniform $(0, \\theta)$." },
          { id: "b", text: "nothing: the mean is always sufficient", misconception: "mean-always-sufficient", why: "Counterexamples include the uniform and Cauchy." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "suf-check-1",
        prompt: "For $n$ Bernoulli trials, $T = \\sum x_i$ is sufficient for $p$. Is $T$ itself an unbiased estimator of $p$?",
        options: [
          { id: "a", text: "No: $E[T] = np$. Sufficiency is about information; $T/n$ is the unbiased estimator", correct: true, why: "A function of $T$ estimates $p$." },
          { id: "b", text: "Yes, sufficient statistics are unbiased estimators", misconception: "sufficient-means-unbiased", why: "Sufficiency says nothing about bias." },
          { id: "c", text: "Yes, when $n = 2$", why: "$E[T] = 2p$ then." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "suf-check-2",
        prompt: "For Bernoulli data with $n = 5$ and $\\sum x_i = 3$, Rao–Blackwellising $\\delta = X_1$ gives",
        options: [
          { id: "a", text: "$E[X_1 \\mid T = 3] = 3/5$", correct: true, why: "By symmetry each trial is equally likely to be one of the 3 successes." },
          { id: "b", text: "$X_1$ unchanged", why: "Conditioning on $T$ averages it." },
          { id: "c", text: "3", why: "That is $T$ itself." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Exponential families are the backbone of generalised linear models and of conjugate Bayesian updating: the posterior depends on the data only through the sufficient statistics, so streaming and distributed systems can keep running sums instead of raw data. Softmax classifiers and many probabilistic models are exponential families in their natural parameters.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "suf-produce-1", prompt: "Uniform $(0, \\theta)$ sample of size 4 with maximum 8. Find the UMVUE $\\tfrac{n + 1}{n}X_{(n)}$.", answer: 10, explain: "$\\tfrac54 \\times 8$." },
        { kind: "number", id: "suf-produce-2", prompt: "Bernoulli trials 1, 0, 1, 1, 0. Find the Rao–Blackwellised estimate $E[X_1 \\mid T]$ of $p$.", answer: 0.6, explain: "$T/n = 3/5$." },
        {
          kind: "mc",
          id: "suf-produce-3",
          prompt: "For Poisson data, $\\sum x_i$ is sufficient for $\\lambda$. As an estimator of $\\lambda$, $\\sum x_i$ is",
          options: [
            { id: "a", text: "biased: its mean is $n\\lambda$; use $\\bar x$", correct: true, why: "Sufficiency and unbiasedness are separate." },
            { id: "b", text: "unbiased, being sufficient", misconception: "sufficient-means-unbiased", why: "Sufficiency doesn't imply unbiasedness." },
          ],
        },
        {
          kind: "mc",
          id: "suf-produce-4",
          prompt: "For a Cauchy location model, the sample mean is",
          options: [
            { id: "a", text: "not sufficient; no low-dimensional statistic is (only the order statistics)", correct: true, why: "The Cauchy likelihood doesn't factor through the mean." },
            { id: "b", text: "sufficient, as in every model", misconception: "mean-always-sufficient", why: "Sufficiency depends on the model." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "suf-review-1", prompt: "Uniform $(0, \\theta)$ sample of size 9 with maximum 4.5. Find the UMVUE of $\\theta$.", answer: 5, explain: "$\\tfrac{10}{9} \\times 4.5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "minimal sufficiency",
      body: "A sufficient statistic is **minimal** if it is a function of every other sufficient statistic: the greatest possible compression. $T$ is minimal sufficient when $f(\\vec x; \\theta)/f(\\vec y; \\theta)$ is free of $\\theta$ exactly when $T(\\vec x) = T(\\vec y)$. The whole data set is always sufficient, but rarely minimal.",
    },
    {
      type: "definition",
      term: "exponential families",
      body: "In natural form $f(x; \\eta) = h(x)\\exp(\\eta T(x) - A(\\eta))$. The **log-partition** function $A$ generates the moments: $E[T] = A'(\\eta)$, $\\operatorname{Var}(T) = A''(\\eta)$, and the Fisher information in $\\eta$ is $A''(\\eta)$ (§{fisher-information}). Poisson: $\\eta = \\ln\\lambda$, $T = x$, $A = e^\\eta$. Bernoulli: $\\eta = \\ln\\tfrac{p}{1 - p}$ (the logit), $A = \\ln(1 + e^\\eta)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Rao–Blackwell",
      statement: "If $T$ is sufficient and $\\tilde\\delta = E[\\delta \\mid T]$, then $E[\\tilde\\delta] = E[\\delta]$ and $\\operatorname{Var}(\\tilde\\delta) \\le \\operatorname{Var}(\\delta)$.",
      proof: [
        "Sufficiency makes $E[\\delta \\mid T]$ free of $\\theta$, so $\\tilde\\delta$ is a genuine estimator; the tower rule gives equal means.",
        "The law of total variance: $\\operatorname{Var}(\\delta) = \\operatorname{Var}(E[\\delta \\mid T]) + E[\\operatorname{Var}(\\delta \\mid T)] \\ge \\operatorname{Var}(\\tilde\\delta)$.",
      ],
    },
    {
      type: "theorem",
      name: "Lehmann–Scheffé",
      statement: "If $T$ is complete and sufficient and $g(T)$ is unbiased for $\\tau(\\theta)$, then $g(T)$ is the unique UMVUE of $\\tau(\\theta)$.",
      proof: ["Any unbiased $\\delta$ Rao–Blackwellises to an unbiased function of $T$ with no more variance; completeness makes all unbiased functions of $T$ equal, so they all equal $g(T)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "moments from the log-partition",
      statement: "In a natural exponential family, $E[T(X)] = A'(\\eta)$ and $\\operatorname{Var}(T(X)) = A''(\\eta)$.",
      proof: ["Differentiate $\\int h(x)e^{\\eta T(x) - A(\\eta)}dx = 1$ with respect to $\\eta$ once and twice."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "factorising the Poisson",
      problem: "Show $\\sum x_i$ is sufficient for $\\lambda$ in a Poisson sample.",
      solution: ["$\\prod\\dfrac{e^{-\\lambda}\\lambda^{x_i}}{x_i!} = \\underbrace{e^{-n\\lambda}\\lambda^{\\sum x_i}}_{g(T; \\lambda)} \\cdot \\underbrace{\\prod\\tfrac{1}{x_i!}}_{h(\\vec x)}$.", "By the factorisation theorem, $T = \\sum x_i$ is sufficient."],
      result: "$T = \\sum x_i$.",
    },
    {
      type: "example",
      level: 2,
      title: "a UMVUE for $p^2$",
      problem: "Bernoulli sample, $n = 5$, $T = \\sum x_i = 3$. Find the UMVUE of $p^2$, the chance two trials both succeed.",
      solution: ["$\\delta = X_1X_2$ is unbiased for $p^2$; Rao–Blackwellise: $E[X_1X_2 \\mid T] = \\dfrac{T(T - 1)}{n(n - 1)}$.", "$T$ is complete, so this is the UMVUE: $\\dfrac{3 \\times 2}{5 \\times 4} = 0.3$."],
      result: "0.3 (the plug-in $\\hat p^2 = 0.36$ is biased).",
    },
    {
      type: "example",
      level: 3,
      title: "Basu's theorem",
      problem: "For a normal sample with known variance, why are $\\bar X$ and $S^2$ independent?",
      solution: ["With $\\sigma^2$ known, $\\bar X$ is complete sufficient for $\\mu$.", "$S^2$'s distribution, $\\sigma^2\\chi^2_{n-1}/(n - 1)$, doesn't involve $\\mu$: ancillary. Basu gives independence."],
      result: "Complete sufficient is independent of ancillary.",
    },
  ],
  pitfalls: [
    { wrong: "The sample mean is always sufficient.", right: "Check the factorisation; for uniform $(0, \\theta)$ it is the maximum." },
    { wrong: "A sufficient statistic is an unbiased estimator.", right: "It carries the information; an estimator is a suitable function of it." },
    { wrong: "Rao–Blackwell gives the best estimator.", right: "It improves any estimator; with completeness, Lehmann–Scheffé gives the best unbiased one." },
  ],
  formulas: [
    { label: "Factorisation", tex: "f(\\vec x; \\theta) = g(T(\\vec x); \\theta)h(\\vec x)" },
    { label: "Exponential family", tex: "h(x)\\exp(\\eta T(x) - A(\\eta))" },
    { label: "Moments", tex: "E[T] = A'(\\eta),\\ \\operatorname{Var}(T) = A''(\\eta)" },
    { label: "Rao–Blackwell", tex: "\\tilde\\delta = E[\\delta \\mid T]" },
  ],
  exercises: [
    ex(1, num("sufx-ex-1", "Bernoulli trials 1, 1, 0, 1, 0, 0, 1, 1. Find the sufficient statistic $\\sum x_i$.", 5, "Count the successes."), ["$5$."]),
    ex(1, num("sufx-ex-2", "Uniform $(0, \\theta)$ data 3.2, 5.1, 1.7. Find the sufficient statistic.", 5.1, "The maximum."), ["$5.1$."]),
    ex(2, fr("sufx-ex-3", "Bernoulli, $n = 6$, $T = 4$. Find the UMVUE of $p^2$.", (4 * 3) / (6 * 5), "$T(T - 1)/(n(n - 1))$."), ["$12/30 = 0.4$."]),
    ex(2, num("sufx-ex-4", "Uniform $(0, \\theta)$, $n = 5$, maximum 6. Find the UMVUE.", 7.2, "$\\tfrac65 \\times 6$."), ["$7.2$."]),
    ex(2, num("sufx-ex-5", "Poisson in natural form has $A(\\eta) = e^\\eta$. At $\\eta = \\ln 3$, find $\\operatorname{Var}(X)$.", 3, "$A''(\\eta) = e^\\eta$."), ["$3 = \\lambda$."]),
    ex(3, fr("sufx-ex-6", "Bernoulli in natural form has $A(\\eta) = \\ln(1 + e^\\eta)$. At $\\eta = 0$, find $\\operatorname{Var}(X)$.", 0.25, "$A'' = p(1 - p)$."), ["$p = \\tfrac12$, variance $\\tfrac14$."]),
    ex(3, mc("sufx-ex-7", "For a normal sample with both $\\mu$ and $\\sigma^2$ unknown, a minimal sufficient statistic is", ["$(\\sum x_i, \\sum x_i^2)$", "Equivalently $(\\bar x, s^2)$."], [["$\\bar x$ alone", "That ignores the spread."], ["the median", "It isn't sufficient."]]), ["Two parameters, a two-dimensional sufficient statistic."]),
    ex(3, mc("sufx-ex-8", "Two experimenters observe 3 successes in 12 trials: one fixed $n = 12$, the other stopped at the 3rd success. Their likelihoods for $p$ are proportional. By the likelihood principle their evidence about $p$ is", ["the same", "Proportional likelihoods carry the same evidence."], [["different, because the designs differ", "That is the frequentist view the principle rejects."], ["undefined", "Both likelihoods are $\\propto p^3(1 - p)^9$."]]), ["p-values do differ here, which is the classic tension."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(3, 12);
      const mx = r2(r.int(20, 120) / 10);
      const v = ((nn + 1) / nn) * mx;
      return n(`A uniform $(0, \\theta)$ sample of size ${nn} has maximum ${mx}. Find the UMVUE $\\tfrac{n + 1}{n}X_{(n)}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\tfrac{${nn + 1}}{${nn}} \\times ${mx} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(4, 15);
      const t = r.int(1, nn);
      const sq = lv === 3;
      const v = sq ? (t * (t - 1)) / (nn * (nn - 1)) : t / nn;
      return n(`Bernoulli sample of size ${nn} with ${t} successes. Find the UMVUE of ${sq ? "$p^2$" : "$p$"} (3 decimals).`, Math.round(v * 1000) / 1000, sq ? `$\\dfrac{T(T - 1)}{n(n - 1)} = \\dfrac{${t * (t - 1)}}{${nn * (nn - 1)}} \\approx ${Math.round(v * 1000) / 1000}$.` : `$T/n = ${t}/${nn}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { m: "Poisson($\\lambda$)", t: "$\\sum x_i$", e: "$\\bar x$", mean: "$n\\lambda$" },
        { m: "Bernoulli($p$)", t: "$\\sum x_i$", e: "$\\bar x$", mean: "$np$" },
        { m: "exponential with mean $\\mu$", t: "$\\sum x_i$", e: "$\\bar x$", mean: "$n\\mu$" },
      ]);
      return mcNumbers(
        `For a ${v.m} sample, ${v.t} is sufficient. Is ${v.t} an unbiased estimator of the parameter?`,
        { text: `No: its mean is ${v.mean}; ${v.e} is unbiased`, why: "Sufficiency concerns information, not bias." },
        [{ text: "Yes, since it is sufficient", why: "Sufficient statistics need not be unbiased.", misconception: "sufficient-means-unbiased" }],
      );
    },
  },
];
