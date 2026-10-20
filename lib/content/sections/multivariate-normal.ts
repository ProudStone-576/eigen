import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The bivariate and multivariate normal: linear combinations, conditional distributions, independence, contours. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const M = (a: number | string, b: number | string, c: number | string, d: number | string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;

const base: ConceptNode = {
  id: "multivariate-normal",
  title: "The multivariate normal",
  summary: "A random vector is multivariate normal when every linear combination of its entries is normal. It is fixed by a mean vector and a covariance matrix; its contours are ellipses along the covariance matrix's eigenvectors, its conditional distributions are normal, and for it zero correlation means independence.",
  deps: ["normal", "covariance", "pca-practice"],
  pos: { x: 3, y: 3 },
  glossary: [
    { term: "mean vector", meaning: "$\\vec\\mu = E[\\vec X]$, the vector of the entries' means." },
    { term: "covariance matrix", meaning: "$\\Sigma$, with variances on the diagonal and covariances off it." },
    { term: "jointly normal", meaning: "Every linear combination $\\vec a^{\\mathsf T}\\vec X$ is normal; much stronger than each entry being normal." },
  ],
  misconceptions: {
    "marginals-normal-joint": "Thinks that if X and Y are each normal, the pair (X, Y) must be jointly normal.",
    "uncorrelated-independent-general": "Thinks zero correlation means independence for any variables, not only jointly normal ones.",
  },
  steps: [
    {
      type: "motivate",
      title: "Height and weight together",
      body: "Height and weight are each roughly normal, and they rise together. The bivariate normal describes the pair at once: an elliptical cloud whose tilt is set by the correlation. It is the default model for several measurements on the same unit.",
      realWorld: {
        title: "Portfolio risk",
        body: "Banks often model the daily returns of many assets as multivariate normal. The covariance matrix then gives the variance of any portfolio with weights $\\vec w$ as $\\vec w^{\\mathsf T}\\Sigma\\vec w$.",
      },
    },
    {
      type: "explore",
      title: "Find the long axis",
      body: "A correlated cloud of points; the line is a direction you can turn.",
      widget: { kind: "spread", points: [[-2, -1.6], [-1.5, -0.8], [-1, -1.2], [-0.5, 0.1], [0, -0.3], [0.4, 0.6], [0.8, 0.2], [1.2, 1.3], [1.6, 0.9], [2, 1.8]] },
      task: "Turn the direction until the projections spread most. That is the long axis of the ellipse the multivariate normal's contours follow.",
    },
    {
      type: "truth",
      statement: "$\\vec X \\sim N(\\vec\\mu, \\Sigma)$ in $d$ dimensions has density $\\dfrac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}\\exp\\!\\left(-\\tfrac12(\\vec x - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec x - \\vec\\mu)\\right)$. Every linear combination $\\vec a^{\\mathsf T}\\vec X$ is normal, with mean $\\vec a^{\\mathsf T}\\vec\\mu$ and variance $\\vec a^{\\mathsf T}\\Sigma\\vec a$.",
      body: "The contours are ellipses (ellipsoids) centred at $\\vec\\mu$, with axes along the eigenvectors of $\\Sigma$ and half-lengths proportional to $\\sqrt{\\lambda_i}$ (§{pca-practice}). For jointly normal variables, uncorrelated means independent; for other variables it doesn't.",
    },
    {
      type: "predict",
      misconception: "marginals-normal-joint",
      item: {
        kind: "mc",
        id: "mvn-predict-1",
        prompt: "$X \\sim N(0, 1)$. Let $Y = X$ when $|X| < 1$ and $Y = -X$ otherwise. Both $X$ and $Y$ are standard normal. Is $(X, Y)$ jointly normal?",
        options: [
          { id: "a", text: "No: $X + Y = 0$ whenever $|X| \\ge 1$, so $X + Y$ isn't normal", correct: true, why: "A linear combination fails to be normal." },
          { id: "b", text: "Yes: both $X$ and $Y$ are normal", misconception: "marginals-normal-joint", why: "Joint normality needs every combination to be normal." },
          { id: "c", text: "$Y$ is not normal, so the question doesn't arise", why: "By symmetry, flipping the sign outside $(-1, 1)$ keeps $Y$ standard normal." },
        ],
      },
      reveal: {
        body: "$Y$ is standard normal by symmetry. But $X + Y$ equals $2X$ when $|X| < 1$ and exactly 0 otherwise, which happens with probability about 0.32: a point mass at 0, not a normal variable. Joint normality is a property of the pair, not of each variable separately.",
      },
      resolve: {
        kind: "mc",
        id: "mvn-resolve-1",
        prompt: "What makes $(X, Y)$ jointly normal?",
        options: [
          { id: "a", text: "Every linear combination $aX + bY$ is normal", correct: true, why: "That is the definition." },
          { id: "b", text: "$X$ is normal and $Y$ is normal", misconception: "marginals-normal-joint", why: "The example above has normal marginals but isn't jointly normal." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mvn-check-1",
        prompt: "$X \\sim N(0, 1)$ and $Y = X^2$. Then $\\operatorname{Corr}(X, Y) = 0$. Are $X$ and $Y$ independent?",
        options: [
          { id: "a", text: "No: $Y$ is a function of $X$; zero correlation gives independence only for jointly normal variables", correct: true, why: "$(X, X^2)$ is not jointly normal." },
          { id: "b", text: "Yes: zero correlation means independence", misconception: "uncorrelated-independent-general", why: "Knowing $X$ tells you $Y$ exactly." },
          { id: "c", text: "The correlation can't be 0", why: "$\\operatorname{Cov}(X, X^2) = E[X^3] = 0$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mvn-check-2",
        prompt: `$\\vec X$ has covariance matrix $${M(4, 3, 3, 9)}$. Find $\\operatorname{Var}(X_1 + X_2)$.`,
        options: [
          { id: "a", text: "19", correct: true, why: "$4 + 9 + 2 \\times 3$." },
          { id: "b", text: "13", why: "That ignores the covariance." },
          { id: "c", text: "16", why: "The covariance counts twice." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Gaussian mixtures, Gaussian processes, linear discriminant analysis and the Kalman filter all rest on the multivariate normal, because its marginals and conditionals stay normal in closed form. **Whitening**, $\\Sigma^{-1/2}(\\vec x - \\vec\\mu)$, turns correlated features into uncorrelated ones with unit variance.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mvn-produce-1", prompt: `Covariance matrix $${M(4, 3, 3, 9)}$. Find $\\operatorname{Var}(X_1 - X_2)$.`, answer: 7, explain: "$4 + 9 - 2 \\times 3$." },
        { kind: "number", id: "mvn-produce-2", prompt: "Bivariate normal with $\\mu_X = \\mu_Y = 0$, $\\sigma_X = 1$, $\\sigma_Y = 2$, $\\rho = 0.5$. Find $E[Y \\mid X = 2]$.", answer: 2, explain: "$\\rho\\tfrac{\\sigma_Y}{\\sigma_X}x = 0.5 \\times 2 \\times 2$." },
        {
          kind: "mc",
          id: "mvn-produce-3",
          prompt: "Zero correlation implies independence",
          options: [
            { id: "a", text: "for jointly normal variables, but not in general", correct: true, why: "Only then does the density factorise." },
            { id: "b", text: "always", misconception: "uncorrelated-independent-general", why: "$Y = X^2$ is uncorrelated with $X$ and fully dependent on it." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mvn-review-1", prompt: "Bivariate normal: $\\mu_X = 0$, $\\sigma_X = 2$, $\\mu_Y = 5$, $\\sigma_Y = 10$, $\\rho = 0.6$. Find $E[Y \\mid X = 1]$.", answer: 8, explain: "$5 + 0.6 \\times \\tfrac{10}{2} \\times 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "bivariate normal",
      body: "With standardised values $z_x = \\tfrac{x - \\mu_X}{\\sigma_X}$ and $z_y = \\tfrac{y - \\mu_Y}{\\sigma_Y}$, the bivariate normal density is $\\dfrac{1}{2\\pi\\sigma_X\\sigma_Y\\sqrt{1 - \\rho^2}}\\exp\\!\\left(-\\dfrac{z_x^2 - 2\\rho z_xz_y + z_y^2}{2(1 - \\rho^2)}\\right)$.",
    },
    {
      type: "definition",
      term: "Mahalanobis distance",
      body: "$d^2 = (\\vec x - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec x - \\vec\\mu)$ measures distance in units of the distribution's own spread, allowing for correlation. Contours of constant density are contours of constant $d$, and for $N(\\vec\\mu, \\Sigma)$ in $d$ dimensions, $d^2 \\sim \\chi^2_d$ (§{sampling-distributions}).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "linear transformations",
      statement: "If $\\vec X \\sim N(\\vec\\mu, \\Sigma)$, then $A\\vec X + \\vec b \\sim N(A\\vec\\mu + \\vec b,\\ A\\Sigma A^{\\mathsf T})$.",
      proof: ["Every linear combination of $A\\vec X + \\vec b$ is a linear combination of $\\vec X$ plus a constant, hence normal. Its mean is $A\\vec\\mu + \\vec b$, and $E[A(\\vec X - \\vec\\mu)(\\vec X - \\vec\\mu)^{\\mathsf T}A^{\\mathsf T}] = A\\Sigma A^{\\mathsf T}$."],
    },
    {
      type: "theorem",
      name: "conditional distribution",
      statement: "For a bivariate normal, $Y \\mid X = x \\sim N\\!\\left(\\mu_Y + \\rho\\dfrac{\\sigma_Y}{\\sigma_X}(x - \\mu_X),\\ \\sigma_Y^2(1 - \\rho^2)\\right)$. The conditional mean is the regression line (§{least-squares}); the conditional variance does not depend on $x$.",
      proof: [
        "Write $Y = \\mu_Y + \\rho\\tfrac{\\sigma_Y}{\\sigma_X}(X - \\mu_X) + E$. Then $\\operatorname{Cov}(X, E) = \\rho\\sigma_X\\sigma_Y - \\rho\\tfrac{\\sigma_Y}{\\sigma_X}\\sigma_X^2 = 0$.",
        "$(X, E)$ is jointly normal and uncorrelated, hence independent, with $\\operatorname{Var}(E) = \\sigma_Y^2 - \\rho^2\\sigma_Y^2$. Fixing $X = x$ leaves $E$ unchanged.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "independence",
      statement: "Jointly normal variables are independent exactly when their covariance matrix is diagonal.",
      proof: ["With diagonal $\\Sigma$, the exponent is a sum $\\sum (x_i - \\mu_i)^2/\\sigma_i^2$ and the density factorises into normal densities. The converse holds for all variables."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "simulating",
      statement: "To draw from $N(\\vec\\mu, \\Sigma)$, factor $\\Sigma = LL^{\\mathsf T}$ (the Cholesky factorisation), draw independent standard normals $\\vec Z$, and set $\\vec X = \\vec\\mu + L\\vec Z$.",
      proof: ["By the linear-transformation theorem, $\\vec X$ has mean $\\vec\\mu$ and covariance $LIL^{\\mathsf T} = \\Sigma$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "a portfolio",
      problem: `Two assets have return covariance $${M("0.04", "0.01", "0.01", "0.09")}$. Find the variance of a 50:50 portfolio.`,
      solution: ["$\\vec w^{\\mathsf T}\\Sigma\\vec w$ with $\\vec w = (0.5, 0.5)$: $0.25(0.04) + 0.25(0.09) + 2(0.25)(0.01)$.", "$= 0.01 + 0.0225 + 0.005 = 0.0375$."],
      result: "0.0375 (SD about 19%).",
    },
    {
      type: "example",
      level: 2,
      title: "a conditional prediction",
      problem: "Fathers' and sons' heights are bivariate normal: both have SD 7 cm, means 175 and 177 cm, and $\\rho = 0.5$. Predict a son's height when his father is 189 cm, with its SD.",
      solution: ["$E[Y \\mid X = 189] = 177 + 0.5 \\times \\tfrac77 \\times 14 = 184$.", "Conditional SD: $7\\sqrt{1 - 0.25} \\approx 6.06$ cm."],
      result: "184 cm, give or take about 6 cm.",
    },
    {
      type: "example",
      level: 3,
      title: "a difference",
      problem: `$\\vec X \\sim N\\!\\left((1, 2), ${M(2, 1, 1, 2)}\\right)$. Find $P(X_1 > X_2)$, given $\\Phi(0.707) \\approx 0.760$.`,
      solution: ["$D = X_1 - X_2$ has mean $-1$ and variance $2 + 2 - 2 = 2$.", "$P(D > 0) = P\\!\\left(Z > \\tfrac{1}{\\sqrt2}\\right) = 1 - 0.760 = 0.240$."],
      result: "About 0.24.",
    },
    {
      type: "example",
      level: 3,
      title: "the contour ellipse",
      problem: `Describe the density contours for $\\Sigma = ${M(5, 3, 3, 5)}$.`,
      solution: ["Eigenvalues $5 \\pm 3$: 8 along $(1, 1)$ and 2 along $(1, -1)$.", "The ellipses are tilted at 45° with axis half-lengths in the ratio $\\sqrt8 : \\sqrt2 = 2 : 1$."],
      result: "Ellipses along $y = x$, twice as long as wide.",
    },
  ],
  pitfalls: [
    { wrong: "Normal marginals make a jointly normal pair.", right: "Every linear combination must be normal; marginals alone don't ensure it." },
    { wrong: "Zero correlation always means independence.", right: "Only for jointly normal variables." },
    { wrong: "Conditioning on $X$ leaves $Y$'s variance at $\\sigma_Y^2$.", right: "It shrinks to $\\sigma_Y^2(1 - \\rho^2)$, the same for every $x$." },
  ],
  formulas: [
    { label: "Linear combination", tex: "\\vec a^{\\mathsf T}\\vec X \\sim N(\\vec a^{\\mathsf T}\\vec\\mu,\\ \\vec a^{\\mathsf T}\\Sigma\\vec a)" },
    { label: "Transformation", tex: "A\\vec X + \\vec b \\sim N(A\\vec\\mu + \\vec b,\\ A\\Sigma A^{\\mathsf T})" },
    { label: "Conditional mean", tex: "\\mu_Y + \\rho\\tfrac{\\sigma_Y}{\\sigma_X}(x - \\mu_X)" },
    { label: "Conditional variance", tex: "\\sigma_Y^2(1 - \\rho^2)" },
    { label: "Mahalanobis", tex: "d^2 = (\\vec x - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec x - \\vec\\mu)" },
  ],
  exercises: [
    ex(1, num("mvnx-ex-1", "$\\operatorname{Var}X_1 = 4$, $\\operatorname{Var}X_2 = 9$, $\\operatorname{Cov} = -2$. Find $\\operatorname{Var}(X_1 + X_2)$.", 9, "$4 + 9 - 4$."), ["$9$."]),
    ex(1, num("mvnx-ex-2", "$\\vec\\mu = (3, 1)$. Find $E[2X_1 - X_2]$.", 5, "Linear."), ["$6 - 1 = 5$."]),
    ex(2, num("mvnx-ex-3", "$\\mu_X = 10$, $\\sigma_X = 2$, $\\mu_Y = 50$, $\\sigma_Y = 6$, $\\rho = 0.4$. Find $E[Y \\mid X = 13]$.", 53.6, "$50 + 0.4 \\times 3 \\times 3$."), ["$\\rho\\tfrac{\\sigma_Y}{\\sigma_X} = 0.4 \\times 3 = 1.2$; times $x - \\mu_X = 3$ gives 3.6, so $50 + 3.6 = 53.6$."]),
    ex(2, dp("mvnx-ex-4", "Same pair. Find the SD of $Y$ given $X$.", 6 * Math.sqrt(1 - 0.16), "$\\sigma_Y\\sqrt{1 - \\rho^2}$."), ["$6\\sqrt{0.84} \\approx 5.499$."]),
    ex(2, num("mvnx-ex-5", `$\\Sigma = ${M(1, 0.5, 0.5, 2)}$ and $\\vec a = (2, 1)$. Find $\\operatorname{Var}(\\vec a^{\\mathsf T}\\vec X)$.`, 8, "$\\vec a^{\\mathsf T}\\Sigma\\vec a$."), ["$4(1) + 1(2) + 2(2)(1)(0.5) = 8$."]),
    ex(3, num("mvnx-ex-6", `Find the largest eigenvalue of $${M(5, 3, 3, 5)}$.`, 8, "$5 \\pm 3$."), ["$8$, along $(1, 1)$."]),
    ex(3, num("mvnx-ex-7", "$\\vec\\mu = \\vec 0$, $\\Sigma = \\operatorname{diag}(4, 1)$. Find the squared Mahalanobis distance of $(2, 0)$.", 1, "$x_1^2/4 + x_2^2/1$."), ["$4/4 + 0 = 1$: one SD out along the first axis."]),
    ex(3, num("mvnx-ex-8", "$X$ and $Y$ have SD 1 and $\\operatorname{Var}(X - Y) = 0.4$. Find their correlation.", 0.8, "$2 - 2\\rho = 0.4$."), ["$\\rho = 0.8$."]),
    ex(3, dp("mvnx-ex-9", "$X_1 \\sim N(1, 1)$ and $X_2 \\sim N(0, 1)$ are jointly normal with covariance 0.5. Find $P(X_1 > X_2)$ using $\\Phi(1) = 0.8413$.", 0.8413, "$D$ has mean 1 and variance 1."), ["$\\operatorname{Var}(X_1 - X_2) = 1 + 1 - 1 = 1$, so $P(D > 0) = P(Z > -1) = 0.8413$."]),
    ex(3, mc("mvnx-ex-10", "$X$ and $Y$ are each normal. Then $(X, Y)$ is", ["not necessarily jointly normal", "Normal marginals don't guarantee joint normality."], [["always jointly normal", "Counterexamples exist, as in this section."], ["jointly normal if they are independent, and only then", "Correlated pairs can be jointly normal too."]]), ["Joint normality must be checked or assumed separately; independent normals are one case that works."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const v1 = r.int(1, 9);
      const v2 = r.int(1, 9);
      const lim = Math.floor(Math.sqrt(v1 * v2));
      const c = r.int(-lim, lim);
      const a = lv === 1 ? 1 : r.pick([1, 2, 3]);
      const b = r.pick([1, -1, ...(lv === 3 ? [2, -2] : [])]);
      const v = a * a * v1 + b * b * v2 + 2 * a * b * c;
      return n(`$\\vec X$ has covariance matrix $${M(v1, c, c, v2)}$. Find $\\operatorname{Var}(${a === 1 ? "" : a}X_1 ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}X_2)$.`, v, `$${a * a}(${v1}) + ${b * b}(${v2}) + 2(${a})(${b})(${c}) = ${v}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const mx = r.int(0, 20);
      const sx = r.pick([1, 2, 4, 5]);
      const my = r.int(20, 80);
      const sy = sx * r.pick([1, 2, 3]);
      const rho = r.pick([-0.5, -0.4, 0.3, 0.4, 0.5, 0.6, 0.8]);
      const x = mx + sx * r.pick(lv === 1 ? [1, 2] : [-2, -1, 1, 1.5, 2]);
      const e = my + rho * (sy / sx) * (x - mx);
      return n(`Bivariate normal: $\\mu_X = ${mx}$, $\\sigma_X = ${sx}$, $\\mu_Y = ${my}$, $\\sigma_Y = ${sy}$, $\\rho = ${rho}$. Find $E[Y \\mid X = ${x}]$ (2 decimals).`, r2(e), `$${my} + ${rho} \\times \\tfrac{${sy}}{${sx}} \\times (${x} - ${mx}) = ${r2(e)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { text: "$X$ and $Y$ are jointly normal with correlation 0.", indep: true },
        { text: "$X \\sim N(0, 1)$ and $Y = X^2 - 1$, so $\\operatorname{Corr}(X, Y) = 0$.", indep: false },
        { text: "$X \\sim U(-1, 1)$ and $Y = |X|$, so $\\operatorname{Corr}(X, Y) = 0$.", indep: false },
        { text: "$(X, Y)$ is bivariate normal with $\\operatorname{Cov}(X, Y) = 0$.", indep: true },
      ]);
      return mcNumbers(
        `${s.text} Are $X$ and $Y$ independent?`,
        { text: s.indep ? "Yes" : "No", why: s.indep ? "For jointly normal variables, zero correlation means independence." : "$Y$ is a function of $X$; zero correlation only rules out a linear relationship." },
        [{ text: s.indep ? "No" : "Yes", why: s.indep ? "The joint normal density factorises when the covariance is 0." : "Uncorrelated is not independent outside the jointly normal case.", ...(s.indep ? {} : { misconception: "uncorrelated-independent-general" }) }],
      );
    },
  },
];
