import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Bayes factors, posterior odds, Bayesian model selection and averaging, BIC approximation, Lindley's paradox, decision theory, design. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const C = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
};

const base: ConceptNode = {
  id: "bayes-factors",
  title: "Bayes factors & decisions",
  summary: "A Bayes factor compares how well two hypotheses predicted the data: BF₁₀ = P(data | H₁)/P(data | H₀). Posterior odds = Bayes factor × prior odds. Decisions then minimise expected loss under the posterior: the posterior mean for squared loss, the median for absolute loss.",
  deps: ["conjugate-priors", "likelihood-ratio"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "marginal likelihood", meaning: "$P(\\text{data} \\mid H) = \\int f(x \\mid \\theta)\\pi(\\theta \\mid H)\\,d\\theta$: how well a hypothesis predicted the data, averaging over its parameters." },
    { term: "Bayes factor", meaning: "The ratio of two hypotheses' marginal likelihoods." },
    { term: "posterior expected loss", meaning: "The average cost of an action, weighting each possible parameter value by its posterior probability." },
  ],
  misconceptions: {
    "bf-is-posterior": "Treats a Bayes factor as the posterior probability of a hypothesis, ignoring the prior odds.",
    "p-equals-bf": "Thinks p = 0.05 corresponds to strong evidence, such as a Bayes factor of 20, against H₀.",
  },
  steps: [
    {
      type: "motivate",
      title: "Evidence for the null too",
      body: "A p-value can only argue against $H_0$. A Bayes factor weighs both sides: it can say the data favour \"no effect\" three to one, which a non-significant p-value never can.",
      realWorld: {
        title: "Replication research",
        body: "Psychologists re-examining famous findings report Bayes factors, which separate \"evidence of no effect\" from \"not enough data to tell\", two outcomes that a non-significant p-value lumps together.",
      },
    },
    {
      type: "truth",
      statement: "$\\text{BF}_{10} = \\dfrac{P(x \\mid H_1)}{P(x \\mid H_0)}$, where each marginal likelihood averages the likelihood over that hypothesis's prior. Then $\\dfrac{P(H_1 \\mid x)}{P(H_0 \\mid x)} = \\text{BF}_{10} \\times \\dfrac{P(H_1)}{P(H_0)}$. Jeffreys' rough scale: 1–3 barely worth mentioning, 3–10 substantial, 10–30 strong, 30–100 very strong, above 100 decisive.",
      body: "For a decision, choose the action with the smallest **posterior expected loss**. With squared-error loss the best estimate is the posterior mean; with absolute loss, the posterior median; with 0–1 loss, the posterior mode. The BIC difference approximates a Bayes factor: $\\text{BF}_{10} \\approx e^{-(\\text{BIC}_1 - \\text{BIC}_0)/2}$ (§{likelihood-ratio}).",
    },
    {
      type: "predict",
      misconception: "bf-is-posterior",
      item: {
        kind: "mc",
        id: "bfs-predict-1",
        prompt: "The data give $\\text{BF}_{10} = 4$ in favour of a new treatment working. Beforehand, such treatments work about one time in four (prior odds 1 : 3). Find P(treatment works | data).",
        options: [
          { id: "a", text: "$4/7 \\approx 0.57$", correct: true, why: "Posterior odds $4 \\times \\tfrac13 = \\tfrac43$." },
          { id: "b", text: "$0.8$, from the Bayes factor alone", misconception: "bf-is-posterior", why: "The Bayes factor updates the prior odds; it doesn't replace them." },
          { id: "c", text: "$0.25$, the prior", why: "The data shift the odds by a factor of 4." },
        ],
      },
      reveal: {
        body: "Posterior odds $= 4 \\times \\tfrac13 = \\tfrac43$, so $P = \\dfrac{4/3}{1 + 4/3} = \\tfrac47$. The Bayes factor measures the strength of the evidence; how convinced to be also depends on how plausible the claim was beforehand. The same evidence makes an implausible claim only somewhat likely.",
      },
      resolve: {
        kind: "mc",
        id: "bfs-resolve-1",
        prompt: "How does a Bayes factor relate to the posterior probability of $H_1$?",
        options: [
          { id: "a", text: "It multiplies the prior odds to give the posterior odds", correct: true, why: "Posterior odds = BF × prior odds." },
          { id: "b", text: "It is the posterior probability", misconception: "bf-is-posterior", why: "Only with prior odds of 1 does $\\text{BF}/(1 + \\text{BF})$ give it." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bfs-check-1",
        prompt: "A result has $p = 0.049$. For typical priors on the effect, the corresponding Bayes factor against $H_0$ is",
        options: [
          { id: "a", text: "at most about 2.5 to 3: weak evidence", correct: true, why: "Bounds on Bayes factors for p near 0.05 are modest." },
          { id: "b", text: "about 20, since $1/0.05 = 20$", misconception: "p-equals-bf", why: "A p-value is not a likelihood ratio." },
          { id: "c", text: "exactly 0.049", why: "Bayes factors and p-values measure different things." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bfs-check-2",
        prompt: "Under absolute-error loss, the best Bayesian point estimate is the posterior",
        options: [
          { id: "a", text: "median", correct: true, why: "It minimises expected absolute error." },
          { id: "b", text: "mean", why: "That is for squared-error loss." },
          { id: "c", text: "mode", why: "That is for 0–1 loss." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Bayesian model averaging weights each candidate model's predictions by its posterior probability, rather than betting everything on the single best model. The marginal likelihood also tunes Gaussian-process hyperparameters (\"type II maximum likelihood\").",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "bfs-produce-1", prompt: "Prior odds are 1 : 1 and $\\text{BF}_{10} = 9$. Find $P(H_1 \\mid x)$.", answer: 0.9, explain: "Odds 9, probability $9/10$." },
        { kind: "number", id: "bfs-produce-2", prompt: "$\\text{BIC}_1 - \\text{BIC}_0 = -4$. Find the approximate $\\text{BF}_{10}$ to 3 decimals.", answer: Math.round(Math.exp(2) * 1000) / 1000, tolerance: 0.001, explain: "$e^{2}$." },
        {
          kind: "mc",
          id: "bfs-produce-3",
          prompt: "A Bayes factor of 10 for $H_1$ means",
          options: [
            { id: "a", text: "the data are 10 times more probable under $H_1$ than under $H_0$", correct: true, why: "That is the definition." },
            { id: "b", text: "$H_1$ has posterior probability 10/11, whatever the prior", misconception: "bf-is-posterior", why: "Only with even prior odds." },
          ],
        },
        {
          kind: "mc",
          id: "bfs-produce-4",
          prompt: "$p = 0.04$ in a study. As evidence against $H_0$ this is",
          options: [
            { id: "a", text: "usually weak: comparable to a Bayes factor of about 2 to 3", correct: true, why: "p-values near 0.05 overstate the evidence." },
            { id: "b", text: "strong: a Bayes factor of 25", misconception: "p-equals-bf", why: "$1/p$ is not a Bayes factor." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "bfs-review-1", prompt: "Prior odds 1 : 4 and $\\text{BF}_{10} = 8$. Find the posterior odds for $H_1$.", answer: 2, explain: "$8 \\times \\tfrac14$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "model selection and averaging",
      body: "With models $M_1, \\dots, M_K$ and prior probabilities $P(M_k)$, posterior model probabilities are $\\propto P(x \\mid M_k)P(M_k)$. **Bayesian model selection** picks the most probable model; **Bayesian model averaging** predicts with $\\sum_k P(M_k \\mid x)\\,\\hat y_k$, accounting for uncertainty about which model is right.",
    },
    {
      type: "definition",
      term: "Bayesian decisions and design",
      body: "A decision rule chooses an action $a$ to minimise $E[L(\\theta, a) \\mid x]$. **Bayesian experimental design** chooses which data to collect, for example which doses to test, to maximise the expected value of the resulting decision or the expected information gained about $\\theta$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "losses and their best estimates",
      statement: "Squared loss $(\\theta - a)^2$ is minimised in expectation by the posterior mean; absolute loss $|\\theta - a|$ by the posterior median; 0–1 loss by the posterior mode.",
      proof: ["These are the results of §{spread-measures} with the posterior in place of the data: $E[(\\theta - a)^2]$ is smallest at $a = E[\\theta]$, and $E|\\theta - a|$ at the median."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "Lindley's paradox",
      statement: "With a very large sample, a result just significant at 5% can give a Bayes factor favouring $H_0$: the data fit $H_0$ better than they fit a diffuse $H_1$ that spreads its probability over many large effects.",
      proof: ["As $n$ grows, $p = 0.05$ corresponds to an ever smaller estimated effect, which a point null predicts well while a diffuse alternative predicts poorly."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "BIC approximation",
      statement: "$2\\ln\\text{BF}_{10} \\approx \\text{BIC}_0 - \\text{BIC}_1$, so a BIC lower by 2 suggests positive evidence and by 6 strong evidence for the lower-BIC model.",
      proof: ["A Laplace approximation to the marginal likelihood gives $\\ln P(x \\mid M) \\approx \\ell(\\hat\\theta) - \\tfrac k2\\ln n = -\\tfrac12\\text{BIC}$, dropping terms that don't grow with $n$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 2,
      title: "a coin, both ways",
      problem: "A coin gives 7 heads in 10 tosses. Compare $H_0: p = \\tfrac12$ with $H_1$: $p$ uniform on $[0, 1]$.",
      solution: [
        "$P(x \\mid H_0) = \\binom{10}{7}/2^{10} = 120/1024 \\approx 0.117$. Under the uniform prior, every count from 0 to 10 is equally likely: $P(x \\mid H_1) = 1/11 \\approx 0.091$.",
        "$\\text{BF}_{10} \\approx 0.091/0.117 \\approx 0.78$: the data slightly favour the fair coin, although a one-sided test of fairness would give $p \\approx 0.17$.",
      ],
      result: "$\\text{BF}_{01} \\approx 1.3$: weak evidence for $H_0$.",
    },
    {
      type: "example",
      level: 3,
      title: "a decision under loss",
      problem: "A part's failure probability has posterior Beta(2, 8). Recalling costs ₹100 per part; not recalling costs ₹1,000 times the failure probability. Recall?",
      solution: ["Expected cost of not recalling: $1000 \\times E[p] = 1000 \\times 0.2 = 200$.", "Recalling costs 100 < 200: recall."],
      result: "Recall.",
    },
  ],
  pitfalls: [
    { wrong: "A Bayes factor is the probability a hypothesis is true.", right: "It updates prior odds into posterior odds." },
    { wrong: "$p = 0.05$ is strong evidence.", right: "It typically corresponds to a Bayes factor of 3 at most." },
    { wrong: "Bayes factors don't depend on priors.", right: "They depend strongly on the prior under $H_1$; a very diffuse prior penalises $H_1$." },
  ],
  formulas: [
    { label: "Bayes factor", tex: "\\text{BF}_{10} = \\dfrac{P(x \\mid H_1)}{P(x \\mid H_0)}" },
    { label: "Posterior odds", tex: "\\text{BF}_{10} \\times \\dfrac{P(H_1)}{P(H_0)}" },
    { label: "BIC approximation", tex: "\\text{BF}_{10} \\approx e^{(\\text{BIC}_0 - \\text{BIC}_1)/2}" },
    { label: "Best estimates", tex: "\\text{mean (squared)},\\ \\text{median (absolute)},\\ \\text{mode (0–1)}" },
  ],
  exercises: [
    ex(1, num("bfsx-ex-1", "Prior odds are 1 and $\\text{BF}_{10} = 3$. Find $P(H_1 \\mid x)$.", 0.75, "Odds 3."), ["$3/4$."]),
    ex(1, num("bfsx-ex-2", "$\\text{BF}_{10} = 0.2$. Find $\\text{BF}_{01}$.", 5, "Reciprocal."), ["$5$: the data favour $H_0$ five to one."]),
    ex(2, fr("bfsx-ex-3", "Prior odds 1 : 3 and $\\text{BF}_{10} = 4$. Find $P(H_1 \\mid x)$.", 4 / 7, "Odds $4/3$."), ["$\\dfrac{4/3}{7/3} = \\tfrac47$."]),
    ex(2, dp("bfsx-ex-4", "$\\text{BIC}_0 = 210$ and $\\text{BIC}_1 = 204$. Find the approximate $\\text{BF}_{10}$.", Math.exp(3), "$e^{6/2}$."), ["$e^3 \\approx 20.086$: strong evidence for $M_1$."]),
    ex(2, fr("bfsx-ex-5", "A coin gives 7 heads in 10. Find $P(x \\mid H_0)$ for $p = \\tfrac12$.", C(10, 7) / 1024, "$\\binom{10}{7}/2^{10}$."), ["$120/1024 \\approx 0.117$."]),
    ex(3, dp("bfsx-ex-6", "Same data, $H_1$: $p$ uniform. Find $\\text{BF}_{10}$.", 1 / 11 / (C(10, 7) / 1024), "$P(x \\mid H_1) = 1/11$."), ["$\\dfrac{1/11}{120/1024} = \\dfrac{1024}{1320} \\approx 0.776$."]),
    ex(3, num("bfsx-ex-7", "Posterior Beta(2, 8) for a failure rate; not recalling costs ₹1,000 × rate. Find its expected cost.", 200, "$1000 \\times 0.2$."), ["$200$."]),
    ex(3, mc("bfsx-ex-8", "In a huge study, $p = 0.04$ but the Bayes factor favours $H_0$. This is", ["Lindley's paradox: the tiny effect fits $H_0$ better than a diffuse $H_1$", "Large $n$ makes a just-significant effect very small."], [["a calculation error", "It is a known, real disagreement."], ["proof that p-values are always wrong", "They answer a different question."]]), ["Look at the estimated effect size and the prior under $H_1$."]),
    ex(3, mc("bfsx-ex-9", "Three models have posterior probabilities 0.5, 0.3 and 0.2 and predict 10, 12 and 20. The model-averaged prediction is", ["13.6", "$5 + 3.6 + 4$."], [["10", "That ignores the other models."], ["14", "That is the unweighted average."]]), ["$0.5 \\times 10 + 0.3 \\times 12 + 0.2 \\times 20 = 13.6$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const bf = r.pick([2, 3, 4, 5, 8, 10, 20]);
      const [a, b] = r.pick([[1, 1], [1, 2], [1, 3], [1, 4], [2, 1], [1, 9]]);
      const odds = bf * (a / b);
      const p = odds / (1 + odds);
      return n(`Prior odds for $H_1$ are ${a} : ${b} and $\\text{BF}_{10} = ${bf}$. Find $P(H_1 \\mid x)$ (3 decimals).`, Math.round(p * 1000) / 1000, `Posterior odds $${bf} \\times \\tfrac{${a}}{${b}} = ${r2(odds)}$, so $P = ${r2(odds)}/${r2(1 + odds)} \\approx ${Math.round(p * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const d = r.pick([-6, -4, -2, 2, 4, 10]);
      const bf = Math.exp(-d / 2);
      return n(`$\\text{BIC}_1 - \\text{BIC}_0 = ${d}$. Find the approximate $\\text{BF}_{10}$ (3 decimals).`, Math.round(bf * 1000) / 1000, `$e^{${-d / 2}} \\approx ${Math.round(bf * 1000) / 1000}$${bf > 1 ? ": favouring $M_1$" : ": favouring $M_0$"}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const bf = r.pick([3, 5, 10, 20]);
      const prior = r.pick(["1 : 9", "1 : 19", "1 : 99"]);
      return mcNumbers(
        `An implausible claim (prior odds ${prior}) gets $\\text{BF}_{10} = ${bf}$. Is it now probably true?`,
        { text: "Not necessarily: multiply the prior odds by the Bayes factor first", why: `Posterior odds are ${bf} times ${prior}.` },
        [
          { text: "Yes: a Bayes factor above 1 makes $H_1$ more likely than not", why: "That holds only if the prior odds were at least even.", misconception: "bf-is-posterior" },
          { text: "No: Bayes factors can't support $H_1$", why: "They can; this one does, by a factor of " + bf + "." },
        ],
      );
    },
  },
];
