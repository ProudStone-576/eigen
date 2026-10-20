import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Permutation and randomisation tests, sign-flip tests, Monte Carlo p-values, peeking and sequential tests. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const C = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
};

const base: ConceptNode = {
  id: "permutation-tests",
  title: "Permutation & randomisation tests",
  summary: "If a treatment had no effect, the group labels are arbitrary. Shuffle them, recompute the statistic, and see how often a shuffle is at least as extreme as what was observed: that fraction is a p-value needing no normality. Sequential tests watch data as it arrives without inflating the error rate.",
  deps: ["hypothesis-tests", "counting", "experiment-design"],
  pos: { x: 2, y: 3.4 },
  glossary: [
    { term: "exchangeable", meaning: "Labels that could be swapped without changing the joint distribution, as they can under $H_0$ in a randomised experiment." },
    { term: "permutation distribution", meaning: "The statistic's values over every reassignment of the labels." },
    { term: "peeking", meaning: "Checking a test repeatedly as data arrive and stopping as soon as it looks significant." },
  ],
  misconceptions: {
    "permutation-needs-normal": "Thinks a permutation test needs normally distributed data, as the t-test does.",
    peeking: "Thinks that checking p repeatedly as data arrive, and stopping once p < 0.05, keeps the false-positive rate at 5%.",
  },
  steps: [
    {
      type: "motivate",
      title: "Let the data be the table",
      body: "Five patients on a new drug recovered in 3, 4, 4, 5 and 6 days; five on the old drug took 6, 7, 7, 8 and 9. Instead of assuming normality, ask: if the drug did nothing, how unusual would a split this lopsided be among all the ways of splitting these ten numbers?",
      realWorld: {
        title: "Online experiments",
        body: "Experiment platforms that let analysts watch results every day use sequential tests. Stopping the moment p dips below 0.05 would crown many useless changes as winners.",
      },
    },
    {
      type: "truth",
      statement: "**Permutation test** for two groups: under $H_0$, every assignment of the $n_1 + n_2$ values into groups of sizes $n_1$ and $n_2$ is equally likely. Compute the statistic for all $\\binom{n_1 + n_2}{n_1}$ assignments, or for thousands of random shuffles; the p-value is the fraction at least as extreme as the observed value.",
      body: "It assumes only that the labels are exchangeable under $H_0$, which random assignment guarantees (§{experiment-design}), and it works for any statistic: a difference of means or medians, a correlation. A **sequential test** fixes in advance how the evidence will be checked as data arrive, so that stopping early keeps the error rate at $\\alpha$.",
    },
    {
      type: "predict",
      misconception: "permutation-needs-normal",
      item: {
        kind: "mc",
        id: "prm-predict-1",
        prompt: "The recovery times are clearly not normal, with only 5 per group. Can a permutation test be used?",
        options: [
          { id: "a", text: "Yes: it needs only that the labels are exchangeable under $H_0$", correct: true, why: "It builds its reference distribution from the data." },
          { id: "b", text: "No: like the t-test, it assumes normal data", misconception: "permutation-needs-normal", why: "Reshuffling labels assumes nothing about shape." },
          { id: "c", text: "Only after a log transformation", why: "No transformation is needed." },
        ],
      },
      reveal: {
        body: "There are $\\binom{10}{5} = 252$ ways to split the ten times into two groups of five. Only 2 of them, choosing either of the two 6s, give the new-drug group a total as small as the observed 22. The one-sided p-value is $2/252 \\approx 0.008$, with no assumption about the shape of the data.",
      },
      resolve: {
        kind: "mc",
        id: "prm-resolve-1",
        prompt: "What does a two-group permutation test assume?",
        options: [
          { id: "a", text: "That labels are exchangeable under $H_0$, as random assignment ensures", correct: true, why: "That is all." },
          { id: "b", text: "That the data are normal", misconception: "permutation-needs-normal", why: "It is distribution-free." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prm-check-1",
        prompt: "An analyst runs an A/A test (no real difference) and checks it every day for 30 days, stopping as soon as $p < 0.05$. The chance of a false \"win\" is",
        options: [
          { id: "a", text: "well above 5%, often 20–30%", correct: true, why: "Each look is another chance to cross the line." },
          { id: "b", text: "5%, since each check uses $\\alpha = 0.05$", misconception: "peeking", why: "The error rate applies to one planned look." },
          { id: "c", text: "below 5%", why: "Repeated looks can only add chances to stop falsely." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prm-check-2",
        prompt: "Two groups of 4. How many label assignments does an exact permutation test consider?",
        options: [
          { id: "a", text: "70", correct: true, why: "$\\binom84$." },
          { id: "b", text: "40,320", why: "That is $8!$, which counts orders within groups too." },
          { id: "c", text: "16", why: "That is $2^4$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "**Permutation importance** shuffles one feature's column in the test data and measures how much the model's score drops: the same idea, used to ask whether the model relies on that feature. Two models' per-fold scores can be compared with a paired permutation test, without assuming normality.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "prm-produce-1", prompt: "How many ways are there to split 10 values into two groups of 5?", answer: 252, explain: "$\\binom{10}{5}$." },
        { kind: "number", id: "prm-produce-2", prompt: "Of 1,000 random shuffles, 12 give a statistic at least as extreme as observed. Estimate the p-value.", answer: 0.012, explain: "$12/1000$." },
        {
          kind: "mc",
          id: "prm-produce-3",
          prompt: "To check an A/B test every day safely, use",
          options: [
            { id: "a", text: "a sequential test designed for repeated looks", correct: true, why: "Its thresholds account for the looks." },
            { id: "b", text: "the ordinary test each day, stopping when $p < 0.05$", misconception: "peeking", why: "That inflates the false-positive rate." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "prm-review-1", prompt: "How many ways are there to split 6 values into two groups of 3?", answer: 20, explain: "$\\binom63$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "randomisation test, Monte Carlo p-value",
      body: "A **randomisation test** justifies the reshuffling by the experiment's actual random assignment; a **permutation test** by exchangeability under $H_0$. With $B$ random shuffles of which $k$ are at least as extreme, the **Monte Carlo p-value** is $\\dfrac{k + 1}{B + 1}$, counting the observed arrangement itself.",
    },
    {
      type: "definition",
      term: "sequential probability ratio test",
      body: "The **SPRT** adds up the log-likelihood ratio $\\Lambda_n = \\sum\\ln\\dfrac{f_1(x_i)}{f_0(x_i)}$ as observations arrive, stopping to accept $H_1$ when $\\Lambda_n \\ge \\ln\\tfrac{1 - \\beta}{\\alpha}$ and $H_0$ when $\\Lambda_n \\le \\ln\\tfrac{\\beta}{1 - \\alpha}$. **Group-sequential** designs instead plan a few interim looks with stricter thresholds (Pocock, O'Brien–Fleming).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "permutation tests are exact",
      statement: "Under $H_0$, $P(p \\le \\alpha) \\le \\alpha$ for every $\\alpha$, at any sample size and for any distribution of the data.",
      proof: ["Under $H_0$ the observed arrangement is one of the equally likely arrangements, so its rank among them is uniform. The p-value is its rank divided by the number of arrangements."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "paired data: flip signs",
      statement: "For paired differences $d_1, \\dots, d_n$, $H_0$ of no effect makes each sign equally likely to be + or −. The permutation distribution comes from all $2^n$ sign patterns.",
      proof: ["Within a pair, which member got which treatment is a coin toss under random assignment, and swapping them flips the sign of the difference."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "peeking inflates the error rate",
      statement: "Testing at $\\alpha$ after every new observation and stopping at the first rejection raises the false-positive rate towards 1 as the looks continue. Pre-planned designs keep it at $\\alpha$: with 5 equally spaced looks, Pocock's design rejects only when $|z| > 2.41$.",
      proof: ["Each look gives the random walk of $z$-values another chance to cross 1.96; with unlimited looks it eventually does with probability 1."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Two groups of 3 are compared. How many arrangements are there, and what is the smallest one-sided p-value possible?",
      solution: ["$\\binom63 = 20$ arrangements.", "If the observed split is the single most extreme one, $p = 1/20 = 0.05$: three per group can only just reach 5%."],
      result: "20; 0.05.",
    },
    {
      type: "example",
      level: 2,
      title: "recovery times",
      problem: "New drug: 3, 4, 4, 5, 6 days. Old drug: 6, 7, 7, 8, 9 days. Find the exact one-sided permutation p-value for the new drug being faster, using the new group's total.",
      solution: [
        "The observed new-group total is 22. The smallest possible total of five of the ten values is $3 + 4 + 4 + 5 + 6 = 22$, reached two ways (either 6).",
        "So 2 of the $\\binom{10}{5} = 252$ splits are as extreme: $p = 2/252 \\approx 0.008$.",
      ],
      result: "$p \\approx 0.008$.",
    },
    {
      type: "example",
      level: 3,
      title: "a sign-flip test",
      problem: "Three paired differences are $+2, +3, +5$. Find the one-sided permutation p-value for a positive effect.",
      solution: ["There are $2^3 = 8$ sign patterns; the observed sum 10 is the largest possible.", "$p = 1/8 = 0.125$: with three pairs, no result can reach 5%."],
      result: "0.125.",
    },
  ],
  pitfalls: [
    { wrong: "Permutation tests need normal data.", right: "They need only exchangeable labels under $H_0$." },
    { wrong: "Check the p-value every day and stop at $p < 0.05$.", right: "Plan the looks with a sequential design." },
    { wrong: "Shuffle a time series or paired data freely.", right: "Shuffle only what $H_0$ makes exchangeable: signs within pairs, blocks in time." },
  ],
  formulas: [
    { label: "Arrangements", tex: "\\binom{n_1 + n_2}{n_1}" },
    { label: "Monte Carlo p-value", tex: "\\dfrac{k + 1}{B + 1}" },
    { label: "Sign flips", tex: "2^n" },
    { label: "SPRT boundaries", tex: "\\ln\\tfrac{1 - \\beta}{\\alpha},\\quad \\ln\\tfrac{\\beta}{1 - \\alpha}" },
  ],
  exercises: [
    ex(1, num("prmx-ex-1", "How many ways are there to split 8 values into two groups of 4?", C(8, 4), "$\\binom84$."), ["$70$."]),
    ex(1, num("prmx-ex-2", "How many sign patterns are there for 6 paired differences?", 64, "$2^6$."), ["$64$."]),
    ex(2, num("prmx-ex-3", "9 of 999 random shuffles are at least as extreme as observed. Find the Monte Carlo p-value $(k + 1)/(B + 1)$.", 0.01, "$10/1000$."), ["$0.01$."]),
    ex(2, fr("prmx-ex-4", "Find the smallest possible one-sided p-value with two groups of 3.", 1 / 20, "One arrangement of 20."), ["$1/20 = 0.05$."]),
    ex(2, fr("prmx-ex-5", "Find the smallest possible one-sided sign-flip p-value with 4 pairs.", 1 / 16, "One pattern of 16."), ["$1/16 = 0.0625$: four pairs can't reach 5%."]),
    ex(3, dp("prmx-ex-6", "Find the SPRT upper boundary $\\ln\\tfrac{1 - \\beta}{\\alpha}$ for $\\alpha = 0.05$, $\\beta = 0.1$.", Math.log(0.9 / 0.05), "$\\ln 18$."), ["$\\ln 18 \\approx 2.890$."]),
    ex(3, fr("prmx-ex-7", "Values 1, 2, 8, 9 are split into two groups of 2. The treatment group observed is {1, 2}. Find the one-sided p-value for the treatment giving smaller values.", 1 / 6, "$\\binom42 = 6$ splits."), ["{1, 2} has the smallest possible total, so $p = 1/6$."]),
    ex(3, mc("prmx-ex-8", "Daily temperatures before and after a policy are compared by shuffling all days freely. The problem is", ["consecutive days are dependent, so they aren't exchangeable", "Shuffling breaks the time structure."], [["there is no problem", "Dependence makes the permutation distribution wrong."], ["the test needs normal data", "That isn't the issue."]]), ["Use a block permutation or a time-series model."]),
    ex(3, mc("prmx-ex-9", "Permutation importance of a feature is large. This means", ["the model's score drops a lot when that feature's values are shuffled", "The model relies on the feature."], [["the feature causes the outcome", "Importance is about the model, not causation."], ["the feature is normally distributed", "Unrelated."]]), ["Shuffling breaks the feature's link to the label while keeping its distribution."]),
    ex(3, mc("prmx-ex-10", "A trial plans 5 interim looks with Pocock boundaries. At the 3rd look $z = 2.2$. The trial", ["continues: 2.2 is below the Pocock threshold 2.41", "Each look uses the stricter threshold."], [["stops for efficacy, since $2.2 > 1.96$", "1.96 is for a single look."], ["stops for futility", "No futility rule was given."]]), ["The stricter threshold keeps the overall false-positive rate at 5% across all looks."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const n1 = r.int(2, 3 + lv);
      const n2 = r.int(2, 3 + lv);
      return n(`How many ways are there to split ${n1 + n2} values into a group of ${n1} and a group of ${n2}?`, C(n1 + n2, n1), `$\\binom{${n1 + n2}}{${n1}} = ${C(n1 + n2, n1)}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const B = r.pick([99, 199, 499, 999, 1999]);
      const k = r.int(0, 10 * lv);
      const v = (k + 1) / (B + 1);
      return n(`${k} of ${B} random shuffles are at least as extreme as the observed statistic. Find the Monte Carlo p-value $(k + 1)/(B + 1)$ (4 decimals).`, Math.round(v * 10000) / 10000, `$${k + 1}/${B + 1} \\approx ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const days = r.pick([14, 21, 30, 60]);
      return mcNumbers(
        `An A/A test (no real difference) is checked every day for ${days} days and stopped the first time $p < 0.05$. The chance of falsely declaring a winner is`,
        { text: "well above 5%", why: "Each look is another chance to cross the threshold by luck." },
        [
          { text: "exactly 5%", why: "The 5% applies to a single planned look.", misconception: "peeking" },
          { text: "below 5%", why: "Extra looks can only add false stops." },
        ],
      );
    },
  },
];
