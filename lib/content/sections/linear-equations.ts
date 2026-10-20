import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Linear equations in one and two variables, linear functions, systems of two equations (and when they have no or infinitely many solutions), linear inequalities, absolute-value equations and inequalities. */

const base: ConceptNode = {
  id: "linear-equations",
  title: "Linear equations, inequalities & absolute value",
  summary: "A linear equation keeps its balance when you do the same thing to both sides. Two linear equations in two unknowns are two lines, which meet once, never, or everywhere. Inequalities work the same way except that multiplying or dividing by a negative number reverses them, and an absolute value |x − a| measures the distance from x to a, which turns one equation into two cases.",
  deps: [],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "linear function", meaning: "$f(x) = mx + c$: slope $m$ (change in $y$ per unit of $x$), $y$-intercept $c$." },
    { term: "consistent system", meaning: "A system with at least one solution; inconsistent systems have none." },
    { term: "absolute value", meaning: "$\\lvert x\\rvert = x$ if $x \\ge 0$ and $-x$ if $x < 0$: the distance from $x$ to 0." },
  ],
  misconceptions: {
    "inequality-no-flip": "Forgets to reverse an inequality when multiplying or dividing both sides by a negative number.",
    "abs-one-case": "Solves an absolute-value equation such as $\\lvert x - 3\\rvert = 5$ using only the positive case.",
  },
  steps: [
    {
      type: "motivate",
      title: "Balance and lines",
      body: "A phone plan costs ₹199 a month plus ₹2 per minute; another costs ₹399 with unlimited calls. When is the first cheaper? That is a linear inequality. Two trains leave from different cities towards each other: when do they meet? That is a pair of linear equations. Most word problems on the SAT and in board exams reduce to exactly these tools.",
      realWorld: {
        title: "Break-even analysis",
        body: "A business with fixed costs ₹50,000 a month and a profit of ₹250 per unit breaks even at $50{,}000/250 = 200$ units: the solution of a linear equation that every startup plan contains.",
      },
    },
    {
      type: "truth",
      statement: "Solve a linear equation by applying the same operation to both sides until $x$ is alone. The system $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$ has a **unique solution** if $\\dfrac{a_1}{a_2} \\ne \\dfrac{b_1}{b_2}$ (the lines cross), **no solution** if $\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\ne \\dfrac{c_1}{c_2}$ (parallel lines), and **infinitely many** if all three ratios are equal (the same line). For inequalities, multiplying or dividing by a **negative** number reverses the sign. For $b > 0$: $\\lvert x - a\\rvert < b \\iff a - b < x < a + b$, and $\\lvert x - a\\rvert > b \\iff x < a - b$ or $x > a + b$.",
      body: "Solve systems by **substitution** (make one variable the subject and substitute) or **elimination** (add multiples of the equations to cancel a variable). The line $y = mx + c$ through $(x_1, y_1)$ and $(x_2, y_2)$ has slope $m = \\dfrac{y_2 - y_1}{x_2 - x_1}$. An equation $\\lvert ax + b\\rvert = c$ has no solution if $c < 0$ and otherwise splits into $ax + b = c$ or $ax + b = -c$. With several absolute values, split the number line at the points where each expression inside is 0 and solve on each piece, keeping only solutions that lie in that piece.",
    },
    {
      type: "predict",
      misconception: "inequality-no-flip",
      item: {
        kind: "mc",
        id: "leq-predict-1",
        prompt: "Solve $-2x + 5 > 11$.",
        options: [
          { id: "a", text: "$x < -3$", correct: true, why: "$-2x > 6$; dividing by $-2$ reverses the sign." },
          { id: "b", text: "$x > -3$", misconception: "inequality-no-flip", why: "Dividing by a negative must reverse the inequality." },
          { id: "c", text: "$x > 3$", why: "$6/(-2) = -3$, and the sign also reverses." },
        ],
      },
      reveal: {
        body: "Subtract 5: $-2x > 6$. Dividing by $-2$ reverses the order, because multiplying by a negative number reflects the number line: $2 < 3$ but $-2 > -3$. So $x < -3$. Check with $x = -4$: $-2(-4) + 5 = 13 > 11$. ✓ And $x = 0$ gives $5$, which fails, as it should.",
      },
      resolve: {
        kind: "mc",
        id: "leq-resolve-1",
        prompt: "Solve $-3x \\ge 12$.",
        options: [
          { id: "a", text: "$x \\le -4$", correct: true, why: "Divide by $-3$ and reverse." },
          { id: "b", text: "$x \\ge -4$", misconception: "inequality-no-flip", why: "The sign must flip." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "leq-check-1",
        prompt: "Solve $\\lvert x - 3\\rvert = 5$.",
        options: [
          { id: "a", text: "$x = 8$ or $x = -2$", correct: true, why: "$x - 3 = 5$ or $x - 3 = -5$: the points 5 units from 3." },
          { id: "b", text: "$x = 8$ only", misconception: "abs-one-case", why: "The value inside can also be $-5$." },
          { id: "c", text: "No solution", why: "5 is positive, so there are two solutions." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "leq-check-2",
        prompt: "For which $k$ does $kx + 2y = 5$, $3x + 6y = 9$ have no solution?",
        options: [
          { id: "a", text: "$k = 1$", correct: true, why: "Then $\\tfrac13 = \\tfrac26 \\ne \\tfrac59$: parallel lines." },
          { id: "b", text: "$k = 3$", why: "Then $\\tfrac33 \\ne \\tfrac26$: the lines cross." },
          { id: "c", text: "No value of $k$", why: "$k = 1$ makes them parallel." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A linear model's prediction $w_1x_1 + \\dots + w_nx_n + b$ is a linear function, and a linear classifier's decision rule is a linear inequality: predict \"yes\" when $w \\cdot x + b > 0$. Fitting one to data means solving a (large) system of linear equations (§{least-squares}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "leq-produce-1", prompt: "Solve $3(x - 2) = 2x + 5$.", answer: 11, explain: "$3x - 6 = 2x + 5$." },
        { kind: "number", id: "leq-produce-2", prompt: "Solve $2x + 3y = 12$, $x - y = 1$. Give $x$.", answer: 3, explain: "$x = y + 1$; $2y + 2 + 3y = 12$ gives $y = 2$." },
        {
          kind: "mc",
          id: "leq-produce-3",
          prompt: "Solve $5 - 4x \\le 1$.",
          options: [
            { id: "a", text: "$x \\ge 1$", correct: true, why: "$-4x \\le -4$; divide by $-4$ and reverse." },
            { id: "b", text: "$x \\le 1$", misconception: "inequality-no-flip", why: "Dividing by $-4$ reverses the inequality." },
          ],
        },
        {
          kind: "mc",
          id: "leq-produce-4",
          prompt: "Solve $\\lvert 2x + 1\\rvert = 9$.",
          options: [
            { id: "a", text: "$x = 4$ or $x = -5$", correct: true, why: "$2x + 1 = 9$ or $2x + 1 = -9$." },
            { id: "b", text: "$x = 4$", misconception: "abs-one-case", why: "Don't forget $2x + 1 = -9$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "leq-review-1", prompt: "Find the slope of the line through $(1, 2)$ and $(4, 11)$.", answer: 3, explain: "$9/3$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "forms of a linear equation",
      body: "**Slope–intercept**: $y = mx + c$. **Point–slope**: $y - y_1 = m(x - x_1)$. **Standard**: $ax + by = c$, with slope $-a/b$ (if $b \\ne 0$). Parallel lines have equal slopes; perpendicular lines have slopes multiplying to $-1$. A linear function's graph is a straight line, and equal steps in $x$ give equal steps in $y$.",
    },
    {
      type: "definition",
      term: "absolute value as distance",
      body: "$\\lvert x - a\\rvert$ is the distance on the number line between $x$ and $a$. So $\\lvert x - a\\rvert < b$ is the open interval of radius $b$ around $a$, and $\\lvert x - a\\rvert + \\lvert x - b\\rvert$ is the total distance from $x$ to two points: it equals $\\lvert a - b\\rvert$ for every $x$ between them and grows outside.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "solutions of a 2 × 2 system",
      statement: "$a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$ has exactly one solution if and only if $a_1b_2 - a_2b_1 \\ne 0$, namely $x = \\dfrac{c_1b_2 - c_2b_1}{a_1b_2 - a_2b_1}$, $y = \\dfrac{a_1c_2 - a_2c_1}{a_1b_2 - a_2b_1}$.",
      proof: [
        "Multiply the first equation by $b_2$, the second by $b_1$, and subtract: $(a_1b_2 - a_2b_1)x = c_1b_2 - c_2b_1$.",
        "If the coefficient is nonzero, $x$ is determined, and then $y$. If it is zero the lines are parallel or identical. Cramer's rule generalises this to larger systems.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "why negatives reverse inequalities",
      statement: "If $a < b$ and $k < 0$, then $ka > kb$.",
      proof: ["$b - a > 0$ and $k < 0$, so $k(b - a) < 0$, that is $kb < ka$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "interval splitting for absolute values",
      statement: "To solve an equation or inequality with $\\lvert f_1(x)\\rvert, \\dots, \\lvert f_k(x)\\rvert$, mark the zeros of each $f_i$, solve on each resulting interval with the signs fixed, and keep only the solutions inside that interval.",
      proof: ["On each interval every $f_i$ has a constant sign, so each absolute value is a fixed $\\pm f_i$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Solve $\\lvert 2x - 1\\rvert \\le 7$.",
      solution: ["$-7 \\le 2x - 1 \\le 7$.", "$-6 \\le 2x \\le 8$, so $-3 \\le x \\le 4$."],
      result: "$-3 \\le x \\le 4$.",
    },
    {
      type: "example",
      level: 2,
      title: "a system by elimination",
      problem: "Solve $3x + 2y = 16$ and $5x - 4y = 1$.",
      solution: ["Double the first and add: $6x + 4y + 5x - 4y = 32 + 1$, so $11x = 33$, $x = 3$.", "Then $2y = 16 - 9 = 7$, $y = 3.5$."],
      result: "$x = 3$, $y = 3.5$.",
    },
    {
      type: "example",
      level: 3,
      title: "two absolute values",
      problem: "Solve $\\lvert x + 1\\rvert + \\lvert x - 3\\rvert = 6$.",
      solution: ["Critical points $-1$ and $3$. For $x \\ge 3$: $2x - 2 = 6$, $x = 4$ ✓. For $x \\le -1$: $-2x + 2 = 6$, $x = -2$ ✓.", "For $-1 < x < 3$: the sum is $4 \\ne 6$, so no solutions there."],
      result: "$x = -2$ or $x = 4$.",
    },
  ],
  pitfalls: [
    { wrong: "Divide an inequality by a negative and keep the sign.", right: "Reverse the inequality." },
    { wrong: "Solve $\\lvert f(x)\\rvert = c$ with one case.", right: "Use $f(x) = c$ and $f(x) = -c$ (and none if $c < 0$)." },
    { wrong: "Keep every case's solution in an interval-split problem.", right: "Keep only those lying in the interval you assumed." },
  ],
  formulas: [
    { label: "Slope", tex: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}" },
    { label: "Unique solution", tex: "a_1b_2 - a_2b_1 \\ne 0" },
    { label: "No solution", tex: "\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\ne \\dfrac{c_1}{c_2}" },
    { label: "Absolute value", tex: "\\lvert x - a\\rvert < b \\iff a - b < x < a + b" },
  ],
  exercises: [
    ex(1, num("leqx-ex-1", "Solve $5x - 7 = 18$.", 5, "$5x = 25$."), ["$5$."]),
    ex(1, num("leqx-ex-2", "A taxi charges ₹50 plus ₹15 per km. A ride cost ₹320. How many km?", 18, "$15k = 270$."), ["$18$ km."]),
    ex(2, num("leqx-ex-3", "Solve $3x + 2y = 16$, $x - 2y = 0$. Give $x$.", 4, "Add the equations: $4x = 16$."), ["$x = 4$, $y = 2$."]),
    ex(2, num("leqx-ex-4", "How many integers satisfy $\\lvert x - 2\\rvert < 5$?", 9, "$-3 < x < 7$."), ["$-2, -1, \\dots, 6$: 9 integers."]),
    ex(2, num("leqx-ex-5", "For which $k$ does $2x + ky = 4$, $4x + 6y = 8$ have infinitely many solutions?", 3, "All ratios equal: $\\tfrac24 = \\tfrac k6 = \\tfrac48$."), ["$k = 3$."]),
    ex(3, num("leqx-ex-6", "Find the sum of all solutions of $\\lvert x + 1\\rvert + \\lvert x - 3\\rvert = 6$.", 2, "Solutions $-2$ and $4$."), ["$-2 + 4 = 2$."]),
    ex(3, num("leqx-ex-7", "Find the least value of $\\lvert x - 1\\rvert + \\lvert x - 5\\rvert$.", 4, "Distance between 1 and 5."), ["$4$, attained for every $x \\in [1, 5]$."]),
    ex(3, mc("leqx-ex-8", "Plan A costs ₹199 plus ₹2 per minute; plan B costs ₹399 flat. Plan A is cheaper exactly when the minutes $m$ satisfy", ["$m < 100$", "$199 + 2m < 399$."], [["$m > 100$", "That is when B is cheaper."], ["$m < 200$", "$200/2 = 100$."]]), ["Break-even at 100 minutes."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const x = r.int(-9, 12);
      const a = r.nonzero(-6, 8);
      let c = r.nonzero(-6, 8);
      if (c === a) c += 1;
      const b = r.int(-20, 20);
      const d = a * x + b - c * x;
      return n(`Solve $${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "-" : "+"} ${Math.abs(d)}$.`, x, `$(${a} - (${c}))x = ${d} - (${b})$, so $x = ${x}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const x = r.int(-6, 8);
      const y = r.int(-6, 8);
      const a1 = r.nonzero(-5, 5);
      const b1 = r.nonzero(-5, 5);
      let a2 = r.nonzero(-5, 5);
      const b2 = r.nonzero(-5, 5);
      if (a1 * b2 - a2 * b1 === 0) a2 += a2 > 0 ? 1 : -1;
      const want = r.pick(["x", "y"] as const);
      const t = (a: number, b: number) => `${a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}y`;
      return n(`Solve $${t(a1, b1)} = ${a1 * x + b1 * y}$ and $${t(a2, b2)} = ${a2 * x + b2 * y}$. Give $${want}$.`, want === "x" ? x : y, `Eliminate one variable: $x = ${x}$, $y = ${y}$.`);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const a = r.int(-5, 8);
      const b = r.int(2, 9);
      const strict = lv !== 3 || r.pick([true, false]);
      const count = strict ? 2 * b - 1 : 2 * b + 1;
      return n(`How many integers satisfy $\\lvert x ${a < 0 ? "+" : "-"} ${Math.abs(a)}\\rvert ${strict ? "<" : "\\le"} ${b}$?`, count, `$${a - b} ${strict ? "<" : "\\le"} x ${strict ? "<" : "\\le"} ${a + b}$: ${count} integers.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const k = r.pick([2, 3, 4, 5]);
      const c = k * r.int(1, 6);
      return mcNumbers(
        `Solve $-${k}x > ${c}$.`,
        { text: `$x < -${c / k}$`, why: `Divide by $-${k}$ and reverse the inequality.` },
        [
          { text: `$x > -${c / k}$`, why: "Dividing by a negative reverses the sign.", misconception: "inequality-no-flip" },
          { text: `$x < ${c / k}$`, why: `$${c}/(-${k}) = -${c / k}$.` },
        ],
      );
    },
  },
];
