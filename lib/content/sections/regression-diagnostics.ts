import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Assumptions and residual plots, leverage, studentized residuals, Cook's distance, VIF, WLS/GLS and robust regression. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "regression-diagnostics",
  title: "Regression diagnostics",
  summary: "Least squares always returns an answer; diagnostics decide whether to believe it. Residual plots reveal curvature and unequal spread, Q-Q plots check normal errors, leverage and Cook's distance find points that dominate the fit, and variance inflation factors flag collinear predictors. Remedies include transformations and weighted or robust regression.",
  deps: ["regression-inference", "transformations"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "residual plot", meaning: "Residuals against fitted values (or a predictor): it should look like a patternless band around 0." },
    { term: "leverage", meaning: "How unusual a point's predictor values are; high-leverage points can pull the fitted line towards them." },
    { term: "influence", meaning: "How much the fit changes when a point is removed, measured by Cook's distance." },
  ],
  misconceptions: {
    "high-r2-good-model": "Thinks a high R² shows the model's assumptions hold and its inferences are valid.",
    "leverage-equals-outlier": "Confuses leverage (an unusual x) with a large residual (an unusual y given x).",
  },
  steps: [
    {
      type: "motivate",
      title: "Four data sets, one line",
      body: "Anscombe's four data sets have the same means, variances, correlation (0.82) and fitted line. One is a clean linear scatter, one a curve, one a line with a single outlier, and one a vertical cluster with one far-away point that sets the whole slope. Only plots tell them apart.",
      realWorld: {
        title: "Clinical prediction",
        body: "A formula estimating kidney function from a blood test was found, on examining residuals, to be biased for very muscular patients. No summary statistic had flagged it; a residual plot by body type did.",
      },
    },
    {
      type: "truth",
      statement: "The assumptions are a **linear** mean, **independent** errors, **normal** errors and **equal** variance (homoscedasticity). Check them with residuals against fitted values (a patternless band), a normal Q-Q plot of residuals (§{transformations}), and residuals against time or order. **Leverage** $h_{ii}$ measures how unusual $x_i$ is; the **studentized residual** $\\dfrac{e_i}{s\\sqrt{1 - h_{ii}}}$ puts a residual in standard units; **Cook's distance** combines both into how much the fit moves if point $i$ is dropped.",
      body: "The **variance inflation factor** $\\text{VIF}_j = \\dfrac{1}{1 - R_j^2}$, with $R_j^2$ from regressing predictor $j$ on the others, says how much collinearity inflates $\\operatorname{Var}(b_j)$; values above 5 to 10 signal trouble. Unequal variance calls for a transformation such as $\\log y$ or **weighted least squares**; outliers for **robust regression**.",
    },
    {
      type: "predict",
      misconception: "high-r2-good-model",
      item: {
        kind: "mc",
        id: "rgd-predict-1",
        prompt: "A model has $R^2 = 0.95$, but its residuals against fitted values form a clear U shape. The model is",
        options: [
          { id: "a", text: "missing curvature: add a quadratic term or transform", correct: true, why: "The residual pattern shows a systematic error." },
          { id: "b", text: "fine: $R^2 = 0.95$ is excellent", misconception: "high-r2-good-model", why: "$R^2$ can be high while the shape is wrong." },
          { id: "c", text: "fine, because the residuals average 0", why: "Least-squares residuals always average 0." },
        ],
      },
      reveal: {
        body: "A U shape means the line under-predicts at both ends and over-predicts in the middle: the mean isn't linear in $x$. $R^2$ can still be high because $x$ explains most of the variation. Predictions at the ends, and every standard error, are biased. Residuals averaging 0 proves nothing; least squares guarantees it.",
      },
      resolve: {
        kind: "mc",
        id: "rgd-resolve-1",
        prompt: "What revealed the problem?",
        options: [
          { id: "a", text: "The residual plot, which shows the curvature $R^2$ hides", correct: true, why: "Plots show patterns that summaries average away." },
          { id: "b", text: "Nothing: an $R^2$ of 0.95 settles it", misconception: "high-r2-good-model", why: "$R^2$ measures explained variation, not correctness." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgd-check-1",
        prompt: "One point has an $x$ far from all the others but lies almost exactly on the line through the rest. It has",
        options: [
          { id: "a", text: "high leverage and a small residual", correct: true, why: "Leverage depends on $x$ only." },
          { id: "b", text: "a large residual, so it is an outlier", misconception: "leverage-equals-outlier", why: "It fits the line well; it is unusual only in $x$." },
          { id: "c", text: "low leverage", why: "An extreme $x$ means high leverage." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgd-check-2",
        prompt: "Predictor $x_2$ regressed on the other predictors gives $R^2 = 0.9$. Find the VIF for $x_2$.",
        options: [
          { id: "a", text: "10", correct: true, why: "$1/(1 - 0.9)$." },
          { id: "b", text: "0.1", why: "That is $1 - R_j^2$, the tolerance." },
          { id: "c", text: "1.11", why: "That is $1/0.9$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The same plots debug models. Residuals against predictions reveal bias in part of the range; residuals against a feature left out of the model reveal that it still carries signal. Spread that grows with the prediction suggests modelling $\\log y$, or predicting the variance as well.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rgd-produce-1", prompt: "A predictor regressed on the others gives $R_j^2 = 0.75$. Find its VIF.", answer: 4, explain: "$1/0.25$." },
        { kind: "number", id: "rgd-produce-2", prompt: "Residual 3, $s = 2$, leverage 0.19. Find the studentized residual to 3 decimals.", answer: Math.round((3 / (2 * 0.9)) * 1000) / 1000, tolerance: 0.001, explain: "$3/(2\\sqrt{0.81})$." },
        {
          kind: "mc",
          id: "rgd-produce-3",
          prompt: "A point's leverage depends on",
          options: [
            { id: "a", text: "only its predictor values", correct: true, why: "$h_{ii}$ comes from $X$ alone." },
            { id: "b", text: "how far it lies from the fitted line", misconception: "leverage-equals-outlier", why: "That is its residual." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rgd-review-1", prompt: "Find the VIF when $R_j^2 = 0.8$.", answer: 5, explain: "$1/0.2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "hat matrix and leverage",
      body: "$\\hat{\\vec y} = H\\vec y$ with $H = X(X^{\\mathsf T}X)^{-1}X^{\\mathsf T}$; the leverage of point $i$ is the diagonal entry $h_{ii}$, between $\\tfrac1n$ and 1, and the leverages sum to $k + 1$. A leverage above $2(k + 1)/n$, twice the average, is usually called high.",
    },
    {
      type: "definition",
      term: "Cook's distance, Durbin–Watson",
      body: "$D_i = \\dfrac{e_i^2}{(k + 1)s^2}\\cdot\\dfrac{h_{ii}}{(1 - h_{ii})^2}$: large residual and large leverage together make a point influential; $D_i > 1$, or above $4/n$, deserves a look. The **Durbin–Watson** statistic, near 2 for uncorrelated residuals, checks errors in time order for autocorrelation.",
    },
    {
      type: "definition",
      term: "weighted, generalised and robust least squares",
      body: "**Weighted least squares** minimises $\\sum w_ie_i^2$ with $w_i \\propto 1/\\operatorname{Var}(\\varepsilon_i)$, so noisy points count less. **Generalised least squares** also allows correlated errors. **Robust regression** replaces squared error by a loss that grows more slowly for large residuals, such as Huber's, so outliers can't dominate.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "residual facts",
      statement: "With an intercept, least-squares residuals sum to 0 and are uncorrelated with the fitted values and with every predictor, whatever the true model. So these facts can never confirm a model; only patterns in residual plots can contradict one.",
      proof: ["The normal equations $X^{\\mathsf T}\\vec e = \\vec 0$ (§{multiple-regression}) say exactly that $\\vec e$ is perpendicular to the intercept column and to each predictor, hence to $\\hat{\\vec y} = X\\vec b$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "leverage in simple regression",
      statement: "$h_{ii} = \\dfrac1n + \\dfrac{(x_i - \\bar x)^2}{S_{xx}}$.",
      proof: ["$h_{ii}\\sigma^2$ is the variance of the fitted value at $x_i$, which is $\\sigma^2\\left(\\tfrac1n + \\tfrac{(x_i - \\bar x)^2}{S_{xx}}\\right)$ (§{regression-inference})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "variance inflation",
      statement: "$\\operatorname{Var}(b_j) = \\dfrac{\\sigma^2}{(n - 1)s_{x_j}^2}\\cdot\\dfrac{1}{1 - R_j^2}$: the variance it would have with an uncorrelated predictor, times the VIF.",
      proof: ["Only the part of $x_j$ not explained by the other predictors, a fraction $1 - R_j^2$ of its variance, helps estimate $\\beta_j$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Residuals plotted against fitted values fan out, small on the left and large on the right. What is wrong, and what helps?",
      solution: ["The error variance grows with the mean: heteroscedasticity, so standard errors are wrong.", "Model $\\log y$, or use weighted least squares, or report robust (sandwich) standard errors."],
      result: "Unequal variance; transform or weight.",
    },
    {
      type: "example",
      level: 2,
      title: "leverage",
      problem: "A simple regression has $n = 10$, $\\bar x = 5$ and $S_{xx} = 100$. Find the leverage of a point at $x = 12$ and judge it.",
      solution: ["$h = 0.1 + 49/100 = 0.59$.", "The high-leverage guide is $2 \\times 2/10 = 0.4$: this point has high leverage."],
      result: "0.59: high.",
    },
    {
      type: "example",
      level: 3,
      title: "an influential point",
      problem: "A point has residual 2, $s = 1$, leverage 0.5, in a simple regression ($k + 1 = 2$). Find Cook's distance.",
      solution: ["$D = \\dfrac{4}{2 \\times 1}\\cdot\\dfrac{0.5}{0.25} = 2 \\times 2$.", "$D = 4 > 1$: dropping this point would change the fit a great deal."],
      result: "$D = 4$: highly influential.",
    },
  ],
  pitfalls: [
    { wrong: "A high $R^2$ means the assumptions hold.", right: "Check residual plots; $R^2$ says nothing about the shape of the errors." },
    { wrong: "An extreme $x$ is an outlier.", right: "It has high leverage; it is an outlier only if its residual is large too." },
    { wrong: "Delete influential points to improve the fit.", right: "Investigate them; report results with and without, and explain any removal." },
    { wrong: "Check normality of $y$ itself.", right: "The assumption is about the errors: plot the residuals." },
  ],
  formulas: [
    { label: "Studentized residual", tex: "e_i/(s\\sqrt{1 - h_{ii}})" },
    { label: "Leverage (simple)", tex: "h_{ii} = \\tfrac1n + \\tfrac{(x_i - \\bar x)^2}{S_{xx}}" },
    { label: "Cook's distance", tex: "D_i = \\dfrac{e_i^2}{(k + 1)s^2}\\cdot\\dfrac{h_{ii}}{(1 - h_{ii})^2}" },
    { label: "VIF", tex: "1/(1 - R_j^2)" },
  ],
  exercises: [
    ex(1, num("rgdx-ex-1", "Find the VIF when $R_j^2 = 0.5$.", 2, "$1/0.5$."), ["$2$."]),
    ex(1, mc("rgdx-ex-2", "Residuals fan out as the fitted values increase. This suggests", ["unequal error variance", "Heteroscedasticity."], [["a missing quadratic term", "That shows as a curve, not a fan."], ["correlated errors", "That shows against time or order."]]), ["The spread, not the centre, changes with the fit."]),
    ex(2, num("rgdx-ex-3", "A model has $k = 2$ predictors and $n = 30$. Find the average leverage.", 0.1, "$(k + 1)/n$."), ["$3/30 = 0.1$."]),
    ex(2, num("rgdx-ex-4", "Simple regression: $n = 20$, $(x_i - \\bar x)^2 = 36$, $S_{xx} = 120$. Find $h_{ii}$.", 0.35, "$0.05 + 0.3$."), ["$0.35$."]),
    ex(2, num("rgdx-ex-5", "Residual 4, $s = 2$, leverage 0.36. Find the studentized residual.", 2.5, "$4/(2 \\times 0.8)$."), ["$2.5$."]),
    ex(2, num("rgdx-ex-6", "A predictor has VIF 16. By what factor is its coefficient's SE inflated?", 4, "$\\sqrt{\\text{VIF}}$."), ["$\\sqrt{16} = 4$."]),
    ex(3, num("rgdx-ex-7", "Residual 3, $s = 1.5$, leverage 0.2, simple regression. Find Cook's distance.", 0.625, "$\\tfrac{9}{2 \\times 2.25} \\cdot \\tfrac{0.2}{0.64}$."), ["$2 \\times 0.3125 = 0.625$."]),
    ex(3, mc("rgdx-ex-8", "Monthly sales residuals give a Durbin–Watson statistic of 0.6. This suggests", ["positive autocorrelation in the errors", "Values well below 2 mean consecutive residuals move together."], [["no problem", "2 means none; 0.6 is far from it."], ["unequal variance", "Durbin–Watson checks correlation over time."]]), ["Use a time-series model for the errors, or GLS."]),
    ex(3, mc("rgdx-ex-9", "Error variance is proportional to $x$. Weighted least squares should use weights", ["$1/x$", "Weights are inversely proportional to the variance."], [["$x$", "That gives noisy points more weight."], ["$\\sqrt x$", "The weight follows the variance, not the SD."]]), ["$w_i \\propto 1/\\operatorname{Var}(\\varepsilon_i) = 1/x_i$."]),
    ex(3, mc("rgdx-ex-10", "To check the normal-errors assumption, plot", ["a normal Q-Q plot of the residuals", "The assumption is about the errors."], [["a histogram of $y$", "$y$ can be non-normal even when the errors are normal."], ["$y$ against $x$", "That checks linearity, not normality."]]), ["A skewed $x$ can make $y$ skewed with perfectly normal errors."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const rj = r.pick([0.2, 0.5, 0.6, 0.75, 0.8, 0.9, 0.95]);
      const v = 1 / (1 - rj);
      const se = lv === 3 && r.pick([true, false]);
      return n(se ? `A predictor regressed on the others gives $R_j^2 = ${rj}$. By what factor is its coefficient's SE inflated (2 decimals)?` : `A predictor regressed on the others gives $R_j^2 = ${rj}$. Find its VIF (2 decimals).`, r2(se ? Math.sqrt(v) : v), se ? `$\\sqrt{1/(1 - ${rj})} = \\sqrt{${r2(v)}} \\approx ${r2(Math.sqrt(v))}$.` : `$1/(1 - ${rj}) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.pick([10, 20, 25, 40, 50]);
      const sxx = r.pick([50, 80, 100, 200, 250]);
      const dev = r.int(1, Math.floor(Math.sqrt(sxx * 0.8)));
      const h = 1 / nn + (dev * dev) / sxx;
      return n(`Simple regression with $n = ${nn}$ and $S_{xx} = ${sxx}$. A point lies ${dev} from $\\bar x$. Find its leverage (3 decimals).`, Math.round(h * 1000) / 1000, `$\\tfrac{1}{${nn}} + \\tfrac{${dev * dev}}{${sxx}} \\approx ${Math.round(h * 1000) / 1000}$${h > 4 / nn ? `, above the guide $2(k + 1)/n = ${r2(4 / nn)}$` : ""}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { what: "a curved, U-shaped band", ans: "The mean isn't linear: add curvature or transform", wrong: "Unequal variance" },
        { what: "a fan that widens to the right", ans: "Unequal variance: transform or weight", wrong: "Missing curvature" },
        { what: "a patternless horizontal band", ans: "No sign of trouble in this plot", wrong: "Unequal variance" },
      ]);
      return mcNumbers(
        `Residuals against fitted values form ${s.what}; $R^2 = 0.9$. What does the plot say?`,
        { text: s.ans, why: "The plot's pattern, not $R^2$, diagnoses the model." },
        [
          { text: s.wrong, why: "Match the pattern: curves mean wrong shape, fans mean unequal spread." },
          ...(s.what.startsWith("a patternless") ? [] : [{ text: "Nothing: $R^2 = 0.9$ shows the model is fine", why: "$R^2$ can be high while assumptions fail.", misconception: "high-r2-good-model" }]),
        ],
      );
    },
  },
];
