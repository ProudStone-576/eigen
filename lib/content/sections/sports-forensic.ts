import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Sports analytics and performance modelling (Pythagorean expectation, Elo ratings, expected goals, regression to the mean and shrinkage, the hot hand, ageing curves) and forensic statistics (likelihood ratios, the prosecutor's fallacy, DNA match probabilities, database searches, independence errors). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const eloE = (ra: number, rb: number) => 1 / (1 + 10 ** ((rb - ra) / 400));

const base: ConceptNode = {
  id: "sports-forensic",
  title: "Sports & forensic statistics",
  summary: "Sport is a laboratory of noisy performance: who is really better, and how much of a hot start is luck? Ratings, expected-goal models and shrinkage answer these questions, and regression to the mean explains many \"curses\" and \"slumps\". In the courtroom the stakes are higher: forensic evidence should be weighed by likelihood ratios, and confusing the probability of the evidence with the probability of guilt has convicted innocent people.",
  deps: ["bayes", "hierarchical-models", "logistic-regression"],
  pos: { x: 6, y: 0 },
  glossary: [
    { term: "Elo rating", meaning: "A rating updated after each game by $K$ times (result minus expected result)." },
    { term: "likelihood ratio", meaning: "$\\text{LR} = P(E \\mid H_p)/P(E \\mid H_d)$: how much more probable the evidence is if the prosecution's hypothesis is true than if the defence's is." },
    { term: "prosecutor's fallacy", meaning: "Confusing $P(\\text{evidence} \\mid \\text{innocent})$ with $P(\\text{innocent} \\mid \\text{evidence})$." },
  ],
  misconceptions: {
    "prosecutor-fallacy": "Reads a tiny probability of the evidence under innocence as a tiny probability of innocence.",
    "regression-mean-sports": "Expects an exceptional early performance to continue at the same level, ignoring regression to the mean.",
  },
  steps: [
    {
      type: "motivate",
      title: "Luck, skill and evidence",
      body: "A batter hits .400 over the first month. A team wins its first eight games. A DNA profile from a crime scene matches a suspect, with a random match probability of one in a million. In each case the headline number is real, and in each case drawing the obvious conclusion can be badly wrong without thinking about base rates and noise.",
      realWorld: {
        title: "Sally Clark",
        body: "In 1999 Sally Clark was convicted of murdering her two baby sons after an expert told the jury the chance of two cot deaths in such a family was 1 in 73 million. The figure wrongly assumed independence and was presented as the chance of innocence. The Royal Statistical Society protested, and her conviction was quashed in 2003.",
      },
    },
    {
      type: "truth",
      statement: "**Forensic reasoning**: posterior odds of guilt $=$ likelihood ratio $\\times$ prior odds (§{bayes}), with $\\text{LR} = P(E \\mid H_p)/P(E \\mid H_d)$. A DNA match with random match probability $p$ has $\\text{LR} \\approx 1/p$, but if the suspect was found by searching a database or a population of $N$ people, about $Np$ innocent people would also match. **Sports**: the Elo expected score of A against B is $E_A = \\dfrac{1}{1 + 10^{(R_B - R_A)/400}}$, updated to $R_A + K(S_A - E_A)$ after a result $S_A \\in \\{0, \\tfrac12, 1\\}$. The **Pythagorean expectation** estimates a team's win fraction from runs (or points) scored and allowed: $\\dfrac{\\text{RS}^2}{\\text{RS}^2 + \\text{RA}^2}$.",
      body: "Early-season averages are noisy, so the best estimate of true ability **shrinks** towards the league mean, with weight $w = n/(n + k)$ on the player's own record (§{hierarchical-models}). Regression to the mean explains the \"cover jinx\" and sophomore slumps: those selected for exceptional results were, on average, also lucky. **Expected goals** models fit the probability that a shot scores from its distance, angle and type by logistic regression (§{logistic-regression}); summing them measures chance quality, which predicts future scoring better than actual goals. The \"hot hand\" was long dismissed, until Miller and Sanjurjo (2018) showed the classic test was biased by selecting shots after streaks; a small effect now looks real. **Ageing curves** must handle survivorship: only good players keep playing.",
    },
    {
      type: "predict",
      misconception: "prosecutor-fallacy",
      item: {
        kind: "mc",
        id: "spf-predict-1",
        prompt: "A DNA profile matches a suspect; the chance a random unrelated person matches is 1 in a million. The suspect was found by searching a database, and there is no other evidence. In a city of 5 million, the chance the suspect is the source is closer to",
        options: [
          { id: "a", text: "about 1 in 6: around 5 other people in the city would also match", correct: true, why: "$5 \\times 10^6 \\times 10^{-6} = 5$ innocent matches expected." },
          { id: "b", text: "999,999 in a million", misconception: "prosecutor-fallacy", why: "That treats $P(\\text{match} \\mid \\text{innocent})$ as $P(\\text{innocent} \\mid \\text{match})$." },
          { id: "c", text: "exactly 1 in 2", why: "There are about 6 candidates, not 2." },
        ],
      },
      reveal: {
        body: "With a uniform prior over 5 million people, about 5 innocent people match besides the true source: 6 matches in all, so with no other evidence the probability that a given match is the source is about 1/6. The tiny match probability is $P(E \\mid \\text{innocent})$; turning it into $P(\\text{innocent} \\mid E)$ needs the prior, via Bayes. Other evidence (location, motive) changes the prior and can make the case strong, but the match alone is not proof.",
      },
      resolve: {
        kind: "mc",
        id: "spf-resolve-1",
        prompt: "\"The chance of this evidence if the defendant were innocent is 1 in 10,000.\" This means",
        options: [
          { id: "a", text: "the likelihood of the evidence under innocence is small; the probability of innocence also depends on the prior", correct: true, why: "Posterior odds = LR × prior odds." },
          { id: "b", text: "the defendant is innocent with probability 1 in 10,000", misconception: "prosecutor-fallacy", why: "That is the prosecutor's fallacy." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spf-check-1",
        prompt: "A rookie bats .400 over his first 50 at-bats; the league average is .260. The best forecast of his rest-of-season average is",
        options: [
          { id: "a", text: "well below .400, shrunk towards .260", correct: true, why: "50 at-bats are mostly noise." },
          { id: "b", text: "about .400, his demonstrated level", misconception: "regression-mean-sports", why: "Hot starts regress towards the mean." },
          { id: "c", text: "exactly .260", why: "His record carries some information." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "spf-check-2",
        prompt: "Player A is rated 200 Elo points above B. A's expected score is about",
        options: [
          { id: "a", text: "0.76", correct: true, why: "$1/(1 + 10^{-0.5})$." },
          { id: "b", text: "0.5", why: "That is for equal ratings." },
          { id: "c", text: "0.99", why: "200 points is a clear but not overwhelming edge." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Elo's idea, a rating nudged by surprise, underlies online-learning updates and the leaderboards that rank language models from pairwise human preferences (Bradley–Terry models). Tracking data in football and basketball feed spatial and sequence models, but evaluation must still respect regression to the mean and leakage across time.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "spf-produce-1", prompt: "LR = 1,000 and prior odds 1 : 10,000. Find the posterior probability of guilt to 3 decimals.", answer: Math.round((0.1 / 1.1) * 1000) / 1000, tolerance: 0.001, explain: "Posterior odds $0.1$; probability $0.1/1.1$." },
        { kind: "number", id: "spf-produce-2", prompt: "A team scored 800 runs and allowed 700. Find its Pythagorean win fraction to 3 decimals.", answer: Math.round((640000 / 1130000) * 1000) / 1000, tolerance: 0.001, explain: "$800^2/(800^2 + 700^2)$." },
        {
          kind: "mc",
          id: "spf-produce-3",
          prompt: "An expert says a blood type found at the scene occurs in 1% of people, \"so there is a 99% chance the defendant is guilty\". This is",
          options: [
            { id: "a", text: "the prosecutor's fallacy: 1% of a large population is many people", correct: true, why: "The evidence narrows the field, not to one person." },
            { id: "b", text: "correct reasoning", misconception: "prosecutor-fallacy", why: "It swaps the conditional probability." },
          ],
        },
        {
          kind: "mc",
          id: "spf-produce-4",
          prompt: "A football team wins its first 6 matches, far above its usual standard. Over the rest of the season, expect",
          options: [
            { id: "a", text: "results closer to its usual level", correct: true, why: "Part of the streak was luck." },
            { id: "b", text: "the same winning rate to continue", misconception: "regression-mean-sports", why: "Extreme runs regress." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "spf-review-1", prompt: "Random match probability 1 in 2 million; population 10 million. How many innocent people are expected to match?", answer: 5, explain: "$10^7 \\times 5 \\times 10^{-7}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "weighing forensic evidence",
      body: "Scientists should report the **likelihood ratio** of the evidence under two stated hypotheses, not a probability of guilt, which needs the prior and other evidence that are for the court. Common errors: the **prosecutor's fallacy** (equating $P(E \\mid \\text{innocent})$ with $P(\\text{innocent} \\mid E)$), the **defence fallacy** (dismissing evidence because many others also match, ignoring how it combines with other evidence), and multiplying probabilities of events that aren't independent.",
    },
    {
      type: "definition",
      term: "ratings and expected goals",
      body: "Elo and its successors (Glicko, TrueSkill) treat each game as a noisy comparison and update ratings by the surprise in the result; $K$ sets how fast ratings react. An **expected-goals** (xG) model gives each shot a scoring probability; a team's xG total is its expected goals from its chances, and goals minus xG mostly reflects finishing luck and goalkeeping, which persist much less than chance creation.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Formula",
      name: "Bayes' rule in odds form",
      statement: "$\\dfrac{P(H_p \\mid E)}{P(H_d \\mid E)} = \\dfrac{P(E \\mid H_p)}{P(E \\mid H_d)} \\times \\dfrac{P(H_p)}{P(H_d)}$: posterior odds equal the likelihood ratio times the prior odds.",
      proof: ["Write each posterior by Bayes' rule and divide; $P(E)$ cancels (§{bayes})."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "regression to the mean",
      statement: "If observed performance is true ability plus independent noise, the best linear forecast of next performance from this one is $\\mu + w(x - \\mu)$ with $w = \\dfrac{\\sigma_{\\text{true}}^2}{\\sigma_{\\text{true}}^2 + \\sigma_{\\text{noise}}^2} < 1$.",
      proof: ["The same calculation as reliability and shrinkage (§{hierarchical-models}): $w$ is the share of observed variance that is real."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "independence errors",
      statement: "Multiply probabilities only for independent events. Two cot deaths in one family share genetic and environmental factors, so $P(\\text{two}) \\ne P(\\text{one})^2$; and even a correct rare-event probability must be compared with the (also rare) probability of the alternative explanation.",
      proof: ["Dependence makes repeat events far more likely; the relevant comparison is the likelihood ratio of the competing explanations, both of which are rare."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "an Elo update",
      problem: "A (1600) plays B (1400) and loses; $K = 32$. Find A's new rating.",
      solution: ["$E_A = 1/(1 + 10^{-200/400}) = 1/(1 + 0.316) \\approx 0.760$.", "$R_A' = 1600 + 32(0 - 0.760) \\approx 1575.7$."],
      result: "About 1576.",
    },
    {
      type: "example",
      level: 2,
      title: "shrinking a hot start",
      problem: "A batter hits .400 in 50 at-bats; league mean .260; the shrinkage constant is $k = 200$ at-bats. Estimate his true average.",
      solution: ["$w = 50/(50 + 200) = 0.2$.", "$0.260 + 0.2 \\times (0.400 - 0.260) = 0.288$."],
      result: "About .288.",
    },
    {
      type: "example",
      level: 3,
      title: "likelihood ratio and prior",
      problem: "A glass fragment matches the suspect's window: $P(E \\mid H_p) = 1$, $P(E \\mid H_d) = 0.001$. Other evidence gives prior odds 1 : 10,000. Find the posterior probability.",
      solution: ["LR $= 1000$; posterior odds $= 1000/10000 = 0.1$.", "Probability $0.1/1.1 \\approx 0.091$: strong evidence, but far from proof here."],
      result: "About 9%.",
    },
  ],
  pitfalls: [
    { wrong: "A tiny match probability means guilt is almost certain.", right: "Combine the likelihood ratio with the prior; count how many others would match." },
    { wrong: "A hot start shows a new level of ability.", right: "Shrink towards the mean; most of it regresses." },
    { wrong: "Multiply probabilities of related events.", right: "Check independence first." },
  ],
  formulas: [
    { label: "Odds form", tex: "\\text{posterior odds} = \\text{LR} \\times \\text{prior odds}" },
    { label: "Elo", tex: "E_A = \\dfrac{1}{1 + 10^{(R_B - R_A)/400}},\\ R_A' = R_A + K(S_A - E_A)" },
    { label: "Pythagorean", tex: "\\dfrac{\\text{RS}^2}{\\text{RS}^2 + \\text{RA}^2}" },
    { label: "Shrinkage", tex: "\\mu + \\tfrac{n}{n + k}(\\bar x - \\mu)" },
  ],
  exercises: [
    ex(1, num("spfx-ex-1", "Elo: equal ratings. Find A's expected score.", 0.5, "$1/(1 + 1)$."), ["$0.5$."]),
    ex(1, num("spfx-ex-2", "LR 100 and prior odds 1 : 4. Find the posterior odds.", 25, "$100 \\times 0.25$."), ["$25$ to 1."]),
    ex(2, dp("spfx-ex-3", "A (1500) plays B (1700). Find A's expected score.", eloE(1500, 1700), "$1/(1 + 10^{0.5})$."), ["$\\approx 0.240$."]),
    ex(2, dp("spfx-ex-4", "Same game, A wins, $K = 20$. Find A's new rating.", 1500 + 20 * (1 - eloE(1500, 1700)), "$1500 + 20(1 - E_A)$."), ["$\\approx 1515.195$."]),
    ex(2, dp("spfx-ex-5", "A team scored 90 goals and conceded 60. Find its Pythagorean win fraction.", 8100 / 11700, "$90^2/(90^2 + 60^2)$."), ["$\\approx 0.692$."]),
    ex(3, dp("spfx-ex-6", "A striker scores on 30% of 20 shots; league average 10%; shrinkage constant $k = 80$ shots. Estimate the true conversion rate.", 0.1 + (20 / 100) * 0.2, "$w = 20/100$."), ["$0.1 + 0.2 \\times 0.2 = 0.14$."]),
    ex(3, mc("spfx-ex-7", "The probability of one cot death in an affluent non-smoking family was given as 1 in 8,543, and of two as $(1/8543)^2$. The main statistical errors were", ["assuming independence and treating the result as the probability of innocence", "Shared risk factors, and the prosecutor's fallacy."], [["none", "Both errors were serious."], ["using too small a sample", "The errors were in reasoning."]]), ["Double murder is also extremely rare; the comparison of the two explanations matters."]),
    ex(3, mc("spfx-ex-8", "A team's goals greatly exceed its expected goals this season. Next season, expect its goals to", ["move closer to its expected goals", "Finishing luck regresses."], [["exceed xG by even more", "Overperformance mostly doesn't persist."], ["fall to 0", "It still creates chances."]]), ["Chance creation (xG) is the more stable signal."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const ra = r.int(12, 22) * 100;
      const rb = ra + r.pick([-300, -200, -100, 0, 100, 200, 300]);
      const e = eloE(ra, rb);
      if (lv === 1) return n(`Elo: A is rated ${ra}, B ${rb}. Find A's expected score (3 decimals).`, Math.round(e * 1000) / 1000, `$1/(1 + 10^{(${rb} - ${ra})/400}) \\approx ${Math.round(e * 1000) / 1000}$.`, 0.001);
      const s = r.pick([0, 0.5, 1]);
      const K = r.pick([16, 20, 32]);
      const v = ra + K * (s - e);
      return n(`Elo: A (${ra}) plays B (${rb}) and ${s === 1 ? "wins" : s === 0 ? "loses" : "draws"}; $K = ${K}$. Find A's new rating (2 decimals).`, r2(v), `$E_A \\approx ${Math.round(e * 1000) / 1000}$; $${ra} + ${K}(${s} - E_A) \\approx ${r2(v)}$.`, 0.01);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const lr = r.pick([10, 100, 1000, 10000]);
      const prior = r.pick([10, 100, 1000, 100000]);
      const odds = lr / prior;
      const v = odds / (1 + odds);
      return n(`Likelihood ratio ${lr.toLocaleString("en-US")}; prior odds 1 : ${prior.toLocaleString("en-US")}. Find the posterior probability (4 decimals).`, Math.round(v * 10000) / 10000, `Posterior odds $${lr}/${prior} = ${Number(odds.toPrecision(3))}$; probability $\\approx ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const mu = r.pick([0.25, 0.26, 0.27]);
      const x = r.pick([0.35, 0.38, 0.4, 0.42]);
      const nn = r.pick([30, 50, 100, 200]);
      const k = r.pick([150, 200, 300]);
      const v = mu + (nn / (nn + k)) * (x - mu);
      return n(`A batter averages ${x} over ${nn} at-bats; league mean ${mu}; shrinkage constant $k = ${k}$. Estimate the true average (3 decimals).`, Math.round(v * 1000) / 1000, `$w = ${nn}/${nn + k}$; $${mu} + w(${x} - ${mu}) \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const p = r.pick(["1 in 10,000", "1 in a million", "1 in 50,000"]);
      return mcNumbers(
        `An expert testifies that the chance of the forensic evidence if the defendant were innocent is ${p}. The probability the defendant is innocent is`,
        { text: "not determined by that number alone; it needs the prior and other evidence", why: "Posterior odds = LR × prior odds." },
        [{ text: p, why: "That swaps the conditional probability.", misconception: "prosecutor-fallacy" }],
      );
    },
  },
];
