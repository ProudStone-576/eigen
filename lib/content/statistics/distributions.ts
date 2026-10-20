import type { ConceptNode, Unit } from "@/lib/content/types";
import { deepen } from "../deepen";
import { DISTRIBUTIONS_DEPTH } from "./distributions.depth";
import { node as mgf } from "../sections/mgf";
import { node as lln } from "../sections/lln-inequalities";
import { node as discreteFamily } from "../sections/discrete-family";
import { node as continuousFamily } from "../sections/continuous-family";
import { node as multivariateNormal } from "../sections/multivariate-normal";
import { node as mixtures } from "../sections/mixtures";
import { node as samplingDistributions } from "../sections/sampling-distributions";

const binomial: ConceptNode = {
  id: "binomial",
  title: "Bernoulli & binomial",
  summary: "Count successes in n independent trials with the same chance p: $P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}$, with mean np and variance np(1 − p).",
  deps: ["independence", "expectation"],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "Bernoulli trial", meaning: "One yes/no experiment with success probability p." },
    { term: "binomial", meaning: "The number of successes in n independent Bernoulli trials with the same p." },
    { term: "n choose k", meaning: "$\\binom{n}{k}$: the number of ways to pick which k of the n trials are the successes." },
  ],
  misconceptions: {
    "binom-forget-choose": "Multiplies $p^k(1-p)^{n-k}$ but forgets to count the arrangements, $\\binom{n}{k}$.",
    "binom-not-independent": "Uses the binomial when the trials aren't independent or the chance changes between trials.",
  },
  steps: [
    {
      type: "motivate",
      title: "Counting yes/no outcomes",
      body: "How many of 20 patients respond to a drug? How many of 1,000 visitors click \"buy\"? How many free throws go in? All the same shape: n tries, each a yes or no.",
      realWorld: {
        title: "A/B testing",
        body: "When a website tests two button colours, each group's click count is modelled as binomial: n visitors, each clicking with some unknown chance p.",
      },
    },
    {
      type: "explore",
      title: "Shape the distribution",
      body: "Each bar is P(X = k): the chance of exactly k successes.",
      widget: { kind: "binomial", n: 10, p: 0.5 },
      task: "Set p = 0.1, then 0.9. Where does the peak go? Now push n up to 40: what happens to the shape?",
    },
    {
      type: "truth",
      statement: "If X counts successes in n **independent** trials, each with the **same** success chance p, then $P(X = k) = \\binom{n}{k}p^k(1-p)^{n-k}$.",
      body: "$p^k(1-p)^{n-k}$ is the chance of one particular order of k successes and n − k failures; $\\binom{n}{k}$ counts the orders. The mean is np and the variance np(1 − p). A single trial (n = 1) is a **Bernoulli** variable.",
    },
    {
      type: "predict",
      misconception: "binom-forget-choose",
      item: {
        kind: "mc",
        id: "binom-predict-1",
        prompt: "Flip 3 fair coins. What is P(exactly 2 heads)?",
        options: [
          { id: "a", text: "3/8", correct: true, why: "HHT, HTH and THH: 3 orders of 1/8 each." },
          { id: "b", text: "1/8", misconception: "binom-forget-choose", why: "That's one particular order. Count all of them." },
          { id: "c", text: "2/3", why: "That's 2 out of 3 coins, not a probability." },
        ],
      },
      reveal: {
        body: "List them: HHT, HTH, THH. Each has probability $(1/2)^3 = 1/8$, and there are $\\binom{3}{2} = 3$ of them, so $3/8$. Set n = 3, p = 0.5 and read the bar at k = 2.",
        widget: { kind: "binomial", n: 3, p: 0.5 },
      },
      resolve: {
        kind: "mc",
        id: "binom-resolve-1",
        prompt: "Why multiply by $\\binom{n}{k}$?",
        options: [
          { id: "a", text: "It counts the different orders the successes can come in", correct: true, why: "Each order is a separate outcome with the same probability." },
          { id: "b", text: "You don't need to: one order covers it", misconception: "binom-forget-choose", why: "HHT and HTH are different outcomes; both count." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "binom-check-1",
        prompt: "A player makes 80% of free throws. P(exactly 4 of the next 5)?",
        options: [
          { id: "a", text: "About 0.41", correct: true, why: "$\\binom{5}{4}(0.8)^4(0.2) = 5 \\times 0.4096 \\times 0.2 \\approx 0.41$." },
          { id: "b", text: "About 0.08", misconception: "binom-forget-choose", why: "That's one order. The miss could be any of 5 shots." },
          { id: "c", text: "0.8", why: "That's the chance of one shot." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "binom-check-2",
        prompt: "Deal 5 cards without putting them back and count the hearts. Is that exactly binomial?",
        options: [
          { id: "a", text: "No: the chance of a heart changes after each card", correct: true, why: "Without replacement, the trials aren't independent with a fixed p." },
          { id: "b", text: "Yes: 5 trials, success = heart", misconception: "binom-not-independent", why: "After a heart is dealt, fewer hearts remain." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "binom-check-3",
        prompt: "Which of these is binomial?",
        options: [
          { id: "a", text: "The number of 6s in 10 rolls of a fair die", correct: true, why: "10 independent trials, each with p = 1/6." },
          { id: "b", text: "The number of rainy days in a week, when rain tends to follow rain", misconception: "binom-not-independent", why: "Days depend on each other." },
          { id: "c", text: "The number of rolls until the first 6", why: "The number of trials isn't fixed: that's a geometric variable." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model's number of correct answers on a test set of n examples is (roughly) binomial. That's why accuracy measured on only 100 examples can wobble by several percentage points from one test set to the next.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "binom-produce-1", prompt: "X is binomial with n = 20 and p = 0.3. What is its mean?", answer: 6, explain: "np = 20 × 0.3." },
        { kind: "number", id: "binom-produce-2", prompt: "Same X (n = 20, p = 0.3). What is its variance?", answer: 4.2, explain: "np(1 − p) = 6 × 0.7." },
        { kind: "number", id: "binom-produce-3", prompt: "n = 4, p = 0.5. What is P(X = 0)?", answer: 0.0625, explain: "$(0.5)^4 = 1/16$." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "binom-review-1", prompt: "You guess all 10 questions on a quiz with 4 options each. Expected number right?", answer: 2.5, explain: "np = 10 × 0.25." },
  ],
};

const poisson: ConceptNode = {
  id: "poisson",
  title: "Poisson: counting rare events",
  summary: "Counts of events that happen independently at a steady average rate λ follow a Poisson distribution: $P(X = k) = e^{-\\lambda}\\lambda^k/k!$, with mean and variance both λ.",
  deps: ["binomial"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "rate λ", meaning: "The average number of events in the window you're counting over (per hour, per page, per day)." },
    { term: "Poisson", meaning: "A count with no upper limit: 0, 1, 2, … events in a fixed window." },
  ],
  misconceptions: {
    "poisson-rate-scale": "Keeps the same λ when the time window changes, instead of rescaling it.",
    "poisson-bounded": "Thinks a Poisson count has a maximum, as if the average were a ceiling.",
  },
  steps: [
    {
      type: "motivate",
      title: "Many chances, each rare",
      body: "Thousands of cars pass a junction each day, and each has a tiny chance of crashing. Thousands of people could call a help desk this hour. How many events should you expect, and how much will that count jump around?",
      realWorld: {
        title: "Staffing a call centre",
        body: "Call centres size their shifts from a Poisson model of arrivals: enough agents for the busy hours the model says will happen.",
      },
    },
    {
      type: "explore",
      title: "Rare events, many chances",
      body: "This is a binomial with many trials and a small p: 40 chances, each 5%.",
      widget: { kind: "binomial", n: 40, p: 0.05 },
      task: "Note the mean np = 2 and the shape. Poisson(2) looks almost identical. Slide p up: when does it stop looking like a rare-event count?",
    },
    {
      type: "truth",
      statement: "If events happen independently at a constant average rate, the count X in a window with average λ follows $P(X = k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}$ for k = 0, 1, 2, …",
      body: "Its mean and variance are both λ. λ belongs to a window: 6 calls per hour is 2 per 20 minutes. A binomial with large n and small p is approximately Poisson with λ = np.",
    },
    {
      type: "predict",
      misconception: "poisson-rate-scale",
      item: {
        kind: "mc",
        id: "pois-predict-1",
        prompt: "A help desk gets an average of 6 calls per hour. How many calls should you expect in 20 minutes?",
        options: [
          { id: "a", text: "2", correct: true, why: "20 minutes is a third of an hour: 6 / 3." },
          { id: "b", text: "6", misconception: "poisson-rate-scale", why: "6 is the rate per *hour*." },
          { id: "c", text: "18", why: "That multiplies instead of dividing." },
        ],
      },
      reveal: {
        body: "λ is always \"per window\". 6 per 60 minutes means 2 per 20 minutes, so for a 20-minute window use Poisson(2). Change the window, rescale λ, then compute.",
      },
      resolve: {
        kind: "mc",
        id: "pois-resolve-1",
        prompt: "Calls average 6 per hour. Which λ should you use for a 2-hour shift?",
        options: [
          { id: "a", text: "12", correct: true, why: "Twice the window, twice the rate." },
          { id: "b", text: "6", misconception: "poisson-rate-scale", why: "That's per hour; the shift is two hours." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pois-check-1",
        prompt: "Typos average 3 per page. Can a page have 10 typos?",
        options: [
          { id: "a", text: "Yes, it's just very unlikely", correct: true, why: "A Poisson count can be any whole number; big ones are rare." },
          { id: "b", text: "No: 3 is the most a page can have", misconception: "poisson-bounded", why: "3 is the *average*, not a limit." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pois-check-2",
        prompt: "A website averages 1 crash per month. Under a Poisson model, which counts are impossible?",
        options: [
          { id: "a", text: "None of 0, 1, 2, 3, …: every count is possible", correct: true, why: "There's no ceiling, only rarer and rarer counts." },
          { id: "b", text: "Anything above 1", misconception: "poisson-bounded", why: "Two crashes in a month happens about 18% of the time." },
          { id: "c", text: "0, since it averages 1", why: "Zero crashes is quite likely: $e^{-1} \\approx 0.37$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pois-check-3",
        prompt: "λ = 2. What is P(no events)?",
        options: [
          { id: "a", text: "About 0.14", correct: true, why: "$e^{-2} \\approx 0.135$." },
          { id: "b", text: "0", misconception: "poisson-bounded", why: "Zero events is perfectly possible." },
          { id: "c", text: "0.5", why: "Use $e^{-\\lambda}$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Poisson regression models counts such as clicks, arrivals or defects, and PyTorch's PoissonNLLLoss is just the negative log-likelihood of a Poisson. Using squared error on counts ignores that a count's variance grows with its mean.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "pois-produce-1", prompt: "X is Poisson with λ = 3. What is its variance?", answer: 3, explain: "For a Poisson, variance = mean = λ." },
        { kind: "number", id: "pois-produce-2", prompt: "λ = 1. P(X = 0), to two decimals?", answer: 0.37, tolerance: 0.01, explain: "$e^{-1} \\approx 0.368$." },
        { kind: "number", id: "pois-produce-3", prompt: "You get 12 emails an hour on average. What λ describes a 15-minute window?", answer: 3, explain: "A quarter of an hour: 12 / 4." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "pois-review-1", prompt: "λ = 2. P(X = 1), to two decimals?", answer: 0.27, tolerance: 0.01, explain: "$2e^{-2} \\approx 0.271$." },
  ],
};

const continuous: ConceptNode = {
  id: "uniform-exponential",
  title: "Uniform & exponential",
  summary: "For a continuous variable, probability is area under the density; any exact value has probability 0. Uniform spreads area evenly; the exponential models waiting times and has no memory.",
  deps: ["random-variable"],
  pos: { x: 1, y: 2 },
  glossary: [
    { term: "density", meaning: "A curve whose area over a range gives the probability of landing in that range." },
    { term: "uniform", meaning: "Every value between a and b equally likely: a flat density of height 1/(b − a)." },
    { term: "exponential", meaning: "The waiting time until the next event, when events arrive at rate λ: P(T > t) = $e^{-\\lambda t}$." },
  ],
  misconceptions: {
    "density-is-probability": "Reads the height of a density as a probability, so a single exact value seems to have a chance.",
    "exp-memory": "Thinks waiting \"builds up\": having already waited makes the event due sooner.",
  },
  steps: [
    {
      type: "motivate",
      title: "When values aren't countable",
      body: "A bus could arrive at 3.1 minutes, 3.14 minutes, 3.14159 minutes… With infinitely many possible values, you can't list a probability for each one. You need area.",
      realWorld: {
        title: "Hardware reliability",
        body: "Engineers model the time until a component fails. For parts that don't wear out, like many electronics, the exponential distribution fits well.",
      },
    },
    {
      type: "explore",
      title: "Raw waiting times",
      body: "With sample size 1, each draw is one raw exponential waiting time with mean 1.",
      widget: { kind: "clt" },
      task: "Choose n = 1 and draw. Most waits are short, but a few are long: that long right tail is the exponential's signature.",
    },
    {
      type: "truth",
      statement: "For a continuous variable, **probability is area under the density curve**. A single exact value has zero width, so zero probability.",
      body: "**Uniform(a, b)**: density 1/(b − a), so P(c < X < d) = (d − c)/(b − a), and the mean is (a + b)/2. **Exponential(λ)**: the waiting time between events arriving at rate λ, with P(T > t) = $e^{-\\lambda t}$ and mean 1/λ. It's **memoryless**: having waited already doesn't change the wait ahead.",
    },
    {
      type: "predict",
      misconception: "density-is-probability",
      item: {
        kind: "mc",
        id: "cont-predict-1",
        prompt: "A bus arrives at a uniformly random time in the next 10 minutes. What is P(it arrives at exactly 3 minutes, to infinite precision)?",
        options: [
          { id: "a", text: "0", correct: true, why: "A single instant has no width, so no area." },
          { id: "b", text: "1/10", misconception: "density-is-probability", why: "1/10 is the density's height, per minute, not a probability." },
          { id: "c", text: "3/10", why: "That's P(within the first 3 minutes)." },
        ],
      },
      reveal: {
        body: "The density is 1/10 everywhere on [0, 10]. Probability is area: P(between 3 and 4 minutes) = 1 × 1/10 = 0.1, and P(between 3 and 3.001) = 0.0001. Shrink the width to nothing and the area is 0.",
      },
      resolve: {
        kind: "mc",
        id: "cont-resolve-1",
        prompt: "So what does the density's height, 1/10, mean?",
        options: [
          { id: "a", text: "Probability per minute: multiply by a width to get a probability", correct: true, why: "Like speed: it needs a time interval to become a distance." },
          { id: "b", text: "The chance of each exact arrival time", misconception: "density-is-probability", why: "Exact times have probability 0." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cont-check-1",
        prompt: "X is uniform on [0, 10]. What is P(2 < X < 5)?",
        options: [
          { id: "a", text: "0.3", correct: true, why: "Width 3 times height 1/10." },
          { id: "b", text: "0.1", misconception: "density-is-probability", why: "That's the height; multiply by the width, 3." },
          { id: "c", text: "3", why: "A probability can't exceed 1: divide by the total width 10." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cont-check-2",
        prompt: "Light bulbs fail at exponential times with a mean life of 1,000 hours. One bulb has already run 1,000 hours. What's its expected *remaining* life?",
        options: [
          { id: "a", text: "1,000 hours", correct: true, why: "Memoryless: a working bulb is as good as new." },
          { id: "b", text: "0 hours: it's due to fail", misconception: "exp-memory", why: "The exponential doesn't wear out." },
          { id: "c", text: "500 hours", why: "The past doesn't shorten the future here." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cont-check-3",
        prompt: "Customers arrive at random, steady times (a Poisson process). You've waited 5 minutes with no one. Is the next arrival now due sooner?",
        options: [
          { id: "a", text: "No: the wait ahead has the same distribution as when you started", correct: true, why: "Exponential waits are memoryless." },
          { id: "b", text: "Yes: someone must be due by now", misconception: "exp-memory", why: "That's the gambler's fallacy in continuous time." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Random hyperparameter search often samples learning rates *log-uniformly* (uniform on the exponent), so 0.0001 and 0.1 are explored equally. Time-to-event models (churn, failure, survival) start from the exponential and generalise it.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "cont-produce-1", prompt: "X is uniform on [2, 6]. What is its mean?", answer: 4, explain: "(2 + 6) / 2." },
        { kind: "number", id: "cont-produce-2", prompt: "Waiting times are exponential with λ = 0.5 per minute. Mean wait, in minutes?", answer: 2, explain: "1/λ = 2." },
        { kind: "number", id: "cont-produce-3", prompt: "Exponential with λ = 1. P(T > 2), to two decimals?", answer: 0.14, tolerance: 0.01, explain: "$e^{-2} \\approx 0.135$." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "cont-review-1", prompt: "X is uniform on [0, 20]. What is P(X < 5)?", answer: 0.25, explain: "5 × 1/20." },
  ],
};

const clt: ConceptNode = {
  id: "clt",
  title: "The central limit theorem",
  summary: "Averages of n independent draws from almost any population are approximately normal, centred on the population mean, with spread σ/√n. The data keeps its shape; the averages become a bell.",
  deps: ["normal", "uniform-exponential"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "sample mean", meaning: "$\\bar x$: the average of one sample of size n." },
    { term: "sampling distribution", meaning: "How a statistic like $\\bar x$ would vary if you repeated the sampling many times." },
  ],
  misconceptions: {
    "clt-data-becomes-normal": "Thinks the CLT makes the data itself normal, rather than the distribution of sample means.",
    "bigger-sample-wider": "Thinks averages of bigger samples are more spread out.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why is the bell curve everywhere?",
      body: "Heights, measurement errors, test scores: so much looks normal. The reason is that many things are *sums or averages* of lots of small independent pieces, and sums pile up into a bell almost regardless of what the pieces look like.",
      realWorld: {
        title: "Polling",
        body: "Each voter is a 0 or a 1, about as un-bell-like as it gets. But the average of 1,000 of them is very close to normal, which is what lets pollsters quote a margin of error.",
      },
    },
    {
      type: "explore",
      title: "Average the skewed population",
      body: "The dashed curve is the population: very right-skewed. The bars are 400 sample means.",
      widget: { kind: "clt" },
      task: "Draw with n = 1, 2, 5, 30. How does the shape change? How does the spread compare with $1/\\sqrt{n}$?",
    },
    {
      type: "truth",
      statement: "**Central limit theorem.** For independent draws from a population with mean μ and finite standard deviation σ, the sample mean $\\bar x$ is approximately normal with mean μ and standard deviation $\\sigma/\\sqrt{n}$, and the approximation improves as n grows.",
      body: "n ≈ 30 is a common rule of thumb; very skewed populations need more. The population doesn't change shape: only the distribution of *averages* does. Quadrupling n halves the spread of $\\bar x$.",
    },
    {
      type: "predict",
      misconception: "clt-data-becomes-normal",
      item: {
        kind: "mc",
        id: "clt-predict-1",
        prompt: "Waiting times are very right-skewed. You record 1,000 individual waits. Their histogram will look…",
        options: [
          { id: "a", text: "Still right-skewed", correct: true, why: "More individual values just show the population's shape more clearly." },
          { id: "b", text: "Bell-shaped: the CLT kicks in with big samples", misconception: "clt-data-becomes-normal", why: "The CLT is about averages, not individual values." },
          { id: "c", text: "Flat", why: "Nothing makes the data uniform." },
        ],
      },
      reveal: {
        body: "With n = 1 each bar is a single raw wait, as skewed as the population, and drawing more never changes that. Only when each point is the *average* of a sample (try n = 30) do the bars pile into a bell.",
        widget: { kind: "clt" },
      },
      resolve: {
        kind: "mc",
        id: "clt-resolve-1",
        prompt: "What does the CLT say becomes approximately normal?",
        options: [
          { id: "a", text: "The distribution of sample means", correct: true, why: "Averages of n values, repeated many times." },
          { id: "b", text: "The data, once you have enough of it", misconception: "clt-data-becomes-normal", why: "Skewed data stays skewed." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "clt-check-1",
        prompt: "From the same population, which spread out more: averages of samples of size 4, or of size 100?",
        options: [
          { id: "a", text: "Size 4", correct: true, why: "Spread is $\\sigma/\\sqrt{n}$: σ/2 against σ/10." },
          { id: "b", text: "Size 100: more data, more variety", misconception: "bigger-sample-wider", why: "Bigger samples average out the extremes." },
          { id: "c", text: "They spread the same", why: "The spread shrinks like $1/\\sqrt{n}$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "clt-check-2",
        prompt: "σ = 20. What is the standard deviation of $\\bar x$ for samples of n = 16?",
        options: [
          { id: "a", text: "5", correct: true, why: "$20/\\sqrt{16} = 20/4$." },
          { id: "b", text: "80", misconception: "bigger-sample-wider", why: "Divide by $\\sqrt{n}$; don't multiply." },
          { id: "c", text: "1.25", why: "Divide by $\\sqrt{16} = 4$, not by 16." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A mini-batch gradient is an average over the batch, so by the CLT it's roughly normal around the full-data gradient, with noise shrinking like $1/\\sqrt{\\text{batch size}}$. Quadrupling the batch only halves the noise, which is one reason giant batches give diminishing returns.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "clt-produce-1", prompt: "σ = 12 and n = 36. Standard deviation of the sample mean?", answer: 2, explain: "$12/\\sqrt{36}$." },
        { kind: "number", id: "clt-produce-2", prompt: "The population mean is 50. What is the mean of the sampling distribution of $\\bar x$ for n = 25?", answer: 50, explain: "Sample means centre on μ." },
        { kind: "number", id: "clt-produce-3", prompt: "To halve the spread of $\\bar x$, multiply the sample size by…", answer: 4, explain: "$\\sqrt{4} = 2$." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "clt-review-1", prompt: "σ = 9 and n = 81. Standard deviation of $\\bar x$?", answer: 1, explain: "$9/\\sqrt{81}$." },
  ],
};

const se: ConceptNode = {
  id: "standard-error",
  title: "Standard error",
  summary: "The standard deviation describes individuals; the standard error, $s/\\sqrt{n}$ for a mean or $\\sqrt{p(1-p)/n}$ for a proportion, describes how much an estimate would wobble from sample to sample.",
  deps: ["clt"],
  pos: { x: 4, y: 1 },
  glossary: [
    { term: "standard error (SE)", meaning: "The standard deviation of an estimate across repeated samples." },
    { term: "s", meaning: "The sample standard deviation, our estimate of σ." },
  ],
  misconceptions: {
    "se-is-sd": "Confuses the standard deviation of the data with the standard error of the mean.",
    "se-linear-n": "Thinks the standard error shrinks in proportion to n, instead of to √n.",
  },
  steps: [
    {
      type: "motivate",
      title: "How sure is the average?",
      body: "A study reports average sleep of 7.1 hours. Is the real average somewhere between 7.0 and 7.2, or anywhere from 5 to 9? The standard error answers that.",
      realWorld: {
        title: "Margins of error",
        body: "\"52% support, margin of error ±3%\": the margin is about two standard errors of the poll's proportion.",
      },
    },
    {
      type: "explore",
      title: "The spread of averages",
      body: "Each bar is a sample mean. Its spread is the standard error.",
      widget: { kind: "clt" },
      task: "Compare the measured spread of the averages with $\\sigma/\\sqrt{n}$ for n = 5, 10 and 50.",
    },
    {
      type: "truth",
      statement: "The **standard error of the mean** is $\\text{SE} = s/\\sqrt{n}$. For a proportion $\\hat p$ it's $\\sqrt{\\hat p(1-\\hat p)/n}$.",
      body: "The SD measures how much individuals vary, and it stays about the same as you collect more data. The SE measures how much the *estimate* would vary between samples, and it shrinks like $1/\\sqrt{n}$: four times the data halves it.",
    },
    {
      type: "predict",
      misconception: "se-is-sd",
      item: {
        kind: "mc",
        id: "se-predict-1",
        prompt: "400 adults: mean height 170 cm, SD 10 cm. How precisely does this pin down the population's mean height?",
        options: [
          { id: "a", text: "To within about 0.5 cm (one SE)", correct: true, why: "$10/\\sqrt{400} = 0.5$." },
          { id: "b", text: "To within about 10 cm", misconception: "se-is-sd", why: "10 cm is how much *individuals* vary." },
          { id: "c", text: "Exactly 170 cm", why: "Another sample would give a slightly different mean." },
        ],
      },
      reveal: {
        body: "People vary by about 10 cm from each other, but the *average* of 400 people wobbles far less between samples: SE = $10/\\sqrt{400}$ = 0.5 cm. Individual spread and estimate precision are different questions.",
      },
      resolve: {
        kind: "mc",
        id: "se-resolve-1",
        prompt: "You collect a much bigger sample. What happens to the SD and the SE?",
        options: [
          { id: "a", text: "The SD stays about the same; the SE shrinks", correct: true, why: "People don't get less varied; the estimate gets more precise." },
          { id: "b", text: "Both shrink", misconception: "se-is-sd", why: "The SD describes individuals, who vary just as much." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "se-check-1",
        prompt: "SE is 4 with n = 100. What n gives SE = 2?",
        options: [
          { id: "a", text: "400", correct: true, why: "Halving the SE needs $\\sqrt{n}$ to double, so n quadruples." },
          { id: "b", text: "200", misconception: "se-linear-n", why: "Doubling n only divides the SE by $\\sqrt 2$." },
          { id: "c", text: "50", why: "Fewer data makes the SE bigger." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "se-check-2",
        prompt: "Going from n = 25 to n = 100, the standard error…",
        options: [
          { id: "a", text: "Halves", correct: true, why: "$\\sqrt{100}/\\sqrt{25} = 2$." },
          { id: "b", text: "Quarters", misconception: "se-linear-n", why: "It shrinks like $\\sqrt{n}$, not n." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "se-check-3",
        prompt: "A poll finds 600 of 1,000 say yes. Standard error of the proportion?",
        options: [
          { id: "a", text: "About 0.015", correct: true, why: "$\\sqrt{0.6 \\times 0.4 / 1000} \\approx 0.0155$." },
          { id: "b", text: "About 0.49", misconception: "se-is-sd", why: "$\\sqrt{0.6 \\times 0.4}$ is one person's SD. Divide by n inside the root." },
          { id: "c", text: "0.24", why: "That's p(1 − p). Divide by n and take the square root." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Report test accuracy with its SE. 92% accuracy on 500 test examples has SE $\\sqrt{0.92 \\times 0.08/500} \\approx 1.2\\%$, so 92% against 93% on that test set is no real difference.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "se-produce-1", prompt: "s = 15 and n = 25. Standard error of the mean?", answer: 3, explain: "$15/\\sqrt{25}$." },
        { kind: "number", id: "se-produce-2", prompt: "$\\hat p$ = 0.5 and n = 100. Standard error of the proportion?", answer: 0.05, explain: "$\\sqrt{0.25/100}$." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "se-review-1", prompt: "s = 8 and n = 64. Standard error of the mean?", answer: 1, explain: "$8/\\sqrt{64}$." },
  ],
};

export const distributionsUnit: Unit = {
  id: "st-3",
  track: "Statistics",
  title: "Distributions & the CLT",
  blurb: "Binomial, Poisson, uniform and exponential, and why averages always end up bell-shaped.",
  nodes: [
    deepen(binomial, DISTRIBUTIONS_DEPTH[binomial.id]),
    discreteFamily,
    ...[poisson, continuous].map((n) => deepen(n, DISTRIBUTIONS_DEPTH[n.id])),
    mgf,
    continuousFamily,
    multivariateNormal,
    mixtures,
    lln,
    deepen(clt, DISTRIBUTIONS_DEPTH[clt.id]),
    samplingDistributions,
    deepen(se, DISTRIBUTIONS_DEPTH[se.id]),
  ],
};
