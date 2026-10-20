import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Support vector machines (margin, hinge loss, soft margins, kernels), k-nearest neighbours (choice of k, scaling, curse of dimensionality), and naive Bayes (conditional independence, Laplace smoothing). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "svm-knn-nb",
  title: "SVMs, nearest neighbours & naive Bayes",
  summary: "Three classic classifiers built on different ideas. A support vector machine finds the boundary with the widest margin between classes, and kernels let it draw curved boundaries. k-nearest neighbours classifies a point by a vote among the closest training points. Naive Bayes applies Bayes' rule while pretending the features are independent given the class, which makes it fast and surprisingly effective.",
  deps: ["logistic-regression", "bayes", "regularization"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "margin", meaning: "The distance from the decision boundary to the nearest training points; for $\\vec w\\cdot\\vec x + b = 0$ with the SVM scaling, its width is $2/\\lvert\\vec w\\rvert$." },
    { term: "support vectors", meaning: "The training points on or inside the margin; they alone determine the SVM boundary." },
    { term: "kernel", meaning: "A function $K(\\vec x, \\vec z) = \\phi(\\vec x)\\cdot\\phi(\\vec z)$ giving inner products in a transformed feature space without computing $\\phi$." },
  ],
  misconceptions: {
    "knn-k1-best": "Thinks $k = 1$ is the best choice for nearest neighbours because it makes no training errors.",
    "nb-useless-dependent": "Thinks naive Bayes is useless whenever its features are correlated.",
  },
  steps: [
    {
      type: "motivate",
      title: "Three ways to draw a line",
      body: "To separate spam from real mail you might draw the boundary as far as possible from both kinds (SVM), label each new email like the most similar emails you've seen (nearest neighbours), or multiply up how typical each word is of spam versus real mail (naive Bayes). All three work, with different strengths.",
      realWorld: {
        title: "Spam filters",
        body: "Early spam filters in the 2000s were naive Bayes classifiers over word counts, trained on each user's own mail. They were fast enough to retrain constantly and caught most spam despite the obviously false assumption that words appear independently.",
      },
    },
    {
      type: "truth",
      statement: "A linear **SVM** classifies by the sign of $f(\\vec x) = \\vec w\\cdot\\vec x + b$ and minimises $\\tfrac12\\lvert\\vec w\\rvert^2 + C\\sum_i\\max(0, 1 - y_if(\\vec x_i))$, with labels $y_i = \\pm1$: the first term widens the margin $2/\\lvert\\vec w\\rvert$, the **hinge loss** penalises points on the wrong side of it, and $C$ trades the two. Replacing dot products by a **kernel**, such as the RBF $e^{-\\gamma\\lvert\\vec x - \\vec z\\rvert^2}$, gives non-linear boundaries. **$k$-nearest neighbours** predicts the majority class (or mean value) of the $k$ closest training points. **Naive Bayes** uses $P(y \\mid \\vec x) \\propto P(y)\\prod_jP(x_j \\mid y)$ (§{bayes}).",
      body: "In $k$-NN, small $k$ gives low bias and high variance (a jagged boundary that follows noise); large $k$ smooths it; choose $k$ by cross-validation. Distances need **scaled** features, and in high dimensions all points become nearly equidistant (the **curse of dimensionality**). Naive Bayes estimates each $P(x_j \\mid y)$ separately, so it needs little data; word probabilities use **Laplace smoothing** $\\dfrac{\\text{count} + 1}{\\text{total} + V}$ so an unseen word doesn't zero out a class. Its probabilities are often poorly calibrated even when its classifications are good.",
    },
    {
      type: "predict",
      misconception: "knn-k1-best",
      item: {
        kind: "mc",
        id: "skn-predict-1",
        prompt: "On a noisy dataset, 1-NN has 0% training error and 25% test error; 15-NN has 12% training error and 15% test error. Which is better?",
        options: [
          { id: "a", text: "15-NN: test error is what matters, and 1-NN is overfitting", correct: true, why: "Each 1-NN training point is its own nearest neighbour." },
          { id: "b", text: "1-NN, since it makes no training errors", misconception: "knn-k1-best", why: "Zero training error is automatic for $k = 1$ and says nothing about new data." },
          { id: "c", text: "They are equivalent", why: "Their test errors differ a lot." },
        ],
      },
      reveal: {
        body: "With $k = 1$, every training point is classified by itself, so training error is always 0, however noisy the labels. On new data, each prediction copies a single, possibly mislabelled neighbour: high variance. Averaging over 15 neighbours smooths out label noise. Choose $k$ by validation error, not training error (§{bias-variance}).",
      },
      resolve: {
        kind: "mc",
        id: "skn-resolve-1",
        prompt: "1-NN always has zero training error. This means",
        options: [
          { id: "a", text: "training error can't be used to choose $k$", correct: true, why: "Use cross-validation." },
          { id: "b", text: "$k = 1$ is the best choice", misconception: "knn-k1-best", why: "It usually overfits." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "skn-check-1",
        prompt: "In spam data, the words \"free\" and \"offer\" often appear together, violating naive Bayes' assumption. Its spam classifications will typically be",
        options: [
          { id: "a", text: "still quite accurate, though its probabilities are overconfident", correct: true, why: "Classification only needs the right class to score highest." },
          { id: "b", text: "useless, because the independence assumption fails", misconception: "nb-useless-dependent", why: "Naive Bayes often classifies well despite dependence." },
          { id: "c", text: "perfectly calibrated", why: "Double-counting correlated evidence pushes probabilities to extremes." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "skn-check-2",
        prompt: "An SVM has $\\vec w = (3, 4)$. The width of its margin is",
        options: [
          { id: "a", text: "0.4", correct: true, why: "$2/\\lvert\\vec w\\rvert = 2/5$." },
          { id: "b", text: "5", why: "That is $\\lvert\\vec w\\rvert$." },
          { id: "c", text: "0.2", why: "That is half the margin." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Nearest-neighbour search over learned embeddings powers modern retrieval: recommendation, image search and retrieval-augmented language models all find the closest vectors to a query. Kernel ideas survive in Gaussian processes and in the theory of wide neural networks.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "skn-produce-1", prompt: "A point with $y = 1$ has $f(\\vec x) = 0.3$. Find its hinge loss.", answer: 0.7, explain: "$\\max(0, 1 - 0.3)$." },
        { kind: "number", id: "skn-produce-2", prompt: "Spam prior 0.4; $P(\\text{\"free\"} \\mid \\text{spam}) = 0.3$ and $P(\\text{\"free\"} \\mid \\text{ham}) = 0.05$. Find $P(\\text{spam} \\mid \\text{\"free\"})$.", answer: 0.8, explain: "$0.12/(0.12 + 0.03)$." },
        {
          kind: "mc",
          id: "skn-produce-3",
          prompt: "To choose $k$ for $k$-NN, use",
          options: [
            { id: "a", text: "cross-validated error", correct: true, why: "It estimates performance on new data." },
            { id: "b", text: "training error, which picks $k = 1$", misconception: "knn-k1-best", why: "Training error is always 0 at $k = 1$." },
          ],
        },
        {
          kind: "mc",
          id: "skn-produce-4",
          prompt: "A text classifier's features (word counts) are clearly correlated. Naive Bayes",
          options: [
            { id: "a", text: "is still worth trying as a fast baseline", correct: true, why: "It often classifies well regardless." },
            { id: "b", text: "can't work at all", misconception: "nb-useless-dependent", why: "Dependence mostly distorts its probabilities, not its rankings." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "skn-review-1", prompt: "A point with $y = -1$ has $f(\\vec x) = 0.5$. Find its hinge loss.", answer: 1.5, explain: "$\\max(0, 1 + 0.5)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the kernel trick",
      body: "The SVM solution depends on the data only through dot products $\\vec x_i\\cdot\\vec x_j$. Replacing them by $K(\\vec x_i, \\vec x_j)$ fits a linear boundary in the feature space of $\\phi$ without ever computing $\\phi$: the polynomial kernel $(\\vec x\\cdot\\vec z + 1)^d$ corresponds to all monomials up to degree $d$, and the RBF kernel to an infinite-dimensional space. The prediction is $f(\\vec x) = \\sum_i\\alpha_iy_iK(\\vec x_i, \\vec x) + b$, with $\\alpha_i > 0$ only for support vectors.",
    },
    {
      type: "definition",
      term: "Laplace smoothing",
      body: "If word $w$ appears $c_w$ times among $N$ words of class $y$, with vocabulary size $V$, estimate $P(w \\mid y) = \\dfrac{c_w + 1}{N + V}$. Without it, a single word never seen in spam would make $P(\\text{spam} \\mid \\text{email}) = 0$ whatever else the email contains.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "margin width",
      statement: "With the canonical scaling $y_i(\\vec w\\cdot\\vec x_i + b) \\ge 1$, the margin between the planes $\\vec w\\cdot\\vec x + b = \\pm1$ is $2/\\lvert\\vec w\\rvert$, so maximising the margin means minimising $\\lvert\\vec w\\rvert^2$.",
      proof: ["The distance from a point to the plane $\\vec w\\cdot\\vec x + b = 0$ is $\\lvert\\vec w\\cdot\\vec x + b\\rvert/\\lvert\\vec w\\rvert$; each margin plane is $1/\\lvert\\vec w\\rvert$ away."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "hinge loss as regularised regression",
      statement: "The soft-margin SVM is regularised empirical risk minimisation with hinge loss and an L2 penalty, like ridge-penalised logistic regression with a different loss (§{regularization}).",
      proof: ["Dividing the objective by $C$ gives $\\sum_i\\max(0, 1 - y_if(\\vec x_i)) + \\tfrac{1}{2C}\\lvert\\vec w\\rvert^2$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "the curse of dimensionality",
      statement: "In $d$ dimensions, to capture a fraction $r$ of uniformly spread data, a neighbourhood cube needs side $r^{1/d}$: for $r = 0.01$ and $d = 100$ that is about 0.95 of the whole range. \"Nearest\" neighbours are then not near.",
      proof: ["A cube of side $s$ in the unit cube holds a fraction $s^d$ of the volume; set $s^d = r$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "The 5 nearest neighbours of a point have classes A, B, A, A, B. Classify it with $k = 5$ and with $k = 1$ if the nearest is B.",
      solution: ["$k = 5$: three A against two B, so A.", "$k = 1$: B."],
      result: "A, and B.",
    },
    {
      type: "example",
      level: 2,
      title: "naive Bayes with two words",
      problem: "Spam prior 0.4. $P(\\text{free} \\mid \\text{spam}) = 0.3$, $P(\\text{win} \\mid \\text{spam}) = 0.2$; $P(\\text{free} \\mid \\text{ham}) = 0.05$, $P(\\text{win} \\mid \\text{ham}) = 0.02$. An email contains both. Find $P(\\text{spam} \\mid \\text{email})$.",
      solution: ["Spam: $0.4 \\times 0.3 \\times 0.2 = 0.024$. Ham: $0.6 \\times 0.05 \\times 0.02 = 0.0006$.", "$0.024/0.0246 \\approx 0.976$."],
      result: "About 0.976.",
    },
    {
      type: "example",
      level: 3,
      title: "hinge loss and the margin",
      problem: "An SVM has $\\vec w = (1, 1)$, $b = -3$. Find the hinge losses of $(2, 2)$ with $y = 1$ and $(1, 1.5)$ with $y = -1$.",
      solution: ["$f(2, 2) = 1$: $y f = 1$, loss $0$ (exactly on the margin: a support vector).", "$f(1, 1.5) = -0.5$: $yf = 0.5$, loss $0.5$ (correct side but inside the margin)."],
      result: "0 and 0.5.",
    },
  ],
  pitfalls: [
    { wrong: "Choose $k = 1$ because training error is zero.", right: "Choose $k$ by cross-validation." },
    { wrong: "Use $k$-NN or an RBF SVM on unscaled features.", right: "Standardise first; distances depend on units." },
    { wrong: "Trust naive Bayes' probabilities.", right: "Use its rankings; calibrate the probabilities if needed." },
  ],
  formulas: [
    { label: "SVM objective", tex: "\\tfrac12\\lvert\\vec w\\rvert^2 + C\\textstyle\\sum_i\\max(0, 1 - y_if(\\vec x_i))" },
    { label: "Margin", tex: "2/\\lvert\\vec w\\rvert" },
    { label: "Naive Bayes", tex: "P(y \\mid \\vec x) \\propto P(y)\\textstyle\\prod_jP(x_j \\mid y)" },
    { label: "Laplace", tex: "\\dfrac{c_w + 1}{N + V}" },
  ],
  exercises: [
    ex(1, num("sknx-ex-1", "An SVM has $\\vec w = (6, 8)$. Find the margin width.", 0.2, "$2/10$."), ["$0.2$."]),
    ex(1, num("sknx-ex-2", "A point with $y = 1$ has $f(\\vec x) = 2.5$. Find its hinge loss.", 0, "Beyond the margin."), ["$0$."]),
    ex(2, dp("sknx-ex-3", "Spam prior 0.3; a word has probability 0.2 in spam and 0.04 in ham. Find $P(\\text{spam} \\mid \\text{word})$.", 0.06 / (0.06 + 0.028), "$0.06/(0.06 + 0.028)$."), ["$\\approx 0.682$."]),
    ex(2, num("sknx-ex-4", "A word appears 0 times in 4,000 ham words; the vocabulary has 1,000 words. Find its Laplace-smoothed probability in ham.", 0.0002, "$1/5000$."), ["$0.0002$."]),
    ex(2, dp("sknx-ex-5", "In 10 dimensions, what side length of cube holds 1% of uniformly spread data?", 0.01 ** 0.1, "$0.01^{1/10}$."), ["$\\approx 0.631$ of the range."]),
    ex(3, mc("sknx-ex-6", "Raising the SVM parameter $C$ makes the model", ["fit the training data more closely, with a narrower margin", "Violations cost more."], [["more regularised", "Smaller $C$ regularises more."], ["ignore the hinge loss", "Larger $C$ weights it more."]]), ["Tune $C$ (and $\\gamma$ for RBF) by cross-validation."]),
    ex(3, mc("sknx-ex-7", "Removing a training point that lies well outside the margin will change the SVM boundary", ["not at all", "Only support vectors determine it."], [["a lot", "It has $\\alpha_i = 0$."], ["only if it is misclassified", "It is correctly classified and outside the margin."]]), ["Support vectors are the only points that matter."]),
    ex(3, mc("sknx-ex-8", "Features are income in rupees and age in years. Before $k$-NN you should", ["standardise both", "Otherwise income dominates distances."], [["leave them", "Units would decide the neighbours."], ["drop age", "It may be informative."]]), ["Scale, then choose $k$ by cross-validation."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const y = r.pick([1, -1]);
      const f = r2(r.int(-30, 30) / 10);
      const v = Math.max(0, 1 - y * f);
      return n(`An SVM gives $f(\\vec x) = ${f}$ for a point with label $y = ${y}$. Find its hinge loss.`, r2(v), `$\\max(0, 1 - (${y})(${f})) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [a, b, c] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [1, 0, 1], [0, 2, 2], [8, 6, 10]] as const);
      return n(`An SVM has $\\vec w = (${a}, ${b})$. Find the margin width (3 decimals).`, Math.round((2 / c) * 1000) / 1000, `$2/\\lvert\\vec w\\rvert = 2/${c}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const prior = r.pick([0.2, 0.3, 0.4, 0.5]);
      const ps = r.pick([0.1, 0.2, 0.3, 0.4]);
      const ph = r.pick([0.01, 0.02, 0.05, 0.1]);
      const v = (prior * ps) / (prior * ps + (1 - prior) * ph);
      return n(`Naive Bayes: spam prior ${prior}; a word has probability ${ps} in spam and ${ph} in ham. Find $P(\\text{spam} \\mid \\text{word})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{${prior} \\times ${ps}}{${prior} \\times ${ps} + ${r2(1 - prior)} \\times ${ph}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([5, 9, 15, 25]);
      const e1 = r.pick([20, 24, 28]);
      const ek = r.pick([12, 14, 16]);
      return mcNumbers(
        `1-NN has training error 0% and test error ${e1}%; ${k}-NN has test error ${ek}%. Prefer`,
        { text: `${k}-NN`, why: "Lower test error; 1-NN's zero training error is automatic." },
        [{ text: "1-NN, which has no training errors", why: "Training error is always 0 for $k = 1$.", misconception: "knn-k1-best" }],
      );
    },
  },
];
