import { ex, mc, num, vec, type Depth } from "../deepen";

/** Chapter 6 at exam depth: variance, covariance, PCA on data, the normal distribution, MLE, least squares, losses. */

const M = (a: string, b: string, c: string, d: string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const TABLE = "Use $\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$.";

export const UNIT5_DEPTH: Record<string, Depth> = {
  // §6.1
  variance: {
    definitions: [
      {
        type: "definition",
        term: "variance, standard deviation",
        body: "For a random variable, $\\operatorname{Var}(X) = E[(X - \\mu)^2]$ and $\\sigma = \\sqrt{\\operatorname{Var}(X)}$. For data $x_1, \\dots, x_n$ we use $\\sigma^2 = \\tfrac1n\\sum(x_i - \\bar x)^2$. The **sample variance** $s^2 = \\tfrac{1}{n - 1}\\sum(x_i - \\bar x)^2$ divides by $n - 1$ when the data is a sample used to estimate a population's variance.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "computing formula",
        statement: "$\\operatorname{Var}(X) = E[X^2] - (E[X])^2$. For data, $\\sigma^2 = \\dfrac{\\sum x_i^2}{n} - \\bar x^2$.",
        proof: ["Expand: $E[(X - \\mu)^2] = E[X^2] - 2\\mu E[X] + \\mu^2 = E[X^2] - 2\\mu^2 + \\mu^2 = E[X^2] - \\mu^2$."],
      },
      {
        type: "theorem",
        name: "linear changes and sums",
        statement: "$\\operatorname{Var}(aX + b) = a^2\\operatorname{Var}(X)$, so $\\sigma_{aX + b} = |a|\\sigma_X$. If $X$ and $Y$ are independent, $\\operatorname{Var}(X \\pm Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$.",
        proof: [
          "$aX + b$ has mean $a\\mu + b$, so its deviation is $a(X - \\mu)$; squaring gives the factor $a^2$, and $b$ disappears.",
          "For sums, $\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$ (§6.2), and independence makes the covariance 0. For $X - Y$, $\\operatorname{Var}(-Y) = \\operatorname{Var}(Y)$: variances add even when the variables are subtracted.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find the variance and standard deviation of $2, 4, 4, 4, 5, 5, 7, 9$.",
        solution: ["Mean: $40/8 = 5$. Squared deviations: $9, 1, 1, 1, 0, 0, 4, 16$, total 32.", "$\\sigma^2 = 32/8 = 4$ and $\\sigma = 2$."],
        result: "Variance 4, standard deviation 2.",
      },
      {
        type: "example",
        level: 2,
        title: "the computing formula",
        problem: "Find the variance of one roll of a fair die.",
        solution: ["$E[X] = 3.5$ and $E[X^2] = \\tfrac{91}{6}$ (§5.3).", "$\\operatorname{Var}(X) = \\tfrac{91}{6} - \\tfrac{49}{4} = \\tfrac{182 - 147}{12}$."],
        result: "$\\tfrac{35}{12} \\approx 2.917$.",
      },
      {
        type: "example",
        level: 3,
        title: "from summary sums",
        problem: "Ten values have $\\sum x = 50$ and $\\sum x^2 = 290$. Find their variance, and the variance after each value is replaced by $3x - 2$.",
        solution: ["$\\bar x = 5$, so $\\sigma^2 = 290/10 - 25 = 4$.", "$\\operatorname{Var}(3X - 2) = 9 \\cdot 4 = 36$."],
        result: "$4$, then $36$.",
      },
    ],
    pitfalls: [
      { wrong: "$\\operatorname{Var}(X - Y) = \\operatorname{Var}(X) - \\operatorname{Var}(Y)$.", right: "For independent variables variances always add: $\\operatorname{Var}(X - Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y)$." },
      { wrong: "$\\operatorname{Var}(3X) = 3\\operatorname{Var}(X)$.", right: "$\\operatorname{Var}(3X) = 9\\operatorname{Var}(X)$; the standard deviation triples." },
      { wrong: "Standard deviations add for independent variables.", right: "Variances add; $\\sigma_{X+Y} = \\sqrt{\\sigma_X^2 + \\sigma_Y^2}$." },
    ],
    formulas: [
      { label: "Computing formula", tex: "\\operatorname{Var}(X) = E[X^2] - (E[X])^2" },
      { label: "Linear change", tex: "\\operatorname{Var}(aX + b) = a^2\\operatorname{Var}(X)" },
      { label: "Independent sum", tex: "\\operatorname{Var}(X \\pm Y) = \\operatorname{Var}X + \\operatorname{Var}Y" },
      { label: "Sample variance", tex: "s^2 = \\tfrac{1}{n-1}\\textstyle\\sum (x_i - \\bar x)^2" },
    ],
    exercises: [
      ex(1, num("vr-ex-1", "Find the variance (divide by $n$) of $1, 2, 3, 4, 5$.", 2, "Squared deviations $4, 1, 0, 1, 4$."), ["Mean 3; squared deviations $4, 1, 0, 1, 4$ total 10; $10/5 = 2$."]),
      ex(1, num("vr-ex-2", "A data set has variance 16. Find its standard deviation.", 4, "$\\sqrt{16}$."), ["$\\sigma = \\sqrt{16} = 4$."]),
      ex(1, num("vr-ex-3", "A data set has standard deviation 3. Every value is increased by 10. Find the new standard deviation.", 3, "Shifts do not change spread."), ["Adding a constant leaves every deviation unchanged: still 3."]),
      ex(2, num("vr-ex-4", "$\\operatorname{Var}(X) = 4$. Find $\\operatorname{Var}(3X - 2)$.", 36, "$a^2\\operatorname{Var}(X)$."), ["$9 \\cdot 4 = 36$."]),
      ex(2, num("vr-ex-5", "$E[X] = 2$ and $E[X^2] = 13$. Find $\\operatorname{Var}(X)$.", 9, "$E[X^2] - (E[X])^2$."), ["$13 - 4 = 9$."]),
      ex(2, fr("vr-ex-6", "Find the variance of one roll of a fair die.", 35 / 12, "$\\tfrac{91}{6} - 3.5^2$."), ["$\\tfrac{91}{6} - \\tfrac{49}{4} = \\tfrac{35}{12} \\approx 2.917$."]),
      ex(3, num("vr-ex-7", "Ten values have $\\sum x = 50$ and $\\sum x^2 = 290$. Find their variance.", 4, "$\\sum x^2/n - \\bar x^2$."), ["$29 - 5^2 = 4$."]),
      ex(3, dp("vr-ex-8", "$X$ and $Y$ are independent with variances 4 and 9. Find the standard deviation of $X - Y$.", Math.sqrt(13), "Variances add."), ["$\\operatorname{Var}(X - Y) = 4 + 9 = 13$, so $\\sigma = \\sqrt{13} \\approx 3.606$."]),
      ex(3, fr("vr-ex-9", "Find the variance of the sum of two fair dice.", 35 / 6, "Two independent dice."), ["Each die has variance $\\tfrac{35}{12}$; independent variances add: $\\tfrac{35}{6} \\approx 5.833$."]),
      ex(3, num("vr-ex-10", "Five numbers have mean 6 and variance 4 (divide by $n$). Find the sum of their squares.", 200, "$\\sum x^2 = n(\\sigma^2 + \\bar x^2)$."), ["$\\sum x^2 = n(\\sigma^2 + \\bar x^2) = 5(4 + 36) = 200$."]),
    ],
  },

  // §6.2
  covariance: {
    definitions: [
      {
        type: "definition",
        term: "covariance, correlation",
        body: "$\\operatorname{Cov}(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)]$. It is positive when $X$ and $Y$ tend to be above their means together. The **correlation** $\\rho = \\dfrac{\\operatorname{Cov}(X, Y)}{\\sigma_X\\sigma_Y}$ is unit-free; for data it is written $r$.",
      },
      {
        type: "definition",
        term: "covariance matrix",
        body: `For two variables, $\\Sigma = ${M("\\operatorname{Var}X", "\\operatorname{Cov}(X,Y)", "\\operatorname{Cov}(X,Y)", "\\operatorname{Var}Y")}$: symmetric, with variances on the diagonal.`,
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "rules",
        statement: "(i) $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$. (ii) $\\operatorname{Cov}(aX + b, cY + d) = ac\\operatorname{Cov}(X, Y)$. (iii) $\\operatorname{Var}(aX + bY) = a^2\\operatorname{Var}X + b^2\\operatorname{Var}Y + 2ab\\operatorname{Cov}(X, Y)$.",
        proof: [
          "(i) Expand the product and take expectations, as for the variance formula.",
          "(ii) The deviations become $a(X - \\mu_X)$ and $c(Y - \\mu_Y)$; constants vanish. (iii) Expand $E[(a(X - \\mu_X) + b(Y - \\mu_Y))^2]$.",
        ],
      },
      {
        type: "theorem",
        name: "bounds",
        statement: "$-1 \\le \\rho \\le 1$, i.e. $|\\operatorname{Cov}(X, Y)| \\le \\sigma_X\\sigma_Y$, with $|\\rho| = 1$ exactly when $Y = aX + b$ for some $a \\neq 0$.",
        proof: [
          "For every real $t$, $\\operatorname{Var}(Y - tX) = \\sigma_Y^2 - 2t\\operatorname{Cov} + t^2\\sigma_X^2 \\ge 0$.",
          "A quadratic in $t$ that is never negative has discriminant $\\le 0$: $4\\operatorname{Cov}^2 - 4\\sigma_X^2\\sigma_Y^2 \\le 0$. Equality means $Y - tX$ has zero variance for some $t$, i.e. is constant.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        statement: "Independent variables have covariance 0. The converse is false.",
        proof: [
          "Independence gives $E[XY] = E[X]E[Y]$, so $\\operatorname{Cov} = 0$ by (i).",
          "Counterexample: $X$ uniform on $\\{-1, 0, 1\\}$ and $Y = X^2$. Then $E[XY] = E[X^3] = 0$ and $E[X] = 0$, so $\\operatorname{Cov} = 0$, yet $Y$ is determined by $X$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find the covariance (divide by $n$) and correlation of the points $(1, 2), (2, 4), (3, 6)$.",
        solution: ["Means 2 and 4. Deviation products: $(-1)(-2) = 2$, $0$, $(1)(2) = 2$; covariance $4/3$.", "$y = 2x$ exactly, so $r = 1$."],
        result: "$\\operatorname{Cov} = \\tfrac43$, $r = 1$.",
      },
      {
        type: "example",
        level: 2,
        problem: "$\\operatorname{Var}X = 4$, $\\operatorname{Var}Y = 9$ and $\\operatorname{Cov}(X, Y) = 3$. Find $\\rho$ and $\\operatorname{Var}(X + Y)$.",
        solution: ["$\\rho = 3/(2 \\cdot 3) = 0.5$.", "$\\operatorname{Var}(X + Y) = 4 + 9 + 2 \\cdot 3 = 19$."],
        result: "$\\rho = 0.5$, $\\operatorname{Var}(X + Y) = 19$.",
      },
      {
        type: "example",
        level: 3,
        title: "zero covariance, full dependence",
        problem: "$X$ is equally likely to be $-1, 0, 1$ and $Y = X^2$. Find $\\operatorname{Cov}(X, Y)$. Are $X$ and $Y$ independent?",
        solution: [
          "$E[X] = 0$ and $E[XY] = E[X^3] = \\tfrac13(-1 + 0 + 1) = 0$, so $\\operatorname{Cov} = 0$.",
          "But $P(Y = 0 \\mid X = 0) = 1 \\neq P(Y = 0) = \\tfrac13$: dependent. Covariance only measures linear association.",
        ],
        result: "$\\operatorname{Cov} = 0$, yet $X$ and $Y$ are dependent.",
      },
    ],
    pitfalls: [
      { wrong: "Covariance 0 means independent.", right: "It means no linear association. $Y = X^2$ with symmetric $X$ has covariance 0." },
      { wrong: "A larger covariance means a stronger relationship.", right: "Covariance depends on units. Compare correlations." },
    ],
    formulas: [
      { label: "Computing formula", tex: "\\operatorname{Cov}(X,Y) = E[XY] - E[X]E[Y]" },
      { label: "Correlation", tex: "\\rho = \\dfrac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y},\\ |\\rho| \\le 1" },
      { label: "Variance of a combination", tex: "a^2\\operatorname{Var}X + b^2\\operatorname{Var}Y + 2ab\\operatorname{Cov}(X,Y)" },
    ],
    exercises: [
      ex(1, num("cv-ex-1", "$E[XY] = 10$, $E[X] = 2$ and $E[Y] = 3$. Find $\\operatorname{Cov}(X, Y)$.", 4, "$E[XY] - E[X]E[Y]$."), ["$10 - 6 = 4$."]),
      ex(1, num("cv-ex-2", "$\\operatorname{Cov}(X, Y) = 6$, $\\sigma_X = 2$ and $\\sigma_Y = 5$. Find $\\rho$.", 0.6, "$6/10$."), ["$\\rho = 6/(2 \\cdot 5) = 0.6$."]),
      ex(2, num("cv-ex-3", "$\\operatorname{Var}X = 4$, $\\operatorname{Var}Y = 9$ and $\\operatorname{Cov}(X, Y) = -2$. Find $\\operatorname{Var}(X + Y)$.", 9, "$4 + 9 - 4$."), ["$4 + 9 + 2(-2) = 9$."]),
      ex(2, num("cv-ex-4", "$\\operatorname{Cov}(X, Y) = 1.5$. Find $\\operatorname{Cov}(2X + 1, 3Y - 4)$.", 9, "$ac\\operatorname{Cov}$."), ["$2 \\cdot 3 \\cdot 1.5 = 9$; the constants do not matter."]),
      ex(2, fr("cv-ex-5", "Find the covariance (divide by $n$) of the points $(1, 1), (2, 3), (3, 2)$.", 1 / 3, "Means are 2 and 2."), ["Deviations $(-1, -1), (0, 1), (1, 0)$; products $1, 0, 0$.", "$\\operatorname{Cov} = \\tfrac13$."]),
      ex(3, num("cv-ex-6", "$\\operatorname{Corr}(X, Y) = 0.4$. Find $\\operatorname{Corr}(2X + 1, -3Y)$.", -0.4, "The sign of $ac$ matters, the size does not."), ["Correlation is unchanged by positive scaling and flips sign under a negative one: $-0.4$."]),
      ex(3, num("cv-ex-7", "$\\operatorname{Var}X = 4$, $\\operatorname{Var}Y = 1$ and $\\operatorname{Cov}(X, Y) = 1$. Find $\\operatorname{Var}(X - 2Y)$.", 4, "$a = 1$, $b = -2$."), ["$1 \\cdot 4 + 4 \\cdot 1 + 2(1)(-2)(1) = 4 + 4 - 4 = 4$."]),
      ex(3, num("cv-ex-8", "$\\operatorname{Var}X = 4$ and $\\operatorname{Var}Y = 9$. What is the largest possible $\\operatorname{Cov}(X, Y)$?", 6, "$|\\operatorname{Cov}| \\le \\sigma_X\\sigma_Y$."), ["$\\operatorname{Cov} \\le \\sigma_X\\sigma_Y = 2 \\cdot 3 = 6$, attained when $Y = 1.5X + b$."]),
      ex(3, mc("cv-ex-9", "$\\operatorname{Cov}(X, Y) = 0$. Then", ["$X$ and $Y$ may still be dependent", "Zero covariance rules out only linear association."], [["$X$ and $Y$ are independent", "Counterexample: $Y = X^2$ with $X$ symmetric about 0."], ["$\\operatorname{Var}(X + Y) = 0$", "It equals $\\operatorname{Var}X + \\operatorname{Var}Y$."]]), [
        "With $X$ uniform on $\\{-1, 0, 1\\}$ and $Y = X^2$, the covariance is 0 but $Y$ is a function of $X$.",
      ]),
    ],
  },

  // §6.3
  "pca-practice": {
    definitions: [
      {
        type: "definition",
        term: "data covariance matrix",
        body: "Arrange $n$ observations of $d$ variables as rows of a matrix and **centre** each column by subtracting its mean, giving $X_c$. The covariance matrix is $\\Sigma = \\tfrac1n X_c^{\\mathsf T}X_c$; entry $(j, k)$ is the covariance of variables $j$ and $k$.",
      },
      {
        type: "definition",
        term: "projection, reconstruction",
        body: "Keeping the top $k$ unit eigenvectors $\\hat v_1, \\dots, \\hat v_k$, a centred point $\\vec x$ has **scores** $z_i = \\vec x \\cdot \\hat v_i$ and **reconstruction** $\\hat{\\vec x} = \\sum_{i \\le k} z_i\\hat v_i$. The **reconstruction error** is $|\\vec x - \\hat{\\vec x}|^2$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "variance kept and lost",
        statement: "With eigenvalues $\\lambda_1 \\ge \\dots \\ge \\lambda_d$ of $\\Sigma$, keeping $k$ components retains variance $\\lambda_1 + \\dots + \\lambda_k$, and the mean reconstruction error over the data is $\\lambda_{k+1} + \\dots + \\lambda_d$. The total variance $\\operatorname{tr}\\Sigma$ splits as kept plus lost.",
        proof: [
          "In the perpendicular eigenbasis, a centred point is $\\vec x = \\sum_i z_i\\hat v_i$ and $|\\vec x|^2 = \\sum_i z_i^2$. The mean of $z_i^2$ over the data is the variance along $\\hat v_i$, which is $\\lambda_i$.",
          "The error $\\vec x - \\hat{\\vec x} = \\sum_{i > k} z_i\\hat v_i$ has mean squared length $\\sum_{i > k}\\lambda_i$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "standardise first",
        statement: "When variables are measured in different units, divide each centred column by its standard deviation before PCA (equivalently, use the correlation matrix). Otherwise the variable with the largest numbers dominates PC1.",
        proof: ["Rescaling a variable by $c$ multiplies its variance by $c^2$; PCA follows variance, so the choice of units would decide the answer."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A covariance matrix has eigenvalues 6, 3 and 1. What fraction of variance is kept with one component, and with two?",
        solution: ["Total $6 + 3 + 1 = 10$.", "One component: $6/10$. Two: $9/10$."],
        result: "60% and 90%.",
      },
      {
        type: "example",
        level: 2,
        title: "from data to components",
        problem: "Centred data: $(2, 2), (-2, -2), (1, -1), (-1, 1)$. Find $\\Sigma$, PC1, and the variance PC1 explains.",
        solution: [
          `$\\tfrac1n\\sum x^2 = \\tfrac{4 + 4 + 1 + 1}{4} = 2.5$, $\\tfrac1n\\sum xy = \\tfrac{4 + 4 - 1 - 1}{4} = 1.5$, $\\tfrac1n\\sum y^2 = 2.5$, so $\\Sigma = ${M("2.5", "1.5", "1.5", "2.5")}$.`,
          "Eigenvalues $2.5 \\pm 1.5$: 4 and 1. PC1 $= \\tfrac{1}{\\sqrt2}(1, 1)$.",
          "PC1 explains $4/5 = 80\\%$. Check: the scores $2\\sqrt2, -2\\sqrt2, 0, 0$ have mean square $16/4 = 4$.",
        ],
        result: "PC1 $= \\tfrac{1}{\\sqrt2}(1, 1)$, 80% of the variance.",
      },
      {
        type: "example",
        level: 3,
        title: "reconstruction error",
        problem: "With PC1 $= \\tfrac{1}{\\sqrt2}(1, 1)$, reconstruct the centred point $(3, 1)$ from one component and find its squared error.",
        solution: [
          "Score: $z = (3, 1) \\cdot \\tfrac{1}{\\sqrt2}(1, 1) = \\tfrac{4}{\\sqrt2} = 2\\sqrt2$.",
          "Reconstruction: $z\\hat v_1 = 2\\sqrt2 \\cdot \\tfrac{1}{\\sqrt2}(1, 1) = (2, 2)$.",
          "Error vector $(1, -1)$, squared length $2$. It is perpendicular to PC1, as a projection's error must be.",
        ],
        result: "$(2, 2)$, with squared error 2.",
      },
    ],
    pitfalls: [
      { wrong: "Run PCA on the raw columns.", right: "Centre first, and standardise if the units differ." },
      { wrong: "Reconstruction from $k$ components is exact for every point.", right: "It loses the components that were dropped; the mean loss is the sum of the dropped eigenvalues." },
    ],
    formulas: [
      { label: "Covariance matrix", tex: "\\Sigma = \\tfrac1n X_c^{\\mathsf T}X_c" },
      { label: "Score and reconstruction", tex: "z_i = \\vec x \\cdot \\hat v_i,\\quad \\hat{\\vec x} = \\textstyle\\sum_{i \\le k} z_i\\hat v_i" },
      { label: "Mean error", tex: "\\lambda_{k+1} + \\dots + \\lambda_d" },
    ],
    exercises: [
      ex(1, num("pcap-ex-1", "Eigenvalues 5, 3 and 2. What fraction of variance do two components keep?", 0.8, "$8/10$."), ["$(5 + 3)/10 = 0.8$."]),
      ex(1, mc("pcap-ex-2", "The first step of PCA on a data table is to", ["subtract each column's mean", "PCA works with deviations from the mean."], [["find the eigenvectors of the raw data", "The raw data is not square, and it must be centred."], ["sort the rows", "Row order does not matter."]]), ["Centre each column, then form $\\Sigma$ and its eigenvectors."]),
      ex(2, num("pcap-ex-3", "Find the total variance for $\\Sigma = \\begin{bmatrix} 2.5 & 1.5 \\\\ 1.5 & 2.5 \\end{bmatrix}$.", 5, "Trace."), ["$\\operatorname{tr}\\Sigma = 2.5 + 2.5 = 5$, which also equals $4 + 1$."]),
      ex(2, num("pcap-ex-4", "Eigenvalues 8, 4, 2, 1, 1. What is the fewest components keeping at least 75% of the variance?", 2, "Total 16."), ["$8/16 = 50\\%$; $12/16 = 75\\%$. Two components."]),
      ex(2, num("pcap-ex-5", "Centred data $(2, 2), (-2, -2), (1, -1), (-1, 1)$. Find the off-diagonal entry of $\\Sigma$ (divide by $n$).", 1.5, "$\\tfrac14\\sum xy$."), ["$\\tfrac{4 + 4 - 1 - 1}{4} = 1.5$."]),
      ex(3, vec("pcap-ex-6", "PC1 is $\\tfrac{1}{\\sqrt2}(1, 1)$. Reconstruct the centred point $(3, 1)$ from PC1 alone.", [2, 2], "Score $2\\sqrt2$."), ["Score $2\\sqrt2$; reconstruction $2\\sqrt2 \\cdot \\tfrac1{\\sqrt2}(1, 1) = (2, 2)$."]),
      ex(3, num("pcap-ex-7", "With PC1 $= \\tfrac{1}{\\sqrt2}(1, 1)$, find the squared reconstruction error of $(3, 1)$.", 2, "Error $(1, -1)$."), ["$(3, 1) - (2, 2) = (1, -1)$, squared length 2."]),
      ex(3, num("pcap-ex-8", "$\\Sigma$ has eigenvalues 4 and 1. Keeping one component, what is the mean squared reconstruction error over the data?", 1, "Sum of dropped eigenvalues."), ["The dropped eigenvalue: 1."]),
      ex(3, mc("pcap-ex-9", "Height (cm, variance 100) and shoe size (variance 4) go into PCA unstandardised. PC1 will be", ["nearly the height axis", "Height's larger variance dominates."], [["the line $y = x$", "Only if the variances were equal."], ["nearly the shoe-size axis", "Its variance is far smaller."]]), [
        "PCA follows variance; height's variance is 25 times larger, so PC1 lies close to it. Standardise to compare fairly.",
      ]),
    ],
  },

  // §6.4
  normal: {
    definitions: [
      {
        type: "definition",
        term: "normal distribution",
        body: "$X \\sim N(\\mu, \\sigma^2)$ has density $f(x) = \\dfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-(x - \\mu)^2/(2\\sigma^2)}$: a symmetric bell with centre $\\mu$ and inflection points at $\\mu \\pm \\sigma$.",
      },
      {
        type: "definition",
        term: "standardisation",
        body: "The **z-score** of $x$ is $z = \\dfrac{x - \\mu}{\\sigma}$. If $X \\sim N(\\mu, \\sigma^2)$ then $Z = (X - \\mu)/\\sigma \\sim N(0, 1)$, whose CDF is written $\\Phi$. So $P(X \\le x) = \\Phi\\!\\left(\\tfrac{x - \\mu}{\\sigma}\\right)$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "symmetry",
        statement: "$\\Phi(-z) = 1 - \\Phi(z)$ and $P(|Z| \\le z) = 2\\Phi(z) - 1$. About 68%, 95% and 99.7% of a normal distribution lie within 1, 2 and 3 standard deviations of the mean.",
        proof: ["The density of $Z$ is symmetric about 0, so the area left of $-z$ equals the area right of $z$. The percentages are $2\\Phi(k) - 1$ for $k = 1, 2, 3$."],
      },
      {
        type: "theorem",
        name: "linear combinations",
        statement: "If $X \\sim N(\\mu, \\sigma^2)$ then $aX + b \\sim N(a\\mu + b, a^2\\sigma^2)$. If $X \\sim N(\\mu_1, \\sigma_1^2)$ and $Y \\sim N(\\mu_2, \\sigma_2^2)$ are independent, then $X \\pm Y \\sim N(\\mu_1 \\pm \\mu_2,\\ \\sigma_1^2 + \\sigma_2^2)$.",
        proof: ["The means and variances follow from §5.3 and §6.1. That the result is again normal is a special property of the normal family (it follows from its moment generating function), not true for most distributions."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Heights are $N(170, 10^2)$ cm. About what fraction are between 160 and 180 cm?",
        solution: ["160 and 180 are $\\mu \\pm \\sigma$.", "About 68% lie within one standard deviation."],
        result: "About 68%.",
      },
      {
        type: "example",
        level: 2,
        problem: `Heights are $N(170, 10^2)$. Find $P(X > 185)$. Use $\\Phi(1.5) = 0.9332$.`,
        solution: ["$z = (185 - 170)/10 = 1.5$.", "$P(X > 185) = 1 - \\Phi(1.5) = 0.0668$."],
        result: "$0.0668$.",
      },
      {
        type: "example",
        level: 3,
        title: "comparing two normals",
        problem: "$X \\sim N(50, 9)$ and $Y \\sim N(40, 16)$ are independent. Find $P(X > Y)$. Use $\\Phi(2) = 0.9772$.",
        solution: [
          "$D = X - Y \\sim N(50 - 40,\\ 9 + 16) = N(10, 25)$, so $\\sigma_D = 5$.",
          "$P(X > Y) = P(D > 0) = P\\!\\left(Z > \\tfrac{0 - 10}{5}\\right) = P(Z > -2) = \\Phi(2)$.",
        ],
        result: "$0.9772$.",
      },
    ],
    pitfalls: [
      { wrong: "$N(50, 9)$ has standard deviation 9.", right: "The second parameter is the variance; $\\sigma = 3$." },
      { wrong: "$\\sigma_{X - Y} = \\sigma_X - \\sigma_Y$.", right: "Variances add: $\\sigma_{X-Y} = \\sqrt{\\sigma_X^2 + \\sigma_Y^2}$." },
    ],
    formulas: [
      { label: "z-score", tex: "z = (x - \\mu)/\\sigma" },
      { label: "Probability", tex: "P(X \\le x) = \\Phi\\big((x - \\mu)/\\sigma\\big)" },
      { label: "Symmetry", tex: "\\Phi(-z) = 1 - \\Phi(z)" },
      { label: "68–95–99.7", tex: "P(|Z| \\le 1, 2, 3) \\approx 0.68,\\ 0.95,\\ 0.997" },
    ],
    exercises: [
      ex(1, num("nrm-ex-1", "Scores are $N(70, 10^2)$. Find the z-score of 85.", 1.5, "$(85 - 70)/10$."), ["$z = 15/10 = 1.5$."]),
      ex(1, num("nrm-ex-2", "About what fraction of a normal distribution lies within 2 standard deviations of the mean? (Answer as a decimal.)", 0.95, "The 68–95–99.7 rule."), ["About 95%, i.e. 0.95."]),
      ex(1, num("nrm-ex-3", "$X \\sim N(\\mu, \\sigma^2)$. Find $P(X > \\mu)$.", 0.5, "Symmetry."), ["The bell is symmetric about $\\mu$: 0.5."]),
      ex(2, num("nrm-ex-4", `IQ is $N(100, 15^2)$. Find $P(X < 130)$. ${TABLE}`, 0.9772, "$z = 2$."), ["$z = 30/15 = 2$; $\\Phi(2) = 0.9772$."]),
      ex(2, num("nrm-ex-5", `$X \\sim N(60, 8^2)$. Find $P(X < 52)$. ${TABLE}`, 0.1587, "$z = -1$."), ["$z = -1$; $\\Phi(-1) = 1 - 0.8413 = 0.1587$."]),
      ex(2, num("nrm-ex-6", "$X \\sim N(10, 4)$ and $Y = 3X + 2$. Find the standard deviation of $Y$.", 6, "$|a|\\sigma$."), ["$\\sigma_X = 2$, so $\\sigma_Y = 3 \\cdot 2 = 6$."]),
      ex(3, num("nrm-ex-7", `$X \\sim N(50, 9)$ and $Y \\sim N(40, 16)$ are independent. Find $P(X > Y)$. ${TABLE}`, 0.9772, "$X - Y \\sim N(10, 25)$."), ["$P(X - Y > 0) = P(Z > -2) = \\Phi(2) = 0.9772$."]),
      ex(3, num("nrm-ex-8", "Scores are $N(\\mu, 10^2)$ and 97.5% of scores are below 80. Find $\\mu$. Use $\\Phi(1.96) = 0.975$.", 60.4, "$80 = \\mu + 1.96 \\cdot 10$."), ["$\\tfrac{80 - \\mu}{10} = 1.96$, so $\\mu = 80 - 19.6 = 60.4$."]),
      ex(3, num("nrm-ex-9", `Four independent values are each $N(5, 1)$. Find $P(\\text{their sum} > 24)$. ${TABLE}`, 0.0228, "Sum $\\sim N(20, 4)$."), ["The sum is $N(20, 4)$, $\\sigma = 2$; $z = 2$.", "$1 - \\Phi(2) = 0.0228$."]),
    ],
  },

  // §6.5
  mle: {
    definitions: [
      {
        type: "definition",
        term: "likelihood",
        body: "For independent observations $x_1, \\dots, x_n$ from a model with parameter $\\theta$, the **likelihood** is $L(\\theta) = \\prod_i p(x_i; \\theta)$ and the **log-likelihood** is $\\ell(\\theta) = \\sum_i \\ln p(x_i; \\theta)$. The **maximum likelihood estimate** $\\hat\\theta$ maximises $L$, equivalently $\\ell$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "Bernoulli",
        statement: "For $k$ successes in $n$ independent trials, the MLE of the success probability is $\\hat p = k/n$.",
        proof: [
          "$\\ell(p) = k\\ln p + (n - k)\\ln(1 - p)$, so $\\ell'(p) = \\dfrac kp - \\dfrac{n - k}{1 - p}$.",
          "Setting $\\ell'(p) = 0$: $k(1 - p) = (n - k)p$, so $p = k/n$. $\\ell$ is concave, so this is the maximum.",
        ],
      },
      {
        type: "theorem",
        name: "standard models",
        statement: "Normal: $\\hat\\mu = \\bar x$ and $\\hat\\sigma^2 = \\tfrac1n\\sum(x_i - \\bar x)^2$. Poisson: $\\hat\\lambda = \\bar x$. Exponential with rate $\\lambda$: $\\hat\\lambda = 1/\\bar x$.",
        proof: [
          "Normal: $\\ell = -\\tfrac{1}{2\\sigma^2}\\sum(x_i - \\mu)^2 + \\text{(terms without } \\mu)$, maximised where $\\sum(x_i - \\mu) = 0$, i.e. $\\mu = \\bar x$.",
          "Poisson: $\\ell = -n\\lambda + (\\sum x_i)\\ln\\lambda + \\text{const}$, and $\\ell' = -n + \\sum x_i/\\lambda = 0$ gives $\\lambda = \\bar x$. Exponential: $\\ell = n\\ln\\lambda - \\lambda\\sum x_i$, and $\\ell' = n/\\lambda - \\sum x_i = 0$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "invariance",
        statement: "If $\\hat\\theta$ is the MLE of $\\theta$, then $g(\\hat\\theta)$ is the MLE of $g(\\theta)$.",
        proof: ["Reparametrising by $\\eta = g(\\theta)$ (one-to-one) does not change which model gives the data the highest probability."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A coin lands heads 7 times in 10 tosses. Find the MLE of $P(\\text{heads})$.",
        solution: ["$\\hat p = k/n$.", "$= 7/10$."],
        result: "$0.7$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Daily counts of emails are modelled as Poisson: $2, 4, 3, 5, 1$. Estimate $\\lambda$ and $P(\\text{no emails tomorrow})$.",
        solution: ["$\\hat\\lambda = \\bar x = 15/5 = 3$.", "By invariance, $\\widehat{P(X = 0)} = e^{-3} \\approx 0.050$."],
        result: "$\\hat\\lambda = 3$; about 0.05.",
      },
      {
        type: "example",
        level: 3,
        title: "when calculus fails",
        problem: "Data $2, 7, 4$ comes from the uniform distribution on $[0, \\theta]$. Find the MLE of $\\theta$.",
        solution: [
          "Each density is $1/\\theta$ on $[0, \\theta]$, so $L(\\theta) = \\theta^{-3}$ if $\\theta \\ge \\max x_i = 7$, and 0 otherwise (a value above $\\theta$ is impossible).",
          "$\\theta^{-3}$ decreases, so $L$ is largest at the smallest allowed $\\theta$. The derivative is never zero; the maximum is at the boundary.",
        ],
        result: "$\\hat\\theta = 7$, the sample maximum.",
      },
    ],
    pitfalls: [
      { wrong: "The MLE always comes from solving $\\ell'(\\theta) = 0$.", right: "Check the boundary: for the uniform on $[0, \\theta]$ the maximum is at $\\theta = \\max x_i$." },
      { wrong: "The MLE of $\\sigma^2$ divides by $n - 1$.", right: "The MLE divides by $n$. Dividing by $n - 1$ gives the unbiased sample variance, a different estimator." },
    ],
    formulas: [
      { label: "Log-likelihood", tex: "\\ell(\\theta) = \\textstyle\\sum \\ln p(x_i; \\theta)" },
      { label: "Bernoulli, Poisson", tex: "\\hat p = k/n,\\quad \\hat\\lambda = \\bar x" },
      { label: "Normal", tex: "\\hat\\mu = \\bar x,\\quad \\hat\\sigma^2 = \\tfrac1n\\textstyle\\sum(x_i - \\bar x)^2" },
      { label: "Exponential", tex: "\\hat\\lambda = 1/\\bar x" },
    ],
    exercises: [
      ex(1, num("mle-ex-1", "12 successes in 40 trials. Find $\\hat p$.", 0.3, "$k/n$."), ["$12/40 = 0.3$."]),
      ex(1, num("mle-ex-2", "Data $4, 6, 8, 10, 12$ is modelled as normal. Find $\\hat\\mu$.", 8, "The sample mean."), ["$\\hat\\mu = 40/5 = 8$."]),
      ex(2, num("mle-ex-3", "Poisson counts $0, 2, 1, 3, 4$. Find $\\hat\\lambda$.", 2, "The mean."), ["$\\hat\\lambda = 10/5 = 2$."]),
      ex(2, fr("mle-ex-4", "Data $2, 4, 6$ is modelled as normal. Find the MLE of $\\sigma^2$.", 8 / 3, "Divide by $n$."), ["Mean 4; squared deviations $4, 0, 4$; $\\hat\\sigma^2 = 8/3$."]),
      ex(2, num("mle-ex-5", "Find the $p$ that maximises $L(p) = p^3(1 - p)^7$.", 0.3, "3 successes in 10."), ["$\\ell'(p) = 3/p - 7/(1 - p) = 0$ gives $p = 0.3$."]),
      ex(3, fr("mle-ex-6", "Waiting times $1, 2, 3, 6$ are modelled as exponential with rate $\\lambda$. Find $\\hat\\lambda$.", 1 / 3, "$1/\\bar x$."), ["$\\bar x = 12/4 = 3$, so $\\hat\\lambda = \\tfrac13$."]),
      ex(3, dp("mle-ex-7", "Poisson counts have $\\hat\\lambda = 2$. Find the MLE of $P(X = 0)$.", Math.exp(-2), "Invariance."), ["$e^{-\\hat\\lambda} = e^{-2} \\approx 0.135$."]),
      ex(3, num("mle-ex-8", "Data $2, 7, 4$ is uniform on $[0, \\theta]$. Find $\\hat\\theta$.", 7, "The likelihood is 0 below the maximum."), ["$L(\\theta) = \\theta^{-3}$ for $\\theta \\ge 7$ and 0 below; it is largest at $\\theta = 7$."]),
      ex(3, mc("mle-ex-9", "Why maximise $\\ln L$ instead of $L$?", ["Same maximiser, and sums are easier than products", "$\\ln$ is increasing, so it keeps the location of the maximum."], [["$\\ln L$ has a different, better maximiser", "Its maximiser is the same."], ["$L$ cannot be maximised", "It can; the log only makes it easier."]]), [
        "$\\ln$ is strictly increasing, so $L$ and $\\ln L$ peak at the same $\\theta$; the log turns the product into a sum, which differentiates easily.",
      ]),
    ],
  },

  // §6.6
  "least-squares": {
    definitions: [
      {
        type: "definition",
        term: "residual, least squares line",
        body: "For a line $\\hat y = a + bx$, the **residual** of point $(x_i, y_i)$ is $e_i = y_i - \\hat y_i$. The **least squares line** minimises $\\sum e_i^2$. With $S_{xx} = \\sum(x_i - \\bar x)^2$ and $S_{xy} = \\sum(x_i - \\bar x)(y_i - \\bar y)$, its slope is $b = S_{xy}/S_{xx}$.",
      },
      {
        type: "definition",
        term: "coefficient of determination",
        body: "$R^2 = 1 - \\dfrac{\\sum e_i^2}{\\sum(y_i - \\bar y)^2}$ is the fraction of the variance of $y$ explained by the line. For a straight-line fit, $R^2 = r^2$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "least squares line",
        statement: "The least squares line has $b = \\dfrac{S_{xy}}{S_{xx}} = \\dfrac{\\operatorname{Cov}(x, y)}{\\operatorname{Var}(x)} = r\\dfrac{s_y}{s_x}$ and $a = \\bar y - b\\bar x$. It passes through $(\\bar x, \\bar y)$ and its residuals sum to 0.",
        proof: [
          "$\\partial/\\partial a$ of $\\sum(y_i - a - bx_i)^2$ is $-2\\sum e_i = 0$: residuals sum to 0, so $\\bar y = a + b\\bar x$.",
          "Substituting $a = \\bar y - b\\bar x$, the sum becomes $\\sum((y_i - \\bar y) - b(x_i - \\bar x))^2 = S_{yy} - 2bS_{xy} + b^2S_{xx}$, a quadratic in $b$ minimised at $b = S_{xy}/S_{xx}$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "two regression lines",
        statement: "The regression of $y$ on $x$ has slope $b_{yx} = r\\,s_y/s_x$ and that of $x$ on $y$ has $b_{xy} = r\\,s_x/s_y$. Both lines pass through $(\\bar x, \\bar y)$, and $b_{yx}b_{xy} = r^2$, with $r$ taking the common sign of the slopes.",
        proof: ["Multiply the two slope formulas: the standard deviations cancel, leaving $r^2$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Fit the least squares line to $(1, 2), (2, 3), (3, 5)$.",
        solution: [
          "$\\bar x = 2$, $\\bar y = \\tfrac{10}{3}$. $S_{xx} = 1 + 0 + 1 = 2$; $S_{xy} = (-1)(-\\tfrac43) + 0 + (1)(\\tfrac53) = 3$.",
          "$b = 3/2 = 1.5$ and $a = \\tfrac{10}{3} - 1.5 \\cdot 2 = \\tfrac13$.",
        ],
        result: "$\\hat y = \\tfrac13 + 1.5x$.",
      },
      {
        type: "example",
        level: 2,
        title: "from a summary",
        problem: "$\\bar x = 10$, $\\bar y = 20$, $s_x = 2$, $s_y = 5$, $r = 0.8$. Find the regression line of $y$ on $x$ and predict $y$ at $x = 12$.",
        solution: ["$b = 0.8 \\cdot 5/2 = 2$; $a = 20 - 2 \\cdot 10 = 0$.", "At $x = 12$: $\\hat y = 24$."],
        result: "$\\hat y = 2x$; prediction 24.",
      },
      {
        type: "example",
        level: 3,
        title: "identifying the regression lines",
        problem: "The two regression lines are $3x + 2y = 26$ and $6x + y = 31$. Find $\\bar x$, $\\bar y$ and $r$.",
        solution: [
          "Both pass through $(\\bar x, \\bar y)$: from the second, $y = 31 - 6x$; substituting, $3x + 62 - 12x = 26$, so $\\bar x = 4$, $\\bar y = 7$.",
          "Try $y$ on $x$ from the first ($b_{yx} = -\\tfrac32$) and $x$ on $y$ from the second ($b_{xy} = -\\tfrac16$): product $\\tfrac14 \\le 1$, valid. The other assignment gives $(-6)(-\\tfrac23) = 4 > 1$, impossible.",
          "$r^2 = \\tfrac14$ and both slopes are negative, so $r = -\\tfrac12$.",
        ],
        result: "$\\bar x = 4$, $\\bar y = 7$, $r = -0.5$.",
      },
    ],
    pitfalls: [
      { wrong: "The regression of $x$ on $y$ is the same line rearranged.", right: "Different line (unless $|r| = 1$): it minimises horizontal, not vertical, distances." },
      { wrong: "A good fit ($R^2$ near 1) proves $x$ causes $y$.", right: "It measures linear association only; see §8.6." },
      { wrong: "Use the line to predict far outside the data.", right: "Extrapolation assumes the straight-line pattern continues where there is no data." },
    ],
    formulas: [
      { label: "Slope", tex: "b = S_{xy}/S_{xx} = r\\,s_y/s_x" },
      { label: "Intercept", tex: "a = \\bar y - b\\bar x" },
      { label: "Two lines", tex: "b_{yx}b_{xy} = r^2" },
      { label: "Fit", tex: "R^2 = r^2" },
    ],
    exercises: [
      ex(1, num("ls-ex-1", "The least squares line is $\\hat y = 2 + 3x$ and $\\bar x = 4$. Find $\\bar y$.", 14, "The line passes through the means."), ["$\\bar y = 2 + 3 \\cdot 4 = 14$."]),
      ex(1, num("ls-ex-2", "The line is $\\hat y = 1 + 2x$. Find the residual of the point $(3, 10)$.", 3, "$y - \\hat y$."), ["$\\hat y = 7$, so $e = 10 - 7 = 3$."]),
      ex(2, num("ls-ex-3", "$\\operatorname{Cov}(x, y) = 6$ and $\\operatorname{Var}(x) = 4$. Find the slope.", 1.5, "$\\operatorname{Cov}/\\operatorname{Var}$."), ["$b = 6/4 = 1.5$."]),
      ex(2, num("ls-ex-4", "$r = 0.6$, $s_x = 2$ and $s_y = 10$. Find the slope of $y$ on $x$.", 3, "$r s_y/s_x$."), ["$0.6 \\cdot 10/2 = 3$."]),
      ex(2, fr("ls-ex-5", "Find the intercept of the least squares line through $(1, 2), (2, 3), (3, 5)$.", 1 / 3, "$a = \\bar y - b\\bar x$ with $b = 1.5$."), ["$b = 1.5$; $a = \\tfrac{10}{3} - 3 = \\tfrac13$."]),
      ex(3, num("ls-ex-6", "The regression lines are $3x + 2y = 26$ and $6x + y = 31$. Find $\\bar x$.", 4, "They meet at the means."), ["Solving the two equations gives $(4, 7)$."]),
      ex(3, num("ls-ex-7", "The regression lines are $3x + 2y = 26$ and $6x + y = 31$. Find $r$.", -0.5, "$b_{yx}b_{xy} = r^2$."), ["The valid assignment gives slopes $-\\tfrac32$ and $-\\tfrac16$, product $\\tfrac14$; both negative, so $r = -0.5$."]),
      ex(3, num("ls-ex-8", "$b_{yx} = 0.8$ and $b_{xy} = 0.2$. Find $r$.", 0.4, "$\\sqrt{0.16}$, sign of the slopes."), ["$r^2 = 0.16$ and the slopes are positive: $r = 0.4$."]),
      ex(3, num("ls-ex-9", "A straight-line fit has $r = -0.5$. What fraction of the variance of $y$ does it explain?", 0.25, "$R^2 = r^2$."), ["$R^2 = 0.25$."]),
    ],
  },

  // §6.7
  "loss-functions": {
    definitions: [
      {
        type: "definition",
        term: "losses",
        body: "For targets $y_i$ and predictions $\\hat y_i$: **mean squared error** $\\text{MSE} = \\tfrac1n\\sum(y_i - \\hat y_i)^2$; **mean absolute error** $\\text{MAE} = \\tfrac1n\\sum|y_i - \\hat y_i|$. For labels $y \\in \\{0, 1\\}$ and predicted probability $p$, the **log loss** (cross-entropy) is $-[y\\ln p + (1 - y)\\ln(1 - p)]$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "best constant prediction",
        statement: "Among constant predictions $c$, MSE is minimised by the mean $\\bar y$ and MAE by a median. For 0/1 labels, log loss is minimised by $p$ = the fraction of 1s.",
        proof: [
          "$\\tfrac{d}{dc}\\sum(y_i - c)^2 = -2\\sum(y_i - c) = 0$ gives $c = \\bar y$.",
          "Moving $c$ right by a small step changes $\\sum|y_i - c|$ by (number of points left of $c$ − number right of $c$) times the step; this is 0 exactly when $c$ is a median.",
          "With $k$ ones among $n$, the total log loss $-k\\ln p - (n - k)\\ln(1 - p)$ is the negative Bernoulli log-likelihood, minimised at $p = k/n$ (§6.5).",
        ],
      },
      {
        type: "theorem",
        name: "losses are likelihoods",
        statement: "If $y_i = f(x_i) + \\varepsilon_i$ with independent $\\varepsilon_i \\sim N(0, \\sigma^2)$, maximising the likelihood of $f$ is the same as minimising MSE. If $y_i \\sim \\text{Bernoulli}(p_i)$, maximising the likelihood is the same as minimising total log loss.",
        proof: [
          "Normal noise: $\\ell = -\\tfrac{1}{2\\sigma^2}\\sum(y_i - f(x_i))^2 + \\text{const}$, so a larger $\\ell$ means a smaller sum of squares.",
          "Bernoulli: $\\ln P(y_i) = y_i\\ln p_i + (1 - y_i)\\ln(1 - p_i)$, which is exactly minus the log loss.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Targets $1, 2, 3$; predictions $1, 3, 5$. Find the MSE.",
        solution: ["Errors $0, -1, -2$; squares $0, 1, 4$.", "MSE $= 5/3$."],
        result: "$\\tfrac53 \\approx 1.667$.",
      },
      {
        type: "example",
        level: 2,
        title: "mean versus median",
        problem: "Targets $1, 2, 9$. Which constant minimises MSE, and which minimises MAE?",
        solution: ["MSE: the mean, $4$ (MSE $\\tfrac{9 + 4 + 25}{3} = \\tfrac{38}{3}$).", "MAE: the median, $2$ (MAE $\\tfrac{1 + 0 + 7}{3} = \\tfrac83$). The outlier 9 drags the MSE choice up."],
        result: "4 for MSE, 2 for MAE.",
      },
      {
        type: "example",
        level: 3,
        title: "confident and wrong",
        problem: "A model predicts $p = 0.8$. Find its log loss when $y = 1$ and when $y = 0$. What happens as $p \\to 1$ with $y = 0$?",
        solution: ["$y = 1$: $-\\ln 0.8 \\approx 0.223$. $y = 0$: $-\\ln 0.2 \\approx 1.609$.", "With $y = 0$ the loss is $-\\ln(1 - p) \\to \\infty$ as $p \\to 1$: a confident wrong answer is punished without limit."],
        result: "$0.223$ and $1.609$; the loss grows without bound.",
      },
    ],
    pitfalls: [
      { wrong: "MSE and MAE pick the same best prediction.", right: "MSE picks the mean, MAE the median; they differ for skewed targets." },
      { wrong: "Log loss is just the error rate.", right: "It scores the probability, not the 0/1 decision: confident mistakes cost far more than hesitant ones." },
    ],
    formulas: [
      { label: "MSE, MAE", tex: "\\tfrac1n\\textstyle\\sum (y - \\hat y)^2,\\quad \\tfrac1n\\sum |y - \\hat y|" },
      { label: "Log loss", tex: "-[y\\ln p + (1 - y)\\ln(1 - p)]" },
      { label: "Best constant", tex: "\\text{MSE} \\to \\bar y,\\ \\text{MAE} \\to \\text{median}" },
    ],
    exercises: [
      ex(1, fr("loss-ex-1", "Targets $2, 4, 6$; predictions $3, 4, 4$. Find the MSE.", 5 / 3, "Squares $1, 0, 4$."), ["Errors $-1, 0, 2$; squares $1, 0, 4$; $5/3$."]),
      ex(1, num("loss-ex-2", "Targets $2, 4, 6$; predictions $3, 4, 4$. Find the MAE.", 1, "$(1 + 0 + 2)/3$."), ["$(1 + 0 + 2)/3 = 1$."]),
      ex(2, num("loss-ex-3", "Targets $1, 2, 9$. Which constant prediction minimises MSE?", 4, "The mean."), ["The mean, $12/3 = 4$."]),
      ex(2, num("loss-ex-4", "Targets $1, 2, 9$. Which constant prediction minimises MAE?", 2, "The median."), ["The median, 2."]),
      ex(2, dp("loss-ex-5", "Find the log loss of predicting $p = 0.9$ when $y = 1$.", -Math.log(0.9), "$-\\ln 0.9$."), ["$-\\ln 0.9 \\approx 0.105$."]),
      ex(3, dp("loss-ex-6", "Find the log loss of predicting $p = 0.9$ when $y = 0$.", -Math.log(0.1), "$-\\ln 0.1$."), ["$-\\ln(1 - 0.9) = -\\ln 0.1 \\approx 2.303$."]),
      ex(3, num("loss-ex-7", "Labels $1, 1, 0, 1$. Which constant probability minimises total log loss?", 0.75, "The fraction of 1s."), ["$p = 3/4 = 0.75$, the Bernoulli MLE."]),
      ex(3, dp("loss-ex-8", "Two examples: $y = 1$ with $p = 0.5$, and $y = 0$ with $p = 0.5$. Find the average log loss.", Math.log(2), "Each costs $\\ln 2$."), ["Each costs $-\\ln 0.5 = \\ln 2$, so the average is $\\ln 2 \\approx 0.693$."]),
      ex(3, mc("loss-ex-9", "Minimising squared error is maximum likelihood when the noise is", ["normal", "The normal log-density is $-(y - f)^2/(2\\sigma^2)$ plus a constant."], [["uniform", "That gives a different criterion."], ["any distribution at all", "Only normal noise gives squared error; Laplace noise gives absolute error."]]), [
        "Under $N(0, \\sigma^2)$ noise the log-likelihood is $-\\tfrac1{2\\sigma^2}\\sum(y_i - f(x_i))^2$ + const.",
      ]),
    ],
  },
};
