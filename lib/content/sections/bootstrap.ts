import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Bootstrap standard errors, bias estimates and intervals; out-of-bag rows; when the bootstrap fails. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const C = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
};

const base: ConceptNode = {
  id: "bootstrap",
  title: "The bootstrap",
  summary: "Resample the data with replacement, recompute the statistic thousands of times, and use the spread of those replicates as its standard error. The bootstrap handles medians, ratios, correlations and model scores where no formula is handy, and percentile intervals read off its quantiles.",
  deps: ["standard-error", "confidence-intervals"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "bootstrap sample", meaning: "$n$ values drawn with replacement from the $n$ observed values." },
    { term: "replicate", meaning: "The statistic recomputed on one bootstrap sample." },
    { term: "out-of-bag", meaning: "The original rows that a particular bootstrap sample happened to leave out." },
  ],
  misconceptions: {
    "bootstrap-new-data": "Thinks bootstrapping creates new information, so it can fix a small or biased sample.",
    "resample-without-replacement": "Resamples without replacement, which only reshuffles the same values and gives no spread.",
  },
  steps: [
    {
      type: "motivate",
      title: "When there is no formula",
      body: "The SE of a mean is $s/\\sqrt n$. But what is the SE of a median, a trimmed mean, a ratio of two means, or a classifier's AUC? The formulas are messy or don't exist. The bootstrap gets them by simulation, using only the data you already have.",
      realWorld: {
        title: "Reporting model scores",
        body: "Machine-learning papers report accuracy with bootstrap confidence intervals: resample the test set, recompute accuracy each time, and read off the 2.5th and 97.5th percentiles of the results.",
      },
    },
    {
      type: "truth",
      statement: "From data $x_1, \\dots, x_n$, draw a **bootstrap sample** of size $n$ *with replacement* and compute the statistic $\\hat\\theta^*$. Repeat $B$ times, typically 1,000 to 10,000. The **bootstrap SE** is the standard deviation of $\\hat\\theta^*_1, \\dots, \\hat\\theta^*_B$, and the **percentile interval** runs from their 2.5th to their 97.5th percentile.",
      body: "It works because the sample's own distribution stands in for the unknown population: resampling from it imitates drawing fresh samples. It needs a reasonably large, representative sample, and it fails for statistics driven by extremes, such as the maximum.",
    },
    {
      type: "predict",
      misconception: "bootstrap-new-data",
      item: {
        kind: "mc",
        id: "bts-predict-1",
        prompt: "A survey of 50 people over-represents one age group. It is bootstrapped 10,000 times. The bootstrap interval",
        options: [
          { id: "a", text: "is centred on the same biased estimate", correct: true, why: "Every resample comes from the same 50 responses." },
          { id: "b", text: "corrects the bias, because 10,000 resamples is a lot of data", misconception: "bootstrap-new-data", why: "Resampling adds no new people." },
          { id: "c", text: "is always wider than the usual interval", why: "Its width reflects sampling noise, not bias." },
        ],
      },
      reveal: {
        body: "Each bootstrap sample is drawn from the same 50 responses, so it inherits their bias. The bootstrap measures how much an estimate would wobble *if the sample were representative*; it cannot add the people who were missed. Ten thousand resamples only measure that wobble precisely.",
      },
      resolve: {
        kind: "mc",
        id: "bts-resolve-1",
        prompt: "What does the bootstrap estimate?",
        options: [
          { id: "a", text: "The sampling variability of a statistic, using the data as a stand-in population", correct: true, why: "Spread, not truth." },
          { id: "b", text: "The true parameter, more accurately than the original sample", misconception: "bootstrap-new-data", why: "The replicates centre on the original estimate." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bts-check-1",
        prompt: "You \"resample\" 20 values *without* replacement, 20 at a time, and compute each mean. The spread of these means is",
        options: [
          { id: "a", text: "zero: every resample is the same 20 values in a new order", correct: true, why: "The mean doesn't depend on order." },
          { id: "b", text: "a good bootstrap SE", misconception: "resample-without-replacement", why: "Variation comes from repeats and omissions, which need replacement." },
          { id: "c", text: "larger than the true SE", why: "It is exactly 0." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bts-check-2",
        prompt: "Sorted bootstrap replicates of a median have 2.5th percentile 41 and 97.5th percentile 53. The 95% percentile interval is",
        options: [
          { id: "a", text: "(41, 53)", correct: true, why: "Read the interval straight from the replicates' quantiles." },
          { id: "b", text: "the median ± 1.96 × 12", why: "12 is the interval's width, not an SE." },
          { id: "c", text: "(41, 53), but only for normal data", why: "The percentile method doesn't assume normality." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "**Bagging** (bootstrap aggregating) trains one model per bootstrap sample and averages them, cutting variance; random forests are bagged decision trees. About 37% of rows are left out of each bootstrap sample, and these out-of-bag rows give a free validation estimate.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "bts-produce-1", prompt: "For large $n$, what fraction of rows does a bootstrap sample leave out? Give 3 decimals.", answer: Math.round(Math.exp(-1) * 1000) / 1000, tolerance: 0.001, explain: "$(1 - 1/n)^n \\to e^{-1}$." },
        { kind: "number", id: "bts-produce-2", prompt: "Five bootstrap replicates are 10, 12, 11, 13, 14. Find their standard deviation (dividing by $B - 1$) to 3 decimals.", answer: Math.round(Math.sqrt(2.5) * 1000) / 1000, tolerance: 0.001, explain: "Deviations from 12 square to a total of 10; $10/4 = 2.5$." },
        {
          kind: "mc",
          id: "bts-produce-3",
          prompt: "Bootstrap samples must be drawn",
          options: [
            { id: "a", text: "with replacement, the same size as the data", correct: true, why: "Repeats and omissions create the variation." },
            { id: "b", text: "without replacement", misconception: "resample-without-replacement", why: "That reproduces the data exactly." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "bts-review-1", prompt: "A bootstrap sample of size 10 is drawn from 10 rows. Find the probability a particular row is left out, to 3 decimals.", answer: Math.round(0.9 ** 10 * 1000) / 1000, tolerance: 0.001, explain: "$0.9^{10}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "plug-in principle, parametric bootstrap",
      body: "The **plug-in principle** estimates a feature of the population by the same feature of the sample's empirical distribution. A **parametric bootstrap** instead simulates new data from the fitted model, for example from $N(\\bar x, s^2)$, which helps when $n$ is small but trusts the model.",
    },
    {
      type: "definition",
      term: "bias estimate and the basic interval",
      body: "The **bootstrap bias estimate** is $\\bar\\theta^* - \\hat\\theta$, the replicates' mean minus the original estimate; the bias-corrected estimate is $2\\hat\\theta - \\bar\\theta^*$. The **basic interval** reflects the percentiles about $\\hat\\theta$: $(2\\hat\\theta - q_{0.975},\\ 2\\hat\\theta - q_{0.025})$. Refinements such as BCa adjust for bias and skew.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "out-of-bag rows",
      statement: "Each row is missed by a bootstrap sample with probability $(1 - 1/n)^n$, which tends to $e^{-1} \\approx 0.368$.",
      proof: ["Each of the $n$ independent draws misses the row with probability $1 - 1/n$. And $(1 - 1/n)^n \\to e^{-1}$ (§{poisson})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the bootstrap SE of a mean",
      statement: "Over all bootstrap samples, $\\operatorname{Var}(\\bar x^*) = \\dfrac{\\hat\\sigma^2}{n}$, where $\\hat\\sigma^2 = \\tfrac1n\\sum(x_i - \\bar x)^2$. So the bootstrap reproduces the usual SE, up to the factor $\\sqrt{(n - 1)/n}$.",
      proof: ["A bootstrap sample is $n$ independent draws from the empirical distribution, whose mean is $\\bar x$ and variance $\\hat\\sigma^2$; apply $\\operatorname{Var}(\\bar X) = \\sigma^2/n$ (§{clt})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "how many bootstrap samples exist",
      statement: "There are $\\binom{2n - 1}{n}$ distinct bootstrap samples (ignoring order) of $n$ distinct values.",
      proof: ["A bootstrap sample is a choice of how many copies of each of the $n$ values to take, adding to $n$: stars and bars (§{counting})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "when it fails",
      statement: "The plain bootstrap is unreliable for very small samples, for statistics determined by extremes (the maximum, a range), and for dependent data such as time series, where whole blocks of consecutive values must be resampled instead.",
      proof: ["Resampling individual values destroys the time order that carries the dependence, and no resample can exceed the observed maximum."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Data are 1, 2 and 6. Give one possible bootstrap sample and its mean.",
      solution: ["Draw three values with replacement, for example 2, 2, 6.", "Its mean is $10/3 \\approx 3.33$, against the original 3."],
      result: "For example (2, 2, 6), mean 3.33.",
    },
    {
      type: "example",
      level: 2,
      title: "the exact bootstrap SE",
      problem: "For the data 1, 2, 6, find the bootstrap SE of the mean without simulating.",
      solution: ["$\\hat\\sigma^2 = \\tfrac{(-2)^2 + (-1)^2 + 3^2}{3} = \\tfrac{14}{3}$.", "$\\operatorname{Var}(\\bar x^*) = \\tfrac{14}{9}$, so SE $= \\sqrt{14}/3 \\approx 1.247$."],
      result: "About 1.25.",
    },
    {
      type: "example",
      level: 3,
      title: "bias and the basic interval",
      problem: "An estimate is $\\hat\\theta = 2.5$. Its replicates have mean 2.8 and 2.5th and 97.5th percentiles 2.0 and 3.4. Find the bias estimate, the corrected estimate and the basic interval.",
      solution: ["Bias $\\approx 2.8 - 2.5 = 0.3$, so the corrected estimate is $2.5 - 0.3 = 2.2$.", "Basic interval: $(2 \\times 2.5 - 3.4,\\ 2 \\times 2.5 - 2.0) = (1.6, 3.0)$."],
      result: "Bias 0.3; 2.2; $(1.6, 3.0)$.",
    },
  ],
  pitfalls: [
    { wrong: "Bootstrapping a small or biased sample fixes it.", right: "It only re-uses the same data; bias and missing information remain." },
    { wrong: "Resample without replacement.", right: "Draw with replacement, $n$ at a time." },
    { wrong: "Bootstrap a time series value by value.", right: "Use a block bootstrap, which keeps runs of consecutive values together." },
  ],
  formulas: [
    { label: "Bootstrap SE", tex: "\\operatorname{SD}(\\hat\\theta^*_1, \\dots, \\hat\\theta^*_B)" },
    { label: "Percentile interval", tex: "(q_{0.025}^*,\\ q_{0.975}^*)" },
    { label: "Bias", tex: "\\bar\\theta^* - \\hat\\theta" },
    { label: "Left out", tex: "(1 - 1/n)^n \\to e^{-1}" },
  ],
  exercises: [
    ex(1, dp("btsx-ex-1", "For $n = 5$, find the probability a row is left out of a bootstrap sample.", 0.8 ** 5, "$(1 - 1/5)^5$."), ["$0.8^5 \\approx 0.328$."]),
    ex(1, num("btsx-ex-2", "How many distinct bootstrap samples (ignoring order) do 4 distinct values have?", C(7, 4), "$\\binom{2n - 1}{n}$."), ["$\\binom74 = 35$."]),
    ex(2, num("btsx-ex-3", "$\\hat\\theta = 10$ and the bootstrap replicates average 10.6. Find the bootstrap bias estimate.", 0.6, "$\\bar\\theta^* - \\hat\\theta$."), ["$0.6$."]),
    ex(2, num("btsx-ex-4", "Same numbers. Find the bias-corrected estimate.", 9.4, "$2\\hat\\theta - \\bar\\theta^*$."), ["$20 - 10.6 = 9.4$."]),
    ex(2, dp("btsx-ex-5", "Find the exact bootstrap SE of the mean for the data 2, 4, 9.", Math.sqrt(26 / 9), "$\\sqrt{\\hat\\sigma^2/n}$."), ["$\\hat\\sigma^2 = \\tfrac{9 + 1 + 16}{3} = \\tfrac{26}{3}$; SE $= \\sqrt{26/9} \\approx 1.700$."]),
    ex(3, num("btsx-ex-6", "$\\hat\\theta = 50$ and the 97.5th percentile of the replicates is 58. Find the lower end of the basic interval.", 42, "$2\\hat\\theta - q_{0.975}$."), ["$100 - 58 = 42$."]),
    ex(3, num("btsx-ex-7", "With $B = 1000$ sorted replicates, roughly which position marks the 97.5th percentile?", 975, "$0.975 \\times 1000$."), ["The 975th replicate (conventions differ by one)."]),
    ex(3, mc("btsx-ex-8", "To bootstrap daily sales data with strong day-to-day correlation, you should", ["resample blocks of consecutive days", "That keeps the dependence."], [["resample individual days", "That breaks the dependence and understates the SE."], ["not resample at all", "Block methods work."]]), ["The block bootstrap keeps runs of consecutive values together."]),
    ex(3, mc("btsx-ex-9", "Bootstrapping the sample maximum to estimate a population's maximum", ["works poorly: no resample can exceed the observed maximum", "The replicates are stuck at or below it."], [["works well", "Extremes are exactly where it fails."], ["works if $B$ is large enough", "More replicates don't add values above the maximum."]]), ["The bootstrap distribution of the maximum puts about 63% of its mass on the observed maximum itself."]),
    ex(3, mc("btsx-ex-10", "A test set of 200 gives accuracy 0.85. A 95% bootstrap interval would be built by", ["resampling the 200 test predictions with replacement and recomputing accuracy each time", "The test set is the sample."], [["retraining the model 1,000 times", "That measures training variability, a different question."], ["adding ±1.96 to 0.85", "1.96 multiplies an SE."]]), ["Resample the 200 (prediction, label) pairs, recompute accuracy, and take the 2.5th and 97.5th percentiles."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(3, 6 + 10 * lv);
      const v = (1 - 1 / nn) ** nn;
      return n(`A bootstrap sample of size ${nn} is drawn from ${nn} rows. Find the probability that a particular row is left out (3 decimals).`, Math.round(v * 1000) / 1000, `$(1 - 1/${nn})^{${nn}} \\approx ${Math.round(v * 1000) / 1000}$, approaching $e^{-1} \\approx 0.368$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const th = r.int(10, 60);
      const shift = r.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]) * lv;
      const corrected = lv === 3 && r.pick([true, false]);
      const v = corrected ? th - shift : shift;
      return n(`An estimate is ${th}; its bootstrap replicates average ${r2(th + shift)}. Find the ${corrected ? "bias-corrected estimate" : "bootstrap bias estimate"}.`, r2(v), corrected ? `$2 \\times ${th} - ${r2(th + shift)} = ${r2(v)}$.` : `$${r2(th + shift)} - ${th} = ${r2(v)}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([30, 50, 80, 120]);
      return mcNumbers(
        `A convenience sample of ${nn} customers is bootstrapped 5,000 times to estimate average spending. What does the bootstrap fix?`,
        { text: "Nothing about the bias; it estimates the sampling noise", why: "Every resample comes from the same unrepresentative customers." },
        [
          { text: "The bias, because 5,000 resamples cover the population", why: "Resampling never adds new customers.", misconception: "bootstrap-new-data" },
          { text: "Both bias and noise", why: "Only the noise is measured." },
        ],
      );
    },
  },
];
