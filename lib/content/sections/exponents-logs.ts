import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Laws of exponents, surds and rationalising, logarithms and their laws, change of base, exponential and logarithmic equations and inequalities (with domains), exponential growth and decay. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "exponents-logs",
  title: "Exponents, surds & logarithms",
  summary: "Exponents count repeated multiplication, and their laws follow from that: multiply powers by adding exponents. A logarithm answers the reverse question, \"what power?\", so its laws turn products into sums. Every logarithm needs a positive argument and a positive base other than 1, and every log equation must be checked against that domain.",
  deps: ["ratios-percentages"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "logarithm", meaning: "$\\log_ax = y$ means $a^y = x$, for $a > 0$, $a \\ne 1$, $x > 0$." },
    { term: "surd", meaning: "An irrational root such as $\\sqrt 2$ or $\\sqrt[3]5$, kept in exact form." },
    { term: "natural logarithm", meaning: "$\\ln x = \\log_ex$, with $e \\approx 2.718$." },
  ],
  misconceptions: {
    "log-of-sum": "Thinks $\\log(a + b) = \\log a + \\log b$.",
    "log-domain-ignored": "Keeps solutions of a log equation that make some logarithm's argument zero or negative.",
  },
  steps: [
    {
      type: "motivate",
      title: "Powers and their inverses",
      body: "A loan grows 10% a year: when does it double? An earthquake of magnitude 7 is how many times stronger than one of magnitude 5? A sound of 90 dB versus 60 dB? Exponents describe the growth, and logarithms answer \"how many times?\" and \"how long?\". They also turn hard multiplications into easy additions, which is why they were invented.",
      realWorld: {
        title: "The Richter scale",
        body: "Earthquake magnitude is a base-10 logarithm of the shaking amplitude, so each whole step is 10 times the amplitude and about 32 times the energy. A magnitude 7 quake shakes 100 times harder than a magnitude 5.",
      },
    },
    {
      type: "truth",
      statement: "**Exponent laws** (for $a > 0$): $a^ma^n = a^{m+n}$, $\\dfrac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$, $a^0 = 1$, $a^{-n} = \\dfrac1{a^n}$, $a^{p/q} = \\sqrt[q]{a^p}$. **Log laws** (for $x, y > 0$): $\\log_a(xy) = \\log_ax + \\log_ay$, $\\log_a\\dfrac xy = \\log_ax - \\log_ay$, $\\log_ax^k = k\\log_ax$, **change of base** $\\log_ax = \\dfrac{\\ln x}{\\ln a}$, and $a^{\\log_ax} = x$. There is no law for $\\log(x + y)$.",
      body: "**Rationalise** a denominator by multiplying by its conjugate: $\\dfrac{1}{\\sqrt a - \\sqrt b} = \\dfrac{\\sqrt a + \\sqrt b}{a - b}$. To solve $a^{f(x)} = a^{g(x)}$, set $f(x) = g(x)$; otherwise take logs. In a log equation, find the domain first (every argument $> 0$), solve, then reject roots outside it. For inequalities, $\\log_ax$ is **increasing** if $a > 1$ and **decreasing** if $0 < a < 1$, so the inequality reverses for bases between 0 and 1. Growth at rate $r$ per period: $A = P(1 + r)^t$; decay with half-life $h$: $A = A_0(\\tfrac12)^{t/h}$.",
    },
    {
      type: "predict",
      misconception: "log-domain-ignored",
      item: {
        kind: "mc",
        id: "exl-predict-1",
        prompt: "Solve $\\log_2x + \\log_2(x - 2) = 3$.",
        options: [
          { id: "a", text: "$x = 4$ only", correct: true, why: "$x(x - 2) = 8$ gives 4 or $-2$; $x = -2$ makes $\\log_2x$ undefined." },
          { id: "b", text: "$x = 4$ or $x = -2$", misconception: "log-domain-ignored", why: "Both logs need positive arguments, so $x > 2$." },
          { id: "c", text: "$x = 2$", why: "Then $\\log_2 0$ is undefined." },
        ],
      },
      reveal: {
        body: "Domain first: $x > 0$ and $x - 2 > 0$, so $x > 2$. Combining, $\\log_2(x(x - 2)) = 3$ gives $x^2 - 2x - 8 = 0$, $x = 4$ or $-2$. Only $x = 4$ is in the domain. Combining logs can introduce roots that the original equation never had, so always check.",
      },
      resolve: {
        kind: "mc",
        id: "exl-resolve-1",
        prompt: "Solving $\\log(x + 3) + \\log(x - 3) = \\log 16$ gives $x^2 = 25$. The solution set is",
        options: [
          { id: "a", text: "$\\{5\\}$", correct: true, why: "$x = -5$ makes both arguments negative." },
          { id: "b", text: "$\\{5, -5\\}$", misconception: "log-domain-ignored", why: "Check the domain $x > 3$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exl-check-1",
        prompt: "$\\log_{10}(20 + 80)$ equals",
        options: [
          { id: "a", text: "2", correct: true, why: "$\\log_{10}100 = 2$." },
          { id: "b", text: "$\\log_{10}20 + \\log_{10}80 \\approx 3.2$", misconception: "log-of-sum", why: "Sums of logs give the log of a product, not of a sum." },
          { id: "c", text: "100", why: "The log is the exponent, 2." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exl-check-2",
        prompt: "Simplify $\\dfrac{1}{\\sqrt3 - \\sqrt2}$.",
        options: [
          { id: "a", text: "$\\sqrt3 + \\sqrt2$", correct: true, why: "Multiply top and bottom by $\\sqrt3 + \\sqrt2$; the denominator is $3 - 2 = 1$." },
          { id: "b", text: "$\\sqrt3 - \\sqrt2$", why: "Use the conjugate." },
          { id: "c", text: "$\\dfrac{1}{\\sqrt1}$", why: "$\\sqrt3 - \\sqrt2 \\ne \\sqrt{3 - 2}$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Models maximise log-likelihoods because logs turn products of many probabilities into sums, which are numerically stable and easy to differentiate (§{mle}). Cross-entropy loss, log-odds in logistic regression and learning rates on a log scale all rely on the laws above.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "exl-produce-1", prompt: "Solve $2^{x+1} = 32$.", answer: 4, explain: "$32 = 2^5$." },
        { kind: "number", id: "exl-produce-2", prompt: "Evaluate $\\log_327 + \\log_2\\tfrac18$.", answer: 0, explain: "$3 + (-3)$." },
        {
          kind: "mc",
          id: "exl-produce-3",
          prompt: "$\\ln(e + e)$ equals",
          options: [
            { id: "a", text: "$\\ln 2 + 1$", correct: true, why: "$\\ln(2e) = \\ln 2 + \\ln e$." },
            { id: "b", text: "2", misconception: "log-of-sum", why: "$\\ln e + \\ln e$ would be $\\ln(e \\cdot e)$." },
          ],
        },
        {
          kind: "mc",
          id: "exl-produce-4",
          prompt: "Solve $\\log_3(x - 1) + \\log_3(x + 1) = 1$.",
          options: [
            { id: "a", text: "$x = 2$", correct: true, why: "$x^2 - 1 = 3$; $x = -2$ is outside $x > 1$." },
            { id: "b", text: "$x = \\pm 2$", misconception: "log-domain-ignored", why: "$x = -2$ makes the arguments negative." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "exl-review-1", prompt: "Evaluate $9^{3/2}$.", answer: 27, explain: "$(\\sqrt9)^3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "logarithmic inequalities",
      body: "For $a > 1$, $\\log_ax > \\log_ay \\iff x > y > 0$. For $0 < a < 1$, $\\log_ax > \\log_ay \\iff 0 < x < y$. So $\\log_{1/2}(x - 1) > -2$ means $0 < x - 1 < (\\tfrac12)^{-2} = 4$, that is $1 < x < 5$. Always intersect with the domain.",
    },
    {
      type: "definition",
      term: "growth, decay and doubling",
      body: "$A = P(1 + r)^t$ doubles when $t = \\dfrac{\\ln 2}{\\ln(1 + r)} \\approx \\dfrac{70}{100r}$ (the \"rule of 70\", or 72). Continuous growth $A = Pe^{kt}$ doubles at $t = \\ln 2/k$. A half-life $h$ means $A = A_0 \\cdot 2^{-t/h}$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "the product law",
      statement: "For $a > 0$, $a \\ne 1$ and $x, y > 0$: $\\log_a(xy) = \\log_ax + \\log_ay$.",
      proof: ["Let $p = \\log_ax$ and $q = \\log_ay$, so $x = a^p$ and $y = a^q$. Then $xy = a^{p+q}$, so $\\log_a(xy) = p + q$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "change of base",
      statement: "$\\log_ax = \\dfrac{\\log_bx}{\\log_ba}$ for any valid base $b$; in particular $\\log_ab = \\dfrac{1}{\\log_ba}$.",
      proof: ["If $y = \\log_ax$ then $a^y = x$; take $\\log_b$: $y\\log_ba = \\log_bx$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "solving exponential equations",
      statement: "Write both sides with the same base when possible; otherwise take logs. Equations like $4^x - 3 \\cdot 2^x + 2 = 0$ become quadratics in $t = 2^x > 0$ (§{quadratics}).",
      proof: ["$4^x = (2^x)^2$, so $t^2 - 3t + 2 = 0$, $t = 1$ or 2, $x = 0$ or 1; discard any $t \\le 0$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Simplify $\\dfrac{2^5 \\cdot 4^3}{8^2}$.",
      solution: ["Write in base 2: $\\dfrac{2^5 \\cdot 2^6}{2^6}$.", "$= 2^5 = 32$."],
      result: "32.",
    },
    {
      type: "example",
      level: 2,
      title: "a log equation",
      problem: "Solve $\\log_2(x + 3) + \\log_2(x - 3) = 4$.",
      solution: ["Domain $x > 3$. Combine: $(x + 3)(x - 3) = 16$, $x^2 = 25$.", "$x = 5$ (reject $-5$)."],
      result: "$x = 5$.",
    },
    {
      type: "example",
      level: 3,
      title: "half-life",
      problem: "A drug's level halves every 5 hours. Starting at 80 mg/L, how long until it falls to 10 mg/L?",
      solution: ["$80 \\to 40 \\to 20 \\to 10$: three halvings.", "$3 \\times 5 = 15$ hours. In general $t = 5\\log_2(80/10)$."],
      result: "15 hours.",
    },
  ],
  pitfalls: [
    { wrong: "$\\log(a + b) = \\log a + \\log b$.", right: "Only $\\log(ab) = \\log a + \\log b$." },
    { wrong: "Keep every root of a log equation.", right: "Check each against the domain (arguments $> 0$)." },
    { wrong: "Keep the inequality sign with a log base between 0 and 1.", right: "Such logs are decreasing: reverse it." },
  ],
  formulas: [
    { label: "Exponents", tex: "a^ma^n = a^{m+n},\\ (a^m)^n = a^{mn},\\ a^{-n} = 1/a^n" },
    { label: "Logs", tex: "\\log(xy) = \\log x + \\log y,\\ \\log x^k = k\\log x" },
    { label: "Change of base", tex: "\\log_ax = \\dfrac{\\ln x}{\\ln a}" },
    { label: "Growth", tex: "A = P(1 + r)^t" },
  ],
  exercises: [
    ex(1, num("exlx-ex-1", "Evaluate $\\log_381$.", 4, "$3^4 = 81$."), ["$4$."]),
    ex(1, num("exlx-ex-2", "Simplify $(\\sqrt5 + \\sqrt3)(\\sqrt5 - \\sqrt3)$.", 2, "$5 - 3$."), ["$2$."]),
    ex(2, num("exlx-ex-3", "Solve $3^{2x} = 27$.", 1.5, "$2x = 3$."), ["$1.5$."]),
    ex(2, num("exlx-ex-4", "₹10,000 grows at 10% a year compounded annually. Find the amount after 2 years.", 12100, "$10000 \\times 1.1^2$."), ["₹12,100."]),
    ex(2, dp("exlx-ex-5", "Find $\\log_25$ using natural logs.", Math.log(5) / Math.log(2), "$\\ln5/\\ln2$."), ["$\\approx 2.322$."]),
    ex(3, num("exlx-ex-6", "How many integers satisfy $\\log_{1/2}(x - 1) > -2$?", 3, "$1 < x < 5$."), ["$2, 3, 4$."]),
    ex(3, num("exlx-ex-7", "Find the sum of the solutions of $4^x - 3 \\cdot 2^x + 2 = 0$.", 1, "$2^x = 1$ or 2."), ["$x = 0$ or $1$; sum $1$."]),
    ex(3, mc("exlx-ex-8", "An earthquake of magnitude 8 has how many times the amplitude of one of magnitude 6?", ["100", "$10^{8-6}$."], [["2", "Magnitudes are logarithms."], ["20", "Each step is a factor of 10."]]), ["Logarithmic scales compress huge ranges."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const b = r.pick([2, 3, 5, 10]);
      const k = r.int(-3, 5);
      const x = b ** k;
      const shown = k >= 0 ? `${x}` : `\\tfrac{1}{${b ** -k}}`;
      return n(`Evaluate $\\log_{${b}}${shown}$.`, k, `$${b}^{${k}} = ${shown}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const b = r.pick([2, 3, 5]);
      const k = r.int(2, 5);
      const c = r.int(-3, 3);
      const a = r.pick([1, 2, 3]);
      const x = (k - c) / a;
      return n(`Solve $${b}^{${a === 1 ? "" : a}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}} = ${b ** k}$ (3 decimals if needed).`, Math.round(x * 1000) / 1000, `$${b ** k} = ${b}^{${k}}$, so $${a}x + (${c}) = ${k}$ and $x = ${Math.round(x * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [b, x, c, k] = r.pick([[2, 4, 2, 3], [2, 8, 4, 5], [2, 8, 6, 4], [2, 16, 12, 6], [2, 4, 3, 2], [2, 16, 8, 7], [3, 9, 6, 3], [3, 3, 2, 1], [3, 9, 8, 2]] as const);
      return n(`Solve $\\log_${b}x + \\log_${b}(x - ${c}) = ${k}$.`, x, `Domain $x > ${c}$. $x(x - ${c}) = ${b}^{${k}} = ${b ** k}$ gives $x = ${x}$ or $x = ${-(b ** k) / x}$; only $${x}$ is in the domain.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [a, b] = r.pick([[20, 80], [30, 70], [40, 60], [2, 8]] as const);
      return mcNumbers(
        `Which equals $\\log_{10}${a} + \\log_{10}${b}$?`,
        { text: `$\\log_{10}${a * b}$`, why: "The sum of logs is the log of the product." },
        [
          { text: `$\\log_{10}${a + b}$`, why: "That would need a law for sums, which doesn't exist.", misconception: "log-of-sum" },
          { text: `$\\log_{10}${a}\\cdot\\log_{10}${b}$`, why: "Logs add, they don't multiply." },
        ],
      );
    },
  },
];
