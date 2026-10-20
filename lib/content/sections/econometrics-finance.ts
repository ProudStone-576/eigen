import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Econometrics (omitted-variable bias, panel data and fixed effects, robust and clustered standard errors), financial statistics (returns, volatility scaling, Sharpe ratio, beta, value at risk), actuarial statistics (frequency and severity, credibility), and business analytics (customer lifetime value, experiments, metrics). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const clv = (m: number, r: number, d: number) => (m * r) / (1 + d - r);

const base: ConceptNode = {
  id: "econometrics-finance",
  title: "Econometrics, finance & actuarial statistics",
  summary: "Economics and business work mostly with observational data about people and firms who choose what they do, so econometrics is preoccupied with bias: omitted variables, unobserved differences between units, and errors that aren't independent. Finance models returns and risk; actuarial science prices uncertain losses; business analytics turns customer data and experiments into decisions.",
  deps: ["regression-inference", "quasi-experiments", "advanced-time-series"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "omitted-variable bias", meaning: "Bias in a regression coefficient caused by leaving out a variable that affects the outcome and is correlated with the included regressor." },
    { term: "fixed effects", meaning: "Unit-specific intercepts in panel data, removing all time-constant differences between units." },
    { term: "value at risk", meaning: "The loss that will not be exceeded with a given probability over a given horizon." },
  ],
  misconceptions: {
    "omitted-variable-harmless": "Thinks leaving a relevant variable out of a regression only costs precision, not bias.",
    "volatility-scales-linearly": "Thinks the volatility over $T$ days is $T$ times the daily volatility, rather than $\\sqrt T$ times.",
  },
  steps: [
    {
      type: "motivate",
      title: "Data from people who choose",
      body: "People with more education earn more. But those who stay in school longer may also be more able or better connected, so a regression of earnings on schooling mixes the effect of schooling with everything correlated with it. In finance the same carefulness applies to risk: a portfolio that seems safe day to day can be far riskier over a year, or in a crisis.",
      realWorld: {
        title: "Insurance pricing",
        body: "A motor insurer prices each policy as expected claim frequency times expected claim size, plus loadings for expenses and risk, using generalised linear models (§{glm}) fitted to millions of policy-years.",
      },
    },
    {
      type: "truth",
      statement: "**Omitted-variable bias**: if the truth is $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\varepsilon$ but $x_2$ is left out, the slope on $x_1$ estimates $\\beta_1 + \\beta_2\\delta$, where $\\delta$ is the slope from regressing $x_2$ on $x_1$. **Panel data** follow units over time; **fixed effects** (unit dummies, or demeaning each unit's data) remove every time-constant confounder. With unequal error variances use **heteroskedasticity-robust** standard errors, and with correlated errors within groups (firms, schools, years) use **clustered** standard errors (§{regression-inference}).",
      body: "In finance, use **log returns** $r_t = \\ln(P_t/P_{t-1})$, which add over time. If daily returns are roughly independent with SD $\\sigma$, the $T$-day SD is $\\sigma\\sqrt T$ (annualise with about 252 trading days). The **Sharpe ratio** is $(\\bar r - r_f)/\\sigma$; the **beta** of an asset is $\\operatorname{Cov}(r_i, r_m)/\\operatorname{Var}(r_m)$; normal **value at risk** at level 99% is $2.326\\,\\sigma$ times the position, though real returns have fat tails and volatility clustering (§{advanced-time-series}). **Actuaries** price expected loss as claim frequency times severity, and blend a policyholder's own experience with the class average by **credibility** $Z = n/(n + k)$. **Business analytics**: customer lifetime value with margin $m$, retention $r$ and discount rate $d$ is $\\dfrac{mr}{1 + d - r}$; product changes are tested by randomised experiments.",
    },
    {
      type: "predict",
      misconception: "omitted-variable-harmless",
      item: {
        kind: "mc",
        id: "ecf-predict-1",
        prompt: "Suppose earnings $= 2 + 1.5 \\times \\text{schooling} + 3 \\times \\text{ability}$, and ability rises by 0.5 per year of schooling on average. Regressing earnings on schooling alone gives a slope of about",
        options: [
          { id: "a", text: "3.0: the 1.5 plus $3 \\times 0.5$ borrowed from ability", correct: true, why: "$\\beta_1 + \\beta_2\\delta$." },
          { id: "b", text: "1.5, just less precisely estimated", misconception: "omitted-variable-harmless", why: "Ability is correlated with schooling, so its effect is absorbed." },
          { id: "c", text: "4.5", why: "That adds the full ability effect, not its projection." },
        ],
      },
      reveal: {
        body: "Leaving ability out lets the schooling coefficient pick up ability's effect through their correlation: $1.5 + 3 \\times 0.5 = 3.0$, double the true return. Omitted variables cost precision only if they are uncorrelated with the included regressors. Fixes include measuring the confounder, panel fixed effects, or instruments (§{quasi-experiments}).",
      },
      resolve: {
        kind: "mc",
        id: "ecf-resolve-1",
        prompt: "Omitting a variable biases a coefficient when the variable",
        options: [
          { id: "a", text: "affects the outcome and is correlated with the included regressor", correct: true, why: "Both conditions are needed." },
          { id: "b", text: "never: omitting variables only widens intervals", misconception: "omitted-variable-harmless", why: "Correlated omitted causes bias the estimate." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ecf-check-1",
        prompt: "A stock's daily return SD is 1%. Assuming independent days, its annual (252-day) SD is about",
        options: [
          { id: "a", text: "15.9%", correct: true, why: "$1\\% \\times \\sqrt{252}$." },
          { id: "b", text: "252%", misconception: "volatility-scales-linearly", why: "Variances add, so SDs grow like $\\sqrt T$." },
          { id: "c", text: "1%", why: "Risk grows with the horizon." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ecf-check-2",
        prompt: "A fund returns 9% a year with SD 12%; the risk-free rate is 3%. Its Sharpe ratio is",
        options: [
          { id: "a", text: "0.5", correct: true, why: "$(9 - 3)/12$." },
          { id: "b", text: "0.75", why: "Subtract the risk-free rate first." },
          { id: "c", text: "2", why: "Divide excess return by SD, not the reverse." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Quantitative finance uses machine learning with heavy caution about overfitting backtests (§{learning-theory}): trying many strategies on the same history guarantees some look brilliant. Demand forecasting, pricing, churn and credit models are the bread and butter of business analytics, increasingly paired with causal methods for decisions.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ecf-produce-1", prompt: "Cov$(r_i, r_m) = 0.0018$ and Var$(r_m) = 0.0012$. Find the asset's beta.", answer: 1.5, explain: "$0.0018/0.0012$." },
        { kind: "number", id: "ecf-produce-2", prompt: "Credibility $Z = n/(n + k)$ with $n = 50$ policy-years and $k = 150$. Own claims average ₹800, the class average is ₹1,000. Find the credibility premium in rupees.", answer: 950, explain: "$Z = 0.25$: $0.25 \\times 800 + 0.75 \\times 1000$." },
        {
          kind: "mc",
          id: "ecf-produce-3",
          prompt: "Daily VaR of a position is ₹1 lakh. Under the square-root rule, its 25-day VaR is about",
          options: [
            { id: "a", text: "₹5 lakh", correct: true, why: "$\\sqrt{25} = 5$." },
            { id: "b", text: "₹25 lakh", misconception: "volatility-scales-linearly", why: "SD scales like $\\sqrt T$." },
          ],
        },
        {
          kind: "mc",
          id: "ecf-produce-4",
          prompt: "A wage regression omits job tenure, which raises wages and is correlated with age. The age coefficient is",
          options: [
            { id: "a", text: "biased, absorbing part of tenure's effect", correct: true, why: "A correlated omitted cause." },
            { id: "b", text: "unbiased, just less precise", misconception: "omitted-variable-harmless", why: "Correlation with age creates bias." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "ecf-review-1", prompt: "Claim frequency 0.1 per year and average claim ₹20,000. Find the pure premium in rupees.", answer: 2000, explain: "$0.1 \\times 20000$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "fixed effects and clustering",
      body: "For panel data $y_{it} = \\alpha_i + \\beta x_{it} + \\varepsilon_{it}$, subtracting each unit's own means removes $\\alpha_i$: $\\beta$ is then estimated only from changes within units over time, so any time-constant confounder (ability, location, culture) drops out. Time-varying confounders don't. Errors for the same unit are correlated across time, so standard errors should be **clustered** by unit; ignoring this can make them several times too small.",
    },
    {
      type: "definition",
      term: "returns and risk",
      body: "Simple return $R = P_t/P_{t-1} - 1$; log return $r = \\ln(1 + R)$. Log returns add over periods: a rise from 100 to 110 then a fall to 99 gives $\\ln 1.1 + \\ln 0.9 = \\ln 0.99$. Portfolio risk depends on correlations: $\\sigma_p^2 = w^{\\mathsf T}\\Sigma w$ (§{covariance}). Normal VaR at level $1 - \\alpha$ is $z_{1-\\alpha}\\sigma V$ for position value $V$; **expected shortfall** averages losses beyond VaR and handles fat tails better.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "omitted-variable bias",
      statement: "If $y = \\beta_0 + \\beta_1x_1 + \\beta_2x_2 + \\varepsilon$ and $x_2 = \\gamma + \\delta x_1 + u$, regressing $y$ on $x_1$ alone gives slope $\\beta_1 + \\beta_2\\delta$ in large samples.",
      proof: ["Substitute: $y = (\\beta_0 + \\beta_2\\gamma) + (\\beta_1 + \\beta_2\\delta)x_1 + (\\beta_2u + \\varepsilon)$, where the new error is uncorrelated with $x_1$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "square-root-of-time scaling",
      statement: "If daily log returns are independent with variance $\\sigma^2$, the $T$-day log return has variance $T\\sigma^2$ and SD $\\sigma\\sqrt T$.",
      proof: ["Log returns add, and variances of independent sums add. Volatility clustering and autocorrelation make this an approximation."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "customer lifetime value",
      statement: "With constant margin $m$ per period, retention probability $r$ and discount rate $d$, counting from the next period, $\\text{CLV} = \\sum_{t \\ge 1}\\dfrac{mr^t}{(1 + d)^t} = \\dfrac{mr}{1 + d - r}$.",
      proof: ["A geometric series with first term $mr/(1 + d)$ and ratio $r/(1 + d) < 1$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A position worth ₹1 crore has daily return SD 2%. Find its one-day 99% normal VaR.",
      solution: ["$2.326 \\times 0.02 \\times 1$ crore.", "$\\approx$ ₹4.65 lakh."],
      result: "About ₹4.65 lakh.",
    },
    {
      type: "example",
      level: 2,
      title: "customer lifetime value",
      problem: "Margin ₹1,000 a year, 80% annual retention, 10% discount rate. Find the CLV.",
      solution: ["$\\dfrac{1000 \\times 0.8}{1 + 0.1 - 0.8} = \\dfrac{800}{0.3}$.", "$\\approx$ ₹2,667."],
      result: "About ₹2,667.",
    },
    {
      type: "example",
      level: 3,
      title: "fixed effects",
      problem: "Two workers: A earns 30 then 34 after a training course; B earns 50 then 52 without one. A pooled comparison after training shows A earning 18 less. What does a within-worker (fixed-effects, difference-in-differences) comparison suggest?",
      solution: ["Changes: A $+4$, B $+2$.", "The training is associated with $+2$, once each worker's fixed level is removed."],
      result: "$+2$, not $-18$.",
    },
  ],
  pitfalls: [
    { wrong: "Leaving out a variable only costs precision.", right: "If it is correlated with included regressors and affects the outcome, it biases them." },
    { wrong: "Scale daily volatility by $T$.", right: "Scale by $\\sqrt T$ (and remember fat tails and clustering)." },
    { wrong: "Use ordinary standard errors with panel or grouped data.", right: "Cluster them." },
  ],
  formulas: [
    { label: "OVB", tex: "\\hat\\beta_1 \\to \\beta_1 + \\beta_2\\delta" },
    { label: "Annual volatility", tex: "\\sigma\\sqrt{252}" },
    { label: "Sharpe, beta", tex: "\\dfrac{\\bar r - r_f}{\\sigma},\\quad \\dfrac{\\operatorname{Cov}(r_i, r_m)}{\\operatorname{Var}(r_m)}" },
    { label: "Credibility, CLV", tex: "Z = \\dfrac{n}{n + k},\\quad \\dfrac{mr}{1 + d - r}" },
  ],
  exercises: [
    ex(1, num("ecfx-ex-1", "Annual return 11%, SD 16%, risk-free rate 3%. Find the Sharpe ratio.", 0.5, "$8/16$."), ["$0.5$."]),
    ex(1, num("ecfx-ex-2", "Claim frequency 0.05 per year, average claim ₹40,000. Find the pure premium in rupees.", 2000, "$0.05 \\times 40000$."), ["$2000$."]),
    ex(2, num("ecfx-ex-3", "True model $y = 1 + 2x_1 + 4x_2$; $x_2$ rises by 0.25 per unit of $x_1$. Find the slope from regressing $y$ on $x_1$ alone.", 3, "$2 + 4 \\times 0.25$."), ["$3$."]),
    ex(2, dp("ecfx-ex-4", "Daily SD 1.5%. Find the annual (252-day) SD in percent.", 1.5 * Math.sqrt(252), "$1.5\\sqrt{252}$."), ["$\\approx 23.812\\%$."]),
    ex(2, dp("ecfx-ex-5", "Find the log return from a price of 100 to 120.", Math.log(1.2), "$\\ln 1.2$."), ["$\\approx 0.182$."]),
    ex(3, dp("ecfx-ex-6", "Margin ₹500 a year, retention 0.9, discount rate 0.1. Find the CLV in rupees.", clv(500, 0.9, 0.1), "$\\dfrac{mr}{1 + d - r}$."), ["$450/0.2 = 2250$."]),
    ex(3, mc("ecfx-ex-7", "A study of 50 schools over 10 years reports standard errors that ignore correlation within schools. They are likely", ["too small: cluster by school", "Observations from the same school aren't independent."], [["too large", "Positive within-cluster correlation shrinks ordinary SEs falsely."], ["correct", "Independence is violated."]]), ["Clustering can widen SEs a lot."]),
    ex(3, mc("ecfx-ex-8", "Fixed effects for each worker remove confounding by", ["anything about a worker that doesn't change over time", "Within-worker comparisons cancel it."], [["all confounders", "Time-varying ones remain."], ["nothing", "Stable traits are removed."]]), ["Add time effects for common shocks too."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const b1 = r.pick([0.5, 1, 1.5, 2, 3]);
      const b2 = r.pick([-2, -1, 1, 2, 4]);
      const d = r.pick([-0.5, -0.25, 0.25, 0.5, 1]);
      const v = b1 + b2 * d;
      return n(`True model $y = ${b1}x_1 + (${b2})x_2 + \\varepsilon$; regressing $x_2$ on $x_1$ gives slope ${d}. Find the slope from regressing $y$ on $x_1$ alone.`, r2(v), `$${b1} + (${b2})(${d}) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = r.pick([0.5, 0.8, 1, 1.2, 2]);
      const T = r.pick([4, 9, 16, 25, 252]);
      const v = s * Math.sqrt(T);
      return n(`Daily return SD is ${s}%. Assuming independent days, find the ${T}-day SD in percent (3 decimals).`, Math.round(v * 1000) / 1000, `$${s}\\sqrt{${T}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = r.pick([200, 500, 1000, 2000]);
      const ret = r.pick([0.6, 0.7, 0.8, 0.9]);
      const d = r.pick([0.05, 0.1, 0.15]);
      const v = clv(m, ret, d);
      return n(`Margin ₹${m} per year, retention ${ret}, discount rate ${d}. Find the customer lifetime value in rupees (2 decimals).`, r2(v), `$\\dfrac{${m} \\times ${ret}}{1 + ${d} - ${ret}} \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([10, 25, 50, 100, 200]);
      const k = r.pick([50, 100, 150, 300]);
      const own = r.int(5, 15) * 100;
      const cls = r.int(8, 12) * 100;
      const z = nn / (nn + k);
      const v = z * own + (1 - z) * cls;
      return n(`Credibility $Z = n/(n + k)$ with $n = ${nn}$ and $k = ${k}$. Own average claims ₹${own}, class average ₹${cls}. Find the credibility premium in rupees (2 decimals).`, r2(v), `$Z \\approx ${r2(z)}$; $Z \\times ${own} + (1 - Z) \\times ${cls} \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const T = r.pick([4, 9, 16, 100]);
      return mcNumbers(
        `A portfolio's one-day SD is ₹1 lakh. Under independent days, its ${T}-day SD is about`,
        { text: `₹${Math.sqrt(T)} lakh`, why: `$\\sqrt{${T}}$ scaling.` },
        [{ text: `₹${T} lakh`, why: "Variances add, not SDs.", misconception: "volatility-scales-linearly" }],
      );
    },
  },
];
