import type { Item } from "./types";
import { mcNumbers, r2, type Rng } from "./generators";
import type { Template } from "./templates";

/**
 * Practice templates for the statistics and ML-evaluation concepts added in
 * batch 1 (describing data, distributions, inference, regression & evaluation).
 * Same contract as templates.ts: every answer is computed here, and each
 * template scales with level 1–3.
 */

type L = 1 | 2 | 3;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
const median = (xs: number[]) => {
  const s = sorted(xs);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const quartiles = (xs: number[]) => {
  const s = sorted(xs);
  const n = s.length;
  return { q1: median(s.slice(0, Math.floor(n / 2))), q3: median(s.slice(Math.ceil(n / 2))) };
};
const list = (xs: number[]) => xs.join(", ");
/** Distinct integers, in random order. */
function distinct(r: Rng, n: number, lo: number, hi: number): number[] {
  const out = new Set<number>();
  while (out.size < n) out.add(r.int(lo, hi));
  return [...out];
}
const choose = (n: number, k: number) => {
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return c;
};
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
const num = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });
const pct = (x: number) => `${r2(x * 100)}%`;

export const BATCH1: Record<string, Template[]> = {
  // ---------- Describing data ----------
  "mean-median-mode": [
    {
      type: "compute",
      make: (r, lv) => {
        const n = [5, 6, 7][lv - 1] + (lv === 3 ? 2 : 0);
        const xs = distinct(r, n, 1, 10 * lv + 10);
        const md = median(xs);
        return num(`Find the median of ${list(xs)}.`, md, `Sorted: ${list(sorted(xs))}. ${n % 2 ? `The middle value is ${md}.` : `Average the middle two: ${md}.`}`);
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const n = 4 + lv;
        const xs = Array.from({ length: n }, () => r.int(1, 20 * lv));
        const mean = sum(xs) / n;
        const exact = Number.isInteger(mean * 100);
        return num(
          `Find the mean of ${list(xs)}${exact ? "" : " (two decimals)"}.`,
          exact ? mean : r2(mean),
          `${sum(xs)} / ${n} = ${r2(mean)}.`,
          exact ? undefined : 0.01,
        );
      },
    },
    {
      type: "interpret",
      make: (r, lv) => {
        const xs = sorted(distinct(r, 5, 10, 40));
        const big = xs[4] * (5 + 5 * lv);
        const meanBefore = r2(sum(xs) / 5);
        const meanAfter = r2((sum(xs) - xs[4] + big) / 5);
        return mcNumbers(
          `Data: ${list(xs)}. The largest value, ${xs[4]}, is replaced by ${big}. Which changes a lot?`,
          { text: "The mean", why: `The mean goes from ${meanBefore} to ${meanAfter}; the median stays ${xs[2]}.` },
          [
            { text: "Neither, really: it's one value", why: `The mean jumps to ${meanAfter}.`, misconception: "mean-resists-outliers" },
            { text: "The median", why: `The median is still the middle value, ${xs[2]}.` },
          ],
        );
      },
    },
    {
      type: "error",
      make: (r, lv) => {
        for (;;) {
          const xs = distinct(r, lv === 1 ? 5 : 7, 1, 30);
          const middle = xs[(xs.length - 1) / 2];
          const md = median(xs);
          if (middle === md) continue;
          return mcNumbers(
            `Kai says the median of ${list(xs)} is ${middle}, \"the one in the middle\". What's the median?`,
            { text: String(md), why: `Sort first: ${list(sorted(xs))}.` },
            [{ text: `${middle}: Kai is right`, why: "The list has to be sorted first.", misconception: "median-unsorted" }],
          );
        }
      },
    },
  ],
  "quartiles-iqr": [
    {
      type: "compute",
      make: (r, lv) => {
        const n = [7, 9, 11][lv - 1];
        const xs = distinct(r, n, 1, 20 + 20 * lv);
        const shown = lv === 1 ? sorted(xs) : xs;
        const { q1, q3 } = quartiles(xs);
        return mcNumbers(
          `Find the IQR of ${list(shown)}. (Quartiles: medians of the lower and upper halves, leaving out the median.)`,
          { text: String(q3 - q1), why: `Sorted: ${list(sorted(xs))}. Q1 = ${q1}, Q3 = ${q3}, so IQR = ${q3 - q1}.` },
          [
            { text: String(Math.max(...xs) - Math.min(...xs)), why: "That's the range, max − min.", misconception: "iqr-is-range" },
            { text: String(median(xs)), why: "That's the median." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const q1 = r.int(2, 10) * 2 * lv;
        const iqr = r.int(1, 6) * 2 * lv;
        const upper = r.next() < 0.5;
        const fence = upper ? q1 + iqr + 1.5 * iqr : q1 - 1.5 * iqr;
        return num(
          `Q1 = ${q1} and Q3 = ${q1 + iqr}. Where is the ${upper ? "upper" : "lower"} outlier fence?`,
          fence,
          `IQR = ${iqr}, so ${upper ? `Q3 + 1.5 × IQR = ${q1 + iqr} + ${1.5 * iqr}` : `Q1 − 1.5 × IQR = ${q1} − ${1.5 * iqr}`} = ${fence}.`,
        );
      },
    },
    {
      type: "interpret",
      make: (r, lv) => {
        const q1 = r.int(10, 30);
        const iqr = r.int(2, 6) * 2;
        const q3 = q1 + iqr;
        const fence = q3 + 1.5 * iqr;
        const x = r.next() < 0.5 ? fence + r.int(1, 3 * lv) : r.int(q3 + 1, Math.floor(fence) - 1);
        const out = x > fence;
        return mcNumbers(
          `Q1 = ${q1}, Q3 = ${q3}. Is ${x} an outlier by the 1.5 × IQR rule?`,
          { text: out ? "Yes" : "No", why: `The upper fence is ${q3} + 1.5 × ${iqr} = ${fence}.` },
          [
            { text: out ? "No" : "Yes", why: `Compare with the fence, ${fence}.` },
            { text: "Can't tell without the mean", why: "The rule only needs Q1 and Q3." },
          ],
        );
      },
    },
  ],
  "skew-shape": [
    {
      type: "interpret",
      make: (r, lv) => {
        const md = r.int(20, 80);
        const d = r.int(2, 6 * lv);
        const right = r.next() < 0.5;
        const mean = right ? md + d : md - d;
        return mcNumbers(
          `A dataset has mean ${mean} and median ${md}. Its skew is most likely…`,
          { text: right ? "Right (positive)" : "Left (negative)", why: `A long ${right ? "right" : "left"} tail pulls the mean ${right ? "above" : "below"} the median.` },
          [
            { text: right ? "Left (negative)" : "Right (positive)", why: "Name the skew after the tail that pulls the mean.", misconception: "skew-direction" },
            { text: "Symmetric", why: "Mean and median differ." },
          ],
        );
      },
    },
    {
      type: "real-world",
      make: (r) => {
        const cases = [
          { s: "household incomes in a country", right: true },
          { s: "the number of views per video on a video site", right: true },
          { s: "scores on a very easy exam", right: false },
          { s: "house prices in a big city", right: true },
          { s: "age at death in a wealthy country", right: false },
          { s: "time to complete a simple task, with a few people getting stuck", right: true },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `Which way is ${c.s} skewed?`,
          { text: c.right ? "Right (positive)" : "Left (negative)", why: c.right ? "Most values are modest; a few huge ones make a long right tail." : "Most values are high; a few low ones make a long left tail." },
          [
            { text: c.right ? "Left: most of the data is on the left" : "Right: most of the data is on the right", why: "Skew is named after the tail, not the bulk.", misconception: "skew-direction" },
            { text: "Symmetric", why: "There's a long tail on one side." },
          ],
        );
      },
    },
    {
      type: "real-world",
      make: (r) => {
        const cases = [
          { q: "the distribution of 2,000 house sizes (m²)", a: "Histogram", pie: true },
          { q: "how 800 customers' delivery times are spread", a: "Histogram", pie: true },
          { q: "the relationship between advertising spend and sales", a: "Scatterplot", pie: false },
          { q: "monthly revenue over the last three years", a: "Line chart", pie: false },
          { q: "how many students chose each of 6 majors", a: "Bar chart", pie: false },
        ] as const;
        const c = r.pick(cases);
        const all = ["Histogram", "Scatterplot", "Line chart", "Bar chart", "Pie chart"];
        const why: Record<string, string> = {
          Histogram: "Histograms show how one numeric variable is distributed.",
          Scatterplot: "Scatterplots show two numeric variables against each other.",
          "Line chart": "Line charts show change over time.",
          "Bar chart": "Bar charts compare counts across categories.",
          "Pie chart": "Pie charts show shares of a few parts of one whole.",
        };
        const wrong = all.filter((x) => x !== c.a).map((x) => ({ text: x, why: why[x], misconception: x === "Pie chart" && c.pie ? "pie-for-distribution" : undefined }));
        return mcNumbers(`Which chart best shows ${c.q}?`, { text: c.a, why: why[c.a] }, wrong.slice(0, 4));
      },
    },
  ],
  "sampling-methods": [
    {
      type: "interpret",
      make: (r) => {
        const n = r.int(3, 12);
        const cases = [
          { s: `A university randomly picks ${n} students from each of its faculties.`, a: "Stratified", mix: "Cluster" },
          { s: `A company randomly picks ${n} of its offices and surveys every employee in them.`, a: "Cluster", mix: "Stratified" },
          { s: `A shop surveys every ${n * 5}th customer on its till receipts.`, a: "Systematic", mix: null },
          { s: `A reporter asks the first ${n * 10} people walking past the station.`, a: "Convenience", mix: null },
          { s: `Every one of 5,000 members gets a number and ${n * 20} numbers are drawn by computer.`, a: "Simple random", mix: null },
        ] as const;
        const c = r.pick(cases);
        const names = ["Stratified", "Cluster", "Systematic", "Convenience", "Simple random"];
        const wrong = names
          .filter((x) => x !== c.a)
          .map((x) => ({
            text: x,
            why: `Not ${x.toLowerCase()} sampling.`,
            misconception: x === c.mix ? "stratified-vs-cluster" : c.a === "Convenience" && x === "Simple random" ? "convenience-is-random" : undefined,
          }));
        return mcNumbers(`${c.s} Which sampling method is this?`, { text: c.a, why: `That's ${c.a.toLowerCase()} sampling.` }, wrong);
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const a = r.int(2, 8) * 10;
        const n = r.int(2, 6) * 10 * lv;
        return num(`A population is ${a}% group A and ${100 - a}% group B. A proportional stratified sample of ${n} takes how many from group A?`, (a * n) / 100, `${a}% of ${n}.`);
      },
    },
  ],
  "sampling-bias": [
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { s: "A gym chain judges its members' satisfaction from people who renewed this year.", a: "Survivorship" },
          { s: "A survey about overtime is emailed; the busiest staff are least likely to answer.", a: "Nonresponse" },
          { s: "A radio station asks listeners to call in with their opinion of a new law.", a: "Voluntary response" },
          { s: "A street poll about city transport is run only in the wealthiest district.", a: "Selection" },
          { s: "A survey asks \"Don't you agree the new park is a waste of money?\"", a: "Response (leading question)" },
        ] as const;
        const c = r.pick(cases);
        const names = ["Survivorship", "Nonresponse", "Voluntary response", "Selection", "Response (leading question)"];
        return mcNumbers(
          `${c.s} Which bias is the biggest worry?`,
          { text: c.a, why: `${c.a} bias.` },
          names.filter((x) => x !== c.a).map((x) => ({ text: x, why: `Not the main problem here.` })),
        );
      },
    },
    {
      type: "interpret",
      make: (r, lv) => {
        const n = r.pick([500, 1000, 2000]);
        const k = r.pick([2, 4, 10, 100]) * lv;
        return mcNumbers(
          `A biased online poll of ${n} people is expanded to ${n * k}, collected the same way. Its bias…`,
          { text: "Stays about the same", why: "Bias comes from who gets asked, not how many." },
          [
            { text: `Shrinks by about ${k}×`, why: "Size shrinks random error, not bias.", misconception: "bigger-fixes-bias" },
            { text: "Disappears", why: "The same kind of people answer.", misconception: "bigger-fixes-bias" },
          ],
        );
      },
    },
  ],

  // ---------- Distributions ----------
  binomial: [
    {
      type: "compute",
      make: (r, lv) => {
        const n = r.int(2, 8) * 5 * lv;
        const p = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
        const variance = r.next() < 0.5;
        return num(
          `X is binomial with n = ${n} and p = ${p}. What is its ${variance ? "variance" : "mean"}?`,
          variance ? r3(n * p * (1 - p)) : r3(n * p),
          variance ? `np(1 − p) = ${n} × ${p} × ${r2(1 - p)} = ${r3(n * p * (1 - p))}.` : `np = ${n} × ${p} = ${r3(n * p)}.`,
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const n = r.int(3, 3 + lv * 2);
        const k = r.int(1, n - 1);
        const p = r.pick(lv === 1 ? [0.5] : [0.2, 0.3, 0.5, 0.6, 0.8]);
        const one = p ** k * (1 - p) ** (n - k);
        const all = choose(n, k) * one;
        return mcNumbers(
          `n = ${n} independent trials, each succeeding with p = ${p}. What is P(exactly ${k} successes), to three decimals?`,
          { text: String(r3(all)), why: `$\\binom{${n}}{${k}}(${p})^{${k}}(${r2(1 - p)})^{${n - k}} = ${choose(n, k)} \\times ${r3(one)}$.` },
          [
            { text: String(r3(one)), why: `That's one order. There are $\\binom{${n}}{${k}} = ${choose(n, k)}$ orders.`, misconception: "binom-forget-choose" },
            { text: String(r3(k / n)), why: "That's the fraction of trials, not a probability." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { yes: "The number of heads in 20 fair coin flips", no: "The number of aces when you deal 5 cards without replacement" },
          { yes: "The number of defective chips in 50 drawn from a huge batch, each 2% defective", no: "The number of sunny days in a week, when sunny days come in streaks" },
          { yes: "The number of 6s in 12 rolls of a fair die", no: "The number of red marbles when you draw 4 from a bag of 6 without replacement" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          "Which of these is binomial?",
          { text: c.yes, why: "A fixed number of independent trials with the same p." },
          [
            { text: c.no, why: "The trials aren't independent with a fixed p.", misconception: "binom-not-independent" },
            { text: "The number of rolls until the first 6", why: "The number of trials isn't fixed: that's geometric." },
          ],
        );
      },
    },
  ],
  poisson: [
    {
      type: "compute",
      make: (r, lv) => {
        const perHour = r.pick([6, 12, 18, 24, 30]) * lv;
        const mins = r.pick([10, 20, 30, 90, 120]);
        const lam = (perHour * mins) / 60;
        return mcNumbers(
          `Requests arrive at an average of ${perHour} per hour. What λ describes a ${mins}-minute window?`,
          { text: String(lam), why: `${perHour} × ${mins}/60 = ${lam}.` },
          [
            { text: String(perHour), why: "That's per hour. Rescale λ to the window.", misconception: "poisson-rate-scale" },
            { text: String(perHour * mins), why: "Convert minutes to hours first." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const lam = r.pick([0.5, 1, 2, 3, 4]);
        const k = r.int(0, lv + 1);
        const p = (Math.exp(-lam) * lam ** k) / fact(k);
        return num(
          `X is Poisson with λ = ${lam}. What is P(X = ${k}), to two decimals?`,
          r2(p),
          `$e^{-${lam}} \\cdot ${lam}^{${k}}/${k}! \\approx ${r3(p)}$.`,
          0.01,
        );
      },
    },
    {
      type: "interpret",
      make: (r, lv) => {
        const lam = r.int(1, 4);
        const k = lam + r.int(3, 4 + lv * 2);
        return mcNumbers(
          `Faults average ${lam} per day. Under a Poisson model, can a day have ${k} faults?`,
          { text: "Yes, just rarely", why: "A Poisson count has no upper limit." },
          [
            { text: `No: ${lam} is the most possible`, why: `${lam} is the average, not a cap.`, misconception: "poisson-bounded" },
            { text: `Only up to ${2 * lam}`, why: "There's no cap at all.", misconception: "poisson-bounded" },
          ],
        );
      },
    },
  ],
  "uniform-exponential": [
    {
      type: "compute",
      make: (r, lv) => {
        const a = r.int(0, 5);
        const b = a + r.pick([4, 5, 8, 10, 20]) * lv;
        const c = r.int(a, b - 2);
        const d = r.int(c + 1, b);
        const p = (d - c) / (b - a);
        return mcNumbers(
          `X is uniform on [${a}, ${b}]. What is P(${c} < X < ${d})?`,
          { text: String(r3(p)), why: `Width ${d - c} times height 1/${b - a}.` },
          [
            { text: String(r3(1 / (b - a))), why: "That's the density's height. Multiply by the width.", misconception: "density-is-probability" },
            { text: String(d - c), why: "Divide by the total width." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const lam = r.pick([0.1, 0.2, 0.25, 0.5, 1, 2]);
        const t = r.int(1, 2 * lv);
        const mean = r.next() < 0.4;
        return mean
          ? num(`Waiting times are exponential with rate λ = ${lam} per minute. What is the mean wait, in minutes?`, 1 / lam, `1/λ = ${1 / lam}.`)
          : num(
              `Waiting times are exponential with λ = ${lam} per minute. What is P(wait > ${t} minutes), to two decimals?`,
              r2(Math.exp(-lam * t)),
              `$e^{-${lam} \\times ${t}} \\approx ${r3(Math.exp(-lam * t))}$.`,
              0.01,
            );
      },
    },
    {
      type: "interpret",
      make: (r, lv) => {
        const m = r.pick([200, 500, 1000, 2000]) * lv;
        const t = r.pick([0.5, 1, 1.5]) * m;
        return mcNumbers(
          `A part's lifetime is exponential with mean ${m} hours. It has already run ${t} hours. Expected remaining life?`,
          { text: `${m} hours`, why: "Memoryless: a working part is as good as new." },
          [
            { text: `${Math.max(0, m - t)} hours`, why: "The exponential doesn't wear out.", misconception: "exp-memory" },
            { text: `${m / 2} hours`, why: "Having run already doesn't shorten the future." },
          ],
        );
      },
    },
  ],
  clt: [
    {
      type: "compute",
      make: (r, lv) => {
        const n = r.pick([4, 9, 16, 25, 36, 64, 100].slice(0, 3 + lv * 2));
        const s = Math.sqrt(n) * r.int(1, 4 * lv);
        return mcNumbers(
          `A population has σ = ${s}. What is the standard deviation of $\\bar x$ for samples of n = ${n}?`,
          { text: String(s / Math.sqrt(n)), why: `$\\sigma/\\sqrt{n} = ${s}/${Math.sqrt(n)}$.` },
          [
            { text: String(s * Math.sqrt(n)), why: "Divide by √n; averages are *less* spread out.", misconception: "bigger-sample-wider" },
            { text: String(r3(s / n)), why: "Divide by √n, not n." },
          ],
        );
      },
    },
    {
      type: "reverse",
      make: (r, lv) => {
        const k = r.int(2, 2 + lv * 2);
        return num(`To make the spread of $\\bar x$ ${k} times smaller, multiply the sample size by…`, k * k, `Spread goes like $1/\\sqrt{n}$, so n must grow by ${k}² = ${k * k}.`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const small = r.pick([4, 5, 10]);
        const big = small * r.pick([10, 20, 50]);
        return mcNumbers(
          `From the same population, which sample means are more spread out: samples of size ${small} or of size ${big}?`,
          { text: `Size ${small}`, why: "Spread is $\\sigma/\\sqrt{n}$." },
          [
            { text: `Size ${big}: more data, more variety`, why: "Bigger samples average out the extremes.", misconception: "bigger-sample-wider" },
            { text: "The same", why: "The spread depends on n." },
          ],
        );
      },
    },
  ],
  "standard-error": [
    {
      type: "compute",
      make: (r, lv) => {
        const n = r.pick([16, 25, 36, 64, 100, 400].slice(0, 2 + lv * 2));
        const se = r.int(1, 3 * lv);
        const s = se * Math.sqrt(n);
        return mcNumbers(
          `A sample of n = ${n} has standard deviation s = ${s}. What is the standard error of the mean?`,
          { text: String(se), why: `$${s}/\\sqrt{${n}}$.` },
          [
            { text: String(s), why: "That's how much individuals vary, not the mean.", misconception: "se-is-sd" },
            { text: String(r3(s / n)), why: "Divide by √n, not n." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const p = r.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
        const n = r.pick([100, 400, 900, 2500].slice(0, 1 + lv));
        const se = Math.sqrt((p * (1 - p)) / n);
        return mcNumbers(
          `A poll of ${n} people finds $\\hat p$ = ${p}. Standard error of the proportion, to three decimals?`,
          { text: String(r3(se)), why: `$\\sqrt{${p} \\times ${r2(1 - p)}/${n}}$.` },
          [
            { text: String(r3(Math.sqrt(p * (1 - p)))), why: "That's one person's SD. Divide by n inside the root.", misconception: "se-is-sd" },
            { text: String(r3((p * (1 - p)) / n)), why: "Take the square root." },
          ],
        );
      },
    },
    {
      type: "reverse",
      make: (r, lv) => {
        const n = r.pick([25, 50, 100, 200]);
        const k = r.int(2, 2 + lv);
        const se = r.int(2, 6) * k;
        return mcNumbers(
          `With n = ${n}, the standard error is ${se}. What sample size gives a standard error of ${se / k}?`,
          { text: String(n * k * k), why: `SE goes like $1/\\sqrt{n}$: ${k} times smaller needs ${k}² = ${k * k} times the data.` },
          [
            { text: String(n * k), why: `That only shrinks SE by $\\sqrt{${k}}$.`, misconception: "se-linear-n" },
            { text: String(n / k), why: "Less data makes SE bigger." },
          ],
        );
      },
    },
  ],

  // ---------- Inference ----------
  "confidence-intervals": [
    {
      type: "compute",
      make: (r, lv) => {
        const xbar = r.int(10, 200);
        const se = r.int(1, 4 * lv) / (lv === 3 ? 2 : 1);
        const upper = r.next() < 0.5;
        const end = upper ? xbar + 1.96 * se : xbar - 1.96 * se;
        return num(
          `$\\bar x$ = ${xbar} and SE = ${se}. What is the ${upper ? "upper" : "lower"} end of the 95% confidence interval? (Use 1.96.)`,
          r2(end),
          `${xbar} ${upper ? "+" : "−"} 1.96 × ${se} = ${r2(end)}.`,
          0.01,
        );
      },
    },
    {
      type: "reverse",
      make: (r, lv) => {
        const mid = r.int(20, 120);
        const half = r.int(2, 10) * lv;
        return num(`A 95% confidence interval runs from ${mid - half} to ${mid + half}. What was the sample mean?`, mid, `The interval is centred on $\\bar x$: (${mid - half} + ${mid + half}) / 2.`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const reps = r.pick([100, 200, 500, 1000]);
        return mcNumbers(
          `A study is repeated ${reps} times, each time computing a 95% confidence interval correctly. About how many intervals miss the true mean?`,
          { text: String(reps * 0.05), why: "About 5% of honest 95% intervals miss." },
          [
            { text: "0, if each is computed correctly", why: "Unlucky samples miss even when nothing is wrong.", misconception: "ci-always-catches" },
            { text: String(reps * 0.95), why: "That's how many *catch* it." },
          ],
        );
      },
    },
  ],
  "hypothesis-tests": [
    {
      type: "compute",
      make: (r, lv) => {
        const se = r.int(1, 3 * lv);
        const z = r.pick([-3, -2.5, -2, -1.5, -1, 1, 1.5, 2, 2.5, 3]);
        const mu0 = r.int(20, 100);
        const xbar = mu0 + z * se;
        return num(`H₀: μ = ${mu0}. A sample gives $\\bar x$ = ${xbar} with SE = ${se}. What is the test statistic z?`, z, `(${xbar} − ${mu0}) / ${se} = ${z}.`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const alpha = r.pick([0.05, 0.01]);
        const p = r.pick([0.001, 0.003, 0.02, 0.04, 0.08, 0.2, 0.35]);
        const reject = p < alpha;
        return mcNumbers(
          `α = ${alpha} and the test gives p = ${p}. What do you conclude?`,
          { text: reject ? "Reject H₀" : "Don't reject H₀: not enough evidence", why: reject ? `${p} < ${alpha}.` : `${p} ≥ ${alpha}.` },
          reject
            ? [
                { text: `There's only a ${pct(p)} chance H₀ is true`, why: "p assumes H₀; it isn't H₀'s probability.", misconception: "p-is-prob-null" },
                { text: "Don't reject H₀", why: `${p} < ${alpha}.` },
              ]
            : [
                { text: "H₀ is true: there's no effect", why: "Not rejecting doesn't prove H₀.", misconception: "fail-reject-proves" },
                { text: "Reject H₀", why: `${p} isn't below ${alpha}.` },
              ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const p = r.pick([0.01, 0.02, 0.03, 0.04, 0.06, 0.1]);
        return mcNumbers(
          `A test gives p = ${p}. Which statement is right?`,
          { text: `If H₀ were true, data this extreme would happen about ${pct(p)} of the time`, why: "That's the definition." },
          [
            { text: `There's a ${pct(p)} chance H₀ is true`, why: "That flips the conditional.", misconception: "p-is-prob-null" },
            { text: `There's a ${pct(1 - p)} chance the effect is large`, why: "p says nothing about effect size." },
          ],
        );
      },
    },
  ],
  "errors-power": [
    {
      type: "compute",
      make: (r, lv) => {
        if (lv === 1 || r.next() < 0.5) {
          const beta = r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4]);
          return num(`A test has β = ${beta}. What is its power?`, r2(1 - beta), `1 − β.`);
        }
        const tests = r.pick([20, 40, 60, 100, 200]);
        const alpha = r.pick([0.05, 0.01]);
        return num(`You run ${tests} independent tests at α = ${alpha}, all on things with no real effect. Expected number of false positives?`, r2(tests * alpha), `${tests} × ${alpha}.`);
      },
    },
    {
      type: "real-world",
      make: (r) => {
        const cases = [
          { s: "A spam filter sends a real email to spam (H₀: not spam).", a: "Type I" },
          { s: "A fraud check lets a fraudulent payment through (H₀: not fraud).", a: "Type II" },
          { s: "An innocent person is convicted (H₀: innocent).", a: "Type I" },
          { s: "A quality check passes a faulty part (H₀: part is fine).", a: "Type II" },
          { s: "A study declares a useless drug effective (H₀: no effect).", a: "Type I" },
          { s: "A screening test misses a disease that's present (H₀: healthy).", a: "Type II" },
        ] as const;
        const c = r.pick(cases);
        const other = c.a === "Type I" ? "Type II" : "Type I";
        return mcNumbers(
          `${c.s} Which error is that?`,
          { text: c.a, why: c.a === "Type I" ? "Rejecting a true H₀: a false alarm." : "Missing a real effect: failing to reject a false H₀." },
          [
            { text: other, why: other === "Type I" ? "Type I is a false alarm." : "Type II is a miss.", misconception: "type-swap" },
            { text: "No error", why: "The decision was wrong." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const from = r.pick([0.05, 0.1]);
        const to = r.pick([0.01, 0.005, 0.001]);
        return mcNumbers(
          `A team tightens α from ${from} to ${to}. Their test's power…`,
          { text: "Falls", why: "A stricter cut-off misses more real effects." },
          [
            { text: "Stays the same: α only controls false alarms", why: "The same cut-off decides misses.", misconception: "alpha-lower-free" },
            { text: "Rises", why: "Stricter means harder to detect anything." },
          ],
        );
      },
    },
  ],
  "t-tests": [
    {
      type: "compute",
      make: (r, lv) => {
        const n = r.pick([4, 9, 16, 25, 36]);
        const se = r.int(1, 2 * lv);
        const s = se * Math.sqrt(n);
        const t = r.pick([-3, -2, -1.5, 1.5, 2, 2.5, 3]);
        const mu0 = r.int(10, 80);
        const xbar = mu0 + t * se;
        return mcNumbers(
          `$\\bar x$ = ${xbar}, $\\mu_0$ = ${mu0}, s = ${s}, n = ${n}. What is t?`,
          { text: String(t), why: `SE = ${s}/${Math.sqrt(n)} = ${se}, so t = ${r2(xbar - mu0)}/${se}.` },
          [
            { text: String(r3((xbar - mu0) / s)), why: "Divide by $s/\\sqrt{n}$, not s." },
            { text: String(r3(xbar - mu0)), why: "Divide the gap by the SE." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { s: "the same 12 runners' times before and after a training plan", paired: true },
          { s: "exam scores of 30 students taught online and 30 different students taught in person", paired: false },
          { s: "each of 20 patients' pain scores on a drug and, a month later, on a placebo", paired: true },
          { s: "the heights of 40 randomly chosen men and 40 randomly chosen women", paired: false },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `Comparing ${c.s}. Which test?`,
          { text: c.paired ? "Paired t-test on the differences" : "Two-sample (independent) t-test", why: c.paired ? "Each value in one list belongs with one in the other." : "Two separate groups of different people." },
          [
            c.paired
              ? { text: "Two-sample (independent) t-test", why: "They're the same people measured twice.", misconception: "paired-as-independent" }
              : { text: "Paired t-test on the differences", why: "Nothing links one group's values to the other's." },
            { text: "Chi-square test", why: "Chi-square is for counts in categories." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { n: 10, t: "2.26" },
          { n: 20, t: "2.09" },
          { n: 6, t: "2.57" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `n = ${c.n}, σ unknown, two-sided 5% test. Which cut-off for |t|?`,
          { text: `About ${c.t} (${c.n - 1} degrees of freedom)`, why: "Estimating σ from a small sample needs fatter tails." },
          [
            { text: "1.96", why: "That's the z cut-off: for known σ or very large n.", misconception: "t-equals-z-small-n" },
            { text: "1.645", why: "That's a one-sided z cut-off." },
          ],
        );
      },
    },
  ],
  "chi-square": [
    {
      type: "compute",
      make: (r, lv) => {
        const e = r.pick([10, 20, 25, 40, 50]) * lv;
        const d = r.nonzero(-8, 8) * lv;
        const c = (d * d) / e;
        return num(
          `A cell has observed count ${e + d} and expected count ${e}. What does it add to χ²${Number.isInteger(c * 100) ? "" : " (two decimals)"}?`,
          r2(c),
          `$(${e + d} - ${e})^2/${e} = ${d * d}/${e}$.`,
          0.01,
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const total = r.pick([100, 200, 400]) * lv;
        const rowA = (r.int(2, 8) * total) / 10;
        const col = (r.int(2, 8) * total) / 10;
        const e = (rowA * col) / total;
        return mcNumbers(
          `${total} people: ${rowA} are in group A, the rest in group B. ${col} people overall said yes. If the answer is independent of group, how many yeses do you expect in group A?`,
          { text: String(e), why: `Row total × column total ÷ grand total: ${rowA} × ${col} / ${total}.` },
          [
            { text: String(col / 2), why: "Split by group size, not evenly.", misconception: "chi-expected-even" },
            { text: String(rowA), why: "Not everyone in group A said yes." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r) => {
        const rows = r.int(2, 5);
        const cols = r.int(2, 5);
        return num(`How many degrees of freedom does a chi-square test of independence on a ${rows} × ${cols} table have?`, (rows - 1) * (cols - 1), `(${rows} − 1)(${cols} − 1).`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const n1 = r.pick([10, 20, 50]);
        const n2 = n1 * 100;
        return mcNumbers(
          `Group A: 40% of ${n1} clicked. Group B: 40% of ${n2} clicked. Can you feed "40" in as the observed count for both?`,
          { text: `No: use the actual counts, ${(n1 * 40) / 100} and ${(n2 * 40) / 100}`, why: "χ² needs counts, which carry the sample size." },
          [{ text: "Yes: the percentages are what matter", why: "The same percentage from 10,000 is far stronger evidence than from 10.", misconception: "chi-percentages" }],
        );
      },
    },
  ],
  "correlation-causation": [
    {
      type: "interpret",
      make: (r) => {
        const cases = [
          { x: "ice-cream sales", y: "sunburn cases", z: "Sunny, hot weather" },
          { x: "the number of firefighters at a fire", y: "the damage done", z: "How big the fire is" },
          { x: "children's shoe size", y: "their reading ability", z: "Age" },
          { x: "coffee drinking", y: "lung cancer, in older studies", z: "Smoking" },
          { x: "a city's number of churches", y: "its number of crimes", z: "Population size" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `Across many cases, ${c.x} and ${c.y} rise and fall together. The best explanation?`,
          { text: `${c.z} drives both`, why: "A confounder." },
          [
            { text: `More ${c.x} causes more ${c.y}`, why: "Correlation alone can't establish that.", misconception: "correlation-causation" },
            { text: "It must be a coincidence", why: "There's a plausible common cause." },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const n1 = r.int(5, 30) * 10;
        const n2 = r.int(5, 30) * 10;
        const s1 = Math.round(n1 * r.pick([0.6, 0.7, 0.8, 0.9]));
        const s2 = Math.round(n2 * r.pick([0.4, 0.5, 0.6, 0.7]));
        const all = ((s1 + s2) / (n1 + n2)) * 100;
        return num(
          `A treatment succeeded in ${s1} of ${n1} easy cases and ${s2} of ${n2} hard cases. Overall success rate, as a percent${lv > 1 ? " (nearest whole)" : ""}?`,
          Math.round(all),
          `(${s1} + ${s2}) / (${n1} + ${n2}) ≈ ${r2(all)}%. Note how it depends on the mix of easy and hard cases.`,
          0.5,
        );
      },
    },
  ],

  // ---------- Regression & evaluation ----------
  "multiple-regression": [
    {
      type: "compute",
      make: (r, lv) => {
        const sst = r.pick([50, 100, 200, 400]) * lv;
        const sse = (sst * r.int(1, 19)) / 20;
        return num(`SSE = ${sse} and SST = ${sst}. What is R²?`, 1 - sse / sst, `1 − ${sse}/${sst}.`);
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const b = r.int(-10, 20);
        const w1 = r.nonzero(-5, 5);
        const w2 = r.nonzero(-5, 5);
        const x1 = r.int(0, 5 * lv);
        const x2 = r.int(0, 5 * lv);
        const y = b + w1 * x1 + w2 * x2;
        const sg = (w: number) => (w < 0 ? `− ${-w}` : `+ ${w}`);
        return num(`ŷ = ${b} ${sg(w1)}x₁ ${sg(w2)}x₂. Predict ŷ at x₁ = ${x1}, x₂ = ${x2}.`, y, `${b} + (${w1})(${x1}) + (${w2})(${x2}) = ${y}.`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const w = r.int(2, 20);
        const cases = [
          { y: "salary (k)", x: "years of experience", other: "education" },
          { y: "house price (k)", x: "bathrooms", other: "floor area" },
          { y: "fuel use (L/100 km)", x: "engine size (L)", other: "car weight" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `A model predicts ${c.y} from ${c.x} and ${c.other}. The weight on ${c.x} is ${w}. It means…`,
          { text: `+${w} per extra unit of ${c.x}, with ${c.other} held fixed`, why: "Each weight is a \"holding the others fixed\" effect." },
          [
            { text: `+${w} per extra unit of ${c.x}, whatever else changes`, why: `${c.other} usually changes too, and has its own weight.`, misconception: "coef-ignore-others" },
            { text: `${c.x} explains ${w}% of ${c.y}`, why: "Weights aren't percentages of variance." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const before = r.pick([0.6, 0.65, 0.7, 0.75]);
        const after = r2(before + r.pick([0.03, 0.05, 0.08]));
        const k = r.pick([20, 50, 100]);
        return mcNumbers(
          `Adding ${k} random-noise features lifts training R² from ${before} to ${after}. Is the model better?`,
          { text: "Probably worse on new data", why: "Training R² can't fall when you add features; the gain is fitted noise." },
          [{ text: "Yes: R² went up", why: "Training R² rewards any extra knob.", misconception: "r2-always-better" }],
        );
      },
    },
  ],
  "logistic-regression": [
    {
      type: "compute",
      make: (r, lv) => {
        const z = r.pick(lv === 1 ? [-2, -1, 0, 1, 2] : [-3, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3]);
        const p = 1 / (1 + Math.exp(-z));
        return mcNumbers(
          `A logistic model's score is z = ${z}. What is the predicted probability, to two decimals?`,
          { text: String(r2(p)), why: `$\\sigma(${z}) = 1/(1 + e^{${-z}}) \\approx ${r3(p)}$.` },
          [
            { text: String(z), why: "z is a log-odds; apply σ to get a probability.", misconception: "logit-linear-prob" },
            { text: String(r2(1 - p)), why: `That's σ(${-z}).` },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const odds = r.pick(lv === 1 ? [1, 3, 4, 9] : [0.25, 0.5, 1.5, 2, 4, 19]);
        const toP = r.next() < 0.5;
        const p = odds / (1 + odds);
        return toP
          ? num(`The odds are ${odds} (i.e. ${odds} to 1). What is the probability${Number.isInteger(p * 100) ? "" : ", to two decimals"}?`, r2(p), `odds/(1 + odds) = ${odds}/${1 + odds}.`, 0.01)
          : num(`p = ${r2(p)}. What are the odds p/(1 − p)?`, odds, `${r2(p)}/${r2(1 - p)} = ${odds}.`, 0.05);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const k = r.pick([2, 3, 5, 10]);
        const w = r2(Math.log(k));
        return mcNumbers(
          `A feature's logistic weight is ln ${k} ≈ ${w}. Raising that feature by 1…`,
          { text: `Multiplies the odds by ${k}`, why: `It adds ${w} to the log-odds; $e^{${w}} \\approx ${k}$.` },
          [
            { text: `Adds ${w} to the probability`, why: "Weights act on the log-odds, not the probability.", misconception: "log-odds-coef" },
            { text: `Multiplies the probability by ${k}`, why: "It's the odds that get multiplied." },
          ],
        );
      },
    },
  ],
  regularization: [
    {
      type: "compute",
      make: (r, lv) => {
        const lam = r.pick([0.5, 1, 2, 3]);
        const ws = Array.from({ length: 1 + lv }, () => r.int(-4, 4));
        const ridge = r.next() < 0.5;
        const l2 = lam * sum(ws.map((w) => w * w));
        const l1 = lam * sum(ws.map((w) => Math.abs(w)));
        const name = ridge ? "ridge" : "lasso";
        return mcNumbers(
          `λ = ${lam} and weights (${list(ws)}). What is the ${name} penalty, ${ridge ? "$\\lambda\\sum w^2$" : "$\\lambda\\sum |w|$"}?`,
          { text: String(ridge ? l2 : l1), why: ridge ? `${lam} × (${ws.map((w) => w * w).join(" + ")}).` : `${lam} × (${ws.map((w) => Math.abs(w)).join(" + ")}).` },
          [{ text: String(ridge ? l1 : l2), why: ridge ? "That's the lasso penalty: square the weights." : "That's the ridge penalty: use absolute values." }],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const k = r.pick([200, 500, 1000, 5000]);
        const want = r.int(5, 20);
        return mcNumbers(
          `You have ${k} features and want a model that uses only about ${want} of them. Which method?`,
          { text: "Lasso", why: "Its penalty sets many weights exactly to 0." },
          [
            { text: "Ridge", why: "Ridge shrinks every weight but keeps them all.", misconception: "ridge-zeroes" },
            { text: "Plain least squares", why: "That uses every feature." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const lam = r.pick([0.1, 1, 10]);
        return mcNumbers(
          `Adding a ridge penalty with λ = ${lam} to a least-squares model makes its *training* error…`,
          { text: "Go up (a little)", why: "Least squares already minimised training error." },
          [
            { text: "Go down", why: "The penalty pulls the weights away from the best training fit.", misconception: "reg-improves-train" },
            { text: "Stay exactly the same", why: "The weights change, so the fit changes." },
          ],
        );
      },
    },
  ],
  "cross-validation": [
    {
      type: "compute",
      make: (r, lv) => {
        const k = r.pick([4, 5, 10]);
        const n = k * r.int(2, 20) * 10 * lv;
        const train = r.next() < 0.5;
        return num(
          `${k}-fold cross-validation on ${n} rows. How many rows does each model ${train ? "train on" : "get validated on"}?`,
          train ? (n * (k - 1)) / k : n / k,
          train ? `${k - 1} of the ${k} folds of ${n / k}.` : `One fold: ${n}/${k}.`,
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const k = 3 + lv;
        const scores = Array.from({ length: k }, () => r.int(70, 95) / 100);
        const mean = sum(scores) / k;
        return num(`Fold scores: ${list(scores)}. What is the cross-validation score (their mean, to two decimals)?`, r2(mean), `${r2(sum(scores))} / ${k} ≈ ${r3(mean)}.`, 0.006);
      },
    },
    {
      type: "error",
      make: (r) => {
        const cases = [
          { s: "standardised every column using all 20,000 rows, then split into train and test", m: "leak-preprocess" },
          { s: "picked the 30 features most correlated with the label on the full dataset, then ran 5-fold CV", m: "leak-preprocess" },
          { s: "tried 150 settings and reported the best one's test-set score as the expected accuracy", m: "tune-on-test" },
        ] as const;
        const c = r.pick(cases);
        return mcNumbers(
          `Dana ${c.s}. Is the reported score honest?`,
          { text: "No: it's optimistic, because the evaluation data leaked into the choices", why: c.m === "tune-on-test" ? "Choose with validation; touch the test set once." : "Fit every data-driven step inside each training fold." },
          [{ text: "Yes: the model never trained on those rows", why: "It learned from them indirectly.", misconception: c.m }],
        );
      },
    },
  ],
  "bias-variance": [
    {
      type: "compute",
      make: (r, lv) => {
        const b = r.int(1, 2 + lv);
        const v = r.int(1, 6);
        const noise = r.int(0, 3);
        return lv === 1
          ? num(`bias² = ${b * b}, variance = ${v} and noise = ${noise}. Expected test error?`, b * b + v + noise, `${b * b} + ${v} + ${noise}.`)
          : num(`A model's bias is ${b}, its variance ${v}, and the noise variance ${noise}. Expected test error (bias² + variance + noise)?`, b * b + v + noise, `${b}² + ${v} + ${noise} = ${b * b + v + noise}.`);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const highBias = r.next() < 0.5;
        const train = highBias ? r.int(20, 35) : r.int(1, 4);
        const val = highBias ? train + r.int(0, 3) : train + r.int(15, 30);
        return mcNumbers(
          `Training error ${train}%, validation error ${val}%, target 5%. What helps most?`,
          highBias
            ? { text: "A more flexible model or better features", why: "Both errors are high and close: underfitting (bias)." }
            : { text: "More data or stronger regularisation", why: "A big train–validation gap: overfitting (variance)." },
          highBias
            ? [
                { text: "Much more data", why: "More data won't help a model that can't fit the training set.", misconception: "more-data-fixes-bias" },
                { text: "Stronger regularisation", why: "That makes underfitting worse." },
              ]
            : [
                { text: "A bigger, more flexible model", why: "That widens the gap.", misconception: "more-complex-better" },
                { text: "Nothing: it's underfitting", why: `${train}% training error isn't underfitting.` },
              ],
        );
      },
    },
  ],
  "precision-recall": [
    {
      type: "compute",
      make: (r, lv) => {
        const tp = r.int(5, 20 * lv);
        const fp = r.int(1, 10 * lv);
        const fn = r.int(1, 10 * lv);
        const which = r.pick(["precision", "recall", "F1"] as const);
        const P = tp / (tp + fp);
        const R = tp / (tp + fn);
        const F = (2 * P * R) / (P + R);
        const ans = which === "precision" ? P : which === "recall" ? R : F;
        const explain =
          which === "precision" ? `TP/(TP + FP) = ${tp}/${tp + fp}.` : which === "recall" ? `TP/(TP + FN) = ${tp}/${tp + fn}.` : `P = ${r3(P)}, R = ${r3(R)}, F1 = 2PR/(P + R) ≈ ${r3(F)}.`;
        return num(`TP = ${tp}, FP = ${fp}, FN = ${fn}. What is the ${which}, to two decimals?`, r2(ans), explain, 0.01);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const n = r.int(4, 20) * 10;
        const k = r.int(1, n / 10 - 1) * 10;
        const isPrecision = r.next() < 0.5;
        return mcNumbers(
          isPrecision
            ? `A model raises ${n} alerts, and ${k} of them are real problems. That ${pct(k / n)} is its…`
            : `There are ${n} real problems, and the model catches ${k} of them. That ${pct(k / n)} is its…`,
          { text: isPrecision ? "Precision" : "Recall", why: isPrecision ? "Of those flagged, the fraction that were right." : "Of the real positives, the fraction found." },
          [
            { text: isPrecision ? "Recall" : "Precision", why: "Check what the fraction is out of.", misconception: "precision-recall-swap" },
            { text: "Accuracy", why: "Accuracy counts every example, including true negatives." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const q = r.pick([0.5, 1, 2, 3, 5]);
        return mcNumbers(
          `Positives are ${q}% of the data. A model that always predicts "negative" scores ${100 - q}% accuracy. Is it any good?`,
          { text: "No: its recall is 0", why: "It finds none of the positives." },
          [{ text: `Yes: ${100 - q}% is excellent`, why: "Accuracy is high only because positives are rare.", misconception: "accuracy-imbalanced" }],
        );
      },
    },
  ],
  "roc-auc": [
    {
      type: "compute",
      make: (r, lv) => {
        const fpr = r.next() < 0.5;
        const a = r.int(1, 20 * lv);
        const b = r.int(5, 50 * lv);
        return fpr
          ? num(`FP = ${a} and TN = ${b}. What is the false positive rate, to two decimals?`, r2(a / (a + b)), `FP/(FP + TN) = ${a}/${a + b}.`, 0.01)
          : num(`TP = ${b} and FN = ${a}. What is the true positive rate, to two decimals?`, r2(b / (a + b)), `TP/(TP + FN) = ${b}/${a + b}.`, 0.01);
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const auc = r.pick([0.5, 0.51, 0.53, 0.55]);
        return mcNumbers(
          `A fraud model's AUC is ${auc}. It is…`,
          { text: "Barely better than random guessing", why: "0.5 is the coin-flip baseline." },
          [
            { text: "Decent: it's above 0.5", why: `${auc} means almost no separation.`, misconception: "auc-half-decent" },
            { text: "Excellent", why: "Excellent would be 0.9 or more." },
          ],
        );
      },
    },
    {
      type: "interpret",
      make: (r) => {
        const from = r.pick([0.3, 0.5]);
        const to = r.pick([0.6, 0.7, 0.8]);
        return mcNumbers(
          `You move a classifier's threshold from ${from} to ${to}. Its AUC…`,
          { text: "Stays the same", why: "AUC summarises every threshold at once." },
          [
            { text: "Goes up", why: "Moving the threshold moves you along the curve, not the curve.", misconception: "auc-threshold" },
            { text: "Goes down", why: "The curve and its area don't change.", misconception: "auc-threshold" },
          ],
        );
      },
    },
    {
      type: "compute",
      make: (r, lv) => {
        const pairs = r.pick([50, 100, 200]) * lv;
        const wins = r.int(Math.round(pairs * 0.55), Math.round(pairs * 0.98));
        return num(`In ${pairs} random (positive, negative) pairs, a model scores the positive higher in ${wins}. Estimate its AUC, to two decimals.`, r2(wins / pairs), `AUC is P(positive outscores negative) ≈ ${wins}/${pairs}.`, 0.01);
      },
    },
  ],
};
