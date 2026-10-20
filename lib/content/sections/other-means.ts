import { deepen, ex, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Weighted, geometric, harmonic and trimmed means; grouped mean and mode. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "other-means",
  title: "Weighted, geometric & harmonic means",
  summary: "The arithmetic mean suits amounts that add. A weighted mean counts some values more, the geometric mean averages growth factors, and the harmonic mean averages rates over equal amounts. For positive data, H ≤ G ≤ A.",
  deps: ["mean-median-mode"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "weighted mean", meaning: "Each value counted in proportion to its weight." },
    { term: "geometric mean", meaning: "The nth root of the product of n positive values: the constant growth factor with the same overall effect." },
    { term: "harmonic mean", meaning: "n divided by the sum of reciprocals: the right average for rates over equal distances or amounts." },
  ],
  misconceptions: {
    "average-of-rates": "Averages speeds or other rates arithmetically when equal distances, not equal times, are covered.",
    "average-growth-arith": "Averages percentage changes arithmetically instead of multiplying growth factors.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which average?",
      body: "Drive to a town at 30 km/h and back at 60 km/h: your average speed is not 45 km/h. Watch a price rise 50% and then fall 50%: it has not returned to where it started. The ordinary mean is the wrong tool for both.",
      realWorld: {
        title: "Investment returns",
        body: "Funds quote the compound annual growth rate, a geometric mean, because the arithmetic average of yearly returns overstates what an investor actually earned.",
      },
    },
    {
      type: "truth",
      statement: "**Weighted mean** $\\bar x_w = \\dfrac{\\sum w_ix_i}{\\sum w_i}$. **Geometric mean** $G = (x_1x_2\\cdots x_n)^{1/n}$ for positive values. **Harmonic mean** $H = \\dfrac{n}{\\sum 1/x_i}$. For positive data $H \\le G \\le \\bar x$, with equality only when all the values are equal.",
      body: "Use the arithmetic mean when the values add to a meaningful total; the geometric mean for growth factors and ratios; the harmonic mean for rates averaged over equal amounts of the \"per\" quantity, such as speeds over equal distances.",
    },
    {
      type: "predict",
      misconception: "average-of-rates",
      item: {
        kind: "mc",
        id: "om-predict-1",
        prompt: "You drive 60 km to a town at 30 km/h and back at 60 km/h. What is your average speed?",
        options: [
          { id: "a", text: "40 km/h", correct: true, why: "120 km in 3 hours." },
          { id: "b", text: "45 km/h", misconception: "average-of-rates", why: "That treats both speeds as lasting equally long." },
          { id: "c", text: "50 km/h", why: "Average speed is total distance over total time." },
        ],
      },
      reveal: {
        body: "Out takes 2 hours, back 1 hour: 120 km in 3 hours is 40 km/h. Twice as much time is spent at the slow speed, so it counts twice as much. The harmonic mean gives the answer directly: $\\dfrac{2}{1/30 + 1/60} = 40$.",
      },
      resolve: {
        kind: "mc",
        id: "om-resolve-1",
        prompt: "Why isn't the average speed 45 km/h?",
        options: [
          { id: "a", text: "More time is spent at the slower speed, so it weighs more", correct: true, why: "Average speed weights each speed by the time spent at it." },
          { id: "b", text: "It is 45 km/h: just average the two speeds", misconception: "average-of-rates", why: "That would be right only for equal times." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "om-check-1",
        prompt: "A share price rises 50% and then falls 50%. What is the overall change?",
        options: [
          { id: "a", text: "Down 25%", correct: true, why: "$1.5 \\times 0.5 = 0.75$." },
          { id: "b", text: "No change: +50% and −50% cancel", misconception: "average-growth-arith", why: "Percentages compound by multiplying." },
          { id: "c", text: "Down 50%", why: "The fall is 50% of a higher price." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "om-check-2",
        prompt: "Coursework scores 80 (worth 30%) and the exam 60 (worth 70%). Find the final mark.",
        options: [
          { id: "a", text: "66", correct: true, why: "$0.3 \\times 80 + 0.7 \\times 60$." },
          { id: "b", text: "70", why: "That ignores the weights." },
          { id: "c", text: "74", why: "That swaps the weights." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The F1 score is the harmonic mean of precision and recall (§{precision-recall}), so it stays low unless both are high. Model sizes, learning rates and speed-ups are compared on log scales, where the geometric mean is the natural average.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "om-produce-1", prompt: "Find the geometric mean of 4 and 9.", answer: 6, explain: "$\\sqrt{36}$." },
        { kind: "number", id: "om-produce-2", prompt: "Find the harmonic mean of 2 and 6.", answer: 3, explain: "$2/(1/2 + 1/6) = 2/(2/3)$." },
        {
          kind: "mc",
          id: "om-produce-3",
          prompt: "Returns are +10% one year and +20% the next. The average annual growth factor is",
          options: [
            { id: "a", text: "$\\sqrt{1.1 \\times 1.2} \\approx 1.149$", correct: true, why: "The constant factor with the same two-year effect." },
            { id: "b", text: "$1.15$", misconception: "average-growth-arith", why: "$1.15^2 = 1.3225$, but the actual growth is $1.32$." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "om-review-1", prompt: "Find the weighted mean of 70 (weight 2) and 85 (weight 1).", answer: 75, explain: "$(140 + 85)/3$." },
  ],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "trimmed and winsorized means, midrange",
      body: "A **$k\\%$ trimmed mean** drops the largest and smallest $k\\%$ of values and averages the rest. A **winsorized mean** instead replaces them by the nearest remaining values. The **midrange** is $\\tfrac12(\\min + \\max)$, which is very sensitive to outliers.",
    },
    {
      type: "definition",
      term: "mean and mode of grouped data",
      body: "With class midpoints $m_i$, $\\bar x \\approx \\dfrac{\\sum f_im_i}{\\sum f_i}$. With an assumed mean $A$ and $u_i = (m_i - A)/w$ (the **step-deviation** method), $\\bar x = A + w\\,\\dfrac{\\sum f_iu_i}{\\sum f_i}$. The **modal class** has the largest frequency $f_1$; with neighbours $f_0$ and $f_2$, $\\text{mode} \\approx L + \\dfrac{f_1 - f_0}{2f_1 - f_0 - f_2}\\,w$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "AM–GM–HM inequality",
      statement: "For positive $a$ and $b$, $\\dfrac{a + b}{2} \\ge \\sqrt{ab} \\ge \\dfrac{2ab}{a + b}$, and $G^2 = AH$. Equality holds only when $a = b$. The same order $A \\ge G \\ge H$ holds for any number of positive values.",
      proof: [
        "$(\\sqrt a - \\sqrt b)^2 \\ge 0$ expands to $a + b \\ge 2\\sqrt{ab}$, so $A \\ge G$.",
        "$H = \\dfrac{2ab}{a + b} = \\dfrac{G^2}{A}$, which gives $G^2 = AH$, and $H \\le G$ because $G \\le A$.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "combined mean",
      statement: "Groups of sizes $n_1$ and $n_2$ with means $\\bar x_1$ and $\\bar x_2$ have combined mean $\\dfrac{n_1\\bar x_1 + n_2\\bar x_2}{n_1 + n_2}$: the means weighted by group size.",
      proof: ["Group $i$ contributes the total $n_i\\bar x_i$; add the totals and divide by the combined count."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "averaging growth",
      statement: "If a quantity is multiplied by factors $g_1, \\dots, g_n$, the constant factor with the same overall effect is their geometric mean, and $\\ln G$ is the arithmetic mean of the $\\ln g_i$. The arithmetic mean of the $g_i$ always overstates it.",
      proof: ["$G^n = g_1\\cdots g_n$ is the requirement. Taking logs turns the product into a sum; AM–GM gives $\\bar g \\ge G$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "an empirical relation",
      statement: "For moderately skewed distributions, $\\text{mode} \\approx 3\\,\\text{median} - 2\\,\\text{mean}$ (Karl Pearson's rule of thumb).",
      proof: ["This is an observation about many real distributions, not a theorem; it fails for strongly skewed or multimodal data."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Class A has 30 students with mean 70; class B has 20 students with mean 80. Find the combined mean.",
      solution: ["Totals: $30 \\times 70 = 2100$ and $20 \\times 80 = 1600$.", "$\\dfrac{3700}{50} = 74$."],
      result: "74, not the simple average 75.",
    },
    {
      type: "example",
      level: 2,
      title: "grouped mean",
      problem: "Classes 0–10, 10–20, 20–30, 30–40 have frequencies 5, 8, 12, 5. Estimate the mean.",
      solution: ["Midpoints 5, 15, 25, 35; $\\sum fm = 25 + 120 + 300 + 175 = 620$.", "$620/30 \\approx 20.67$."],
      result: "About 20.67.",
    },
    {
      type: "example",
      level: 2,
      title: "compound growth",
      problem: "Revenue grows from 100 to 121 over two years. Find the average annual growth rate.",
      solution: ["The overall factor is 1.21, so $G = \\sqrt{1.21} = 1.1$.", "That is 10% a year, compounded."],
      result: "10% per year.",
    },
    {
      type: "example",
      level: 3,
      title: "from the means to the numbers",
      problem: "Two positive numbers have arithmetic mean 10 and geometric mean 8. Find their harmonic mean and the numbers.",
      solution: ["$H = G^2/A = 64/10 = 6.4$.", "The numbers have sum 20 and product 64, so they solve $t^2 - 20t + 64 = 0$: $t = 16$ or $4$."],
      result: "$H = 6.4$; the numbers are 16 and 4.",
    },
    {
      type: "example",
      level: 3,
      title: "grouped mode",
      problem: "Classes 10–20, 20–30, 30–40 have frequencies 6, 14, 10. Estimate the mode.",
      solution: ["The modal class is 20–30 with $f_0 = 6$, $f_1 = 14$, $f_2 = 10$.", "$20 + \\dfrac{14 - 6}{28 - 6 - 10} \\times 10 = 20 + \\tfrac{8}{12} \\times 10 \\approx 26.67$."],
      result: "About 26.67.",
    },
  ],
  pitfalls: [
    { wrong: "Average speed = average of the speeds.", right: "Over equal distances use the harmonic mean; in general divide total distance by total time." },
    { wrong: "Average yearly growth = average of the yearly percentages.", right: "Multiply the growth factors and take the root." },
    { wrong: "Combine two groups by averaging their means.", right: "Weight each mean by its group size." },
  ],
  formulas: [
    { label: "Weighted", tex: "\\bar x_w = \\dfrac{\\sum w_ix_i}{\\sum w_i}" },
    { label: "Geometric, harmonic", tex: "G = \\big(\\textstyle\\prod x_i\\big)^{1/n},\\quad H = \\dfrac{n}{\\sum 1/x_i}" },
    { label: "Order", tex: "H \\le G \\le A,\\quad G^2 = AH\\ (n = 2)" },
    { label: "Grouped mode", tex: "L + \\dfrac{f_1 - f_0}{2f_1 - f_0 - f_2}\\,w" },
  ],
  exercises: [
    ex(1, num("omx-ex-1", "Find the weighted mean of 3 (weight 1) and 5 (weight 3).", 4.5, "$(3 + 15)/4$."), ["$18/4 = 4.5$."]),
    ex(1, num("omx-ex-2", "Find the geometric mean of 2 and 8.", 4, "$\\sqrt{16}$."), ["$\\sqrt{16} = 4$."]),
    ex(1, num("omx-ex-3", "Find the midrange of 3, 7, 12, 20.", 11.5, "$(3 + 20)/2$."), ["$23/2 = 11.5$."]),
    ex(2, num("omx-ex-4", "A cyclist covers equal distances at 40 km/h and 60 km/h. Find the average speed.", 48, "Harmonic mean."), ["$\\dfrac{2}{1/40 + 1/60} = \\dfrac{2}{1/24} = 48$."]),
    ex(2, num("omx-ex-5", "40 students average 60 and 60 students average 70. Find the combined mean.", 66, "Weight by size."), ["$\\dfrac{2400 + 4200}{100} = 66$."]),
    ex(2, dp("omx-ex-6", "Sales grow from 200 to 300 over 3 years. Find the average annual growth rate as a decimal.", 1.5 ** (1 / 3) - 1, "$1.5^{1/3} - 1$."), ["The factor per year is $1.5^{1/3} \\approx 1.1447$: about 14.5% a year."]),
    ex(2, num("omx-ex-7", "Classes 0–4, 4–8, 8–12 have frequencies 3, 5, 2. Estimate the mean.", 5.6, "Midpoints 2, 6, 10."), ["$\\dfrac{6 + 30 + 20}{10} = 5.6$."]),
    ex(3, num("omx-ex-8", "Two positive numbers have arithmetic mean 25 and geometric mean 20. Find their harmonic mean.", 16, "$G^2/A$."), ["$400/25 = 16$."]),
    ex(3, num("omx-ex-9", "Same numbers. Find the larger one.", 40, "Sum 50, product 400."), ["$t^2 - 50t + 400 = 0$ gives 40 and 10."]),
    ex(3, num("omx-ex-10", "Classes 0–10, 10–20, 20–30 have frequencies 4, 10, 6. Estimate the mode.", 16, "Modal class 10–20."), ["$10 + \\dfrac{10 - 4}{20 - 4 - 6} \\times 10 = 10 + 6 = 16$."]),
    ex(3, num("omx-ex-11", "Find the 20% trimmed mean of 1, 2, 3, 4, 5, 6, 7, 8, 9, 30.", 5.5, "Drop two from each end."), ["Drop 1, 2 and 9, 30; the mean of 3 to 8 is $33/6 = 5.5$, far from the ordinary mean 7.5."]),
    ex(3, num("omx-ex-12", "The mean of 20 values was 45, but one value, 36, had been recorded as 63. Find the correct mean.", 43.65, "Fix the total."), ["The total was $900$; correcting it subtracts 27: $873/20 = 43.65$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "real-world",
    make: (r, lv) => {
      const a = r.pick([20, 30, 40, 50]);
      const b = a + r.pick(lv === 1 ? [20, 30] : [10, 20, 30, 40]);
      const h = (2 * a * b) / (a + b);
      const exact = Number.isInteger(h * 100);
      return mcNumbers(
        `A courier covers equal distances at ${a} km/h and ${b} km/h. What is the average speed${exact ? "" : " (to 2 decimals)"}?`,
        { text: `${r2(h)} km/h`, why: `Harmonic mean: $2/(1/${a} + 1/${b}) \\approx ${r2(h)}$.` },
        [
          { text: `${r2((a + b) / 2)} km/h`, why: "That assumes equal times at each speed.", misconception: "average-of-rates" },
          { text: `${r2(Math.sqrt(a * b))} km/h`, why: "The geometric mean is for growth factors." },
        ],
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const n1 = r.int(2, 6) * 5;
      const n2 = r.int(2, 6) * 5;
      const m1 = r.int(50, 70);
      const m2 = m1 + r.int(lv, 5 * lv + 5);
      const c = (n1 * m1 + n2 * m2) / (n1 + n2);
      return n(`${n1} students average ${m1} and ${n2} students average ${m2}. Find the combined mean (2 decimals).`, r2(c), `$\\dfrac{${n1} \\cdot ${m1} + ${n2} \\cdot ${m2}}{${n1 + n2}} \\approx ${r2(c)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r, lv) => {
      const up = r.pick([10, 20, 25, 40, 50]);
      const down = lv === 1 ? up : r.pick([10, 20, 25, 40, 50]);
      const net = (1 + up / 100) * (1 - down / 100) - 1;
      const txt = (x: number) => (x >= 0 ? `up ${r2(x * 100)}%` : `down ${r2(-x * 100)}%`);
      return mcNumbers(
        `A price rises ${up}% and then falls ${down}%. What is the overall change?`,
        { text: txt(net), why: `$${1 + up / 100} \\times ${1 - down / 100} = ${r2(1 + net)}$.` },
        [
          { text: txt((up - down) / 100), why: "Percentage changes multiply; they don't add.", misconception: "average-growth-arith" },
          { text: txt(-down / 100), why: `The fall applies to the risen price, giving ${txt(net)}.` },
        ],
      );
    },
  },
];
