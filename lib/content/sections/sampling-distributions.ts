import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** χ², t and F: construction, moments, the sample variance, t² = F, Fisher's z for correlations. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "sampling-distributions",
  title: "χ², t and F distributions",
  summary: "Sums of squared standard normals give χ²; a normal divided by the root of an independent χ² over its degrees of freedom gives t; a ratio of two such χ² terms gives F. They are the exact sampling distributions of the sample variance, the t statistic and variance ratios when the data are normal.",
  deps: ["clt", "normal", "mgf"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "degrees of freedom", meaning: "The number of independent squared normals behind a χ²; for a sample variance, $n - 1$." },
    { term: "χ² distribution", meaning: "The distribution of $Z_1^2 + \\dots + Z_k^2$ for independent standard normals." },
    { term: "F distribution", meaning: "The ratio of two independent χ² variables, each divided by its degrees of freedom." },
  ],
  misconceptions: {
    "sample-variance-normal": "Thinks the sample variance is normally distributed, symmetric about σ², even for small samples.",
    "df-equals-n": "Uses n degrees of freedom for (n − 1)s²/σ², forgetting that estimating the mean uses one up.",
  },
  steps: [
    {
      type: "motivate",
      title: "Where the tables come from",
      body: "The t-test (§{t-tests}) and the chi-square test (§{chi-square}) compare a statistic with a table of critical values. Those tables describe three distributions built from normal variables, and knowing how they are built tells you when they apply.",
      realWorld: {
        title: "Filling bottles",
        body: "A filling machine must keep the variance of volumes small, not just the mean right. Testing whether the variance has crept up uses the χ² distribution of the sample variance.",
      },
    },
    {
      type: "truth",
      statement: "For independent $Z_1, \\dots, Z_k \\sim N(0, 1)$: $\\chi^2_k = Z_1^2 + \\dots + Z_k^2$, with mean $k$ and variance $2k$. $t_k = \\dfrac{Z}{\\sqrt{\\chi^2_k/k}}$ with $Z$ independent of the $\\chi^2$. $F_{k_1, k_2} = \\dfrac{\\chi^2_{k_1}/k_1}{\\chi^2_{k_2}/k_2}$ with independent numerator and denominator.",
      body: "For a normal sample, $\\dfrac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2_{n-1}$, independently of $\\bar x$. Hence $\\dfrac{\\bar x - \\mu}{s/\\sqrt n} \\sim t_{n-1}$, and the ratio $\\dfrac{s_1^2/\\sigma_1^2}{s_2^2/\\sigma_2^2}$ of two independent samples is $F_{n_1 - 1,\\,n_2 - 1}$.",
    },
    {
      type: "predict",
      misconception: "sample-variance-normal",
      item: {
        kind: "mc",
        id: "smd-predict-1",
        prompt: "Samples of 5 are drawn from a normal population with $\\sigma^2 = 10$. Is $s^2$ as likely to be 5 above 10 as 5 below it?",
        options: [
          { id: "a", text: "No: $s^2$ follows a right-skewed scaled $\\chi^2_4$, falling below 10 more often but overshooting further", correct: true, why: "$4s^2/10 \\sim \\chi^2_4$." },
          { id: "b", text: "Yes: $s^2$ is normal around $\\sigma^2$", misconception: "sample-variance-normal", why: "That is only approximately true for large $n$." },
          { id: "c", text: "$s^2$ always equals 10", why: "It varies from sample to sample." },
        ],
      },
      reveal: {
        body: "$4s^2/10 \\sim \\chi^2_4$, which has mean 4, median about 3.36 and a long right tail. So $s^2$ averages 10 but is below 10 more than half the time, and it can never go below 0. Intervals for a variance therefore use $\\chi^2$ quantiles and are not symmetric (§{intervals-more}).",
      },
      resolve: {
        kind: "mc",
        id: "smd-resolve-1",
        prompt: "For normal data, what is the distribution of $(n - 1)s^2/\\sigma^2$?",
        options: [
          { id: "a", text: "$\\chi^2_{n-1}$", correct: true, why: "A sum of $n - 1$ independent squared standard normals." },
          { id: "b", text: "A normal distribution centred at $n - 1$", misconception: "sample-variance-normal", why: "It is right-skewed, especially for small $n$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "smd-check-1",
        prompt: "A normal sample of 10 gives $s^2$. How many degrees of freedom has $(n - 1)s^2/\\sigma^2$?",
        options: [
          { id: "a", text: "9", correct: true, why: "Estimating $\\bar x$ uses one up." },
          { id: "b", text: "10", misconception: "df-equals-n", why: "The deviations from $\\bar x$ always sum to 0, so only 9 are free." },
          { id: "c", text: "1", why: "There are many squared deviations." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "smd-check-2",
        prompt: "Find the mean and variance of $\\chi^2_6$.",
        options: [
          { id: "a", text: "6 and 12", correct: true, why: "$k$ and $2k$." },
          { id: "b", text: "6 and 6", why: "The variance is $2k$." },
          { id: "c", text: "3 and 6", why: "The mean is $k$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The t-statistics and F-test that statsmodels prints for every linear regression come from these distributions. The χ² distribution also gives the distribution of squared Mahalanobis distances (§{multivariate-normal}), used to flag multivariate outliers.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "smd-produce-1", prompt: "Find the mean of $\\chi^2_9$.", answer: 9, explain: "$k$." },
        { kind: "number", id: "smd-produce-2", prompt: "Find the variance of $\\chi^2_9$.", answer: 18, explain: "$2k$." },
        {
          kind: "mc",
          id: "smd-produce-3",
          prompt: "For a normal sample of 15, $(n - 1)s^2/\\sigma^2$ has",
          options: [
            { id: "a", text: "14 degrees of freedom", correct: true, why: "$n - 1$." },
            { id: "b", text: "15 degrees of freedom", misconception: "df-equals-n", why: "One is used estimating the mean." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "smd-review-1", prompt: "$X \\sim \\chi^2_3$ and $Y \\sim \\chi^2_5$ are independent. $X + Y \\sim \\chi^2_k$; find $k$.", answer: 8, explain: "Degrees of freedom add." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "χ² critical values",
      body: "Lower and upper 2.5% points of $\\chi^2_k$: $k = 4$: 0.484, 11.143; $k = 9$: 2.700, 19.023; $k = 15$: 6.262, 27.488; $k = 24$: 12.401, 39.364. The $\\chi^2_k$ density is Gamma$(k/2, 1/2)$ (§{continuous-family}).",
    },
    {
      type: "definition",
      term: "properties of t and F",
      body: "$t_k$ is symmetric with mean 0 (for $k > 1$) and variance $\\dfrac{k}{k - 2}$ (for $k > 2$); $t_1$ is the Cauchy. $F_{k_1, k_2}$ has mean $\\dfrac{k_2}{k_2 - 2}$, and $1/F_{k_1, k_2}$ is $F_{k_2, k_1}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "χ² facts",
      statement: "$\\chi^2_k$ has mean $k$ and variance $2k$, its MGF is $(1 - 2t)^{-k/2}$, and independent $\\chi^2_a + \\chi^2_b = \\chi^2_{a+b}$.",
      proof: ["$E[Z^2] = 1$ and $E[Z^4] = 3$, so $\\operatorname{Var}(Z^2) = 2$; sum over $k$ terms. MGFs of independent terms multiply, adding exponents (§{mgf})."],
    },
    {
      type: "theorem",
      name: "the sample variance",
      statement: "For a normal sample, $\\dfrac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2_{n-1}$, and $s^2$ is independent of $\\bar x$.",
      proof: [
        "Rotate coordinates so that one axis points along $(1, \\dots, 1)/\\sqrt n$. Normal data stay independent normal under rotations; the coordinate on that axis is $\\sqrt n\\,\\bar x$.",
        "The squared distance in the other $n - 1$ directions is $\\sum(x_i - \\bar x)^2$, a sum of $n - 1$ independent squared normals times $\\sigma^2$, and it doesn't involve $\\bar x$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "t squared is F",
      statement: "$t_k^2 = F_{1, k}$. So a two-sided t-test is the same as an F-test with one numerator degree of freedom.",
      proof: ["$t_k^2 = \\dfrac{Z^2}{\\chi^2_k/k} = \\dfrac{\\chi^2_1/1}{\\chi^2_k/k}$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "Fisher's z for a correlation",
      statement: "For a bivariate normal sample, $z = \\tanh^{-1}r = \\tfrac12\\ln\\dfrac{1 + r}{1 - r}$ is approximately $N\\!\\left(\\tanh^{-1}\\rho,\\ \\tfrac{1}{n - 3}\\right)$.",
      proof: ["The sampling distribution of $r$ is skewed when $\\rho \\neq 0$; the transformation stretches it into near-normality with a variance that doesn't depend on $\\rho$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the mean and SD of $\\chi^2_8$.",
      solution: ["Mean $k = 8$.", "Variance $2k = 16$, so SD 4."],
      result: "8 and 4.",
    },
    {
      type: "example",
      level: 2,
      title: "a variance statement",
      problem: "A normal sample of 10 is drawn with $\\sigma^2 = 4$. Find $P(s^2 > 8.454)$.",
      solution: ["$\\dfrac{9s^2}{4} > \\dfrac{9 \\times 8.454}{4} = 19.02$.", "$P(\\chi^2_9 > 19.023) = 0.025$."],
      result: "0.025.",
    },
    {
      type: "example",
      level: 2,
      title: "a variance ratio",
      problem: "Sample 1: $n = 10$, $s^2 = 12$. Sample 2: $n = 16$, $s^2 = 4$. Under equal population variances, what is the distribution of $s_1^2/s_2^2$, and its value?",
      solution: ["$F = 12/4 = 3$.", "Under $\\sigma_1 = \\sigma_2$ it follows $F_{9,\\,15}$."],
      result: "$F = 3$ on $(9, 15)$ degrees of freedom.",
    },
    {
      type: "example",
      level: 3,
      title: "an interval for a correlation",
      problem: "$r = 0.6$ from $n = 28$ bivariate normal pairs. Find a 95% interval for $\\rho$.",
      solution: [
        "$z = \\tanh^{-1}0.6 \\approx 0.693$ with SE $1/\\sqrt{25} = 0.2$.",
        "$0.693 \\pm 1.96 \\times 0.2$ gives $(0.301, 1.085)$; transform back with $\\tanh$.",
      ],
      result: "About $(0.29, 0.80)$: not symmetric around 0.6.",
    },
  ],
  pitfalls: [
    { wrong: "$(n - 1)s^2/\\sigma^2$ has $n$ degrees of freedom.", right: "$n - 1$: the deviations from $\\bar x$ sum to 0." },
    { wrong: "Build an interval for $\\sigma^2$ as $s^2 \\pm$ something.", right: "Use $\\chi^2$ quantiles; the interval is skewed." },
    { wrong: "These distributions hold for any data.", right: "The $\\chi^2$ and F results for variances need normal data and are not robust to heavy tails." },
  ],
  formulas: [
    { label: "χ²", tex: "\\chi^2_k = \\textstyle\\sum_{i=1}^{k}Z_i^2,\\ E = k,\\ \\operatorname{Var} = 2k" },
    { label: "t", tex: "t_k = Z\\big/\\sqrt{\\chi^2_k/k}" },
    { label: "F", tex: "F_{k_1, k_2} = \\dfrac{\\chi^2_{k_1}/k_1}{\\chi^2_{k_2}/k_2}" },
    { label: "Sample variance", tex: "(n - 1)s^2/\\sigma^2 \\sim \\chi^2_{n-1}" },
    { label: "Fisher's z", tex: "\\tanh^{-1}r \\approx N(\\tanh^{-1}\\rho,\\ 1/(n - 3))" },
  ],
  exercises: [
    ex(1, num("smdx-ex-1", "Find the mean of $\\chi^2_{12}$.", 12, "$k$."), ["$12$."]),
    ex(1, num("smdx-ex-2", "Find the variance of $\\chi^2_{12}$.", 24, "$2k$."), ["$24$."]),
    ex(2, num("smdx-ex-3", "Independent $\\chi^2_3$ and $\\chi^2_7$ are added. Find the degrees of freedom of the sum.", 10, "They add."), ["$3 + 7 = 10$."]),
    ex(2, num("smdx-ex-4", "A normal sample of 10 has $s^2 = 8$. Find $(n - 1)s^2/\\sigma^2$ under $\\sigma^2 = 4$.", 18, "$9 \\times 8/4$."), ["$72/4 = 18$, to compare with $\\chi^2_9$."]),
    ex(2, num("smdx-ex-5", "Find the variance of $t_6$.", 1.5, "$k/(k - 2)$."), ["$6/4 = 1.5$: heavier tails than the normal's variance of 1."]),
    ex(2, num("smdx-ex-6", "Sample variances are 15 and 5. Find the F statistic, larger over smaller.", 3, "$15/5$."), ["$3$."]),
    ex(3, num("smdx-ex-7", "A two-sided t-test gives $t = 2.5$. Find the equivalent $F_{1, k}$ statistic.", 6.25, "$t^2$."), ["$2.5^2 = 6.25$."]),
    ex(3, num("smdx-ex-8", "Find the SE of Fisher's $z$ for $n = 103$.", 0.1, "$1/\\sqrt{n - 3}$."), ["$1/\\sqrt{100} = 0.1$."]),
    ex(3, dp("smdx-ex-9", "Find $\\tanh^{-1}(0.5)$.", Math.atanh(0.5), "$\\tfrac12\\ln 3$."), ["$\\tfrac12\\ln\\tfrac{1.5}{0.5} = \\tfrac12\\ln 3 \\approx 0.549$."]),
    ex(3, mc("smdx-ex-10", "For normal data with $n = 8$, $\\dfrac{\\bar x - \\mu}{s/\\sqrt n}$ follows", ["$t_7$", "$n - 1$ degrees of freedom."], [["$N(0, 1)$", "That uses the known $\\sigma$, not $s$."], ["$t_8$", "One degree of freedom goes on estimating the mean."]]), ["$Z/\\sqrt{\\chi^2_7/7}$ with independent numerator and denominator: $t_7$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = r.int(2, 10 + 10 * lv);
      const which = r.pick(["mean", "variance", ...(lv > 1 ? (["SD"] as const) : [])] as const);
      const v = which === "mean" ? k : which === "variance" ? 2 * k : Math.sqrt(2 * k);
      return n(`Find the ${which} of $\\chi^2_{${k}}$${which === "SD" ? " (3 decimals)" : ""}.`, which === "SD" ? Math.round(v * 1000) / 1000 : v, which === "mean" ? `$k = ${k}$.` : which === "variance" ? `$2k = ${2 * k}$.` : `$\\sqrt{2k} = \\sqrt{${2 * k}} \\approx ${Math.round(v * 1000) / 1000}$.`, which === "SD" ? 0.001 : undefined);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(5, 10 + 10 * lv);
      const s2 = r.int(2, 20);
      const sig2 = r.pick([2, 4, 5, 8, 10]);
      const v = ((nn - 1) * s2) / sig2;
      return n(`A normal sample of ${nn} has $s^2 = ${s2}$. Find $(n - 1)s^2/\\sigma^2$ under $\\sigma^2 = ${sig2}$ (2 decimals).`, r2(v), `$${nn - 1} \\times ${s2}/${sig2} = ${r2(v)}$, to compare with $\\chi^2_{${nn - 1}}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.int(5, 40);
      const s = r.pick([
        { what: "$(n - 1)s^2/\\sigma^2$", ans: `$\\chi^2_{${nn - 1}}$`, wrong: `$\\chi^2_{${nn}}$`, why: "One degree of freedom goes on estimating the mean." },
        { what: "$(\\bar x - \\mu)/(s/\\sqrt n)$", ans: `$t_{${nn - 1}}$`, wrong: `$t_{${nn}}$`, why: "$s$ has $n - 1$ degrees of freedom." },
      ]);
      return mcNumbers(
        `For a normal sample of ${nn}, what is the distribution of ${s.what}?`,
        { text: s.ans, why: s.why },
        [
          { text: s.wrong, why: s.why, misconception: "df-equals-n" },
          { text: "$N(0, 1)$", why: "Estimating $\\sigma$ by $s$ changes the distribution." },
        ],
      );
    },
  },
];
