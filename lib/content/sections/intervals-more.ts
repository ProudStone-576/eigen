import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Intervals for variances, differences, proportions' differences, predictions and tolerances; error bars. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const CHI = "$\\chi^2$ points (lower, upper 2.5%): 9 d.f. 2.700, 19.023; 15 d.f. 6.262, 27.488; 24 d.f. 12.401, 39.364.";

const base: ConceptNode = {
  id: "intervals-more",
  title: "Intervals for variances, differences & predictions",
  summary: "Not every interval is about a mean. An interval for a variance uses χ² quantiles and is lopsided; an interval for a difference uses the SE of the difference; a prediction interval for one new value adds that value's own spread and is much wider than a confidence interval for the mean.",
  deps: ["confidence-intervals", "t-tests", "sampling-distributions"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "prediction interval", meaning: "A range expected to contain a single future observation with a stated probability." },
    { term: "tolerance interval", meaning: "A range expected to contain a stated share of the whole population, with a stated confidence." },
    { term: "error bar", meaning: "A line drawn around a plotted value; it may show an SD, an SE or a confidence interval, and must say which." },
  ],
  misconceptions: {
    "pi-equals-ci": "Uses a confidence interval for the mean where a prediction interval for a single new value is needed.",
    "variance-ci-symmetric": "Builds an interval for a variance as s² ± something, symmetric around s².",
  },
  steps: [
    {
      type: "motivate",
      title: "Which question are you asking?",
      body: "A factory states that its bolts average 10.00 mm long (95% CI 9.98 to 10.02). A customer asks how long *the next bolt* will be. That is a different question, and its honest answer is about ten times wider.",
      realWorld: {
        title: "Weather forecasts",
        body: "\"Between 18 and 26 °C tomorrow\" is a prediction interval for one day's value, not a confidence interval for an average temperature.",
      },
    },
    {
      type: "truth",
      statement: "**Variance** (normal data): $\\left(\\dfrac{(n - 1)s^2}{\\chi^2_{\\text{upper}}},\\ \\dfrac{(n - 1)s^2}{\\chi^2_{\\text{lower}}}\\right)$ with the upper and lower 2.5% points of $\\chi^2_{n-1}$. **Difference of means**: $(\\bar x_1 - \\bar x_2) \\pm t^*\\sqrt{s_1^2/n_1 + s_2^2/n_2}$. **Prediction** of one new value: $\\bar x \\pm t^*_{n-1}\\,s\\sqrt{1 + \\tfrac1n}$.",
      body: "As $n$ grows, the confidence interval for $\\mu$ shrinks to a point, but the prediction interval only shrinks to about $\\mu \\pm 1.96\\sigma$: a single new value keeps its own spread. A **tolerance interval** is wider still, built to contain, say, 95% of the population with 95% confidence.",
    },
    {
      type: "predict",
      misconception: "pi-equals-ci",
      item: {
        kind: "mc",
        id: "ivm-predict-1",
        prompt: "100 bolts give $\\bar x = 10.00$ mm and $s = 0.10$ mm. Roughly where will 95% of new bolts fall?",
        options: [
          { id: "a", text: "About 9.80 to 10.20 mm", correct: true, why: "$10.00 \\pm 1.98 \\times 0.10\\sqrt{1.01}$." },
          { id: "b", text: "About 9.98 to 10.02 mm, the CI for the mean", misconception: "pi-equals-ci", why: "That locates the average bolt, not the next one." },
          { id: "c", text: "About 9.90 to 10.10 mm", why: "That is only $\\pm 1$ SD, about 68% of bolts." },
        ],
      },
      reveal: {
        body: "The CI uses $s/\\sqrt n = 0.01$ and says where the *average* length is. A single bolt varies by $s = 0.10$ on its own, so the prediction interval is $10.00 \\pm 1.98 \\times 0.10\\sqrt{1 + 1/100} \\approx 10.00 \\pm 0.20$. Collecting more data would narrow the CI further but leave this interval near $\\pm 0.20$.",
      },
      resolve: {
        kind: "mc",
        id: "ivm-resolve-1",
        prompt: "Why is a prediction interval wider than a CI for the mean?",
        options: [
          { id: "a", text: "A new value varies around $\\mu$ by $\\sigma$, on top of the uncertainty about $\\mu$", correct: true, why: "Hence the $\\sqrt{1 + 1/n}$." },
          { id: "b", text: "It isn't: they are the same interval", misconception: "pi-equals-ci", why: "The CI uses $s/\\sqrt n$, the prediction interval about $s$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ivm-check-1",
        prompt: "$n = 10$, $s^2 = 4$; the 95% interval for $\\sigma^2$ is $(1.89, 13.33)$. Why isn't it centred on 4?",
        options: [
          { id: "a", text: "$s^2$ has a right-skewed χ² sampling distribution, so the interval stretches upward", correct: true, why: "$36/19.023$ and $36/2.700$." },
          { id: "b", text: "It should be: there is a mistake", misconception: "variance-ci-symmetric", why: "Symmetric intervals around $s^2$ are wrong for variances." },
          { id: "c", text: "Because $n$ is even", why: "Skewness, not parity, is the reason." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ivm-check-2",
        prompt: "Large samples give $\\bar x_1 - \\bar x_2 = 5$ with SE 2. Find the 95% interval for the difference.",
        options: [
          { id: "a", text: "(1.08, 8.92)", correct: true, why: "$5 \\pm 1.96 \\times 2$." },
          { id: "b", text: "(3, 7)", why: "That uses $\\pm$ one SE." },
          { id: "c", text: "(−1.08, 8.92)", why: "The interval is symmetric about 5." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model's price prediction for one house needs a prediction interval, not the interval for the average price of such houses. Quantile regression and conformal prediction produce prediction intervals without assuming normal errors.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ivm-produce-1", prompt: "$n = 24$, $s = 5$, $t^*_{23} = 2.069$. Find the half-width of the 95% prediction interval to 3 decimals.", answer: Math.round(2.069 * 5 * Math.sqrt(1 + 1 / 24) * 1000) / 1000, tolerance: 0.001, explain: "$2.069 \\times 5\\sqrt{1 + 1/24}$." },
        { kind: "number", id: "ivm-produce-2", prompt: "$n = 10$, $s^2 = 8$, and the upper 2.5% point of $\\chi^2_9$ is 19.023. Find the lower end of the 95% interval for $\\sigma^2$ to 3 decimals.", answer: Math.round((72 / 19.023) * 1000) / 1000, tolerance: 0.001, explain: "$9 \\times 8/19.023$." },
        {
          kind: "mc",
          id: "ivm-produce-4",
          prompt: "A 95% interval for $\\sigma^2$ from normal data is",
          options: [
            { id: "a", text: "lopsided: it reaches further above $s^2$ than below", correct: true, why: "It inverts the right-skewed $\\chi^2_{n-1}$." },
            { id: "b", text: "$s^2 \\pm 1.96$ SE, symmetric about $s^2$", misconception: "variance-ci-symmetric", why: "The sampling distribution of $s^2$ is skewed, so the interval is too." },
          ],
        },
        {
          kind: "mc",
          id: "ivm-produce-3",
          prompt: "A customer wants a range for the battery life of the one phone they buy. Give them",
          options: [
            { id: "a", text: "a prediction interval", correct: true, why: "It is about one new unit." },
            { id: "b", text: "the confidence interval for mean battery life", misconception: "pi-equals-ci", why: "That is far narrower than the spread of individual phones." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ivm-review-1", prompt: "$\\bar x_1 - \\bar x_2 = 3$ with SE 1 (large samples). Find the upper end of the 95% interval.", answer: 4.96, explain: "$3 + 1.96$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "difference of proportions",
      body: "For independent samples, a large-sample interval for $p_1 - p_2$ is $(\\hat p_1 - \\hat p_2) \\pm z^*\\sqrt{\\dfrac{\\hat p_1(1 - \\hat p_1)}{n_1} + \\dfrac{\\hat p_2(1 - \\hat p_2)}{n_2}}$, using the SE of a difference (§{standard-error}).",
    },
    {
      type: "definition",
      term: "tolerance intervals, error bars",
      body: "A **tolerance interval** $\\bar x \\pm ks$ uses a factor $k$ from tables, larger than $z^*$ for small $n$ and tending to $1.96$ for 95% coverage. An **error bar** on a chart may show $\\pm 1$ SD (spread of the data), $\\pm 1$ SE or a 95% CI (precision of the mean): these differ by factors of $\\sqrt n$ and about 2, so the caption must say which.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "interval for a variance",
      statement: `For normal data, $P\\!\\left(\\dfrac{(n - 1)s^2}{\\chi^2_{\\text{upper}}} \\le \\sigma^2 \\le \\dfrac{(n - 1)s^2}{\\chi^2_{\\text{lower}}}\\right) = 0.95$. Take square roots for an interval for $\\sigma$. ${CHI}`,
      proof: ["$(n - 1)s^2/\\sigma^2 \\sim \\chi^2_{n-1}$ (§{sampling-distributions}) lies between its 2.5% points with probability 0.95; solve each inequality for $\\sigma^2$, which flips the two ends."],
    },
    {
      type: "theorem",
      name: "prediction interval",
      statement: "For a normal population, a new observation $X$ satisfies $P\\!\\left(|X - \\bar x| \\le t^*_{n-1}s\\sqrt{1 + 1/n}\\right) = 0.95$.",
      proof: ["$X$ is independent of the sample, so $X - \\bar X \\sim N\\!\\left(0, \\sigma^2(1 + \\tfrac1n)\\right)$. Standardising with $s$ in place of $\\sigma$ gives a $t_{n-1}$ variable (§{t-tests})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "ratio of two variances",
      statement: "For independent normal samples, a 95% interval for $\\sigma_1^2/\\sigma_2^2$ is $\\left(\\dfrac{s_1^2/s_2^2}{F_{\\text{upper}}},\\ \\dfrac{s_1^2/s_2^2}{F_{\\text{lower}}}\\right)$ with the 2.5% points of $F_{n_1 - 1,\\,n_2 - 1}$.",
      proof: ["$\\dfrac{s_1^2/\\sigma_1^2}{s_2^2/\\sigma_2^2} \\sim F_{n_1 - 1, n_2 - 1}$; invert as for a single variance."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "assumptions matter more here",
      statement: "Intervals for means are protected by the central limit theorem; intervals for variances and prediction intervals are not. With skewed or heavy-tailed data they can be badly wrong at any sample size: use the bootstrap (§{bootstrap}) or empirical quantiles instead.",
      proof: ["The CLT makes $\\bar x$ nearly normal for large $n$, but a single new value and the spread $s^2$ keep the population's own shape."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Group means differ by 8 with SE 3 (large samples). Find the 95% interval for the difference. Does it include 0?",
      solution: ["$8 \\pm 1.96 \\times 3 = 8 \\pm 5.88$.", "$(2.12, 13.88)$, which excludes 0."],
      result: "$(2.12, 13.88)$; no.",
    },
    {
      type: "example",
      level: 2,
      title: "a variance interval",
      problem: `$n = 16$ and $s^2 = 25$. Find a 95% interval for $\\sigma^2$ and for $\\sigma$. ${CHI}`,
      solution: ["$\\left(\\tfrac{15 \\times 25}{27.488},\\ \\tfrac{15 \\times 25}{6.262}\\right) = (13.64, 59.89)$.", "For $\\sigma$: square roots, $(3.69, 7.74)$ around $s = 5$."],
      result: "$\\sigma^2$: $(13.6, 59.9)$; $\\sigma$: $(3.7, 7.7)$.",
    },
    {
      type: "example",
      level: 2,
      title: "predicting one value",
      problem: "$n = 25$, $\\bar x = 50$, $s = 4$ and $t^*_{24} = 2.064$. Find the 95% prediction interval and compare it with the CI for $\\mu$.",
      solution: ["Prediction: $50 \\pm 2.064 \\times 4\\sqrt{1.04} = 50 \\pm 8.42$.", "CI: $50 \\pm 2.064 \\times 4/5 = 50 \\pm 1.65$, about a fifth as wide."],
      result: "$(41.6, 58.4)$ against $(48.3, 51.7)$.",
    },
    {
      type: "example",
      level: 3,
      title: "two conversion rates",
      problem: "120 of 400 visitors convert on page A and 90 of 400 on page B. Find a 95% interval for $p_A - p_B$.",
      solution: [
        "$\\hat p_A - \\hat p_B = 0.30 - 0.225 = 0.075$.",
        "$\\text{SE} = \\sqrt{\\tfrac{0.3 \\times 0.7}{400} + \\tfrac{0.225 \\times 0.775}{400}} \\approx \\sqrt{0.000961} = 0.031$.",
        "$0.075 \\pm 1.96 \\times 0.031 = (0.014, 0.136)$.",
      ],
      result: "About $(0.014, 0.136)$: A converts better.",
    },
  ],
  pitfalls: [
    { wrong: "Quote the CI for the mean as the range for the next value.", right: "Use a prediction interval: $s\\sqrt{1 + 1/n}$, not $s/\\sqrt n$." },
    { wrong: "An interval for $\\sigma^2$ is $s^2 \\pm$ something.", right: "Use $\\chi^2$ quantiles; the interval is lopsided." },
    { wrong: "Draw error bars without saying what they are.", right: "SD, SE and 95% CI bars differ by large factors; label them." },
  ],
  formulas: [
    { label: "Variance", tex: "\\left(\\tfrac{(n - 1)s^2}{\\chi^2_{\\text{upper}}},\\ \\tfrac{(n - 1)s^2}{\\chi^2_{\\text{lower}}}\\right)" },
    { label: "Difference of means", tex: "(\\bar x_1 - \\bar x_2) \\pm t^*\\sqrt{s_1^2/n_1 + s_2^2/n_2}" },
    { label: "Difference of proportions", tex: "(\\hat p_1 - \\hat p_2) \\pm z^*\\sqrt{\\tfrac{\\hat p_1\\hat q_1}{n_1} + \\tfrac{\\hat p_2\\hat q_2}{n_2}}" },
    { label: "Prediction", tex: "\\bar x \\pm t^*_{n-1}\\,s\\sqrt{1 + 1/n}" },
  ],
  exercises: [
    ex(1, num("ivmx-ex-1", "A difference of 8 has SE 3 (large samples). Find the upper end of the 95% interval.", 13.88, "$8 + 1.96 \\times 3$."), ["$8 + 5.88 = 13.88$."]),
    ex(1, num("ivmx-ex-2", "With a very large sample, a 95% prediction interval is about $\\mu \\pm 1.96\\sigma$. Find its half-width when $\\sigma = 5$.", 9.8, "$1.96 \\times 5$."), ["$9.8$."]),
    ex(2, dp("ivmx-ex-3", `$n = 10$ and $s^2 = 8$. Find the upper end of the 95% interval for $\\sigma^2$. ${CHI}`, 72 / 2.7, "$9 \\times 8/2.700$."), ["$72/2.700 \\approx 26.667$."]),
    ex(2, dp("ivmx-ex-4", `$n = 25$ and $s^2 = 16$. Find the lower end of the 95% interval for $\\sigma^2$. ${CHI}`, 384 / 39.364, "$24 \\times 16/39.364$."), ["$384/39.364 \\approx 9.755$."]),
    ex(2, dp("ivmx-ex-5", "Same sample. Find the upper end of the 95% interval for $\\sigma$.", Math.sqrt(384 / 12.401), "Square root of $384/12.401$."), ["$\\sqrt{30.965} \\approx 5.565$."]),
    ex(2, dp("ivmx-ex-6", "$n = 16$, $s = 2$, $t^*_{15} = 2.131$. Find the half-width of the 95% prediction interval.", 2.131 * 2 * Math.sqrt(17 / 16), "$t^*s\\sqrt{1 + 1/n}$."), ["$4.262 \\times 1.0308 \\approx 4.393$."]),
    ex(3, dp("ivmx-ex-7", "120 of 400 convert on A and 90 of 400 on B. Find the lower end of the 95% interval for $p_A - p_B$.", 0.075 - 1.96 * Math.sqrt((0.3 * 0.7 + 0.225 * 0.775) / 400), "Difference minus $1.96\\,\\text{SE}$."), ["$0.075 - 1.96 \\times 0.0310 \\approx 0.014$."]),
    ex(3, dp("ivmx-ex-8", "For $n = 100$, find the ratio of the prediction-interval half-width to the CI half-width, $\\sqrt{1 + 1/n}\\big/(1/\\sqrt n)$.", Math.sqrt(101), "$\\sqrt{n + 1}$."), ["$\\sqrt{101} \\approx 10.050$: about ten times wider."]),
    ex(3, mc("ivmx-ex-9", "A bar chart shows group means with error bars of $\\pm 1$ SE. Two bars overlap slightly. You can conclude", ["little: overlapping SE bars don't decide significance either way", "SE bars are about half as long as 95% CI bars."], [["the difference is not significant", "Overlapping ±1 SE bars are compatible with a significant difference."], ["the means are equal", "Overlap never shows equality."]]), ["Label error bars, and test the difference with the SE of the difference."]),
    ex(3, mc("ivmx-ex-10", "Lifetimes are strongly right-skewed and $n = 500$. A normal-theory prediction interval for one lifetime is", ["unreliable, whatever $n$ is", "A single value keeps the population's skew."], [["fine, by the central limit theorem", "The CLT is about $\\bar x$, not one new value."], ["fine once $n > 30$", "Sample size doesn't fix the shape of individual values."]]), ["Use empirical quantiles of the data or a bootstrap instead."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const d = r.int(1, 10 * lv);
      const se = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const end = r.pick(["lower", "upper"] as const);
      const v = end === "lower" ? d - 1.96 * se : d + 1.96 * se;
      return n(`A difference of means is ${d} with SE ${se} (large samples). Find the ${end} end of the 95% interval (2 decimals).`, r2(v), `$${d} ${end === "lower" ? "-" : "+"} 1.96 \\times ${se} = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const t = r.pick([
        { n: 10, t: 2.262 },
        { n: 16, t: 2.131 },
        { n: 20, t: 2.093 },
        { n: 25, t: 2.064 },
        { n: 31, t: 2.042 },
      ]);
      const s = r.int(2, 6 + 4 * lv);
      const v = t.t * s * Math.sqrt(1 + 1 / t.n);
      return n(`$n = ${t.n}$, $s = ${s}$ and $t^*_{${t.n - 1}} = ${t.t}$. Find the half-width of the 95% prediction interval (2 decimals).`, r2(v), `$${t.t} \\times ${s}\\sqrt{1 + 1/${t.n}} \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { q: "the battery life of the next phone off the line", pi: true },
        { q: "the average battery life of this phone model", pi: false },
        { q: "tomorrow's maximum temperature", pi: true },
        { q: "the mean exam score of all students who will ever sit this paper", pi: false },
        { q: "the weight of the next parcel to arrive", pi: true },
      ]);
      return mcNumbers(
        `Which interval answers a question about ${s.q}?`,
        { text: s.pi ? "A prediction interval" : "A confidence interval for the mean", why: s.pi ? "It is about one new value." : "It is about a population average." },
        [{ text: s.pi ? "A confidence interval for the mean" : "A prediction interval", why: s.pi ? "That is far too narrow for one new value." : "That is for a single new value.", ...(s.pi ? { misconception: "pi-equals-ci" } : {}) }],
      );
    },
  },
];
