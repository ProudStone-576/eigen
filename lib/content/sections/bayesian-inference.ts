import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Bayesian inference: prior, likelihood, posterior, credible intervals, posterior predictive, choice of prior, predictive checks. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const post2 = (prior1: number, l1: number, l2: number) => (prior1 * l1) / (prior1 * l1 + (1 - prior1) * l2);

const base: ConceptNode = {
  id: "bayesian-inference",
  title: "Bayesian inference",
  summary: "Bayesian inference describes an unknown parameter by a probability distribution and updates it with data: posterior ∝ likelihood × prior. A 95% credible interval contains the parameter with 95% posterior probability, and the posterior predictive distribution forecasts new data, averaging over what is still uncertain.",
  deps: ["bayes", "mle", "continuous-family"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "prior", meaning: "The distribution describing beliefs about a parameter before the data." },
    { term: "posterior", meaning: "The distribution of the parameter after the data: prior updated by the likelihood." },
    { term: "credible interval", meaning: "An interval containing the parameter with a stated posterior probability." },
  ],
  misconceptions: {
    "credible-vs-confidence": "Thinks a 95% confidence interval and a 95% credible interval mean the same thing.",
    "prior-dominates": "Thinks the prior always dominates the conclusion, however much data there is.",
  },
  steps: [
    {
      type: "motivate",
      title: "Belief, then evidence",
      body: "A new drug works in 7 of 10 patients. A classical analysis gives an estimate and an interval about repeated experiments. A doctor wants something else: given these patients and what is known about similar drugs, how likely is it that the success rate is above 50%? Bayesian inference answers exactly that question.",
      realWorld: {
        title: "Search and rescue",
        body: "When the submarine USS Scorpion was lost in 1968, searchers combined expert priors over where it might be with the evidence from each area searched. Updating the probability map by Bayes' rule pointed to the wreck's location.",
      },
    },
    {
      type: "truth",
      statement: "With prior $\\pi(\\theta)$ and likelihood $f(x \\mid \\theta)$, the **posterior** is $\\pi(\\theta \\mid x) = \\dfrac{f(x \\mid \\theta)\\pi(\\theta)}{f(x)} \\propto f(x \\mid \\theta)\\pi(\\theta)$. A **95% credible interval** $[a, b]$ has $P(a \\le \\theta \\le b \\mid x) = 0.95$. The **posterior predictive** is $f(x_{\\text{new}} \\mid x) = \\int f(x_{\\text{new}} \\mid \\theta)\\pi(\\theta \\mid x)\\,d\\theta$.",
      body: "Point summaries are the posterior mean, median or mode (the MAP estimate, §{method-of-moments}). Priors range from **informative** (real knowledge) through **weakly informative** (ruling out absurd values) to **flat** or **reference** priors such as Jeffreys'. As data grow, the likelihood swamps any reasonable prior and Bayesian and classical answers converge.",
    },
    {
      type: "predict",
      misconception: "credible-vs-confidence",
      item: {
        kind: "mc",
        id: "byi-predict-1",
        prompt: "A 95% credible interval for a success rate is (0.42, 0.85). Which statement is justified?",
        options: [
          { id: "a", text: "Given the data and prior, there is a 95% probability the rate lies in (0.42, 0.85)", correct: true, why: "That is what a credible interval means." },
          { id: "b", text: "95% of intervals built this way in repeated experiments would contain the rate, and nothing more", misconception: "credible-vs-confidence", why: "That is a confidence interval's guarantee." },
          { id: "c", text: "95% of patients have rates in that range", why: "The interval is about one parameter, not patients." },
        ],
      },
      reveal: {
        body: "A credible interval is a probability statement about the parameter, conditional on the observed data and the prior. A confidence interval is a statement about the procedure over repeated samples, with the parameter fixed. With flat priors and lots of data the two intervals are often numerically close, but they answer different questions.",
      },
      resolve: {
        kind: "mc",
        id: "byi-resolve-1",
        prompt: "What does a 95% credible interval state?",
        options: [
          { id: "a", text: "A 95% posterior probability that the parameter lies inside it", correct: true, why: "Given the data and prior." },
          { id: "b", text: "The same as a 95% confidence interval", misconception: "credible-vs-confidence", why: "The confidence interval's 95% describes repeated sampling." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "byi-check-1",
        prompt: "Two analysts use different reasonable priors for a click rate. After 1 million impressions, their posteriors are",
        options: [
          { id: "a", text: "almost identical: the data swamp the priors", correct: true, why: "The likelihood is extremely concentrated." },
          { id: "b", text: "still far apart, because priors always dominate", misconception: "prior-dominates", why: "Priors matter most when data are scarce." },
          { id: "c", text: "undefined", why: "Posteriors exist whatever the sample size." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "byi-check-2",
        prompt: "The posterior is proportional to",
        options: [
          { id: "a", text: "likelihood × prior", correct: true, why: "Bayes' rule, dropping the constant $f(x)$." },
          { id: "b", text: "likelihood + prior", why: "Bayes' rule multiplies." },
          { id: "c", text: "likelihood ÷ prior", why: "The prior multiplies the likelihood." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Bayesian ideas run through machine learning: regularisation as a prior (§{method-of-moments}), Thompson sampling for bandits (draw a click rate from each arm's posterior and play the best), and Bayesian neural networks or ensembles that report uncertainty along with predictions.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "byi-produce-1", prompt: "A coin is fair or biased ($p = 0.8$), each with prior 0.5. It shows 4 heads in 5 tosses. Find P(biased | data) to 3 decimals.", answer: Math.round(post2(0.5, 5 * 0.8 ** 4 * 0.2, 5 * 0.5 ** 5) * 1000) / 1000, tolerance: 0.001, explain: "Likelihoods 0.4096 and 0.15625." },
        { kind: "number", id: "byi-produce-2", prompt: "A Beta(1, 1) prior meets 7 successes in 10 trials. Find the posterior mean.", answer: 8 / 12, tolerance: 0.0005, explain: "Beta(8, 4): $8/12$." },
        {
          kind: "mc",
          id: "byi-produce-3",
          prompt: "With very little data, the posterior",
          options: [
            { id: "a", text: "depends substantially on the prior", correct: true, why: "The likelihood is flat, so the prior shapes the answer." },
            { id: "b", text: "never depends on the prior", why: "With little data it does." },
          ],
        },
        {
          kind: "mc",
          id: "byi-produce-4",
          prompt: "As the amount of data grows, the influence of a reasonable prior",
          options: [
            { id: "a", text: "fades", correct: true, why: "The likelihood concentrates around the truth." },
            { id: "b", text: "stays the same", misconception: "prior-dominates", why: "The prior is fixed while the likelihood sharpens." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "byi-review-1", prompt: "A Beta(1, 1) prior meets 3 successes in 3 trials. Find the posterior predictive probability that the next trial succeeds.", answer: 0.8, explain: "Beta(4, 1): $4/5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "kinds of prior",
      body: "A **subjective** prior encodes a person's beliefs; an **objective** or **reference** prior is chosen by a rule, such as Jeffreys' prior $\\pi(\\theta) \\propto \\sqrt{I(\\theta)}$ (§{fisher-information}), which gives the same answers however the parameter is written. A **weakly informative** prior, such as $N(0, 2.5^2)$ on a logistic regression coefficient, rules out absurd values without imposing strong beliefs.",
    },
    {
      type: "definition",
      term: "posterior predictive checks",
      body: "Simulate replicated data sets from the posterior predictive and compare them with the observed data on a chosen statistic. If the observed value is extreme among the replicates, the model misses something about the data.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "updating is sequential",
      statement: "Updating on data $x_1$ and then on $x_2$ gives the same posterior as updating on both at once: yesterday's posterior is today's prior.",
      proof: ["For independent data, $\\pi(\\theta \\mid x_1, x_2) \\propto f(x_2 \\mid \\theta)f(x_1 \\mid \\theta)\\pi(\\theta) \\propto f(x_2 \\mid \\theta)\\,\\pi(\\theta \\mid x_1)$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "large samples",
      statement: "Under mild conditions, as $n \\to \\infty$ the posterior becomes approximately $N\\!\\left(\\hat\\theta_{\\text{MLE}}, \\tfrac{1}{nI(\\hat\\theta)}\\right)$ whatever smooth prior was used (the Bernstein–von Mises theorem), so credible and confidence intervals agree.",
      proof: ["The log-posterior is the log-likelihood, which grows like $n$, plus a fixed log-prior; the quadratic approximation to the log-likelihood (§{likelihood-ratio}) dominates."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "posterior predictive for a proportion",
      statement: "With a Beta$(a, b)$ posterior for $p$, the probability that the next trial succeeds is the posterior mean $\\dfrac{a}{a + b}$.",
      proof: ["$P(\\text{success} \\mid x) = \\int p\\,\\pi(p \\mid x)\\,dp = E[p \\mid x]$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "two hypotheses",
      problem: "A coin is either fair or biased with $p = 0.8$, each with prior probability 0.5. It shows 4 heads in 5 tosses. Find the posterior probability it is biased.",
      solution: [
        "Likelihoods: fair $\\binom54(0.5)^5 = 0.15625$; biased $\\binom54(0.8)^4(0.2) = 0.4096$.",
        "$P(\\text{biased} \\mid x) = \\dfrac{0.5 \\times 0.4096}{0.5 \\times 0.4096 + 0.5 \\times 0.15625} \\approx 0.724$.",
      ],
      result: "About 0.72.",
    },
    {
      type: "example",
      level: 2,
      title: "a continuous parameter",
      problem: "A drug works in 7 of 10 patients. With a uniform Beta(1, 1) prior on the success rate, describe the posterior and predict the next patient.",
      solution: ["Posterior $\\propto p^7(1 - p)^3 \\times 1$: Beta(8, 4).", "Posterior mean $8/12 \\approx 0.667$; that is also the predictive probability that the next patient responds."],
      result: "Beta(8, 4); about 0.67.",
    },
    {
      type: "example",
      level: 3,
      title: "how the prior fades",
      problem: "Prior Beta(10, 10), centred on 0.5. Find the posterior mean after 7 of 10 successes and after 700 of 1,000.",
      solution: ["After 10 trials: Beta(17, 13), mean $17/30 \\approx 0.567$: pulled halfway to 0.5.", "After 1,000: Beta(710, 310), mean $710/1020 \\approx 0.696$: almost the data's 0.7."],
      result: "0.567, then 0.696.",
    },
  ],
  pitfalls: [
    { wrong: "Credible and confidence intervals are the same thing.", right: "A credible interval is a probability statement about the parameter; a confidence interval is about the method." },
    { wrong: "The prior always dominates.", right: "With enough data the likelihood swamps any reasonable prior." },
    { wrong: "A flat prior means no assumptions.", right: "Flat on one scale isn't flat on another (flat on $p$ is not flat on $\\log p$); every prior is a choice." },
  ],
  formulas: [
    { label: "Bayes' rule", tex: "\\pi(\\theta \\mid x) \\propto f(x \\mid \\theta)\\,\\pi(\\theta)" },
    { label: "Credible interval", tex: "P(a \\le \\theta \\le b \\mid x) = 0.95" },
    { label: "Posterior predictive", tex: "\\textstyle\\int f(x_{\\text{new}} \\mid \\theta)\\pi(\\theta \\mid x)\\,d\\theta" },
    { label: "Jeffreys prior", tex: "\\pi(\\theta) \\propto \\sqrt{I(\\theta)}" },
  ],
  exercises: [
    ex(1, num("byix-ex-1", "A Beta(1, 1) prior meets 4 successes in 6 trials. Find the posterior's first parameter $a$.", 5, "$1 + 4$."), ["Beta(5, 3)."]),
    ex(1, num("byix-ex-2", "Same posterior Beta(5, 3). Find its mean.", 0.625, "$5/8$."), ["$0.625$."]),
    ex(2, dp("byix-ex-3", "Prior P(biased, $p = 0.8$) = 0.2, otherwise fair. The coin shows 4 heads in 5 tosses. Find P(biased | data).", post2(0.2, 0.4096, 0.15625), "Weight the likelihoods by the priors."), ["$\\dfrac{0.2 \\times 0.4096}{0.2 \\times 0.4096 + 0.8 \\times 0.15625} \\approx 0.396$."]),
    ex(2, fr("byix-ex-4", "A Beta(2, 2) prior meets 3 successes in 3 trials. Find the predictive probability that the next trial succeeds.", 5 / 7, "Beta(5, 2)."), ["$5/7 \\approx 0.714$."]),
    ex(2, dp("byix-ex-5", "Prior Beta(10, 10); 7 successes in 10. Find the posterior mean.", 17 / 30, "Beta(17, 13)."), ["$17/30 \\approx 0.567$."]),
    ex(3, dp("byix-ex-6", "Same prior; 700 successes in 1,000. Find the posterior mean.", 710 / 1020, "Beta(710, 310)."), ["$710/1020 \\approx 0.696$."]),
    ex(3, mc("byix-ex-7", "Updating on Monday's data and then Tuesday's, versus on both days together,", ["gives the same posterior", "Yesterday's posterior is today's prior."], [["gives a sharper posterior", "Order and grouping don't matter."], ["double-counts Monday", "Only if Monday's data are used twice."]]), ["$\\pi(\\theta \\mid x_1, x_2) \\propto f(x_2 \\mid \\theta)\\pi(\\theta \\mid x_1)$ for independent data."]),
    ex(3, mc("byix-ex-8", "In a posterior predictive check, the observed maximum is larger than in all 1,000 replicated data sets. This suggests", ["the model underestimates the tails", "Replicates never reach what was seen."], [["the model fits well", "The observation is extreme under the model."], ["the prior was too wide", "The issue is the data model's shape."]]), ["Try a heavier-tailed likelihood, such as a $t$ instead of a normal."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.int(1, 2 + 3 * lv);
      const b = r.int(1, 2 + 3 * lv);
      const nn = r.int(3, 10 * lv + 5);
      const k = r.int(0, nn);
      const m = (a + k) / (a + b + nn);
      return n(`A Beta(${a}, ${b}) prior meets ${k} successes in ${nn} trials. Find the posterior mean (3 decimals).`, Math.round(m * 1000) / 1000, `Posterior Beta(${a + k}, ${b + nn - k}): mean $${a + k}/${a + b + nn} \\approx ${Math.round(m * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const prior = r.pick([0.1, 0.2, 0.3, 0.5]);
      const pb = r.pick([0.7, 0.8, 0.9]);
      const nn = r.int(3, 4 + lv);
      const k = r.int(Math.ceil(nn / 2), nn);
      const C = (x: number, y: number) => {
        let c = 1;
        for (let i = 0; i < y; i++) c = (c * (x - i)) / (i + 1);
        return c;
      };
      const lb = C(nn, k) * pb ** k * (1 - pb) ** (nn - k);
      const lf = C(nn, k) * 0.5 ** nn;
      const v = post2(prior, lb, lf);
      return n(`A coin is either biased ($p = ${pb}$) with prior probability ${prior}, or fair. It shows ${k} heads in ${nn} tosses. Find P(biased | data) (3 decimals).`, Math.round(v * 1000) / 1000, `Likelihoods: biased ${Math.round(lb * 10000) / 10000}, fair ${Math.round(lf * 10000) / 10000}. Posterior $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const lo = r2(r.pick([0.2, 0.3, 0.4]));
      const hi = r2(lo + r.pick([0.2, 0.3, 0.4]));
      return mcNumbers(
        `A 95% credible interval for a conversion rate is (${lo}, ${hi}). Which statement does it support?`,
        { text: `Given the data and prior, the rate lies in (${lo}, ${hi}) with probability 0.95`, why: "That is a credible interval's meaning." },
        [
          { text: "Only that 95% of such intervals from repeated studies would contain the rate", why: "That describes a confidence interval.", misconception: "credible-vs-confidence" },
          { text: `95% of customers convert at rates between ${lo} and ${hi}`, why: "The interval is about one parameter, not individuals." },
        ],
      );
    },
  },
];
