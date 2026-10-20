import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The Kaplan–Meier estimator, Greenwood's variance, median survival, and the log-rank test. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Kaplan–Meier at the end of the data: times with true = event, false = censored. */
const km = (data: [number, boolean][]) => {
  const sorted = [...data].sort((a, b) => a[0] - b[0] || (a[1] === b[1] ? 0 : a[1] ? -1 : 1));
  let s = 1;
  let atRisk = sorted.length;
  let i = 0;
  while (i < sorted.length) {
    const t = sorted[i][0];
    let d = 0;
    let leaving = 0;
    while (i < sorted.length && sorted[i][0] === t) {
      if (sorted[i][1]) d++;
      leaving++;
      i++;
    }
    if (d > 0) s *= 1 - d / atRisk;
    atRisk -= leaving;
  }
  return s;
};

const base: ConceptNode = {
  id: "kaplan-meier",
  title: "Kaplan–Meier & the log-rank test",
  summary: "The Kaplan–Meier estimator builds a survival curve from censored data as a product of conditional survival probabilities, one factor at each event time, with censored subjects counted at risk until they leave. The log-rank test compares two or more curves by comparing observed and expected events at every event time.",
  deps: ["survival-functions", "chi-square"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "risk set", meaning: "Those still under observation and event-free just before time $t$; its size is $n_i$." },
    { term: "Kaplan–Meier estimator", meaning: "$\\hat S(t) = \\prod_{t_i \\le t}(1 - d_i/n_i)$, the product-limit estimate of the survival function." },
    { term: "log-rank test", meaning: "A test that two or more survival curves are equal, summing observed minus expected events over event times." },
  ],
  misconceptions: {
    "km-censored-events": "Counts censoring times as events, making the Kaplan–Meier curve drop at them.",
    "logrank-any-difference": "Expects the log-rank test to detect any difference between survival curves, including curves that cross.",
  },
  steps: [
    {
      type: "motivate",
      title: "Survival, one step at a time",
      body: "To survive two years you must survive the first year, and then survive the second given you made it through the first. Kaplan and Meier's 1958 idea was to estimate each of those conditional steps from whoever is still being followed at that moment, so censored patients count for as long as we saw them.",
      realWorld: {
        title: "The most cited statistics paper",
        body: "Kaplan and Meier's paper is among the most cited in all of science. Almost every clinical trial with a time-to-event outcome shows Kaplan–Meier curves for each arm, with a log-rank p-value.",
      },
    },
    {
      type: "truth",
      statement: "At each distinct event time $t_i$ with $n_i$ at risk and $d_i$ events, the conditional survival is $1 - d_i/n_i$, and $\\hat S(t) = \\prod_{t_i \\le t}\\left(1 - \\dfrac{d_i}{n_i}\\right)$. Censored subjects leave the risk set after their censoring time without causing a drop. Greenwood's formula gives $\\widehat{\\operatorname{Var}}\\,\\hat S(t) = \\hat S(t)^2\\sum_{t_i \\le t}\\dfrac{d_i}{n_i(n_i - d_i)}$. The **median survival** is the first time $\\hat S(t) \\le 0.5$.",
      body: "The **log-rank test** compares groups: at each event time, if the groups had the same hazard, the expected events in group 1 would be $E_{1i} = d_i\\,n_{1i}/n_i$. Summing $O_1 - E_1$ over event times and dividing its square by its variance gives an approximately $\\chi^2_1$ statistic (§{chi-square}). It weights every event time equally and is most powerful when hazards are proportional; when curves **cross**, early and late differences cancel and it can miss a real difference, so weighted versions or restricted mean survival time are used instead.",
    },
    {
      type: "predict",
      misconception: "km-censored-events",
      item: {
        kind: "mc",
        id: "kmp-predict-1",
        prompt: "Six patients: deaths at 2 and 5 months, censored at 3 months, deaths at 6 and 6 months, censored at 8 months. What happens to $\\hat S$ at 3 months?",
        options: [
          { id: "a", text: "Nothing: the censored patient leaves the risk set, but $\\hat S$ only drops at deaths", correct: true, why: "Censoring reduces $n$ for later times." },
          { id: "b", text: "It drops, because a patient left", misconception: "km-censored-events", why: "Censoring isn't an event." },
          { id: "c", text: "It rises", why: "A survival estimate never increases." },
        ],
      },
      reveal: {
        body: "At 2 months: $n = 6$, $d = 1$, so $\\hat S = 5/6$. At 3 months one patient is censored: no drop, but only 4 remain at risk. At 5 months: $\\hat S = \\tfrac56 \\times \\tfrac34 = 0.625$. At 6 months, 2 of 3 die: $\\hat S = 0.625 \\times \\tfrac13 \\approx 0.208$. The censored patient helped by counting in the risk set at 2 months, and nothing more.",
      },
      resolve: {
        kind: "mc",
        id: "kmp-resolve-1",
        prompt: "In a Kaplan–Meier curve, a censoring time",
        options: [
          { id: "a", text: "reduces the number at risk afterwards but causes no drop", correct: true, why: "Drops happen only at events." },
          { id: "b", text: "causes a drop like an event", misconception: "km-censored-events", why: "That would treat survivors as deaths." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kmp-check-1",
        prompt: "Treatment A's survival curve is lower early but higher after 2 years; the curves cross. A log-rank test gives p = 0.6. This means",
        options: [
          { id: "a", text: "the log-rank test may have missed a real difference: early and late differences cancel", correct: true, why: "It is built for proportional hazards." },
          { id: "b", text: "the treatments have the same survival", misconception: "logrank-any-difference", why: "Crossing curves differ, but the test's summary can cancel out." },
          { id: "c", text: "A is better", why: "The test alone doesn't say." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kmp-check-2",
        prompt: "At an event time, 20 are at risk (10 in each group) and 4 events occur, 3 in group 1. The expected number in group 1 is",
        options: [
          { id: "a", text: "2", correct: true, why: "$4 \\times 10/20$." },
          { id: "b", text: "3", why: "That is the observed number." },
          { id: "c", text: "1.5", why: "Use the group's share of the risk set." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Kaplan–Meier curves are the standard first look at churn and time-to-conversion data, split by segment or experiment arm. The concordance index, the survival analogue of AUC, evaluates predictive survival models, and censoring-aware metrics are essential when many customers are still active.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "kmp-produce-1", prompt: "10 at risk, 2 events at the first event time; 6 at risk, 3 events at the second. Find $\\hat S$ after the second.", answer: 0.4, explain: "$0.8 \\times 0.5$." },
        { kind: "number", id: "kmp-produce-2", prompt: "Same data. How many were censored between the two event times?", answer: 2, explain: "$10 - 2 - 6$." },
        {
          kind: "mc",
          id: "kmp-produce-3",
          prompt: "Five patients: death at 1, censored at 2, death at 3 (with 3 at risk), others alive at 5. $\\hat S(3)$ is",
          options: [
            { id: "a", text: "$\\tfrac45 \\times \\tfrac23 \\approx 0.533$", correct: true, why: "Drops at 1 and 3 only." },
            { id: "b", text: "$\\tfrac45 \\times \\tfrac34 \\times \\tfrac23 = 0.4$", misconception: "km-censored-events", why: "That adds a drop for the censored patient." },
          ],
        },
        {
          kind: "mc",
          id: "kmp-produce-4",
          prompt: "Two survival curves cross at 18 months. To compare them, the plain log-rank test",
          options: [
            { id: "a", text: "may have low power; consider restricted mean survival time or weighted tests", correct: true, why: "Opposite differences cancel." },
            { id: "b", text: "is ideal, since it detects any difference", misconception: "logrank-any-difference", why: "It targets proportional hazards." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "kmp-review-1", prompt: "20 at risk and 5 events at the first event time. Find $\\hat S$ just after it.", answer: 0.75, explain: "$1 - 5/20$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the log-rank statistic",
      body: "Summing over event times, $O_1 = \\sum d_{1i}$, $E_1 = \\sum d_i n_{1i}/n_i$ and $V = \\sum\\dfrac{d_i\\,n_{1i}\\,n_{2i}\\,(n_i - d_i)}{n_i^2(n_i - 1)}$. Then $\\chi^2 = (O_1 - E_1)^2/V$ on 1 degree of freedom. With $k$ groups it has $k - 1$ degrees of freedom.",
    },
    {
      type: "definition",
      term: "restricted mean survival time",
      body: "The **RMST** up to a horizon $\\tau$ is $\\int_0^\\tau\\hat S(t)\\,dt$, the area under the Kaplan–Meier curve: the average event-free time over the first $\\tau$ units. Comparing RMSTs gives a difference in time (\"3.2 months longer on average over 5 years\") that stays meaningful when hazards aren't proportional.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "why the product works",
      statement: "$S(t_k) = \\prod_{i \\le k}P(T > t_i \\mid T > t_{i-1})$, and with non-informative censoring each factor is estimated without bias by $1 - d_i/n_i$ from those at risk.",
      proof: ["Chain the conditional probabilities (§{conditional-probability}): $P(T > t_k) = P(T > t_1)P(T > t_2 \\mid T > t_1)\\cdots$. Between event times the estimated hazard is 0, so $\\hat S$ is flat there."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "no censoring",
      statement: "With no censored observations, $\\hat S(t)$ equals the proportion of subjects whose event time exceeds $t$.",
      proof: ["The product telescopes: each $n_{i+1} = n_i - d_i$, so $\\prod(1 - d_i/n_i) = \\prod n_{i+1}/n_i = n_{\\text{remaining}}/n$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "reading a Kaplan–Meier plot",
      statement: "Show the number at risk beneath the curve and mark censoring with ticks; the curve becomes unreliable where few remain at risk. Report median survival with a confidence interval, and survival at fixed times (for example 1 and 5 years).",
      proof: ["Late steps rest on few subjects, so their Greenwood variance is large."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Six patients: deaths at 2, 5, 6, 6; censored at 3 and 8. Compute $\\hat S$ and the median survival.",
      solution: ["$t = 2$: $5/6$. $t = 5$ (4 at risk): $\\tfrac56 \\times \\tfrac34 = 0.625$. $t = 6$ (3 at risk, 2 deaths): $0.625 \\times \\tfrac13 \\approx 0.208$.", "The first time $\\hat S \\le 0.5$ is 6 months: the median."],
      result: "Median 6 months.",
    },
    {
      type: "example",
      level: 2,
      title: "Greenwood",
      problem: "At the first event time 10 are at risk and 2 die. Find $\\hat S$ and its standard error.",
      solution: ["$\\hat S = 0.8$.", "$\\text{Var} = 0.64 \\times \\dfrac{2}{10 \\times 8} = 0.016$; SE $\\approx 0.126$."],
      result: "$0.8 \\pm 0.126$.",
    },
    {
      type: "example",
      level: 3,
      title: "one log-rank term",
      problem: "At one event time, 10 are at risk in each group and 4 events occur, 3 in group 1. Find $O_1 - E_1$ and the variance contribution.",
      solution: ["$E_1 = 4 \\times 10/20 = 2$, so $O_1 - E_1 = 1$.", "$V = \\dfrac{4 \\times 10 \\times 10 \\times 16}{400 \\times 19} \\approx 0.842$."],
      result: "$O - E = 1$; $V \\approx 0.842$.",
    },
  ],
  pitfalls: [
    { wrong: "Drop the curve at censoring times.", right: "Censoring only shrinks the risk set." },
    { wrong: "A non-significant log-rank test means the curves are the same.", right: "Crossing curves can cancel out; look at the curves and RMST." },
    { wrong: "Trust the far right of the curve.", right: "Few remain at risk there; show numbers at risk and intervals." },
  ],
  formulas: [
    { label: "Kaplan–Meier", tex: "\\hat S(t) = \\textstyle\\prod_{t_i \\le t}(1 - d_i/n_i)" },
    { label: "Greenwood", tex: "\\hat S^2\\textstyle\\sum d_i/(n_i(n_i - d_i))" },
    { label: "Expected events", tex: "E_{1i} = d_in_{1i}/n_i" },
    { label: "Log-rank", tex: "\\chi^2 = (O_1 - E_1)^2/V" },
  ],
  exercises: [
    ex(1, num("kmpx-ex-1", "8 at risk and 2 events at the first event time. Find $\\hat S$.", 0.75, "$1 - 2/8$."), ["$0.75$."]),
    ex(1, num("kmpx-ex-2", "Conditional survivals at three event times are 0.9, 0.8 and 0.5. Find $\\hat S$ after the third.", 0.36, "Multiply."), ["$0.36$."]),
    ex(2, fr("kmpx-ex-3", "Times (months): 1, 3+, 4, 4+, 6, 7+ (+ means censored). Find $\\hat S$ at 6 months.", km([[1, true], [3, false], [4, true], [4, false], [6, true], [7, false]]), "Drops at 1, 4 and 6."), ["$\\tfrac56 \\times \\tfrac34 \\times \\tfrac12 = \\tfrac{5}{16} \\approx 0.3125$. At 4 months the death counts before the censoring at the same time."]),
    ex(2, dp("kmpx-ex-4", "Same data. Find the Greenwood variance of $\\hat S$ just after 1 month.", (25 / 36) * (1 / 30), "$\\hat S^2 \\times \\tfrac{1}{6 \\times 5}$."), ["$\\tfrac{25}{36} \\times \\tfrac1{30} \\approx 0.023$."]),
    ex(2, num("kmpx-ex-5", "An event time has 12 at risk in group 1, 8 in group 2, and 5 events. Find the expected events in group 1.", 3, "$5 \\times 12/20$."), ["$3$."]),
    ex(3, num("kmpx-ex-6", "Over all event times, $O_1 = 18$, $E_1 = 12$ and $V = 9$. Find the log-rank $\\chi^2$.", 4, "$36/9$."), ["$4 > 3.84$: significant at 5%."]),
    ex(3, mc("kmpx-ex-7", "Kaplan–Meier curves for two arms cross at 1 year, and the log-rank p is 0.45. The best next step is", ["compare restricted mean survival or survival at fixed times", "These remain meaningful when hazards aren't proportional."], [["conclude no difference", "Crossing curves differ."], ["drop the late data", "That discards information."]]), ["Also check the proportional-hazards assumption formally."]),
    ex(3, mc("kmpx-ex-8", "With no censoring, the Kaplan–Meier estimate at time $t$ equals", ["the proportion surviving beyond $t$", "The product telescopes."], [["the mean survival time", "It is a proportion."], ["the hazard at $t$", "It is a survival probability."]]), ["KM generalises the empirical survival proportion."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 4 + lv;
      const times = new Set<number>();
      while (times.size < k) times.add(r.int(1, 24));
      const data: [number, boolean][] = [...times].sort((a, b) => a - b).map((t) => [t, r.pick([true, true, false])]);
      if (!data.some((d) => d[1])) data[0][1] = true;
      const s = km(data);
      return n(`Survival times in months (+ means censored): ${data.map(([t, e]) => `${t}${e ? "" : "+"}`).join(", ")}. Find the Kaplan–Meier estimate after the last time (3 decimals).`, Math.round(s * 1000) / 1000, `Multiply $1 - 1/n_i$ at each death, shrinking the risk set after every time: $\\hat S \\approx ${Math.round(s * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const n1 = r.int(5, 30);
      const n2 = r.int(5, 30);
      const d = r.int(1, 6);
      const e = (d * n1) / (n1 + n2);
      return n(`At an event time, ${n1} are at risk in group 1 and ${n2} in group 2, and ${d} events occur. Find the expected events in group 1 under equal hazards (3 decimals).`, Math.round(e * 1000) / 1000, `$${d} \\times ${n1}/${n1 + n2} \\approx ${Math.round(e * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const t = r.pick([6, 12, 18, 24]);
      return mcNumbers(
        `Two survival curves cross at ${t} months and the log-rank test gives p = 0.5. Conclude that`,
        { text: "the test may have missed a difference; compare RMST or fixed-time survival", why: "Early and late differences cancel in the log-rank sum." },
        [
          { text: "the groups have the same survival", why: "Crossing curves aren't equal.", misconception: "logrank-any-difference" },
          { text: "one group is clearly better throughout", why: "Crossing means neither is better throughout." },
        ],
      );
    },
  },
];
