import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Dummy variables, interactions, polynomial and spline terms, partial F-tests, quantile regression, elastic net, model selection. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "regression-features",
  title: "Dummies, interactions, polynomials & splines",
  summary: "Linear regression is linear in its coefficients, not necessarily in x. Categorical predictors enter as 0/1 dummy variables, one fewer than the categories; an interaction lets one predictor's slope depend on another; polynomial and spline terms bend the fit. Choosing among such terms is model selection, by validation, AIC or BIC.",
  deps: ["regression-inference", "regularization", "likelihood-ratio"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "dummy variable", meaning: "A 0/1 column marking one category of a categorical predictor." },
    { term: "interaction", meaning: "A product term such as $x_1x_2$, which lets the effect of $x_1$ change with $x_2$." },
    { term: "spline", meaning: "Polynomial pieces joined smoothly at chosen points called knots." },
  ],
  misconceptions: {
    "dummy-trap": "Includes a dummy for every category alongside the intercept, making the columns perfectly collinear.",
    "main-effect-with-interaction": "Reads a main-effect coefficient as \"the effect of x\" when the model also has an interaction, where it is the effect of x only when the other variable is 0.",
  },
  steps: [
    {
      type: "motivate",
      title: "Straight tools, bent data",
      body: "Wages rise with experience and then flatten; a fertiliser's effect depends on rainfall; a city is a category, not a number. One least-squares regression handles all three, once the right columns are built.",
      realWorld: {
        title: "Retail demand",
        body: "A retailer's demand model uses dummies for the day of the week, an interaction between discount and season, and a spline in temperature: still ordinary least squares, solved in milliseconds.",
      },
    },
    {
      type: "truth",
      statement: "A categorical predictor with $c$ levels enters as $c - 1$ **dummy** columns. The omitted level is the baseline, and each dummy's coefficient is that level's difference from the baseline. With an **interaction**, $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\beta_3x_1x_2$, the slope of $x_1$ is $\\beta_1 + \\beta_3x_2$. **Polynomial** terms $x, x^2, \\dots$ and **splines** add curvature while the model stays linear in its coefficients.",
      body: "Using all $c$ dummies with an intercept makes them add up to the intercept column: perfect collinearity, the **dummy variable trap**. Flexible terms always raise training $R^2$, so choose them by cross-validation (§{cross-validation}), adjusted $R^2$, AIC or BIC (§{likelihood-ratio}), or let ridge, the lasso or the **elastic net**, a mix of the two penalties, shrink them.",
    },
    {
      type: "predict",
      misconception: "main-effect-with-interaction",
      item: {
        kind: "mc",
        id: "rgf-predict-1",
        prompt: "salary = 30 + 2·experience + 5·degree + 1·(experience × degree), with degree = 0 or 1. What is the effect of one more year of experience for someone with a degree?",
        options: [
          { id: "a", text: "3: the slope is $2 + 1 \\times \\text{degree}$", correct: true, why: "The interaction adds 1 per year for graduates." },
          { id: "b", text: "2, the experience coefficient", misconception: "main-effect-with-interaction", why: "That is the slope only when degree = 0." },
          { id: "c", text: "8", why: "The degree premium doesn't add to the yearly slope." },
        ],
      },
      reveal: {
        body: "With the interaction, the experience slope is $2 + 1 \\times \\text{degree}$: 2 a year without a degree, 3 with one. Likewise, 5 is the degree premium only at zero experience; at 10 years it is $5 + 1 \\times 10 = 15$. In a model with interactions, read each main effect at the other variable's zero.",
      },
      resolve: {
        kind: "mc",
        id: "rgf-resolve-1",
        prompt: "In a model with an interaction, how do you find the slope of $x_1$?",
        options: [
          { id: "a", text: "Add the main effect and the interaction coefficient times $x_2$", correct: true, why: "$\\beta_1 + \\beta_3x_2$." },
          { id: "b", text: "Read the main-effect coefficient alone", misconception: "main-effect-with-interaction", why: "That is the slope only at $x_2 = 0$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgf-check-1",
        prompt: "A model with an intercept includes dummies for all four regions: North, South, East, West. The problem is",
        options: [
          { id: "a", text: "the four dummies add up to the intercept column: perfect collinearity", correct: true, why: "Drop one region as the baseline." },
          { id: "b", text: "nothing: every region needs its own column", misconception: "dummy-trap", why: "With an intercept, one region must be the baseline." },
          { id: "c", text: "there are too few columns", why: "There is one too many." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgf-check-2",
        prompt: "A categorical predictor has 5 categories. How many dummy columns go into a model with an intercept?",
        options: [
          { id: "a", text: "4", correct: true, why: "$c - 1$." },
          { id: "b", text: "5", why: "That falls into the dummy trap." },
          { id: "c", text: "1", why: "One number can't separate five categories." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "One-hot encoding is dummy coding; for unregularised linear models drop one column (drop=\"first\" in scikit-learn). Tree models find interactions and curvature by themselves, one reason they need less hand-built feature engineering than linear models.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rgf-produce-1", prompt: "How many dummy columns does a 7-category predictor need in a model with an intercept?", answer: 6, explain: "$c - 1$." },
        { kind: "number", id: "rgf-produce-2", prompt: "$y = 10 + 3x + 4z + 2xz$. Find the slope of $x$ when $z = 2$.", answer: 7, explain: "$3 + 2 \\times 2$." },
        {
          kind: "mc",
          id: "rgf-produce-4",
          prompt: "A model with an intercept codes a 3-level factor (low, medium, high). It should include",
          options: [
            { id: "a", text: "two dummies, with one level as the baseline", correct: true, why: "$c - 1 = 2$." },
            { id: "b", text: "three dummies, one per level", misconception: "dummy-trap", why: "They would add up to the intercept column." },
          ],
        },
        {
          kind: "mc",
          id: "rgf-produce-3",
          prompt: "With an interaction term in the model, the coefficient on $x_1$ is",
          options: [
            { id: "a", text: "the slope of $x_1$ when $x_2 = 0$", correct: true, why: "The interaction adjusts it elsewhere." },
            { id: "b", text: "the slope of $x_1$ for everyone", misconception: "main-effect-with-interaction", why: "The slope changes with $x_2$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rgf-review-1", prompt: "$\\hat y = 5 + 2x - 0.1x^2$. At what $x$ is $\\hat y$ largest?", answer: 10, explain: "$x = -b_1/(2b_2) = 2/0.2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "polynomials, splines, GAMs",
      body: "A **polynomial** model uses $x, x^2, \\dots, x^d$; centring $x$ first reduces the collinearity between powers. A **spline** fits separate polynomials between **knots**, joined so the curve and its slope stay continuous; natural cubic splines are straight beyond the outer knots. A **generalised additive model** sums one smooth function per predictor, $y = f_1(x_1) + f_2(x_2) + \\dots$",
    },
    {
      type: "definition",
      term: "other regressions",
      body: "**Quantile regression** fits the conditional $\\tau$th quantile by minimising the check loss, $\\sum \\rho_\\tau(e_i)$ with $\\rho_\\tau(e) = e(\\tau - \\mathbf{1}\\{e < 0\\})$; $\\tau = 0.5$ is median regression. **Regression through the origin** drops the intercept, which only suits data that must pass through 0. **Nonlinear regression** fits models nonlinear in the parameters, such as $y = ae^{bx}$, by iterative least squares. **Multivariate regression** fits several responses at once.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "dummy coefficients are mean differences",
      statement: "Regressing $y$ on the $c - 1$ dummies of a single categorical predictor gives intercept = the baseline group's mean, and each dummy coefficient = that group's mean minus the baseline mean.",
      proof: ["The model has one free fitted value per group, and least squares fits each group's values by their mean; the intercept carries the baseline and each dummy the extra for its group."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the vertex of a quadratic fit",
      statement: "For $\\hat y = b_0 + b_1x + b_2x^2$, the turning point is at $x = -\\dfrac{b_1}{2b_2}$: a maximum if $b_2 < 0$, a minimum if $b_2 > 0$.",
      proof: ["Set $\\dfrac{d\\hat y}{dx} = b_1 + 2b_2x = 0$ (§{derivative-rules})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the partial F-test",
      statement: "To test whether $q$ extra terms improve a model, compare residual sums of squares: $F = \\dfrac{(\\text{SSE}_{\\text{reduced}} - \\text{SSE}_{\\text{full}})/q}{\\text{SSE}_{\\text{full}}/(n - k - 1)}$ on $(q, n - k - 1)$ degrees of freedom, where $k$ counts the full model's predictors.",
      proof: ["Under $H_0$ that the extra coefficients are 0, the drop in SSE is a scaled $\\chi^2_q$ independent of the full model's SSE; their ratio is $F$ (§{sampling-distributions})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "salary = 40 + 6·(city B) + 9·(city C), with city A the baseline. Give each city's mean salary.",
      solution: ["City A: 40.", "City B: $40 + 6 = 46$; city C: $40 + 9 = 49$."],
      result: "40, 46 and 49.",
    },
    {
      type: "example",
      level: 2,
      title: "a peak",
      problem: "Yield $= 20 + 8x - 0.5x^2$ for fertiliser $x$. Find the best $x$ and the predicted maximum.",
      solution: ["$x = -8/(2 \\times -0.5) = 8$.", "$20 + 64 - 32 = 52$."],
      result: "$x = 8$, yield 52.",
    },
    {
      type: "example",
      level: 3,
      title: "do two extra terms help?",
      problem: "Adding two terms to a model drops SSE from 120 to 100. The full model has 4 predictors and $n = 45$. Test at 5% (cut-off 3.23 for $F_{2, 40}$).",
      solution: ["$F = \\dfrac{(120 - 100)/2}{100/40} = \\dfrac{10}{2.5} = 4$.", "$4 > 3.23$: the two terms improve the model significantly."],
      result: "$F = 4$: keep them.",
    },
  ],
  pitfalls: [
    { wrong: "Include a dummy for every category plus an intercept.", right: "Leave one category out as the baseline." },
    { wrong: "Read a main effect as the overall effect when an interaction is present.", right: "It is the effect where the other variable is 0." },
    { wrong: "A degree-9 polynomial fits the data better, so use it.", right: "It overfits and swings wildly beyond the data; choose flexibility by validation." },
  ],
  formulas: [
    { label: "Dummies", tex: "c - 1\\ \\text{columns for}\\ c\\ \\text{levels}" },
    { label: "Interaction slope", tex: "\\partial y/\\partial x_1 = \\beta_1 + \\beta_3x_2" },
    { label: "Quadratic vertex", tex: "x = -b_1/(2b_2)" },
    { label: "Partial F", tex: "\\dfrac{(\\text{SSE}_r - \\text{SSE}_f)/q}{\\text{SSE}_f/(n - k - 1)}" },
    { label: "Elastic net", tex: "\\lambda\\left(\\alpha\\textstyle\\sum|w_j| + (1 - \\alpha)\\sum w_j^2\\right)" },
  ],
  exercises: [
    ex(1, num("rgfx-ex-1", "How many dummy columns does month of the year need in a model with an intercept?", 11, "$12 - 1$."), ["$11$."]),
    ex(1, num("rgfx-ex-2", "salary = 40 + 6·(city B) + 9·(city C). Find the mean salary for city C.", 49, "Baseline plus its dummy."), ["$40 + 9 = 49$."]),
    ex(2, num("rgfx-ex-3", "$y = 1 + 2x + 3z - 0.5xz$. Find the slope of $x$ at $z = 3$.", 0.5, "$2 - 0.5 \\times 3$."), ["$0.5$."]),
    ex(2, num("rgfx-ex-4", "$\\hat y = 3 + 12x - 2x^2$. Find the $x$ of the maximum.", 3, "$-12/(2 \\times -2)$."), ["$3$."]),
    ex(2, num("rgfx-ex-5", "How many coefficients, including the intercept, has a cubic polynomial in one $x$?", 4, "$1, x, x^2, x^3$."), ["$4$."]),
    ex(3, dp("rgfx-ex-6", "SSE drops from 200 to 150 when 2 terms are added; the full model leaves 50 residual degrees of freedom. Find the partial $F$.", (50 / 2) / (150 / 50), "$(50/2)/(150/50)$."), ["$25/3 \\approx 8.333$."]),
    ex(3, num("rgfx-ex-7", "In the salary model with the interaction, find the degree premium at 4 years of experience.", 9, "$5 + 1 \\times 4$."), ["$9$."]),
    ex(3, mc("rgfx-ex-8", "Quantile regression at $\\tau = 0.9$ models", ["the 90th percentile of $y$ given $x$", "Useful when the spread of $y$ changes with $x$."], [["the mean of the top 10% of $y$", "It is a quantile, not a tail mean."], ["90% of the variance", "Unrelated to $R^2$."]]), ["It answers questions like \"how long do the slowest 10% of deliveries take, by distance?\""]),
    ex(3, mc("rgfx-ex-9", "Predictors come in groups of strongly correlated variables. Compared with the lasso, the elastic net", ["tends to keep correlated predictors together", "The ridge part spreads weight across a group."], [["always selects fewer variables", "It usually selects more, in groups."], ["is the same as least squares", "It still penalises."]]), ["The lasso tends to pick one variable from a correlated group at random; the elastic net shares the weight."]),
    ex(3, mc("rgfx-ex-10", "A degree-6 polynomial fits house prices well between 800 and 2,500 sq ft. At 4,000 sq ft its prediction is", ["unreliable: high-degree polynomials swing wildly outside the data", "Extrapolated powers explode."], [["reliable, because the fit was good", "Fit inside the data says nothing outside it."], ["the same as a straight line's", "The high powers dominate far from the data."]]), ["Splines with linear tails, or simpler models, extrapolate more sensibly."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const v = r.pick([
        { name: "day of the week", c: 7 },
        { name: "month", c: 12 },
        { name: "blood type (A, B, AB, O)", c: 4 },
        { name: "region (North, South, East, West, Central)", c: 5 },
        { name: "education level (school, diploma, degree)", c: 3 },
      ]);
      return n(`How many dummy columns does ${v.name} need in a regression with an intercept?`, v.c - 1, `$${v.c} - 1 = ${v.c - 1}$: one level is the baseline.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const b1 = r.int(-3, 6);
      const b3 = r.pick([-2, -1, -0.5, 0.5, 1, 2]);
      const z = r.int(0, 3 + lv);
      return n(`$y = 2 + ${b1}x + 4z ${b3 < 0 ? "-" : "+"} ${Math.abs(b3)}xz$. Find the slope of $x$ when $z = ${z}$.`, b1 + b3 * z, `$${b1} + (${b3})(${z}) = ${b1 + b3 * z}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const b2 = -r.pick([0.5, 1, 2, 0.25]);
      const x0 = r.int(2, 6 + 2 * lv);
      const b1 = -2 * b2 * x0;
      return n(`$\\hat y = 10 + ${r2(b1)}x - ${-b2}x^2$. At what $x$ is $\\hat y$ largest?`, x0, `$x = -\\dfrac{${r2(b1)}}{2(${b2})} = ${x0}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const b1 = r.int(1, 4);
      const b3 = r.int(1, 3);
      return mcNumbers(
        `pay = 20 + ${b1}·hours + 3·senior + ${b3}·(hours × senior), with senior = 0 or 1. What is the effect of one more hour for a senior worker?`,
        { text: String(b1 + b3), why: `The slope is ${b1} + ${b3} × senior.` },
        [
          { text: String(b1), why: "That is the slope only for non-senior workers.", misconception: "main-effect-with-interaction" },
          { text: String(b1 + b3 + 3), why: "The seniority premium shifts the line; it doesn't change the hourly slope." },
        ],
      );
    },
  },
];
