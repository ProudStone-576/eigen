import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mahalanobis distance, multivariate outliers, Hotelling's T², multivariate testing and MANOVA, checking multivariate normality. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const M = (a: number | string, b: number | string, c: number | string, d: number | string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const maha2 = (x: number, y: number, s11: number, s12: number, s22: number) => {
  const det = s11 * s22 - s12 * s12;
  return (s22 * x * x - 2 * s12 * x * y + s11 * y * y) / det;
};

const base: ConceptNode = {
  id: "mahalanobis",
  title: "Mahalanobis distance & Hotelling's T²",
  summary: "Distance in multivariate data should account for each variable's spread and for correlations. The Mahalanobis distance d² = (x − μ)ᵀΣ⁻¹(x − μ) does both, and for normal data follows χ² on p degrees of freedom, which flags outliers. Hotelling's T² is the multivariate t-test: it compares a mean vector with a hypothesised one in a single test.",
  deps: ["multivariate-normal", "sampling-distributions", "one-way-anova"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "Mahalanobis distance", meaning: "Distance measured in standard deviations along the data's own correlated axes." },
    { term: "Hotelling's T²", meaning: "$n(\\bar{\\vec x} - \\vec\\mu_0)^{\\mathsf T}S^{-1}(\\bar{\\vec x} - \\vec\\mu_0)$, testing a mean vector." },
    { term: "multivariate outlier", meaning: "A point unusual in its combination of values, even if no single value is extreme." },
  ],
  misconceptions: {
    "euclidean-ignores-correlation": "Judges how unusual a point is by Euclidean distance, ignoring the variables' scales and correlations.",
    "separate-tests-multivariate": "Runs a separate t-test for each variable instead of one multivariate test, inflating errors and missing differences that show only jointly.",
  },
  steps: [
    {
      type: "motivate",
      title: "Unusual together",
      body: "A 190 cm person is tall but not rare; a 45 kg adult is light but not rare. A 190 cm person weighing 45 kg is extremely rare. Neither number alone is extreme; the combination is, because height and weight are correlated. A distance that knows about the correlation flags it.",
      realWorld: {
        title: "Fraud detection",
        body: "Card transactions are flagged when their combination of amount, time, place and merchant is unusual for the customer, even if each value alone looks ordinary. Mahalanobis distance to the customer's typical behaviour is a classic score.",
      },
    },
    {
      type: "truth",
      statement: "For mean $\\vec\\mu$ and covariance $\\Sigma$, the **Mahalanobis distance** is $d^2 = (\\vec x - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec x - \\vec\\mu)$; for $N(\\vec\\mu, \\Sigma)$ in $p$ dimensions, $d^2 \\sim \\chi^2_p$. **Hotelling's** $T^2 = n(\\bar{\\vec x} - \\vec\\mu_0)^{\\mathsf T}S^{-1}(\\bar{\\vec x} - \\vec\\mu_0)$, and $\\dfrac{n - p}{p(n - 1)}T^2 \\sim F_{p,\\,n-p}$ under $H_0: \\vec\\mu = \\vec\\mu_0$.",
      body: "With uncorrelated variables, $d^2$ is just the sum of squared z-scores; correlation stretches the contours into ellipses (§{multivariate-normal}). One $T^2$ test controls the error rate across all $p$ variables and can detect a shift in a direction no single variable reveals. **MANOVA** extends it to several groups.",
    },
    {
      type: "predict",
      misconception: "euclidean-ignores-correlation",
      item: {
        kind: "mc",
        id: "mah-predict-1",
        prompt: `Standardised variables with correlation 0.8, $\\Sigma = ${M(1, 0.8, 0.8, 1)}$. Points $(1, 1)$ and $(1, -1)$ are equally far from the origin in Euclidean terms. Which is more unusual?`,
        options: [
          { id: "a", text: "$(1, -1)$: it goes against the correlation, $d^2 = 10$ against about 1.1", correct: true, why: "Moving against a strong correlation is rare." },
          { id: "b", text: "Neither: they are the same distance from the centre", misconception: "euclidean-ignores-correlation", why: "Euclidean distance ignores the correlation." },
          { id: "c", text: "$(1, 1)$", why: "It lies along the long axis of the ellipse, where points are common." },
        ],
      },
      reveal: {
        body: `$\\Sigma^{-1} = \\tfrac{1}{0.36}${M(1, -0.8, -0.8, 1)}$. For $(1, 1)$: $d^2 = \\tfrac{1 - 1.6 + 1}{0.36} \\approx 1.11$. For $(1, -1)$: $d^2 = \\tfrac{1 + 1.6 + 1}{0.36} = 10$. With a strong positive correlation, a point that is high on one variable and low on the other is far outside the data cloud's ellipse.`,
      },
      resolve: {
        kind: "mc",
        id: "mah-resolve-1",
        prompt: "Why use Mahalanobis rather than Euclidean distance to find outliers?",
        options: [
          { id: "a", text: "It allows for each variable's spread and the correlations between them", correct: true, why: "It measures distance in the data's own units." },
          { id: "b", text: "There is no need: Euclidean distance works for any data", misconception: "euclidean-ignores-correlation", why: "It treats a kilogram and a centimetre as the same and ignores correlation." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mah-check-1",
        prompt: "A treatment is compared with a target on 10 blood measurements. Running 10 separate t-tests at 5%",
        options: [
          { id: "a", text: "inflates the false-positive rate and can miss a joint shift; Hotelling's $T^2$ tests all 10 at once", correct: true, why: "One test, one error budget, using the correlations." },
          { id: "b", text: "is equivalent to one multivariate test", misconception: "separate-tests-multivariate", why: "Ten tests give ten chances of a false alarm." },
          { id: "c", text: "is impossible", why: "It is possible, just poor practice." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mah-check-2",
        prompt: "For 3-dimensional normal data, the squared Mahalanobis distance follows",
        options: [
          { id: "a", text: "$\\chi^2_3$", correct: true, why: "A sum of 3 squared standard normals after whitening." },
          { id: "b", text: "$N(0, 3)$", why: "It is a sum of squares, so non-negative." },
          { id: "c", text: "$t_3$", why: "It is χ²." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Anomaly detectors often score points by Mahalanobis distance to the training distribution, or to a class's mean in a neural network's feature space, a common way to flag inputs unlike anything seen in training. Whitening the features first makes Euclidean distance equal Mahalanobis distance.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mah-produce-1", prompt: "Uncorrelated variables with variances 4 and 1, mean $\\vec 0$. Find $d^2$ for the point $(2, 2)$.", answer: 5, explain: "$4/4 + 4/1$." },
        { kind: "number", id: "mah-produce-2", prompt: "$n = 20$, $p = 2$ and $T^2 = 12$. Find the equivalent F statistic to 3 decimals.", answer: Math.round(((18 / (2 * 19)) * 12) * 1000) / 1000, tolerance: 0.001, explain: "$\\tfrac{n - p}{p(n - 1)}T^2 = \\tfrac{18}{38} \\times 12$." },
        {
          kind: "mc",
          id: "mah-produce-3",
          prompt: "Comparing two groups on 6 correlated outcomes, the better approach is",
          options: [
            { id: "a", text: "one multivariate test (Hotelling's $T^2$ or MANOVA)", correct: true, why: "It controls error and uses the correlations." },
            { id: "b", text: "six separate t-tests at 5%", misconception: "separate-tests-multivariate", why: "That inflates false positives." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mah-review-1", prompt: "Uncorrelated variables with variances 9 and 4, mean $\\vec 0$. Find $d^2$ for $(3, 2)$.", answer: 2, explain: "$9/9 + 4/4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "checking multivariate normality",
      body: "For multivariate normal data, the squared Mahalanobis distances of the points from the sample mean should look like a $\\chi^2_p$ sample: plot them against $\\chi^2_p$ quantiles (a χ² Q-Q plot) and look for a straight line. Each variable being normal is necessary but not sufficient (§{multivariate-normal}).",
    },
    {
      type: "definition",
      term: "MANOVA",
      body: "**Multivariate analysis of variance** compares the mean vectors of several groups. It splits the total sums-of-squares-and-products matrix into between and within parts, $T = B + W$, and tests with statistics such as **Wilks' lambda** $\\Lambda = \\dfrac{|W|}{|B + W|}$: small values mean the groups differ.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "uncorrelated case",
      statement: "If $\\Sigma$ is diagonal with variances $\\sigma_1^2, \\dots, \\sigma_p^2$, then $d^2 = \\sum_i\\dfrac{(x_i - \\mu_i)^2}{\\sigma_i^2}$, the sum of squared z-scores.",
      proof: ["$\\Sigma^{-1}$ is diagonal with entries $1/\\sigma_i^2$."],
    },
    {
      type: "theorem",
      name: "why d² is χ²",
      statement: "If $\\vec X \\sim N(\\vec\\mu, \\Sigma)$, then $(\\vec X - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec X - \\vec\\mu) \\sim \\chi^2_p$.",
      proof: ["Let $\\vec Z = \\Sigma^{-1/2}(\\vec X - \\vec\\mu)$; then $\\vec Z \\sim N(\\vec 0, I)$ (§{multivariate-normal}) and $d^2 = |\\vec Z|^2$, a sum of $p$ independent squared standard normals (§{sampling-distributions})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "Hotelling's T² as F",
      statement: "Under $H_0$ for a normal sample, $\\dfrac{n - p}{p(n - 1)}T^2 \\sim F_{p,\\,n-p}$. With $p = 1$, $T^2 = t^2$.",
      proof: ["The derivation parallels the univariate case, using the Wishart distribution of the sample covariance matrix; for $p = 1$, $T^2 = n(\\bar x - \\mu_0)^2/s^2$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Height and weight are uncorrelated here, with SDs 10 cm and 8 kg. Find $d^2$ for a person 15 cm and 12 kg above average.",
      solution: ["z-scores 1.5 and 1.5.", "$d^2 = 2.25 + 2.25 = 4.5$."],
      result: "$d^2 = 4.5$.",
    },
    {
      type: "example",
      level: 2,
      title: "an outlier cut-off",
      problem: "For bivariate normal data, which $d^2$ marks the most extreme 5% of points? ($\\chi^2_2$'s upper 5% point is 5.99.)",
      solution: ["$d^2 \\sim \\chi^2_2$.", "Flag points with $d^2 > 5.99$."],
      result: "$d^2 > 5.99$.",
    },
    {
      type: "example",
      level: 3,
      title: "a multivariate test",
      problem: "20 patients on 2 measures give $T^2 = 12$ against the target means. Test at 5% (upper 5% point of $F_{2, 18}$ is 3.55).",
      solution: ["$F = \\tfrac{18}{2 \\times 19} \\times 12 \\approx 5.68$ on $(2, 18)$ d.f.", "$5.68 > 3.55$: the mean vector differs from the target."],
      result: "Reject $H_0$.",
    },
  ],
  pitfalls: [
    { wrong: "Use Euclidean distance on raw, correlated variables.", right: "Use Mahalanobis distance, or standardise and decorrelate first." },
    { wrong: "Test each variable separately.", right: "Use one multivariate test, then follow up." },
    { wrong: "Each variable is normal, so the data are multivariate normal.", right: "Check the χ² Q-Q plot of the $d^2$ values." },
  ],
  formulas: [
    { label: "Mahalanobis", tex: "d^2 = (\\vec x - \\vec\\mu)^{\\mathsf T}\\Sigma^{-1}(\\vec x - \\vec\\mu) \\sim \\chi^2_p" },
    { label: "Hotelling", tex: "T^2 = n(\\bar{\\vec x} - \\vec\\mu_0)^{\\mathsf T}S^{-1}(\\bar{\\vec x} - \\vec\\mu_0)" },
    { label: "As F", tex: "\\tfrac{n - p}{p(n - 1)}T^2 \\sim F_{p, n-p}" },
    { label: "Wilks' lambda", tex: "\\Lambda = |W|/|B + W|" },
  ],
  exercises: [
    ex(1, num("mahx-ex-1", "Uncorrelated, variances 1 and 4, mean $\\vec 0$. Find $d^2$ for $(3, 4)$.", 13, "$9 + 4$."), ["$9/1 + 16/4 = 13$."]),
    ex(1, num("mahx-ex-2", "For 4-dimensional normal data, what is the mean of $d^2$?", 4, "Mean of $\\chi^2_4$."), ["$4$."]),
    ex(2, dp("mahx-ex-3", `$\\Sigma = ${M(1, 0.5, 0.5, 1)}$, mean $\\vec 0$. Find $d^2$ for $(1, -1)$.`, maha2(1, -1, 1, 0.5, 1), "$\\tfrac{x^2 - 2\\rho xy + y^2}{1 - \\rho^2}$."), ["$\\dfrac{1 + 1 + 1}{0.75} = 4$."]),
    ex(2, dp("mahx-ex-4", "Same $\\Sigma$. Find $d^2$ for $(1, 1)$.", maha2(1, 1, 1, 0.5, 1), "Same formula."), ["$\\dfrac{1 - 1 + 1}{0.75} \\approx 1.333$."]),
    ex(2, dp("mahx-ex-5", "$n = 30$, $p = 3$ and $T^2 = 10$. Find the F statistic.", (27 / (3 * 29)) * 10, "$\\tfrac{n - p}{p(n - 1)}T^2$."), ["$\\tfrac{27}{87} \\times 10 \\approx 3.103$."]),
    ex(3, num("mahx-ex-6", "With $p = 1$, Hotelling's $T^2 = 6.25$. Find $|t|$.", 2.5, "$T^2 = t^2$."), ["$2.5$."]),
    ex(3, mc("mahx-ex-7", "A point has $d^2 = 12$ in 2-dimensional normal data (upper 0.1% point of $\\chi^2_2$ is 13.8; upper 1% is 9.21). It is", ["unusual, beyond the 1% cut-off", "$9.21 < 12 < 13.8$."], [["typical", "Most points have $d^2$ below 6."], ["impossible", "It is rare, not impossible."]]), ["About 0.25% of points would be this far out."]),
    ex(3, mc("mahx-ex-8", "Wilks' lambda from a MANOVA is 0.95. This suggests", ["little difference between the group mean vectors", "$|W|$ is close to $|B + W|$."], [["strong group differences", "Strong differences make lambda small."], ["a calculation error", "Lambda between 0 and 1 is normal."]]), ["Lambda near 1 means most variation is within groups."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const v1 = r.pick([1, 4, 9, 16]);
      const v2 = r.pick([1, 4, 9, 25]);
      const x = r.int(-4, 4);
      const y = r.int(-4, 4) || 1;
      const rho = lv === 3 ? r.pick([0.5, -0.5, 0.6]) : 0;
      const s12 = rho * Math.sqrt(v1 * v2);
      const d = maha2(x, y, v1, s12, v2);
      return n(`Mean $\\vec 0$ and covariance matrix $${M(v1, r2(s12), r2(s12), v2)}$. Find the squared Mahalanobis distance of $(${x}, ${y})$ (3 decimals).`, Math.round(d * 1000) / 1000, rho === 0 ? `$${x * x}/${v1} + ${y * y}/${v2} \\approx ${Math.round(d * 1000) / 1000}$.` : `$\\dfrac{${v2}x^2 - 2(${r2(s12)})xy + ${v1}y^2}{${r2(v1 * v2 - s12 * s12)}} \\approx ${Math.round(d * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([15, 20, 25, 30, 40]);
      const p = r.int(2, 4);
      const t2 = r.int(4, 30);
      const f = ((nn - p) / (p * (nn - 1))) * t2;
      return n(`$n = ${nn}$, $p = ${p}$ and $T^2 = ${t2}$. Find the equivalent F statistic (3 decimals).`, Math.round(f * 1000) / 1000, `$\\tfrac{${nn - p}}{${p} \\times ${nn - 1}} \\times ${t2} \\approx ${Math.round(f * 1000) / 1000}$ on $(${p}, ${nn - p})$ d.f.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const rho = r.pick([0.7, 0.8, 0.9]);
      return mcNumbers(
        `Two standardised variables have correlation ${rho}. Which point is more unusual: $(1.5, 1.5)$ or $(1.5, -1.5)$?`,
        { text: "$(1.5, -1.5)$", why: "It goes against the strong positive correlation." },
        [
          { text: "They are equally unusual", why: "Euclidean distance ignores the correlation.", misconception: "euclidean-ignores-correlation" },
          { text: "$(1.5, 1.5)$", why: "It lies along the long axis of the data's ellipse." },
        ],
      );
    },
  },
];
