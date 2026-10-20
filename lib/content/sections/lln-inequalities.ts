import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Markov and Chebyshev inequalities, the weak law of large numbers, Hoeffding's bound. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "lln-inequalities",
  title: "The law of large numbers & tail bounds",
  summary: "Markov's and Chebyshev's inequalities bound tail probabilities using only a mean and a variance. Chebyshev gives the weak law of large numbers: the mean of n independent draws lands within any ε of μ with probability tending to 1.",
  deps: ["variance", "binomial"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "tail probability", meaning: "The chance of a value far from the centre, such as $P(|X - \\mu| \\ge k\\sigma)$." },
    { term: "law of large numbers", meaning: "The mean of many independent draws settles at the population mean." },
    { term: "convergence in probability", meaning: "$X_n \\to c$ if the chance that $X_n$ is more than any fixed distance from $c$ tends to 0." },
  ],
  misconceptions: {
    "gamblers-fallacy": "Thinks the law of large numbers works by compensation: after a run of heads, tails becomes more likely.",
    "chebyshev-exact": "Treats Chebyshev's bound as the actual probability instead of a guaranteed upper limit.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why averages settle",
      body: "A casino loses on some nights, but over millions of bets its takings per bet settle at the house edge. Polls, insurance and simulations rest on the same fact: averages of many independent draws settle down.",
      realWorld: {
        title: "Monte Carlo",
        body: "A simulation estimates a probability by the fraction of runs in which the event happens. The law of large numbers guarantees the fraction converges; Chebyshev's or Hoeffding's inequality says how many runs are enough.",
      },
    },
    {
      type: "explore",
      title: "Flip and watch",
      body: "The line is the running fraction of heads.",
      widget: { kind: "sim", die: false },
      task: "Flip 10 coins, then keep going to 1,000. How far is the fraction from 0.5 after 10 flips, and after 1,000? Does an early run of heads ever get \"paid back\"?",
    },
    {
      type: "truth",
      statement: "**Markov**: for $X \\ge 0$ and $a > 0$, $P(X \\ge a) \\le \\dfrac{E[X]}{a}$. **Chebyshev**: $P(|X - \\mu| \\ge k\\sigma) \\le \\dfrac{1}{k^2}$. **Weak law of large numbers**: for independent draws with mean $\\mu$ and finite variance, $P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\to 0$ for every $\\varepsilon > 0$.",
      body: "The inequalities hold for *every* distribution, which makes them loose: a normal value is 2σ out with probability 0.046, while Chebyshev promises only at most 0.25. The law of large numbers doesn't balance past results; it dilutes them. A surplus of 10 heads matters less and less as the tosses pile up.",
    },
    {
      type: "predict",
      misconception: "gamblers-fallacy",
      item: {
        kind: "mc",
        id: "lln-predict-1",
        prompt: "A fair coin has landed heads 8 times in a row. The probability that the next toss is tails is",
        options: [
          { id: "a", text: "1/2: the coin has no memory", correct: true, why: "Tosses are independent." },
          { id: "b", text: "more than 1/2: the law of large numbers evens things out", misconception: "gamblers-fallacy", why: "The law works by dilution, not compensation." },
          { id: "c", text: "less than 1/2: the coin is on a streak", why: "A fair coin has no streaks to keep up." },
        ],
      },
      reveal: {
        body: "Each toss is 50:50 whatever came before. After the 8 extra heads, 1,000 more fair tosses give about 508 heads in 1,008, a fraction of 0.504. The surplus of 8 is never cancelled; it just stops mattering. Run the simulator and watch early swings fade without being reversed.",
      },
      resolve: {
        kind: "mc",
        id: "lln-resolve-1",
        prompt: "How does the running fraction of heads approach 0.5?",
        options: [
          { id: "a", text: "Early surpluses are diluted by many later tosses", correct: true, why: "The count of heads can drift; the fraction still settles." },
          { id: "b", text: "Later tosses favour tails to cancel early heads", misconception: "gamblers-fallacy", why: "Every toss is still 50:50." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lln-check-1",
        prompt: "$X$ has mean 50 and SD 5. What does Chebyshev's inequality say about $P(|X - 50| \\ge 10)$?",
        options: [
          { id: "a", text: "It is at most 0.25", correct: true, why: "$k = 2$, so the bound is $1/4$." },
          { id: "b", text: "It equals 0.25", misconception: "chebyshev-exact", why: "It is only an upper limit; the true value depends on the distribution." },
          { id: "c", text: "It is at least 0.25", why: "Chebyshev gives an upper bound." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lln-check-2",
        prompt: "Waiting times have mean 4 minutes. By Markov's inequality, $P(\\text{wait} \\ge 20)$ is at most",
        options: [
          { id: "a", text: "0.2", correct: true, why: "$4/20$." },
          { id: "b", text: "0.8", why: "That is $1 - 4/20$." },
          { id: "c", text: "0.04", why: "Markov divides the mean by the threshold." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training loss is an average over examples, so as data grows it approaches the expected loss, and the gap between training and test error shrinks. Concentration inequalities such as Hoeffding's, sharper relatives of Chebyshev's, turn this into guarantees about how far accuracy on a held-out set of $n$ examples can be from the true accuracy.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "lln-produce-1", prompt: "Chebyshev: find the bound on $P(|X - \\mu| \\ge 3\\sigma)$. Give an exact fraction or 3 decimal places.", answer: 1 / 9, tolerance: 0.0005, explain: "$1/k^2$ with $k = 3$." },
        { kind: "number", id: "lln-produce-2", prompt: "$X \\ge 0$ has mean 3. Markov: find the bound on $P(X \\ge 12)$.", answer: 0.25, explain: "$3/12$." },
        {
          kind: "mc",
          id: "lln-produce-3",
          prompt: "For normal data, Chebyshev's bound of 0.25 on being at least 2σ from the mean is",
          options: [
            { id: "a", text: "true but loose: the actual probability is about 0.046", correct: true, why: "It must hold for every distribution, so it is cautious." },
            { id: "b", text: "the exact probability", misconception: "chebyshev-exact", why: "For normal data it is 0.046." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "lln-review-1", prompt: "By Chebyshev, at least what fraction of any distribution lies within 2 SD of its mean?", answer: 0.75, explain: "$1 - 1/4$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "weak and strong laws",
      body: "$\\bar X_n$ converges to $\\mu$ **in probability** (the weak law) if $P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\to 0$ for every $\\varepsilon > 0$. The **strong law** says more: with probability 1, the sequence $\\bar X_1, \\bar X_2, \\dots$ converges to $\\mu$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "Markov's inequality",
      statement: "If $X \\ge 0$ and $a > 0$, then $P(X \\ge a) \\le E[X]/a$.",
      proof: ["$E[X] \\ge E[X \\cdot \\mathbf{1}\\{X \\ge a\\}] \\ge a\\,P(X \\ge a)$: drop the part of the mean below $a$, then replace each remaining value by at least $a$."],
    },
    {
      type: "theorem",
      name: "Chebyshev's inequality",
      statement: "$P(|X - \\mu| \\ge k\\sigma) \\le 1/k^2$ for every $k > 0$; equivalently, at least $1 - 1/k^2$ of any distribution lies within $k\\sigma$ of the mean.",
      proof: ["Apply Markov to the non-negative variable $(X - \\mu)^2$ with $a = k^2\\sigma^2$: $P\\big((X - \\mu)^2 \\ge k^2\\sigma^2\\big) \\le \\dfrac{\\sigma^2}{k^2\\sigma^2}$."],
    },
    {
      type: "theorem",
      name: "weak law of large numbers",
      statement: "For independent draws with mean $\\mu$ and variance $\\sigma^2$, $P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le \\dfrac{\\sigma^2}{n\\varepsilon^2} \\to 0$. So $n \\ge \\dfrac{\\sigma^2}{\\delta\\varepsilon^2}$ guarantees $P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le \\delta$.",
      proof: ["$\\operatorname{Var}(\\bar X_n) = \\sigma^2/n$ (§{clt}); apply Chebyshev to $\\bar X_n$ with $k\\sigma = \\varepsilon$."],
    },
    {
      type: "theorem",
      name: "Hoeffding's inequality",
      statement: "If the draws lie in $[0, 1]$, then $P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le 2e^{-2n\\varepsilon^2}$, which shrinks exponentially in $n$, much faster than Chebyshev's $1/n$.",
      proof: ["Apply Markov to $e^{t(\\bar X_n - \\mu)}$, bound the MGF of each bounded term (§{mgf}), and choose the best $t$. The details are beyond this book."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Test scores have mean 70 and SD 10. What can be said, without knowing the distribution, about the share of scores between 50 and 90?",
      solution: ["50 to 90 is within $k = 2$ SDs.", "Chebyshev: at least $1 - 1/4 = 75\\%$ lie inside."],
      result: "At least 75%.",
    },
    {
      type: "example",
      level: 2,
      title: "how loose the bound is",
      problem: "Compare Chebyshev's bound on $P(|X - \\mu| \\ge 2\\sigma)$ with the exact value for a normal distribution.",
      solution: ["Chebyshev: at most $1/4 = 0.25$.", "Normal: $2(1 - \\Phi(2)) = 2(0.0228) = 0.0456$, about five times smaller."],
      result: "0.25 against 0.046.",
    },
    {
      type: "example",
      level: 3,
      title: "how many tosses",
      problem: "To estimate a coin's $p$ within 0.05 with probability at least 0.95, how many tosses do Chebyshev and Hoeffding each guarantee are enough?",
      solution: [
        "Chebyshev: $\\operatorname{Var}(\\hat p) \\le \\tfrac{1}{4n}$, so we need $\\dfrac{1}{4n(0.05)^2} \\le 0.05$: $n \\ge 2000$.",
        "Hoeffding: $2e^{-2n(0.0025)} \\le 0.05$ means $e^{-0.005n} \\le 0.025$: $n \\ge \\ln 40/0.005 \\approx 738$.",
        "The normal approximation (§{confidence-intervals}) suggests about 385: the guarantees pay for assuming nothing.",
      ],
      result: "2000 (Chebyshev), 738 (Hoeffding).",
    },
  ],
  pitfalls: [
    { wrong: "After a run of heads, tails is due.", right: "Each toss is independent; the law of large numbers dilutes runs, it doesn't reverse them." },
    { wrong: "Chebyshev's bound is the probability.", right: "It is a ceiling that holds for every distribution; real tails are usually much lighter." },
    { wrong: "The law of averages works in 10 tosses.", right: "It is about large $n$; in 10 fair tosses exactly 5 heads happens only about 25% of the time." },
  ],
  formulas: [
    { label: "Markov", tex: "P(X \\ge a) \\le E[X]/a" },
    { label: "Chebyshev", tex: "P(|X - \\mu| \\ge k\\sigma) \\le 1/k^2" },
    { label: "Weak law", tex: "P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le \\dfrac{\\sigma^2}{n\\varepsilon^2}" },
    { label: "Hoeffding", tex: "P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le 2e^{-2n\\varepsilon^2}" },
  ],
  exercises: [
    ex(1, fr("llnx-ex-1", "By Chebyshev, at least what fraction of any distribution lies within 3 SD of the mean?", 8 / 9, "$1 - 1/9$."), ["$1 - 1/3^2 = \\tfrac89$."]),
    ex(1, num("llnx-ex-2", "$X \\ge 0$ has mean 5. Markov: find the bound on $P(X \\ge 25)$.", 0.2, "$5/25$."), ["$0.2$."]),
    ex(2, num("llnx-ex-3", "$X$ has mean 100 and SD 15. Find Chebyshev's bound on $P(|X - 100| \\ge 30)$.", 0.25, "$k = 2$."), ["$1/4 = 0.25$."]),
    ex(2, num("llnx-ex-4", "For which $k$ does Chebyshev guarantee that at least 96% lies within $k\\sigma$?", 5, "$1/k^2 = 0.04$."), ["$k^2 = 25$, so $k = 5$."]),
    ex(2, num("llnx-ex-5", "$\\sigma^2 = 9$ and $n = 100$. Find Chebyshev's bound on $P(|\\bar X - \\mu| \\ge 0.5)$.", 0.36, "$\\sigma^2/(n\\varepsilon^2)$."), ["$\\dfrac{9}{100 \\times 0.25} = 0.36$."]),
    ex(3, num("llnx-ex-6", "$\\sigma = 2$. Using Chebyshev, how large must $n$ be to guarantee $P(|\\bar X - \\mu| \\ge 0.1) \\le 0.05$?", 8000, "$n \\ge \\sigma^2/(\\delta\\varepsilon^2)$."), ["$\\dfrac{4}{0.05 \\times 0.01} = 8000$."]),
    ex(3, num("llnx-ex-7", "Values lie in $[0, 1]$. Using Hoeffding, find the smallest $n$ with $2e^{-2n(0.1)^2} \\le 0.05$.", 185, "Take logs."), ["$e^{-0.02n} \\le 0.025$ gives $n \\ge \\ln 40/0.02 \\approx 184.4$, so 185."]),
    ex(3, num("llnx-ex-8", "$E[X^2] = 10$. Apply Markov to $X^2$ to bound $P(|X| \\ge 5)$.", 0.4, "$P(X^2 \\ge 25)$."), ["$10/25 = 0.4$."]),
    ex(3, mc("llnx-ex-9", "Roulette's red has come up 10 times running. A gambler bets on black because \"it's due\". The bet's chance of winning is", ["unchanged", "Spins are independent."], [["higher than usual", "That is the gambler's fallacy."], ["lower, because red is hot", "The wheel has no memory either way."]]), ["The law of large numbers dilutes streaks over many future spins; it never makes the next spin favour black."]),
    ex(3, mc("llnx-ex-10", "Does the law of large numbers say that 10 fair tosses give about 5 heads?", ["No: it is about the long run; exactly 5 has probability about 0.25", "$\\binom{10}{5}/2^{10} \\approx 0.246$."], [["Yes: about half are heads", "Ten tosses often give 3 or 7 heads."], ["Yes, exactly 5", "That happens only a quarter of the time."]]), ["The law describes the fraction as $n \\to \\infty$; small samples vary a lot."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r, lv) => {
      const mu = r.int(4, 20) * 5;
      const sd = r.pick([2, 4, 5, 10]);
      const k = r.pick(lv === 1 ? [2, 4, 5] : [1.5, 2, 2.5, 3, 4]);
      const b = 1 / (k * k);
      const within = lv === 3 && r.pick([true, false]);
      return within
        ? n(`$X$ has mean ${mu} and SD ${sd}. By Chebyshev, at least what fraction lies between ${mu - k * sd} and ${mu + k * sd}? (3 decimals)`, Math.round((1 - b) * 1000) / 1000, `$k = ${k}$, so at least $1 - 1/${k * k} \\approx ${Math.round((1 - b) * 1000) / 1000}$.`, 0.001)
        : n(`$X$ has mean ${mu} and SD ${sd}. Find Chebyshev's bound on $P(|X - ${mu}| \\ge ${k * sd})$ (3 decimals).`, Math.round(b * 1000) / 1000, `$k = ${k * sd}/${sd} = ${k}$, so the bound is $1/${k * k} \\approx ${Math.round(b * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r, lv) => {
      const m = r.int(2, 10) * (lv === 1 ? 1 : 2);
      const a = m * r.pick([2, 4, 5, 8, 10]);
      return n(`A non-negative quantity has mean ${m}. Find Markov's bound on $P(X \\ge ${a})$.`, r2(m / a), `$${m}/${a} = ${r2(m / a)}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const run = r.int(4, 12);
      const what = r.pick([
        { a: "heads", b: "tails", game: "A fair coin" },
        { a: "red", b: "black", game: "A fair roulette wheel (ignoring zero)" },
        { a: "an even number", b: "an odd number", game: "A fair die" },
      ]);
      return mcNumbers(
        `${what.game} has produced ${what.a} ${run} times in a row. What is the probability that the next is ${what.b}?`,
        { text: "1/2", why: "Each outcome is independent of the past." },
        [
          { text: "More than 1/2", why: "The law of large numbers dilutes runs; it doesn't reverse them.", misconception: "gamblers-fallacy" },
          { text: "Less than 1/2", why: "There is no streak effect for independent events." },
        ],
      );
    },
  },
];
