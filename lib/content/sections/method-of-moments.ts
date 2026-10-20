import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Method of moments; MAP estimation, Laplace smoothing, and ridge as a normal prior. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "method-of-moments",
  title: "Method of moments & MAP",
  summary: "The method of moments sets sample moments equal to their theoretical formulas and solves for the parameters: quick and always available, though sometimes inefficient. MAP estimation maximises likelihood × prior; it is maximum likelihood with a penalty, and a normal prior on regression weights gives ridge regression.",
  deps: ["mle", "estimator-properties", "bayes"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "sample moment", meaning: "$\\tfrac1n\\sum x_i^k$, the data's version of $E[X^k]$." },
    { term: "prior", meaning: "A probability distribution describing what is believed about a parameter before seeing the data." },
    { term: "MAP", meaning: "Maximum a posteriori: the parameter value with the highest posterior density." },
  ],
  misconceptions: {
    "mom-rate-mean": "For an exponential, sets the rate λ equal to x̄ instead of 1/x̄: matches the sample mean to the parameter rather than to the formula for the mean.",
    "map-equals-mle": "Thinks MAP and maximum likelihood always agree, ignoring the prior's pull, which matters most with little data.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two shortcuts to a parameter",
      body: "Maximum likelihood (§{mle}) can need calculus or a computer. The method of moments needs only a mean and a variance. And when there is prior knowledge, say that a coin is almost certainly close to fair, MAP estimation builds it in.",
      realWorld: {
        title: "Spam filters",
        body: "A word never seen in spam during training gets a spam probability of 0 by maximum likelihood, which would veto every future email containing it. Adding pseudo-counts, called Laplace smoothing, is MAP estimation with a beta prior.",
      },
    },
    {
      type: "truth",
      statement: "**Method of moments**: write $E[X]$, $E[X^2], \\dots$ as functions of the parameters, set them equal to the sample moments $\\tfrac1n\\sum x_i$, $\\tfrac1n\\sum x_i^2, \\dots$, and solve. **MAP**: $\\hat\\theta_{\\text{MAP}} = \\arg\\max_\\theta\\ L(\\theta)\\pi(\\theta)$, equivalently maximise $\\ln L(\\theta) + \\ln\\pi(\\theta)$.",
      body: "Method-of-moments estimates are consistent but can be less efficient than the MLE, and can even land outside the possible range. MAP approaches the MLE as data accumulate: the log-likelihood grows with $n$ while the log-prior stays fixed.",
    },
    {
      type: "predict",
      misconception: "mom-rate-mean",
      item: {
        kind: "mc",
        id: "mom-predict-1",
        prompt: "Waiting times 2, 4, 3 and 7 minutes are modelled as $\\mathrm{Exp}(\\lambda)$. Find the method-of-moments estimate of $\\lambda$.",
        options: [
          { id: "a", text: "0.25 per minute", correct: true, why: "$E[X] = 1/\\lambda$, so $\\hat\\lambda = 1/\\bar x$." },
          { id: "b", text: "4", misconception: "mom-rate-mean", why: "4 minutes is the mean wait; the rate is its reciprocal." },
          { id: "c", text: "0.0625", why: "That is $1/\\bar x^2$." },
        ],
      },
      reveal: {
        body: "For $\\mathrm{Exp}(\\lambda)$ the mean is $1/\\lambda$. Setting $1/\\lambda = \\bar x = 4$ gives $\\hat\\lambda = 0.25$: one arrival every 4 minutes. The method matches the sample mean to the *formula* for the mean, not to whichever parameter happens to be there.",
      },
      resolve: {
        kind: "mc",
        id: "mom-resolve-1",
        prompt: "In the method of moments you set",
        options: [
          { id: "a", text: "the sample mean equal to the formula for $E[X]$ in terms of the parameters", correct: true, why: "Then solve for the parameters." },
          { id: "b", text: "each parameter equal to the sample mean", misconception: "mom-rate-mean", why: "A parameter is only the mean if the formula says so." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mom-check-1",
        prompt: "A coin gives 3 heads in 3 tosses. With a Beta(5, 5) prior, the MAP estimate of $p$ is",
        options: [
          { id: "a", text: "$7/11 \\approx 0.64$, pulled towards 0.5", correct: true, why: "$\\tfrac{h + a - 1}{n + a + b - 2} = \\tfrac{7}{11}$." },
          { id: "b", text: "1, the same as maximum likelihood", misconception: "map-equals-mle", why: "With 3 tosses the prior still carries a lot of weight." },
          { id: "c", text: "0.5, the prior's centre", why: "The data move the estimate away from 0.5." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mom-check-2",
        prompt: "Data from $U(0, \\theta)$ have $\\bar x = 6$. Find the method-of-moments estimate of $\\theta$.",
        options: [
          { id: "a", text: "12", correct: true, why: "$E[X] = \\theta/2$." },
          { id: "b", text: "6", why: "$\\theta$ is the top of the range, not the mean." },
          { id: "c", text: "3", why: "Solve $\\theta/2 = 6$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "L2 regularisation is MAP estimation with a normal prior on the weights, and the lasso is MAP with a Laplace prior (§{regularization}). Weight decay therefore encodes a belief that small weights are more plausible before any data are seen.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mom-produce-1", prompt: "Counts 2, 0, 3, 1, 4 are modelled as Po($\\lambda$). Find the method-of-moments $\\hat\\lambda$.", answer: 2, explain: "$E[X] = \\lambda$, so $\\hat\\lambda = \\bar x$." },
        { kind: "number", id: "mom-produce-2", prompt: "Exponential data have $\\bar x = 5$. Find the method-of-moments $\\hat\\lambda$.", answer: 0.2, explain: "$1/\\bar x$." },
        {
          kind: "mc",
          id: "mom-produce-3",
          prompt: "With 3 tosses and a Beta(10, 10) prior, the MAP estimate of $p$ is",
          options: [
            { id: "a", text: "pulled strongly towards 0.5", correct: true, why: "The prior acts like 18 extra tosses split evenly." },
            { id: "b", text: "the same as the MLE", misconception: "map-equals-mle", why: "Only with lots of data does the prior's influence fade." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mom-review-1", prompt: "7 successes in 20 Bernoulli trials. Find the method-of-moments estimate of $p$.", answer: 0.35, explain: "$\\bar x = 7/20$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "posterior mode and mean for a proportion",
      body: "With a Beta$(a, b)$ prior and $k$ successes in $n$ trials, the posterior is Beta$(a + k, b + n - k)$. Its mode, the MAP estimate, is $\\dfrac{k + a - 1}{n + a + b - 2}$; its mean is $\\dfrac{k + a}{n + a + b}$. **Laplace smoothing** $\\dfrac{k + 1}{n + 2}$ is the posterior mean under a uniform prior.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "two-parameter moments",
      statement: "Normal: $\\hat\\mu = \\bar x$, $\\hat\\sigma^2 = \\tfrac1n\\sum(x_i - \\bar x)^2$. Gamma$(\\alpha, \\lambda)$: $\\hat\\alpha = \\bar x^2/\\hat\\sigma^2$ and $\\hat\\lambda = \\bar x/\\hat\\sigma^2$.",
      proof: ["Matching two moments is the same as matching the mean and the variance. For the gamma, $\\alpha/\\lambda = \\bar x$ and $\\alpha/\\lambda^2 = \\hat\\sigma^2$; divide to get $\\lambda$, then $\\alpha$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "MAP with a normal prior is ridge",
      statement: "In linear regression with noise $N(0, \\sigma^2)$ and prior $\\vec w \\sim N(\\vec 0, \\tau^2I)$, the MAP weights minimise $\\text{SSE} + \\lambda|\\vec w|^2$ with $\\lambda = \\sigma^2/\\tau^2$.",
      proof: ["$\\ln L = -\\tfrac{\\text{SSE}}{2\\sigma^2} + \\text{const}$ and $\\ln\\pi = -\\tfrac{|\\vec w|^2}{2\\tau^2} + \\text{const}$. Maximising their sum is minimising $\\text{SSE} + \\tfrac{\\sigma^2}{\\tau^2}|\\vec w|^2$. A vaguer prior (larger $\\tau$) means a smaller penalty."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "consistency and its limits",
      statement: "Method-of-moments estimators are consistent when the moment equations have a continuous inverse, because sample moments converge to true moments (§{lln-inequalities}). They can still give impossible values in a particular sample.",
      proof: ["For $U(0, \\theta)$ with data 1, 2, 9: $2\\bar x = 8$, yet $\\theta$ must be at least 9."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Counts 1, 3, 2, 2, 4, 0 are modelled as Poisson. Find the method-of-moments estimate.",
      solution: ["$E[X] = \\lambda$.", "$\\hat\\lambda = \\bar x = 12/6 = 2$."],
      result: "$\\hat\\lambda = 2$.",
    },
    {
      type: "example",
      level: 2,
      title: "a gamma fit",
      problem: "Claim sizes have $\\bar x = 6$ and $\\hat\\sigma^2 = 12$. Fit a gamma by the method of moments.",
      solution: ["$\\hat\\lambda = 6/12 = 0.5$.", "$\\hat\\alpha = 36/12 = 3$."],
      result: "Gamma(3, 0.5).",
    },
    {
      type: "example",
      level: 3,
      title: "smoothing a zero",
      problem: "A word appears in 0 of 50 spam emails. Compare the MLE and the MAP estimate under a Beta(2, 2) prior.",
      solution: ["MLE: $0/50 = 0$, which would make any email containing the word impossible as spam.", "MAP: $\\dfrac{0 + 1}{50 + 2} = \\tfrac{1}{52} \\approx 0.019$."],
      result: "0 against about 0.019.",
    },
    {
      type: "example",
      level: 3,
      title: "the ridge penalty from a prior",
      problem: "Noise has SD 2 and the prior on each weight has SD 1. Find the ridge penalty $\\lambda$.",
      solution: ["$\\lambda = \\sigma^2/\\tau^2 = 4/1$.", "A tighter prior or noisier data both mean stronger shrinkage."],
      result: "$\\lambda = 4$.",
    },
  ],
  pitfalls: [
    { wrong: "For an exponential, $\\hat\\lambda = \\bar x$.", right: "$E[X] = 1/\\lambda$, so $\\hat\\lambda = 1/\\bar x$." },
    { wrong: "A moment estimate is always possible.", right: "It can fall outside the parameter range; check it against the data." },
    { wrong: "MAP and MLE are the same.", right: "They agree only when the prior is flat or the data overwhelm it." },
  ],
  formulas: [
    { label: "Moment equations", tex: "E[X^k](\\theta) = \\tfrac1n\\textstyle\\sum x_i^k" },
    { label: "MAP", tex: "\\arg\\max_\\theta\\ \\ln L(\\theta) + \\ln\\pi(\\theta)" },
    { label: "Beta prior, MAP", tex: "\\dfrac{k + a - 1}{n + a + b - 2}" },
    { label: "Ridge from a prior", tex: "\\lambda = \\sigma^2/\\tau^2" },
  ],
  exercises: [
    ex(1, num("momx-ex-1", "12 successes in 40 Bernoulli trials. Find the method-of-moments estimate of $p$.", 0.3, "$\\bar x$."), ["$12/40 = 0.3$."]),
    ex(1, num("momx-ex-2", "Poisson counts 1, 1, 2, 4. Find $\\hat\\lambda$ by moments.", 2, "$8/4$."), ["$2$."]),
    ex(2, num("momx-ex-3", "Exponential data have $\\bar x = 0.5$. Find $\\hat\\lambda$.", 2, "$1/\\bar x$."), ["$2$."]),
    ex(2, num("momx-ex-4", "$U(0, \\theta)$ data have $\\bar x = 3.5$. Find $\\hat\\theta$ by moments.", 7, "$2\\bar x$."), ["$7$."]),
    ex(2, num("momx-ex-5", "Gamma data have $\\bar x = 4$ and $\\hat\\sigma^2 = 8$. Find $\\hat\\alpha$.", 2, "$\\bar x^2/\\hat\\sigma^2$."), ["$16/8 = 2$."]),
    ex(2, num("momx-ex-6", "Same data. Find $\\hat\\lambda$.", 0.5, "$\\bar x/\\hat\\sigma^2$."), ["$4/8 = 0.5$."]),
    ex(3, fr("momx-ex-7", "4 heads in 4 tosses, prior Beta(3, 3). Find the MAP estimate of $p$.", 6 / 8, "$\\tfrac{k + a - 1}{n + a + b - 2}$."), ["$\\tfrac{4 + 2}{4 + 4} = \\tfrac34$."]),
    ex(3, num("momx-ex-8", "Same data and prior. Find the posterior mean.", 0.7, "$\\tfrac{k + a}{n + a + b}$."), ["$\\tfrac{7}{10} = 0.7$."]),
    ex(3, num("momx-ex-9", "Noise variance is 9 and the prior variance of each weight is 3. Find the ridge penalty.", 3, "$\\sigma^2/\\tau^2$."), ["$9/3 = 3$."]),
    ex(3, mc("momx-ex-10", "Data 1, 2, 9 come from $U(0, \\theta)$. The moment estimate $2\\bar x = 8$ is", ["impossible, since a value of 9 was observed", "$\\theta$ must be at least 9."], [["the best estimate available", "The maximum, 9, already rules it out."], ["unbiased, so acceptable", "Unbiased on average, but impossible here."]]), ["Moment estimates ignore constraints the data impose; the maximum-likelihood estimate here is 9."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 4 + lv;
      const xs = Array.from({ length: k }, () => r.int(1, 8 * lv + 2));
      const m = xs.reduce((s, x) => s + x, 0) / k;
      const kind = r.pick(["Poisson", "exponential", "uniform"] as const);
      const est = kind === "Poisson" ? m : kind === "exponential" ? 1 / m : 2 * m;
      const what = kind === "Poisson" ? "$\\lambda$ of a Poisson model" : kind === "exponential" ? "the rate $\\lambda$ of an exponential model" : "$\\theta$ of a $U(0, \\theta)$ model";
      return n(
        `Data: ${xs.join(", ")}. Find the method-of-moments estimate of ${what} (3 decimals).`,
        Math.round(est * 1000) / 1000,
        `$\\bar x = ${r2(m)}$; ${kind === "Poisson" ? "$E[X] = \\lambda$, so $\\hat\\lambda = \\bar x$" : kind === "exponential" ? "$E[X] = 1/\\lambda$, so $\\hat\\lambda = 1/\\bar x$" : "$E[X] = \\theta/2$, so $\\hat\\theta = 2\\bar x$"} $\\approx ${Math.round(est * 1000) / 1000}$.`,
        0.001,
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.int(1, 2 + 2 * lv);
      const b = r.int(1, 2 + 2 * lv);
      const nn = r.int(2, 10 * lv);
      const k = r.int(0, nn);
      const mapOk = a + b + nn > 2 && k + a - 1 >= 0 && nn - k + b - 1 >= 0;
      const est = mapOk ? (k + a - 1) / (nn + a + b - 2) : (k + a) / (nn + a + b);
      return n(
        `${k} successes in ${nn} trials, with a Beta(${a}, ${b}) prior. Find the ${mapOk ? "MAP estimate" : "posterior mean"} of $p$ (3 decimals).`,
        Math.round(est * 1000) / 1000,
        mapOk ? `$\\tfrac{${k} + ${a} - 1}{${nn} + ${a} + ${b} - 2} \\approx ${Math.round(est * 1000) / 1000}$.` : `$\\tfrac{${k} + ${a}}{${nn} + ${a} + ${b}} \\approx ${Math.round(est * 1000) / 1000}$.`,
        0.001,
      );
    },
  },
  {
    type: "error",
    make: (r) => {
      const xbar = r.pick([2, 4, 5, 8, 10]);
      return mcNumbers(
        `Exponential waiting times have $\\bar x = ${xbar}$ minutes. A student writes "$\\hat\\lambda = ${xbar}$". What is wrong?`,
        { text: `$E[X] = 1/\\lambda$, so $\\hat\\lambda = ${r2(1 / xbar)}$`, why: "Match the sample mean to the formula for the mean." },
        [
          { text: "Nothing: the rate is the mean", why: "The mean wait is the reciprocal of the rate.", misconception: "mom-rate-mean" },
          { text: `$\\hat\\lambda$ should be $${xbar * xbar}$`, why: "Squaring has no basis here." },
        ],
      );
    },
  },
];
