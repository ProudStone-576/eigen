import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Joint, marginal and conditional distributions; conditional expectation and the tower rule. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const T = (rows: string[][]) => `\\begin{array}{c|ccc} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{array}`;

const base: ConceptNode = {
  id: "joint-distributions",
  title: "Joint & conditional distributions",
  summary: "A joint distribution gives P(X = x, Y = y) for every pair. Summing a row or column gives a marginal distribution; dividing by a marginal gives a conditional one. Averaging the conditional means E[Y | X] over X recovers E[Y].",
  deps: ["independence", "expectation"],
  pos: { x: 4, y: 1 },
  glossary: [
    { term: "joint distribution", meaning: "The probabilities of every combination of values of two (or more) random variables." },
    { term: "marginal distribution", meaning: "The distribution of one variable alone, found by summing the joint probabilities over the other." },
    { term: "conditional distribution", meaning: "The distribution of Y once X is known: P(Y = y | X = x) = P(x, y)/P(X = x)." },
  ],
  misconceptions: {
    "joint-as-conditional": "Reads a joint probability P(X = x, Y = y) as if it were the conditional P(Y = y | X = x).",
    "marginals-determine-joint": "Thinks the two marginal distributions fix the joint distribution, which is true only under independence.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two variables at once",
      body: "A shop records, for every customer, the number of items bought and whether they used a coupon. The question \"do coupon users buy more?\" isn't about either variable alone. It needs their joint distribution.",
      realWorld: {
        title: "Insurance",
        body: "An insurer prices a policy from the joint distribution of claim count and claim size. Treating them separately misses that drivers with many claims also tend to have the expensive ones.",
      },
    },
    {
      type: "truth",
      statement: "For discrete $X$ and $Y$, the **joint distribution** is $p(x, y) = P(X = x, Y = y)$, summing to 1. The **marginals** are $P(X = x) = \\sum_y p(x, y)$ and $P(Y = y) = \\sum_x p(x, y)$. The **conditional distribution** is $P(Y = y \\mid X = x) = \\dfrac{p(x, y)}{P(X = x)}$.",
      body: "$X$ and $Y$ are **independent** exactly when $p(x, y) = P(X = x)P(Y = y)$ for every cell; then every conditional distribution of $Y$ equals its marginal. The **conditional expectation** $E[Y \\mid X = x] = \\sum_y y\\,P(Y = y \\mid X = x)$ is the mean of $Y$ within the slice $X = x$.",
    },
    {
      type: "predict",
      misconception: "joint-as-conditional",
      item: {
        kind: "mc",
        id: "jd-predict-1",
        prompt: "Among customers, P(coupon and buys 3+ items) = 0.12 and P(coupon) = 0.3. What is P(buys 3+ items | coupon)?",
        options: [
          { id: "a", text: "0.4", correct: true, why: "$0.12/0.3$." },
          { id: "b", text: "0.12", misconception: "joint-as-conditional", why: "That is the share of *all* customers who used a coupon and bought 3+." },
          { id: "c", text: "0.036", why: "That multiplies instead of dividing." },
        ],
      },
      reveal: {
        body: "Out of 100 customers, 30 used a coupon and 12 of those bought 3 or more items. Among coupon users that is $12/30 = 0.4$. The joint probability 0.12 measures the same 12 customers against all 100.",
      },
      resolve: {
        kind: "mc",
        id: "jd-resolve-1",
        prompt: "How do you get a conditional probability from a joint table?",
        options: [
          { id: "a", text: "Divide the cell by the total of its row (or column)", correct: true, why: "Condition on that row: it becomes the whole population." },
          { id: "b", text: "Read the cell directly", misconception: "joint-as-conditional", why: "The cell is a share of everyone, not of the row." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "jd-check-1",
        prompt: "$P(X = 1) = 0.5$ and $P(Y = 1) = 0.5$ for two 0/1 variables. What is $P(X = 1, Y = 1)$?",
        options: [
          { id: "a", text: "It can be anything from 0 to 0.5", correct: true, why: "The marginals don't fix the joint unless the variables are independent." },
          { id: "b", text: "0.25", misconception: "marginals-determine-joint", why: "Only if $X$ and $Y$ are independent." },
          { id: "c", text: "0.5", why: "Only if $X$ and $Y$ are always equal." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "jd-check-2",
        prompt: "In a joint table, every row is a multiple of every other row. Then $X$ and $Y$ are",
        options: [
          { id: "a", text: "independent", correct: true, why: "Each row then gives the same conditional distribution of $Y$." },
          { id: "b", text: "perfectly correlated", why: "Proportional rows mean knowing $X$ tells you nothing about $Y$." },
          { id: "c", text: "impossible to judge", why: "Proportional rows are the test." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A classifier estimates the conditional distribution $P(Y \\mid X)$: the label given the features. A generative model such as naive Bayes estimates the joint $P(X, Y)$ and divides, which is Bayes' rule (§{bayes}) applied to a table.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "jd-produce-1", prompt: "$P(X = 0, Y = 0) = 0.1$, $P(X = 0, Y = 1) = 0.3$. Find $P(X = 0)$.", answer: 0.4, explain: "Sum the row." },
        { kind: "number", id: "jd-produce-2", prompt: "Same table. Find $P(Y = 1 \\mid X = 0)$.", answer: 0.75, explain: "$0.3/0.4$." },
        {
          kind: "mc",
          id: "jd-produce-3",
          prompt: "Two dice-like variables each have uniform marginals on 1 to 6. Their joint distribution",
          options: [
            { id: "a", text: "is not determined by the marginals", correct: true, why: "For example, $Y = X$ and independent $X, Y$ share these marginals." },
            { id: "b", text: "must give 1/36 to each pair", misconception: "marginals-determine-joint", why: "That is the independent case only." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "jd-review-1", prompt: "$P(X = 1, Y = 2) = 0.2$ and $P(X = 1) = 0.5$. Find $P(Y = 2 \\mid X = 1)$.", answer: 0.4, explain: "$0.2/0.5$." }],
};

const TAB = T([["", "Y = 0", "Y = 1", "Y = 2"], ["X = 0", "0.1", "0.2", "0.1"], ["X = 1", "0.2", "0.1", "0.3"]]);

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "joint density",
      body: "For continuous $X$ and $Y$, a **joint density** $f(x, y) \\ge 0$ with total volume 1 gives $P((X, Y) \\in R) = \\iint_R f(x, y)\\,dx\\,dy$. Marginals integrate out the other variable: $f_X(x) = \\int f(x, y)\\,dy$.",
    },
    {
      type: "definition",
      term: "conditional expectation as a random variable",
      body: "$E[Y \\mid X]$ is the function $g(X)$ with $g(x) = E[Y \\mid X = x]$: a random variable that predicts $Y$ from $X$. $E[g(X, Y)] = \\sum_{x, y} g(x, y)\\,p(x, y)$ for any function $g$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "law of total expectation",
      statement: "$E[Y] = E\\big[E[Y \\mid X]\\big] = \\sum_x E[Y \\mid X = x]\\,P(X = x)$.",
      proof: [
        "$\\sum_x P(X = x)\\sum_y y\\dfrac{p(x, y)}{P(X = x)} = \\sum_y y\\sum_x p(x, y) = \\sum_y y\\,P(Y = y)$.",
        "The conditional means, weighted by how often each slice occurs, average back to the overall mean.",
      ],
    },
    {
      type: "theorem",
      name: "law of total variance",
      statement: "$\\operatorname{Var}(Y) = E\\big[\\operatorname{Var}(Y \\mid X)\\big] + \\operatorname{Var}\\big(E[Y \\mid X]\\big)$: spread within slices plus spread between slice means.",
      proof: [
        "Write $Y - \\mu = (Y - E[Y \\mid X]) + (E[Y \\mid X] - \\mu)$ and square.",
        "The cross term has expectation 0 by the tower rule, leaving the two terms. This split is the basis of analysis of variance.",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "checking independence",
      statement: "$X$ and $Y$ are independent if and only if every cell of the joint table equals the product of its row and column totals. One failing cell is enough to show dependence.",
      proof: ["This is the definition of independence for every pair of events $\\{X = x\\}$ and $\\{Y = y\\}$ (§{independence})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: `The joint distribution is $${TAB}$. Find the marginals.`,
      solution: ["Rows: $P(X = 0) = 0.4$, $P(X = 1) = 0.6$.", "Columns: $P(Y = 0) = 0.3$, $P(Y = 1) = 0.3$, $P(Y = 2) = 0.4$."],
      result: "$X$: 0.4, 0.6. $Y$: 0.3, 0.3, 0.4.",
    },
    {
      type: "example",
      level: 2,
      title: "conditionals and independence",
      problem: "Same table. Find the distribution of $Y$ given $X = 1$, and decide whether $X$ and $Y$ are independent.",
      solution: ["Divide row $X = 1$ by 0.6: $P(Y = y \\mid X = 1) = \\tfrac13, \\tfrac16, \\tfrac12$.", "$P(X = 0, Y = 0) = 0.1$ but $P(X = 0)P(Y = 0) = 0.12$: dependent."],
      result: "$(\\tfrac13, \\tfrac16, \\tfrac12)$; dependent.",
    },
    {
      type: "example",
      level: 3,
      title: "the tower rule",
      problem: "Same table. Find $E[Y \\mid X = 0]$, $E[Y \\mid X = 1]$ and check that their weighted average is $E[Y]$.",
      solution: [
        "$E[Y \\mid X = 0] = \\dfrac{0(0.1) + 1(0.2) + 2(0.1)}{0.4} = 1$. $E[Y \\mid X = 1] = \\dfrac{0.1 + 0.6}{0.6} = \\tfrac76$.",
        "$0.4 \\times 1 + 0.6 \\times \\tfrac76 = 0.4 + 0.7 = 1.1$, and directly $E[Y] = 0.3 + 0.8 = 1.1$.",
      ],
      result: "$1$ and $\\tfrac76$; both routes give $E[Y] = 1.1$.",
    },
  ],
  pitfalls: [
    { wrong: "Read $P(Y = y \\mid X = x)$ straight off a joint table.", right: "Divide the cell by its row total $P(X = x)$." },
    { wrong: "The marginals determine the joint distribution.", right: "Only under independence. Many joints share the same marginals." },
    { wrong: "$E[Y \\mid X]$ is a number.", right: "It is a function of $X$, hence a random variable; $E[Y \\mid X = x]$ is a number." },
  ],
  formulas: [
    { label: "Marginal", tex: "P(X = x) = \\textstyle\\sum_y p(x, y)" },
    { label: "Conditional", tex: "P(Y = y \\mid X = x) = \\dfrac{p(x, y)}{P(X = x)}" },
    { label: "Tower rule", tex: "E[Y] = E\\big[E[Y \\mid X]\\big]" },
    { label: "Total variance", tex: "\\operatorname{Var}Y = E[\\operatorname{Var}(Y \\mid X)] + \\operatorname{Var}(E[Y \\mid X])" },
  ],
  exercises: [
    ex(1, num("jdx-ex-1", `Joint table $${TAB}$. Find $P(Y = 2)$.`, 0.4, "Column sum."), ["$0.1 + 0.3 = 0.4$."]),
    ex(1, num("jdx-ex-2", "Same table. Find $P(X = 1, Y \\ge 1)$.", 0.4, "Add two cells."), ["$0.1 + 0.3 = 0.4$."]),
    ex(2, fr("jdx-ex-3", "Same table. Find $P(X = 0 \\mid Y = 1)$.", 2 / 3, "Divide by the column total 0.3."), ["$0.2/0.3 = \\tfrac23$."]),
    ex(2, fr("jdx-ex-4", "Same table. Find $E[Y \\mid X = 1]$.", 7 / 6, "Divide row $X = 1$ by 0.6."), ["$\\dfrac{0 + 0.1 + 0.6}{0.6} = \\tfrac76$."]),
    ex(2, num("jdx-ex-5", "Same table. Find $E[XY]$.", 0.7, "Only $X = 1$ cells count."), ["$1 \\cdot 1 \\cdot 0.1 + 1 \\cdot 2 \\cdot 0.3 = 0.7$."]),
    ex(3, fr("jdx-ex-6", "Same table. Find $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$.", 0.7 - 0.6 * 1.1, "$E[X] = 0.6$, $E[Y] = 1.1$."), ["$0.7 - 0.6 \\times 1.1 = 0.04$."]),
    ex(3, num("jdx-ex-7", "A die is rolled; if it shows $k$, a coin is tossed $k$ times. Find the expected number of heads.", 1.75, "Tower rule."), ["$E[H \\mid K = k] = k/2$, so $E[H] = E[K]/2 = 3.5/2 = 1.75$."]),
    ex(3, num("jdx-ex-8", "Within each of two equally likely groups, $Y$ has variance 4. The group means are 10 and 14. Find $\\operatorname{Var}(Y)$.", 8, "Within plus between."), ["$E[\\operatorname{Var}(Y \\mid X)] = 4$ and $\\operatorname{Var}(E[Y \\mid X]) = 4$ (means $\\pm 2$ about 12): total 8."]),
    ex(3, mc("jdx-ex-9", "$X$ and $Y$ are 0/1 with $P(X = 1) = P(Y = 1) = 0.5$ and $P(X = 1, Y = 1) = 0.4$. They are", ["dependent, positively associated", "$0.4 > 0.5 \\times 0.5$."], [["independent", "Independence needs 0.25."], ["impossible: the probabilities are inconsistent", "0.4 is between 0 and 0.5, so it is consistent."]]), ["$P(Y = 1 \\mid X = 1) = 0.8 > 0.5$: knowing $X = 1$ makes $Y = 1$ more likely."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

/** A random 2 × 3 joint table in tenths/twentieths that sums to 1. */
function table(r: { int: (a: number, b: number) => number }, lv: number) {
  const d = lv === 1 ? 10 : 20;
  for (;;) {
    const cells = Array.from({ length: 5 }, () => r.int(1, lv === 1 ? 3 : 5));
    const last = d - cells.reduce((s, x) => s + x, 0);
    if (last >= 1) return [...cells, last].map((c) => c / d);
  }
}
const fmt = (x: number) => String(r2(x * 100) / 100);
const show = (p: number[]) => T([["", "Y = 0", "Y = 1", "Y = 2"], ["X = 0", ...p.slice(0, 3).map(fmt)], ["X = 1", ...p.slice(3).map(fmt)]]);

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const p = table(r, lv);
      const x = r.int(0, 1);
      const y = r.int(0, 2);
      const row = p.slice(3 * x, 3 * x + 3).reduce((s, v) => s + v, 0);
      const c = p[3 * x + y] / row;
      return n(`Joint distribution: $${show(p)}$. Find $P(Y = ${y} \\mid X = ${x})$ (3 decimals).`, Math.round(c * 1000) / 1000, `$${fmt(p[3 * x + y])}/${fmt(row)} \\approx ${Math.round(c * 1000) / 1000}$: divide the cell by its row total.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const p = table(r, lv);
      const ey = [0, 1, 2].reduce((s, y) => s + y * (p[y] + p[3 + y]), 0);
      return n(`Joint distribution: $${show(p)}$. Find $E[Y]$.`, r2(ey), `Column totals ${[0, 1, 2].map((y) => fmt(p[y] + p[3 + y])).join(", ")}; $E[Y] = ${r2(ey)}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r, lv) => {
      const p = table(r, lv);
      const x = r.int(0, 1);
      const y = r.int(0, 2);
      const row = p.slice(3 * x, 3 * x + 3).reduce((s, v) => s + v, 0);
      return mcNumbers(
        `Joint distribution: $${show(p)}$. Which is $P(Y = ${y} \\mid X = ${x})$?`,
        { text: String(Math.round((p[3 * x + y] / row) * 1000) / 1000), why: "Divide the cell by its row total." },
        [
          { text: String(r2(p[3 * x + y] * 100) / 100), why: "That is the joint probability, a share of everyone.", misconception: "joint-as-conditional" },
          { text: String(Math.round(row * 1000) / 1000), why: "That is the row total $P(X = " + x + ")$." },
        ],
      );
    },
  },
];
