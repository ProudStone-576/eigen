import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Wald, likelihood ratio and score tests; Wilks' theorem; Neyman–Pearson; AIC, BIC and KL divergence. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const llBin = (k: number, n: number, p: number) => k * Math.log(p) + (n - k) * Math.log(1 - p);
const LR60 = 2 * (llBin(60, 100, 0.6) - llBin(60, 100, 0.5));

const base: ConceptNode = {
  id: "likelihood-ratio",
  title: "Likelihood ratio, Wald & score tests",
  summary: "Three tests from the likelihood: the Wald test measures how far the estimate is from the null value in standard errors; the likelihood ratio test measures how much the fit worsens when the null is imposed, with twice the log-likelihood drop approximately χ²; the score test measures the log-likelihood's slope at the null. AIC and BIC compare models by penalised likelihood.",
  deps: ["fisher-information", "hypothesis-tests", "sampling-distributions"],
  pos: { x: 2, y: 1 },
  glossary: [
    { term: "nested models", meaning: "Two models where the smaller is the larger with some parameters fixed, often at 0." },
    { term: "deviance", meaning: "Twice a log-likelihood difference; differences in deviance between nested models are likelihood ratio statistics." },
    { term: "AIC", meaning: "Akaike's information criterion, $-2\\ell + 2k$: fit penalised by the number of parameters $k$; lower is better." },
  ],
  misconceptions: {
    "lrt-no-factor-2": "Compares the log-likelihood difference itself, rather than twice the difference, with the χ² table.",
    "aic-higher-better": "Thinks a higher AIC (or BIC) means a better model.",
  },
  steps: [
    {
      type: "motivate",
      title: "Testing with the likelihood",
      body: "Logistic regression, Poisson regression and survival models have no textbook t-test of their own. The likelihood supplies three general-purpose tests, and every statistical package prints at least one of them.",
      realWorld: {
        title: "Genetic linkage",
        body: "Linkage studies report LOD scores, base-10 log likelihood ratios. A LOD of 3 means the data are 1,000 times more likely if a gene is linked to a marker than if it isn't, the traditional threshold for claiming linkage.",
      },
    },
    {
      type: "truth",
      statement: "For $H_0: \\theta = \\theta_0$ with MLE $\\hat\\theta$ and log-likelihood $\\ell$: **Wald** $z = \\dfrac{\\hat\\theta - \\theta_0}{\\text{SE}(\\hat\\theta)}$. **Likelihood ratio** $\\Lambda = 2[\\ell(\\hat\\theta) - \\ell(\\theta_0)]$, approximately $\\chi^2_r$ with $r$ the number of parameters fixed by $H_0$. **Score** $\\dfrac{\\ell'(\\theta_0)^2}{nI(\\theta_0)}$, approximately $\\chi^2_1$.",
      body: "All three agree in large samples and can differ in small ones; the likelihood ratio test is usually the most reliable. A **simple** hypothesis fixes every parameter, a **composite** one leaves some free, to be maximised over. To compare models that aren't nested, use **AIC** $= -2\\ell + 2k$ or **BIC** $= -2\\ell + k\\ln n$: lower is better.",
    },
    {
      type: "predict",
      misconception: "lrt-no-factor-2",
      item: {
        kind: "mc",
        id: "lrt-predict-1",
        prompt: "Freeing one parameter raises the maximised log-likelihood from −120.4 to −117.9. At 5%, with χ²₁ cut-off 3.84, is $H_0$ rejected?",
        options: [
          { id: "a", text: "Yes: $\\Lambda = 2 \\times 2.5 = 5.0 > 3.84$", correct: true, why: "The statistic is twice the gain." },
          { id: "b", text: "No: the gain 2.5 is below 3.84", misconception: "lrt-no-factor-2", why: "The χ² approximation applies to twice the gain." },
          { id: "c", text: "The test can't be used because the log-likelihoods are negative", why: "Only differences matter; negative values are normal." },
        ],
      },
      reveal: {
        body: "$\\Lambda = 2(-117.9 - (-120.4)) = 5.0$, which exceeds 3.84. Comparing the raw gain of 2.5 with the table halves the statistic and would miss a real effect. Log-likelihoods of continuous or large data sets are almost always negative; only their differences carry information.",
      },
      resolve: {
        kind: "mc",
        id: "lrt-resolve-1",
        prompt: "What is compared with the χ² table in a likelihood ratio test?",
        options: [
          { id: "a", text: "Twice the gain in maximised log-likelihood", correct: true, why: "$\\Lambda = 2[\\ell(\\hat\\theta) - \\ell(\\theta_0)]$." },
          { id: "b", text: "The gain itself", misconception: "lrt-no-factor-2", why: "That is half the statistic." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lrt-check-1",
        prompt: "Model A has AIC 210 and model B has AIC 204. Which does AIC prefer?",
        options: [
          { id: "a", text: "B: lower AIC is better", correct: true, why: "AIC is $-2\\ell$ plus a penalty: smaller means a better trade-off." },
          { id: "b", text: "A: higher AIC is better", misconception: "aic-higher-better", why: "Higher AIC means worse fit or more parameters." },
          { id: "c", text: "Neither: AIC can't compare models", why: "Comparing models is its purpose." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lrt-check-2",
        prompt: "An MLE is 0.62 with SE 0.05. Find the Wald $z$ for $H_0: p = 0.5$.",
        options: [
          { id: "a", text: "2.4", correct: true, why: "$0.12/0.05$." },
          { id: "b", text: "0.12", why: "That is the difference, not divided by the SE." },
          { id: "c", text: "12", why: "Divide by 0.05, not 0.01." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training cross-entropy is minus the average log-likelihood, so comparing nested models by their drop in loss is a likelihood ratio test in disguise. AIC and BIC are early versions of the trade-off between fit and complexity that validation sets now measure directly (§{cross-validation}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lrt-produce-1", prompt: "Maximised log-likelihoods are −50.2 under $H_0$ and −47.1 under the larger model. Find $\\Lambda$.", answer: 6.2, explain: "$2 \\times 3.1$." },
        { kind: "number", id: "lrt-produce-2", prompt: "A model with 3 parameters has maximised log-likelihood −100. Find its AIC.", answer: 206, explain: "$200 + 6$." },
        {
          kind: "mc",
          id: "lrt-produce-3",
          prompt: "BIC values are 412 for model A and 405 for model B. BIC prefers",
          options: [
            { id: "a", text: "B", correct: true, why: "Lower is better." },
            { id: "b", text: "A", misconception: "aic-higher-better", why: "Like AIC, BIC is minimised." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lrt-review-1", prompt: "A model with 2 parameters has maximised log-likelihood −100 on $n$ observations with $\\ln n = 4.6$. Find its BIC.", answer: 209.2, explain: "$200 + 2 \\times 4.6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Wilks' theorem and deviance",
      body: "For nested models where the null fixes $r$ parameters at interior values, $\\Lambda = 2(\\ell_{\\text{large}} - \\ell_{\\text{small}}) \\approx \\chi^2_r$ (**Wilks' theorem**). The **deviance** of a model is $2(\\ell_{\\text{saturated}} - \\ell_{\\text{model}})$, so a difference of deviances is a likelihood ratio statistic.",
    },
    {
      type: "definition",
      term: "Kullback–Leibler divergence",
      body: "$\\text{KL}(f \\,\\|\\, g) = E_f\\!\\left[\\ln\\dfrac{f(X)}{g(X)}\\right] \\ge 0$ measures how badly a model $g$ approximates the truth $f$, with equality only when $g = f$. Maximising likelihood minimises an estimate of it, and AIC estimates the expected KL loss of a fitted model on new data: the core of **information-theoretic statistics**.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "why the three agree",
      statement: "Near its peak, $\\ell(\\theta) \\approx \\ell(\\hat\\theta) - \\tfrac12 nI(\\hat\\theta - \\theta)^2$. Then $\\Lambda \\approx nI(\\hat\\theta - \\theta_0)^2 = z_{\\text{Wald}}^2$, and the score test gives the same value in the limit.",
      proof: ["Substitute $\\theta = \\theta_0$ into the quadratic approximation; the slope at $\\theta_0$ is $nI(\\hat\\theta - \\theta_0)$, whose square over $nI$ is again $nI(\\hat\\theta - \\theta_0)^2$."],
    },
    {
      type: "theorem",
      name: "Neyman–Pearson lemma",
      statement: "For a simple $H_0: \\theta = \\theta_0$ against a simple $H_1: \\theta = \\theta_1$, the test that rejects when $\\dfrac{L(\\theta_1)}{L(\\theta_0)}$ exceeds a constant is the most powerful test of its level.",
      proof: ["Any other test with the same $\\alpha$ moves some rejection region from where the likelihood ratio is high to where it is low, losing more power under $H_1$ than it can gain."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "KL divergence is never negative",
      statement: "$\\text{KL}(f \\,\\|\\, g) \\ge 0$, with equality only when $f = g$.",
      proof: ["$-\\text{KL} = E_f[\\ln(g/f)] \\le \\ln E_f[g/f] = \\ln\\int g = 0$, by Jensen's inequality for the concave logarithm."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "when the χ² approximation fails",
      statement: "Wilks' theorem needs nested models and null values inside the parameter space. Testing a variance component or a mixture weight equal to 0 puts the null on a boundary; then the χ² p-value is roughly twice too large.",
      proof: ["On a boundary the estimate can only fall on one side of the null, so half the time $\\Lambda = 0$; the null distribution is a 50:50 mix of 0 and $\\chi^2_1$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A coefficient is estimated at 3.2 with SE 0.8. Test $H_0: \\beta = 2$ with the Wald test.",
      solution: ["$z = (3.2 - 2)/0.8 = 1.5$.", "$|z| < 1.96$: not significant at 5%."],
      result: "$z = 1.5$.",
    },
    {
      type: "example",
      level: 2,
      title: "three tests, one question",
      problem: "60 heads in 100 tosses. Test $H_0: p = 0.5$ by all three tests.",
      solution: [
        "LR: $\\ell(0.6) = 60\\ln0.6 + 40\\ln0.4 \\approx -67.30$ and $\\ell(0.5) = 100\\ln0.5 \\approx -69.31$, so $\\Lambda \\approx 4.03$.",
        "Wald: $\\dfrac{0.1}{\\sqrt{0.6 \\times 0.4/100}} \\approx 2.04$, squared 4.17. Score: $\\dfrac{0.1}{\\sqrt{0.25/100}} = 2$, squared 4.00.",
        "All three exceed 3.84, narrowly.",
      ],
      result: "4.03, 4.17, 4.00: reject at 5%.",
    },
    {
      type: "example",
      level: 3,
      title: "AIC against BIC",
      problem: "Model A: $\\ell = -200$, 3 parameters. Model B: $\\ell = -197$, 6 parameters. $n = 100$, $\\ln 100 \\approx 4.605$. Compare by AIC and BIC.",
      solution: ["AIC: A $400 + 6 = 406$, B $394 + 12 = 406$: a tie.", "BIC: A $400 + 13.8 = 413.8$, B $394 + 27.6 = 421.6$: BIC prefers the smaller model A."],
      result: "AIC ties; BIC prefers A.",
    },
  ],
  pitfalls: [
    { wrong: "Compare the log-likelihood gain with the χ² table.", right: "Compare twice the gain." },
    { wrong: "Higher AIC means a better model.", right: "Lower AIC (and BIC) is better." },
    { wrong: "Use the likelihood ratio test for models that aren't nested.", right: "Use AIC or BIC, or validation, for non-nested comparisons." },
  ],
  formulas: [
    { label: "Wald", tex: "z = (\\hat\\theta - \\theta_0)/\\text{SE}" },
    { label: "Likelihood ratio", tex: "\\Lambda = 2[\\ell(\\hat\\theta) - \\ell(\\theta_0)] \\approx \\chi^2_r" },
    { label: "Score", tex: "\\ell'(\\theta_0)^2/(nI(\\theta_0))" },
    { label: "AIC, BIC", tex: "-2\\ell + 2k,\\quad -2\\ell + k\\ln n" },
  ],
  exercises: [
    ex(1, num("lrtx-ex-1", "An estimate is 3.2 with SE 0.8. Find the Wald $z$ for $H_0: \\theta = 2$.", 1.5, "$1.2/0.8$."), ["$1.5$."]),
    ex(1, num("lrtx-ex-2", "Log-likelihoods are −84 under $H_0$ and −80 under the larger model. Find $\\Lambda$.", 8, "$2 \\times 4$."), ["$8$."]),
    ex(2, num("lrtx-ex-3", "A larger model frees 3 extra parameters. How many degrees of freedom has the likelihood ratio test?", 3, "One per fixed parameter."), ["$3$."]),
    ex(2, num("lrtx-ex-4", "A model with 4 parameters has $\\ell = -150$. Find its AIC.", 308, "$300 + 8$."), ["$308$."]),
    ex(2, dp("lrtx-ex-5", "Same model, $n = 200$. Find its BIC.", 300 + 4 * Math.log(200), "$300 + 4\\ln 200$."), ["$300 + 21.193 = 321.193$."]),
    ex(3, dp("lrtx-ex-6", "60 heads in 100 tosses. Find the likelihood ratio statistic for $H_0: p = 0.5$.", LR60, "$2[\\ell(0.6) - \\ell(0.5)]$."), ["$2(-67.301 + 69.315) \\approx 4.027$."]),
    ex(3, dp("lrtx-ex-7", "Same data. Find the square of the Wald statistic, using the SE at $\\hat p$.", 0.01 / 0.0024, "$\\left(0.1/\\sqrt{0.0024}\\right)^2$."), ["$0.01/0.0024 \\approx 4.167$."]),
    ex(3, num("lrtx-ex-8", "Same data. Find the score statistic $z$, using the SE under $H_0$.", 2, "$0.1/\\sqrt{0.25/100}$."), ["$0.1/0.05 = 2$."]),
    ex(3, dp("lrtx-ex-9", "A LOD score of 3 means a likelihood ratio of 1,000. Find the corresponding $\\Lambda = 2\\ln(\\text{ratio})$.", 2 * Math.log(1000), "$2\\ln 1000$."), ["$2 \\times 6.908 \\approx 13.816$."]),
    ex(3, mc("lrtx-ex-10", "A Poisson model and a negative binomial model with different predictors are to be compared. Use", ["AIC or BIC", "The models aren't nested."], [["a likelihood ratio test", "It needs nested models."], ["a Wald test on one coefficient", "That compares nothing between the models."]]), ["Information criteria compare non-nested models on the same data."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const l0 = -r.int(40, 400) - r.pick([0, 0.2, 0.5, 0.8]);
      const gain = r.pick([0.5, 1.2, 1.9, 2.5, 3.1, 4.6, 6]) * lv;
      const l1 = l0 + gain;
      return n(`Maximised log-likelihoods are ${r2(l0)} under $H_0$ and ${r2(l1)} under the larger model. Find $\\Lambda$ (2 decimals).`, r2(2 * gain), `$2(${r2(l1)} - (${r2(l0)})) = ${r2(2 * gain)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const l = -r.int(50, 500);
      const k = r.int(2, 4 + 3 * lv);
      const bic = lv === 3 && r.pick([true, false]);
      const nn = r.pick([50, 100, 200, 500, 1000]);
      const v = bic ? -2 * l + k * Math.log(nn) : -2 * l + 2 * k;
      return n(`A model with ${k} parameters has maximised log-likelihood ${l}${bic ? ` on ${nn} observations` : ""}. Find its ${bic ? "BIC" : "AIC"} (2 decimals).`, r2(v), bic ? `$${-2 * l} + ${k}\\ln ${nn} \\approx ${r2(v)}$.` : `$${-2 * l} + 2 \\times ${k} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const a = r.int(150, 400);
      const d = r.int(2, 15);
      const which = r.pick(["AIC", "BIC"]);
      return mcNumbers(
        `Model A has ${which} ${a}; model B has ${which} ${a + d}. Which does ${which} prefer?`,
        { text: "A", why: `Lower ${which} is better.` },
        [{ text: "B", why: `${which} is minimised, not maximised.`, misconception: "aic-higher-better" }],
      );
    },
  },
];
