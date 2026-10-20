import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Random number generation (pseudo-random generators, seeds, inverse transform, Box–Muller, rejection sampling), Monte Carlo integration and its error, importance sampling, variance reduction, and the design of simulation studies. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const lcg = (seed: number, a: number, c: number, m: number, k: number) => {
  let x = seed;
  for (let i = 0; i < k; i++) x = (a * x + c) % m;
  return x;
};

const base: ConceptNode = {
  id: "monte-carlo",
  title: "Monte Carlo simulation",
  summary: "When a probability or an integral is too hard to compute, simulate it: generate many random draws and average. Computers produce reproducible pseudo-random numbers, turn uniform draws into any distribution, and estimate quantities with an error that shrinks like 1/√n. The same tools let statisticians test their own methods in simulation studies before trusting them on real data.",
  deps: ["lln-inequalities", "clt", "uniform-exponential"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "pseudo-random number generator", meaning: "A deterministic algorithm whose output looks random; the same seed gives the same sequence." },
    { term: "inverse transform", meaning: "If $U \\sim U(0, 1)$, then $F^{-1}(U)$ has CDF $F$." },
    { term: "Monte Carlo standard error", meaning: "The standard error of a simulation estimate, $\\hat\\sigma/\\sqrt n$ for an average of $n$ independent draws." },
  ],
  misconceptions: {
    "mc-error-linear": "Thinks Monte Carlo error shrinks in proportion to the number of draws, so 10 times the draws gives 10 times the accuracy.",
    "seed-cheating": "Thinks setting a random seed makes results less random or is a form of cheating, rather than what makes simulations reproducible.",
  },
  steps: [
    {
      type: "motivate",
      title: "Let the computer roll the dice",
      body: "What is the chance that, in a class of 30, two students share a birthday? You can derive it, or you can simulate 100,000 classes and count. For problems with no tidy formula, such as the power of a complicated test, the risk in an investment portfolio or the spread of an epidemic, simulation is often the only practical answer.",
      realWorld: {
        title: "The origin of the name",
        body: "Stanislaw Ulam and John von Neumann developed Monte Carlo methods in the late 1940s to model neutron diffusion, naming them after the Monaco casino. Ulam got the idea while estimating his chances of winning at patience.",
      },
    },
    {
      type: "truth",
      statement: "To estimate $\\theta = E[g(X)]$, draw $X_1, \\dots, X_n$ and use $\\hat\\theta = \\tfrac1n\\sum g(X_i)$; by the law of large numbers it converges, and its **Monte Carlo standard error** is $\\hat\\sigma_g/\\sqrt n$ (§{clt}). Uniform draws come from a **pseudo-random generator**, such as the linear congruential $x_{k+1} = (ax_k + c) \\bmod m$ or modern ones (Mersenne Twister, PCG), started from a **seed**. **Inverse transform**: $X = F^{-1}(U)$; for the exponential, $X = -\\ln(1 - U)/\\lambda$. **Box–Muller**: $Z = \\sqrt{-2\\ln U_1}\\cos(2\\pi U_2)$ is standard normal.",
      body: "**Rejection sampling** draws from a density $f$ using an easier $g$ with $f \\le Mg$: propose $Y \\sim g$, accept with probability $f(Y)/(Mg(Y))$; the acceptance rate is $1/M$. **Importance sampling** estimates $E_f[h(X)]$ by drawing from $g$ and weighting by $f/g$, useful for rare events. **Variance reduction**: antithetic pairs $(U, 1 - U)$, control variates with known means, stratification. A **simulation study** to evaluate a method states its Aims, Data-generating mechanisms, Estimands, Methods and Performance measures (bias, coverage, power), and reports each measure with its Monte Carlo SE, such as $\\sqrt{p(1 - p)/n_{\\text{sim}}}$ for a coverage rate.",
    },
    {
      type: "predict",
      misconception: "mc-error-linear",
      item: {
        kind: "mc",
        id: "mcs-predict-1",
        prompt: "A simulation with 10,000 draws estimates a probability with standard error 0.004. To get standard error 0.001 you need about",
        options: [
          { id: "a", text: "160,000 draws", correct: true, why: "Error falls like $1/\\sqrt n$: a quarter of the error needs 16 times the draws." },
          { id: "b", text: "40,000 draws", misconception: "mc-error-linear", why: "That halves the error, not quarters it." },
          { id: "c", text: "1,000 draws", why: "Fewer draws give more error." },
        ],
      },
      reveal: {
        body: "$\\text{SE} = \\sigma/\\sqrt n$. Dividing the SE by 4 needs $\\sqrt n$ to grow 4 times, so $n$ grows 16 times. Each extra decimal place of accuracy costs 100 times the computation. That slow rate is why variance reduction tricks, which shrink $\\sigma$ instead, are so valuable.",
      },
      resolve: {
        kind: "mc",
        id: "mcs-resolve-1",
        prompt: "Multiplying the number of Monte Carlo draws by 100 divides the standard error by",
        options: [
          { id: "a", text: "10", correct: true, why: "$\\sqrt{100}$." },
          { id: "b", text: "100", misconception: "mc-error-linear", why: "The error scales with $1/\\sqrt n$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mcs-check-1",
        prompt: "A paper's simulation results can't be reproduced because the authors didn't record their random seed. Setting and reporting a seed",
        options: [
          { id: "a", text: "makes the simulation exactly repeatable without making it any less valid", correct: true, why: "The draws are still pseudo-random; anyone can regenerate them." },
          { id: "b", text: "biases the results, since the numbers are no longer random", misconception: "seed-cheating", why: "A seed only fixes the starting point of the generator." },
          { id: "c", text: "is impossible", why: "Every generator takes a seed." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mcs-check-2",
        prompt: "To draw from an exponential with rate 2 using $U \\sim U(0, 1)$, use",
        options: [
          { id: "a", text: "$-\\ln(1 - U)/2$", correct: true, why: "Inverse of $F(x) = 1 - e^{-2x}$." },
          { id: "b", text: "$2U$", why: "That is uniform on $(0, 2)$." },
          { id: "c", text: "$e^{-2U}$", why: "That isn't the inverse CDF." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Random seeds control weight initialisation, data shuffling and dropout, so reporting results over several seeds (with their spread) is standard. Monte Carlo estimates appear in dropout-based uncertainty, reinforcement-learning returns and the reparameterisation trick in variational autoencoders.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mcs-produce-1", prompt: "A simulation of 400 runs finds 95% CIs covered the truth in 376. Find the coverage estimate.", answer: 0.94, explain: "$376/400$." },
        { kind: "number", id: "mcs-produce-2", prompt: "Find its Monte Carlo standard error to 4 decimals.", answer: Math.round(Math.sqrt((0.94 * 0.06) / 400) * 10000) / 10000, tolerance: 0.0001, explain: "$\\sqrt{0.94 \\times 0.06/400}$." },
        {
          kind: "mc",
          id: "mcs-produce-3",
          prompt: "Going from 1,000 to 4,000 simulation runs changes the Monte Carlo SE by a factor of",
          options: [
            { id: "a", text: "1/2", correct: true, why: "$1/\\sqrt 4$." },
            { id: "b", text: "1/4", misconception: "mc-error-linear", why: "SE scales with $1/\\sqrt n$." },
          ],
        },
        {
          kind: "mc",
          id: "mcs-produce-4",
          prompt: "A reviewer asks you to rerun your simulation with a fixed seed. This is",
          options: [
            { id: "a", text: "good practice: it makes the results reproducible", correct: true, why: "The draws are still a valid pseudo-random sample." },
            { id: "b", text: "a request to manipulate the results", misconception: "seed-cheating", why: "A pre-set seed doesn't favour any outcome; picking seeds after looking would." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mcs-review-1", prompt: "A Monte Carlo average of 2,500 draws has sample SD 5. Find its standard error.", answer: 0.1, explain: "$5/50$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "importance sampling",
      body: "To estimate $\\mu = E_f[h(X)] = \\int h f$, draw $X_i$ from a proposal $g$ and use $\\hat\\mu = \\tfrac1n\\sum h(X_i)\\,w(X_i)$ with weights $w = f/g$. It is unbiased when $g > 0$ wherever $hf \\ne 0$. A good $g$ puts mass where $\\lvert h\\rvert f$ is large: for a tail probability $P(X > 5)$ with $X \\sim N(0, 1)$, sampling from $N(5, 1)$ is millions of times more efficient than plain sampling.",
    },
    {
      type: "definition",
      term: "simulation studies (ADEMP)",
      body: "**Aims**: what question the study answers. **Data-generating mechanisms**: the scenarios simulated (sample sizes, effect sizes, violated assumptions). **Estimands**: the true quantities. **Methods**: the procedures compared. **Performance measures**: bias $\\overline{\\hat\\theta} - \\theta$, empirical SE, MSE, coverage of intervals, type I error and power, each reported with its Monte Carlo SE. Choose $n_{\\text{sim}}$ so these SEs are small enough to answer the aims.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the inverse transform",
      statement: "If $U \\sim U(0, 1)$ and $F$ is a continuous, strictly increasing CDF, then $X = F^{-1}(U)$ has CDF $F$.",
      proof: ["$P(X \\le x) = P(F^{-1}(U) \\le x) = P(U \\le F(x)) = F(x)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "rejection sampling",
      statement: "If $f(x) \\le Mg(x)$ for all $x$, proposing $Y \\sim g$ and accepting with probability $f(Y)/(Mg(Y))$ yields draws from $f$, and each proposal is accepted with probability $1/M$.",
      proof: ["$P(Y \\in dx, \\text{accept}) = g(x)\\dfrac{f(x)}{Mg(x)}dx = \\dfrac{f(x)}{M}dx$; integrating gives acceptance probability $1/M$, and dividing gives density $f$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "antithetic variates",
      statement: "For monotone $g$, averaging $g(U)$ and $g(1 - U)$ gives lower variance than averaging two independent draws, because the pair is negatively correlated.",
      proof: ["$\\operatorname{Var}\\left(\\tfrac{g(U) + g(1 - U)}{2}\\right) = \\tfrac{\\sigma^2}{2}(1 + \\rho)$ with $\\rho < 0$ for monotone $g$, against $\\sigma^2/2$ for independent draws."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "A linear congruential generator $x_{k+1} = (5x_k + 3) \\bmod 16$ starts at $x_0 = 7$. Find $x_1$, $x_2$ and the corresponding uniforms $x/16$.",
      solution: ["$x_1 = 38 \\bmod 16 = 6$; $x_2 = 33 \\bmod 16 = 1$.", "Uniforms $0.375$ and $0.0625$. Real generators use far larger $m$ and better recurrences."],
      result: "6 and 1.",
    },
    {
      type: "example",
      level: 2,
      title: "Monte Carlo for $\\pi$",
      problem: "Of 10,000 random points in the unit square, 7,850 fall inside the quarter circle. Estimate $\\pi$ and its standard error.",
      solution: ["$\\hat p = 0.785$, so $\\hat\\pi = 4\\hat p = 3.14$.", "SE $= 4\\sqrt{0.785 \\times 0.215/10{,}000} \\approx 0.0164$."],
      result: "$3.14 \\pm 0.016$.",
    },
    {
      type: "example",
      level: 3,
      title: "planning a simulation study",
      problem: "You want the Monte Carlo SE of a 95% coverage estimate to be at most 0.5 percentage points. How many runs?",
      solution: ["$\\sqrt{0.95 \\times 0.05/n} \\le 0.005$, so $n \\ge 0.0475/0.000025$.", "$n \\ge 1{,}900$."],
      result: "1,900 runs.",
    },
  ],
  pitfalls: [
    { wrong: "Ten times the draws gives ten times the accuracy.", right: "It gives about $\\sqrt{10} \\approx 3.2$ times." },
    { wrong: "Run simulations without recording the seed.", right: "Set and report the seed so results can be reproduced." },
    { wrong: "Report simulation results without their Monte Carlo error.", right: "Give the Monte Carlo SE of every performance measure." },
  ],
  formulas: [
    { label: "Monte Carlo SE", tex: "\\hat\\sigma/\\sqrt n" },
    { label: "Inverse transform", tex: "X = F^{-1}(U)" },
    { label: "Exponential draw", tex: "-\\ln(1 - U)/\\lambda" },
    { label: "Coverage SE", tex: "\\sqrt{p(1 - p)/n_{\\text{sim}}}" },
  ],
  exercises: [
    ex(1, num("mcsx-ex-1", "A Monte Carlo average of 10,000 draws has SD 2. Find its standard error.", 0.02, "$2/100$."), ["$0.02$."]),
    ex(1, num("mcsx-ex-2", "Rejection sampling with envelope constant $M = 4$. What fraction of proposals is accepted?", 0.25, "$1/M$."), ["$0.25$."]),
    ex(2, dp("mcsx-ex-3", "Inverse transform: exponential with rate 0.5 from $U = 0.6$.", -Math.log(0.4) / 0.5, "$-\\ln(0.4)/0.5$."), ["$\\approx 1.833$."]),
    ex(2, num("mcsx-ex-4", "LCG $x_{k+1} = (3x_k + 1) \\bmod 10$ from $x_0 = 4$. Find $x_2$.", lcg(4, 3, 1, 10, 2), "Apply twice."), ["$x_1 = 3$, $x_2 = 0$."]),
    ex(2, num("mcsx-ex-5", "How many simulation runs make the Monte Carlo SE of an estimated power near 0.5 at most 0.01?", 2500, "$\\sqrt{0.25/n} \\le 0.01$."), ["$n \\ge 2{,}500$."]),
    ex(3, dp("mcsx-ex-6", "Importance sampling: a draw from $g$ has $f(x) = 0.02$ and $g(x) = 0.4$. Find its weight.", 0.05, "$f/g$."), ["$0.05$."]),
    ex(3, mc("mcsx-ex-7", "A simulation study shows a method's 95% intervals cover 93.1% of the time over 5,000 runs. This suggests", ["real undercoverage: the Monte Carlo SE is about 0.36 points", "$93.1$ is about 5 SEs below 95."], [["nothing: simulations are noisy", "With 5,000 runs the noise is small."], ["overcoverage", "It is below 95%."]]), ["Report $93.1\\% \\pm 0.36$."]),
    ex(3, mc("mcsx-ex-8", "To estimate $P(X > 6)$ for $X \\sim N(0, 1)$, plain Monte Carlo with $10^6$ draws will usually", ["see no exceedances at all: use importance sampling", "The probability is about $10^{-9}$."], [["give an accurate estimate", "Too rare for plain sampling."], ["give exactly the right answer", "Monte Carlo is approximate."]]), ["Sample from a proposal centred near 6 and reweight."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const s = r.pick([1, 2, 5, 10, 20]);
      const nn = r.pick([100, 400, 2500, 10000, 40000]);
      return n(`A Monte Carlo average of ${nn.toLocaleString("en-US")} independent draws has sample SD ${s}. Find its standard error (4 decimals).`, Math.round((s / Math.sqrt(nn)) * 10000) / 10000, `$${s}/\\sqrt{${nn}} = ${Math.round((s / Math.sqrt(nn)) * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const lam = r.pick([0.5, 1, 2, 4]);
      const u = r.pick([0.1, 0.25, 0.4, 0.5, 0.7, 0.9]);
      const v = -Math.log(1 - u) / lam;
      return n(`Use the inverse transform to turn $U = ${u}$ into an exponential draw with rate ${lam} (3 decimals).`, Math.round(v * 1000) / 1000, `$-\\ln(1 - ${u})/${lam} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a = r.pick([3, 5, 7, 11]);
      const c = r.pick([1, 3, 5]);
      const m = r.pick([16, 32, 100]);
      const x0 = r.int(1, m - 1);
      const k = r.int(1, 3);
      const v = lcg(x0, a, c, m, k);
      return n(`A linear congruential generator $x_{k+1} = (${a}x_k + ${c}) \\bmod ${m}$ starts at $x_0 = ${x0}$. Find $x_${k}$.`, v, `Apply the recurrence ${k} time${k > 1 ? "s" : ""}: $x_${k} = ${v}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const f = r.pick([4, 9, 16, 25, 100]);
      return mcNumbers(
        `Multiplying the number of Monte Carlo draws by ${f}, the standard error is divided by`,
        { text: `${Math.sqrt(f)}`, why: `$\\sqrt{${f}}$: error scales like $1/\\sqrt n$.` },
        [{ text: `${f}`, why: "Error doesn't fall in proportion to $n$.", misconception: "mc-error-linear" }],
      );
    },
  },
];
