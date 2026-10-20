import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Nonparametric estimation: kernel density estimation, bandwidth and the bias–variance trade-off, rules of thumb and cross-validation, kernel (Nadaraya–Watson) and local regression. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const phi = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
const kdeAt = (xs: number[], h: number, x: number) => xs.reduce((s, xi) => s + phi((x - xi) / h), 0) / (xs.length * h);

const base: ConceptNode = {
  id: "kde",
  title: "Kernel density & kernel regression",
  summary: "Nonparametric methods estimate a density or a regression curve without assuming a formula for it. A kernel density estimate places a small bump at every observation and adds them up; kernel regression averages the responses of nearby points. Everything hinges on the bandwidth: too small and the estimate follows noise, too large and it blurs away real features.",
  deps: ["bias-variance", "normal", "frequency-tables"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "kernel", meaning: "A symmetric bump $K$ integrating to 1, such as the standard normal density." },
    { term: "bandwidth", meaning: "$h$: the width of each bump, which sets how much the estimate smooths." },
    { term: "nonparametric", meaning: "Not restricted to a family indexed by a fixed, finite number of parameters." },
  ],
  misconceptions: {
    "kernel-shape-matters": "Thinks the choice of kernel shape matters more than the choice of bandwidth.",
    "small-h-better": "Thinks a smaller bandwidth is always more accurate because it follows the data more closely.",
  },
  steps: [
    {
      type: "motivate",
      title: "A smooth histogram",
      body: "A histogram depends on where its bins start and how wide they are, and it is jagged. Imagine instead dropping a small sand-pile on each data point; the total pile is smooth and has no arbitrary bin edges. That is a kernel density estimate. The same idea, averaging nearby responses with weights that fade with distance, gives a smooth regression curve without choosing a formula.",
      realWorld: {
        title: "Crime and disease maps",
        body: "Heat maps of crime reports, disease cases or taxi pickups are usually two-dimensional kernel density estimates: each event spreads a little probability over its neighbourhood, and the bandwidth decides whether you see streets or districts.",
      },
    },
    {
      type: "truth",
      statement: "The **kernel density estimate** is $\\hat f_h(x) = \\dfrac{1}{nh}\\sum_{i=1}^nK\\!\\left(\\dfrac{x - x_i}{h}\\right)$. Its bias is about $\\tfrac12h^2f''(x)\\int u^2K(u)\\,du$ and its variance about $\\dfrac{f(x)\\int K^2}{nh}$: shrinking $h$ cuts bias and raises variance (§{bias-variance}). Balancing them gives $h \\propto n^{-1/5}$ and mean integrated squared error $\\propto n^{-4/5}$, slower than the $n^{-1}$ of parametric models. **Silverman's rule** for a normal kernel: $h = 0.9\\min(\\hat\\sigma, \\text{IQR}/1.34)\\,n^{-1/5}$.",
      body: "The kernel's shape (normal, Epanechnikov, triangular) matters little; the bandwidth matters a lot. Choose it by a rule of thumb, or by **cross-validation**: leave each point out and score how well the rest predict it. **Kernel regression** (Nadaraya–Watson) estimates $E[Y \\mid X = x]$ by $\\hat m(x) = \\dfrac{\\sum K((x - x_i)/h)y_i}{\\sum K((x - x_i)/h)}$, a weighted average of nearby responses; **local linear** regression (and LOESS) fits a weighted line around each $x$, reducing bias near the edges. In many dimensions both suffer the curse of dimensionality.",
    },
    {
      type: "predict",
      misconception: "small-h-better",
      item: {
        kind: "mc",
        id: "kde-predict-1",
        prompt: "A KDE of 200 exam marks with bandwidth 0.1 mark shows dozens of sharp spikes; with bandwidth 4 it shows one smooth hump with a shoulder. The true distribution is more likely shaped like",
        options: [
          { id: "a", text: "the smoother estimate: the spikes are sampling noise at each observed value", correct: true, why: "A tiny bandwidth has huge variance." },
          { id: "b", text: "the spiky estimate, because a small bandwidth follows the data more faithfully", misconception: "small-h-better", why: "Following the sample closely means following its noise." },
          { id: "c", text: "neither: a KDE can't estimate a shape", why: "It can, given a sensible bandwidth." },
        ],
      },
      reveal: {
        body: "As $h \\to 0$, the KDE becomes a spike at each data point: zero bias in a sense, but enormous variance, and a new sample would put the spikes elsewhere. The variance term $f(x)\\int K^2/(nh)$ blows up. Good bandwidths balance it against the $h^2$ bias; cross-validation or Silverman's rule (about 3 marks for SD 10 and $n = 200$) finds that balance.",
      },
      resolve: {
        kind: "mc",
        id: "kde-resolve-1",
        prompt: "Making the bandwidth very small",
        options: [
          { id: "a", text: "reduces bias but inflates variance, giving a spiky estimate", correct: true, why: "The bias–variance trade-off." },
          { id: "b", text: "always improves accuracy", misconception: "small-h-better", why: "Variance grows like $1/(nh)$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kde-check-1",
        prompt: "Two analysts estimate the same density, one with a normal kernel and one with an Epanechnikov kernel, both with well-chosen bandwidths. Their estimates will be",
        options: [
          { id: "a", text: "nearly identical: the kernel shape matters far less than the bandwidth", correct: true, why: "Efficiencies of common kernels differ by a few percent." },
          { id: "b", text: "very different, since the kernel decides the estimate", misconception: "kernel-shape-matters", why: "With matched bandwidths, kernels give similar results." },
          { id: "c", text: "identical", why: "Close, not exactly equal." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kde-check-2",
        prompt: "Doubling the sample size, the optimal KDE bandwidth changes by a factor of about",
        options: [
          { id: "a", text: "0.87", correct: true, why: "$2^{-1/5}$." },
          { id: "b", text: "0.5", why: "$h \\propto n^{-1/5}$, not $n^{-1}$." },
          { id: "c", text: "0.71", why: "That is $2^{-1/2}$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Kernel density estimates drive anomaly detection (flag low-density points), mean-shift clustering (climb the density to its modes) and smooth class-conditional densities for classification. Attention in transformers is, mathematically, a Nadaraya–Watson kernel regression with learned similarity.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "kde-produce-1", prompt: "Silverman-type rule $h = 1.06\\,\\hat\\sigma\\,n^{-1/5}$ with $\\hat\\sigma = 10$ and $n = 100$. Find $h$ to 2 decimals.", answer: r2(1.06 * 10 * 100 ** -0.2), tolerance: 0.01, explain: "$10.6 \\times 100^{-0.2}$." },
        { kind: "number", id: "kde-produce-2", prompt: "Box-kernel regression with window $\\lvert x - x_i\\rvert \\le 1.5$: points (1, 2), (2, 4), (3, 3), (6, 10). Find $\\hat m(2)$.", answer: 3, explain: "Average of 2, 4, 3." },
        {
          kind: "mc",
          id: "kde-produce-3",
          prompt: "A KDE looks too wiggly. The most effective fix is",
          options: [
            { id: "a", text: "increase the bandwidth", correct: true, why: "Bandwidth controls smoothness." },
            { id: "b", text: "switch to a different kernel shape", misconception: "kernel-shape-matters", why: "Shape has little effect at the same bandwidth." },
          ],
        },
        {
          kind: "mc",
          id: "kde-produce-4",
          prompt: "Cross-validation picks a bandwidth larger than the smallest one tried. This is because",
          options: [
            { id: "a", text: "the smallest bandwidth overfits: its variance outweighs its small bias", correct: true, why: "Held-out points reveal the noise." },
            { id: "b", text: "cross-validation failed, since smaller is always better", misconception: "small-h-better", why: "Smaller bandwidths overfit." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "kde-review-1", prompt: "A box kernel with $h = 1$ puts height $\\tfrac{1}{2nh}$ within distance $h$ of each point. With $n = 5$ and 2 points within 1 of $x$, find $\\hat f(x)$.", answer: 0.2, explain: "$2/(2 \\times 5 \\times 1)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "choosing the bandwidth",
      body: "**Rules of thumb**: $h = 1.06\\hat\\sigma n^{-1/5}$ is optimal if the data are normal; Silverman's $0.9\\min(\\hat\\sigma, \\text{IQR}/1.34)n^{-1/5}$ is safer for skewed or bimodal data. **Least-squares cross-validation** minimises an estimate of the integrated squared error using leave-one-out densities $\\hat f_{-i}(x_i)$; **likelihood cross-validation** maximises $\\sum\\ln\\hat f_{-i}(x_i)$. **Plug-in** methods estimate the unknown $f''$ in the optimal-bandwidth formula.",
    },
    {
      type: "definition",
      term: "local linear regression",
      body: "At each target $x$, fit $y \\approx a + b(x_i - x)$ by weighted least squares with weights $K((x_i - x)/h)$, and report $\\hat m(x) = \\hat a$. Unlike Nadaraya–Watson, it has no first-order bias at the boundaries or where the $x_i$ are unevenly spread. LOESS uses a nearest-neighbour bandwidth and a tricube kernel, often with robustness reweighting.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "a KDE is a density",
      statement: "If $K \\ge 0$ and $\\int K = 1$, then $\\hat f_h \\ge 0$ and $\\int\\hat f_h(x)\\,dx = 1$.",
      proof: ["Each term $\\tfrac1hK((x - x_i)/h)$ integrates to 1 by substituting $u = (x - x_i)/h$; average $n$ of them."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "optimal bandwidth rate",
      statement: "Minimising $\\text{AMISE}(h) = \\tfrac14h^4\\mu_2^2\\int f''^2 + \\dfrac{\\int K^2}{nh}$ gives $h^* \\propto n^{-1/5}$ and $\\text{AMISE}(h^*) \\propto n^{-4/5}$.",
      proof: ["Differentiate: $h^3\\mu_2^2\\int f''^2 = \\int K^2/(nh^2)$, so $h^5 \\propto 1/n$; substitute back."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "kernels versus bandwidth",
      statement: "Among standard kernels, the Epanechnikov $\\tfrac34(1 - u^2)$ on $\\lvert u\\rvert \\le 1$ minimises AMISE, but the normal kernel is about 95% as efficient and the box kernel about 93%. Spend effort on the bandwidth.",
      proof: ["The kernel enters AMISE only through the constant $(\\mu_2\\int K^2)^{4/5}$, which varies little across kernels."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Data 1, 2, 4 with a normal kernel and $h = 1$. Find $\\hat f(2)$.",
      solution: ["$\\hat f(2) = \\tfrac13[\\phi(1) + \\phi(0) + \\phi(-2)] = \\tfrac13(0.242 + 0.399 + 0.054)$.", "$\\approx 0.232$."],
      result: "About 0.232.",
    },
    {
      type: "example",
      level: 2,
      title: "a rule-of-thumb bandwidth",
      problem: "200 exam marks have SD 10 and IQR 12. Find Silverman's bandwidth.",
      solution: ["$\\min(10, 12/1.34) = \\min(10, 8.96) = 8.96$.", "$h = 0.9 \\times 8.96 \\times 200^{-0.2} \\approx 8.06 \\times 0.346 \\approx 2.79$."],
      result: "About 2.8 marks.",
    },
    {
      type: "example",
      level: 3,
      title: "Nadaraya–Watson",
      problem: "Points (1, 2), (2, 4), (3, 3), (6, 10) and a box kernel of half-width 1.5. Find $\\hat m(2)$ and $\\hat m(5)$.",
      solution: ["$x = 2$: points at 1, 2, 3 lie within 1.5; mean of 2, 4, 3 is 3.", "$x = 5$: only $x_i = 6$ lies within 1.5, so $\\hat m(5) = 10$: sparse regions give jumpy estimates."],
      result: "3 and 10.",
    },
  ],
  pitfalls: [
    { wrong: "A smaller bandwidth is always more accurate.", right: "It trades bias for variance; choose $h$ by cross-validation or a rule." },
    { wrong: "Agonise over the kernel shape.", right: "Bandwidth matters far more." },
    { wrong: "Use KDE in ten dimensions as in one.", right: "The curse of dimensionality makes it data-hungry." },
  ],
  formulas: [
    { label: "KDE", tex: "\\hat f_h(x) = \\dfrac1{nh}\\textstyle\\sum K\\!\\left(\\tfrac{x - x_i}{h}\\right)" },
    { label: "Silverman", tex: "h = 0.9\\min(\\hat\\sigma, \\text{IQR}/1.34)\\,n^{-1/5}" },
    { label: "Nadaraya–Watson", tex: "\\hat m(x) = \\dfrac{\\sum K((x - x_i)/h)y_i}{\\sum K((x - x_i)/h)}" },
    { label: "Rates", tex: "h^* \\propto n^{-1/5},\\ \\text{MISE} \\propto n^{-4/5}" },
  ],
  exercises: [
    ex(1, num("kdex-ex-1", "A box kernel KDE: $n = 10$, $h = 2$, and 4 points lie within 2 of $x$. Find $\\hat f(x) = \\dfrac{\\text{count}}{2nh}$.", 0.1, "$4/40$."), ["$0.1$."]),
    ex(1, num("kdex-ex-2", "Box-kernel regression at $x = 3$ with half-width 1: points (2, 5), (3, 7), (4, 9), (7, 1). Find $\\hat m(3)$.", 7, "Average 5, 7, 9."), ["$7$."]),
    ex(2, dp("kdex-ex-3", "Data 0, 1, 3 with a normal kernel and $h = 1$. Find $\\hat f(1)$.", kdeAt([0, 1, 3], 1, 1), "$\\tfrac13[\\phi(1) + \\phi(0) + \\phi(-2)]$."), ["$\\approx 0.232$."]),
    ex(2, dp("kdex-ex-4", "Find $1.06\\hat\\sigma n^{-1/5}$ for $\\hat\\sigma = 5$ and $n = 32$.", 1.06 * 5 * 32 ** -0.2, "$32^{-1/5} = \\tfrac12$."), ["$2.65$."]),
    ex(2, dp("kdex-ex-5", "The optimal bandwidth is 3 for $n = 100$. Find it for $n = 3200$.", 3 * 32 ** -0.2, "Scale by $32^{-1/5}$."), ["$1.5$."]),
    ex(3, mc("kdex-ex-6", "Near the edge of the data, Nadaraya–Watson regression on a rising trend tends to", ["be biased, because neighbours lie only on one side", "Local linear regression fixes this."], [["be unbiased", "One-sided neighbourhoods bias it towards the interior."], ["become undefined", "It is defined but biased."]]), ["Use local linear or LOESS."]),
    ex(3, mc("kdex-ex-7", "Silverman's rule uses $\\min(\\hat\\sigma, \\text{IQR}/1.34)$ rather than $\\hat\\sigma$ because", ["for skewed or bimodal data, $\\hat\\sigma$ is inflated and would oversmooth", "The IQR is resistant."], [["the IQR is always smaller", "For normal data they match."], ["it makes $h$ larger", "It can only make $h$ smaller."]]), ["Normal data: $\\text{IQR}/1.34 \\approx \\sigma$."]),
    ex(3, mc("kdex-ex-8", "A parametric fit has error of order $n^{-1}$; a KDE $n^{-4/5}$. This means", ["a correct parametric model learns faster, but a KDE stays valid when no formula fits", "The price of flexibility."], [["KDE is always better", "Not when a parametric model is right."], ["they are equally efficient", "The rates differ."]]), ["Nonparametric methods trade efficiency for robustness to misspecification."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const xs = Array.from({ length: k }, () => r.int(0, 6));
      const h = r.pick([0.5, 1, 2]);
      const x = r.int(0, 6);
      const v = kdeAt(xs, h, x);
      return n(`Data ${xs.join(", ")}, normal kernel, $h = ${h}$. Find $\\hat f(${x})$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\tfrac{1}{${k} \\times ${h}}\\sum\\phi\\!\\left(\\tfrac{${x} - x_i}{${h}}\\right) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const s = r.pick([2, 5, 8, 10, 15]);
      const nn = r.pick([32, 100, 243, 500, 1000]);
      const v = 1.06 * s * nn ** -0.2;
      return n(`Rule-of-thumb bandwidth $1.06\\,\\hat\\sigma\\,n^{-1/5}$ with $\\hat\\sigma = ${s}$ and $n = ${nn}$. Find $h$ (3 decimals).`, Math.round(v * 1000) / 1000, `$1.06 \\times ${s} \\times ${nn}^{-0.2} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const pts = Array.from({ length: 5 }, (_, i) => [i + 1, r.int(0, 12)] as const);
      const x = r.int(2, 4);
      const near = pts.filter(([xi]) => Math.abs(xi - x) <= 1);
      const v = near.reduce((s, [, y]) => s + y, 0) / near.length;
      return n(`Box-kernel regression with window $\\lvert x - x_i\\rvert \\le 1$: points ${pts.map(([a, b]) => `(${a}, ${b})`).join(", ")}. Find $\\hat m(${x})$ (3 decimals).`, Math.round(v * 1000) / 1000, `Average the $y$ values at $x_i = ${near.map(([a]) => a).join(", ")}$: $\\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const h = r.pick([0.05, 0.1, 0.2]);
      return mcNumbers(
        `A density estimate with bandwidth ${h} looks like a comb of spikes. It is`,
        { text: "undersmoothed: increase the bandwidth", why: "Tiny bandwidths have huge variance." },
        [
          { text: "the most accurate estimate possible", why: "It mostly shows sampling noise.", misconception: "small-h-better" },
          { text: "fixed by changing the kernel shape", why: "Shape matters little.", misconception: "kernel-shape-matters" },
        ],
      );
    },
  },
];
