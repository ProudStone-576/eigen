import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Hierarchical (multilevel) models: partial pooling, shrinkage weights, empirical Bayes, random intercepts, longitudinal and panel data. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const shrink = (ybar: number, mu: number, tau2: number, s2: number, nj: number) => {
  const w = tau2 / (tau2 + s2 / nj);
  return { w, est: w * ybar + (1 - w) * mu };
};

const base: ConceptNode = {
  id: "hierarchical-models",
  title: "Hierarchical models & shrinkage",
  summary: "When data come in groups (schools, hospitals, players), a hierarchical model gives each group its own parameter but lets those parameters share a common distribution. Each group's estimate is pulled towards the overall mean, most strongly for small, noisy groups: partial pooling, between treating every group alone and lumping them all together.",
  deps: ["conjugate-priors", "rank-correlation"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "partial pooling", meaning: "Estimating each group from its own data and from the other groups, weighted by how reliable each source is." },
    { term: "shrinkage", meaning: "Pulling noisy group estimates towards the overall mean." },
    { term: "random effect", meaning: "A group-level parameter treated as a draw from a population distribution, such as each school's own intercept." },
  ],
  misconceptions: {
    "no-pooling-best": "Thinks each group's own sample mean is always the best estimate for that group.",
    "complete-pooling": "Pools every group into one overall mean, ignoring real differences between groups.",
  },
  steps: [
    {
      type: "motivate",
      title: "The small-hospital problem",
      body: "Hospital A treated 3 patients and all 3 survived: 100%. Hospital B treated 3,000 with 94% survival. Is A the best hospital? Small groups produce extreme rates by chance. A hierarchical model trusts A's 100% only a little and B's 94% a lot.",
      realWorld: {
        title: "Batting averages",
        body: "Early in a cricket or baseball season, players' averages are noisy. Efron and Morris showed in 1975 that shrinking each player's early average towards the league average predicted the rest of the season far better than the players' own averages.",
      },
    },
    {
      type: "truth",
      statement: "Model group means $\\theta_j \\sim N(\\mu, \\tau^2)$ and observations within group $j$ as $N(\\theta_j, \\sigma^2)$. Given $\\mu$, $\\tau^2$ and $\\sigma^2$, the estimate of group $j$ with $n_j$ observations and mean $\\bar y_j$ is $\\hat\\theta_j = w_j\\bar y_j + (1 - w_j)\\mu$, with $w_j = \\dfrac{\\tau^2}{\\tau^2 + \\sigma^2/n_j}$.",
      body: "$w_j$ is near 1 for large groups (trust the group) and small for small groups (trust the population). **No pooling** ($w = 1$) overfits small groups; **complete pooling** ($w = 0$) ignores real differences; the hierarchical model chooses $w$ from the data. **Empirical Bayes** estimates $\\mu$ and $\\tau^2$ from all the groups and plugs them in.",
    },
    {
      type: "predict",
      misconception: "no-pooling-best",
      item: {
        kind: "mc",
        id: "hie-predict-1",
        prompt: "Schools' true mean scores vary with SD 2 around 70; pupils vary with SD 10 within a school. A school tests 4 pupils averaging 80. The best estimate of that school's mean is about",
        options: [
          { id: "a", text: "About 71.4: the 4-pupil average is very noisy", correct: true, why: "$w = 4/(4 + 100/4) \\approx 0.14$." },
          { id: "b", text: "80: the school's own average", misconception: "no-pooling-best", why: "Four pupils give an SE of 5, far more than the SD of 2 between schools." },
          { id: "c", text: "70: ignore the school's data", why: "The data still carry some information." },
        ],
      },
      reveal: {
        body: "$\\tau^2 = 4$ and $\\sigma^2/n_j = 100/4 = 25$, so $w = 4/29 \\approx 0.14$ and $\\hat\\theta \\approx 0.14 \\times 80 + 0.86 \\times 70 \\approx 71.4$. A school 10 points above average from only four pupils is far more likely to be an ordinary school having a lucky test than a truly exceptional one, and shrinkage says so.",
      },
      resolve: {
        kind: "mc",
        id: "hie-resolve-1",
        prompt: "Why shrink a small group's mean towards the overall mean?",
        options: [
          { id: "a", text: "Its own mean is noisy; borrowing strength from other groups reduces the error", correct: true, why: "Lower mean squared error overall." },
          { id: "b", text: "There's no reason: a group's own mean is always best", misconception: "no-pooling-best", why: "Unshrunk small-group means are the most extreme and least reliable." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hie-check-1",
        prompt: "Hospital survival rates genuinely differ by region. Estimating every hospital by the national rate",
        options: [
          { id: "a", text: "ignores real differences: complete pooling under-fits", correct: true, why: "Large hospitals' own data should count." },
          { id: "b", text: "is best, because it uses all the data", misconception: "complete-pooling", why: "It throws away the information each hospital carries." },
          { id: "c", text: "is a hierarchical model", why: "That would weight each hospital's own data too." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "hie-check-2",
        prompt: "In a hierarchical model, which groups' estimates are shrunk most?",
        options: [
          { id: "a", text: "Small groups", correct: true, why: "$w_j$ falls as $n_j$ falls." },
          { id: "b", text: "Large groups", why: "Their own data are most reliable." },
          { id: "c", text: "All equally", why: "The weight depends on $n_j$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Target encoding of high-cardinality categories (city, product ID) shrinks each category's mean outcome towards the global mean, so rare categories don't get extreme, overfitted values. Recommender systems shrink new users' and new items' ratings towards global averages for the same reason.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "hie-produce-1", prompt: "$\\tau^2 = 4$, $\\sigma^2 = 16$ and $n_j = 4$. Find the shrinkage weight $w_j$.", answer: 0.5, explain: "$4/(4 + 4)$." },
        { kind: "number", id: "hie-produce-2", prompt: "Same weight, group mean 80, overall mean 70. Find the shrunk estimate.", answer: 75, explain: "$0.5 \\times 80 + 0.5 \\times 70$." },
        {
          kind: "mc",
          id: "hie-produce-3",
          prompt: "Estimating each of 50 school means by its own pupils' average alone",
          options: [
            { id: "a", text: "overfits small schools, giving them the most extreme estimates", correct: true, why: "No pooling ignores how noisy small groups are." },
            { id: "b", text: "is always best", misconception: "no-pooling-best", why: "Partial pooling has lower total error." },
          ],
        },
        {
          kind: "mc",
          id: "hie-produce-4",
          prompt: "Using one overall mean for every school, when schools truly differ,",
          options: [
            { id: "a", text: "under-fits, ignoring real differences", correct: true, why: "Large schools' data are reliable and should count." },
            { id: "b", text: "is the most accurate choice", misconception: "complete-pooling", why: "It discards each school's information." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "hie-review-1", prompt: "$\\tau^2 = 9$, $\\sigma^2 = 36$ and $n_j = 4$. Find $w_j$.", answer: 0.5, explain: "$9/(9 + 9)$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "multilevel regression",
      body: "A **random-intercept** model writes $y_{ij} = \\beta_0 + u_j + \\beta_1x_{ij} + \\varepsilon_{ij}$ with $u_j \\sim N(0, \\tau^2)$: each group has its own baseline. **Random slopes** let $\\beta_1$ vary by group too. The **intraclass correlation** $\\tau^2/(\\tau^2 + \\sigma^2)$ (§{rank-correlation}) says how much of the variation lies between groups.",
    },
    {
      type: "definition",
      term: "longitudinal and panel data",
      body: "Repeated measurements on the same units over time are grouped data, with the unit as the group: **longitudinal** or **panel** data. Random effects per unit capture stable differences between units; **fixed effects** models instead give every unit its own dummy, removing all stable unit-level confounding.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the shrinkage estimate",
      statement: "With $\\theta_j \\sim N(\\mu, \\tau^2)$ and $\\bar y_j \\mid \\theta_j \\sim N(\\theta_j, \\sigma^2/n_j)$, the posterior mean of $\\theta_j$ is $w_j\\bar y_j + (1 - w_j)\\mu$ with $w_j = \\dfrac{\\tau^2}{\\tau^2 + \\sigma^2/n_j}$.",
      proof: ["This is normal–normal conjugacy (§{conjugate-priors}) with prior $N(\\mu, \\tau^2)$ and one observation $\\bar y_j$ of variance $\\sigma^2/n_j$: the precisions are $1/\\tau^2$ and $n_j/\\sigma^2$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Stein's paradox",
      statement: "For three or more normal means estimated together, the James–Stein estimator, which shrinks every estimate towards a common value, has lower total mean squared error than the separate sample means, whatever the true means are.",
      proof: ["Shrinking adds a little bias to each estimate but removes more variance in total (§{estimator-properties}); with three or more means the trade always pays off. The proof (Stein, 1956) is beyond this book."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "empirical Bayes",
      statement: "Estimate the population parameters from all the groups (for example $\\hat\\mu$ = mean of group means and $\\hat\\tau^2$ from their spread beyond what sampling noise explains), then shrink each group with them.",
      proof: ["The spread of the observed group means is $\\tau^2 + \\sigma^2/n$ on average, so subtracting the sampling part estimates $\\tau^2$ (setting it to 0 if negative)."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "$\\tau^2 = 4$, $\\sigma^2 = 16$, overall mean 70. Group A has 4 members averaging 80; group B has 64 averaging 80. Shrink both.",
      solution: ["A: $\\sigma^2/n = 4$, $w = 0.5$, estimate 75.", "B: $\\sigma^2/n = 0.25$, $w = 4/4.25 \\approx 0.94$, estimate about 79.4."],
      result: "75 and about 79.4.",
    },
    {
      type: "example",
      level: 2,
      title: "estimating τ²",
      problem: "Ten groups of 25 have means whose variance is 6; within-group variance is $\\sigma^2 = 50$. Estimate $\\tau^2$.",
      solution: ["Sampling noise in a group mean: $\\sigma^2/n = 2$.", "$\\hat\\tau^2 = 6 - 2 = 4$."],
      result: "$\\hat\\tau^2 = 4$.",
    },
  ],
  pitfalls: [
    { wrong: "Each group's own mean is its best estimate.", right: "For small groups, shrinking towards the overall mean lowers the error." },
    { wrong: "One overall mean for every group is safest.", right: "It ignores real differences; let the data choose the pooling." },
    { wrong: "Shrinkage is cheating because it biases estimates.", right: "It trades a little bias for a large cut in variance, lowering total error." },
  ],
  formulas: [
    { label: "Shrinkage weight", tex: "w_j = \\dfrac{\\tau^2}{\\tau^2 + \\sigma^2/n_j}" },
    { label: "Estimate", tex: "\\hat\\theta_j = w_j\\bar y_j + (1 - w_j)\\mu" },
    { label: "Estimating τ²", tex: "\\hat\\tau^2 = \\operatorname{Var}(\\bar y_j) - \\sigma^2/n" },
    { label: "ICC", tex: "\\tau^2/(\\tau^2 + \\sigma^2)" },
  ],
  exercises: [
    ex(1, num("hiex-ex-1", "$\\tau^2 = 9$, $\\sigma^2 = 9$, $n_j = 1$. Find $w_j$.", 0.5, "$9/18$."), ["$0.5$."]),
    ex(1, num("hiex-ex-2", "$w_j = 0.25$, group mean 90, overall mean 70. Find the shrunk estimate.", 75, "$22.5 + 52.5$."), ["$75$."]),
    ex(2, dp("hiex-ex-3", "$\\tau^2 = 4$, $\\sigma^2 = 100$, $n_j = 4$. Find $w_j$.", 4 / 29, "$4/(4 + 25)$."), ["$4/29 \\approx 0.138$."]),
    ex(2, dp("hiex-ex-4", "Same numbers, group mean 80, overall mean 70. Find the shrunk estimate.", shrink(80, 70, 4, 100, 4).est, "$w \\times 80 + (1 - w) \\times 70$."), ["$70 + 10 \\times 0.138 \\approx 71.379$."]),
    ex(2, num("hiex-ex-5", "Group means vary with variance 10; $\\sigma^2 = 40$ and $n = 8$ per group. Estimate $\\tau^2$.", 5, "$10 - 40/8$."), ["$5$."]),
    ex(3, num("hiex-ex-6", "$\\tau^2 = 4$ and $\\sigma^2 = 36$. Find the intraclass correlation.", 0.1, "$4/40$."), ["$0.1$."]),
    ex(3, num("hiex-ex-7", "With $\\tau^2 = 4$ and $\\sigma^2 = 16$, how large must $n_j$ be for $w_j = 0.8$?", 16, "$4/(4 + 16/n) = 0.8$."), ["$4 + 16/n = 5$, so $n = 16$."]),
    ex(3, mc("hiex-ex-8", "The spread of group means is smaller than sampling noise alone would produce. Empirical Bayes sets $\\hat\\tau^2$ to", ["0, pooling the groups completely", "Negative variance estimates are truncated at 0."], [["a negative number", "Variances can't be negative."], ["the spread of the means", "That would ignore the sampling noise."]]), ["Then the data show no evidence of real differences between groups."]),
    ex(3, mc("hiex-ex-9", "Panel data follow 500 firms for 10 years. Firm fixed effects", ["remove every stable firm-level confounder", "Each firm is compared with itself."], [["estimate the effect of stable firm traits", "Those are absorbed by the dummies."], ["are the same as pooling all firms", "They do the opposite."]]), ["Fixed effects use only within-firm variation over time."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const tau2 = r.pick([1, 4, 9, 16]);
      const s2 = r.pick([16, 25, 36, 100]);
      const nj = r.pick([1, 2, 4, 9, 16, 25]);
      const ybar = r.int(60, 95);
      const mu = r.int(60, 80);
      const s = shrink(ybar, mu, tau2, s2, nj);
      const want = lv === 1 ? "weight" : r.pick(["weight", "estimate"] as const);
      return want === "weight"
        ? n(`$\\tau^2 = ${tau2}$, $\\sigma^2 = ${s2}$ and $n_j = ${nj}$. Find the shrinkage weight $w_j$ (3 decimals).`, Math.round(s.w * 1000) / 1000, `$${tau2}/(${tau2} + ${s2}/${nj}) \\approx ${Math.round(s.w * 1000) / 1000}$.`, 0.001)
        : n(`$\\tau^2 = ${tau2}$, $\\sigma^2 = ${s2}$, $n_j = ${nj}$; group mean ${ybar}, overall mean ${mu}. Find the shrunk estimate (2 decimals).`, r2(s.est), `$w = ${Math.round(s.w * 1000) / 1000}$, so $${Math.round(s.w * 1000) / 1000} \\times ${ybar} + ${Math.round((1 - s.w) * 1000) / 1000} \\times ${mu} \\approx ${r2(s.est)}$.`, 0.01);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const small = r.int(2, 5);
      const big = r.pick([500, 1000, 3000]);
      return mcNumbers(
        `Clinic A treated ${small} patients, all of whom recovered; clinic B treated ${big.toLocaleString("en-US")} with a 92% recovery rate. Which is more likely to have the higher true recovery rate?`,
        { text: "Unclear: A's 100% from so few patients should be shrunk heavily towards the average", why: "Small groups give extreme rates by chance." },
        [
          { text: "Clinic A, since 100% beats 92%", why: `With ${small} patients, 100% is weak evidence.`, misconception: "no-pooling-best" },
          { text: "They must be equal", why: "Pooling everything ignores real differences.", misconception: "complete-pooling" },
        ],
      );
    },
  },
];
