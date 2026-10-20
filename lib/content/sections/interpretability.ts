import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Model interpretability: interpretable models, permutation importance, partial dependence and ICE, Shapley values and SHAP, limitations with correlated features and causal readings. */

const base: ConceptNode = {
  id: "interpretability",
  title: "Interpreting models",
  summary: "Accurate models are often opaque. Interpretation methods ask which features a model relies on and how its predictions change with them. Permutation importance measures the loss in accuracy when a feature is scrambled; partial dependence plots trace the average prediction as one feature varies; SHAP values split each individual prediction fairly among the features. All describe the model, not the world.",
  deps: ["trees-ensembles", "multiple-regression", "potential-outcomes"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "global explanation", meaning: "A description of a model's behaviour across all inputs, such as feature importance." },
    { term: "local explanation", meaning: "A description of one particular prediction, such as its SHAP values." },
    { term: "Shapley value", meaning: "A feature's average marginal contribution to the prediction over all orders of adding features." },
  ],
  misconceptions: {
    "importance-causal": "Reads a feature's importance in a predictive model as its causal effect on the outcome.",
    "permutation-correlated": "Expects permutation importance to show the full importance of each of two strongly correlated features.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why did it say no?",
      body: "A loan model rejects an applicant. The applicant, the regulator and the bank's own analysts all want to know why. Was it income, debt, or something that shouldn't matter, such as postcode standing in for ethnicity? Interpretation tools answer \"what drives this model\", which is essential for debugging and fairness, and is easily mistaken for \"what drives the outcome\".",
      realWorld: {
        title: "Right to explanation",
        body: "Credit regulations in many countries require lenders to give applicants the main reasons for an adverse decision. Lenders using machine-learning models often generate those reasons from SHAP values.",
      },
    },
    {
      type: "truth",
      statement: "**Permutation importance** of feature $j$: the drop in a held-out score when column $j$ is randomly shuffled, breaking its link to the target. **Partial dependence** $\\text{PD}_j(v) = \\tfrac1n\\sum_if(v, \\vec x_{i,-j})$: set feature $j$ to $v$ for everyone and average the predictions; **ICE** curves show each individual's line. **Shapley values** split $f(\\vec x) - E[f(\\vec X)]$ among the features: $\\phi_j = \\sum_{S}\\dfrac{\\lvert S\\rvert!\\,(p - \\lvert S\\rvert - 1)!}{p!}\\left[v(S \\cup \\{j\\}) - v(S)\\right]$ over subsets $S$ not containing $j$, where $v(S)$ is the expected prediction knowing only the features in $S$; they satisfy $\\sum_j\\phi_j = f(\\vec x) - E[f(\\vec X)]$.",
      body: "For a linear model with independent features, $\\phi_j = \\beta_j(x_j - E[x_j])$. **SHAP** methods compute or approximate Shapley values efficiently (exactly for trees). With correlated features, shuffling or fixing one feature creates unrealistic inputs, so partial dependence may extrapolate and permutation importance is split or hidden between correlated features; accumulated local effects (ALE) and grouped importance help. Interpretable-by-design models (sparse linear models, small trees, generalised additive models) avoid the gap. And importance is predictive: a feature can matter to the model because it is a symptom, a proxy or a consequence, not a cause (§{potential-outcomes}).",
    },
    {
      type: "predict",
      misconception: "permutation-correlated",
      item: {
        kind: "mc",
        id: "itp-predict-1",
        prompt: "A model uses two nearly identical features, height in cm and height in inches, both strongly predictive. Shuffling either one alone, the model's accuracy",
        options: [
          { id: "a", text: "barely drops, because the other copy still carries the information", correct: true, why: "Each looks unimportant on its own." },
          { id: "b", text: "drops a lot for each, showing both are highly important", misconception: "permutation-correlated", why: "The unshuffled twin substitutes for the shuffled one." },
          { id: "c", text: "rises", why: "Removing information doesn't usually help." },
        ],
      },
      reveal: {
        body: "Permutation importance measures what the model loses without that one feature, given all the others. With a near-duplicate available, very little is lost, so both copies can look unimportant although height matters a great deal. Permute correlated features together, or cluster them and report group importance.",
      },
      resolve: {
        kind: "mc",
        id: "itp-resolve-1",
        prompt: "Two strongly correlated predictors each show low permutation importance. You should",
        options: [
          { id: "a", text: "permute them together to measure their joint importance", correct: true, why: "Individually, each covers for the other." },
          { id: "b", text: "conclude both are unimportant", misconception: "permutation-correlated", why: "Their shared information may matter a lot." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itp-check-1",
        prompt: "In a hospital model predicting death, \"was given a ventilator\" has the highest SHAP importance. This means",
        options: [
          { id: "a", text: "the model leans on it heavily for prediction, probably because it signals severe illness", correct: true, why: "Importance reflects prediction, not causation." },
          { id: "b", text: "ventilators cause death", misconception: "importance-causal", why: "Sicker patients get ventilated; the feature is a marker." },
          { id: "c", text: "the model is wrong", why: "It may predict well; it just isn't causal." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "itp-check-2",
        prompt: "A model's held-out accuracy is 0.85; with feature $j$ shuffled it is 0.70. The permutation importance of $j$ is",
        options: [
          { id: "a", text: "0.15", correct: true, why: "$0.85 - 0.70$." },
          { id: "b", text: "0.70", why: "That is the shuffled score." },
          { id: "c", text: "1.21", why: "Importance is usually the difference, not the ratio." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Interpretation tools catch \"clever Hans\" models that learned shortcuts: an image classifier keying on watermarks, or a pneumonia model keying on the hospital's scanner. For language and vision models, attribution maps and probing extend the same ideas, with the same caution that explanations describe the model, not the world.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "itp-produce-1", prompt: "Linear model $f = 3 + 2x_1 - x_2$ with independent features, $E[x_1] = 2$, $E[x_2] = 3$. Find $\\phi_1$ at $x_1 = 4$.", answer: 4, explain: "$2 \\times (4 - 2)$." },
        { kind: "number", id: "itp-produce-2", prompt: "Same model at $x_2 = 1$. Find $\\phi_2$.", answer: 2, explain: "$-1 \\times (1 - 3)$." },
        {
          kind: "mc",
          id: "itp-produce-3",
          prompt: "A churn model's most important feature is \"number of complaints\". Reducing complaints by policy would",
          options: [
            { id: "a", text: "not necessarily reduce churn: the importance is predictive, not causal", correct: true, why: "Complaints may be a symptom of underlying dissatisfaction." },
            { id: "b", text: "reduce churn in proportion to the importance", misconception: "importance-causal", why: "Predictive importance isn't an effect size." },
          ],
        },
        {
          kind: "mc",
          id: "itp-produce-4",
          prompt: "Income and wealth are highly correlated in a credit model. Permutation importance for each separately will likely",
          options: [
            { id: "a", text: "understate how much the pair matters", correct: true, why: "Each covers for the other when shuffled." },
            { id: "b", text: "show each one's full importance", misconception: "permutation-correlated", why: "Shared information is lost only when both are shuffled." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "itp-review-1", prompt: "A prediction is 20 and the average prediction is 12. The SHAP values of three features must sum to what?", answer: 8, explain: "$20 - 12$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "partial dependence and ICE",
      body: "Partial dependence averages the model's prediction over the data while forcing one feature to each value in turn: a global curve of the feature's average effect on the prediction. **Individual conditional expectation** curves plot the same for each row separately; when they fan out or cross, the feature interacts with others and the average hides it. Because PD sets values regardless of the other features, it can evaluate the model on impossible inputs when features are correlated; **ALE** plots use only nearby, realistic changes.",
    },
    {
      type: "definition",
      term: "Shapley values",
      body: "Treat the features as players and the prediction as the payout. A feature's Shapley value is its marginal contribution $v(S \\cup \\{j\\}) - v(S)$ averaged over all $p!$ orders in which features could be added. It is the unique attribution with **efficiency** (values sum to $f(\\vec x) - E f$), **symmetry**, **dummy** (a feature that never changes the prediction gets 0) and **additivity**.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "SHAP for a linear model",
      statement: "If $f(\\vec x) = \\beta_0 + \\sum_j\\beta_jx_j$ and the features are independent, then $\\phi_j = \\beta_j(x_j - E[x_j])$.",
      proof: ["Knowing feature $j$ changes the expected prediction by $\\beta_j(x_j - E[x_j])$ whatever else is known, so every marginal contribution equals that."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "two-feature Shapley values",
      statement: "With two features, $\\phi_1 = \\tfrac12\\left[(v(\\{1\\}) - v(\\varnothing)) + (v(\\{1, 2\\}) - v(\\{2\\}))\\right]$, and similarly for $\\phi_2$.",
      proof: ["There are two orders: feature 1 first contributes $v(\\{1\\}) - v(\\varnothing)$; second contributes $v(\\{1, 2\\}) - v(\\{2\\})$. Average them."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "using explanations responsibly",
      statement: "Compute importances on held-out data; check stability across resamples; group correlated features; show ICE curves alongside partial dependence; and never present predictive importance as a causal effect without a causal design.",
      proof: ["Each step addresses a known failure: overfitting, noise, substitution, hidden interactions and confounding."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Baseline accuracy 0.85. Shuffling features A, B, C gives 0.70, 0.84 and 0.80. Rank their permutation importance.",
      solution: ["Drops: A $0.15$, B $0.01$, C $0.05$.", "A > C > B."],
      result: "A, then C, then B.",
    },
    {
      type: "example",
      level: 2,
      title: "Shapley values by hand",
      problem: "Expected predictions: $v(\\varnothing) = 10$, $v(\\{1\\}) = 14$, $v(\\{2\\}) = 12$, $v(\\{1, 2\\}) = 20$. Find $\\phi_1$ and $\\phi_2$.",
      solution: ["$\\phi_1 = \\tfrac12[(14 - 10) + (20 - 12)] = 6$.", "$\\phi_2 = \\tfrac12[(12 - 10) + (20 - 14)] = 4$; check $6 + 4 = 20 - 10$."],
      result: "$\\phi_1 = 6$, $\\phi_2 = 4$.",
    },
    {
      type: "example",
      level: 3,
      title: "a linear model",
      problem: "$f = 3 + 2x_1 - x_2$, independent features with means 2 and 3. Explain the prediction at $(4, 1)$.",
      solution: ["$f(4, 1) = 10$; $E f = 3 + 4 - 3 = 4$.", "$\\phi_1 = 2(4 - 2) = 4$, $\\phi_2 = -(1 - 3) = 2$; total $6 = 10 - 4$."],
      result: "$x_1$ adds 4, $x_2$ adds 2.",
    },
  ],
  pitfalls: [
    { wrong: "Feature importance is a causal effect.", right: "It describes the model's reliance on the feature." },
    { wrong: "Permute correlated features one at a time.", right: "Permute or attribute them as a group." },
    { wrong: "Trust a partial dependence plot everywhere.", right: "Check ICE curves and avoid regions with no data." },
  ],
  formulas: [
    { label: "Permutation importance", tex: "\\text{score} - \\text{score}_{\\text{shuffled } j}" },
    { label: "Partial dependence", tex: "\\text{PD}_j(v) = \\tfrac1n\\textstyle\\sum_if(v, \\vec x_{i,-j})" },
    { label: "Efficiency", tex: "\\textstyle\\sum_j\\phi_j = f(\\vec x) - E[f(\\vec X)]" },
    { label: "Linear SHAP", tex: "\\phi_j = \\beta_j(x_j - E[x_j])" },
  ],
  exercises: [
    ex(1, num("itpx-ex-1", "Held-out AUC 0.90; with a feature shuffled, 0.82. Find its permutation importance.", 0.08, "$0.90 - 0.82$."), ["$0.08$."]),
    ex(1, num("itpx-ex-2", "A prediction is 0.7, the mean prediction 0.3, and two features have SHAP values 0.25 and $x$. Find $x$.", 0.15, "They sum to 0.4."), ["$0.15$."]),
    ex(2, num("itpx-ex-3", "$v(\\varnothing) = 5$, $v(\\{1\\}) = 9$, $v(\\{2\\}) = 6$, $v(\\{1, 2\\}) = 12$. Find $\\phi_1$.", 5, "$\\tfrac12[(9 - 5) + (12 - 6)]$."), ["$5$; then $\\phi_2 = 2$."]),
    ex(2, num("itpx-ex-4", "Linear model coefficient $\\beta = -3$ for a feature with mean 10. Find its SHAP value at 12.", -6, "$-3 \\times 2$."), ["$-6$."]),
    ex(2, num("itpx-ex-5", "A model predicts $f = 2x_1 + 5$ for every row. Its partial dependence at $x_1 = 3$ is", 11, "No other features enter."), ["$11$."]),
    ex(3, mc("itpx-ex-6", "ICE curves for a feature slope up for half the rows and down for the other half; the partial dependence plot is flat. This shows", ["a strong interaction hidden by averaging", "The average cancels opposite effects."], [["the feature has no effect", "It has large but opposite effects."], ["an error in the plot", "It is a known limitation of averaging."]]), ["Look for which feature splits the two groups."]),
    ex(3, mc("itpx-ex-7", "A dummy feature that never changes the model's prediction gets Shapley value", ["0", "The dummy axiom."], [["$1/p$ of the total", "Only symmetric, contributing features share equally."], ["undefined", "It is 0."]]), ["Shapley values are the unique fair attribution with these axioms."]),
    ex(3, mc("itpx-ex-8", "A model trained on hospital data assigns high importance to the scanner model used. This most likely reveals", ["a shortcut: scanner type correlates with which hospital, and so with patient mix", "The model learned a proxy."], [["that scanners cause disease", "Importance isn't causal."], ["nothing worth checking", "Shortcuts often fail on new hospitals."]]), ["Test on data from other hospitals."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const v0 = r.int(0, 20);
      const v1 = v0 + r.int(-5, 10);
      const v2 = v0 + r.int(-5, 10);
      const v12 = v0 + r.int(-5, 20);
      const want = r.pick([1, 2]);
      const phi = want === 1 ? ((v1 - v0) + (v12 - v2)) / 2 : ((v2 - v0) + (v12 - v1)) / 2;
      return n(`Expected predictions: $v(\\varnothing) = ${v0}$, $v(\\{1\\}) = ${v1}$, $v(\\{2\\}) = ${v2}$, $v(\\{1, 2\\}) = ${v12}$. Find the Shapley value $\\phi_${want}$.`, phi, want === 1 ? `$\\tfrac12[(${v1} - ${v0}) + (${v12} - ${v2})] = ${phi}$.` : `$\\tfrac12[(${v2} - ${v0}) + (${v12} - ${v1})] = ${phi}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.nonzero(-5, 5);
      const m = r.int(0, 20);
      const x = m + r.nonzero(-6, 6);
      return n(`A linear model has coefficient ${b} on a feature with mean ${m}; features are independent. Find the feature's SHAP value at ${x}.`, b * (x - m), `$${b} \\times (${x} - ${m}) = ${b * (x - m)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = r2(r.int(70, 95) / 100);
      const d = r2(r.int(0, 20) / 100);
      return n(`A model's held-out accuracy is ${s}; with one feature shuffled it is ${r2(s - d)}. Find that feature's permutation importance.`, d, `$${s} - ${r2(s - d)} = ${d}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { f: "number of hospital visits", y: "predicted cost of care" },
        { f: "late payments last year", y: "predicted default" },
        { f: "umbrella sales", y: "predicted rainfall" },
        { f: "firefighters at the scene", y: "predicted fire damage" },
      ]);
      return mcNumbers(
        `In a model of ${v.y}, \"${v.f}\" has the largest SHAP importance. This shows`,
        { text: "the model relies on it to predict, not that it causes the outcome", why: "Importance is predictive." },
        [
          { text: "it causes the outcome", why: "A marker or consequence can be highly predictive.", misconception: "importance-causal" },
          { text: "the model is broken", why: "It may predict well." },
        ],
      );
    },
  },
];
