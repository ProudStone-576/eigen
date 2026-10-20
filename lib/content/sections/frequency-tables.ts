import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Frequency tables, histograms, ogives and grouped percentiles. */

const base: ConceptNode = {
  id: "frequency-tables",
  title: "Frequency tables, histograms & ogives",
  summary: "Group the data into classes, count each class, and accumulate the counts. A histogram's bar areas are proportional to frequency; an ogive plots cumulative frequency at each upper boundary and reads off the median and percentiles.",
  deps: ["data-variables"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "frequency", meaning: "How many values fall in a class. Relative frequency divides by the total n." },
    { term: "cumulative frequency", meaning: "How many values fall in this class or any earlier one." },
    { term: "frequency density", meaning: "Frequency divided by class width: the height of a histogram bar." },
  ],
  misconceptions: {
    "height-not-area": "Reads a histogram with unequal class widths by bar height instead of bar area.",
    "ogive-at-midpoint": "Plots cumulative frequencies at class midpoints instead of at upper class boundaries.",
  },
  steps: [
    {
      type: "motivate",
      title: "Too many numbers to read",
      body: "Five hundred delivery times are unreadable as a list. Grouped into 5-minute classes and counted, their shape appears at a glance: where most deliveries land, and how long the slow tail runs.",
      realWorld: {
        title: "Census tables",
        body: "Ages are published in bands such as 0–4, 5–9, …, 80+. Every published median age of a country is computed from a grouped table like this, not from individual birth dates.",
      },
    },
    {
      type: "truth",
      statement: "A **frequency table** lists classes and their counts $f$. The **relative frequency** is $f/n$; the **cumulative frequency** $F$ adds every count up to the end of a class. In a **histogram** the **area** of each bar is proportional to its frequency, so the bar's height is the **frequency density** $f/\\text{width}$.",
      body: "With equal widths, heights and areas tell the same story; with unequal widths only density is honest. An **ogive** plots $F$ against each **upper class boundary** and joins the points; reading across at $n/2$ gives the median.",
    },
    {
      type: "predict",
      misconception: "height-not-area",
      item: {
        kind: "mc",
        id: "ft-predict-1",
        prompt: "Class 0–10 holds 20 values and class 10–40 holds 30. In a correctly drawn histogram, which bar is taller?",
        options: [
          { id: "a", text: "The 0–10 bar: density 2 against 1", correct: true, why: "Height is frequency per unit width." },
          { id: "b", text: "The 10–40 bar, because 30 > 20", misconception: "height-not-area", why: "The wide class has more values, spread over three times the width." },
          { id: "c", text: "They are equally tall", why: "Their densities are 2 and 1." },
        ],
      },
      reveal: {
        body: "Heights are $20/10 = 2$ and $30/30 = 1$. The wide class does hold more values, and its bar shows that through its larger **area** (30 against 20). Drawing heights 20 and 30 instead would give areas 200 and 900, making the wide class look 4.5 times as big when it is only 1.5 times as big.",
      },
      resolve: {
        kind: "mc",
        id: "ft-resolve-1",
        prompt: "In a histogram with unequal class widths, what is proportional to frequency?",
        options: [
          { id: "a", text: "Bar area", correct: true, why: "Height × width = frequency (up to a constant)." },
          { id: "b", text: "Bar height", misconception: "height-not-area", why: "Only when every class has the same width." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ft-check-1",
        prompt: "The class 10–20 ends with cumulative frequency 35. Where does that point go on the ogive?",
        options: [
          { id: "a", text: "At (20, 35), the upper boundary", correct: true, why: "35 values are known to lie below 20." },
          { id: "b", text: "At (15, 35), the midpoint", misconception: "ogive-at-midpoint", why: "Not all 35 values are below 15." },
          { id: "c", text: "At (10, 35), the lower boundary", why: "The class's own values lie above 10." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ft-check-2",
        prompt: "Cumulative frequencies are 5, 17, 30, 38, 40. How many values are in the third class?",
        options: [
          { id: "a", text: "13", correct: true, why: "30 − 17." },
          { id: "b", text: "30", why: "That is the running total, not the class's own count." },
          { id: "c", text: "17", why: "That is the total of the first two classes." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A histogram of every feature is the first look at a dataset: it shows skew worth a log transform, spikes at 0 where missing values were coded as 0, and impossible values. Gradient-boosting libraries such as LightGBM bin each feature into a histogram internally to find split points fast.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "ft-produce-1", prompt: "Class 20–30 holds 15 of 60 values. Find its relative frequency.", answer: 0.25, explain: "15/60." },
        { kind: "number", id: "ft-produce-2", prompt: "Class 5–15 holds 40 values. Find its frequency density.", answer: 4, explain: "40 ÷ width 10." },
        {
          kind: "mc",
          id: "ft-produce-3",
          prompt: "Where is the ogive point for class 40–60 with cumulative frequency 72?",
          options: [
            { id: "a", text: "(60, 72)", correct: true, why: "At the upper boundary." },
            { id: "b", text: "(50, 72)", misconception: "ogive-at-midpoint", why: "That is the midpoint." },
          ],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "ft-review-1", prompt: "Cumulative frequencies are 4, 11, 23, 30. How many values are in the second class?", answer: 7, explain: "11 − 4." },
  ],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "boundaries, width, midpoint",
      body: "For whole-number classes written 10–19, 20–29, the **class boundaries** are 9.5, 19.5, 29.5, so no value falls in a gap. The **width** is upper minus lower boundary, and the **midpoint** (class mark) is their average.",
    },
    {
      type: "definition",
      term: "stem-and-leaf plot, frequency polygon, ECDF",
      body: "A **stem-and-leaf plot** splits each value into a stem (leading digits) and a leaf (last digit), keeping every value while showing shape. A **dot plot** draws one dot per value. A **frequency polygon** joins the points (midpoint, frequency). The **empirical distribution function** is $\\hat F(x) = \\dfrac{\\#\\{x_i \\le x\\}}{n}$, a staircase that rises by $1/n$ at each value.",
    },
    {
      type: "definition",
      term: "charts for many variables",
      body: "A **density plot** is a smoothed histogram; a **violin plot** mirrors one on each side of a box plot to compare groups. A **grouped bar chart** sets bars for two categorical variables side by side; a **mosaic plot** draws a contingency table as tiles whose areas are the cell counts. A **heatmap** colours the cells of a table, such as a correlation matrix; a **pair plot** shows a scatterplot for every pair of variables.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "median of grouped data",
      statement: "$\\text{median} \\approx L + \\dfrac{n/2 - F}{f}\\,w$, where $L$ is the lower boundary of the class containing the $(n/2)$th value, $F$ the cumulative frequency before it, $f$ its frequency and $w$ its width. For the $k$th percentile replace $n/2$ by $kn/100$; for quartiles by $n/4$ and $3n/4$; for the $k$th **decile** by $kn/10$.",
      proof: [
        "Assume the $f$ values of the class are spread evenly across its width, so the ogive is a straight line across the class.",
        "We need $n/2 - F$ more values beyond $L$; at $f/w$ values per unit that takes $\\dfrac{n/2 - F}{f}\\,w$ units.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "honest charts",
      statement: "A chart misleads when a bar axis doesn't start at zero, when areas or volumes are scaled by a value's length instead of its area, when two series share an axis with different hidden scales, or when unequal class widths are drawn by height. Choose the chart from the variables: one categorical, bars; one numerical, histogram or box plot; numerical against time, line chart; two numerical, scatterplot.",
      proof: ["The eye compares lengths from a common baseline and compares areas; anything that breaks either comparison distorts the ratio a reader sees."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "reading areas",
      statement: "A histogram's total area represents $n$ (or 1, if heights are $f/(nw)$). The area between two values estimates how many (or what fraction) of the data lie between them.",
      proof: ["Each bar's area is its frequency; a part of a bar holds the same share of that frequency, if values are spread evenly within the class."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Classes 0–10, 10–20, 20–30, 30–40 have frequencies 4, 9, 12, 5. Give the cumulative and relative frequencies.",
      solution: ["Cumulative: 4, 13, 25, 30.", "Relative ($n = 30$): 0.133, 0.3, 0.4, 0.167."],
      result: "$F = 4, 13, 25, 30$.",
    },
    {
      type: "example",
      level: 2,
      title: "grouped median",
      problem: "Find the median of the same table.",
      solution: ["$n/2 = 15$ falls in 20–30, since $F$ reaches 13 before it and 25 by its end.", "$20 + \\dfrac{15 - 13}{12} \\times 10 \\approx 21.67$."],
      result: "About 21.67.",
    },
    {
      type: "example",
      level: 3,
      title: "unequal widths",
      problem: "Classes 0–5, 5–10, 10–20, 20–40 have frequencies 10, 20, 30, 20. Find the densities and estimate how many values lie between 15 and 30.",
      solution: [
        "Densities: $10/5 = 2$, $20/5 = 4$, $30/10 = 3$, $20/20 = 1$.",
        "From 15 to 20: $5 \\times 3 = 15$. From 20 to 30: $10 \\times 1 = 10$.",
      ],
      result: "Densities 2, 4, 3, 1; about 25 values.",
    },
    {
      type: "example",
      level: 3,
      title: "a missing frequency",
      problem: "Classes 0–10, 10–20, 20–30, 30–40, 40–50 have frequencies 5, $x$, 20, 15, 5, and the median is 28. Find $x$.",
      solution: [
        "28 lies in 20–30, so $28 = 20 + \\dfrac{n/2 - (5 + x)}{20} \\times 10$ with $n = 45 + x$.",
        "Then $16 = \\dfrac{45 + x}{2} - 5 - x$, so $32 = 35 - x$ and $x = 3$.",
        "Check: $n = 48$, $n/2 = 24$, $F = 8$: $20 + \\tfrac{16}{20} \\times 10 = 28$.",
      ],
      result: "$x = 3$.",
    },
  ],
  pitfalls: [
    { wrong: "Draw bar heights equal to frequencies when widths differ.", right: "Draw frequency density, so areas carry the counts." },
    { wrong: "Plot ogive points at class midpoints.", right: "Plot them at upper boundaries: that is where all the counted values are known to lie below." },
    { wrong: "Use 10 and 20 as the boundaries of whole-number classes 10–19 and 20–29.", right: "Use 9.5, 19.5, 29.5 so the classes meet without gaps." },
  ],
  formulas: [
    { label: "Relative frequency", tex: "f/n" },
    { label: "Density", tex: "f/w" },
    { label: "Grouped median", tex: "L + \\dfrac{n/2 - F}{f}\\,w" },
    { label: "ECDF", tex: "\\hat F(x) = \\#\\{x_i \\le x\\}/n" },
  ],
  exercises: [
    ex(1, num("ftx-ex-1", "Cumulative frequencies are 6, 15, 27, 33, 35. Find the frequency of the fourth class.", 6, "33 − 27."), ["$33 - 27 = 6$."]),
    ex(1, num("ftx-ex-2", "A class holds 12 of 48 values. Find its relative frequency.", 0.25, "12/48."), ["$12/48 = 0.25$."]),
    ex(1, num("ftx-ex-3", "Whole-number data are grouped 20–29, 30–39, … Find the upper boundary of the class 20–29.", 29.5, "Halfway to the next class."), ["The classes meet at 29.5."]),
    ex(2, num("ftx-ex-4", "Class 10–30 holds 50 values. Find its frequency density.", 2.5, "$f/w$."), ["$50/20 = 2.5$."]),
    ex(2, num("ftx-ex-5", "Classes 0–20, 20–40, 40–60 have frequencies 10, 25, 15. Estimate the median.", 32, "$n/2 = 25$."), ["$n/2 = 25$ lies in 20–40, with $F = 10$ before it.", "$20 + \\tfrac{15}{25} \\times 20 = 32$."]),
    ex(2, num("ftx-ex-6", "Same table. Estimate the lower quartile.", 22, "$n/4 = 12.5$."), ["$20 + \\tfrac{12.5 - 10}{25} \\times 20 = 22$."]),
    ex(3, num("ftx-ex-7", "Classes 0–10, 10–20, 20–30, 30–40, 40–50 have frequencies 4, 8, $x$, 6, 2, and the median is 24. Find $x$.", 20, "Set the grouped-median formula equal to 24."), [
      "$n = 20 + x$; the median class is 20–30 with $F = 12$: $24 = 20 + \\dfrac{(20 + x)/2 - 12}{x} \\times 10$.",
      "$4x = 5x - 20$, so $x = 20$. Check: $n/2 = 20$, $20 + \\tfrac{8}{20} \\times 10 = 24$.",
    ]),
    ex(3, num("ftx-ex-8", "A histogram has density 3 on 0–10 and density 2 on 10–30. Estimate how many values are below 20.", 50, "Areas."), ["$3 \\times 10 + 2 \\times 10 = 50$."]),
    ex(3, num("ftx-ex-9", "Data: 3, 5, 5, 8, 10. Find $\\hat F(5)$.", 0.6, "Count values $\\le 5$."), ["Three of five values are at most 5: $0.6$."]),
    ex(2, mc("ftx-ex-10", "Which chart suits the favourite sport of 200 students?", ["A bar chart", "The variable is categorical."], [["A histogram", "Histograms need a numerical variable on a continuous axis."], ["An ogive", "Cumulative counts need ordered numerical classes."]]), ["Separate bars for categories; histograms are for grouped numerical data."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const k = 3 + lv;
      const f = Array.from({ length: k }, () => r.int(2, 6 + 4 * lv));
      const F = f.map((_, i) => f.slice(0, i + 1).reduce((s, x) => s + x, 0));
      const j = r.int(1, k - 1);
      return n(`Cumulative frequencies are ${F.join(", ")}. How many values are in class ${j + 1}?`, f[j], `${F[j]} − ${F[j - 1]} = ${f[j]}.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const w = r.pick([5, 10, 20]);
      const k = 3 + (lv > 1 ? 1 : 0);
      let f: number[];
      for (;;) {
        f = Array.from({ length: k }, () => r.int(2, 10 + 5 * lv));
        if (f.reduce((s, x) => s + x, 0) % 2 === 0) break;
      }
      const total = f.reduce((s, x) => s + x, 0);
      const half = total / 2;
      let acc = 0;
      let c = 0;
      while (acc + f[c] < half) acc += f[c++];
      const med = c * w + ((half - acc) / f[c]) * w;
      const classes = f.map((x, i) => `${i * w}–${(i + 1) * w}: ${x}`).join(", ");
      return n(`Grouped data: ${classes}. Estimate the median (two decimals).`, r2(med), `$n/2 = ${half}$ lies in ${c * w}–${(c + 1) * w}, with ${acc} values before it: $${c * w} + \\tfrac{${half} - ${acc}}{${f[c]}} \\times ${w} \\approx ${r2(med)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r, lv) => {
      const w1 = r.pick([5, 10]);
      const w2 = w1 * r.pick([2, 3, 4]);
      const d1 = r.int(2, 4 + lv);
      let f2: number;
      do f2 = r.int(w2 / w1, 3 * w2);
      while (f2 / w2 === d1);
      const f1 = d1 * w1;
      const tallerFirst = d1 > f2 / w2;
      return mcNumbers(
        `Class 0–${w1} holds ${f1} values and class ${w1}–${w1 + w2} holds ${f2}. In a correctly drawn histogram, which bar is taller?`,
        { text: tallerFirst ? `The 0–${w1} bar` : `The ${w1}–${w1 + w2} bar`, why: `Densities are ${f1}/${w1} = ${r2(d1)} and ${f2}/${w2} = ${r2(f2 / w2)}.` },
        [
          {
            text: tallerFirst ? `The ${w1}–${w1 + w2} bar` : `The 0–${w1} bar`,
            why: "Compare frequency per unit width, not raw counts.",
            // Picking this bar means comparing raw counts when it holds more values.
            ...(tallerFirst === f2 > f1 ? { misconception: "height-not-area" } : {}),
          },
          { text: "They are equally tall", why: `The densities differ: ${r2(d1)} and ${r2(f2 / w2)}.` },
        ],
      );
    },
  },
];
