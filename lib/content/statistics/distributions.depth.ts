import { ex, mc, num, type Depth } from "../deepen";

/** Chapter 7 at exam depth: binomial, Poisson, uniform and exponential, the CLT, standard error. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
const TABLE = "Use $\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$.";

export const DISTRIBUTIONS_DEPTH: Record<string, Depth> = {
  // §7.1
  binomial: {
    definitions: [
      {
        type: "definition",
        term: "binomial variable",
        body: "$X \\sim \\mathrm{Bin}(n, p)$ counts the successes in $n$ independent trials, each succeeding with the same probability $p$. Write $q = 1 - p$. A single trial ($n = 1$) is a **Bernoulli** variable: $P(X = 1) = p$, $P(X = 0) = q$.",
      },
      {
        type: "definition",
        term: "geometric variable",
        body: "The number $Y$ of independent trials up to and including the first success has $P(Y = k) = q^{k-1}p$ for $k = 1, 2, \\dots$ and $E[Y] = 1/p$. Unlike the binomial, the number of trials is not fixed in advance.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "mean and variance",
        statement: "If $X \\sim \\mathrm{Bin}(n, p)$ then $E[X] = np$ and $\\operatorname{Var}(X) = npq$.",
        proof: [
          "Write $X = I_1 + \\dots + I_n$, where $I_j = 1$ if trial $j$ succeeds and 0 otherwise. Each $I_j$ has mean $p$ and variance $E[I_j^2] - p^2 = p - p^2 = pq$.",
          "Expectations always add (§5.3), giving $np$. The trials are independent, so the variances add too (§6.1), giving $npq$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "at least one",
        statement: "$P(X \\ge 1) = 1 - q^n$.",
        proof: ["The complement of at least one success is no successes, which has probability $q^n$."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "the most likely count",
        statement: "The mode of $\\mathrm{Bin}(n, p)$ is $\\lfloor (n + 1)p \\rfloor$. When $(n + 1)p$ is a whole number, both $(n + 1)p$ and $(n + 1)p - 1$ are modes.",
        proof: [
          "Consecutive probabilities have ratio $\\dfrac{P(X = k + 1)}{P(X = k)} = \\dfrac{(n - k)p}{(k + 1)q}$.",
          "This exceeds 1 exactly when $(n - k)p > (k + 1)q$, which rearranges to $k + 1 < (n + 1)p$. So the probabilities rise while $k + 1 < (n + 1)p$ and fall afterwards.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A fair coin is tossed 6 times. Find the probability of exactly 4 heads.",
        solution: ["$n = 6$, $p = \\tfrac12$, $k = 4$: $P = \\binom{6}{4}\\left(\\tfrac12\\right)^6$.", "$\\binom64 = 15$, so $P = \\tfrac{15}{64}$."],
        result: "$\\tfrac{15}{64} \\approx 0.234$.",
      },
      {
        type: "example",
        level: 2,
        title: "recovering n and p",
        problem: "A binomial variable has mean 4 and variance 3. Find $n$ and $p$.",
        solution: ["Divide: $\\dfrac{npq}{np} = q = \\dfrac34$, so $p = \\dfrac14$.", "$np = 4$ gives $n = 16$."],
        result: "$n = 16$, $p = \\tfrac14$.",
      },
      {
        type: "example",
        level: 3,
        title: "how many trials",
        problem: "How many times must a fair die be rolled for the chance of at least one six to exceed 0.9?",
        solution: [
          "Need $1 - \\left(\\tfrac56\\right)^n > 0.9$, i.e. $\\left(\\tfrac56\\right)^n < 0.1$.",
          "Take logs (both negative, so the inequality flips): $n > \\dfrac{\\ln 0.1}{\\ln(5/6)} \\approx 12.6$.",
          "Check: $(5/6)^{12} \\approx 0.112$ is too big, $(5/6)^{13} \\approx 0.093$ works.",
        ],
        result: "13 rolls.",
      },
    ],
    pitfalls: [
      { wrong: "$P(X = k) = p^k q^{n-k}$.", right: "That is one particular order. Multiply by $\\binom{n}{k}$, the number of orders." },
      { wrong: "$P(\\text{at least one}) = np$.", right: "$np$ is the expected count and can exceed 1. Use $1 - q^n$." },
      { wrong: "Drawing without replacement is binomial.", right: "The chance changes after every draw, so the trials are not independent with a fixed $p$." },
    ],
    formulas: [
      { label: "Probability", tex: "P(X = k) = \\binom{n}{k}p^k q^{n-k}" },
      { label: "Mean, variance", tex: "E[X] = np,\\quad \\operatorname{Var}(X) = npq" },
      { label: "At least one", tex: "P(X \\ge 1) = 1 - q^n" },
      { label: "Geometric", tex: "P(Y = k) = q^{k-1}p,\\quad E[Y] = 1/p" },
    ],
    exercises: [
      ex(1, num("bin-ex-1", "$X \\sim \\mathrm{Bin}(10, 0.4)$. Find $E[X]$.", 4, "$np$."), ["$10 \\times 0.4 = 4$."]),
      ex(1, num("bin-ex-2", "$X \\sim \\mathrm{Bin}(50, 0.2)$. Find $\\operatorname{Var}(X)$.", 8, "$npq$."), ["$50 \\times 0.2 \\times 0.8 = 8$."]),
      ex(1, fr("bin-ex-3", "A fair coin is tossed 5 times. Find the probability of exactly 3 heads.", C(5, 3) / 32, "$\\binom53/2^5$."), ["$\\binom53 = 10$ orders, each with probability $\\tfrac{1}{32}$: $\\tfrac{10}{32} = \\tfrac{5}{16}$."]),
      ex(2, dp("bin-ex-4", "Find the probability of at least one six in 4 rolls of a fair die.", 1 - (5 / 6) ** 4, "$1 - (5/6)^4$."), ["$1 - \\left(\\tfrac56\\right)^4 = 1 - \\tfrac{625}{1296} \\approx 0.518$."]),
      ex(2, num("bin-ex-5", "A binomial variable has mean 6 and variance 4.2. Find $n$.", 20, "$q = 4.2/6$."), ["$q = 4.2/6 = 0.7$, so $p = 0.3$ and $n = 6/0.3 = 20$."]),
      ex(2, fr("bin-ex-6", "$X \\sim \\mathrm{Bin}(4, \\tfrac12)$. Find $P(X \\le 1)$.", 5 / 16, "$P(0) + P(1)$."), ["$P(0) = \\tfrac{1}{16}$ and $P(1) = \\tfrac{4}{16}$, total $\\tfrac{5}{16}$."]),
      ex(2, num("bin-ex-7", "Find the most likely value of $X \\sim \\mathrm{Bin}(10, 0.3)$.", 3, "$\\lfloor (n+1)p \\rfloor$."), ["$(n + 1)p = 3.3$, so the mode is 3."]),
      ex(3, num("bin-ex-8", "What is the smallest number of fair-coin tosses for which the chance of at least one head is at least 0.99?", 7, "$1 - 2^{-n} \\ge 0.99$."), ["Need $2^{-n} \\le 0.01$, i.e. $2^n \\ge 100$.", "$2^6 = 64$ is too small and $2^7 = 128$ works: $n = 7$."]),
      ex(3, fr("bin-ex-9", "A student guesses all 5 questions of a test with 4 options each. Find the probability of at least 4 correct.", (C(5, 4) * 3 + 1) / 4 ** 5, "$P(4) + P(5)$ with $p = \\tfrac14$."), [
        "$P(4) = \\binom54\\left(\\tfrac14\\right)^4\\tfrac34 = \\tfrac{15}{1024}$ and $P(5) = \\tfrac{1}{1024}$.",
        "Total $\\tfrac{16}{1024} = \\tfrac{1}{64}$.",
      ]),
      ex(3, fr("bin-ex-10", "A fair die is rolled until the first six. Find the probability that this happens on the third roll.", (25 / 36) * (1 / 6), "Geometric: $q^2p$."), ["Two non-sixes then a six: $\\left(\\tfrac56\\right)^2\\tfrac16 = \\tfrac{25}{216} \\approx 0.116$."]),
      ex(3, mc("bin-ex-11", "$X \\sim \\mathrm{Bin}(n, p)$ counts successes. The number of failures $n - X$ is", ["$\\mathrm{Bin}(n, 1 - p)$", "Each trial fails independently with probability $1 - p$."], [["$\\mathrm{Bin}(n, p)$", "Only when $p = \\tfrac12$."], ["not binomial", "It counts the trials that fail, which are independent with a fixed chance."]]), [
        "Swap the labels success and failure: the failures form $n$ independent trials with chance $q$.",
      ]),
    ],
  },

  // §7.2
  poisson: {
    definitions: [
      {
        type: "definition",
        term: "Poisson variable",
        body: "$X \\sim \\mathrm{Po}(\\lambda)$ has $P(X = k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}$ for $k = 0, 1, 2, \\dots$ It counts events that occur independently at a steady rate. If the rate is $r$ per unit time, a window of length $t$ has $\\lambda = rt$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "mean and variance",
        statement: "If $X \\sim \\mathrm{Po}(\\lambda)$ then $E[X] = \\operatorname{Var}(X) = \\lambda$.",
        proof: [
          "$E[X] = \\sum_{k \\ge 1} k\\dfrac{e^{-\\lambda}\\lambda^k}{k!} = \\lambda\\sum_{k \\ge 1}\\dfrac{e^{-\\lambda}\\lambda^{k-1}}{(k-1)!} = \\lambda$, because the last sum adds every Poisson probability.",
          "The same trick gives $E[X(X - 1)] = \\lambda^2$, so $E[X^2] = \\lambda^2 + \\lambda$ and $\\operatorname{Var}(X) = \\lambda^2 + \\lambda - \\lambda^2 = \\lambda$.",
        ],
      },
      {
        type: "theorem",
        name: "Poisson approximation to the binomial",
        statement: "If $n$ is large and $p$ small with $np = \\lambda$ moderate, then $\\mathrm{Bin}(n, p) \\approx \\mathrm{Po}(\\lambda)$.",
        proof: [
          "Write $\\binom{n}{k}p^k(1 - p)^{n-k} = \\dfrac{n(n-1)\\cdots(n-k+1)}{n^k}\\cdot\\dfrac{\\lambda^k}{k!}\\cdot\\left(1 - \\dfrac{\\lambda}{n}\\right)^n\\left(1 - \\dfrac{\\lambda}{n}\\right)^{-k}$.",
          "As $n \\to \\infty$ the first and last factors tend to 1 and $\\left(1 - \\tfrac{\\lambda}{n}\\right)^n \\to e^{-\\lambda}$, leaving $\\dfrac{e^{-\\lambda}\\lambda^k}{k!}$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "sums",
        statement: "If $X \\sim \\mathrm{Po}(\\lambda)$ and $Y \\sim \\mathrm{Po}(\\mu)$ are independent, then $X + Y \\sim \\mathrm{Po}(\\lambda + \\mu)$.",
        proof: [
          "$P(X + Y = n) = \\sum_{k=0}^{n}\\dfrac{e^{-\\lambda}\\lambda^k}{k!}\\cdot\\dfrac{e^{-\\mu}\\mu^{n-k}}{(n-k)!} = \\dfrac{e^{-(\\lambda + \\mu)}}{n!}\\sum_{k=0}^{n}\\binom{n}{k}\\lambda^k\\mu^{n-k}$.",
          "By the binomial theorem the sum is $(\\lambda + \\mu)^n$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A help desk receives on average 3 calls an hour. Find the probability of exactly 2 calls in an hour.",
        solution: ["$\\lambda = 3$: $P(X = 2) = \\dfrac{e^{-3}3^2}{2!} = 4.5e^{-3}$.", "$e^{-3} \\approx 0.0498$, so $P \\approx 0.224$."],
        result: "About 0.224.",
      },
      {
        type: "example",
        level: 2,
        title: "rescaling the window",
        problem: "Same desk, 3 calls an hour. Find the probability of at least one call in a 30-minute window.",
        solution: ["Half an hour has $\\lambda = 3 \\times \\tfrac12 = 1.5$.", "$P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-1.5} \\approx 1 - 0.223$."],
        result: "About 0.777.",
      },
      {
        type: "example",
        level: 3,
        title: "approximating a binomial",
        problem: "1% of chips are faulty. Estimate the probability that a box of 200 holds at most one faulty chip.",
        solution: [
          "The count is $\\mathrm{Bin}(200, 0.01)$: $n$ large, $p$ small, so use $\\mathrm{Po}(2)$.",
          "$P(X \\le 1) \\approx e^{-2}(1 + 2) = 3e^{-2} \\approx 0.406$.",
          "The exact binomial value is $0.99^{200} + 200(0.01)(0.99)^{199} \\approx 0.405$: very close.",
        ],
        result: "About 0.406.",
      },
    ],
    pitfalls: [
      { wrong: "Use the hourly rate for a 10-minute window.", right: "Scale $\\lambda$ to the window: 6 per hour is $\\lambda = 1$ per 10 minutes." },
      { wrong: "Any count is Poisson.", right: "The events must be independent at a steady rate. If the variance is far above the mean, the events cluster." },
      { wrong: "$P(X = k) = \\lambda^k/k!$.", right: "Don't drop $e^{-\\lambda}$: it makes the probabilities sum to 1." },
    ],
    formulas: [
      { label: "Probability", tex: "P(X = k) = \\dfrac{e^{-\\lambda}\\lambda^k}{k!}" },
      { label: "Mean, variance", tex: "E[X] = \\operatorname{Var}(X) = \\lambda" },
      { label: "Window", tex: "\\lambda = \\text{rate} \\times \\text{length}" },
      { label: "Sum", tex: "\\mathrm{Po}(\\lambda) + \\mathrm{Po}(\\mu) = \\mathrm{Po}(\\lambda + \\mu)" },
    ],
    exercises: [
      ex(1, dp("poi-ex-1", "$X \\sim \\mathrm{Po}(2)$. Find $P(X = 0)$.", Math.exp(-2), "$e^{-2}$."), ["$P(X = 0) = e^{-2} \\approx 0.135$."]),
      ex(1, num("poi-ex-2", "$X \\sim \\mathrm{Po}(4)$. Find $\\operatorname{Var}(X)$.", 4, "Variance equals the mean."), ["For a Poisson variable, $\\operatorname{Var} = \\lambda = 4$."]),
      ex(2, dp("poi-ex-3", "$X \\sim \\mathrm{Po}(2)$. Find $P(X = 2)$.", 2 * Math.exp(-2), "$e^{-2}2^2/2!$."), ["$\\dfrac{e^{-2} \\cdot 4}{2} = 2e^{-2} \\approx 0.271$."]),
      ex(2, dp("poi-ex-4", "Emails arrive at 6 an hour. Find the probability of none in a 10-minute window.", Math.exp(-1), "$\\lambda = 1$."), ["10 minutes is $\\tfrac16$ hour, so $\\lambda = 1$ and $P(X = 0) = e^{-1} \\approx 0.368$."]),
      ex(2, num("poi-ex-5", "$X \\sim \\mathrm{Po}(\\lambda)$ with $P(X = 1) = P(X = 2)$. Find $\\lambda$.", 2, "Set the two formulas equal."), ["$e^{-\\lambda}\\lambda = e^{-\\lambda}\\lambda^2/2$ gives $\\lambda = 2$."]),
      ex(2, dp("poi-ex-6", "$X \\sim \\mathrm{Po}(1)$. Find $P(X \\ge 2)$.", 1 - 2 * Math.exp(-1), "Complement of $X \\le 1$."), ["$1 - e^{-1}(1 + 1) = 1 - 2e^{-1} \\approx 0.264$."]),
      ex(3, dp("poi-ex-7", "Each of 500 users independently reports a bug with probability 0.004. Use a Poisson approximation to find the probability of at most 2 reports.", 5 * Math.exp(-2), "$\\lambda = 2$."), [
        "$\\lambda = 500 \\times 0.004 = 2$.",
        "$P(X \\le 2) = e^{-2}\\left(1 + 2 + \\tfrac{4}{2}\\right) = 5e^{-2} \\approx 0.677$.",
      ]),
      ex(3, dp("poi-ex-8", "Two independent sources produce faults at 1.5 and 2.5 per day. Find the probability of a day with no faults.", Math.exp(-4), "Rates add."), ["The total is $\\mathrm{Po}(4)$, so $P(0) = e^{-4} \\approx 0.018$."]),
      ex(3, num("poi-ex-9", "$X \\sim \\mathrm{Po}(\\lambda)$ with $E[X^2] = 6$. Find $\\lambda$.", 2, "$E[X^2] = \\lambda^2 + \\lambda$."), ["$\\lambda^2 + \\lambda - 6 = 0$ factorises as $(\\lambda + 3)(\\lambda - 2) = 0$, and $\\lambda > 0$: $\\lambda = 2$."]),
      ex(3, mc("poi-ex-10", "Daily counts have mean 5 and variance 20. A Poisson model is", ["doubtful", "A Poisson count's variance equals its mean."], [["ideal", "The variance is four times the mean."], ["correct with $\\lambda = 20$", "That would make the mean 20 too."]]), [
        "For Poisson data the variance and mean match. Variance four times the mean suggests the events arrive in clusters.",
      ]),
    ],
  },

  // §7.3
  "uniform-exponential": {
    definitions: [
      {
        type: "definition",
        term: "density, distribution function",
        body: "A continuous variable $X$ has a **density** $f(x) \\ge 0$ with total area $\\int f(x)\\,dx = 1$, and $P(a \\le X \\le b) = \\int_a^b f(x)\\,dx$. Its **distribution function** is $F(x) = P(X \\le x)$, so $f = F'$. The mean is $E[X] = \\int x f(x)\\,dx$.",
      },
      {
        type: "definition",
        term: "uniform, exponential",
        body: "$X \\sim U(a, b)$ has $f(x) = \\dfrac{1}{b - a}$ on $[a, b]$ and 0 elsewhere. $T \\sim \\mathrm{Exp}(\\lambda)$ has $f(t) = \\lambda e^{-\\lambda t}$ for $t \\ge 0$, where $\\lambda$ is a rate per unit time.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "uniform",
        statement: "If $X \\sim U(a, b)$ then $E[X] = \\dfrac{a + b}{2}$ and $\\operatorname{Var}(X) = \\dfrac{(b - a)^2}{12}$.",
        proof: [
          "The density is symmetric about the midpoint, so the mean is $\\tfrac{a + b}{2}$.",
          "$E[X^2] = \\dfrac{1}{b - a}\\int_a^b x^2\\,dx = \\dfrac{a^2 + ab + b^2}{3}$. Subtracting $\\left(\\tfrac{a + b}{2}\\right)^2$ leaves $\\dfrac{a^2 - 2ab + b^2}{12}$.",
        ],
      },
      {
        type: "theorem",
        name: "exponential",
        statement: "If $T \\sim \\mathrm{Exp}(\\lambda)$ then $P(T > t) = e^{-\\lambda t}$, $E[T] = 1/\\lambda$, $\\operatorname{Var}(T) = 1/\\lambda^2$ and the median is $\\dfrac{\\ln 2}{\\lambda}$.",
        proof: [
          "$P(T > t) = \\int_t^\\infty \\lambda e^{-\\lambda s}\\,ds = \\big[-e^{-\\lambda s}\\big]_t^\\infty = e^{-\\lambda t}$.",
          "Integration by parts gives $E[T] = \\int_0^\\infty t\\lambda e^{-\\lambda t}\\,dt = \\tfrac1\\lambda$ and $E[T^2] = \\tfrac{2}{\\lambda^2}$. The median solves $e^{-\\lambda m} = \\tfrac12$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "no memory",
        statement: "$P(T > s + t \\mid T > s) = P(T > t)$. Also, if events happen at Poisson rate $\\lambda$, the wait for the first event is $\\mathrm{Exp}(\\lambda)$.",
        proof: [
          "$\\dfrac{P(T > s + t)}{P(T > s)} = \\dfrac{e^{-\\lambda(s + t)}}{e^{-\\lambda s}} = e^{-\\lambda t}$.",
          "Waiting longer than $t$ means no events in $[0, t]$, a $\\mathrm{Po}(\\lambda t)$ count equal to 0, with probability $e^{-\\lambda t}$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A bus arrives at a time uniform between 0 and 20 minutes from now. Find the mean wait and the probability of waiting more than 15 minutes.",
        solution: ["Mean $\\tfrac{0 + 20}{2} = 10$ minutes.", "$P(X > 15)$ is the area from 15 to 20: $\\tfrac{5}{20} = \\tfrac14$."],
        result: "10 minutes; $\\tfrac14$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Bulb lifetimes are exponential with mean 1000 hours. Find the probability a bulb lasts over 2000 hours, and the median lifetime.",
        solution: ["$\\lambda = \\tfrac{1}{1000}$, so $P(T > 2000) = e^{-2} \\approx 0.135$.", "Median $= 1000\\ln 2 \\approx 693$ hours, less than the mean: the distribution is skewed right."],
        result: "About 0.135; about 693 hours.",
      },
      {
        type: "example",
        level: 3,
        title: "finding a constant",
        problem: "$X$ has density $f(x) = kx^2$ on $[0, 3]$. Find $k$, $P(X \\le 1)$ and $E[X]$.",
        solution: [
          "Total area: $k\\int_0^3 x^2\\,dx = 9k = 1$, so $k = \\tfrac19$.",
          "$P(X \\le 1) = \\tfrac19\\int_0^1 x^2\\,dx = \\tfrac{1}{27}$.",
          "$E[X] = \\tfrac19\\int_0^3 x^3\\,dx = \\tfrac19 \\cdot \\tfrac{81}{4} = \\tfrac94$.",
        ],
        result: "$k = \\tfrac19$, $P = \\tfrac{1}{27}$, $E[X] = \\tfrac94$.",
      },
    ],
    pitfalls: [
      { wrong: "A density value is a probability, so it can't exceed 1.", right: "Only areas are probabilities. $U(0, 0.5)$ has density 2." },
      { wrong: "An exponential with rate $\\lambda$ has mean $\\lambda$.", right: "The mean is $1/\\lambda$: a higher rate means shorter waits." },
      { wrong: "An exponential part that has run a long time is due to fail.", right: "No memory: its remaining life has the same distribution as a new part's." },
    ],
    formulas: [
      { label: "Probability", tex: "P(a \\le X \\le b) = \\textstyle\\int_a^b f(x)\\,dx" },
      { label: "Uniform", tex: "E = \\tfrac{a + b}{2},\\quad \\operatorname{Var} = \\tfrac{(b - a)^2}{12}" },
      { label: "Exponential", tex: "P(T > t) = e^{-\\lambda t},\\quad E[T] = \\tfrac1\\lambda" },
      { label: "Median", tex: "m = \\tfrac{\\ln 2}{\\lambda}" },
    ],
    exercises: [
      ex(1, num("uex-ex-1", "$X \\sim U(2, 10)$. Find $P(X < 4)$.", 0.25, "Length 2 out of 8."), ["$\\tfrac{4 - 2}{10 - 2} = \\tfrac14$."]),
      ex(1, num("uex-ex-2", "$X \\sim U(2, 10)$. Find $E[X]$.", 6, "The midpoint."), ["$\\tfrac{2 + 10}{2} = 6$."]),
      ex(2, num("uex-ex-3", "$X \\sim U(0, 6)$. Find $\\operatorname{Var}(X)$.", 3, "$(b - a)^2/12$."), ["$\\tfrac{36}{12} = 3$."]),
      ex(2, dp("uex-ex-4", "$T \\sim \\mathrm{Exp}(0.5)$. Find $P(T > 4)$.", Math.exp(-2), "$e^{-\\lambda t}$."), ["$e^{-0.5 \\times 4} = e^{-2} \\approx 0.135$."]),
      ex(2, num("uex-ex-5", "Waiting times are exponential with mean 5 minutes. Find the rate $\\lambda$ per minute.", 0.2, "$\\lambda = 1/\\text{mean}$."), ["$\\lambda = \\tfrac15 = 0.2$."]),
      ex(2, num("uex-ex-6", "$f(x) = kx$ on $[0, 2]$ is a density. Find $k$.", 0.5, "Total area 1."), ["$k\\int_0^2 x\\,dx = 2k = 1$, so $k = \\tfrac12$."]),
      ex(3, fr("uex-ex-7", "$X$ has density $3x^2$ on $[0, 1]$. Find $E[X]$.", 3 / 4, "$\\int_0^1 3x^3\\,dx$."), ["$E[X] = \\int_0^1 3x^3\\,dx = \\tfrac34$."]),
      ex(3, dp("uex-ex-8", "$T \\sim \\mathrm{Exp}(0.1)$. Find the median of $T$.", Math.log(2) / 0.1, "$\\ln 2/\\lambda$."), ["Solve $e^{-0.1m} = \\tfrac12$: $m = 10\\ln 2 \\approx 6.931$."]),
      ex(3, dp("uex-ex-9", "A machine's time to failure is exponential with mean 10 hours. It has already run 7 hours. Find the probability it runs at least 5 more.", Math.exp(-0.5), "No memory."), ["The past 7 hours don't matter: $P(T > 5) = e^{-5/10} = e^{-0.5} \\approx 0.607$."]),
      ex(3, dp("uex-ex-10", "Calls arrive at a Poisson rate of 2 per minute. Find the probability that the first call comes within 30 seconds.", 1 - Math.exp(-1), "The wait is $\\mathrm{Exp}(2)$."), ["$P(T \\le 0.5) = 1 - e^{-2 \\times 0.5} = 1 - e^{-1} \\approx 0.632$."]),
      ex(3, mc("uex-ex-11", "Is $f(x) = 2$ on $[0, 0.5]$ (and 0 elsewhere) a valid density?", ["Yes: it is never negative and its area is 1", "$2 \\times 0.5 = 1$."], [["No: a density can't exceed 1", "Only areas must be at most 1."], ["No: $P(X = 0.25) = 2$", "Any single value has probability 0."]]), [
        "A density needs $f \\ge 0$ and total area 1; here the area is $2 \\times 0.5 = 1$.",
      ]),
    ],
  },

  // §7.4
  clt: {
    definitions: [
      {
        type: "definition",
        term: "sampling distribution",
        body: "For independent draws $X_1, \\dots, X_n$ from one population, the sum is $S_n = X_1 + \\dots + X_n$ and the sample mean $\\bar X = S_n/n$. The **sampling distribution** of $\\bar X$ is how $\\bar X$ varies over repeated samples of size $n$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "mean and spread of the sample mean",
        statement: "If the population has mean $\\mu$ and variance $\\sigma^2$, then exactly, for every $n$: $E[\\bar X] = \\mu$, $\\operatorname{Var}(\\bar X) = \\dfrac{\\sigma^2}{n}$, $E[S_n] = n\\mu$ and $\\operatorname{Var}(S_n) = n\\sigma^2$.",
        proof: [
          "Expectations add: $E[S_n] = n\\mu$. The draws are independent, so variances add: $\\operatorname{Var}(S_n) = n\\sigma^2$.",
          "Dividing by $n$ divides the mean by $n$ and the variance by $n^2$ (§6.1): $\\operatorname{Var}(\\bar X) = n\\sigma^2/n^2 = \\sigma^2/n$.",
        ],
      },
      {
        type: "theorem",
        name: "central limit theorem",
        statement: "For large $n$, $\\dfrac{\\bar X - \\mu}{\\sigma/\\sqrt n}$ is approximately $N(0, 1)$, whatever the population's shape (if $\\sigma$ is finite). Equivalently $\\bar X \\approx N(\\mu, \\sigma^2/n)$ and $S_n \\approx N(n\\mu, n\\sigma^2)$. For a normal population this is exact for every $n$.",
        proof: [
          "The mean and variance come from the previous theorem; the CLT adds that the shape becomes normal. Its proof uses moment generating functions and is beyond this book.",
          "As a rule of thumb, $n \\ge 30$ is enough unless the population is very skewed; a symmetric population needs fewer.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "normal approximation to the binomial",
        statement: "If $np \\ge 10$ and $nq \\ge 10$, then $\\mathrm{Bin}(n, p) \\approx N(np, npq)$. With the **continuity correction**, $P(X \\le k) \\approx \\Phi\\!\\left(\\dfrac{k + 0.5 - np}{\\sqrt{npq}}\\right)$.",
        proof: [
          "A binomial count is a sum of $n$ independent Bernoulli variables, so the CLT applies.",
          "The count is whole-numbered: the bar for $k$ covers $k - 0.5$ to $k + 0.5$, so include the half bar at each end.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A population has mean 50 and standard deviation 12. Samples of 36 are taken. Describe the sampling distribution of $\\bar X$.",
        solution: ["Mean $\\mu = 50$, standard deviation $\\sigma/\\sqrt n = 12/6 = 2$.", "$n = 36$ is large, so it is approximately normal: $\\bar X \\approx N(50, 2^2)$."],
        result: "$\\bar X \\approx N(50, 4)$.",
      },
      {
        type: "example",
        level: 2,
        problem: `Same population, $n = 36$. Find $P(\\bar X > 53)$. ${TABLE}`,
        solution: ["$z = \\dfrac{53 - 50}{2} = 1.5$.", "$P(Z > 1.5) = 1 - 0.9332 = 0.0668$."],
        result: "About 0.067.",
      },
      {
        type: "example",
        level: 3,
        title: "a sum",
        problem: `A lift holds 1850 kg. Adult masses have mean 70 kg and standard deviation 10 kg. Find the probability that 25 adults overload it. ${TABLE}`,
        solution: [
          "$S_{25}$ has mean $25 \\times 70 = 1750$ and standard deviation $10\\sqrt{25} = 50$.",
          "$z = \\dfrac{1850 - 1750}{50} = 2$, so $P(S > 1850) \\approx 1 - 0.9772 = 0.0228$.",
        ],
        result: "About 0.023.",
      },
      {
        type: "example",
        level: 3,
        title: "continuity correction",
        problem: `A fair coin is tossed 100 times. Estimate $P(X \\ge 58)$ heads. ${TABLE}`,
        solution: [
          "$np = 50$ and $\\sqrt{npq} = 5$; $np$ and $nq$ are both 50, so the normal approximation applies.",
          "At least 58 starts at the bar's left edge, 57.5: $z = \\dfrac{57.5 - 50}{5} = 1.5$.",
          "$P(X \\ge 58) \\approx 1 - 0.9332 = 0.0668$.",
        ],
        result: "About 0.067.",
      },
    ],
    pitfalls: [
      { wrong: "With a big sample the data become normal.", right: "The data keep the population's shape. The sample mean becomes normal." },
      { wrong: "The standard deviation of $\\bar X$ is $\\sigma/n$.", right: "It is $\\sigma/\\sqrt n$: quadruple $n$ to halve it." },
      { wrong: "The CLT works for $n = 5$ from any population.", right: "Skewed populations need large $n$. Only a normal population gives a normal $\\bar X$ for every $n$." },
    ],
    formulas: [
      { label: "Sample mean", tex: "\\bar X \\approx N\\!\\left(\\mu, \\tfrac{\\sigma^2}{n}\\right)" },
      { label: "Sum", tex: "S_n \\approx N(n\\mu, n\\sigma^2)" },
      { label: "Standardise", tex: "z = \\dfrac{\\bar x - \\mu}{\\sigma/\\sqrt n}" },
      { label: "Binomial", tex: "P(X \\le k) \\approx \\Phi\\!\\left(\\tfrac{k + 0.5 - np}{\\sqrt{npq}}\\right)" },
    ],
    exercises: [
      ex(1, num("clt-ex-1", "A population has $\\sigma = 20$. Find the standard deviation of $\\bar X$ for $n = 100$.", 2, "$\\sigma/\\sqrt n$."), ["$20/\\sqrt{100} = 2$."]),
      ex(1, num("clt-ex-2", "By what factor must $n$ grow to halve the standard deviation of $\\bar X$?", 4, "$\\sqrt n$ must double."), ["$\\sigma/\\sqrt n$ halves when $\\sqrt n$ doubles, i.e. $n$ is multiplied by 4."]),
      ex(2, dp("clt-ex-3", `A population has mean 100 and standard deviation 15. For $n = 25$, find $P(\\bar X > 106)$. ${TABLE}`, 1 - 0.9772, "SE 3."), ["$\\sigma/\\sqrt n = 3$, so $z = 6/3 = 2$ and $P = 1 - 0.9772 = 0.0228$."]),
      ex(2, num("clt-ex-4", "Fifty independent values each have mean 2 and variance 3. Find the variance of their sum.", 150, "Variances add."), ["$50 \\times 3 = 150$."]),
      ex(2, dp("clt-ex-5", `Same population (mean 100, s.d. 15, $n = 25$). Find $P(97 < \\bar X < 103)$. ${TABLE}`, 2 * 0.8413 - 1, "$z = \\pm 1$."), ["$z = \\pm 3/3 = \\pm 1$, so $P = 2(0.8413) - 1 = 0.6826$."]),
      ex(3, dp("clt-ex-6", `A fair coin is tossed 100 times. Use the normal approximation with continuity correction to find $P(X \\ge 53)$ heads. ${TABLE}`, 1 - 0.6915, "Start at 52.5."), ["$z = \\dfrac{52.5 - 50}{5} = 0.5$, so $P \\approx 1 - 0.6915 = 0.3085$."]),
      ex(3, num("clt-ex-7", "A population has $\\sigma = 4$. What is the smallest $n$ for which the standard deviation of $\\bar X$ is at most 0.5?", 64, "$4/\\sqrt n \\le 0.5$."), ["$\\sqrt n \\ge 8$, so $n \\ge 64$."]),
      ex(3, dp("clt-ex-8", `Parcels have mean mass 2 kg and standard deviation 0.6 kg. Find the probability that 36 parcels weigh more than 75.6 kg in total. ${TABLE}`, 1 - 0.8413, "Sum: mean 72, s.d. 3.6."), ["The sum has mean $72$ and standard deviation $0.6\\sqrt{36} = 3.6$.", "$z = 3.6/3.6 = 1$, so $P \\approx 1 - 0.8413 = 0.1587$."]),
      ex(3, dp("clt-ex-9", "Find the standard deviation of the mean of 64 rolls of a fair die. One roll has variance $\\tfrac{35}{12}$.", Math.sqrt(35 / 12) / 8, "$\\sigma/\\sqrt{64}$."), ["$\\sigma = \\sqrt{35/12} \\approx 1.708$, divided by $\\sqrt{64} = 8$: about 0.214."]),
      ex(3, mc("clt-ex-10", "A population is strongly skewed. Samples of size 4 are taken. Is $\\bar X$ approximately normal?", ["Not reliably: $n$ is too small for a skewed population", "The CLT is a large-$n$ result."], [["Yes, the CLT applies for any $n$", "Only a normal population gives that."], ["Yes, because $\\sigma/\\sqrt n$ is small", "Small spread says nothing about shape."]]), [
        "With $n = 4$ the averages still carry much of the skew. The normal shape emerges as $n$ grows.",
      ]),
    ],
  },

  // §7.5
  "standard-error": {
    definitions: [
      {
        type: "definition",
        term: "estimator, standard error",
        body: "An **estimator** is a rule that turns a sample into an estimate, such as $\\bar x$ for $\\mu$ or the sample proportion $\\hat p$ for $p$. Its **standard error** (SE) is the standard deviation of its sampling distribution, usually estimated from the sample itself.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "standard errors",
        statement: "$\\text{SE}(\\bar x) = \\dfrac{\\sigma}{\\sqrt n} \\approx \\dfrac{s}{\\sqrt n}$ and $\\text{SE}(\\hat p) = \\sqrt{\\dfrac{p(1 - p)}{n}} \\approx \\sqrt{\\dfrac{\\hat p(1 - \\hat p)}{n}}$.",
        proof: [
          "The first is $\\operatorname{Var}(\\bar X) = \\sigma^2/n$ (§7.4), with $s$ standing in for the unknown $\\sigma$.",
          "$\\hat p$ is the mean of $n$ Bernoulli values, each with variance $p(1 - p)$.",
        ],
      },
      {
        type: "theorem",
        name: "difference of two estimates",
        statement: "For independent samples, $\\text{SE}(\\bar x_1 - \\bar x_2) = \\sqrt{\\text{SE}_1^2 + \\text{SE}_2^2}$, and likewise for $\\hat p_1 - \\hat p_2$.",
        proof: ["Independent variances add, even for a difference (§6.1); take the square root."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "the square-root law",
        statement: "To divide a standard error by $k$, multiply $n$ by $k^2$. For a proportion, $\\text{SE}(\\hat p) \\le \\dfrac{1}{2\\sqrt n}$ whatever $p$ is.",
        proof: ["$n$ sits under a square root. And $p(1 - p) = \\tfrac14 - \\left(p - \\tfrac12\\right)^2 \\le \\tfrac14$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A sample of 36 has standard deviation $s = 12$. Find the standard error of the mean.",
        solution: ["$\\text{SE} = s/\\sqrt n = 12/6$.", "So $\\text{SE} = 2$: the sample mean typically lands within about 2 of $\\mu$."],
        result: "2.",
      },
      {
        type: "example",
        level: 2,
        title: "a poll",
        problem: "In a poll of 400 voters, 52% support a proposal. Find the standard error of $\\hat p$.",
        solution: ["$\\text{SE} = \\sqrt{\\dfrac{0.52 \\times 0.48}{400}} = \\dfrac{\\sqrt{0.2496}}{20}$.", "$\\sqrt{0.2496} \\approx 0.4996$, so $\\text{SE} \\approx 0.025$."],
        result: "About 2.5 percentage points.",
      },
      {
        type: "example",
        level: 3,
        title: "an A/B test",
        problem: "Version A: 1000 visitors, 10% click. Version B: 1000 visitors, 12% click. Find the SE of the difference and compare it with the observed gap.",
        solution: [
          "$\\text{SE}_A^2 = \\dfrac{0.1 \\times 0.9}{1000} = 0.00009$ and $\\text{SE}_B^2 = \\dfrac{0.12 \\times 0.88}{1000} = 0.0001056$.",
          "$\\text{SE} = \\sqrt{0.0001956} \\approx 0.014$.",
          "The gap of 0.02 is about $1.4$ standard errors: suggestive, but well within what chance often produces (§8.2).",
        ],
        result: "SE about 1.4 points; the gap is about 1.4 SE.",
      },
      {
        type: "example",
        level: 3,
        title: "planning a sample",
        problem: "How large a sample guarantees $\\text{SE}(\\hat p) \\le 0.01$, whatever $p$ is?",
        solution: ["Use the worst case: $\\dfrac{1}{2\\sqrt n} \\le 0.01$.", "$\\sqrt n \\ge 50$, so $n \\ge 2500$."],
        result: "2500.",
      },
    ],
    pitfalls: [
      { wrong: "The SE describes how spread out the data are.", right: "That is the standard deviation. The SE describes how much the estimate would vary between samples." },
      { wrong: "$\\text{SE}(\\bar x_1 - \\bar x_2) = \\text{SE}_1 - \\text{SE}_2$.", right: "Variances add: $\\sqrt{\\text{SE}_1^2 + \\text{SE}_2^2}$." },
      { wrong: "Doubling $n$ halves the SE.", right: "It divides the SE by $\\sqrt2$. Halving the SE needs four times the data." },
    ],
    formulas: [
      { label: "Mean", tex: "\\text{SE}(\\bar x) = s/\\sqrt n" },
      { label: "Proportion", tex: "\\text{SE}(\\hat p) = \\sqrt{\\hat p(1 - \\hat p)/n}" },
      { label: "Difference", tex: "\\sqrt{\\text{SE}_1^2 + \\text{SE}_2^2}" },
      { label: "Worst case", tex: "\\text{SE}(\\hat p) \\le \\tfrac{1}{2\\sqrt n}" },
    ],
    exercises: [
      ex(1, num("se-ex-1", "A sample of 25 has $s = 15$. Find the SE of the mean.", 3, "$s/\\sqrt n$."), ["$15/5 = 3$."]),
      ex(1, num("se-ex-2", "$\\hat p = 0.5$ from $n = 100$. Find $\\text{SE}(\\hat p)$.", 0.05, "$\\sqrt{0.25/100}$."), ["$\\sqrt{0.25/100} = 0.5/10 = 0.05$."]),
      ex(2, num("se-ex-3", "A study with $n = 100$ has SE 4. What $n$ would give SE 2?", 400, "Square-root law."), ["Halving the SE needs $2^2 = 4$ times the data: 400."]),
      ex(2, num("se-ex-4", "$\\hat p = 0.2$ from $n = 400$. Find $\\text{SE}(\\hat p)$.", 0.02, "$\\sqrt{0.16/400}$."), ["$\\sqrt{0.2 \\times 0.8/400} = 0.4/20 = 0.02$."]),
      ex(2, num("se-ex-5", "Two independent estimates have SEs 3 and 4. Find the SE of their difference.", 5, "$\\sqrt{9 + 16}$."), ["$\\sqrt{3^2 + 4^2} = 5$."]),
      ex(3, num("se-ex-6", "What sample size guarantees $\\text{SE}(\\hat p) \\le 0.02$ whatever $p$ is?", 625, "$1/(2\\sqrt n) \\le 0.02$."), ["$\\sqrt n \\ge 25$, so $n \\ge 625$."]),
      ex(3, dp("se-ex-7", "A: 30% of 500 users convert. B: 25% of 500 convert. Find the SE of the difference in proportions.", Math.sqrt((0.3 * 0.7 + 0.25 * 0.75) / 500), "Add the two variances."), [
        "$\\dfrac{0.3 \\times 0.7}{500} + \\dfrac{0.25 \\times 0.75}{500} = \\dfrac{0.3975}{500} = 0.000795$.",
        "$\\sqrt{0.000795} \\approx 0.028$.",
      ]),
      ex(3, dp("se-ex-8", "The sample $1, 3, 5, 7, 9$ has sample standard deviation $s$ (divide by $n - 1$). Find the SE of its mean.", Math.sqrt(2), "$s^2 = 40/4$."), ["Mean 5, squared deviations total 40, so $s^2 = 10$.", "$\\text{SE} = \\sqrt{10}/\\sqrt5 = \\sqrt2 \\approx 1.414$."]),
      ex(2, mc("se-ex-9", "As the sample size grows, the standard deviation of the data", ["stays about the same, while the SE shrinks", "The spread of individuals is a property of the population."], [["shrinks like $1/\\sqrt n$", "That is the SE, not the data's spread."], ["grows", "More data estimates the same spread more precisely."]]), [
        "$s$ settles towards $\\sigma$; only $s/\\sqrt n$ shrinks.",
      ]),
      ex(3, mc("se-ex-10", "Model A scores 90% accuracy on 100 test examples and model B scores 92% on 100 others. Is B clearly better?", ["No: each accuracy has an SE of about 3 points", "$\\sqrt{0.9 \\times 0.1/100} = 0.03$; a 2-point gap is noise-sized."], [["Yes: 92 > 90", "A difference must be judged against its SE."], ["Yes, because both used 100 examples", "Equal sizes don't remove sampling noise."]]), [
        "$\\text{SE}$ of each accuracy is about 0.03, so the SE of the difference is about 0.04. A 0.02 gap is half an SE.",
      ]),
    ],
  },
};
