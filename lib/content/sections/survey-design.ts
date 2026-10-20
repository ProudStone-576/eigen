import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Survey sampling in practice: finite population correction, weights, post-stratification, design effects. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "survey-design",
  title: "Survey design: weights & corrections",
  summary: "A survey's precision depends on how many people are asked, not on what share of the population that is, unless the share is large; then the finite population correction shrinks the standard error. Weights let a sample that over- or under-represents groups estimate the whole population.",
  deps: ["standard-error", "sampling-bias"],
  pos: { x: 1, y: 1 },
  glossary: [
    { term: "finite population correction", meaning: "The factor $\\sqrt{(N - n)/(N - 1)}$ that shrinks a standard error when a large share of the population is sampled." },
    { term: "weight", meaning: "How many population members a sampled unit stands for." },
    { term: "post-stratification", meaning: "Re-weighting a sample after collection so that its mix by age, region and so on matches known population totals." },
  ],
  misconceptions: {
    "n-relative-to-population": "Thinks a sample's precision depends on the fraction of the population sampled rather than on the sample size itself.",
    "unweighted-average": "Averages over a sample that over-represents some groups without weighting, so those groups count too much.",
  },
  steps: [
    {
      type: "motivate",
      title: "A thousand people for forty million",
      body: "A national poll of 1,000 people is about as precise as a poll of 1,000 people in a town of 50,000. Precision depends on how many you ask, not on what fraction of the population that is, until the fraction becomes large.",
      realWorld: {
        title: "Election polls",
        body: "Pollsters deliberately over-sample small groups so they have enough responses to say something about them, then weight every response so the published totals match the population's mix of age, region and education.",
      },
    },
    {
      type: "truth",
      statement: "For a simple random sample of $n$ from a population of $N$, $\\text{SE}(\\bar x) = \\dfrac{s}{\\sqrt n}\\sqrt{\\dfrac{N - n}{N - 1}}$. The square root is the **finite population correction** (FPC); it is close to 1 unless $n/N$ exceeds about 5%. In a **weighted** sample, unit $i$ stands for $w_i$ people and $\\bar x_w = \\dfrac{\\sum w_ix_i}{\\sum w_i}$.",
      body: "Weights correct planned imbalances (over-sampling a small group) and unplanned ones (**post-stratification** to census totals). They cannot fix **coverage error**, people who could never have been sampled, unless those people resemble the ones who were.",
    },
    {
      type: "predict",
      misconception: "n-relative-to-population",
      item: {
        kind: "mc",
        id: "srv-predict-1",
        prompt: "Poll A asks 1,000 of a city's 100,000 voters; poll B asks 1,000 of a country's 50,000,000. Both are random samples. Which has the smaller margin of error?",
        options: [
          { id: "a", text: "About the same: both are close to $0.5/\\sqrt{1000}$", correct: true, why: "The FPC differs by about half a percent." },
          { id: "b", text: "A, because it samples 1% instead of 0.002%", misconception: "n-relative-to-population", why: "The share matters only through the FPC, which is near 1 for both." },
          { id: "c", text: "B, because its population is bigger", why: "A bigger population doesn't help or hurt much." },
        ],
      },
      reveal: {
        body: "For A the FPC is $\\sqrt{99{,}000/99{,}999} \\approx 0.995$; for B it is $0.99998$. The SE of a proportion near 0.5 is about $0.5/\\sqrt{1000} \\approx 0.016$ for both. A spoonful tells you how salty the soup is whether the pot is small or huge, as long as it is stirred.",
      },
      resolve: {
        kind: "mc",
        id: "srv-resolve-1",
        prompt: "What mainly determines a random sample's precision?",
        options: [
          { id: "a", text: "The sample size $n$", correct: true, why: "SE shrinks like $1/\\sqrt n$." },
          { id: "b", text: "The fraction of the population sampled", misconception: "n-relative-to-population", why: "Only when that fraction is large does it matter." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "srv-check-1",
        prompt: "A survey interviews 500 urban and 500 rural people, but the population is 80% urban. Mean incomes are ₹40,000 (urban) and ₹20,000 (rural). Estimate the population mean.",
        options: [
          { id: "a", text: "₹36,000: weight the groups 0.8 and 0.2", correct: true, why: "$0.8 \\times 40{,}000 + 0.2 \\times 20{,}000$." },
          { id: "b", text: "₹30,000: the average of the sample", misconception: "unweighted-average", why: "Rural people are over-represented in the sample." },
          { id: "c", text: "₹40,000", why: "That ignores the rural fifth of the population." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "srv-check-2",
        prompt: "A company samples 600 of its 1,000 employees at random. Compared with the usual $s/\\sqrt n$, the FPC makes the SE",
        options: [
          { id: "a", text: "smaller, by a factor of about 0.63", correct: true, why: "$\\sqrt{400/999} \\approx 0.633$." },
          { id: "b", text: "larger", why: "Sampling more of the population can only help." },
          { id: "c", text: "unchanged", why: "60% of the population is far above 5%." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Class imbalance is a weighting problem. If fraud is over-sampled to 50% of the training data but is 1% in reality, predicted probabilities must be re-weighted, or the model recalibrated, before they mean anything. Most libraries accept a sample_weight argument for this reason.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "srv-produce-1", prompt: "Find the FPC $\\sqrt{(N - n)/(N - 1)}$ for $n = 20$ from $N = 101$.", answer: 0.9, explain: "$\\sqrt{81/100}$." },
        { kind: "number", id: "srv-produce-2", prompt: "A group making up 60% of the population has mean 10; the rest has mean 30. Find the population mean.", answer: 18, explain: "$0.6 \\times 10 + 0.4 \\times 30$." },
        {
          kind: "mc",
          id: "srv-produce-3",
          prompt: "A survey over-sampled young people. To estimate the national average,",
          options: [
            { id: "a", text: "weight each group by its population share", correct: true, why: "That undoes the over-sampling." },
            { id: "b", text: "average all the responses equally", misconception: "unweighted-average", why: "Young people would count too much." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "srv-review-1", prompt: "Without the FPC the SE is 2; the FPC is 0.9. Find the corrected SE.", answer: 1.8, explain: "$2 \\times 0.9$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "design and post-stratification weights",
      body: "If unit $i$ had inclusion probability $\\pi_i$, its **design weight** is $1/\\pi_i$. A **post-stratification weight** for a group is its population share divided by its sample share. The **Horvitz–Thompson** estimate of a population total is $\\sum_{i \\in \\text{sample}} y_i/\\pi_i$.",
    },
    {
      type: "definition",
      term: "total survey error",
      body: "Besides sampling error: **coverage error** (the frame misses people), **nonresponse** (sampled people don't answer), and **measurement error** from question wording and order, recall bias and social desirability (people over-report voting and under-report drinking).",
    },
    {
      type: "definition",
      term: "design effect",
      body: "The **design effect** is $\\text{deff} = \\dfrac{\\operatorname{Var}(\\text{estimate under the design})}{\\operatorname{Var}(\\text{estimate under SRS of the same } n)}$. The **effective sample size** is $n/\\text{deff}$. Cluster samples usually have $\\text{deff} > 1$; good stratification gives $\\text{deff} < 1$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "finite population correction",
      statement: "For a simple random sample of $n$ drawn without replacement from $N$ values with variance $\\sigma^2$, $\\operatorname{Var}(\\bar x) = \\dfrac{\\sigma^2}{n}\\cdot\\dfrac{N - n}{N - 1}$.",
      proof: [
        "Without replacement any two draws have covariance $-\\dfrac{\\sigma^2}{N - 1}$: knowing one draw was large makes the next slightly smaller.",
        "So $\\operatorname{Var}(\\sum x_i) = n\\sigma^2 - n(n - 1)\\dfrac{\\sigma^2}{N - 1} = n\\sigma^2\\dfrac{N - n}{N - 1}$; divide by $n^2$. At $n = N$ the variance is 0: a census has no sampling error.",
      ],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "sample size for a finite population",
      statement: "If $n_0$ is the size needed for an infinite population (§{confidence-intervals}), a population of $N$ needs $n = \\dfrac{n_0}{1 + (n_0 - 1)/N}$, rounded up.",
      proof: ["Solve $\\dfrac{\\sigma^2}{n}\\cdot\\dfrac{N - n}{N - 1} = \\dfrac{\\sigma^2}{n_0}$ for $n$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Horvitz–Thompson is unbiased",
      statement: "$E\\left[\\sum_{i \\in \\text{sample}} y_i/\\pi_i\\right] = \\sum_{\\text{all } i} y_i$, for any design in which every unit has $\\pi_i > 0$.",
      proof: ["Unit $i$ appears in the sum with probability $\\pi_i$, contributing $y_i/\\pi_i$ when it does: expected contribution $y_i$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "design effect of clusters",
      statement: "With clusters of $m$ units and intra-cluster correlation $\\rho$, $\\text{deff} \\approx 1 + (m - 1)\\rho$.",
      proof: ["Units in a cluster resemble each other, so each extra unit from the same cluster adds less new information; $\\rho$ measures how much."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A sample has 50% women, but the population is 52% women and 48% men. Find the post-stratification weights.",
      solution: ["Women: $0.52/0.50 = 1.04$.", "Men: $0.48/0.50 = 0.96$."],
      result: "1.04 and 0.96.",
    },
    {
      type: "example",
      level: 2,
      title: "the correction in use",
      problem: "600 of 1,000 employees are sampled; $s = 10$. Find the SE of the mean with and without the FPC.",
      solution: ["Without: $10/\\sqrt{600} \\approx 0.408$.", "FPC $= \\sqrt{400/999} \\approx 0.633$, so SE $\\approx 0.258$."],
      result: "0.408 against 0.258.",
    },
    {
      type: "example",
      level: 2,
      title: "sizing for a small population",
      problem: "A survey needs $n_0 = 385$ for an infinite population. How many are needed from a school of 2,000?",
      solution: ["$n = \\dfrac{385}{1 + 384/2000} = \\dfrac{385}{1.192} \\approx 323.0$.", "Round up."],
      result: "323.",
    },
    {
      type: "example",
      level: 3,
      title: "a cluster sample",
      problem: "1,000 pupils are surveyed as 50 schools of 20 pupils, with intra-school correlation 0.05. Find the design effect and effective sample size.",
      solution: ["$\\text{deff} = 1 + 19 \\times 0.05 = 1.95$.", "Effective size $1000/1.95 \\approx 513$: the clusters carry about half the information of 1,000 independent pupils."],
      result: "1.95; about 513.",
    },
  ],
  pitfalls: [
    { wrong: "A bigger population needs a proportionally bigger sample.", right: "Above a few thousand, the population size barely matters; $n$ does." },
    { wrong: "Average every response equally after over-sampling a group.", right: "Weight by population share." },
    { wrong: "Weighting fixes any bias.", right: "It can't recover people who were never reachable (coverage) unless they resemble those who were." },
    { wrong: "Treat a cluster sample as a simple random sample.", right: "The SE comes out too small; multiply the variance by the design effect." },
  ],
  formulas: [
    { label: "FPC", tex: "\\text{SE} = \\dfrac{s}{\\sqrt n}\\sqrt{\\dfrac{N - n}{N - 1}}" },
    { label: "Finite-population size", tex: "n = \\dfrac{n_0}{1 + (n_0 - 1)/N}" },
    { label: "Weighted mean", tex: "\\bar x_w = \\textstyle\\sum w_ix_i/\\sum w_i" },
    { label: "Horvitz–Thompson total", tex: "\\textstyle\\sum y_i/\\pi_i" },
    { label: "Design effect", tex: "1 + (m - 1)\\rho" },
  ],
  exercises: [
    ex(1, num("srvx-ex-1", "70% of a population has mean 50 and 30% has mean 80. Find the population mean.", 59, "Weight by share."), ["$35 + 24 = 59$."]),
    ex(1, num("srvx-ex-2", "A group is 20% of the population but 40% of the sample. Find its post-stratification weight.", 0.5, "$0.2/0.4$."), ["$0.5$: each member counts half."]),
    ex(2, dp("srvx-ex-3", "Find the FPC for $n = 200$ from $N = 1000$.", Math.sqrt(800 / 999), "$\\sqrt{800/999}$."), ["$\\approx 0.895$."]),
    ex(2, fr("srvx-ex-4", "$s = 9$, $n = 81$, $N = 145$. Find the SE of the mean with the FPC.", 2 / 3, "$1 \\times \\sqrt{64/144}$."), ["$s/\\sqrt n = 1$ and the FPC is $\\sqrt{64/144} = \\tfrac23$."]),
    ex(2, num("srvx-ex-5", "$n_0 = 400$ and $N = 1600$. Find the required sample size.", 321, "Round up."), ["$\\dfrac{400}{1 + 399/1600} \\approx 320.2$, so 321."]),
    ex(3, num("srvx-ex-6", "Clusters of 11 with intra-cluster correlation 0.1. Find the design effect.", 2, "$1 + 10 \\times 0.1$."), ["$2$."]),
    ex(3, num("srvx-ex-7", "1,200 people are surveyed with design effect 2. Find the effective sample size.", 600, "$n/\\text{deff}$."), ["$600$."]),
    ex(3, num("srvx-ex-8", "Three sampled units have $y = 10, 20, 30$ and inclusion probabilities $0.5, 0.2, 0.1$. Find the Horvitz–Thompson estimate of the population total.", 420, "$\\sum y/\\pi$."), ["$20 + 100 + 300 = 420$."]),
    ex(3, mc("srvx-ex-9", "An online poll is weighted to match the population by age and gender. It can still be biased because", ["people without internet access may differ in ways weights don't capture", "That is coverage error."], [["weighting always adds bias", "Weighting usually reduces bias."], ["it has too few respondents", "The issue is who could respond, not how many."]]), ["Weights only adjust for variables they use; offline people may differ in income, region and views."]),
    ex(3, mc("srvx-ex-10", "Sampling 10% of a population of 1,000 instead of 10% of a population of 100,000 gives", ["a much larger SE for the small population, because $n$ is 100 rather than 10,000", "Precision follows $n$."], [["the same SE, because both sample 10%", "The share is the same; the sample sizes are not."], ["a smaller SE for the small population", "Its $n$ is a hundred times smaller."]]), ["$n = 100$ against $n = 10{,}000$: the SE ratio is $\\sqrt{100} = 10$ (the FPC is about 0.95 for both)."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const share = r.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]);
      const m1 = r.int(10, 50) * (lv === 1 ? 10 : 1);
      const m2 = r.int(10, 50) * (lv === 1 ? 10 : 1);
      const v = share * m1 + (1 - share) * m2;
      return n(`A group making up ${share * 100}% of the population has mean ${m1}; the rest has mean ${m2}. Find the population mean (2 decimals).`, r2(v), `$${share} \\times ${m1} + ${r2(1 - share)} \\times ${m2} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const N = r.int(5, 40) * (lv === 1 ? 100 : 50);
      const nn = Math.round(N * r.pick([0.1, 0.2, 0.3, 0.4, 0.5]));
      const f = Math.sqrt((N - nn) / (N - 1));
      return n(`Find the finite population correction for a sample of ${nn} from ${N} (3 decimals).`, Math.round(f * 1000) / 1000, `$\\sqrt{(${N} - ${nn})/${N - 1}} \\approx ${Math.round(f * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([500, 1000, 1500, 2000]);
      const n1 = r.pick([50_000, 200_000, 1_000_000]);
      const n2 = r.pick([10_000_000, 80_000_000, 300_000_000]);
      return mcNumbers(
        `Random samples of ${nn.toLocaleString("en-US")} are taken from a city of ${n1.toLocaleString("en-US")} and a country of ${n2.toLocaleString("en-US")}. How do their margins of error compare?`,
        { text: "About the same", why: "Precision depends on $n$; both finite population corrections are nearly 1." },
        [
          { text: "The city's is much smaller", why: "Sampling a larger share helps only through the FPC, close to 1 here.", misconception: "n-relative-to-population" },
          { text: "The country's is much smaller", why: "A bigger population doesn't make the sample more precise." },
        ],
      );
    },
  },
];
