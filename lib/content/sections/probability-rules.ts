import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Classical probability by counting; the addition theorem (two and three events); mutually exclusive versus independent events; complements and "at least one"; the multiplication theorem and drawing without replacement; total probability; repeated independent trials. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n: number, r: number) => (r < 0 || r > n ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));

const base: ConceptNode = {
  id: "probability-rules",
  title: "Probability by counting: addition & multiplication rules",
  summary: "When outcomes are equally likely, a probability is favourable outcomes over total outcomes, so counting does the work. Two rules combine events: the addition rule P(A ∪ B) = P(A) + P(B) − P(A ∩ B) avoids double counting, and the multiplication rule P(A ∩ B) = P(A)·P(B | A) handles events in sequence. \"At least one\" is almost always easiest as one minus \"none\".",
  deps: ["combinations-advanced", "binomial-theorem"],
  pos: { x: 4, y: 0 },
  glossary: [
    { term: "mutually exclusive", meaning: "Events that can't happen together: $P(A \\cap B) = 0$." },
    { term: "independent", meaning: "Events with $P(A \\cap B) = P(A)P(B)$: knowing one happened doesn't change the other's probability." },
    { term: "classical probability", meaning: "$P(A) = \\dfrac{\\text{number of outcomes in } A}{\\text{number of equally likely outcomes}}$." },
  ],
  misconceptions: {
    "exclusive-independent": "Thinks mutually exclusive events (with positive probabilities) are independent.",
    "add-without-overlap": "Adds probabilities of events that can happen together, as if $P(A \\cup B) = P(A) + P(B)$.",
  },
  steps: [
    {
      type: "motivate",
      title: "Counting meets chance",
      body: "Five cards are dealt from a shuffled deck: what is the chance of exactly two aces? Two dice are rolled: what is the chance of a sum of 7 or a double? Every JEE probability question is a counting question in disguise, combined with two rules for \"or\" and \"and\".",
      realWorld: {
        title: "The birthday problem",
        body: "In a group of 23 people, the chance that two share a birthday is just over 50%, much higher than most people guess. It is computed as one minus the chance that all birthdays differ, $\\dfrac{365 \\times 364 \\times \\dots \\times 343}{365^{23}}$.",
      },
    },
    {
      type: "truth",
      statement: "For equally likely outcomes, $P(A) = \\dfrac{\\lvert A\\rvert}{\\lvert S\\rvert}$. **Addition theorem**: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$; for three events, $P(A \\cup B \\cup C) = \\sum P(A) - \\sum P(A \\cap B) + P(A \\cap B \\cap C)$. **Complement**: $P(A') = 1 - P(A)$. **Multiplication theorem**: $P(A \\cap B) = P(A)\\,P(B \\mid A)$; for independent events $P(A \\cap B) = P(A)P(B)$. Mutually exclusive events with positive probabilities are **never** independent: if one happens, the other can't.",
      body: "Counting with combinations: the probability of exactly $k$ red balls when drawing $r$ from $R$ red and $B$ blue (without replacement) is $\\dfrac{\\binom Rk\\binom B{r - k}}{\\binom{R + B}r}$. With replacement, or for repeated independent trials with success probability $p$, the probability of exactly $k$ successes in $n$ trials is $\\binom nkp^k(1 - p)^{n-k}$ (§{binomial-theorem}; developed in §{binomial}). **Total probability**: if $B_1, \\dots, B_m$ partition the sample space, $P(A) = \\sum P(B_i)P(A \\mid B_i)$, and reversing the conditioning is Bayes' theorem (§{bayes}).",
    },
    {
      type: "predict",
      misconception: "add-without-overlap",
      item: {
        kind: "mc",
        id: "prr-predict-1",
        prompt: "A card is drawn from a standard 52-card deck. The probability it is a king or a heart is",
        options: [
          { id: "a", text: "$\\tfrac{16}{52}$", correct: true, why: "$\\tfrac4{52} + \\tfrac{13}{52} - \\tfrac1{52}$." },
          { id: "b", text: "$\\tfrac{17}{52}$", misconception: "add-without-overlap", why: "The king of hearts is counted twice." },
          { id: "c", text: "$\\tfrac1{52}$", why: "That is the probability of both." },
        ],
      },
      reveal: {
        body: "There are 4 kings and 13 hearts, but the king of hearts is in both groups. Adding $4 + 13$ counts it twice, so subtract it once: 16 cards qualify, probability $\\tfrac{16}{52} = \\tfrac4{13}$. The addition rule is inclusion–exclusion (§{sets-relations}) applied to probabilities.",
      },
      resolve: {
        kind: "mc",
        id: "prr-resolve-1",
        prompt: "$P(A) = 0.5$, $P(B) = 0.4$, $P(A \\cap B) = 0.2$. Then $P(A \\cup B)$ is",
        options: [
          { id: "a", text: "0.7", correct: true, why: "$0.5 + 0.4 - 0.2$." },
          { id: "b", text: "0.9", misconception: "add-without-overlap", why: "Subtract the overlap." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prr-check-1",
        prompt: "A die is rolled once. $A$: the result is 1. $B$: the result is 2. Are $A$ and $B$ independent?",
        options: [
          { id: "a", text: "No: they are mutually exclusive, so $P(A \\cap B) = 0 \\ne P(A)P(B)$", correct: true, why: "Knowing $A$ happened makes $B$ impossible." },
          { id: "b", text: "Yes: mutually exclusive events don't affect each other", misconception: "exclusive-independent", why: "Exclusive events affect each other completely." },
          { id: "c", text: "Yes, because the die is fair", why: "Fairness doesn't make them independent." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prr-check-2",
        prompt: "Three fair coins are tossed. The probability of at least one head is",
        options: [
          { id: "a", text: "$\\tfrac78$", correct: true, why: "$1 - P(\\text{no heads}) = 1 - \\tfrac18$." },
          { id: "b", text: "$\\tfrac38$", why: "That is exactly one head." },
          { id: "c", text: "$\\tfrac32$", why: "Probabilities can't exceed 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Classifiers output probabilities that must obey these rules; ensembles of independent models fail together with probability equal to the product of their individual failure rates, which is why diversity among models matters. Naive Bayes multiplies feature probabilities by assuming independence (§{svm-knn-nb}).",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "prr-produce-1", prompt: "Two cards are drawn without replacement from a 52-card deck. Find the probability both are aces, to 4 decimals.", answer: Math.round((4 / 52) * (3 / 51) * 10000) / 10000, tolerance: 0.0001, explain: "$\\tfrac4{52} \\times \\tfrac3{51} = \\tfrac1{221}$." },
        { kind: "number", id: "prr-produce-2", prompt: "A bag has 5 red and 3 blue balls; 3 are drawn at random. Find the probability exactly 2 are red, to 3 decimals.", answer: Math.round(((C(5, 2) * C(3, 1)) / C(8, 3)) * 1000) / 1000, tolerance: 0.001, explain: "$\\dfrac{\\binom52\\binom31}{\\binom83} = \\tfrac{30}{56}$." },
        {
          kind: "mc",
          id: "prr-produce-3",
          prompt: "Two events each have probability 0.3 and can't both occur. Then they are",
          options: [
            { id: "a", text: "dependent", correct: true, why: "$P(A \\cap B) = 0 \\ne 0.09$." },
            { id: "b", text: "independent", misconception: "exclusive-independent", why: "Exclusive events with positive probability are dependent." },
          ],
        },
        {
          kind: "mc",
          id: "prr-produce-4",
          prompt: "Two dice are rolled. The probability of a sum of 8 or a double is",
          options: [
            { id: "a", text: "$\\tfrac{10}{36}$", correct: true, why: "5 eights + 6 doubles − 1 for $(4, 4)$, which is both." },
            { id: "b", text: "$\\tfrac{11}{36}$", misconception: "add-without-overlap", why: "$(4, 4)$ is counted twice." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "prr-review-1", prompt: "$P(A) = 0.6$ and $P(B) = 0.5$ for independent $A, B$. Find $P(A \\cap B)$.", answer: 0.3, explain: "$0.6 \\times 0.5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "drawing with and without replacement",
      body: "Without replacement, later draws depend on earlier ones: $P(\\text{2 aces}) = \\tfrac4{52} \\cdot \\tfrac3{51}$, equivalently $\\dfrac{\\binom42}{\\binom{52}2}$. With replacement, the draws are independent: $\\left(\\tfrac4{52}\\right)^2$. Counting with combinations and multiplying conditional probabilities always agree.",
    },
    {
      type: "definition",
      term: "independence of several events",
      body: "$A, B, C$ are (mutually) independent if every pair is independent **and** $P(A \\cap B \\cap C) = P(A)P(B)P(C)$. Pairwise independence alone isn't enough: with two fair coins, \"first is heads\", \"second is heads\" and \"exactly one head\" are pairwise independent but not mutually independent.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      name: "the addition theorem",
      statement: "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.",
      proof: ["$A \\cup B$ is the disjoint union of $A$ and $B \\setminus A$, and $P(B \\setminus A) = P(B) - P(A \\cap B)$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "exclusive events aren't independent",
      statement: "If $A \\cap B = \\varnothing$ and $P(A), P(B) > 0$, then $A$ and $B$ are not independent.",
      proof: ["$P(A \\cap B) = 0$ while $P(A)P(B) > 0$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "at least one",
      statement: "$P(\\text{at least one}) = 1 - P(\\text{none})$; for independent events with probabilities $p_i$, $P(\\text{at least one}) = 1 - \\prod(1 - p_i)$.",
      proof: ["\"At least one\" and \"none\" are complements; for independent events the probabilities of the complements multiply."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Two dice are rolled. Find the probability that the sum is 8.",
      solution: ["Favourable: $(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)$: 5 outcomes.", "$\\tfrac{5}{36}$."],
      result: "$\\tfrac5{36}$.",
    },
    {
      type: "example",
      level: 2,
      title: "a committee by chance",
      problem: "A committee of 4 is chosen at random from 6 men and 4 women. Find the probability it has exactly 2 women.",
      solution: ["$\\dfrac{\\binom42\\binom62}{\\binom{10}4} = \\dfrac{6 \\times 15}{210}$.", "$= \\tfrac{90}{210} = \\tfrac37$."],
      result: "$\\tfrac37$.",
    },
    {
      type: "example",
      level: 3,
      title: "at least one success",
      problem: "Three independent shooters hit a target with probabilities 0.5, 0.6 and 0.8. Find the probability the target is hit at least once.",
      solution: ["$P(\\text{all miss}) = 0.5 \\times 0.4 \\times 0.2 = 0.04$.", "$1 - 0.04 = 0.96$."],
      result: "0.96.",
    },
  ],
  pitfalls: [
    { wrong: "$P(A \\cup B) = P(A) + P(B)$ always.", right: "Only for mutually exclusive events; otherwise subtract $P(A \\cap B)$." },
    { wrong: "Exclusive events are independent.", right: "They are as dependent as possible." },
    { wrong: "Add many cases for \"at least one\".", right: "Use $1 - P(\\text{none})$." },
  ],
  formulas: [
    { label: "Classical", tex: "P(A) = \\lvert A\\rvert/\\lvert S\\rvert" },
    { label: "Addition", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
    { label: "Multiplication", tex: "P(A \\cap B) = P(A)P(B \\mid A)" },
    { label: "Repeated trials", tex: "\\binom nkp^k(1 - p)^{n-k}" },
  ],
  exercises: [
    ex(1, fr("prrx-ex-1", "A card is drawn from a 52-card deck. Find the probability it is a king or a heart.", 16 / 52, "$4 + 13 - 1$ cards."), ["$\\tfrac4{13}$."]),
    ex(1, fr("prrx-ex-2", "Two dice are rolled. Find the probability of a sum of 8.", 5 / 36, "5 outcomes."), ["$\\tfrac5{36}$."]),
    ex(2, fr("prrx-ex-3", "A committee of 4 from 6 men and 4 women is chosen at random. Find the probability it has exactly 2 women.", 3 / 7, "$90/210$."), ["$\\tfrac37$."]),
    ex(2, num("prrx-ex-4", "Three independent shooters hit with probabilities 0.5, 0.6, 0.8. Find the probability of at least one hit.", 0.96, "$1 - 0.04$."), ["$0.96$."]),
    ex(2, fr("prrx-ex-5", "A fair coin is tossed 5 times. Find the probability of exactly 3 heads.", C(5, 3) / 32, "$\\binom53/2^5$."), ["$\\tfrac{10}{32} = \\tfrac5{16}$."]),
    ex(3, num("prrx-ex-6", "$P(A) = 0.4$, $P(B) = 0.5$, $P(C) = 0.3$, pairwise intersections 0.2, 0.1, 0.15, and $P(A \\cap B \\cap C) = 0.05$. Find $P(A \\cup B \\cup C)$.", 0.8, "$1.2 - 0.45 + 0.05$."), ["$0.8$."]),
    ex(3, fr("prrx-ex-7", "Four people each pick a random day of the week. Find the probability that at least two pick the same day.", 1 - (7 * 6 * 5 * 4) / 7 ** 4, "$1 - \\tfrac{7 \\cdot 6 \\cdot 5 \\cdot 4}{7^4}$."), ["$1 - \\tfrac{840}{2401} \\approx 0.650$."]),
    ex(3, mc("prrx-ex-8", "$A$ and $B$ are independent with $P(A) = 0.3$, $P(B) = 0.4$. $P(A \\cup B)$ is", ["0.58", "$0.3 + 0.4 - 0.12$."], [["0.7", "Subtract $P(A)P(B)$."], ["0.12", "That is $P(A \\cap B)$."]]), ["Independence gives the intersection; the addition rule does the rest."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a = r2(r.int(2, 7) / 10);
      const b = r2(r.int(2, 7) / 10);
      const lo = Math.max(0, a + b - 1);
      const both = r2(Math.max(lo, r.int(0, Math.round(Math.min(a, b) * 10)) / 10));
      const v = r2(a + b - both);
      return n(`$P(A) = ${a}$, $P(B) = ${b}$ and $P(A \\cap B) = ${both}$. Find $P(A \\cup B)$.`, v, `$${a} + ${b} - ${both} = ${v}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const R = r.int(3, 7);
      const B = r.int(2, 6);
      const draw = r.int(2, Math.min(4, R + B - 1));
      const k = r.int(Math.max(0, draw - B), Math.min(draw, R));
      const v = (C(R, k) * C(B, draw - k)) / C(R + B, draw);
      return n(`A bag has ${R} red and ${B} blue balls. ${draw} are drawn without replacement. Find the probability that exactly ${k} are red (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\binom{${R}}{${k}}\\binom{${B}}{${draw - k}}}{\\binom{${R + B}}{${draw}}} \\approx ${Math.round(v * 1000) / 1000}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const ps = Array.from({ length: r.int(2, 4) }, () => r2(r.int(1, 9) / 10));
      const none = ps.reduce((s, p) => s * (1 - p), 1);
      const v = 1 - none;
      return n(`Independent events have probabilities ${ps.join(", ")}. Find the probability that at least one happens (4 decimals).`, Math.round(v * 10000) / 10000, `$1 - ${ps.map((p) => `(1 - ${p})`).join("")} \\approx ${Math.round(v * 10000) / 10000}$.`, 0.0001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        ["drawing a red card", "drawing a black card"],
        ["rolling an even number", "rolling a 3"],
        ["a student passing", "the same student failing"],
      ] as const);
      return mcNumbers(
        `On a single trial, \"${v[0]}\" and \"${v[1]}\" are mutually exclusive, each with positive probability. They are`,
        { text: "dependent", why: "If one happens the other can't, so $P(A \\cap B) = 0 \\ne P(A)P(B)$." },
        [{ text: "independent", why: "Exclusive events can't be independent.", misconception: "exclusive-independent" }],
      );
    },
  },
];
