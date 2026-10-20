import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Statistical decision theory: loss functions and risk, admissibility and Stein's paradox, Bayes rules and Bayes risk, minimax estimation. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "decision-theory",
  title: "Decision theory",
  summary: "Decision theory treats estimation and testing as choosing an action under uncertainty. A loss function says how bad each action is for each true parameter; the risk averages the loss over the data. Rules can be compared by their risk functions: admissible rules can't be beaten everywhere, Bayes rules minimise average risk under a prior, and minimax rules minimise the worst case.",
  deps: ["sufficiency", "bayesian-inference", "estimator-properties"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "loss function", meaning: "$L(\\theta, a)$: the cost of taking action $a$ when the truth is $\\theta$." },
    { term: "risk", meaning: "$R(\\theta, \\delta) = E_\\theta[L(\\theta, \\delta(X))]$: a rule's expected loss at each $\\theta$; for squared error, its MSE." },
    { term: "admissible", meaning: "A rule that no other rule beats for every $\\theta$ (no worse anywhere and better somewhere)." },
  ],
  misconceptions: {
    "admissible-means-good": "Thinks an admissible rule must be a good rule.",
    "mean-always-admissible": "Thinks the sample mean is always admissible for estimating a mean.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which mistakes cost what?",
      body: "Overestimating a drug dose is dangerous; underestimating it just delays recovery. Forecasting too little stock loses sales; too much ties up cash. Different costs for different errors should change which estimate is \"best\". Decision theory makes the costs explicit and asks which rule does best on average, or in the worst case.",
      realWorld: {
        title: "Stein's shock",
        body: "In 1956 Charles Stein proved that when estimating three or more means at once, the obvious estimator (each sample mean) can be beaten everywhere by shrinking all of them towards a common point, even for unrelated quantities. Shrinkage estimators, empirical Bayes and much of modern regularisation grew from it.",
      },
    },
    {
      type: "truth",
      statement: "For a rule $\\delta$, the **risk** is $R(\\theta, \\delta) = E_\\theta[L(\\theta, \\delta(X))]$. $\\delta$ is **inadmissible** if some $\\delta'$ has $R(\\theta, \\delta') \\le R(\\theta, \\delta)$ for all $\\theta$, with strict inequality for some. The **Bayes rule** for a prior $\\pi$ minimises the average risk $\\int R(\\theta, \\delta)\\pi(\\theta)\\,d\\theta$; it is found by minimising the posterior expected loss for each $x$: squared error gives the **posterior mean**, absolute error the **posterior median**, 0–1 loss the **posterior mode** (§{bayesian-inference}). A **minimax** rule minimises $\\max_\\theta R(\\theta, \\delta)$.",
      body: "Risk functions usually cross, so no rule is best for every $\\theta$; the criteria pick one. Bayes rules with proper priors are typically admissible; a Bayes rule with constant risk is minimax. Admissibility is a weak requirement: the silly rule \"always guess 5\" is admissible, because nothing beats it at $\\theta = 5$. **Stein's paradox**: for $\\vec X \\sim N(\\vec\\theta, I_p)$ with $p \\ge 3$, $\\vec X$ itself is inadmissible under squared error; the **James–Stein** estimator $\\left(1 - \\dfrac{p - 2}{\\lvert\\vec X\\rvert^2}\\right)\\vec X$ has lower risk for every $\\vec\\theta$.",
    },
    {
      type: "predict",
      misconception: "admissible-means-good",
      item: {
        kind: "mc",
        id: "dth-predict-1",
        prompt: "To estimate a normal mean $\\theta$, one rule ignores the data and always answers 5. Is it admissible under squared error?",
        options: [
          { id: "a", text: "Yes: no rule matches its zero risk at $\\theta = 5$, though it is terrible elsewhere", correct: true, why: "Admissibility only rules out being beaten everywhere." },
          { id: "b", text: "No: an admissible rule must be a good rule", misconception: "admissible-means-good", why: "Admissible is a minimal requirement, not a seal of quality." },
          { id: "c", text: "No, since it ignores the data", why: "Ignoring data doesn't make it dominated." },
        ],
      },
      reveal: {
        body: "At $\\theta = 5$ the constant rule has risk 0. Any rule that beat it everywhere would need risk 0 at $\\theta = 5$ too, which (for continuous data) means always answering 5. So nothing dominates it. Its risk $(\\theta - 5)^2$ is huge elsewhere. Admissibility rules out clearly wasteful rules; choosing among admissible ones needs a further criterion (Bayes, minimax).",
      },
      resolve: {
        kind: "mc",
        id: "dth-resolve-1",
        prompt: "An estimator is admissible. This means",
        options: [
          { id: "a", text: "no other estimator is at least as good everywhere and better somewhere", correct: true, why: "That is the definition." },
          { id: "b", text: "it is a good estimator to use", misconception: "admissible-means-good", why: "Constant guesses are admissible." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dth-check-1",
        prompt: "You estimate the mean batting averages of 10 players at once from early-season data. Using each player's own average is",
        options: [
          { id: "a", text: "beaten in total squared error by shrinking all of them towards the overall mean (James–Stein)", correct: true, why: "With $p \\ge 3$, the separate means are inadmissible." },
          { id: "b", text: "optimal, because each sample mean is admissible", misconception: "mean-always-admissible", why: "That holds for one or two means, not three or more together." },
          { id: "c", text: "impossible to improve without more data", why: "Shrinkage improves it with the same data." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dth-check-2",
        prompt: "Under absolute-error loss, the Bayes estimate is the posterior",
        options: [
          { id: "a", text: "median", correct: true, why: "The median minimises expected absolute deviation." },
          { id: "b", text: "mean", why: "That is for squared error." },
          { id: "c", text: "mode", why: "That is for 0–1 loss." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training a model is choosing a decision rule by minimising empirical risk under a chosen loss; the loss should match the real costs (pinball for quantiles, asymmetric costs for stock-outs). Ridge regression and empirical Bayes are Stein-type shrinkage, trading a little bias for a large cut in variance.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dth-produce-1", prompt: "$X \\sim N(\\theta, 1)$, rule $\\delta = 0.5X$. Its risk is $0.25 + 0.25\\theta^2$. Find it at $\\theta = 3$.", answer: 2.5, explain: "$0.25 + 2.25$." },
        { kind: "number", id: "dth-produce-2", prompt: "James–Stein with $p = 5$ and $\\lvert\\vec X\\rvert^2 = 10$. Find the shrinkage factor $1 - (p - 2)/\\lvert\\vec X\\rvert^2$.", answer: 0.7, explain: "$1 - 3/10$." },
        {
          kind: "mc",
          id: "dth-produce-3",
          prompt: "A forecaster always predicts tomorrow's temperature as 25°C. Under squared error this rule is",
          options: [
            { id: "a", text: "admissible but poor except near 25°C", correct: true, why: "Nothing beats it when the truth is 25°C." },
            { id: "b", text: "inadmissible, because it is clearly bad", misconception: "admissible-means-good", why: "Being bad isn't the same as being dominated." },
          ],
        },
        {
          kind: "mc",
          id: "dth-produce-4",
          prompt: "Estimating 20 school means at once from noisy test data, the separate sample means are",
          options: [
            { id: "a", text: "inadmissible: shrinkage towards a common mean lowers total risk", correct: true, why: "Stein's result for $p \\ge 3$." },
            { id: "b", text: "admissible, as the sample mean always is", misconception: "mean-always-admissible", why: "Not when three or more are estimated together." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dth-review-1", prompt: "$X \\sim N(\\theta, 1)$. Find the risk of $\\delta = X$ under squared error.", answer: 1, explain: "$\\operatorname{Var}(X)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "Bayes risk",
      body: "For prior $\\pi$, the **Bayes risk** of $\\delta$ is $r(\\pi, \\delta) = \\int R(\\theta, \\delta)\\pi(\\theta)\\,d\\theta$, equivalently $E[L(\\theta, \\delta(X))]$ over the joint distribution of $\\theta$ and $X$. Swapping the order, it is the average over $x$ of the posterior expected loss, which is why minimising the posterior expected loss at each $x$ gives the Bayes rule.",
    },
    {
      type: "definition",
      term: "minimax for a proportion",
      body: "For $X \\sim \\text{Bin}(n, p)$ under squared error, $\\hat p = X/n$ has risk $p(1 - p)/n$, worst at $p = \\tfrac12$. The estimator $\\delta = \\dfrac{X + \\sqrt n/2}{n + \\sqrt n}$, the Bayes rule for a Beta$(\\tfrac{\\sqrt n}{2}, \\tfrac{\\sqrt n}{2})$ prior, has constant risk $\\dfrac{n}{4(n + \\sqrt n)^2}$, so it is minimax.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "Bayes estimates under common losses",
      statement: "The posterior expected loss is minimised by the posterior mean for squared error, the posterior median for absolute error, and the posterior mode for 0–1 loss (in the limit of a narrow window).",
      proof: ["$E[(\\theta - a)^2 \\mid x]$ is a quadratic in $a$ with minimum at $E[\\theta \\mid x]$; $E\\lvert\\theta - a\\rvert$ has derivative $P(\\theta < a) - P(\\theta > a)$, zero at the median."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "constant-risk Bayes rules are minimax",
      statement: "If $\\delta$ is Bayes for some prior and has constant risk $c$, then $\\delta$ is minimax.",
      proof: ["Any $\\delta'$ has $\\max_\\theta R(\\theta, \\delta') \\ge r(\\pi, \\delta') \\ge r(\\pi, \\delta) = c = \\max_\\theta R(\\theta, \\delta)$."],
    },
    {
      type: "theorem",
      name: "Stein's paradox",
      statement: "For $\\vec X \\sim N(\\vec\\theta, I_p)$ with $p \\ge 3$, the James–Stein estimator has risk $p - (p - 2)^2E[1/\\lvert\\vec X\\rvert^2] < p$ for every $\\vec\\theta$, while $\\vec X$ has risk $p$.",
      proof: ["Stein's lemma $E[(X_i - \\theta_i)g(\\vec X)] = E[\\partial g/\\partial X_i]$ gives the risk formula; $E[1/\\lvert\\vec X\\rvert^2]$ is finite and positive when $p \\ge 3$."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "crossing risk functions",
      problem: "$X \\sim N(\\theta, 1)$. Compare the risks of $\\delta_1 = X$ and $\\delta_2 = 0.5X$ at $\\theta = 1$ and $\\theta = 3$.",
      solution: ["$R(\\theta, \\delta_1) = 1$. $R(\\theta, \\delta_2) = 0.25 + 0.25\\theta^2$: $0.5$ at $\\theta = 1$ and $2.5$ at $\\theta = 3$.", "$\\delta_2$ wins near 0, $\\delta_1$ far from 0: neither dominates."],
      result: "Risks cross at $\\theta^2 = 3$.",
    },
    {
      type: "example",
      level: 2,
      title: "a minimax proportion",
      problem: "$n = 4$ trials, $X = 3$ successes. Find the minimax estimate and its constant risk.",
      solution: ["$\\delta = \\dfrac{3 + 1}{4 + 2} = \\tfrac23$ (since $\\sqrt 4/2 = 1$).", "Risk $\\dfrac{4}{4 \\times 36} = \\tfrac1{36}$, against $\\hat p$'s worst case $\\tfrac{1}{16}$."],
      result: "$\\tfrac23$; risk $\\tfrac1{36}$.",
    },
    {
      type: "example",
      level: 3,
      title: "James–Stein",
      problem: "$p = 5$ observed means $\\vec X = (2, -1, 1, 2, 0)$, each $N(\\theta_i, 1)$. Find the James–Stein estimate.",
      solution: ["$\\lvert\\vec X\\rvert^2 = 4 + 1 + 1 + 4 + 0 = 10$; factor $1 - 3/10 = 0.7$.", "Estimate $(1.4, -0.7, 0.7, 1.4, 0)$."],
      result: "Each mean shrunk by 30% towards 0.",
    },
  ],
  pitfalls: [
    { wrong: "Admissible means good.", right: "It only means not dominated; constant guesses are admissible." },
    { wrong: "The sample mean is always admissible.", right: "For three or more means estimated together, shrinkage dominates it." },
    { wrong: "Use squared error whatever the costs.", right: "Choose the loss to match the real consequences." },
  ],
  formulas: [
    { label: "Risk", tex: "R(\\theta, \\delta) = E_\\theta[L(\\theta, \\delta(X))]" },
    { label: "Bayes risk", tex: "r(\\pi, \\delta) = \\int R(\\theta, \\delta)\\pi(\\theta)\\,d\\theta" },
    { label: "Minimax", tex: "\\min_\\delta\\max_\\theta R(\\theta, \\delta)" },
    { label: "James–Stein", tex: "\\left(1 - \\tfrac{p - 2}{\\lvert\\vec X\\rvert^2}\\right)\\vec X" },
  ],
  exercises: [
    ex(1, num("dthx-ex-1", "$X \\sim N(\\theta, 4)$. Find the squared-error risk of $\\delta = X$.", 4, "Its variance."), ["$4$."]),
    ex(1, num("dthx-ex-2", "The constant rule $\\delta = 5$ under squared error. Find its risk at $\\theta = 8$.", 9, "$(8 - 5)^2$."), ["$9$."]),
    ex(2, num("dthx-ex-3", "$X \\sim N(\\theta, 1)$, $\\delta = cX$ has risk $c^2 + (1 - c)^2\\theta^2$. Find it for $c = 0.8$ at $\\theta = 2$.", 0.8, "$0.64 + 0.16$."), ["$0.8$."]),
    ex(2, fr("dthx-ex-4", "Binomial $n = 9$, $X = 6$. Find the minimax estimate $\\dfrac{X + \\sqrt n/2}{n + \\sqrt n}$.", 7.5 / 12, "$\\sqrt9/2 = 1.5$."), ["$7.5/12 = 0.625$."]),
    ex(2, num("dthx-ex-5", "James–Stein with $p = 4$ and $\\lvert\\vec X\\rvert^2 = 8$. Find the shrinkage factor.", 0.75, "$1 - 2/8$."), ["$0.75$."]),
    ex(3, fr("dthx-ex-6", "Find the constant risk of the minimax binomial estimator for $n = 9$.", 9 / (4 * 144), "$n/(4(n + \\sqrt n)^2)$."), ["$9/576 \\approx 0.0156$, against $\\hat p$'s worst $1/36 \\approx 0.0278$."]),
    ex(3, mc("dthx-ex-7", "A posterior for $\\theta$ is skewed with mean 12, median 10 and mode 8. Under absolute-error loss, estimate", ["10", "The posterior median."], [["12", "That is for squared error."], ["8", "That is for 0–1 loss."]]), ["Different losses, different Bayes estimates."]),
    ex(3, mc("dthx-ex-8", "Running short of stock costs 4 times as much per unit as overstocking. The Bayes order quantity is the posterior demand's", ["0.8 quantile", "Minimise expected asymmetric linear loss: $4/(4 + 1)$."], [["mean", "That is for squared error."], ["median", "That is for symmetric absolute loss."]]), ["The newsvendor solution."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const c = r.pick([0.25, 0.5, 0.6, 0.75, 0.8, 0.9]);
      const th = r.int(-4, 4);
      const v = c * c + (1 - c) ** 2 * th * th;
      return n(`$X \\sim N(\\theta, 1)$. Find the squared-error risk of $\\delta = ${c}X$ at $\\theta = ${th}$ (4 decimals).`, Math.round(v * 10000) / 10000, `$c^2 + (1 - c)^2\\theta^2 = ${Math.round(c * c * 10000) / 10000} + ${Math.round((1 - c) ** 2 * 10000) / 10000} \\times ${th * th} \\approx ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const p = r.int(3, 10);
      const xs = Array.from({ length: p }, () => r.int(-3, 3));
      if (!xs.some((x) => x !== 0)) xs[0] = 2;
      const s = xs.reduce((a, x) => a + x * x, 0);
      const f = 1 - (p - 2) / s;
      return n(`James–Stein with $p = ${p}$ observed means ${xs.join(", ")} (each with variance 1). Find the shrinkage factor $1 - (p - 2)/\\lvert\\vec X\\rvert^2$ (3 decimals).`, Math.round(f * 1000) / 1000, `$\\lvert\\vec X\\rvert^2 = ${s}$; $1 - ${p - 2}/${s} \\approx ${Math.round(f * 1000) / 1000}$${f < 0 ? " (the positive-part version would use 0)" : ""}.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const cu = r.pick([1, 2, 3, 4, 9]);
      const co = r.pick([1, 2, 3]);
      const q = cu / (cu + co);
      return n(`Under-stocking costs ${cu} per unit and over-stocking ${co}. Which quantile of the demand distribution should be ordered (3 decimals)?`, Math.round(q * 1000) / 1000, `$${cu}/(${cu} + ${co}) \\approx ${Math.round(q * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.pick([5, 10, 20, 50]);
      return mcNumbers(
        `${p} unrelated means are estimated together, each by its own sample mean. Under total squared error, these estimates are`,
        { text: "inadmissible: James–Stein shrinkage does better for every true value", why: "Stein's paradox for $p \\ge 3$." },
        [{ text: "admissible, as sample means always are", why: "Not for three or more at once.", misconception: "mean-always-admissible" }],
      );
    },
  },
];
