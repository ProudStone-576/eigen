import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Gamma, beta, Weibull, lognormal and heavy-tailed distributions (Pareto, Cauchy), with the other named shapes. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "continuous-family",
  title: "Gamma, beta, Weibull & lognormal",
  summary: "A handful of shapes cover most continuous data, each from a mechanism: the gamma from sums of waiting times, the beta for proportions on [0, 1], the Weibull for lifetimes, the lognormal for products. Heavy-tailed laws such as the Pareto and Cauchy are where averages stop behaving.",
  deps: ["uniform-exponential", "normal", "mgf"],
  pos: { x: 2, y: 3 },
  glossary: [
    { term: "shape and rate", meaning: "Gamma$(\\alpha, \\lambda)$ has shape $\\alpha$ and rate $\\lambda$; some books use the scale $\\theta = 1/\\lambda$ instead." },
    { term: "heavy tail", meaning: "Probabilities of extreme values that fall off slowly, like a power of $x$, rather than exponentially." },
    { term: "lognormal", meaning: "$X$ is lognormal when $\\ln X$ is normal; it arises from products of many positive factors." },
  ],
  misconceptions: {
    "cauchy-mean": "Assumes every distribution has a mean, so averages of many very heavy-tailed draws must settle down.",
    "lognormal-mean-exp-mu": "Takes the mean of a lognormal to be $e^\\mu$, forgetting the factor $e^{\\sigma^2/2}$; $e^\\mu$ is the median.",
  },
  steps: [
    {
      type: "motivate",
      title: "Shapes with reasons",
      body: "Waiting times, proportions, lifetimes and incomes each have a typical shape, and each shape comes from how the quantity arises: by adding waits, by being a fraction, by the weakest part failing, or by multiplying many factors. Knowing the mechanism tells you which distribution to fit.",
      realWorld: {
        title: "Reliability engineering",
        body: "Bearings and batteries are given Weibull lifetimes. Its shape parameter says whether failures come early (defects), at random, or late (wear-out), and that decides the maintenance schedule.",
      },
    },
    {
      type: "truth",
      statement: "**Gamma**$(\\alpha, \\lambda)$: density $\\propto x^{\\alpha - 1}e^{-\\lambda x}$ for $x > 0$, mean $\\alpha/\\lambda$, variance $\\alpha/\\lambda^2$; with whole $\\alpha$ it is the sum of $\\alpha$ independent $\\mathrm{Exp}(\\lambda)$ waits. **Beta**$(a, b)$: density $\\propto x^{a - 1}(1 - x)^{b - 1}$ on $[0, 1]$, mean $\\dfrac{a}{a + b}$. **Weibull**$(k, \\lambda)$: $P(T > t) = e^{-(t/\\lambda)^k}$. **Lognormal**: $\\ln X \\sim N(\\mu, \\sigma^2)$, median $e^\\mu$, mean $e^{\\mu + \\sigma^2/2}$.",
      body: "Heavy tails: the **Pareto** has $P(X > x) = (x_m/x)^\\alpha$ for $x \\ge x_m$, and an infinite mean when $\\alpha \\le 1$. The **Cauchy** has no mean at all: the average of $n$ standard Cauchy draws is again standard Cauchy. Other named shapes include the **Laplace** (two back-to-back exponentials), the **logistic**, the **Rayleigh** and the **Gumbel**, which describes the largest of many values.",
    },
    {
      type: "predict",
      misconception: "cauchy-mean",
      item: {
        kind: "mc",
        id: "cfm-predict-1",
        prompt: "You average 10,000 independent draws from a standard Cauchy distribution. The average is",
        options: [
          { id: "a", text: "as variable as a single draw: the Cauchy has no mean", correct: true, why: "The mean of $n$ draws is again standard Cauchy." },
          { id: "b", text: "very close to 0, by the law of large numbers", misconception: "cauchy-mean", why: "The law needs a finite mean." },
          { id: "c", text: "exactly 0, by symmetry", why: "Symmetry gives a median of 0, not an average that settles." },
        ],
      },
      reveal: {
        body: "The law of large numbers needs a finite mean (§{lln-inequalities}). The Cauchy's density falls off like $1/x^2$, so rare, enormous draws keep jolting the average however many you take. Financial returns and file sizes can have tails heavy enough to cause the same trouble: report medians and quantiles.",
      },
      resolve: {
        kind: "mc",
        id: "cfm-resolve-1",
        prompt: "What does the law of large numbers need?",
        options: [
          { id: "a", text: "Independent draws from a distribution with a finite mean", correct: true, why: "Without a mean there is nothing to converge to." },
          { id: "b", text: "Only independent draws", misconception: "cauchy-mean", why: "The Cauchy has independent draws and no limit." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cfm-check-1",
        prompt: "$\\ln X \\sim N(2, 1)$. Find $E[X]$.",
        options: [
          { id: "a", text: "$e^{2.5} \\approx 12.2$", correct: true, why: "$e^{\\mu + \\sigma^2/2}$." },
          { id: "b", text: "$e^2 \\approx 7.39$", misconception: "lognormal-mean-exp-mu", why: "That is the median; the long right tail pulls the mean higher." },
          { id: "c", text: "$2$", why: "That is the mean of $\\ln X$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cfm-check-2",
        prompt: "A click rate is described by a Beta(2, 6) distribution. Its mean is",
        options: [
          { id: "a", text: "0.25", correct: true, why: "$2/(2 + 6)$." },
          { id: "b", text: "0.33", why: "That is $2/6$." },
          { id: "c", text: "0.167", why: "That is the mode, $(a - 1)/(a + b - 2)$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The beta distribution describes uncertainty about a probability such as a click rate: starting from Beta(1, 1), after $s$ clicks and $f$ non-clicks it becomes Beta($1 + s$, $1 + f$). Heavy-tailed losses and gradient noise are the reason for robust losses and gradient clipping.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cfm-produce-1", prompt: "Find the mean of Gamma(3, 2), rate parameterisation.", answer: 1.5, explain: "$\\alpha/\\lambda$." },
        { kind: "number", id: "cfm-produce-2", prompt: "A Weibull lifetime has $k = 2$ and $\\lambda = 10$. Find $P(T > 10)$ to 3 decimals.", answer: Math.round(Math.exp(-1) * 1000) / 1000, tolerance: 0.001, explain: "$e^{-(10/10)^2} = e^{-1}$." },
        {
          kind: "mc",
          id: "cfm-produce-3",
          prompt: "$\\ln X \\sim N(\\mu, \\sigma^2)$. Then $e^\\mu$ is $X$'s",
          options: [
            { id: "a", text: "median", correct: true, why: "$\\ln$ is increasing, so it keeps the median." },
            { id: "b", text: "mean", misconception: "lognormal-mean-exp-mu", why: "The mean is $e^{\\mu + \\sigma^2/2}$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cfm-review-1", prompt: "Find the mean of Beta(3, 3).", answer: 0.5, explain: "$3/6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "gamma and beta functions",
      body: "$\\Gamma(\\alpha) = \\int_0^\\infty x^{\\alpha - 1}e^{-x}\\,dx$, with $\\Gamma(n) = (n - 1)!$ and $\\Gamma(\\tfrac12) = \\sqrt\\pi$. The gamma density is $\\dfrac{\\lambda^\\alpha x^{\\alpha - 1}e^{-\\lambda x}}{\\Gamma(\\alpha)}$, and $B(a, b) = \\dfrac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a + b)}$ normalises the beta. The $\\chi^2_k$ distribution is Gamma$(k/2, 1/2)$.",
    },
    {
      type: "definition",
      term: "hazard rate",
      body: "The **hazard** $h(t) = f(t)/P(T > t)$ is the failure rate among items still working at time $t$. For the Weibull, $h(t) = \\tfrac k\\lambda(t/\\lambda)^{k - 1}$: falling if $k < 1$ (early failures), constant if $k = 1$ (the exponential), rising if $k > 1$ (wear-out).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "gamma facts",
      statement: "$\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$. The MGF of Gamma$(\\alpha, \\lambda)$ is $\\left(\\dfrac{\\lambda}{\\lambda - t}\\right)^\\alpha$, so independent Gamma$(\\alpha_i, \\lambda)$ variables add to Gamma$(\\sum\\alpha_i, \\lambda)$.",
      proof: ["Integrate $\\Gamma(\\alpha + 1)$ by parts. The MGF integral reduces to a gamma function; multiplying MGFs (§{mgf}) adds the shapes."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "beta facts",
      statement: "Beta$(a, b)$ has mean $\\dfrac{a}{a + b}$, variance $\\dfrac{ab}{(a + b)^2(a + b + 1)}$ and, for $a, b > 1$, mode $\\dfrac{a - 1}{a + b - 2}$. The $k$th smallest of $n$ independent $U(0, 1)$ values is Beta$(k, n - k + 1)$.",
      proof: ["The moments follow from $\\int_0^1 x^{a}(1 - x)^{b - 1}\\,dx = B(a + 1, b)$. For the order statistic, $k - 1$ values must fall below $x$, one at $x$ and $n - k$ above: a density $\\propto x^{k - 1}(1 - x)^{n - k}$."],
    },
    {
      type: "theorem",
      name: "lognormal moments",
      statement: "If $\\ln X \\sim N(\\mu, \\sigma^2)$, then $E[X] = e^{\\mu + \\sigma^2/2}$, $\\operatorname{Var}(X) = (e^{\\sigma^2} - 1)e^{2\\mu + \\sigma^2}$, and the median is $e^\\mu$. Products of independent lognormals are lognormal.",
      proof: ["$E[X] = E[e^{Y}]$ with $Y$ normal is the normal MGF at $t = 1$: $e^{\\mu + \\sigma^2/2}$. Similarly $E[X^2]$ is the MGF at $t = 2$. Logs of a product add, and sums of independent normals are normal."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "heavy tails",
      statement: "The Pareto has mean $\\dfrac{\\alpha x_m}{\\alpha - 1}$ only when $\\alpha > 1$, and finite variance only when $\\alpha > 2$. With such tails, sample means and variances are unstable and the CLT may fail: summarise with medians and quantiles.",
      proof: ["$E[X] = \\int_{x_m}^\\infty x\\cdot\\alpha x_m^\\alpha x^{-\\alpha - 1}\\,dx$ converges only if $\\alpha > 1$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Three jobs run one after another, each taking an exponential time with rate 2 per hour. Describe the total time.",
      solution: ["A sum of 3 independent Exp(2) waits is Gamma(3, 2).", "Mean $3/2 = 1.5$ hours, variance $3/4 = 0.75$."],
      result: "Gamma(3, 2): mean 1.5 h, variance 0.75.",
    },
    {
      type: "example",
      level: 2,
      title: "Weibull lifetimes",
      problem: "Bearings have Weibull lifetimes with $k = 2$ and $\\lambda = 1000$ hours. Find P(a bearing lasts 500 hours) and the median lifetime.",
      solution: ["$P(T > 500) = e^{-(0.5)^2} = e^{-0.25} \\approx 0.779$.", "Median: $e^{-(m/1000)^2} = \\tfrac12$ gives $m = 1000\\sqrt{\\ln 2} \\approx 833$ hours."],
      result: "About 0.779; about 833 hours.",
    },
    {
      type: "example",
      level: 3,
      title: "income",
      problem: "Log income (in rupees) is $N(10, 0.64)$. Find the median and mean income.",
      solution: ["Median $e^{10} \\approx 22{,}026$.", "Mean $e^{10 + 0.32} = e^{10.32} \\approx 30{,}333$: the long right tail pulls the mean about 38% above the median."],
      result: "Median ≈ ₹22,026; mean ≈ ₹30,333.",
    },
    {
      type: "example",
      level: 3,
      title: "a Pareto tail",
      problem: "$X$ is Pareto with $x_m = 1$ and $\\alpha = 3$. Find $E[X]$ and $P(X > 10)$.",
      solution: [
        "$E[X] = \\tfrac{3 \\times 1}{2} = 1.5$, and $P(X > 10) = (1/10)^3 = 0.001$.",
        "Further out the difference from light tails is dramatic: $P(X > 100) = 10^{-6}$, while an exponential with the same mean gives $e^{-100/1.5} \\approx 10^{-29}$.",
      ],
      result: "1.5 and 0.001.",
    },
  ],
  pitfalls: [
    { wrong: "The mean of a lognormal is $e^\\mu$.", right: "That is the median; the mean is $e^{\\mu + \\sigma^2/2}$." },
    { wrong: "Averages of any distribution settle down.", right: "Not for the Cauchy, or Paretos with $\\alpha \\le 1$." },
    { wrong: "Gamma$(\\alpha, \\lambda)$ has mean $\\alpha\\lambda$.", right: "With a rate, $\\alpha/\\lambda$; with a scale $\\theta$, $\\alpha\\theta$. Check the convention." },
  ],
  formulas: [
    { label: "Gamma", tex: "E = \\alpha/\\lambda,\\quad \\operatorname{Var} = \\alpha/\\lambda^2" },
    { label: "Beta", tex: "E = \\dfrac{a}{a + b},\\quad \\operatorname{Var} = \\dfrac{ab}{(a + b)^2(a + b + 1)}" },
    { label: "Weibull", tex: "P(T > t) = e^{-(t/\\lambda)^k}" },
    { label: "Lognormal", tex: "\\text{median } e^\\mu,\\ \\text{mean } e^{\\mu + \\sigma^2/2}" },
    { label: "Pareto", tex: "P(X > x) = (x_m/x)^\\alpha" },
  ],
  exercises: [
    ex(1, num("cfmx-ex-1", "Find the mean of Gamma(4, 2).", 2, "$\\alpha/\\lambda$."), ["$4/2 = 2$."]),
    ex(1, num("cfmx-ex-2", "Find the variance of Gamma(4, 2).", 1, "$\\alpha/\\lambda^2$."), ["$4/4 = 1$."]),
    ex(1, num("cfmx-ex-3", "Find the mean of Beta(2, 3).", 0.4, "$a/(a + b)$."), ["$2/5 = 0.4$."]),
    ex(2, num("cfmx-ex-4", "Find $\\Gamma(5)$.", 24, "$(n - 1)!$."), ["$4! = 24$."]),
    ex(2, dp("cfmx-ex-5", "A Weibull lifetime has $k = 2$, $\\lambda = 10$. Find $P(T > 5)$.", Math.exp(-0.25), "$e^{-(0.5)^2}$."), ["$e^{-0.25} \\approx 0.779$."]),
    ex(2, dp("cfmx-ex-6", "$\\ln X \\sim N(0, 1)$. Find $E[X]$.", Math.exp(0.5), "$e^{\\sigma^2/2}$."), ["$e^{0.5} \\approx 1.649$."]),
    ex(2, dp("cfmx-ex-7", "$\\ln X \\sim N(3, 4)$. Find the median of $X$.", Math.exp(3), "$e^\\mu$."), ["$e^3 \\approx 20.086$."]),
    ex(3, fr("cfmx-ex-8", "Find the variance of Beta(3, 5).", 15 / (64 * 9), "$ab/((a + b)^2(a + b + 1))$."), ["$\\dfrac{15}{64 \\times 9} = \\dfrac{15}{576} \\approx 0.026$."]),
    ex(3, fr("cfmx-ex-9", "$X$ is Pareto with $x_m = 2$ and $\\alpha = 4$. Find $E[X]$.", 8 / 3, "$\\alpha x_m/(\\alpha - 1)$."), ["$\\tfrac{4 \\times 2}{3} = \\tfrac83$."]),
    ex(3, num("cfmx-ex-10", "Three independent Gamma(2, 5) variables are added. Find the mean of the sum.", 1.2, "Gamma(6, 5)."), ["Shapes add: Gamma(6, 5), mean $6/5 = 1.2$."]),
    ex(3, mc("cfmx-ex-11", "A Weibull model with shape $k = 0.6$ suggests", ["failures are most likely early on (a falling hazard)", "$k < 1$ means a decreasing hazard."], [["wear-out: failures rise with age", "That is $k > 1$."], ["failures at a constant rate", "That is $k = 1$."]]), ["$h(t) \\propto t^{k - 1} = t^{-0.4}$, which falls with $t$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.int(1, 4 + 2 * lv);
      const l = r.pick([0.5, 1, 2, 4, 5]);
      const which = lv === 1 ? "mean" : r.pick(["mean", "variance"] as const);
      const v = which === "mean" ? a / l : a / (l * l);
      return n(`Find the ${which} of Gamma(${a}, ${l}), where ${l} is the rate (2 decimals).`, r2(v), which === "mean" ? `$\\alpha/\\lambda = ${a}/${l} = ${r2(v)}$.` : `$\\alpha/\\lambda^2 = ${a}/${l * l} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.int(1, 3 + 2 * lv);
      const b = r.int(1, 3 + 2 * lv);
      const v = a / (a + b);
      return n(`Find the mean of Beta(${a}, ${b}) (3 decimals).`, Math.round(v * 1000) / 1000, `$${a}/(${a} + ${b}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const mu = r.int(1, 5);
      const s2 = r.pick([0.5, 1, 2]);
      const med = Math.exp(mu);
      const mean = Math.exp(mu + s2 / 2);
      return mcNumbers(
        `$\\ln X \\sim N(${mu}, ${s2})$. Find $E[X]$.`,
        { text: r2(mean).toString(), why: `$e^{${mu} + ${s2}/2} = e^{${mu + s2 / 2}} \\approx ${r2(mean)}$.` },
        [
          { text: r2(med).toString(), why: "That is the median, $e^\\mu$.", misconception: "lognormal-mean-exp-mu" },
          { text: String(mu), why: "That is the mean of $\\ln X$." },
        ],
      );
    },
  },
];
