import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Stationarity, white noise, random walks, differencing, unit-root tests; the ACF, PACF and cross-correlation. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const acf1 = (ys: number[]) => {
  const m = ys.reduce((s, y) => s + y, 0) / ys.length;
  const d = ys.map((y) => y - m);
  const den = d.reduce((s, x) => s + x * x, 0);
  let num1 = 0;
  for (let i = 0; i + 1 < d.length; i++) num1 += d[i] * d[i + 1];
  return num1 / den;
};

const base: ConceptNode = {
  id: "stationarity-acf",
  title: "Stationarity & autocorrelation",
  summary: "A stationary series has the same mean, variance and correlation structure at every point in time, which is what makes its past a guide to its future. The autocorrelation function (ACF) measures how a series correlates with its own past at each lag; the partial autocorrelation (PACF) strips out the shorter lags. Trends and random walks are not stationary, but differencing often makes them so.",
  deps: ["ts-components", "covariance", "correlation-causation"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "stationary", meaning: "(Weakly) constant mean and variance, with the covariance between $y_t$ and $y_{t+k}$ depending only on the lag $k$." },
    { term: "white noise", meaning: "Uncorrelated values with mean 0 and constant variance: no pattern left to model." },
    { term: "lag", meaning: "The time gap $k$ between two observations being compared." },
  ],
  misconceptions: {
    "random-walk-stationary": "Thinks a random walk is stationary because each of its steps is stationary noise.",
    "white-noise-exact": "Expects every sample autocorrelation of white noise to be exactly zero, so treats any spike beyond the bounds as real structure.",
  },
  steps: [
    {
      type: "motivate",
      title: "Does today predict tomorrow?",
      body: "If it was hot yesterday, it is probably hot today: daily temperatures are correlated with their own recent past. Measuring that correlation at lag 1, lag 2, lag 7 and so on reveals how much memory a series has and what kind of model can capture it. But the measurement only makes sense if the correlation structure isn't itself changing over time.",
      realWorld: {
        title: "Share prices",
        body: "A share price wanders like a random walk: its level is not stationary and today's price is the best simple guess for tomorrow's. Its daily returns, the differences, are close to white noise, which is why returns are what analysts model.",
      },
    },
    {
      type: "truth",
      statement: "A series is **(weakly) stationary** if $E[y_t] = \\mu$, $\\operatorname{Var}(y_t) = \\sigma^2$ and $\\operatorname{Cov}(y_t, y_{t+k}) = \\gamma_k$ for all $t$. Its **autocorrelation** at lag $k$ is $\\rho_k = \\gamma_k/\\gamma_0$, estimated by $r_k = \\dfrac{\\sum_t(y_t - \\bar y)(y_{t+k} - \\bar y)}{\\sum_t(y_t - \\bar y)^2}$. For white noise, each $r_k$ is approximately $N(0, 1/n)$, so about 95% fall within $\\pm 1.96/\\sqrt n$.",
      body: "A **random walk** $y_t = y_{t-1} + \\varepsilon_t$ has $\\operatorname{Var}(y_t) = t\\sigma^2$, growing without bound: not stationary, and its ACF decays very slowly. **Differencing**, $\\nabla y_t = y_t - y_{t-1}$, turns it into white noise, and removes a linear trend; seasonal differencing $y_t - y_{t-m}$ removes a stable season. Unit-root tests (augmented Dickey–Fuller, null: non-stationary; KPSS, null: stationary) help decide whether to difference. The **partial autocorrelation** at lag $k$ is the correlation between $y_t$ and $y_{t-k}$ after removing the effect of the lags in between.",
    },
    {
      type: "predict",
      misconception: "random-walk-stationary",
      item: {
        kind: "mc",
        id: "sta-predict-1",
        prompt: "A random walk starts at 0 and adds an independent $N(0, 1)$ step each day. After 100 days, the variance of its position is",
        options: [
          { id: "a", text: "100, and still growing: the walk is not stationary", correct: true, why: "Variances of independent steps add up." },
          { id: "b", text: "1, the same as each step: the walk is stationary", misconception: "random-walk-stationary", why: "The position is the sum of all the steps." },
          { id: "c", text: "0, because the steps average out", why: "Sums of independent steps spread out." },
        ],
      },
      reveal: {
        body: "$y_{100} = \\varepsilon_1 + \\dots + \\varepsilon_{100}$, so $\\operatorname{Var}(y_{100}) = 100$; after 400 days it is 400. A stationary series would have the same variance at every time. The steps $\\nabla y_t = \\varepsilon_t$ are stationary, which is exactly why we difference a random walk before modelling it.",
      },
      resolve: {
        kind: "mc",
        id: "sta-resolve-1",
        prompt: "A random walk's level is",
        options: [
          { id: "a", text: "non-stationary, though its differences are stationary", correct: true, why: "Its variance grows with time." },
          { id: "b", text: "stationary, since its steps are", misconception: "random-walk-stationary", why: "Summing stationary steps gives growing variance." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sta-check-1",
        prompt: "Residuals from a model look like white noise, but 1 of 20 sample autocorrelations falls just outside $\\pm 1.96/\\sqrt n$. This is",
        options: [
          { id: "a", text: "about what chance alone gives: 5% of 20 is 1", correct: true, why: "The bounds are 95% limits for each lag." },
          { id: "b", text: "proof that structure remains, since white noise has zero autocorrelation", misconception: "white-noise-exact", why: "Sample autocorrelations of white noise vary around 0." },
          { id: "c", text: "a sign the model is perfect", why: "It is just consistent with white noise." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sta-check-2",
        prompt: "For $n = 100$ observations of white noise, the approximate 95% bounds for a sample autocorrelation are",
        options: [
          { id: "a", text: "$\\pm 0.196$", correct: true, why: "$1.96/\\sqrt{100}$." },
          { id: "b", text: "$\\pm 1.96$", why: "Divide by $\\sqrt n$." },
          { id: "c", text: "$\\pm 0.0196$", why: "Divide by $\\sqrt n = 10$, not $n$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Models trained on one period and used on another assume something stays stable, and non-stationarity is a common reason forecasts fail. Differencing, detrending or predicting returns rather than levels are standard preprocessing; ACF plots of a model's residuals check whether any time structure was left unlearned.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "sta-produce-1", prompt: "Difference the series 3, 5, 8, 12. Give the last difference.", answer: 4, explain: "Differences 2, 3, 4." },
        { kind: "number", id: "sta-produce-2", prompt: "Find the lag-1 sample autocorrelation of 1, 2, 3, 4, 5.", answer: 0.4, explain: "$\\tfrac{(-2)(-1) + (-1)(0) + 0(1) + 1(2)}{10}$." },
        {
          kind: "mc",
          id: "sta-produce-3",
          prompt: "A random walk's variance after $t$ steps of variance $\\sigma^2$ is",
          options: [
            { id: "a", text: "$t\\sigma^2$, so the walk is not stationary", correct: true, why: "Independent steps' variances add." },
            { id: "b", text: "$\\sigma^2$, so the walk is stationary", misconception: "random-walk-stationary", why: "That is each step's variance, not the position's." },
          ],
        },
        {
          kind: "mc",
          id: "sta-produce-4",
          prompt: "An ACF plot of 40 lags of genuine white noise will typically show",
          options: [
            { id: "a", text: "about 2 lags just outside the 95% bounds", correct: true, why: "5% of 40 is 2." },
            { id: "b", text: "every lag exactly at 0", misconception: "white-noise-exact", why: "Sample autocorrelations vary by chance." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "sta-review-1", prompt: "For $n = 400$, find the approximate 95% bound for a white-noise sample autocorrelation.", answer: 0.098, explain: "$1.96/20$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "PACF",
      body: "The **partial autocorrelation** $\\phi_{kk}$ is the last coefficient when $y_t$ is regressed on $y_{t-1}, \\dots, y_{t-k}$. For an AR($p$) process it is 0 beyond lag $p$; for lag 1 it equals $\\rho_1$. ACF and PACF patterns together identify models (§{arima}).",
    },
    {
      type: "definition",
      term: "cross-correlation",
      body: "For two series, the **cross-correlation** at lag $k$ is $\\operatorname{Corr}(x_t, y_{t+k})$. A peak at $k = 3$ means $x$ tends to lead $y$ by 3 periods: a possible leading indicator. Two trending series show large cross-correlations at every lag, so remove trends (or **prewhiten**, filtering $x$ to white noise and $y$ the same way) before reading them.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "ACF of an AR(1)",
      statement: "For the stationary $y_t = \\phi y_{t-1} + \\varepsilon_t$ with $|\\phi| < 1$, $\\rho_k = \\phi^k$: autocorrelations decay geometrically.",
      proof: ["Multiply by $y_{t-k}$ and take expectations: $\\gamma_k = \\phi\\gamma_{k-1}$ for $k \\ge 1$, since $\\varepsilon_t$ is uncorrelated with the past. So $\\gamma_k = \\phi^k\\gamma_0$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "differencing removes a linear trend",
      statement: "If $y_t = a + bt + e_t$ with stationary $e_t$, then $\\nabla y_t = b + e_t - e_{t-1}$ is stationary with mean $b$.",
      proof: ["$(a + bt) - (a + b(t - 1)) = b$, and a difference of a stationary series is stationary."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "the Ljung–Box test",
      statement: "To test whether the first $h$ autocorrelations are jointly zero, use $Q = n(n + 2)\\sum_{k=1}^{h}\\dfrac{r_k^2}{n - k}$, approximately $\\chi^2_h$ for white noise (fewer degrees of freedom for residuals of a fitted model).",
      proof: ["Each $\\sqrt n\\,r_k$ is approximately standard normal and they are approximately independent, so their squares sum to roughly $\\chi^2_h$ (§{sampling-distributions}); the factors $(n + 2)/(n - k)$ improve the approximation."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the lag-1 sample autocorrelation of 1, 2, 3, 4, 5.",
      solution: ["Mean 3; deviations $-2, -1, 0, 1, 2$; $\\sum d^2 = 10$.", "Lag-1 products: $2 + 0 + 0 + 2 = 4$, so $r_1 = 0.4$."],
      result: "$r_1 = 0.4$.",
    },
    {
      type: "example",
      level: 2,
      title: "AR(1) autocorrelations",
      problem: "An AR(1) has $\\phi = 0.8$. Find $\\rho_1$, $\\rho_2$ and the PACF at lag 2.",
      solution: ["$\\rho_1 = 0.8$, $\\rho_2 = 0.64$.", "PACF at lag 2 is 0: once $y_{t-1}$ is known, $y_{t-2}$ adds nothing."],
      result: "0.8, 0.64, 0.",
    },
    {
      type: "example",
      level: 3,
      title: "first and seasonal differences",
      problem: "Quarterly data 10, 14, 12, 16, 13, 17, 15, 19. Apply a seasonal difference of lag 4.",
      solution: ["$13 - 10, 17 - 14, 15 - 12, 19 - 16$.", "$= 3, 3, 3, 3$: the seasonal pattern is gone, leaving a steady yearly rise of 3."],
      result: "3, 3, 3, 3.",
    },
  ],
  pitfalls: [
    { wrong: "A random walk is stationary because its steps are.", right: "Its variance grows with time; difference it." },
    { wrong: "Any spike beyond the ACF bounds is real structure.", right: "About 1 in 20 lags crosses by chance; use Ljung–Box for a joint test." },
    { wrong: "Two trending series with high cross-correlation are linked.", right: "Detrend or prewhiten first." },
  ],
  formulas: [
    { label: "Sample ACF", tex: "r_k = \\dfrac{\\sum_t(y_t - \\bar y)(y_{t+k} - \\bar y)}{\\sum_t(y_t - \\bar y)^2}" },
    { label: "White-noise bounds", tex: "\\pm 1.96/\\sqrt n" },
    { label: "AR(1) ACF", tex: "\\rho_k = \\phi^k" },
    { label: "Ljung–Box", tex: "Q = n(n + 2)\\textstyle\\sum_{k=1}^h r_k^2/(n - k)" },
  ],
  exercises: [
    ex(1, num("stax-ex-1", "Difference the series 7, 10, 9, 14. Find the sum of the differences.", 7, "Differences 3, −1, 5."), ["$3 - 1 + 5 = 7$, which is also last minus first."]),
    ex(1, num("stax-ex-2", "An AR(1) has $\\phi = 0.5$. Find $\\rho_3$.", 0.125, "$0.5^3$."), ["$0.125$."]),
    ex(2, dp("stax-ex-3", "Find the lag-1 sample autocorrelation of 2, 4, 3, 5, 6.", acf1([2, 4, 3, 5, 6]), "Mean 4."), ["Deviations $-2, 0, -1, 1, 2$; $\\sum d^2 = 10$; products $0 + 0 - 1 + 2 = 1$; $r_1 = 0.1$."]),
    ex(2, num("stax-ex-4", "A random walk has steps of variance 4. Find the variance of its position after 25 steps from a fixed start.", 100, "$25 \\times 4$."), ["$100$."]),
    ex(2, dp("stax-ex-5", "Find the 95% bound for white-noise autocorrelations with $n = 150$.", 1.96 / Math.sqrt(150), "$1.96/\\sqrt n$."), ["$\\approx 0.160$."]),
    ex(3, mc("stax-ex-6", "An ACF decays very slowly from about 0.98 at lag 1. The series most likely", ["is non-stationary and needs differencing", "Slow decay is the signature of a trend or random walk."], [["is white noise", "White noise has near-zero ACF."], ["is an MA(1)", "An MA(1) ACF cuts off after lag 1."]]), ["Difference, then look at the ACF again."]),
    ex(3, mc("stax-ex-7", "An augmented Dickey–Fuller test gives p = 0.62. This means", ["no evidence against a unit root: consider differencing", "ADF's null is non-stationarity."], [["the series is stationary", "Failing to reject the unit-root null doesn't show stationarity."], ["the series is white noise", "The test is about a unit root."]]), ["KPSS reverses the null and can be used alongside."]),
    ex(3, mc("stax-ex-8", "The cross-correlation of advertising $x$ and sales $y$, $\\operatorname{Corr}(x_t, y_{t+k})$, peaks at $k = 2$ weeks after prewhitening. This suggests", ["advertising leads sales by about 2 weeks", "Changes in $x$ show up in $y$ two weeks later."], [["sales lead advertising", "A positive $k$ means $x$ comes first."], ["advertising causes sales", "A lead is suggestive, not proof of causation."]]), ["Granger causality (§{advanced-time-series}) turns this into a formal test of predictive lead."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const ys = Array.from({ length: 5 }, () => r.int(1, 9));
      if (new Set(ys).size === 1) ys[0] += 2;
      const v = acf1(ys);
      return n(`Find the lag-1 sample autocorrelation of ${ys.join(", ")} (3 decimals).`, Math.round(v * 1000) / 1000, `Deviations from the mean ${r2(ys.reduce((s, y) => s + y, 0) / 5)}; lag-1 cross-products over the sum of squares $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const phi = r.pick([0.3, 0.5, 0.6, 0.7, 0.8, 0.9, -0.5, -0.6]);
      const k = lv + 1;
      const v = phi ** k;
      return n(`A stationary AR(1) has $\\phi = ${phi}$. Find its lag-${k} autocorrelation (3 decimals).`, Math.round(v * 1000) / 1000, `$\\rho_k = \\phi^k = (${phi})^${k} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s2 = r.pick([1, 2, 4, 9]);
      const t = r.pick([10, 25, 50, 100]);
      return n(`A random walk starts at a fixed value and takes independent steps of variance ${s2}. Find the variance of its position after ${t} steps.`, s2 * t, `$${t} \\times ${s2} = ${s2 * t}$: it grows with time, so the walk is not stationary.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const lags = r.pick([20, 40, 60]);
      return mcNumbers(
        `Residuals that are genuinely white noise are checked at ${lags} lags against $\\pm 1.96/\\sqrt n$. Roughly how many lags cross the bounds by chance?`,
        { text: `about ${lags / 20}`, why: "Each lag has a 5% chance of crossing." },
        [
          { text: "none: white noise has zero autocorrelation", why: "Sample autocorrelations vary around 0.", misconception: "white-noise-exact" },
          { text: `about ${lags / 2}`, why: "That would be 50%, not 5%." },
        ],
      );
    },
  },
];
