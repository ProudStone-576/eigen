import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Computing at scale: computational complexity of statistical methods, parallel and distributed computation, big-data statistics, streaming and online estimation (Welford, reservoir sampling, sketches, SGD), and privacy-preserving statistics (randomised response, differential privacy). */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "statistical-computing",
  title: "Computing at scale & privacy",
  summary: "Some datasets don't fit in memory, arrive as never-ending streams, or are spread across many machines; some can't be shared at all for privacy reasons. Statistical computing adapts: count the cost of algorithms, compute summaries in one pass, combine results from shards, sample from streams, and add carefully calibrated noise so that published statistics reveal nothing about any individual.",
  deps: ["monte-carlo", "sufficiency", "gradient-descent"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "streaming algorithm", meaning: "One that processes each observation once, in order, using memory much smaller than the data." },
    { term: "embarrassingly parallel", meaning: "A computation that splits into independent pieces needing no communication, such as bootstrap replicates." },
    { term: "differential privacy", meaning: "A guarantee that any one person's data changes the distribution of published results only slightly, controlled by $\\varepsilon$." },
  ],
  misconceptions: {
    "big-n-no-bias": "Thinks a huge dataset makes estimates trustworthy even when it is a biased, non-random sample.",
    "anonymised-is-private": "Thinks removing names and IDs makes released data private.",
  },
  steps: [
    {
      type: "motivate",
      title: "Too big, too fast, too sensitive",
      body: "A payments company sees millions of transactions an hour; it wants the running mean and variance of amounts without storing them all. A hospital network wants a combined model without pooling patient records. A census bureau must publish detailed tables without revealing anyone. Each needs statistics designed around the constraint.",
      realWorld: {
        title: "The 2020 US census",
        body: "The US Census Bureau protected its 2020 results with differential privacy after showing that published tables from 2010 could be combined to reconstruct individual records for a large share of the population.",
      },
    },
    {
      type: "truth",
      statement: "Know the cost: least squares with $n$ rows and $p$ columns costs about $np^2 + p^3$ operations; sorting $n \\log n$; all pairwise distances $n^2$. Many estimators depend on the data only through **sums** (sufficient statistics, §{sufficiency}), so shards can be summarised separately and combined: for regression, add the $X^{\\mathsf T}X$ and $X^{\\mathsf T}\\vec y$ of each shard. **Welford's online algorithm** updates the mean and variance in one stable pass: $\\delta = x - \\bar x$, $\\bar x \\mathrel{+}= \\delta/k$, $M \\mathrel{+}= \\delta(x - \\bar x)$, with variance $M/(k - 1)$. **Reservoir sampling** keeps a uniform sample of size $s$ from a stream by keeping the $k$-th item with probability $s/k$.",
      body: "**Stochastic gradient descent** is online estimation: each new observation nudges the parameters (§{gradient-descent}). **Sketches** answer approximate queries in tiny memory: count-min for frequencies, HyperLogLog for distinct counts. **Distributed** analysis divides the data, computes on each part, and combines (averaging estimates, or summing sufficient statistics); **federated** learning trains on devices and shares only model updates. **Big data** cuts variance but not bias: a large, unrepresentative sample can be worse than a small random one. **Privacy**: removing identifiers isn't enough. **Differential privacy** adds noise scaled to how much one person can change a statistic: the **Laplace mechanism** releases $f(D) + \\text{Laplace}(\\Delta f/\\varepsilon)$, with $\\Delta f$ the sensitivity; **randomised response** lets respondents answer sensitive questions with built-in deniability.",
    },
    {
      type: "predict",
      misconception: "big-n-no-bias",
      item: {
        kind: "mc",
        id: "scp-predict-1",
        prompt: "An app collects 5 million voluntary health surveys from its users; a polling firm surveys 1,000 randomly chosen adults. For the share of all adults who exercise weekly, which is likely more accurate?",
        options: [
          { id: "a", text: "The random 1,000: the app's users are a self-selected group, and size can't fix that bias", correct: true, why: "Bias doesn't shrink with $n$." },
          { id: "b", text: "The 5 million, because the sample is 5,000 times larger", misconception: "big-n-no-bias", why: "More biased data gives a more precise wrong answer." },
          { id: "c", text: "They will agree", why: "App users differ from the population." },
        ],
      },
      reveal: {
        body: "Error has two parts: variance, which falls like $1/n$, and bias from how the sample was selected, which doesn't fall at all. With 5 million self-selected users the variance is negligible, so the error is almost all bias, possibly large. The random sample has a margin of error of about 3 points and no selection bias. Analyses of 2016 US polls estimated that a huge non-random sample could be worth as little as a few hundred random respondents (§{sampling-bias}).",
      },
      resolve: {
        kind: "mc",
        id: "scp-resolve-1",
        prompt: "Making a biased sample 100 times larger",
        options: [
          { id: "a", text: "shrinks its variance but leaves its bias", correct: true, why: "Bias comes from selection, not size." },
          { id: "b", text: "removes the bias", misconception: "big-n-no-bias", why: "Size doesn't fix selection." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "scp-check-1",
        prompt: "A hospital releases visit records with names and ID numbers removed but with postcode, birth date and sex. Is this private?",
        options: [
          { id: "a", text: "No: those three fields alone identify most people when linked with other data", correct: true, why: "Quasi-identifiers enable re-identification." },
          { id: "b", text: "Yes, since names and IDs are gone", misconception: "anonymised-is-private", why: "Linkage attacks re-identify people from remaining fields." },
          { id: "c", text: "Yes, if the file is large", why: "Size doesn't prevent linkage." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "scp-check-2",
        prompt: "A count query has sensitivity 1. Releasing it with $\\varepsilon = 0.5$ differential privacy, the Laplace noise scale is",
        options: [
          { id: "a", text: "2", correct: true, why: "$\\Delta f/\\varepsilon = 1/0.5$." },
          { id: "b", text: "0.5", why: "Divide sensitivity by $\\varepsilon$." },
          { id: "c", text: "1", why: "Smaller $\\varepsilon$ means more noise." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training large models is distributed statistics: data-parallel SGD averages gradients across machines, and federated learning keeps phone data on the phone. DP-SGD clips each example's gradient and adds noise, giving models with formal privacy guarantees, at some cost in accuracy.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "scp-produce-1", prompt: "Welford: after 3 values the mean is 4 and $M = 8$. The 4th value is 8. Find the new mean.", answer: 5, explain: "$4 + (8 - 4)/4$." },
        { kind: "number", id: "scp-produce-2", prompt: "Same step. Find the new $M$.", answer: 20, explain: "$\\delta = 4$, so $M = 8 + 4 \\times (8 - 5) = 20$ (variance $20/3$)." },
        {
          kind: "mc",
          id: "scp-produce-3",
          prompt: "A website's 10 million visitor logs are used to estimate national internet habits. The main risk is",
          options: [
            { id: "a", text: "bias: visitors aren't a random sample of the country", correct: true, why: "Large but unrepresentative." },
            { id: "b", text: "none: 10 million is plenty", misconception: "big-n-no-bias", why: "Size cuts variance, not bias." },
          ],
        },
        {
          kind: "mc",
          id: "scp-produce-4",
          prompt: "To share student records for research while protecting individuals, the strongest option is",
          options: [
            { id: "a", text: "releasing differentially private statistics rather than records", correct: true, why: "It gives a formal guarantee against linkage." },
            { id: "b", text: "deleting names and student numbers", misconception: "anonymised-is-private", why: "Remaining fields can identify students." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "scp-review-1", prompt: "Reservoir sampling with reservoir size 10: the 50th item arrives. With what probability is it kept?", answer: 0.2, explain: "$10/50$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "combining shards",
      body: "Shard $j$ reports $n_j$, $\\sum x$ and $\\sum x^2$ (or, more stably, $n_j$, $\\bar x_j$ and $M_j$). The pooled mean is $\\sum n_j\\bar x_j/\\sum n_j$, and the pooled $M = \\sum M_j + \\sum n_j(\\bar x_j - \\bar x)^2$. For least squares, $\\hat{\\vec\\beta} = \\left(\\sum_jX_j^{\\mathsf T}X_j\\right)^{-1}\\sum_jX_j^{\\mathsf T}\\vec y_j$ exactly. For estimators without such sums, averaging the shard estimates (divide and conquer) is nearly as efficient when shards are large.",
    },
    {
      type: "definition",
      term: "randomised response",
      body: "Each respondent privately flips a coin: heads, answer truthfully; tails, answer \"yes\". No single \"yes\" is incriminating. If the true rate is $\\pi$, $P(\\text{yes}) = \\tfrac12\\pi + \\tfrac12$, so $\\hat\\pi = 2\\hat P(\\text{yes}) - 1$. The price is variance: the estimate is noisier than direct questioning.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "reservoir sampling is uniform",
      statement: "Keeping the first $s$ items, then replacing a random reservoir item with the $k$-th item with probability $s/k$, leaves every item seen so far in the reservoir with probability $s/k$.",
      proof: ["By induction: an item in the reservoir at step $k - 1$ (probability $s/(k - 1)$) survives step $k$ with probability $1 - \\tfrac sk \\cdot \\tfrac1s = \\tfrac{k - 1}{k}$, giving $s/k$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "the Laplace mechanism",
      statement: "If changing one person's record changes $f$ by at most $\\Delta f$, releasing $f(D) + L$ with $L \\sim \\text{Laplace}(0, \\Delta f/\\varepsilon)$ is $\\varepsilon$-differentially private. The noise has standard deviation $\\sqrt2\\,\\Delta f/\\varepsilon$.",
      proof: ["The Laplace density ratio at outputs differing by at most $\\Delta f$ is at most $e^{\\varepsilon}$; the Laplace$(b)$ variance is $2b^2$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "why one-pass formulas need care",
      statement: "Computing variance as $\\tfrac{1}{n - 1}\\left(\\sum x^2 - n\\bar x^2\\right)$ subtracts two huge, nearly equal numbers when the mean is large relative to the spread, losing precision (catastrophic cancellation). Welford's update avoids it.",
      proof: ["With values near $10^9$ and spread 1, both terms are about $10^{18}n$, beyond the 16 significant digits of double precision."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Welford on the stream 2, 4, 9. Track $\\bar x$ and $M$.",
      solution: ["$x = 2$: $\\bar x = 2$, $M = 0$. $x = 4$: $\\delta = 2$, $\\bar x = 3$, $M = 0 + 2 \\times 1 = 2$.", "$x = 9$: $\\delta = 6$, $\\bar x = 5$, $M = 2 + 6 \\times 4 = 26$; variance $26/2 = 13$."],
      result: "Mean 5, variance 13.",
    },
    {
      type: "example",
      level: 2,
      title: "pooling shards",
      problem: "Shard A: $n = 100$, mean 10. Shard B: $n = 300$, mean 14. Find the pooled mean.",
      solution: ["$\\dfrac{100 \\times 10 + 300 \\times 14}{400}$.", "$= 5200/400 = 13$."],
      result: "13.",
    },
    {
      type: "example",
      level: 3,
      title: "randomised response",
      problem: "With the coin design above, 62% of respondents answer \"yes\". Estimate the true rate.",
      solution: ["$P(\\text{yes}) = \\tfrac12\\pi + \\tfrac12 = 0.62$.", "$\\hat\\pi = 2 \\times 0.62 - 1 = 0.24$."],
      result: "24%.",
    },
  ],
  pitfalls: [
    { wrong: "A huge dataset can't be biased.", right: "Size cuts variance only; selection bias remains." },
    { wrong: "Removing names makes data anonymous.", right: "Quasi-identifiers re-identify people; use formal methods such as differential privacy." },
    { wrong: "Use the textbook one-pass variance formula on large values.", right: "Use Welford's update or two passes." },
  ],
  formulas: [
    { label: "Welford", tex: "\\delta = x - \\bar x,\\ \\bar x \\mathrel{+}= \\delta/k,\\ M \\mathrel{+}= \\delta(x - \\bar x)" },
    { label: "Reservoir", tex: "P(\\text{keep item } k) = s/k" },
    { label: "Laplace mechanism", tex: "f(D) + \\text{Laplace}(\\Delta f/\\varepsilon)" },
    { label: "Randomised response", tex: "\\hat\\pi = 2\\hat P(\\text{yes}) - 1" },
  ],
  exercises: [
    ex(1, num("scpx-ex-1", "Shard A: $n = 50$, mean 20. Shard B: $n = 150$, mean 24. Find the pooled mean.", 23, "$(1000 + 3600)/200$."), ["$23$."]),
    ex(1, num("scpx-ex-2", "A sum query has sensitivity 5 and $\\varepsilon = 1$. Find the Laplace noise scale.", 5, "$\\Delta f/\\varepsilon$."), ["$5$."]),
    ex(2, num("scpx-ex-3", "Welford: after 4 values, mean 6 and $M = 20$. The 5th value is 11. Find the new $M$.", 40, "$\\delta = 5$, new mean 7, $M + 5 \\times 4$."), ["$20 + 5 \\times (11 - 7) = 40$; variance $40/4 = 10$."]),
    ex(2, dp("scpx-ex-4", "Find the standard deviation of Laplace noise with scale 2.", 2 * Math.SQRT2, "$\\sqrt2\\,b$."), ["$\\approx 2.828$."]),
    ex(2, num("scpx-ex-5", "Randomised response (truth on heads, \"yes\" on tails): 70% say yes. Estimate the true rate.", 0.4, "$2 \\times 0.7 - 1$."), ["$0.4$."]),
    ex(3, mc("scpx-ex-6", "Running 1,000 bootstrap replicates on 50 machines is", ["embarrassingly parallel: each replicate is independent", "No communication is needed until the end."], [["impossible to parallelise", "Replicates don't depend on each other."], ["sequential by nature", "That describes MCMC chains, not bootstrap replicates."]]), ["About a 50-fold speed-up."]),
    ex(3, mc("scpx-ex-7", "Doubling $p$ in least squares (with $n \\gg p$) multiplies the cost roughly by", ["4", "The $np^2$ term dominates."], [["2", "Cost grows faster than $p$."], ["8", "The $p^3$ term matters only when $p$ is close to $n$."]]), ["Use iterative methods for very wide data."]),
    ex(3, mc("scpx-ex-8", "Smaller $\\varepsilon$ in differential privacy means", ["stronger privacy and noisier results", "Noise scale is $\\Delta f/\\varepsilon$."], [["weaker privacy", "Smaller $\\varepsilon$ is stronger."], ["less noise", "It means more noise."]]), ["Choosing $\\varepsilon$ is a policy trade-off."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(2, 9);
      const m = r.int(0, 20);
      const M = r.int(0, 60);
      const x = m + r.nonzero(-8, 8);
      const d = x - m;
      const m2 = m + d / (k + 1);
      const M2 = M + d * (x - m2);
      return n(`Welford's algorithm: after ${k} values, $\\bar x = ${m}$ and $M = ${M}$. The next value is ${x}. Find the updated $M$ (3 decimals).`, Math.round(M2 * 1000) / 1000, `$\\delta = ${d}$; new mean $${r2(m2)}$; $M = ${M} + ${d} \\times (${x} - ${r2(m2)}) \\approx ${Math.round(M2 * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const n1 = r.pick([50, 100, 200, 400]);
      const n2 = r.pick([100, 150, 300, 600]);
      const a = r.int(5, 30);
      const b = r.int(5, 30);
      const v = (n1 * a + n2 * b) / (n1 + n2);
      return n(`Shard A has ${n1} rows with mean ${a}; shard B has ${n2} rows with mean ${b}. Find the pooled mean (3 decimals).`, Math.round(v * 1000) / 1000, `$(${n1} \\times ${a} + ${n2} \\times ${b})/${n1 + n2} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const d = r.pick([1, 2, 5, 10]);
      const e = r.pick([0.1, 0.5, 1, 2]);
      return n(`A query has sensitivity ${d}. Find the Laplace noise scale for $\\varepsilon = ${e}$.`, d / e, `$${d}/${e} = ${d / e}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick(["2 million app users", "500,000 website visitors", "a million social-media posts", "3 million loyalty-card shoppers"]);
      return mcNumbers(
        `A survey of ${v} is used to estimate a national rate. Compared with a random sample of 1,000 people, its main weakness is`,
        { text: "selection bias, which its size can't fix", why: "Variance falls with $n$; bias doesn't." },
        [{ text: "none: the bigger sample always wins", why: "A large biased sample is precisely wrong.", misconception: "big-n-no-bias" }],
      );
    },
  },
];
