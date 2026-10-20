import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Geometric, negative binomial, hypergeometric, multinomial, discrete uniform, categorical and Zipf distributions. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const C = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
};

const base: ConceptNode = {
  id: "discrete-family",
  title: "Geometric, hypergeometric & multinomial",
  summary: "Beyond the binomial: the geometric and negative binomial count trials until the first or rth success, the hypergeometric counts successes when drawing without replacement from a finite population, and the multinomial splits n trials among several categories.",
  deps: ["binomial", "counting"],
  pos: { x: 0, y: 2 },
  glossary: [
    { term: "hypergeometric", meaning: "The number of successes in $n$ draws without replacement from $N$ items, $K$ of them successes." },
    { term: "negative binomial", meaning: "The number of independent trials needed to reach the $r$th success." },
    { term: "multinomial", meaning: "The counts in each of $k$ categories over $n$ independent trials." },
  ],
  misconceptions: {
    "hypergeom-as-binomial": "Uses the binomial for draws without replacement from a small population.",
    "negbin-count": "Counts arrangements for the rth success on trial y as $\\binom{y}{r}$, forgetting that trial y must itself be the rth success.",
  },
  steps: [
    {
      type: "motivate",
      title: "Which count?",
      body: "An inspector draws 5 chips from a box of 20, of which 4 are faulty. A salesperson phones customers until the third sale. A die is rolled 12 times and every face is tallied. All three are counting problems, and none of them is binomial.",
      realWorld: {
        title: "Lotteries and audits",
        body: "Lottery odds and audit sampling (\"check 30 of 500 invoices; how many errors should we expect?\") are hypergeometric: the population is finite and nothing is put back.",
      },
    },
    {
      type: "truth",
      statement: "**Hypergeometric**: $n$ draws without replacement from $N$ items, $K$ successes: $P(X = k) = \\dfrac{\\binom Kk\\binom{N - K}{n - k}}{\\binom Nn}$. **Negative binomial**: trials $Y$ to the $r$th success, $P(Y = y) = \\binom{y - 1}{r - 1}p^rq^{y - r}$; $r = 1$ is the geometric. **Multinomial**: $P(x_1, \\dots, x_k) = \\dfrac{n!}{x_1!\\cdots x_k!}p_1^{x_1}\\cdots p_k^{x_k}$.",
      body: "The hypergeometric has the binomial's mean $n\\tfrac KN$ but a smaller variance, $n\\tfrac KN\\left(1 - \\tfrac KN\\right)\\dfrac{N - n}{N - 1}$: the finite population correction (§{survey-design}) squared. When $N$ is much larger than $n$ it is close to $\\mathrm{Bin}(n, K/N)$.",
    },
    {
      type: "predict",
      misconception: "hypergeom-as-binomial",
      item: {
        kind: "mc",
        id: "dfm-predict-1",
        prompt: "A box has 20 chips, 4 of them faulty. Two are drawn without replacement. Find P(both faulty).",
        options: [
          { id: "a", text: "$\\tfrac{4}{20} \\times \\tfrac{3}{19} = \\tfrac{3}{95} \\approx 0.032$", correct: true, why: "After one faulty chip, 3 of the 19 left are faulty." },
          { id: "b", text: "$0.2^2 = 0.04$", misconception: "hypergeom-as-binomial", why: "That assumes the chance stays at 0.2, as it would with replacement." },
          { id: "c", text: "$2 \\times 0.2 = 0.4$", why: "Probabilities of successive events multiply." },
        ],
      },
      reveal: {
        body: "Once a faulty chip is out, only 3 faulty chips remain among 19, so the second draw's chance drops to $3/19$. Counting directly: $\\binom42\\big/\\binom{20}{2} = 6/190 = 3/95$. The binomial would be right only if each chip were put back before the next draw.",
      },
      resolve: {
        kind: "mc",
        id: "dfm-resolve-1",
        prompt: "When must the hypergeometric replace the binomial?",
        options: [
          { id: "a", text: "When drawing without replacement from a population not much larger than the sample", correct: true, why: "Then each draw changes the odds for the next." },
          { id: "b", text: "Never: the binomial works for any count of successes", misconception: "hypergeom-as-binomial", why: "The binomial needs a fixed chance on every trial." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dfm-check-1",
        prompt: "A player makes each free throw with probability 0.6. Find P(the 2nd basket comes on the 4th throw).",
        options: [
          { id: "a", text: "$\\binom31(0.6)^2(0.4)^2 \\approx 0.173$", correct: true, why: "One basket among the first 3, then a basket on the 4th." },
          { id: "b", text: "$\\binom42(0.6)^2(0.4)^2 \\approx 0.346$", misconception: "negbin-count", why: "That counts sequences where the 4th throw misses." },
          { id: "c", text: "$(0.6)^2(0.4)^2 \\approx 0.058$", why: "That is one particular order." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dfm-check-2",
        prompt: "A fair die is rolled 6 times. Find P(every face appears exactly once).",
        options: [
          { id: "a", text: "$6!/6^6 \\approx 0.0154$", correct: true, why: "A multinomial with all counts 1: $\\tfrac{6!}{1!\\cdots1!}(1/6)^6$." },
          { id: "b", text: "$1/6$", why: "That is the chance of one particular face on one roll." },
          { id: "c", text: "$6/6^6$", why: "The six faces can appear in $6!$ orders." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A classifier's output over $k$ classes is a categorical distribution, the one-trial multinomial, and cross-entropy is its negative log-likelihood. Naive Bayes text classifiers model a document's word counts as multinomial.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dfm-produce-1", prompt: "Trials to the first success are geometric with $p = 0.25$. Find the expected number of trials.", answer: 4, explain: "$1/p$." },
        { kind: "number", id: "dfm-produce-2", prompt: "Ten balls are drawn without replacement from 50, of which 20 are red. Find the expected number of red balls.", answer: 4, explain: "$n K/N = 10 \\times 20/50$." },
        {
          kind: "mc",
          id: "dfm-produce-3",
          prompt: "For the 3rd success to happen on trial $y$, the number of arrangements is",
          options: [
            { id: "a", text: "$\\binom{y - 1}{2}$: trial $y$ is a success, and 2 of the first $y - 1$ are", correct: true, why: "The last trial is fixed." },
            { id: "b", text: "$\\binom{y}{3}$", misconception: "negbin-count", why: "That allows the last trial to be a failure." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dfm-review-1", prompt: "In how many orders can 4 trials give 2 of outcome A, 1 of B and 1 of C?", answer: 12, explain: "$\\tfrac{4!}{2!\\,1!\\,1!}$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "discrete uniform, categorical, Zipf",
      body: "The **discrete uniform** on $1, \\dots, n$ gives each value probability $1/n$: mean $\\tfrac{n + 1}{2}$, variance $\\tfrac{n^2 - 1}{12}$. A **categorical** variable is one multinomial trial: outcome $j$ with probability $p_j$. **Zipf's law** gives the $k$th most common item probability proportional to $1/k^s$, a pattern seen in word frequencies and city sizes.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the geometric",
      statement: "If $Y$ is the number of trials to the first success, $P(Y > n) = q^n$, $E[Y] = 1/p$ and $\\operatorname{Var}(Y) = q/p^2$. It has no memory: $P(Y > m + n \\mid Y > m) = P(Y > n)$.",
      proof: [
        "$Y > n$ means the first $n$ trials all failed: probability $q^n$.",
        "$E[Y] = \\sum_{n \\ge 0}P(Y > n) = \\sum q^n = \\tfrac{1}{1 - q} = \\tfrac1p$. Memorylessness: $q^{m + n}/q^m = q^n$, the discrete twin of the exponential's (§{uniform-exponential}).",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the negative binomial",
      statement: "Trials to the $r$th success have mean $r/p$ and variance $rq/p^2$.",
      proof: ["The wait for the $r$th success is the sum of $r$ independent geometric waits, one per success; means and (by independence) variances add."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the hypergeometric",
      statement: "$E[X] = n\\dfrac KN$ and $\\operatorname{Var}(X) = n\\dfrac KN\\left(1 - \\dfrac KN\\right)\\dfrac{N - n}{N - 1}$. As $N \\to \\infty$ with $K/N = p$ fixed, it tends to $\\mathrm{Bin}(n, p)$.",
      proof: [
        "Write $X$ as a sum of $n$ indicators, one per draw; each draw is a success with probability $K/N$, which gives the mean.",
        "Draws without replacement have a small negative covariance, which produces the factor $\\tfrac{N - n}{N - 1}$ exactly as for the sample mean (§{survey-design}).",
      ],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "the multinomial",
      statement: "Each count $X_j$ is $\\mathrm{Bin}(n, p_j)$, and $\\operatorname{Cov}(X_i, X_j) = -np_ip_j$ for $i \\neq j$.",
      proof: ["A trial in category $i$ cannot also be in category $j$: per trial the indicators have $E[I_iI_j] = 0$, so their covariance is $-p_ip_j$; there are $n$ independent trials."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A committee of 3 is chosen at random from 5 men and 4 women. Find P(exactly 2 women).",
      solution: ["$\\dfrac{\\binom42\\binom51}{\\binom93} = \\dfrac{6 \\times 5}{84}$.", "$= \\tfrac{30}{84} = \\tfrac{5}{14}$."],
      result: "$\\tfrac{5}{14} \\approx 0.357$.",
    },
    {
      type: "example",
      level: 2,
      title: "negative binomial",
      problem: "A fair coin is tossed until the third head. Find P(this happens on the 5th toss).",
      solution: ["The 5th toss is a head, and the first 4 contain exactly 2 heads.", "$\\binom42\\left(\\tfrac12\\right)^5 = \\tfrac{6}{32} = \\tfrac{3}{16}$."],
      result: "$\\tfrac{3}{16}$.",
    },
    {
      type: "example",
      level: 2,
      title: "multinomial",
      problem: "Customers choose plans A, B, C with probabilities 0.5, 0.3, 0.2. Of 5 customers, find P(2 choose A, 2 choose B, 1 chooses C).",
      solution: ["$\\dfrac{5!}{2!\\,2!\\,1!} = 30$ orders.", "$30 \\times 0.5^2 \\times 0.3^2 \\times 0.2 = 30 \\times 0.0045 = 0.135$."],
      result: "0.135.",
    },
    {
      type: "example",
      level: 3,
      title: "how much the correction matters",
      problem: "Draw 5 chips from 20 with 4 faulty. Compare the hypergeometric variance of the faulty count with the binomial's.",
      solution: ["Binomial: $5 \\times 0.2 \\times 0.8 = 0.8$.", "Hypergeometric: $0.8 \\times \\tfrac{15}{19} \\approx 0.632$. Sampling a quarter of the box removes about 21% of the variance."],
      result: "0.632 against 0.8.",
    },
  ],
  pitfalls: [
    { wrong: "Use the binomial for cards dealt from a deck.", right: "Without replacement from a small population: use the hypergeometric." },
    { wrong: "P(rth success on trial $y$) $= \\binom yr p^rq^{y - r}$.", right: "The last trial must be the $r$th success: $\\binom{y - 1}{r - 1}$." },
    { wrong: "The geometric mean is always $1/p$.", right: "If $Y$ counts failures before the first success, its mean is $q/p$. Check which convention a question uses." },
  ],
  formulas: [
    { label: "Hypergeometric", tex: "\\dfrac{\\binom Kk\\binom{N - K}{n - k}}{\\binom Nn}" },
    { label: "Negative binomial", tex: "\\binom{y - 1}{r - 1}p^rq^{y - r},\\quad E = r/p" },
    { label: "Geometric", tex: "P(Y > n) = q^n,\\quad E = 1/p,\\quad \\operatorname{Var} = q/p^2" },
    { label: "Multinomial", tex: "\\dfrac{n!}{x_1!\\cdots x_k!}\\textstyle\\prod p_j^{x_j}" },
    { label: "Discrete uniform", tex: "E = \\tfrac{n + 1}{2},\\quad \\operatorname{Var} = \\tfrac{n^2 - 1}{12}" },
  ],
  exercises: [
    ex(1, num("dfmx-ex-1", "Trials to the first success are geometric with $p = 0.2$. Find the mean.", 5, "$1/p$."), ["$1/0.2 = 5$."]),
    ex(1, num("dfmx-ex-2", "Find the mean of the discrete uniform on $1, \\dots, 10$.", 5.5, "$(n + 1)/2$."), ["$11/2 = 5.5$."]),
    ex(2, fr("dfmx-ex-3", "Three cards are drawn from 10, of which 4 are red. Find P(exactly 1 red).", (C(4, 1) * C(6, 2)) / C(10, 3), "Hypergeometric."), ["$\\dfrac{4 \\times 15}{120} = \\tfrac12$."]),
    ex(2, fr("dfmx-ex-4", "With $p = \\tfrac12$, find P(the 2nd success comes on the 3rd trial).", C(2, 1) / 8, "$\\binom21(1/2)^3$."), ["$2/8 = \\tfrac14$."]),
    ex(2, num("dfmx-ex-5", "Six balls are drawn without replacement from 30, of which 10 are defective. Find the expected number defective.", 2, "$nK/N$."), ["$6 \\times 10/30 = 2$."]),
    ex(3, dp("dfmx-ex-6", "Same draw. Find the variance of the number defective.", 6 * (1 / 3) * (2 / 3) * (24 / 29), "Binomial variance times $(N - n)/(N - 1)$."), ["$6 \\times \\tfrac13 \\times \\tfrac23 \\times \\tfrac{24}{29} \\approx 1.103$."]),
    ex(3, fr("dfmx-ex-7", "$n = 4$ trials with probabilities $0.5, 0.25, 0.25$. Find P(counts 2, 1, 1).", 12 * 0.25 * 0.25 * 0.25, "$12 \\times 0.5^2 \\times 0.25 \\times 0.25$."), ["$\\tfrac{4!}{2!\\,1!\\,1!} = 12$, times $\\tfrac{1}{64}$: $\\tfrac{3}{16}$."]),
    ex(3, num("dfmx-ex-8", "Find the expected number of trials to the 3rd success when $p = 0.25$.", 12, "$r/p$."), ["$3/0.25 = 12$."]),
    ex(3, fr("dfmx-ex-9", "Find the variance of one roll of a fair die using the discrete uniform formula.", 35 / 12, "$(n^2 - 1)/12$."), ["$\\tfrac{36 - 1}{12} = \\tfrac{35}{12}$."]),
    ex(3, num("dfmx-ex-10", "A fair coin is tossed until the first head. Find P(more than 4 tosses are needed).", 1 / 16, "$q^4$."), ["The first 4 must all be tails: $(1/2)^4 = 0.0625$."]),
    ex(3, mc("dfmx-ex-11", "Five cards are dealt from a 52-card deck. The number of hearts is", ["hypergeometric", "Dealt without replacement from a finite deck."], [["exactly binomial", "The chance changes after each card."], ["Poisson", "There is a fixed number of draws from a finite population."]]), ["$N = 52$, $K = 13$, $n = 5$."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const N = r.int(8, 12 + 4 * lv);
      const K = r.int(2, Math.floor(N / 2));
      const m = r.int(2, Math.min(4 + lv, N - 2));
      const k = r.int(Math.max(0, m - (N - K)), Math.min(m, K));
      const p = (C(K, k) * C(N - K, m - k)) / C(N, m);
      return n(`A box holds ${N} items, ${K} of them defective. ${m} are drawn without replacement. Find P(exactly ${k} defective) to 3 decimals.`, Math.round(p * 1000) / 1000, `$\\dfrac{\\binom{${K}}{${k}}\\binom{${N - K}}{${m - k}}}{\\binom{${N}}{${m}}} = \\dfrac{${C(K, k) * C(N - K, m - k)}}{${C(N, m)}} \\approx ${Math.round(p * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const p = r.pick([0.2, 0.25, 0.4, 0.5, 0.6]);
      const rr = r.int(1, 1 + lv);
      const y = rr + r.int(0, 2 + lv);
      const v = C(y - 1, rr - 1) * p ** rr * (1 - p) ** (y - rr);
      return n(`Each trial succeeds with probability ${p}. Find P(the ${rr === 1 ? "first" : `${rr}th`} success comes on trial ${y}) to 3 decimals.`, Math.round(v * 1000) / 1000, `$\\binom{${y - 1}}{${rr - 1}}(${p})^{${rr}}(${Math.round((1 - p) * 100) / 100})^{${y - rr}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const s = r.pick([
        { text: "The number of aces in a 5-card hand", ans: "Hypergeometric", why: "Cards are dealt without replacement from a finite deck." },
        { text: "The number of 6s in 20 rolls of a die", ans: "Binomial", why: "Fixed number of independent trials with the same chance." },
        { text: "The number of rolls until the first 6", ans: "Geometric", why: "Trials until the first success." },
        { text: "The number of calls until the 4th sale, each call succeeding with chance 0.1", ans: "Negative binomial", why: "Trials until the rth success." },
        { text: "The counts of each face in 30 rolls of a die", ans: "Multinomial", why: "Several categories over a fixed number of trials." },
        { text: "The number of women on a committee of 4 drawn from 6 women and 6 men", ans: "Hypergeometric", why: "Drawn without replacement from a small group." },
      ]);
      const all = ["Binomial", "Hypergeometric", "Geometric", "Negative binomial", "Multinomial"];
      return mcNumbers(
        `Which distribution fits: ${s.text.charAt(0).toLowerCase() + s.text.slice(1)}?`,
        { text: s.ans, why: s.why },
        all
          .filter((d) => d !== s.ans)
          .slice(0, 3)
          .map((d) => ({ text: d, why: s.why, ...(s.ans === "Hypergeometric" && d === "Binomial" ? { misconception: "hypergeom-as-binomial" } : {}) })),
      );
    },
  },
];
