import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Observational causal inference: regression adjustment, matching, propensity scores, inverse probability weighting, balance checks and doubly robust estimation. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "propensity-scores",
  title: "Matching, weighting & propensity scores",
  summary: "When treatment wasn't randomised but the confounders were measured, we can make the groups comparable after the fact. Regression adjustment models the outcome; matching pairs similar treated and untreated units; the propensity score, the probability of treatment given covariates, lets us match or weight on a single number. Doubly robust estimators combine an outcome model and a propensity model and need only one to be right.",
  deps: ["potential-outcomes", "logistic-regression", "multiple-regression"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "propensity score", meaning: "$e(x) = P(T = 1 \\mid X = x)$, the probability of treatment given covariates." },
    { term: "inverse probability weighting", meaning: "Weighting each unit by one over the probability of the treatment it actually received." },
    { term: "balance", meaning: "Treated and comparison groups having similar covariate distributions." },
  ],
  misconceptions: {
    "ps-fixes-unmeasured": "Believes propensity scores adjust for unmeasured confounders as well as measured ones.",
    "ps-prediction-accuracy": "Judges a propensity model by how accurately it predicts treatment, rather than by the covariate balance it achieves.",
  },
  steps: [
    {
      type: "motivate",
      title: "Comparing like with like",
      body: "A job-training programme's participants earn more afterwards, but they also started younger and better educated. If we compare each participant with a non-participant of the same age, education and past earnings, the remaining difference is a fairer estimate. With many covariates exact matches run out, so we match on one summary: how likely each person was to join.",
      realWorld: {
        title: "Right-heart catheterisation",
        body: "A famous 1996 propensity-score study of 5,735 critically ill patients found that a widely used heart-monitoring procedure was associated with higher mortality after adjustment. It prompted randomised trials, which found no benefit.",
      },
    },
    {
      type: "truth",
      statement: "The **propensity score** $e(X) = P(T = 1 \\mid X)$ is a balancing score: given $e(X)$, treatment is independent of $X$. So if adjusting for $X$ removes confounding, adjusting for $e(X)$ alone does too. **Inverse probability weighting** estimates $\\text{ATE} = E\\!\\left[\\dfrac{TY}{e(X)}\\right] - E\\!\\left[\\dfrac{(1 - T)Y}{1 - e(X)}\\right]$: treated units get weight $1/e$, controls $1/(1 - e)$, creating a pseudo-population in which treatment is unrelated to $X$.",
      body: "Estimate $e(X)$, usually by logistic regression (§{logistic-regression}); then match (nearest neighbour on $e$, within a caliper), stratify on quintiles of $e$, or weight. Always **check balance**: the standardised mean difference $\\dfrac{\\bar x_T - \\bar x_C}{\\sqrt{(s_T^2 + s_C^2)/2}}$ of each covariate should be below about 0.1 afterwards. Scores near 0 or 1 give huge weights and signal poor overlap (positivity, §{potential-outcomes}): trim or stabilise. **Regression adjustment** fits $E[Y \\mid T, X]$ and averages predictions with $T$ set to 1 and to 0. **Doubly robust** (AIPW) estimators combine both models and are consistent if either is correct. None of this touches **unmeasured** confounders.",
    },
    {
      type: "predict",
      misconception: "ps-fixes-unmeasured",
      item: {
        kind: "mc",
        id: "psc-predict-1",
        prompt: "A propensity-score analysis of a diet's effect on heart disease uses age, sex, income and smoking. Motivation to stay healthy, which drives both diet and heart health, wasn't measured. The estimate",
        options: [
          { id: "a", text: "can still be biased: the propensity score only balances the covariates in it", correct: true, why: "Unmeasured confounders stay unbalanced." },
          { id: "b", text: "is unbiased, since propensity scores mimic randomisation", misconception: "ps-fixes-unmeasured", why: "Randomisation balances everything; a propensity score balances only what it includes." },
          { id: "c", text: "is meaningless", why: "It adjusts for the measured confounders; it just can't do more." },
        ],
      },
      reveal: {
        body: "The balancing property holds for $X$, the variables in the model. Randomisation balances measured and unmeasured characteristics alike; propensity methods only re-create balance on what you measured. That is why they rely on conditional exchangeability, and why sensitivity analysis (§{mediation-sensitivity}) asks how strong an unmeasured confounder would need to be.",
      },
      resolve: {
        kind: "mc",
        id: "psc-resolve-1",
        prompt: "Propensity-score methods remove confounding by",
        options: [
          { id: "a", text: "measured covariates included in the score", correct: true, why: "That is all they can balance." },
          { id: "b", text: "all confounders, measured or not", misconception: "ps-fixes-unmeasured", why: "Only randomisation does that." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "psc-check-1",
        prompt: "Two propensity models: A predicts treatment with AUC 0.95 but leaves covariates badly imbalanced after weighting; B has AUC 0.75 and leaves every standardised difference below 0.05. Prefer",
        options: [
          { id: "a", text: "B: the goal is balance, not prediction", correct: true, why: "Balance is what removes confounding." },
          { id: "b", text: "A: a more accurate model is always better", misconception: "ps-prediction-accuracy", why: "Very high AUC can mean poor overlap and extreme weights." },
          { id: "c", text: "neither can be used", why: "B is fine." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "psc-check-2",
        prompt: "A treated unit has propensity score 0.25. Its inverse probability weight for the ATE is",
        options: [
          { id: "a", text: "4", correct: true, why: "$1/0.25$." },
          { id: "b", text: "1.33", why: "That is $1/(1 - e)$, the weight for a control." },
          { id: "c", text: "0.25", why: "Weights are inverse probabilities." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Off-policy evaluation of recommender systems and bandits uses the same inverse-propensity idea: to judge a new policy from logs of an old one, reweight each logged action by how much more often the new policy would choose it. Domain adaptation reweights training examples by estimated density ratios in a similar spirit.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "psc-produce-1", prompt: "A control unit has propensity score 0.8. Find its ATE weight.", answer: 5, explain: "$1/(1 - 0.8)$." },
        { kind: "number", id: "psc-produce-2", prompt: "Treated mean age 52, control mean age 48, both SDs 10. Find the standardised mean difference.", answer: 0.4, explain: "$4/10$." },
        {
          kind: "mc",
          id: "psc-produce-3",
          prompt: "After matching, an important confounder you didn't measure is",
          options: [
            { id: "a", text: "possibly still imbalanced", correct: true, why: "Matching balances only included covariates." },
            { id: "b", text: "balanced automatically", misconception: "ps-fixes-unmeasured", why: "The score knows nothing about it." },
          ],
        },
        {
          kind: "mc",
          id: "psc-produce-4",
          prompt: "Adding many strong predictors of treatment that don't affect the outcome to the propensity model mainly",
          options: [
            { id: "a", text: "worsens overlap and inflates the variance of weighted estimates", correct: true, why: "Better treatment prediction pushes scores towards 0 and 1." },
            { id: "b", text: "improves the estimate, since prediction accuracy is the goal", misconception: "ps-prediction-accuracy", why: "Include confounders, judged by balance." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "psc-review-1", prompt: "A treated unit has propensity score 0.2. Find its ATE weight.", answer: 5, explain: "$1/0.2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "weights for the ATT",
      body: "To estimate the effect on the treated, keep treated units at weight 1 and give controls weight $\\dfrac{e(X)}{1 - e(X)}$, the odds of treatment: controls resembling the treated count more. Stabilised ATE weights multiply by the marginal treatment probability, $P(T = 1)/e$ and $P(T = 0)/(1 - e)$, to reduce variance.",
    },
    {
      type: "definition",
      term: "doubly robust estimation",
      body: "The **augmented IPW** estimator of $E[Y(1)]$ is $\\dfrac1n\\sum_i\\left[\\hat\\mu_1(X_i) + \\dfrac{T_i(Y_i - \\hat\\mu_1(X_i))}{\\hat e(X_i)}\\right]$, with $\\hat\\mu_1$ an outcome model for the treated. If $\\hat\\mu_1$ is right, the correction term averages to 0; if $\\hat e$ is right, the correction fixes any error in $\\hat\\mu_1$. Either way it is consistent.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the balancing property",
      statement: "$X$ is independent of $T$ given $e(X)$. Hence if $Y(t) \\perp T \\mid X$, then $Y(t) \\perp T \\mid e(X)$ (Rosenbaum and Rubin, 1983).",
      proof: ["$P(T = 1 \\mid X, e(X)) = e(X) = P(T = 1 \\mid e(X))$, so once $e(X)$ is known, $X$ carries no further information about $T$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "why IPW works",
      statement: "Under exchangeability given $X$ and positivity, $E\\!\\left[\\dfrac{TY}{e(X)}\\right] = E[Y(1)]$.",
      proof: ["$E\\!\\left[\\dfrac{TY}{e(X)} \\,\\middle|\\, X\\right] = \\dfrac{E[T \\mid X]\\,E[Y(1) \\mid X]}{e(X)} = E[Y(1) \\mid X]$, using consistency and exchangeability; average over $X$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what goes in the propensity model",
      statement: "Include confounders and pure predictors of the outcome; avoid variables that affect only treatment (instruments), which add variance and can amplify bias, and anything affected by treatment.",
      proof: ["Outcome predictors reduce variance; instrument-like variables push scores to 0 or 1 without reducing confounding."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the ATE weights of a treated unit with $e = 0.5$, a treated unit with $e = 0.8$ and a control with $e = 0.2$.",
      solution: ["Treated: $1/0.5 = 2$ and $1/0.8 = 1.25$.", "Control: $1/(1 - 0.2) = 1.25$."],
      result: "2, 1.25, 1.25.",
    },
    {
      type: "example",
      level: 2,
      title: "an IPW estimate",
      problem: "Four units $(T, e, Y)$: (1, 0.5, 10), (1, 0.8, 12), (0, 0.5, 6), (0, 0.2, 4). Find the IPW estimate of the ATE.",
      solution: ["Treated term: $\\tfrac14(10/0.5 + 12/0.8) = \\tfrac14(20 + 15) = 8.75$.", "Control term: $\\tfrac14(6/0.5 + 4/0.8) = \\tfrac14(12 + 5) = 4.25$. ATE $= 4.5$."],
      result: "4.5.",
    },
    {
      type: "example",
      level: 3,
      title: "checking balance",
      problem: "Before weighting, mean income is 62 (treated) and 50 (control), SDs 20 and 16. After weighting, means are 55.5 and 54.8. Is balance acceptable?",
      solution: ["Pooled SD $\\sqrt{(400 + 256)/2} \\approx 18.1$. Before: $12/18.1 \\approx 0.66$, badly imbalanced.", "After: $0.7/18.1 \\approx 0.04 < 0.1$: acceptable."],
      result: "SMD falls from 0.66 to 0.04.",
    },
  ],
  pitfalls: [
    { wrong: "Propensity scores handle unmeasured confounding.", right: "They balance only the covariates in the model." },
    { wrong: "Choose the propensity model with the highest AUC.", right: "Choose the one that gives the best balance with workable overlap." },
    { wrong: "Ignore extreme weights.", right: "Check overlap; trim or stabilise." },
  ],
  formulas: [
    { label: "Propensity", tex: "e(x) = P(T = 1 \\mid X = x)" },
    { label: "IPW ATE", tex: "E\\!\\left[\\tfrac{TY}{e(X)}\\right] - E\\!\\left[\\tfrac{(1 - T)Y}{1 - e(X)}\\right]" },
    { label: "SMD", tex: "\\dfrac{\\bar x_T - \\bar x_C}{\\sqrt{(s_T^2 + s_C^2)/2}}" },
    { label: "ATT control weight", tex: "e/(1 - e)" },
  ],
  exercises: [
    ex(1, num("pscx-ex-1", "A treated unit has $e = 0.4$. Find its ATE weight.", 2.5, "$1/0.4$."), ["$2.5$."]),
    ex(1, num("pscx-ex-2", "A control unit has $e = 0.75$. Find its ATT weight.", 3, "$0.75/0.25$."), ["$3$."]),
    ex(2, num("pscx-ex-3", "Units $(T, e, Y)$: (1, 0.5, 8), (1, 0.25, 6), (0, 0.5, 4), (0, 0.75, 2). Find the IPW ATE estimate.", 6, "$\\tfrac14(16 + 24) - \\tfrac14(8 + 8)$."), ["Treated term $\\tfrac14(8/0.5 + 6/0.25) = 10$; control term $\\tfrac14(4/0.5 + 2/0.25) = 4$; ATE $= 6$."]),
    ex(2, dp("pscx-ex-4", "Means 30 and 26, SDs 8 and 6. Find the standardised mean difference.", 4 / Math.sqrt(50), "Pooled SD $\\sqrt{(64 + 36)/2}$."), ["$4/\\sqrt{50} \\approx 0.566$."]),
    ex(2, num("pscx-ex-5", "$P(T = 1) = 0.3$. Find the stabilised ATE weight of a treated unit with $e = 0.6$.", 0.5, "$0.3/0.6$."), ["$0.5$."]),
    ex(3, mc("pscx-ex-6", "Some treated units have $e = 0.999$ and some controls $e = 0.001$. This signals", ["poor overlap: weights explode and estimates become unstable", "Positivity is nearly violated."], [["an excellent propensity model", "Extreme scores are a warning, not a success."], ["no confounding", "It signals strong selection."]]), ["Restrict to the region of common support or change the estimand."]),
    ex(3, mc("pscx-ex-7", "A doubly robust estimator is consistent if", ["either the outcome model or the propensity model is correct", "One right model suffices."], [["both models are correct", "That is sufficient but not necessary."], ["neither model is correct", "At least one must be right."]]), ["It also tends to have lower variance than IPW alone."]),
    ex(3, mc("pscx-ex-8", "A variable strongly predicts who gets treated but has no effect on the outcome. In the propensity model it should be", ["left out: it adds variance without removing confounding", "It acts like an instrument."], [["always included", "Including it pushes scores to extremes."], ["used as the outcome", "It isn't the outcome."]]), ["Include confounders and outcome predictors."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const e = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9]);
      const treated = r.pick([true, false]);
      const est = r.pick(["ATE", "ATT"] as const);
      const w = treated ? (est === "ATE" ? 1 / e : 1) : est === "ATE" ? 1 / (1 - e) : e / (1 - e);
      return n(`A ${treated ? "treated" : "control"} unit has propensity score ${e}. Find its ${est} weight (3 decimals).`, Math.round(w * 1000) / 1000, treated ? (est === "ATE" ? `$1/${e}$.` : "Treated units keep weight 1 for the ATT.") : est === "ATE" ? `$1/(1 - ${e})$.` : `$${e}/(1 - ${e})$, the odds of treatment.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m1 = r.int(20, 80);
      const m2 = m1 + r.nonzero(-10, 10);
      const s1 = r.int(4, 20);
      const s2 = r.int(4, 20);
      const v = (m1 - m2) / Math.sqrt((s1 * s1 + s2 * s2) / 2);
      return n(`Treated mean ${m1}, control mean ${m2}; SDs ${s1} and ${s2}. Find the standardised mean difference (3 decimals).`, Math.round(v * 1000) / 1000, `$(${m1} - ${m2})/\\sqrt{(${s1 * s1} + ${s2 * s2})/2} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const u = r.pick(["motivation", "family support", "genetic risk", "health consciousness"]);
      return mcNumbers(
        `A propensity-score analysis balances age, income and education, but not ${u}, which affects both treatment and outcome. The estimate`,
        { text: `may still be biased by ${u}`, why: "Only included covariates are balanced." },
        [
          { text: "is unbiased, like a randomised trial", why: "Randomisation balances unmeasured factors; the score doesn't.", misconception: "ps-fixes-unmeasured" },
          { text: "must be exactly 0", why: "Bias can go either way." },
        ],
      );
    },
  },
];
