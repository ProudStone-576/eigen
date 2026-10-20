import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Two-proportion z-test, F-test for variances, chi-square homogeneity, McNemar's test. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const pooledZ = (x1: number, n1: number, x2: number, n2: number) => {
  const p = (x1 + x2) / (n1 + n2);
  return (x1 / n1 - x2 / n2) / Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
};

const base: ConceptNode = {
  id: "two-sample-tests",
  title: "Two-proportion and variance tests",
  summary: "Comparing two groups' proportions uses a z-test with the pooled proportion; comparing two variances uses the F-test; comparing several groups' spread over categories is the chi-square test of homogeneity; paired yes/no outcomes use McNemar's test.",
  deps: ["hypothesis-tests", "chi-square", "sampling-distributions"],
  pos: { x: 4, y: 1 },
  glossary: [
    { term: "pooled proportion", meaning: "Both groups' successes over both groups' totals: the common rate that $H_0$ says they share." },
    { term: "F-test", meaning: "A test comparing two variances by their ratio, referred to the F distribution." },
    { term: "McNemar's test", meaning: "A test for paired yes/no outcomes that uses only the pairs that disagree." },
  ],
  misconceptions: {
    "compare-intervals-overlap": "Concludes there is no significant difference because the two groups' separate confidence intervals overlap.",
    "unpooled-under-null": "Uses each group's own proportion in the SE of the two-proportion test statistic, instead of the pooled proportion that H₀ implies.",
  },
  steps: [
    {
      type: "motivate",
      title: "Is B really better?",
      body: "Sign-up page A converts 120 of 1,000 visitors; page B converts 150 of 1,000. The test compares the 3-point gap with how much such gaps vary when the two pages are really equally good.",
      realWorld: {
        title: "Vaccine trials",
        body: "Efficacy claims rest on comparing infection proportions in the vaccine and placebo groups. With tens of thousands per arm, even small proportions can differ convincingly.",
      },
    },
    {
      type: "truth",
      statement: "**Two-proportion z-test** of $H_0: p_1 = p_2$: pool $\\hat p = \\dfrac{x_1 + x_2}{n_1 + n_2}$ and compute $z = \\dfrac{\\hat p_1 - \\hat p_2}{\\sqrt{\\hat p(1 - \\hat p)\\left(\\tfrac{1}{n_1} + \\tfrac{1}{n_2}\\right)}}$. **F-test** of $H_0: \\sigma_1^2 = \\sigma_2^2$ for normal data: $F = s_1^2/s_2^2$ on $(n_1 - 1, n_2 - 1)$ degrees of freedom.",
      body: "Under $H_0$ the groups share one proportion, so the test uses the pooled estimate; an interval for the difference uses the two separate $\\hat p$'s (§{intervals-more}). The **chi-square test of homogeneity** asks whether several groups have the same distribution over categories, with exactly the arithmetic of the test of independence (§{chi-square}).",
    },
    {
      type: "predict",
      misconception: "compare-intervals-overlap",
      item: {
        kind: "mc",
        id: "tst-predict-1",
        prompt: "Group A's 95% interval for a proportion is (0.10, 0.14) and group B's is (0.13, 0.17). The intervals overlap. Is the difference significant at 5%?",
        options: [
          { id: "a", text: "It can be: test the difference itself", correct: true, why: "Here $z \\approx 2.08$, which is significant." },
          { id: "b", text: "No: overlapping intervals mean no significant difference", misconception: "compare-intervals-overlap", why: "Intervals can overlap while the difference is significant." },
          { id: "c", text: "Yes, always, because B's interval is higher", why: "Significance depends on the size of the gap relative to its SE." },
        ],
      },
      reveal: {
        body: "Each interval is $\\pm 1.96\\,\\text{SE}$ with SE about 0.0102. The difference 0.03 has SE $\\sqrt2 \\times 0.0102 \\approx 0.0144$, not $2 \\times 0.0102$, so $z \\approx 2.08$: significant. SEs of a difference combine like the sides of a right triangle, which is why overlapping intervals can still hide a real difference.",
      },
      resolve: {
        kind: "mc",
        id: "tst-resolve-1",
        prompt: "How should two groups be compared?",
        options: [
          { id: "a", text: "Compute the SE of the difference and test the difference directly", correct: true, why: "$\\text{SE}_{\\text{diff}} = \\sqrt{\\text{SE}_1^2 + \\text{SE}_2^2}$." },
          { id: "b", text: "Check whether their confidence intervals overlap", misconception: "compare-intervals-overlap", why: "That rule is far too conservative." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tst-check-1",
        prompt: "Page A: 120 of 1,000. Page B: 150 of 1,000. For the test of $H_0: p_A = p_B$, the SE should use",
        options: [
          { id: "a", text: "the pooled proportion $270/2000 = 0.135$", correct: true, why: "$H_0$ says the rates are equal, so estimate the common rate." },
          { id: "b", text: "each page's own rate, 0.12 and 0.15", misconception: "unpooled-under-null", why: "That is the SE for an interval, not for the test." },
          { id: "c", text: "the larger rate, 0.15", why: "There is no reason to favour one group." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tst-check-2",
        prompt: "$F = s_1^2/s_2^2 = 3.2$ on $(9, 9)$ degrees of freedom, and the upper 5% point of $F_{9, 9}$ is 3.18. The one-sided test of $\\sigma_1^2 > \\sigma_2^2$ at 5%",
        options: [
          { id: "a", text: "rejects $H_0$", correct: true, why: "$3.2 > 3.18$." },
          { id: "b", text: "does not reject $H_0$", why: "The statistic exceeds the cut-off." },
          { id: "c", text: "needs equal sample sizes, which it has", why: "Equal sizes are not required." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Comparing two classifiers' error rates on separate test sets is a two-proportion test. On the same test set the errors are paired, so use McNemar's test, which looks only at the examples where the two classifiers disagree.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "tst-produce-1", prompt: "30 of 200 succeed in group 1 and 50 of 300 in group 2. Find the pooled proportion.", answer: 0.16, explain: "$80/500$." },
        { kind: "number", id: "tst-produce-2", prompt: "$\\hat p_1 = 0.5$ and $\\hat p_2 = 0.4$, each from $n = 100$. Find the two-proportion $z$ to 3 decimals.", answer: Math.round(pooledZ(50, 100, 40, 100) * 1000) / 1000, tolerance: 0.001, explain: "Pooled 0.45; SE $= \\sqrt{0.2475 \\times 0.02}$." },
        {
          kind: "mc",
          id: "tst-produce-4",
          prompt: "Testing $H_0: p_1 = p_2$, the standard error in the z-statistic uses",
          options: [
            { id: "a", text: "the pooled proportion, since $H_0$ says the rates are equal", correct: true, why: "Estimate the common rate under $H_0$." },
            { id: "b", text: "each group's own proportion", misconception: "unpooled-under-null", why: "That SE belongs to the confidence interval for the difference." },
          ],
        },
        {
          kind: "mc",
          id: "tst-produce-3",
          prompt: "Two 95% intervals overlap slightly. The difference between the groups",
          options: [
            { id: "a", text: "may still be significant", correct: true, why: "Test the difference with its own SE." },
            { id: "b", text: "cannot be significant", misconception: "compare-intervals-overlap", why: "Overlap of up to about a third of the intervals' length is compatible with significance." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "tst-review-1", prompt: "Sample variances are 18 and 6. Find the F statistic, larger over smaller.", answer: 3, explain: "$18/6$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "homogeneity and independence",
      body: "A test of **independence** draws one sample and cross-classifies it by two variables; a test of **homogeneity** draws separate samples from several groups and classifies each by one variable. The designs differ, but expected counts, the statistic and the degrees of freedom are computed the same way.",
    },
    {
      type: "definition",
      term: "McNemar's test",
      body: "For paired yes/no outcomes, let $b$ and $c$ count the pairs that disagree in each direction. Under $H_0$ the disagreements split evenly, and $\\chi^2 = \\dfrac{(b - c)^2}{b + c}$ is compared with $\\chi^2_1$. The concordant pairs carry no information about the difference.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the z-test is the 2 × 2 chi-square test",
      statement: "For two proportions, $z^2$ from the pooled two-proportion test equals the chi-square statistic for the $2 \\times 2$ table of successes and failures (without continuity correction).",
      proof: ["Both measure the same departure from a common proportion; expanding the chi-square shortcut $\\dfrac{N(ad - bc)^2}{R_1R_2C_1C_2}$ (§{chi-square}) in terms of $\\hat p_1$, $\\hat p_2$ and the pooled $\\hat p$ gives $z^2$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "the F-test is fragile",
      statement: "The F-test for variances is very sensitive to non-normal data, even in large samples. Levene's or the Brown–Forsythe test, which compare absolute deviations from the group centres, are robust alternatives.",
      proof: ["The sampling distribution of $s^2$ depends on the population's kurtosis (§{transformations}); heavy tails make $F$ far more variable than the F distribution assumes."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "lower F points",
      statement: "The lower $\\alpha$ point of $F_{k_1, k_2}$ is $1/(\\text{upper } \\alpha \\text{ point of } F_{k_2, k_1})$, so tables need list only upper points.",
      proof: ["If $F \\sim F_{k_1, k_2}$ then $1/F \\sim F_{k_2, k_1}$ (§{sampling-distributions})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "an A/B test",
      problem: "Page A: 120 of 1,000. Page B: 150 of 1,000. Test $H_0: p_A = p_B$, two-sided, at 5%.",
      solution: ["Pooled $\\hat p = 0.135$; SE $= \\sqrt{0.135 \\times 0.865 \\times 0.002} \\approx 0.0153$.", "$z = -0.03/0.0153 \\approx -1.96$: right at the cut-off, $p \\approx 0.05$."],
      result: "Borderline: $p \\approx 0.050$.",
    },
    {
      type: "example",
      level: 2,
      title: "comparing variances",
      problem: "Machine 1: $n = 10$, $s^2 = 25$. Machine 2: $n = 13$, $s^2 = 9$. Test equal variances at 5%, two-sided. The upper 2.5% point of $F_{9, 12}$ is 3.44.",
      solution: ["$F = 25/9 \\approx 2.78$ on $(9, 12)$ degrees of freedom.", "$2.78 < 3.44$: no significant difference, assuming normal data."],
      result: "Do not reject.",
    },
    {
      type: "example",
      level: 3,
      title: "paired classifiers",
      problem: "Two models are scored on the same 500 test cases. A is right and B wrong on 40; B right and A wrong on 20; they agree on the rest. Test for a difference.",
      solution: ["$\\chi^2 = \\dfrac{(40 - 20)^2}{40 + 20} = \\dfrac{400}{60} \\approx 6.67$.", "With 1 d.f., $6.67 > 3.84$: A is significantly more accurate."],
      result: "$\\chi^2 \\approx 6.67$: significant.",
    },
  ],
  pitfalls: [
    { wrong: "Overlapping intervals mean no significant difference.", right: "Test the difference with $\\sqrt{\\text{SE}_1^2 + \\text{SE}_2^2}$." },
    { wrong: "Use the separate $\\hat p$'s in the test statistic.", right: "Under $H_0$ use the pooled proportion; use separate ones for an interval." },
    { wrong: "Compare two models on the same test set with a two-proportion test.", right: "The outcomes are paired: use McNemar's test." },
  ],
  formulas: [
    { label: "Two-proportion z", tex: "\\dfrac{\\hat p_1 - \\hat p_2}{\\sqrt{\\hat p(1 - \\hat p)(1/n_1 + 1/n_2)}}" },
    { label: "F-test", tex: "F = s_1^2/s_2^2 \\sim F_{n_1 - 1, n_2 - 1}" },
    { label: "McNemar", tex: "\\chi^2 = \\dfrac{(b - c)^2}{b + c}" },
  ],
  exercises: [
    ex(1, num("tstx-ex-1", "40 of 200 succeed in group 1 and 60 of 200 in group 2. Find the pooled proportion.", 0.25, "$100/400$."), ["$0.25$."]),
    ex(1, num("tstx-ex-2", "Sample variances are 20 and 5. Find $F$, larger over smaller.", 4, "$20/5$."), ["$4$."]),
    ex(2, dp("tstx-ex-3", "60 of 200 succeed in group 1 and 40 of 200 in group 2. Find the two-proportion $z$.", pooledZ(60, 200, 40, 200), "Pooled 0.25."), ["SE $= \\sqrt{0.25 \\times 0.75 \\times 0.01} \\approx 0.0433$.", "$z = 0.1/0.0433 \\approx 2.309$."]),
    ex(2, num("tstx-ex-4", "Paired outcomes disagree in 15 pairs one way and 5 the other. Find McNemar's $\\chi^2$.", 5, "$(15 - 5)^2/20$."), ["$100/20 = 5$."]),
    ex(2, dp("tstx-ex-5", "The upper 5% point of $F_{12, 9}$ is 3.07. Find the lower 5% point of $F_{9, 12}$.", 1 / 3.07, "Reciprocal."), ["$1/3.07 \\approx 0.326$."]),
    ex(3, fr("tstx-ex-6", "For the 60/200 vs 40/200 comparison, find the $2 \\times 2$ chi-square statistic.", 16 / 3, "It equals $z^2$."), ["$\\chi^2 = z^2 = \\dfrac{0.01}{0.25 \\times 0.75 \\times 0.01} = \\tfrac{16}{3} \\approx 5.333$."]),
    ex(3, dp("tstx-ex-7", "Same data. Find the unpooled SE used for a confidence interval for the difference.", Math.sqrt((0.3 * 0.7 + 0.2 * 0.8) / 200), "$\\sqrt{0.21/200 + 0.16/200}$."), ["$\\sqrt{0.00185} \\approx 0.043$."]),
    ex(3, mc("tstx-ex-8", "Patients are each tested by two diagnostic methods; you want to know whether the methods' positive rates differ. Use", ["McNemar's test", "The two results on each patient are paired."], [["a two-proportion z-test", "That assumes independent groups."], ["an F-test", "That compares variances."]]), ["Only patients on whom the methods disagree tell you which method calls more positives."]),
    ex(3, mc("tstx-ex-9", "Heavy-tailed data give $F = 4$ for two sample variances. You should", ["prefer a robust test such as Levene's", "The F-test is unreliable without normality."], [["trust the F-test, since $n$ is large", "Large samples don't rescue it."], ["take logs of $F$", "That doesn't address the assumption."]]), ["The F-test's level can be far from its nominal value with heavy tails."]),
    ex(3, mc("tstx-ex-10", "Three schools' pupils are sampled separately and asked which of four subjects they prefer. The appropriate test is", ["chi-square test of homogeneity", "Separate samples, one categorical variable."], [["chi-square test of independence", "That would take one sample classified two ways."], ["three two-proportion tests", "One test of the whole table controls the error rate."]]), ["The arithmetic matches the independence test; degrees of freedom $(3 - 1)(4 - 1) = 6$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const n1 = r.pick([100, 200, 400, 500]);
      const n2 = lv === 1 ? n1 : r.pick([100, 200, 400, 500]);
      const x1 = Math.round(n1 * r.pick([0.1, 0.2, 0.3, 0.4, 0.5]));
      const x2 = Math.round(n2 * r.pick([0.15, 0.25, 0.35, 0.45]));
      const z = pooledZ(x1, n1, x2, n2);
      const p = (x1 + x2) / (n1 + n2);
      return n(`${x1} of ${n1} succeed in group 1 and ${x2} of ${n2} in group 2. Find the two-proportion $z$ (2 decimals).`, r2(z), `Pooled $\\hat p = ${x1 + x2}/${n1 + n2} \\approx ${Math.round(p * 1000) / 1000}$; $z \\approx ${r2(z)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const b = r.int(5, 20 + 10 * lv);
      let c = r.int(2, 20 + 10 * lv);
      if (c === b) c += 1;
      const chi = (b - c) ** 2 / (b + c);
      return n(`Paired outcomes disagree in ${b} pairs one way and ${c} the other. Find McNemar's $\\chi^2$ (2 decimals).`, r2(chi), `$\\dfrac{(${b} - ${c})^2}{${b + c}} \\approx ${r2(chi)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const pa = r.pick([0.1, 0.2, 0.3]);
      const gap = r.pick([0.03, 0.04]);
      return mcNumbers(
        `Group A's 95% interval is (${r2(pa - 0.02)}, ${r2(pa + 0.02)}) and group B's is (${r2(pa + gap - 0.02)}, ${r2(pa + gap + 0.02)}). They overlap. What can you conclude about the difference?`,
        { text: "Nothing yet: test the difference with its own SE", why: `Each SE is about 0.0102, so the difference ${gap} has SE about 0.0144 and $z \\approx ${r2(gap / 0.0144)}$.` },
        [
          { text: "It is not significant", why: "Overlapping intervals can hide a significant difference.", misconception: "compare-intervals-overlap" },
          { text: "It is significant because B is higher", why: "Higher point estimates alone don't establish significance." },
        ],
      );
    },
  },
];
