import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Time-indexed data: trend, seasonality, cycles and irregular components; moving averages; additive and multiplicative decomposition. */

const base: ConceptNode = {
  id: "ts-components",
  title: "Trend, seasonality & moving averages",
  summary: "A time series is a sequence of observations in time order, and the order matters. Most series mix a long-run trend, a seasonal pattern that repeats with a fixed period, slower cycles of irregular length, and leftover noise. Moving averages smooth out the noise and the season to reveal the trend; decomposition separates all the parts.",
  deps: ["mean-median-mode", "least-squares"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "trend", meaning: "The long-run movement of the series' level." },
    { term: "seasonality", meaning: "A pattern that repeats with a fixed, known period, such as every 12 months or every 7 days." },
    { term: "cycle", meaning: "Rises and falls without a fixed period, such as business cycles lasting several years." },
  ],
  misconceptions: {
    "cycle-equals-season": "Calls any repeating up-and-down pattern seasonal, even when its length varies and is not tied to the calendar.",
    "additive-growing-seasonality": "Uses an additive decomposition when the seasonal swings grow in proportion to the level of the series.",
  },
  steps: [
    {
      type: "motivate",
      title: "Order matters",
      body: "Shuffle a list of exam marks and its mean, spread and histogram are unchanged. Shuffle a year of daily electricity demand and you lose everything that matters: the rise through the evening, the dip at weekends, the winter peak. Time-series methods are built around that order.",
      realWorld: {
        title: "Seasonally adjusted figures",
        body: "Official unemployment and retail figures are usually published \"seasonally adjusted\": the predictable December spike or summer dip is removed, so a change from one month to the next reflects real movement rather than the calendar.",
      },
    },
    {
      type: "truth",
      statement: "An **additive** decomposition writes $y_t = T_t + S_t + R_t$ (trend, seasonal, remainder); a **multiplicative** one writes $y_t = T_t \\times S_t \\times R_t$, appropriate when the seasonal swings grow with the level. A **moving average** of order $k$ replaces each value by the mean of the $k$ values around it; with $k$ equal to the seasonal period, the season averages out and the trend remains.",
      body: "For an even period such as 12 months, a **centred** $2 \\times 12$ moving average (weights $\\tfrac1{24}$ on the two end months and $\\tfrac1{12}$ on the 11 between) keeps the result aligned with a month. **Classical decomposition** estimates the trend by that moving average, the seasonal effect by averaging the detrended values for each season, and leaves the remainder. Taking logs turns a multiplicative decomposition into an additive one. Robust modern versions such as STL handle a changing seasonal pattern.",
    },
    {
      type: "predict",
      misconception: "additive-growing-seasonality",
      item: {
        kind: "mc",
        id: "tsc-predict-1",
        prompt: "Monthly airline passengers: in the first year the summer peak is about 40 above trend; ten years later, with the trend three times higher, it is about 120 above. Which decomposition fits?",
        options: [
          { id: "a", text: "Multiplicative: the seasonal swing is a roughly constant percentage of the level", correct: true, why: "The swing tripled as the level tripled." },
          { id: "b", text: "Additive: seasonality is always a fixed amount added on", misconception: "additive-growing-seasonality", why: "An additive model assumes the swing stays the same size." },
          { id: "c", text: "Neither: the series has no seasonality", why: "There is a clear summer peak." },
        ],
      },
      reveal: {
        body: "An additive model would fit one average swing of about 80 to every year, overstating the early peaks and understating the late ones. A multiplicative model uses a seasonal index (here, summer about 1.2 times trend) that scales with the level. Equivalently, log the series and decompose additively.",
      },
      resolve: {
        kind: "mc",
        id: "tsc-resolve-1",
        prompt: "When the seasonal swings grow in proportion to the series' level, use",
        options: [
          { id: "a", text: "a multiplicative decomposition, or an additive one on the logged series", correct: true, why: "Proportional swings are additive on the log scale." },
          { id: "b", text: "an additive decomposition of the raw series", misconception: "additive-growing-seasonality", why: "It assumes a constant swing." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tsc-check-1",
        prompt: "A country's unemployment rate rises and falls in waves lasting anywhere from 4 to 10 years. This pattern is",
        options: [
          { id: "a", text: "a cycle: its length varies and isn't tied to the calendar", correct: true, why: "Business cycles have irregular lengths." },
          { id: "b", text: "seasonality, because it repeats", misconception: "cycle-equals-season", why: "Seasonality has a fixed, known period." },
          { id: "c", text: "noise", why: "Waves lasting years are systematic movement." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tsc-check-2",
        prompt: "The 3-term moving average of 12, 15, 21 (centred on 15) is",
        options: [
          { id: "a", text: "16", correct: true, why: "$48/3$." },
          { id: "b", text: "15", why: "That is the middle value, not the mean." },
          { id: "c", text: "18", why: "Average all three values." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Forecasting models often get calendar features (month, day of week, holiday flags) to learn seasonality directly, and a trend feature such as time itself. Decomposing first and modelling the remainder is a common alternative. Either way, shuffling rows before splitting destroys the time order the model needs.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "tsc-produce-1", prompt: "Multiplicative model: trend 400 and the December seasonal index is 1.25. Find the fitted December value.", answer: 500, explain: "$400 \\times 1.25$." },
        { kind: "number", id: "tsc-produce-2", prompt: "Quarterly additive seasonal effects must sum to 0. Three are $+12$, $-5$ and $+8$. Find the fourth.", answer: -15, explain: "$-(12 - 5 + 8)$." },
        {
          kind: "mc",
          id: "tsc-produce-3",
          prompt: "Daily website visits peak every Monday and dip every Saturday. This is",
          options: [
            { id: "a", text: "weekly seasonality", correct: true, why: "A fixed 7-day period." },
            { id: "b", text: "a cycle", why: "Cycles have no fixed period." },
          ],
        },
        {
          kind: "mc",
          id: "tsc-produce-4",
          prompt: "Housing starts swing up and down over periods of 5 to 9 years. Removing a 12-month seasonal pattern will",
          options: [
            { id: "a", text: "leave these swings in place: they are cyclical, not seasonal", correct: true, why: "A 12-month adjustment can't remove multi-year waves of varying length." },
            { id: "b", text: "remove them, since repeating swings are seasonal", misconception: "cycle-equals-season", why: "Their length varies, so they are cycles." },
          ],
        },
        {
          kind: "mc",
          id: "tsc-produce-5",
          prompt: "A shop's December spike is 10% above trend every year while sales double over the decade. Model the seasonality as",
          options: [
            { id: "a", text: "multiplicative", correct: true, why: "A constant percentage swing." },
            { id: "b", text: "additive", misconception: "additive-growing-seasonality", why: "The spike's size in rupees doubles with the level." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "tsc-review-1", prompt: "Find the 3-term moving average centred on the middle of 20, 26, 29.", answer: 25, explain: "$75/3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "seasonal adjustment",
      body: "The **seasonally adjusted** series removes the estimated seasonal component: $y_t - S_t$ in an additive model, $y_t / S_t$ in a multiplicative one. Additive seasonal effects are scaled to sum to 0 over a period; multiplicative indices to average 1.",
    },
    {
      type: "definition",
      term: "centred moving average",
      body: "For an odd order $k = 2m + 1$, $\\hat T_t = \\tfrac1k\\sum_{j=-m}^{m}y_{t+j}$. For an even period such as 4 quarters, average two consecutive 4-term averages: $\\hat T_t = \\tfrac18y_{t-2} + \\tfrac14(y_{t-1} + y_t + y_{t+1}) + \\tfrac18y_{t+2}$, which is centred on $t$ and gives every quarter equal total weight.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "a seasonal-length average removes the season",
      statement: "If $S_t$ repeats with period $m$ and its effects sum to 0 over a period, any moving average spanning exactly one period (equal total weight on each season) contains no seasonal component, and a linear trend passes through it unchanged.",
      proof: [
        "Each season appears with the same total weight, so the seasonal terms contribute a multiple of $\\sum S = 0$.",
        "For a linear trend $a + bt$, a symmetric average of $a + b(t + j)$ over $j$ is $a + bt$, since the $+j$ and $-j$ terms cancel.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "choosing additive or multiplicative",
      statement: "Plot the series. If the seasonal swings stay roughly the same size as the level changes, use additive; if they grow with the level, use multiplicative or take logs first.",
      proof: ["$\\ln(T \\times S \\times R) = \\ln T + \\ln S + \\ln R$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the 3-term moving averages of 4, 6, 11, 13.",
      solution: ["Centred on 6: $(4 + 6 + 11)/3 = 7$.", "Centred on 11: $(6 + 11 + 13)/3 = 10$."],
      result: "7 and 10.",
    },
    {
      type: "example",
      level: 2,
      title: "a centred 4-term average",
      problem: "Quarterly values 10, 12, 14, 16, 18. Find the centred moving average at the middle value.",
      solution: ["Weights $\\tfrac18, \\tfrac14, \\tfrac14, \\tfrac14, \\tfrac18$.", "$1.25 + 3 + 3.5 + 4 + 2.25 = 14$."],
      result: "14.",
    },
    {
      type: "example",
      level: 3,
      title: "seasonal adjustment",
      problem: "A multiplicative model has a December index of 1.15. Sales this December were 345. Find the seasonally adjusted figure, and compare it with November's adjusted 310.",
      solution: ["Adjusted December $= 345/1.15 = 300$.", "Allowing for the usual December lift, sales actually fell from 310 to 300."],
      result: "300: an underlying fall.",
    },
  ],
  pitfalls: [
    { wrong: "Every repeating pattern is seasonal.", right: "Seasonality has a fixed calendar period; cycles vary in length." },
    { wrong: "Use additive decomposition for any series.", right: "If swings grow with the level, use multiplicative or logs." },
    { wrong: "Compare a raw December figure with November's.", right: "Compare seasonally adjusted figures, or the same month a year earlier." },
  ],
  formulas: [
    { label: "Additive", tex: "y_t = T_t + S_t + R_t" },
    { label: "Multiplicative", tex: "y_t = T_t \\times S_t \\times R_t" },
    { label: "Moving average", tex: "\\hat T_t = \\tfrac1k\\textstyle\\sum_{j=-m}^{m}y_{t+j},\\ k = 2m + 1" },
    { label: "Centred 2×4 MA", tex: "\\tfrac18y_{t-2} + \\tfrac14(y_{t-1} + y_t + y_{t+1}) + \\tfrac18y_{t+2}" },
  ],
  exercises: [
    ex(1, num("tscx-ex-1", "Find the 3-term moving average centred on the middle of 12, 15, 18.", 15, "$45/3$."), ["$15$."]),
    ex(1, num("tscx-ex-2", "Additive model: trend 500 and the seasonal effect is $-40$. Find the fitted value.", 460, "$500 - 40$."), ["$460$."]),
    ex(2, num("tscx-ex-3", "Find the centred 4-term moving average at the middle of 8, 12, 10, 14, 16.", 12, "Weights $\\tfrac18, \\tfrac14, \\tfrac14, \\tfrac14, \\tfrac18$."), ["$1 + 3 + 2.5 + 3.5 + 2 = 12$."]),
    ex(2, num("tscx-ex-4", "Multiplicative indices for four quarters are 0.8, 1.1, 1.2 and $x$; they average 1. Find $x$.", 0.9, "They sum to 4."), ["$4 - 3.1 = 0.9$."]),
    ex(2, num("tscx-ex-5", "Observed value 270 in a quarter with multiplicative index 0.9. Find the seasonally adjusted value.", 300, "$270/0.9$."), ["$300$."]),
    ex(3, num("tscx-ex-6", "Monthly data with a linear trend $100 + 2t$ and an additive seasonal pattern. The 12-month centred moving average at $t = 30$ is", 160, "A seasonal-length average leaves a linear trend unchanged."), ["$100 + 2 \\times 30 = 160$."]),
    ex(3, mc("tscx-ex-7", "Retail sales' seasonal swings double as the level doubles. To use an additive method you should first", ["take logs", "Proportional swings become constant on the log scale."], [["difference the series", "That removes trend, not proportional seasonality."], ["take square roots", "Logs are what make proportional effects additive."]]), ["Then exponentiate the components back."]),
    ex(3, mc("tscx-ex-8", "Why does a 12-term moving average need centring for monthly data?", ["With an even number of terms its centre falls between two months", "A 2×12 average re-aligns it to a month."], [["To remove the trend", "Moving averages estimate the trend; they don't remove it."], ["It doesn't", "An uncentred even-length average sits half a month off."]]), ["Average two consecutive 12-term averages."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = lv === 1 ? 3 : 5;
      const xs = Array.from({ length: k }, () => r.int(10, 60));
      const m = xs.reduce((s, x) => s + x, 0) / k;
      return n(`Find the ${k}-term moving average centred on the middle of ${xs.join(", ")} (2 decimals).`, r2(m), `$${xs.reduce((s, x) => s + x, 0)}/${k} \\approx ${r2(m)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const mult = r.pick([true, false]);
      const trend = r.int(10, 60) * 10;
      if (mult) {
        const idx = r.pick([0.8, 0.85, 0.9, 1.1, 1.15, 1.2, 1.25]);
        const y = r2(trend * idx);
        return n(`Multiplicative model, seasonal index ${idx}. The observed value is ${y}. Find the seasonally adjusted value.`, trend, `$${y}/${idx} = ${trend}$.`, 0.01);
      }
      const s = r.pick([-30, -20, -15, 15, 25, 40]);
      return n(`Additive model, seasonal effect ${s > 0 ? "+" : ""}${s}. The observed value is ${trend + s}. Find the seasonally adjusted value.`, trend, `$${trend + s} - (${s}) = ${trend}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { what: "Rainfall in a city rises every monsoon and falls every winter.", season: true },
        { what: "Restaurant bookings peak every Friday and Saturday.", season: true },
        { what: "Commodity prices swing up and down over periods of 3 to 8 years.", season: false },
        { what: "A company's profits rise and fall with business cycles lasting 5 to 11 years.", season: false },
      ]);
      return v.season
        ? mcNumbers(`${v.what} This is`, { text: "seasonality", why: "It repeats with a fixed, calendar-linked period." }, [{ text: "a cycle", why: "Cycles have no fixed period." }])
        : mcNumbers(`${v.what} This is`, { text: "a cycle", why: "Its length varies and isn't tied to the calendar." }, [{ text: "seasonality", why: "Seasonality needs a fixed period.", misconception: "cycle-equals-season" }]);
    },
  },
];
