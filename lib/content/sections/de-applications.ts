import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Modelling with first-order equations: exponential growth and decay, doubling time and half-life; Newton's law of cooling; mixing problems; logistic growth and its carrying capacity; reading the long-run behaviour from an equation. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);

const base: ConceptNode = {
  id: "de-applications",
  title: "Applications of differential equations",
  summary: "When a quantity changes at a rate proportional to itself, dN/dt = kN and N = N₀e^{kt}: exponential growth (k > 0) or decay (k < 0), with doubling time or half-life ln 2/|k|. Each half-life halves what is left, so the amount never reaches zero. Newton's law of cooling, dT/dt = −k(T − Tₛ), makes the difference from the surroundings decay, so T approaches the room temperature Tₛ. Mixing problems balance rate in against rate out.",
  deps: ["linear-de"],
  pos: { x: 3, y: 0 },
  glossary: [
    { term: "half-life", meaning: "The time for a decaying quantity to halve: $T_{1/2} = \\dfrac{\\ln 2}k$ for $N = N_0e^{-kt}$." },
    { term: "Newton's law of cooling", meaning: "$\\dfrac{dT}{dt} = -k(T - T_s)$: the rate of cooling is proportional to the excess over the surrounding temperature $T_s$." },
    { term: "carrying capacity", meaning: "The limiting population $K$ in logistic growth $\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac PK\\right)$." },
  ],
  misconceptions: {
    "decay-linear": "Thinks a decaying quantity loses the same amount each half-life, so it is all gone after two half-lives.",
    "cooling-to-zero": "Models Newton's cooling as $T = T_0e^{-kt}$, as if the object cooled towards 0° rather than towards the room temperature.",
  },
  steps: [
    {
      type: "motivate",
      title: "Equations that describe the world",
      body: "Radioactive dating, drug dosing, cooling coffee, compound interest and epidemics all follow simple differential equations. The skill is turning the words into an equation (what is proportional to what?), solving it with §{separable-homogeneous} or §{linear-de}, and using the data to find the constants.",
      realWorld: {
        title: "Carbon dating",
        body: "Living things keep a steady ratio of carbon-14; after death it decays with a half-life of about 5730 years. Measuring the remaining fraction $f$ gives the age $t = 5730\\log_2\\tfrac1f$ years, so a sample with a quarter of its carbon-14 is about 11 460 years old.",
      },
    },
    {
      type: "truth",
      statement: "**Growth and decay**: $\\dfrac{dN}{dt} = kN$ gives $N = N_0e^{kt}$; doubling time ($k > 0$) or half-life ($k < 0$) is $\\dfrac{\\ln 2}{\\lvert k\\rvert}$, and after $n$ half-lives the fraction left is $\\left(\\tfrac12\\right)^n$. **Newton's law of cooling**: $\\dfrac{dT}{dt} = -k(T - T_s)$ gives $T = T_s + (T_0 - T_s)e^{-kt}$, so $T \\to T_s$. **Mixing**: if a tank of volume $V$ holds $S$ kg of salt, with inflow concentration $c_{in}$ at rate $r$ and well-mixed outflow at rate $r$, then $\\dfrac{dS}{dt} = rc_{in} - \\dfrac rVS$. **Logistic**: $\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac PK\\right)$ has $P \\to K$.",
      body: "Finding constants: one condition fixes $N_0$ (or $T_0$); a second measurement fixes $k$. For example, if a liquid cools from 90° to 55° in 10 minutes in a 20° room, then $35 = 70e^{-10k}$, so $e^{-10k} = \\tfrac12$: the excess over room temperature halves every 10 minutes. Long-run behaviour can often be read without solving: set $\\dfrac{dy}{dt} = 0$ to find the equilibrium, and check whether solutions approach it. Exponential decay never reaches zero; it shrinks by the same **factor** in equal times.",
    },
    {
      type: "predict",
      misconception: "decay-linear",
      item: {
        kind: "mc",
        id: "dea-predict-1",
        prompt: "A 100 g sample has a half-life of 5 years. After 10 years there is",
        options: [
          { id: "a", text: "25 g", correct: true, why: "Two half-lives: $100 \\times \\tfrac12 \\times \\tfrac12$." },
          { id: "b", text: "0 g: half goes in each 5 years", misconception: "decay-linear", why: "Each half-life halves what is **left**, not the original amount." },
          { id: "c", text: "50 g", why: "That is after one half-life." },
        ],
      },
      reveal: {
        body: "Decay removes a fixed fraction, not a fixed amount: $N = 100\\left(\\tfrac12\\right)^{t/5}$. After 5 years 50 g remain; in the next 5 years half of **those** 50 g decay, leaving 25 g. The sample never quite vanishes: after 50 years there is still about 0.1 g.",
      },
      resolve: {
        kind: "mc",
        id: "dea-resolve-1",
        prompt: "A drug's concentration halves every 4 hours. After 12 hours the fraction left is",
        options: [
          { id: "a", text: "$\\tfrac18$", correct: true, why: "Three halvings." },
          { id: "b", text: "0, since two halvings use it all up", misconception: "decay-linear", why: "Each halving leaves half of the current amount." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dea-check-1",
        prompt: "Coffee at 90° C cools by Newton's law in a 20° C room. Its long-run temperature is",
        options: [
          { id: "a", text: "20° C", correct: true, why: "$T = 20 + 70e^{-kt} \\to 20$." },
          { id: "b", text: "0° C", misconception: "cooling-to-zero", why: "It cools towards the room, not towards zero." },
          { id: "c", text: "55° C", why: "That is the midpoint, passed through once." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dea-check-2",
        prompt: "$\\dfrac{dN}{dt} = 0.1N$. The doubling time is",
        options: [
          { id: "a", text: "$\\dfrac{\\ln 2}{0.1} \\approx 6.93$", correct: true, why: "$e^{0.1t} = 2$." },
          { id: "b", text: "10", why: "That is $\\tfrac1k$, the time to grow by a factor $e$." },
          { id: "c", text: "$0.1\\ln 2$", why: "Divide by $k$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Learning-rate schedules often decay exponentially, $\\eta(t) = \\eta_0e^{-kt}$, and weight decay makes each weight shrink by a constant factor per step, the discrete version of $\\dfrac{dw}{dt} = -\\lambda w$. Epidemic models such as SIR, systems of these equations, are fitted to data with the methods of §{statistical-computing}.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dea-produce-1", prompt: "A culture of 1000 bacteria doubles every hour. How many are there after 3 hours?", answer: 8000, explain: "$1000 \\times 2^3$." },
        { kind: "number", id: "dea-produce-2", prompt: "A liquid cools from 90° to 55° in 10 minutes in a 20° room. Find its temperature after 20 minutes.", answer: 37.5, explain: "The excess 70 halves every 10 minutes: $20 + 70/4$." },
        {
          kind: "mc",
          id: "dea-produce-3",
          prompt: "Newton's law of cooling gives",
          options: [
            { id: "a", text: "$T = T_s + (T_0 - T_s)e^{-kt}$", correct: true, why: "The excess over $T_s$ decays exponentially." },
            { id: "b", text: "$T = T_0e^{-kt}$", misconception: "cooling-to-zero", why: "That would cool to 0°, whatever the room temperature." },
          ],
        },
        {
          kind: "mc",
          id: "dea-produce-4",
          prompt: "Carbon-14 has a half-life of 5730 years. After 11 460 years the fraction left is",
          options: [
            { id: "a", text: "$\\tfrac14$", correct: true, why: "Two half-lives." },
            { id: "b", text: "0", misconception: "decay-linear", why: "Half of the remaining half is still there." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dea-review-1", prompt: "$\\dfrac{dN}{dt} = -kN$ with $k = \\ln 2$ per year. Find the half-life in years.", answer: 1, explain: "$\\tfrac{\\ln 2}k$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "mixing problems",
      body: "A 100 L tank holds brine with 10 kg of salt. Pure water flows in at 5 L/min and the mixture flows out at 5 L/min. The salt leaves at $\\dfrac S{100} \\times 5$ kg/min, so $\\dfrac{dS}{dt} = -\\dfrac S{20}$ and $S = 10e^{-t/20}$. If the inflow carried salt, the equation would be linear (§{linear-de}) with a nonzero equilibrium.",
    },
    {
      type: "definition",
      term: "logistic growth",
      body: "$\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac PK\\right)$ grows almost exponentially when $P$ is small and levels off as $P \\to K$. Separating with partial fractions gives $P = \\dfrac K{1 + Ae^{-rt}}$; growth is fastest at $P = \\tfrac K2$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "half-life",
      statement: "For $N = N_0e^{-kt}$ ($k > 0$), the time to halve is $\\dfrac{\\ln 2}k$, independent of the starting amount.",
      proof: ["$N_0e^{-kT} = \\tfrac12N_0$ gives $e^{-kT} = \\tfrac12$, so $T = \\dfrac{\\ln 2}k$; $N_0$ cancels."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "Newton's law of cooling",
      statement: "$\\dfrac{dT}{dt} = -k(T - T_s)$ with $T(0) = T_0$ has solution $T = T_s + (T_0 - T_s)e^{-kt}$.",
      proof: ["Let $u = T - T_s$: $\\dfrac{du}{dt} = -ku$, so $u = u_0e^{-kt}$ (§{separable-homogeneous}).", "Substitute back."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "equilibria",
      statement: "For $\\dfrac{dy}{dt} = f(y)$, a value $y^*$ with $f(y^*) = 0$ is an equilibrium; it attracts nearby solutions if $f'(y^*) < 0$.",
      proof: ["Near $y^*$, $\\dfrac{d}{dt}(y - y^*) \\approx f'(y^*)(y - y^*)$, a growth or decay equation with rate $f'(y^*)$.", "For cooling, $f(T) = -k(T - T_s)$ has $f' = -k < 0$: $T_s$ attracts."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Bacteria double every 3 hours. How long until they increase tenfold?",
      solution: ["$N = N_02^{t/3}$; set $2^{t/3} = 10$.", "$t = \\dfrac{3\\ln 10}{\\ln 2} \\approx 9.97$ hours."],
      result: "About 9.97 hours.",
    },
    {
      type: "example",
      level: 2,
      title: "cooling",
      problem: "A liquid cools from 90° to 55° in 10 minutes in a 20° room. When will it reach 30°?",
      solution: ["$T = 20 + 70e^{-kt}$ with $e^{-10k} = \\tfrac12$.", "$70e^{-kt} = 10$ gives $e^{-kt} = \\tfrac17$, so $t = 10\\log_27 = \\dfrac{10\\ln 7}{\\ln 2} \\approx 28.07$ minutes."],
      result: "About 28.1 minutes.",
    },
    {
      type: "example",
      level: 3,
      title: "a mixing tank",
      problem: "A 100 L tank of brine contains 10 kg of salt. Pure water flows in at 5 L/min and the mixture out at 5 L/min. How much salt remains after 20 minutes?",
      solution: ["$\\dfrac{dS}{dt} = -\\dfrac5{100}S$, so $S = 10e^{-t/20}$.", "$S(20) = 10e^{-1} \\approx 3.68$ kg."],
      result: "About 3.68 kg.",
    },
  ],
  pitfalls: [
    { wrong: "Decay removes a fixed amount per half-life.", right: "It removes a fixed fraction: $\\left(\\tfrac12\\right)^n$ remains." },
    { wrong: "$T = T_0e^{-kt}$ for cooling.", right: "$T = T_s + (T_0 - T_s)e^{-kt}$." },
    { wrong: "Use the doubling time $\\tfrac1k$.", right: "It is $\\tfrac{\\ln 2}k$; $\\tfrac1k$ is the time to grow by $e$." },
  ],
  formulas: [
    { label: "Growth / decay", tex: "N = N_0e^{kt}" },
    { label: "Half-life", tex: "T_{1/2} = \\tfrac{\\ln 2}k" },
    { label: "Cooling", tex: "T = T_s + (T_0 - T_s)e^{-kt}" },
    { label: "Logistic", tex: "P = \\tfrac K{1 + Ae^{-rt}}" },
  ],
  exercises: [
    ex(1, num("deax-ex-1", "200 g of a substance has a half-life of 3 days. How much is left after 9 days?", 25, "Three halvings."), ["$25$ g."]),
    ex(1, num("deax-ex-2", "500 bacteria double every 2 hours. How many after 6 hours?", 4000, "$500 \\times 2^3$."), ["$4000$."]),
    ex(2, dp("deax-ex-3", "Find the decay constant $k$ for a half-life of 10 years.", Math.log(2) / 10, "$\\tfrac{\\ln 2}{10}$."), ["$\\approx 0.069$ per year."]),
    ex(2, num("deax-ex-4", "A liquid cools from 90° to 55° in 10 min in a 20° room. Find its temperature after 20 min.", 37.5, "Excess 70 → 35 → 17.5."), ["$37.5°$."]),
    ex(2, dp("deax-ex-5", "The same liquid: how many minutes until it reaches 30°?", (10 * Math.log(7)) / Math.log(2), "$10\\log_27$."), ["$\\approx 28.074$ min."]),
    ex(3, dp("deax-ex-6", "A 100 L tank with 10 kg of salt is flushed with pure water at 5 L/min (same outflow). Find the salt after 20 min, in kg.", 10 / Math.E, "$10e^{-1}$."), ["$\\approx 3.679$ kg."]),
    ex(3, dp("deax-ex-7", "How many half-lives until only 10% of a sample remains?", Math.log2(10), "$\\left(\\tfrac12\\right)^n = 0.1$."), ["$\\log_210 \\approx 3.322$."]),
    ex(3, mc("deax-ex-8", "A population follows $\\dfrac{dP}{dt} = rP\\left(1 - \\dfrac PK\\right)$ with $0 < P(0) < K$. In the long run $P$", ["tends to $K$", "$P = K$ is an attracting equilibrium."], [["grows without bound", "Growth slows as $P$ nears $K$."], ["tends to 0", "$P = 0$ repels when $r > 0$."]]), ["The carrying capacity."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const m0 = r.pick([64, 80, 96, 128, 160, 200, 320]);
      const h = r.int(2, 8);
      const k = r.int(1, 4);
      return n(`${m0} g of a substance has a half-life of ${h} days. How much is left after ${h * k} days?`, m0 / 2 ** k, `${k} half-lives: $${m0} \\times \\left(\\tfrac12\\right)^{${k}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const n0 = r.pick([100, 250, 500, 1000]);
      const d = r.int(1, 4);
      const k = r.int(1, 5);
      return n(`A population of ${n0} doubles every ${d} hour${d === 1 ? "" : "s"}. How large is it after ${d * k} hours?`, n0 * 2 ** k, `$${n0} \\times 2^{${k}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const ts = r.int(15, 25);
      const excess = r.pick([40, 64, 80, 96]);
      const h = r.int(5, 15);
      const k = r.int(1, 3);
      const v = ts + excess / 2 ** k;
      return n(`A liquid at ${ts + excess}° cools to ${ts + excess / 2}° in ${h} minutes in a ${ts}° room. Find its temperature after ${h * k} minutes.`, v, `The excess over ${ts}° halves every ${h} minutes: $${ts} + ${excess}/2^{${k}}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.pick([0.05, 0.1, 0.2, 0.25, 0.5]);
      const v = Math.log(2) / k;
      return n(`$\\dfrac{dN}{dt} = ${k}N$. Find the doubling time (3 decimals).`, Math.round(v * 1000) / 1000, `$\\dfrac{\\ln 2}{${k}}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const ts = r.pick([15, 20, 25]);
      const t0 = r.pick([80, 90, 100]);
      return mcNumbers(
        `An object at ${t0}° C cools by Newton's law in a room at ${ts}° C. As $t \\to \\infty$ its temperature tends to`,
        { text: `${ts}° C`, why: `$T = ${ts} + ${t0 - ts}e^{-kt}$.` },
        [{ text: "0° C", why: "It cools towards the room temperature.", misconception: "cooling-to-zero" }, { text: `${(t0 + ts) / 2}° C`, why: "That is passed through, not approached." }],
      );
    },
  },
];
