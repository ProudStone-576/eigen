import type { ConceptNode, Unit } from "@/lib/content/types";

const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;
const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;

const neuron: ConceptNode = {
  id: "neuron",
  title: "A single neuron",
  summary: "A neuron computes a weighted sum of its inputs plus a bias, z = w·x + b, then applies an activation.",
  deps: ["linear-combination"],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "neuron", meaning: "A unit that computes z = w·x + b and passes it through an activation." },
    { term: "bias", meaning: "The constant b added to the weighted sum: it shifts when the neuron switches on." },
    { term: "dot product", meaning: "w·x = w₁x₁ + w₂x₂ + …: multiply matching entries and add." },
  ],
  misconceptions: {
    "forget-bias": "Leaves the bias out of the neuron's sum.",
  },
  steps: [
    {
      type: "motivate",
      title: "A tiny decision-maker",
      body: "How would you score a loan application? Weigh income positively, debt negatively, add a baseline, and decide. That's one neuron.",
      realWorld: { title: "Spam score", body: "Count of \"free\" times a weight, plus count of links times a weight, plus a baseline: above zero, flag it." },
    },
    {
      type: "explore",
      title: "Turn the dials",
      body: "Two inputs, two weights, a bias, and an activation.",
      widget: { kind: "neuron" },
      task: "Make the output exactly 0 with ReLU. Then switch to sigmoid: what does z = 0 give?",
    },
    {
      type: "truth",
      statement: "A **neuron** computes $z = \\vec w\\cdot\\vec x + b = w_1x_1 + w_2x_2 + \\dots + b$, then an activation $a = f(z)$.",
      body: "The weighted sum is the *linear combination* you already know, with the inputs scaled by the weights. The bias shifts it.",
    },
    { type: "connect", body: "*Linear combinations*: the neuron's weighted sum is one. Training a network means choosing all those weights." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "neu-check-1",
        prompt: `$\\vec w = ${v(2, -1)}$, $\\vec x = ${v(3, 4)}$, $b = 1$. What is $z$?`,
        options: [
          { id: "a", text: "3", correct: true, why: "2·3 + (−1)·4 + 1 = 6 − 4 + 1." },
          { id: "b", text: "2", misconception: "forget-bias", why: "Don't forget to add the bias." },
          { id: "c", text: "11", why: "The −1 weight subtracts 4." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "neu-check-2",
        prompt: `$\\vec w = ${v(1, 1)}$, $\\vec x = ${v(2, 3)}$, $b = -4$. What is $z$?`,
        options: [
          { id: "a", text: "1", correct: true, why: "2 + 3 − 4." },
          { id: "b", text: "5", misconception: "forget-bias", why: "The bias, −4, is part of z." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A layer is many neurons side by side, and a network is layers in a row. GPT-sized models have billions of these weights, but each neuron still does exactly this sum.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "neu-produce-1", prompt: `$\\vec w = ${v(0.5, 2)}$, $\\vec x = ${v(4, -1)}$, $b = 3$. Compute $z$.`, answer: 3, explain: "2 − 2 + 3." },
        { kind: "number", id: "neu-produce-2", prompt: `$\\vec w = ${v(3, -2)}$, $\\vec x = ${v(1, 2)}$, $b = 0.5$. Compute $z$.`, answer: -0.5, explain: "3 − 4 + 0.5." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "neu-review-1", prompt: `$\\vec w = ${v(1, 2)}$, $\\vec x = ${v(1, 1)}$, $b = -1$. Compute $z$.`, answer: 2, explain: "1 + 2 − 1." },
  ],
};

const activation: ConceptNode = {
  id: "activation",
  title: "Activations & why they matter",
  summary: "A nonlinear activation (ReLU, tanh, sigmoid) after each layer stops the layers collapsing into one matrix.",
  deps: ["neuron", "composition"],
  pos: { x: 1, y: 2 },
  glossary: [
    { term: "ReLU", meaning: "max(0, z): passes positive values, zeroes out negatives." },
    { term: "sigmoid", meaning: "σ(z) = 1 / (1 + e⁻ᶻ): squashes any number into (0, 1), like a probability." },
  ],
  misconceptions: {
    "linear-stack-enough": "Thinks stacking linear layers adds power without activations.",
    "relu-passes-negatives": "Thinks ReLU lets negative values through.",
    "relu-abs": "Thinks ReLU takes the absolute value.",
  },
  steps: [
    {
      type: "motivate",
      title: "Why not just stack matrices?",
      body: "The composition lesson showed $W_2(W_1\\vec x) = (W_2W_1)\\vec x$: two matrices in a row are just one matrix. So a 100-layer network with no activations is a 1-layer network in disguise.",
      realWorld: { title: "Light switches vs dimmers", body: "A line of dimmers just dims; it never does anything a single dimmer couldn't. Add switches (on/off thresholds) and combinations start to matter." },
    },
    {
      type: "truth",
      statement: "**ReLU** $= \\max(0, z)$. **Sigmoid** $\\sigma(z) = \\dfrac{1}{1 + e^{-z}}$, between 0 and 1. **tanh** squashes to between −1 and 1.",
      body: "All are *nonlinear*: they bend. Put one after every layer and the layers can no longer merge.",
    },
    {
      type: "predict",
      misconception: "linear-stack-enough",
      item: {
        kind: "mc",
        id: "act-predict-1",
        prompt: "A network with a hidden layer but **no activation** tries to separate points inside a circle from points around it. Will it manage?",
        options: [
          { id: "a", text: "No: it collapses to one linear layer, so its boundary is a straight line", correct: true, why: "W₂W₁ is a single matrix." },
          { id: "b", text: "Yes: the hidden layer gives it the extra power", misconception: "linear-stack-enough", why: "Without bending, layers merge." },
        ],
      },
      reveal: {
        body: "Press **Train** and watch: with no activation the boundary stays a straight line and accuracy stalls. Switch to tanh and train again: the boundary curls around the circle.",
        widget: { kind: "playground", dataset: "circle", hidden: 6, activation: "linear" },
      },
      resolve: {
        kind: "mc",
        id: "act-resolve-1",
        prompt: "Activations are needed because:",
        options: [
          { id: "a", text: "They bend the maths, so layers can't collapse into one", correct: true, why: "Nonlinearity is the whole point." },
          { id: "b", text: "They aren't: more linear layers add power on their own", misconception: "linear-stack-enough", why: "The playground just showed a straight line." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "act-check-1",
        prompt: "ReLU(−3) = ?",
        options: [
          { id: "a", text: "0", correct: true, why: "Negatives become 0." },
          { id: "b", text: "−3", misconception: "relu-passes-negatives", why: "ReLU blocks negatives." },
          { id: "c", text: "3", misconception: "relu-abs", why: "That's the absolute value." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "act-check-2",
        prompt: "ReLU(−0.5) = ?",
        options: [
          { id: "a", text: "0", correct: true, why: "Any negative becomes 0." },
          { id: "b", text: "0.5", misconception: "relu-abs", why: "It doesn't flip the sign; it zeroes it." },
          { id: "c", text: "−0.5", misconception: "relu-passes-negatives", why: "Negatives don't pass." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "ReLU is the default inside deep networks: it's cheap and its derivative is just 0 or 1, which keeps gradients healthy. Sigmoid (or softmax) sits at the end of classifiers to turn scores into probabilities.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**.",
      items: [
        { kind: "number", id: "act-produce-1", prompt: "σ(0) = ?", answer: 0.5, explain: "1 / (1 + e⁰) = 1/2." },
        { kind: "number", id: "act-produce-2", prompt: "ReLU(2.5) = ?", answer: 2.5, explain: "Positives pass unchanged." },
        { kind: "number", id: "act-produce-3", prompt: `A neuron has $\\vec w = ${v(1, -2)}$, $\\vec x = ${v(1, 1)}$, $b = 0$ and ReLU. Its output?`, answer: 0, explain: "z = 1 − 2 = −1, and ReLU(−1) = 0." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "act-review-1", prompt: "ReLU(−7) = ?", answer: 0, explain: "Negatives become 0." },
  ],
};

const layer: ConceptNode = {
  id: "layer",
  title: "Layers are matrices",
  summary: "A layer of m neurons on n inputs is z = Wx + b with W of shape m × n: one row per neuron.",
  deps: ["neuron", "matrix-vector"],
  pos: { x: 1, y: 0 },
  glossary: [{ term: "layer", meaning: "Many neurons reading the same inputs. Their weights stack into a matrix W." }],
  misconceptions: {
    "shape-flip": "Gets the weight matrix shape backwards (inputs × neurons instead of neurons × inputs).",
    "forgot-activation": "Stops at Wx + b and forgets the activation.",
  },
  steps: [
    {
      type: "motivate",
      title: "Many neurons at once",
      body: "Run 100 neurons on the same input and you'd do 100 dot products. Stack their weight vectors as rows of a matrix and it's one matrix × vector.",
      realWorld: { title: "GPUs", body: "Graphics cards are built to multiply matrices fast. That's why neural networks run on them: every layer is a matrix product." },
    },
    {
      type: "truth",
      statement: "A layer of $m$ neurons on $n$ inputs: $\\vec z = W\\vec x + \\vec b$, with $W$ of shape $m\\times n$. Row $i$ of $W$ is neuron $i$'s weights. Then apply the activation to each entry.",
      body: "Parameters: $m\\cdot n$ weights plus $m$ biases.",
    },
    { type: "connect", body: "*Matrix × vector*: each output entry is one row of W dotted with x, which is exactly one *neuron*." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "layer-check-1",
        prompt: "A layer has 4 neurons reading 3 inputs. What shape is W?",
        options: [
          { id: "a", text: "4 × 3", correct: true, why: "One row per neuron, one column per input." },
          { id: "b", text: "3 × 4", misconception: "shape-flip", why: "Rows are neurons." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "layer-check-2",
        prompt: "A layer's weight matrix is 5 × 2. How many inputs does it take?",
        options: [
          { id: "a", text: "2", correct: true, why: "Columns = inputs." },
          { id: "b", text: "5", misconception: "shape-flip", why: "5 is the number of neurons (rows)." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "PyTorch's `nn.Linear(3, 4)` holds a 4 × 3 weight matrix and 4 biases. Shape mismatches are the most common bug in neural-network code.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "layer-produce-1",
          prompt: `$W = ${m(1, 2, 0, -1)}$, $\\vec x = ${v(3, 1)}$, $\\vec b = ${v(-1, 2)}$. Compute $\\vec z = W\\vec x + \\vec b$.`,
          answer: [4, 1],
          explain: `$W\\vec x = ${v(5, -1)}$, plus $\\vec b$: $${v(4, 1)}$.`,
        },
        {
          kind: "vector",
          id: "layer-produce-2",
          prompt: `$W = ${m(1, -1, 2, 1)}$, $\\vec x = ${v(1, 3)}$, $\\vec b = ${v(0, -2)}$, then ReLU. Output?`,
          answer: [0, 3],
          explain: `$\\vec z = ${v(-2, 3)}$; ReLU zeroes the negative: $${v(0, 3)}$.`,
          traps: [{ answer: [-2, 3], misconception: "forgot-activation", message: "Apply the ReLU too." }],
        },
        { kind: "number", id: "layer-produce-3", prompt: "How many parameters (weights + biases) in a layer of 4 neurons on 3 inputs?", answer: 16, explain: "4 × 3 weights + 4 biases." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "layer-review-1", prompt: "Parameters in a layer of 10 neurons on 5 inputs?", answer: 60, explain: "50 weights + 10 biases." },
  ],
};

const forwardPass: ConceptNode = {
  id: "forward-pass",
  title: "The forward pass",
  summary: "A network runs layer by layer: h = f(W₁x + b₁), then ŷ = W₂h + b₂.",
  deps: ["layer", "activation"],
  pos: { x: 2, y: 1 },
  glossary: [{ term: "hidden layer", meaning: "A layer between input and output. Its values h are the network's own learned features." }],
  misconceptions: {
    "skip-activation": "Forgets to apply the activation between layers.",
  },
  steps: [
    {
      type: "motivate",
      title: "Input in, prediction out",
      body: "Every prediction a network makes is one forward pass: feed the input through each layer in turn.",
      realWorld: { title: "An assembly line", body: "Each station reshapes the part and hands it on. Nothing goes backwards during production." },
    },
    {
      type: "truth",
      statement: "**Forward pass** for one hidden layer: $\\vec h = \\text{ReLU}(W_1\\vec x + \\vec b_1)$, then $\\hat y = W_2\\vec h + b_2$.",
      body: "Work left to right, applying the activation after the hidden layer. The hidden values $\\vec h$ are features the network invents for itself.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fp-check-1",
        prompt: `$\\vec x = ${v(1, 2)}$, $W_1 = ${m(1, -1, 2, 0)}$, $\\vec b_1 = ${v(0, -1)}$, ReLU, then $\\hat y = 3h_1 + 2h_2 + 1$. What is $\\hat y$?`,
        options: [
          { id: "a", text: "3", correct: true, why: "z₁ = (−1, 1), h = (0, 1), ŷ = 0 + 2 + 1." },
          { id: "b", text: "0", misconception: "skip-activation", why: "That used z₁ without the ReLU: −3 + 2 + 1." },
          { id: "c", text: "5", why: "Recheck W₁x: (1 − 2, 2 + 0)." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fp-check-2",
        prompt: `A hidden layer's pre-activation is $${v(-2, 4)}$. With ReLU, then $\\hat y = h_1 + h_2$, what is $\\hat y$?`,
        options: [
          { id: "a", text: "4", correct: true, why: "h = (0, 4)." },
          { id: "b", text: "2", misconception: "skip-activation", why: "ReLU zeroes the −2 first." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "`model(x)` in PyTorch runs exactly this. While it does, autograd records every operation so the backward pass can retrace them.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "fp-produce-1",
          prompt: `$\\vec x = ${v(2, 1)}$, $W_1 = ${m(1, 1, -1, 1)}$, $\\vec b_1 = \\vec 0$, ReLU, then $\\hat y = 2h_1 + 5h_2 - 1$. Compute $\\hat y$.`,
          answer: 5,
          explain: "z₁ = (3, −1), h = (3, 0), ŷ = 6 + 0 − 1.",
        },
        {
          kind: "number",
          id: "fp-produce-2",
          prompt: "How many parameters does a 2 → 3 → 1 network have (weights and biases)?",
          answer: 13,
          explain: "First layer 2·3 + 3 = 9; second layer 3·1 + 1 = 4.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "fp-review-1", prompt: "h = ReLU of (1, −1), then ŷ = 4h₁ + 4h₂. Compute ŷ.", answer: 4, explain: "h = (1, 0)." },
  ],
};

const training: ConceptNode = {
  id: "training-loop",
  title: "The training loop",
  summary: "Repeat: forward pass, loss, backward pass, update every weight. Watch validation loss to catch overfitting.",
  deps: ["forward-pass", "backprop"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "epoch", meaning: "One pass through the whole training set." },
    { term: "batch", meaning: "A small group of examples used for one gradient step." },
    { term: "overfitting", meaning: "Memorising the training data so well that performance on new data gets worse." },
  ],
  misconceptions: {
    "update-before-gradient": "Thinks weights can be updated before the gradients are computed, or that the order doesn't matter.",
    "train-loss-is-truth": "Trusts training loss alone, ignoring how the model does on new data.",
  },
  steps: [
    {
      type: "motivate",
      title: "Putting it all together",
      body: "You know every piece: the forward pass, a loss from maximum likelihood, gradients from backprop, steps from gradient descent. Training is just looping them.",
      realWorld: { title: "Practising for an exam", body: "Do problems, check answers, see what went wrong, adjust. But if you only ever re-do the same problems, you memorise answers instead of learning. That's overfitting." },
    },
    {
      type: "truth",
      statement: "**One training step:** forward pass → loss → backward pass (gradients) → update every weight, $w \\leftarrow w - \\eta\\,\\partial L/\\partial w$. One pass over all the data is an **epoch**.",
      body: "In practice each step uses a *batch* of examples, not the whole dataset: that's stochastic gradient descent.",
    },
    {
      type: "truth",
      statement: "Always measure loss on **held-out validation data** too. If training loss keeps falling while validation loss rises, the model is **overfitting**.",
      body: "It's memorising the training set's noise instead of the pattern. Remedies: more data, a smaller model, regularisation, or stopping early.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tl-check-1",
        prompt: "Which order is one training step?",
        options: [
          { id: "a", text: "Forward, loss, backward, update", correct: true, why: "Each step needs the one before it." },
          { id: "b", text: "Update, forward, loss, backward", misconception: "update-before-gradient", why: "The update needs the gradient, which needs the loss." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tl-check-2",
        prompt: "Why must the backward pass come before the update?",
        options: [
          { id: "a", text: "The update uses the gradients the backward pass computes", correct: true, why: "w − η ∂L/∂w needs ∂L/∂w." },
          { id: "b", text: "It doesn't matter; it's convention", misconception: "update-before-gradient", why: "Without gradients there's nothing to step along." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tl-check-3",
        prompt: "Training loss keeps falling, but validation loss has started rising. What's happening?",
        options: [
          { id: "a", text: "Overfitting: it's memorising the training set", correct: true, why: "New data is getting worse." },
          { id: "b", text: "It's still improving; keep going", misconception: "train-loss-is-truth", why: "Training loss alone can't see memorisation." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tl-check-4",
        prompt: "Training loss is 0.001 and validation loss is 2.5. Is this a good model?",
        options: [
          { id: "a", text: "No: it fits the training data but fails on new data", correct: true, why: "The gap is the warning sign." },
          { id: "b", text: "Yes: the training loss is tiny", misconception: "train-loss-is-truth", why: "What matters is new data." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Every PyTorch training loop is: `optimizer.zero_grad()`, `loss = loss_fn(model(x), y)`, `loss.backward()`, `optimizer.step()`. Four lines, everything from this course inside them.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "tl-produce-1", prompt: "1,000 training examples, batch size 50. How many steps per epoch?", answer: 20, explain: "1000 / 50." },
        { kind: "number", id: "tl-produce-2", prompt: "A weight is 2 with gradient 0.4 and learning rate 0.5. Its value after the update?", answer: 1.8, explain: "2 − 0.5 × 0.4." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "tl-review-1", prompt: "10,000 examples, batch size 100. How many steps in 3 epochs?", answer: 300, explain: "100 steps per epoch × 3." },
  ],
};

const playground: ConceptNode = {
  id: "train-network",
  title: "Train a network",
  summary: "A hidden layer with a nonlinear activation lets a network bend its decision boundary to fit curved data.",
  deps: ["training-loop"],
  pos: { x: 4, y: 1 },
  glossary: [{ term: "decision boundary", meaning: "The line (or curve) where a classifier switches from one answer to the other." }],
  misconceptions: {
    "training-fixes-capacity": "Thinks training longer can fix a model that's too simple for the data.",
  },
  steps: [
    {
      type: "motivate",
      title: "Your turn",
      body: "Time to train a real neural network: forward pass, cross-entropy loss, backprop and gradient descent, all running live in your browser.",
      realWorld: { title: "The same thing, bigger", body: "Image classifiers and language models are trained with exactly this loop. They just have millions of points and billions of weights." },
    },
    {
      type: "explore",
      title: "Circle data",
      body: "Blue points are inside, orange points around. The background shows what the network currently predicts.",
      widget: { kind: "playground", dataset: "circle", hidden: 4, activation: "tanh" },
      task: "Press Train. How many steps until it reaches 100%? Now set hidden units to 1 and reset: can it still do it?",
    },
    {
      type: "explore",
      title: "XOR data",
      body: "Opposite corners share a colour. No single straight line separates them.",
      widget: { kind: "playground", dataset: "xor", hidden: 3, activation: "tanh" },
      task: "Train it. Then try a learning rate of 2: what happens to the loss curve?",
    },
    {
      type: "truth",
      statement: "A hidden layer with a nonlinear activation lets the network **bend** its decision boundary. More hidden units allow more bends.",
      body: "Too few units and it can't fit the shape, however long you train. Too many, on too little data, and it starts fitting the noise.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tn-check-1",
        prompt: "A network with no hidden layer can only draw a straight-line boundary. Can more training make it fit the circle data?",
        options: [
          { id: "a", text: "No: the model is too simple, not under-trained", correct: true, why: "No setting of its weights draws a circle." },
          { id: "b", text: "Yes, with enough steps", misconception: "training-fixes-capacity", why: "Training only searches the shapes the model can make." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "tn-check-2",
        prompt: "XOR can't be split by one straight line. What fixes it?",
        options: [
          { id: "a", text: "A hidden layer with a nonlinear activation", correct: true, why: "It lets the boundary bend." },
          { id: "b", text: "Training for longer", misconception: "training-fixes-capacity", why: "A straight-line model stays straight." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "This is the idea behind Google's TensorFlow Playground. Deep learning is this, scaled up: more layers, more units, more data, and the same four-line training loop.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "tn-produce-1", prompt: "How many parameters does a 2 → 8 → 1 network have?", answer: 33, explain: "2·8 + 8 = 24, then 8·1 + 1 = 9." },
        { kind: "number", id: "tn-produce-2", prompt: "2 inputs, 4 hidden units, 1 output. How many **weights** (not counting biases)?", answer: 12, explain: "2·4 + 4·1." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "tn-review-1", prompt: "Parameters in a 3 → 5 → 2 network?", answer: 32, explain: "3·5 + 5 = 20, then 5·2 + 2 = 12." },
  ],
};

export const unit7: Unit = {
  id: "nn-1",
  track: "Neural networks",
  title: "Neural Networks",
  blurb: "Everything together: neurons are dot products, layers are matrices, training is gradient descent on a likelihood.",
  nodes: [neuron, activation, layer, forwardPass, training, playground],
};
