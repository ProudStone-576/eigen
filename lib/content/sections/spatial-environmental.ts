import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Extreme-value statistics (GEV, peaks over threshold, return periods and levels), spatial statistics (autocorrelation, Moran's I, point patterns), geostatistics (variograms, kriging), environmental statistics (detection limits, trend tests) and climate statistics (anomalies, autocorrelated trends, attribution). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const gumbelLevel = (mu: number, beta: number, T: number) => mu - beta * Math.log(-Math.log(1 - 1 / T));

const base: ConceptNode = {
  id: "spatial-environmental",
  title: "Extremes, spatial & environmental statistics",
  summary: "Floods, heatwaves and pollution raise two statistical problems that ordinary methods handle badly. Extremes are about the tails, where data are scarce, and extreme-value theory gives the right models for maxima and return periods. Observations close together in space or time are alike, so they carry less independent information than their number suggests; spatial statistics and geostatistics model that dependence and use it to map and predict.",
  deps: ["continuous-family", "stationarity-acf", "covariance"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "return period", meaning: "$T$ years for an event with probability $1/T$ of being exceeded in any one year." },
    { term: "variogram", meaning: "$\\gamma(h) = \\tfrac12\\operatorname{Var}(Z(s + h) - Z(s))$: how dissimilar values are at separation $h$." },
    { term: "kriging", meaning: "Best linear unbiased prediction of a spatial field at unsampled places, using the fitted variogram." },
  ],
  misconceptions: {
    "hundred-year-once": "Thinks a \"100-year flood\" happens once a century, so after one the next is a century away.",
    "spatial-independent": "Treats nearby spatial or temporal observations as independent, overstating the evidence.",
  },
  steps: [
    {
      type: "motivate",
      title: "Tails and neighbours",
      body: "A sea wall must withstand the highest tide expected in 1,000 years, from perhaps 80 years of records. A pollution map must be drawn from 40 monitoring stations. In both, the naive approach fails: a normal curve fitted to typical tides badly misjudges the extremes, and 40 stations close together tell you less than 40 independent ones.",
      realWorld: {
        title: "The Dutch Delta Works",
        body: "After the 1953 North Sea flood killed over 1,800 people, Dutch engineers used extreme-value analysis of sea levels to set dike heights for events with return periods of up to 10,000 years in the most populated areas.",
      },
    },
    {
      type: "truth",
      statement: "**Extreme-value theory**: maxima of large blocks (annual maximum rainfall, say) are approximately **generalised extreme value** (GEV) distributed, with a shape parameter $\\xi$ giving the Gumbel ($\\xi = 0$), heavy-tailed Fréchet ($\\xi > 0$) or bounded Weibull ($\\xi < 0$) types; exceedances over a high threshold are approximately **generalised Pareto**. An event with return period $T$ has annual exceedance probability $1/T$, so the chance of at least one in $n$ years is $1 - (1 - 1/T)^n$. For the Gumbel with location $\\mu$ and scale $\\beta$, the $T$-year **return level** is $\\mu - \\beta\\ln(-\\ln(1 - 1/T))$.",
      body: "**Spatial statistics**: by Tobler's law, near things are more related than distant things. **Moran's I** measures spatial autocorrelation (expected value $-1/(n - 1)$ under none); **point-pattern** methods compare event locations with a completely random Poisson process. **Geostatistics** models a continuous field: the empirical variogram, half the mean squared difference between pairs at each distance, typically rises from a **nugget** (measurement noise) to a **sill** at the **range**, beyond which values are unrelated; **kriging** predicts at new places with weights from the variogram and gives a prediction-variance map. **Environmental** data are often below a **detection limit**: treat them as left-censored (§{survival-functions}) rather than substituting half the limit. **Climate** statistics works with **anomalies** relative to a baseline period and must allow for autocorrelation when testing trends (§{stationarity-acf}); detection and attribution compare observed patterns with model simulations with and without human influence.",
    },
    {
      type: "predict",
      misconception: "hundred-year-once",
      item: {
        kind: "mc",
        id: "spe-predict-1",
        prompt: "A town's floodplain is defined by the \"100-year flood\". Over a 30-year mortgage, the chance of at least one such flood is about",
        options: [
          { id: "a", text: "26%", correct: true, why: "$1 - 0.99^{30} \\approx 0.26$." },
          { id: "b", text: "almost none, since it happens once a century", misconception: "hundred-year-once", why: "A 1% chance applies every year, independently." },
          { id: "c", text: "30%", why: "Close, but probabilities don't simply add." },
        ],
      },
      reveal: {
        body: "\"100-year\" means a 1% chance in each year, not a schedule. Over 30 years the chance of at least one is $1 - 0.99^{30} \\approx 26\\%$, and two in successive years is perfectly possible. With a changing climate, yesterday's 100-year event may now be a 30-year event, so return periods must be re-estimated.",
      },
      resolve: {
        kind: "mc",
        id: "spe-resolve-1",
        prompt: "A 50-year storm hit last year. The chance of another this year is",
        options: [
          { id: "a", text: "still about 2%", correct: true, why: "Each year has probability $1/50$." },
          { id: "b", text: "about 0, since the next is 50 years away", misconception: "hundred-year-once", why: "Return periods aren't schedules." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spe-check-1",
        prompt: "Soil lead is measured at 400 points on a fine grid over a small site, and a t-test treats them as 400 independent observations. The p-value is likely",
        options: [
          { id: "a", text: "too small: nearby points are correlated, so the effective sample size is much less than 400", correct: true, why: "Spatial autocorrelation reduces independent information." },
          { id: "b", text: "correct, since there are 400 measurements", misconception: "spatial-independent", why: "Correlated observations aren't independent replicates." },
          { id: "c", text: "too large", why: "Positive correlation makes naive SEs too small." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spe-check-2",
        prompt: "An empirical variogram rises steeply and levels off at a separation of 2 km. The 2 km is the",
        options: [
          { id: "a", text: "range: beyond it, values are effectively uncorrelated", correct: true, why: "Where the variogram reaches its sill." },
          { id: "b", text: "nugget", why: "The nugget is the jump at zero distance." },
          { id: "c", text: "sill", why: "The sill is the variogram's level, not a distance." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Kriging is Gaussian-process regression (§{multivariate-normal}) in two dimensions; the variogram is a kernel. Spatial and temporal autocorrelation also break random cross-validation: models for maps or satellite images need blocked, spatially separated folds, or they look far better than they are.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "spe-produce-1", prompt: "Find the probability of at least one 100-year flood in 30 years, to 3 decimals.", answer: Math.round((1 - 0.99 ** 30) * 1000) / 1000, tolerance: 0.001, explain: "$1 - 0.99^{30}$." },
        { kind: "number", id: "spe-produce-2", prompt: "Pairs of points at separation $h$ differ by 2, −1 and 3. Find the empirical variogram $\\tfrac12\\overline{(\\Delta z)^2}$ to 3 decimals.", answer: Math.round((14 / 6) * 1000) / 1000, tolerance: 0.001, explain: "$\\tfrac12 \\times (4 + 1 + 9)/3$." },
        {
          kind: "mc",
          id: "spe-produce-3",
          prompt: "Two \"100-year\" floods struck a city in consecutive years. This",
          options: [
            { id: "a", text: "is unlucky but possible, and may suggest the risk was underestimated", correct: true, why: "Each year carries its own chance." },
            { id: "b", text: "is impossible, so the records must be wrong", misconception: "hundred-year-once", why: "Return periods don't schedule events." },
          ],
        },
        {
          kind: "mc",
          id: "spe-produce-4",
          prompt: "Testing for a trend in 60 years of autocorrelated temperature anomalies by ordinary regression",
          options: [
            { id: "a", text: "overstates significance unless the autocorrelation is modelled", correct: true, why: "Effective sample size is smaller." },
            { id: "b", text: "is fine, as each year is a separate observation", misconception: "spatial-independent", why: "Correlated years aren't independent." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "spe-review-1", prompt: "An event has return period 20 years. Find its probability in any one year.", answer: 0.05, explain: "$1/20$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "block maxima and peaks over threshold",
      body: "**Block maxima**: take each year's maximum and fit a GEV by maximum likelihood (§{mle}). **Peaks over threshold**: take all exceedances of a high threshold $u$ and fit a generalised Pareto to $X - u$, which uses more of the data. Either way, report return levels with confidence intervals, which widen sharply for long return periods.",
    },
    {
      type: "definition",
      term: "Moran's I",
      body: "With spatial weights $w_{ij}$ (for example 1 for neighbours, 0 otherwise) and $W = \\sum w_{ij}$, $I = \\dfrac nW\\dfrac{\\sum_{i,j}w_{ij}(x_i - \\bar x)(x_j - \\bar x)}{\\sum_i(x_i - \\bar x)^2}$. Positive values mean neighbours are alike (clustering), negative values mean they differ (a checkerboard). Residuals of a regression on spatial data should be checked with it.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "risk over a design life",
      statement: "If an event has annual exceedance probability $p = 1/T$, independently across years, the probability of at least one in $n$ years is $1 - (1 - 1/T)^n$; for $n = T$ this is about $1 - e^{-1} \\approx 63\\%$.",
      proof: ["The chance of none is $(1 - 1/T)^n$, and $(1 - 1/T)^T \\to e^{-1}$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "Gumbel return level",
      statement: "If annual maxima are Gumbel with CDF $F(x) = \\exp(-e^{-(x - \\mu)/\\beta})$, the $T$-year return level solving $F(x_T) = 1 - 1/T$ is $x_T = \\mu - \\beta\\ln(-\\ln(1 - 1/T))$.",
      proof: ["Take logs twice: $-(x_T - \\mu)/\\beta = \\ln(-\\ln(1 - 1/T))$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "dependent data shrink the sample",
      statement: "With AR(1) correlation $\\rho$ between neighbouring observations, $n$ observations carry about $n(1 - \\rho)/(1 + \\rho)$ independent observations' worth of information about the mean, the same formula as for MCMC draws (§{mcmc}).",
      proof: ["The variance of the mean of an AR(1) series is about $\\dfrac{\\sigma^2}{n}\\cdot\\dfrac{1 + \\rho}{1 - \\rho}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the probability of at least one 100-year flood in 30 years and in 100 years.",
      solution: ["$1 - 0.99^{30} \\approx 0.260$.", "$1 - 0.99^{100} \\approx 0.634$."],
      result: "26% and 63%.",
    },
    {
      type: "example",
      level: 2,
      title: "a return level",
      problem: "Annual maximum river flow is Gumbel with $\\mu = 100$ and $\\beta = 20$ (m³/s). Find the 100-year flow.",
      solution: ["$-\\ln(-\\ln 0.99) = -\\ln(0.01005) \\approx 4.600$.", "$x_{100} = 100 + 20 \\times 4.600 \\approx 192$."],
      result: "About 192 m³/s.",
    },
    {
      type: "example",
      level: 3,
      title: "effective sample size of a trend test",
      problem: "60 annual anomalies have lag-1 autocorrelation 0.5. About how many independent years' worth of information do they carry?",
      solution: ["$60 \\times 0.5/1.5 = 20$.", "Standard errors computed as if $n = 60$ are about $\\sqrt3 \\approx 1.7$ times too small."],
      result: "About 20.",
    },
  ],
  pitfalls: [
    { wrong: "A 100-year event happens once a century.", right: "It has a 1% chance every year." },
    { wrong: "Treat nearby measurements as independent.", right: "Model spatial or temporal correlation, or use blocked validation." },
    { wrong: "Replace values below the detection limit by half the limit.", right: "Treat them as censored." },
  ],
  formulas: [
    { label: "Design-life risk", tex: "1 - (1 - 1/T)^n" },
    { label: "Gumbel return level", tex: "x_T = \\mu - \\beta\\ln(-\\ln(1 - 1/T))" },
    { label: "Variogram", tex: "\\hat\\gamma(h) = \\tfrac{1}{2N(h)}\\textstyle\\sum(z_i - z_j)^2" },
    { label: "Moran's I null mean", tex: "E[I] = -1/(n - 1)" },
  ],
  exercises: [
    ex(1, num("spex-ex-1", "A 1,000-year event: find its annual probability.", 0.001, "$1/1000$."), ["$0.001$."]),
    ex(1, num("spex-ex-2", "A city's mean temperature over the 1991–2020 baseline is 14.0°C; this year's mean is 14.9°C. Find the anomaly.", 0.9, "$14.9 - 14.0$."), ["$+0.9$°C."]),
    ex(2, dp("spex-ex-3", "Find the probability of at least one 50-year storm in 10 years.", 1 - 0.98 ** 10, "$1 - 0.98^{10}$."), ["$\\approx 0.183$."]),
    ex(2, dp("spex-ex-4", "Gumbel $\\mu = 50$, $\\beta = 10$. Find the 50-year return level.", gumbelLevel(50, 10, 50), "$50 - 10\\ln(-\\ln 0.98)$."), ["$\\approx 89.019$."]),
    ex(2, dp("spex-ex-5", "With $n = 50$ areas and no spatial autocorrelation, find the expected value of Moran's I.", -1 / 49, "$-1/(n - 1)$."), ["$\\approx -0.020$."]),
    ex(3, num("spex-ex-6", "100 daily pollution readings have lag-1 autocorrelation 0.6. Find the effective sample size.", 25, "$100 \\times 0.4/1.6$."), ["$25$."]),
    ex(3, mc("spex-ex-7", "A variogram jumps to half its sill at almost zero distance. The jump (nugget) reflects", ["measurement error or variation at scales smaller than the sampling", "Differences at zero separation."], [["the range", "The range is where it levels off."], ["a trend", "Trends make the variogram keep rising."]]), ["A large nugget limits how smooth kriging maps can be."]),
    ex(3, mc("spex-ex-8", "Fitting a normal distribution to all daily rainfall to estimate the 100-year maximum is poor because", ["extremes follow tail behaviour that a normal fitted to typical days misjudges", "Use GEV or GPD on maxima or exceedances."], [["rainfall can't be modelled", "Extreme-value models work well."], ["the normal overestimates every extreme", "It usually underestimates heavy tails."]]), ["Extreme-value theory justifies the GEV for maxima."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const T = r.pick([10, 20, 50, 100, 200, 500]);
      const yrs = r.pick([10, 25, 30, 50, 100]);
      const v = 1 - (1 - 1 / T) ** yrs;
      return n(`Find the probability of at least one ${T}-year event in ${yrs} years (3 decimals).`, Math.round(v * 1000) / 1000, `$1 - (1 - 1/${T})^{${yrs}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const mu = r.int(20, 200);
      const beta = r.pick([5, 10, 15, 20, 30]);
      const T = r.pick([10, 25, 50, 100]);
      const v = gumbelLevel(mu, beta, T);
      return n(`Annual maxima are Gumbel with $\\mu = ${mu}$ and $\\beta = ${beta}$. Find the ${T}-year return level (2 decimals).`, r2(v), `$${mu} - ${beta}\\ln(-\\ln(1 - 1/${T})) \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const ds = Array.from({ length: k }, () => r.nonzero(-5, 5));
      const v = ds.reduce((s, d) => s + d * d, 0) / (2 * k);
      return n(`Pairs of locations at the same separation $h$ have value differences ${ds.join(", ")}. Find the empirical variogram $\\hat\\gamma(h) = \\tfrac{1}{2N}\\sum(\\Delta z)^2$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\tfrac{1}{${2 * k}} \\times ${ds.reduce((s, d) => s + d * d, 0)} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const T = r.pick([50, 100, 500]);
      return mcNumbers(
        `A ${T}-year flood occurred this spring. The probability of another next year is`,
        { text: `about ${r2(100 / T)}%, as in any year`, why: `Annual probability $1/${T}$.` },
        [{ text: "essentially zero for many decades", why: "Return periods aren't schedules.", misconception: "hundred-year-once" }],
      );
    },
  },
];
