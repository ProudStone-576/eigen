import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Missing-data mechanisms, imputation, measurement quality, data validation. */

const base: ConceptNode = {
  id: "data-quality",
  title: "Missing data & data quality",
  summary: "Why a value is missing matters more than how many are missing. Data missing completely at random only cost precision; data missing at random can be repaired using what was observed; data missing not at random bias every simple fix. Mean imputation shrinks variance and hides the problem.",
  deps: ["sampling-bias"],
  pos: { x: 2, y: 1 },
  glossary: [
    { term: "imputation", meaning: "Filling in a missing value with an estimate." },
    { term: "complete-case analysis", meaning: "Using only the rows with no missing values (listwise deletion)." },
    { term: "validity", meaning: "Whether a measurement measures what it claims to. Reliability is whether it gives consistent results when repeated." },
  ],
  misconceptions: {
    "dropping-is-safe": "Thinks deleting rows with missing values is always harmless, apart from losing some data.",
    "mean-imputation-harmless": "Thinks filling gaps with the mean leaves the data's spread and relationships unchanged.",
  },
  steps: [
    {
      type: "motivate",
      title: "The empty cells",
      body: "A health survey asks people their weight. Ten percent leave it blank. If the blanks are a random tenth, little is lost. If heavier people skip the question more often, every average computed from the answers is too low, whatever you do with the blanks afterwards.",
      realWorld: {
        title: "Clinical trials",
        body: "Patients who drop out of a trial often do so because the treatment isn't working or has side effects. Analysing only the patients who finished makes a drug look better than it is, which is why regulators require plans for missing data before a trial starts.",
      },
    },
    {
      type: "truth",
      statement: "Values are **missing completely at random** (MCAR) if missingness is unrelated to anything; **missing at random** (MAR) if it depends only on observed variables; **missing not at random** (MNAR) if it depends on the missing value itself.",
      body: "Under MCAR, dropping incomplete rows is unbiased, only less precise. Under MAR it can be biased, but methods that use the observed variables (regression or multiple imputation, weighting) can fix it. Under MNAR no method fixes it without extra assumptions; a **sensitivity analysis** shows how conclusions change under different assumptions.",
    },
    {
      type: "predict",
      misconception: "dropping-is-safe",
      item: {
        kind: "mc",
        id: "dq-predict-1",
        prompt: "In an income survey, high earners skip the income question more often. You analyse only the people who answered. The average income you get is",
        options: [
          { id: "a", text: "too low", correct: true, why: "The people dropped are disproportionately high earners." },
          { id: "b", text: "about right, just less precise", misconception: "dropping-is-safe", why: "That holds only if missingness is unrelated to income." },
          { id: "c", text: "too high", why: "It is the high incomes that are missing." },
        ],
      },
      reveal: {
        body: "Missingness here depends on the missing value itself: income is MNAR. The answers that remain over-represent lower earners, so the complete-case average is biased downwards. A larger survey collected the same way would be biased by the same amount.",
      },
      resolve: {
        kind: "mc",
        id: "dq-resolve-1",
        prompt: "When is dropping incomplete rows unbiased?",
        options: [
          { id: "a", text: "When values are missing completely at random", correct: true, why: "Then the complete rows are a random subset." },
          { id: "b", text: "Always: it only reduces the sample size", misconception: "dropping-is-safe", why: "If missingness is related to the values, the remaining rows are unrepresentative." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dq-check-1",
        prompt: "30% of blood-pressure readings are missing, and you fill each gap with the mean of the observed readings. What happens to the standard deviation?",
        options: [
          { id: "a", text: "It shrinks: 30% of values now sit exactly at the mean", correct: true, why: "The filled values add no spread." },
          { id: "b", text: "It stays the same", misconception: "mean-imputation-harmless", why: "Values at the mean add zero squared deviation but still count in $n$." },
          { id: "c", text: "It grows", why: "No new spread is added." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dq-check-2",
        prompt: "Older patients are more likely to skip a pain question, and age is recorded for everyone. Within each age group, skipping is unrelated to pain. The pain data are",
        options: [
          { id: "a", text: "missing at random (MAR)", correct: true, why: "Missingness depends on an observed variable, age." },
          { id: "b", text: "missing completely at random (MCAR)", why: "Missingness is related to age." },
          { id: "c", text: "missing not at random (MNAR)", why: "Given age, it doesn't depend on the pain level itself." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "scikit-learn's SimpleImputer fills gaps, and adding a **missing-indicator** column lets a model learn whether missingness itself predicts the outcome, which it often does. Fit the imputer on the training data only: imputing with statistics from the whole dataset leaks test information (§{cross-validation}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "dq-produce-1",
          prompt: "A lab machine fails at random on 5% of samples, regardless of the sample. These values are",
          options: [
            { id: "a", text: "MCAR", correct: true, why: "Missingness is unrelated to anything." },
            { id: "b", text: "MNAR", why: "The failure doesn't depend on the value." },
          ],
        },
        {
          kind: "mc",
          id: "dq-produce-2",
          prompt: "Filling missing values with the column mean",
          options: [
            { id: "a", text: "understates variability and weakens correlations", correct: true, why: "Every filled value sits at the centre, carrying no information about the other variables." },
            { id: "b", text: "is unbiased for every statistic", misconception: "mean-imputation-harmless", why: "It keeps the mean (under MCAR) but distorts spread and relationships." },
          ],
        },
        {
          kind: "mc",
          id: "dq-produce-3",
          prompt: "Students who did badly are less likely to report their exam scores. Analysing only reported scores",
          options: [
            { id: "a", text: "overstates the average score", correct: true, why: "Low scores are disproportionately missing." },
            { id: "b", text: "is fine: it just loses some data", misconception: "dropping-is-safe", why: "The missingness depends on the score." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "dq-review-1",
      prompt: "People with depression skip questions about mood more often. Mood data are",
      options: [
        { id: "a", text: "MNAR", correct: true, why: "Missingness depends on the unrecorded mood." },
        { id: "b", text: "MCAR", why: "It is related to the value itself." },
      ],
    },
  ],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "deletion and imputation",
      body: "**Complete-case** (listwise) deletion drops every row with a gap; **pairwise** deletion uses all available values for each statistic separately. **Single imputation** fills each gap once, with the mean, median or a regression prediction. **Multiple imputation** fills each gap $m$ times with random draws from a predictive model, analyses each completed dataset, and combines the results so the uncertainty of the filling is kept.",
    },
    {
      type: "definition",
      term: "reliability and validity",
      body: "A measurement is **reliable** if it gives consistent results on repetition (a scale that reads the same weight twice) and **valid** if it measures what it claims (a bathroom scale that reads 2 kg light is reliable but not valid). Data validation checks ranges, types, duplicates and consistency between fields.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "mean imputation shrinks the variance",
      statement: "If $m$ of $n$ values are replaced by the mean $\\bar x$ of the other $n - m$, the mean is unchanged and the variance (dividing by $n$) becomes $\\dfrac{n - m}{n}\\sigma_{\\text{obs}}^2$, where $\\sigma_{\\text{obs}}^2$ is the variance of the observed values.",
      proof: [
        "The filled values equal $\\bar x$, so the total is $(n - m)\\bar x + m\\bar x = n\\bar x$: the mean stays $\\bar x$.",
        "The filled values have zero deviation, so the sum of squared deviations stays $(n - m)\\sigma_{\\text{obs}}^2$, now divided by $n$.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what each method needs",
      statement: "Complete-case analysis is unbiased under MCAR. Regression and multiple imputation, and inverse-probability weighting, are unbiased under MAR if the model is right. Under MNAR every method needs an assumption about the missing values that the data cannot check.",
      proof: ["MAR says that, given the observed variables, the missing values look like the observed ones, so a model of the observed relationship predicts them. MNAR breaks exactly that link."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Classify: (a) a sensor drops readings when its battery is low, unrelated to the reading; (b) younger respondents skip an income question more, with age recorded; (c) people with high debts skip a debt question.",
      solution: ["(a) MCAR: the cause is unrelated to the data.", "(b) MAR: it depends on observed age. (c) MNAR: it depends on the missing debt itself."],
      result: "MCAR, MAR, MNAR.",
    },
    {
      type: "example",
      level: 2,
      title: "the cost of mean imputation",
      problem: "80 observed values have mean 50 and variance 25. The other 20 values are filled with 50. Find the new mean and variance.",
      solution: ["Mean: still 50.", "Variance: $\\tfrac{80}{100} \\times 25 = 20$; the standard deviation drops from 5 to about 4.47."],
      result: "Mean 50, variance 20.",
    },
    {
      type: "example",
      level: 3,
      title: "a sensitivity analysis",
      problem: "200 people were asked about a symptom: 120 said yes, 40 said no, 40 didn't answer. Bound the true proportion with the symptom.",
      solution: [
        "Complete cases give $120/160 = 0.75$.",
        "If every non-respondent had the symptom: $160/200 = 0.8$. If none did: $120/200 = 0.6$.",
        "Without assumptions about the 40, the data only pin the proportion between 0.6 and 0.8.",
      ],
      result: "Between 0.6 and 0.8; 0.75 assumes MCAR.",
    },
  ],
  pitfalls: [
    { wrong: "Drop incomplete rows; that's always safe.", right: "Only under MCAR. Otherwise the remaining rows are unrepresentative." },
    { wrong: "Mean imputation is a neutral fix.", right: "It shrinks variances, weakens correlations and makes standard errors too small." },
    { wrong: "The fraction missing is what matters.", right: "The mechanism matters more: 5% MNAR can bias more than 30% MCAR." },
  ],
  formulas: [
    { label: "After mean imputation", tex: "\\sigma^2_{\\text{new}} = \\tfrac{n - m}{n}\\,\\sigma^2_{\\text{obs}}" },
    { label: "Bounds (binary)", tex: "\\tfrac{\\text{yes}}{n} \\le p \\le \\tfrac{\\text{yes} + \\text{missing}}{n}" },
  ],
  exercises: [
    ex(1, mc("dqx-ex-1", "A weighing scale always reads 2 kg too heavy, but gives the same reading every time. It is", ["reliable but not valid", "Consistent, but wrong."], [["valid but not reliable", "It is consistent, so reliable."], ["neither", "It is consistent."]]), ["Consistency is reliability; correctness is validity."]),
    ex(1, mc("dqx-ex-2", "Survey forms were lost in a random office fire. The missing responses are", ["MCAR", "The loss is unrelated to the answers."], [["MAR", "It doesn't depend on any recorded variable either."], ["MNAR", "It doesn't depend on the answers."]]), ["A random accident gives MCAR."]),
    ex(2, num("dqx-ex-3", "90 observed values have variance 40. Ten more are filled with the mean. Find the new variance (divide by $n$).", 36, "$\\tfrac{90}{100} \\times 40$."), ["$0.9 \\times 40 = 36$."]),
    ex(2, num("dqx-ex-4", "Of 500 people, 300 answer yes, 100 no and 100 don't answer. Find the complete-case proportion of yes.", 0.75, "$300/400$."), ["$300/400 = 0.75$."]),
    ex(2, num("dqx-ex-5", "Same survey. Find the smallest possible true proportion of yes.", 0.6, "All non-respondents say no."), ["$300/500 = 0.6$."]),
    ex(3, num("dqx-ex-6", "Same survey. Find the largest possible true proportion of yes.", 0.8, "All non-respondents say yes."), ["$400/500 = 0.8$."]),
    ex(3, mc("dqx-ex-7", "Multiple imputation is preferred to single imputation because it", ["reflects the uncertainty about the filled values", "Analyses vary across imputations, and that variation is kept."], [["guarantees unbiasedness under MNAR", "No method does that."], ["uses fewer assumptions", "It needs a predictive model."]]), ["Single imputation treats guesses as known, so standard errors come out too small."]),
    ex(3, mc("dqx-ex-8", "A model's accuracy improves after adding a column marking which rows had a missing income. This suggests", ["missingness is informative: data are probably not MCAR", "Under MCAR the indicator would carry no information."], [["the imputation was perfect", "It says nothing about that."], ["the column leaks the label", "An indicator built from inputs is not leakage."]]), ["If whether income is missing predicts the outcome, missingness is related to the data."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

const CASES: { text: string; type: "MCAR" | "MAR" | "MNAR" }[] = [
  { text: "A random sample of questionnaires was lost in the post.", type: "MCAR" },
  { text: "A lab instrument fails on 3% of runs, unrelated to the samples.", type: "MCAR" },
  { text: "Men skip a diet question more than women, gender is recorded, and within each gender skipping is unrelated to diet.", type: "MAR" },
  { text: "Night-shift workers miss more clinic visits, and shift is recorded for everyone; given shift, missing a visit is unrelated to health.", type: "MAR" },
  { text: "People with very high incomes refuse to state their income.", type: "MNAR" },
  { text: "Patients drop out of a trial because their symptoms got worse.", type: "MNAR" },
  { text: "Heavy drinkers leave the alcohol-consumption question blank.", type: "MNAR" },
];

export const templates: Template[] = [
  {
    type: "interpret",
    make: (r) => {
      const c = r.pick(CASES);
      const all = ["MCAR", "MAR", "MNAR"] as const;
      const WHY = { MCAR: "Missingness is unrelated to any data.", MAR: "Missingness depends only on recorded variables.", MNAR: "Missingness depends on the missing value itself." };
      return mcNumbers(
        `${c.text} The missing values are`,
        { text: c.type, why: WHY[c.type] },
        all.filter((t) => t !== c.type).map((t) => ({ text: t, why: WHY[c.type] })),
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nObs = r.int(6, 18) * 5;
      const m = r.int(1, 4) * 5 * lv;
      const v = r.int(10, 60);
      const nv = (nObs / (nObs + m)) * v;
      return n(`${nObs} observed values have variance ${v}. Another ${m} missing values are filled with the observed mean. Find the new variance, dividing by $n$ (2 decimals).`, r2(nv), `The sum of squared deviations stays $${nObs} \\times ${v}$; dividing by ${nObs + m} gives ${r2(nv)}.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const total = r.int(10, 40) * 10;
      const miss = r.int(1, 3) * 10 * lv;
      const yes = r.int(Math.floor((total - miss) / 4), Math.floor((3 * (total - miss)) / 4));
      const which = r.pick(["low", "high"] as const);
      const val = which === "low" ? yes / total : (yes + miss) / total;
      return n(`Of ${total} people, ${yes} say yes, ${total - miss - yes} say no and ${miss} don't answer. Without assumptions about non-respondents, find the ${which === "low" ? "smallest" : "largest"} possible proportion of yes (3 decimals).`, Math.round(val * 1000) / 1000, which === "low" ? `All non-respondents say no: ${yes}/${total}.` : `All non-respondents say yes: ${yes + miss}/${total}.`, 0.001);
    },
  },
];
