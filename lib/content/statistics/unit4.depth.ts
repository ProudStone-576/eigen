import { ex, mc, num, type Depth } from "../deepen";

/** Probability & Bayes at exam depth: probability rules, random variables, expectation, conditioning, Bayes, independence. */

/** A probability answer: accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

export const UNIT4_DEPTH: Record<string, Depth> = {
  // §{probability}
  probability: {
    definitions: [
      {
        type: "definition",
        term: "sample space, event",
        body: "The **sample space** $S$ is the set of all possible outcomes of an experiment; an **event** is a subset of $S$. $A \\cup B$ (A or B), $A \\cap B$ (A and B) and $A^c$ (not A) are again events. $A$ and $B$ are **mutually exclusive** if $A \\cap B = \\varnothing$.",
      },
      {
        type: "definition",
        term: "axioms, equally likely outcomes",
        body: "A probability assigns each event a number with $0 \\le P(A) \\le 1$, $P(S) = 1$, and $P(A \\cup B) = P(A) + P(B)$ whenever $A$ and $B$ are mutually exclusive. When all $|S|$ outcomes are equally likely, $P(A) = \\dfrac{|A|}{|S|}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "complement",
        statement: "$P(A^c) = 1 - P(A)$. In particular $P(\\text{at least one}) = 1 - P(\\text{none})$.",
        proof: ["$A$ and $A^c$ are mutually exclusive and together make $S$, so $P(A) + P(A^c) = P(S) = 1$."],
      },
      {
        type: "theorem",
        name: "inclusion–exclusion",
        statement: "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$, and for three events $P(A \\cup B \\cup C) = \\sum P(A) - \\sum P(A \\cap B) + P(A \\cap B \\cap C)$, the middle sum running over the three pairs.",
        proof: [
          "$A \\cup B$ splits into the mutually exclusive pieces $A$ and $B \\cap A^c$, and $B$ splits into $B \\cap A$ and $B \\cap A^c$. So $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.",
          "For three events, apply the two-event rule to $(A \\cup B) \\cup C$ and expand: outcomes in exactly two events are counted twice and removed once; outcomes in all three are added three times, removed three times and added back once.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Two fair dice are rolled. Find the probability that the sum is 7.",
        solution: ["There are $6 \\times 6 = 36$ equally likely outcomes.", "Sum 7: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$, six outcomes. $P = 6/36$."],
        result: "$\\tfrac16$.",
      },
      {
        type: "example",
        level: 2,
        title: "overlapping events",
        problem: "One card is drawn from a standard 52-card deck. Find $P(\\text{heart or king})$.",
        solution: ["$P(\\text{heart}) = \\tfrac{13}{52}$, $P(\\text{king}) = \\tfrac{4}{52}$, and the king of hearts is in both: $\\tfrac{1}{52}$.", "$\\tfrac{13 + 4 - 1}{52} = \\tfrac{16}{52}$."],
        result: "$\\tfrac{4}{13}$.",
      },
      {
        type: "example",
        level: 3,
        title: "counting with inclusion–exclusion",
        problem: "A three-digit number is chosen at random. Find the probability that it is divisible by 3 or by 5.",
        solution: [
          "There are 900 three-digit numbers (100 to 999). Multiples of 3: $999/3 - 99/3 = 333 - 33 = 300$. Multiples of 5: $199 - 19 = 180$. Multiples of 15: $66 - 6 = 60$.",
          "Divisible by 3 or 5: $300 + 180 - 60 = 420$, so $P = \\tfrac{420}{900}$.",
        ],
        result: "$\\tfrac{7}{15}$.",
      },
    ],
    pitfalls: [
      { wrong: "$P(A \\cup B) = P(A) + P(B)$ always.", right: "Only for mutually exclusive events. Otherwise subtract $P(A \\cap B)$, which was counted twice." },
      { wrong: "Two dice: the sums $2, 3, \\dots, 12$ are equally likely.", right: "The 36 ordered outcomes are equally likely; sums are not (7 has six outcomes, 2 has one)." },
      { wrong: "$P(\\text{at least one six in 4 rolls}) = 4 \\cdot \\tfrac16$.", right: "Use the complement: $1 - (\\tfrac56)^4 \\approx 0.518$. Adding overcounts the overlaps." },
    ],
    formulas: [
      { label: "Equally likely", tex: "P(A) = |A| / |S|" },
      { label: "Complement", tex: "P(A^c) = 1 - P(A)" },
      { label: "Union", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
    ],
    exercises: [
      ex(1, fr("prb-ex-1", "Two fair dice are rolled. Find $P(\\text{sum} = 8)$.", 5 / 36, "Count the outcomes."), ["Sum 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$: 5 of 36."]),
      ex(1, num("prb-ex-2", "$P(A) = 0.3$. Find $P(A^c)$.", 0.7, "$1 - 0.3$."), ["$1 - 0.3 = 0.7$."]),
      ex(1, num("prb-ex-3", "A fair coin is tossed three times. Find $P(\\text{exactly two heads})$.", 0.375, "3 of 8 outcomes."), ["Of the 8 outcomes, $HHT, HTH, THH$ have exactly two heads: $3/8 = 0.375$."]),
      ex(2, num("prb-ex-4", "$P(A) = 0.5$, $P(B) = 0.4$ and $P(A \\cap B) = 0.2$. Find $P(A \\cup B)$.", 0.7, "Inclusion–exclusion."), ["$0.5 + 0.4 - 0.2 = 0.7$."]),
      ex(2, fr("prb-ex-5", "A fair coin is tossed 5 times. Find $P(\\text{at least one head})$.", 31 / 32, "Complement of all tails."), ["$P(\\text{no heads}) = (\\tfrac12)^5 = \\tfrac1{32}$, so the answer is $\\tfrac{31}{32}$."]),
      ex(2, fr("prb-ex-6", "Two balls are drawn without replacement from a bag of 5 red and 3 blue. Find $P(\\text{both red})$.", 5 / 14, "$\\binom52 / \\binom82$."), ["$\\binom52 = 10$ ways to choose two red out of $\\binom82 = 28$ pairs.", "$10/28 = \\tfrac5{14}$."]),
      ex(3, num("prb-ex-7", "An integer is chosen at random from 1 to 100. Find the probability it is divisible by 2 or 3.", 0.67, "$50 + 33 - 16$."), ["Multiples of 2: 50; of 3: 33; of 6: 16.", "$(50 + 33 - 16)/100 = 0.67$."]),
      ex(3, num("prb-ex-8", "$P(A) = P(B) = P(C) = 0.3$, each pairwise intersection has probability 0.1 and $P(A \\cap B \\cap C) = 0.05$. Find $P(A \\cup B \\cup C)$.", 0.65, "Three-event inclusion–exclusion."), ["$0.9 - 0.3 + 0.05 = 0.65$."]),
      ex(3, fr("prb-ex-9", "A fair die is rolled 4 times. Find $P(\\text{at least one six})$.", 671 / 1296, "Complement."), ["$1 - (\\tfrac56)^4 = 1 - \\tfrac{625}{1296} = \\tfrac{671}{1296} \\approx 0.518$."]),
      ex(3, mc("prb-ex-10", "Events $A$ and $B$ have $P(A) = 0.6$ and $P(B) = 0.7$. Which must be true?", ["$A$ and $B$ are not mutually exclusive", "If they were, $P(A \\cup B) = 1.3 > 1$."], [["$A$ and $B$ are independent", "Nothing given forces that."], ["$P(A \\cap B) = 0.42$", "That holds only if they are independent."]]), [
        "$P(A \\cap B) = P(A) + P(B) - P(A \\cup B) \\ge 0.6 + 0.7 - 1 = 0.3 > 0$, so they overlap.",
      ]),
    ],
  },

  // §{random-variable}
  "random-variable": {
    definitions: [
      {
        type: "definition",
        term: "random variable, distribution",
        body: "A **random variable** $X$ assigns a number to each outcome. A **discrete** random variable has a **probability mass function** $p(x) = P(X = x)$ with $p(x) \\ge 0$ and $\\sum_x p(x) = 1$.",
      },
      {
        type: "definition",
        term: "cumulative distribution function",
        body: "The **CDF** of $X$ is $F(x) = P(X \\le x)$. It rises from 0 to 1, never decreases, and for a discrete $X$ jumps by $p(x)$ at each value $x$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        statement: "$P(a < X \\le b) = F(b) - F(a)$, and for a discrete $X$ taking integer values, $P(X = k) = F(k) - F(k - 1)$.",
        proof: ["The event $\\{X \\le b\\}$ splits into the mutually exclusive events $\\{X \\le a\\}$ and $\\{a < X \\le b\\}$, so $F(b) = F(a) + P(a < X \\le b)$."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "maximum of two dice",
        statement: "If $X$ is the larger of two fair dice, $P(X \\le k) = (k/6)^2$ and $P(X = k) = \\dfrac{2k - 1}{36}$ for $k = 1, \\dots, 6$.",
        proof: [
          "$X \\le k$ means both dice are at most $k$: $k^2$ of the 36 outcomes.",
          "$P(X = k) = F(k) - F(k - 1) = \\dfrac{k^2 - (k - 1)^2}{36} = \\dfrac{2k - 1}{36}$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$X$ is the number of heads in two tosses of a fair coin. Find its distribution.",
        solution: ["Outcomes $HH, HT, TH, TT$ are equally likely.", "$X = 2$ for one, $X = 1$ for two, $X = 0$ for one."],
        result: "$P(X = 0) = \\tfrac14$, $P(X = 1) = \\tfrac12$, $P(X = 2) = \\tfrac14$.",
      },
      {
        type: "example",
        level: 2,
        title: "finding the constant",
        problem: "$P(X = k) = ck$ for $k = 1, 2, 3, 4$. Find $c$ and $P(X \\ge 3)$.",
        solution: ["The probabilities sum to 1: $c(1 + 2 + 3 + 4) = 10c = 1$, so $c = \\tfrac1{10}$.", "$P(X \\ge 3) = \\tfrac{3 + 4}{10}$."],
        result: "$c = \\tfrac1{10}$, $P(X \\ge 3) = \\tfrac7{10}$.",
      },
      {
        type: "example",
        level: 3,
        title: "an infinite distribution",
        problem: "$P(X = k) = c\\left(\\tfrac12\\right)^k$ for $k = 1, 2, 3, \\dots$. Find $c$ and $P(X \\text{ is even})$.",
        solution: [
          "$\\sum_{k \\ge 1} (\\tfrac12)^k = \\dfrac{1/2}{1 - 1/2} = 1$, so $c = 1$.",
          "$P(\\text{even}) = \\sum_{j \\ge 1} (\\tfrac12)^{2j} = \\sum (\\tfrac14)^j = \\dfrac{1/4}{1 - 1/4} = \\tfrac13$.",
        ],
        result: "$c = 1$, $P(\\text{even}) = \\tfrac13$.",
      },
    ],
    pitfalls: [
      { wrong: "Any list of numbers between 0 and 1 is a distribution.", right: "They must also add up to exactly 1." },
      { wrong: "$P(X < 3) = F(3)$.", right: "$F(3) = P(X \\le 3)$ includes $X = 3$. For an integer-valued $X$, $P(X < 3) = F(2)$." },
    ],
    formulas: [
      { label: "Valid distribution", tex: "p(x) \\ge 0,\\ \\textstyle\\sum p(x) = 1" },
      { label: "CDF", tex: "F(x) = P(X \\le x),\\quad P(a < X \\le b) = F(b) - F(a)" },
    ],
    exercises: [
      ex(1, num("rv-ex-1", "$P(X = k) = c$ for $k = 1, \\dots, 5$. Find $c$.", 0.2, "Five equal probabilities."), ["$5c = 1$, so $c = 0.2$."]),
      ex(1, fr("rv-ex-2", "$X$ is the sum of two fair dice. Find $P(X = 2)$.", 1 / 36, "Only $(1, 1)$."), ["Only $(1, 1)$ gives 2: $\\tfrac1{36}$."]),
      ex(2, fr("rv-ex-3", "$P(X = k) = ck^2$ for $k = 1, 2, 3$. Find $c$.", 1 / 14, "$c(1 + 4 + 9) = 1$."), ["$14c = 1$, so $c = \\tfrac1{14}$."]),
      ex(2, num("rv-ex-4", "$P(X = k) = k/10$ for $k = 1, 2, 3, 4$. Find $F(3)$.", 0.6, "$P(X \\le 3)$."), ["$F(3) = \\tfrac{1 + 2 + 3}{10} = 0.6$."]),
      ex(2, fr("rv-ex-5", "$X$ is the larger of two fair dice. Find $P(X = 6)$.", 11 / 36, "$(2k - 1)/36$."), ["$P(X = 6) = \\tfrac{2 \\cdot 6 - 1}{36} = \\tfrac{11}{36}$."]),
      ex(3, fr("rv-ex-6", "$Y$ is the smaller of two fair dice. Find $P(Y \\ge 3)$.", 4 / 9, "Both dice at least 3."), ["$Y \\ge 3$ means both dice show 3–6: $(\\tfrac46)^2 = \\tfrac49$."]),
      ex(3, fr("rv-ex-7", "$P(X = k) = (\\tfrac12)^k$ for $k = 1, 2, \\dots$. Find $P(X \\text{ is even})$.", 1 / 3, "Geometric series in $\\tfrac14$."), ["$\\sum_{j \\ge 1} (\\tfrac14)^j = \\tfrac{1/4}{3/4} = \\tfrac13$."]),
      ex(3, fr("rv-ex-8", "$X$ is the larger of two fair dice. Find $P(X \\le 4)$.", 4 / 9, "$(k/6)^2$."), ["$F(4) = (\\tfrac46)^2 = \\tfrac{16}{36} = \\tfrac49$."]),
    ],
  },

  // §{expectation}
  expectation: {
    definitions: [
      {
        type: "definition",
        term: "expected value",
        body: "The **expected value** of a discrete random variable is $E[X] = \\sum_x x\\,P(X = x)$, and more generally $E[g(X)] = \\sum_x g(x)\\,P(X = x)$. A game is **fair** when the expected gain is 0.",
      },
      {
        type: "definition",
        term: "indicator variable",
        body: "The **indicator** of an event $A$ is $I_A = 1$ if $A$ happens and $0$ otherwise. Its expectation is $E[I_A] = P(A)$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "linearity of expectation",
        statement: "$E[aX + b] = aE[X] + b$, and $E[X + Y] = E[X] + E[Y]$ for any random variables $X$ and $Y$, independent or not.",
        proof: [
          "$E[aX + b] = \\sum (ax + b)p(x) = a\\sum xp(x) + b\\sum p(x) = aE[X] + b$.",
          "For $X + Y$, sum over the joint outcomes: $\\sum_{x,y}(x + y)P(x, y) = \\sum_x x\\sum_y P(x, y) + \\sum_y y\\sum_x P(x, y) = E[X] + E[Y]$. No independence was used.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "waiting for a success",
        statement: "If each independent trial succeeds with probability $p$, the expected number of trials up to and including the first success is $1/p$.",
        proof: [
          "Let $m$ be the expected number. The first trial always counts; with probability $1 - p$ it fails and the process starts afresh.",
          "So $m = 1 + (1 - p)m$, giving $pm = 1$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find the expected value of one roll of a fair die.",
        solution: ["$E[X] = \\tfrac16(1 + 2 + 3 + 4 + 5 + 6) = \\tfrac{21}{6}$.", "The answer need not be a possible value of $X$."],
        result: "$3.5$.",
      },
      {
        type: "example",
        level: 2,
        title: "is the game fair?",
        problem: "You win 10 if a die shows 6 and lose 2 otherwise. Find your expected gain.",
        solution: ["$E = 10 \\cdot \\tfrac16 + (-2) \\cdot \\tfrac56 = \\tfrac{10 - 10}{6}$.", "An expected gain of 0 means the game is fair."],
        result: "$0$: the game is fair.",
      },
      {
        type: "example",
        level: 3,
        title: "indicators",
        problem: "$n$ letters are put into $n$ addressed envelopes at random. Find the expected number of letters in the right envelope.",
        solution: [
          "Let $I_k = 1$ if letter $k$ is in its own envelope. Each letter is equally likely to land in any envelope, so $E[I_k] = \\tfrac1n$.",
          "The number of matches is $I_1 + \\dots + I_n$. By linearity its expectation is $n \\cdot \\tfrac1n = 1$, even though the $I_k$ are dependent.",
        ],
        result: "$1$, for every $n$.",
      },
    ],
    pitfalls: [
      { wrong: "$E[X^2] = (E[X])^2$.", right: "False in general: for a die $E[X^2] = \\tfrac{91}{6} \\approx 15.17$, but $(E[X])^2 = 12.25$." },
      { wrong: "$E[X + Y] = E[X] + E[Y]$ needs independence.", right: "Linearity always holds. Independence is needed for $E[XY] = E[X]E[Y]$." },
      { wrong: "The expected value is the most likely value.", right: "It is the long-run average. For a die it is 3.5, which never occurs." },
    ],
    formulas: [
      { label: "Definition", tex: "E[X] = \\textstyle\\sum x\\,P(X = x)" },
      { label: "Linearity", tex: "E[aX + bY + c] = aE[X] + bE[Y] + c" },
      { label: "Indicator", tex: "E[I_A] = P(A)" },
      { label: "First success", tex: "E[\\text{trials}] = 1/p" },
    ],
    exercises: [
      ex(1, num("ev-ex-1", "$X$ takes values 0, 1, 2 with probabilities $\\tfrac14, \\tfrac12, \\tfrac14$. Find $E[X]$.", 1, "$0 + \\tfrac12 + \\tfrac12$."), ["$0 \\cdot \\tfrac14 + 1 \\cdot \\tfrac12 + 2 \\cdot \\tfrac14 = 1$."]),
      ex(1, num("ev-ex-2", "$E[X] = 4$. Find $E[2X + 3]$.", 11, "Linearity."), ["$2 \\cdot 4 + 3 = 11$."]),
      ex(1, num("ev-ex-3", "A ticket costs 2 and wins 100 with probability 0.01. Find the expected profit.", -1, "$100 \\cdot 0.01 - 2$."), ["Expected winnings $100 \\cdot 0.01 = 1$; minus the cost 2 gives $-1$."]),
      ex(2, num("ev-ex-4", "Find the expected sum of two fair dice.", 7, "Linearity."), ["$E[X_1 + X_2] = 3.5 + 3.5 = 7$."]),
      ex(2, fr("ev-ex-5", "Find $E[X^2]$ for one roll of a fair die.", 91 / 6, "$\\tfrac16(1 + 4 + \\dots + 36)$."), ["$\\tfrac16(1 + 4 + 9 + 16 + 25 + 36) = \\tfrac{91}{6} \\approx 15.167$."]),
      ex(2, num("ev-ex-6", "You pay $x$ to play a game that pays 20 with probability $\\tfrac14$ and nothing otherwise. Find $x$ for a fair game.", 5, "Expected payout."), ["Expected payout $20 \\cdot \\tfrac14 = 5$, so a fair price is 5."]),
      ex(3, num("ev-ex-7", "A fair die is rolled until a six appears. Find the expected number of rolls.", 6, "$1/p$."), ["Each roll succeeds with $p = \\tfrac16$, so the expected number of rolls is 6."]),
      ex(3, fr("ev-ex-8", "Three cards are drawn without replacement from a standard deck. Find the expected number of aces.", 3 / 13, "Indicators for each draw."), ["Each draw is an ace with probability $\\tfrac4{52}$ (by symmetry, even without replacement).", "By linearity, $3 \\cdot \\tfrac{4}{52} = \\tfrac3{13}$."]),
      ex(3, num("ev-ex-9", "10 letters are put into 10 addressed envelopes at random. Find the expected number in the right envelope.", 1, "Indicators."), ["Each letter matches with probability $\\tfrac1{10}$, and $10 \\cdot \\tfrac1{10} = 1$."]),
    ],
  },

  // §{conditional-probability}
  "conditional-probability": {
    definitions: [
      {
        type: "definition",
        term: "conditional probability",
        body: "For $P(B) > 0$, the probability of $A$ **given** $B$ is $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$: restrict the sample space to $B$ and ask what fraction of it is also $A$.",
      },
      {
        type: "definition",
        term: "partition",
        body: "Events $B_1, \\dots, B_n$ form a **partition** of $S$ if they are mutually exclusive and together cover $S$: exactly one of them happens.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "multiplication rule",
        statement: "$P(A \\cap B) = P(B)\\,P(A \\mid B) = P(A)\\,P(B \\mid A)$, and for a sequence $P(A_1 \\cap A_2 \\cap A_3) = P(A_1)\\,P(A_2 \\mid A_1)\\,P(A_3 \\mid A_1 \\cap A_2)$.",
        proof: ["Rearrange the definition. The chain form follows by applying it repeatedly."],
      },
      {
        type: "theorem",
        name: "total probability",
        statement: "If $B_1, \\dots, B_n$ partition $S$, then $P(A) = \\sum_i P(A \\mid B_i)\\,P(B_i)$.",
        proof: ["$A$ splits into the mutually exclusive pieces $A \\cap B_i$; add their probabilities and use the multiplication rule on each."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A fair die shows an even number. Find the probability that it is a 6.",
        solution: ["Given even, the sample space shrinks to $\\{2, 4, 6\\}$.", "One of these three is a 6."],
        result: "$\\tfrac13$.",
      },
      {
        type: "example",
        level: 2,
        title: "without replacement",
        problem: "Two cards are drawn without replacement. Find $P(\\text{both are aces})$.",
        solution: ["$P(\\text{first ace}) = \\tfrac4{52}$; given that, $P(\\text{second ace}) = \\tfrac3{51}$.", "Multiply: $\\tfrac4{52} \\cdot \\tfrac3{51} = \\tfrac{12}{2652}$."],
        result: "$\\tfrac1{221}$.",
      },
      {
        type: "example",
        level: 3,
        title: "transferring a ball",
        problem: "Urn A has 3 red and 2 blue balls; urn B has 2 red and 3 blue. One ball is moved at random from A to B, then one ball is drawn from B. Find $P(\\text{red})$.",
        solution: [
          "Partition on the moved ball. Red moved (probability $\\tfrac35$): B then has 3 red of 6. Blue moved ($\\tfrac25$): B has 2 red of 6.",
          "$P(\\text{red}) = \\tfrac35 \\cdot \\tfrac36 + \\tfrac25 \\cdot \\tfrac26 = \\tfrac{9 + 4}{30}$.",
        ],
        result: "$\\tfrac{13}{30}$.",
      },
    ],
    pitfalls: [
      { wrong: "$P(A \\mid B) = P(B \\mid A)$.", right: "They are different questions. $P(\\text{positive test} \\mid \\text{ill})$ can be 0.99 while $P(\\text{ill} \\mid \\text{positive})$ is 0.17 (§{bayes})." },
      { wrong: "Two children, at least one a boy: $P(\\text{both boys}) = \\tfrac12$.", right: "The equally likely cases are $BB, BG, GB$, so it is $\\tfrac13$." },
    ],
    formulas: [
      { label: "Definition", tex: "P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}" },
      { label: "Multiplication", tex: "P(A \\cap B) = P(A)\\,P(B \\mid A)" },
      { label: "Total probability", tex: "P(A) = \\textstyle\\sum_i P(A \\mid B_i)P(B_i)" },
    ],
    exercises: [
      ex(1, num("cnd-ex-1", "$P(A \\cap B) = 0.12$ and $P(B) = 0.4$. Find $P(A \\mid B)$.", 0.3, "Divide."), ["$0.12 / 0.4 = 0.3$."]),
      ex(1, fr("cnd-ex-2", "A fair die shows an odd number. Find the probability that it is greater than 4.", 1 / 3, "Restrict to $\\{1, 3, 5\\}$."), ["Of $\\{1, 3, 5\\}$, only 5 exceeds 4: $\\tfrac13$."]),
      ex(2, fr("cnd-ex-3", "Two cards are drawn without replacement. Find $P(\\text{both hearts})$.", 1 / 17, "$\\tfrac{13}{52} \\cdot \\tfrac{12}{51}$."), ["$\\tfrac{13}{52} \\cdot \\tfrac{12}{51} = \\tfrac14 \\cdot \\tfrac4{17} = \\tfrac1{17}$."]),
      ex(2, num("cnd-ex-4", "$P(A) = 0.6$ and $P(B \\mid A) = 0.5$. Find $P(A \\cap B)$.", 0.3, "Multiplication rule."), ["$0.6 \\cdot 0.5 = 0.3$."]),
      ex(2, fr("cnd-ex-5", "A family has two children, at least one a girl. Find $P(\\text{both girls})$.", 1 / 3, "Cases $GG, GB, BG$."), ["The equally likely cases are $GG, GB, BG$; one is $GG$."]),
      ex(3, num("cnd-ex-6", "Machine A makes 60% of items, 2% of them defective; machine B makes 40%, 5% defective. Find $P(\\text{defective})$.", 0.032, "Total probability."), ["$0.6 \\cdot 0.02 + 0.4 \\cdot 0.05 = 0.012 + 0.020 = 0.032$."]),
      ex(3, fr("cnd-ex-7", "Urn A has 3 red and 2 blue; urn B has 2 red and 3 blue. A ball is moved at random from A to B, then a ball is drawn from B. Find $P(\\text{red})$.", 13 / 30, "Partition on the moved ball."), [
        "$\\tfrac35 \\cdot \\tfrac36 + \\tfrac25 \\cdot \\tfrac26 = \\tfrac{13}{30}$.",
      ]),
      ex(3, num("cnd-ex-8", "Two fair dice show a sum of 8. Find the probability that one of them shows 3.", 0.4, "Restrict to the five outcomes with sum 8."), ["Sum 8: $(2,6), (3,5), (4,4), (5,3), (6,2)$. Two of the five contain a 3: $0.4$."]),
    ],
  },

  // §{bayes}
  bayes: {
    definitions: [
      {
        type: "definition",
        term: "prior, likelihood, posterior",
        body: "For a hypothesis $H$ and evidence $E$: the **prior** is $P(H)$, the **likelihood** is $P(E \\mid H)$, and the **posterior** is $P(H \\mid E)$. In a diagnostic test, $P(+ \\mid \\text{ill})$ is the **sensitivity** and $P(+ \\mid \\text{well})$ the **false-positive rate**.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "Bayes",
        statement: "If $H_1, \\dots, H_n$ partition $S$, then $P(H_k \\mid E) = \\dfrac{P(E \\mid H_k)\\,P(H_k)}{\\sum_i P(E \\mid H_i)\\,P(H_i)}$.",
        proof: [
          "By the multiplication rule $P(H_k \\cap E) = P(E \\mid H_k)P(H_k)$, and by total probability $P(E) = \\sum_i P(E \\mid H_i)P(H_i)$.",
          "Divide: $P(H_k \\mid E) = P(H_k \\cap E)/P(E)$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "odds form",
        statement: "$\\dfrac{P(H \\mid E)}{P(H^c \\mid E)} = \\dfrac{P(H)}{P(H^c)} \\cdot \\dfrac{P(E \\mid H)}{P(E \\mid H^c)}$: posterior odds = prior odds × likelihood ratio.",
        proof: ["Write Bayes for $H$ and for $H^c$; the denominators $P(E)$ are equal and cancel in the ratio."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$P(H) = 0.3$, $P(E \\mid H) = 0.8$ and $P(E) = 0.4$. Find $P(H \\mid E)$.",
        solution: ["$P(H \\mid E) = \\dfrac{0.8 \\cdot 0.3}{0.4}$.", "$= 0.24 / 0.4$."],
        result: "$0.6$.",
      },
      {
        type: "example",
        level: 2,
        title: "the base rate",
        problem: "1% of people have a disease. A test detects it 99% of the time and gives a false positive 5% of the time. Find $P(\\text{ill} \\mid +)$.",
        solution: [
          "$P(+) = 0.99 \\cdot 0.01 + 0.05 \\cdot 0.99 = 0.0099 + 0.0495 = 0.0594$.",
          "$P(\\text{ill} \\mid +) = 0.0099 / 0.0594 = \\tfrac16$. The many healthy people produce most of the positives.",
        ],
        result: "$\\tfrac16 \\approx 0.167$.",
      },
      {
        type: "example",
        level: 3,
        title: "the reported six",
        problem: "A person tells the truth 3 times out of 4. They roll a fair die and report that it is a six. Find the probability that it really is a six.",
        solution: [
          "$H$: it is a six, $P(H) = \\tfrac16$. The report \"six\" happens if it is a six and they tell the truth ($\\tfrac16 \\cdot \\tfrac34$), or if it is not and they lie ($\\tfrac56 \\cdot \\tfrac14$).",
          "$P(H \\mid \\text{report}) = \\dfrac{3/24}{3/24 + 5/24} = \\tfrac38$.",
        ],
        result: "$\\tfrac38$.",
      },
    ],
    pitfalls: [
      { wrong: "A 99%-accurate test that comes back positive means a 99% chance of illness.", right: "With a rare condition most positives are false. Always weigh by the prior." },
      { wrong: "The denominator of Bayes is $P(E \\mid H)$.", right: "It is $P(E)$, found by total probability over every hypothesis." },
    ],
    formulas: [
      { label: "Bayes", tex: "P(H \\mid E) = \\dfrac{P(E \\mid H)P(H)}{P(E)}" },
      { label: "Odds form", tex: "\\text{posterior odds} = \\text{prior odds} \\times \\dfrac{P(E \\mid H)}{P(E \\mid H^c)}" },
    ],
    exercises: [
      ex(1, num("bay-ex-1", "$P(H) = 0.2$, $P(E \\mid H) = 0.9$ and $P(E) = 0.3$. Find $P(H \\mid E)$.", 0.6, "$0.18 / 0.3$."), ["$0.9 \\cdot 0.2 / 0.3 = 0.6$."]),
      ex(2, fr("bay-ex-2", "2% have a disease. A test detects it 90% of the time and gives false positives 10% of the time. Find $P(\\text{ill} \\mid +)$.", 0.018 / 0.116, "$P(+) = 0.018 + 0.098$."), ["$P(+) = 0.9 \\cdot 0.02 + 0.1 \\cdot 0.98 = 0.116$.", "$0.018 / 0.116 \\approx 0.155$."]),
      ex(2, num("bay-ex-3", "Machine A makes 60% of items (2% defective), B makes 40% (5% defective). A defective item is found. Find $P(\\text{from B})$.", 0.625, "$0.02 / 0.032$."), ["$P(\\text{defective}) = 0.032$; from B: $0.4 \\cdot 0.05 = 0.02$.", "$0.02 / 0.032 = 0.625$."]),
      ex(2, fr("bay-ex-4", "A bag holds a fair coin and a two-headed coin. One is picked at random and tossed: heads. Find $P(\\text{two-headed})$.", 2 / 3, "Likelihoods 1 and $\\tfrac12$."), ["$\\dfrac{\\tfrac12 \\cdot 1}{\\tfrac12 \\cdot 1 + \\tfrac12 \\cdot \\tfrac12} = \\tfrac23$."]),
      ex(3, num("bay-ex-5", "A person tells the truth 3 times out of 4 and reports that a fair die showed six. Find the probability it did.", 0.375, "Truth-and-six against lie-and-not-six."), ["$\\dfrac{\\tfrac16 \\cdot \\tfrac34}{\\tfrac16 \\cdot \\tfrac34 + \\tfrac56 \\cdot \\tfrac14} = \\tfrac38$."]),
      ex(3, num("bay-ex-6", "The coin from the bag (fair or two-headed) is tossed twice: two heads. Find $P(\\text{two-headed})$.", 0.8, "Likelihoods 1 and $\\tfrac14$."), ["$\\dfrac{\\tfrac12 \\cdot 1}{\\tfrac12 \\cdot 1 + \\tfrac12 \\cdot \\tfrac14} = \\tfrac{1}{1.25} = 0.8$."]),
      ex(3, fr("bay-ex-7", "Bag 1 has 4 red and 6 blue; bag 2 has 7 red and 3 blue. A fair coin picks the bag and a red ball is drawn. Find $P(\\text{bag 2})$.", 7 / 11, "Likelihoods 0.4 and 0.7."), ["$\\dfrac{0.5 \\cdot 0.7}{0.5 \\cdot 0.4 + 0.5 \\cdot 0.7} = \\tfrac{0.7}{1.1} = \\tfrac7{11}$."]),
      ex(3, num("bay-ex-8", "Prior odds for $H$ are $1 : 4$ and the evidence is 6 times as likely under $H$ as under $H^c$. Find $P(H \\mid E)$.", 0.6, "Posterior odds $6 : 4$."), ["Posterior odds $= \\tfrac14 \\cdot 6 = \\tfrac64$, so $P(H \\mid E) = \\tfrac{6}{10} = 0.6$."]),
    ],
  },

  // §{independence}
  independence: {
    definitions: [
      {
        type: "definition",
        term: "independent events",
        body: "$A$ and $B$ are **independent** if $P(A \\cap B) = P(A)\\,P(B)$; when $P(B) > 0$ this says $P(A \\mid B) = P(A)$. Events $A, B, C$ are **mutually independent** if every pair is independent **and** $P(A \\cap B \\cap C) = P(A)P(B)P(C)$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "If $A$ and $B$ are independent, so are $A$ and $B^c$, $A^c$ and $B$, and $A^c$ and $B^c$. Hence for independent events, $P(\\text{at least one}) = 1 - \\prod_i (1 - P(A_i))$.",
        proof: [
          "$P(A \\cap B^c) = P(A) - P(A \\cap B) = P(A) - P(A)P(B) = P(A)(1 - P(B)) = P(A)P(B^c)$. The other cases follow the same way.",
          "\"None happens\" is $A_1^c \\cap \\dots \\cap A_n^c$, whose probability is the product of the $1 - P(A_i)$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        statement: "Mutually exclusive events with positive probabilities are never independent.",
        proof: ["If $A \\cap B = \\varnothing$ then $P(A \\cap B) = 0$, but $P(A)P(B) > 0$. Knowing $A$ happened tells you $B$ did not."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$A$ and $B$ are independent with $P(A) = 0.5$ and $P(B) = 0.4$. Find $P(A \\cap B)$ and $P(A \\cup B)$.",
        solution: ["$P(A \\cap B) = 0.5 \\cdot 0.4 = 0.2$.", "$P(A \\cup B) = 0.5 + 0.4 - 0.2 = 0.7$."],
        result: "$0.2$ and $0.7$.",
      },
      {
        type: "example",
        level: 2,
        title: "at least one",
        problem: "Three people fire at a target independently, hitting with probabilities $\\tfrac12, \\tfrac13, \\tfrac14$. Find the probability the target is hit.",
        solution: ["$P(\\text{all miss}) = \\tfrac12 \\cdot \\tfrac23 \\cdot \\tfrac34 = \\tfrac14$.", "$P(\\text{hit}) = 1 - \\tfrac14$."],
        result: "$\\tfrac34$.",
      },
      {
        type: "example",
        level: 3,
        title: "pairwise is not enough",
        problem: "Two fair coins are tossed. $A$: first is heads. $B$: second is heads. $C$: the two coins match. Are $A, B, C$ mutually independent?",
        solution: [
          "Each has probability $\\tfrac12$. $A \\cap B = A \\cap C = B \\cap C = \\{HH\\}$, probability $\\tfrac14 = \\tfrac12 \\cdot \\tfrac12$: every pair is independent.",
          "But $P(A \\cap B \\cap C) = P(HH) = \\tfrac14 \\neq \\tfrac18$.",
        ],
        result: "Pairwise independent, but not mutually independent.",
      },
    ],
    pitfalls: [
      { wrong: "Independent means mutually exclusive.", right: "Almost the opposite: exclusive events with positive probabilities are dependent." },
      { wrong: "Checking every pair proves three events independent.", right: "The triple product must also hold; see the two-coin example." },
      { wrong: "After five heads, tails is due.", right: "Independent tosses have no memory: the next toss is still $\\tfrac12$." },
    ],
    formulas: [
      { label: "Independent", tex: "P(A \\cap B) = P(A)P(B)" },
      { label: "At least one", tex: "1 - \\textstyle\\prod (1 - p_i)" },
    ],
    exercises: [
      ex(1, num("pind-ex-1", "$A$ and $B$ are independent with $P(A) = 0.3$ and $P(B) = 0.5$. Find $P(A \\cap B)$.", 0.15, "Multiply."), ["$0.3 \\cdot 0.5 = 0.15$."]),
      ex(1, mc("pind-ex-2", "$A$ and $B$ are mutually exclusive with $P(A) = 0.2$ and $P(B) = 0.3$. Are they independent?", ["No", "$P(A \\cap B) = 0 \\neq 0.06$."], [["Yes", "Exclusive events with positive probability are dependent."]]), ["$P(A \\cap B) = 0$ but $P(A)P(B) = 0.06$."]),
      ex(2, num("pind-ex-3", "$A$ and $B$ are independent with $P(A) = 0.3$ and $P(B) = 0.5$. Find $P(A \\cup B)$.", 0.65, "$0.3 + 0.5 - 0.15$."), ["$0.3 + 0.5 - 0.15 = 0.65$."]),
      ex(2, num("pind-ex-4", "Three independent shots hit with probabilities $\\tfrac12, \\tfrac13, \\tfrac14$. Find $P(\\text{at least one hit})$.", 0.75, "Complement of all misses."), ["$1 - \\tfrac12 \\cdot \\tfrac23 \\cdot \\tfrac34 = 1 - \\tfrac14 = 0.75$."]),
      ex(2, num("pind-ex-5", "$A$ and $B$ are independent, $P(A) = 0.4$ and $P(A \\cup B) = 0.7$. Find $P(B)$.", 0.5, "$0.4 + p - 0.4p = 0.7$."), ["$0.4 + p - 0.4p = 0.7$ gives $0.6p = 0.3$, so $p = 0.5$."]),
      ex(3, num("pind-ex-6", "Find the least $n$ such that $n$ tosses of a fair coin give at least one head with probability at least 0.99.", 7, "$1 - 2^{-n} \\ge 0.99$."), ["Need $2^{-n} \\le 0.01$, i.e. $2^n \\ge 100$. $2^6 = 64$ is too small; $2^7 = 128$ works."]),
      ex(3, num("pind-ex-7", "$A$ and $B$ are independent with $P(A) = 0.2$ and $P(B) = 0.5$. Find $P(\\text{exactly one of them})$.", 0.5, "$P(A)P(B^c) + P(A^c)P(B)$."), ["$0.2 \\cdot 0.5 + 0.8 \\cdot 0.5 = 0.1 + 0.4 = 0.5$."]),
      ex(3, fr("pind-ex-8", "Two players toss a fair coin in turn; the first to toss heads wins. Find the probability that the first player wins.", 2 / 3, "Geometric series."), ["The first player wins on toss 1, 3, 5, …: $\\tfrac12 + \\tfrac18 + \\tfrac1{32} + \\dots = \\dfrac{1/2}{1 - 1/4} = \\tfrac23$."]),
      ex(3, mc("pind-ex-9", "Events $A, B, C$ are pairwise independent. Then", ["they may still fail to be mutually independent", "The triple product can fail, as with two coins."], [["they are mutually independent", "The triple condition is separate."], ["$P(A \\cap B \\cap C) = 0$", "Nothing forces that."]]), [
        "Two coins, $A$ = first heads, $B$ = second heads, $C$ = coins match: pairwise independent, but $P(A \\cap B \\cap C) = \\tfrac14 \\neq \\tfrac18$.",
      ]),
    ],
  },
};
