import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Simple exponential smoothing, Holt's linear trend, Holt–Winters seasonality, damped trends, and ETS state-space models. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const ses = (alpha: number, s0: number, ys: number[]) => ys.reduce((s, y) => alpha * y + (1 - alpha) * s, s0);

const base: ConceptNode = {
  id: "exponential-smoothing",
  title: "Exponential smoothing",
  summary: "Exponential smoothing forecasts with a weighted average of past observations whose weights shrink geometrically into the past. The smoothing constant α sets how fast it reacts. Holt's method adds a trend, Holt–Winters adds seasonality, and the ETS state-space framework puts all of them on a likelihood footing with prediction intervals.",
  deps: ["ts-components"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "smoothing constant", meaning: "$\\alpha \\in (0, 1]$: the weight on the newest observation; the rest goes to the previous level." },
    { term: "level", meaning: "The smoothed current value of the series, $\\ell_t$." },
    { term: "ETS", meaning: "Error, Trend, Seasonal: a family of state-space models whose point forecasts match exponential smoothing methods." },
  ],
  misconceptions: {
    "alpha-high-smooth": "Thinks a larger smoothing constant α gives a smoother series, when it makes the level follow the latest data more closely.",
    "ses-trend": "Expects simple exponential smoothing to continue a trend, when its forecasts are flat at the last level.",
  },
  steps: [
    {
      type: "motivate",
      title: "Recent data matter more",
      body: "To forecast tomorrow's demand, last week's sales tell you more than last year's, but last year's still say something. Weighting every past day equally (the mean) ignores the first point; using only yesterday (the naive forecast) ignores the second. Exponential smoothing sits between them, with weights fading steadily into the past.",
      realWorld: {
        title: "Stock control",
        body: "Exponential smoothing was developed in the 1950s for forecasting inventory demand, where thousands of items each need a cheap, automatic forecast. Supply-chain systems still use it for exactly that.",
      },
    },
    {
      type: "truth",
      statement: "**Simple exponential smoothing**: $\\ell_t = \\alpha y_t + (1 - \\alpha)\\ell_{t-1}$, and every future forecast is $\\hat y_{t+h} = \\ell_t$. Unrolling, $\\ell_t = \\sum_{k \\ge 0}\\alpha(1 - \\alpha)^ky_{t-k}$: geometrically decaying weights. **Holt's** method adds a trend $b_t$: $\\ell_t = \\alpha y_t + (1 - \\alpha)(\\ell_{t-1} + b_{t-1})$, $b_t = \\beta(\\ell_t - \\ell_{t-1}) + (1 - \\beta)b_{t-1}$, with forecasts $\\ell_t + hb_t$.",
      body: "A large $\\alpha$ reacts quickly to new data; a small $\\alpha$ smooths heavily and reacts slowly. **Holt–Winters** adds a seasonal component, additive or multiplicative (§{ts-components}). A **damped** trend multiplies the trend by $\\phi < 1$ each step, so long-range forecasts level off, which often forecasts better than a trend extended forever. The **ETS** models write each method as a state-space model with an error term, so parameters can be fitted by maximum likelihood (§{mle}), models compared by AIC (§{likelihood-ratio}) and prediction intervals computed.",
    },
    {
      type: "predict",
      misconception: "alpha-high-smooth",
      item: {
        kind: "mc",
        id: "exs-predict-1",
        prompt: "Two analysts smooth the same noisy daily sales, one with $\\alpha = 0.1$ and one with $\\alpha = 0.9$. Whose smoothed series is smoother?",
        options: [
          { id: "a", text: "$\\alpha = 0.1$: it puts little weight on each new value", correct: true, why: "The level changes by only 10% of each surprise." },
          { id: "b", text: "$\\alpha = 0.9$: more smoothing", misconception: "alpha-high-smooth", why: "With $\\alpha = 0.9$ the level nearly copies each new value." },
          { id: "c", text: "They are equally smooth", why: "α controls how fast the level moves." },
        ],
      },
      reveal: {
        body: "$\\ell_t = \\ell_{t-1} + \\alpha(y_t - \\ell_{t-1})$: the level moves a fraction $\\alpha$ of the way towards each new observation. With $\\alpha = 0.9$ it jumps almost all the way, tracking the noise; with $\\alpha = 0.1$ it creeps, averaging over roughly the last 10 to 20 days. Smoother means smaller $\\alpha$.",
      },
      resolve: {
        kind: "mc",
        id: "exs-resolve-1",
        prompt: "To smooth a noisy series more heavily, you should",
        options: [
          { id: "a", text: "decrease α", correct: true, why: "Less weight on each new value." },
          { id: "b", text: "increase α", misconception: "alpha-high-smooth", why: "That makes the level follow the noise." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exs-check-1",
        prompt: "Sales have risen by about 20 a month for two years. Simple exponential smoothing's forecasts for the next 6 months will be",
        options: [
          { id: "a", text: "flat at the current level, so they will fall further and further behind", correct: true, why: "SES has no trend term." },
          { id: "b", text: "rising by about 20 a month", misconception: "ses-trend", why: "Only Holt's method projects a trend." },
          { id: "c", text: "falling", why: "The forecast is constant." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exs-check-2",
        prompt: "$\\alpha = 0.3$, previous level 50 and new observation 60. The new level is",
        options: [
          { id: "a", text: "53", correct: true, why: "$0.3 \\times 60 + 0.7 \\times 50$." },
          { id: "b", text: "57", why: "That puts 0.7 on the new value." },
          { id: "c", text: "55", why: "That is the plain average." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Exponential moving averages are everywhere in training: momentum and Adam keep exponentially smoothed gradients, batch normalisation tracks running means this way, and many models keep an exponential average of their own weights for evaluation. The same $\\alpha$ trade-off between responsiveness and noise applies.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "exs-produce-1", prompt: "$\\alpha = 0.5$, previous level 40, new observation 50. Find the new level.", answer: 45, explain: "$25 + 20$." },
        { kind: "number", id: "exs-produce-2", prompt: "Holt's method: level 200 and trend 8 now. Find the forecast 5 periods ahead.", answer: 240, explain: "$200 + 5 \\times 8$." },
        {
          kind: "mc",
          id: "exs-produce-3",
          prompt: "A smoothed series follows every random wiggle of the data. You should",
          options: [
            { id: "a", text: "lower α", correct: true, why: "That weights each new value less." },
            { id: "b", text: "raise α", misconception: "alpha-high-smooth", why: "That follows the data even more closely." },
          ],
        },
        {
          kind: "mc",
          id: "exs-produce-4",
          prompt: "For a series with a steady upward trend and no seasonality, the right method is",
          options: [
            { id: "a", text: "Holt's linear trend method", correct: true, why: "It smooths both level and trend." },
            { id: "b", text: "simple exponential smoothing, which carries the trend forward", misconception: "ses-trend", why: "SES forecasts are flat." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "exs-review-1", prompt: "$\\alpha = 0.2$, previous level 100, new observation 110. Find the new level.", answer: 102, explain: "$22 + 80$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Holt–Winters",
      body: "With seasonal period $m$, the additive version keeps a level, trend and seasonal component: $\\ell_t = \\alpha(y_t - s_{t-m}) + (1 - \\alpha)(\\ell_{t-1} + b_{t-1})$, $b_t$ as in Holt's method, $s_t = \\gamma(y_t - \\ell_t) + (1 - \\gamma)s_{t-m}$, with forecast $\\hat y_{t+h} = \\ell_t + hb_t + s_{t+h-m}$ (for $h \\le m$). The multiplicative version divides by the seasonal factor instead of subtracting.",
    },
    {
      type: "definition",
      term: "ETS state-space models",
      body: "Each model is labelled ETS(Error, Trend, Seasonal), with each part None, Additive, Additive damped or Multiplicative. ETS(A,N,N) is simple exponential smoothing written as $y_t = \\ell_{t-1} + \\varepsilon_t$, $\\ell_t = \\ell_{t-1} + \\alpha\\varepsilon_t$. The error term gives a likelihood, hence fitted parameters, AIC comparison and forecast distributions.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the weights",
      statement: "Simple exponential smoothing gives weight $\\alpha(1 - \\alpha)^k$ to the observation $k$ steps back. The weights sum to 1 (in the limit), and their mean age is $\\dfrac{1 - \\alpha}{\\alpha}$.",
      proof: [
        "Substituting $\\ell_{t-1} = \\alpha y_{t-1} + (1 - \\alpha)\\ell_{t-2}$ repeatedly gives $\\ell_t = \\sum_k\\alpha(1 - \\alpha)^ky_{t-k}$ plus a vanishing starting term.",
        "$\\sum_k\\alpha(1 - \\alpha)^k = 1$, and $\\sum_kk\\alpha(1 - \\alpha)^k = (1 - \\alpha)/\\alpha$, the mean of a geometric distribution counting failures.",
      ],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "damped trend forecast",
      statement: "With damping $\\phi$, the $h$-step forecast is $\\ell_t + (\\phi + \\phi^2 + \\dots + \\phi^h)b_t$, which tends to $\\ell_t + \\dfrac{\\phi}{1 - \\phi}b_t$ as $h \\to \\infty$.",
      proof: ["Each step multiplies the remaining trend by $\\phi$; sum the geometric series."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$\\alpha = 0.3$, starting level 50, observations 60 then 56. Find the level after each.",
      solution: ["$\\ell_1 = 0.3 \\times 60 + 0.7 \\times 50 = 53$.", "$\\ell_2 = 0.3 \\times 56 + 0.7 \\times 53 = 16.8 + 37.1 = 53.9$."],
      result: "53, then 53.9.",
    },
    {
      type: "example",
      level: 2,
      title: "one Holt step",
      problem: "$\\alpha = \\beta = 0.5$, level 100, trend 5, new observation 110. Update, and forecast 2 periods ahead.",
      solution: ["$\\ell = 0.5 \\times 110 + 0.5 \\times (100 + 5) = 107.5$; $b = 0.5 \\times 7.5 + 0.5 \\times 5 = 6.25$.", "Forecast $107.5 + 2 \\times 6.25 = 120$."],
      result: "Level 107.5, trend 6.25, forecast 120.",
    },
    {
      type: "example",
      level: 3,
      title: "damping",
      problem: "Level 100, trend 4, $\\phi = 0.8$. Find the 2-step forecast and the long-run limit.",
      solution: ["$100 + (0.8 + 0.64) \\times 4 = 105.76$.", "Limit $100 + \\tfrac{0.8}{0.2} \\times 4 = 116$."],
      result: "105.76; levels off at 116.",
    },
  ],
  pitfalls: [
    { wrong: "Larger α means smoother.", right: "Larger α reacts faster; smaller α smooths more." },
    { wrong: "Use simple exponential smoothing on a trending series.", right: "Use Holt's method, damped if the trend may not last." },
    { wrong: "Choose α by eye.", right: "Fit it by minimising one-step forecast errors or maximising the ETS likelihood." },
  ],
  formulas: [
    { label: "SES", tex: "\\ell_t = \\alpha y_t + (1 - \\alpha)\\ell_{t-1},\\ \\hat y_{t+h} = \\ell_t" },
    { label: "Weights", tex: "\\alpha(1 - \\alpha)^k" },
    { label: "Holt", tex: "\\hat y_{t+h} = \\ell_t + hb_t" },
    { label: "Damped", tex: "\\ell_t + (\\phi + \\dots + \\phi^h)b_t" },
  ],
  exercises: [
    ex(1, num("exsx-ex-1", "$\\alpha = 0.4$, previous level 20, new observation 30. Find the new level.", 24, "$12 + 12$."), ["$24$."]),
    ex(1, num("exsx-ex-2", "Holt: level 50, trend $-2$. Find the 3-step forecast.", 44, "$50 - 6$."), ["$44$."]),
    ex(2, dp("exsx-ex-3", "$\\alpha = 0.2$, starting level 10, observations 15, 12, 18. Find the final level.", ses(0.2, 10, [15, 12, 18]), "Apply the update three times."), ["$11$, then $11.2$, then $12.56$."]),
    ex(2, num("exsx-ex-4", "With $\\alpha = 0.5$, find the weight on the observation 3 steps back.", 0.0625, "$0.5 \\times 0.5^3$."), ["$0.0625$."]),
    ex(2, num("exsx-ex-5", "Find the mean age of the data used by SES with $\\alpha = 0.2$.", 4, "$(1 - \\alpha)/\\alpha$."), ["$4$ periods."]),
    ex(3, dp("exsx-ex-6", "Level 200, trend 10, $\\phi = 0.9$. Find the 3-step damped forecast.", 200 + (0.9 + 0.81 + 0.729) * 10, "$(\\phi + \\phi^2 + \\phi^3)b$."), ["$200 + 2.439 \\times 10 = 224.39$."]),
    ex(3, mc("exsx-ex-7", "Monthly ice-cream sales have a trend and a summer peak that grows with the level. Use", ["multiplicative Holt–Winters", "Trend plus proportional seasonality."], [["simple exponential smoothing", "It handles neither trend nor season."], ["additive Holt–Winters", "Additive assumes a constant seasonal swing."]]), ["In ETS terms, ETS(M,A,M)."]),
    ex(3, mc("exsx-ex-8", "An advantage of ETS models over the original smoothing recipes is", ["a likelihood, giving fitted parameters, AIC and prediction intervals", "The error term makes them statistical models."], [["different point forecasts", "Point forecasts match the corresponding method."], ["no parameters to choose", "They still have α, β, γ, φ."]]), ["Same forecasts, plus uncertainty and model selection."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const alpha = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8]);
      const s0 = r.int(20, 80);
      const ys = Array.from({ length: lv }, () => s0 + r.int(-15, 15));
      const l = ses(alpha, s0, ys);
      return n(`Simple exponential smoothing with $\\alpha = ${alpha}$, starting level ${s0}, then observation${lv > 1 ? "s" : ""} ${ys.join(", ")}. Find the final level (3 decimals).`, Math.round(l * 1000) / 1000, `Apply $\\ell_t = ${alpha}y_t + ${r2(1 - alpha)}\\ell_{t-1}$ ${lv === 1 ? "once" : `${lv} times`}: $\\approx ${Math.round(l * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const l = r.int(50, 300);
      const b = r.nonzero(-8, 12);
      const h = r.int(2, 8);
      return n(`Holt's method: current level ${l}, trend ${b}. Find the forecast ${h} periods ahead.`, l + h * b, `$${l} + ${h} \\times (${b}) = ${l + h * b}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [lo, hi] = r.pick([[0.1, 0.7], [0.2, 0.8], [0.05, 0.6], [0.15, 0.9]] as const);
      return mcNumbers(
        `Smoothing the same noisy series with $\\alpha = ${lo}$ and $\\alpha = ${hi}$, which smoothed line is smoother?`,
        { text: `$\\alpha = ${lo}$`, why: "A small α moves the level only a little towards each new value." },
        [
          { text: `$\\alpha = ${hi}$`, why: "A large α tracks the noise.", misconception: "alpha-high-smooth" },
          { text: "They are equally smooth", why: "α sets how fast the level reacts." },
        ],
      );
    },
  },
];
