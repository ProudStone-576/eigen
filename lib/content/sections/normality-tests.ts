import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Kolmogorov–Smirnov, Shapiro–Wilk, Anderson–Darling, Lilliefors, chi-square goodness of fit with estimated parameters, the runs test. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const ksUniform = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return Math.max(...s.map((x, i) => Math.max((i + 1) / n - x, x - i / n)));
};

const base: ConceptNode = {
  id: "normality-tests",
  title: "Goodness-of-fit & normality tests",
  summary: "Goodness-of-fit tests ask whether data could come from a stated distribution. The Kolmogorov–Smirnov test uses the largest gap between the empirical and hypothesised distribution functions; Shapiro–Wilk and Anderson–Darling are more powerful tests of normality; the runs test checks whether a sequence looks random. A non-significant result is not proof of fit.",
  deps: ["transformations", "chi-square", "hypothesis-tests"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "goodness of fit", meaning: "How well a stated distribution describes the data." },
    { term: "KS statistic", meaning: "$D = \\max_x|\\hat F(x) - F(x)|$, the largest vertical gap between the empirical and hypothesised CDFs." },
    { term: "run", meaning: "A maximal stretch of identical symbols in a sequence, such as HHH in HTHHHT." },
  ],
  misconceptions: {
    "accept-normal": "Treats a non-significant normality test as proof that the data are normal.",
    "normality-test-large-n": "Thinks a formal normality test is the best guide to whether normal-theory methods are safe, at any sample size.",
  },
  steps: [
    {
      type: "motivate",
      title: "Is it really normal?",
      body: "Every t-test, ANOVA and regression interval rests on some normality assumption. Q-Q plots (§{transformations}) show departures by eye; goodness-of-fit tests put a p-value on them. Knowing what those p-values can and cannot say matters as much as computing them.",
      realWorld: {
        title: "Random number generators",
        body: "Random number generators are certified with batteries of goodness-of-fit tests: their outputs must look uniform (Kolmogorov–Smirnov, chi-square) and their sequences free of patterns (runs tests) before they are trusted in simulations or cryptography.",
      },
    },
    {
      type: "truth",
      statement: "**Kolmogorov–Smirnov**: $D = \\max_x|\\hat F(x) - F(x)|$; at 5% reject a fully specified $F$ if $D > 1.36/\\sqrt n$ (large $n$). **Shapiro–Wilk** measures how well the sorted data line up with expected normal quantiles: $W$ near 1 means close to normal. **Anderson–Darling** weights the gaps in the tails more heavily. The **chi-square** goodness-of-fit test loses one degree of freedom for each parameter estimated from the data.",
      body: "If the normal's mean and SD are estimated from the same data, the plain KS critical values are too lenient; the **Lilliefors** correction fixes this. The **runs test** counts runs in a sequence: too few suggests clustering, too many suggests alternation. With $n_1$ and $n_2$ symbols, $E[\\text{runs}] = 1 + \\dfrac{2n_1n_2}{n_1 + n_2}$.",
    },
    {
      type: "predict",
      misconception: "accept-normal",
      item: {
        kind: "mc",
        id: "nrt-predict-1",
        prompt: "A Shapiro–Wilk test on 12 observations gives $p = 0.40$. What can you conclude?",
        options: [
          { id: "a", text: "Only that the test found no clear evidence against normality", correct: true, why: "With 12 points it has little power." },
          { id: "b", text: "The data are normal", misconception: "accept-normal", why: "Failing to reject is not proving." },
          { id: "c", text: "The data are definitely not normal", why: "A large p is not evidence against $H_0$." },
        ],
      },
      reveal: {
        body: "With 12 observations even a clearly skewed population will often pass a normality test. A non-significant result says the data are *consistent* with normality, as they would be with many other shapes. Look at a Q-Q plot, think about how the data arose, and remember that some methods are robust to moderate departures anyway.",
      },
      resolve: {
        kind: "mc",
        id: "nrt-resolve-1",
        prompt: "What does a large p-value from a normality test mean?",
        options: [
          { id: "a", text: "No strong evidence against normality, not proof of it", correct: true, why: "Small samples rarely reject." },
          { id: "b", text: "The data are confirmed normal", misconception: "accept-normal", why: "Tests can't confirm a null hypothesis." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "nrt-check-1",
        prompt: "With 100,000 observations, a normality test rejects at $p < 0.001$, though the Q-Q plot looks almost straight. For a t-test on the mean,",
        options: [
          { id: "a", text: "the tiny departure doesn't matter; the CLT makes the mean nearly normal", correct: true, why: "Huge samples detect trivial departures." },
          { id: "b", text: "the t-test is invalid because normality was rejected", misconception: "normality-test-large-n", why: "Rejection reflects sample size, not practical importance." },
          { id: "c", text: "the data must be transformed", why: "Not for inference about the mean with this $n$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "nrt-check-2",
        prompt: "A sequence has 10 heads and 10 tails. How many runs would you expect for a random sequence?",
        options: [
          { id: "a", text: "11", correct: true, why: "$1 + 2 \\times 10 \\times 10/20$." },
          { id: "b", text: "10", why: "Add 1 to $2n_1n_2/(n_1 + n_2)$." },
          { id: "c", text: "20", why: "That would mean strict alternation." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The two-sample Kolmogorov–Smirnov test is a standard check for **data drift**: compare a feature's distribution in live traffic with its distribution in the training data. With large traffic volumes it flags trivial shifts, so teams watch the size of $D$ itself, not just the p-value.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "nrt-produce-1", prompt: "Find the 5% Kolmogorov–Smirnov critical value $1.36/\\sqrt n$ for $n = 100$.", answer: 0.136, explain: "$1.36/10$." },
        { kind: "number", id: "nrt-produce-2", prompt: "Data 0.1, 0.4, 0.7 are tested against $U(0, 1)$. Find the KS statistic $D$.", answer: 0.3, explain: "The largest gap is just after 0.7: $1 - 0.7$." },
        {
          kind: "mc",
          id: "nrt-produce-4",
          prompt: "With 50,000 observations a normality test gives $p = 0.0001$, but the Q-Q plot is nearly straight. For a confidence interval for the mean,",
          options: [
            { id: "a", text: "the departure is harmless: the CLT covers the mean", correct: true, why: "Huge samples flag trivial departures." },
            { id: "b", text: "normal-theory methods are ruled out", misconception: "normality-test-large-n", why: "The test's verdict reflects $n$, not practical importance." },
          ],
        },
        {
          kind: "mc",
          id: "nrt-produce-3",
          prompt: "With $n = 15$, a normality test is not significant. The data",
          options: [
            { id: "a", text: "may or may not be normal; the test has little power", correct: true, why: "Small samples rarely reject." },
            { id: "b", text: "are shown to be normal", misconception: "accept-normal", why: "Non-rejection isn't confirmation." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "nrt-review-1", prompt: "A χ² goodness-of-fit test uses 8 categories and estimates 2 parameters. Find its degrees of freedom.", answer: 5, explain: "$8 - 1 - 2$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "two-sample KS, runs test",
      body: "The **two-sample KS** statistic is the largest gap between two empirical CDFs, testing whether two samples come from the same distribution. The **runs test** for $n_1$ and $n_2$ symbols has $E[R] = 1 + \\dfrac{2n_1n_2}{n_1 + n_2}$ and $\\operatorname{Var}(R) = \\dfrac{2n_1n_2(2n_1n_2 - n_1 - n_2)}{(n_1 + n_2)^2(n_1 + n_2 - 1)}$; a z-score against these checks randomness.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "KS is distribution-free",
      statement: "For any continuous, fully specified $F$, the null distribution of $D$ is the same: transforming each value by $F$ turns the problem into testing uniformity on $[0, 1]$.",
      proof: ["If $X$ has continuous CDF $F$, then $F(X) \\sim U(0, 1)$ (the probability integral transform), and $D$ is unchanged by applying the increasing function $F$ to both curves."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what normality tests are good for",
      statement: "In small samples normality tests have little power; in huge samples they reject trivial departures. Judge normality with a Q-Q plot and the purpose: means of large samples are protected by the CLT; prediction intervals and variance tests are not (§{intervals-more}).",
      proof: ["Power grows with $n$ for any fixed departure, so the same p-value threshold means very different things at $n = 15$ and $n = 100{,}000$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "estimated parameters",
      statement: "Estimating the parameters from the same data makes the fit look better than it is. For χ², subtract one degree of freedom per estimated parameter; for KS against a normal, use Lilliefors' critical values; Shapiro–Wilk and Anderson–Darling handle this automatically.",
      proof: ["The fitted distribution is chosen to be close to the data, so the gaps are systematically smaller than for a distribution fixed in advance."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the 5% KS critical value for $n = 400$.",
      solution: ["$1.36/\\sqrt{400} = 1.36/20$.", "$= 0.068$."],
      result: "0.068.",
    },
    {
      type: "example",
      level: 2,
      title: "computing D",
      problem: "Test whether 0.1, 0.4, 0.7 come from $U(0, 1)$: find $D$.",
      solution: [
        "At each data point compare $F(x) = x$ with $\\hat F$ just before and just after the jump: at 0.1, gaps 0.1 and $0.333 - 0.1 = 0.233$; at 0.4, 0.067 and 0.267; at 0.7, 0.033 and 0.3.",
        "The largest is 0.3.",
      ],
      result: "$D = 0.3$.",
    },
    {
      type: "example",
      level: 3,
      title: "a runs test",
      problem: "A coin gives HHHHHTTTTTHHHHHTTTTT: 10 heads, 10 tails, 4 runs. Is it random?",
      solution: [
        "$E[R] = 11$ and $\\operatorname{Var}(R) = \\dfrac{2 \\times 100 \\times 180}{400 \\times 19} \\approx 4.74$, SD $\\approx 2.18$.",
        "$z = (4 - 11)/2.18 \\approx -3.2$: far too few runs. The sequence is clumped, not random.",
      ],
      result: "$z \\approx -3.2$: not random.",
    },
  ],
  pitfalls: [
    { wrong: "A non-significant normality test proves normality.", right: "It only fails to find evidence against it." },
    { wrong: "Reject a t-test whenever a normality test is significant.", right: "With large $n$, small departures are harmless for means; check the Q-Q plot." },
    { wrong: "Use standard KS critical values after estimating the mean and SD.", right: "Use Lilliefors' values or Shapiro–Wilk." },
  ],
  formulas: [
    { label: "KS", tex: "D = \\max|\\hat F(x) - F(x)|,\\quad D_{0.05} \\approx 1.36/\\sqrt n" },
    { label: "χ² d.f.", tex: "k - 1 - (\\text{parameters estimated})" },
    { label: "Runs", tex: "E[R] = 1 + \\dfrac{2n_1n_2}{n_1 + n_2}" },
  ],
  exercises: [
    ex(1, num("nrtx-ex-1", "Find the 5% KS critical value for $n = 25$.", 0.272, "$1.36/5$."), ["$0.272$."]),
    ex(1, num("nrtx-ex-2", "A χ² goodness-of-fit test for a Poisson uses 6 categories and estimates $\\lambda$. Find its degrees of freedom.", 4, "$6 - 1 - 1$."), ["$4$."]),
    ex(2, dp("nrtx-ex-3", "Data 0.2, 0.5, 0.9 are tested against $U(0, 1)$. Find $D$.", ksUniform([0.2, 0.5, 0.9]), "Check both sides of each jump."), ["Gaps: at 0.2, 0.2 and 0.133; at 0.5, 0.167 and 0.167; at 0.9, 0.233 and 0.1. $D \\approx 0.233$."]),
    ex(2, num("nrtx-ex-4", "A sequence has 12 of one symbol and 8 of another. Find the expected number of runs.", 10.6, "$1 + 2 \\times 96/20$."), ["$1 + 9.6 = 10.6$."]),
    ex(2, mc("nrtx-ex-5", "Which normality test gives most weight to the tails?", ["Anderson–Darling", "It weights gaps by $1/(F(1 - F))$."], [["Kolmogorov–Smirnov", "KS is most sensitive near the centre."], ["The runs test", "That tests randomness, not normality."]]), ["Tail behaviour is often what matters for extreme-value risk."]),
    ex(3, dp("nrtx-ex-6", "10 heads and 10 tails come in 4 runs. Find the runs-test $z$.", (4 - 11) / Math.sqrt((2 * 100 * (200 - 20)) / (400 * 19)), "$(R - E[R])/\\text{SD}$."), ["$\\text{SD} = \\sqrt{36000/7600} \\approx 2.176$, so $z \\approx -3.217$."]),
    ex(3, mc("nrtx-ex-7", "A normal distribution is fitted to data by estimating $\\mu$ and $\\sigma$, then the ordinary KS test is applied. Its p-value is", ["too large: the test is too lenient", "Fitting to the data shrinks the gaps."], [["exact", "The KS null distribution assumes $F$ fixed in advance."], ["too small", "The bias runs the other way."]]), ["Use Lilliefors' critical values instead."]),
    ex(3, mc("nrtx-ex-8", "A model's input feature has KS distance $D = 0.01$ between training and live data, with $p < 0.0001$ on a million rows. You should", ["judge the size of the shift, which is tiny", "Huge samples make tiny shifts significant."], [["retrain immediately", "Significance alone doesn't show the shift matters."], ["ignore drift monitoring", "Monitoring is still useful; read $D$ itself."]]), ["Report effect size ($D$) alongside p-values for drift."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const nn = r.pick([16, 25, 36, 49, 64, 100, 144, 400]);
      const v = 1.36 / Math.sqrt(nn);
      return n(`Find the 5% Kolmogorov–Smirnov critical value $1.36/\\sqrt n$ for $n = ${nn}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$1.36/${Math.sqrt(nn)} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = 2 + lv;
      const xs = new Set<number>();
      while (xs.size < k) xs.add(r.int(1, 19) / 20);
      const data = [...xs].sort((a, b) => a - b);
      const d = ksUniform(data);
      return n(`Data ${data.join(", ")} are tested against $U(0, 1)$. Find the KS statistic $D$ (3 decimals).`, Math.round(d * 1000) / 1000, `Compare $F(x) = x$ with $\\hat F$ on both sides of each jump; the largest gap is about ${Math.round(d * 1000) / 1000}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([10, 12, 15, 20]);
      const p = r.pick([0.2, 0.35, 0.5, 0.8]);
      return mcNumbers(
        `A Shapiro–Wilk test on ${nn} observations gives $p = ${p}$. What follows?`,
        { text: "No strong evidence against normality, which is not proof of normality", why: "Small samples give normality tests little power." },
        [
          { text: "The data are normal", why: "Failing to reject doesn't confirm $H_0$.", misconception: "accept-normal" },
          { text: "The data are not normal", why: "A large p-value isn't evidence against normality." },
        ],
      );
    },
  },
];
