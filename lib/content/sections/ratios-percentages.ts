import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Ratios and proportion (direct and inverse), rates and unit conversion, percentages, percentage change, successive and reverse percentages, weighted averages and mixtures, work and speed problems. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "ratios-percentages",
  title: "Ratios, rates, percentages & units",
  summary: "A ratio compares quantities by division; a rate is a ratio with units, such as km per hour; a percentage is a ratio out of 100. The key habits: convert percentage changes into multipliers, so successive changes multiply rather than add; average rates by total quantity over total time; and carry units through every calculation.",
  deps: ["linear-equations"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "direct proportion", meaning: "$y = kx$: doubling $x$ doubles $y$." },
    { term: "inverse proportion", meaning: "$y = k/x$: doubling $x$ halves $y$." },
    { term: "multiplier", meaning: "The factor for a percentage change: an increase of $r\\%$ multiplies by $1 + r/100$, a decrease by $1 - r/100$." },
  ],
  misconceptions: {
    "percent-changes-add": "Adds successive percentage changes, for example thinking a 20% rise then a 20% fall returns to the start.",
    "average-speed-mean": "Takes the average speed of a round trip as the plain average of the two speeds.",
  },
  steps: [
    {
      type: "motivate",
      title: "Everyday arithmetic, exam traps",
      body: "Shop prices go up 10%, then a sale takes 10% off. Is the price back where it started? A car drives to a city at 60 km/h and back at 40 km/h; was its average speed 50? Questions like these are on every SAT and fill the quantitative sections of many exams, because the intuitive answer is so often wrong.",
      realWorld: {
        title: "GST and discounts",
        body: "A shirt priced ₹1,180 including 18% GST had a pre-tax price of $1180/1.18 = ₹1{,}000$, not $1180 \\times 0.82$. Reverse percentages appear on every receipt.",
      },
    },
    {
      type: "truth",
      statement: "Percentage change $= \\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%$. Successive changes of $r_1\\%$ and $r_2\\%$ multiply: the overall multiplier is $(1 + r_1/100)(1 + r_2/100)$. To undo a change, divide: original $=$ final $\\div$ multiplier. For a journey, **average speed** $= \\dfrac{\\text{total distance}}{\\text{total time}}$; over two equal distances at speeds $u$ and $v$ it is the harmonic mean $\\dfrac{2uv}{u + v}$. Combined **work rates add**: if A finishes a job in $a$ hours and B in $b$ hours, together they take $\\dfrac{ab}{a + b}$ hours.",
      body: "Split a quantity in the ratio $p : q : r$ by dividing it into $p + q + r$ equal parts. In **direct proportion** $y_1/x_1 = y_2/x_2$; in **inverse proportion** $x_1y_1 = x_2y_2$. Convert units by multiplying by fractions equal to 1, such as $\\dfrac{1000\\text{ m}}{1\\text{ km}}$ and $\\dfrac{1\\text{ h}}{3600\\text{ s}}$: so $72$ km/h $= 72 \\times \\tfrac{1000}{3600} = 20$ m/s. A **mixture's** concentration is a weighted average of the parts' concentrations, weighted by their amounts.",
    },
    {
      type: "predict",
      misconception: "percent-changes-add",
      item: {
        kind: "mc",
        id: "rpc-predict-1",
        prompt: "A ₹1,000 phone rises 20% in price, then is discounted 20%. Its final price is",
        options: [
          { id: "a", text: "₹960", correct: true, why: "$1000 \\times 1.2 \\times 0.8$." },
          { id: "b", text: "₹1,000, since the changes cancel", misconception: "percent-changes-add", why: "The 20% discount is taken from the higher price." },
          { id: "c", text: "₹1,040", why: "The second change is a decrease." },
        ],
      },
      reveal: {
        body: "The rise makes it ₹1,200; 20% of ₹1,200 is ₹240, leaving ₹960. In multipliers: $1.2 \\times 0.8 = 0.96$, a 4% loss overall. Percentages are always of the current amount, so successive changes multiply. The same rule gives compound interest.",
      },
      resolve: {
        kind: "mc",
        id: "rpc-resolve-1",
        prompt: "A 50% increase followed by a 50% decrease leaves a quantity",
        options: [
          { id: "a", text: "25% lower than it started", correct: true, why: "$1.5 \\times 0.5 = 0.75$." },
          { id: "b", text: "unchanged", misconception: "percent-changes-add", why: "Multipliers multiply." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rpc-check-1",
        prompt: "A cyclist rides 30 km to a town at 60 km/h and returns the same way at 40 km/h. The average speed for the round trip is",
        options: [
          { id: "a", text: "48 km/h", correct: true, why: "60 km in $0.5 + 0.75 = 1.25$ hours." },
          { id: "b", text: "50 km/h", misconception: "average-speed-mean", why: "More time is spent at the slower speed." },
          { id: "c", text: "45 km/h", why: "Use total distance over total time." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rpc-check-2",
        prompt: "After a 25% increase, a salary is ₹50,000. The original salary was",
        options: [
          { id: "a", text: "₹40,000", correct: true, why: "$50000/1.25$." },
          { id: "b", text: "₹37,500", why: "That subtracts 25% of the new salary." },
          { id: "c", text: "₹62,500", why: "That increases it again." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Metrics are ratios, and reporting them carelessly misleads: a model improving accuracy from 98% to 99% halves the error rate, a 50% relative reduction. Learning-rate schedules that multiply by 0.9 each epoch are successive percentage changes, so after 10 epochs the rate is $0.9^{10} \\approx 0.35$ of where it began.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rpc-produce-1", prompt: "Split ₹900 in the ratio 2 : 3 : 4. Find the largest share in rupees.", answer: 400, explain: "$900/9 = 100$ per part." },
        { kind: "number", id: "rpc-produce-2", prompt: "A tap fills a tank in 6 hours and another in 3 hours. How many hours do both take together?", answer: 2, explain: "Rates $\\tfrac16 + \\tfrac13 = \\tfrac12$ per hour." },
        {
          kind: "mc",
          id: "rpc-produce-3",
          prompt: "A share price falls 10% one day and rises 10% the next. Overall it is",
          options: [
            { id: "a", text: "down 1%", correct: true, why: "$0.9 \\times 1.1 = 0.99$." },
            { id: "b", text: "unchanged", misconception: "percent-changes-add", why: "The rise is on a smaller base." },
          ],
        },
        {
          kind: "mc",
          id: "rpc-produce-4",
          prompt: "A runner covers two equal laps at 10 km/h and 15 km/h. The average speed is",
          options: [
            { id: "a", text: "12 km/h", correct: true, why: "$2 \\times 10 \\times 15/25$." },
            { id: "b", text: "12.5 km/h", misconception: "average-speed-mean", why: "Equal distances, not equal times." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rpc-review-1", prompt: "Convert 72 km/h to m/s.", answer: 20, explain: "$72 \\times 1000/3600$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "percentage points versus percent",
      body: "If an interest rate rises from 4% to 5%, it rose by **1 percentage point**, which is a **25% increase** in the rate. Exam questions and news reports mix these up constantly; percentage points are differences of percentages, percent changes are ratios.",
    },
    {
      type: "definition",
      term: "weighted averages and mixtures",
      body: "Mixing $m_1$ litres at concentration $c_1$ with $m_2$ at $c_2$ gives $\\dfrac{m_1c_1 + m_2c_2}{m_1 + m_2}$. The **alligation** shortcut: to reach target $c$ between $c_1$ and $c_2$, mix in the ratio $m_1 : m_2 = (c_2 - c) : (c - c_1)$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "successive changes",
      statement: "Changes of $r_1\\%, r_2\\%, \\dots, r_k\\%$ give overall multiplier $\\prod(1 + r_i/100)$. For two changes, the net change is $r_1 + r_2 + \\dfrac{r_1r_2}{100}$ percent.",
      proof: ["$(1 + a)(1 + b) = 1 + a + b + ab$ with $a = r_1/100$, $b = r_2/100$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "average speed over equal distances",
      statement: "Covering distance $d$ at speed $u$ and then $d$ at speed $v$ gives average speed $\\dfrac{2uv}{u + v}$, which is less than $\\dfrac{u + v}{2}$ unless $u = v$.",
      proof: ["Total time $\\dfrac du + \\dfrac dv$; divide $2d$ by it. And $\\dfrac{u + v}{2} - \\dfrac{2uv}{u + v} = \\dfrac{(u - v)^2}{2(u + v)} \\ge 0$: the harmonic mean never exceeds the arithmetic mean."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "combined work",
      statement: "If A alone takes $a$ hours and B alone $b$ hours, together they take $\\dfrac{ab}{a + b}$ hours.",
      proof: ["Rates (jobs per hour) add: $\\tfrac1a + \\tfrac1b = \\tfrac{a + b}{ab}$; time is the reciprocal."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A price rises from ₹250 to ₹290. Find the percentage increase.",
      solution: ["Increase ₹40.", "$40/250 = 0.16 = 16\\%$."],
      result: "16%.",
    },
    {
      type: "example",
      level: 2,
      title: "a mixture",
      problem: "How many litres of 50% acid must be added to 6 litres of 20% acid to make a 30% solution?",
      solution: ["$\\dfrac{6 \\times 0.2 + 0.5x}{6 + x} = 0.3$, so $1.2 + 0.5x = 1.8 + 0.3x$.", "$0.2x = 0.6$, $x = 3$ litres."],
      result: "3 litres.",
    },
    {
      type: "example",
      level: 3,
      title: "inverse proportion",
      problem: "12 workers build a wall in 10 days. After 4 days, 3 workers leave. How many more days does the wall take?",
      solution: ["Total work 120 worker-days; 48 are done, 72 remain.", "9 workers need $72/9 = 8$ more days."],
      result: "8 days.",
    },
  ],
  pitfalls: [
    { wrong: "Add successive percentage changes.", right: "Multiply the multipliers." },
    { wrong: "Average two speeds by their mean.", right: "Divide total distance by total time." },
    { wrong: "Undo a 25% rise by taking 25% off.", right: "Divide by 1.25." },
  ],
  formulas: [
    { label: "Percentage change", tex: "\\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\times 100\\%" },
    { label: "Successive", tex: "\\textstyle\\prod(1 + r_i/100)" },
    { label: "Average speed", tex: "\\dfrac{2uv}{u + v}" },
    { label: "Combined work", tex: "\\dfrac{ab}{a + b}" },
  ],
  exercises: [
    ex(1, num("rpcx-ex-1", "Find 15% of 480.", 72, "$0.15 \\times 480$."), ["$72$."]),
    ex(1, num("rpcx-ex-2", "If 5 pens cost ₹60, how many rupees do 8 cost?", 96, "₹12 each."), ["$96$."]),
    ex(2, num("rpcx-ex-3", "A price including 18% GST is ₹2,360. Find the price before tax.", 2000, "$2360/1.18$."), ["$2000$."]),
    ex(2, dp("rpcx-ex-4", "A population grows 10% a year for 3 years. Find the overall percentage increase.", 33.1, "$1.1^3 = 1.331$."), ["$33.1\\%$."]),
    ex(2, num("rpcx-ex-5", "A car goes 120 km at 40 km/h and returns at 60 km/h. Find the average speed in km/h.", 48, "$240/(3 + 2)$."), ["$48$."]),
    ex(3, num("rpcx-ex-6", "Pipe A fills a tank in 4 hours, pipe B in 6 hours, and pipe C empties it in 12 hours. With all three open, how many hours to fill it?", 3, "Net rate $\\tfrac14 + \\tfrac16 - \\tfrac1{12} = \\tfrac13$."), ["$3$ hours."]),
    ex(3, num("rpcx-ex-7", "A rate rises from 4% to 5%. By what percent did the rate increase?", 25, "$1/4$."), ["$25\\%$ (one percentage point)."]),
    ex(3, mc("rpcx-ex-8", "In what ratio must 20% and 50% solutions be mixed to give 30%?", ["2 : 1", "Alligation: $(50 - 30) : (30 - 20)$."], [["1 : 2", "That gives 40%."], ["3 : 5", "Use the distances from the target."]]), ["Check: $(2 \\times 20 + 1 \\times 50)/3 = 30$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([5, 10, 15, 20, 25, 30, 40, 50]);
      const b = r.pick([5, 10, 15, 20, 25, 30, 40, 50]);
      const up = r.pick([true, false]);
      const m = (1 + (up ? a : -a) / 100) * (1 + (up ? -b : b) / 100);
      const v = (m - 1) * 100;
      return n(`A price ${up ? "rises" : "falls"} ${a}% and then ${up ? "falls" : "rises"} ${b}%. Find the overall percentage change (negative for a decrease, 2 decimals).`, r2(v), `Multiplier $${r2(1 + (up ? a : -a) / 100)} \\times ${r2(1 + (up ? -b : b) / 100)} = ${Math.round(m * 10000) / 10000}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const u = r.pick([20, 30, 40, 45, 50, 60, 72, 90]);
      let v = r.pick([20, 30, 40, 45, 50, 60, 72, 90]);
      if (v === u) v += 10;
      const s = (2 * u * v) / (u + v);
      return n(`A journey's two equal halves are driven at ${u} km/h and ${v} km/h. Find the average speed in km/h (2 decimals).`, r2(s), `$\\dfrac{2 \\times ${u} \\times ${v}}{${u + v}} \\approx ${r2(s)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([2, 3, 4, 5, 6, 8, 10, 12]);
      const b = r.pick([3, 4, 6, 8, 12, 15, 20, 24]);
      const t = (a * b) / (a + b);
      return n(`A alone finishes a job in ${a} hours; B alone in ${b} hours. How many hours do they take together (3 decimals)?`, Math.round(t * 1000) / 1000, `$\\dfrac{${a} \\times ${b}}{${a + b}} \\approx ${Math.round(t * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const orig = r.int(4, 40) * 50;
      const p = r.pick([5, 10, 12, 18, 20, 25, 28]);
      const fin = orig * (1 + p / 100);
      return n(`After a ${p}% increase a price is ₹${r2(fin)}. Find the original price in rupees.`, orig, `$${r2(fin)}/${r2(1 + p / 100)} = ${orig}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.pick([10, 20, 25, 30, 50]);
      const m = (1 + p / 100) * (1 - p / 100);
      return mcNumbers(
        `A quantity increases by ${p}% and then decreases by ${p}%. Overall it`,
        { text: `falls by ${r2((1 - m) * 100)}%`, why: `$${r2(1 + p / 100)} \\times ${r2(1 - p / 100)} = ${r2(m)}$.` },
        [{ text: "returns to its original value", why: "Percentages are of the current amount.", misconception: "percent-changes-add" }],
      );
    },
  },
];
