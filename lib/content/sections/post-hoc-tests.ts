import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Post-hoc comparisons after ANOVA: contrasts, Tukey's HSD, Bonferroni, Scheffé, Dunnett. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "post-hoc-tests",
  title: "Post-hoc comparisons",
  summary: "After a significant ANOVA, post-hoc tests find which means differ while controlling the error rate across all the comparisons. Tukey's HSD compares every pair; Dunnett compares each treatment with a control; Scheffé allows any contrast; Bonferroni works for a short planned list.",
  deps: ["one-way-anova", "multiple-testing"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "contrast", meaning: "A weighted combination of group means whose weights sum to zero, such as $\\bar y_A - \\tfrac12(\\bar y_B + \\bar y_C)$." },
    { term: "honestly significant difference", meaning: "Tukey's minimum gap between two means that counts as significant across all pairs at once." },
    { term: "planned comparison", meaning: "A comparison chosen before seeing the data, as opposed to one suggested by it." },
  ],
  misconceptions: {
    "posthoc-without-correction": "Follows a significant ANOVA with ordinary unadjusted t-tests on every pair.",
    "contrast-sum": "Uses contrast weights that don't sum to zero, so the contrast mixes in the overall level of the means.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which ones?",
      body: "An ANOVA says four fertilisers don't all give the same yield. A farmer needs to know which ones beat the others, and a dozen uncorrected comparisons would turn up \"differences\" by luck alone.",
      realWorld: {
        title: "Drug dose trials",
        body: "Trials comparing several doses with a placebo use Dunnett's procedure: it spends the error budget only on the comparisons that matter, each dose against placebo, and so has more power than comparing every pair.",
      },
    },
    {
      type: "truth",
      statement: "A **contrast** $L = \\sum c_i\\bar y_i$ with $\\sum c_i = 0$ has standard error $\\sqrt{\\text{MSW}\\sum c_i^2/n_i}$. **Tukey's HSD**: two means differ significantly if $|\\bar y_i - \\bar y_j| > q\\sqrt{\\text{MSW}/n}$, with $q$ from the studentized range table for $k$ groups and $N - k$ d.f. **Bonferroni**: test each of $m$ planned comparisons at $\\alpha/m$. **Dunnett**: each treatment against one control. **Scheffé**: any contrast at all, even one chosen after seeing the data.",
      body: "All control the family-wise error rate (§{multiple-testing}); they differ in how many comparisons they protect. The fewer comparisons covered, the more powerful each one is: Dunnett beats Tukey for comparisons with a control, Tukey beats Scheffé for pairs, and Scheffé is the price of total freedom.",
    },
    {
      type: "predict",
      misconception: "posthoc-without-correction",
      item: {
        kind: "mc",
        id: "phc-predict-1",
        prompt: "After a significant ANOVA on 6 groups, a student runs all 15 pairwise t-tests at 5% with no adjustment and reports the 3 that are significant. The problem is",
        options: [
          { id: "a", text: "the family of 15 tests has a much higher false-positive rate than 5%", correct: true, why: "Use Tukey's HSD or another corrected method." },
          { id: "b", text: "nothing: the ANOVA already protects the follow-up tests", misconception: "posthoc-without-correction", why: "A significant F doesn't protect individual unadjusted comparisons." },
          { id: "c", text: "t-tests can't be used with more than two groups", why: "They can, with a correction and the pooled MSW." },
        ],
      },
      reveal: {
        body: "A significant $F$ says some difference exists, but it may be one group out of six. The 15 unadjusted pair tests then give many extra chances of false alarms among the other pairs. Tukey's HSD uses a larger cut-off so the chance of *any* false pair across all 15 stays at 5%.",
      },
      resolve: {
        kind: "mc",
        id: "phc-resolve-1",
        prompt: "How should pairwise comparisons follow a significant ANOVA?",
        options: [
          { id: "a", text: "With a method that controls the error rate across all the pairs, such as Tukey's HSD", correct: true, why: "One error budget for the whole family." },
          { id: "b", text: "With ordinary t-tests, since the ANOVA was significant", misconception: "posthoc-without-correction", why: "That leaves the family unprotected." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "phc-check-1",
        prompt: "To compare group A with the average of groups B and C, which weights form a contrast?",
        options: [
          { id: "a", text: "$(1, -\\tfrac12, -\\tfrac12)$", correct: true, why: "They sum to 0." },
          { id: "b", text: "$(1, \\tfrac12, \\tfrac12)$", misconception: "contrast-sum", why: "Weights summing to 2 measure the overall level, not a difference." },
          { id: "c", text: "$(1, -1, -1)$", why: "These sum to $-1$: not a contrast." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "phc-check-2",
        prompt: "Three doses are each to be compared with a placebo, and nothing else. The most powerful suitable method is",
        options: [
          { id: "a", text: "Dunnett's", correct: true, why: "It protects exactly the treatment-versus-control comparisons." },
          { id: "b", text: "Scheffé's", why: "It protects every possible contrast, at a large cost in power." },
          { id: "c", text: "Tukey's", why: "It protects all pairs, including dose against dose." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Comparing several models across the same cross-validation folds is a post-hoc problem: the usual approach is a Friedman test followed by the Nemenyi post-hoc test on average ranks, reported as a critical-difference diagram.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "phc-produce-1", prompt: "$q = 3.77$, MSW = 4 and $n = 5$ per group. Find Tukey's HSD to 3 decimals.", answer: Math.round(3.77 * Math.sqrt(0.8) * 1000) / 1000, tolerance: 0.001, explain: "$3.77\\sqrt{4/5}$." },
        { kind: "number", id: "phc-produce-2", prompt: "Means 10, 7 and 9. Find the contrast $\\bar y_1 - \\tfrac12(\\bar y_2 + \\bar y_3)$.", answer: 2, explain: "$10 - 8$." },
        {
          kind: "mc",
          id: "phc-produce-3",
          prompt: "Contrast weights must",
          options: [
            { id: "a", text: "sum to zero", correct: true, why: "Then the contrast is unchanged if every mean shifts by the same amount." },
            { id: "b", text: "sum to one", misconception: "contrast-sum", why: "That gives a weighted average, not a comparison." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "phc-review-1", prompt: "Five planned comparisons at an overall $\\alpha = 0.05$ with Bonferroni. Find the per-comparison level.", answer: 0.01, explain: "$0.05/5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "orthogonal contrasts",
      body: "Contrasts $\\sum c_i\\bar y_i$ and $\\sum d_i\\bar y_i$ on equal-sized groups are **orthogonal** if $\\sum c_id_i = 0$. A set of $k - 1$ orthogonal contrasts splits SSB into $k - 1$ independent one-degree-of-freedom pieces.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "testing a contrast",
      statement: "For a contrast $L = \\sum c_i\\bar y_i$, $t = \\dfrac{L}{\\sqrt{\\text{MSW}\\sum c_i^2/n_i}}$ on $N - k$ degrees of freedom. Its sum of squares is $\\text{SS}_L = \\dfrac{L^2}{\\sum c_i^2/n_i}$.",
      proof: ["The group means are independent with variances $\\sigma^2/n_i$, so $\\operatorname{Var}(L) = \\sigma^2\\sum c_i^2/n_i$, with $\\sigma^2$ estimated by MSW (§{one-way-anova})."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "Tukey and Scheffé",
      statement: "Tukey's HSD for equal groups: $q_{k,\\,N-k}\\sqrt{\\text{MSW}/n}$. Scheffé declares a contrast significant if $|t| > \\sqrt{(k - 1)F^*_{k-1,\\,N-k}}$, where $F^*$ is the ANOVA's critical value.",
      proof: ["Tukey bounds the largest of all pairwise differences, which follows the studentized range distribution. Scheffé's bound covers the largest possible contrast, whose square over its variance is $(k - 1)$ times an F variable."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "choosing a method",
      statement: "A few comparisons planned in advance: Bonferroni. All pairs: Tukey. Each treatment against a control: Dunnett. Comparisons suggested by the data, or complex contrasts: Scheffé.",
      proof: ["Each protects exactly the family it is designed for; protecting a larger family than needed wastes power."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 2,
      title: "Tukey's HSD",
      problem: "Three groups of 5 have means 12, 15 and 20, MSW = 4, and $q = 3.77$ for 3 groups and 12 d.f. Which pairs differ?",
      solution: ["HSD $= 3.77\\sqrt{4/5} \\approx 3.37$.", "Gaps: $15 - 12 = 3$ (no), $20 - 15 = 5$ (yes), $20 - 12 = 8$ (yes)."],
      result: "Group 3 differs from both others; groups 1 and 2 don't differ significantly.",
    },
    {
      type: "example",
      level: 3,
      title: "a contrast",
      problem: "Means 10, 7 and 9 from groups of 5, MSW = 4. Test $L = \\bar y_1 - \\tfrac12(\\bar y_2 + \\bar y_3)$.",
      solution: ["$L = 10 - 8 = 2$; $\\sum c_i^2/n = 1.5/5 = 0.3$.", "SE $= \\sqrt{4 \\times 0.3} \\approx 1.095$, so $t \\approx 1.83$ on 12 d.f.: not significant at 5% (cut-off 2.179)."],
      result: "$t \\approx 1.83$.",
    },
  ],
  pitfalls: [
    { wrong: "Run unadjusted t-tests on every pair after a significant ANOVA.", right: "Use Tukey, Dunnett, Scheffé or Bonferroni as the question requires." },
    { wrong: "Choose a comparison after seeing the data and test it as if planned.", right: "Data-suggested comparisons need Scheffé's protection." },
    { wrong: "Contrast weights that don't sum to 0.", right: "Make them sum to 0 so the contrast measures a difference." },
  ],
  formulas: [
    { label: "Contrast SE", tex: "\\sqrt{\\text{MSW}\\textstyle\\sum c_i^2/n_i}" },
    { label: "Tukey HSD", tex: "q\\sqrt{\\text{MSW}/n}" },
    { label: "Scheffé cut-off", tex: "\\sqrt{(k - 1)F^*}" },
  ],
  exercises: [
    ex(1, num("phcx-ex-1", "How many pairwise comparisons does Tukey's HSD cover for 5 groups?", 10, "$\\binom52$."), ["$10$."]),
    ex(1, num("phcx-ex-2", "Dunnett compares 4 treatments with one control. How many comparisons?", 4, "One per treatment."), ["$4$."]),
    ex(2, dp("phcx-ex-3", "$q = 3.88$, MSW = 9 and $n = 6$. Find Tukey's HSD.", 3.88 * Math.sqrt(1.5), "$q\\sqrt{\\text{MSW}/n}$."), ["$3.88\\sqrt{1.5} \\approx 4.752$."]),
    ex(2, num("phcx-ex-4", "Means 20, 14 and 12. Find $\\bar y_1 - \\tfrac12(\\bar y_2 + \\bar y_3)$.", 7, "$20 - 13$."), ["$7$."]),
    ex(2, dp("phcx-ex-5", "Same contrast, $n = 4$ per group, MSW = 8. Find its SE.", Math.sqrt(8 * (1.5 / 4)), "$\\sqrt{8 \\times 1.5/4}$."), ["$\\sqrt3 \\approx 1.732$."]),
    ex(3, mc("phcx-ex-6", "Which weights are orthogonal to $(1, -1, 0)$ for equal groups?", ["$(1, 1, -2)$", "$1 - 1 + 0 = 0$."], [["$(1, 0, -1)$", "$1 + 0 + 0 = 1$."], ["$(2, -1, -1)$", "$2 + 1 + 0 = 3$."]]), ["Orthogonal contrasts have $\\sum c_id_i = 0$."]),
    ex(3, dp("phcx-ex-7", "$k = 4$ groups and the ANOVA's critical value is $F^* = 3.10$. Find Scheffé's cut-off for $|t|$.", Math.sqrt(3 * 3.1), "$\\sqrt{(k - 1)F^*}$."), ["$\\sqrt{9.3} \\approx 3.050$, well above 1.96."]),
    ex(3, mc("phcx-ex-8", "After looking at the data, a researcher notices groups 2 and 5 look different from the rest and tests that contrast. The right protection is", ["Scheffé's method", "The comparison was suggested by the data."], [["an unadjusted t-test", "That ignores how the contrast was chosen."], ["Dunnett's method", "There is no control group here."]]), ["Scheffé protects every contrast, including ones picked after seeing the data."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const q = r.pick([3.08, 3.46, 3.77, 3.88, 4.2]);
      const msw = r.int(2, 10 * lv);
      const nn = r.int(4, 10);
      const hsd = q * Math.sqrt(msw / nn);
      return n(`$q = ${q}$, MSW = ${msw} and $n = ${nn}$ per group. Find Tukey's HSD (3 decimals).`, Math.round(hsd * 1000) / 1000, `$${q}\\sqrt{${msw}/${nn}} \\approx ${Math.round(hsd * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m = Array.from({ length: 3 }, () => r.int(5, 25));
      const L = m[0] - (m[1] + m[2]) / 2;
      return n(`Group means are ${m.join(", ")}. Find the contrast $\\bar y_1 - \\tfrac12(\\bar y_2 + \\bar y_3)$.`, L, `$${m[0]} - ${r2((m[1] + m[2]) / 2)} = ${r2(L)}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { task: "compare every pair of 5 teaching methods", ans: "Tukey's HSD" },
        { task: "compare each of 3 new drugs with a placebo", ans: "Dunnett's test" },
        { task: "test a complicated comparison noticed only after looking at the data", ans: "Scheffé's method" },
        { task: "test 2 comparisons planned before the study", ans: "Bonferroni" },
      ]);
      const all = ["Tukey's HSD", "Dunnett's test", "Scheffé's method", "Bonferroni"];
      return mcNumbers(
        `After a significant ANOVA you want to ${s.task}. Which method fits best?`,
        { text: s.ans, why: "It protects exactly that family of comparisons." },
        [
          ...all.filter((a) => a !== s.ans).slice(0, 2).map((a) => ({ text: a, why: "It protects a different family of comparisons." })),
          { text: "Unadjusted t-tests", why: "They leave the family of comparisons unprotected.", misconception: "posthoc-without-correction" },
        ],
      );
    },
  },
];
