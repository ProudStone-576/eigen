import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Conjugate priors: beta–binomial, gamma–Poisson, normal–normal, Dirichlet–multinomial; posteriors as weighted averages. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const normPost = (mu0: number, tau2: number, xbar: number, s2: number, nn: number) => {
  const prec = 1 / tau2 + nn / s2;
  return { mean: (mu0 / tau2 + (nn * xbar) / s2) / prec, v: 1 / prec };
};

const base: ConceptNode = {
  id: "conjugate-priors",
  title: "Conjugate priors",
  summary: "A conjugate prior gives a posterior of the same family, so updating is just arithmetic on the parameters: Beta(a, b) with k successes in n gives Beta(a + k, b + n − k); Gamma(α, β) with Poisson counts gives Gamma(α + Σx, β + n); a normal prior on a normal mean gives a normal posterior whose mean is a precision-weighted average of prior and data.",
  deps: ["bayesian-inference", "multivariate-normal"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "conjugate prior", meaning: "A prior whose posterior, for a given likelihood, belongs to the same family." },
    { term: "pseudo-counts", meaning: "The prior's parameters read as imaginary earlier observations: Beta(a, b) is like $a$ successes and $b$ failures already seen." },
    { term: "precision", meaning: "One over a variance; precisions of independent pieces of evidence add." },
  ],
  misconceptions: {
    "prior-pseudo-counts": "Forgets that a Beta(a, b) prior acts like a + b extra observations, so treats a strong prior as weak.",
    "posterior-mean-data-only": "Thinks the posterior mean equals the sample mean whatever the prior.",
  },
  steps: [
    {
      type: "motivate",
      title: "Updating by addition",
      body: "Most posteriors need computers. A few prior–likelihood pairs, the conjugate ones, update with a line of arithmetic, and those cases cover proportions, counts and means: enough for A/B tests, insurance claims and sensor readings.",
      realWorld: {
        title: "Online experiments",
        body: "Bayesian A/B testing tools keep a Beta posterior for each variant's conversion rate. Every visitor adds 1 to one of its two parameters, so the posterior is always up to date at no cost.",
      },
    },
    {
      type: "truth",
      statement: "**Beta–binomial**: prior Beta$(a, b)$ and $k$ successes in $n$ give Beta$(a + k,\\ b + n - k)$. **Gamma–Poisson**: prior Gamma$(\\alpha, \\beta)$ (rate $\\beta$) and Poisson counts with total $S$ over $n$ periods give Gamma$(\\alpha + S,\\ \\beta + n)$. **Normal–normal**: prior $\\mu \\sim N(\\mu_0, \\tau^2)$ and $n$ observations with mean $\\bar x$ and known variance $\\sigma^2$ give a normal posterior with precision $\\tfrac{1}{\\tau^2} + \\tfrac{n}{\\sigma^2}$ and mean $\\dfrac{\\mu_0/\\tau^2 + n\\bar x/\\sigma^2}{1/\\tau^2 + n/\\sigma^2}$.",
      body: "Each posterior mean is a weighted average of the prior's guess and the data's estimate, weighted by how much information each carries: $a + b$ pseudo-trials against $n$ real ones, or prior precision against data precision. **Dirichlet–multinomial** generalises the beta to several categories.",
    },
    {
      type: "predict",
      misconception: "prior-pseudo-counts",
      item: {
        kind: "mc",
        id: "cjp-predict-1",
        prompt: "A Beta(50, 50) prior on a coin's $p$ meets 9 heads in 10 tosses. The posterior mean is about",
        options: [
          { id: "a", text: "0.54: the prior counts like 100 earlier tosses", correct: true, why: "$59/110$." },
          { id: "b", text: "0.9: the data decide", misconception: "prior-pseudo-counts", why: "Ten tosses can't outweigh a prior worth 100." },
          { id: "c", text: "0.5: the prior decides", why: "The data still move it." },
        ],
      },
      reveal: {
        body: "Beta(50, 50) is like having already seen 50 heads and 50 tails. Adding 9 and 1 gives Beta(59, 51), with mean $59/110 \\approx 0.54$. A prior that strong says \"I'm almost sure it's fair\", and 10 tosses only nudge it. Beta(1, 1), worth 2 pseudo-tosses, would give $10/12 \\approx 0.83$.",
      },
      resolve: {
        kind: "mc",
        id: "cjp-resolve-1",
        prompt: "How much weight does a Beta(a, b) prior carry?",
        options: [
          { id: "a", text: "Like $a + b$ earlier observations", correct: true, why: "Pseudo-counts." },
          { id: "b", text: "Very little, whatever $a$ and $b$ are", misconception: "prior-pseudo-counts", why: "Large $a$ and $b$ make a strong prior." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cjp-check-1",
        prompt: "Prior $\\mu \\sim N(100, 25)$; 4 observations with $\\bar x = 110$ and known $\\sigma^2 = 100$. The posterior mean is",
        options: [
          { id: "a", text: "105: prior and data carry equal precision", correct: true, why: "$1/25 = 4/100$." },
          { id: "b", text: "110, the sample mean", misconception: "posterior-mean-data-only", why: "The prior pulls the estimate towards 100." },
          { id: "c", text: "100, the prior mean", why: "The data pull it towards 110." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cjp-check-2",
        prompt: "A Gamma(2, 1) prior on a Poisson rate meets counts 3, 5, 4. The posterior is",
        options: [
          { id: "a", text: "Gamma(14, 4)", correct: true, why: "$\\alpha + 12$, $\\beta + 3$." },
          { id: "b", text: "Gamma(14, 1)", why: "Add the number of periods to $\\beta$." },
          { id: "c", text: "Gamma(5, 4)", why: "Add the total count, 12, to $\\alpha$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Naive Bayes text classifiers smooth word probabilities with a Dirichlet prior (add-one smoothing). Thompson sampling for multi-armed bandits keeps a Beta posterior per arm and samples from each to decide which to try next, balancing exploration against exploitation.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cjp-produce-1", prompt: "A Beta(2, 3) prior meets 8 successes in 10 trials. Find the posterior's second parameter.", answer: 5, explain: "$3 + 2$." },
        { kind: "number", id: "cjp-produce-2", prompt: "A Gamma(3, 2) prior meets Poisson counts totalling 17 over 4 periods. Find the posterior mean rate.", answer: 20 / 6, tolerance: 0.0005, explain: "Gamma(20, 6): $20/6$." },
        {
          kind: "mc",
          id: "cjp-produce-3",
          prompt: "With a normal prior on a mean, the posterior mean lies",
          options: [
            { id: "a", text: "between the prior mean and the sample mean", correct: true, why: "It is a precision-weighted average." },
            { id: "b", text: "at the sample mean", misconception: "posterior-mean-data-only", why: "Only with a flat prior or infinite data." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cjp-review-1", prompt: "A Beta(3, 7) prior meets 0 successes in 10 trials. Find the posterior mean.", answer: 0.15, explain: "Beta(3, 17): $3/20$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Dirichlet–multinomial",
      body: "A **Dirichlet**$(\\alpha_1, \\dots, \\alpha_k)$ prior on category probabilities, combined with multinomial counts $x_1, \\dots, x_k$, gives a Dirichlet$(\\alpha_1 + x_1, \\dots, \\alpha_k + x_k)$ posterior, with posterior mean $\\dfrac{\\alpha_j + x_j}{\\sum\\alpha + n}$ for category $j$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "beta–binomial conjugacy",
      statement: "A Beta$(a, b)$ prior and a binomial likelihood with $k$ successes in $n$ give a Beta$(a + k, b + n - k)$ posterior, with mean $\\dfrac{a + k}{a + b + n} = w\\dfrac{a}{a + b} + (1 - w)\\dfrac kn$, where $w = \\dfrac{a + b}{a + b + n}$.",
      proof: ["Posterior $\\propto p^k(1 - p)^{n-k} \\cdot p^{a-1}(1 - p)^{b-1} = p^{a+k-1}(1 - p)^{b+n-k-1}$, the beta kernel. Rearranging the mean gives the weighted average."],
    },
    {
      type: "theorem",
      name: "gamma–Poisson conjugacy",
      statement: "A Gamma$(\\alpha, \\beta)$ prior on a Poisson rate $\\lambda$ and counts $x_1, \\dots, x_n$ give Gamma$(\\alpha + \\sum x_i,\\ \\beta + n)$, with mean $\\dfrac{\\alpha + \\sum x_i}{\\beta + n}$.",
      proof: ["Likelihood $\\propto \\lambda^{\\sum x_i}e^{-n\\lambda}$; prior $\\propto \\lambda^{\\alpha - 1}e^{-\\beta\\lambda}$; their product is a gamma kernel."],
    },
    {
      type: "theorem",
      name: "normal–normal conjugacy",
      statement: "Precisions add: posterior precision $= \\tfrac{1}{\\tau^2} + \\tfrac{n}{\\sigma^2}$, and the posterior mean is the precision-weighted average of $\\mu_0$ and $\\bar x$.",
      proof: ["Completing the square in $\\mu$ in $-\\tfrac{(\\mu - \\mu_0)^2}{2\\tau^2} - \\tfrac{n(\\bar x - \\mu)^2}{2\\sigma^2}$ gives a normal kernel with those parameters."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A Beta(2, 2) prior on a click rate meets 3 clicks in 10 impressions. Find the posterior and its mean.",
      solution: ["Beta$(2 + 3, 2 + 7)$ = Beta(5, 9).", "Mean $5/14 \\approx 0.357$, between the prior's 0.5 and the data's 0.3."],
      result: "Beta(5, 9), mean about 0.357.",
    },
    {
      type: "example",
      level: 2,
      title: "claims per year",
      problem: "A Gamma(4, 2) prior (mean 2) on a policy's claim rate meets 1, 0, 3 claims in three years. Find the posterior mean rate.",
      solution: ["Gamma$(4 + 4,\\ 2 + 3)$ = Gamma(8, 5).", "Mean $8/5 = 1.6$ claims per year."],
      result: "1.6.",
    },
    {
      type: "example",
      level: 3,
      title: "a normal mean",
      problem: "Prior $\\mu \\sim N(100, 25)$. Four observations average 110 with known $\\sigma^2 = 100$. Find the posterior mean and variance.",
      solution: ["Prior precision $1/25 = 0.04$; data precision $4/100 = 0.04$; total 0.08.", "Mean $\\dfrac{0.04 \\times 100 + 0.04 \\times 110}{0.08} = 105$; variance $1/0.08 = 12.5$."],
      result: "$N(105, 12.5)$.",
    },
  ],
  pitfalls: [
    { wrong: "Any Beta prior is weak.", right: "Beta(a, b) is worth $a + b$ observations; Beta(50, 50) is strong." },
    { wrong: "The posterior mean is the sample mean.", right: "It is a weighted average of the prior mean and the sample mean." },
    { wrong: "Add the counts to the gamma's rate parameter.", right: "Counts go to the shape $\\alpha$; the number of periods goes to the rate $\\beta$." },
  ],
  formulas: [
    { label: "Beta–binomial", tex: "\\text{Beta}(a + k,\\ b + n - k)" },
    { label: "Gamma–Poisson", tex: "\\text{Gamma}(\\alpha + \\textstyle\\sum x_i,\\ \\beta + n)" },
    { label: "Normal–normal precision", tex: "\\tfrac{1}{\\tau^2} + \\tfrac{n}{\\sigma^2}" },
    { label: "Posterior mean", tex: "\\dfrac{\\mu_0/\\tau^2 + n\\bar x/\\sigma^2}{1/\\tau^2 + n/\\sigma^2}" },
  ],
  exercises: [
    ex(1, num("cjpx-ex-1", "A Beta(1, 1) prior meets 6 successes in 8 trials. Find the posterior mean.", 0.7, "Beta(7, 3)."), ["$7/10$."]),
    ex(1, num("cjpx-ex-2", "A Gamma(1, 1) prior meets Poisson counts 2, 4. Find the posterior shape $\\alpha$.", 7, "$1 + 6$."), ["Gamma(7, 3)."]),
    ex(2, dp("cjpx-ex-3", "A Beta(50, 50) prior meets 9 heads in 10 tosses. Find the posterior mean.", 59 / 110, "Beta(59, 51)."), ["$59/110 \\approx 0.536$."]),
    ex(2, num("cjpx-ex-4", "A Gamma(4, 2) prior meets claims 1, 0, 3. Find the posterior mean rate.", 1.6, "Gamma(8, 5)."), ["$8/5 = 1.6$."]),
    ex(2, num("cjpx-ex-5", "Prior $N(50, 4)$; 9 observations average 56 with $\\sigma^2 = 36$. Find the posterior mean.", normPost(50, 4, 56, 36, 9).mean, "Precisions 0.25 and 0.25."), ["Equal precisions: $(50 + 56)/2 = 53$."]),
    ex(3, num("cjpx-ex-6", "Same problem. Find the posterior variance.", normPost(50, 4, 56, 36, 9).v, "$1/(0.25 + 0.25)$."), ["$2$."]),
    ex(3, dp("cjpx-ex-7", "Prior $N(0, 1)$; 4 observations average 2 with $\\sigma^2 = 4$. Find the posterior mean.", normPost(0, 1, 2, 4, 4).mean, "Precisions 1 and 1."), ["$(0 + 2)/2 = 1$."]),
    ex(3, dp("cjpx-ex-8", "A Dirichlet(1, 1, 1) prior meets counts 5, 3, 2. Find the posterior mean of the first category's probability.", 6 / 13, "$(1 + 5)/(3 + 10)$."), ["$6/13 \\approx 0.462$."]),
    ex(3, mc("cjpx-ex-9", "Two analysts start from Beta(1, 1) and Beta(20, 20) and see the same 30 successes in 40 trials. Whose posterior mean is closer to 0.75?", ["The Beta(1, 1) analyst's", "Their prior is worth 2 trials, not 40."], [["The Beta(20, 20) analyst's", "Their prior pulls hard towards 0.5."], ["Both are exactly 0.75", "Priors shift posterior means."]]), ["$31/42 \\approx 0.738$ against $50/80 = 0.625$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const al = r.int(1, 5);
      const be = r.int(1, 4);
      const k = 2 + lv;
      const xs = Array.from({ length: k }, () => r.int(0, 6));
      const S = xs.reduce((s, x) => s + x, 0);
      const m = (al + S) / (be + k);
      return n(`A Gamma(${al}, ${be}) prior on a Poisson rate meets counts ${xs.join(", ")}. Find the posterior mean rate (3 decimals).`, Math.round(m * 1000) / 1000, `Gamma(${al} + ${S}, ${be} + ${k}): mean $${al + S}/${be + k} \\approx ${Math.round(m * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const mu0 = r.int(40, 60);
      const tau2 = r.pick([1, 4, 9, 16, 25]);
      const s2 = r.pick([4, 16, 36, 100]);
      const nn = r.int(1, 4 * lv + 4);
      const xbar = mu0 + r.int(-10, 10);
      const p = normPost(mu0, tau2, xbar, s2, nn);
      return n(`Prior $\\mu \\sim N(${mu0}, ${tau2})$; ${nn} observation${nn > 1 ? "s" : ""} with mean ${xbar} and known $\\sigma^2 = ${s2}$. Find the posterior mean (3 decimals).`, Math.round(p.mean * 1000) / 1000, `Precisions $1/${tau2}$ and $${nn}/${s2}$; weighted average $\\approx ${Math.round(p.mean * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.pick([20, 50, 100]);
      const k = r.int(7, 10);
      const m = (a + k) / (2 * a + 10);
      return mcNumbers(
        `A Beta(${a}, ${a}) prior meets ${k} successes in 10 trials. The posterior mean is about`,
        { text: r2(m).toString(), why: `Beta(${a + k}, ${a + 10 - k}): the prior counts like ${2 * a} earlier trials.` },
        [
          { text: r2(k / 10).toString(), why: "That ignores a strong prior.", misconception: "prior-pseudo-counts" },
          { text: "0.5", why: "The data still move the estimate a little." },
        ],
      );
    },
  },
];
