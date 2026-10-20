import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** The sign test, Wilcoxon signed-rank test and Mann–Whitney U test, with normal approximations and efficiency. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "rank-tests",
  title: "Sign, Wilcoxon & Mann–Whitney tests",
  summary: "Rank tests replace values by their ranks, so outliers and skew lose their grip. The sign test counts positive differences; the Wilcoxon signed-rank test also uses their sizes' ranks; the Mann–Whitney U test compares two independent groups by how often one beats the other. They lose little power against the t-test on normal data and can win big on heavy tails.",
  deps: ["permutation-tests", "rank-correlation", "t-tests"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "distribution-free", meaning: "Valid without assuming the data come from a particular family such as the normal." },
    { term: "signed rank", meaning: "The rank of a difference's absolute size, carrying the difference's sign." },
    { term: "U statistic", meaning: "The number of (group 1, group 2) pairs in which the group 1 value is larger." },
  ],
  misconceptions: {
    "mann-whitney-medians": "Thinks the Mann–Whitney test always compares medians, rather than whether values from one group tend to be larger than values from the other.",
    "nonparametric-no-assumptions": "Thinks nonparametric tests make no assumptions at all.",
  },
  steps: [
    {
      type: "motivate",
      title: "When one value runs away",
      body: "Recovery times after surgery are mostly a few days, but one patient takes 90. A t-test's mean and SD are dragged around by that single value. Ranks treat it as merely \"the largest\", whatever its size.",
      realWorld: {
        title: "Customer ratings",
        body: "Star ratings from 1 to 5 are ordinal: the gap from 4 to 5 stars needn't equal the gap from 1 to 2. Rank tests compare two products' ratings without pretending the stars are measurements.",
      },
    },
    {
      type: "truth",
      statement: "**Sign test** (paired data): under $H_0$ of zero median difference, the number of positive differences is $\\mathrm{Bin}(n, \\tfrac12)$. **Wilcoxon signed-rank**: rank the $|d_i|$, then $W^+$ is the sum of the ranks of the positive differences; under $H_0$, $E[W^+] = \\tfrac{n(n + 1)}{4}$. **Mann–Whitney** (two independent groups): $U_1 = R_1 - \\tfrac{n_1(n_1 + 1)}{2}$, where $R_1$ is the sum of group 1's ranks in the combined sample; $U_1 + U_2 = n_1n_2$ and $E[U] = \\tfrac{n_1n_2}{2}$.",
      body: "$U_1/(n_1n_2)$ estimates $P(X > Y)$, the chance that a random value from group 1 beats one from group 2; the test asks whether that is $\\tfrac12$. Large samples use normal approximations: $\\operatorname{Var}(U) = \\tfrac{n_1n_2(n_1 + n_2 + 1)}{12}$ and $\\operatorname{Var}(W^+) = \\tfrac{n(n + 1)(2n + 1)}{24}$.",
    },
    {
      type: "predict",
      misconception: "mann-whitney-medians",
      item: {
        kind: "mc",
        id: "rkt-predict-1",
        prompt: "Two groups have the same median, but group A's values are much more spread out, with a long right tail. A significant Mann–Whitney result here would mean",
        options: [
          { id: "a", text: "values from one group tend to beat values from the other, not necessarily that the medians differ", correct: true, why: "It tests $P(X > Y) = \\tfrac12$." },
          { id: "b", text: "the medians differ", misconception: "mann-whitney-medians", why: "The medians are equal here." },
          { id: "c", text: "the means are equal", why: "It isn't a test of means." },
        ],
      },
      reveal: {
        body: "Mann–Whitney tests whether a value drawn from one group is as likely to be larger as smaller than one from the other. It is a test of medians only when the two distributions have the same shape and differ by a shift. With different spreads or skews, it can reject even when the medians agree.",
      },
      resolve: {
        kind: "mc",
        id: "rkt-resolve-1",
        prompt: "What does the Mann–Whitney test test?",
        options: [
          { id: "a", text: "Whether $P(X > Y) = \\tfrac12$ for values from the two groups", correct: true, why: "$U/(n_1n_2)$ estimates that probability." },
          { id: "b", text: "Always whether the medians are equal", misconception: "mann-whitney-medians", why: "Only under an equal-shape, pure-shift assumption." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rkt-check-1",
        prompt: "The Mann–Whitney test assumes",
        options: [
          { id: "a", text: "independent observations, within and between the groups", correct: true, why: "Distribution-free is not assumption-free." },
          { id: "b", text: "nothing at all", misconception: "nonparametric-no-assumptions", why: "Dependence between observations still breaks it." },
          { id: "c", text: "normal data", why: "It doesn't need normality." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rkt-check-2",
        prompt: "9 of 10 paired differences are positive. Find the one-sided sign-test p-value.",
        options: [
          { id: "a", text: "$11/1024 \\approx 0.011$", correct: true, why: "$P(X \\ge 9)$ for $\\mathrm{Bin}(10, \\tfrac12)$." },
          { id: "b", text: "$0.9$", why: "That is the share of positive differences." },
          { id: "c", text: "$10/1024$", why: "Count 9 and 10 positives: $10 + 1$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The AUC of a classifier is exactly the Mann–Whitney $U$ for the scores of positives against negatives, divided by $n_1n_2$ (§{roc-auc}). Comparing two models across datasets is usually done with the Wilcoxon signed-rank test on their paired scores.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rkt-produce-1", prompt: "Group 1 ($n_1 = 3$) has rank sum 8 in the combined sample. Find $U_1$.", answer: 2, explain: "$8 - 6$." },
        { kind: "number", id: "rkt-produce-2", prompt: "Find $E[W^+]$ under $H_0$ for $n = 10$ paired differences.", answer: 27.5, explain: "$10 \\times 11/4$." },
        {
          kind: "mc",
          id: "rkt-produce-3",
          prompt: "Wilcoxon's signed-rank test applied to repeated scores of the same patients on different days, treated as independent pairs, would be",
          options: [
            { id: "a", text: "invalid if the pairs are not independent of each other", correct: true, why: "Rank tests still need independence." },
            { id: "b", text: "always valid, since it is nonparametric", misconception: "nonparametric-no-assumptions", why: "Distribution-free doesn't mean assumption-free." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rkt-review-1", prompt: "Two groups of 4 and 5. Find $U_1 + U_2$.", answer: 20, explain: "$n_1n_2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "ties and the Hodges–Lehmann estimate",
      body: "Tied values get the average of the ranks they span (two values tied for ranks 3 and 4 both get 3.5), with a small correction to the variance. The **Hodges–Lehmann** estimate of a shift between two groups is the median of all $n_1n_2$ differences $x_i - y_j$; it goes naturally with the Mann–Whitney test.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "U counts pairs",
      statement: "$U_1 = \\#\\{(i, j): x_i > y_j\\}$ (ties counting $\\tfrac12$), so $U_1 = R_1 - \\tfrac{n_1(n_1 + 1)}{2}$ and $U_1 + U_2 = n_1n_2$.",
      proof: ["The $k$th smallest value of group 1 has rank equal to $k$ plus the number of group 2 values below it. Summing over group 1 gives $R_1 = \\tfrac{n_1(n_1 + 1)}{2} + U_1$. Every pair is won by one group or the other."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the signed-rank null distribution",
      statement: "Under $H_0$ each rank $1, \\dots, n$ is equally likely to carry + or −, independently: $W^+$ has mean $\\tfrac{n(n + 1)}{4}$ and variance $\\tfrac{n(n + 1)(2n + 1)}{24}$.",
      proof: ["$W^+ = \\sum_k kI_k$ with independent $I_k \\sim$ Bernoulli($\\tfrac12$): the mean is $\\tfrac12\\sum k$, the variance $\\tfrac14\\sum k^2$. This is the sign-flip permutation test (§{permutation-tests}) on the ranks."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "efficiency",
      statement: "For normal data the Wilcoxon and Mann–Whitney tests are about 95% as efficient as the t-test (they need about 5% more data for the same power); for heavy-tailed data they can be far more efficient. The sign test is only 64% as efficient for normal data, because it ignores the sizes of the differences.",
      proof: ["The asymptotic relative efficiency of the rank tests against the t-test is $3/\\pi \\approx 0.955$ for normal data, and never below 0.864 for any continuous distribution."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "a sign test",
      problem: "8 of 10 patients improve on a new diet. Find the one-sided sign-test p-value.",
      solution: ["$P(X \\ge 8)$ for $\\mathrm{Bin}(10, \\tfrac12)$: $\\dfrac{45 + 10 + 1}{1024}$.", "$= 56/1024 \\approx 0.055$."],
      result: "About 0.055.",
    },
    {
      type: "example",
      level: 2,
      title: "Wilcoxon signed-rank",
      problem: "Differences $3, -1, 4, 2, 5$. Find $W^+$ and the exact one-sided p-value.",
      solution: ["Ranks of $|d|$: 3, 1, 4, 2, 5. The only negative is rank 1, so $W^+ = 15 - 1 = 14$.", "Of the 32 sign patterns, $W^+ \\ge 14$ happens for all-positive (15) and only-rank-1-negative (14): $p = 2/32 = 0.0625$."],
      result: "$W^+ = 14$, $p = 0.0625$.",
    },
    {
      type: "example",
      level: 3,
      title: "Mann–Whitney",
      problem: "Group A: 1, 3, 5. Group B: 2, 6, 7, 8. Find $U_A$, $U_B$ and an estimate of $P(A > B)$.",
      solution: [
        "Combined ranks: A gets 1, 3, 4, so $R_A = 8$ and $U_A = 8 - 6 = 2$.",
        "$U_B = 3 \\times 4 - 2 = 10$. $\\hat P(A > B) = 2/12 \\approx 0.17$: B's values usually win.",
      ],
      result: "$U_A = 2$, $U_B = 10$; about 0.17.",
    },
  ],
  pitfalls: [
    { wrong: "Mann–Whitney always tests medians.", right: "It tests $P(X > Y) = \\tfrac12$; it is a median test only for equal shapes." },
    { wrong: "Nonparametric means no assumptions.", right: "Independence is still required, and the signed-rank test assumes symmetric differences." },
    { wrong: "Rank tests are always much weaker than t-tests.", right: "They lose about 5% on normal data and often win on heavy tails." },
  ],
  formulas: [
    { label: "Sign test", tex: "\\#\\{d_i > 0\\} \\sim \\mathrm{Bin}(n, \\tfrac12)" },
    { label: "Signed rank", tex: "E[W^+] = \\tfrac{n(n + 1)}{4},\\ \\operatorname{Var} = \\tfrac{n(n + 1)(2n + 1)}{24}" },
    { label: "Mann–Whitney", tex: "U_1 = R_1 - \\tfrac{n_1(n_1 + 1)}{2},\\ E[U] = \\tfrac{n_1n_2}{2}" },
    { label: "Variance of U", tex: "\\tfrac{n_1n_2(n_1 + n_2 + 1)}{12}" },
  ],
  exercises: [
    ex(1, num("rktx-ex-1", "Two groups of 6 and 8. Find $E[U]$ under $H_0$.", 24, "$n_1n_2/2$."), ["$48/2 = 24$."]),
    ex(1, num("rktx-ex-2", "Group 1 ($n_1 = 4$) has rank sum 22. Find $U_1$.", 12, "$22 - 10$."), ["$12$."]),
    ex(2, fr("rktx-ex-3", "8 of 10 differences are positive. Find the one-sided sign-test p-value.", 56 / 1024, "$P(X \\ge 8)$."), ["$\\tfrac{45 + 10 + 1}{1024} = \\tfrac{7}{128} \\approx 0.055$."]),
    ex(2, num("rktx-ex-4", "Find the variance of $W^+$ under $H_0$ for $n = 10$.", 96.25, "$n(n + 1)(2n + 1)/24$."), ["$10 \\times 11 \\times 21/24 = 96.25$."]),
    ex(2, dp("rktx-ex-5", "Groups of 10 and 10 give $U_1 = 80$. Find the normal-approximation $z$.", (80 - 50) / Math.sqrt((100 * 21) / 12), "$(U - 50)/\\sqrt{100 \\times 21/12}$."), ["SD $= \\sqrt{175} \\approx 13.23$, so $z = 30/13.23 \\approx 2.268$."]),
    ex(3, num("rktx-ex-6", "Differences $-2, 5, 1, 4, 3$. Find $W^+$.", 13, "Rank the absolute values."), ["Ranks of $|d|$: 2, 5, 1, 4, 3; the negative has rank 2, so $W^+ = 15 - 2 = 13$."]),
    ex(3, fr("rktx-ex-7", "Same differences. Find the exact one-sided p-value, $P(W^+ \\ge 13)$.", 3 / 32, "Count sign patterns."), ["$W^+ \\ge 13$ means the negative ranks sum to at most 2: no negatives, rank 1 alone, or rank 2 alone.", "That is 3 of the $2^5 = 32$ equally likely sign patterns: $\\tfrac{3}{32} \\approx 0.094$."]),
    ex(3, num("rktx-ex-8", "Group A: 2, 4, 9. Group B: 1, 3, 5, 6. Find $U_A$, the number of pairs in which A wins.", 7, "Count pairs."), ["2 beats one B value, 4 beats two, 9 beats all four: $U_A = 1 + 2 + 4 = 7$, and $U_B = 12 - 7 = 5$."]),
    ex(3, mc("rktx-ex-9", "For perfectly normal data, switching from a t-test to Mann–Whitney costs about", ["5% efficiency", "Asymptotic relative efficiency $3/\\pi \\approx 0.955$."], [["half the power", "The loss is small."], ["nothing", "There is a small loss on normal data."]]), ["The rank test needs about 5% more observations for the same power."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const n1 = r.int(3, 4 + 2 * lv);
      const n2 = r.int(3, 4 + 2 * lv);
      const vals = new Set<number>();
      while (vals.size < n1 + n2) vals.add(r.int(1, 60));
      const all = [...vals];
      const a = all.slice(0, n1).sort((x, y) => x - y);
      const b = all.slice(n1).sort((x, y) => x - y);
      const u = a.reduce((s, x) => s + b.filter((y) => x > y).length, 0);
      return n(`Group A: ${a.join(", ")}. Group B: ${b.join(", ")}. Find $U_A$, the number of (A, B) pairs in which the A value is larger.`, u, `Count, for each A value, the B values below it: $U_A = ${u}$, and $U_B = ${n1 * n2 - u}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const nn = r.int(5, 10 + 10 * lv);
      const what = r.pick(["mean", "variance"] as const);
      const v = what === "mean" ? (nn * (nn + 1)) / 4 : (nn * (nn + 1) * (2 * nn + 1)) / 24;
      return n(`Find the ${what} of the Wilcoxon $W^+$ under $H_0$ for $n = ${nn}$ (2 decimals).`, r2(v), what === "mean" ? `$${nn} \\times ${nn + 1}/4 = ${r2(v)}$.` : `$${nn} \\times ${nn + 1} \\times ${2 * nn + 1}/24 = ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { what: "the Mann–Whitney test", need: "independent observations" },
        { what: "the Wilcoxon signed-rank test", need: "independent pairs and differences symmetric about their median" },
        { what: "the sign test", need: "independent pairs" },
      ]);
      return mcNumbers(
        `What does ${s.what} require?`,
        { text: s.need, why: "Rank tests drop the normality assumption, not the others." },
        [
          { text: "No assumptions at all", why: "Distribution-free is not assumption-free.", misconception: "nonparametric-no-assumptions" },
          { text: "Normally distributed data", why: "That is what rank tests avoid." },
        ],
      );
    },
  },
];
