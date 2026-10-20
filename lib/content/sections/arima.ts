import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** AR, MA and ARMA models; ARIMA and seasonal ARIMA; Box–Jenkins identification, fitting and checking; regression with ARIMA errors (ARIMAX). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "arima",
  title: "AR, MA & ARIMA models",
  summary: "An autoregressive model predicts a value from its own recent past; a moving-average model from recent random shocks. Together they form ARMA models for stationary series, and differencing first gives ARIMA for series with trends. The ACF and PACF suggest the orders, maximum likelihood fits the coefficients, and the residuals should end up as white noise.",
  deps: ["stationarity-acf", "mle", "regression-inference"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "AR(p)", meaning: "$y_t = c + \\phi_1y_{t-1} + \\dots + \\phi_py_{t-p} + \\varepsilon_t$." },
    { term: "MA(q)", meaning: "$y_t = \\mu + \\varepsilon_t + \\theta_1\\varepsilon_{t-1} + \\dots + \\theta_q\\varepsilon_{t-q}$." },
    { term: "ARIMA(p, d, q)", meaning: "An ARMA($p$, $q$) model for the series differenced $d$ times." },
  ],
  misconceptions: {
    "ma-model-is-smoother": "Confuses an MA($q$) model, built from past random shocks, with moving-average smoothing of past values.",
    "overdifference": "Differences more times than needed \"to be safe\", which adds artificial correlation and inflates forecast uncertainty.",
  },
  steps: [
    {
      type: "motivate",
      title: "Memory of two kinds",
      body: "Some series remember their own values: a warm day tends to be followed by another, fading over a few days. Others remember shocks: a one-off strike disrupts output this month and next, then is gone. AR models capture the first kind of memory, MA models the second, and many real series need both.",
      realWorld: {
        title: "Box and Jenkins",
        body: "In 1970 George Box and Gwilym Jenkins set out a recipe: make the series stationary, identify a model from its ACF and PACF, fit it, check the residuals, repeat. ARIMA forecasting of airline passengers, electricity load and economic indicators grew from it.",
      },
    },
    {
      type: "truth",
      statement: "The AR(1) $y_t = c + \\phi y_{t-1} + \\varepsilon_t$ is stationary when $|\\phi| < 1$, with mean $\\dfrac{c}{1 - \\phi}$ and variance $\\dfrac{\\sigma^2}{1 - \\phi^2}$; its ACF decays like $\\phi^k$ and its PACF cuts off after lag 1. The MA(1) $y_t = \\mu + \\varepsilon_t + \\theta\\varepsilon_{t-1}$ has $\\rho_1 = \\dfrac{\\theta}{1 + \\theta^2}$ and $\\rho_k = 0$ for $k \\ge 2$. In general **AR($p$): PACF cuts off after $p$; MA($q$): ACF cuts off after $q$.**",
      body: "**ARIMA($p$, $d$, $q$)** differences $d$ times (§{stationarity-acf}) and fits ARMA($p$, $q$). **Seasonal ARIMA** $(p, d, q)(P, D, Q)_m$ adds the same terms at multiples of the season $m$, such as $y_{t-12}$ for monthly data. Fit by maximum likelihood (§{mle}), choose among candidates by AIC (§{likelihood-ratio}), and check that the residuals are white noise with a Ljung–Box test. **Regression with ARIMA errors** (ARIMAX) adds predictors $x_t$ and models the leftover correlation with ARIMA, fixing the too-small standard errors ordinary regression gives on autocorrelated data (§{regression-inference}).",
    },
    {
      type: "predict",
      misconception: "ma-model-is-smoother",
      item: {
        kind: "mc",
        id: "ari-predict-1",
        prompt: "An MA(1) model $y_t = 10 + \\varepsilon_t + 0.5\\varepsilon_{t-1}$ describes $y_t$ as built from",
        options: [
          { id: "a", text: "this period's random shock and half of last period's shock", correct: true, why: "The terms are unobserved errors, not past $y$ values." },
          { id: "b", text: "an average of the last two observed values", misconception: "ma-model-is-smoother", why: "That is moving-average smoothing, a different idea." },
          { id: "c", text: "half of last period's value", why: "That would be an AR(1) term." },
        ],
      },
      reveal: {
        body: "The name is a historical accident: an MA($q$) model is a weighted sum of the current and past $q$ **shocks** $\\varepsilon$, which are never observed directly. A shock affects $y$ for exactly $q + 1$ periods and then vanishes, which is why the ACF cuts off after lag $q$. Moving-average smoothing (§{ts-components}) averages observed values to estimate a trend.",
      },
      resolve: {
        kind: "mc",
        id: "ari-resolve-1",
        prompt: "The $\\theta$ terms in an MA model multiply",
        options: [
          { id: "a", text: "past random shocks", correct: true, why: "$\\theta\\varepsilon_{t-1}$." },
          { id: "b", text: "past observed values, as in a moving-average smoother", misconception: "ma-model-is-smoother", why: "Past values appear in AR terms." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ari-check-1",
        prompt: "A series with a linear trend becomes white noise after one difference. Differencing it a second time",
        options: [
          { id: "a", text: "introduces a spurious negative lag-1 correlation and widens forecast intervals", correct: true, why: "Differencing white noise gives an MA(1) with $\\rho_1 = -0.5$." },
          { id: "b", text: "is a harmless safety step", misconception: "overdifference", why: "Overdifferencing adds structure that wasn't there." },
          { id: "c", text: "removes the trend", why: "The first difference already did." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ari-check-2",
        prompt: "The ACF decays gradually; the PACF has one large spike at lag 1 and nothing after. Suggest",
        options: [
          { id: "a", text: "AR(1)", correct: true, why: "AR($p$): PACF cuts off after $p$." },
          { id: "b", text: "MA(1)", why: "An MA(1)'s ACF would cut off instead." },
          { id: "c", text: "white noise", why: "There is clear lag-1 dependence." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "ARIMA is a strong, interpretable baseline that machine-learning forecasters must beat; often they don't on short series. Lagged values used as features in gradient-boosted or neural forecasters are the AR idea, and residual ACF checks apply to any model.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ari-produce-1", prompt: "AR(1): $y_t = 3 + 0.4y_{t-1} + \\varepsilon_t$. Find the mean of the series.", answer: 5, explain: "$3/(1 - 0.4)$." },
        { kind: "number", id: "ari-produce-2", prompt: "Same model; the last value is 10. Find the one-step forecast.", answer: 7, explain: "$3 + 0.4 \\times 10$." },
        {
          kind: "mc",
          id: "ari-produce-3",
          prompt: "An MA(2) model's prediction for next period uses",
          options: [
            { id: "a", text: "the last two estimated shocks (residuals)", correct: true, why: "$\\hat y_{t+1} = \\mu + \\theta_1\\hat\\varepsilon_t + \\theta_2\\hat\\varepsilon_{t-1}$." },
            { id: "b", text: "the average of the last two observed values", misconception: "ma-model-is-smoother", why: "That is a smoother, not an MA model." },
          ],
        },
        {
          kind: "mc",
          id: "ari-produce-4",
          prompt: "After one difference, the ACF dies out quickly and an ADF test rejects a unit root. You should",
          options: [
            { id: "a", text: "stop at $d = 1$", correct: true, why: "The differenced series is already stationary." },
            { id: "b", text: "difference again to be safe", misconception: "overdifference", why: "That adds artificial correlation." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ari-review-1", prompt: "MA(1) with $\\theta = 0.5$. Find $\\rho_1$.", answer: 0.4, explain: "$0.5/1.25$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "backshift notation",
      body: "With $By_t = y_{t-1}$, an ARMA($p$, $q$) is $\\phi(B)y_t = \\theta(B)\\varepsilon_t$, where $\\phi(B) = 1 - \\phi_1B - \\dots - \\phi_pB^p$ and $\\theta(B) = 1 + \\theta_1B + \\dots + \\theta_qB^q$. Differencing is $(1 - B)$, so ARIMA($p$, $d$, $q$) is $\\phi(B)(1 - B)^dy_t = \\theta(B)\\varepsilon_t$. The model is stationary when the roots of $\\phi(z) = 0$ lie outside the unit circle.",
    },
    {
      type: "definition",
      term: "identification table",
      body: "AR($p$): ACF tails off, PACF cuts off after lag $p$. MA($q$): ACF cuts off after lag $q$, PACF tails off. ARMA($p$, $q$): both tail off; compare candidates by AIC. Seasonal terms show as spikes at lags $m, 2m, \\dots$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "AR(1) mean and variance",
      statement: "If $|\\phi| < 1$, the stationary AR(1) $y_t = c + \\phi y_{t-1} + \\varepsilon_t$ has $E[y_t] = \\dfrac{c}{1 - \\phi}$ and $\\operatorname{Var}(y_t) = \\dfrac{\\sigma^2}{1 - \\phi^2}$.",
      proof: [
        "Stationarity makes $E[y_t] = E[y_{t-1}] = \\mu$, so $\\mu = c + \\phi\\mu$.",
        "Similarly $\\gamma_0 = \\phi^2\\gamma_0 + \\sigma^2$, since $\\varepsilon_t$ is independent of $y_{t-1}$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "MA(1) autocorrelation",
      statement: "For $y_t = \\mu + \\varepsilon_t + \\theta\\varepsilon_{t-1}$, $\\gamma_0 = (1 + \\theta^2)\\sigma^2$, $\\gamma_1 = \\theta\\sigma^2$ and $\\gamma_k = 0$ for $k \\ge 2$. Hence $|\\rho_1| \\le \\tfrac12$.",
      proof: ["Consecutive values share one shock; values two apart share none. $\\theta/(1 + \\theta^2)$ is largest at $\\theta = 1$, where it equals $\\tfrac12$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "AR(1) forecasts",
      statement: "The $h$-step forecast is $\\hat y_{t+h} = \\mu + \\phi^h(y_t - \\mu)$: forecasts decay geometrically towards the mean.",
      proof: ["Each step ahead replaces the unknown shock by its mean 0, so the deviation from $\\mu$ is multiplied by $\\phi$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "AR(1): $y_t = 2 + 0.6y_{t-1} + \\varepsilon_t$. Find the mean, and forecast one and two steps ahead from $y_t = 7$.",
      solution: ["Mean $2/0.4 = 5$.", "$\\hat y_{t+1} = 2 + 0.6 \\times 7 = 6.2$; $\\hat y_{t+2} = 2 + 0.6 \\times 6.2 = 5.72$, heading back towards 5."],
      result: "Mean 5; forecasts 6.2 and 5.72.",
    },
    {
      type: "example",
      level: 2,
      title: "overdifferencing",
      problem: "White noise $\\varepsilon_t$ is differenced: $w_t = \\varepsilon_t - \\varepsilon_{t-1}$. Find $\\rho_1$ of $w$.",
      solution: ["This is an MA(1) with $\\theta = -1$.", "$\\rho_1 = -1/(1 + 1) = -0.5$."],
      result: "$-0.5$: a correlation created by the unnecessary difference.",
    },
    {
      type: "example",
      level: 3,
      title: "a seasonal model",
      problem: "How many ARMA coefficients does ARIMA$(1, 1, 1)(0, 1, 1)_{12}$ estimate, and what differencing does it apply?",
      solution: ["Coefficients: $\\phi_1$, $\\theta_1$ and a seasonal $\\Theta_1$: three.", "Differencing: one ordinary difference and one seasonal (lag-12) difference, $(1 - B)(1 - B^{12})y_t$."],
      result: "Three coefficients; first and seasonal differences.",
    },
  ],
  pitfalls: [
    { wrong: "An MA model averages past observations.", right: "It combines past shocks; smoothing is a different idea." },
    { wrong: "Difference extra times to be safe.", right: "Overdifferencing adds correlation and widens intervals; stop when stationary." },
    { wrong: "Run ordinary regression on autocorrelated time series and trust the standard errors.", right: "Use regression with ARIMA errors." },
  ],
  formulas: [
    { label: "AR(1) mean, variance", tex: "\\dfrac{c}{1 - \\phi},\\ \\dfrac{\\sigma^2}{1 - \\phi^2}" },
    { label: "MA(1)", tex: "\\rho_1 = \\dfrac{\\theta}{1 + \\theta^2},\\ \\rho_{k \\ge 2} = 0" },
    { label: "AR(1) forecast", tex: "\\hat y_{t+h} = \\mu + \\phi^h(y_t - \\mu)" },
    { label: "ARIMA", tex: "\\phi(B)(1 - B)^dy_t = \\theta(B)\\varepsilon_t" },
  ],
  exercises: [
    ex(1, num("arix-ex-1", "AR(1): $y_t = 6 + 0.5y_{t-1} + \\varepsilon_t$. Find the mean.", 12, "$6/0.5$."), ["$12$."]),
    ex(1, num("arix-ex-2", "Same model, $\\sigma^2 = 3$. Find the variance of $y_t$.", 4, "$3/(1 - 0.25)$."), ["$4$."]),
    ex(2, dp("arix-ex-3", "MA(1) with $\\theta = 0.8$. Find $\\rho_1$.", 0.8 / 1.64, "$\\theta/(1 + \\theta^2)$."), ["$0.8/1.64 \\approx 0.488$."]),
    ex(2, num("arix-ex-4", "AR(1) with mean 50 and $\\phi = 0.5$; the last value is 58. Find the 3-step forecast.", 51, "$50 + 0.5^3 \\times 8$."), ["$50 + 1 = 51$."]),
    ex(2, num("arix-ex-5", "How many ARMA coefficients does ARIMA$(2, 1, 1)(1, 1, 1)_{12}$ estimate?", 5, "$\\phi_1, \\phi_2, \\theta_1, \\Phi_1, \\Theta_1$."), ["$5$."]),
    ex(3, mc("arix-ex-6", "The ACF has significant spikes at lags 1 and 2 only; the PACF tails off. Suggest", ["MA(2)", "The ACF cuts off after lag 2."], [["AR(2)", "AR(2)'s PACF would cut off instead."], ["ARIMA(0, 2, 0)", "That is about differencing, not this pattern."]]), ["Fit MA(2) and check residuals."]),
    ex(3, mc("arix-ex-7", "A fitted ARIMA's residuals give a Ljung–Box p-value of 0.003. You should", ["revise the model: correlation remains in the residuals", "The residuals aren't white noise."], [["accept the model", "A small p-value rejects white noise."], ["difference the residuals", "Change the model, not the residuals."]]), ["Try other orders and compare AIC."]),
    ex(3, mc("arix-ex-8", "Regressing weekly sales on price by ordinary least squares, the residuals are strongly autocorrelated. The reported standard errors are likely", ["too small, so use regression with ARIMA errors", "Positive autocorrelation means less independent information."], [["correct", "OLS standard errors assume independent errors."], ["too large", "Positive autocorrelation shrinks them falsely."]]), ["ARIMAX models the error correlation."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const c = r.int(1, 10);
      const phi = r.pick([0.2, 0.4, 0.5, 0.6, 0.75, 0.8]);
      const mu = c / (1 - phi);
      const y = r.int(0, 30);
      const h = lv;
      const f = mu + phi ** h * (y - mu);
      return n(`AR(1): $y_t = ${c} + ${phi}y_{t-1} + \\varepsilon_t$. The last value is ${y}. Find the ${h}-step forecast (3 decimals).`, Math.round(f * 1000) / 1000, `Mean $${c}/${r2(1 - phi)} \\approx ${r2(mu)}$; $\\hat y = \\mu + ${phi}^${h}(${y} - \\mu) \\approx ${Math.round(f * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const th = r.pick([-0.8, -0.5, -0.3, 0.2, 0.4, 0.5, 0.6, 0.9]);
      const v = th / (1 + th * th);
      return n(`An MA(1) has $\\theta = ${th}$. Find its lag-1 autocorrelation (3 decimals).`, Math.round(v * 1000) / 1000, `$${th}/(1 + ${r2(th * th)}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.int(1, 3);
      const ar = r.pick([true, false]);
      return ar
        ? mcNumbers(`The PACF has significant spikes at lags 1 to ${p} and none after; the ACF tails off gradually. Suggest`, { text: `AR(${p})`, why: "An AR($p$) PACF cuts off after lag $p$." }, [{ text: `MA(${p})`, why: "An MA's ACF, not PACF, cuts off." }, { text: "white noise", why: "There is clear dependence." }])
        : mcNumbers(`The ACF has significant spikes at lags 1 to ${p} and none after; the PACF tails off. Suggest`, { text: `MA(${p})`, why: "An MA($q$) ACF cuts off after lag $q$." }, [{ text: `AR(${p})`, why: "An AR's PACF, not ACF, cuts off." }, { text: "white noise", why: "There is clear dependence." }]);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const d = r.pick(["one ordinary difference", "one seasonal difference", "a first difference"]);
      return mcNumbers(
        `After ${d}, the series' ACF dies out within a few lags and unit-root tests indicate stationarity. Differencing again would`,
        { text: "add a spurious negative correlation and widen forecast intervals", why: "Differencing a stationary series overdifferences it." },
        [{ text: "be a harmless safety step", why: "Overdifferencing creates structure.", misconception: "overdifference" }],
      );
    },
  },
];
