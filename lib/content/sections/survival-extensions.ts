import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Competing risks and cumulative incidence; recurrent events; frailty models; repairable systems; reliability demonstration testing; accelerated life testing. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const zeroFailN =(rel: number, conf: number) => Math.ceil(Math.log(1 - conf) / Math.log(rel));

const base: ConceptNode = {
  id: "survival-extensions",
  title: "Competing risks, recurrent events & reliability",
  summary: "Real event histories are messier than one event per subject. Patients can die of other causes before the one studied (competing risks); machines fail, are repaired and fail again (recurrent events); and some subjects are simply frailer than others in ways no covariate captures. Reliability engineering adds designs for proving a product is reliable and for speeding up failures with stress.",
  deps: ["cox-model", "poisson", "hierarchical-models"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "competing risk", meaning: "An event that prevents the event of interest from happening, such as death from another cause." },
    { term: "cumulative incidence", meaning: "$\\text{CIF}_k(t)$: the probability of having event type $k$ by time $t$, allowing for competing events." },
    { term: "frailty", meaning: "An unobserved, subject-level multiplier of the hazard, capturing heterogeneity no covariate explains." },
  ],
  misconceptions: {
    "competing-as-censored": "Estimates the risk of one cause as one minus Kaplan–Meier, treating competing events as censored, which overstates that risk.",
    "frailty-hazard-decline": "Reads a falling population hazard as each individual's risk falling, when frail subjects dropping out can produce it.",
  },
  steps: [
    {
      type: "motivate",
      title: "Other things happen first",
      body: "In a study of elderly patients' risk of a second hip fracture, many die before any fracture. Treating those deaths as censored pretends they could still fracture later, inflating the estimated fracture risk. Similarly, a pump that fails three times in a year is one pump with recurrent failures, not three independent pumps.",
      realWorld: {
        title: "Accelerated testing",
        body: "A chip meant to last 10 years can't be tested for 10 years. Manufacturers run chips hot, at high voltage or humidity, and use physical models such as the Arrhenius law to translate weeks of stressed testing into years of normal use.",
      },
    },
    {
      type: "truth",
      statement: "With competing event types $k$, the **cause-specific hazard** $h_k(t)$ is the rate of type-$k$ events among those still event-free, and the **cumulative incidence** is $\\text{CIF}_k(t) = \\int_0^th_k(u)S(u)\\,du$, where $S$ is the probability of no event of any type. Then $\\sum_k\\text{CIF}_k(t) = 1 - S(t)$. Using $1 - \\hat S_{\\text{KM}}$ with competing events censored overstates $\\text{CIF}_k$.",
      body: "Covariate effects can be modelled on cause-specific hazards (Cox per cause) or on the **subdistribution hazard** (Fine–Gray), which links directly to the CIF. **Recurrent events** are modelled by event rates over time at risk (Poisson or negative binomial counts, §{poisson}) or extended Cox models (Andersen–Gill), with the **mean cumulative function** as the descriptive curve. **Frailty models** put $h(t \\mid z) = z\\,h_0(t)e^{\\vec\\beta^{\\mathsf T}\\vec x}$ with $z$ random (often Gamma, mean 1), the survival analogue of random effects (§{hierarchical-models}). **Repairable systems** follow point processes; the power-law (Crow–AMSAA) intensity $\\lambda\\beta t^{\\beta - 1}$ shows reliability growth if $\\beta < 1$ and deterioration if $\\beta > 1$.",
    },
    {
      type: "predict",
      misconception: "competing-as-censored",
      item: {
        kind: "mc",
        id: "sve-predict-1",
        prompt: "10 patients, none censored: deaths from other causes at 1 and 3 years, cancer deaths at 2 and 4, six alive at 5. The true 5-year cancer risk is 0.2. Computing $1 - \\hat S_{\\text{KM}}$ with other deaths as censored gives",
        options: [
          { id: "a", text: "about 0.24, too high", correct: true, why: "It treats the two who died of other causes as if they could still get cancer." },
          { id: "b", text: "exactly 0.2", misconception: "competing-as-censored", why: "Censoring assumes those removed remain at risk." },
          { id: "c", text: "0.4", why: "That counts all four deaths." },
        ],
      },
      reveal: {
        body: "Censoring at 1 leaves 9 at risk at year 2: factor $8/9$. Censoring at 3 leaves 7 at risk at year 4: factor $6/7$. So $1 - \\hat S = 1 - \\tfrac89 \\times \\tfrac67 \\approx 0.238$. The real cumulative incidence is $2/10 = 0.2$: those who died of other causes can never die of cancer. The CIF uses the overall survival to account for this.",
      },
      resolve: {
        kind: "mc",
        id: "sve-resolve-1",
        prompt: "With competing risks, the probability of a specific event by time $t$ should be estimated by",
        options: [
          { id: "a", text: "the cumulative incidence function", correct: true, why: "It allows for those removed by competing events." },
          { id: "b", text: "one minus Kaplan–Meier, censoring competing events", misconception: "competing-as-censored", why: "That overstates the risk." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sve-check-1",
        prompt: "A population's hazard of relapse falls steadily over the years after treatment. This shows",
        options: [
          { id: "a", text: "possibly only selection: frail patients relapse early, leaving the robust", correct: true, why: "Unobserved heterogeneity makes the population hazard fall even if each person's is constant." },
          { id: "b", text: "that each patient's risk declines with time", misconception: "frailty-hazard-decline", why: "Population and individual hazards can differ." },
          { id: "c", text: "the data are wrong", why: "It is a common, real pattern." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sve-check-2",
        prompt: "30 failures occur over 600 machine-months across a fleet of repairable machines. The failure rate is",
        options: [
          { id: "a", text: "0.05 per machine-month", correct: true, why: "$30/600$." },
          { id: "b", text: "20 per machine-month", why: "Divide events by exposure, not the reverse." },
          { id: "c", text: "0.5", why: "Check the division." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Customer journeys have competing outcomes (churn, upgrade, downgrade) and recurrent events (purchases, support tickets). Multi-state and recurrent-event models describe them better than a single classifier, and frailty ideas appear as customer-level random effects.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "sve-produce-1", prompt: "To show reliability at least 0.9 with 90% confidence and zero failures, how many units must pass the test?", answer: 22, explain: "$n \\ge \\ln 0.1/\\ln 0.9 = 21.9$." },
        { kind: "number", id: "sve-produce-2", prompt: "An accelerated test has acceleration factor 50. 200 hours at stress corresponds to how many hours of normal use?", answer: 10000, explain: "$200 \\times 50$." },
        {
          kind: "mc",
          id: "sve-produce-3",
          prompt: "Estimating the risk of kidney failure in elderly patients, deaths before kidney failure should be",
          options: [
            { id: "a", text: "handled as a competing risk, using the cumulative incidence function", correct: true, why: "The dead can't later have kidney failure." },
            { id: "b", text: "censored, with risk taken as one minus Kaplan–Meier", misconception: "competing-as-censored", why: "That overstates the risk." },
          ],
        },
        {
          kind: "mc",
          id: "sve-produce-4",
          prompt: "A gamma frailty model fits well and each individual's hazard is constant, yet the population hazard falls. The fall is due to",
          options: [
            { id: "a", text: "high-frailty individuals leaving the risk set early", correct: true, why: "The survivors are increasingly the robust." },
            { id: "b", text: "each person's risk falling over time", misconception: "frailty-hazard-decline", why: "Individual hazards are constant here." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "sve-review-1", prompt: "12 failures over 400 unit-years of a repairable system. Find the failure rate per unit-year.", answer: 0.03, explain: "$12/400$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "reliability demonstration",
      body: "A **zero-failure** demonstration tests $n$ units for the mission time; if none fail, reliability $R_0$ is shown with confidence $C$ when $R_0^n \\le 1 - C$, that is $n \\ge \\dfrac{\\ln(1 - C)}{\\ln R_0}$. Allowing some failures, or testing longer than the mission (using a Weibull shape), changes the count.",
    },
    {
      type: "definition",
      term: "accelerated life testing",
      body: "Stress speeds failure in a known way. For temperature, the **Arrhenius** model gives the acceleration factor $\\text{AF} = \\exp\\!\\left[\\dfrac{E_a}{k}\\left(\\dfrac1{T_{\\text{use}}} - \\dfrac1{T_{\\text{stress}}}\\right)\\right]$ (temperatures in kelvin, $E_a$ the activation energy, $k$ Boltzmann's constant); for voltage, an **inverse power law** $\\text{AF} = (V_{\\text{stress}}/V_{\\text{use}})^n$. Life at use conditions is life under stress times AF, assuming the failure mechanism is unchanged.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "cumulative incidences add up",
      statement: "$\\sum_k\\text{CIF}_k(t) = 1 - S(t)$, the probability of any event by $t$; each $\\text{CIF}_k(t) \\le 1 - S_{\\text{KM},k}(t)$ computed with other events censored.",
      proof: [
        "$\\sum_k\\int_0^th_kS = \\int_0^thS = \\int_0^tf = 1 - S(t)$, with $h = \\sum_kh_k$ the all-cause hazard.",
        "Censoring competing events keeps those subjects notionally at risk, so the estimated survival from cause $k$ is too low.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "frailty bends the population hazard",
      statement: "If each individual has constant hazard $z\\lambda$ with $z \\sim \\text{Gamma}$(mean 1, variance $\\theta$), the population hazard is $\\dfrac{\\lambda}{1 + \\theta\\lambda t}$, which falls over time.",
      proof: ["Population survival $E[e^{-z\\lambda t}] = (1 + \\theta\\lambda t)^{-1/\\theta}$ (the Gamma moment generating function, §{mgf}); differentiate $-\\ln S$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "zero-failure sample size",
      statement: "$n = \\left\\lceil\\dfrac{\\ln(1 - C)}{\\ln R_0}\\right\\rceil$ units with no failures demonstrate reliability $R_0$ at confidence $C$.",
      proof: ["If true reliability were only $R_0$, all $n$ would pass with probability $R_0^n$; require this to be at most $1 - C$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "10 patients, none censored: other-cause deaths at 1 and 3, cancer deaths at 2 and 4, six alive at 5. Find the cancer and other-cause cumulative incidences at 5.",
      solution: ["With no censoring, each CIF is the proportion with that event: cancer $2/10 = 0.2$, other $2/10 = 0.2$.", "They sum to $0.4 = 1 - S(5)$."],
      result: "0.2 and 0.2.",
    },
    {
      type: "example",
      level: 2,
      title: "a demonstration test",
      problem: "How many units must pass with no failures to show 95% reliability at 90% confidence?",
      solution: ["$n \\ge \\ln 0.1/\\ln 0.95 = 2.3026/0.0513 \\approx 44.9$.", "Test 45 units."],
      result: "45 units.",
    },
    {
      type: "example",
      level: 3,
      title: "reliability growth",
      problem: "A prototype's failures follow the power-law process with $\\beta = 0.6$. Is reliability improving, and how does the failure intensity at 400 hours compare with that at 100?",
      solution: ["$\\beta < 1$: the intensity $\\lambda\\beta t^{\\beta - 1}$ falls, so reliability is growing as faults are fixed.", "Ratio $(400/100)^{-0.4} = 4^{-0.4} \\approx 0.574$."],
      result: "Improving; intensity about 57% of its value at 100 hours.",
    },
  ],
  pitfalls: [
    { wrong: "Treat competing events as censoring and report one minus Kaplan–Meier.", right: "Use cumulative incidence." },
    { wrong: "A falling population hazard means individual risk falls.", right: "Frailty selection can produce it." },
    { wrong: "Analyse repeated failures of one machine as independent units.", right: "Use recurrent-event or point-process models." },
  ],
  formulas: [
    { label: "CIF", tex: "\\text{CIF}_k(t) = \\int_0^th_k(u)S(u)\\,du" },
    { label: "Frailty", tex: "h(t \\mid z) = z\\,h_0(t)e^{\\vec\\beta^{\\mathsf T}\\vec x}" },
    { label: "Zero-failure test", tex: "n \\ge \\ln(1 - C)/\\ln R_0" },
    { label: "Power-law intensity", tex: "\\lambda\\beta t^{\\beta - 1}" },
  ],
  exercises: [
    ex(1, num("svex-ex-1", "200 patients, no censoring: 30 die of heart disease and 50 of other causes by 10 years. Find the heart-disease cumulative incidence.", 0.15, "$30/200$."), ["$0.15$."]),
    ex(1, num("svex-ex-2", "45 failures over 1,500 machine-hours. Find the failure rate per machine-hour.", 0.03, "$45/1500$."), ["$0.03$."]),
    ex(2, num("svex-ex-3", "How many units must pass with no failures to show 99% reliability at 95% confidence?", zeroFailN(0.99, 0.95), "$\\ln 0.05/\\ln 0.99$."), ["$298.1 \\to 299$ units."]),
    ex(2, dp("svex-ex-4", "Gamma frailty with $\\theta = 1$ and individual hazard $\\lambda = 0.2$. Find the population hazard at $t = 5$.", 0.2 / (1 + 5 * 0.2), "$\\lambda/(1 + \\theta\\lambda t)$."), ["$0.2/2 = 0.1$: half the individual rate."]),
    ex(2, num("svex-ex-5", "Voltage acceleration with inverse power law exponent $n = 3$: stress 2 times the use voltage. Find the acceleration factor.", 8, "$2^3$."), ["$8$."]),
    ex(3, fr("svex-ex-6", "Same 10 patients as above, but treating other-cause deaths as censored. Find $1 - \\hat S_{\\text{KM}}$ for cancer at 5 years.", 1 - (8 / 9) * (6 / 7), "Risk sets of 9 at year 2 and 7 at year 4."), ["$1 - \\tfrac89 \\times \\tfrac67 = 1 - \\tfrac{48}{63} \\approx 0.238$, above the true 0.2."]),
    ex(3, mc("svex-ex-7", "A repairable system's power-law shape is estimated as $\\beta = 1.4$. The system is", ["deteriorating: failures are becoming more frequent", "$\\beta > 1$ means rising intensity."], [["improving", "That needs $\\beta < 1$."], ["as good as new after each repair", "That is a renewal assumption, not shown by $\\beta$."]]), ["Plan replacement or overhaul."]),
    ex(3, mc("svex-ex-8", "Accelerated testing at very high temperature produces a new failure mode never seen in use. The test results", ["can't be extrapolated to use conditions by the acceleration model", "The model assumes the same failure mechanism."], [["are still valid with a larger AF", "The mechanism changed."], ["show the product is more reliable", "They show nothing about use-condition life."]]), ["Keep stress within the range where the mechanism is unchanged."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const rel = r.pick([0.8, 0.9, 0.95, 0.99]);
      const conf = r.pick([0.8, 0.9, 0.95]);
      const v = zeroFailN(rel, conf);
      return n(`How many units must pass a zero-failure test to demonstrate reliability ${rel} at ${Math.round(conf * 100)}% confidence?`, v, `$\\ln ${r2(1 - conf)}/\\ln ${rel} \\approx ${r2(Math.log(1 - conf) / Math.log(rel))}$, so ${v} units.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 40);
      const exp = r.pick([200, 500, 800, 1000, 2000]);
      return n(`${k} failures occur over ${exp.toLocaleString("en-US")} unit-months across a fleet. Find the failure rate per unit-month (4 decimals).`, Math.round((k / exp) * 10000) / 10000, `$${k}/${exp} = ${Math.round((k / exp) * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = 10 * r.int(10, 30);
      const a = r.int(5, 40);
      const b = r.int(5, 40);
      return n(`${nn} subjects followed with no censoring: ${a} have event A and ${b} the competing event B. Find the cumulative incidence of A (3 decimals).`, Math.round((a / nn) * 1000) / 1000, `$${a}/${nn} \\approx ${Math.round((a / nn) * 1000) / 1000}$; B's ${b} subjects can no longer have A${lv === 3 ? ", so they must not be treated as censored" : ""}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick(["dementia", "a second stroke", "hip fracture", "kidney failure"]);
      return mcNumbers(
        `Estimating the 10-year risk of ${v} in people over 80, deaths from other causes should be`,
        { text: "treated as a competing risk", why: "Those who die can't later develop the outcome." },
        [{ text: "censored, using one minus Kaplan–Meier", why: "That overstates the risk.", misconception: "competing-as-censored" }],
      );
    },
  },
];
