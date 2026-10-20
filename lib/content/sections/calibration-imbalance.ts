import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Probability calibration (reliability diagrams, Brier score, ECE, Platt and isotonic recalibration) and class imbalance (misleading accuracy, resampling, class weights, thresholds, prior correction). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const priorCorrect = (p: number, trainPrev: number, truePrev: number) => {
  const odds = (p / (1 - p)) * ((truePrev / (1 - truePrev)) / (trainPrev / (1 - trainPrev)));
  return odds / (1 + odds);
};

const base: ConceptNode = {
  id: "calibration-imbalance",
  title: "Calibration & class imbalance",
  summary: "A model's probabilities are calibrated if, among all cases given probability 0.3, about 30% turn out positive. Good ranking (high AUC) doesn't guarantee it, and decisions based on costs need it. Rare classes cause a related problem: a model can score 99% accuracy by never predicting fraud. Resampling, class weights and moving the threshold help, but they distort probabilities, which then need correcting.",
  deps: ["roc-auc", "precision-recall", "logistic-regression"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "calibrated", meaning: "Predicted probabilities match observed frequencies: $P(Y = 1 \\mid \\hat p = p) = p$." },
    { term: "Brier score", meaning: "The mean squared difference between predicted probabilities and 0/1 outcomes; lower is better." },
    { term: "class imbalance", meaning: "One class is much rarer than another, such as 1 fraud in 1,000 transactions." },
  ],
  misconceptions: {
    "accuracy-imbalanced": "Judges a classifier on rare-event data by its accuracy.",
    "auc-means-calibrated": "Thinks a high AUC means the model's probabilities are accurate.",
  },
  steps: [
    {
      type: "motivate",
      title: "What does 70% mean?",
      body: "A weather app that says \"70% chance of rain\" is useful only if it rains on about 70% of such days. A model that ranks patients perfectly by risk but reports every probability as either 0.01 or 0.99 is useless for deciding whether a treatment with side effects is worth it. Probabilities used for decisions must be calibrated.",
      realWorld: {
        title: "Fraud detection",
        body: "Card fraud is roughly 1 transaction in 1,000. A model that never flags anything is 99.9% accurate and catches nothing. Fraud teams judge models by precision and recall at a workable alert volume, and by expected losses saved.",
      },
    },
    {
      type: "truth",
      statement: "Check calibration with a **reliability diagram**: bin the predictions, and plot each bin's mean predicted probability against its observed positive rate; a calibrated model lies on the diagonal. Summaries: the **Brier score** $\\tfrac1n\\sum(\\hat p_i - y_i)^2$ and the **expected calibration error**, the size-weighted average gap across bins. Recalibrate on held-out data by **Platt scaling** (a logistic regression of $y$ on the model's score), **isotonic regression** (a monotone step function), or, for neural networks, **temperature scaling**.",
      body: "With a rare positive class, accuracy is dominated by the majority: report precision, recall, F1 or the PR curve (§{precision-recall}), and balanced accuracy $\\tfrac12(\\text{TPR} + \\text{TNR})$. Remedies: **class weights** in the loss, **resampling** (undersample the majority, oversample the minority, or synthesise minority points with SMOTE), and choosing the **threshold** from costs rather than using 0.5. Training on rebalanced data inflates predicted probabilities; correct them by adjusting the odds: $\\text{odds}_{\\text{true}} = \\text{odds}_{\\text{model}} \\times \\dfrac{\\pi/(1 - \\pi)}{\\pi_s/(1 - \\pi_s)}$, with $\\pi$ the real prevalence and $\\pi_s$ the training one.",
    },
    {
      type: "predict",
      misconception: "auc-means-calibrated",
      item: {
        kind: "mc",
        id: "cal-predict-1",
        prompt: "Model A has AUC 0.92. Squaring all its predicted probabilities gives model B. Compared with A, model B has",
        options: [
          { id: "a", text: "the same AUC but different, probably worse-calibrated probabilities", correct: true, why: "Squaring keeps the ranking but shrinks every probability." },
          { id: "b", text: "the same AUC and equally good probabilities, since AUC measures probability quality", misconception: "auc-means-calibrated", why: "AUC depends only on the order of the scores." },
          { id: "c", text: "a lower AUC", why: "A monotone transformation keeps every ranking." },
        ],
      },
      reveal: {
        body: "AUC is the probability a random positive outranks a random negative (§{roc-auc}): any increasing transformation of the scores leaves it unchanged. But a case A rated 0.6 becomes 0.36 in B; if about 60% of such cases were positive, B is now badly miscalibrated. Ranking quality and probability quality are separate properties: check both.",
      },
      resolve: {
        kind: "mc",
        id: "cal-resolve-1",
        prompt: "To know whether a model's probabilities can be taken at face value, look at",
        options: [
          { id: "a", text: "a reliability diagram or calibration error on held-out data", correct: true, why: "They compare predicted and observed rates." },
          { id: "b", text: "its AUC", misconception: "auc-means-calibrated", why: "AUC ignores the probability scale." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cal-check-1",
        prompt: "Only 2% of loan applicants default. A model reaches 98% accuracy. This tells you",
        options: [
          { id: "a", text: "almost nothing: predicting \"no default\" for everyone also scores 98%", correct: true, why: "Check recall and precision for defaulters." },
          { id: "b", text: "the model is excellent", misconception: "accuracy-imbalanced", why: "The trivial model matches it." },
          { id: "c", text: "the model is useless", why: "It might be useful; accuracy just can't tell." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cal-check-2",
        prompt: "Among 200 cases given probability about 0.8, 120 were positive. In this bin the model is",
        options: [
          { id: "a", text: "overconfident: it predicts 0.8 but 0.6 occur", correct: true, why: "$120/200 = 0.6$." },
          { id: "b", text: "well calibrated", why: "0.6 is far from 0.8." },
          { id: "c", text: "underconfident", why: "That would mean more positives than predicted." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Modern deep networks are often overconfident; temperature scaling, a single parameter dividing the logits, fixes much of it. Calibrated probabilities matter wherever outputs are combined with costs: medical triage, credit limits, ad bidding, and deciding when a model should defer to a human.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cal-produce-1", prompt: "Predictions 0.9, 0.2, 0.6 with outcomes 1, 0, 0. Find the Brier score to 3 decimals.", answer: Math.round(((0.01 + 0.04 + 0.36) / 3) * 1000) / 1000, tolerance: 0.001, explain: "$(0.01 + 0.04 + 0.36)/3$." },
        { kind: "number", id: "cal-produce-2", prompt: "Recall on positives 0.6; true negative rate 0.98. Find the balanced accuracy.", answer: 0.79, explain: "$(0.6 + 0.98)/2$." },
        {
          kind: "mc",
          id: "cal-produce-3",
          prompt: "1 in 500 machines fails each month. A failure predictor is best judged by",
          options: [
            { id: "a", text: "precision and recall for failures, or the PR curve", correct: true, why: "They focus on the rare class." },
            { id: "b", text: "overall accuracy", misconception: "accuracy-imbalanced", why: "Never predicting failure is 99.8% accurate." },
          ],
        },
        {
          kind: "mc",
          id: "cal-produce-4",
          prompt: "A credit model ranks applicants well (AUC 0.85). Before using its probabilities to set interest rates, you should",
          options: [
            { id: "a", text: "check and, if needed, recalibrate them on held-out data", correct: true, why: "Good ranking doesn't imply accurate probabilities." },
            { id: "b", text: "use them directly, since a high AUC means accurate probabilities", misconception: "auc-means-calibrated", why: "AUC ignores calibration." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "cal-review-1", prompt: "A model predicts 0.7 for a case that turns out positive. Find this case's Brier contribution.", answer: 0.09, explain: "$(0.7 - 1)^2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "expected calibration error",
      body: "Split predictions into bins $B_1, \\dots, B_M$. $\\text{ECE} = \\sum_m\\dfrac{\\lvert B_m\\rvert}{n}\\left\\lvert\\bar y_{B_m} - \\bar p_{B_m}\\right\\rvert$, the weighted average gap between observed rate and mean prediction. The Brier score combines calibration with **refinement** (how well the probabilities separate classes).",
    },
    {
      type: "definition",
      term: "choosing a threshold from costs",
      body: "If a false negative costs $c_{\\text{FN}}$ and a false positive $c_{\\text{FP}}$, flag a case when $\\hat p\\,c_{\\text{FN}} > (1 - \\hat p)\\,c_{\\text{FP}}$, that is when $\\hat p > \\dfrac{c_{\\text{FP}}}{c_{\\text{FP}} + c_{\\text{FN}}}$. This needs calibrated $\\hat p$; with a missed fraud costing 20 times a false alarm, the threshold is $1/21 \\approx 0.048$, not 0.5.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "AUC ignores calibration",
      statement: "For any strictly increasing function $g$, the scores $g(\\hat p)$ have the same AUC as $\\hat p$.",
      proof: ["AUC depends only on comparisons $\\hat p_i > \\hat p_j$ between positives and negatives, which $g$ preserves."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "prior correction",
      statement: "A model trained with positive rate $\\pi_s$ and applied where the rate is $\\pi$ should have its odds multiplied by $\\dfrac{\\pi/(1 - \\pi)}{\\pi_s/(1 - \\pi_s)}$, if resampling changed only the class balance.",
      proof: ["By Bayes' rule, posterior odds are likelihood ratio times prior odds (§{bayes}); resampling changes only the prior odds, so swap them."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "handling imbalance",
      statement: "Pick a metric that reflects the rare class and the costs; try class weights or resampling only on the training folds (never before splitting); tune the threshold on validation data; and correct or recalibrate probabilities before using them as probabilities.",
      proof: ["Resampling before the split leaks duplicated or synthetic points into the test set and inflates scores."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Predictions 0.9, 0.2, 0.6 for outcomes 1, 0, 0. Find the Brier score, and compare with always predicting 1/3.",
      solution: ["$(0.01 + 0.04 + 0.36)/3 \\approx 0.137$.", "Constant $\\tfrac13$: $(\\tfrac49 + \\tfrac19 + \\tfrac19)/3 \\approx 0.222$. The model is better."],
      result: "0.137 against 0.222.",
    },
    {
      type: "example",
      level: 2,
      title: "prior correction",
      problem: "A fraud model was trained on 50/50 resampled data; real prevalence is 1%. It outputs 0.8 for a transaction. Find the corrected probability.",
      solution: ["Model odds 4; correction factor $\\dfrac{0.01/0.99}{1} \\approx 0.0101$.", "Corrected odds $\\approx 0.0404$, probability $\\approx 0.039$."],
      result: "About 3.9%, not 80%.",
    },
    {
      type: "example",
      level: 3,
      title: "balanced accuracy",
      problem: "Of 1,000 cases, 20 are positive. A model flags 30, of which 15 are positive. Find accuracy, recall, precision and balanced accuracy.",
      solution: ["TP 15, FP 15, FN 5, TN 965. Accuracy $980/1000 = 0.98$; recall $15/20 = 0.75$; precision $0.5$.", "TNR $965/980 \\approx 0.985$; balanced accuracy $\\approx (0.75 + 0.985)/2 \\approx 0.867$."],
      result: "0.98, 0.75, 0.5, 0.867.",
    },
  ],
  pitfalls: [
    { wrong: "Report accuracy on rare-event data.", right: "Report precision, recall, PR-AUC or balanced accuracy." },
    { wrong: "High AUC means trustworthy probabilities.", right: "Check calibration separately." },
    { wrong: "Use probabilities from a rebalanced model as is.", right: "Apply the prior correction or recalibrate." },
  ],
  formulas: [
    { label: "Brier", tex: "\\tfrac1n\\textstyle\\sum(\\hat p_i - y_i)^2" },
    { label: "ECE", tex: "\\textstyle\\sum_m\\tfrac{\\lvert B_m\\rvert}{n}\\lvert\\bar y_{B_m} - \\bar p_{B_m}\\rvert" },
    { label: "Cost threshold", tex: "\\hat p > \\dfrac{c_{\\text{FP}}}{c_{\\text{FP}} + c_{\\text{FN}}}" },
    { label: "Prior correction", tex: "\\text{odds} \\times \\dfrac{\\pi/(1 - \\pi)}{\\pi_s/(1 - \\pi_s)}" },
  ],
  exercises: [
    ex(1, num("calx-ex-1", "A model predicts 0.3 for a case that turns out negative. Find its Brier contribution.", 0.09, "$0.3^2$."), ["$0.09$."]),
    ex(1, num("calx-ex-2", "0.5% of transactions are fraud. What accuracy does \"never fraud\" achieve, in percent?", 99.5, "$100 - 0.5$."), ["$99.5\\%$."]),
    ex(2, dp("calx-ex-3", "A missed default costs ₹50,000; rejecting a good applicant costs ₹5,000. Find the probability threshold for rejecting.", 5000 / 55000, "$c_{\\text{FP}}/(c_{\\text{FP}} + c_{\\text{FN}})$."), ["$\\tfrac1{11} \\approx 0.091$."]),
    ex(2, dp("calx-ex-4", "A model trained on 50/50 data outputs 0.5; real prevalence is 2%. Find the corrected probability.", priorCorrect(0.5, 0.5, 0.02), "Odds 1 times $0.02/0.98$."), ["$0.02$: a 50/50 model saying \"even\" means \"base rate\"."]),
    ex(2, num("calx-ex-5", "Two bins: 100 cases with mean prediction 0.2 and observed rate 0.25; 100 with mean 0.7 and observed 0.6. Find the ECE.", 0.075, "$0.5 \\times 0.05 + 0.5 \\times 0.1$."), ["$0.075$."]),
    ex(3, dp("calx-ex-6", "A model trained with 20% positives outputs 0.6 in deployment, where prevalence is 5%. Find the corrected probability.", priorCorrect(0.6, 0.2, 0.05), "Multiply odds 1.5 by $\\tfrac{0.05/0.95}{0.2/0.8}$."), ["Factor $\\approx 0.2105$; odds $\\approx 0.316$; probability $\\approx 0.240$."]),
    ex(3, mc("calx-ex-7", "SMOTE oversampling is applied to the whole dataset before splitting into train and test. The test score will be", ["optimistic, because synthetic points derived from training cases leak into the test set", "Resample only within training folds."], [["unbiased", "Leakage inflates it."], ["pessimistic", "Leakage helps the model look better."]]), ["Split first, then resample the training part."]),
    ex(3, mc("calx-ex-8", "A reliability diagram's curve lies below the diagonal at high predictions. The model is", ["overconfident at the high end", "Observed rates fall short of predictions."], [["underconfident", "That would lie above the diagonal."], ["perfectly calibrated", "It departs from the diagonal."]]), ["Platt scaling or isotonic regression can fix it."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const ps = Array.from({ length: k }, () => r.pick([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9]));
      const ys = Array.from({ length: k }, () => r.pick([0, 1]));
      const b = ps.reduce((s, p, i) => s + (p - ys[i]) ** 2, 0) / k;
      return n(`Predicted probabilities ${ps.join(", ")} for outcomes ${ys.join(", ")}. Find the Brier score (3 decimals).`, Math.round(b * 1000) / 1000, `Mean of $(\\hat p - y)^2$: $\\approx ${Math.round(b * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const fp = r.pick([1, 2, 5, 10]);
      const fn = r.pick([10, 20, 50, 100]);
      const t = fp / (fp + fn);
      return n(`A false positive costs ${fp} and a false negative ${fn}. Find the cost-minimising probability threshold (3 decimals).`, Math.round(t * 1000) / 1000, `$${fp}/(${fp} + ${fn}) \\approx ${Math.round(t * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.pick([0.3, 0.5, 0.6, 0.8, 0.9]);
      const ts = r.pick([0.5, 0.3, 0.2]);
      const tp = r.pick([0.01, 0.02, 0.05, 0.1]);
      const v = priorCorrect(p, ts, tp);
      return n(`A model trained with ${Math.round(ts * 100)}% positives outputs ${p}. The real prevalence is ${Math.round(tp * 100)}%. Find the prior-corrected probability (3 decimals).`, Math.round(v * 1000) / 1000, `Multiply the odds $${r2(p / (1 - p))}$ by $\\tfrac{${tp}/${r2(1 - tp)}}{${ts}/${r2(1 - ts)}}$: $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const rate = r.pick([0.5, 1, 2, 3]);
      return mcNumbers(
        `${rate}% of cases are positive. A classifier reports ${100 - rate}% accuracy. This shows`,
        { text: "nothing useful: predicting all negative scores the same", why: "Look at recall and precision on the positives." },
        [
          { text: "an excellent model", why: "The trivial model matches it.", misconception: "accuracy-imbalanced" },
          { text: "a model that finds most positives", why: "It may find none." },
        ],
      );
    },
  },
];
