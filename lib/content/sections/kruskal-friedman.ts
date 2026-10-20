import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Kruskal–Wallis for several independent groups; Friedman for blocks or repeated measures; follow-up comparisons. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const H = (R: number[], ns: number[]) => {
  const N = ns.reduce((s, x) => s + x, 0);
  return (12 / (N * (N + 1))) * R.reduce((s, x, i) => s + (x * x) / ns[i], 0) - 3 * (N + 1);
};
const friedman = (R: number[], nb: number) => {
  const k = R.length;
  return (12 / (nb * k * (k + 1))) * R.reduce((s, x) => s + x * x, 0) - 3 * nb * (k + 1);
};

const base: ConceptNode = {
  id: "kruskal-friedman",
  title: "Kruskal–Wallis & Friedman tests",
  summary: "The rank-based versions of ANOVA. Kruskal–Wallis compares several independent groups through their rank sums, with H approximately χ² on k − 1 degrees of freedom; Friedman's test does the same for blocks or repeated measures, ranking within each block. A significant result is followed by corrected pairwise comparisons.",
  deps: ["rank-tests", "one-way-anova"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "rank sum", meaning: "The total of a group's ranks in the combined sample." },
    { term: "within-block ranking", meaning: "Ranking the treatments separately inside each block or subject, as Friedman's test does." },
    { term: "Dunn's test", meaning: "A follow-up to Kruskal–Wallis that compares pairs of groups by their mean ranks, with a correction for multiple comparisons." },
  ],
  misconceptions: {
    "kw-paired": "Uses the Kruskal–Wallis test for repeated measurements on the same subjects, where Friedman's test is needed.",
    "kw-shows-which": "Thinks a significant Kruskal–Wallis or Friedman test identifies which groups differ.",
  },
  steps: [
    {
      type: "motivate",
      title: "ANOVA without the bell curve",
      body: "Waiting times at four clinics are heavily skewed, with a few patients waiting for hours. ANOVA's F-test leans on roughly normal groups; ranking all the waiting times together and comparing the clinics' average ranks needs no such assumption.",
      realWorld: {
        title: "Comparing algorithms",
        body: "Machine-learning papers comparing several methods across many datasets rank the methods within each dataset and run Friedman's test, because accuracy scores on different datasets are not on comparable scales.",
      },
    },
    {
      type: "truth",
      statement: "**Kruskal–Wallis**: rank all $N$ observations together; with rank sums $R_i$ for groups of size $n_i$, $H = \\dfrac{12}{N(N + 1)}\\sum_i\\dfrac{R_i^2}{n_i} - 3(N + 1) \\approx \\chi^2_{k-1}$ under $H_0$. **Friedman**: with $b$ blocks and $k$ treatments, rank the treatments within each block; with treatment rank sums $R_j$, $\\chi^2_F = \\dfrac{12}{bk(k + 1)}\\sum_jR_j^2 - 3b(k + 1) \\approx \\chi^2_{k-1}$.",
      body: "Kruskal–Wallis is the extension of Mann–Whitney to $k$ groups; Friedman's test extends the sign test to $k$ treatments within blocks. Like ANOVA's F, they say whether some groups differ, not which: follow with Dunn's test (after Kruskal–Wallis) or Nemenyi's (after Friedman), both corrected for multiple comparisons.",
    },
    {
      type: "predict",
      misconception: "kw-paired",
      item: {
        kind: "mc",
        id: "kwf-predict-1",
        prompt: "Each of 8 tasters rates four coffees on a 1–10 scale. Which test compares the coffees?",
        options: [
          { id: "a", text: "Friedman's test, ranking the coffees within each taster", correct: true, why: "Each taster is a block." },
          { id: "b", text: "Kruskal–Wallis on the four sets of ratings", misconception: "kw-paired", why: "The ratings aren't independent groups: each taster rated every coffee." },
          { id: "c", text: "A Mann–Whitney test for each pair", why: "That ignores the blocking and multiplies the tests." },
        ],
      },
      reveal: {
        body: "Tasters differ: some rate everything high. Kruskal–Wallis would mix those taster differences into the comparison and treat each taster's four ratings as unrelated. Friedman's test ranks the four coffees within each taster, so only each taster's preferences count, just as repeated-measures ANOVA removes subject differences.",
      },
      resolve: {
        kind: "mc",
        id: "kwf-resolve-1",
        prompt: "When is Friedman's test used instead of Kruskal–Wallis?",
        options: [
          { id: "a", text: "When each block or subject receives every treatment", correct: true, why: "Rank within blocks." },
          { id: "b", text: "Never: Kruskal–Wallis handles repeated measures too", misconception: "kw-paired", why: "It assumes independent groups." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kwf-check-1",
        prompt: "A Kruskal–Wallis test of five fertilisers gives $p = 0.003$. You can conclude",
        options: [
          { id: "a", text: "at least one fertiliser tends to give different yields; follow up with Dunn's test", correct: true, why: "The overall test doesn't say which." },
          { id: "b", text: "fertiliser 5, with the highest mean rank, is best", misconception: "kw-shows-which", why: "That needs pairwise comparisons." },
          { id: "c", text: "all five differ from one another", misconception: "kw-shows-which", why: "One differing group is enough." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "kwf-check-2",
        prompt: "Kruskal–Wallis compares 4 groups. Its approximate null distribution is",
        options: [
          { id: "a", text: "$\\chi^2_3$", correct: true, why: "$k - 1$ degrees of freedom." },
          { id: "b", text: "$\\chi^2_4$", why: "One degree of freedom is lost." },
          { id: "c", text: "$F_{3, N-4}$", why: "That is for ANOVA's F." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The standard recipe for comparing $k$ classifiers over $n$ datasets ranks the classifiers on each dataset, runs Friedman's test, and if it rejects, applies the Nemenyi test to the average ranks, reported as a critical-difference diagram.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "kwf-produce-1", prompt: "Three groups of 3 have rank sums 6, 15 and 24. Find $H$.", answer: 7.2, explain: "$\\tfrac{12}{90}(12 + 75 + 192) - 30$." },
        { kind: "number", id: "kwf-produce-2", prompt: "4 blocks and 3 treatments with rank sums 4, 8 and 12. Find Friedman's statistic.", answer: 8, explain: "$\\tfrac{12}{48}(16 + 64 + 144) - 48$." },
        {
          kind: "mc",
          id: "kwf-produce-3",
          prompt: "After a significant Friedman test, to find which treatments differ, use",
          options: [
            { id: "a", text: "Nemenyi's test or corrected pairwise signed-rank tests", correct: true, why: "Corrected follow-up comparisons." },
            { id: "b", text: "nothing more: the treatment with the best rank sum wins", misconception: "kw-shows-which", why: "The overall test doesn't rank treatments." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "kwf-review-1", prompt: "Kruskal–Wallis on 6 groups. How many degrees of freedom has its χ² approximation?", answer: 5, explain: "$k - 1$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "mean ranks",
      body: "Kruskal–Wallis can be read through mean ranks $\\bar R_i = R_i/n_i$: under $H_0$ each is near the overall mean rank $\\tfrac{N + 1}{2}$, and $H = \\dfrac{12}{N(N + 1)}\\sum n_i\\left(\\bar R_i - \\tfrac{N + 1}{2}\\right)^2$, a between-groups sum of squares of the ranks.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "two forms of H",
      statement: "$\\dfrac{12}{N(N + 1)}\\sum n_i\\left(\\bar R_i - \\tfrac{N + 1}{2}\\right)^2 = \\dfrac{12}{N(N + 1)}\\sum\\dfrac{R_i^2}{n_i} - 3(N + 1)$.",
      proof: ["Expand the square and use $\\sum R_i = \\tfrac{N(N + 1)}{2}$, the total of all ranks."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "ties and small samples",
      statement: "With many ties, divide $H$ by $1 - \\dfrac{\\sum(t^3 - t)}{N^3 - N}$, where $t$ runs over the sizes of the tied groups. With fewer than about 5 per group, use exact or permutation p-values rather than the χ² approximation (§{permutation-tests}).",
      proof: ["Ties reduce the variance of the ranks, which the correction restores; the χ² limit needs moderately large groups."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 2,
      title: "Kruskal–Wallis",
      problem: "Three groups of 3, with no overlap: group A has ranks 1, 2, 3, B has 4, 5, 6, C has 7, 8, 9. Find $H$ and test at 5% (cut-off 5.99 for $\\chi^2_2$).",
      solution: [
        "Rank sums 6, 15, 24; $N = 9$.",
        "$H = \\tfrac{12}{90}\\left(\\tfrac{36}{3} + \\tfrac{225}{3} + \\tfrac{576}{3}\\right) - 30 = \\tfrac{12}{90} \\times 279 - 30 = 7.2$.",
        "$7.2 > 5.99$: the groups differ (though with 3 per group an exact p-value would be better).",
      ],
      result: "$H = 7.2$.",
    },
    {
      type: "example",
      level: 2,
      title: "Friedman",
      problem: "4 judges rank 3 recipes; the rank sums are 4, 8 and 12. Find $\\chi^2_F$ and test at 5%.",
      solution: ["$\\chi^2_F = \\tfrac{12}{4 \\times 3 \\times 4}(16 + 64 + 144) - 3 \\times 4 \\times 4 = \\tfrac{12}{48} \\times 224 - 48 = 8$.", "$8 > 5.99$: the recipes differ."],
      result: "$\\chi^2_F = 8$.",
    },
  ],
  pitfalls: [
    { wrong: "Use Kruskal–Wallis for repeated measures.", right: "Use Friedman's test, ranking within each subject." },
    { wrong: "Read off the winner from the mean ranks after a significant test.", right: "Follow up with corrected pairwise comparisons." },
    { wrong: "Plug raw values into the H formula.", right: "Use the ranks in the combined sample." },
  ],
  formulas: [
    { label: "Kruskal–Wallis", tex: "H = \\dfrac{12}{N(N + 1)}\\sum\\dfrac{R_i^2}{n_i} - 3(N + 1)" },
    { label: "Friedman", tex: "\\chi^2_F = \\dfrac{12}{bk(k + 1)}\\sum R_j^2 - 3b(k + 1)" },
    { label: "Null distribution", tex: "\\approx \\chi^2_{k-1}" },
  ],
  exercises: [
    ex(1, num("kwfx-ex-1", "Kruskal–Wallis on 4 groups. Find the degrees of freedom.", 3, "$k - 1$."), ["$3$."]),
    ex(1, num("kwfx-ex-2", "Find the mean of all ranks $1, \\dots, N$ for $N = 15$.", 8, "$(N + 1)/2$."), ["$8$."]),
    ex(2, dp("kwfx-ex-3", "Three groups of 4 have rank sums 14, 26 and 38. Find $H$.", H([14, 26, 38], [4, 4, 4]), "$N = 12$."), ["$\\tfrac{12}{156}(49 + 169 + 361) - 39 \\approx 5.538$."]),
    ex(2, num("kwfx-ex-4", "5 blocks and 3 treatments with rank sums 5, 10 and 15. Find Friedman's statistic.", friedman([5, 10, 15], 5), "$\\tfrac{12}{60}\\sum R_j^2 - 60$."), ["$\\tfrac{12}{60}(25 + 100 + 225) - 60 = 70 - 60 = 10$."]),
    ex(2, num("kwfx-ex-5", "In Friedman's test with $b$ blocks and $k$ treatments, what do all the rank sums add to when $b = 6$, $k = 4$?", 60, "$b \\times k(k + 1)/2$."), ["Each block's ranks add to 10: $6 \\times 10 = 60$."]),
    ex(3, mc("kwfx-ex-6", "Twelve students each try three study methods in random order, with test scores recorded. The right rank test is", ["Friedman's", "Each student is a block."], [["Kruskal–Wallis", "The three samples aren't independent."], ["Mann–Whitney", "There are three methods."]]), ["Rank the three scores within each student."]),
    ex(3, mc("kwfx-ex-7", "A Kruskal–Wallis test rejects. Which follow-up is appropriate?", ["Dunn's test with a multiple-comparison correction", "It compares mean ranks pairwise."], [["Unadjusted Mann–Whitney tests on every pair", "They leave the family unprotected."], ["None: the group with the top mean rank is best", "That isn't a test."]]), ["Dunn's test uses the same joint ranking as the overall test."]),
    ex(3, mc("kwfx-ex-8", "Groups of 2, 2 and 3 are compared with Kruskal–Wallis. The p-value should come from", ["the exact or permutation distribution", "The χ² approximation is poor for tiny groups."], [["$\\chi^2_2$", "It needs moderately large groups."], ["the normal distribution", "H is not normal."]]), ["With so few observations, enumerate the rank arrangements."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const per = r.int(3, 4 + lv);
      const k = 3;
      const N = per * k;
      const total = (N * (N + 1)) / 2;
      // Two random rank sums in the feasible range; the third makes the total right.
      const lo = (per * (per + 1)) / 2;
      const hi = (per * (2 * N - per + 1)) / 2;
      let R: number[];
      for (;;) {
        const a = r.int(lo, hi);
        const b = r.int(lo, hi);
        const c = total - a - b;
        if (c >= lo && c <= hi) {
          R = [a, b, c];
          break;
        }
      }
      const h = H(R, [per, per, per]);
      return n(`Three groups of ${per} have rank sums ${R.join(", ")} in the combined sample. Find the Kruskal–Wallis $H$ (3 decimals).`, Math.round(h * 1000) / 1000, `$N = ${N}$: $\\tfrac{12}{${N * (N + 1)}}\\sum R_i^2/${per} - ${3 * (N + 1)} \\approx ${Math.round(h * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const b = r.int(3, 6 + 2 * lv);
      const k = 3;
      const total = (b * k * (k + 1)) / 2;
      let R: number[];
      for (;;) {
        const x = r.int(b, 3 * b);
        const y = r.int(b, 3 * b);
        const z = total - x - y;
        if (z >= b && z <= 3 * b) {
          R = [x, y, z];
          break;
        }
      }
      const f = friedman(R, b);
      return n(`${b} blocks rank 3 treatments; the treatment rank sums are ${R.join(", ")}. Find Friedman's statistic (3 decimals).`, Math.round(f * 1000) / 1000, `$\\tfrac{12}{${b} \\times 3 \\times 4}\\sum R_j^2 - ${3 * b * 4} \\approx ${Math.round(f * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { text: "Ten patients each try three painkillers on different days and rate their pain.", ans: "Friedman's test" },
        { text: "Thirty patients are split at random into three painkiller groups and rate their pain.", ans: "Kruskal–Wallis" },
        { text: "Five judges each rank six paintings.", ans: "Friedman's test" },
        { text: "Waiting times are recorded for patients at four different clinics.", ans: "Kruskal–Wallis" },
      ]);
      const other = s.ans === "Friedman's test" ? "Kruskal–Wallis" : "Friedman's test";
      return mcNumbers(
        `${s.text} Which rank test compares the groups?`,
        { text: s.ans, why: s.ans === "Friedman's test" ? "The same units receive every treatment: rank within each." : "The groups are independent." },
        [{ text: other, why: s.ans === "Friedman's test" ? "Kruskal–Wallis assumes independent groups." : "Friedman needs blocks that receive every treatment.", ...(s.ans === "Friedman's test" ? { misconception: "kw-paired" } : {}) }],
      );
    },
  },
];
