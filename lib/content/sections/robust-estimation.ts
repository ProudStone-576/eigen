import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Robust statistics: breakdown point, influence functions, M-, L- and R-estimators, Huber loss, efficiency, robust regression. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const huber = (res: number, d: number) => (Math.abs(res) <= d ? 0.5 * res * res : d * (Math.abs(res) - d / 2));
const hodgesLehmann = (xs: number[]) => {
  const w: number[] = [];
  xs.forEach((a, i) => xs.slice(i).forEach((b) => w.push((a + b) / 2)));
  w.sort((p, q) => p - q);
  return w.length % 2 ? w[(w.length - 1) / 2] : (w[w.length / 2 - 1] + w[w.length / 2]) / 2;
};

const base: ConceptNode = {
  id: "robust-estimation",
  title: "Robust estimation",
  summary: "A robust estimator is not thrown far off by a few bad values. Its breakdown point is the share of the data that can be corrupted before it can be made arbitrarily wrong: 0 for the mean, 50% for the median. M-estimators such as Huber's behave like the mean near the centre and like the median in the tails, giving robustness at little cost in efficiency.",
  deps: ["spread-measures", "regression-diagnostics", "mle"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "breakdown point", meaning: "The smallest fraction of contaminated data that can push an estimate to any value." },
    { term: "influence function", meaning: "How much one extra observation at $x$ shifts the estimate; bounded for robust estimators." },
    { term: "M-estimator", meaning: "An estimate minimising $\\sum\\rho(x_i - \\theta)$ for a chosen loss $\\rho$: squared loss gives the mean, absolute loss the median." },
  ],
  misconceptions: {
    "mean-breakdown": "Thinks a large sample protects the mean from a single gross outlier.",
    "huber-is-square": "Thinks Huber loss treats large residuals like squared error, rather than growing only linearly beyond a threshold.",
  },
  steps: [
    {
      type: "motivate",
      title: "One typo",
      body: "A data-entry clerk types 1,700,000 instead of 17,000 for one salary out of 10,000. The mean salary jumps by about ₹168: one value in ten thousand moves it by any amount you like. The median doesn't notice. Robust statistics makes this resistance precise and finds estimators that keep most of the mean's precision while gaining the median's resistance.",
      realWorld: {
        title: "Sensor fusion",
        body: "Self-driving cars fit models to lidar points that include reflections and spurious returns. Robust losses and methods like RANSAC let a few wild points be ignored instead of bending the whole fit.",
      },
    },
    {
      type: "truth",
      statement: "The **breakdown point** of the mean is $1/n \\to 0$; of the median, 50%; of the $\\alpha$-trimmed mean, $\\alpha$. An **M-estimator** minimises $\\sum\\rho(x_i - \\theta)$. **Huber's loss** is $\\rho(r) = \\tfrac12r^2$ for $|r| \\le \\delta$ and $\\delta(|r| - \\tfrac12\\delta)$ beyond: quadratic near 0, linear in the tails. **L-estimators** are weighted averages of the sorted data (trimmed means); **R-estimators** come from rank tests (the Hodges–Lehmann estimate).",
      body: "Robustness costs some efficiency on clean normal data: the median has only $2/\\pi \\approx 64\\%$ of the mean's efficiency, while Huber's estimator with $\\delta \\approx 1.345\\sigma$ keeps about 95%. With heavy-tailed data the robust estimators are usually *more* efficient. The same losses give **robust regression** (§{regression-diagnostics}).",
    },
    {
      type: "predict",
      misconception: "mean-breakdown",
      item: {
        kind: "mc",
        id: "rob-predict-1",
        prompt: "In 10,000 salaries one is mistyped as 100 times its true value. Because the sample is large, the mean is",
        options: [
          { id: "a", text: "still badly affected: one wrong value can move the mean arbitrarily far", correct: true, why: "The mean's breakdown point is $1/n$." },
          { id: "b", text: "essentially unaffected, since one value is only 0.01% of the data", misconception: "mean-breakdown", why: "Its effect is proportional to how wrong it is, which is unbounded." },
          { id: "c", text: "exactly halved", why: "The shift depends on the size of the error." },
        ],
      },
      reveal: {
        body: "A wrong value $x$ shifts the mean by $(x - x_{\\text{true}})/n$. That shrinks with $n$, but grows without limit as the error grows: a value off by a billion moves the mean by 100,000 even in 10,000 records. The median moves by at most one position, whatever the error. Large samples protect against random noise, not against gross errors.",
      },
      resolve: {
        kind: "mc",
        id: "rob-resolve-1",
        prompt: "What is the mean's breakdown point?",
        options: [
          { id: "a", text: "Essentially 0: one bad value can drive it anywhere", correct: true, why: "$1/n$." },
          { id: "b", text: "High, as long as $n$ is large", misconception: "mean-breakdown", why: "Size doesn't bound the effect of a gross error." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rob-check-1",
        prompt: "With threshold $\\delta = 1$, Huber's loss for a residual of 10 is",
        options: [
          { id: "a", text: "9.5, growing only linearly", correct: true, why: "$\\delta(|r| - \\delta/2) = 10 - 0.5$." },
          { id: "b", text: "50, as for squared error", misconception: "huber-is-square", why: "Beyond $\\delta$, Huber loss is linear." },
          { id: "c", text: "1, capped at the threshold", why: "It keeps growing, just linearly." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rob-check-2",
        prompt: "What is the breakdown point of a 10% trimmed mean?",
        options: [
          { id: "a", text: "10%", correct: true, why: "It survives until more than 10% of the values at one end are corrupted." },
          { id: "b", text: "50%", why: "That is the median's." },
          { id: "c", text: "0", why: "That is the mean's." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Huber loss (scikit-learn's HuberRegressor, and the \"smooth L1\" loss in object detectors) trains regression models that aren't wrecked by mislabelled targets. Gradient clipping does the same for training: it caps the influence any single batch can have on the weights.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rob-produce-1", prompt: "Huber loss with $\\delta = 1$: find $\\rho(0.5)$.", answer: 0.125, explain: "$\\tfrac12(0.5)^2$." },
        { kind: "number", id: "rob-produce-2", prompt: "Huber loss with $\\delta = 1$: find $\\rho(3)$.", answer: 2.5, explain: "$1 \\times (3 - 0.5)$." },
        {
          kind: "mc",
          id: "rob-produce-3",
          prompt: "Beyond its threshold, Huber's loss grows",
          options: [
            { id: "a", text: "linearly in the residual", correct: true, why: "So each outlier's pull on the fit is capped." },
            { id: "b", text: "quadratically, like squared error", misconception: "huber-is-square", why: "That is only near 0." },
          ],
        },
        {
          kind: "mc",
          id: "rob-produce-4",
          prompt: "Doubling the sample size makes the mean robust to one gross error.",
          options: [
            { id: "a", text: "False: the error's effect is halved but still unbounded", correct: true, why: "Breakdown point $1/n$." },
            { id: "b", text: "True: big samples dilute any single value", misconception: "mean-breakdown", why: "A big enough error still dominates." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rob-review-1", prompt: "Give the breakdown point of the median, as a fraction.", answer: 0.5, explain: "Half the data must be corrupted to move it arbitrarily." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "influence function and gross-error sensitivity",
      body: "The **influence function** $\\text{IF}(x)$ measures the effect on an estimate of adding a small amount of contamination at $x$. For the mean, $\\text{IF}(x) = x - \\mu$, unbounded; for the median it is bounded, $\\pm\\tfrac{1}{2f(m)}$. The largest absolute value of the IF is the **gross-error sensitivity**: robust estimators keep it finite.",
    },
    {
      type: "definition",
      term: "Hodges–Lehmann, robust regression",
      body: "The **Hodges–Lehmann** estimate of location is the median of the Walsh averages $\\tfrac12(x_i + x_j)$ over all $i \\le j$: an R-estimator with breakdown about 29% and 95% efficiency for normal data. **Robust regression** methods include Huber regression, least absolute deviations (median regression), the Theil–Sen slope (the median of all pairwise slopes) and RANSAC.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the losses behind the mean and median",
      statement: "Minimising $\\sum(x_i - \\theta)^2$ gives the mean; minimising $\\sum|x_i - \\theta|$ gives the median. Huber's loss gives an estimate solving $\\sum\\psi(x_i - \\theta) = 0$ with $\\psi(r) = \\max(-\\delta, \\min(\\delta, r))$: residuals beyond $\\pm\\delta$ count only as $\\pm\\delta$.",
      proof: ["Set the derivative of the total loss to zero: for squared loss $\\sum(x_i - \\theta) = 0$; for absolute loss the signs balance (§{spread-measures}); for Huber the derivative is the clipped residual $\\psi$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "efficiency at the normal",
      statement: "Relative to the mean on normal data: median 64%, 10% trimmed mean about 94%, Huber ($\\delta = 1.345\\sigma$) 95%, Hodges–Lehmann 95%. Under heavy tails the order usually reverses in favour of the robust estimators.",
      proof: ["These are asymptotic variance ratios; for the median, $\\operatorname{Var} \\approx \\tfrac{1}{4nf(m)^2} = \\tfrac{\\pi\\sigma^2}{2n}$ at the normal, against $\\sigma^2/n$ for the mean."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Data 4, 5, 5, 6, 6, 7, 95. Compare the mean, median and the 1-from-each-end trimmed mean.",
      solution: ["Mean $128/7 \\approx 18.3$; median 6.", "Trimmed (drop 4 and 95): $\\tfrac{5 + 5 + 6 + 6 + 7}{5} = 5.8$."],
      result: "18.3, 6 and 5.8.",
    },
    {
      type: "example",
      level: 2,
      title: "Hodges–Lehmann",
      problem: "Find the Hodges–Lehmann estimate for 1, 2, 9.",
      solution: ["Walsh averages: 1, 1.5, 5 (from 1); 2, 5.5 (from 2); 9. Sorted: 1, 1.5, 2, 5, 5.5, 9.", "Median of the six: $(2 + 5)/2 = 3.5$, against a mean of 4 and a median of 2."],
      result: "3.5.",
    },
    {
      type: "example",
      level: 3,
      title: "Huber's estimate",
      problem: "Data 1, 2, 3, 20 with $\\delta = 2$. Find Huber's estimate of location.",
      solution: [
        "Guess that the first three residuals lie within $\\pm 2$ and the fourth is clipped to $+2$. Then $\\sum\\psi = 0$ reads $(1 - \\theta) + (2 - \\theta) + (3 - \\theta) + 2 = 0$.",
        "So $8 - 3\\theta = 0$ and $\\theta = 8/3 \\approx 2.67$. Check: the residuals $-1.67, -0.67, 0.33$ are within $\\pm 2$ and $17.33$ is clipped, so the guess holds.",
      ],
      result: "$8/3 \\approx 2.67$, near the median 2.5 and far from the mean 6.5.",
    },
  ],
  pitfalls: [
    { wrong: "Large samples protect the mean from gross errors.", right: "Its breakdown point is $1/n$; one bad value can still move it anywhere." },
    { wrong: "Robust estimators are much less efficient.", right: "Huber and Hodges–Lehmann keep about 95% efficiency on normal data." },
    { wrong: "Huber loss is squared error with a cap.", right: "It is squared near 0 and linear beyond $\\delta$; it never stops growing." },
  ],
  formulas: [
    { label: "Huber loss", tex: "\\rho(r) = \\begin{cases}\\tfrac12r^2 & |r| \\le \\delta\\\\ \\delta(|r| - \\tfrac12\\delta) & |r| > \\delta\\end{cases}" },
    { label: "Huber ψ", tex: "\\psi(r) = \\max(-\\delta, \\min(\\delta, r))" },
    { label: "Breakdown", tex: "\\text{mean } 0,\\ \\text{median } 50\\%,\\ \\alpha\\text{-trimmed } \\alpha" },
    { label: "Median efficiency", tex: "2/\\pi \\approx 0.64" },
  ],
  exercises: [
    ex(1, num("robx-ex-1", "Give the breakdown point of a 20% trimmed mean.", 0.2, "$\\alpha$."), ["$0.2$."]),
    ex(1, num("robx-ex-2", "Find the median of 3, 4, 5, 6, 500.", 5, "The middle value."), ["$5$, whatever the 500 is."]),
    ex(2, num("robx-ex-3", "One of 1,000 values is mistyped as 100,000 too large. By how much does the mean move?", 100, "$100{,}000/1000$."), ["$100$."]),
    ex(2, num("robx-ex-4", "Huber loss with $\\delta = 2$: find $\\rho(5)$.", 8, "$2(5 - 1)$."), ["$8$, against 12.5 for squared loss."]),
    ex(2, dp("robx-ex-5", "Find the Hodges–Lehmann estimate for 2, 3, 10.", hodgesLehmann([2, 3, 10]), "Median of the Walsh averages."), ["Walsh averages 2, 2.5, 6, 3, 6.5, 10; sorted, the median is $(3 + 6)/2 = 4.5$."]),
    ex(2, dp("robx-ex-6", "Find the efficiency of the median relative to the mean for normal data, $2/\\pi$.", 2 / Math.PI, "$2/\\pi$."), ["$\\approx 0.637$."]),
    ex(3, num("robx-ex-7", "With $\\delta = 1$, find the clipped residual $\\psi(r)$ for $r = -4$.", -1, "Clip to $[-\\delta, \\delta]$."), ["$-1$."]),
    ex(3, mc("robx-ex-8", "The Theil–Sen slope of a scatterplot is", ["the median of the slopes between all pairs of points", "Robust to outliers in $y$ and $x$."], [["the least-squares slope", "That is not robust."], ["the slope through the two extreme points", "That depends on just two points."]]), ["Its breakdown point is about 29%."]),
    ex(3, mc("robx-ex-9", "For data from a $t_3$ distribution (heavy tails), compared with the mean, Huber's estimator is usually", ["more efficient", "Heavy tails hurt the mean most."], [["much less efficient", "That is only true at the normal, and only slightly."], ["identical", "They differ when large residuals occur."]]), ["Robust estimators win when outliers are part of the distribution."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const d = r.pick([0.5, 1, 1.345, 2]);
      const res = r2(r.pick([-1, 1]) * r.pick([0.2, 0.4, 0.8, 1.5, 2.5, 3, 5, 8]) * (lv === 3 ? 1.5 : 1));
      const v = huber(res, d);
      return n(`Huber loss with $\\delta = ${d}$: find $\\rho(${res})$ (3 decimals).`, Math.round(v * 1000) / 1000, Math.abs(res) <= d ? `$|r| \\le \\delta$: $\\tfrac12(${res})^2 \\approx ${Math.round(v * 1000) / 1000}$.` : `$|r| > \\delta$: $${d}(${Math.abs(res)} - ${d / 2}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.pick([100, 500, 1000, 5000]);
      const err = r.pick([1000, 5000, 20000, 100000]) * lv;
      return n(`One of ${nn.toLocaleString("en-US")} values is mistyped as ${err.toLocaleString("en-US")} too large. By how much does the mean move?`, err / nn, `$${err}/${nn} = ${err / nn}$; the median moves by at most one position.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([1000, 10000, 100000]);
      return mcNumbers(
        `In ${nn.toLocaleString("en-US")} records, one value has a gross typing error. Which summary can it move arbitrarily far?`,
        { text: "The mean", why: "Breakdown point $1/n$: one value can move it anywhere." },
        [
          { text: "Neither, because the sample is large", why: "Size doesn't bound the effect of a gross error.", misconception: "mean-breakdown" },
          { text: "The median", why: "The median moves by at most one position." },
        ],
      );
    },
  },
];
