import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode } from "../types";

/** Data, variables and measurement scales. */

const base: ConceptNode = {
  id: "data-variables",
  title: "Data, variables & scales",
  summary: "Data are values of variables recorded on units. A variable is categorical (nominal or ordinal) or quantitative (discrete or continuous, on an interval or ratio scale), and its type decides which summaries make sense.",
  deps: [],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "unit", meaning: "The person or thing each row of data describes: a patient, a transaction, a day." },
    { term: "variable", meaning: "A characteristic recorded for every unit, such as age or blood type." },
    { term: "parameter", meaning: "A number describing a whole population, usually unknown. A statistic is the same kind of number computed from a sample." },
  ],
  misconceptions: {
    "numbers-are-quantitative": "Treats any variable stored as numbers (postcodes, jersey numbers, ID codes) as a measured amount that can be averaged.",
    "interval-ratio": "Takes ratios on an interval scale, for example that 20 °C is twice as hot as 10 °C.",
  },
  steps: [
    {
      type: "motivate",
      title: "What kind of number is it?",
      body: "A survey records age, postcode, satisfaction from 1 to 5 and number of children. All four are written as numbers, but only some of them can sensibly be averaged.",
      realWorld: {
        title: "A patient record",
        body: "One file holds blood type (a category), pain level (ordered), temperature (a measurement with an arbitrary zero) and weight (a measurement with a true zero). A dashboard that averages blood types is broken.",
      },
    },
    {
      type: "truth",
      statement: "A **categorical** variable puts each unit in a group: **nominal** if the groups have no order (blood type), **ordinal** if they do (pain: none < mild < severe). A **quantitative** variable is an amount: **discrete** if it is counted (children), **continuous** if it is measured (height).",
      body: "Quantitative scales are **interval**, where differences mean something but zero is arbitrary (°C, calendar years), or **ratio**, where zero means none of the quantity, so ratios mean something too (kg, seconds, income).",
    },
    {
      type: "predict",
      misconception: "numbers-are-quantitative",
      item: {
        kind: "mc",
        id: "dv-predict-1",
        prompt: "A shop stores each customer's 6-digit postcode. Is the mean postcode a useful summary?",
        options: [
          { id: "a", text: "No: a postcode is a label, so it is categorical", correct: true, why: "The digits name an area; they don't measure anything." },
          { id: "b", text: "Yes: postcodes are numbers, so they can be averaged", misconception: "numbers-are-quantitative", why: "Being written in digits doesn't make something an amount." },
          { id: "c", text: "Yes, once there are enough customers", why: "More data doesn't change what the values mean." },
        ],
      },
      reveal: {
        body: "Postcodes 110001 and 110003 are not \"two apart\" in any useful sense, and their average, 110002, may be an area none of the customers lives in. For a label the right summaries are counts: a frequency table and the most common postcode (the mode).",
      },
      resolve: {
        kind: "mc",
        id: "dv-resolve-1",
        prompt: "What decides whether averaging a variable makes sense?",
        options: [
          { id: "a", text: "Whether its values measure an amount", correct: true, why: "Labels can be counted, not averaged." },
          { id: "b", text: "Whether its values are stored as numbers", misconception: "numbers-are-quantitative", why: "Postcodes and phone numbers are stored as numbers too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dv-check-1",
        prompt: "Yesterday was 10 °C and today is 20 °C. Is today twice as hot?",
        options: [
          { id: "a", text: "No: 0 °C is not an absence of heat, so ratios of °C mean nothing", correct: true, why: "In kelvin the temperatures are 283 K and 293 K: about 3.5% warmer." },
          { id: "b", text: "Yes: 20 is twice 10", misconception: "interval-ratio", why: "Celsius has an arbitrary zero; ratios depend on where that zero is put." },
          { id: "c", text: "Only if both readings are above freezing", why: "The problem is the scale, not the readings." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dv-check-2",
        prompt: "Which variable is ordinal?",
        options: [
          { id: "a", text: "Shirt size: S, M, L, XL", correct: true, why: "The categories have a natural order." },
          { id: "b", text: "Eye colour", why: "There is no order: that is nominal." },
          { id: "c", text: "Height in centimetres", why: "That is quantitative and continuous." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Models need numbers, so categories must be **encoded**. One-hot encoding gives each nominal category its own 0/1 column; an ordinal variable can be mapped to 1, 2, 3 to keep its order. Feeding raw postcodes in as integers tells a model that 110003 is \"more\" than 110001, a pattern that isn't there.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "dv-produce-1",
          prompt: "The number of cars a household owns is",
          options: [
            { id: "a", text: "quantitative and discrete", correct: true, why: "It is counted: 0, 1, 2, …" },
            { id: "b", text: "quantitative and continuous", why: "You can't own 1.37 cars." },
            { id: "c", text: "categorical and ordinal", why: "It is an amount, not a label." },
          ],
        },
        {
          kind: "mc",
          id: "dv-produce-2",
          prompt: "Which statement is meaningful?",
          options: [
            { id: "a", text: "A 2 m rod is twice as long as a 1 m rod", correct: true, why: "Length has a true zero: a ratio scale." },
            { id: "b", text: "30 °C is twice as hot as 15 °C", misconception: "interval-ratio", why: "Celsius is an interval scale." },
            { id: "c", text: "The year 2000 is twice as late as the year 1000", misconception: "interval-ratio", why: "Year 0 is a convention, not the start of time." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "mc",
      id: "dv-review-1",
      prompt: "Exam grades A, B, C, D are",
      options: [
        { id: "a", text: "ordinal", correct: true, why: "Ordered categories." },
        { id: "b", text: "nominal", why: "A is better than B: there is an order." },
        { id: "c", text: "ratio", why: "Grade A is not \"twice\" grade C." },
      ],
    },
  ],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "statistics, descriptive and inferential",
      body: "**Statistics** is the science of collecting, organising, analysing and interpreting data under uncertainty. **Descriptive** statistics summarise the data in hand (tables, charts, means); **inferential** statistics use a sample to draw conclusions about a larger population, with a stated margin of uncertainty. **Exploratory** analysis looks for patterns without fixed hypotheses; **confirmatory** analysis tests hypotheses stated in advance.",
    },
    {
      type: "definition",
      term: "assumptions, reproducibility, replicability",
      body: "Every inferential method rests on **assumptions**, such as independent observations or a roughly normal population, and its conclusions are only as good as they are. An analysis is **reproducible** if the same data and code give the same results, and a finding is **replicable** if a new study with new data reaches the same conclusion.",
    },
    {
      type: "definition",
      term: "population, sample, parameter, statistic",
      body: "The **population** is every unit of interest; a **census** measures all of it, a **sample** only part. A **parameter** describes the population (the mean $\\mu$, the proportion $p$); a **statistic** is computed from the sample ($\\bar x$, $\\hat p$) and is used to estimate it.",
    },
    {
      type: "definition",
      term: "explanatory, response, confounding and latent variables",
      body: "The **response** is the outcome studied; an **explanatory** variable is used to explain or predict it (in experiments, the *independent* and *dependent* variables). A **confounder** affects both. A **latent** variable, such as anxiety or ability, is not observed directly but through measured indicators such as questionnaire items.",
    },
    {
      type: "definition",
      term: "cross-sectional, longitudinal, time series",
      body: "**Cross-sectional** data measure many units once. **Longitudinal** (panel) data follow the same units over time. A **time series** follows one unit through many time points, such as a city's daily rainfall.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Rule",
      name: "what each scale allows",
      statement: "**Nominal**: counts, proportions, mode. **Ordinal**: also median and percentiles. **Interval**: also mean, standard deviation and differences. **Ratio**: also ratios, the geometric mean and the coefficient of variation.",
      proof: [
        "A summary is meaningful when it survives every relabelling the scale permits. Nominal labels may be swapped freely; only counts survive.",
        "Ordinal values may be replaced by any order-preserving codes: the median category survives, the mean does not. Interval values allow $x \\mapsto ax + b$ with $a > 0$ (°C to °F): means transform consistently, ratios do not. Ratio values allow only $x \\mapsto ax$, which keeps ratios.",
      ],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "three kinds of error",
      statement: "**Sampling error** is the chance difference between a statistic and its parameter; it shrinks as $n$ grows. **Measurement error** comes from the instrument or the question. **Bias** is systematic and does not shrink with $n$.",
      proof: ["Averaging more random draws cancels chance fluctuations (§{lln-inequalities}); it cannot cancel an error that pushes every observation the same way."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Classify: blood type, pain level (none/mild/severe), temperature in °C, number of hospital visits, weight in kg.",
      solution: ["Blood type: nominal. Pain level: ordinal.", "Temperature in °C: interval, continuous. Visits: ratio, discrete. Weight: ratio, continuous."],
      result: "Nominal, ordinal, interval, ratio (discrete), ratio (continuous).",
    },
    {
      type: "example",
      level: 2,
      title: "summarising ordinal data",
      problem: "Seven shirts sold: S, M, M, L, XL, XL, XL. Give a sensible centre.",
      solution: ["Sorted, the 4th of 7 values is L: the median is L.", "The mode is XL. A mean size doesn't exist: the gap from S to M need not equal the gap from L to XL."],
      result: "Median L, mode XL.",
    },
    {
      type: "example",
      level: 3,
      title: "what an interval scale preserves",
      problem: "Temperatures are 10, 20 and 40 °C. Compare the ratio $40/20$ and the difference ratio $\\tfrac{40 - 20}{20 - 10}$ with their values in °F ($F = 1.8C + 32$).",
      solution: [
        "In °F the readings are 50, 68 and 104. The ratio $104/68 \\approx 1.53$ no longer equals $40/20 = 2$.",
        "The difference ratio is $\\tfrac{104 - 68}{68 - 50} = \\tfrac{36}{18} = 2$, the same as in °C: $x \\mapsto ax + b$ scales every difference by $a$.",
      ],
      result: "Ratios of readings change; ratios of differences don't.",
    },
  ],
  pitfalls: [
    { wrong: "Postcodes, phone numbers and IDs are quantitative.", right: "They are labels: count them, don't average them." },
    { wrong: "Ordinal codes 1–5 are amounts like any other.", right: "The gaps between levels are unknown. Report the median and the distribution; a mean of codes is an extra assumption." },
    { wrong: "A bigger sample removes bias.", right: "It removes sampling error only. Bias needs a better design." },
  ],
  formulas: [
    { label: "Nominal", tex: "\\text{counts, proportions, mode}" },
    { label: "Ordinal", tex: "+\\ \\text{median, percentiles}" },
    { label: "Interval", tex: "+\\ \\text{mean, SD, differences}" },
    { label: "Ratio", tex: "+\\ \\text{ratios, CV, geometric mean}" },
  ],
  exercises: [
    ex(1, mc("dvx-ex-1", "Temperature in kelvin is measured on", ["a ratio scale", "0 K is the absence of thermal energy."], [["an interval scale", "Unlike °C, kelvin has a true zero."], ["an ordinal scale", "It is a measured amount."]]), ["Kelvin starts at absolute zero, so 300 K really is twice 150 K."]),
    ex(1, mc("dvx-ex-2", "The number of goals scored in a match is", ["quantitative and discrete", "It is counted."], [["quantitative and continuous", "Goals come in whole numbers."], ["ordinal", "It is an amount, not a ranked label."]]), ["Counts are discrete quantitative data."]),
    ex(1, mc("dvx-ex-3", "A census", ["measures every member of the population", "That is what distinguishes it from a sample."], [["is a random sample", "A census includes everyone."], ["can only collect categorical data", "Censuses record ages, incomes and more."]]), ["A census aims to cover the whole population."]),
    ex(2, mc("dvx-ex-4", "Which summary is meaningful for ordinal data but not for nominal data?", ["The median", "It needs an order."], [["The mode", "That works for nominal data too."], ["The mean", "That needs equal gaps: interval or ratio data."]]), ["Ordering lets you find a middle value; nominal categories have no middle."]),
    ex(2, num("dvx-ex-5", "Five ratings on a 1–5 scale: 2, 5, 4, 2, 3. Find the median rating.", 3, "Sort and take the middle."), ["Sorted: 2, 2, 3, 4, 5. The middle value is 3."]),
    ex(2, mc("dvx-ex-6", "A firm computes the mean salary of all 40 of its employees. For the firm, this number is", ["a parameter", "It describes the whole population of interest."], [["a statistic", "Nothing was sampled: every employee is included."], ["a latent variable", "It is computed directly from recorded data."]]), ["When the population is the firm's 40 employees, a value computed from all of them is a parameter."]),
    ex(3, num("dvx-ex-7", "Temperatures are 10, 20 and 40 °C. Using $F = 1.8C + 32$, find $\\tfrac{F_3 - F_2}{F_2 - F_1}$.", 2, "Differences scale by 1.8."), ["$F = 50, 68, 104$, so $\\tfrac{36}{18} = 2$, unchanged from °C."]),
    ex(3, num("dvx-ex-8", "Using $F = 1.8C + 32$, find $F(20)/F(10)$.", 1.36, "68/50."), ["$68/50 = 1.36$, not 2: ratios of interval-scale readings depend on the scale."]),
    ex(3, mc("dvx-ex-9", "The same 500 children are tested every year from age 5 to 15. The data are", ["longitudinal", "The same units are followed over time."], [["cross-sectional", "That would test different children once."], ["a single time series", "There are 500 units, not one."]]), ["Repeated measurements on the same units form panel (longitudinal) data."]),
    ex(3, mc("dvx-ex-10", "Anxiety measured by a 20-item questionnaire is best described as", ["a latent variable measured through observed items", "Anxiety itself is not observed directly."], [["a nominal variable", "It is a graded quantity."], ["a ratio-scale measurement", "Questionnaire scores have no true zero."]]), ["The items are observed indicators of an underlying, unobserved trait."]),
  ],
});

const VARS: { name: string; type: string }[] = [
  { name: "a patient's blood type", type: "nominal" },
  { name: "the country a student was born in", type: "nominal" },
  { name: "a phone's colour", type: "nominal" },
  { name: "a hotel's star rating (1 to 5 stars)", type: "ordinal" },
  { name: "a customer's satisfaction (poor / fair / good / excellent)", type: "ordinal" },
  { name: "a runner's finishing position in a race", type: "ordinal" },
  { name: "the number of emails a person receives in a day", type: "discrete" },
  { name: "the number of siblings a student has", type: "discrete" },
  { name: "the number of defects on a circuit board", type: "discrete" },
  { name: "the time taken to finish a test", type: "continuous" },
  { name: "a baby's birth weight", type: "continuous" },
  { name: "the distance a car travels on one litre of fuel", type: "continuous" },
];
const LABEL: Record<string, string> = { nominal: "Categorical, nominal", ordinal: "Categorical, ordinal", discrete: "Quantitative, discrete", continuous: "Quantitative, continuous" };
const WHY: Record<string, string> = {
  nominal: "Unordered labels.",
  ordinal: "Ordered categories, but not amounts with equal gaps.",
  discrete: "A count: whole numbers.",
  continuous: "A measurement that can take any value in a range.",
};
const SIZES = ["XS", "S", "M", "L", "XL"];

export const templates: Template[] = [
  {
    type: "interpret",
    make: (r, lv) => {
      const v = r.pick(lv === 1 ? VARS.filter((x) => x.type === "nominal" || x.type === "continuous") : VARS);
      const others = Object.keys(LABEL).filter((t) => t !== v.type);
      return mcNumbers(
        `What type of variable is ${v.name}?`,
        { text: LABEL[v.type], why: WHY[v.type] },
        others.map((t) => ({
          text: LABEL[t],
          why: WHY[t],
          ...(v.type === "nominal" && t !== "ordinal" ? { misconception: "numbers-are-quantitative" } : {}),
        })),
      );
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const k = [3, 4, 5][lv - 1];
      const counts = Array.from({ length: k }, () => r.int(1, 4 * lv + 2));
      const n = counts.reduce((s, c) => s + c, 0);
      const sizes = SIZES.slice(0, k);
      // Median category: the one holding the middle value (odd n) or the lower middle (even n).
      const target = Math.ceil(n / 2);
      let acc = 0;
      let med = 0;
      for (let i = 0; i < k; i++) {
        acc += counts[i];
        if (acc >= target) {
          med = i;
          break;
        }
      }
      const table = sizes.map((s, i) => `${s}: ${counts[i]}`).join(", ");
      return mcNumbers(
        `Shirts sold by size: ${table}. Which size contains the median${n % 2 ? "" : " (the lower of the two middle values)"}?`,
        { text: sizes[med], why: `${n} shirts, so the median is value ${target} in size order; the running totals reach ${target} at ${sizes[med]}.` },
        sizes
          .map((s, i) => ({ text: s, i }))
          .filter((x) => x.i !== med)
          .slice(0, 3)
          .map((x) => ({ text: x.text, why: `The running total passes value ${target} at ${sizes[med]}, not ${x.text}.` })),
      );
    },
  },
  {
    type: "error",
    make: (r) => {
      const c1 = r.int(5, 15);
      const c2 = c1 * 2;
      return mcNumbers(
        `"It was ${c1} °C on Monday and ${c2} °C on Tuesday, so Tuesday was twice as hot." What is wrong?`,
        { text: "Celsius has an arbitrary zero, so ratios of °C are meaningless", why: `In kelvin: ${c1 + 273} K and ${c2 + 273} K, about ${Math.round(((c2 - c1) / (c1 + 273)) * 100)}% warmer.` },
        [
          { text: "Nothing: the claim is correct", why: "Doubling a Celsius reading does not double the heat.", misconception: "interval-ratio" },
          { text: "It should compare in °F instead", why: "Fahrenheit also has an arbitrary zero." },
        ],
      );
    },
  },
];
