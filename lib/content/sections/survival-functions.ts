import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Time-to-event data, censoring and truncation; survival, hazard and cumulative hazard functions; reliability and failure rates; exponential and Weibull hazards; hazard-rate estimation; life tables. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "survival-functions",
  title: "Survival & hazard functions",
  summary: "Survival analysis studies how long until an event: death, relapse, machine failure, a customer leaving. Its data are unusual because many subjects haven't had the event yet when the study ends; they are censored, and their partial information must be used, not discarded. The survival function gives the chance of lasting beyond each time; the hazard gives the instantaneous event rate among those still at risk.",
  deps: ["uniform-exponential", "continuous-family", "conditional-probability"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "censored", meaning: "An observation whose event time is only partly known; right-censored means it is known to exceed some time." },
    { term: "survival function", meaning: "$S(t) = P(T > t)$; in engineering, the reliability function $R(t)$." },
    { term: "hazard", meaning: "$h(t) = f(t)/S(t)$: the event rate at time $t$ among those still at risk; in engineering, the failure rate." },
  ],
  misconceptions: {
    "drop-censored": "Drops censored subjects from the analysis, or treats their censoring time as an event time.",
    "hazard-is-probability": "Thinks the hazard is a probability that can't exceed 1, rather than a rate per unit time.",
  },
  steps: [
    {
      type: "motivate",
      title: "The study ended first",
      body: "A five-year cancer study enrols patients over three years. When it closes, some have died, some are alive after one year of follow-up, some after four, and a few moved away. The survivors' exact survival times are unknown, but each tells us they lasted at least so long. Throwing them away would make survival look worse; counting them as deaths, worse still.",
      realWorld: {
        title: "Warranty periods",
        body: "Manufacturers set warranty lengths from reliability data: the proportion of units expected to fail within one or two years. Most units in a reliability test are still working when it ends, so the analysis is a survival analysis with heavy censoring.",
      },
    },
    {
      type: "truth",
      statement: "For an event time $T$ with density $f$: $S(t) = P(T > t) = 1 - F(t)$; the **hazard** $h(t) = \\dfrac{f(t)}{S(t)} = \\lim_{\\Delta \\to 0}\\dfrac{P(t \\le T < t + \\Delta \\mid T \\ge t)}{\\Delta}$; the **cumulative hazard** $H(t) = \\int_0^th(u)\\,du$; and $S(t) = e^{-H(t)}$. A constant hazard $\\lambda$ gives the exponential, $S(t) = e^{-\\lambda t}$ (§{uniform-exponential}); a Weibull with shape $k$ has a decreasing hazard if $k < 1$, constant if $k = 1$, increasing if $k > 1$.",
      body: "**Right censoring** (still event-free at last contact) is the usual kind; **left** and **interval** censoring occur when the event happened before, or between, inspections. **Left truncation** (delayed entry) means subjects are only seen if they survived to enter. Standard methods assume **non-informative censoring**: those censored have the same future risk as those who remain. Mean lifetime is $\\int_0^\\infty S(t)\\,dt$ (MTTF in reliability). A simple hazard estimate is events divided by total person-time at risk, and a **life table** groups time into intervals and multiplies the conditional survival in each.",
    },
    {
      type: "predict",
      misconception: "drop-censored",
      item: {
        kind: "mc",
        id: "svf-predict-1",
        prompt: "Of 100 patients, 30 died during follow-up and 70 were alive when the study ended (censored). Estimating median survival from the 30 deaths alone would",
        options: [
          { id: "a", text: "badly underestimate survival: it ignores the 70 who lasted longer", correct: true, why: "Survivors are the long-lived ones." },
          { id: "b", text: "be fine: censored patients have no event time to contribute", misconception: "drop-censored", why: "They contribute the fact that they survived so long." },
          { id: "c", text: "overestimate survival", why: "Using only the shorter, observed times biases it down." },
        ],
      },
      reveal: {
        body: "The 30 who died are, by construction, the ones with short times. The 70 censored patients each lasted at least until their last follow-up, information that shifts the survival curve up. Survival methods (§{kaplan-meier}) keep each censored subject in the risk set until they leave it, using exactly what is known.",
      },
      resolve: {
        kind: "mc",
        id: "svf-resolve-1",
        prompt: "A patient censored at 4 years contributes",
        options: [
          { id: "a", text: "the knowledge that they survived at least 4 years", correct: true, why: "They stay in the risk set until 4 years." },
          { id: "b", text: "nothing, so they should be dropped", misconception: "drop-censored", why: "Dropping them biases survival downwards." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "svf-check-1",
        prompt: "A component's hazard is 2.5 failures per year in its first weeks. This means",
        options: [
          { id: "a", text: "failures occur at a rate of 2.5 per unit-year among working units at that time", correct: true, why: "A hazard is a rate and can exceed 1." },
          { id: "b", text: "something is wrong: a probability can't exceed 1", misconception: "hazard-is-probability", why: "The hazard is a rate per unit time, not a probability." },
          { id: "c", text: "every unit fails 2.5 times", why: "It describes the event rate among units at risk." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "svf-check-2",
        prompt: "With constant hazard 0.1 per year, the probability of surviving 5 years is",
        options: [
          { id: "a", text: "$e^{-0.5} \\approx 0.607$", correct: true, why: "$S(t) = e^{-\\lambda t}$." },
          { id: "b", text: "0.5", why: "That would be $1 - 0.1 \\times 5$, which isn't how hazards compound." },
          { id: "c", text: "$0.9^5 \\approx 0.59$", why: "That treats the hazard as a yearly probability; close, but not the exponential model." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Customer churn, time to conversion and time to equipment failure are survival problems. Survival-aware models (random survival forests, DeepSurv, gradient-boosted Cox models) use censored data properly; plain classifiers predicting \"churned within a year\" waste or mislabel customers whose year isn't up.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "svf-produce-1", prompt: "3 failures occur over 1,500 unit-hours of testing. Estimate the constant failure rate per hour.", answer: 0.002, explain: "$3/1500$." },
        { kind: "number", id: "svf-produce-2", prompt: "With that rate, find the mean time to failure in hours.", answer: 500, explain: "$1/\\lambda$." },
        {
          kind: "mc",
          id: "svf-produce-3",
          prompt: "Customers still subscribed when data are pulled should be",
          options: [
            { id: "a", text: "treated as right-censored at their current tenure", correct: true, why: "They lasted at least that long." },
            { id: "b", text: "left out, since they haven't churned", misconception: "drop-censored", why: "That discards the longest-lasting customers." },
          ],
        },
        {
          kind: "mc",
          id: "svf-produce-4",
          prompt: "A hazard of 3 per year",
          options: [
            { id: "a", text: "is possible: it is a rate, not a probability", correct: true, why: "Rates can exceed 1." },
            { id: "b", text: "is impossible, since probabilities are at most 1", misconception: "hazard-is-probability", why: "Hazard has units of 1/time." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "svf-review-1", prompt: "The cumulative hazard at 2 years is 0.4. Find $S(2)$ to 3 decimals.", answer: Math.round(Math.exp(-0.4) * 1000) / 1000, tolerance: 0.001, explain: "$e^{-0.4}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "life tables",
      body: "Split time into intervals. For each, with $n$ entering, $d$ events and $c$ withdrawals (censored), the **actuarial** estimate assumes withdrawals occur mid-interval, so the effective number at risk is $n' = n - c/2$ and the conditional probability of the event is $q = d/n'$. Then $S$ at the end of interval $j$ is $\\prod_{i \\le j}(1 - q_i)$. Population life tables give $q_x$ for each age $x$ and underlie life expectancy and insurance pricing.",
    },
    {
      type: "definition",
      term: "the bathtub curve",
      body: "Many products show a **decreasing** hazard early (infant mortality from manufacturing defects), a roughly **constant** hazard in useful life (random failures), and an **increasing** hazard as they wear out. Weibull shapes $k < 1$, $k = 1$ and $k > 1$ model the three phases.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "survival from the hazard",
      statement: "$S(t) = \\exp\\!\\left(-\\int_0^th(u)\\,du\\right) = e^{-H(t)}$.",
      proof: ["$h(t) = f(t)/S(t) = -S'(t)/S(t) = -\\dfrac{d}{dt}\\ln S(t)$; integrate from 0, using $S(0) = 1$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "mean lifetime",
      statement: "For a non-negative $T$, $E[T] = \\int_0^\\infty S(t)\\,dt$. For the exponential, $1/\\lambda$; its median is $\\ln 2/\\lambda$.",
      proof: ["Write $T = \\int_0^\\infty\\mathbf{1}[T > t]\\,dt$ and take expectations. For the exponential, $\\int_0^\\infty e^{-\\lambda t}dt = 1/\\lambda$, and $e^{-\\lambda m} = \\tfrac12$ gives the median."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "Weibull hazard and survival",
      statement: "With scale $\\lambda$ and shape $k$: $S(t) = e^{-(t/\\lambda)^k}$, $h(t) = \\dfrac{k}{\\lambda}\\left(\\dfrac t\\lambda\\right)^{k-1}$, $H(t) = (t/\\lambda)^k$.",
      proof: ["Differentiate $H(t) = (t/\\lambda)^k$ to get $h$; then $S = e^{-H}$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Constant hazard 0.1 per year. Find $S(5)$, the mean and the median lifetime.",
      solution: ["$S(5) = e^{-0.5} \\approx 0.607$.", "Mean $1/0.1 = 10$ years; median $\\ln 2/0.1 \\approx 6.93$ years."],
      result: "0.607; 10 years; 6.93 years.",
    },
    {
      type: "example",
      level: 2,
      title: "a life-table interval",
      problem: "An interval starts with 100 patients; 10 die and 10 withdraw. Find the actuarial probability of death in the interval and the conditional survival.",
      solution: ["Effective number at risk $100 - 10/2 = 95$.", "$q = 10/95 \\approx 0.105$; conditional survival $\\approx 0.895$."],
      result: "$q \\approx 0.105$.",
    },
    {
      type: "example",
      level: 3,
      title: "Weibull wear-out",
      problem: "A Weibull with $\\lambda = 1000$ hours and $k = 2$. Find $S(500)$ and compare the hazards at 500 and 1000 hours.",
      solution: ["$S(500) = e^{-0.25} \\approx 0.779$.", "$h(t) = \\tfrac{2}{1000}(t/1000)$: $0.001$ at 500 hours and $0.002$ at 1000, doubling as the parts wear."],
      result: "0.779; the hazard doubles.",
    },
  ],
  pitfalls: [
    { wrong: "Drop censored subjects, or count them as events.", right: "Keep them at risk until their censoring time." },
    { wrong: "A hazard is a probability.", right: "It is a rate per unit time and can exceed 1." },
    { wrong: "Assume censoring is harmless whatever its cause.", right: "Methods assume non-informative censoring; sicker patients dropping out breaks it." },
  ],
  formulas: [
    { label: "Survival", tex: "S(t) = P(T > t) = e^{-H(t)}" },
    { label: "Hazard", tex: "h(t) = f(t)/S(t)" },
    { label: "Exponential", tex: "S(t) = e^{-\\lambda t},\\ E[T] = 1/\\lambda" },
    { label: "Weibull", tex: "S(t) = e^{-(t/\\lambda)^k}" },
  ],
  exercises: [
    ex(1, num("svfx-ex-1", "8 events occur over 400 person-years. Estimate the hazard per person-year.", 0.02, "$8/400$."), ["$0.02$."]),
    ex(1, num("svfx-ex-2", "Constant hazard 0.25 per year. Find the mean lifetime in years.", 4, "$1/0.25$."), ["$4$."]),
    ex(2, dp("svfx-ex-3", "Constant hazard 0.2 per year. Find $S(3)$.", Math.exp(-0.6), "$e^{-0.6}$."), ["$\\approx 0.549$."]),
    ex(2, dp("svfx-ex-4", "Constant hazard 0.05 per month. Find the median lifetime in months.", Math.log(2) / 0.05, "$\\ln 2/\\lambda$."), ["$\\approx 13.863$."]),
    ex(2, dp("svfx-ex-5", "Life-table interval: 200 enter, 20 die, 40 withdraw. Find the actuarial $q$.", 20 / 180, "$n' = 200 - 20$."), ["$20/180 \\approx 0.111$."]),
    ex(3, dp("svfx-ex-6", "Weibull, $\\lambda = 10$ years, $k = 0.5$. Find $S(2.5)$.", Math.exp(-Math.sqrt(0.25)), "$e^{-(0.25)^{0.5}}$."), ["$e^{-0.5} \\approx 0.607$; with $k < 1$ the hazard falls over time."]),
    ex(3, num("svfx-ex-7", "Two consecutive life-table intervals have conditional survival 0.9 and 0.8. Find $S$ at the end of the second.", 0.72, "Multiply."), ["$0.72$."]),
    ex(3, mc("svfx-ex-8", "In a trial, the sickest patients are more likely to drop out (be censored). This violates", ["non-informative censoring, so survival will look too good", "Those censored had higher risk than those remaining."], [["nothing: censoring is always fine", "Methods assume censoring unrelated to risk."], ["left truncation", "That concerns delayed entry."]]), ["Sensitivity analyses or inverse-probability-of-censoring weights help."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const lam = r.pick([0.02, 0.05, 0.1, 0.2, 0.25, 0.5]);
      const t = r.pick([1, 2, 3, 5, 10]);
      const want = lv === 1 ? "S" : r.pick(["S", "median", "F"] as const);
      const v = want === "S" ? Math.exp(-lam * t) : want === "F" ? 1 - Math.exp(-lam * t) : Math.log(2) / lam;
      const q = want === "S" ? `the probability of surviving beyond ${t} years` : want === "F" ? `the probability of the event within ${t} years` : "the median lifetime in years";
      return n(`Constant hazard ${lam} per year. Find ${q} (3 decimals).`, Math.round(v * 1000) / 1000, want === "median" ? `$\\ln 2/${lam} \\approx ${Math.round(v * 1000) / 1000}$.` : `$${want === "F" ? "1 - " : ""}e^{-${lam} \\times ${t}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const d = r.int(2, 30);
      const pt = r.pick([200, 400, 500, 1000, 2000, 5000]);
      return n(`${d} events occur over ${pt.toLocaleString("en-US")} person-years at risk. Estimate the hazard per person-year (4 decimals).`, Math.round((d / pt) * 10000) / 10000, `$${d}/${pt} = ${Math.round((d / pt) * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([100, 120, 200, 250]);
      const d = r.int(5, 30);
      const c = 2 * r.int(2, 15);
      const q = d / (nn - c / 2);
      return n(`A life-table interval starts with ${nn} subjects; ${d} have the event and ${c} withdraw. Find the actuarial probability of the event (3 decimals).`, Math.round(q * 1000) / 1000, `$n' = ${nn} - ${c}/2 = ${nn - c / 2}$; $q = ${d}/${nn - c / 2} \\approx ${Math.round(q * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const what = r.pick(["patients alive at the end of a trial", "machines still running when testing stops", "subscribers who haven't cancelled yet", "students still enrolled when data were collected"]);
      return mcNumbers(
        `In a time-to-event analysis, ${what} should be`,
        { text: "kept as right-censored observations", why: "They are known to have lasted at least that long." },
        [
          { text: "dropped from the data", why: "That biases survival downwards.", misconception: "drop-censored" },
          { text: "counted as events at their last time", why: "They haven't had the event." },
        ],
      );
    },
  },
];
