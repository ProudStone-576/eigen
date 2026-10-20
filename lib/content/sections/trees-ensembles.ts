import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Classification and regression trees (impurity, pruning), bagging, random forests and out-of-bag error, boosting (AdaBoost, gradient boosting), stacking and other ensembles. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const gini = (counts: number[]) => {
  const t = counts.reduce((s, c) => s + c, 0);
  return 1 - counts.reduce((s, c) => s + (c / t) ** 2, 0);
};

const base: ConceptNode = {
  id: "trees-ensembles",
  title: "Trees, forests & boosting",
  summary: "A decision tree predicts by asking a sequence of yes/no questions about the features, chosen greedily to make each group as pure as possible. Single trees are easy to read but unstable. Averaging many trees grown on bootstrap samples (bagging, random forests) cuts their variance; growing trees one after another to fix earlier mistakes (boosting) cuts bias. These ensembles are among the most accurate methods for tabular data.",
  deps: ["bias-variance", "bootstrap", "regularization"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "impurity", meaning: "How mixed the classes in a node are, measured by Gini $1 - \\sum p_k^2$ or entropy $-\\sum p_k\\log_2p_k$." },
    { term: "bagging", meaning: "Bootstrap aggregating: fit a model to each of many bootstrap samples and average the predictions." },
    { term: "boosting", meaning: "Fitting weak models in sequence, each concentrating on the errors of those before it." },
  ],
  misconceptions: {
    "rf-more-trees-overfit": "Thinks adding more trees to a random forest makes it overfit.",
    "boost-rounds-free": "Thinks boosting can run for unlimited rounds without overfitting, as a random forest can add trees.",
  },
  steps: [
    {
      type: "motivate",
      title: "Twenty questions",
      body: "A bank decides on a loan: is income above ₹6 lakh? If yes, is existing debt below ₹2 lakh? Each question splits the applicants into more homogeneous groups. A tree learned from data asks the questions that best separate defaulters from payers. One tree is easy to explain but changes a lot with the data; a forest of hundreds is stable and accurate.",
      realWorld: {
        title: "Tabular-data competitions",
        body: "On spreadsheets of mixed numeric and categorical features, such as credit, insurance or sales data, gradient-boosted trees (XGBoost, LightGBM, CatBoost) win most prediction competitions and are standard in industry, often beating deep neural networks.",
      },
    },
    {
      type: "truth",
      statement: "A **CART** tree splits greedily: at each node, choose the feature and threshold that most reduce impurity (Gini or entropy for classes, residual sum of squares for numbers), weighted by node size. Grown deep, a tree has low bias and high variance; **cost-complexity pruning** minimises $\\text{error} + \\alpha \\times (\\text{number of leaves})$, with $\\alpha$ chosen by cross-validation. **Bagging** averages $B$ trees from bootstrap samples (§{bootstrap}); if each has variance $\\sigma^2$ and pairwise correlation $\\rho$, the average has variance $\\rho\\sigma^2 + \\dfrac{1 - \\rho}{B}\\sigma^2$.",
      body: "A **random forest** also picks a random subset of $m$ features (often $\\sqrt p$) at each split, which lowers $\\rho$ and so the variance; adding trees never increases its error, it only levels off. Each bootstrap sample leaves out about 36.8% of the data, giving a free **out-of-bag** error estimate. **Gradient boosting** builds $F_m = F_{m-1} + \\eta h_m$, where each small tree $h_m$ fits the current residuals (the negative gradient of the loss) and $\\eta$ is a learning rate; it reduces bias, and too many rounds overfit, so stop early on validation error (§{regularization}). **AdaBoost** instead reweights misclassified points. **Stacking** trains a model on the predictions of several others.",
    },
    {
      type: "predict",
      misconception: "rf-more-trees-overfit",
      item: {
        kind: "mc",
        id: "tre-predict-1",
        prompt: "A random forest with 100 trees has test error 12%. Growing it to 2,000 trees, the test error will most likely",
        options: [
          { id: "a", text: "stay about the same or fall slightly: averaging more trees can't overfit", correct: true, why: "More trees only reduce the Monte Carlo noise of the average." },
          { id: "b", text: "rise, because a bigger model overfits", misconception: "rf-more-trees-overfit", why: "The trees are averaged, not added together." },
          { id: "c", text: "fall to 0", why: "Bias and the correlation term remain." },
        ],
      },
      reveal: {
        body: "The forest's prediction is an average. As $B$ grows, the variance $\\rho\\sigma^2 + (1 - \\rho)\\sigma^2/B$ falls towards $\\rho\\sigma^2$ and then levels off; nothing pushes it back up. The forest overfits through its individual trees (depth, leaf size), not their number. Boosting is different: each new tree is added to the model, so extra rounds keep fitting the training data more closely.",
      },
      resolve: {
        kind: "mc",
        id: "tre-resolve-1",
        prompt: "In a random forest, the number of trees mainly needs to be",
        options: [
          { id: "a", text: "large enough for the error to settle; more is safe, just slower", correct: true, why: "Averaging can't overfit." },
          { id: "b", text: "kept small to avoid overfitting", misconception: "rf-more-trees-overfit", why: "Extra trees only steady the average." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tre-check-1",
        prompt: "Gradient boosting's validation error falls for 300 rounds, then rises steadily to round 3,000. You should",
        options: [
          { id: "a", text: "stop at about 300 rounds (early stopping)", correct: true, why: "Later rounds fit noise in the training data." },
          { id: "b", text: "keep all 3,000: boosting doesn't overfit", misconception: "boost-rounds-free", why: "Each round adds capacity." },
          { id: "c", text: "raise the learning rate", why: "That overfits faster." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tre-check-2",
        prompt: "A node has 6 positives and 4 negatives. Its Gini impurity is",
        options: [
          { id: "a", text: "0.48", correct: true, why: "$1 - 0.36 - 0.16$." },
          { id: "b", text: "0.24", why: "That is $0.6 \\times 0.4$; Gini is twice that for two classes." },
          { id: "c", text: "0.97", why: "That is roughly the entropy in bits." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Trees need no feature scaling, handle mixed data types and capture interactions automatically, which is why boosted trees dominate tabular problems. Their main tuning knobs are depth, learning rate, number of rounds (with early stopping), row and column subsampling, and regularisation of leaf values.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "tre-produce-1", prompt: "Find the Gini impurity of a node with 3 positives and 1 negative.", answer: 0.375, explain: "$1 - 0.5625 - 0.0625$." },
        { kind: "number", id: "tre-produce-2", prompt: "Gradient boosting: current prediction 10, true value 14, learning rate 0.1, and the new tree predicts the residual exactly. Find the updated prediction.", answer: 10.4, explain: "$10 + 0.1 \\times 4$." },
        {
          kind: "mc",
          id: "tre-produce-3",
          prompt: "A random forest's out-of-bag error stops improving after 300 trees. Using 1,000 trees",
          options: [
            { id: "a", text: "is harmless apart from computing time", correct: true, why: "Averaging more trees can't overfit." },
            { id: "b", text: "will overfit", misconception: "rf-more-trees-overfit", why: "The error levels off; it doesn't rise." },
          ],
        },
        {
          kind: "mc",
          id: "tre-produce-4",
          prompt: "Without early stopping, running gradient boosting for many more rounds will",
          options: [
            { id: "a", text: "eventually overfit the training data", correct: true, why: "Each round adds to the model." },
            { id: "b", text: "keep improving test accuracy forever", misconception: "boost-rounds-free", why: "Boosting reduces bias until it starts fitting noise." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "tre-review-1", prompt: "Find the entropy, in bits, of a node with 4 positives and 4 negatives.", answer: 1, explain: "$-2 \\times \\tfrac12\\log_2\\tfrac12$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "impurity decrease",
      body: "Splitting a node of size $n$ into children of sizes $n_L$ and $n_R$ reduces impurity by $\\Delta = I(\\text{parent}) - \\dfrac{n_L}{n}I(L) - \\dfrac{n_R}{n}I(R)$. With entropy, $\\Delta$ is the **information gain**. For regression the impurity is the variance (mean squared deviation) within the node, and each leaf predicts its mean.",
    },
    {
      type: "definition",
      term: "gradient boosting",
      body: "Start with a constant $F_0$. For $m = 1, \\dots, M$: compute pseudo-residuals $r_i = -\\partial L(y_i, F)/\\partial F$ at $F_{m-1}(x_i)$ (for squared error, $y_i - F_{m-1}(x_i)$); fit a small tree $h_m$ to them; update $F_m = F_{m-1} + \\eta h_m$. Small $\\eta$ (0.01 to 0.1) with more rounds usually generalises better; subsampling rows (stochastic boosting) adds regularisation.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "variance of an average of correlated trees",
      statement: "If $B$ predictors each have variance $\\sigma^2$ and pairwise correlation $\\rho$, their average has variance $\\rho\\sigma^2 + \\dfrac{1 - \\rho}{B}\\sigma^2$.",
      proof: ["$\\operatorname{Var}\\left(\\tfrac1B\\sum X_b\\right) = \\tfrac1{B^2}\\left(B\\sigma^2 + B(B - 1)\\rho\\sigma^2\\right)$, which rearranges to the formula."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "out-of-bag fraction",
      statement: "The probability a given point is left out of a bootstrap sample of size $n$ is $(1 - 1/n)^n \\to e^{-1} \\approx 0.368$.",
      proof: ["Each of the $n$ draws misses the point with probability $1 - 1/n$, independently."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "which ensemble",
      statement: "Random forests are robust with little tuning and suit noisy data; gradient boosting usually reaches higher accuracy but needs tuning and early stopping. Both beat a single tree; a single pruned tree is chosen when the model must be read by people.",
      proof: ["Forests reduce variance of low-bias trees; boosting reduces bias of high-bias stumps, at the risk of fitting noise."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A node has 6 positives and 4 negatives. A split gives children (5, 1) and (1, 3). Find the Gini decrease.",
      solution: ["Parent $1 - 0.36 - 0.16 = 0.48$. Left $1 - (25 + 1)/36 \\approx 0.278$; right $1 - (1 + 9)/16 = 0.375$.", "Weighted children $0.6 \\times 0.278 + 0.4 \\times 0.375 \\approx 0.317$; decrease $\\approx 0.163$."],
      result: "About 0.163.",
    },
    {
      type: "example",
      level: 2,
      title: "why decorrelation helps",
      problem: "Trees have variance 1. Compare the variance of an average of 100 trees with $\\rho = 0.6$ (bagging) and $\\rho = 0.3$ (random forest).",
      solution: ["Bagging: $0.6 + 0.4/100 = 0.604$.", "Forest: $0.3 + 0.7/100 = 0.307$, half as much."],
      result: "0.604 against 0.307.",
    },
    {
      type: "example",
      level: 3,
      title: "two boosting rounds",
      problem: "Squared-error boosting with $\\eta = 0.5$, starting from $F_0 = 10$, for a point with $y = 18$. Each tree predicts the current residual exactly. Find $F_2$.",
      solution: ["Round 1: residual 8, $F_1 = 10 + 0.5 \\times 8 = 14$.", "Round 2: residual 4, $F_2 = 14 + 0.5 \\times 4 = 16$."],
      result: "16, closing half the gap each round.",
    },
  ],
  pitfalls: [
    { wrong: "More trees make a random forest overfit.", right: "They only steady the average; control depth and leaf size instead." },
    { wrong: "Boost for as many rounds as possible.", right: "Use early stopping on validation data." },
    { wrong: "Trust a single deep tree.", right: "It has high variance; prune it or use an ensemble." },
  ],
  formulas: [
    { label: "Gini", tex: "1 - \\textstyle\\sum_kp_k^2" },
    { label: "Entropy", tex: "-\\textstyle\\sum_kp_k\\log_2p_k" },
    { label: "Ensemble variance", tex: "\\rho\\sigma^2 + \\tfrac{1 - \\rho}{B}\\sigma^2" },
    { label: "Boosting", tex: "F_m = F_{m-1} + \\eta h_m" },
  ],
  exercises: [
    ex(1, num("trex-ex-1", "Find the Gini impurity of a pure node.", 0, "All one class."), ["$0$."]),
    ex(1, num("trex-ex-2", "Find the Gini impurity of a node with 5 positives and 5 negatives.", 0.5, "$1 - 0.25 - 0.25$."), ["$0.5$, the two-class maximum."]),
    ex(2, fr("trex-ex-3", "Children (4, 0) and (2, 4) come from a parent (6, 4). Find the weighted Gini of the children.", 0.6 * gini([2, 4]), "$\\tfrac4{10} \\times 0 + \\tfrac6{10} \\times \\tfrac49$."), ["Right child $1 - \\tfrac19 - \\tfrac49 = \\tfrac49$; weighted $\\tfrac{6}{10} \\times \\tfrac49 = \\tfrac4{15} \\approx 0.267$."]),
    ex(2, fr("trex-ex-4", "Trees have variance 4 and correlation 0.5. Find the variance of an average of 50 trees.", 0.5 * 4 + (0.5 / 50) * 4, "$\\rho\\sigma^2 + (1 - \\rho)\\sigma^2/B$."), ["$2 + 0.04 = 2.04$."]),
    ex(2, num("trex-ex-5", "Boosting with $\\eta = 0.2$: prediction 50, true value 40, tree predicts the residual exactly. Find the new prediction.", 48, "$50 + 0.2 \\times (-10)$."), ["$48$."]),
    ex(3, fr("trex-ex-6", "With $n = 10$, find the probability a given point is out of bag.", 0.9 ** 10, "$(1 - 1/n)^n$."), ["$0.9^{10} \\approx 0.349$, near $e^{-1}$."]),
    ex(3, mc("trex-ex-7", "With 100 features, a classification forest commonly tries how many at each split?", ["about 10", "$\\sqrt{100}$."], [["all 100", "That is bagging and leaves trees correlated."], ["1", "Too few makes each tree weak."]]), ["For regression, $p/3$ is a common default."]),
    ex(3, mc("trex-ex-8", "Training error of a gradient-boosted model is 0.1% and validation error 15%, while a forest gets 9% on validation. The boosted model is", ["overfitting: reduce rounds, depth or learning rate", "A huge train–validation gap."], [["better, judging by training error", "Judge on held-out data."], ["underfitting", "Its training error is tiny."]]), ["Tune with early stopping."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = lv === 3 ? 3 : 2;
      const counts = Array.from({ length: k }, () => r.int(1, 12));
      const g = gini(counts);
      return n(`A node has class counts ${counts.join(", ")}. Find its Gini impurity (3 decimals).`, Math.round(g * 1000) / 1000, `$1 - \\sum p_k^2 \\approx ${Math.round(g * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s2 = r.pick([1, 2, 4, 9]);
      const rho = r.pick([0.1, 0.2, 0.3, 0.5, 0.7]);
      const B = r.pick([10, 50, 100, 500]);
      const v = rho * s2 + ((1 - rho) * s2) / B;
      return n(`Trees each have variance ${s2} and pairwise correlation ${rho}. Find the variance of the average of ${B} trees (4 decimals).`, Math.round(v * 10000) / 10000, `$${rho} \\times ${s2} + ${r2(1 - rho)} \\times ${s2}/${B} \\approx ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const f0 = r.int(0, 50);
      const y = f0 + r.nonzero(-20, 20);
      const eta = r.pick([0.1, 0.2, 0.3, 0.5]);
      const v = f0 + eta * (y - f0);
      return n(`Squared-error boosting: current prediction ${f0}, true value ${y}, learning rate ${eta}. The new tree predicts the residual exactly. Find the updated prediction.`, r2(v), `$${f0} + ${eta} \\times (${y - f0}) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b] = r.pick([[200, 1000], [100, 800], [300, 3000], [500, 2000]] as const);
      return mcNumbers(
        `A random forest's error has levelled off by ${a} trees. Increasing to ${b} trees will`,
        { text: "leave the error about the same", why: "Averaging more trees can't overfit." },
        [
          { text: "make it overfit", why: "Extra trees only steady the average.", misconception: "rf-more-trees-overfit" },
          { text: "cut the error to 0", why: "Bias and correlation remain." },
        ],
      );
    },
  },
];
