import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Spearman, Kendall, point-biserial, phi and Cramér's V; partial and intraclass correlation; testing r; mutual information. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const partial = (rxy: number, rxz: number, ryz: number) => (rxy - rxz * ryz) / Math.sqrt((1 - rxz ** 2) * (1 - ryz ** 2));

const base: ConceptNode = {
  id: "rank-correlation",
  title: "Rank correlation & measures of association",
  summary: "Spearman's correlation is Pearson's computed on ranks, catching any monotone relationship; Kendall's τ counts agreeing minus disagreeing pairs. For categories, phi and Cramér's V rescale χ² to [0, 1]; mutual information detects any dependence at all. Partial correlation removes a third variable's influence.",
  deps: ["covariance", "chi-square", "hypothesis-tests"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "rank", meaning: "A value's position in sorted order: 1 for the smallest." },
    { term: "concordant pair", meaning: "Two units ordered the same way by both variables; discordant if ordered oppositely." },
    { term: "partial correlation", meaning: "The correlation of two variables after removing what a third variable explains of each." },
  ],
  misconceptions: {
    "pearson-detects-all": "Thinks Pearson's r measures any kind of relationship, rather than straight-line association only.",
    "spearman-on-values": "Computes Spearman's correlation from the raw values instead of their ranks.",
  },
  steps: [
    {
      type: "motivate",
      title: "When the line isn't straight",
      body: "Salary rises with experience, steeply at first and then levelling off, and a few very high earners can drag Pearson's r around. Ranks ignore how far apart values are and keep only their order, which makes rank correlations robust and suits them to ordinal data.",
      realWorld: {
        title: "Agreeing on a ranking",
        body: "Two judges rank ten dancers. Kendall's τ asks, for every pair of dancers, whether the judges agree on which is better: a natural score of agreement, also used to compare rankings of search results.",
      },
    },
    {
      type: "truth",
      statement: "**Spearman's** $r_s$ is Pearson's $r$ on the ranks; with no ties, $r_s = 1 - \\dfrac{6\\sum d_i^2}{n(n^2 - 1)}$, where $d_i$ is the difference between a unit's two ranks. **Kendall's** $\\tau = \\dfrac{C - D}{\\binom n2}$ with $C$ concordant and $D$ discordant pairs. For an $r \\times c$ table, **Cramér's** $V = \\sqrt{\\dfrac{\\chi^2}{n(\\min(r, c) - 1)}}$; for a $2 \\times 2$ table it is the **phi coefficient** $|\\phi| = \\sqrt{\\chi^2/n}$.",
      body: "Rank correlations equal $\\pm 1$ for any perfectly monotone relationship, curved or not. **Partial correlation** $r_{xy \\cdot z}$ measures how $x$ and $y$ move together once $z$ is accounted for. **Mutual information** is 0 exactly when two variables are independent, so it detects non-monotone dependence that every correlation misses.",
    },
    {
      type: "predict",
      misconception: "pearson-detects-all",
      item: {
        kind: "mc",
        id: "rnk-predict-1",
        prompt: "$y = x^3$ for $x = 1, 2, \\dots, 10$. Compare Pearson's $r$ and Spearman's $r_s$.",
        options: [
          { id: "a", text: "$r_s = 1$ exactly; $r$ is high but below 1", correct: true, why: "The ranks agree perfectly, but the points don't lie on a line." },
          { id: "b", text: "Both are exactly 1, because $y$ is determined by $x$", misconception: "pearson-detects-all", why: "Pearson measures closeness to a straight line." },
          { id: "c", text: "Both are below 1", why: "Every increase in $x$ increases $y$, so the ranks match." },
        ],
      },
      reveal: {
        body: "Each increase in $x$ increases $y$, so the two rankings are identical and $r_s = 1$. The cubic curves away from any straight line, giving $r \\approx 0.93$. For a U shape such as $y = (x - 5.5)^2$, both correlations are near 0 even though $y$ is still a function of $x$; mutual information would catch it.",
      },
      resolve: {
        kind: "mc",
        id: "rnk-resolve-1",
        prompt: "What does Pearson's $r$ measure?",
        options: [
          { id: "a", text: "Straight-line association only", correct: true, why: "Curved or non-monotone relationships can give small $r$." },
          { id: "b", text: "Any relationship between the variables", misconception: "pearson-detects-all", why: "A perfect U shape can have $r = 0$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rnk-check-1",
        prompt: "Data: (1, 10), (2, 30), (3, 20), (4, 50). Spearman's $r_s$ is computed from",
        options: [
          { id: "a", text: "the ranks: $x$ ranks 1, 2, 3, 4 and $y$ ranks 1, 3, 2, 4", correct: true, why: "Replace each value by its position." },
          { id: "b", text: "the raw values, as for Pearson", misconception: "spearman-on-values", why: "That would just be Pearson's $r$." },
          { id: "c", text: "only the largest values", why: "Every value is ranked." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rnk-check-2",
        prompt: "Of 6 pairs, 5 are concordant and 1 discordant. Find Kendall's τ.",
        options: [
          { id: "a", text: "2/3", correct: true, why: "$(5 - 1)/6$." },
          { id: "b", text: "5/6", why: "Subtract the discordant pairs." },
          { id: "c", text: "1/6", why: "That is the discordant share." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Spearman's correlation scores ranking models (does the model order items as the true scores do?), and Kendall's τ compares two rankings of search results. Mutual information is used to select features because it rewards non-linear relevance that correlation misses.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rnk-produce-1", prompt: "Five units have rank differences with $\\sum d_i^2 = 4$. Find Spearman's $r_s$.", answer: 0.8, explain: "$1 - 24/120$." },
        { kind: "number", id: "rnk-produce-2", prompt: "A $2 \\times 3$ table of 200 people gives $\\chi^2 = 20$. Find Cramér's $V$ to 3 decimals.", answer: Math.round(Math.sqrt(0.1) * 1000) / 1000, tolerance: 0.001, explain: "$\\sqrt{20/(200 \\times 1)}$." },
        {
          kind: "mc",
          id: "rnk-produce-3",
          prompt: "To compute Spearman's correlation of exam score and hours slept, first",
          options: [
            { id: "a", text: "rank each variable separately", correct: true, why: "Then correlate the ranks." },
            { id: "b", text: "use the raw scores and hours", misconception: "spearman-on-values", why: "That gives Pearson's $r$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rnk-review-1", prompt: "A $2 \\times 2$ table of 100 people gives $\\chi^2 = 9$. Find $|\\phi|$.", answer: 0.3, explain: "$\\sqrt{9/100}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "other coefficients",
      body: "The **point-biserial** correlation is Pearson's $r$ between a numerical variable and a 0/1 variable: $r_{pb} = \\dfrac{M_1 - M_0}{s}\\sqrt{pq}$, with group means $M_1, M_0$, overall SD $s$ and group shares $p, q$. The **multiple correlation** $R$ is the correlation between $y$ and its regression prediction, $R = \\sqrt{R^2}$. The **intraclass correlation** is the share of variance between groups, $\\dfrac{\\sigma_b^2}{\\sigma_b^2 + \\sigma_w^2}$; **distance correlation** is 0 only under independence.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "partial correlation",
      statement: "$r_{xy \\cdot z} = \\dfrac{r_{xy} - r_{xz}r_{yz}}{\\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}$: the correlation between the residuals of $x$ and of $y$ after each is regressed on $z$.",
      proof: ["Regress $x$ and $y$ on $z$ (§{least-squares}). The residuals' covariance is $\\sigma_x\\sigma_y(r_{xy} - r_{xz}r_{yz})$ and their SDs are $\\sigma_x\\sqrt{1 - r_{xz}^2}$ and $\\sigma_y\\sqrt{1 - r_{yz}^2}$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "testing a correlation",
      statement: "For bivariate normal data, $H_0: \\rho = 0$ is tested by $t = \\dfrac{r\\sqrt{n - 2}}{\\sqrt{1 - r^2}}$ on $n - 2$ degrees of freedom. Intervals for $\\rho \\neq 0$ use Fisher's $z$ (§{sampling-distributions}).",
      proof: ["This $t$ is exactly the t-statistic for the slope in the simple regression of $y$ on $x$ (§{regression-inference})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Spearman's shortcut",
      statement: "With no ties, Pearson's $r$ on the ranks equals $1 - \\dfrac{6\\sum d_i^2}{n(n^2 - 1)}$.",
      proof: ["Ranks $1, \\dots, n$ have mean $\\tfrac{n + 1}{2}$ and sum of squared deviations $\\tfrac{n(n^2 - 1)}{12}$ in each variable. Expanding $\\sum d_i^2 = \\sum(a_i - b_i)^2$ expresses the rank covariance through it."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Two judges rank five dancers: judge A gives 1, 2, 3, 4, 5 and judge B gives 2, 1, 4, 3, 5. Find Spearman's $r_s$.",
      solution: ["Differences $-1, 1, -1, 1, 0$, so $\\sum d^2 = 4$.", "$r_s = 1 - \\dfrac{6 \\times 4}{5 \\times 24} = 0.8$."],
      result: "$r_s = 0.8$.",
    },
    {
      type: "example",
      level: 2,
      title: "Kendall's τ",
      problem: "Same rankings. Find Kendall's τ.",
      solution: ["Of the 10 pairs, only (dancers 1, 2) and (dancers 3, 4) are ordered differently by the two judges: $D = 2$, $C = 8$.", "$\\tau = (8 - 2)/10 = 0.6$."],
      result: "$\\tau = 0.6$.",
    },
    {
      type: "example",
      level: 2,
      title: "removing a common cause",
      problem: "$r_{xy} = 0.5$, $r_{xz} = 0.6$, $r_{yz} = 0.7$. Find the partial correlation of $x$ and $y$ given $z$.",
      solution: ["$\\dfrac{0.5 - 0.42}{\\sqrt{0.64 \\times 0.51}} = \\dfrac{0.08}{0.571}$.", "$\\approx 0.14$: most of the association runs through $z$."],
      result: "About 0.14.",
    },
    {
      type: "example",
      level: 3,
      title: "is the correlation real?",
      problem: "$r = 0.4$ from $n = 27$ pairs. Test $\\rho = 0$ at 5% (two-sided cut-off 2.060 for 25 d.f.).",
      solution: ["$t = \\dfrac{0.4\\sqrt{25}}{\\sqrt{0.84}} = \\dfrac{2}{0.9165} \\approx 2.18$.", "$2.18 > 2.060$: significant."],
      result: "$t \\approx 2.18$: reject $\\rho = 0$.",
    },
  ],
  pitfalls: [
    { wrong: "$r \\approx 0$ means no relationship.", right: "It means no straight-line relationship; plot the data and consider mutual information." },
    { wrong: "Compute Spearman's correlation on the raw values.", right: "Rank each variable first." },
    { wrong: "A significant correlation is a strong one.", right: "With large $n$, $r = 0.05$ can be significant; report $r$ itself and its interval." },
  ],
  formulas: [
    { label: "Spearman", tex: "r_s = 1 - \\dfrac{6\\sum d_i^2}{n(n^2 - 1)}" },
    { label: "Kendall", tex: "\\tau = \\dfrac{C - D}{\\binom n2}" },
    { label: "Cramér's V", tex: "\\sqrt{\\dfrac{\\chi^2}{n(\\min(r, c) - 1)}}" },
    { label: "Partial", tex: "\\dfrac{r_{xy} - r_{xz}r_{yz}}{\\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}" },
    { label: "Test of ρ = 0", tex: "t = r\\sqrt{n - 2}/\\sqrt{1 - r^2}" },
  ],
  exercises: [
    ex(1, num("rnkx-ex-1", "Two rankings of the same items are identical. Find $r_s$.", 1, "$\\sum d^2 = 0$."), ["$1 - 0 = 1$."]),
    ex(1, num("rnkx-ex-2", "Five units have $\\sum d_i^2 = 10$. Find $r_s$.", 0.5, "$1 - 60/120$."), ["$0.5$."]),
    ex(2, fr("rnkx-ex-3", "Five units give 7 concordant and 3 discordant pairs. Find Kendall's τ.", 0.4, "$(7 - 3)/10$."), ["$0.4$."]),
    ex(2, dp("rnkx-ex-4", "A $3 \\times 4$ table of 150 people gives $\\chi^2 = 12$. Find Cramér's $V$.", Math.sqrt(12 / 300), "$\\min(r, c) - 1 = 2$."), ["$\\sqrt{12/300} = 0.2$."]),
    ex(2, num("rnkx-ex-5", "A $2 \\times 2$ table of 100 people gives $\\chi^2 = 4$. Find $|\\phi|$.", 0.2, "$\\sqrt{0.04}$."), ["$0.2$."]),
    ex(2, dp("rnkx-ex-6", "$r = 0.5$ from $n = 18$. Find the $t$ statistic for $\\rho = 0$.", (0.5 * 4) / Math.sqrt(0.75), "$r\\sqrt{n - 2}/\\sqrt{1 - r^2}$."), ["$\\dfrac{0.5 \\times 4}{0.866} \\approx 2.309$."]),
    ex(3, dp("rnkx-ex-7", "$r_{xy} = 0.6$, $r_{xz} = 0.5$, $r_{yz} = 0.5$. Find $r_{xy \\cdot z}$.", partial(0.6, 0.5, 0.5), "$(0.6 - 0.25)/0.75$."), ["$0.35/0.75 \\approx 0.467$."]),
    ex(3, num("rnkx-ex-8", "Between-group variance is 4 and within-group variance 12. Find the intraclass correlation.", 0.25, "$4/16$."), ["$0.25$."]),
    ex(3, num("rnkx-ex-9", "Group means are 70 and 60, the overall SD is 10 and the groups are equal in size. Find the point-biserial correlation.", 0.5, "$\\tfrac{10}{10}\\sqrt{0.25}$."), ["$1 \\times 0.5 = 0.5$."]),
    ex(3, mc("rnkx-ex-10", "Crop yield rises with temperature up to 25 °C and falls above it. To detect this dependence, use", ["mutual information or a plot", "The relationship isn't monotone."], [["Spearman's correlation", "A rise then fall can give $r_s \\approx 0$."], ["Pearson's correlation", "It measures straight-line association only."]]), ["Correlations summarise monotone or linear trends; a hump needs a measure of general dependence."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 4 + lv;
      const ranks = Array.from({ length: k }, (_, i) => i + 1);
      const other = [...ranks];
      for (let i = other.length - 1; i > 0; i--) {
        const j = r.int(0, i);
        [other[i], other[j]] = [other[j], other[i]];
      }
      const d2 = ranks.reduce((s, a, i) => s + (a - other[i]) ** 2, 0);
      const rs = 1 - (6 * d2) / (k * (k * k - 1));
      return n(`Judge A ranks ${k} items ${ranks.join(", ")}; judge B ranks the same items ${other.join(", ")}. Find Spearman's $r_s$ (3 decimals).`, Math.round(rs * 1000) / 1000, `$\\sum d^2 = ${d2}$, so $r_s = 1 - \\dfrac{6 \\times ${d2}}{${k}(${k * k} - 1)} \\approx ${Math.round(rs * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.pick([100, 150, 200, 300, 500]);
      const rows = r.pick([2, 3]);
      const cols = r.pick([2, 3, 4]);
      const chi = r.int(2, 20 * lv);
      const m = Math.min(rows, cols) - 1;
      const v = Math.sqrt(chi / (nn * m));
      return n(`A ${rows} × ${cols} table of ${nn} people gives $\\chi^2 = ${chi}$. Find Cramér's $V$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\sqrt{${chi}/(${nn} \\times ${m})} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { rel: "$y = e^x$ for $x$ from 1 to 10", rs: "1", r: "below 1" },
        { rel: "$y = \\sqrt x$ for $x$ from 1 to 100", rs: "1", r: "below 1" },
        { rel: "$y = -x^3$ for $x$ from 1 to 10", rs: "-1", r: "above $-1$" },
      ]);
      return mcNumbers(
        `For ${s.rel}, what are Spearman's $r_s$ and Pearson's $r$?`,
        { text: `$r_s = ${s.rs}$ exactly; $r$ is ${s.r}`, why: "The relationship is perfectly monotone but not a straight line." },
        [
          { text: `Both are exactly ${s.rs}`, why: "Pearson measures straight-line association only.", misconception: "pearson-detects-all" },
          { text: "Both are near 0", why: "A monotone relationship gives a rank correlation of ±1." },
        ],
      );
    },
  },
];
