import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Standard errors, t-tests and intervals for coefficients; the ANOVA table and F-test; mean-response and prediction intervals. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "regression-inference",
  title: "Inference for regression",
  summary: "Least-squares coefficients are estimates with standard errors. With independent normal errors of constant variance, (b − β)/SE(b) follows t on n − k − 1 degrees of freedom, giving tests and intervals for each coefficient. The ANOVA table's F-test asks whether the predictors explain anything at all, and a prediction interval for a new y adds the error variance.",
  deps: ["least-squares", "multiple-regression", "t-tests", "sampling-distributions"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "residual standard error", meaning: "$s = \\sqrt{\\text{SSE}/(n - k - 1)}$, the typical size of a residual." },
    { term: "ANOVA table", meaning: "The split of total variation into the part explained by the model and the residual part, with degrees of freedom and mean squares." },
    { term: "mean response", meaning: "The average $y$ at a given $x$, as opposed to one new observation at that $x$." },
  ],
  misconceptions: {
    "slope-significant-strong": "Thinks a statistically significant slope means the relationship is strong or that R² is high.",
    "ci-mean-vs-new-y": "Uses the confidence interval for the mean response where a prediction interval for one new y is needed.",
  },
  steps: [
    {
      type: "motivate",
      title: "Is the slope real?",
      body: "A line fitted to 12 points has slope 0.8. A different 12 points would have given a different slope. Its standard error says by how much, and whether a true slope of 0 could plausibly have produced 0.8.",
      realWorld: {
        title: "Price sensitivity",
        body: "Economists estimating how demand responds to price report the slope with its interval: −1.2 (95% CI −1.8 to −0.6) says demand is clearly price-sensitive, and by roughly how much.",
      },
    },
    {
      type: "truth",
      statement: "For $y = \\beta_0 + \\beta_1x + \\varepsilon$ with residual standard error $s = \\sqrt{\\text{SSE}/(n - 2)}$: $\\text{SE}(b_1) = \\dfrac{s}{\\sqrt{S_{xx}}}$ with $S_{xx} = \\sum(x_i - \\bar x)^2$, and $\\dfrac{b_1 - \\beta_1}{\\text{SE}(b_1)} \\sim t_{n-2}$. With $k$ predictors the degrees of freedom are $n - k - 1$, and the **overall F-test** uses $F = \\dfrac{\\text{SSR}/k}{\\text{SSE}/(n - k - 1)}$.",
      body: "At a new $x_0$, the **mean response** has SE $s\\sqrt{\\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}}$, while a **new observation** has SE $s\\sqrt{1 + \\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}}$, which includes the error term itself. Both widen as $x_0$ moves away from $\\bar x$.",
    },
    {
      type: "predict",
      misconception: "slope-significant-strong",
      item: {
        kind: "mc",
        id: "rgi-predict-1",
        prompt: "With $n = 10{,}000$, a slope has $p < 0.0001$ and $R^2 = 0.01$. The relationship is",
        options: [
          { id: "a", text: "real but weak: $x$ explains 1% of the variation in $y$", correct: true, why: "Both facts hold at once." },
          { id: "b", text: "strong, because the slope is highly significant", misconception: "slope-significant-strong", why: "Large samples make tiny slopes significant." },
          { id: "c", text: "spurious, because $R^2$ is small", why: "A small $R^2$ doesn't make the slope unreal." },
        ],
      },
      reveal: {
        body: "Significance says whether the slope can be told apart from 0, and with 10,000 points even a tiny slope can be. $R^2 = 0.01$ says predictions from $x$ barely beat predicting $\\bar y$ for everyone. A drug can have a certain but tiny effect; report the slope with its interval as well as the p-value.",
      },
      resolve: {
        kind: "mc",
        id: "rgi-resolve-1",
        prompt: "What do a slope's p-value and the model's $R^2$ tell you?",
        options: [
          { id: "a", text: "Whether the slope is distinguishable from 0; how much variation the model explains", correct: true, why: "Different questions." },
          { id: "b", text: "The same thing: a significant slope means a strong relationship", misconception: "slope-significant-strong", why: "Significance grows with $n$; strength doesn't." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgi-check-1",
        prompt: "A regression of price on size gives a 95% interval for the mean price of 1,500 sq ft houses of ₹48–52 lakh. A buyer wants a range for one particular 1,500 sq ft house. That range is",
        options: [
          { id: "a", text: "much wider: it must include the scatter of individual houses", correct: true, why: "Use the prediction interval." },
          { id: "b", text: "₹48–52 lakh", misconception: "ci-mean-vs-new-y", why: "That locates the average, not one house." },
          { id: "c", text: "narrower", why: "One house is less predictable than the average." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rgi-check-2",
        prompt: "$b_1 = 2.4$ with $\\text{SE} = 0.8$ from $n = 20$. Find $t$ for $H_0: \\beta_1 = 0$.",
        options: [
          { id: "a", text: "3", correct: true, why: "$2.4/0.8$, on 18 d.f." },
          { id: "b", text: "1.92", why: "That multiplies instead of dividing." },
          { id: "c", text: "0.33", why: "That divides the wrong way." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "statsmodels' OLS summary prints exactly these: each coefficient's SE, $t$ and p-value, the F-statistic and the residual standard error. scikit-learn leaves them out because it is built for prediction; with many correlated features, individual coefficient tests become unstable even when predictions are good (§{multiple-regression}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rgi-produce-1", prompt: "$b_1 = 1.5$ with SE 0.5. Find $t$.", answer: 3, explain: "$1.5/0.5$." },
        { kind: "number", id: "rgi-produce-2", prompt: "A simple regression on $n = 20$ points has SSE 72. Find the residual standard error.", answer: 2, explain: "$\\sqrt{72/18}$." },
        {
          kind: "mc",
          id: "rgi-produce-4",
          prompt: "To give a range for the weight of one particular 170 cm person from a height–weight regression, use",
          options: [
            { id: "a", text: "the prediction interval at 170 cm", correct: true, why: "It includes the scatter of individuals." },
            { id: "b", text: "the confidence interval for the mean weight at 170 cm", misconception: "ci-mean-vs-new-y", why: "That is about the average person of that height." },
          ],
        },
        {
          kind: "mc",
          id: "rgi-produce-3",
          prompt: "A tiny slope is significant at $p < 0.001$ in a sample of a million. This shows",
          options: [
            { id: "a", text: "the slope is not zero, not that it matters", correct: true, why: "Check its size and $R^2$." },
            { id: "b", text: "a strong relationship", misconception: "slope-significant-strong", why: "With huge $n$ almost anything is significant." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rgi-review-1", prompt: "SSR = 60 and SSE = 40 with $k = 2$ predictors and $n = 23$. Find $F$.", answer: 15, explain: "$(60/2)/(40/20)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the ANOVA table",
      body: "$\\text{SST} = \\text{SSR} + \\text{SSE}$ with degrees of freedom $n - 1 = k + (n - k - 1)$. Mean squares are $\\text{MSR} = \\text{SSR}/k$ and $\\text{MSE} = \\text{SSE}/(n - k - 1) = s^2$, and $F = \\text{MSR}/\\text{MSE}$ tests $H_0$: all slopes are 0.",
    },
    {
      type: "definition",
      term: "coefficient covariance",
      body: "In matrix form, the coefficients have estimated covariance matrix $s^2(X^{\\mathsf T}X)^{-1}$; the square roots of its diagonal are the coefficients' standard errors, and a 95% interval for $\\beta_j$ is $b_j \\pm t^*_{n-k-1}\\text{SE}(b_j)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the slope's standard error",
      statement: "$\\operatorname{Var}(b_1) = \\dfrac{\\sigma^2}{S_{xx}}$, so $\\text{SE}(b_1) = s/\\sqrt{S_{xx}}$. Slopes are estimated more precisely with more points, less noise, or more spread in $x$.",
      proof: ["$b_1 = \\sum\\dfrac{(x_i - \\bar x)}{S_{xx}}y_i$ is a weighted sum of independent $y_i$, each with variance $\\sigma^2$; the weights' squares add to $1/S_{xx}$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "F, R² and t",
      statement: "$F = \\dfrac{R^2/k}{(1 - R^2)/(n - k - 1)}$. In simple regression $F = t^2$ for the slope.",
      proof: ["Divide SSR and SSE by SST to replace them by $R^2$ and $1 - R^2$. With one predictor, $\\text{SSR} = b_1^2S_{xx}$, so $F = b_1^2S_{xx}/s^2 = t^2$."],
    },
    {
      type: "theorem",
      name: "intervals at a new x",
      statement: "A 95% interval for the mean response at $x_0$ is $\\hat y_0 \\pm t^*s\\sqrt{\\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}}$; a 95% prediction interval for one new $y$ is $\\hat y_0 \\pm t^*s\\sqrt{1 + \\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}}$.",
      proof: ["$\\hat y_0 = \\bar y + b_1(x_0 - \\bar x)$, and $\\bar y$ and $b_1$ are uncorrelated, so $\\operatorname{Var}(\\hat y_0) = \\sigma^2\\left(\\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}\\right)$. A new $y$ adds its own independent error, variance $\\sigma^2$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$b_1 = 0.8$ with SE 0.25 from 12 points. Test $H_0: \\beta_1 = 0$ at 5% (cut-off 2.228 for 10 d.f.).",
      solution: ["$t = 0.8/0.25 = 3.2$ on $n - 2 = 10$ d.f.", "$3.2 > 2.228$: reject."],
      result: "$t = 3.2$: significant.",
    },
    {
      type: "example",
      level: 2,
      title: "the slope's SE from data",
      problem: "$x = 1, 2, 3, 4, 5$, $b_1 = 1.2$ and SSE = 3. Find SE($b_1$) and $t$, with cut-off 3.182 for 3 d.f.",
      solution: ["$S_{xx} = 10$ and $s = \\sqrt{3/3} = 1$, so $\\text{SE} = 1/\\sqrt{10} \\approx 0.316$.", "$t = 1.2/0.316 \\approx 3.79 > 3.182$."],
      result: "SE ≈ 0.316, $t \\approx 3.79$: significant.",
    },
    {
      type: "example",
      level: 2,
      title: "F from R²",
      problem: "A model with 3 predictors on 34 observations has $R^2 = 0.6$. Find $F$.",
      solution: ["$F = \\dfrac{0.6/3}{0.4/30}$.", "$= 0.2/0.0133 = 15$, on (3, 30) d.f."],
      result: "$F = 15$.",
    },
    {
      type: "example",
      level: 3,
      title: "mean against new value",
      problem: "$s = 2$, $n = 20$, $\\bar x = 10$, $S_{xx} = 250$ and $t^*_{18} = 2.101$. Find the half-widths of the 95% intervals for the mean response and for a new $y$ at $x_0 = 15$.",
      solution: [
        "Mean: $2\\sqrt{0.05 + 25/250} = 2\\sqrt{0.15} \\approx 0.775$, times 2.101 gives 1.63.",
        "New $y$: $2\\sqrt{1.15} \\approx 2.145$, times 2.101 gives 4.51.",
      ],
      result: "About 1.63 and 4.51.",
    },
  ],
  pitfalls: [
    { wrong: "A significant slope means a strong relationship.", right: "It means the slope isn't zero; $R^2$ and the slope's size say how strong." },
    { wrong: "Use the interval for the mean response to predict one value.", right: "Use the prediction interval, which includes the error variance." },
    { wrong: "Trust the intervals far outside the range of the data.", right: "Their formulas assume the model holds there too; extrapolation adds risk the intervals don't show." },
  ],
  formulas: [
    { label: "Slope SE", tex: "\\text{SE}(b_1) = s/\\sqrt{S_{xx}}" },
    { label: "t-test", tex: "t = (b_j - \\beta_j)/\\text{SE}(b_j),\\ n - k - 1\\ \\text{d.f.}" },
    { label: "F-test", tex: "F = \\dfrac{\\text{SSR}/k}{\\text{SSE}/(n - k - 1)} = \\dfrac{R^2/k}{(1 - R^2)/(n - k - 1)}" },
    { label: "Prediction SE", tex: "s\\sqrt{1 + \\tfrac1n + \\tfrac{(x_0 - \\bar x)^2}{S_{xx}}}" },
  ],
  exercises: [
    ex(1, num("rgix-ex-1", "$b = 3.6$ with SE 1.2. Find $t$.", 3, "$3.6/1.2$."), ["$3$."]),
    ex(1, num("rgix-ex-2", "How many degrees of freedom has the slope's t-test in a simple regression on 25 points?", 23, "$n - 2$."), ["$23$."]),
    ex(2, dp("rgix-ex-3", "A simple regression on 27 points has SSE 50. Find the residual standard error.", Math.sqrt(2), "$\\sqrt{50/25}$."), ["$\\sqrt2 \\approx 1.414$."]),
    ex(2, num("rgix-ex-4", "$s = 3$ and $S_{xx} = 36$. Find SE($b_1$).", 0.5, "$3/6$."), ["$0.5$."]),
    ex(2, num("rgix-ex-5", "A model with 2 predictors on 23 observations has $R^2 = 0.5$. Find $F$.", 10, "$(0.5/2)/(0.5/20)$."), ["$0.25/0.025 = 10$."]),
    ex(2, num("rgix-ex-6", "$b_1 = 2$ with SE 0.5 and $t^* = 2.1$. Find the upper end of the 95% interval for $\\beta_1$.", 3.05, "$2 + 2.1 \\times 0.5$."), ["$3.05$."]),
    ex(3, dp("rgix-ex-7", "$s = 2$, $n = 25$, $(x_0 - \\bar x)^2 = 25$ and $S_{xx} = 100$. Find the SE of the mean response at $x_0$.", 2 * Math.sqrt(0.04 + 0.25), "$s\\sqrt{1/n + (x_0 - \\bar x)^2/S_{xx}}$."), ["$2\\sqrt{0.29} \\approx 1.077$."]),
    ex(3, dp("rgix-ex-8", "Same numbers. Find the SE for predicting one new $y$ at $x_0$.", 2 * Math.sqrt(1.29), "Add 1 under the root."), ["$2\\sqrt{1.29} \\approx 2.272$."]),
    ex(3, num("rgix-ex-9", "A simple regression's slope has $t = 2.5$. Find the overall $F$.", 6.25, "$F = t^2$."), ["$6.25$."]),
    ex(3, mc("rgix-ex-10", "Fitted on houses of 800–2,500 sq ft, a model is used for a 6,000 sq ft mansion. Its prediction interval", ["is wide, and still understates the risk if the model doesn't hold out there", "Extrapolation goes beyond what the data checked."], [["is as reliable as any other", "The formulas assume the model holds at 6,000 sq ft too."], ["is narrower, because large houses are rare", "Distance from $\\bar x$ widens the interval."]]), ["The interval widens with $(x_0 - \\bar x)^2$, and model error beyond the data is extra."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const se = r.pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5]);
      const t = r.pick([0.5, 1.2, 1.8, 2, 2.5, 3, 3.5, 4]) * (lv === 3 ? -1 : 1);
      const b = r2(t * se);
      return n(`A coefficient is ${b} with SE ${se}. Find $t$ for $H_0: \\beta = 0$ (2 decimals).`, r2(b / se), `$${b}/${se} = ${r2(b / se)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = r.int(1, 2 + lv);
      const nn = k + 1 + r.pick([10, 20, 30, 40, 50]);
      const r2v = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75]);
      const F = r2v / k / ((1 - r2v) / (nn - k - 1));
      return n(`A model with ${k} predictor${k > 1 ? "s" : ""} on ${nn} observations has $R^2 = ${r2v}$. Find $F$ (2 decimals).`, r2(F), `$\\dfrac{${r2v}/${k}}{${r2(1 - r2v)}/${nn - k - 1}} \\approx ${r2(F)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const what = r.pick([
        { q: "the average fuel economy of all cars of a given weight", pi: false },
        { q: "the fuel economy of the next car of that weight off the line", pi: true },
        { q: "the mean exam score of students who study 10 hours", pi: false },
        { q: "the score of one particular student who studies 10 hours", pi: true },
      ]);
      return mcNumbers(
        `From a regression, which interval answers a question about ${what.q}?`,
        { text: what.pi ? "The prediction interval for a new $y$" : "The confidence interval for the mean response", why: what.pi ? "One new unit varies around the line by the error SD." : "It locates the average at that $x$." },
        [{ text: what.pi ? "The confidence interval for the mean response" : "The prediction interval for a new $y$", why: what.pi ? "That is far too narrow for one unit." : "That is for a single new unit.", ...(what.pi ? { misconception: "ci-mean-vs-new-y" } : {}) }],
      );
    },
  },
];
