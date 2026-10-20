import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mixture distributions, responsibilities, truncation, zero inflation, copulas and multivariate Bernoulli models. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "mixtures",
  title: "Mixtures, truncation & zero inflation",
  summary: "Real data often come from several sources at once. A mixture picks a component at random and then draws from it: its density is the weighted sum of the components', and its variance adds the spread between component means. Truncated and zero-inflated distributions handle cut-off ranges and excess zeros.",
  deps: ["joint-distributions", "normal", "poisson"],
  pos: { x: 4, y: 3 },
  glossary: [
    { term: "mixture weight", meaning: "The probability $\\pi_j$ that a draw comes from component $j$." },
    { term: "responsibility", meaning: "The probability, after seeing $x$, that it came from component $j$." },
    { term: "zero-inflated", meaning: "A count with extra zeros beyond what its base distribution predicts." },
  ],
  misconceptions: {
    "mixture-is-sum": "Confuses a mixture (pick one component, then draw from it) with the sum of draws from every component.",
    "mixture-variance-average": "Takes a mixture's variance to be the weighted average of the component variances, ignoring the spread between component means.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two humps",
      body: "Adult heights form one bump, but a closer look shows two overlapping bells, one for women and one for men. Clinic waiting times mix quick check-ups with long consultations. When one histogram hides several populations, a mixture models it honestly.",
      realWorld: {
        title: "Insurance claims",
        body: "Most policies make no claim in a year; those that do have claim sizes with a long tail. Insurers model this as a point mass at 0 mixed with a continuous size distribution.",
      },
    },
    {
      type: "truth",
      statement: "A **mixture** with weights $\\pi_1, \\dots, \\pi_k$ (summing to 1) picks component $j$ with probability $\\pi_j$ and then draws from density $f_j$. Its density is $f(x) = \\sum_j\\pi_jf_j(x)$, its mean $\\mu = \\sum_j\\pi_j\\mu_j$, and its variance $\\sum_j\\pi_j\\sigma_j^2 + \\sum_j\\pi_j(\\mu_j - \\mu)^2$.",
      body: "The variance formula is the law of total variance (§{joint-distributions}) with the component label as the condition: spread within components plus spread between them. A **truncated** distribution keeps only part of the range and rescales, $f(x)/P(a \\le X \\le b)$ on $[a, b]$. A **zero-inflated** count is 0 with extra probability $\\pi$ and otherwise follows a base distribution such as a Poisson.",
    },
    {
      type: "predict",
      misconception: "mixture-variance-average",
      item: {
        kind: "mc",
        id: "mix-predict-1",
        prompt: "A mixture puts weight 0.5 on $N(0, 1)$ and 0.5 on $N(4, 1)$. Find its variance.",
        options: [
          { id: "a", text: "5", correct: true, why: "Within 1, plus between 4." },
          { id: "b", text: "1", misconception: "mixture-variance-average", why: "That counts only the spread inside each component." },
          { id: "c", text: "2", why: "Variances of mixtures don't add like those of sums." },
        ],
      },
      reveal: {
        body: "Each component has variance 1, but the values cluster near 0 or near 4, on average 2 from the overall mean 2. The between-component part is $0.5(0 - 2)^2 + 0.5(4 - 2)^2 = 4$, so the variance is $1 + 4 = 5$.",
      },
      resolve: {
        kind: "mc",
        id: "mix-resolve-1",
        prompt: "Why is this mixture's variance larger than each component's?",
        options: [
          { id: "a", text: "Its component means differ, adding spread between components", correct: true, why: "The between term $\\sum\\pi_j(\\mu_j - \\mu)^2$." },
          { id: "b", text: "It isn't: it equals the average component variance", misconception: "mixture-variance-average", why: "That leaves out the between-component spread." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mix-check-1",
        prompt: "$X$ is a 50:50 mixture of $N(0, 1)$ and $N(10, 1)$. Which is true?",
        options: [
          { id: "a", text: "$X$ is usually near 0 or near 10, rarely near 5", correct: true, why: "Each draw comes from one component." },
          { id: "b", text: "$X = A + B$ with $A \\sim N(0, 1)$ and $B \\sim N(10, 1)$, so it is near 10", misconception: "mixture-is-sum", why: "A mixture doesn't add draws from both components." },
          { id: "c", text: "$X \\sim N(5, 2)$", why: "A mixture of normals isn't normal; this one has two humps." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mix-check-2",
        prompt: "A count is 0 with extra probability 0.3, and otherwise Po(2). Find $P(X = 0)$.",
        options: [
          { id: "a", text: "$0.3 + 0.7e^{-2} \\approx 0.395$", correct: true, why: "Structural zeros plus Poisson zeros." },
          { id: "b", text: "$e^{-2} \\approx 0.135$", why: "That ignores the extra zeros." },
          { id: "c", text: "$0.3$", why: "The Poisson part also produces zeros." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gaussian mixture models cluster data by fitting a mixture and assigning each point to the component most likely to have produced it, using the EM algorithm. Zero-inflated models are standard for counts such as purchases per user, where most users buy nothing.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mix-produce-1", prompt: "A mixture puts weight 0.3 on a component with mean 10 and 0.7 on one with mean 20. Find its mean.", answer: 17, explain: "$3 + 14$." },
        { kind: "number", id: "mix-produce-2", prompt: "$X \\sim U(0, 10)$ is truncated to $[0, 4]$. Find its density on $[0, 4]$.", answer: 0.25, explain: "$0.1/0.4$: rescale by the kept probability." },
        {
          kind: "mc",
          id: "mix-produce-3",
          prompt: "A draw from a mixture of two components",
          options: [
            { id: "a", text: "comes from one component, chosen at random by the weights", correct: true, why: "Choose, then draw." },
            { id: "b", text: "adds a draw from each component", misconception: "mixture-is-sum", why: "That is a sum, a different random variable." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mix-review-1", prompt: "A 50:50 mixture of $N(0, 1)$ and $N(2, 1)$. Find its variance.", answer: 2, explain: "Within 1 plus between 1." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "latent label and responsibility",
      body: "A mixture has a hidden label $Z$ with $P(Z = j) = \\pi_j$ and $X \\mid Z = j \\sim f_j$. By Bayes' rule (§{bayes}), the **responsibility** of component $j$ for an observed $x$ is $P(Z = j \\mid X = x) = \\dfrac{\\pi_jf_j(x)}{\\sum_i\\pi_if_i(x)}$.",
    },
    {
      type: "definition",
      term: "copulas, multivariate Bernoulli",
      body: "A **copula** joins chosen marginal distributions into a joint one with a chosen dependence; Sklar's theorem says every joint distribution function can be written $C(F_X(x), F_Y(y))$. A **multivariate Bernoulli** model gives a probability to every pattern of $d$ binary variables, $2^d$ in all.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "moments of a mixture",
      statement: "$E[X] = \\sum_j\\pi_j\\mu_j$ and $\\operatorname{Var}(X) = \\sum_j\\pi_j\\sigma_j^2 + \\sum_j\\pi_j(\\mu_j - \\mu)^2$.",
      proof: ["Condition on the label: $E[X] = E[E[X \\mid Z]]$, and $\\operatorname{Var}(X) = E[\\operatorname{Var}(X \\mid Z)] + \\operatorname{Var}(E[X \\mid Z])$ (§{joint-distributions}). The first term is the average within-component variance, the second the variance of the component means."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "zero-inflated Poisson",
      statement: "If $X = 0$ with probability $\\pi$ and otherwise $X \\sim \\mathrm{Po}(\\lambda)$: $P(X = 0) = \\pi + (1 - \\pi)e^{-\\lambda}$, $E[X] = (1 - \\pi)\\lambda$, $\\operatorname{Var}(X) = (1 - \\pi)\\lambda(1 + \\pi\\lambda)$. The variance exceeds the mean, a sign of **overdispersion**.",
      proof: ["Apply the mixture formulas with components \"always 0\" (mean 0, variance 0) and Po($\\lambda$) (mean and variance $\\lambda$): variance $(1 - \\pi)\\lambda + \\pi(1 - \\pi)\\lambda^2$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "truncating the exponential",
      statement: "If $T \\sim \\mathrm{Exp}(\\lambda)$, then $T \\mid T > a$ is $a$ plus an $\\mathrm{Exp}(\\lambda)$, so $E[T \\mid T > a] = a + 1/\\lambda$.",
      proof: ["This is the memoryless property (§{uniform-exponential})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A mixture puts weight 0.4 on $N(10, 4)$ and 0.6 on $N(20, 9)$. Find its mean and variance.",
      solution: ["Mean $0.4(10) + 0.6(20) = 16$.", "Within: $0.4(4) + 0.6(9) = 7$. Between: $0.4(36) + 0.6(16) = 24$. Total 31."],
      result: "Mean 16, variance 31.",
    },
    {
      type: "example",
      level: 2,
      title: "which component?",
      problem: "Equal weights on $N(0, 1)$ and $N(4, 1)$. A value $x = 1$ is observed. Find the responsibility of the first component.",
      solution: ["The densities at 1 are proportional to $e^{-0.5}$ and $e^{-4.5}$.", "$\\dfrac{e^{-0.5}}{e^{-0.5} + e^{-4.5}} = \\dfrac{1}{1 + e^{-4}} \\approx 0.982$."],
      result: "About 0.98.",
    },
    {
      type: "example",
      level: 2,
      title: "extra zeros",
      problem: "Purchases per user: 0 with extra probability 0.2, otherwise Po(3). Find $P(X = 0)$, the mean and the variance.",
      solution: ["$P(0) = 0.2 + 0.8e^{-3} \\approx 0.240$. Mean $0.8 \\times 3 = 2.4$.", "Variance $0.8 \\times 3 \\times (1 + 0.6) = 3.84$, above the mean 2.4."],
      result: "0.240, 2.4 and 3.84.",
    },
  ],
  pitfalls: [
    { wrong: "A mixture of two components is the sum of their draws.", right: "Each draw comes from one component only." },
    { wrong: "Mixture variance = weighted average of the component variances.", right: "Add the spread of the component means around the overall mean." },
    { wrong: "Component labels in a fitted mixture are meaningful in themselves.", right: "Swapping labels gives the same likelihood; components are identified only up to relabelling." },
  ],
  formulas: [
    { label: "Density", tex: "f(x) = \\textstyle\\sum_j\\pi_jf_j(x)" },
    { label: "Variance", tex: "\\textstyle\\sum\\pi_j\\sigma_j^2 + \\sum\\pi_j(\\mu_j - \\mu)^2" },
    { label: "Responsibility", tex: "\\dfrac{\\pi_jf_j(x)}{\\sum_i\\pi_if_i(x)}" },
    { label: "Zero-inflated Poisson", tex: "P(0) = \\pi + (1 - \\pi)e^{-\\lambda}" },
  ],
  exercises: [
    ex(1, num("mixx-ex-1", "Weights 0.25 and 0.75 on components with means 8 and 4. Find the mixture mean.", 5, "$2 + 3$."), ["$0.25 \\times 8 + 0.75 \\times 4 = 5$."]),
    ex(1, num("mixx-ex-2", "A mixture is 0.6 $N(0, 1)$ and 0.4 $N(5, 1)$. Find its mean.", 2, "$0 + 2$."), ["$0.4 \\times 5 = 2$."]),
    ex(2, num("mixx-ex-3", "A 50:50 mixture of $N(0, 4)$ and $N(6, 4)$. Find its variance.", 13, "Within 4, between 9."), ["Overall mean 3; between $0.5(9) + 0.5(9) = 9$; total $4 + 9 = 13$."]),
    ex(2, dp("mixx-ex-4", "Zero-inflated Poisson with $\\pi = 0.3$, $\\lambda = 2$. Find $P(X = 0)$.", 0.3 + 0.7 * Math.exp(-2), "$\\pi + (1 - \\pi)e^{-\\lambda}$."), ["$0.3 + 0.7 \\times 0.1353 \\approx 0.395$."]),
    ex(2, num("mixx-ex-5", "Same model. Find $E[X]$.", 1.4, "$(1 - \\pi)\\lambda$."), ["$0.7 \\times 2 = 1.4$."]),
    ex(3, num("mixx-ex-6", "Same model. Find $\\operatorname{Var}(X)$.", 2.24, "$(1 - \\pi)\\lambda(1 + \\pi\\lambda)$."), ["$1.4 \\times 1.6 = 2.24$."]),
    ex(3, dp("mixx-ex-7", "Equal weights on $N(0, 1)$ and $N(2, 1)$; $x = 1.5$ is observed. Find the responsibility of the second component.", 1 / (1 + Math.exp(-1)), "Compare $e^{-1.125}$ and $e^{-0.125}$."), ["$\\dfrac{e^{-0.125}}{e^{-1.125} + e^{-0.125}} = \\dfrac{1}{1 + e^{-1}} \\approx 0.731$."]),
    ex(3, num("mixx-ex-8", "$X \\sim U(0, 10)$, conditioned on $X > 6$. Find its mean.", 8, "Uniform on $(6, 10)$."), ["Truncated to $(6, 10)$ it is still uniform: mean 8."]),
    ex(3, num("mixx-ex-9", "$T$ is exponential with mean 5. Find $E[T \\mid T > 3]$.", 8, "Memoryless."), ["$3 + 5 = 8$."]),
    ex(3, mc("mixx-ex-10", "A fitted two-component mixture has its two labels swapped. Its likelihood", ["is unchanged", "The labels are arbitrary."], [["halves", "Nothing about the fit changes."], ["becomes undefined", "Relabelling is always allowed."]]), ["Mixtures are identifiable only up to relabelling the components."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const w = r.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75]);
      const m1 = r.int(0, 10);
      const m2 = m1 + r.int(2, 6 + 2 * lv);
      const v1 = r.pick([1, 2, 4]);
      const v2 = lv === 1 ? v1 : r.pick([1, 2, 4, 9]);
      const mu = w * m1 + (1 - w) * m2;
      const v = w * v1 + (1 - w) * v2 + w * (m1 - mu) ** 2 + (1 - w) * (m2 - mu) ** 2;
      return n(`A mixture puts weight ${w} on $N(${m1}, ${v1})$ and ${r2(1 - w)} on $N(${m2}, ${v2})$. Find its variance (2 decimals).`, r2(v), `Mean ${r2(mu)}; within ${r2(w * v1 + (1 - w) * v2)}; between ${r2(v - w * v1 - (1 - w) * v2)}; total ${r2(v)}.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const pi = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]);
      const lam = r.pick([1, 1.5, 2, 3, 4]);
      const p0 = pi + (1 - pi) * Math.exp(-lam);
      return n(`A count is 0 with extra probability ${pi} and otherwise Po(${lam}). Find $P(X = 0)$ (3 decimals).`, Math.round(p0 * 1000) / 1000, `$${pi} + ${r2(1 - pi)}e^{-${lam}} \\approx ${Math.round(p0 * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(0, 5);
      const b = a + r.int(6, 12);
      return mcNumbers(
        `$X$ is a 50:50 mixture of $N(${a}, 1)$ and $N(${b}, 1)$. Where does $X$ usually fall?`,
        { text: `Near ${a} or near ${b}`, why: "Each draw comes from one component." },
        [
          { text: `Near ${a + b}`, why: "That would be the sum of one draw from each.", misconception: "mixture-is-sum" },
          { text: `Near ${(a + b) / 2}`, why: "The midpoint is between the two humps, where draws are rare." },
        ],
      );
    },
  },
];
