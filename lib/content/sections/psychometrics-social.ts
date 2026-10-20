import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Psychometrics (classical test theory, reliability, Cronbach's alpha, Spearman–Brown, validity), item response theory (1PL/2PL), educational statistics (value-added, regression to the mean), social statistics (inequality, the Gini coefficient, ecological fallacy) and computational social science. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const alpha = (k: number, sumItemVar: number, totalVar: number) => (k / (k - 1)) * (1 - sumItemVar / totalVar);
const twoPL = (a: number, b: number, theta: number) => 1 / (1 + Math.exp(-a * (theta - b)));

const base: ConceptNode = {
  id: "psychometrics-social",
  title: "Psychometrics, education & social statistics",
  summary: "Ability, attitudes and wellbeing can't be measured with a ruler; tests and questionnaires measure them with error. Psychometrics quantifies that error (reliability), checks that a test measures what it claims (validity), and models how individual questions behave (item response theory). Education and social statistics add their own traps: regression to the mean, inequality measures, and inferring individual behaviour from group data.",
  deps: ["factor-analysis", "logistic-regression", "survey-design"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "reliability", meaning: "The share of observed score variance due to true differences: $\\operatorname{Var}(T)/\\operatorname{Var}(X)$ in $X = T + E$." },
    { term: "item response theory", meaning: "Models giving each test item a curve for the probability of a correct answer as a function of the person's ability $\\theta$." },
    { term: "ecological fallacy", meaning: "Inferring individual-level relationships from correlations between group averages." },
  ],
  misconceptions: {
    "alpha-unidimensional": "Thinks a high Cronbach's alpha proves the test measures a single trait.",
    "ecological-fallacy": "Assumes a relationship between group averages holds for the individuals within the groups.",
  },
  steps: [
    {
      type: "motivate",
      title: "Measuring the unmeasurable",
      body: "Two students score 62 and 68 on a maths test. Is the second really better, or would they swap places on another day? Does the test measure maths, or reading speed? Do harder questions really separate strong students from average ones? Exams that decide university places and surveys that steer social policy all depend on answers to these questions.",
      realWorld: {
        title: "Adaptive testing",
        body: "Computer-adaptive exams such as the GRE and GMAT use item response theory: each next question is chosen to be most informative at the test-taker's current estimated ability, so fewer questions give a precise score.",
      },
    },
    {
      type: "truth",
      statement: "**Classical test theory**: observed score $X = T + E$, true score plus error, with **reliability** $\\rho = \\operatorname{Var}(T)/\\operatorname{Var}(X)$ and standard error of measurement $\\sigma_X\\sqrt{1 - \\rho}$. For $k$ items, **Cronbach's alpha** is $\\alpha = \\dfrac{k}{k - 1}\\left(1 - \\dfrac{\\sum\\sigma_i^2}{\\sigma_X^2}\\right)$; the **Spearman–Brown** formula predicts reliability when a test is lengthened by a factor $m$: $\\dfrac{m\\rho}{1 + (m - 1)\\rho}$. In the **two-parameter IRT** model, $P(\\text{correct} \\mid \\theta) = \\dfrac{1}{1 + e^{-a(\\theta - b)}}$, with difficulty $b$ and discrimination $a$ (§{logistic-regression}); the one-parameter (Rasch) model fixes $a$.",
      body: "**Validity** asks whether a test measures what it should: content, criterion (does it predict outcomes?) and construct (does it behave like the trait?); factor analysis (§{factor-analysis}) checks dimensionality. Alpha measures internal consistency, not unidimensionality. **Educational statistics**: scores regress to the mean, so the lowest scorers improve on retest even without help; **value-added** models estimate a school's effect on progress, adjusting for prior attainment. **Social statistics**: inequality is summarised by the **Gini coefficient** (0 equal, 1 maximally unequal); survey estimates need weights (§{survey-design}); correlations between area averages need not hold for individuals (the **ecological fallacy**). **Computational social science** uses digital traces, networks and text, which are huge but unrepresentative and shaped by the platform that collected them.",
    },
    {
      type: "predict",
      misconception: "ecological-fallacy",
      item: {
        kind: "mc",
        id: "psy-predict-1",
        prompt: "Across US states in 1930, those with more immigrants had higher literacy rates. Does this show immigrants were more literate than native-born residents?",
        options: [
          { id: "a", text: "No: immigrants settled in states with high literacy; individually they were less literate", correct: true, why: "Group-level and individual-level correlations can even have opposite signs." },
          { id: "b", text: "Yes: the states' correlation applies to the people in them", misconception: "ecological-fallacy", why: "Aggregate patterns can arise from where groups live, not how individuals differ." },
          { id: "c", text: "It shows nothing about states either", why: "It is a valid fact about states." },
        ],
      },
      reveal: {
        body: "W. S. Robinson's classic 1950 analysis found a state-level correlation of about +0.53 between the share of foreign-born residents and literacy, but an individual-level correlation of about −0.12: immigrants tended to move to states whose native-born populations were highly literate. Inferring individual behaviour from aggregates needs individual data or strong assumptions.",
      },
      resolve: {
        kind: "mc",
        id: "psy-resolve-1",
        prompt: "Districts with higher average income vote more for party A. Concluding that richer individuals vote for A is",
        options: [
          { id: "a", text: "unjustified without individual-level data", correct: true, why: "The ecological fallacy." },
          { id: "b", text: "justified by the district correlation", misconception: "ecological-fallacy", why: "Within districts the pattern could differ or reverse." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "psy-check-1",
        prompt: "A 40-item questionnaire mixing anxiety, sleep and diet questions has Cronbach's alpha 0.88. This shows",
        options: [
          { id: "a", text: "consistency among the items, partly because there are many; not that they measure one trait", correct: true, why: "Alpha grows with length and can be high for multidimensional scales." },
          { id: "b", text: "the questionnaire measures a single underlying trait", misconception: "alpha-unidimensional", why: "Check dimensionality with factor analysis." },
          { id: "c", text: "the questionnaire is valid", why: "Reliability isn't validity." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "psy-check-2",
        prompt: "In a 2PL model, an item has $a = 1.5$ and $b = 0.5$. A student with ability $\\theta = 0.5$ answers correctly with probability",
        options: [
          { id: "a", text: "0.5", correct: true, why: "At $\\theta = b$ the probability is one half." },
          { id: "b", text: "0.82", why: "That would be at a higher ability." },
          { id: "c", text: "1.5", why: "Probabilities can't exceed 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "IRT is used to evaluate machine-learning benchmarks: items (test questions) get difficulty and discrimination parameters, and models get ability scores, revealing which questions actually separate strong systems from weak ones. Recommender-style models of student responses (knowledge tracing) extend IRT over time.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "psy-produce-1", prompt: "A test has reliability 0.8. By Spearman–Brown, find the reliability of a test twice as long, to 3 decimals.", answer: Math.round((1.6 / 1.8) * 1000) / 1000, tolerance: 0.001, explain: "$\\tfrac{2 \\times 0.8}{1 + 0.8}$." },
        { kind: "number", id: "psy-produce-2", prompt: "Score SD 15, reliability 0.91. Find the standard error of measurement.", answer: 4.5, explain: "$15\\sqrt{0.09}$." },
        {
          kind: "mc",
          id: "psy-produce-3",
          prompt: "Countries with higher average chocolate consumption have more Nobel laureates per capita. This shows that",
          options: [
            { id: "a", text: "nothing about whether chocolate-eating individuals win Nobels", correct: true, why: "Country-level correlations don't transfer to people." },
            { id: "b", text: "chocolate eaters are more likely to win", misconception: "ecological-fallacy", why: "That infers individual behaviour from national averages." },
          ],
        },
        {
          kind: "mc",
          id: "psy-produce-4",
          prompt: "To check whether a well-being scale measures one dimension, use",
          options: [
            { id: "a", text: "factor analysis of the items", correct: true, why: "It tests the number of underlying factors." },
            { id: "b", text: "a high Cronbach's alpha", misconception: "alpha-unidimensional", why: "Alpha can be high for several correlated dimensions." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "psy-review-1", prompt: "A 4-item scale: item variances sum to 6 and total-score variance is 16. Find Cronbach's alpha to 3 decimals.", answer: Math.round(alpha(4, 6, 16) * 1000) / 1000, tolerance: 0.001, explain: "$\\tfrac43(1 - 6/16)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "item response theory",
      body: "Each item has an **item characteristic curve** $P_j(\\theta)$. In the 2PL model, $b_j$ is the ability at which $P = \\tfrac12$ and $a_j$ the steepness; the 3PL adds a guessing floor $c_j$. **Item information** $I_j(\\theta) = a_j^2P_j(1 - P_j)$ peaks at $\\theta = b_j$; test information is the sum, and the standard error of an ability estimate is $1/\\sqrt{I(\\theta)}$. Because item parameters don't depend on who took the test, different test forms can be put on one scale (equating).",
    },
    {
      type: "definition",
      term: "the Gini coefficient",
      body: "Sort incomes and plot the **Lorenz curve**: the cumulative share of income held by the poorest fraction $x$ of people. The Gini is twice the area between the line of equality and the Lorenz curve; equivalently $G = \\dfrac{\\sum_i\\sum_j\\lvert x_i - x_j\\rvert}{2n^2\\bar x}$, the mean absolute difference divided by twice the mean.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "Spearman–Brown",
      statement: "If a test with reliability $\\rho$ is lengthened by a factor $m$ with parallel items, its reliability becomes $\\rho_m = \\dfrac{m\\rho}{1 + (m - 1)\\rho}$.",
      proof: ["True-score variance scales by $m^2$ and error variance by $m$ (errors are independent), so $\\rho_m = \\dfrac{m^2\\sigma_T^2}{m^2\\sigma_T^2 + m\\sigma_E^2}$; divide through."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "regression to the mean in test scores",
      statement: "With reliability $\\rho$, the expected retest score of a student who scored $x$ is $\\mu + \\rho(x - \\mu)$: extreme scorers move towards the mean by a fraction $1 - \\rho$.",
      proof: ["The best linear prediction of $T$ from $X$ has slope $\\operatorname{Cov}(T, X)/\\operatorname{Var}(X) = \\rho$; the retest has the same true score plus fresh error."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "reliability is not validity",
      statement: "A test can be highly reliable and measure the wrong thing (a reading-heavy maths test), but it cannot be valid without being reliable: reliability caps the correlation with any criterion at $\\sqrt\\rho$.",
      proof: ["The correlation of $X$ with any criterion is at most the correlation of $X$ with $T$, which is $\\sqrt\\rho$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A 4-item scale has item variances summing to 6 and total-score variance 16. Find Cronbach's alpha.",
      solution: ["$\\alpha = \\tfrac43\\left(1 - \\tfrac{6}{16}\\right)$.", "$= \\tfrac43 \\times 0.625 \\approx 0.833$."],
      result: "About 0.83.",
    },
    {
      type: "example",
      level: 2,
      title: "regression to the mean",
      problem: "Test mean 100, reliability 0.75. A remedial group was chosen for scoring 80. Without any teaching, what is their expected retest mean?",
      solution: ["$100 + 0.75 \\times (80 - 100) = 85$.", "A 5-point \"gain\" appears with no intervention; a control group is needed to judge the programme."],
      result: "85.",
    },
    {
      type: "example",
      level: 3,
      title: "an IRT item",
      problem: "A 2PL item has $a = 2$, $b = 1$. Find the probability of a correct answer at $\\theta = 0$ and $\\theta = 2$.",
      solution: ["$\\theta = 0$: $1/(1 + e^{2}) \\approx 0.119$.", "$\\theta = 2$: $1/(1 + e^{-2}) \\approx 0.881$: the item separates abilities around 1 sharply."],
      result: "0.119 and 0.881.",
    },
  ],
  pitfalls: [
    { wrong: "High alpha means one dimension.", right: "Check dimensionality with factor analysis; alpha rises with test length." },
    { wrong: "Read group-level correlations as individual ones.", right: "Beware the ecological fallacy." },
    { wrong: "Credit a remedial programme with all of the retest gain.", right: "Part is regression to the mean; compare with a control group." },
  ],
  formulas: [
    { label: "Cronbach's alpha", tex: "\\dfrac{k}{k - 1}\\left(1 - \\dfrac{\\sum\\sigma_i^2}{\\sigma_X^2}\\right)" },
    { label: "Spearman–Brown", tex: "\\dfrac{m\\rho}{1 + (m - 1)\\rho}" },
    { label: "SEM", tex: "\\sigma_X\\sqrt{1 - \\rho}" },
    { label: "2PL", tex: "P(\\theta) = \\dfrac{1}{1 + e^{-a(\\theta - b)}}" },
  ],
  exercises: [
    ex(1, num("psyx-ex-1", "True-score variance 64, error variance 16. Find the reliability.", 0.8, "$64/80$."), ["$0.8$."]),
    ex(1, num("psyx-ex-2", "Score SD 10, reliability 0.84. Find the SEM.", 4, "$10\\sqrt{0.16}$."), ["$4$."]),
    ex(2, dp("psyx-ex-3", "Reliability 0.6. Find the reliability of a test three times as long.", (3 * 0.6) / (1 + 2 * 0.6), "Spearman–Brown with $m = 3$."), ["$1.8/2.2 \\approx 0.818$."]),
    ex(2, dp("psyx-ex-4", "A 5-item scale: item variances sum to 10, total variance 30. Find Cronbach's alpha.", alpha(5, 10, 30), "$\\tfrac54(1 - \\tfrac13)$."), ["$\\approx 0.833$."]),
    ex(2, dp("psyx-ex-5", "2PL item with $a = 1$, $b = -1$. Find $P(\\text{correct})$ at $\\theta = 1$.", twoPL(1, -1, 1), "$1/(1 + e^{-2})$."), ["$\\approx 0.881$."]),
    ex(3, num("psyx-ex-6", "Test mean 50, reliability 0.6. Students who scored 70 are retested. Find their expected mean.", 62, "$50 + 0.6 \\times 20$."), ["$62$."]),
    ex(3, dp("psyx-ex-7", "Incomes 1, 1, 4 (in lakh). Find the Gini coefficient $\\sum_{i,j}\\lvert x_i - x_j\\rvert/(2n^2\\bar x)$.", 12 / (2 * 9 * 2), "Pairwise absolute differences sum to 12."), ["Ordered pairs: $\\lvert 1 - 4\\rvert$ four times $= 12$; $12/(18 \\times 2) \\approx 0.333$."]),
    ex(3, mc("psyx-ex-8", "Research using a social-media platform's 50 million posts to measure national mood mainly risks", ["unrepresentative users and platform-driven behaviour, which size can't fix", "Digital traces aren't random samples."], [["too little data", "There is plenty."], ["no risk at all", "Selection and platform effects are serious."]]), ["Weight, validate against surveys, and state the population covered (§{statistical-computing})."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const rho = r.pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.9]);
      const m = r.pick([0.5, 2, 3, 4]);
      const v = (m * rho) / (1 + (m - 1) * rho);
      return n(`A test has reliability ${rho}. By Spearman–Brown, find the reliability of a test ${m === 0.5 ? "half as long" : `${m} times as long`} (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{${m} \\times ${rho}}{1 + ${r2(m - 1)} \\times ${rho}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.int(3, 10);
      const iv = r.int(k, 3 * k);
      const tv = iv + r.int(k, 5 * k);
      const v = alpha(k, iv, tv);
      return n(`A ${k}-item scale has item variances summing to ${iv} and total-score variance ${tv}. Find Cronbach's alpha (3 decimals).`, Math.round(v * 1000) / 1000, `$\\tfrac{${k}}{${k - 1}}\\left(1 - \\tfrac{${iv}}{${tv}}\\right) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([0.5, 1, 1.5, 2]);
      const b = r.pick([-1, -0.5, 0, 0.5, 1]);
      const th = r.pick([-2, -1, 0, 1, 2]);
      const v = twoPL(a, b, th);
      return n(`2PL item with $a = ${a}$ and $b = ${b}$. Find $P(\\text{correct})$ at $\\theta = ${th}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$1/(1 + e^{-${a}(${th} - (${b}))}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        "Regions with more hospitals have higher death rates.",
        "Schools with more computers have higher average scores.",
        "Countries with higher average income report higher average happiness.",
      ]);
      return mcNumbers(
        `${v} Can you conclude the same holds for individuals?`,
        { text: "No: group-level correlations needn't hold for individuals", why: "The ecological fallacy." },
        [{ text: "Yes, the pattern carries over to individuals", why: "Aggregates can mislead about individuals.", misconception: "ecological-fallacy" }],
      );
    },
  },
];
