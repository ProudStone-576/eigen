import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Effect sizes, minimum detectable effect, equivalence testing; Bonferroni, Holm and Benjamini–Hochberg. */

const holmCount = (ps: number[], a: number) => {
  const s = [...ps].sort((x, y) => x - y);
  let k = 0;
  while (k < s.length && s[k] <= a / (s.length - k)) k++;
  return k;
};
const bhCount = (ps: number[], q: number) => {
  const s = [...ps].sort((x, y) => x - y);
  let k = 0;
  s.forEach((p, i) => {
    if (p <= ((i + 1) / s.length) * q) k = i + 1;
  });
  return k;
};

const base: ConceptNode = {
  id: "multiple-testing",
  title: "Effect sizes & multiple testing",
  summary: "A p-value says whether an effect is detectable, not how big it is: report an effect size such as Cohen's d. Testing many hypotheses inflates false positives. Bonferroni and Holm control the chance of any false positive; Benjamini–Hochberg controls the expected share of false discoveries.",
  deps: ["errors-power", "t-tests"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "effect size", meaning: "How big a difference is, in units that don't depend on the sample size, such as standard deviations." },
    { term: "family-wise error rate", meaning: "The chance of at least one false rejection among a set of tests." },
    { term: "false discovery rate", meaning: "The expected share of false rejections among all the rejections made." },
  ],
  misconceptions: {
    "p-as-effect-size": "Reads a smaller p-value as a bigger or more important effect.",
    "fdr-vs-fwer": "Confuses controlling the false discovery rate (the share of rejections that are false) with controlling the chance of any false rejection.",
  },
  steps: [
    {
      type: "motivate",
      title: "Twenty tests, one discovery",
      body: "A study tests 20 foods for a link to acne and reports the one with $p = 0.03$. With 20 tries, a result like that turns up by chance about two times in three. And even a real effect can be too small to matter.",
      realWorld: {
        title: "Genome scans",
        body: "A genome-wide study tests about a million genetic variants. At $\\alpha = 0.05$ each, 50,000 false positives would be expected, so geneticists require $p < 5 \\times 10^{-8}$, a Bonferroni-style threshold.",
      },
    },
    {
      type: "truth",
      statement: "**Cohen's d** $= \\dfrac{\\bar x_1 - \\bar x_2}{s_p}$ measures a difference in pooled standard deviations: about 0.2 is small, 0.5 medium, 0.8 large. With $m$ tests: **Bonferroni** rejects when $p_i \\le \\alpha/m$. **Holm** sorts the p-values and compares the $k$th smallest with $\\alpha/(m - k + 1)$, stopping at the first that fails. **Benjamini–Hochberg** finds the largest $k$ with $p_{(k)} \\le \\tfrac km\\alpha$ and rejects the $k$ smallest.",
      body: "Bonferroni and Holm control the **family-wise error rate**, and Holm never rejects less. Benjamini–Hochberg controls the **false discovery rate**: it tolerates a few false positives in exchange for many more true ones, the right trade when screening thousands of candidates.",
    },
    {
      type: "predict",
      misconception: "p-as-effect-size",
      item: {
        kind: "mc",
        id: "mtt-predict-1",
        prompt: "Study A, with 10 people per group, finds a weight-loss effect with $p = 0.04$. Study B, with 10,000 per group, finds one with $p = 0.0001$. Which effect is larger?",
        options: [
          { id: "a", text: "You can't tell from the p-values; B's tiny p may come from its huge sample", correct: true, why: "$z \\approx d\\sqrt{n/2}$ mixes size with sample size." },
          { id: "b", text: "B's, because its p-value is far smaller", misconception: "p-as-effect-size", why: "A smaller p reflects more evidence, not a bigger effect." },
          { id: "c", text: "A's, because small studies find bigger effects", why: "That can happen, but the p-values alone don't show it." },
        ],
      },
      reveal: {
        body: "For two equal groups of size $n$, $z \\approx d\\sqrt{n/2}$. B reaches $z \\approx 3.9$ with $d \\approx 0.06$: a difference of 6% of a standard deviation, too small to matter. A needs $d \\approx 0.9$ to reach $z \\approx 2.05$. Report the effect size and its interval; the p-value says only whether it can be told apart from zero.",
      },
      resolve: {
        kind: "mc",
        id: "mtt-resolve-1",
        prompt: "How should the size of an effect be reported?",
        options: [
          { id: "a", text: "As an effect size, such as Cohen's d, with its confidence interval", correct: true, why: "That answers \"how big\"." },
          { id: "b", text: "By its p-value: smaller means bigger", misconception: "p-as-effect-size", why: "p falls with sample size even for a fixed effect." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mtt-check-1",
        prompt: "Benjamini–Hochberg at $q = 0.05$ rejects 40 hypotheses. What does it guarantee?",
        options: [
          { id: "a", text: "On average at most about 5% of rejections like these are false: about 2 of 40", correct: true, why: "It controls the false discovery rate." },
          { id: "b", text: "The chance of any false rejection is at most 5%", misconception: "fdr-vs-fwer", why: "That is family-wise control, which Bonferroni and Holm give." },
          { id: "c", text: "All 40 are real effects", why: "No procedure can promise that." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mtt-check-2",
        prompt: "Ten tests are run with overall $\\alpha = 0.05$. Find the Bonferroni threshold.",
        options: [
          { id: "a", text: "0.005", correct: true, why: "$0.05/10$." },
          { id: "b", text: "0.05", why: "That ignores the number of tests." },
          { id: "c", text: "0.5", why: "Divide by $m$, don't multiply." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Trying many models, features or hyperparameters on one validation set is multiple testing: the best score is optimistically biased (§{cross-validation}). Screening thousands of features one at a time should control the false discovery rate, not use $p < 0.05$ for each.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mtt-produce-1", prompt: "Group means are 75 and 70 and the pooled SD is 10. Find Cohen's d.", answer: 0.5, explain: "$5/10$." },
        { kind: "number", id: "mtt-produce-2", prompt: "Holm with $m = 4$ and $\\alpha = 0.05$: find the threshold for the smallest p-value.", answer: 0.0125, explain: "$\\alpha/m$." },
        {
          kind: "mc",
          id: "mtt-produce-3",
          prompt: "Benjamini–Hochberg controls",
          options: [
            { id: "a", text: "the expected share of false discoveries among the rejections", correct: true, why: "The false discovery rate." },
            { id: "b", text: "the chance of any false rejection", misconception: "fdr-vs-fwer", why: "That is the family-wise error rate." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mtt-review-1", prompt: "Find the Bonferroni threshold for 25 tests at overall level 0.05.", answer: 0.002, explain: "$0.05/25$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "minimum detectable effect",
      body: "For a test at level $\\alpha$ (two-sided) with power $1 - \\beta$, the **minimum detectable effect** is $\\text{MDE} = (z_{\\alpha/2} + z_\\beta)\\,\\text{SE}$: the smallest true effect the study has the stated power to detect. With 95% and 80%, $\\text{MDE} \\approx 2.8\\,\\text{SE}$.",
    },
    {
      type: "definition",
      term: "equivalence and non-inferiority",
      body: "To show two treatments are **equivalent** within a margin $\\Delta$, run two one-sided tests (**TOST**): equivalence is declared at level $\\alpha$ if the $(1 - 2\\alpha)$ interval for the difference lies inside $(-\\Delta, \\Delta)$. **Non-inferiority** checks only one side: the new treatment is not worse by more than $\\Delta$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Bonferroni",
      statement: "Testing each of $m$ hypotheses at level $\\alpha/m$ keeps the chance of any false rejection at most $\\alpha$, whatever the dependence between the tests.",
      proof: ["$P(\\text{some false rejection}) \\le \\sum_{\\text{true nulls}}P(\\text{reject}) \\le m \\cdot \\tfrac{\\alpha}{m} = \\alpha$ by the union bound."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Holm is uniformly better",
      statement: "Holm's step-down procedure also keeps the family-wise error rate at most $\\alpha$, and it rejects every hypothesis Bonferroni rejects, often more.",
      proof: ["Its first threshold is Bonferroni's $\\alpha/m$, and later thresholds $\\alpha/(m - 1), \\alpha/(m - 2), \\dots$ are larger. Control follows by applying the union bound to the true nulls remaining at the first false rejection."],
    },
    {
      type: "theorem",
      name: "Benjamini–Hochberg",
      statement: "For independent tests, rejecting the $k$ smallest p-values, where $k$ is the largest index with $p_{(k)} \\le \\tfrac km q$, keeps the false discovery rate at most $q$.",
      proof: ["The proof (Benjamini and Hochberg, 1995) is beyond this book. Intuitively, if $k$ hypotheses are rejected, about $mp_{(k)} \\le kq$ of them are expected to be false under the null."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A drug lowers blood pressure by 4 mmHg against placebo; the pooled SD is 16 mmHg. Find Cohen's d.",
      solution: ["$d = 4/16 = 0.25$.", "A small effect, whatever its p-value."],
      result: "$d = 0.25$.",
    },
    {
      type: "example",
      level: 2,
      title: "Holm against Bonferroni",
      problem: "Four tests give $p = 0.001, 0.012, 0.02, 0.04$. Which are rejected at $\\alpha = 0.05$ by Bonferroni and by Holm?",
      solution: [
        "Bonferroni uses 0.0125 for all: rejects 0.001 and 0.012.",
        "Holm uses $0.0125, 0.0167, 0.025, 0.05$ in turn: $0.001$, $0.012$, $0.02$ and $0.04$ each pass, so all four are rejected.",
      ],
      result: "Bonferroni 2, Holm 4.",
    },
    {
      type: "example",
      level: 2,
      title: "Benjamini–Hochberg",
      problem: "Eight p-values: 0.001, 0.008, 0.039, 0.041, 0.042, 0.06, 0.074, 0.205. Apply BH at $q = 0.05$.",
      solution: ["Thresholds $k \\times 0.05/8$: 0.00625, 0.0125, 0.01875, 0.025, …", "Only $k = 1, 2$ satisfy $p_{(k)} \\le$ threshold, so the largest such $k$ is 2."],
      result: "Reject the two smallest.",
    },
    {
      type: "example",
      level: 3,
      title: "planning for a detectable effect",
      problem: "A trial's planned SE for the difference is 2 mmHg. Find the effect it can detect with 80% power at 5%, two-sided.",
      solution: ["$\\text{MDE} = (1.96 + 0.84) \\times 2$.", "$= 5.6$ mmHg."],
      result: "5.6 mmHg.",
    },
    {
      type: "example",
      level: 3,
      title: "showing equivalence",
      problem: "A generic and a brand drug are equivalent if they differ by less than 2 units. The 90% interval for the difference is $(-1.2, 0.8)$. Conclusion at 5%?",
      solution: ["TOST at 5% uses the 90% interval.", "$(-1.2, 0.8)$ lies inside $(-2, 2)$: equivalent."],
      result: "Equivalence shown.",
    },
  ],
  pitfalls: [
    { wrong: "The smaller p-value means the bigger effect.", right: "Compare effect sizes; p also depends on $n$." },
    { wrong: "Run 20 tests and report the one with $p < 0.05$.", right: "Correct for multiple testing, or pre-register a single primary test." },
    { wrong: "No significant difference means the treatments are equivalent.", right: "Absence of evidence isn't evidence of equivalence; use TOST with a margin." },
  ],
  formulas: [
    { label: "Cohen's d", tex: "d = (\\bar x_1 - \\bar x_2)/s_p" },
    { label: "Bonferroni", tex: "p_i \\le \\alpha/m" },
    { label: "Holm", tex: "p_{(k)} \\le \\alpha/(m - k + 1)" },
    { label: "Benjamini–Hochberg", tex: "p_{(k)} \\le \\tfrac km q" },
    { label: "MDE", tex: "(z_{\\alpha/2} + z_\\beta)\\,\\text{SE}" },
  ],
  exercises: [
    ex(1, num("mttx-ex-1", "Find the Bonferroni threshold for 20 tests at overall level 0.05.", 0.0025, "$\\alpha/m$."), ["$0.0025$."]),
    ex(1, num("mttx-ex-2", "Means differ by 3 and the pooled SD is 6. Find Cohen's d.", 0.5, "$3/6$."), ["$0.5$: a medium effect."]),
    ex(2, num("mttx-ex-3", "Holm with $m = 5$ and $\\alpha = 0.05$: find the threshold for the second-smallest p-value.", 0.0125, "$\\alpha/(m - 1)$."), ["$0.05/4 = 0.0125$."]),
    ex(2, num("mttx-ex-4", "Benjamini–Hochberg with $m = 10$ and $q = 0.05$: find the threshold for the third-smallest p-value.", 0.015, "$\\tfrac{3}{10} \\times 0.05$."), ["$0.015$."]),
    ex(2, num("mttx-ex-5", "Holm at $\\alpha = 0.05$ on $p = 0.004, 0.011, 0.03, 0.2$. How many are rejected?", holmCount([0.004, 0.011, 0.03, 0.2], 0.05), "Thresholds 0.0125, 0.0167, 0.025, 0.05."), ["0.004 and 0.011 pass; 0.03 fails 0.025, so stop: 2."]),
    ex(3, num("mttx-ex-6", "Benjamini–Hochberg at $q = 0.05$ on $p = 0.002, 0.009, 0.014, 0.05, 0.3$. How many are rejected?", bhCount([0.002, 0.009, 0.014, 0.05, 0.3], 0.05), "Thresholds 0.01, 0.02, 0.03, 0.04, 0.05."), ["$k = 3$ is the largest with $p_{(k)} \\le$ threshold ($0.014 \\le 0.03$): reject 3."]),
    ex(3, num("mttx-ex-7", "The planned SE of a difference is 1.5. Find the minimum detectable effect at 5% two-sided with 80% power.", 4.2, "$2.8 \\times 1.5$."), ["$4.2$."]),
    ex(3, num("mttx-ex-8", "Two groups of 50 differ by $d = 0.4$. Find the approximate z-statistic, $d\\sqrt{n/2}$.", 2, "$0.4 \\times 5$."), ["$0.4\\sqrt{25} = 2$."]),
    ex(3, mc("mttx-ex-9", "The 90% interval for a difference is $(-0.5, 2.5)$ and the equivalence margin is $\\pm 2$. At 5%,", ["equivalence is not shown", "The interval pokes above 2."], [["the drugs are equivalent", "The whole interval must lie within the margin."], ["the drugs differ significantly", "The 95% interval would contain 0."]]), ["TOST needs the 90% interval inside $(-2, 2)$; 2.5 lies outside."]),
    ex(3, mc("mttx-ex-10", "A small trial finds $p = 0.3$ for a new drug against the standard one. The fair conclusion is", ["the data can't distinguish them; equivalence is not shown", "Non-significance is not evidence of no difference."], [["the drugs are equivalent", "That needs an equivalence test."], ["the new drug is worse", "Nothing points that way."]]), ["Report the interval for the difference; if it is wide, the study is simply uninformative."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const m = r.pick([4, 5, 8, 10, 20, 25, 50]);
      const a = lv === 1 ? 0.05 : r.pick([0.05, 0.01]);
      return n(`Find the Bonferroni threshold for ${m} tests at overall level ${a} (5 decimals).`, Math.round((a / m) * 100000) / 100000, `$${a}/${m}$.`, 0.000005);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const s = r.pick([4, 5, 8, 10, 12, 15, 20]);
      const d = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 1]);
      const m1 = r.int(40, 80);
      const diff = d * s;
      return n(`Group means are ${r2(m1 + diff)} and ${m1}, with pooled SD ${s}. Find Cohen's d (2 decimals).`, r2(d), `$${r2(diff)}/${s} = ${r2(d)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const m = 4 + lv;
      const ps = Array.from({ length: m }, () => Math.round(r.pick([0.0005, 0.002, 0.004, 0.009, 0.012, 0.02, 0.03, 0.04, 0.06, 0.2, 0.5]) * 10000) / 10000).sort((x, y) => x - y);
      const holm = r.pick([true, false]);
      const k = holm ? holmCount(ps, 0.05) : bhCount(ps, 0.05);
      return n(`${holm ? "Holm" : "Benjamini–Hochberg"} at ${holm ? "$\\alpha$" : "$q$"} = 0.05 on p-values ${ps.join(", ")}. How many hypotheses are rejected?`, k, holm ? `Compare the $k$th smallest with $0.05/(${m} - k + 1)$ and stop at the first failure: ${k}.` : `Find the largest $k$ with $p_{(k)} \\le \\tfrac{k}{${m}} \\times 0.05$: ${k}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nBig = r.pick([5000, 10000, 50000]);
      const nSmall = r.pick([10, 15, 20]);
      return mcNumbers(
        `Study A (${nSmall} per group) reports $p = 0.03$; study B (${nBig.toLocaleString("en-US")} per group) reports $p = 0.0002$. Which found the larger effect?`,
        { text: "The p-values alone can't say", why: "With $z \\approx d\\sqrt{n/2}$, B's tiny p can come from a tiny $d$ and a huge $n$." },
        [
          { text: "B, since its p-value is smaller", why: "p falls with sample size even for a fixed effect.", misconception: "p-as-effect-size" },
          { text: "A, since it used fewer people", why: "Sample size alone doesn't decide effect size either." },
        ],
      );
    },
  },
];
