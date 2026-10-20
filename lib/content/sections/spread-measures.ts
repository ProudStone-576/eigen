import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Mean and median absolute deviation, coefficient of variation, z-scores, outlier rules, pooled variance. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "spread-measures",
  title: "Robust & relative spread",
  summary: "The standard deviation squares deviations, so one extreme value can dominate it. The median absolute deviation and IQR resist outliers, the coefficient of variation compares spread across scales, and z-scores place a value relative to its group.",
  deps: ["variance", "quartiles-iqr"],
  pos: { x: 0, y: 2 },
  glossary: [
    { term: "MAD", meaning: "Median absolute deviation: the median distance of the values from their median." },
    { term: "coefficient of variation", meaning: "Standard deviation divided by mean: spread as a fraction of the typical size." },
    { term: "z-score", meaning: "How many standard deviations a value lies above (+) or below (−) the mean." },
  ],
  misconceptions: {
    "sd-resists-outliers": "Thinks one extreme value barely affects the standard deviation.",
    "sd-compare-scales": "Compares standard deviations of variables with very different means or units, instead of a relative measure.",
  },
  steps: [
    {
      type: "motivate",
      title: "One late delivery",
      body: "Five delivery times: 20, 22, 23, 25 and 90 minutes. Their standard deviation is about 27 minutes, larger than the gap between any two of the typical deliveries. A single late order dominates the measure of spread.",
      realWorld: {
        title: "Comparing risk",
        body: "A share priced around ₹50 moves by ₹5 a day; one priced around ₹2000 moves by ₹100. The second moves more rupees, but relative to its price (5% against 10%) the first is the riskier one.",
      },
    },
    {
      type: "explore",
      title: "Move the outlier",
      body: "The box plot's fences sit 1.5 IQR beyond the quartiles; the readout shows the mean and median.",
      widget: { kind: "summary1d", values: [20, 22, 23, 25, 27, 90], max: 100 },
      task: "Drag the 90 down to 30. Which summaries move a lot, and which barely move?",
    },
    {
      type: "truth",
      statement: "**Mean absolute deviation** $\\tfrac1n\\sum|x_i - \\bar x|$. **Median absolute deviation** $\\text{MAD} = \\operatorname{median}|x_i - m|$, where $m$ is the median. **Coefficient of variation** $\\text{CV} = s/\\bar x$, which has no units. **z-score** $z = (x - \\bar x)/s$.",
      body: "The standard deviation squares deviations, so one far-out value can dominate it; the MAD and IQR ignore how far out the extremes are. Two common outlier flags: beyond $Q_1 - 1.5\\,\\text{IQR}$ or $Q_3 + 1.5\\,\\text{IQR}$ (§{quartiles-iqr}), or $|z| > 3$. A flag means *investigate*, not *delete*.",
    },
    {
      type: "predict",
      misconception: "sd-resists-outliers",
      item: {
        kind: "mc",
        id: "spr-predict-1",
        prompt: "Data: 20, 22, 23, 25, 90. The 90 is corrected to 30. Which measure changes most?",
        options: [
          { id: "a", text: "The standard deviation: from about 27 to about 3.4", correct: true, why: "The squared deviation of the 90 made up most of the variance." },
          { id: "b", text: "Neither the SD nor the MAD changes much", misconception: "sd-resists-outliers", why: "The SD falls by a factor of about 8." },
          { id: "c", text: "The MAD", why: "The MAD stays at 2." },
        ],
      },
      reveal: {
        body: "With the 90, the deviations from the mean 36 are $-16, -14, -13, -11, 54$; squared they total 3658, and $54^2 = 2916$ of that comes from one value. The MAD uses the *median* of the absolute deviations from the median 23, which are $3, 1, 0, 2, 67$: it is 2, and stays 2 when 67 becomes 7.",
      },
      resolve: {
        kind: "mc",
        id: "spr-resolve-1",
        prompt: "Why is the standard deviation so sensitive to one extreme value?",
        options: [
          { id: "a", text: "Deviations are squared, so one large one dominates the sum", correct: true, why: "A deviation 4 times as large counts 16 times as much." },
          { id: "b", text: "It isn't: one value is only a fifth of the data", misconception: "sd-resists-outliers", why: "Its squared deviation was 80% of the total." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spr-check-1",
        prompt: "Heights have mean 170 cm and SD 10 cm; weights have mean 70 kg and SD 8 kg. Which varies more relative to its size?",
        options: [
          { id: "a", text: "Weight: CV about 11% against 6%", correct: true, why: "$8/70 \\approx 0.114$ and $10/170 \\approx 0.059$." },
          { id: "b", text: "Height, because 10 > 8", misconception: "sd-compare-scales", why: "Centimetres and kilograms can't be compared directly." },
          { id: "c", text: "They can't be compared at all", why: "The CV makes them comparable." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spr-check-2",
        prompt: "A test has mean 60 and SD 8. What is the z-score of 76?",
        options: [
          { id: "a", text: "2", correct: true, why: "$(76 - 60)/8$." },
          { id: "b", text: "16", why: "That is the raw difference." },
          { id: "c", text: "1.27", why: "That is $76/60$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "**Robust scaling** centres a feature at its median and divides by its IQR, so a few outliers can't squash every other value towards 0 (scikit-learn's RobustScaler). Anomaly detectors often start from a robust z-score, $|x - m|/(1.4826\\,\\text{MAD})$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "spr-produce-1", prompt: "Mean 50, SD 5. Find the z-score of 42.", answer: -1.6, explain: "$(42 - 50)/5$." },
        { kind: "number", id: "spr-produce-2", prompt: "Data have mean 40 and SD 6. Find the coefficient of variation.", answer: 0.15, explain: "$6/40$." },
        {
          kind: "mc",
          id: "spr-produce-3",
          prompt: "Machine A fills 500 g packs with SD 5 g; machine B fills 50 g packs with SD 2 g. Which is relatively more consistent?",
          options: [
            { id: "a", text: "A: CV 1% against 4%", correct: true, why: "$5/500$ and $2/50$." },
            { id: "b", text: "B, because 2 < 5", misconception: "sd-compare-scales", why: "Compare spread relative to pack size." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "spr-review-1", prompt: "Find the MAD of 1, 2, 4, 7, 20.", answer: 3, explain: "Median 4; absolute deviations 3, 2, 0, 3, 16 have median 3." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "range-based measures",
      body: "**Range** $= \\max - \\min$. **Quartile deviation** (semi-interquartile range) $= \\tfrac12(Q_3 - Q_1)$. The **coefficient of quartile deviation** $\\dfrac{Q_3 - Q_1}{Q_3 + Q_1}$ and **coefficient of range** $\\dfrac{\\max - \\min}{\\max + \\min}$ are unit-free versions.",
    },
    {
      type: "definition",
      term: "pooled variance",
      body: "Two samples believed to share one variance combine as $s_p^2 = \\dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$: each sample's variance weighted by its degrees of freedom. This measures **within-group** variability; the spread of the group means is **between-group** variability.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the best centre for each measure",
      statement: "$\\sum|x_i - c|$ is smallest when $c$ is the median; $\\sum(x_i - c)^2$ is smallest when $c$ is the mean.",
      proof: [
        "As $c$ increases past no data point, $\\sum|x_i - c|$ changes at rate (number of values below $c$) minus (number above). That is negative below the median and positive above it.",
        "$\\dfrac{d}{dc}\\sum(x_i - c)^2 = -2\\sum(x_i - c) = 0$ gives $c = \\bar x$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "what changes under rescaling",
      statement: "Under $x \\mapsto ax + b$ with $a > 0$: SD, MAD and IQR are multiplied by $a$; z-scores do not change; the CV is unchanged by $b = 0$ but changes when $b \\neq 0$.",
      proof: ["Every deviation is multiplied by $a$ and the shift cancels. The CV's denominator, the mean, also shifts by $b$, so the CV is only meaningful on a ratio scale (§{data-variables})."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "the MAD estimates σ",
      statement: "For normal data, $\\text{MAD} \\approx 0.6745\\,\\sigma$, so $1.4826\\,\\text{MAD}$ is a robust estimate of $\\sigma$ that one outlier cannot inflate.",
      proof: ["Half of a normal distribution lies within $0.6745\\sigma$ of its centre, so that is the median of $|X - \\mu|$; and $1/0.6745 \\approx 1.4826$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A student scores 78 in maths (mean 70, SD 4) and 85 in English (mean 80, SD 10). Which is the better performance relative to the class?",
      solution: ["Maths: $z = 8/4 = 2$. English: $z = 5/10 = 0.5$.", "The maths score is further above its class mean, in standard units."],
      result: "Maths.",
    },
    {
      type: "example",
      level: 2,
      title: "consistency",
      problem: "Batter A averages 50 runs with SD 15; batter B averages 40 with SD 8. Who is more consistent?",
      solution: ["$\\text{CV}_A = 15/50 = 30\\%$ and $\\text{CV}_B = 8/40 = 20\\%$.", "B's scores vary less relative to their average."],
      result: "B.",
    },
    {
      type: "example",
      level: 3,
      title: "an outlier that hides",
      problem: "Data: 10, 12, 13, 14, 15, 40. Compare the ordinary and robust z-scores of 40.",
      solution: [
        "Mean $\\approx 17.33$ and SD (divide by $n$) $\\approx 10.26$, so $z \\approx 22.67/10.26 \\approx 2.2$: below the $|z| > 3$ flag.",
        "Median 13.5; absolute deviations 3.5, 1.5, 0.5, 0.5, 1.5, 26.5 have median 1.5. Robust $z = 26.5/(1.4826 \\times 1.5) \\approx 11.9$.",
        "The 40 inflated the very SD used to judge it (**masking**); the MAD is not fooled.",
      ],
      result: "Ordinary $z \\approx 2.2$, robust $z \\approx 11.9$.",
    },
    {
      type: "example",
      level: 3,
      title: "pooling",
      problem: "Sample 1: $n = 10$, $s^2 = 20$. Sample 2: $n = 15$, $s^2 = 30$. Find the pooled variance.",
      solution: ["$\\dfrac{9 \\times 20 + 14 \\times 30}{23} = \\dfrac{180 + 420}{23}$.", "$= 600/23 \\approx 26.09$."],
      result: "About 26.09.",
    },
  ],
  pitfalls: [
    { wrong: "Compare the SDs of rupee prices and of percentages directly.", right: "Use the CV, or z-scores, when scales differ." },
    { wrong: "Delete every flagged outlier.", right: "Investigate: it may be an error, or the most important observation in the data." },
    { wrong: "No $|z| > 3$ means no outliers.", right: "An outlier inflates the SD and can hide itself; use robust scores." },
  ],
  formulas: [
    { label: "z-score", tex: "z = (x - \\bar x)/s" },
    { label: "CV", tex: "s/\\bar x" },
    { label: "MAD", tex: "\\operatorname{median}|x_i - m|,\\quad \\hat\\sigma = 1.4826\\,\\text{MAD}" },
    { label: "Pooled variance", tex: "s_p^2 = \\dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}" },
  ],
  exercises: [
    ex(1, num("sprx-ex-1", "Mean 70, SD 5. Find the z-score of 85.", 3, "$15/5$."), ["$(85 - 70)/5 = 3$."]),
    ex(1, num("sprx-ex-2", "Find the range of 4, 9, 2, 15.", 13, "$15 - 2$."), ["$13$."]),
    ex(1, num("sprx-ex-3", "$Q_1 = 20$ and $Q_3 = 35$. Find the quartile deviation.", 7.5, "Half the IQR."), ["$15/2 = 7.5$."]),
    ex(2, num("sprx-ex-4", "Find the mean absolute deviation about the mean of 3, 5, 7, 9.", 2, "Mean 6."), ["Absolute deviations 3, 1, 1, 3 average 2."]),
    ex(2, num("sprx-ex-5", "Data have mean 80 and SD 12. Find the CV.", 0.15, "$12/80$."), ["$0.15$, or 15%."]),
    ex(2, num("sprx-ex-6", "Find the MAD of 2, 3, 5, 8, 12.", 3, "Median 5."), ["Absolute deviations 3, 2, 0, 3, 7 have median 3."]),
    ex(2, num("sprx-ex-7", "A score has $z = -1.5$ in a test with mean 60 and SD 8. Find the score.", 48, "$60 - 1.5 \\times 8$."), ["$60 - 12 = 48$."]),
    ex(3, dp("sprx-ex-8", "Sample 1: $n = 8$, $s^2 = 10$. Sample 2: $n = 12$, $s^2 = 15$. Find the pooled variance.", (7 * 10 + 11 * 15) / 18, "Weight by $n - 1$."), ["$\\dfrac{70 + 165}{18} = \\dfrac{235}{18} \\approx 13.056$."]),
    ex(3, num("sprx-ex-9", "Which value of $c$ minimises $\\sum|x_i - c|$ for 1, 3, 4, 9, 20?", 4, "The median."), ["The median, 4."]),
    ex(3, num("sprx-ex-10", "Data with mean 40 and SD 8 each have 10 added. Find the new CV.", 0.16, "SD unchanged, mean 50."), ["$8/50 = 0.16$: shifting changes the CV."]),
    ex(3, mc("sprx-ex-11", "In 10, 12, 13, 14, 15, 40 the value 40 has $z \\approx 2.2$. Why doesn't the $|z| > 3$ rule flag it?", ["The 40 inflates the SD used to compute its own z", "This is masking."], [["40 is not unusual for these data", "Its robust z is about 12."], ["The rule needs $|z| > 2$", "Changing the cut-off doesn't remove the masking."]]), ["Robust scores based on the median and MAD avoid masking."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const mu = r.int(4, 16) * 5;
      const sd = r.pick([2, 4, 5, 8, 10]);
      const z = r.pick(lv === 1 ? [-2, -1, 1, 2, 3] : [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]);
      const back = lv === 3 && r.pick([true, false]);
      const x = mu + z * sd;
      return back
        ? n(`A test has mean ${mu} and SD ${sd}. A score has $z = ${z}$. Find the score.`, x, `$${mu} + (${z})(${sd}) = ${x}$.`)
        : n(`A test has mean ${mu} and SD ${sd}. Find the z-score of ${x}.`, z, `$(${x} - ${mu})/${sd} = ${z}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = lv === 1 ? 5 : 7;
      const xs = Array.from({ length: k }, () => r.int(1, 20 + 10 * lv));
      const m = median(xs);
      const mad = median(xs.map((x) => Math.abs(x - m)));
      return n(`Find the MAD (median absolute deviation) of ${xs.join(", ")}.`, mad, `Median ${m}; absolute deviations ${xs.map((x) => Math.abs(x - m)).join(", ")} have median ${mad}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      for (;;) {
        const m1 = r.int(2, 9) * 10;
        const s1 = r.int(2, 8);
        const m2 = r.int(10, 40) * 10;
        const s2 = r.int(s1 + 1, 30);
        const c1 = s1 / m1;
        const c2 = s2 / m2;
        if (Math.abs(c1 - c2) < 0.01) continue;
        const firstMore = c1 > c2;
        return mcNumbers(
          `Product A weighs on average ${m1} g with SD ${s1} g; product B weighs ${m2} g with SD ${s2} g. Which varies more relative to its weight?`,
          { text: firstMore ? "A" : "B", why: `CVs: ${r2(c1 * 100)}% against ${r2(c2 * 100)}%.` },
          [{ text: firstMore ? "B" : "A", why: "Compare SD divided by mean.", ...(firstMore ? { misconception: "sd-compare-scales" } : {}) }],
        );
      }
    },
  },
];
