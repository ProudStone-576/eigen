import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Uncertainty quantification (aleatoric and epistemic), conformal prediction, probabilistic forecasting and proper scoring rules, distribution shift (covariate, label, concept drift), detection and importance weighting. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const pinball = (tau: number, y: number, q: number) => (y >= q ? tau * (y - q) : (1 - tau) * (q - y));

const base: ConceptNode = {
  id: "uncertainty-shift",
  title: "Conformal prediction & distribution shift",
  summary: "A prediction should come with an honest statement of how wrong it might be. Conformal prediction turns any model into one that outputs intervals or sets with guaranteed coverage, using only a held-out calibration set. Probabilistic forecasts are judged by proper scoring rules. All such guarantees assume new data look like the old; when the distribution shifts, models and their uncertainty can fail silently, so shift must be monitored.",
  deps: ["calibration-imbalance", "quartiles-iqr", "forecasting"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "conformal prediction", meaning: "A method that wraps any model to give prediction sets containing the truth with probability at least $1 - \\alpha$." },
    { term: "covariate shift", meaning: "The distribution of the inputs changes while the relationship $P(y \\mid x)$ stays the same." },
    { term: "concept drift", meaning: "The relationship between inputs and target, $P(y \\mid x)$, changes over time." },
  ],
  misconceptions: {
    "conformal-conditional": "Thinks conformal prediction's coverage guarantee holds for every individual or subgroup, rather than on average over all cases.",
    "shift-accuracy-holds": "Assumes a model's validation accuracy will hold after deployment even though the data have changed.",
  },
  steps: [
    {
      type: "motivate",
      title: "How wrong could it be?",
      body: "A model predicts a house will sell for ₹82 lakh. A buyer wants to know: could it be ₹70 lakh? ₹100 lakh? And a model trained on pre-pandemic shopping data, deployed in 2020, kept giving confident predictions that were badly wrong. Uncertainty needs to be quantified, and its assumptions watched.",
      realWorld: {
        title: "Models after a shock",
        body: "Demand-forecasting and fraud models at many retailers and banks broke in early 2020 as buying patterns changed overnight. Teams that monitored input distributions and errors noticed within days; others found out from their losses.",
      },
    },
    {
      type: "truth",
      statement: "**Split conformal prediction**: fit any model on training data; on $n$ calibration points compute scores $s_i = \\lvert y_i - \\hat y_i\\rvert$; let $\\hat q$ be the $\\lceil(n + 1)(1 - \\alpha)\\rceil$-th smallest score; predict $\\hat y \\pm \\hat q$. If the calibration and test points are exchangeable, $P(y_{\\text{new}} \\in \\text{interval}) \\ge 1 - \\alpha$, whatever the model. For classification, the set contains every class whose score is below the threshold.",
      body: "The guarantee is **marginal**: averaged over all test points, not for each individual or subgroup; conditional methods (conformalised quantile regression, group-wise calibration) aim closer. **Probabilistic forecasts** give quantiles or full distributions, scored by **proper scoring rules** such as the log score, CRPS or the pinball loss for quantiles, which reward honest uncertainty. Sources of uncertainty: **aleatoric** (irreducible noise) and **epistemic** (lack of knowledge, reducible with data; estimated by ensembles or Bayesian methods, §{bayesian-inference}). **Distribution shift**: covariate shift (inputs change), label shift (class balance changes, §{calibration-imbalance}), concept drift ($P(y \\mid x)$ changes). Detect it by comparing feature distributions (two-sample tests, the population stability index, or a classifier trained to tell old from new) and by monitoring errors; under covariate shift, reweight training data by $w(x) = p_{\\text{new}}(x)/p_{\\text{old}}(x)$.",
    },
    {
      type: "predict",
      misconception: "conformal-conditional",
      item: {
        kind: "mc",
        id: "unc-predict-1",
        prompt: "A conformal predictor gives 90% intervals for house prices. Its intervals are the same width everywhere, though luxury homes vary far more in price. For luxury homes alone, coverage is likely",
        options: [
          { id: "a", text: "below 90%, made up for by above-90% coverage on ordinary homes", correct: true, why: "The guarantee is an average over all homes." },
          { id: "b", text: "exactly 90%, since conformal coverage holds for every subgroup", misconception: "conformal-conditional", why: "Only marginal coverage is guaranteed." },
          { id: "c", text: "100%", why: "Narrow intervals for volatile prices miss more often." },
        ],
      },
      reveal: {
        body: "Split conformal with absolute-residual scores uses one width $\\hat q$ for everyone. Averaged over all houses, at least 90% of intervals cover. But where prices are noisier the same width misses more often, and where they are steadier it covers more. Normalising scores by a predicted spread, or conformalising quantile regression, adapts the width and improves coverage within groups.",
      },
      resolve: {
        kind: "mc",
        id: "unc-resolve-1",
        prompt: "Split conformal's 90% guarantee applies",
        options: [
          { id: "a", text: "on average over test points drawn like the calibration data", correct: true, why: "Marginal coverage." },
          { id: "b", text: "to every individual and every subgroup", misconception: "conformal-conditional", why: "Conditional coverage isn't guaranteed." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "unc-check-1",
        prompt: "A credit model validated at AUC 0.82 on 2022 data is deployed in 2025, after interest rates doubled and applicant incomes changed. You should expect",
        options: [
          { id: "a", text: "performance may have changed: monitor inputs and outcomes, and revalidate", correct: true, why: "Shifted data break the validation assumptions." },
          { id: "b", text: "AUC 0.82, as validated", misconception: "shift-accuracy-holds", why: "Validation estimates performance on data like the validation set." },
          { id: "c", text: "AUC exactly 0.5", why: "It may degrade, but not necessarily to chance." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "unc-check-2",
        prompt: "With 19 calibration scores and $\\alpha = 0.1$, split conformal uses which order statistic?",
        options: [
          { id: "a", text: "the 18th smallest", correct: true, why: "$\\lceil 20 \\times 0.9\\rceil = 18$." },
          { id: "b", text: "the 17th smallest", why: "Use $(n + 1)(1 - \\alpha)$, rounded up." },
          { id: "c", text: "the largest", why: "That would be for $\\alpha = 0.05$ here." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Deployed models need monitoring dashboards: input drift (population stability index per feature), prediction drift, and delayed outcome-based metrics. Conformal methods are increasingly used to give language and vision models calibrated abstention: answer only when the prediction set is a single option.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "unc-produce-1", prompt: "99 calibration scores, $\\alpha = 0.05$. Which order statistic (the $k$-th smallest) gives $\\hat q$?", answer: 95, explain: "$\\lceil 100 \\times 0.95\\rceil$." },
        { kind: "number", id: "unc-produce-2", prompt: "Pinball loss for the 0.9 quantile: forecast 8, outcome 10. Find the loss.", answer: 1.8, explain: "$0.9 \\times 2$." },
        {
          kind: "mc",
          id: "unc-produce-3",
          prompt: "A conformal model achieves 95% coverage overall. For a rare subgroup of patients, coverage is",
          options: [
            { id: "a", text: "not guaranteed: check it separately", correct: true, why: "The guarantee is marginal." },
            { id: "b", text: "also 95% by construction", misconception: "conformal-conditional", why: "Subgroup coverage can be much lower." },
          ],
        },
        {
          kind: "mc",
          id: "unc-produce-4",
          prompt: "A classifier trained to tell last year's inputs from this year's reaches AUC 0.9. This means",
          options: [
            { id: "a", text: "the input distribution has shifted noticeably; revalidate the model", correct: true, why: "Distinguishable inputs signal shift." },
            { id: "b", text: "nothing, since the original validation still holds", misconception: "shift-accuracy-holds", why: "Validation assumed similar data." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "unc-review-1", prompt: "Under covariate shift, an input type is 3 times as common in deployment as in training. Find its importance weight.", answer: 3, explain: "$p_{\\text{new}}/p_{\\text{old}}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "proper scoring rules",
      body: "A scoring rule is **proper** if the forecaster's expected score is best when reporting their true beliefs. The **log score** is $-\\ln\\hat p(y)$; the **Brier score** is proper for probabilities; the **pinball loss** $\\rho_\\tau(y, q) = \\tau(y - q)$ if $y \\ge q$ and $(1 - \\tau)(q - y)$ otherwise is minimised by the true $\\tau$-quantile; **CRPS** averages pinball losses over all quantiles.",
    },
    {
      type: "definition",
      term: "population stability index",
      body: "Bin a feature; with expected (training) proportions $e_k$ and actual (current) proportions $a_k$, $\\text{PSI} = \\sum_k(a_k - e_k)\\ln(a_k/e_k)$. Common rules of thumb: below 0.1 stable, 0.1 to 0.25 moderate shift, above 0.25 significant shift.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "conformal coverage",
      statement: "If the $n$ calibration scores and the test score are exchangeable, the test score is at most the $\\lceil(n + 1)(1 - \\alpha)\\rceil$-th smallest calibration score with probability at least $1 - \\alpha$.",
      proof: ["By exchangeability the test score's rank among all $n + 1$ scores is uniform on $1, \\dots, n + 1$ (ignoring ties), so it falls in the lowest $\\lceil(n + 1)(1 - \\alpha)\\rceil$ ranks with at least that probability."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "importance weighting under covariate shift",
      statement: "If $P(y \\mid x)$ is unchanged, $E_{\\text{new}}[L(f(X), Y)] = E_{\\text{old}}[w(X)L(f(X), Y)]$ with $w(x) = p_{\\text{new}}(x)/p_{\\text{old}}(x)$.",
      proof: ["Write each expectation as an integral over $x$ and $y$; the conditional of $y$ is common, and multiplying by $w$ converts $p_{\\text{old}}(x)$ into $p_{\\text{new}}(x)$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "monitoring deployed models",
      statement: "Track input drift, prediction drift and, when labels arrive, error and calibration over time; set alert thresholds; retrain or recalibrate on recent data when they are crossed. Concept drift can't be seen in the inputs alone: it needs outcome monitoring.",
      proof: ["Covariate and label shift change $P(x)$ or $P(y)$; concept drift changes $P(y \\mid x)$, visible only through outcomes."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Calibration residuals (sorted): 1, 1, 2, 2, 3, 3, 4, 5, 6, 9 ($n = 10$). Find the 80% split-conformal interval for a prediction of 50.",
      solution: ["$\\lceil 11 \\times 0.8\\rceil = 9$: the 9th smallest score is 6.", "Interval $50 \\pm 6 = [44, 56]$."],
      result: "[44, 56].",
    },
    {
      type: "example",
      level: 2,
      title: "pinball loss",
      problem: "A forecaster gives a 0.9 quantile of 8. Find the pinball loss if the outcome is 10, and if it is 6.",
      solution: ["$y = 10 \\ge 8$: $0.9 \\times 2 = 1.8$.", "$y = 6 < 8$: $0.1 \\times 2 = 0.2$. Under-forecasting a high quantile is punished 9 times as hard."],
      result: "1.8 and 0.2.",
    },
    {
      type: "example",
      level: 3,
      title: "population stability index",
      problem: "Training proportions in two bins are 0.5 and 0.5; current proportions are 0.7 and 0.3. Find the PSI.",
      solution: ["$(0.7 - 0.5)\\ln(1.4) + (0.3 - 0.5)\\ln(0.6) = 0.2 \\times 0.336 + 0.2 \\times 0.511$.", "$\\approx 0.169$: moderate shift."],
      result: "About 0.17.",
    },
  ],
  pitfalls: [
    { wrong: "Conformal coverage holds for every subgroup.", right: "It is marginal; check important subgroups separately." },
    { wrong: "Validation performance lasts forever.", right: "Monitor for shift and revalidate." },
    { wrong: "Score quantile forecasts by squared error.", right: "Use the pinball loss or another proper score." },
  ],
  formulas: [
    { label: "Conformal quantile", tex: "\\hat q = s_{(\\lceil(n + 1)(1 - \\alpha)\\rceil)}" },
    { label: "Pinball", tex: "\\rho_\\tau(y, q) = \\max(\\tau(y - q), (\\tau - 1)(y - q))" },
    { label: "PSI", tex: "\\textstyle\\sum_k(a_k - e_k)\\ln(a_k/e_k)" },
    { label: "Importance weight", tex: "w(x) = p_{\\text{new}}(x)/p_{\\text{old}}(x)" },
  ],
  exercises: [
    ex(1, num("uncx-ex-1", "With 49 calibration scores and $\\alpha = 0.1$, which order statistic gives $\\hat q$?", 45, "$\\lceil 50 \\times 0.9\\rceil$."), ["The 45th smallest."]),
    ex(1, num("uncx-ex-2", "Pinball loss for the 0.5 quantile (median): forecast 12, outcome 9. Find the loss.", 1.5, "$0.5 \\times 3$."), ["$1.5$: half the absolute error."]),
    ex(2, num("uncx-ex-3", "Calibration residuals sorted: 2, 3, 3, 4, 5, 7, 8, 10, 12, 15, 20 ($n = 11$). Find $\\hat q$ for 75% intervals.", 12, "$\\lceil 12 \\times 0.75\\rceil = 9$: the 9th smallest."), ["Counting 2, 3, 3, 4, 5, 7, 8, 10, 12, the 9th smallest is 12."]),
    ex(2, dp("uncx-ex-4", "Training bin proportions 0.4, 0.6; current 0.5, 0.5. Find the PSI.", 0.1 * Math.log(0.5 / 0.4) + -0.1 * Math.log(0.5 / 0.6), "$\\sum(a - e)\\ln(a/e)$."), ["$0.1\\ln 1.25 - 0.1\\ln(5/6) \\approx 0.041$: stable."]),
    ex(2, num("uncx-ex-5", "Under covariate shift a type of input has density 0.02 in training and 0.005 in deployment. Find its importance weight.", 0.25, "$0.005/0.02$."), ["$0.25$."]),
    ex(3, mc("uncx-ex-6", "A spam filter's inputs look the same as last year, but spammers now use the words that used to mark genuine mail. This is", ["concept drift", "$P(y \\mid x)$ has changed."], [["covariate shift", "The inputs' distribution hasn't changed."], ["label shift", "The spam rate may be the same."]]), ["Only monitoring outcomes reveals it."]),
    ex(3, mc("uncx-ex-7", "Ensemble members agree closely on training-like inputs but disagree wildly on a new kind of input. This disagreement mostly reflects", ["epistemic uncertainty", "Lack of data in that region."], [["aleatoric uncertainty", "That is noise even with unlimited data."], ["a calibration error", "It is a genuine knowledge gap."]]), ["Flag such inputs or collect data there."]),
    ex(3, mc("uncx-ex-8", "Conformal prediction's guarantee needs", ["calibration and test data to be exchangeable", "That is its only assumption."], [["a correctly specified model", "Any model works; better models give narrower sets."], ["normal errors", "No distributional assumption is needed."]]), ["Under shift, the guarantee can fail; weighted conformal methods adjust for covariate shift."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([19, 39, 49, 79, 99, 199]);
      const a = r.pick([0.05, 0.1, 0.2]);
      const k = Math.ceil((nn + 1) * (1 - a) - 1e-9);
      return n(`Split conformal with ${nn} calibration scores and $\\alpha = ${a}$. Which order statistic (the $k$-th smallest) gives $\\hat q$?`, k, `$\\lceil ${nn + 1} \\times ${r2(1 - a)}\\rceil = ${k}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const tau = r.pick([0.1, 0.25, 0.5, 0.75, 0.9]);
      const q = r.int(5, 20);
      const y = q + r.nonzero(-6, 6);
      const v = pinball(tau, y, q);
      return n(`Pinball loss for the ${tau} quantile: forecast ${q}, outcome ${y}. Find the loss.`, r2(v), y >= q ? `$${tau} \\times (${y} - ${q}) = ${r2(v)}$.` : `$${r2(1 - tau)} \\times (${q} - ${y}) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const e = r.pick([0.3, 0.4, 0.5, 0.6]);
      const a = r.pick([0.2, 0.35, 0.45, 0.55, 0.7]);
      const v = (a - e) * Math.log(a / e) + (1 - a - (1 - e)) * Math.log((1 - a) / (1 - e));
      return n(`Two bins: training proportions ${e} and ${r2(1 - e)}; current proportions ${a} and ${r2(1 - a)}. Find the population stability index (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sum(a_k - e_k)\\ln(a_k/e_k) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const g = r.pick(["patients over 80", "applicants from rural areas", "homes above ₹5 crore", "first-time customers"]);
      return mcNumbers(
        `A conformal model's 90% intervals cover 90.4% of all test cases. For ${g}, coverage is`,
        { text: "not guaranteed; it must be checked", why: "Conformal coverage is marginal." },
        [
          { text: "at least 90% as well", why: "Subgroups can be under-covered.", misconception: "conformal-conditional" },
          { text: "exactly 90.4%", why: "Subgroup coverage varies." },
        ],
      );
    },
  },
];
