import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Volatility modelling (ARCH, GARCH); vector autoregression, Granger causality, cointegration and spurious regression; spectral analysis and frequency-domain methods. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "advanced-time-series",
  title: "Volatility, VAR & spectral analysis",
  summary: "Financial returns are nearly unpredictable, but their volatility is not: calm and turbulent spells cluster, which ARCH and GARCH models capture. Several series that move together are modelled jointly by vector autoregression, which also tests whether one helps predict another (Granger causality). Trending series can share a long-run equilibrium (cointegration) or merely look related (spurious regression). Spectral analysis decomposes a series into cycles by frequency.",
  deps: ["arima", "forecasting", "eigenvalue"],
  pos: { x: 5, y: 0 },
  glossary: [
    { term: "volatility", meaning: "The conditional standard deviation of returns, which changes over time." },
    { term: "VAR", meaning: "Vector autoregression: each of several series regressed on lags of all of them." },
    { term: "cointegration", meaning: "Two non-stationary series whose linear combination is stationary: they share a long-run equilibrium." },
  ],
  misconceptions: {
    "granger-is-causal": "Reads \"x Granger-causes y\" as proof that x causes y, rather than that past x helps predict y.",
    "spurious-regression": "Trusts a high R² and significant slope from regressing one trending or random-walk series on another.",
  },
  steps: [
    {
      type: "motivate",
      title: "Calm and storm",
      body: "Plot daily stock-market returns and two things stand out. The returns themselves look like noise centred on zero. But their size does not: quiet weeks follow quiet weeks, and after a crash, big moves in both directions follow for months. Predicting how much a price will move, rather than which way, is possible and valuable.",
      realWorld: {
        title: "Risk management",
        body: "Banks estimate value-at-risk, the loss they are 99% sure not to exceed tomorrow, from volatility forecasts. GARCH models, introduced in the 1980s, are a standard tool; Robert Engle shared the 2003 economics Nobel prize for ARCH.",
      },
    },
    {
      type: "truth",
      statement: "**GARCH(1, 1)** models returns $r_t = \\sigma_t z_t$ with $z_t$ independent standard noise and $\\sigma_t^2 = \\omega + \\alpha r_{t-1}^2 + \\beta\\sigma_{t-1}^2$. With $\\alpha + \\beta < 1$, the long-run variance is $\\dfrac{\\omega}{1 - \\alpha - \\beta}$, and $\\alpha + \\beta$ near 1 means volatility shocks persist. **ARCH($q$)** has only the $r^2$ terms. A **VAR(1)** for a vector $\\vec y_t$ is $\\vec y_t = \\vec c + A\\vec y_{t-1} + \\vec\\varepsilon_t$, stationary when every eigenvalue of $A$ has modulus below 1 (§{eigenvalue}).",
      body: "**Granger causality**: $x$ Granger-causes $y$ if lags of $x$ improve forecasts of $y$ beyond lags of $y$ alone, tested by an F-test on the $x$ lags in a VAR. **Spurious regression**: regressing one independent random walk on another typically gives a large $R^2$ and a \"significant\" slope that mean nothing; difference first, unless the series are **cointegrated**, when $y_t - \\beta x_t$ is stationary and an error-correction model links short-run changes to the long-run gap. **Spectral analysis** writes a stationary series as a sum of sinusoids; the **periodogram** shows how much variance sits at each frequency $f$, and a peak at $f$ reveals a cycle of period $1/f$.",
    },
    {
      type: "predict",
      misconception: "spurious-regression",
      item: {
        kind: "mc",
        id: "ats-predict-1",
        prompt: "Two completely independent random walks, 500 steps each, are regressed one on the other. The typical result is",
        options: [
          { id: "a", text: "a large $R^2$ and a \"significant\" slope, both meaningless", correct: true, why: "Wandering levels line up by chance; the usual t-test is invalid." },
          { id: "b", text: "$R^2$ near 0 and no significant slope, because they are independent", misconception: "spurious-regression", why: "That holds for stationary series, not random walks." },
          { id: "c", text: "an error from the software", why: "The regression runs; its inference is wrong." },
        ],
      },
      reveal: {
        body: "Each walk drifts in long excursions, so over any window they happen to rise or fall together, giving a big $R^2$. The residuals are themselves a random walk, violating the regression's assumptions, so t-statistics are hugely inflated: \"significant\" at 5% most of the time. A low Durbin–Watson statistic alongside a high $R^2$ is the classic warning. Difference the series, or test for cointegration.",
      },
      resolve: {
        kind: "mc",
        id: "ats-resolve-1",
        prompt: "Regressing a random-walk series on another gives $R^2 = 0.85$. You should",
        options: [
          { id: "a", text: "suspect spurious regression: difference, or test for cointegration", correct: true, why: "Non-stationary levels make R² misleading." },
          { id: "b", text: "conclude the two are strongly related", misconception: "spurious-regression", why: "Independent random walks routinely give high R²." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ats-check-1",
        prompt: "Lags of advertising spending significantly improve forecasts of sales beyond sales' own lags. This shows",
        options: [
          { id: "a", text: "advertising Granger-causes sales: it carries predictive information", correct: true, why: "That is all the test establishes." },
          { id: "b", text: "advertising causes sales", misconception: "granger-is-causal", why: "A third factor, such as planned seasonal promotions, could drive both." },
          { id: "c", text: "sales cause advertising", why: "The test was in the other direction." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ats-check-2",
        prompt: "GARCH(1, 1) with $\\omega = 0.2$, $\\alpha = 0.1$, $\\beta = 0.85$. The long-run variance is",
        options: [
          { id: "a", text: "4", correct: true, why: "$0.2/(1 - 0.95)$." },
          { id: "b", text: "0.2", why: "Divide by $1 - \\alpha - \\beta$." },
          { id: "c", text: "1.33", why: "Use $\\alpha + \\beta = 0.95$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Fourier features (sines and cosines at chosen frequencies) let regression and neural forecasters capture seasonality; spectral methods also underlie audio processing, where models work on spectrograms rather than raw waveforms. Volatility forecasts feed position sizing in algorithmic trading.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ats-produce-1", prompt: "GARCH(1, 1) with $\\omega = 0.1$, $\\alpha = 0.1$, $\\beta = 0.8$. Yesterday $r^2 = 4$ and $\\sigma^2 = 1$. Find today's $\\sigma^2$.", answer: 1.3, explain: "$0.1 + 0.4 + 0.8$." },
        { kind: "number", id: "ats-produce-2", prompt: "Monthly data's periodogram peaks at frequency $\\tfrac1{12}$ cycles per month. Find the period in months.", answer: 12, explain: "Period $= 1/f$." },
        {
          kind: "mc",
          id: "ats-produce-3",
          prompt: "\"Interest rates Granger-cause house prices\" means",
          options: [
            { id: "a", text: "past interest rates help forecast house prices", correct: true, why: "Predictive precedence." },
            { id: "b", text: "interest rates are proven to cause house prices", misconception: "granger-is-causal", why: "Prediction isn't causation." },
          ],
        },
        {
          kind: "mc",
          id: "ats-produce-4",
          prompt: "Two unrelated trending series regressed in levels give a t-statistic of 9. This is",
          options: [
            { id: "a", text: "likely spurious: the test assumes stationary errors", correct: true, why: "Trending series inflate t-statistics." },
            { id: "b", text: "strong evidence of a relationship", misconception: "spurious-regression", why: "Shared trends alone produce this." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ats-review-1", prompt: "GARCH(1, 1) with $\\omega = 0.05$, $\\alpha = 0.05$, $\\beta = 0.9$. Find the long-run variance.", answer: 1, explain: "$0.05/0.05$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "cointegration and error correction",
      body: "Two $I(1)$ series (stationary after one difference) are **cointegrated** if $u_t = y_t - \\beta x_t$ is stationary. The **Engle–Granger** method estimates $\\beta$ by regression in levels, then tests $u_t$ for a unit root. The **error-correction model** $\\nabla y_t = \\gamma u_{t-1} + (\\text{lags of } \\nabla y, \\nabla x) + e_t$ with $\\gamma < 0$ pulls $y$ back towards equilibrium. Examples: spot and futures prices, short and long interest rates.",
    },
    {
      type: "definition",
      term: "spectral analysis",
      body: "The **periodogram** at Fourier frequency $f_j = j/n$ is $I(f_j) = \\dfrac1n\\left|\\sum_ty_te^{-2\\pi if_jt}\\right|^2$, splitting the sample variance across frequencies. The **spectral density** is its population version, the Fourier transform of the autocovariances. White noise has a flat spectrum; an AR(1) with $\\phi > 0$ has most power at low frequencies. **Frequency-domain methods** filter out bands (for example removing a seasonal frequency), estimate cycles, and measure coherence between two series by frequency.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "GARCH long-run variance",
      statement: "If $\\alpha + \\beta < 1$, the unconditional variance of a GARCH(1, 1) is $\\bar\\sigma^2 = \\dfrac{\\omega}{1 - \\alpha - \\beta}$, and the $h$-step variance forecast is $\\bar\\sigma^2 + (\\alpha + \\beta)^{h-1}(\\sigma_{t+1}^2 - \\bar\\sigma^2)$.",
      proof: ["Take expectations: $E[\\sigma_t^2] = \\omega + \\alpha E[r_{t-1}^2] + \\beta E[\\sigma_{t-1}^2]$ with $E[r^2] = E[\\sigma^2] = \\bar\\sigma^2$. The deviation from $\\bar\\sigma^2$ shrinks by $\\alpha + \\beta$ each step."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "VAR stationarity",
      statement: "$\\vec y_t = A\\vec y_{t-1} + \\vec\\varepsilon_t$ is stationary if and only if every eigenvalue of $A$ has $|\\lambda| < 1$.",
      proof: ["$\\vec y_t = \\sum_kA^k\\vec\\varepsilon_{t-k}$, and $A^k \\to 0$ exactly when all eigenvalues lie inside the unit circle (diagonalise $A = PDP^{-1}$, so $A^k = PD^kP^{-1}$)."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "VAR size",
      statement: "A VAR($p$) in $k$ variables has $k$ intercepts and $pk^2$ lag coefficients. The count grows fast, so keep $p$ small, choose it by AIC or BIC, or shrink coefficients (Bayesian VARs).",
      proof: ["Each of the $k$ equations has an intercept and $p$ lags of all $k$ variables."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "GARCH(1, 1) with $\\omega = 0.1$, $\\alpha = 0.1$, $\\beta = 0.8$. Find the long-run variance and the persistence.",
      solution: ["Persistence $\\alpha + \\beta = 0.9$.", "Long-run variance $0.1/0.1 = 1$."],
      result: "Variance 1; persistence 0.9.",
    },
    {
      type: "example",
      level: 2,
      title: "a VAR's stability",
      problem: `Is $\\vec y_t = \\begin{bmatrix} 0.5 & 0.2 \\\\ 0 & 0.3 \\end{bmatrix}\\vec y_{t-1} + \\vec\\varepsilon_t$ stationary? How many lag coefficients does a VAR(2) in 3 variables have?`,
      solution: ["The matrix is triangular, so its eigenvalues are 0.5 and 0.3, both inside the unit circle: stationary.", "VAR(2), $k = 3$: $2 \\times 9 = 18$ lag coefficients, plus 3 intercepts."],
      result: "Stationary; 18 lag coefficients.",
    },
    {
      type: "example",
      level: 3,
      title: "reading a periodogram",
      problem: "Hourly electricity demand over 4 weeks has periodogram peaks at $f = \\tfrac1{24}$ and $f = \\tfrac1{168}$ cycles per hour. Interpret.",
      solution: ["$1/f = 24$ hours: a daily cycle.", "$1/f = 168$ hours: a weekly cycle (7 × 24)."],
      result: "Daily and weekly cycles.",
    },
  ],
  pitfalls: [
    { wrong: "Granger causality proves causation.", right: "It shows predictive precedence; a common driver can produce it." },
    { wrong: "Regress trending series in levels and trust the t-tests.", right: "Difference, or check for cointegration first." },
    { wrong: "Unpredictable returns mean unpredictable risk.", right: "Volatility clusters and can be forecast." },
  ],
  formulas: [
    { label: "GARCH(1, 1)", tex: "\\sigma_t^2 = \\omega + \\alpha r_{t-1}^2 + \\beta\\sigma_{t-1}^2" },
    { label: "Long-run variance", tex: "\\omega/(1 - \\alpha - \\beta)" },
    { label: "VAR(1)", tex: "\\vec y_t = \\vec c + A\\vec y_{t-1} + \\vec\\varepsilon_t,\\ |\\lambda_i(A)| < 1" },
    { label: "Period", tex: "1/f" },
  ],
  exercises: [
    ex(1, num("atsx-ex-1", "GARCH(1, 1) with $\\omega = 0.3$, $\\alpha = 0.1$, $\\beta = 0.8$. Find the long-run variance.", 3, "$0.3/0.1$."), ["$3$."]),
    ex(1, num("atsx-ex-2", "A periodogram of quarterly data peaks at $f = 0.25$ cycles per quarter. Find the period in quarters.", 4, "$1/0.25$."), ["$4$: an annual cycle."]),
    ex(2, num("atsx-ex-3", "GARCH(1, 1) with $\\omega = 0.05$, $\\alpha = 0.15$, $\\beta = 0.8$; yesterday $r^2 = 9$ and $\\sigma^2 = 2$. Find today's $\\sigma^2$.", 3, "$0.05 + 1.35 + 1.6$."), ["$3$."]),
    ex(2, num("atsx-ex-4", "How many lag coefficients does a VAR(3) in 4 variables have?", 48, "$3 \\times 4^2$."), ["$48$."]),
    ex(2, dp("atsx-ex-5", "GARCH(1, 1) with long-run variance 1, $\\alpha + \\beta = 0.9$ and next-day variance 2. Find the 3-day-ahead variance forecast.", 1 + 0.81 * 1, "$\\bar\\sigma^2 + (\\alpha + \\beta)^{h-1}(\\sigma_{t+1}^2 - \\bar\\sigma^2)$."), ["$1 + 0.9^2 \\times 1 = 1.81$."]),
    ex(3, mc("atsx-ex-6", `A VAR(1) has $A = \\begin{bmatrix} 1.1 & 0 \\\\ 0 & 0.4 \\end{bmatrix}$. It is`, ["non-stationary: an eigenvalue exceeds 1", "The first series explodes."], [["stationary", "1.1 lies outside the unit circle."], ["cointegrated", "That needs a unit root and a stationary combination."]]), ["Eigenvalues 1.1 and 0.4."]),
    ex(3, mc("atsx-ex-7", "Spot and futures prices are each random walks, but their difference is stationary. They are", ["cointegrated", "A stationary linear combination of $I(1)$ series."], [["spuriously related", "Their link is genuine and long-run."], ["white noise", "Each level wanders."]]), ["Model them with an error-correction model."]),
    ex(3, mc("atsx-ex-8", "Ice-cream sales Granger-cause drowning deaths in monthly data. The most likely explanation is", ["summer weather drives both, with ice-cream sales rising slightly earlier", "A common driver creates predictive precedence."], [["ice cream causes drowning", "Granger causality isn't causal."], ["the test is invalid", "The test can be valid and still not causal."]]), ["Add temperature to the VAR and see if the effect remains."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.pick([0.05, 0.1, 0.15]);
      const b = r.pick([0.7, 0.75, 0.8]);
      const w = r.pick([0.05, 0.1, 0.2, 0.3]);
      if (lv === 1) {
        const v = w / (1 - a - b);
        return n(`GARCH(1, 1) with $\\omega = ${w}$, $\\alpha = ${a}$, $\\beta = ${b}$. Find the long-run variance (3 decimals).`, Math.round(v * 1000) / 1000, `$${w}/(1 - ${r2(a + b)}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
      }
      const r2v = r.pick([0.5, 1, 2, 4, 9]);
      const s2 = r.pick([0.5, 1, 2, 3]);
      const v = w + a * r2v + b * s2;
      return n(`GARCH(1, 1) with $\\omega = ${w}$, $\\alpha = ${a}$, $\\beta = ${b}$. Yesterday $r^2 = ${r2v}$ and $\\sigma^2 = ${s2}$. Find today's $\\sigma^2$ (3 decimals).`, Math.round(v * 1000) / 1000, `$${w} + ${a} \\times ${r2v} + ${b} \\times ${s2} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 5);
      const p = r.int(1, 4);
      return n(`How many lag coefficients does a VAR(${p}) in ${k} variables have?`, p * k * k, `$${p} \\times ${k}^2 = ${p * k * k}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const v = r.pick([
        { unit: "month", period: 12 },
        { unit: "quarter", period: 4 },
        { unit: "hour", period: 24 },
        { unit: "day", period: 7 },
        { unit: "year", period: 11 },
      ]);
      return n(`A periodogram of data recorded each ${v.unit} peaks at $f = \\tfrac1{${v.period}}$ cycles per ${v.unit}. Find the cycle's period in ${v.unit}s.`, v.period, `Period $= 1/f = ${v.period}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([["oil prices", "airline fares"], ["rainfall", "crop yields"], ["unemployment claims", "retail sales"], ["search volume", "flu cases"]]);
      return mcNumbers(
        `In a VAR, lags of ${v[0]} significantly improve forecasts of ${v[1]} beyond ${v[1]}' own lags. This shows that`,
        { text: `past ${v[0]} carries information for forecasting ${v[1]} (Granger causality)`, why: "That is what the test measures." },
        [
          { text: `changes in ${v[0]} are proven to cause changes in ${v[1]}`, why: "Predictive precedence isn't causation.", misconception: "granger-is-causal" },
          { text: `${v[1]} drives ${v[0]}`, why: "The test ran the other way." },
        ],
      );
    },
  },
];
