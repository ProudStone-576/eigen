import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Moments, skewness and kurtosis; standardising, scaling, log and Box–Cox transformations; Q-Q plots. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "transformations",
  title: "Kurtosis, transformations & Q-Q plots",
  summary: "Skewness and kurtosis are standardised third and fourth moments: asymmetry and tail weight. Standardising and min-max scaling change units but not shape; log, square-root and Box–Cox transformations pull in a long right tail. A Q-Q plot checks normality by eye.",
  deps: ["normal", "skew-shape", "spread-measures"],
  pos: { x: 2, y: 3 },
  glossary: [
    { term: "excess kurtosis", meaning: "Fourth standardised moment minus 3: positive means heavier tails than a normal distribution." },
    { term: "Box–Cox", meaning: "A family of power transformations, $(x^\\lambda - 1)/\\lambda$, with $\\log x$ at $\\lambda = 0$." },
    { term: "Q-Q plot", meaning: "Sorted data plotted against the quantiles a normal distribution would give; a straight line means the shapes match." },
  ],
  misconceptions: {
    "scaling-changes-shape": "Thinks standardising or min-max scaling makes data normally distributed.",
    "kurtosis-is-peakedness": "Thinks kurtosis measures how pointed the peak is, rather than how heavy the tails are.",
  },
  steps: [
    {
      type: "motivate",
      title: "Lopsided data",
      body: "Household incomes have a long right tail: most families earn moderate amounts and a few earn hundreds of times more. Means, tests and many models behave badly on such data. On a log scale the same incomes look nearly symmetric.",
      realWorld: {
        title: "Earthquakes and decibels",
        body: "The Richter and decibel scales are logarithms. They turn quantities spanning many powers of ten into numbers that are easy to compare: each step of 1 is a tenfold change.",
      },
    },
    {
      type: "explore",
      title: "Shift and stretch",
      body: "Changing the mean slides the curve; changing the standard deviation stretches it.",
      widget: { kind: "normal", mu: 0, sigma: 1 },
      task: "Move both sliders. Does the shape of the curve ever change, or only its position and width?",
    },
    {
      type: "truth",
      statement: "**Skewness** $g_1 = \\dfrac{m_3}{m_2^{3/2}}$ and **excess kurtosis** $g_2 = \\dfrac{m_4}{m_2^2} - 3$, where $m_k = \\tfrac1n\\sum(x_i - \\bar x)^k$. Both are 0 for a normal distribution. **Standardising** and **min-max scaling** $\\dfrac{x - \\min}{\\max - \\min}$ are linear, so they leave $g_1$ and $g_2$ unchanged.",
      body: "Only a nonlinear transformation changes shape. $\\log x$ and $\\sqrt x$ compress large values and reduce right skew; the **Box–Cox** family $\\dfrac{x^\\lambda - 1}{\\lambda}$ (with $\\log x$ at $\\lambda = 0$) picks the power from the data. A **Q-Q plot** of sorted data against normal quantiles is a straight line when the data are normal.",
    },
    {
      type: "predict",
      misconception: "scaling-changes-shape",
      item: {
        kind: "mc",
        id: "trf-predict-1",
        prompt: "Right-skewed incomes are converted to z-scores. The z-scores are",
        options: [
          { id: "a", text: "just as right-skewed", correct: true, why: "A linear change keeps the shape." },
          { id: "b", text: "approximately normal", misconception: "scaling-changes-shape", why: "z-scores have mean 0 and SD 1, but the same shape." },
          { id: "c", text: "symmetric about 0", why: "The long right tail is still there." },
        ],
      },
      reveal: {
        body: "A z-score is $(x - \\bar x)/s$: subtract one number, divide by another. That shifts and stretches the histogram without bending it, so the long right tail is still there, now measured in standard deviations. Only a nonlinear transformation such as a log can pull it in.",
      },
      resolve: {
        kind: "mc",
        id: "trf-resolve-1",
        prompt: "Which transformation can reduce right skew?",
        options: [
          { id: "a", text: "Taking logarithms", correct: true, why: "It compresses large values more than small ones." },
          { id: "b", text: "Converting to z-scores", misconception: "scaling-changes-shape", why: "Linear changes keep the shape." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "trf-check-1",
        prompt: "Two distributions have the same mean and SD. A has excess kurtosis 3; B has 0. Which produces extreme values more often?",
        options: [
          { id: "a", text: "A: positive excess kurtosis means heavier tails", correct: true, why: "The fourth power weights far-out values heavily." },
          { id: "b", text: "Neither: kurtosis measures how pointed the peak is", misconception: "kurtosis-is-peakedness", why: "It is driven by the tails." },
          { id: "c", text: "Neither, because the SDs are equal", why: "Equal SDs can hide very different tails." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "trf-check-2",
        prompt: "On a normal Q-Q plot, the points curve upwards above the line at the right end. The data have",
        options: [
          { id: "a", text: "a longer right tail than a normal distribution", correct: true, why: "The largest values are bigger than normal quantiles predict." },
          { id: "b", text: "a shorter right tail", why: "That would bend the points below the line." },
          { id: "c", text: "an exactly normal shape", why: "Normal data follow the line." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Standardising puts features on comparable scales for gradient descent and regularisation (§{regularization}) but leaves their shape alone. A skewed target such as price is often modelled as $\\log(\\text{price})$, which turns percentage errors into additive ones; predictions are mapped back with $e^x$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "trf-produce-1", prompt: "Min-max scale the value 30 when the minimum is 10 and the maximum is 60.", answer: 0.4, explain: "$(30 - 10)/50$." },
        {
          kind: "mc",
          id: "trf-produce-2",
          prompt: "Min-max scaling a skewed variable to $[0, 1]$ makes it",
          options: [
            { id: "a", text: "still skewed, only rescaled", correct: true, why: "It is a linear change." },
            { id: "b", text: "normally distributed", misconception: "scaling-changes-shape", why: "Scaling can't change shape." },
          ],
        },
        {
          kind: "mc",
          id: "trf-produce-3",
          prompt: "An excess kurtosis of 0 means",
          options: [
            { id: "a", text: "tails as heavy as a normal distribution's", correct: true, why: "The normal is the reference point." },
            { id: "b", text: "a flat-topped peak", misconception: "kurtosis-is-peakedness", why: "Kurtosis is about tails; the uniform, with negative kurtosis, is flat-topped." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "trf-review-1", prompt: "Apply Box–Cox with $\\lambda = 0.5$ to $x = 9$.", answer: 4, explain: "$(\\sqrt9 - 1)/0.5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "other skewness measures",
      body: "**Pearson's coefficients**: $\\dfrac{\\bar x - \\text{mode}}{s}$ and $\\dfrac{3(\\bar x - \\text{median})}{s}$. **Bowley's (quartile) skewness**: $\\dfrac{Q_3 + Q_1 - 2Q_2}{Q_3 - Q_1}$, which lies between $-1$ and 1 and ignores the extreme tails.",
    },
    {
      type: "definition",
      term: "rank and robust transformations",
      body: "A **rank transformation** replaces each value by its position in sorted order. **Winsorizing** caps values beyond chosen percentiles. **Yeo–Johnson** extends Box–Cox to zero and negative values; $\\log(x + 1)$ is a simple version for counts.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "linear changes preserve shape",
      statement: "If $y = ax + b$ with $a > 0$, then $g_1(y) = g_1(x)$ and $g_2(y) = g_2(x)$. With $a < 0$ skewness changes sign and kurtosis stays the same.",
      proof: ["Every deviation is multiplied by $a$, so $m_k(y) = a^km_k(x)$. In $m_3/m_2^{3/2}$ the factor is $a^3/|a|^3 = \\pm1$; in $m_4/m_2^2$ it is $a^4/a^4 = 1$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "logs turn ratios into differences",
      statement: "$\\log(xy) = \\log x + \\log y$, so equal ratios become equal gaps, a multiplicative process becomes additive, and the geometric mean becomes the arithmetic mean of the logs. If $\\log X$ is normal, $X$ is **lognormal** and right-skewed.",
      proof: ["Values 10, 100, 1000 differ by factors of 10; their base-10 logs 1, 2, 3 differ by 1."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "reference shapes",
      statement: "Normal: skewness 0, excess kurtosis 0. Uniform: 0 and $-1.2$. Exponential: 2 and 6. A Q-Q plot whose points form an S, below the line on the left and above it on the right, shows heavier tails than normal.",
      proof: ["These follow from the moments of each density (§{uniform-exponential}); the heavier the tails, the more the fourth moment grows relative to the squared variance."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A feature ranges from 5 to 45 with mean 20 and SD 8. Give the min-max scaled value and the z-score of 30.",
      solution: ["Min-max: $(30 - 5)/40 = 0.625$.", "z-score: $(30 - 20)/8 = 1.25$."],
      result: "0.625 and 1.25.",
    },
    {
      type: "example",
      level: 2,
      title: "Pearson and Bowley",
      problem: "Mean 60, median 55, SD 15; quartiles 20, 25, 40 for another data set. Find Pearson's second coefficient for the first and Bowley's for the second.",
      solution: ["Pearson: $3(60 - 55)/15 = 1$: right-skewed.", "Bowley: $(40 + 20 - 50)/(40 - 20) = 0.5$: right-skewed."],
      result: "1 and 0.5.",
    },
    {
      type: "example",
      level: 3,
      title: "moment skewness",
      problem: "Find the moment coefficient of skewness of 1, 2, 3, 10.",
      solution: [
        "Mean 4; deviations $-3, -2, -1, 6$.",
        "$m_2 = (9 + 4 + 1 + 36)/4 = 12.5$ and $m_3 = (-27 - 8 - 1 + 216)/4 = 45$.",
        "$g_1 = 45/12.5^{1.5} \\approx 45/44.19 \\approx 1.02$.",
      ],
      result: "About 1.02: strong right skew.",
    },
  ],
  pitfalls: [
    { wrong: "Standardising makes data normal.", right: "It only changes location and scale. Shape needs a nonlinear transformation." },
    { wrong: "Kurtosis measures how pointed the peak is.", right: "It is dominated by the tails: how often extreme values occur." },
    { wrong: "Take $\\log x$ of data with zeros.", right: "$\\log 0$ is undefined: use $\\log(x + 1)$ or Yeo–Johnson, and interpret results on the original scale." },
  ],
  formulas: [
    { label: "Skewness", tex: "g_1 = m_3/m_2^{3/2}" },
    { label: "Excess kurtosis", tex: "g_2 = m_4/m_2^2 - 3" },
    { label: "Min-max", tex: "\\dfrac{x - \\min}{\\max - \\min}" },
    { label: "Box–Cox", tex: "\\dfrac{x^\\lambda - 1}{\\lambda}\\ (\\lambda \\neq 0),\\quad \\log x\\ (\\lambda = 0)" },
    { label: "Bowley", tex: "\\dfrac{Q_3 + Q_1 - 2Q_2}{Q_3 - Q_1}" },
  ],
  exercises: [
    ex(1, num("trfx-ex-1", "Min-max scale 25 when the minimum is 5 and the maximum is 45.", 0.5, "$20/40$."), ["$(25 - 5)/40 = 0.5$."]),
    ex(1, num("trfx-ex-2", "Find $\\log_{10}1000 - \\log_{10}10$.", 2, "$3 - 1$."), ["A factor of 100 becomes a gap of 2."]),
    ex(2, num("trfx-ex-3", "Mean 50, median 47, SD 9. Find Pearson's coefficient $3(\\bar x - \\text{median})/s$.", 1, "$9/9$."), ["$3 \\times 3/9 = 1$."]),
    ex(2, fr("trfx-ex-4", "Quartiles are 10, 14 and 22. Find Bowley's skewness.", 1 / 3, "$(22 + 10 - 28)/12$."), ["$4/12 = \\tfrac13$."]),
    ex(2, num("trfx-ex-5", "What is the excess kurtosis of a normal distribution?", 0, "The reference."), ["0, by construction of \"excess\"."]),
    ex(2, num("trfx-ex-6", "Apply Box–Cox with $\\lambda = 2$ to $x = 3$.", 4, "$(9 - 1)/2$."), ["$4$."]),
    ex(3, dp("trfx-ex-7", "Find the moment coefficient of skewness of 1, 2, 3, 10.", 45 / 12.5 ** 1.5, "$m_3/m_2^{3/2}$."), ["$m_2 = 12.5$, $m_3 = 45$: $45/44.19 \\approx 1.018$."]),
    ex(3, num("trfx-ex-8", "$x$ has skewness 0.8. Find the skewness of $y = -2x + 5$.", -0.8, "A negative scale flips the sign."), ["$a = -2 < 0$: skewness becomes $-0.8$."]),
    ex(3, num("trfx-ex-9", "Use logarithms to find the geometric mean of 10, 100 and 1000.", 100, "Average the logs."), ["Logs 1, 2, 3 average 2, and $10^2 = 100$."]),
    ex(3, mc("trfx-ex-10", "A normal Q-Q plot is S-shaped: points below the line on the left, above it on the right. The data have", ["heavier tails than normal", "Both extremes are further out than normal quantiles."], [["lighter tails than normal", "That gives the opposite S."], ["right skew only", "Skew bends one end, not both in opposite directions."]]), ["Both ends stretch beyond the normal line: positive excess kurtosis."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const lo = r.int(0, 10) * (lv === 1 ? 10 : 5);
      const hi = lo + r.int(2, 10) * 10;
      const x = r.int(lo, hi);
      const v = (x - lo) / (hi - lo);
      return n(`Min-max scale ${x} when the minimum is ${lo} and the maximum is ${hi} (3 decimals).`, Math.round(v * 1000) / 1000, `$(${x} - ${lo})/${hi - lo} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const s = r.pick([4, 5, 6, 8, 10, 12]);
      const md = r.int(30, 70);
      const mean = md + r.pick([-3, -2, -1, 1, 2, 3, 4]) * (lv === 1 ? 2 : 1);
      const k = (3 * (mean - md)) / s;
      return n(`Mean ${mean}, median ${md}, SD ${s}. Find Pearson's skewness coefficient $3(\\bar x - \\text{median})/s$ (2 decimals).`, r2(k), `$3(${mean} - ${md})/${s} \\approx ${r2(k)}$: ${k > 0 ? "right" : "left"}-skewed.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const t = r.pick([
        { name: "converting to z-scores", keeps: true },
        { name: "min-max scaling to [0, 1]", keeps: true },
        { name: "converting from kilograms to pounds", keeps: true },
        { name: "taking the logarithm of each value", keeps: false },
        { name: "taking the square root of each value", keeps: false },
      ]);
      return mcNumbers(
        `A variable is strongly right-skewed. What does ${t.name} do to its skewness?`,
        { text: t.keeps ? "Leaves it unchanged" : "Reduces it", why: t.keeps ? "A linear change shifts and stretches without changing shape." : "It compresses large values more than small ones." },
        [
          { text: t.keeps ? "Removes it, giving a normal shape" : "Leaves it unchanged", why: t.keeps ? "Linear changes can't change shape." : "This is nonlinear: large values are pulled in.", ...(t.keeps ? { misconception: "scaling-changes-shape" } : {}) },
          { text: "Makes it left-skewed", why: t.keeps ? "Only a negative scale factor flips the skew." : "It reduces right skew; it rarely overshoots that far." },
        ],
      );
    },
  },
];
