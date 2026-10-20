import { ex, mc, num, vec, type Depth } from "../deepen";

/** Neural Networks at exam depth: neurons and their boundaries, activations, layers, the forward pass, training, capacity. */

/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const V = (...xs: (string | number)[]) => `\\begin{bmatrix} ${xs.join(" \\\\ ")} \\end{bmatrix}`;
const M = (a: string | number, b: string | number, c: string | number, d: string | number) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const sigma = (z: number) => 1 / (1 + Math.exp(-z));

export const UNIT7_DEPTH: Record<string, Depth> = {
  // §{neuron}
  neuron: {
    definitions: [
      {
        type: "definition",
        term: "pre-activation, activation",
        body: "A neuron with weights $\\vec w$ and bias $b$ computes the **pre-activation** $z = \\vec w\\cdot\\vec x + b$ and outputs $a = f(z)$. With a step activation it predicts class 1 when $z > 0$; with a sigmoid it outputs a probability $\\sigma(z)$.",
      },
      {
        type: "definition",
        term: "decision boundary",
        body: "The set where $z = 0$, i.e. $\\vec w\\cdot\\vec x + b = 0$. In two dimensions it is a line, in more a **hyperplane**. Points with $z > 0$ are on the positive side.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "geometry of the boundary",
        statement: "$\\vec w$ is perpendicular to the boundary, and a point $\\vec x$ lies at distance $\\dfrac{|\\vec w\\cdot\\vec x + b|}{|\\vec w|}$ from it. In particular the origin is at distance $\\dfrac{|b|}{|\\vec w|}$.",
        proof: [
          "For two points on the boundary, $\\vec w\\cdot\\vec x_1 + b = \\vec w\\cdot\\vec x_2 + b = 0$, so $\\vec w\\cdot(\\vec x_1 - \\vec x_2) = 0$: $\\vec w$ is perpendicular to every direction along it.",
          "Moving a distance $t$ along the unit normal $\\vec w/|\\vec w|$ changes $z$ by $t|\\vec w|$, so the distance is $|z|/|\\vec w|$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "logic gates, and XOR",
        statement: "With a step activation on inputs in $\\{0, 1\\}$, $\\vec w = (1, 1)$ gives AND when $b = -1.5$ and OR when $b = -0.5$. No single neuron computes XOR.",
        proof: [
          "AND: $z = -1.5, -0.5, -0.5, 0.5$ on $(0,0), (0,1), (1,0), (1,1)$, positive only for $(1, 1)$. OR: $z = -0.5, 0.5, 0.5, 1.5$.",
          "XOR would need $b \\le 0$, $w_1 + b > 0$, $w_2 + b > 0$ and $w_1 + w_2 + b \\le 0$. Adding the middle two gives $w_1 + w_2 + b > -b \\ge 0$, a contradiction.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `$\\vec w = ${V(2, -1)}$, $b = 1$, $\\vec x = ${V(1, 3)}$. Find $z$ and the sigmoid output.`,
        solution: ["$z = 2 - 3 + 1 = 0$.", "$\\sigma(0) = 0.5$: the point sits on the boundary, maximally unsure."],
        result: "$z = 0$, output 0.5.",
      },
      {
        type: "example",
        level: 2,
        title: "boundary geometry",
        problem: "A neuron has $\\vec w = (3, 4)$ and $b = -10$. Describe its boundary and find how far $(2, 3)$ is from it.",
        solution: [
          "Boundary: $3x + 4y = 10$, perpendicular to $(3, 4)$, at distance $10/5 = 2$ from the origin.",
          "At $(2, 3)$: $z = 6 + 12 - 10 = 8 > 0$, so it is on the positive side, at distance $8/5 = 1.6$.",
        ],
        result: "$3x + 4y = 10$; $(2, 3)$ is 1.6 away, on the positive side.",
      },
      {
        type: "example",
        level: 3,
        title: "a boundary through given points",
        problem: "Find a neuron (with $b = -4$) whose boundary passes through $(0, 2)$ and $(4, 0)$, with the origin on the negative side.",
        solution: ["The line is $\\tfrac x4 + \\tfrac y2 = 1$, i.e. $x + 2y - 4 = 0$.", "So $\\vec w = (1, 2)$ and $b = -4$; at the origin $z = -4 < 0$, as required."],
        result: "$\\vec w = (1, 2)$, $b = -4$.",
      },
    ],
    pitfalls: [
      { wrong: "The bias multiplies an input.", right: "It is added: it shifts the boundary away from the origin." },
      { wrong: "The weight vector points along the boundary.", right: "It is perpendicular to it, pointing to the positive side." },
      { wrong: "With the right weights one neuron can compute anything.", right: "One neuron draws one straight boundary; XOR needs a hidden layer (§{train-network})." },
    ],
    formulas: [
      { label: "Neuron", tex: "z = \\vec w\\cdot\\vec x + b,\\quad a = f(z)" },
      { label: "Boundary", tex: "\\vec w\\cdot\\vec x + b = 0" },
      { label: "Distance", tex: "\\dfrac{|\\vec w\\cdot\\vec x + b|}{|\\vec w|}" },
    ],
    exercises: [
      ex(1, num("nrn-ex-1", `$\\vec w = ${V(1, 2, -1)}$, $\\vec x = ${V(3, 0, 2)}$, $b = 0.5$. Find $z$.`, 1.5, "Dot product plus bias."), ["$3 + 0 - 2 + 0.5 = 1.5$."]),
      ex(1, num("nrn-ex-2", `$\\vec w = ${V(4, -2)}$, $\\vec x = ${V(0.5, 1)}$, $b = -1$. Find $z$.`, -1, "$2 - 2 - 1$."), ["$z = 2 - 2 - 1 = -1$."]),
      ex(2, num("nrn-ex-3", "A neuron has $\\vec w = (3, 4)$ and $b = -10$. How far is its boundary from the origin?", 2, "$|b|/|\\vec w|$."), ["$10/5 = 2$."]),
      ex(2, num("nrn-ex-4", "For the boundary $3x + 4y - 10 = 0$, find the distance of the point $(2, 3)$.", 1.6, "$|z|/|\\vec w|$."), ["$z = 8$ and $|\\vec w| = 5$: $1.6$."]),
      ex(2, num("nrn-ex-5", "A neuron has $\\vec w = (2, 5)$ and $b = -6$. Where does its boundary cross the $x$-axis?", 3, "Set $y = 0$."), ["$2x - 6 = 0$ gives $x = 3$."]),
      ex(2, mc("nrn-ex-6", "With $\\vec w = (1, 1)$ and a step at $z > 0$, which bias makes the neuron an OR gate on $\\{0, 1\\}^2$?", ["$b = -0.5$", "$(0,0)$ gives $-0.5$; any single 1 gives $0.5$."], [["$b = -1.5$", "That is AND."], ["$b = 0.5$", "Then $(0, 0)$ outputs 1."]]), ["Need $b \\le 0$ and $1 + b > 0$, so any $b$ in $(-1, 0]$; $-0.5$ is the usual choice."]),
      ex(3, mc("nrn-ex-7", "Can a single neuron with a step activation compute XOR?", ["No: XOR's classes cannot be split by one line", "The four inequalities contradict each other."], [["Yes, with $b = -1$", "Check $(1, 1)$: $z$ is positive whenever both single inputs are."], ["Yes, with negative weights", "Any weights fail; see the proof."]]), ["Adding the conditions for $(1, 0)$ and $(0, 1)$ forces $(1, 1)$ positive too."]),
      ex(3, num("nrn-ex-8", "A sigmoid neuron outputs 0.5 at a point. What is $z$ there?", 0, "$\\sigma(0) = 0.5$."), ["$\\sigma(z) = 0.5$ only at $z = 0$: the point is on the boundary."]),
      ex(3, num("nrn-ex-9", "Find $\\sigma(\\ln 3)$.", 0.75, "$e^{-\\ln 3} = \\tfrac13$."), ["$\\dfrac{1}{1 + 1/3} = \\dfrac34$."]),
      ex(3, vec("nrn-ex-10", "Find $\\vec w$ for a neuron with $b = -6$ whose boundary passes through $(0, 3)$ and $(6, 0)$.", [1, 2], "The line $x + 2y = 6$."), ["$\\tfrac x6 + \\tfrac y3 = 1$ is $x + 2y - 6 = 0$, so $\\vec w = (1, 2)$."]),
    ],
  },

  // §{activation}
  activation: {
    definitions: [
      {
        type: "definition",
        term: "common activations",
        body: "**ReLU** $\\max(0, z)$; **leaky ReLU** $\\max(\\alpha z, z)$ with small $\\alpha$ such as 0.01; **sigmoid** $\\sigma(z) = \\dfrac{1}{1 + e^{-z}}$; **tanh** $\\dfrac{e^z - e^{-z}}{e^z + e^{-z}}$. **Softmax** turns a score vector into probabilities: $\\operatorname{softmax}(\\vec z)_i = \\dfrac{e^{z_i}}{\\sum_j e^{z_j}}$.",
      },
      {
        type: "definition",
        term: "saturation",
        body: "Sigmoid and tanh flatten out for large $|z|$: the unit is **saturated**, its derivative is near 0, and almost no gradient passes through it.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "linear layers collapse",
        statement: "Without activations, $W_2(W_1\\vec x + \\vec b_1) + \\vec b_2 = (W_2W_1)\\vec x + (W_2\\vec b_1 + \\vec b_2)$: any number of linear layers equals one.",
        proof: ["Distribute $W_2$; the result is one matrix times $\\vec x$ plus one vector. Induction extends it to any depth."],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "derivatives",
        statement: "$\\text{ReLU}'(z) = 1$ for $z > 0$ and 0 for $z < 0$; $\\sigma' = \\sigma(1 - \\sigma) \\le \\tfrac14$; $\\tanh' = 1 - \\tanh^2 \\le 1$. Also $\\tanh z = 2\\sigma(2z) - 1$.",
        proof: [
          "$\\sigma'$ is from §{chain-rule}. For tanh, the quotient rule gives $\\dfrac{(e^z + e^{-z})^2 - (e^z - e^{-z})^2}{(e^z + e^{-z})^2} = 1 - \\tanh^2 z$.",
          "$\\tanh z = \\dfrac{1 - e^{-2z}}{1 + e^{-2z}} = \\dfrac{2}{1 + e^{-2z}} - 1 = 2\\sigma(2z) - 1$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "vanishing gradients",
        statement: "Backprop through $k$ sigmoid layers multiplies the gradient by $k$ factors $\\sigma'$, each at most $\\tfrac14$. With moderate weights the gradient reaching early layers shrinks like $4^{-k}$. ReLU's derivative of 1 on active units avoids this, which is one reason it is the default.",
        proof: ["Each layer contributes (weight) $\\times\\ \\sigma'(z)$ by the chain rule (§{backprop}), and $\\sigma' \\le \\tfrac14$."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "softmax",
        statement: "Softmax outputs are positive and sum to 1. Adding the same constant to every $z_i$ leaves them unchanged. For two classes, $\\operatorname{softmax}(z_1, z_2)_1 = \\sigma(z_1 - z_2)$.",
        proof: [
          "Exponentials are positive, and dividing by their sum normalises. $e^{z_i + c} = e^c e^{z_i}$, and $e^c$ cancels.",
          "$\\dfrac{e^{z_1}}{e^{z_1} + e^{z_2}} = \\dfrac{1}{1 + e^{-(z_1 - z_2)}}$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Evaluate ReLU, sigmoid and tanh at $z = 0$ and at $z = -2$.",
        solution: ["At 0: $0$, $0.5$, $0$.", "At $-2$: $0$, $\\sigma(-2) \\approx 0.119$, $\\tanh(-2) \\approx -0.964$."],
        result: "$(0, 0.5, 0)$ and $(0, 0.119, -0.964)$.",
      },
      {
        type: "example",
        level: 2,
        title: "softmax",
        problem: "Find $\\operatorname{softmax}(2, 1, 0)$.",
        solution: ["$e^2 \\approx 7.389$, $e^1 \\approx 2.718$, $e^0 = 1$; total $\\approx 11.107$.", "Divide each by the total."],
        result: "About $(0.665, 0.245, 0.090)$.",
      },
      {
        type: "example",
        level: 3,
        title: "two layers that are one",
        problem: `Two linear layers $W_1 = ${M(1, 2, 0, 1)}$ and $W_2 = \\begin{bmatrix} 1 & -1 \\end{bmatrix}$, no biases or activation. Write the network as one neuron.`,
        solution: ["$W_2W_1 = \\begin{bmatrix} 1 \\cdot 1 + (-1) \\cdot 0 & 1 \\cdot 2 + (-1) \\cdot 1 \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\end{bmatrix}$.", "The whole network computes $x_1 + x_2$: a single neuron with $\\vec w = (1, 1)$."],
        result: "$\\hat y = x_1 + x_2$.",
      },
    ],
    pitfalls: [
      { wrong: "A sigmoid output of 0.7 is the class.", right: "It is a probability. The class comes from a threshold, often 0.5." },
      { wrong: "ReLU always passes gradient.", right: "Only where its input was positive. A unit negative on every example is **dead** and never updates." },
      { wrong: "Softmax divides each score by the sum of the scores.", right: "Exponentiate first; scores can be negative, probabilities cannot." },
    ],
    formulas: [
      { label: "Sigmoid", tex: "\\sigma(z) = \\dfrac{1}{1 + e^{-z}},\\quad \\sigma' = \\sigma(1 - \\sigma)" },
      { label: "tanh", tex: "\\tanh z = 2\\sigma(2z) - 1,\\quad \\tanh' = 1 - \\tanh^2" },
      { label: "Softmax", tex: "p_i = \\dfrac{e^{z_i}}{\\sum_j e^{z_j}}" },
      { label: "Collapse", tex: "W_2(W_1\\vec x) = (W_2W_1)\\vec x" },
    ],
    exercises: [
      ex(1, num("avn-ex-1", "Leaky ReLU with $\\alpha = 0.1$: find its value at $z = -5$.", -0.5, "$\\max(0.1z, z)$."), ["$\\max(-0.5, -5) = -0.5$."]),
      ex(1, num("avn-ex-2", "Find $\\tanh(0)$.", 0, "Odd function."), ["$\\dfrac{1 - 1}{1 + 1} = 0$."]),
      ex(2, dp("avn-ex-3", "Find $\\sigma(2)$.", sigma(2), "$1/(1 + e^{-2})$."), ["$e^{-2} \\approx 0.135$, so $\\sigma(2) \\approx 1/1.135 \\approx 0.881$."]),
      ex(2, num("avn-ex-4", "Find the derivative of $\\tanh$ at 0.", 1, "$1 - \\tanh^2$."), ["$1 - 0^2 = 1$: four times $\\sigma'(0)$."]),
      ex(2, num("avn-ex-5", "Find the second entry of $\\operatorname{softmax}(0, \\ln 3)$.", 0.75, "$e^0 = 1$, $e^{\\ln 3} = 3$."), ["$\\dfrac{3}{1 + 3} = \\dfrac34$."]),
      ex(2, mc("avn-ex-6", "How does $\\operatorname{softmax}(11, 12, 13)$ compare with $\\operatorname{softmax}(1, 2, 3)$?", ["They are equal", "Adding 10 to every score cancels."], [["The first is more spread out", "Only differences between scores matter."], ["The first is closer to uniform", "Shifting does not change the differences."]]), ["$e^{z_i + 10} = e^{10}e^{z_i}$; the factor cancels in the ratio."]),
      ex(3, dp("avn-ex-7", "Two classes have scores $z_1 = 3$ and $z_2 = 1$. Find the softmax probability of class 1.", sigma(2), "$\\sigma(z_1 - z_2)$."), ["$\\sigma(3 - 1) = \\sigma(2) \\approx 0.881$."]),
      ex(3, vec("avn-ex-8", `Two linear layers $W_1 = ${M(2, 0, 1, 1)}$ then $W_2 = \\begin{bmatrix} 1 & 2 \\end{bmatrix}$, no biases or activation. Give the single equivalent weight vector.`, [4, 2], "$W_2W_1$."), ["$W_2W_1 = \\begin{bmatrix} 1 \\cdot 2 + 2 \\cdot 1 & 1 \\cdot 0 + 2 \\cdot 1 \\end{bmatrix} = \\begin{bmatrix} 4 & 2 \\end{bmatrix}$."]),
      ex(3, num("avn-ex-9", "Each of 5 sigmoid layers multiplies the gradient by at most $\\tfrac14$ (with weights of 1). After all 5, the gradient is at most $\\tfrac1N$ of its size. Find $N$.", 1024, "$4^5$."), ["$4^5 = 1024$."]),
      ex(3, num("avn-ex-10", "$\\sigma(2z) = 0.9$. Find $\\tanh z$.", 0.8, "$\\tanh z = 2\\sigma(2z) - 1$."), ["$2 \\times 0.9 - 1 = 0.8$."]),
      ex(3, mc("avn-ex-11", "A ReLU unit's input is negative for every training example. During training its incoming weights", ["never change", "It passes back zero gradient."], [["grow until it activates", "Nothing pushes them: their gradient is 0."], ["change like any other weight", "ReLU's derivative is 0 for negative inputs."]]), ["This is a dead ReLU. Leaky ReLU keeps a small slope so the unit can recover."]),
    ],
  },

  // §{layer}
  layer: {
    definitions: [
      {
        type: "definition",
        term: "dense layer",
        body: "A **dense** (fully connected) layer of $m$ neurons on $n$ inputs computes $\\vec z = W\\vec x + \\vec b$ with $W$ of shape $m \\times n$. Entry $W_{ij}$ is the weight from input $j$ to neuron $i$.",
      },
      {
        type: "definition",
        term: "batch form",
        body: "Stack $B$ examples as the rows of $X$ ($B \\times n$). Then $Z = XW^{\\mathsf T} + \\vec b^{\\mathsf T}$, of shape $B \\times m$, with the bias added to every row. Row $k$ of $Z$ is example $k$'s layer output.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "size and cost",
        statement: "A layer from $n$ to $m$ has $mn + m$ parameters and takes $mn$ multiplications per example, $Bmn$ for a batch.",
        proof: ["Each of the $m$ neurons has $n$ weights and one bias, and computes one $n$-term dot product."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "shapes must chain",
        statement: "A layer of shape $k \\times m$ can follow one of shape $m \\times n$: the next layer's inputs are the previous layer's neurons. The composite maps $n$ inputs to $k$ outputs.",
        proof: ["$W_2W_1$ is defined only when $W_2$ has as many columns as $W_1$ has rows (§{composition}), and it has shape $k \\times n$."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "columns are input directions",
        statement: "Column $j$ of $W$ is the layer's output for the input $\\vec e_j$ (with $\\vec b = \\vec 0$), so $W\\vec x = x_1(\\text{col } 1) + \\dots + x_n(\\text{col } n)$.",
        proof: ["This is matrix–vector multiplication read by columns: a linear combination of the columns with the inputs as coefficients."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "A layer takes a $28 \\times 28$ image (784 pixels) to 128 hidden units. Give the shape of $W$ and the parameter count.",
        solution: ["$W$ is $128 \\times 784$ and $\\vec b$ has 128 entries.", "$128 \\times 784 + 128 = 100{,}352 + 128$."],
        result: "$128 \\times 784$; 100,480 parameters.",
      },
      {
        type: "example",
        level: 2,
        problem: "$W = \\begin{bmatrix} 1 & 0 & -1 \\\\ 2 & 1 & 0 \\end{bmatrix}$, $\\vec x = (1, 2, 3)$, $\\vec b = (0, -3)$, then ReLU. Find the output.",
        solution: ["Rows dotted with $\\vec x$: $1 - 3 = -2$ and $2 + 2 = 4$.", "Add $\\vec b$: $(-2, 1)$. ReLU: $(0, 1)$."],
        result: "$(0, 1)$.",
      },
      {
        type: "example",
        level: 3,
        title: "a batch at once",
        problem: `$W = ${M(1, 2, 3, 0)}$, $\\vec b = (1, -1)$. Find the outputs for the batch with rows $(1, 1)$ and $(0, 2)$.`,
        solution: [
          "Example 1: $W(1, 1) = (3, 3)$, plus $\\vec b$: $(4, 2)$.",
          "Example 2: $W(0, 2) = (4, 0)$, plus $\\vec b$: $(5, -1)$.",
          `As one product: $Z = \\begin{bmatrix} 1 & 1 \\\\ 0 & 2 \\end{bmatrix}W^{\\mathsf T} + \\vec b^{\\mathsf T} = ${M(4, 2, 5, -1)}$.`,
        ],
        result: `$${M(4, 2, 5, -1)}$, one row per example.`,
      },
    ],
    pitfalls: [
      { wrong: "$W$ for $n$ inputs and $m$ neurons is $n \\times m$.", right: "It is $m \\times n$: one row per neuron." },
      { wrong: "Parameters $= mn$.", right: "Add the $m$ biases." },
      { wrong: "The layer's output is $W\\vec x + \\vec b$, finished.", right: "Hidden layers apply the activation next; forgetting it collapses the network (§{activation})." },
    ],
    formulas: [
      { label: "Layer", tex: "\\vec z = W\\vec x + \\vec b,\\quad W \\in \\mathbb R^{m \\times n}" },
      { label: "Batch", tex: "Z = XW^{\\mathsf T} + \\vec b^{\\mathsf T}" },
      { label: "Parameters", tex: "mn + m" },
    ],
    exercises: [
      ex(1, num("lyr-ex-1", "How many parameters has a layer from 784 inputs to 128 units?", 100480, "$mn + m$."), ["$128 \\times 784 + 128 = 100{,}480$."]),
      ex(1, num("lyr-ex-2", "A layer has 10 neurons on 20 inputs. How many rows has $W$?", 10, "One per neuron."), ["$W$ is $10 \\times 20$."]),
      ex(2, vec("lyr-ex-3", `$W = ${M(2, -1, 0, 1)}$, $\\vec x = ${V(1, 3)}$, $\\vec b = ${V(1, -2)}$. Find $\\vec z$.`, [0, 1], "Rows dotted with $\\vec x$."), ["$W\\vec x = (2 - 3, 3) = (-1, 3)$; adding $\\vec b$ gives $(0, 1)$."]),
      ex(2, vec("lyr-ex-4", `$W = ${M(1, 1, 1, -1)}$, $\\vec x = ${V(2, 3)}$, $\\vec b = \\vec 0$, then ReLU. Find the output.`, [5, 0], "Apply ReLU."), ["$W\\vec x = (5, -1)$, and ReLU gives $(5, 0)$."]),
      ex(2, num("lyr-ex-5", "How many multiplications does one example need through a layer from 512 to 256?", 131072, "$mn$."), ["$256 \\times 512 = 131{,}072$."]),
      ex(2, num("lyr-ex-6", "Count the parameters in layers $10 \\to 20 \\to 20 \\to 5$.", 745, "Sum $mn + m$."), ["$220 + 420 + 105 = 745$."]),
      ex(3, num("lyr-ex-7", "$W_1$ is $64 \\times 32$. How many columns must the next layer's $W_2$ have?", 64, "Shapes chain."), ["$W_2$ reads the 64 outputs of the first layer."]),
      ex(3, num("lyr-ex-8", "A batch of 32 examples passes through a layer from 100 to 50. How many numbers are in the output $Z$?", 1600, "$B \\times m$."), ["$Z$ is $32 \\times 50 = 1600$."]),
      ex(3, vec("lyr-ex-9", "A linear layer with $\\vec b = \\vec 0$ maps $(1, 0)$ to $(2, 5)$ and $(0, 1)$ to $(-1, 3)$. Find its output for $(2, 1)$.", [3, 13], "Columns are the images of $\\vec e_1, \\vec e_2$."), ["$2(2, 5) + 1(-1, 3) = (3, 13)$."]),
      ex(3, num("lyr-ex-10", "A network $100 \\to h \\to 10$ has one hidden layer of width $h = 50$. Count its parameters.", 5560, "Two layers."), ["$100 \\cdot 50 + 50 = 5050$ and $50 \\cdot 10 + 10 = 510$: 5560."]),
    ],
  },

  // §{forward-pass}
  "forward-pass": {
    definitions: [
      {
        type: "definition",
        term: "depth and width",
        body: "Write $\\vec h^{(0)} = \\vec x$ and $\\vec h^{(\\ell)} = f(W_\\ell\\vec h^{(\\ell - 1)} + \\vec b_\\ell)$ for each hidden layer $\\ell$. The number of layers with weights is the **depth**; the number of units in a layer is its **width**.",
      },
      {
        type: "definition",
        term: "output layer and loss",
        body: "**Regression**: a linear output and squared error. **Binary classification**: a sigmoid output $p$ and cross-entropy $-[y\\ln p + (1 - y)\\ln(1 - p)]$. **Multiclass**: softmax outputs and cross-entropy $-\\ln p_y$, the negative log-probability of the correct class.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "parameter count",
        statement: "A network with layer widths $n_0, n_1, \\dots, n_L$ has $\\displaystyle\\sum_{\\ell = 1}^{L}(n_{\\ell - 1}n_\\ell + n_\\ell)$ parameters.",
        proof: ["Add the count $mn + m$ (§{layer}) for each layer."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "softmax with cross-entropy",
        statement: "With $p = \\operatorname{softmax}(\\vec z)$ and $L = -\\ln p_y$, $\\dfrac{\\partial L}{\\partial z_k} = p_k - [k = y]$: the gradient is predicted probabilities minus the one-hot label.",
        proof: ["$L = -z_y + \\ln\\sum_j e^{z_j}$. Differentiating, $\\dfrac{\\partial L}{\\partial z_k} = -[k = y] + \\dfrac{e^{z_k}}{\\sum_j e^{z_j}}$."],
      },
      {
        type: "theorem",
        name: "universal approximation",
        statement: "A network with one hidden layer, a nonlinear activation such as ReLU, and enough hidden units can approximate any continuous function on a bounded region as closely as desired.",
        proof: [
          "The full proof is beyond this book. The idea for one input: each ReLU unit $\\text{ReLU}(x - c)$ is a hinge that bends at $c$.",
          "A weighted sum of hinges is a piecewise-linear curve with a bend wherever you like, and such curves can follow any continuous curve as closely as desired.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `$\\vec x = ${V(1, -1)}$, $W_1 = ${M(2, 1, 1, 3)}$, $\\vec b_1 = ${V(0, 1)}$, ReLU, then $\\hat y = 2h_1 - h_2 + 0.5$. Find $\\hat y$.`,
        solution: ["$W_1\\vec x + \\vec b_1 = (2 - 1, 1 - 3 + 1) = (1, -1)$; ReLU gives $\\vec h = (1, 0)$.", "$\\hat y = 2 - 0 + 0.5 = 2.5$."],
        result: "$\\hat y = 2.5$.",
      },
      {
        type: "example",
        level: 2,
        title: "absolute value from two units",
        problem: "Show that a hidden layer of two ReLU units computes $|x|$.",
        solution: ["Take $h_1 = \\text{ReLU}(x)$ and $h_2 = \\text{ReLU}(-x)$, and output $h_1 + h_2$.", "For $x \\ge 0$ this is $x + 0$; for $x < 0$ it is $0 + (-x)$. Either way, $|x|$."],
        result: "$|x| = \\text{ReLU}(x) + \\text{ReLU}(-x)$.",
      },
      {
        type: "example",
        level: 3,
        title: "softmax loss and gradient",
        problem: "Scores $\\vec z = (2, 0, 0)$ and the correct class is 1. Find the loss and $\\partial L/\\partial\\vec z$.",
        solution: [
          "$p_1 = \\dfrac{e^2}{e^2 + 2} \\approx \\dfrac{7.389}{9.389} \\approx 0.787$, and $p_2 = p_3 \\approx 0.107$.",
          "$L = -\\ln 0.787 \\approx 0.240$.",
          "Gradient $\\vec p - (1, 0, 0) \\approx (-0.213, 0.107, 0.107)$: descent raises $z_1$ and lowers the others.",
        ],
        result: "$L \\approx 0.240$; gradient $\\approx (-0.213, 0.107, 0.107)$.",
      },
    ],
    pitfalls: [
      { wrong: "Put a ReLU on a regression output.", right: "It would clip every negative prediction to 0. Use a linear output." },
      { wrong: "Cross-entropy uses the largest predicted probability.", right: "It uses the probability of the **correct** class, however small." },
      { wrong: "Universal approximation means one hidden layer is always enough in practice.", right: "It may need enormous width; depth usually reaches the same accuracy with far fewer units." },
    ],
    formulas: [
      { label: "Layer recursion", tex: "\\vec h^{(\\ell)} = f(W_\\ell\\vec h^{(\\ell - 1)} + \\vec b_\\ell)" },
      { label: "Multiclass loss", tex: "L = -\\ln p_y" },
      { label: "Its gradient", tex: "\\partial L/\\partial\\vec z = \\vec p - \\vec e_y" },
      { label: "Parameters", tex: "\\textstyle\\sum_\\ell (n_{\\ell - 1}n_\\ell + n_\\ell)" },
    ],
    exercises: [
      ex(1, num("fwd-ex-1", "$\\vec h = \\text{ReLU}(1, -2)$, then $\\hat y = 3h_1 + h_2 + 1$. Find $\\hat y$.", 4, "$\\vec h = (1, 0)$."), ["$3 + 0 + 1 = 4$."]),
      ex(1, num("fwd-ex-2", "Count the parameters of a $4 \\to 3 \\to 2$ network.", 23, "$15 + 8$."), ["$4 \\cdot 3 + 3 = 15$ and $3 \\cdot 2 + 2 = 8$."]),
      ex(2, num("fwd-ex-3", `$\\vec x = ${V(2, 1)}$, $W_1 = ${M(1, -1, 0, 2)}$, $\\vec b_1 = ${V(0, -1)}$, ReLU, then $\\hat y = h_1 + 2h_2$. Find $\\hat y$.`, 3, "Pre-activation $(1, 1)$."), ["$W_1\\vec x + \\vec b_1 = (1, 1)$, unchanged by ReLU; $\\hat y = 1 + 2 = 3$."]),
      ex(2, dp("fwd-ex-4", "A classifier predicts $p = 0.9$ for an example with $y = 1$. Find the cross-entropy loss.", -Math.log(0.9), "$-\\ln p$."), ["$-\\ln 0.9 \\approx 0.105$."]),
      ex(2, dp("fwd-ex-5", "It predicts $p = 0.9$ but the label is $y = 0$. Find the loss.", -Math.log(0.1), "$-\\ln(1 - p)$."), ["$-\\ln 0.1 \\approx 2.303$: confident mistakes cost far more."]),
      ex(2, num("fwd-ex-6", "Evaluate $\\text{ReLU}(x) + \\text{ReLU}(-x)$ at $x = -3$.", 3, "It is $|x|$."), ["$0 + 3 = 3$."]),
      ex(3, dp("fwd-ex-7", "Scores $(1, 1, 1)$; the correct class is 1. Find the softmax cross-entropy loss.", Math.log(3), "$p_1 = \\tfrac13$."), ["$-\\ln\\tfrac13 = \\ln 3 \\approx 1.099$."]),
      ex(3, vec("fwd-ex-8", "Scores $(0, 0)$ with the correct class 1. Find $\\partial L/\\partial\\vec z$ for softmax cross-entropy.", [-0.5, 0.5], "$\\vec p - \\vec e_1$."), ["$\\vec p = (0.5, 0.5)$, minus $(1, 0)$, is $(-0.5, 0.5)$."]),
      ex(3, num("fwd-ex-9", "Count the parameters of a $784 \\to 256 \\to 128 \\to 10$ network.", 235146, "Three layers."), ["$200{,}960 + 32{,}896 + 1{,}290 = 235{,}146$."]),
      ex(3, mc("fwd-ex-10", "A model predicts next month's profit, which can be negative, and its output unit has a ReLU. The problem is", ["it can never predict a loss", "ReLU clips negative outputs to 0."], [["training becomes impossible", "It trains, but it can never output a negative number."], ["the loss must be cross-entropy", "Regression uses squared error."]]), [
        "A ReLU output is never negative, so every predicted loss becomes 0. Regression outputs should be linear.",
      ]),
    ],
  },

  // §{training-loop}
  "training-loop": {
    definitions: [
      {
        type: "definition",
        term: "step, epoch, batch",
        body: "Each **step** uses one mini-batch of $B$ examples. With $N$ training examples an **epoch** takes $\\lceil N/B\\rceil$ steps, the last batch possibly smaller. Data is reshuffled each epoch.",
      },
      {
        type: "definition",
        term: "underfitting, overfitting, early stopping",
        body: "**Underfitting**: training and validation loss both high. **Overfitting**: training loss low but validation loss rising. **Early stopping** keeps the weights from the epoch with the lowest validation loss.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "mini-batch gradients",
        statement: "The average gradient over a random mini-batch has expected value equal to the full-data gradient, and its standard deviation shrinks like $1/\\sqrt B$.",
        proof: ["Each example's gradient is a random draw whose mean is the full gradient; expectations add. Averaging $B$ independent draws divides the variance by $B$ (§{clt})."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "symmetric initialisation fails",
        statement: "If every weight in a hidden layer starts at the same value, all its units compute the same thing, receive the same gradient, and stay identical forever. Weights are therefore initialised randomly.",
        proof: ["Same inputs and same weights give the same outputs; by symmetry backprop gives each the same gradient, so after the update they are still equal. Induction on steps."],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "momentum",
        statement: "Momentum keeps a running velocity $\\vec v \\leftarrow \\beta\\vec v + \\nabla L$ and updates $\\theta \\leftarrow \\theta - \\eta\\vec v$. Under a constant gradient $\\vec g$, $\\vec v \\to \\dfrac{\\vec g}{1 - \\beta}$: steps grow by the factor $\\dfrac{1}{1 - \\beta}$ along consistent directions.",
        proof: ["Starting from $\\vec 0$, $\\vec v_k = (1 + \\beta + \\dots + \\beta^{k-1})\\vec g$, a geometric series with limit $\\vec g/(1 - \\beta)$. Directions that flip sign cancel instead."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "1050 examples with batch size 100. How many steps per epoch?",
        solution: ["$1050/100 = 10.5$, so 11 batches.", "Ten have 100 examples and the last has 50."],
        result: "11 steps.",
      },
      {
        type: "example",
        level: 2,
        title: "one step by hand",
        problem: "Model $\\hat y = wx + b$ with $L = (\\hat y - y)^2$, at $w = 1$, $b = 0$. One example $x = 2$, $y = 5$, learning rate 0.1. Do one step.",
        solution: [
          "Forward: $\\hat y = 2$, and $\\partial L/\\partial\\hat y = 2(2 - 5) = -6$.",
          "Backward: $\\partial L/\\partial w = -6 \\times 2 = -12$ and $\\partial L/\\partial b = -6$.",
          "Update: $w = 1 + 1.2 = 2.2$ and $b = 0 + 0.6 = 0.6$. Now $\\hat y = 5.0$.",
        ],
        result: "$w = 2.2$, $b = 0.6$.",
      },
      {
        type: "example",
        level: 3,
        title: "reading the curves",
        problem: "Validation loss by epoch: $0.90, 0.60, 0.45, 0.42, 0.44, 0.50$, while training loss keeps falling. What happened, and which weights should be kept?",
        solution: ["Validation loss bottoms out at epoch 4 and then rises while training loss falls: overfitting from epoch 5.", "Early stopping keeps the epoch-4 weights."],
        result: "Overfitting after epoch 4; keep epoch 4.",
      },
    ],
    pitfalls: [
      { wrong: "Start all weights at 0.", right: "Hidden units would stay identical. Use small random values." },
      { wrong: "Choose the epoch with the best test score.", right: "Choose on validation data; the test set is for the final estimate only (§{cross-validation})." },
      { wrong: "Forget to reset gradients between steps.", right: "Frameworks accumulate gradients; without zeroing, each step adds the previous gradients again." },
    ],
    formulas: [
      { label: "Steps per epoch", tex: "\\lceil N/B\\rceil" },
      { label: "SGD update", tex: "w \\leftarrow w - \\eta\\,\\partial L/\\partial w" },
      { label: "Momentum", tex: "\\vec v \\leftarrow \\beta\\vec v + \\nabla L,\\ \\theta \\leftarrow \\theta - \\eta\\vec v" },
      { label: "Batch noise", tex: "\\propto 1/\\sqrt B" },
    ],
    exercises: [
      ex(1, num("trl-ex-1", "1000 examples, batch size 32. How many steps per epoch?", 32, "$\\lceil 31.25\\rceil$."), ["31 full batches and one of 8: 32 steps."]),
      ex(1, num("trl-ex-2", "2000 examples, batch size 100, 15 epochs. How many updates in total?", 300, "20 per epoch."), ["$20 \\times 15 = 300$."]),
      ex(2, num("trl-ex-3", "Model $\\hat y = wx + b$, $L = (\\hat y - y)^2$, at $w = 1$, $b = 0$. For $x = 1$, $y = 3$ and $\\eta = 0.25$, find the new $w$.", 2, "$\\partial L/\\partial w = -4$."), ["$\\hat y = 1$, $\\partial L/\\partial\\hat y = -4$, $\\partial L/\\partial w = -4$; $w = 1 + 1 = 2$."]),
      ex(2, num("trl-ex-4", "Same step. Find the new $b$.", 1, "$\\partial L/\\partial b = -4$."), ["$b = 0 + 0.25 \\times 4 = 1$."]),
      ex(2, num("trl-ex-5", "Validation losses by epoch: $1.2, 0.8, 0.7, 0.75, 0.9$. Which epoch does early stopping keep?", 3, "Lowest validation loss."), ["The minimum, 0.7, is at epoch 3."]),
      ex(2, num("trl-ex-6", "Under a constant gradient, by what factor does momentum with $\\beta = 0.8$ enlarge the step?", 5, "$1/(1 - \\beta)$."), ["$1/0.2 = 5$."]),
      ex(3, num("trl-ex-7", "The batch size goes from 16 to 64. By what factor does the standard deviation of the gradient estimate change?", 0.5, "$\\propto 1/\\sqrt B$."), ["$\\sqrt{16/64} = \\tfrac12$."]),
      ex(3, num("trl-ex-8", "Momentum with $\\beta = 0.9$ starts at $v = 0$ and sees gradients $2$ and then $2$. Find $v$ after the second step.", 3.8, "$v \\leftarrow 0.9v + g$."), ["$v_1 = 2$, then $v_2 = 0.9 \\times 2 + 2 = 3.8$."]),
      ex(3, mc("trl-ex-9", "Every hidden weight is initialised to 0.5. After training,", ["all hidden units are still identical", "They get identical gradients every step."], [["the units specialise as normal", "Nothing breaks the symmetry."], ["training fails to start", "It trains, but as if the layer had one unit."]]), ["Random initialisation is what lets units learn different features."]),
      ex(3, mc("trl-ex-10", "Training and validation loss are both high and close together. The model is", ["underfitting: try a bigger model or train longer", "It can't fit even the training data."], [["overfitting: add regularisation", "Overfitting shows a gap between the two."], ["finished", "High loss on training data means it hasn't learned the pattern."]]), ["No gap and high loss means too little capacity or too little training."]),
    ],
  },

  // §{train-network}
  "train-network": {
    definitions: [
      {
        type: "definition",
        term: "linearly separable",
        body: "Two classes are **linearly separable** when a single hyperplane $\\vec w\\cdot\\vec x + b = 0$ puts all of one class on each side. A network without hidden layers can only fit separable data.",
      },
      {
        type: "definition",
        term: "capacity",
        body: "The **capacity** of a model is the range of functions it can represent. A network's capacity grows with its width and depth; too little underfits, too much (for the amount of data) overfits.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "XOR with one hidden layer",
        statement: "$h_1 = \\text{ReLU}(x_1 + x_2)$, $h_2 = \\text{ReLU}(x_1 + x_2 - 1)$, $\\hat y = h_1 - 2h_2$ computes XOR on $\\{0, 1\\}^2$.",
        proof: [
          "$(0, 0)$: $h = (0, 0)$, $\\hat y = 0$. $(1, 0)$ and $(0, 1)$: $h = (1, 0)$, $\\hat y = 1$.",
          "$(1, 1)$: $h = (2, 1)$, $\\hat y = 2 - 2 = 0$. The hidden layer re-maps the four points so a straight line separates them.",
        ],
      },
      {
        type: "theorem",
        name: "ReLU networks are piecewise linear",
        statement: "With two inputs, a hidden layer of $k$ ReLU units bends along at most $k$ lines, which cut the plane into at most $1 + k + \\binom{k}{2}$ regions. On each region the network is a linear function.",
        proof: [
          "Each unit switches on or off across the line where its input is 0; between such lines every unit is either off or exactly linear.",
          "The $j$-th line crosses the earlier $j - 1$ lines at most $j - 1$ times, so it is cut into at most $j$ pieces, and each piece splits one region in two. Total $1 + (1 + 2 + \\dots + k) = 1 + k + \\binom{k}{2}$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "memorisation",
        statement: "A network with enough parameters can fit any labelling of $N$ training points exactly, even random labels. Perfect training accuracy therefore proves nothing; only held-out data measures learning.",
        proof: ["With enough hidden units the piecewise-linear pieces can be made small enough to isolate each training point and give it its label."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        title: "a better feature",
        problem: "Class A is inside the circle $x_1^2 + x_2^2 = 16$ and class B outside. Find a single neuron that separates them, given features $u = x_1^2$ and $v = x_2^2$.",
        solution: ["In the new features the circle is the line $u + v = 16$.", "A neuron with $\\vec w = (1, 1)$ and $b = -16$ outputs $z > 0$ exactly outside the circle. A hidden layer learns such features automatically."],
        result: "$z = u + v - 16$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Check the XOR network on the input $(1, 1)$, and explain why the second hidden unit is needed.",
        solution: ["$h_1 = 2$ and $h_2 = 1$, so $\\hat y = 2 - 2 = 0$.", "Without $h_2$, $\\hat y = h_1$ would give 2 at $(1, 1)$: the second unit's bend switches on only there and cancels it."],
        result: "$\\hat y = 0$.",
      },
      {
        type: "example",
        level: 3,
        title: "counting regions",
        problem: "A hidden layer has 4 ReLU units on 2 inputs. At most how many linear pieces does the network have?",
        solution: ["$1 + k + \\binom{k}{2}$ with $k = 4$.", "$1 + 4 + 6 = 11$."],
        result: "11.",
      },
    ],
    pitfalls: [
      { wrong: "Train a linear model longer to fit curved data.", right: "Its capacity is a straight boundary. Add a hidden layer or better features." },
      { wrong: "A bigger network is always better.", right: "With little data it memorises noise. Watch the validation loss." },
      { wrong: "100% training accuracy means a good model.", right: "Networks can fit random labels. Judge on held-out data." },
    ],
    formulas: [
      { label: "XOR", tex: "\\hat y = \\text{ReLU}(x_1 + x_2) - 2\\,\\text{ReLU}(x_1 + x_2 - 1)" },
      { label: "Regions", tex: "\\le 1 + k + \\binom{k}{2}" },
      { label: "Tent", tex: "\\text{ReLU}(x + 1) - 2\\,\\text{ReLU}(x) + \\text{ReLU}(x - 1)" },
    ],
    exercises: [
      ex(1, mc("tnw-ex-1", "Is XOR linearly separable?", ["No", "Opposite corners share a class."], [["Yes", "No line puts $(0,0), (1,1)$ on one side and $(0,1), (1,0)$ on the other."], ["Only with a bias", "The bias just moves the line."]]), ["A line with $(1, 0)$ and $(0, 1)$ on its positive side and $(0, 0)$ on its negative side must also put $(1, 1)$ on the positive side (§{neuron})."]),
      ex(1, num("tnw-ex-2", "Evaluate the XOR network $\\text{ReLU}(x_1 + x_2) - 2\\,\\text{ReLU}(x_1 + x_2 - 1)$ at $(1, 0)$.", 1, "$h = (1, 0)$."), ["$1 - 2 \\times 0 = 1$."]),
      ex(2, num("tnw-ex-3", "At most how many linear regions do 3 ReLU units on 2 inputs make?", 7, "$1 + 3 + 3$."), ["$1 + 3 + \\binom32 = 7$."]),
      ex(2, num("tnw-ex-4", "At most how many linear regions do 10 ReLU units on 2 inputs make?", 56, "$1 + 10 + 45$."), ["$1 + 10 + \\binom{10}{2} = 56$."]),
      ex(2, num("tnw-ex-5", "With features $u = x_1^2$, $v = x_2^2$ and the neuron $z = u + v - 16$, find $z$ for the point $(3, 4)$.", 9, "$9 + 16 - 16$."), ["$z = 9 > 0$: the point is outside the circle of radius 4."]),
      ex(2, num("tnw-ex-6", "Count the parameters of a $2 \\to 16 \\to 16 \\to 1$ network.", 337, "$48 + 272 + 17$."), ["$2 \\cdot 16 + 16 = 48$, $16 \\cdot 16 + 16 = 272$, $16 + 1 = 17$."]),
      ex(3, num("tnw-ex-7", "How many ReLU units does the tent $\\text{ReLU}(x + 1) - 2\\,\\text{ReLU}(x) + \\text{ReLU}(x - 1)$ use?", 3, "Count the terms."), ["Three hinges, at $-1$, $0$ and $1$."]),
      ex(3, num("tnw-ex-8", "Evaluate that tent at $x = 0.5$.", 0.5, "$1.5 - 1 + 0$."), ["$\\text{ReLU}(1.5) - 2\\,\\text{ReLU}(0.5) + \\text{ReLU}(-0.5) = 1.5 - 1 + 0 = 0.5$."]),
      ex(3, mc("tnw-ex-9", "A 10,000-parameter network gets 100% training accuracy and 60% validation accuracy on 200 points. This is", ["overfitting", "It memorised the training set."], [["underfitting", "Training accuracy is perfect."], ["a good model", "Validation accuracy is what matters."]]), ["The large gap between training and validation shows memorisation."]),
      ex(3, mc("tnw-ex-10", "Without hidden layers, how much more training is needed to fit the circle data?", ["None will do: the model can only draw a straight boundary", "Capacity, not training time, is the limit."], [["About ten times more", "Training can't add capacity."], ["It fits as soon as the learning rate is right", "A straight line never encloses a disc."]]), ["Add a hidden layer with a nonlinear activation, or circle-shaped features."]),
    ],
  },
};
