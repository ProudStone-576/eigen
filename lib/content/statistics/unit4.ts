import type { ConceptNode, Unit } from "@/lib/content/types";
import { deepen } from "../deepen";
import { UNIT4_DEPTH } from "./unit4.depth";

const probability: ConceptNode = {
  id: "probability",
  title: "Probability",
  summary: "A probability is the long-run fraction of times something happens: between 0 and 1, all outcomes adding to 1.",
  deps: [],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "probability", meaning: "The fraction of times an outcome happens if you repeat the situation many, many times." },
    { term: "event", meaning: "Something that may or may not happen, like \"roll a 6\"." },
  ],
  misconceptions: {
    "gamblers-fallacy": "Believes a streak makes the opposite outcome \"due\".",
    "count-not-fraction": "Counts favourable outcomes without dividing by the total.",
  },
  steps: [
    {
      type: "motivate",
      title: "What does 30% mean?",
      body: "The forecast says 30% chance of rain. It will either rain or not, so what is the 30% actually claiming?",
      realWorld: {
        title: "Weather forecasts",
        body: "A well-calibrated forecaster is one where, on all the days they said 30%, it rained on about 30% of them.",
      },
    },
    {
      type: "explore",
      title: "Flip a lot of coins",
      body: "The line tracks the fraction of heads so far.",
      widget: { kind: "sim", die: false },
      task: "Flip 10 at a time, then 1,000. Where does the line settle? How wild is it at the start?",
    },
    {
      type: "truth",
      statement: "The **probability** of an event is the fraction of times it happens in the long run of repeated trials.",
      body: "So it's always between 0 (never) and 1 (always), and the probabilities of all the possible outcomes add up to 1. When outcomes are equally likely: P = favourable ÷ total.",
    },
    {
      type: "predict",
      misconception: "gamblers-fallacy",
      item: {
        kind: "mc",
        id: "prob-predict-1",
        prompt: "A fair coin just landed heads 5 times in a row. What's the probability the next flip is heads?",
        options: [
          { id: "a", text: "Still 1/2", correct: true, why: "The coin has no memory." },
          { id: "b", text: "Less than 1/2: tails is due", misconception: "gamblers-fallacy", why: "Nothing pushes the coin back towards tails." },
          { id: "c", text: "More than 1/2: heads is on a streak", why: "A fair coin doesn't get hot either." },
        ],
      },
      reveal: {
        body: "Flip 1,000 and look at the last 12 results: streaks of 4 or 5 turn up all the time, and they don't change what comes next. The fraction settles at 0.5 because the streaks get *diluted* by many more flips, not cancelled out.",
        widget: { kind: "sim", die: false },
      },
      resolve: {
        kind: "mc",
        id: "prob-resolve-1",
        prompt: "Why doesn't a streak change the next flip?",
        options: [
          { id: "a", text: "Each flip is separate; the coin can't remember", correct: true, why: "Every flip starts fresh at 50/50." },
          { id: "b", text: "It does: the results must even out soon", misconception: "gamblers-fallacy", why: "The average evens out by dilution, not by the coin correcting itself." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prob-check-1",
        prompt: "Roll a fair die. What's P(roll a 5 or a 6)?",
        options: [
          { id: "a", text: "1/3", correct: true, why: "2 favourable out of 6 equally likely: 2/6 = 1/3." },
          { id: "b", text: "2", misconception: "count-not-fraction", why: "That's the count. Divide by the 6 possible outcomes." },
          { id: "c", text: "1/6", why: "That's just one of the two outcomes." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "prob-check-2",
        prompt: "A bag has 3 red and 7 blue marbles. P(pick red)?",
        options: [
          { id: "a", text: "0.3", correct: true, why: "3 of 10." },
          { id: "b", text: "3", misconception: "count-not-fraction", why: "Divide by the total of 10." },
          { id: "c", text: "3/7", why: "Divide by all 10 marbles, not just the blue ones." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Classifiers output probabilities: \"spam, 0.92\". A model is *calibrated* when, of all the emails it called 0.92, about 92% really are spam: exactly the long-run-fraction meaning.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "prob-produce-1", prompt: "P(rain) = 0.3. What is P(no rain)?", answer: 0.7, explain: "All outcomes add to 1: 1 − 0.3." },
        { kind: "number", id: "prob-produce-2", prompt: "A bag has 3 red, 5 blue and 2 green marbles. P(blue)?", answer: 0.5, explain: "5 of 10." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "prob-review-1", prompt: "Draw one card from a standard 52-card deck. P(a heart)?", answer: 0.25, explain: "13 hearts of 52." },
  ],
};

const randomVariable: ConceptNode = {
  id: "random-variable",
  title: "Random variables",
  summary: "A random variable turns each outcome into a number; its distribution lists each value's probability.",
  deps: ["probability"],
  pos: { x: 1, y: 1 },
  glossary: [
    { term: "random variable", meaning: "A number decided by a random outcome, like \"how many heads in 3 flips\"." },
    { term: "distribution", meaning: "The list of possible values with their probabilities. They add up to 1." },
  ],
  misconceptions: {
    "equally-likely-values": "Assumes every value of a random variable is equally likely.",
  },
  steps: [
    {
      type: "motivate",
      title: "Outcomes into numbers",
      body: "Maths can't add \"heads\" and \"tails\". It can add numbers. So we attach a number to each outcome.",
      realWorld: { title: "Insurance", body: "An insurer doesn't care *what* happened, only how much it pays out. Each policy's payout is a random variable." },
    },
    {
      type: "truth",
      statement: "A **random variable** $X$ assigns a number to each outcome. Its **distribution** lists each value with its probability, and those probabilities add up to 1.",
      body: "Example: flip 2 coins, $X$ = number of heads. Outcomes HH, HT, TH, TT are equally likely, so $P(X=0) = \\tfrac14$, $P(X=1) = \\tfrac24$, $P(X=2) = \\tfrac14$.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rv-check-1",
        prompt: "Flip 2 fair coins. X = number of heads. What is P(X = 1)?",
        options: [
          { id: "a", text: "1/2", correct: true, why: "HT and TH: 2 of the 4 outcomes." },
          { id: "b", text: "1/3", misconception: "equally-likely-values", why: "X has 3 values, but they aren't equally likely: 1 head happens two ways." },
          { id: "c", text: "1/4", why: "That's P(X = 2) or P(X = 0)." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rv-check-2",
        prompt: "Roll two dice and add them. Is a total of 7 as likely as a total of 2?",
        options: [
          { id: "a", text: "No: 7 is more likely", correct: true, why: "7 happens 6 ways (1+6, 2+5, …); 2 happens only as 1+1." },
          { id: "b", text: "Yes: each total is one value", misconception: "equally-likely-values", why: "Count the ways each total can happen." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A classifier's label is a random variable, and the model's job is to predict its distribution: P(cat) = 0.7, P(dog) = 0.2, P(other) = 0.1, adding up to 1. That's what a *softmax* layer produces.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "rv-produce-1", prompt: "Flip 2 fair coins, X = number of heads. P(X = 2)?", answer: 0.25, explain: "Only HH: 1 of 4." },
        {
          kind: "number",
          id: "rv-produce-2",
          prompt: "A random variable has P(X = 0) = 0.2 and P(X = 1) = 0.5. Its only other value is 2. What is P(X = 2)?",
          answer: 0.3,
          explain: "They must add to 1: 1 − 0.2 − 0.5.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "rv-review-1", prompt: "Flip 3 fair coins, X = number of heads. P(X = 3)?", answer: 0.125, explain: "Only HHH: 1 of 8." },
  ],
};

const expectation: ConceptNode = {
  id: "expectation",
  title: "Expected value",
  summary: "E[X] = Σ x·P(X = x): the probability-weighted average, which is the long-run average.",
  deps: ["random-variable"],
  pos: { x: 2, y: 0 },
  glossary: [{ term: "expected value", meaning: "E[X]: the long-run average of a random variable. Each value weighted by its probability." }],
  misconceptions: {
    "must-be-outcome": "Thinks the expected value has to be a value X can actually take.",
    "ignore-probabilities": "Averages the values without weighting them by their probabilities.",
  },
  steps: [
    {
      type: "motivate",
      title: "Is this game worth playing?",
      body: "A \\$2 ticket wins \\$100 with probability 1/100. Play it once and you'll probably lose. Play it 10,000 times: what happens on average?",
      realWorld: { title: "Casinos and insurers", body: "They never know what one customer will do, but they know the average per customer very precisely. That average is the expected value." },
    },
    {
      type: "explore",
      title: "Roll a lot of dice",
      body: "The line is the average of all rolls so far.",
      widget: { kind: "sim", die: true },
      task: "Roll 1,000. Where does the average settle? Can a single roll ever show that number?",
    },
    {
      type: "truth",
      statement: "The **expected value** $E[X] = \\sum_x x\\cdot P(X = x)$: each value weighted by its probability.",
      body: "It's the long-run average. Linearity is free: $E[aX + b] = a\\,E[X] + b$.",
    },
    {
      type: "predict",
      misconception: "must-be-outcome",
      item: {
        kind: "mc",
        id: "exp-predict-1",
        prompt: "What is the expected value of one fair die roll?",
        options: [
          { id: "a", text: "3.5", correct: true, why: "(1 + 2 + 3 + 4 + 5 + 6) / 6." },
          { id: "b", text: "3 or 4: it must be a face you can roll", misconception: "must-be-outcome", why: "An average doesn't have to be a possible value." },
          { id: "c", text: "6, the highest", why: "Every face is equally likely; 6 isn't special." },
        ],
      },
      reveal: {
        body: "The running average settles at 3.5: a number no single roll can show. Expected value describes the average, not any one roll.",
        widget: { kind: "sim", die: true },
      },
      resolve: {
        kind: "mc",
        id: "exp-resolve-1",
        prompt: "E[X] is best described as:",
        options: [
          { id: "a", text: "The long-run average", correct: true, why: "That's why 3.5 is fine for a die." },
          { id: "b", text: "The single result to expect next", misconception: "must-be-outcome", why: "You'll never roll a 3.5." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exp-check-1",
        prompt: "X is 10 with probability 0.9 and 1000 with probability 0.1. What is E[X]?",
        options: [
          { id: "a", text: "109", correct: true, why: "10·0.9 + 1000·0.1 = 9 + 100." },
          { id: "b", text: "505", misconception: "ignore-probabilities", why: "That's the plain average of 10 and 1000. Weight by probability." },
          { id: "c", text: "10", why: "The most likely value isn't the expected value." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "exp-check-2",
        prompt: "The \\$2 ticket wins \\$100 with probability 0.01. What is the expected profit per ticket?",
        options: [
          { id: "a", text: "−\\$1", correct: true, why: "100 × 0.01 − 2 = 1 − 2." },
          { id: "b", text: "+\\$98", misconception: "ignore-probabilities", why: "You only win 1% of the time." },
          { id: "c", text: "\\$0", why: "The ticket costs more than its expected winnings." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training minimises the **expected loss**: the average error over all the data the model might see. The training-set average is our estimate of it.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "exp-produce-1",
          prompt: "X is 0 with probability 0.2, 1 with probability 0.5 and 2 with probability 0.3. What is E[X]?",
          answer: 1.1,
          explain: "0·0.2 + 1·0.5 + 2·0.3 = 0.5 + 0.6.",
        },
        {
          kind: "expression",
          id: "exp-produce-2",
          prompt: "Write $E[aX + b]$ in terms of $a$, $b$ and $E[X]$. Type $m$ for $E[X]$.",
          forms: [
            { value: "a*m", status: "wrong", message: "The constant b shifts the average too." },
            { value: "a*m + b", status: "correct" },
          ],
          explain: "Linearity: $E[aX + b] = a\\,E[X] + b$.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "exp-review-1", prompt: "Flip a fair coin: win \\$10 on heads, lose \\$4 on tails. Expected winnings?", answer: 3, explain: "10·0.5 − 4·0.5 = 3." },
  ],
};

const conditional: ConceptNode = {
  id: "conditional-probability",
  title: "Conditional probability",
  summary: "P(A | B) = P(A and B) / P(B): the probability of A once you know B happened.",
  deps: ["probability"],
  pos: { x: 1, y: 2.4 },
  glossary: [{ term: "conditional probability", meaning: "P(A | B), read \"A given B\": the chance of A once you know B happened." }],
  misconceptions: {
    "flipped-conditional": "Treats P(A | B) as if it were P(B | A).",
    "joint-not-conditional": "Uses P(A and B) where P(A | B) is asked, forgetting to divide by P(B).",
  },
  steps: [
    {
      type: "motivate",
      title: "New information changes the odds",
      body: "P(a random person is over 190 cm) is small. P(over 190 cm | they play pro basketball) is not. Knowing something shrinks the world you're looking at.",
      realWorld: { title: "Recommendations", body: "\"People who bought this also bought…\" is a conditional probability: P(buy Y | bought X)." },
    },
    {
      type: "truth",
      statement: "$P(A \\mid B) = \\dfrac{P(A \\text{ and } B)}{P(B)}$: the probability of $A$ once you know $B$ happened.",
      body: "Throw away every case where B didn't happen. Among the cases left, what fraction also have A?",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cond-check-1",
        prompt: "In a school of 100 students, 30 play a sport. 12 of those sporty students are also in the band. What is P(band | sport)?",
        options: [
          { id: "a", text: "0.4", correct: true, why: "Among the 30 sporty students, 12 are in band: 12/30." },
          { id: "b", text: "0.12", misconception: "joint-not-conditional", why: "That's P(band and sport) = 12/100. Shrink the world to the 30." },
          { id: "c", text: "12 out of everyone in band", misconception: "flipped-conditional", why: "That would be P(sport | band)." },
        ],
      },
    },
    {
      type: "predict",
      misconception: "flipped-conditional",
      item: {
        kind: "mc",
        id: "cond-predict-1",
        prompt: "Almost everyone with flu has a cough: P(cough | flu) is high. Is P(flu | cough) high too?",
        options: [
          { id: "a", text: "Not necessarily", correct: true, why: "Lots of people cough without flu." },
          { id: "b", text: "Yes: they're the same thing", misconception: "flipped-conditional", why: "Flipping the condition changes which group you divide by." },
        ],
      },
      reveal: {
        body: "Say 5% have flu, 90% of them cough, and 20% of everyone else coughs too. Among all the coughers, most are flu-free: P(flu | cough) is only about 19%.",
        widget: { kind: "bayes", prevalence: 0.05, sensitivity: 0.9, falsePositive: 0.2 },
      },
      resolve: {
        kind: "mc",
        id: "cond-resolve-1",
        prompt: "P(A | B) and P(B | A):",
        options: [
          { id: "a", text: "Can be very different", correct: true, why: "They divide by different groups: B's size versus A's." },
          { id: "b", text: "Are always equal", misconception: "flipped-conditional", why: "The flu example: 90% versus 19%." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "cond-check-2",
        prompt: "P(rain and cold) = 0.2 and P(cold) = 0.5. What is P(rain | cold)?",
        options: [
          { id: "a", text: "0.4", correct: true, why: "0.2 / 0.5." },
          { id: "b", text: "0.2", misconception: "joint-not-conditional", why: "Divide by P(cold)." },
          { id: "c", text: "0.1", why: "Divide, don't multiply." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A classifier's output *is* a conditional probability: P(spam | the words in this email). Every prediction conditions on the input.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "cond-produce-1",
          prompt: "Same school: 40 students are in band, and 12 of them play a sport. What is P(sport | band)?",
          answer: 0.3,
          explain: "12 / 40. Compare with P(band | sport) = 0.4: flipping the condition changed the answer.",
        },
        { kind: "number", id: "cond-produce-2", prompt: "P(A and B) = 0.1 and P(B) = 0.25. What is P(A | B)?", answer: 0.4, explain: "0.1 / 0.25." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "cond-review-1", prompt: "P(A and B) = 0.06 and P(B) = 0.3. What is P(A | B)?", answer: 0.2, explain: "0.06 / 0.3." },
  ],
};

const bayes: ConceptNode = {
  id: "bayes",
  title: "Bayes' rule",
  summary: "P(H | E) = P(E | H)·P(H) / P(E): update a belief with evidence, and never forget the base rate.",
  deps: ["conditional-probability"],
  pos: { x: 2, y: 2.4 },
  glossary: [
    { term: "prior", meaning: "P(H): how likely something was before the new evidence. Also called the base rate." },
    { term: "posterior", meaning: "P(H | E): how likely it is after seeing the evidence." },
  ],
  misconceptions: {
    "base-rate-neglect": "Ignores how rare the condition is and trusts the test's accuracy alone.",
  },
  steps: [
    {
      type: "motivate",
      title: "A positive test: how worried should you be?",
      body: "A test is \"90% accurate\" and you test positive. Most people guess they're 90% likely to have the disease. Let's count people instead.",
      realWorld: { title: "Medical screening", body: "Doctors re-test after a positive screen for rare diseases for exactly this reason: most first positives are false alarms." },
    },
    {
      type: "explore",
      title: "1,000 people",
      body: "Each dot is a person. Red dots are sick and test positive; orange dots are healthy but test positive anyway.",
      widget: { kind: "bayes", prevalence: 0.01, sensitivity: 0.9, falsePositive: 0.09 },
      task: "How many of the positives are actually sick? Now raise how common the disease is to 20% and watch what happens.",
    },
    {
      type: "truth",
      statement: "**Bayes' rule:** $P(H \\mid E) = \\dfrac{P(E \\mid H)\\,P(H)}{P(E)}$, where $P(E) = P(E \\mid H)P(H) + P(E \\mid \\text{not }H)P(\\text{not }H)$.",
      body: "It's just conditional probability twice: $P(H \\text{ and } E) = P(E \\mid H)P(H)$, then divide by everyone who shows the evidence.",
    },
    {
      type: "predict",
      misconception: "base-rate-neglect",
      item: {
        kind: "mc",
        id: "bayes-predict-1",
        prompt: "A disease affects 1% of people. The test catches 90% of sick people and false-alarms on 9% of healthy ones. You test positive. Roughly how likely are you to be sick?",
        options: [
          { id: "a", text: "About 9%", correct: true, why: "9 true positives among about 98 positives." },
          { id: "b", text: "About 90%", misconception: "base-rate-neglect", why: "That ignores how rare the disease is." },
          { id: "c", text: "About 50%", why: "Count the people: it's much lower." },
        ],
      },
      reveal: {
        body: "Of 1,000 people, 10 are sick and 9 of them test positive. Of the 990 healthy, about 89 false-alarm. So only 9 of ~98 positives are sick: **about 9%**.",
        widget: { kind: "bayes", prevalence: 0.01, sensitivity: 0.9, falsePositive: 0.09 },
      },
      resolve: {
        kind: "mc",
        id: "bayes-resolve-1",
        prompt: "Why is the answer so low?",
        options: [
          { id: "a", text: "Healthy people vastly outnumber sick ones, so their false alarms swamp the true positives", correct: true, why: "The base rate decides it." },
          { id: "b", text: "It isn't really: 90% accurate means 90% chance", misconception: "base-rate-neglect", why: "The grid counted 9 sick out of ~98 positives." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bayes-check-1",
        prompt: "20% of emails are spam. The word \"free\" appears in 50% of spam and 5% of normal email. An email contains \"free\". P(spam)?",
        options: [
          { id: "a", text: "About 71%", correct: true, why: "0.5·0.2 = 0.10 versus 0.05·0.8 = 0.04: 0.10 / 0.14 ≈ 0.71." },
          { id: "b", text: "50%", misconception: "base-rate-neglect", why: "That's P(free | spam). Bayes needs the base rate too." },
          { id: "c", text: "20%", why: "That ignores the evidence entirely." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Naive Bayes spam filters run this rule over every word. More broadly, *Bayesian* ML treats model parameters as beliefs and updates them with each batch of data.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**. Decimals to two places are fine.",
      items: [
        {
          kind: "number",
          id: "bayes-produce-1",
          prompt: "A disease affects 2%. The test catches 95% of the sick and false-alarms on 5% of the healthy. P(sick | positive)?",
          answer: 0.019 / 0.068,
          tolerance: 0.01,
          explain: "0.95·0.02 = 0.019 true positives; 0.05·0.98 = 0.049 false alarms. 0.019 / 0.068 ≈ 0.28.",
        },
        {
          kind: "number",
          id: "bayes-produce-2",
          prompt: "P(E | H) = 0.8, P(H) = 0.25 and P(E) = 0.4. What is P(H | E)?",
          answer: 0.5,
          explain: "0.8 · 0.25 / 0.4 = 0.5.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "bayes-review-1",
      prompt: "Prevalence 10%, the test catches 80% of the sick and false-alarms on 10% of the healthy. P(sick | positive)?",
      answer: 0.08 / 0.17,
      tolerance: 0.01,
      explain: "0.08 / (0.08 + 0.09) ≈ 0.47.",
    },
  ],
};

const independence: ConceptNode = {
  id: "independence",
  title: "Independence",
  summary: "A and B are independent when knowing one doesn't change the other: P(A and B) = P(A)·P(B).",
  deps: ["conditional-probability"],
  pos: { x: 3, y: 1.6 },
  glossary: [{ term: "independent", meaning: "Knowing whether one event happened tells you nothing about the other." }],
  misconceptions: {
    "add-for-and": "Adds probabilities for \"A and B\" instead of multiplying.",
    "disjoint-is-independent": "Thinks events that can't happen together are independent.",
  },
  steps: [
    {
      type: "motivate",
      title: "When information is useless",
      body: "Does knowing it's Tuesday change the chance your coin lands heads? No. That \"no\" is independence, and it makes calculations easy.",
      realWorld: { title: "Backup systems", body: "Two independent backup generators that each fail 1% of the time both fail only 0.01% of the time. That's why they're kept in separate buildings." },
    },
    {
      type: "truth",
      statement: "$A$ and $B$ are **independent** when $P(A \\mid B) = P(A)$. Equivalently, $P(A \\text{ and } B) = P(A)\\,P(B)$.",
      body: "Multiply the definition of conditional probability through: $P(A \\text{ and } B) = P(A \\mid B)P(B) = P(A)P(B)$.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ind-check-1",
        prompt: "Roll two fair dice. P(both show 6)?",
        options: [
          { id: "a", text: "1/36", correct: true, why: "Independent: 1/6 × 1/6." },
          { id: "b", text: "1/3", misconception: "add-for-and", why: "Adding is for \"or\" with no overlap. \"And\" multiplies." },
          { id: "c", text: "1/6", why: "Both have to happen." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ind-check-2",
        prompt: "One die: is \"roll a 1\" independent of \"roll a 2\"?",
        options: [
          { id: "a", text: "No: if it's a 1, it certainly isn't a 2", correct: true, why: "Knowing one changes the other to probability 0. That's the opposite of independent." },
          { id: "b", text: "Yes: they can't happen together, so they don't interact", misconception: "disjoint-is-independent", why: "Can't-happen-together is maximum dependence." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ind-check-3",
        prompt: "P(rain) = 0.3 and P(you win a raffle) = 0.01, independent. P(rain and you win)?",
        options: [
          { id: "a", text: "0.003", correct: true, why: "0.3 × 0.01." },
          { id: "b", text: "0.31", misconception: "add-for-and", why: "Multiply for \"and\"." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ind-check-4",
        prompt: "A and B can't both happen. P(A) = 0.5 and P(B) = 0.3. Are they independent?",
        options: [
          { id: "a", text: "No: P(A and B) = 0, but P(A)·P(B) = 0.15", correct: true, why: "The product rule fails." },
          { id: "b", text: "Yes: they never interfere", misconception: "disjoint-is-independent", why: "Knowing A happened makes B impossible." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Naive Bayes assumes each word is independent of the others given the class. It's plainly false (\"New\" and \"York\" travel together), yet the classifier works surprisingly well. Many training methods also assume data points are independent.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "ind-produce-1", prompt: "Flip 3 fair coins. P(all heads)?", answer: 0.125, explain: "(1/2)³." },
        { kind: "number", id: "ind-produce-2", prompt: "P(A) = 0.4 and P(B) = 0.5, independent. P(A and B)?", answer: 0.2, explain: "0.4 × 0.5." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "ind-review-1", prompt: "Flip 2 fair coins. P(at least one head)?", answer: 0.75, explain: "1 − P(no heads) = 1 − 1/4." },
  ],
};

export const unit4: Unit = {
  id: "st-1",
  track: "Statistics",
  title: "Probability & Bayes",
  blurb: "Chance as a long-run fraction, averages you can bet on, and updating beliefs with evidence.",
  nodes: [probability, randomVariable, expectation, conditional, bayes, independence].map((n) => deepen(n, UNIT4_DEPTH[n.id])),
};
