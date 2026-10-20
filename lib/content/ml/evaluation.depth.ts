import { ex, mc, num, vec, type Depth } from "../deepen";

/** Regression & Evaluation at exam depth: multiple and logistic regression, regularisation, validation, bias–variance, classification metrics. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const sigma = (z: number) => 1 / (1 + Math.exp(-z));

export const EVALUATION_DEPTH: Record<string, Depth> = {
  // §{multiple-regression}
  "multiple-regression": {
    definitions: [
      {
        type: "definition",
        term: "design matrix, normal equations",
        body: "Put the $n$ examples as rows of $X$, with a first column of 1s for the intercept, so $\\hat{\\vec y} = X\\vec w$. Least squares chooses $\\vec w$ to minimise $\\text{SSE} = |\\vec y - X\\vec w|^2$; the solution satisfies the **normal equations** $X^{\\mathsf T}X\\vec w = X^{\\mathsf T}\\vec y$.",
      },
      {
        type: "definition",
        term: "R², adjusted R²",
        body: "$\\text{SST} = \\sum(y_i - \\bar y)^2$, $\\text{SSE} = \\sum(y_i - \\hat y_i)^2$ and $R^2 = 1 - \\text{SSE}/\\text{SST}$. With $k$ features, **adjusted** $R^2 = 1 - (1 - R^2)\\dfrac{n - 1}{n - k - 1}$ penalises extra features.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "normal equations",
        statement: "$\\vec w$ minimises SSE exactly when the residual $\\vec e = \\vec y - X\\vec w$ is perpendicular to every column of $X$: $X^{\\mathsf T}\\vec e = \\vec 0$. If $X^{\\mathsf T}X$ is invertible, $\\vec w = (X^{\\mathsf T}X)^{-1}X^{\\mathsf T}\\vec y$.",
        proof: [
          "$X\\vec w$ ranges over the span of the columns of $X$. The closest point to $\\vec y$ in that span is the perpendicular projection (§{least-squares}), whose error is perpendicular to every column.",
          "Rewrite $X^{\\mathsf T}(\\vec y - X\\vec w) = \\vec 0$ as $X^{\\mathsf T}X\\vec w = X^{\\mathsf T}\\vec y$ and multiply by the inverse (§{inverse}).",
        ],
      },
      {
        type: "theorem",
        name: "explained variation",
        statement: "With an intercept, $\\text{SST} = \\text{SSR} + \\text{SSE}$ where $\\text{SSR} = \\sum(\\hat y_i - \\bar y)^2$. So $0 \\le R^2 \\le 1$ on the training data, and $R^2$ equals the squared correlation between $y$ and $\\hat y$; for one feature, $R^2 = r^2$.",
        proof: [
          "$y_i - \\bar y = (\\hat y_i - \\bar y) + e_i$. The residuals are perpendicular to the columns of $X$, including the column of 1s, so they sum to 0 and are perpendicular to the fitted deviations.",
          "By Pythagoras the squared lengths add: $\\text{SST} = \\text{SSR} + \\text{SSE}$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "collinear features",
        statement: "If features are nearly linear combinations of one another, $X^{\\mathsf T}X$ is nearly singular, and the individual weights become unstable: small changes in the data swing them wildly, even though predictions stay good.",
        proof: ["Near-dependent columns make $\\det(X^{\\mathsf T}X)$ close to 0 (§{det-zero}), so its inverse has huge entries that amplify noise in $\\vec y$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$\\hat y = 50 + 3x_1 - 2x_2$, where $x_1$ is hours studied and $x_2$ is hours of TV. Interpret $-2$ and predict at $x_1 = 10$, $x_2 = 5$.",
        solution: ["Each extra hour of TV lowers the predicted score by 2, **with study hours held fixed**.", "$\\hat y = 50 + 30 - 10 = 70$."],
        result: "70.",
      },
      {
        type: "example",
        level: 2,
        problem: "Data $y = (2, 4, 6, 8)$ and predictions $\\hat y = (3, 3, 7, 7)$. Find $R^2$.",
        solution: ["$\\bar y = 5$; $\\text{SST} = 9 + 1 + 1 + 9 = 20$.", "$\\text{SSE} = 1 + 1 + 1 + 1 = 4$, so $R^2 = 1 - 4/20$."],
        result: "$R^2 = 0.8$.",
      },
      {
        type: "example",
        level: 3,
        title: "solving the normal equations",
        problem: "Fit $\\hat y = b + wx$ to $(0, 1), (1, 2), (2, 4)$.",
        solution: [
          "$X$ has rows $(1, 0), (1, 1), (1, 2)$: $X^{\\mathsf T}X = \\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}$ and $X^{\\mathsf T}\\vec y = (7, 10)$.",
          "$3b + 3w = 7$ and $3b + 5w = 10$. Subtract: $2w = 3$, so $w = 1.5$ and $b = \\tfrac{7 - 4.5}{3} = \\tfrac56$.",
        ],
        result: "$\\hat y = \\tfrac56 + 1.5x$.",
      },
      {
        type: "example",
        level: 3,
        title: "adjusted R²",
        problem: "A model with $k = 4$ features on $n = 21$ points has $R^2 = 0.80$. Find adjusted $R^2$.",
        solution: ["$1 - 0.2 \\times \\dfrac{20}{16} = 1 - 0.25$.", "The penalty grows as $k$ approaches $n$."],
        result: "0.75.",
      },
    ],
    pitfalls: [
      { wrong: "$w_1 = 3$ means $x_1$ raises $y$ by 3, full stop.", right: "By 3 per unit **with the other features held fixed**; dropping a feature can change $w_1$ completely." },
      { wrong: "Higher training $R^2$ means a better model.", right: "Training $R^2$ never falls when features are added. Compare adjusted $R^2$ or validation error." },
      { wrong: "$R^2 = 0.8$ means 80% of predictions are right.", right: "It means the model accounts for 80% of the variation of $y$ about its mean." },
    ],
    formulas: [
      { label: "Normal equations", tex: "X^{\\mathsf T}X\\vec w = X^{\\mathsf T}\\vec y" },
      { label: "R²", tex: "R^2 = 1 - \\text{SSE}/\\text{SST}" },
      { label: "Adjusted", tex: "1 - (1 - R^2)\\tfrac{n - 1}{n - k - 1}" },
      { label: "Decomposition", tex: "\\text{SST} = \\text{SSR} + \\text{SSE}" },
    ],
    exercises: [
      ex(1, num("mrg-ex-1", "$\\hat y = 4 + 2x_1 + 0.5x_2$. Predict at $x_1 = 3$, $x_2 = 6$.", 13, "Substitute."), ["$4 + 6 + 3 = 13$."]),
      ex(1, num("mrg-ex-2", "SSE = 15 and SST = 60. Find $R^2$.", 0.75, "$1 - 15/60$."), ["$1 - 0.25 = 0.75$."]),
      ex(2, fr("mrg-ex-3", "Data $y = (1, 2, 3, 6)$ with predictions $(1, 3, 3, 5)$. Find $R^2$.", 6 / 7, "$\\bar y = 3$."), ["$\\text{SST} = 4 + 1 + 0 + 9 = 14$ and $\\text{SSE} = 0 + 1 + 0 + 1 = 2$.", "$R^2 = 1 - \\tfrac{2}{14} = \\tfrac67$."]),
      ex(2, num("mrg-ex-4", "A one-feature regression has correlation $r = -0.6$. Find $R^2$.", 0.36, "$r^2$."), ["$(-0.6)^2 = 0.36$."]),
      ex(2, num("mrg-ex-5", "Score $= 20 + 3(\\text{hours}) - 2(\\text{absences})$. By how much does the predicted score change for 2 more hours, absences fixed?", 6, "$2 \\times 3$."), ["$3$ per hour, so $6$."]),
      ex(2, num("mrg-ex-6", "Fit $\\hat y = wx$ (no intercept) to $(1, 1)$ and $(2, 3)$. Use $w = \\sum xy/\\sum x^2$.", 1.4, "$7/5$."), ["$\\sum xy = 1 + 6 = 7$ and $\\sum x^2 = 5$: $w = 1.4$."]),
      ex(3, num("mrg-ex-7", "Fit $\\hat y = b + wx$ to $(0, 1), (1, 2), (2, 4)$. Find $w$.", 1.5, "Normal equations."), ["$3b + 3w = 7$ and $3b + 5w = 10$ give $w = 1.5$."]),
      ex(3, fr("mrg-ex-8", "Same fit. Find $b$.", 5 / 6, "Back-substitute."), ["$3b = 7 - 4.5 = 2.5$, so $b = \\tfrac56$."]),
      ex(3, num("mrg-ex-9", "$n = 11$, $k = 2$ and $R^2 = 0.6$. Find adjusted $R^2$.", 0.5, "$1 - 0.4 \\times 10/8$."), ["$1 - 0.4 \\times 1.25 = 0.5$."]),
      ex(3, mc("mrg-ex-10", "A model uses height in cm and height in inches as two features. Their weights are", ["unstable: the data can't separate their effects", "The columns are almost exactly proportional."], [["each half the true effect", "Any split adding to the right total fits equally well."], ["both zero", "Together they still predict well."]]), ["Nearly dependent columns make $X^{\\mathsf T}X$ nearly singular; only their combined effect is pinned down."]),
      ex(3, mc("mrg-ex-11", "Adding a feature of pure noise to a regression makes the training $R^2$", ["rise or stay the same", "Least squares could set its weight to 0."], [["fall", "The old fit is still available."], ["unchanged, always", "It usually rises a little by fitting noise."]]), ["The larger model can reproduce the smaller one, so its SSE can only be lower or equal."]),
    ],
  },

  // §{logistic-regression}
  "logistic-regression": {
    definitions: [
      {
        type: "definition",
        term: "odds, log-odds",
        body: "The **odds** of an event with probability $p$ are $\\dfrac{p}{1 - p}$, and the **log-odds** or **logit** is $\\ln\\dfrac{p}{1 - p}$. Logistic regression models $\\operatorname{logit}(p) = b + \\vec w\\cdot\\vec x$.",
      },
      {
        type: "definition",
        term: "log-loss",
        body: "Over $n$ examples, the **cross-entropy** or **log-loss** is $L = -\\dfrac1n\\sum_i\\big[y_i\\ln p_i + (1 - y_i)\\ln(1 - p_i)\\big]$, the average surprise at the true labels.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "sigmoid and logit are inverses",
        statement: "$p = \\sigma(z)$ exactly when $z = \\ln\\dfrac{p}{1 - p}$. Hence the odds are $e^z$, and raising $x_j$ by 1 multiplies the odds by $e^{w_j}$.",
        proof: [
          "From $p = \\dfrac{1}{1 + e^{-z}}$: $\\dfrac1p - 1 = e^{-z}$, so $\\dfrac{p}{1 - p} = e^z$.",
          "$x_j \\to x_j + 1$ adds $w_j$ to $z$, multiplying $e^z$ by $e^{w_j}$.",
        ],
      },
      {
        type: "theorem",
        name: "gradient of the log-loss",
        statement: "$\\dfrac{\\partial L}{\\partial\\vec w} = \\dfrac1n\\sum_i(p_i - y_i)\\vec x_i$ and $\\dfrac{\\partial L}{\\partial b} = \\dfrac1n\\sum_i(p_i - y_i)$: the same residual form as linear regression.",
        proof: ["For one example, $\\partial L/\\partial z = p - y$ (§{backprop}), and $\\partial z/\\partial\\vec w = \\vec x$. Average over the examples."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "log-loss is maximum likelihood",
        statement: "Minimising the log-loss is the same as maximising the likelihood $\\prod_i p_i^{y_i}(1 - p_i)^{1 - y_i}$ of the observed labels (§{mle}).",
        proof: ["$-\\tfrac1n\\ln\\prod_i p_i^{y_i}(1 - p_i)^{1 - y_i}$ is exactly $L$, and $-\\ln$ is decreasing."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "the boundary is linear",
        statement: "Predicting class 1 when $p > t$ is the same as $z > \\ln\\dfrac{t}{1 - t}$: a straight boundary, shifted by the threshold. At $t = 0.5$ it is $z = 0$.",
        proof: ["$\\sigma$ is increasing, so $p > t$ exactly when $z > \\operatorname{logit}(t)$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$\\operatorname{logit}(p) = -3 + 0.5x$. Find $p$ at $x = 8$.",
        solution: ["$z = -3 + 4 = 1$.", "$p = \\sigma(1) = \\dfrac{1}{1 + e^{-1}} \\approx 0.731$."],
        result: "About 0.731.",
      },
      {
        type: "example",
        level: 2,
        title: "odds ratios",
        problem: "A weight is $w = \\ln 2$. At the current $x$, $p = 0.2$. Find $p$ after $x$ rises by 1.",
        solution: ["Odds now $0.2/0.8 = 0.25$; multiplied by $e^{\\ln 2} = 2$: $0.5$.", "$p = \\dfrac{0.5}{1 + 0.5} = \\dfrac13$."],
        result: "$p = \\tfrac13$: the odds double, the probability does not.",
      },
      {
        type: "example",
        level: 3,
        title: "a stricter threshold",
        problem: "$\\operatorname{logit}(p) = -3 + 0.5x$. Above what $x$ is $p > 0.8$?",
        solution: ["$p > 0.8$ means $z > \\ln\\dfrac{0.8}{0.2} = \\ln 4 \\approx 1.386$.", "$-3 + 0.5x > 1.386$ gives $x > 8.77$."],
        result: "$x > 8.77$.",
      },
      {
        type: "example",
        level: 3,
        title: "one gradient step",
        problem: "Examples $x = 1$ ($y = 1$) and $x = 2$ ($y = 0$), with $w = b = 0$. Find $\\partial L/\\partial w$ and $\\partial L/\\partial b$.",
        solution: [
          "Both predictions are $p = \\sigma(0) = 0.5$.",
          "$\\partial L/\\partial w = \\tfrac12[(0.5 - 1)(1) + (0.5 - 0)(2)] = \\tfrac12(0.5) = 0.25$.",
          "$\\partial L/\\partial b = \\tfrac12[-0.5 + 0.5] = 0$. Descent lowers $w$: larger $x$ means class 0.",
        ],
        result: "$0.25$ and $0$.",
      },
    ],
    pitfalls: [
      { wrong: "$w_j$ is the change in probability per unit of $x_j$.", right: "It is the change in **log-odds**; the change in probability depends on where you start." },
      { wrong: "Fit logistic regression by squared error.", right: "Use log-loss: it is convex in the weights and punishes confident mistakes strongly." },
      { wrong: "Always classify at $p > 0.5$.", right: "Pick the threshold from the costs of each kind of error (§{precision-recall})." },
    ],
    formulas: [
      { label: "Model", tex: "\\ln\\tfrac{p}{1 - p} = b + \\vec w\\cdot\\vec x" },
      { label: "Odds ratio", tex: "e^{w_j}\\ \\text{per unit of}\\ x_j" },
      { label: "Log-loss", tex: "-\\tfrac1n\\textstyle\\sum[y\\ln p + (1 - y)\\ln(1 - p)]" },
      { label: "Gradient", tex: "\\tfrac1n\\textstyle\\sum (p_i - y_i)\\vec x_i" },
    ],
    exercises: [
      ex(1, dp("lgr-ex-1", "Find $\\sigma(1)$.", sigma(1), "$1/(1 + e^{-1})$."), ["$1/(1 + 0.368) \\approx 0.731$."]),
      ex(1, num("lgr-ex-2", "Find $\\operatorname{logit}(0.5)$.", 0, "$\\ln 1$."), ["Odds 1, log-odds 0."]),
      ex(2, dp("lgr-ex-3", "Find $\\operatorname{logit}(0.9)$.", Math.log(9), "$\\ln 9$."), ["Odds $0.9/0.1 = 9$; $\\ln 9 \\approx 2.197$."]),
      ex(2, num("lgr-ex-4", "A weight is $\\ln 2$. By what factor do the odds change when its feature rises by 1?", 2, "$e^{w}$."), ["$e^{\\ln 2} = 2$."]),
      ex(2, num("lgr-ex-5", "$p = 0.2$ and a weight of $\\ln 4$. Find $p$ after its feature rises by 1.", 0.5, "Odds $0.25 \\times 4$."), ["Odds become 1, so $p = 0.5$."]),
      ex(2, num("lgr-ex-6", "$\\operatorname{logit}(p) = -6 + 2x$. At what $x$ is $p = 0.5$?", 3, "$z = 0$."), ["$-6 + 2x = 0$ gives $x = 3$."]),
      ex(3, dp("lgr-ex-7", "Same model. At what $x$ is $p = 0.8$?", 3 + Math.log(4) / 2, "$z = \\ln 4$."), ["$-6 + 2x = \\ln 4$, so $x = 3 + \\tfrac{\\ln 4}{2} \\approx 3.693$."]),
      ex(3, dp("lgr-ex-8", "Predictions $p = 0.8$ and $0.4$ for labels $1$ and $0$. Find the mean log-loss.", -(Math.log(0.8) + Math.log(0.6)) / 2, "$-\\tfrac12[\\ln 0.8 + \\ln 0.6]$."), ["$-\\tfrac12[\\ln 0.8 + \\ln 0.6] \\approx \\tfrac12(0.223 + 0.511) \\approx 0.367$."]),
      ex(3, num("lgr-ex-9", "Examples $x = 1$ ($y = 1$) and $x = 2$ ($y = 0$) with $w = b = 0$. Find $\\partial L/\\partial w$.", 0.25, "$\\tfrac1n\\sum(p - y)x$."), ["$\\tfrac12[(-0.5)(1) + (0.5)(2)] = 0.25$."]),
      ex(3, dp("lgr-ex-10", "A weight is $-0.5$. Its feature rises by 2. By what factor do the odds change?", Math.exp(-1), "$e^{2w}$."), ["$e^{-1} \\approx 0.368$: the odds fall to about a third."]),
      ex(3, mc("lgr-ex-11", "Why is logistic regression trained with log-loss instead of squared error?", ["Log-loss is convex in the weights and penalises confident errors heavily", "One minimum, strong gradients."], [["Squared error can't be computed for probabilities", "It can; it just trains badly."], ["Log-loss always gives higher accuracy", "The point is the optimisation, not a guarantee."]]), [
        "With the sigmoid inside, squared error is not convex and its gradient vanishes on confident mistakes; log-loss gives the clean gradient $(p - y)\\vec x$.",
      ]),
    ],
  },

  // §{regularization}
  regularization: {
    definitions: [
      {
        type: "definition",
        term: "regularised least squares",
        body: "**Ridge** minimises $\\text{SSE} + \\lambda\\sum_j w_j^2$ and **lasso** minimises $\\text{SSE} + \\lambda\\sum_j |w_j|$, with $\\lambda \\ge 0$. The intercept is not penalised, and features are standardised first so the penalty treats them alike.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "the ridge solution",
        statement: "$\\vec w = (X^{\\mathsf T}X + \\lambda I)^{-1}X^{\\mathsf T}\\vec y$. For $\\lambda > 0$ the matrix is always invertible, even when features are collinear.",
        proof: [
          "The gradient is $-2X^{\\mathsf T}(\\vec y - X\\vec w) + 2\\lambda\\vec w$; setting it to $\\vec 0$ gives $(X^{\\mathsf T}X + \\lambda I)\\vec w = X^{\\mathsf T}\\vec y$.",
          "$X^{\\mathsf T}X$ has eigenvalues $\\ge 0$; adding $\\lambda I$ raises each by $\\lambda$, so none is 0.",
        ],
      },
      {
        type: "theorem",
        name: "shrinkage of one weight",
        statement: "If the unpenalised least-squares weight is $a$ and the loss in $w$ is $(w - a)^2$ plus a penalty, ridge gives $w = \\dfrac{a}{1 + \\lambda}$ (smaller, never 0), while lasso gives $w = \\operatorname{sign}(a)\\max\\!\\left(|a| - \\tfrac\\lambda2, 0\\right)$: exactly 0 once $|a| \\le \\lambda/2$.",
        proof: [
          "Ridge: $2(w - a) + 2\\lambda w = 0$.",
          "Lasso with $w > 0$: $2(w - a) + \\lambda = 0$ gives $w = a - \\lambda/2$, valid only if positive. Otherwise the kink of $|w|$ at 0 is the minimum.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "weight decay",
        statement: "A gradient step on the ridge objective is $w \\leftarrow (1 - 2\\eta\\lambda)w - \\eta\\nabla\\text{SSE}$: every step first shrinks each weight by a constant factor.",
        proof: ["The penalty's gradient is $2\\lambda w$; collect the terms in $w$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Weights $(3, -4)$ and $\\lambda = 0.5$. Find the ridge and lasso penalties.",
        solution: ["Ridge: $0.5(9 + 16) = 12.5$.", "Lasso: $0.5(3 + 4) = 3.5$."],
        result: "12.5 and 3.5.",
      },
      {
        type: "example",
        level: 2,
        title: "shrink or zero",
        problem: "With $\\lambda = 1$, find the ridge and lasso weights for unpenalised weights $a = 6$ and $a = 0.4$.",
        solution: ["$a = 6$: ridge $6/2 = 3$; lasso $6 - 0.5 = 5.5$.", "$a = 0.4$: ridge $0.2$; lasso 0, since $0.4 \\le 0.5$."],
        result: "Ridge $3$ and $0.2$; lasso $5.5$ and $0$.",
      },
      {
        type: "example",
        level: 3,
        title: "ridge by formula",
        problem: "Fit $\\hat y = wx$ to $(1, 2)$ and $(2, 4)$ by least squares and by ridge with $\\lambda = 5$.",
        solution: ["$\\sum x^2 = 5$ and $\\sum xy = 10$.", "Least squares: $w = 10/5 = 2$. Ridge: $w = \\dfrac{\\sum xy}{\\sum x^2 + \\lambda} = \\dfrac{10}{10} = 1$."],
        result: "2 and 1.",
      },
    ],
    pitfalls: [
      { wrong: "Penalise the intercept and use raw units.", right: "Leave the intercept alone and standardise features, or the penalty depends on the units." },
      { wrong: "Ridge removes useless features.", right: "Ridge shrinks; lasso sets weights exactly to 0." },
      { wrong: "Bigger $\\lambda$ is always safer.", right: "Too large a $\\lambda$ underfits. Choose it by cross-validation (§{cross-validation})." },
    ],
    formulas: [
      { label: "Ridge", tex: "\\vec w = (X^{\\mathsf T}X + \\lambda I)^{-1}X^{\\mathsf T}\\vec y" },
      { label: "One weight, ridge", tex: "w = a/(1 + \\lambda)" },
      { label: "One weight, lasso", tex: "w = \\operatorname{sign}(a)\\max(|a| - \\lambda/2, 0)" },
      { label: "Weight decay", tex: "w \\leftarrow (1 - 2\\eta\\lambda)w - \\eta\\nabla\\text{SSE}" },
    ],
    exercises: [
      ex(1, num("rdg-ex-1", "$\\lambda = 0.1$ and weights $(2, 1, -3)$. Find the ridge penalty.", 1.4, "$0.1 \\times 14$."), ["$0.1(4 + 1 + 9) = 1.4$."]),
      ex(1, num("rdg-ex-2", "$\\lambda = 2$ and weights $(1, -0.5, 0)$. Find the lasso penalty.", 3, "$2 \\times 1.5$."), ["$2(1 + 0.5 + 0) = 3$."]),
      ex(2, num("rdg-ex-3", "One weight with unpenalised value $a = 9$ and ridge $\\lambda = 2$. Find the ridge weight.", 3, "$a/(1 + \\lambda)$."), ["$9/3 = 3$."]),
      ex(2, num("rdg-ex-4", "Same setting with lasso, $a = 3$, $\\lambda = 2$. Find the lasso weight.", 2, "$|a| - \\lambda/2$."), ["$3 - 1 = 2$."]),
      ex(2, num("rdg-ex-5", "Lasso with $a = 0.8$ and $\\lambda = 2$. Find the weight.", 0, "$|a| \\le \\lambda/2$."), ["$0.8 \\le 1$, so the weight is exactly 0."]),
      ex(2, num("rdg-ex-6", "Fit $\\hat y = wx$ by ridge with $\\sum xy = 12$, $\\sum x^2 = 4$ and $\\lambda = 2$.", 2, "$\\sum xy/(\\sum x^2 + \\lambda)$."), ["$12/6 = 2$, against $3$ without the penalty."]),
      ex(3, num("rdg-ex-7", "Weight decay with $\\eta = 0.05$ and $\\lambda = 1$. By what factor is each weight shrunk per step?", 0.9, "$1 - 2\\eta\\lambda$."), ["$1 - 0.1 = 0.9$."]),
      ex(3, vec("rdg-ex-8", "$X^{\\mathsf T}X = \\begin{bmatrix} 4 & 0 \\\\ 0 & 1 \\end{bmatrix}$, $X^{\\mathsf T}\\vec y = (8, 3)$ and $\\lambda = 1$. Find the ridge weights.", [1.6, 1.5], "Solve $(X^{\\mathsf T}X + I)\\vec w = X^{\\mathsf T}\\vec y$."), ["The matrix becomes $\\operatorname{diag}(5, 2)$, so $\\vec w = (8/5, 3/2)$."]),
      ex(3, mc("rdg-ex-9", "Ridge with an enormous $\\lambda$ predicts", ["roughly the mean of $y$ for every input", "All weights shrink to near 0, leaving the intercept."], [["the training data perfectly", "That is $\\lambda = 0$ with enough features."], ["nothing: it fails to fit", "It fits, just a constant."]]), ["As $\\lambda \\to \\infty$ the penalised weights go to 0 and only the unpenalised intercept remains."]),
      ex(3, mc("rdg-ex-10", "Why standardise features before ridge?", ["The penalty would otherwise depend on each feature's units", "Rescaling a feature rescales its weight."], [["Ridge needs normal data", "It doesn't."], ["It makes $X^{\\mathsf T}X$ diagonal", "Standardising does not decorrelate features."]]), ["Measuring a feature in metres instead of millimetres multiplies its weight by 1000 and its penalty by $10^6$."]),
      ex(3, mc("rdg-ex-11", "1000 features, of which perhaps 20 matter. Which penalty fits best?", ["Lasso", "It sets most weights exactly to 0."], [["Ridge", "It keeps all 1000 small but non-zero."], ["No penalty", "Least squares with 1000 features overfits badly."]]), ["Lasso performs feature selection, giving a sparse, interpretable model."]),
    ],
  },

  // §{cross-validation}
  "cross-validation": {
    definitions: [
      {
        type: "definition",
        term: "k-fold estimate",
        body: "Split the data into $k$ folds. For each fold $i$, train on the other $k - 1$ and record the validation error $E_i$ on fold $i$. The **cross-validation estimate** is $\\bar E = \\tfrac1k\\sum E_i$. **Leave-one-out** is $k = n$.",
      },
      {
        type: "definition",
        term: "data leakage",
        body: "**Leakage** is any route by which information from the validation or test data reaches training: preprocessing fitted on all the data, duplicates across splits, or features that are only known after the outcome.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "fold arithmetic",
        statement: "With $n$ rows and $k$ folds, each model trains on $\\tfrac{(k - 1)n}{k}$ rows and is validated on $\\tfrac nk$. Trying $s$ settings costs $sk$ fits, plus one final refit on all the training data.",
        proof: ["Each fold is $\\tfrac1k$ of the data; every setting is fitted once per fold."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "selection makes scores optimistic",
        statement: "The best validation score among many models overstates that model's true performance. That is why the test set is used once, after every choice is made.",
        proof: ["Each validation score is the true score plus noise. Picking the maximum favours models whose noise was positive, so $E[\\max_i \\hat s_i] \\ge \\max_i s_i$. A fresh test set has no selection noise."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "the spread of fold scores",
        statement: "Treat the $k$ fold scores as a sample: $\\text{SE} \\approx s/\\sqrt k$. Two settings whose CV scores differ by much less than about 2 SE are not reliably different.",
        proof: ["This is the standard error of a mean (§{standard-error}). The folds share training data, so it is only an approximation, usually an optimistic one."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "split by the structure of the data",
        statement: "Keep related rows (the same patient, user or household) in the same fold. For time series, train on the past and validate on the future.",
        proof: ["Otherwise the model is validated on near-copies of rows it trained on, or on the past using the future, which deployment never allows."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "5-fold cross-validation on 1000 rows. How many rows does each model train and validate on, and how many models are fitted?",
        solution: ["Each fold has 200 rows.", "Train on 800, validate on 200, five times."],
        result: "800, 200, and 5 fits.",
      },
      {
        type: "example",
        level: 2,
        title: "a grid search",
        problem: "Four values of $\\lambda$ are compared by 5-fold CV, then the winner is refitted on all the training data. How many fits?",
        solution: ["$4 \\times 5 = 20$ fits for the comparison.", "Plus one final refit."],
        result: "21.",
      },
      {
        type: "example",
        level: 3,
        title: "leakage by selection",
        problem: "There are 5000 random features and random labels. Someone picks the 50 features most correlated with the labels using all the data, then cross-validates. What happens?",
        solution: [
          "By chance some of 5000 features correlate with the labels in this sample. Choosing them used the validation rows' labels.",
          "CV then reports far better than 50% accuracy on pure noise. Done correctly, the selection is repeated inside each fold on training rows only, and accuracy falls to about 50%.",
        ],
        result: "A badly optimistic score from leakage.",
      },
      {
        type: "example",
        level: 3,
        title: "how sure is the CV score",
        problem: "Fold accuracies are $0.80, 0.84, 0.82, 0.86, 0.78$. Find the CV estimate and its approximate SE.",
        solution: [
          "Mean 0.82; deviations $-0.02, 0.02, 0, 0.04, -0.04$ give $s^2 = 0.004/4 = 0.001$.",
          "$\\text{SE} \\approx \\sqrt{0.001}/\\sqrt5 \\approx 0.014$.",
        ],
        result: "$0.82 \\pm 0.014$.",
      },
    ],
    pitfalls: [
      { wrong: "Tune hyperparameters on the test set.", right: "Tune on validation folds; the test set is touched once, at the end." },
      { wrong: "Standardise all the data, then split.", right: "Fit the scaler on each training fold only, then apply it to that fold's validation rows." },
      { wrong: "Shuffle a time series into random folds.", right: "Use forward-chaining splits: train on earlier data, validate on later." },
    ],
    formulas: [
      { label: "CV estimate", tex: "\\bar E = \\tfrac1k\\textstyle\\sum_i E_i" },
      { label: "Training rows", tex: "\\tfrac{(k - 1)n}{k}" },
      { label: "Fits", tex: "s \\times k\\ (+1)" },
      { label: "Spread", tex: "\\text{SE} \\approx s/\\sqrt k" },
    ],
    exercises: [
      ex(1, num("xvl-ex-1", "10-fold CV on 2000 rows. How many rows does each model train on?", 1800, "9 folds of 200."), ["$9 \\times 200 = 1800$."]),
      ex(1, num("xvl-ex-2", "Leave-one-out CV on 50 rows. How many models are fitted?", 50, "$k = n$."), ["One per row: 50."]),
      ex(2, num("xvl-ex-3", "A grid of 3 learning rates and 4 values of $\\lambda$ is searched with 5-fold CV. How many fits, before the final refit?", 60, "$12 \\times 5$."), ["$3 \\times 4 = 12$ settings, times 5 folds."]),
      ex(2, num("xvl-ex-4", "Fold errors are $0.2, 0.25, 0.15, 0.2$. Find the CV estimate.", 0.2, "Average."), ["$0.8/4 = 0.2$."]),
      ex(2, num("xvl-ex-5", "5000 rows are split 60/20/20 into train, validation and test. How many validation rows?", 1000, "20%."), ["$0.2 \\times 5000 = 1000$."]),
      ex(3, dp("xvl-ex-6", "Fold accuracies $0.80, 0.84, 0.82, 0.86, 0.78$. Find the approximate SE of the CV estimate.", Math.sqrt(0.001 / 5), "$s/\\sqrt k$."), ["$s^2 = 0.001$, so $\\text{SE} = \\sqrt{0.001/5} \\approx 0.014$."]),
      ex(3, mc("xvl-ex-7", "A dataset has several scans from each patient. How should folds be made?", ["By patient, so each patient's scans stay together", "Otherwise the model sees near-copies."], [["By scan, at random", "Scans of the same patient would sit on both sides."], ["By scan date", "Dates don't stop one patient appearing in two folds."]]), ["Group-wise splitting measures how the model does on new patients, which is the real task."]),
      ex(3, mc("xvl-ex-8", "Features are standardised using the whole dataset before 5-fold CV. The CV score is", ["slightly optimistic, from leakage", "Validation rows influenced the scaling."], [["unbiased", "The scaler saw the validation data."], ["pessimistic", "Leakage makes scores look better, not worse."]]), ["Put the scaler inside the pipeline so it is refitted on each training fold."]),
      ex(3, mc("xvl-ex-9", "Forecasting next month's sales from past months. Validation should", ["train on earlier months and validate on later ones", "Deployment only ever has the past."], [["use random 5-fold CV", "That trains on the future."], ["use the test set to choose the model", "The test set is for the final estimate."]]), ["Forward-chaining (rolling-origin) splits respect time order."]),
      ex(3, mc("xvl-ex-10", "Fifty models are tried and the best scores 0.91 on validation. Its test score will most likely be", ["somewhat lower than 0.91", "The best of 50 noisy scores is optimistic."], [["exactly 0.91", "Selection adds optimistic noise."], ["higher than 0.91", "On average the winner's luck doesn't repeat."]]), ["The maximum of many noisy estimates overstates the winner's true performance."]),
    ],
  },

  // §{bias-variance}
  "bias-variance": {
    definitions: [
      {
        type: "definition",
        term: "bias, variance, noise",
        body: "Imagine retraining on many fresh training sets. At an input $x$ with true value $f(x)$ and prediction $\\hat f(x)$: **bias** $= E[\\hat f(x)] - f(x)$, **variance** $= E\\big[(\\hat f(x) - E[\\hat f(x)])^2\\big]$, and **noise** $\\sigma^2$ is the variance of $y$ about $f(x)$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "the decomposition",
        statement: "$E\\big[(y - \\hat f(x))^2\\big] = \\text{bias}^2 + \\text{variance} + \\sigma^2$.",
        proof: [
          "Write $y - \\hat f = (y - f) + (f - E\\hat f) + (E\\hat f - \\hat f)$.",
          "Square and take expectations. The noise $y - f$ is independent of the training set and has mean 0, and $E\\hat f - \\hat f$ has mean 0, so every cross term vanishes, leaving $\\sigma^2 + \\text{bias}^2 + \\text{variance}$.",
        ],
      },
      {
        type: "theorem",
        name: "averaging models",
        statement: "Averaging $m$ models with the same bias and variance $v$ leaves the bias unchanged. If their errors have pairwise correlation $\\rho$, the variance becomes $\\rho v + \\dfrac{(1 - \\rho)v}{m}$; for independent models, $v/m$.",
        proof: ["$\\operatorname{Var}\\left(\\tfrac1m\\sum\\hat f_i\\right) = \\tfrac{1}{m^2}\\left(mv + m(m - 1)\\rho v\\right)$ by the variance-of-a-sum rule (§{covariance}). Simplify."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "a biased estimator can win",
        statement: "Estimating $\\mu$ by $c\\bar X$ has bias $(c - 1)\\mu$ and variance $c^2\\sigma^2/n$. For suitable $c < 1$ its mean squared error is below that of the unbiased $\\bar X$. Ridge works the same way.",
        proof: ["MSE $= (c - 1)^2\\mu^2 + c^2\\sigma^2/n$. At $c = 1$ its derivative in $c$ is $2\\sigma^2/n > 0$, so lowering $c$ slightly reduces it."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "reading learning curves",
        statement: "High variance: training error low, validation error high, and the gap narrows as data is added. High bias: both errors high and close, and more data barely helps.",
        proof: ["More data averages away the quirks a flexible model latches onto, cutting variance; it cannot make a too-simple model more flexible."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A model has bias 2, variance 3 and noise variance 1 at a point. Find its expected squared error.",
        solution: ["$\\text{bias}^2 = 4$.", "$4 + 3 + 1 = 8$."],
        result: "8.",
      },
      {
        type: "example",
        level: 2,
        title: "ensembles",
        problem: "Ten models each have variance 4. Find the variance of their average if they are independent, and if their errors have correlation 0.5.",
        solution: ["Independent: $4/10 = 0.4$.", "Correlated: $0.5 \\times 4 + \\dfrac{0.5 \\times 4}{10} = 2 + 0.2 = 2.2$. Correlation sets a floor; random forests decorrelate trees to lower it."],
        result: "0.4 and 2.2.",
      },
      {
        type: "example",
        level: 3,
        title: "shrinking an estimate",
        problem: "$\\mu = 2$ and $\\operatorname{Var}(\\bar X) = 1$. Compare the MSE of $\\bar X$ with that of $0.8\\bar X$.",
        solution: ["$\\bar X$: bias 0, MSE $= 1$.", "$0.8\\bar X$: bias $-0.4$, variance $0.64$, MSE $= 0.16 + 0.64 = 0.80$."],
        result: "The biased estimate has the smaller error, 0.80 against 1.",
      },
    ],
    pitfalls: [
      { wrong: "More data cures any model.", right: "It reduces variance. A high-bias model needs more flexibility or better features." },
      { wrong: "Bias only shows up on the training data.", right: "Bias is a systematic error that appears on training and test data alike." },
      { wrong: "Unbiased is always best.", right: "A little bias can buy a large drop in variance and a lower total error." },
    ],
    formulas: [
      { label: "Decomposition", tex: "\\text{bias}^2 + \\text{variance} + \\sigma^2" },
      { label: "Average of m", tex: "\\rho v + (1 - \\rho)v/m" },
      { label: "Estimator MSE", tex: "\\text{bias}^2 + \\text{variance}" },
    ],
    exercises: [
      ex(1, num("bvt-ex-1", "$\\text{bias}^2 = 1$, variance 2 and noise 0.5. Find the expected squared error.", 3.5, "Add them."), ["$1 + 2 + 0.5 = 3.5$."]),
      ex(1, num("bvt-ex-2", "A model's bias at a point is $-3$. What does it contribute to the error?", 9, "$\\text{bias}^2$."), ["$(-3)^2 = 9$."]),
      ex(2, num("bvt-ex-3", "Five independent models each have variance 10. Find the variance of their average.", 2, "$v/m$."), ["$10/5 = 2$."]),
      ex(2, num("bvt-ex-4", "Same five models, but with error correlation 0.2. Find the variance of the average.", 3.6, "$\\rho v + (1 - \\rho)v/m$."), ["$0.2 \\times 10 + 0.8 \\times 10/5 = 2 + 1.6 = 3.6$."]),
      ex(2, mc("bvt-ex-5", "Training error is low, validation error is high, and the gap narrows as data is added. The model has", ["high variance; more data will help", "The classic overfitting curve."], [["high bias", "Then both errors would be high."], ["no problem", "The gap is the problem."]]), ["A narrowing gap is variance being averaged away."]),
      ex(3, num("bvt-ex-6", "Estimating $\\mu = 5$ by $0.9\\bar X$ with $\\operatorname{Var}(\\bar X) = 2$. Find its MSE.", 1.87, "Bias $-0.5$."), ["$\\text{bias}^2 = 0.25$ and variance $0.81 \\times 2 = 1.62$: total 1.87."]),
      ex(3, num("bvt-ex-7", "Expected error 10, noise 2 and variance 5. Find $\\text{bias}^2$.", 3, "Subtract."), ["$10 - 2 - 5 = 3$."]),
      ex(3, mc("bvt-ex-8", "Raising a polynomial model's degree usually", ["lowers bias and raises variance", "More flexibility fits more, including noise."], [["raises both", "Flexibility reduces systematic error."], ["lowers both", "Variance grows with flexibility."]]), ["Each extra degree lets the curve bend more: closer on average, but more sensitive to the sample."]),
      ex(3, mc("bvt-ex-9", "Which reduces variance without changing bias?", ["Averaging models trained on resampled data", "Averaging keeps the mean prediction."], [["Adding features", "That typically lowers bias and raises variance."], ["Using a simpler model", "That raises bias."]]), ["Bagging averages away variance; the average has the same expectation as each model."]),
      ex(3, num("bvt-ex-10", "Models have variance 10 and error correlation 0.3. What is the smallest variance their average can reach, however many are used?", 3, "$m \\to \\infty$."), ["$\\rho v + (1 - \\rho)v/m \\to \\rho v = 3$."]),
    ],
  },

  // §{precision-recall}
  "precision-recall": {
    definitions: [
      {
        type: "definition",
        term: "confusion matrix",
        body: "Counts of **TP** (flagged, positive), **FP** (flagged, negative), **FN** (missed positive) and **TN**. Accuracy $= \\tfrac{\\text{TP} + \\text{TN}}{N}$, **specificity** $= \\tfrac{\\text{TN}}{\\text{TN} + \\text{FP}}$, and the **false positive rate** is $1 - $ specificity.",
      },
      {
        type: "definition",
        term: "F-beta",
        body: "$F_\\beta = \\dfrac{(1 + \\beta^2)PR}{\\beta^2P + R}$ weighs recall $\\beta$ times as heavily as precision. $F_1$ is the balanced case; $F_2$ favours recall.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "F1 is a harmonic mean",
        statement: "$F_1 = \\dfrac{2PR}{P + R} = \\dfrac{2\\,\\text{TP}}{2\\,\\text{TP} + \\text{FP} + \\text{FN}}$. It lies between $P$ and $R$, nearer the smaller, and never exceeds their average.",
        proof: [
          "$\\dfrac{2}{F_1} = \\dfrac1P + \\dfrac1R = \\dfrac{\\text{TP} + \\text{FP}}{\\text{TP}} + \\dfrac{\\text{TP} + \\text{FN}}{\\text{TP}}$.",
          "$\\tfrac{P + R}{2} - \\tfrac{2PR}{P + R} = \\tfrac{(P - R)^2}{2(P + R)} \\ge 0$.",
        ],
      },
      {
        type: "theorem",
        name: "precision depends on prevalence",
        statement: "If a fraction $\\pi$ of cases are positive, $\\text{precision} = \\dfrac{R\\pi}{R\\pi + \\text{FPR}(1 - \\pi)}$. The same classifier has lower precision when positives are rarer.",
        proof: ["Precision is $P(\\text{positive} \\mid \\text{flagged})$. Bayes' rule (§{bayes}) with $P(\\text{flagged} \\mid \\text{positive}) = R$ and $P(\\text{flagged} \\mid \\text{negative}) = \\text{FPR}$."],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "the accuracy trap",
        statement: "With prevalence $\\pi$, a classifier that flags nothing has accuracy $1 - \\pi$ and recall 0.",
        proof: ["It gets every negative right and every positive wrong."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "TP = 40, FP = 10, FN = 20, TN = 930. Find accuracy, precision, recall and F1.",
        solution: ["Accuracy $970/1000 = 0.97$. Precision $40/50 = 0.8$. Recall $40/60 \\approx 0.667$.", "$F_1 = \\dfrac{80}{80 + 30} \\approx 0.727$."],
        result: "0.97, 0.8, 0.667, 0.727.",
      },
      {
        type: "example",
        level: 2,
        title: "rare positives",
        problem: "A test has recall 0.9 and false positive rate 0.05. Find its precision when 1% of people have the condition.",
        solution: ["$\\dfrac{0.9 \\times 0.01}{0.9 \\times 0.01 + 0.05 \\times 0.99} = \\dfrac{0.009}{0.009 + 0.0495}$.", "$= 0.009/0.0585 \\approx 0.154$."],
        result: "About 15%: most alarms are false.",
      },
      {
        type: "example",
        level: 3,
        title: "favouring recall",
        problem: "$P = 0.5$ and $R = 0.8$. Compare $F_1$ and $F_2$.",
        solution: ["$F_1 = \\dfrac{2(0.4)}{1.3} \\approx 0.615$.", "$F_2 = \\dfrac{5(0.4)}{4(0.5) + 0.8} = \\dfrac{2}{2.8} \\approx 0.714$: higher, because the good recall counts more."],
        result: "$F_1 \\approx 0.615$, $F_2 \\approx 0.714$.",
      },
    ],
    pitfalls: [
      { wrong: "97% accuracy means a good detector.", right: "With 3% positives, flagging nothing scores 97%. Check recall and precision." },
      { wrong: "Precision is the fraction of positives found.", right: "That is recall. Precision is the fraction of flags that are right." },
      { wrong: "$F_1 = \\tfrac{P + R}{2}$.", right: "It is the harmonic mean, dragged down by the weaker of the two." },
    ],
    formulas: [
      { label: "Precision, recall", tex: "\\tfrac{\\text{TP}}{\\text{TP} + \\text{FP}},\\quad \\tfrac{\\text{TP}}{\\text{TP} + \\text{FN}}" },
      { label: "F1", tex: "\\dfrac{2\\,\\text{TP}}{2\\,\\text{TP} + \\text{FP} + \\text{FN}}" },
      { label: "F-beta", tex: "\\dfrac{(1 + \\beta^2)PR}{\\beta^2P + R}" },
      { label: "Prevalence", tex: "P = \\dfrac{R\\pi}{R\\pi + \\text{FPR}(1 - \\pi)}" },
    ],
    exercises: [
      ex(1, num("prc-ex-1", "TP = 45 and FP = 5. Find the precision.", 0.9, "$45/50$."), ["$45/50 = 0.9$."]),
      ex(1, num("prc-ex-2", "TP = 45 and FN = 15. Find the recall.", 0.75, "$45/60$."), ["$45/60 = 0.75$."]),
      ex(2, fr("prc-ex-3", "TP = 40, FP = 10, FN = 20. Find $F_1$.", 8 / 11, "$2\\text{TP}/(2\\text{TP} + \\text{FP} + \\text{FN})$."), ["$\\dfrac{80}{80 + 10 + 20} = \\dfrac{8}{11} \\approx 0.727$."]),
      ex(2, num("prc-ex-4", "TP = 40, FP = 10, FN = 20, TN = 930. Find the accuracy.", 0.97, "$970/1000$."), ["$(40 + 930)/1000 = 0.97$."]),
      ex(2, dp("prc-ex-5", "TN = 930 and FP = 10. Find the specificity.", 930 / 940, "$\\text{TN}/(\\text{TN} + \\text{FP})$."), ["$930/940 \\approx 0.989$."]),
      ex(2, num("prc-ex-6", "2% of transactions are fraud. Find the accuracy of a model that never flags anything.", 0.98, "$1 - \\pi$."), ["It is right on all 98% legitimate cases."]),
      ex(3, dp("prc-ex-7", "Recall 0.9, false positive rate 0.05, prevalence 0.01. Find the precision.", 0.009 / 0.0585, "Bayes."), ["$\\dfrac{0.009}{0.009 + 0.0495} \\approx 0.154$."]),
      ex(3, dp("prc-ex-8", "$P = 0.5$ and $R = 0.8$. Find $F_2$.", 2 / 2.8, "$\\beta = 2$."), ["$\\dfrac{5 \\times 0.4}{4 \\times 0.5 + 0.8} = \\dfrac{2}{2.8} \\approx 0.714$."]),
      ex(3, fr("prc-ex-9", "$P = 1$ and $R = 0.5$. Find $F_1$.", 2 / 3, "Harmonic mean."), ["$\\dfrac{2 \\times 0.5}{1.5} = \\dfrac23$, below the average 0.75."]),
      ex(3, mc("prc-ex-10", "Raising a classifier's threshold usually makes", ["precision rise and recall fall", "Fewer, surer flags."], [["both rise", "Fewer flags also means more misses."], ["recall rise", "Flagging less cannot find more positives."]]), ["A higher threshold flags only the most confident cases: fewer false alarms, more misses."]),
    ],
  },

  // §{roc-auc}
  "roc-auc": {
    definitions: [
      {
        type: "definition",
        term: "ROC curve",
        body: "For each threshold $t$, flag cases with score $\\ge t$ and plot the point $(\\text{FPR}, \\text{TPR})$, where TPR is recall. Sweeping $t$ from above every score to below every score traces a curve from $(0, 0)$ to $(1, 1)$.",
      },
      {
        type: "definition",
        term: "AUC",
        body: "The **AUC** is the area under the ROC curve. It equals the probability that a randomly chosen positive scores higher than a randomly chosen negative, counting ties as one half.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "AUC counts correctly ordered pairs",
        statement: "With $P$ positives and $N$ negatives, $\\text{AUC} = \\dfrac{\\#\\{\\text{(pos, neg) pairs with pos scored higher}\\} + \\tfrac12\\#\\{\\text{ties}\\}}{PN}$.",
        proof: [
          "Lower the threshold one case at a time. A positive moves the curve up by $1/P$; a negative moves it right by $1/N$.",
          "Each rightward step for a negative adds a strip of height equal to the fraction of positives already above it. Summing the strips counts the correctly ordered pairs, divided by $PN$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "only the ranking matters",
        statement: "AUC is unchanged by any increasing transformation of the scores, and reversing the scores turns AUC into $1 - \\text{AUC}$. Random scores give the diagonal, AUC 0.5.",
        proof: ["An increasing transformation keeps every pairwise order, so the count is the same. Reversing swaps correct and incorrect pairs."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "choosing a threshold",
        statement: "AUC compares rankings; deployment needs one threshold. Choose the point on the ROC curve that minimises the expected cost $c_{\\text{FP}}\\cdot\\text{FP} + c_{\\text{FN}}\\cdot\\text{FN}$.",
        proof: ["Each threshold fixes FP and FN; the costs decide which mix is best."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Positives score $0.9, 0.8, 0.4$ and negatives $0.7, 0.3, 0.2$. Find the AUC.",
        solution: ["0.9 and 0.8 beat all three negatives: 6 pairs. 0.4 beats 0.3 and 0.2 but not 0.7: 2 pairs.", "$8$ of $3 \\times 3 = 9$ pairs are correctly ordered."],
        result: "$\\tfrac89 \\approx 0.889$.",
      },
      {
        type: "example",
        level: 2,
        title: "points on the curve",
        problem: "Same scores. Find $(\\text{FPR}, \\text{TPR})$ at thresholds 0.75, 0.5 and 0.35.",
        solution: ["$t = 0.75$: flags 0.9, 0.8: $(0, \\tfrac23)$.", "$t = 0.5$: also 0.7, a negative: $(\\tfrac13, \\tfrac23)$.", "$t = 0.35$: also 0.4: $(\\tfrac13, 1)$."],
        result: "$(0, \\tfrac23)$, $(\\tfrac13, \\tfrac23)$, $(\\tfrac13, 1)$.",
      },
      {
        type: "example",
        level: 3,
        title: "picking the threshold",
        problem: "A missed case costs 10 and a false alarm costs 1. Threshold A gives TP 80, FP 100, FN 20; threshold B gives TP 60, FP 30, FN 40. Which is cheaper?",
        solution: ["A: $100 \\times 1 + 20 \\times 10 = 300$.", "B: $30 \\times 1 + 40 \\times 10 = 430$."],
        result: "A, at cost 300.",
      },
    ],
    pitfalls: [
      { wrong: "An AUC of 0.3 is useless.", right: "It ranks backwards consistently; reversing the scores gives 0.7." },
      { wrong: "AUC depends on the chosen threshold.", right: "It summarises every threshold at once; it measures ranking only." },
      { wrong: "A high AUC guarantees good precision.", right: "With very rare positives, even a small FPR swamps the true positives. Check the precision–recall curve." },
    ],
    formulas: [
      { label: "Rates", tex: "\\text{TPR} = \\tfrac{\\text{TP}}{P},\\quad \\text{FPR} = \\tfrac{\\text{FP}}{N}" },
      { label: "AUC", tex: "\\dfrac{\\#\\text{correct pairs} + \\tfrac12\\#\\text{ties}}{PN}" },
      { label: "Reversed", tex: "1 - \\text{AUC}" },
      { label: "Cost", tex: "c_{\\text{FP}}\\,\\text{FP} + c_{\\text{FN}}\\,\\text{FN}" },
    ],
    exercises: [
      ex(1, num("rca-ex-1", "Every positive scores above every negative. Find the AUC.", 1, "All pairs correct."), ["All $PN$ pairs are correctly ordered."]),
      ex(1, num("rca-ex-2", "Scores are assigned at random. What AUC do you expect?", 0.5, "Coin flips."), ["Each pair is equally likely to be in either order."]),
      ex(2, fr("rca-ex-3", "Positives score $0.9, 0.6$; negatives $0.7, 0.2$. Find the AUC.", 3 / 4, "Count pairs."), ["0.9 beats both; 0.6 beats 0.2 but not 0.7.", "$3$ of $4$ pairs: $\\tfrac34$."]),
      ex(2, num("rca-ex-4", "A classifier has AUC 0.3. Find the AUC after reversing its scores.", 0.7, "$1 - \\text{AUC}$."), ["$1 - 0.3 = 0.7$."]),
      ex(2, fr("rca-ex-5", "Positives score $0.9, 0.8, 0.4$ and negatives $0.7, 0.3, 0.2$. Find the TPR at threshold 0.5.", 2 / 3, "Positives at or above 0.5."), ["0.9 and 0.8: $\\tfrac23$."]),
      ex(2, fr("rca-ex-6", "Same scores. Find the FPR at threshold 0.5.", 1 / 3, "Negatives at or above 0.5."), ["Only 0.7: $\\tfrac13$."]),
      ex(3, fr("rca-ex-7", "Positives score $0.8, 0.5$; negatives $0.5, 0.1$. Find the AUC, counting ties as a half.", 7 / 8, "One tie."), ["0.8 beats both (2). 0.5 ties 0.5 ($\\tfrac12$) and beats 0.1 (1).", "$3.5/4 = \\tfrac78$."]),
      ex(3, num("rca-ex-8", "A miss costs 10 and a false alarm 1. A threshold gives FP = 100 and FN = 20. Find the total cost.", 300, "$c_{\\text{FP}}\\text{FP} + c_{\\text{FN}}\\text{FN}$."), ["$100 + 200 = 300$."]),
      ex(3, mc("rca-ex-9", "All scores are positive and you replace each by its square. The AUC", ["stays the same", "Squaring positive numbers keeps their order."], [["rises", "No pair changes order."], ["falls", "No pair changes order."]]), ["AUC depends only on the ranking, which an increasing transformation preserves."]),
      ex(3, mc("rca-ex-10", "A disease affects 0.1% of people. A model with AUC 0.95 is deployed. What should you also check?", ["Precision at the chosen threshold", "Rare positives can make most alarms false."], [["Nothing: AUC 0.95 is excellent", "AUC ignores prevalence."], ["Accuracy", "Accuracy is 99.9% for a model that flags nobody."]]), ["With 999 negatives per positive, even a 2% FPR gives about 20 false alarms per real case."]),
    ],
  },
};
