import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Forecast intervals, benchmark methods, error metrics and time-series cross-validation; state-space models and the Kalman filter; change points and interrupted time series. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "forecasting",
  title: "Forecasting & evaluation",
  summary: "A forecast is a distribution, not a number: intervals widen the further ahead you look. Judge forecasters on data they haven't seen, rolling the forecast origin forward through time, against simple benchmarks, with metrics such as MAE, RMSE and MASE. State-space models and the Kalman filter track a hidden state from noisy measurements; change-point and interrupted time-series methods detect and measure breaks.",
  deps: ["arima", "exponential-smoothing", "cross-validation"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "forecast horizon", meaning: "How many steps ahead, $h$, a forecast is made." },
    { term: "naive forecast", meaning: "Tomorrow equals today: $\\hat y_{t+h} = y_t$; the seasonal naive uses the value one season earlier." },
    { term: "Kalman filter", meaning: "A recursive method that updates the estimate of a hidden state by blending a prediction with each new measurement." },
  ],
  misconceptions: {
    "random-split-ts": "Evaluates a time-series model with randomly shuffled train/test splits, letting the model train on the future.",
    "interval-constant-width": "Expects forecast intervals to be the same width at every horizon.",
  },
  steps: [
    {
      type: "motivate",
      title: "How sure, how far ahead?",
      body: "\"Demand next week: 1,200 units\" is less useful than \"1,200, and 95% likely between 1,050 and 1,350\". And next week is easier than next year. Good forecasting reports the uncertainty, grows it with the horizon, and proves itself on data the model never saw, compared with the simplest possible alternative.",
      realWorld: {
        title: "Weather forecasts",
        body: "Weather services issue probability forecasts and track their skill against climatology and persistence (\"tomorrow like today\"). Their accuracy has improved by roughly one day per decade: a five-day forecast now is as good as a four-day one was ten years earlier.",
      },
    },
    {
      type: "truth",
      statement: "An approximate 95% **forecast interval** is $\\hat y_{t+h} \\pm 1.96\\,\\hat\\sigma_h$, where $\\hat\\sigma_h$ grows with the horizon $h$: for a random walk, $\\sigma_h = \\sigma\\sqrt h$; for a stationary AR, $\\sigma_h$ rises towards the series' standard deviation. Evaluate forecasts by **time-series cross-validation**: train on data up to time $t$, forecast $t + h$, roll $t$ forward, and average the errors.",
      body: "Metrics: **MAE** $= \\text{mean}|e|$; **RMSE** $= \\sqrt{\\text{mean}\\,e^2}$, which punishes big errors more; **MAPE** $= \\text{mean}|e/y| \\times 100\\%$, undefined when $y = 0$ and biased against over-forecasts; **MASE** divides MAE by the in-sample MAE of the naive (or seasonal naive) forecast, so MASE below 1 beats the benchmark. Always compare with the naive, seasonal naive, mean and drift benchmarks. Random splits leak the future into training (§{cross-validation}).",
    },
    {
      type: "predict",
      misconception: "random-split-ts",
      item: {
        kind: "mc",
        id: "fct-predict-1",
        prompt: "A model forecasting daily demand scores far better under 5-fold cross-validation with shuffled days than it does once deployed. The likely reason is",
        options: [
          { id: "a", text: "shuffling let it learn from days after the ones it was tested on", correct: true, why: "Neighbouring days leak information both ways." },
          { id: "b", text: "bad luck: shuffled cross-validation is the right test for any model", misconception: "random-split-ts", why: "Time order matters; the test must be in the model's future." },
          { id: "c", text: "the model was too simple", why: "The gap comes from the evaluation, not the model." },
        ],
      },
      reveal: {
        body: "With shuffled folds, the model sees Tuesday and Thursday while being tested on Wednesday, and correlated neighbours make that easy. In deployment, it only ever has the past. Rolling-origin evaluation reproduces this: every test point lies after all its training data.",
      },
      resolve: {
        kind: "mc",
        id: "fct-resolve-1",
        prompt: "The right way to cross-validate a forecaster is",
        options: [
          { id: "a", text: "rolling origin: train on the past, test on the next period, move forward", correct: true, why: "It respects time order." },
          { id: "b", text: "random k-fold splits", misconception: "random-split-ts", why: "They train on the future." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fct-check-1",
        prompt: "A random-walk forecast has one-step error SD 10. The 95% interval 4 steps ahead has half-width about",
        options: [
          { id: "a", text: "39", correct: true, why: "$1.96 \\times 10\\sqrt4 = 39.2$." },
          { id: "b", text: "19.6, the same as one step ahead", misconception: "interval-constant-width", why: "Uncertainty accumulates with the horizon." },
          { id: "c", text: "78", why: "SD grows like $\\sqrt h$, not $h$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fct-check-2",
        prompt: "A model's MASE is 1.3. Compared with the naive forecast, it is",
        options: [
          { id: "a", text: "worse", correct: true, why: "Its error is 30% larger than the benchmark's." },
          { id: "b", text: "30% better", why: "Below 1 beats the benchmark." },
          { id: "c", text: "the same", why: "Equal performance would give 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Kaggle-style forecasting competitions use rolling, time-ordered validation for exactly the leakage reason above. The Kalman filter is also the backbone of tracking: GPS navigation, robot localisation and object tracking in video all blend a motion model's prediction with noisy sensor readings.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "fct-produce-1", prompt: "Forecast errors are 3, −5, 2, −2. Find the MAE.", answer: 3, explain: "$12/4$." },
        { kind: "number", id: "fct-produce-2", prompt: "Same errors. Find the RMSE to 3 decimals.", answer: Math.round(Math.sqrt(42 / 4) * 1000) / 1000, tolerance: 0.001, explain: "$\\sqrt{42/4}$." },
        {
          kind: "mc",
          id: "fct-produce-3",
          prompt: "To test a sales forecaster honestly, split the data",
          options: [
            { id: "a", text: "by time: train on earlier months, test on later ones", correct: true, why: "The test lies in the model's future." },
            { id: "b", text: "at random", misconception: "random-split-ts", why: "That leaks future information." },
          ],
        },
        {
          kind: "mc",
          id: "fct-produce-4",
          prompt: "Compared with a 1-month-ahead interval, a 12-month-ahead interval from the same model is",
          options: [
            { id: "a", text: "wider", correct: true, why: "Uncertainty accumulates." },
            { id: "b", text: "the same width", misconception: "interval-constant-width", why: "More unknown shocks lie between now and then." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "fct-review-1", prompt: "Actual values 100 and 200; forecasts 110 and 180. Find the MAPE in percent.", answer: 10, explain: "Both errors are 10%." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "state-space models and the Kalman filter",
      body: "A **state-space model** has a hidden state $x_t$ evolving as $x_t = Fx_{t-1} + w_t$ and observations $y_t = Hx_t + v_t$, with noise variances $Q$ and $R$. The **Kalman filter** alternates **predict**, $\\hat x^- = F\\hat x$ with variance $P^- = FPF^{\\mathsf T} + Q$, and **update** with gain $K = P^-H^{\\mathsf T}(HP^-H^{\\mathsf T} + R)^{-1}$: $\\hat x = \\hat x^- + K(y - H\\hat x^-)$, $P = (I - KH)P^-$. ARIMA and ETS models can all be written in this form.",
    },
    {
      type: "definition",
      term: "change points and interrupted time series",
      body: "**Change-point detection** looks for times where the mean, variance or trend shifts; **CUSUM** tracks the running sum of deviations from a target and flags a change when it drifts too far. **Interrupted time-series analysis** measures an intervention's effect with segmented regression $y_t = \\beta_0 + \\beta_1t + \\beta_2D_t + \\beta_3(t - T)D_t + e_t$, where $D_t = 1$ after the intervention at $T$: $\\beta_2$ is the immediate jump and $\\beta_3$ the change in slope. Model the errors' autocorrelation (§{arima}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "the scalar Kalman update",
      statement: "Prior estimate $\\hat x^-$ with variance $P^-$ and measurement $y$ with noise variance $R$ combine to $\\hat x = \\hat x^- + K(y - \\hat x^-)$, $K = \\dfrac{P^-}{P^- + R}$, with variance $P = (1 - K)P^-$.",
      proof: ["This is the precision-weighted average of two normal estimates, the same as a normal–normal Bayesian update (§{conjugate-priors}): $\\dfrac{1}{P} = \\dfrac{1}{P^-} + \\dfrac1R$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "random-walk forecast variance",
      statement: "For $y_t = y_{t-1} + \\varepsilon_t$, the naive forecast $\\hat y_{t+h} = y_t$ has error $\\varepsilon_{t+1} + \\dots + \\varepsilon_{t+h}$, variance $h\\sigma^2$.",
      proof: ["Sum $h$ independent shocks (§{stationarity-acf})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "choosing a metric",
      statement: "Use MAE or RMSE to compare models on one series (RMSE if large errors are especially costly), MASE to compare across series of different scales, and avoid MAPE when values can be near 0.",
      proof: ["MAE and RMSE carry the series' units; MASE is scale-free; MAPE divides by $y$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Errors 4, −2, 0, −6. Find the MAE and RMSE.",
      solution: ["MAE $= 12/4 = 3$.", "RMSE $= \\sqrt{56/4} = \\sqrt{14} \\approx 3.74$: higher, driven by the error of 6."],
      result: "MAE 3, RMSE 3.74.",
    },
    {
      type: "example",
      level: 2,
      title: "one Kalman update",
      problem: "A tracker predicts position 10 with variance 4; a sensor reads 14 with noise variance 4. Update.",
      solution: ["$K = 4/8 = 0.5$.", "$\\hat x = 10 + 0.5 \\times 4 = 12$, with variance $0.5 \\times 4 = 2$."],
      result: "12, variance 2.",
    },
    {
      type: "example",
      level: 3,
      title: "interrupted time series",
      problem: "A fitted segmented regression of monthly admissions has $\\beta_1 = 2$, $\\beta_2 = -15$ and $\\beta_3 = -3$, with a new policy at month $T$. Describe the effect.",
      solution: ["Immediately after the policy, admissions drop by 15 relative to the old trend.", "The trend changes from $+2$ to $2 - 3 = -1$ a month: admissions now fall."],
      result: "A drop of 15, and the trend reverses from +2 to −1 a month.",
    },
  ],
  pitfalls: [
    { wrong: "Shuffle time-series data for cross-validation.", right: "Use rolling-origin evaluation." },
    { wrong: "Report a point forecast alone.", right: "Give intervals that widen with the horizon." },
    { wrong: "Skip the benchmarks.", right: "Show the model beats naive and seasonal naive (MASE < 1)." },
  ],
  formulas: [
    { label: "Interval", tex: "\\hat y_{t+h} \\pm 1.96\\,\\hat\\sigma_h" },
    { label: "Random walk", tex: "\\sigma_h = \\sigma\\sqrt h" },
    { label: "Metrics", tex: "\\text{MAE} = \\overline{|e|},\\ \\text{RMSE} = \\sqrt{\\overline{e^2}},\\ \\text{MASE} = \\dfrac{\\text{MAE}}{\\text{MAE}_{\\text{naive}}}" },
    { label: "Kalman gain", tex: "K = \\dfrac{P^-}{P^- + R}" },
  ],
  exercises: [
    ex(1, num("fctx-ex-1", "Errors 5, −5, 10, 0. Find the MAE.", 5, "$20/4$."), ["$5$."]),
    ex(1, num("fctx-ex-2", "A model's MAE is 8; the naive forecast's in-sample MAE is 10. Find the MASE.", 0.8, "$8/10$."), ["$0.8$: better than naive."]),
    ex(2, dp("fctx-ex-3", "Errors 5, −5, 10, 0. Find the RMSE.", Math.sqrt(150 / 4), "$\\sqrt{150/4}$."), ["$\\approx 6.124$."]),
    ex(2, dp("fctx-ex-4", "A random walk has step SD 3. Find the 95% interval half-width 9 steps ahead.", 1.96 * 3 * 3, "$1.96 \\times 3\\sqrt9$."), ["$17.64$."]),
    ex(2, num("fctx-ex-5", "Kalman: prediction 20 with variance 9; measurement 30 with noise variance 1. Find the updated estimate.", 29, "$K = 0.9$."), ["$20 + 0.9 \\times 10 = 29$: the precise sensor dominates."]),
    ex(3, num("fctx-ex-6", "Same update. Find the new variance.", 0.9, "$(1 - 0.9) \\times 9$."), ["$0.9$, below both 9 and 1."]),
    ex(3, mc("fctx-ex-7", "Monthly sales are sometimes 0. Which metric should you avoid?", ["MAPE", "It divides by the actual value."], [["MAE", "MAE is fine with zeros."], ["MASE", "MASE scales by the naive MAE, not by $y$."]]), ["Use MAE, RMSE or MASE."]),
    ex(3, mc("fctx-ex-8", "In a segmented regression for an intervention, the coefficient on $(t - T)D_t$ measures", ["the change in slope after the intervention", "It adds to the pre-intervention slope."], [["the immediate jump", "That is the coefficient on $D_t$."], ["the pre-intervention trend", "That is the coefficient on $t$."]]), ["Jump and slope change together describe the effect."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const es = Array.from({ length: 3 + lv }, () => r.nonzero(-9, 9));
      const which = r.pick(["MAE", "RMSE"] as const);
      const v = which === "MAE" ? es.reduce((s, e) => s + Math.abs(e), 0) / es.length : Math.sqrt(es.reduce((s, e) => s + e * e, 0) / es.length);
      return n(`Forecast errors are ${es.join(", ")}. Find the ${which} (3 decimals).`, Math.round(v * 1000) / 1000, which === "MAE" ? `Mean absolute error $${es.reduce((s, e) => s + Math.abs(e), 0)}/${es.length} \\approx ${Math.round(v * 1000) / 1000}$.` : `$\\sqrt{${es.reduce((s, e) => s + e * e, 0)}/${es.length}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const x = r.int(0, 50);
      const P = r.pick([1, 2, 4, 9, 16]);
      const R = r.pick([1, 2, 4, 9, 16]);
      const y = x + r.nonzero(-10, 10);
      const K = P / (P + R);
      const v = x + K * (y - x);
      return n(`Kalman update: prediction ${x} with variance ${P}; measurement ${y} with noise variance ${R}. Find the updated estimate (3 decimals).`, Math.round(v * 1000) / 1000, `$K = ${P}/${P + R} \\approx ${r2(K)}$; $${x} + K(${y} - ${x}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = r.pick([2, 3, 5, 10]);
      const h = r.pick([4, 9, 16, 25]);
      const w = 1.96 * s * Math.sqrt(h);
      return n(`A random-walk forecast has one-step error SD ${s}. Find the 95% interval half-width ${h} steps ahead (2 decimals).`, r2(w), `$1.96 \\times ${s}\\sqrt{${h}} = ${r2(w)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const what = r.pick(["daily electricity demand", "weekly sales", "hourly web traffic", "monthly rainfall"]);
      return mcNumbers(
        `To evaluate a model forecasting ${what}, the test data should be`,
        { text: "later in time than all the training data", why: "That mimics real forecasting." },
        [
          { text: "a random sample of the days", why: "Random splits train on the future.", misconception: "random-split-ts" },
          { text: "the training data itself", why: "In-sample error is optimistic." },
        ],
      );
    },
  },
];
