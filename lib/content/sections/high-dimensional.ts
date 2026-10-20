import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** High-dimensional statistics (p comparable to or larger than n): sparsity and the lasso, soft-thresholding, rates, selective (post-selection) inference, random matrix theory and the Marchenko–Pastur law. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const soft = (z: number, l: number) => Math.sign(z) * Math.max(0, Math.abs(z) - l);
const mp = (g: number) => [(1 - Math.sqrt(g)) ** 2, (1 + Math.sqrt(g)) ** 2];

const base: ConceptNode = {
  id: "high-dimensional",
  title: "High-dimensional inference",
  summary: "Genomics, text and imaging give data with more variables than observations. Classical methods break: least squares has no unique solution, sample covariance matrices are badly distorted, and selecting variables with the data invalidates the usual p-values. Sparsity (only a few variables matter), regularisation such as the lasso, random matrix theory and selective inference are the tools that restore sense.",
  deps: ["regularization", "multiple-testing", "pca"],
  pos: { x: 5, y: 0 },
  glossary: [
    { term: "sparsity", meaning: "Only a small number $s$ of the $p$ coefficients are non-zero." },
    { term: "soft-thresholding", meaning: "$S_\\lambda(z) = \\operatorname{sign}(z)\\max(\\lvert z\\rvert - \\lambda, 0)$: shrink towards 0 by $\\lambda$, and set small values to exactly 0." },
    { term: "selective inference", meaning: "Inference that accounts for the fact that the hypotheses or model were chosen by looking at the same data." },
  ],
  misconceptions: {
    "select-then-infer": "Reports ordinary p-values and confidence intervals for variables that were chosen by the data, as if they had been chosen in advance.",
    "sample-eigen-true": "Reads the largest eigenvalues of a high-dimensional sample covariance matrix as real structure, when pure noise produces a wide spread.",
  },
  steps: [
    {
      type: "motivate",
      title: "More questions than answers",
      body: "A study measures 20,000 gene activities in 100 patients. A regression on all genes has 20,000 unknowns and 100 equations: infinitely many perfect fits. Yet if only a dozen genes really matter, the problem is solvable, provided we search sensibly and are honest about the search when we report the results.",
      realWorld: {
        title: "Genome-wide studies",
        body: "Genome-wide association studies test about a million genetic variants. They use a significance threshold of $5 \\times 10^{-8}$ and insist on replication in independent samples, after early findings selected from the same data repeatedly failed to replicate.",
      },
    },
    {
      type: "truth",
      statement: "The **lasso** minimises $\\tfrac12\\lvert\\vec y - X\\vec\\beta\\rvert^2 + \\lambda\\lvert\\vec\\beta\\rvert_1$; with orthonormal columns its solution is the **soft-thresholded** least-squares estimate, $\\hat\\beta_j = S_\\lambda(z_j)$, so small coefficients become exactly 0 (§{regularization}). Under sparsity and conditions on $X$, its error satisfies $\\lvert\\hat{\\vec\\beta} - \\vec\\beta\\rvert^2 \\lesssim \\sigma^2\\dfrac{s\\log p}{n}$: only logarithmic in $p$. **Random matrix theory**: if $p/n \\to \\gamma \\in (0, 1]$ and the true covariance is $I$, the sample covariance's eigenvalues spread over $[(1 - \\sqrt\\gamma)^2, (1 + \\sqrt\\gamma)^2]$ (Marchenko–Pastur), not all near 1.",
      body: "**Selective inference**: if variables are chosen because they look strong (lasso, stepwise, screening), their naive p-values are too small and their estimates too large (the winner's curse). Valid options: **sample splitting** (select on one half, test on the other), conditional post-selection methods that adjust for the selection event, or controlling the false discovery rate over all candidates (§{multiple-testing}). For PCA in high dimensions (§{pca}), eigenvalues inside the Marchenko–Pastur range are consistent with noise; only those clearly above $(1 + \\sqrt\\gamma)^2$ signal structure. Shrinking the sample covariance (Ledoit–Wolf) improves its estimates.",
    },
    {
      type: "predict",
      misconception: "select-then-infer",
      item: {
        kind: "mc",
        id: "hdi-predict-1",
        prompt: "From 1,000 candidate predictors of pure noise, the 10 most correlated with the outcome are refitted by ordinary regression on the same data. Their p-values will typically be",
        options: [
          { id: "a", text: "misleadingly small: they were chosen for looking significant", correct: true, why: "Selection guarantees extreme-looking statistics." },
          { id: "b", text: "valid, since the final regression is standard", misconception: "select-then-infer", why: "The regression doesn't know about the search." },
          { id: "c", text: "all near 1", why: "They are the most extreme of 1,000." },
        ],
      },
      reveal: {
        body: "Among 1,000 noise variables, about 50 will have p below 0.05 by chance, and the top 10 will look very significant. Refitting them on the same data reports that selected strength as if it had been predicted in advance. Test the selected variables on fresh data (or a held-out half), or use post-selection inference that conditions on the selection.",
      },
      resolve: {
        kind: "mc",
        id: "hdi-resolve-1",
        prompt: "After choosing variables by the lasso, valid p-values for them come from",
        options: [
          { id: "a", text: "a separate sample or a selective-inference method", correct: true, why: "Either removes the selection bias." },
          { id: "b", text: "an ordinary regression on the same data", misconception: "select-then-infer", why: "That ignores the selection." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hdi-check-1",
        prompt: "$n = 200$ observations of $p = 100$ independent standard normal variables (true covariance $I$). The largest sample eigenvalue is about",
        options: [
          { id: "a", text: "2.9, from noise alone", correct: true, why: "$(1 + \\sqrt{0.5})^2 \\approx 2.91$." },
          { id: "b", text: "1, the true value; a larger one would show real structure", misconception: "sample-eigen-true", why: "Sample eigenvalues spread widely when $p/n$ isn't small." },
          { id: "c", text: "100", why: "Far too large." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hdi-check-2",
        prompt: "With orthonormal predictors, least-squares estimates 2.5, −0.6 and 1.2 and $\\lambda = 1$, the lasso estimates are",
        options: [
          { id: "a", text: "1.5, 0 and 0.2", correct: true, why: "Soft-threshold each by 1." },
          { id: "b", text: "2.5, 0 and 1.2", why: "That is hard thresholding." },
          { id: "c", text: "1.25, −0.3 and 0.6", why: "That is ridge-style proportional shrinkage." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Modern models often have more parameters than training examples, yet generalise: implicit regularisation and \"double descent\" are active research areas linking to this theory. Random matrix results explain the spectra of weight and covariance matrices in wide networks, and sparse methods remain the default for interpretable models on wide data.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "hdi-produce-1", prompt: "Soft-threshold $z = -1.8$ at $\\lambda = 0.5$.", answer: -1.3, explain: "$-(1.8 - 0.5)$." },
        { kind: "number", id: "hdi-produce-2", prompt: "$p/n = 0.25$ with identity covariance. Find the Marchenko–Pastur upper edge $(1 + \\sqrt\\gamma)^2$.", answer: 2.25, explain: "$1.5^2$." },
        {
          kind: "mc",
          id: "hdi-produce-3",
          prompt: "A stepwise regression picks 5 of 300 features and reports p < 0.001 for each, all on one dataset. The p-values are",
          options: [
            { id: "a", text: "not trustworthy: validate on new data", correct: true, why: "Selection inflates significance." },
            { id: "b", text: "trustworthy, being below 0.001", misconception: "select-then-infer", why: "Small p-values are expected after a search." },
          ],
        },
        {
          kind: "mc",
          id: "hdi-produce-4",
          prompt: "With $p = 500$ and $n = 600$, a PCA's first eigenvalue is 3.5 times the average. Before calling it a real factor, compare it with",
          options: [
            { id: "a", text: "the noise edge $(1 + \\sqrt{p/n})^2 \\approx 3.7$", correct: true, why: "Noise alone reaches about 3.7 here." },
            { id: "b", text: "nothing: anything above 1 is real structure", misconception: "sample-eigen-true", why: "Noise spreads eigenvalues up to about 3.7." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "hdi-review-1", prompt: "Soft-threshold $z = 0.4$ at $\\lambda = 0.5$.", answer: 0, explain: "$\\lvert z\\rvert < \\lambda$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "regimes and rates",
      body: "Classical asymptotics fix $p$ and let $n \\to \\infty$. High-dimensional theory lets $p$ grow with $n$, even $p \\gg n$. Least squares needs $p < n$ and its error grows like $\\sigma^2p/n$. With $s$-sparse truth, the lasso achieves $\\sigma^2s\\log p/n$, and an oracle that knew the support would get $\\sigma^2s/n$: the $\\log p$ factor is the price of searching.",
    },
    {
      type: "definition",
      term: "the winner's curse",
      body: "Effects selected because their estimates were largest are biased upwards: part of what made them stand out was noise. Selected effects shrink on replication. Correct by estimating on independent data, by shrinkage (empirical Bayes, §{hierarchical-models}), or by conditional maximum likelihood that accounts for the selection.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the lasso with orthonormal predictors",
      statement: "If $X^{\\mathsf T}X = I$, the lasso solution is $\\hat\\beta_j = S_\\lambda(z_j)$ with $\\vec z = X^{\\mathsf T}\\vec y$, the least-squares estimate.",
      proof: ["The objective separates into $\\tfrac12(z_j - \\beta_j)^2 + \\lambda\\lvert\\beta_j\\rvert$ for each $j$; minimising each one-dimensional problem gives soft-thresholding."],
    },
    {
      type: "theorem",
      name: "Marchenko–Pastur",
      statement: "If the rows of $X$ ($n \\times p$) are independent with covariance $I$ and $p/n \\to \\gamma \\in (0, 1]$, the eigenvalues of $\\tfrac1nX^{\\mathsf T}X$ fill $[(1 - \\sqrt\\gamma)^2, (1 + \\sqrt\\gamma)^2]$ with the Marchenko–Pastur density.",
      proof: ["Proved by the moment method or Stieltjes transforms; the spread arises because $p$ noisy directions are estimated from only $n$ samples."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "honest inference after selection",
      statement: "Decide in advance how variables will be selected; then either split the sample, use a post-selection method, or report the selection as exploratory and replicate. Never present data-chosen effects with naive intervals.",
      proof: ["Each option makes the reported uncertainty account for the search."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Orthonormal design, least-squares estimates $(3, -0.4, 1.2, -2)$, $\\lambda = 1$. Find the lasso estimates.",
      solution: ["Shrink each by 1 towards 0, stopping at 0.", "$(2, 0, 0.2, -1)$."],
      result: "$(2, 0, 0.2, -1)$: one coefficient is set exactly to 0.",
    },
    {
      type: "example",
      level: 2,
      title: "noise eigenvalues",
      problem: "$n = 400$, $p = 100$, identity covariance. Where do the sample eigenvalues lie?",
      solution: ["$\\gamma = 0.25$, $\\sqrt\\gamma = 0.5$.", "$[(0.5)^2, (1.5)^2] = [0.25, 2.25]$, though every true eigenvalue is 1."],
      result: "Between 0.25 and 2.25.",
    },
    {
      type: "example",
      level: 3,
      title: "sample splitting",
      problem: "Lasso on the first half of 1,000 patients selects 8 genes. On the second half, ordinary regression on those 8 gives p-values. Are they valid?",
      solution: ["Yes for those 8 genes: the second half played no part in choosing them.", "The cost is power, since each stage uses only half the data."],
      result: "Valid, at the cost of power.",
    },
  ],
  pitfalls: [
    { wrong: "Report naive p-values for selected variables.", right: "Split, use selective inference, or replicate." },
    { wrong: "Large sample eigenvalues mean real factors.", right: "Compare with the Marchenko–Pastur edge." },
    { wrong: "Use least squares with $p$ close to $n$.", right: "Regularise; its variance explodes." },
  ],
  formulas: [
    { label: "Lasso", tex: "\\tfrac12\\lvert\\vec y - X\\vec\\beta\\rvert^2 + \\lambda\\lvert\\vec\\beta\\rvert_1" },
    { label: "Soft threshold", tex: "S_\\lambda(z) = \\operatorname{sign}(z)(\\lvert z\\rvert - \\lambda)_+" },
    { label: "Sparse rate", tex: "\\sigma^2s\\log p/n" },
    { label: "Marchenko–Pastur", tex: "[(1 - \\sqrt\\gamma)^2, (1 + \\sqrt\\gamma)^2]" },
  ],
  exercises: [
    ex(1, num("hdix-ex-1", "Soft-threshold $z = 2.5$ at $\\lambda = 1$.", 1.5, "$2.5 - 1$."), ["$1.5$."]),
    ex(1, num("hdix-ex-2", "Soft-threshold $z = -0.7$ at $\\lambda = 1$.", 0, "$\\lvert z\\rvert < \\lambda$."), ["$0$."]),
    ex(2, dp("hdix-ex-3", "$p = 50$, $n = 100$, identity covariance. Find the Marchenko–Pastur lower edge.", mp(0.5)[0], "$(1 - \\sqrt{0.5})^2$."), ["$\\approx 0.086$."]),
    ex(2, dp("hdix-ex-4", "Same setting. Find the upper edge.", mp(0.5)[1], "$(1 + \\sqrt{0.5})^2$."), ["$\\approx 2.914$."]),
    ex(2, num("hdix-ex-5", "1,000 independent null tests at 5%. How many are expected to be significant by chance?", 50, "$1000 \\times 0.05$."), ["$50$."]),
    ex(3, dp("hdix-ex-6", "Ratio of the lasso rate $s\\log p/n$ to the oracle rate $s/n$ for $p = 10{,}000$.", Math.log(10000), "$\\log p$."), ["$\\ln 10^4 \\approx 9.210$."]),
    ex(3, mc("hdix-ex-7", "A gene's effect was the largest of 20,000 estimated in a screening study. In a replication study its estimate will most likely be", ["smaller", "The winner's curse."], [["larger", "Selection favoured upward noise."], ["the same", "Regression to the mean shrinks it."]]), ["Plan replication sample sizes for the shrunken effect."]),
    ex(3, mc("hdix-ex-8", "With $p = 5{,}000$ and $n = 100$, ordinary least squares is", ["not unique: infinitely many coefficient vectors fit perfectly", "$X^{\\mathsf T}X$ is singular."], [["unbiased and efficient", "It isn't even defined uniquely."], ["the same as the lasso", "The lasso adds a penalty."]]), ["Regularise: lasso, ridge or elastic net."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const z = r2(r.nonzero(-30, 30) / 10);
      const l = r.pick([0.5, 1, 1.5, 2]);
      const v = soft(z, l);
      return n(`Soft-threshold $z = ${z}$ at $\\lambda = ${l}$.`, r2(v) === 0 ? 0 : r2(v), Math.abs(z) <= l ? `$\\lvert z\\rvert \\le \\lambda$, so 0.` : `$\\operatorname{sign}(z)(\\lvert z\\rvert - \\lambda) = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([100, 200, 400, 500, 1000]);
      const g = r.pick([0.1, 0.25, 0.5, 0.8, 1]);
      const p = Math.round(nn * g);
      const [lo, hi] = mp(p / nn);
      const want = r.pick(["upper", "lower"] as const);
      const v = want === "upper" ? hi : lo;
      return n(`$n = ${nn}$ observations of $p = ${p}$ independent unit-variance variables. Find the Marchenko–Pastur ${want} edge of the sample eigenvalues (3 decimals).`, Math.round(v * 1000) / 1000, `$\\gamma = ${r2(p / nn)}$; $(1 ${want === "upper" ? "+" : "-"} \\sqrt\\gamma)^2 \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.pick([500, 1000, 5000, 20000]);
      const k = r.pick([5, 8, 10, 12]);
      return mcNumbers(
        `${k} of ${p.toLocaleString("en-US")} candidate features were chosen by the lasso, then refitted by ordinary regression on the same data, giving small p-values. These p-values are`,
        { text: "too optimistic; confirm on held-out data", why: "The features were selected for looking strong." },
        [{ text: "valid", why: "Ordinary p-values ignore the selection.", misconception: "select-then-infer" }],
      );
    },
  },
];
