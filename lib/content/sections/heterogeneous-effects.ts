import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Heterogeneous treatment effects and causal machine learning: CATE, S-, T- and X-learners, causal forests, double/debiased machine learning, targeting and uplift. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "heterogeneous-effects",
  title: "Heterogeneous effects & causal machine learning",
  summary: "An average effect can hide a treatment that helps some people a lot and others not at all. The conditional average treatment effect τ(x) describes how the effect varies with characteristics. Machine-learning methods estimate it: meta-learners built from outcome models, causal forests that split on effect differences, and double machine learning that uses flexible models to remove confounding while keeping valid confidence intervals.",
  deps: ["mediation-sensitivity", "multiple-testing", "cross-validation"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "CATE", meaning: "Conditional average treatment effect, $\\tau(x) = E[Y(1) - Y(0) \\mid X = x]$." },
    { term: "uplift", meaning: "The increase in an outcome caused by treating a particular individual; uplift modelling targets those with the largest." },
    { term: "cross-fitting", meaning: "Fitting nuisance models on one part of the data and using them on another, then swapping, to avoid overfitting bias." },
  ],
  misconceptions: {
    "high-risk-high-benefit": "Assumes the people with the highest predicted risk of a bad outcome are the ones who benefit most from treatment.",
    "subgroup-fishing": "Tests many subgroups, finds one with a significant effect, and reports it as a real discovery.",
  },
  steps: [
    {
      type: "motivate",
      title: "Who should get it?",
      body: "A retention offer costs ₹500 per customer. Sending it to everyone wastes money on customers who would have stayed anyway and on those who will leave regardless. What matters is the difference the offer makes for each customer, which varies. Estimating that variation, and deciding who to treat, is a causal question that machine learning can help answer.",
      realWorld: {
        title: "Political campaigns",
        body: "Campaigns in the 2010s used uplift models from randomised get-out-the-vote experiments to target persuadable voters: those whose behaviour the contact actually changes, rather than committed supporters or opponents.",
      },
    },
    {
      type: "truth",
      statement: "The **CATE** is $\\tau(x) = E[Y(1) - Y(0) \\mid X = x]$, and under exchangeability given $X$, $\\tau(x) = \\mu_1(x) - \\mu_0(x)$ with $\\mu_t(x) = E[Y \\mid T = t, X = x]$. The **T-learner** fits $\\hat\\mu_1$ on treated and $\\hat\\mu_0$ on control units and subtracts; the **S-learner** fits one model with $T$ as a feature; the **X-learner** imputes individual effects and models them, helping when one group is small.",
      body: "**Causal forests** grow trees that split where treatment effects differ most, using **honest** estimation (one subsample chooses splits, another estimates effects within leaves), which yields valid confidence intervals. **Double/debiased machine learning** estimates an average effect $\\theta$ in $Y = \\theta T + g(X) + \\varepsilon$ by predicting $Y$ and $T$ from $X$ with any flexible learner, cross-fitting, and regressing residual on residual: $\\hat\\theta = \\dfrac{\\sum\\tilde y_i\\tilde t_i}{\\sum\\tilde t_i^2}$. Targeting: treat when $\\hat\\tau(x)$ exceeds the cost. Searching many subgroups invites false positives (§{multiple-testing}): pre-specify, or validate on fresh data.",
    },
    {
      type: "predict",
      misconception: "high-risk-high-benefit",
      item: {
        kind: "mc",
        id: "hte-predict-1",
        prompt: "A churn model ranks customers by their probability of leaving. Should the retention offer go to the top 10% most likely to leave?",
        options: [
          { id: "a", text: "Not necessarily: they may leave regardless; target those whose leaving the offer changes most", correct: true, why: "Benefit is $\\tau(x)$, not the baseline risk." },
          { id: "b", text: "Yes: the highest-risk customers benefit most", misconception: "high-risk-high-benefit", why: "Risk and responsiveness are different quantities." },
          { id: "c", text: "No: offers never change behaviour", why: "Randomised tests often show real uplift." },
        ],
      },
      reveal: {
        body: "Predicting who will leave is a prediction problem; deciding whom to treat needs $\\tau(x) = P(\\text{stay} \\mid \\text{offer}, x) - P(\\text{stay} \\mid \\text{no offer}, x)$. Customers who have already decided to leave may have small $\\tau$; moderate-risk, persuadable customers may have the largest. Uplift models are trained on randomised offer data to estimate exactly this.",
      },
      resolve: {
        kind: "mc",
        id: "hte-resolve-1",
        prompt: "To decide who should receive a treatment, rank people by",
        options: [
          { id: "a", text: "their estimated treatment effect $\\hat\\tau(x)$", correct: true, why: "That is the benefit of treating them." },
          { id: "b", text: "their predicted risk without treatment", misconception: "high-risk-high-benefit", why: "High risk doesn't mean high responsiveness." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hte-check-1",
        prompt: "A trial shows no overall effect. An analyst tests 20 subgroups and finds left-handed women over 60 benefit, p = 0.03. This is",
        options: [
          { id: "a", text: "weak evidence: with 20 tests, one p below 0.05 is expected by chance", correct: true, why: "About 1 false positive in 20 tests at 5%." },
          { id: "b", text: "a discovery to report and act on", misconception: "subgroup-fishing", why: "Unadjusted multiple subgroup tests inflate false positives." },
          { id: "c", text: "proof the drug harms everyone else", why: "Nothing supports that." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hte-check-2",
        prompt: "A T-learner has $\\hat\\mu_1(x) = 50 + 2x$ and $\\hat\\mu_0(x) = 45 + x$. The estimated effect at $x = 3$ is",
        options: [
          { id: "a", text: "8", correct: true, why: "$\\tau(x) = 5 + x$." },
          { id: "b", text: "56", why: "That is $\\hat\\mu_1(3)$." },
          { id: "c", text: "5", why: "That is the effect at $x = 0$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Personalisation is a causal problem: recommending, pricing or treating by $\\hat\\tau(x)$ rather than by predicted outcome. Libraries such as EconML, CausalML and grf implement meta-learners, causal forests and double machine learning. Evaluate targeting policies on randomised hold-out data with uplift (Qini) curves.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "hte-produce-1", prompt: "$\\hat\\mu_1(x) = 20 + 3x$ and $\\hat\\mu_0(x) = 22 + x$. Find $\\hat\\tau(4)$.", answer: 6, explain: "$32 - 26$." },
        { kind: "number", id: "hte-produce-2", prompt: "Same models. For which $x$ is $\\hat\\tau(x) = 0$?", answer: 1, explain: "$-2 + 2x = 0$." },
        {
          kind: "mc",
          id: "hte-produce-3",
          prompt: "A hospital wants to give a scarce therapy to those who will gain most. It should use",
          options: [
            { id: "a", text: "a model of individual treatment effects, fitted on trial or well-adjusted data", correct: true, why: "Gain is $\\tau(x)$." },
            { id: "b", text: "a model of who is sickest", misconception: "high-risk-high-benefit", why: "The sickest may gain little." },
          ],
        },
        {
          kind: "mc",
          id: "hte-produce-4",
          prompt: "A causal forest suggests a large effect in one subgroup. Before acting, you should",
          options: [
            { id: "a", text: "confirm it on held-out or new data", correct: true, why: "Flexible searches can find noise." },
            { id: "b", text: "act now: a significant subgroup is a discovery", misconception: "subgroup-fishing", why: "Searching many splits inflates false positives." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "hte-review-1", prompt: "$\\hat\\mu_1(x) = 10 + x$ and $\\hat\\mu_0(x) = 8$. Find $\\hat\\tau(5)$.", answer: 7, explain: "$15 - 8$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "meta-learners",
      body: "**S-learner**: one model $\\hat\\mu(x, t)$; $\\hat\\tau(x) = \\hat\\mu(x, 1) - \\hat\\mu(x, 0)$. Regularisation may shrink the effect of $T$ towards 0. **T-learner**: separate models per arm; noisy when one arm is small. **X-learner**: impute effects $\\tilde\\tau_i = Y_i - \\hat\\mu_0(X_i)$ for treated and $\\hat\\mu_1(X_i) - Y_i$ for controls, model each, and blend by the propensity score. The **R-learner** minimises residual-on-residual loss, as in double machine learning.",
    },
    {
      type: "definition",
      term: "double machine learning",
      body: "Partially linear model $Y = \\theta T + g(X) + \\varepsilon$, $T = m(X) + v$. Fit $\\hat\\ell(X) \\approx E[Y \\mid X]$ and $\\hat m(X) \\approx E[T \\mid X]$ with any learner on held-out folds; form residuals $\\tilde y = Y - \\hat\\ell(X)$, $\\tilde t = T - \\hat m(X)$; then $\\hat\\theta = \\sum\\tilde y\\tilde t/\\sum\\tilde t^2$. The estimating equation is **Neyman-orthogonal**: small errors in the nuisance models have only second-order effects on $\\hat\\theta$, so standard errors stay valid.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "residual-on-residual regression",
      statement: "In $Y = \\theta T + g(X) + \\varepsilon$ with $E[\\varepsilon \\mid T, X] = 0$, regressing $Y - E[Y \\mid X]$ on $T - E[T \\mid X]$ recovers $\\theta$ (the Frisch–Waugh–Lovell idea).",
      proof: ["$Y - E[Y \\mid X] = \\theta(T - E[T \\mid X]) + \\varepsilon$, since $g(X)$ cancels; regress through the origin."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "treat when the benefit beats the cost",
      statement: "If treating costs $c$ (in outcome units) and the goal is total outcome, treat exactly those with $\\tau(x) > c$. With a fixed budget of $k$ treatments, treat the $k$ largest $\\hat\\tau(x)$.",
      proof: ["Each treated person adds $\\tau(x) - c$; include them when that is positive."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "credible heterogeneity",
      statement: "Pre-specify a few effect modifiers with a scientific reason, test the interaction rather than separate subgroup p-values, adjust for multiple comparisons, and confirm data-driven findings on new data.",
      proof: ["A significant effect in one subgroup and not another doesn't show the effects differ; only the interaction test addresses that."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A T-learner gives $\\hat\\mu_1(x) = 50 + 2x$ and $\\hat\\mu_0(x) = 45 + x$. Find $\\hat\\tau(x)$ and $\\hat\\tau(3)$.",
      solution: ["$\\hat\\tau(x) = 5 + x$.", "$\\hat\\tau(3) = 8$."],
      result: "8.",
    },
    {
      type: "example",
      level: 2,
      title: "double machine learning",
      problem: "Cross-fitted residuals: $\\tilde t = (1, -1, 0.5, -0.5)$ and $\\tilde y = (2, -1, 1.5, -0.5)$. Find $\\hat\\theta$.",
      solution: ["$\\sum\\tilde y\\tilde t = 2 + 1 + 0.75 + 0.25 = 4$; $\\sum\\tilde t^2 = 1 + 1 + 0.25 + 0.25 = 2.5$.", "$\\hat\\theta = 4/2.5 = 1.6$."],
      result: "1.6.",
    },
    {
      type: "example",
      level: 3,
      title: "targeting",
      problem: "Estimated uplifts in retained revenue for four customer segments are ₹900, ₹300, ₹650 and ₹100; an offer costs ₹500. Which segments should get it, and what is the net gain per customer in them?",
      solution: ["Treat where $\\hat\\tau > 500$: the ₹900 and ₹650 segments.", "Net gains ₹400 and ₹150 per customer; treating the others would lose ₹200 and ₹400 each."],
      result: "Two segments; ₹400 and ₹150 net.",
    },
  ],
  pitfalls: [
    { wrong: "Target the highest-risk people.", right: "Target the largest estimated effects $\\hat\\tau(x)$." },
    { wrong: "Report the one significant subgroup out of many.", right: "Pre-specify, test interactions, adjust for multiplicity, replicate." },
    { wrong: "Plug flexible ML predictions into a causal estimate without cross-fitting.", right: "Cross-fit and use orthogonal estimating equations." },
  ],
  formulas: [
    { label: "CATE", tex: "\\tau(x) = \\mu_1(x) - \\mu_0(x)" },
    { label: "DML", tex: "\\hat\\theta = \\dfrac{\\sum\\tilde y_i\\tilde t_i}{\\sum\\tilde t_i^2}" },
    { label: "Targeting", tex: "\\text{treat if } \\hat\\tau(x) > c" },
  ],
  exercises: [
    ex(1, num("htex-ex-1", "$\\hat\\mu_1(x) = 30 + x$ and $\\hat\\mu_0(x) = 25$. Find $\\hat\\tau(2)$.", 7, "$32 - 25$."), ["$7$."]),
    ex(1, num("htex-ex-2", "An offer costs 40; estimated uplifts are 25, 55, 70 and 35. How many segments should be treated?", 2, "Those above 40."), ["55 and 70: 2 segments."]),
    ex(2, dp("htex-ex-3", "Residuals $\\tilde t = (1, -2, 1)$ and $\\tilde y = (3, -3, 0)$. Find the DML estimate.", 9 / 6, "$\\sum\\tilde y\\tilde t/\\sum\\tilde t^2$."), ["$(3 + 6 + 0)/6 = 1.5$."]),
    ex(2, num("htex-ex-4", "$\\hat\\mu_1(x) = 10 + 4x$ and $\\hat\\mu_0(x) = 16 + x$. Above which $x$ is the effect positive?", 2, "$-6 + 3x > 0$."), ["$x > 2$."]),
    ex(2, num("htex-ex-5", "With 40 independent subgroup tests at 5% and no true effects, how many significant results are expected?", 2, "$40 \\times 0.05$."), ["$2$."]),
    ex(3, mc("htex-ex-6", "With 1,000 treated and only 50 control units, which meta-learner is designed for the imbalance?", ["the X-learner", "It borrows strength from the larger group."], [["the T-learner", "Its control model would be very noisy."], ["neither: imbalance doesn't matter", "It matters for per-arm models."]]), ["The X-learner weights imputed effects by the propensity score."]),
    ex(3, mc("htex-ex-7", "Causal forests use \"honest\" trees, meaning", ["different subsamples choose the splits and estimate the leaf effects", "This avoids overfitting the effect estimates."], [["trees are not pruned", "Honesty concerns sample splitting."], ["only the treated are used", "Both arms are needed."]]), ["Honesty gives valid confidence intervals."]),
    ex(3, mc("htex-ex-8", "The effect is significant in men (p = 0.01) but not women (p = 0.20). This shows", ["nothing about whether effects differ: test the interaction", "Different significance isn't a significant difference."], [["the effect is larger in men", "That needs an interaction test."], ["there is no effect in women", "Non-significance isn't absence."]]), ["Compare the effects directly."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a1 = r.int(10, 60);
      const b1 = r.int(0, 5);
      const a0 = r.int(10, 60);
      const b0 = r.int(0, 5);
      const x = r.int(0, 10);
      const t = a1 + b1 * x - (a0 + b0 * x);
      return n(`A T-learner gives $\\hat\\mu_1(x) = ${a1} + ${b1}x$ and $\\hat\\mu_0(x) = ${a0} + ${b0}x$. Find $\\hat\\tau(${x})$.`, t, `$${a1 + b1 * x} - ${a0 + b0 * x} = ${t}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const tt = Array.from({ length: k }, () => r.nonzero(-3, 3));
      const yy = Array.from({ length: k }, () => r.int(-4, 4));
      const v = tt.reduce((s, t, i) => s + t * yy[i], 0) / tt.reduce((s, t) => s + t * t, 0);
      return n(`Cross-fitted residuals: $\\tilde t = (${tt.join(", ")})$ and $\\tilde y = (${yy.join(", ")})$. Find the double machine learning estimate (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sum\\tilde y\\tilde t/\\sum\\tilde t^2 = ${tt.reduce((s, t, i) => s + t * yy[i], 0)}/${tt.reduce((s, t) => s + t * t, 0)} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([10, 20, 30, 40]);
      return mcNumbers(
        `A trial with no overall effect is split into ${k} subgroups; one shows p = 0.04. How should it be treated?`,
        { text: "as a hypothesis to confirm on new data", why: `With ${k} tests, about ${k / 20} false positive(s) at 5% are expected.` },
        [
          { text: "as a discovery", why: "Multiple subgroup tests inflate false positives.", misconception: "subgroup-fishing" },
          { text: "as proof of harm elsewhere", why: "Nothing supports that." },
        ],
      );
    },
  },
  {
    type: "real-world",
    make: (r) => {
      const v = r.pick(["a discount coupon", "a reminder call", "a loyalty offer", "a free trial extension"]);
      return mcNumbers(
        `A company has a model predicting who will stop buying. To decide who gets ${v}, it should rank customers by`,
        { text: "estimated uplift from the offer", why: "That is what the offer changes." },
        [{ text: "predicted probability of stopping", why: "Likely leavers may not respond.", misconception: "high-risk-high-benefit" }],
      );
    },
  },
];
