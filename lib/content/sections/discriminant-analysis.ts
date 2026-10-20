import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Linear and quadratic discriminant analysis: Bayes classification with normal classes, Fisher's direction, priors, parameter counts. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const boundary1d = (m1: number, m2: number, s2: number, p1: number) => (m1 + m2) / 2 + (s2 * Math.log(p1 / (1 - p1))) / (m2 - m1);

const base: ConceptNode = {
  id: "discriminant-analysis",
  title: "Discriminant analysis",
  summary: "Model each class as a normal distribution and classify a new point to the class with the highest posterior probability. With a covariance matrix shared by all classes the boundary is linear (LDA); with a separate one per class it is quadratic (QDA). Fisher's discriminant direction Σ⁻¹(μ₁ − μ₂) separates two classes best.",
  deps: ["mahalanobis", "bayes", "logistic-regression"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "discriminant function", meaning: "A score computed for each class; the point is assigned to the class with the highest score." },
    { term: "LDA", meaning: "Linear discriminant analysis: normal classes sharing one covariance matrix, giving linear boundaries." },
    { term: "QDA", meaning: "Quadratic discriminant analysis: each class has its own covariance matrix, giving curved boundaries." },
  ],
  misconceptions: {
    "lda-pca-same": "Thinks LDA and PCA find the same directions; PCA maximises total spread while LDA maximises separation between classes.",
    "qda-always-better": "Thinks QDA is always better than LDA because it is more flexible.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which species?",
      body: "Fisher's 1936 iris data: petal and sepal measurements for three iris species. Given a new flower's measurements, which species is it? If each species' measurements are roughly normal, Bayes' rule (§{bayes}) gives the answer, and the boundaries between species turn out to be straight lines.",
      realWorld: {
        title: "Credit scoring",
        body: "Some of the first credit-scoring systems in the 1950s and 60s were linear discriminant functions: a weighted sum of an applicant's income, debts and history, with a cut-off separating likely payers from likely defaulters.",
      },
    },
    {
      type: "truth",
      statement: "Classify $\\vec x$ to the class $k$ maximising $\\pi_kf_k(\\vec x)$, where $\\pi_k$ is the prior and $f_k$ the class's normal density. If every class shares covariance $\\Sigma$ (**LDA**), the boundaries are linear: for two classes, assign to class 2 when $\\vec w^{\\mathsf T}\\vec x > c$ with $\\vec w = \\Sigma^{-1}(\\vec\\mu_2 - \\vec\\mu_1)$. With separate covariances $\\Sigma_k$ (**QDA**), the boundaries are quadratic.",
      body: "In one dimension with equal variances and equal priors, the boundary is the midpoint of the two means; unequal priors push it towards the rarer class. LDA also reduces dimension: with $K$ classes, all the information for classifying lies in at most $K - 1$ discriminant directions.",
    },
    {
      type: "predict",
      misconception: "lda-pca-same",
      item: {
        kind: "mc",
        id: "lda-predict-1",
        prompt: "Two classes form long, parallel, cigar-shaped clouds side by side, separated across their short axis. PCA's first component and LDA's direction",
        options: [
          { id: "a", text: "differ: PCA follows the long axis, LDA the short axis that separates the classes", correct: true, why: "Spread and separation point different ways here." },
          { id: "b", text: "are the same: both find the most informative direction", misconception: "lda-pca-same", why: "PCA ignores the class labels." },
          { id: "c", text: "are both along the long axis", why: "Projecting onto the long axis would mix the classes completely." },
        ],
      },
      reveal: {
        body: "PCA (§{pca-practice}) looks only at total spread and picks the long axis, along which both cigars overlap entirely: projecting onto it destroys the class information. LDA uses the labels and picks the direction where the class means are far apart relative to the within-class spread: the short axis.",
      },
      resolve: {
        kind: "mc",
        id: "lda-resolve-1",
        prompt: "What does LDA maximise that PCA doesn't?",
        options: [
          { id: "a", text: "Separation between class means relative to within-class spread", correct: true, why: "It uses the class labels." },
          { id: "b", text: "Nothing: they maximise the same thing", misconception: "lda-pca-same", why: "PCA maximises total variance, ignoring labels." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lda-check-1",
        prompt: "With 50 training points, 20 features and 2 classes, which is likely to classify new points better?",
        options: [
          { id: "a", text: "LDA: QDA must estimate two 20 × 20 covariance matrices from little data", correct: true, why: "QDA's extra flexibility costs variance." },
          { id: "b", text: "QDA, because it is more flexible", misconception: "qda-always-better", why: "Flexibility overfits when data are scarce." },
          { id: "c", text: "Neither can be fitted", why: "Both can be, though QDA poorly." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lda-check-2",
        prompt: "One feature; class means 10 and 20, equal variances, equal priors. Where is the LDA boundary?",
        options: [
          { id: "a", text: "15", correct: true, why: "The midpoint." },
          { id: "b", text: "10", why: "That is a class mean." },
          { id: "c", text: "It depends on the variance", why: "With equal priors the variance cancels." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "LDA and logistic regression (§{logistic-regression}) both give linear boundaries. LDA models how the features are distributed in each class; logistic regression models the class given the features directly. LDA is more efficient when its normal assumption holds, logistic regression more robust when it doesn't.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lda-produce-1", prompt: "Shared covariance $\\Sigma = \\operatorname{diag}(2, 1)$ and $\\vec\\mu_2 - \\vec\\mu_1 = (2, 2)$. Find the second entry of the LDA direction $\\Sigma^{-1}(\\vec\\mu_2 - \\vec\\mu_1)$.", answer: 2, explain: "$\\Sigma^{-1}(2, 2) = (1, 2)$." },
        { kind: "number", id: "lda-produce-2", prompt: "With $p = 10$ features, how many distinct entries has one covariance matrix?", answer: 55, explain: "$p(p + 1)/2$." },
        {
          kind: "mc",
          id: "lda-produce-3",
          prompt: "PCA's first component is a good direction for separating two classes",
          options: [
            { id: "a", text: "only by luck: PCA ignores the labels", correct: true, why: "The direction of most spread needn't separate classes." },
            { id: "b", text: "always, since it is LDA's direction too", misconception: "lda-pca-same", why: "They answer different questions." },
          ],
        },
        {
          kind: "mc",
          id: "lda-produce-4",
          prompt: "With few observations per class and many features, prefer",
          options: [
            { id: "a", text: "LDA, which estimates one shared covariance matrix", correct: true, why: "Fewer parameters, less variance." },
            { id: "b", text: "QDA, since flexibility always helps", misconception: "qda-always-better", why: "It overfits small samples." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lda-review-1", prompt: "One feature; class means 4 and 12, equal variances and priors. Find the LDA boundary.", answer: 8, explain: "The midpoint." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "discriminant scores",
      body: "LDA's score for class $k$ is $\\delta_k(\\vec x) = \\vec x^{\\mathsf T}\\Sigma^{-1}\\vec\\mu_k - \\tfrac12\\vec\\mu_k^{\\mathsf T}\\Sigma^{-1}\\vec\\mu_k + \\ln\\pi_k$, linear in $\\vec x$; QDA's adds $-\\tfrac12\\ln|\\Sigma_k| - \\tfrac12(\\vec x - \\vec\\mu_k)^{\\mathsf T}\\Sigma_k^{-1}(\\vec x - \\vec\\mu_k)$, quadratic in $\\vec x$. Assign $\\vec x$ to the class with the largest score.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "the one-dimensional boundary",
      statement: "With one feature, means $\\mu_1 < \\mu_2$, common variance $\\sigma^2$ and priors $\\pi_1, \\pi_2$, the boundary is $x^* = \\dfrac{\\mu_1 + \\mu_2}{2} + \\dfrac{\\sigma^2\\ln(\\pi_1/\\pi_2)}{\\mu_2 - \\mu_1}$.",
      proof: ["Set $\\pi_1f_1(x) = \\pi_2f_2(x)$; take logs: the $x^2$ terms cancel, leaving a linear equation in $x$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Fisher's discriminant",
      statement: "Among all directions $\\vec w$, the ratio $\\dfrac{(\\vec w^{\\mathsf T}(\\vec\\mu_2 - \\vec\\mu_1))^2}{\\vec w^{\\mathsf T}\\Sigma\\vec w}$ (separation of the projected means over projected within-class variance) is largest for $\\vec w \\propto \\Sigma^{-1}(\\vec\\mu_2 - \\vec\\mu_1)$.",
      proof: ["Substituting $\\vec v = \\Sigma^{1/2}\\vec w$ turns the ratio into $(\\vec v \\cdot \\vec d)^2/|\\vec v|^2$ with $\\vec d = \\Sigma^{-1/2}(\\vec\\mu_2 - \\vec\\mu_1)$, maximised when $\\vec v \\parallel \\vec d$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "parameter counts",
      statement: "With $K$ classes and $p$ features, LDA estimates one covariance matrix, $p(p + 1)/2$ numbers; QDA estimates $K$ of them. Regularised discriminant analysis shrinks each class's covariance towards the shared one.",
      proof: ["A symmetric $p \\times p$ matrix has $p$ diagonal and $p(p - 1)/2$ off-diagonal free entries."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Class means 10 and 20 for one feature, SD 5 in both, equal priors. Classify $x = 13$.",
      solution: ["The boundary is 15.", "$13 < 15$: class 1."],
      result: "Class 1.",
    },
    {
      type: "example",
      level: 2,
      title: "unequal priors",
      problem: "Same classes, but class 1 has prior 0.8. Find the boundary.",
      solution: ["$x^* = 15 + \\dfrac{25\\ln 4}{10} = 15 + 3.47$.", "The boundary moves towards the rarer class 2, to about 18.5."],
      result: "About 18.47.",
    },
    {
      type: "example",
      level: 3,
      title: "Fisher's direction",
      problem: `Shared covariance $\\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}$ and class means $(0, 0)$ and $(2, 2)$. Find the discriminant direction.`,
      solution: ["$\\Sigma^{-1}(\\vec\\mu_2 - \\vec\\mu_1) = (2/2, 2/1) = (1, 2)$.", "The second feature, being less noisy, gets twice the weight."],
      result: "$\\vec w \\propto (1, 2)$.",
    },
  ],
  pitfalls: [
    { wrong: "PCA and LDA find the same directions.", right: "PCA maximises total spread; LDA maximises class separation." },
    { wrong: "QDA is always better than LDA.", right: "With little data QDA overfits; LDA's shared covariance is often more accurate." },
    { wrong: "Ignore class priors.", right: "Unequal priors shift the boundary towards the rarer class." },
  ],
  formulas: [
    { label: "Rule", tex: "\\arg\\max_k\\ \\pi_kf_k(\\vec x)" },
    { label: "Fisher direction", tex: "\\vec w \\propto \\Sigma^{-1}(\\vec\\mu_2 - \\vec\\mu_1)" },
    { label: "1-D boundary", tex: "\\tfrac{\\mu_1 + \\mu_2}{2} + \\tfrac{\\sigma^2\\ln(\\pi_1/\\pi_2)}{\\mu_2 - \\mu_1}" },
    { label: "Covariance entries", tex: "p(p + 1)/2" },
  ],
  exercises: [
    ex(1, num("ldax-ex-1", "Class means 3 and 9, equal variances and priors. Find the boundary.", 6, "Midpoint."), ["$6$."]),
    ex(1, num("ldax-ex-2", "How many distinct entries has a $4 \\times 4$ covariance matrix?", 10, "$4 \\times 5/2$."), ["$10$."]),
    ex(2, dp("ldax-ex-3", "Means 10 and 20, variance 25, prior of class 1 is 0.8. Find the boundary.", boundary1d(10, 20, 25, 0.8), "Midpoint plus $\\sigma^2\\ln(\\pi_1/\\pi_2)/(\\mu_2 - \\mu_1)$."), ["$15 + 2.5\\ln 4 \\approx 18.466$."]),
    ex(2, num("ldax-ex-4", "QDA with 3 classes and 5 features. How many covariance entries does it estimate?", 45, "$3 \\times 15$."), ["$45$, against 15 for LDA."]),
    ex(2, num("ldax-ex-5", "$\\Sigma = \\operatorname{diag}(4, 1)$ and $\\vec\\mu_2 - \\vec\\mu_1 = (4, 1)$. Find the first entry of the LDA direction.", 1, "$4/4$."), ["$\\Sigma^{-1}(4, 1) = (1, 1)$."]),
    ex(3, dp("ldax-ex-6", "Means 0 and 4, variance 4, prior of class 1 is 0.25. Find the boundary.", boundary1d(0, 4, 4, 0.25), "The log prior ratio is negative."), ["$2 + \\tfrac{4\\ln(1/3)}{4} = 2 - 1.099 \\approx 0.901$: class 1 is rarer, so the boundary moves towards it."]),
    ex(3, mc("ldax-ex-7", "With $K = 4$ classes, LDA can project the data onto at most how many useful discriminant directions?", ["3", "$K - 1$."], [["4", "The class means span a $(K - 1)$-dimensional space."], ["as many as features", "Only the between-class directions help."]]), ["Four class means lie in a 3-dimensional affine space."]),
    ex(3, mc("ldax-ex-8", "The classes' covariance matrices are clearly different and data are plentiful. Prefer", ["QDA", "Its curved boundaries match the classes and there is data to fit them."], [["LDA", "Its shared-covariance assumption is wrong here."], ["PCA", "PCA isn't a classifier."]]), ["With plenty of data, QDA's extra parameters are well estimated."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const m1 = r.int(0, 20);
      const m2 = m1 + r.int(4, 20);
      const s2 = r.pick([4, 9, 16, 25]);
      const p1 = lv === 1 ? 0.5 : r.pick([0.2, 0.25, 0.5, 0.75, 0.8]);
      const b = boundary1d(m1, m2, s2, p1);
      return n(`One feature; class means ${m1} and ${m2}, common variance ${s2}, prior of class 1 = ${p1}. Find the LDA boundary (3 decimals).`, Math.round(b * 1000) / 1000, p1 === 0.5 ? `Equal priors: the midpoint ${r2((m1 + m2) / 2)}.` : `$${r2((m1 + m2) / 2)} + \\tfrac{${s2}\\ln(${p1}/${r2(1 - p1)})}{${m2 - m1}} \\approx ${Math.round(b * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(2, 20);
      const K = r.int(2, 6);
      const qda = r.pick([true, false]);
      const v = (qda ? K : 1) * ((p * (p + 1)) / 2);
      return n(`${qda ? "QDA" : "LDA"} with ${K} classes and ${p} features. How many covariance entries does it estimate?`, v, `${qda ? `${K} matrices` : "One shared matrix"} of $${p} \\times ${p + 1}/2 = ${(p * (p + 1)) / 2}$ entries${qda ? `: ${v}` : ""}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const n1 = r.pick([20, 30, 40]);
      const p = r.pick([15, 20, 30]);
      return mcNumbers(
        `A classifier must be trained on ${n1} examples per class with ${p} features. Which is safer?`,
        { text: "LDA", why: "It estimates one covariance matrix instead of one per class." },
        [{ text: "QDA, because it is more flexible", why: "Its per-class covariances are poorly estimated from so little data.", misconception: "qda-always-better" }],
      );
    },
  },
];
