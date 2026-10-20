import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Generalised linear models: exponential family, links, Poisson regression, deviance, overdispersion, offsets, extensions. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "glm",
  title: "Generalised linear models",
  summary: "A GLM keeps the linear predictor η = b + w·x but connects it to the mean through a link, g(μ) = η, and lets y follow an exponential-family distribution: normal with the identity link, binomial with the logit, Poisson with the log. It is fitted by maximum likelihood and compared by deviance.",
  deps: ["logistic-regression", "regression-inference", "likelihood-ratio", "poisson"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "linear predictor", meaning: "$\\eta = \\beta_0 + \\beta_1x_1 + \\dots$, the part of the model that is linear in the coefficients." },
    { term: "link function", meaning: "$g$ with $g(\\mu) = \\eta$; it maps the mean onto the whole real line." },
    { term: "overdispersion", meaning: "More variation than the model's distribution allows, such as counts whose variance far exceeds their mean." },
  ],
  misconceptions: {
    "poisson-coef-additive": "Reads a Poisson regression coefficient as an added count, rather than a multiplicative change $e^\\beta$ in the expected count.",
    "overdispersion-ignored": "Fits a Poisson model to counts whose variance far exceeds their mean and trusts its standard errors, which are then too small.",
  },
  steps: [
    {
      type: "motivate",
      title: "One framework, many outcomes",
      body: "Linear regression predicts a number; logistic regression predicts a probability. Counts of visits, claims or goals need predictions that are never negative and a spread that grows with the mean. All three are special cases of one framework.",
      realWorld: {
        title: "Insurance pricing",
        body: "Motor insurers fit a Poisson GLM to claim counts and a gamma GLM to claim sizes. The product of the two predictions is the premium, and each coefficient becomes a multiplicative rating factor: young drivers ×1.8, and so on.",
      },
    },
    {
      type: "truth",
      statement: "A **generalised linear model** has a linear predictor $\\eta = \\beta_0 + \\beta_1x_1 + \\dots$, a **link** $g(\\mu) = \\eta$ connecting it to the mean $\\mu = E[y]$, and a response distribution from the **exponential family**. Normal with the identity link is linear regression; binomial with the logit is logistic regression (§{logistic-regression}); **Poisson regression** uses $\\log\\mu = \\eta$, so $\\mu = e^\\eta$.",
      body: "In Poisson regression, raising $x_j$ by 1 multiplies the expected count by $e^{\\beta_j}$. GLMs are fitted by maximum likelihood and compared by **deviance**, $D = 2(\\ell_{\\text{saturated}} - \\ell_{\\text{model}})$: a difference of deviances between nested models is a likelihood ratio statistic (§{likelihood-ratio}). If counts vary more than a Poisson allows, use a **quasi-Poisson** or **negative binomial** model.",
    },
    {
      type: "predict",
      misconception: "poisson-coef-additive",
      item: {
        kind: "mc",
        id: "glm-predict-1",
        prompt: "A Poisson regression of weekly store visits has coefficient 0.2 on \"has the app\" (0 or 1). Customers with the app make",
        options: [
          { id: "a", text: "$e^{0.2} \\approx 1.22$ times as many visits: 22% more", correct: true, why: "The log link turns coefficients into multipliers." },
          { id: "b", text: "0.2 more visits a week", misconception: "poisson-coef-additive", why: "That reading suits linear regression, not a log link." },
          { id: "c", text: "20% fewer visits", why: "A positive coefficient raises the expected count." },
        ],
      },
      reveal: {
        body: "The model is $\\log\\mu = \\beta_0 + 0.2\\,\\text{app} + \\dots$, so $\\mu = e^{\\beta_0}\\cdots e^{0.2\\,\\text{app}}$: having the app multiplies the expected count by $e^{0.2} \\approx 1.22$. How many extra visits that is depends on the baseline: 22% of 5 visits is 1.1, of 1 visit is 0.22.",
      },
      resolve: {
        kind: "mc",
        id: "glm-resolve-1",
        prompt: "How is a Poisson regression coefficient $\\beta$ read?",
        options: [
          { id: "a", text: "As $e^\\beta$, the factor by which the expected count is multiplied", correct: true, why: "A rate ratio." },
          { id: "b", text: "As $\\beta$ extra counts", misconception: "poisson-coef-additive", why: "That ignores the log link." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "glm-check-1",
        prompt: "A Poisson model is fitted to counts with mean 4 and variance 20. Its standard errors are probably",
        options: [
          { id: "a", text: "too small: the data are overdispersed", correct: true, why: "Poisson assumes variance = mean." },
          { id: "b", text: "fine, since the model was fitted by maximum likelihood", misconception: "overdispersion-ignored", why: "Maximum likelihood under the wrong variance gives wrong SEs." },
          { id: "c", text: "too large", why: "Extra variation makes the true SEs larger, not the reported ones." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "glm-check-2",
        prompt: "Which link does Poisson regression use by default?",
        options: [
          { id: "a", text: "Log", correct: true, why: "It keeps $\\mu = e^\\eta$ positive." },
          { id: "b", text: "Logit", why: "That is for probabilities." },
          { id: "c", text: "Identity", why: "That could predict negative counts." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "GLMs are the default for counts and rates: clicks with exposure time as an **offset** ($\\log\\mu = \\log t + \\eta$), insurance claims, demand. scikit-learn's PoissonRegressor and TweedieRegressor fit them with regularisation, and gradient-boosted trees offer the same Poisson loss for non-linear models.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "glm-produce-1", prompt: "In a Poisson regression, $\\beta = \\ln 2$ for $x$. Raising $x$ by 1 multiplies the expected count by what?", answer: 2, explain: "$e^{\\ln 2}$." },
        { kind: "number", id: "glm-produce-2", prompt: "A Poisson model has linear predictor $\\eta = 1.5$. Find $\\mu$ to 3 decimals.", answer: Math.round(Math.exp(1.5) * 1000) / 1000, tolerance: 0.001, explain: "$e^{1.5}$." },
        {
          kind: "mc",
          id: "glm-produce-3",
          prompt: "Counts with variance far above their mean call for",
          options: [
            { id: "a", text: "a negative binomial or quasi-Poisson model", correct: true, why: "They allow extra variation." },
            { id: "b", text: "the Poisson model unchanged", misconception: "overdispersion-ignored", why: "Its SEs would be too small." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "glm-review-1", prompt: "Adding a predictor drops the deviance from 15.2 to 9.8. Find the likelihood ratio statistic.", answer: 5.4, explain: "The deviance difference." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "exponential family",
      body: "A density of the form $f(y) = \\exp\\!\\left(\\dfrac{y\\theta - b(\\theta)}{\\phi} + c(y, \\phi)\\right)$ has mean $b'(\\theta)$ and variance $\\phi\\,b''(\\theta)$. The normal, binomial, Poisson, gamma and inverse Gaussian are all of this form. Each has a **canonical link**: identity, logit, log, inverse and inverse square.",
    },
    {
      type: "definition",
      term: "other GLMs",
      body: "**Probit** regression uses $\\Phi^{-1}(p) = \\eta$. **Multinomial** logistic regression fits $K - 1$ log-odds against a baseline class; **ordinal** logistic regression models cumulative log-odds $\\ln\\tfrac{P(Y \\le k)}{P(Y > k)}$. **Zero-inflated** and **hurdle** models handle excess zeros (§{mixtures}). **GEE** and **mixed-effects GLMs** handle clustered data such as repeated measures on the same patients.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "variance functions",
      statement: "In a GLM, $\\operatorname{Var}(y) = \\phi V(\\mu)$: normal $V = 1$, Poisson $V = \\mu$ (with $\\phi = 1$), binomial proportion $V = \\mu(1 - \\mu)$, gamma $V = \\mu^2$. The negative binomial has $\\operatorname{Var} = \\mu + \\mu^2/k$.",
      proof: ["Each follows from $\\phi b''(\\theta)$ for that family. The negative binomial is a Poisson whose rate varies like a gamma; the law of total variance (§{joint-distributions}) gives $\\mu + \\mu^2/k$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "checking for overdispersion",
      statement: "Estimate $\\hat\\phi = \\dfrac{1}{n - p}\\sum\\dfrac{(y_i - \\hat\\mu_i)^2}{\\hat\\mu_i}$ (Pearson's statistic over its degrees of freedom). Values well above 1 signal overdispersion; a quasi-Poisson model keeps the estimates but multiplies every SE by $\\sqrt{\\hat\\phi}$.",
      proof: ["Under the Poisson model each term $(y - \\mu)^2/\\mu$ has expectation about 1, so their average estimates the true variance relative to the Poisson's."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "deviance tests",
      statement: "For nested GLMs, the drop in deviance when $q$ terms are added is approximately $\\chi^2_q$ under $H_0$ that their coefficients are 0.",
      proof: ["Deviances share the same saturated log-likelihood, which cancels in the difference, leaving $2(\\ell_{\\text{large}} - \\ell_{\\text{small}})$, a likelihood ratio statistic (Wilks)."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A Poisson model has $\\eta = 0.5 + 0.3x$. Predict the mean count at $x = 2$.",
      solution: ["$\\eta = 0.5 + 0.6 = 1.1$.", "$\\mu = e^{1.1} \\approx 3.00$."],
      result: "About 3.0.",
    },
    {
      type: "example",
      level: 2,
      title: "a rate ratio",
      problem: "A safety campaign's coefficient in a Poisson model of accidents is $-0.4$. Interpret it.",
      solution: ["$e^{-0.4} \\approx 0.670$.", "Accident counts are expected to be about 33% lower with the campaign, other things equal."],
      result: "Rate ratio 0.67: about a third fewer accidents.",
    },
    {
      type: "example",
      level: 3,
      title: "overdispersion",
      problem: "A Poisson fit with 100 residual degrees of freedom has Pearson statistic 300. Assess it, and adjust a coefficient's SE of 0.05.",
      solution: ["$\\hat\\phi = 300/100 = 3$: the counts vary three times as much as a Poisson allows.", "Quasi-Poisson SE: $0.05 \\times \\sqrt3 \\approx 0.087$."],
      result: "$\\hat\\phi = 3$; SE about 0.087.",
    },
    {
      type: "example",
      level: 3,
      title: "a deviance test",
      problem: "Adding two predictors lowers the deviance from 210 to 198. Test at 5% (cut-off 5.99 for $\\chi^2_2$).",
      solution: ["The drop is $210 - 198 = 12$ on 2 d.f.", "$12 > 5.99$: the predictors help."],
      result: "Significant.",
    },
  ],
  pitfalls: [
    { wrong: "A Poisson coefficient is an added count.", right: "$e^\\beta$ multiplies the expected count." },
    { wrong: "Trust Poisson SEs whatever the data.", right: "Check $\\hat\\phi$; overdispersed counts need quasi-Poisson or negative binomial." },
    { wrong: "Fit ordinary least squares to counts.", right: "It can predict negative counts and assumes constant variance; use a Poisson GLM." },
  ],
  formulas: [
    { label: "GLM", tex: "g(\\mu) = \\eta = \\beta_0 + \\textstyle\\sum\\beta_jx_j" },
    { label: "Poisson", tex: "\\log\\mu = \\eta,\\quad \\text{rate ratio } e^{\\beta_j}" },
    { label: "Offset", tex: "\\log\\mu = \\log t + \\eta" },
    { label: "Deviance", tex: "D = 2(\\ell_{\\text{sat}} - \\ell_{\\text{model}})" },
    { label: "Dispersion", tex: "\\hat\\phi = \\tfrac{1}{n - p}\\textstyle\\sum(y - \\hat\\mu)^2/\\hat\\mu" },
  ],
  exercises: [
    ex(1, dp("glmx-ex-1", "A Poisson model has $\\eta = 2$. Find $\\mu$.", Math.exp(2), "$e^2$."), ["$e^2 \\approx 7.389$."]),
    ex(1, mc("glmx-ex-2", "Logistic regression is the GLM with", ["a binomial response and logit link", "$\\ln\\tfrac{p}{1 - p} = \\eta$."], [["a Poisson response and log link", "That is Poisson regression."], ["a normal response and identity link", "That is linear regression."]]), ["The logit maps probabilities onto the whole real line."]),
    ex(2, dp("glmx-ex-3", "A Poisson coefficient is 0.1. By what fraction does the expected count rise per unit of $x$?", Math.exp(0.1) - 1, "$e^{0.1} - 1$."), ["$e^{0.1} - 1 \\approx 0.105$: about 10.5%."]),
    ex(2, num("glmx-ex-4", "A Poisson fit has Pearson statistic 250 on 125 residual degrees of freedom. Find $\\hat\\phi$.", 2, "$250/125$."), ["$2$."]),
    ex(2, dp("glmx-ex-5", "Same fit. By what factor should the SEs be multiplied?", Math.SQRT2, "$\\sqrt{\\hat\\phi}$."), ["$\\sqrt2 \\approx 1.414$."]),
    ex(2, num("glmx-ex-6", "The deviance falls from 210 to 198 when predictors are added. Find the likelihood ratio statistic.", 12, "The difference."), ["$12$."]),
    ex(3, num("glmx-ex-7", "A negative binomial has mean 4 and $k = 2$. Find its variance.", 12, "$\\mu + \\mu^2/k$."), ["$4 + 16/2 = 12$."]),
    ex(3, dp("glmx-ex-8", "Claims follow a Poisson model with an offset: $\\log\\mu = \\log t + 0.5$. Find $\\mu$ for exposure $t = 2$ years.", 2 * Math.exp(0.5), "$\\mu = te^{0.5}$."), ["$2e^{0.5} \\approx 3.297$."]),
    ex(3, mc("glmx-ex-9", "Probit and logit models fitted to the same data usually", ["give similar fitted probabilities, with logit coefficients about 1.6–1.8 times the probit ones", "The two links have similar shapes but different scales."], [["give opposite conclusions", "They rarely differ much."], ["give identical coefficients", "The scales differ."]]), ["The logistic distribution's SD is $\\pi/\\sqrt3 \\approx 1.8$ times the normal's, which sets the ratio."]),
    ex(3, mc("glmx-ex-10", "In a binomial GLM for a proportion, the variance function is", ["$\\mu(1 - \\mu)$", "Largest at $\\mu = 0.5$."], [["$\\mu$", "That is the Poisson's."], ["constant", "That is the normal's."]]), ["Proportions near 0 or 1 vary least."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const b0 = r.pick([-0.5, 0, 0.3, 0.5, 1]);
      const b1 = r.pick([0.1, 0.2, 0.25, 0.4, -0.3]);
      const x = r.int(0, 2 + 2 * lv);
      const mu = Math.exp(b0 + b1 * x);
      return n(`A Poisson model has $\\log\\mu = ${b0} ${b1 < 0 ? "-" : "+"} ${Math.abs(b1)}x$. Predict the mean count at $x = ${x}$ (3 decimals).`, Math.round(mu * 1000) / 1000, `$\\eta = ${r2(b0 + b1 * x)}$, so $\\mu = e^{${r2(b0 + b1 * x)}} \\approx ${Math.round(mu * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.pick([-0.5, -0.3, -0.2, 0.1, 0.2, 0.3, 0.5, 0.7]);
      const v = Math.exp(b);
      return n(`A Poisson regression coefficient is ${b}. Find the rate ratio $e^\\beta$ (3 decimals).`, Math.round(v * 1000) / 1000, `$e^{${b}} \\approx ${Math.round(v * 1000) / 1000}$: the expected count is ${v > 1 ? "multiplied" : "scaled"} by this per unit.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const b = r.pick([0.1, 0.2, 0.3, 0.4]);
      const pct = Math.round((Math.exp(b) - 1) * 100);
      return mcNumbers(
        `In a Poisson regression of support tickets, a premium plan has coefficient ${b}. Premium customers file`,
        { text: `about ${pct}% more tickets`, why: `$e^{${b}} \\approx ${r2(Math.exp(b))}$.` },
        [
          { text: `${b} more tickets each`, why: "The log link makes coefficients multiplicative.", misconception: "poisson-coef-additive" },
          { text: `about ${pct}% fewer tickets`, why: "A positive coefficient raises the count." },
        ],
      );
    },
  },
];
