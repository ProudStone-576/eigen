import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** One-way analysis of variance: the sum-of-squares split, the F-test, effect size, assumptions, Welch's ANOVA. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "one-way-anova",
  title: "One-way ANOVA",
  summary: "To compare k group means at once, split the total variation into a between-group part and a within-group part. F = MS_between/MS_within on (k − 1, N − k) degrees of freedom: a large F means the group means differ by more than chance would explain.",
  deps: ["t-tests", "sampling-distributions", "joint-distributions"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "between-group variation", meaning: "How far the group means are from the grand mean, weighted by group size." },
    { term: "within-group variation", meaning: "How far the observations are from their own group's mean." },
    { term: "mean square", meaning: "A sum of squares divided by its degrees of freedom." },
  ],
  misconceptions: {
    "multiple-t-tests": "Runs a t-test for every pair of groups instead of one overall test, inflating the false-positive rate.",
    "anova-which-differs": "Thinks a significant ANOVA shows which groups differ, or that every group differs from every other.",
  },
  steps: [
    {
      type: "motivate",
      title: "Three teaching methods",
      body: "Three classes are taught fractions three different ways and then tested. The class averages differ, but averages always differ a little. Is the spread of the class means larger than the spread of individual pupils would produce by chance?",
      realWorld: {
        title: "Agricultural trials",
        body: "ANOVA was invented by R. A. Fisher at an agricultural research station in the 1920s, to compare yields from several fertilisers and varieties at once. It is still the core of field and clinical trial analysis.",
      },
    },
    {
      type: "truth",
      statement: "With $k$ groups and $N$ observations in all: $\\text{SST} = \\text{SSB} + \\text{SSW}$, where $\\text{SSB} = \\sum_i n_i(\\bar y_i - \\bar y)^2$ and $\\text{SSW} = \\sum_i\\sum_j(y_{ij} - \\bar y_i)^2$. Then $F = \\dfrac{\\text{SSB}/(k - 1)}{\\text{SSW}/(N - k)}$, compared with $F_{k-1,\\,N-k}$, tests $H_0$: all group means are equal.",
      body: "Under $H_0$ both mean squares estimate the same error variance, so $F$ is near 1; differing means inflate the numerator. The test assumes independent observations, roughly normal groups and equal variances; **Welch's ANOVA** drops the last. A significant $F$ says *some* means differ, not which: that needs post-hoc comparisons (§{post-hoc-tests}).",
    },
    {
      type: "predict",
      misconception: "multiple-t-tests",
      item: {
        kind: "mc",
        id: "aov-predict-1",
        prompt: "Five groups are compared by running a t-test at 5% on every pair. If all five population means are really equal, the chance of at least one \"significant\" result is",
        options: [
          { id: "a", text: "far above 5%: there are 10 pairs", correct: true, why: "Up to about $1 - 0.95^{10} \\approx 40\\%$." },
          { id: "b", text: "5%, since each test uses $\\alpha = 0.05$", misconception: "multiple-t-tests", why: "Each extra test is another chance of a false alarm." },
          { id: "c", text: "below 5%", why: "More tests add chances of false alarms." },
        ],
      },
      reveal: {
        body: "Five groups make $\\binom52 = 10$ pairs. If the tests were independent the chance of at least one false alarm would be $1 - 0.95^{10} \\approx 0.40$; they overlap, so it is somewhat less, but still far above 5%. One F-test asks the overall question at level 0.05.",
      },
      resolve: {
        kind: "mc",
        id: "aov-resolve-1",
        prompt: "Why use one ANOVA instead of all pairwise t-tests?",
        options: [
          { id: "a", text: "It tests the overall question at the stated 5% level", correct: true, why: "One test, one chance of a false alarm." },
          { id: "b", text: "There is no difference: each t-test already uses 5%", misconception: "multiple-t-tests", why: "The family of tests has a much higher error rate." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "aov-check-1",
        prompt: "An ANOVA comparing four diets gives $F = 6.2$, $p = 0.001$. You can conclude",
        options: [
          { id: "a", text: "at least one diet's mean differs from another's", correct: true, why: "That is the alternative to \"all equal\"." },
          { id: "b", text: "every diet differs from every other", misconception: "anova-which-differs", why: "One very different group is enough for a large $F$." },
          { id: "c", text: "diet 4 is best", why: "The F-test doesn't rank the groups." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "aov-check-2",
        prompt: "Four groups of 10 observations. How many degrees of freedom have the between and within mean squares?",
        options: [
          { id: "a", text: "3 and 36", correct: true, why: "$k - 1$ and $N - k$." },
          { id: "b", text: "4 and 40", why: "Subtract one for each estimated mean." },
          { id: "c", text: "3 and 39", why: "Within uses $N - k = 40 - 4$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Feature screening for classification often runs a one-way ANOVA per feature across the classes (scikit-learn's f_classif): features whose class means differ a lot get high F scores. A one-way ANOVA is also a linear regression on the group dummies (§{regression-features}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "aov-produce-1", prompt: "SSB = 14 with 3 groups, SSW = 12 with 9 observations. Find $F$.", answer: 3.5, explain: "$(14/2)/(12/6)$." },
        { kind: "number", id: "aov-produce-2", prompt: "Same data. Find $\\eta^2 = \\text{SSB}/\\text{SST}$ to 3 decimals.", answer: Math.round((14 / 26) * 1000) / 1000, tolerance: 0.001, explain: "$14/26$." },
        {
          kind: "mc",
          id: "aov-produce-3",
          prompt: "A significant one-way ANOVA tells you",
          options: [
            { id: "a", text: "that not all group means are equal", correct: true, why: "Which ones differ needs follow-up tests." },
            { id: "b", text: "which groups differ", misconception: "anova-which-differs", why: "That needs post-hoc comparisons." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "aov-review-1", prompt: "MS between is 12 and MS within is 4. Find $F$.", answer: 3, explain: "$12/4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "the ANOVA table and effect size",
      body: "Rows: between groups (SSB, $k - 1$, $\\text{MSB} = \\text{SSB}/(k - 1)$), within groups (SSW, $N - k$, $\\text{MSW}$), total (SST, $N - 1$). **Eta squared** $\\eta^2 = \\text{SSB}/\\text{SST}$ is the share of variation explained by group membership, the ANOVA version of $R^2$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the sum-of-squares split",
      statement: "$\\sum_{i,j}(y_{ij} - \\bar y)^2 = \\sum_i n_i(\\bar y_i - \\bar y)^2 + \\sum_{i,j}(y_{ij} - \\bar y_i)^2$.",
      proof: [
        "Write $y_{ij} - \\bar y = (\\bar y_i - \\bar y) + (y_{ij} - \\bar y_i)$ and square.",
        "The cross term vanishes because the deviations from each group mean sum to 0 within the group. This is the law of total variance (§{joint-distributions}) for data.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "ANOVA is regression on dummies",
      statement: "A one-way ANOVA gives the same $F$ as the overall F-test of a regression of $y$ on $k - 1$ group dummies; with $k = 2$, $F$ equals the square of the pooled two-sample $t$.",
      proof: ["The dummy regression fits each group by its mean (§{regression-features}), so its SSR is SSB and its SSE is SSW. With two groups, the F and t tests use the same pooled variance."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "assumptions in practice",
      statement: "ANOVA is fairly robust to non-normality when the groups are of similar size, but unequal variances with unequal group sizes can distort it badly. Then use Welch's ANOVA or the Kruskal–Wallis test (§{kruskal-friedman}).",
      proof: ["With unequal $n_i$, a large variance in a small group inflates or deflates MSW relative to the true error variance of the group means."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 2,
      title: "a full table",
      problem: "Groups: A = 4, 5, 6; B = 7, 8, 9; C = 4, 6, 8. Build the ANOVA table and test at 5% (cut-off 5.14 for $F_{2,6}$).",
      solution: [
        "Means 5, 8, 6; grand mean $57/9 \\approx 6.33$. SSB $= 3[(5 - 6.33)^2 + (8 - 6.33)^2 + (6 - 6.33)^2] = 14$.",
        "SSW $= 2 + 2 + 8 = 12$. MSB $= 14/2 = 7$, MSW $= 12/6 = 2$, $F = 3.5$.",
        "$3.5 < 5.14$: not significant, although $\\eta^2 = 14/26 \\approx 0.54$. Three per group is too few.",
      ],
      result: "$F = 3.5$: do not reject.",
    },
    {
      type: "example",
      level: 1,
      problem: "Five groups of 8. Give the degrees of freedom of the F-test.",
      solution: ["$k - 1 = 4$.", "$N - k = 40 - 5 = 35$."],
      result: "$(4, 35)$.",
    },
    {
      type: "example",
      level: 3,
      title: "two groups",
      problem: "A pooled two-sample t-test gives $t = 2.4$. What $F$ would a one-way ANOVA of the same two groups give?",
      solution: ["With two groups, $F = t^2$.", "$2.4^2 = 5.76$."],
      result: "5.76.",
    },
  ],
  pitfalls: [
    { wrong: "Compare many groups with pairwise t-tests.", right: "Run one ANOVA, then corrected post-hoc comparisons." },
    { wrong: "A significant ANOVA means every group differs.", right: "It means at least two means differ." },
    { wrong: "Ignore very unequal variances with unequal group sizes.", right: "Use Welch's ANOVA or a rank-based test." },
  ],
  formulas: [
    { label: "Split", tex: "\\text{SST} = \\text{SSB} + \\text{SSW}" },
    { label: "F", tex: "F = \\dfrac{\\text{SSB}/(k - 1)}{\\text{SSW}/(N - k)}" },
    { label: "Effect size", tex: "\\eta^2 = \\text{SSB}/\\text{SST}" },
  ],
  exercises: [
    ex(1, num("aovx-ex-1", "Six groups with 60 observations in all. Find the within-groups degrees of freedom.", 54, "$N - k$."), ["$60 - 6 = 54$."]),
    ex(1, num("aovx-ex-2", "SSB = 30 and SSW = 70. Find $\\eta^2$.", 0.3, "$30/100$."), ["$0.3$."]),
    ex(2, num("aovx-ex-3", "SSB = 24 with 4 groups and SSW = 72 with 40 observations. Find $F$.", 4, "$(24/3)/(72/36)$."), ["$8/2 = 4$."]),
    ex(2, num("aovx-ex-4", "How many pairwise comparisons do 6 groups have?", 15, "$\\binom62$."), ["$15$."]),
    ex(2, dp("aovx-ex-5", "If those 15 tests were independent at 5% each, find the chance of at least one false alarm when all means are equal.", 1 - 0.95 ** 15, "$1 - 0.95^{15}$."), ["$\\approx 0.537$."]),
    ex(3, num("aovx-ex-6", "Group means 10, 12 and 14, each from 5 observations. Find SSB.", 40, "$5\\sum(\\bar y_i - 12)^2$."), ["$5(4 + 0 + 4) = 40$."]),
    ex(3, num("aovx-ex-7", "A two-group ANOVA gives $F = 9$. Find $|t|$ for the pooled two-sample t-test.", 3, "$\\sqrt F$."), ["$3$."]),
    ex(3, mc("aovx-ex-8", "Under $H_0$ of equal means, the F statistic is typically", ["near 1", "Both mean squares estimate the same variance."], [["near 0", "MSB doesn't vanish under $H_0$."], ["large", "Large values point against $H_0$."]]), ["$E[\\text{MSW}] = \\sigma^2$, and under $H_0$ $E[\\text{MSB}] = \\sigma^2$ too."]),
    ex(3, mc("aovx-ex-9", "Group sizes are 5, 5 and 50, and the small groups have much larger variances. You should", ["use Welch's ANOVA or Kruskal–Wallis", "The ordinary F-test is distorted here."], [["use the ordinary F-test", "Unequal variances with unequal sizes break it."], ["drop the large group", "That throws away information."]]), ["Welch's version weights each group by its own variance."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = r.int(3, 3 + lv);
      const per = r.int(4, 8 + 2 * lv);
      const N = k * per;
      const ssb = r.int(10, 60);
      const ssw = r.int(30, 150);
      const F = ssb / (k - 1) / (ssw / (N - k));
      return n(`${k} groups of ${per} give SSB = ${ssb} and SSW = ${ssw}. Find $F$ (2 decimals).`, r2(F), `$\\dfrac{${ssb}/${k - 1}}{${ssw}/${N - k}} \\approx ${r2(F)}$ on $(${k - 1}, ${N - k})$ d.f.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const per = r.int(3, 6 + 2 * lv);
      const means = Array.from({ length: 3 }, () => r.int(5, 20));
      const g = means.reduce((s, m) => s + m, 0) / 3;
      const ssb = per * means.reduce((s, m) => s + (m - g) ** 2, 0);
      return n(`Three groups of ${per} have means ${means.join(", ")}. Find SSB (2 decimals).`, r2(ssb), `Grand mean ${r2(g)}; $${per}\\sum(\\bar y_i - ${r2(g)})^2 \\approx ${r2(ssb)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.int(4, 7);
      const pairs = (k * (k - 1)) / 2;
      return mcNumbers(
        `A researcher compares ${k} groups by running all ${pairs} pairwise t-tests at 5%. If all means are really equal, the chance of at least one false \"significant\" result is`,
        { text: "well above 5%", why: `${pairs} tests give ${pairs} chances of a false alarm.` },
        [
          { text: "exactly 5%", why: "The 5% applies to each test, not the whole family.", misconception: "multiple-t-tests" },
          { text: "below 5%", why: "Extra tests can't lower the family's error rate." },
        ],
      );
    },
  },
];
