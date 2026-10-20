import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Designs for unmeasured confounding: instrumental variables and two-stage least squares, difference-in-differences, regression discontinuity, synthetic control. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "quasi-experiments",
  title: "Instruments, differences-in-differences & discontinuities",
  summary: "When important confounders are unmeasured, adjustment fails, but some situations hand us something close to an experiment. An instrument shifts treatment without touching the outcome otherwise. Difference-in-differences compares changes over time between groups. A regression discontinuity compares units just either side of a cut-off. Synthetic control builds a comparison unit from a weighted blend of others.",
  deps: ["propensity-scores", "regression-inference"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "instrument", meaning: "A variable that affects the treatment, affects the outcome only through the treatment, and is unrelated to the confounders." },
    { term: "parallel trends", meaning: "The assumption that, without treatment, the treated and comparison groups would have changed by the same amount." },
    { term: "running variable", meaning: "The score whose cut-off decides treatment in a regression discontinuity, such as an exam mark." },
  ],
  misconceptions: {
    "iv-any-correlate": "Treats any variable correlated with the treatment as a valid instrument, ignoring the exclusion and independence conditions.",
    "did-equal-levels": "Thinks difference-in-differences needs the groups to start at the same level, rather than to share the same trend.",
  },
  steps: [
    {
      type: "motivate",
      title: "Nature's experiments",
      body: "Did a minimum-wage rise cost jobs? Restaurants in the state that raised it can be compared with restaurants just across the border, before and after. Does a scholarship raise graduation rates? Compare students who scored just above the cut-off with those just below. Clever comparisons like these can stand in for randomisation when confounders can't all be measured.",
      realWorld: {
        title: "A Nobel for natural experiments",
        body: "The 2021 economics Nobel prize went to David Card, Joshua Angrist and Guido Imbens for natural experiments: Card's minimum-wage study across the New Jersey–Pennsylvania border, and Angrist and Imbens' work on what instruments estimate.",
      },
    },
    {
      type: "truth",
      statement: "**Instrumental variables**: if $Z$ affects $T$ (relevance), affects $Y$ only through $T$ (exclusion) and is independent of the confounders, then for binary $Z$ the **Wald estimator** $\\dfrac{E[Y \\mid Z = 1] - E[Y \\mid Z = 0]}{E[T \\mid Z = 1] - E[T \\mid Z = 0]}$ estimates the effect for **compliers**, those whose treatment $Z$ changes (the LATE). **Two-stage least squares** generalises it: regress $T$ on $Z$, then $Y$ on the fitted $\\hat T$. **Difference-in-differences**: $\\hat\\tau = (\\bar Y_{T,\\text{after}} - \\bar Y_{T,\\text{before}}) - (\\bar Y_{C,\\text{after}} - \\bar Y_{C,\\text{before}})$, valid under **parallel trends**.",
      body: "A weak instrument (first-stage F below about 10) gives unreliable, biased estimates. Parallel trends can't be tested directly, but similar pre-treatment trends (an event-study plot) make it plausible. In a **regression discontinuity**, treatment switches on at a cut-off $c$ in a running variable; units just above and below are comparable, so the jump in $E[Y]$ at $c$ estimates the effect there. It is **sharp** if the cut-off fully decides treatment and **fuzzy** (an IV at the cut-off) if it only shifts the probability; check that units can't manipulate their score. **Synthetic control** compares one treated unit with a weighted combination of untreated units chosen to match its pre-treatment path.",
    },
    {
      type: "predict",
      misconception: "did-equal-levels",
      item: {
        kind: "mc",
        id: "qex-predict-1",
        prompt: "City A's unemployment is always about 3 points higher than city B's; both have moved in parallel for a decade. A training scheme starts in A. Can difference-in-differences estimate its effect?",
        options: [
          { id: "a", text: "Yes: what matters is parallel trends, and the constant gap is differenced away", correct: true, why: "DiD compares changes, not levels." },
          { id: "b", text: "No: the cities must start at the same level", misconception: "did-equal-levels", why: "A fixed difference in levels cancels out." },
          { id: "c", text: "Only with a randomised trial", why: "DiD is designed for exactly this observational setting." },
        ],
      },
      reveal: {
        body: "DiD subtracts each city's own before-period, so any permanent difference between them disappears. What it needs is that A would have changed by the same amount as B without the scheme. A decade of parallel movement is the kind of pre-trend evidence that supports this.",
      },
      resolve: {
        kind: "mc",
        id: "qex-resolve-1",
        prompt: "The key assumption of difference-in-differences is that, without treatment, the groups would have",
        options: [
          { id: "a", text: "changed by the same amount", correct: true, why: "Parallel trends." },
          { id: "b", text: "had the same level", misconception: "did-equal-levels", why: "Level differences cancel." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qex-check-1",
        prompt: "To estimate the effect of education on earnings, a researcher uses parents' income as an instrument for years of schooling. The main problem is",
        options: [
          { id: "a", text: "parents' income can affect earnings directly (connections, inheritance), breaking exclusion", correct: true, why: "An instrument must affect the outcome only through the treatment." },
          { id: "b", text: "nothing: it is correlated with schooling, so it is a valid instrument", misconception: "iv-any-correlate", why: "Relevance alone isn't enough." },
          { id: "c", text: "it isn't correlated with schooling", why: "It is, so relevance holds; exclusion fails." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "qex-check-2",
        prompt: "Treated group: 20 before, 30 after. Comparison group: 18 before, 24 after. The DiD estimate is",
        options: [
          { id: "a", text: "4", correct: true, why: "$10 - 6$." },
          { id: "b", text: "6", why: "That is the treated-minus-control gap after." },
          { id: "c", text: "10", why: "That ignores the comparison group's change." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Tech companies use these designs when A/B tests are impossible: difference-in-differences for features launched market by market, regression discontinuity around ranking or eligibility thresholds, and instruments such as randomised encouragement to try a feature. Synthetic control is used for single-market launches.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "qex-produce-1", prompt: "A lottery offer $Z$: mean outcome 60 if offered, 55 if not; uptake 0.8 if offered, 0.3 if not. Find the Wald estimate.", answer: 10, explain: "$5/0.5$." },
        { kind: "number", id: "qex-produce-2", prompt: "Treated: 50 before, 58 after. Control: 40 before, 45 after. Find the DiD estimate.", answer: 3, explain: "$8 - 5$." },
        {
          kind: "mc",
          id: "qex-produce-3",
          prompt: "Rainfall is proposed as an instrument for farm fertiliser use when studying crop yield. It fails because",
          options: [
            { id: "a", text: "rain affects yield directly, not only through fertiliser", correct: true, why: "Exclusion fails." },
            { id: "b", text: "it doesn't fail: rain correlates with fertiliser use", misconception: "iv-any-correlate", why: "Correlation with treatment is only the first condition." },
          ],
        },
        {
          kind: "mc",
          id: "qex-produce-4",
          prompt: "Hospital X always has 5% higher mortality than hospital Y, and their trends have matched for years. For DiD after X adopts a new protocol, the 5% gap is",
          options: [
            { id: "a", text: "not a problem: it is differenced out", correct: true, why: "Only the trends need to match." },
            { id: "b", text: "fatal: the groups must have equal levels", misconception: "did-equal-levels", why: "DiD removes fixed level differences." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "qex-review-1", prompt: "Treated: 12 before, 20 after. Control: 10 before, 14 after. Find the DiD estimate.", answer: 4, explain: "$8 - 4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "compliers and the LATE",
      body: "With a binary instrument and treatment, people are **compliers** (take treatment only if $Z = 1$), **always-takers**, **never-takers** or **defiers**. Assuming no defiers (**monotonicity**), the Wald ratio is the average effect among compliers, the **local average treatment effect**. It may differ from the ATE if compliers respond differently.",
    },
    {
      type: "definition",
      term: "synthetic control",
      body: "For one treated unit (a state, a country), choose non-negative weights $w_j$ summing to 1 over untreated units so that $\\sum_jw_jY_{jt}$ tracks the treated unit before treatment. After treatment, the gap between the treated unit and its synthetic version estimates the effect. Placebo runs, pretending each control was treated, show how unusual the real gap is.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the Wald estimator",
      statement: "Under relevance, exclusion, independence and monotonicity, $\\dfrac{E[Y \\mid Z = 1] - E[Y \\mid Z = 0]}{E[T \\mid Z = 1] - E[T \\mid Z = 0]} = E[Y(1) - Y(0) \\mid \\text{complier}]$.",
      proof: [
        "Only compliers change treatment with $Z$; by exclusion, $Z$ affects $Y$ only through that change, so the numerator is $P(\\text{complier}) \\times$ their average effect.",
        "The denominator is $P(\\text{complier})$, since always- and never-takers' treatment doesn't move.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "DiD as a regression",
      statement: "In $Y = \\beta_0 + \\beta_1G + \\beta_2P + \\tau(G \\times P) + e$, with $G = 1$ for the treated group and $P = 1$ after treatment, the interaction coefficient $\\tau$ is the DiD estimate.",
      proof: ["The four cell means are $\\beta_0$, $\\beta_0 + \\beta_2$, $\\beta_0 + \\beta_1$ and $\\beta_0 + \\beta_1 + \\beta_2 + \\tau$; the difference of differences is $\\tau$ (§{regression-features})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "checking the designs",
      statement: "IV: report the first-stage F (above about 10) and argue exclusion. DiD: plot pre-treatment trends. RD: show the running variable's density is smooth at the cut-off and covariates don't jump there; use observations close to the cut-off.",
      proof: ["Each check targets the assumption the design cannot do without."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Treated region: 20 before, 30 after. Comparison: 18 before, 24 after. Find the DiD estimate.",
      solution: ["Treated change $+10$; comparison change $+6$.", "DiD $= 10 - 6 = 4$."],
      result: "4.",
    },
    {
      type: "example",
      level: 2,
      title: "an encouragement design",
      problem: "Randomly chosen customers ($Z = 1$) get an email encouraging them to try a feature. Usage: 40% with the email, 10% without. Average spend: ₹530 with, ₹500 without. Find the effect of using the feature for compliers.",
      solution: ["Numerator $530 - 500 = 30$; denominator $0.4 - 0.1 = 0.3$.", "Wald estimate $30/0.3 = 100$."],
      result: "₹100 for compliers.",
    },
    {
      type: "example",
      level: 3,
      title: "a regression discontinuity",
      problem: "Students scoring at least 60 get a scholarship. Fitted lines on each side give expected graduation rates of 71% just below 60 and 79% just above. Estimate the effect, and say for whom.",
      solution: ["Sharp RD: effect $= 79 - 71 = 8$ percentage points.", "It applies to students near a score of 60, not necessarily to all students."],
      result: "8 points, for students near the cut-off.",
    },
  ],
  pitfalls: [
    { wrong: "Anything correlated with treatment is an instrument.", right: "It also needs exclusion and independence from confounders." },
    { wrong: "DiD needs equal starting levels.", right: "It needs parallel trends." },
    { wrong: "An RD estimate applies to everyone.", right: "It is local to units near the cut-off." },
  ],
  formulas: [
    { label: "Wald", tex: "\\dfrac{E[Y \\mid Z = 1] - E[Y \\mid Z = 0]}{E[T \\mid Z = 1] - E[T \\mid Z = 0]}" },
    { label: "DiD", tex: "(\\bar Y_{T,1} - \\bar Y_{T,0}) - (\\bar Y_{C,1} - \\bar Y_{C,0})" },
    { label: "DiD regression", tex: "Y = \\beta_0 + \\beta_1G + \\beta_2P + \\tau GP + e" },
    { label: "RD", tex: "\\lim_{x \\downarrow c}E[Y \\mid x] - \\lim_{x \\uparrow c}E[Y \\mid x]" },
  ],
  exercises: [
    ex(1, num("qexx-ex-1", "Treated: 100 before, 120 after. Control: 90 before, 100 after. Find the DiD estimate.", 10, "$20 - 10$."), ["$10$."]),
    ex(1, num("qexx-ex-2", "Wald: outcome means differ by 6 across the instrument; treatment rates differ by 0.3. Find the estimate.", 20, "$6/0.3$."), ["$20$."]),
    ex(2, num("qexx-ex-3", "Encouragement raises uptake from 20% to 70% and the mean outcome from 50 to 54. Find the complier effect.", 8, "$4/0.5$."), ["$8$."]),
    ex(2, dp("qexx-ex-4", "In a DiD regression, $\\beta_0 = 10$, $\\beta_1 = 3$, $\\beta_2 = 2$ and $\\tau = 1.5$. Find the treated group's mean after treatment.", 16.5, "Add all four."), ["$10 + 3 + 2 + 1.5 = 16.5$."]),
    ex(2, num("qexx-ex-5", "Sharp RD: expected outcome 42 just below the cut-off and 47 just above. Find the effect at the cut-off.", 5, "The jump."), ["$5$."]),
    ex(3, mc("qexx-ex-6", "A first-stage F statistic of 3 for an instrument indicates", ["a weak instrument: 2SLS estimates will be unreliable", "Below about 10 is weak."], [["a strong instrument", "Strong instruments give large F."], ["that exclusion holds", "F tests relevance only."]]), ["Find a stronger instrument or use weak-IV-robust inference."]),
    ex(3, mc("qexx-ex-7", "Before treatment, the treated group's outcome rose 2 a year and the control's 0.5 a year. A DiD estimate would be", ["biased by the different pre-trends", "Parallel trends looks false."], [["unbiased", "The trends differ."], ["unbiased if levels match", "Levels don't rescue unequal trends."]]), ["Consider a different comparison group or synthetic control."]),
    ex(3, mc("qexx-ex-8", "Students can retake an exam until they pass the scholarship cut-off. For a regression discontinuity this is a problem because", ["scores are manipulated, so those just above aren't comparable to those just below", "Sorting around the cut-off breaks the design."], [["it isn't a problem", "Manipulation is RD's main threat."], ["it makes the effect larger", "Its direction is unknown; the issue is bias."]]), ["Check for bunching in the score distribution just above the cut-off."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a0 = r.int(10, 60);
      const a1 = a0 + r.int(-5, 20);
      const b0 = r.int(10, 60);
      const b1 = b0 + r.int(-5, 15);
      const d = a1 - a0 - (b1 - b0);
      return n(`Treated group: ${a0} before, ${a1} after. Comparison group: ${b0} before, ${b1} after. Find the difference-in-differences estimate.`, d, `$(${a1} - ${a0}) - (${b1} - ${b0}) = ${d}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p0 = r.pick([0.05, 0.1, 0.2, 0.3]);
      const p1 = r2(p0 + r.pick([0.2, 0.25, 0.4, 0.5, 0.6]));
      const y0 = r.int(40, 80);
      const dy = r.int(1, 12);
      const v = dy / (p1 - p0);
      return n(`A randomised encouragement raises treatment uptake from ${p0} to ${p1} and the mean outcome from ${y0} to ${y0 + dy}. Find the Wald estimate of the complier effect (3 decimals).`, Math.round(v * 1000) / 1000, `$${dy}/${r2(p1 - p0)} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        { z: "distance to the nearest college", t: "years of schooling", y: "earnings", why: "distance may track local job markets and family background" },
        { z: "a doctor's prescribing habit", t: "taking a drug", y: "recovery", why: "doctors with that habit may differ in other aspects of care" },
        { z: "rainfall", t: "farm irrigation", y: "crop yield", why: "rain waters crops directly" },
      ]);
      return mcNumbers(
        `${v.z[0].toUpperCase()}${v.z.slice(1)} is correlated with ${v.t} and is proposed as an instrument for its effect on ${v.y}. What must also hold?`,
        { text: `It affects ${v.y} only through ${v.t}, and is unrelated to confounders`, why: `Here that is doubtful: ${v.why}.` },
        [
          { text: "Nothing more: correlation with the treatment is enough", why: "Relevance alone doesn't make an instrument.", misconception: "iv-any-correlate" },
          { text: `It must be uncorrelated with ${v.t}`, why: "Then it would be useless." },
        ],
      );
    },
  },
];
