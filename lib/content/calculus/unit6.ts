import type { ConceptNode, Unit } from "@/lib/content/types";

const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;

const derivative: ConceptNode = {
  id: "derivative",
  title: "Derivatives",
  summary: "f′(a) is the slope of the tangent at a: how fast f is changing right there.",
  deps: [],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "derivative", meaning: "f′(a): the slope of the curve exactly at a, the instantaneous rate of change." },
    { term: "tangent line", meaning: "The straight line that just touches the curve at one point, with the curve's slope there." },
  ],
  misconceptions: {
    "derivative-is-value": "Confuses the derivative (how fast f changes) with the value of f.",
  },
  steps: [
    {
      type: "motivate",
      title: "Speed right now",
      body: "Drive 120 km in 2 hours: average speed 60 km/h. But the speedometer shows your speed **at this instant**. Average over zero time? That's what a derivative makes precise.",
      realWorld: { title: "The speedometer", body: "It measures distance changed over a tiny slice of time, over and over. The tinier the slice, the closer to \"speed right now\"." },
    },
    {
      type: "explore",
      title: "Shrink the gap",
      body: "The yellow line passes through the curve at $a$ and at $a + h$. Its slope is the average rate of change over that gap.",
      widget: { kind: "tangent", fn: "square", a: 1 },
      task: "Shrink h towards 0. What number does the slope settle on at a = 1? Try a = 2.",
    },
    {
      type: "truth",
      statement: "The **derivative** $f'(a) = \\displaystyle\\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$: the slope of the tangent line at $a$.",
      body: "Positive: f is increasing there. Negative: decreasing. Zero: flat (a peak, a valley, or a pause). For $f(x) = x^2$ the secant slope is $2a + h$, which heads to $2a$.",
    },
    {
      type: "predict",
      misconception: "derivative-is-value",
      item: {
        kind: "mc",
        id: "der-predict-1",
        prompt: "f(x) = x². At x = 3, f(3) = 9. What is f′(3)?",
        options: [
          { id: "a", text: "6", correct: true, why: "f′(x) = 2x, so f′(3) = 6." },
          { id: "b", text: "9", misconception: "derivative-is-value", why: "9 is the height. The derivative is the slope." },
        ],
      },
      reveal: {
        body: "The tangent at 3 rises 6 units for each unit of x. The height 9 answers a different question: *where* the curve is, not how fast it's climbing.",
        widget: { kind: "tangent", fn: "square", a: 3 },
      },
      resolve: {
        kind: "mc",
        id: "der-resolve-1",
        prompt: "f′(a) measures:",
        options: [
          { id: "a", text: "How steeply f is changing at a", correct: true, why: "Rate of change." },
          { id: "b", text: "How big f is at a", misconception: "derivative-is-value", why: "That's f(a)." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "der-check-1",
        prompt: "A function is above zero but going down at x = 2. What is the sign of f′(2)?",
        options: [
          { id: "a", text: "Negative", correct: true, why: "Going down means negative slope, whatever the height." },
          { id: "b", text: "Positive, because f is above zero", misconception: "derivative-is-value", why: "The sign of f′ follows the direction of change, not the height." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Training keeps asking: if I nudge this weight up a little, does the loss go up or down, and how fast? That's the derivative of the loss with respect to the weight.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "der-produce-1",
          prompt: "For f(x) = x², the secant slope from 1 to 1 + h is 2 + h. What is f′(1)?",
          answer: 2,
          explain: "Let h go to 0: 2 + h → 2.",
        },
        { kind: "number", id: "der-produce-2", prompt: "f(x) = 5x + 3 is a straight line. What is f′(x)?", answer: 5, explain: "A line has the same slope everywhere: 5." },
      ],
    },
  ],
  review: [
    { kind: "number", id: "der-review-1", prompt: "f(x) = x². What is f′(4)?", answer: 8, explain: "2 × 4." },
  ],
};

const rules: ConceptNode = {
  id: "derivative-rules",
  title: "Derivative rules",
  summary: "Power rule (xⁿ)′ = n·xⁿ⁻¹; constants factor out; sums split; constant terms vanish.",
  deps: ["derivative"],
  pos: { x: 1, y: 1 },
  glossary: [{ term: "power rule", meaning: "The derivative of xⁿ is n·xⁿ⁻¹." }],
  misconceptions: {
    "power-rule-drop": "Lowers the power but forgets to multiply by it: (x³)′ = x².",
    "power-keep-exponent": "Multiplies by the power but forgets to lower it: (x³)′ = 3x³.",
    "constant-not-zero": "Thinks a constant term survives differentiation.",
  },
  steps: [
    {
      type: "motivate",
      title: "No limits every time",
      body: "Computing a limit for every function would be exhausting. A handful of rules covers almost everything ML needs.",
      realWorld: { title: "Area of a growing square", body: "A square of side x has area x². Grow the side a bit and the area grows by about 2x times that bit: two thin strips along the edges. That's (x²)′ = 2x." },
    },
    {
      type: "truth",
      statement: "**Power rule:** $(x^n)' = n\\,x^{n-1}$. Constants factor out: $(c\\,f)' = c\\,f'$. Sums split: $(f + g)' = f' + g'$. Constants vanish: $(c)' = 0$.",
      body: "A constant term just shifts the curve up or down; it never changes the slope.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rules-check-1",
        prompt: "What is the derivative of x³?",
        options: [
          { id: "a", text: "3x²", correct: true, why: "Bring the 3 down, lower the power by one." },
          { id: "b", text: "x²", misconception: "power-rule-drop", why: "Multiply by the old power, 3." },
          { id: "c", text: "3x³", misconception: "power-keep-exponent", why: "The power drops to 2." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The squared-error loss for one prediction, $(w - 3)^2$, has derivative $2(w - 3)$. Every gradient you'll compute is built from rules like these.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**. Use * for multiply and ^ for powers.",
      items: [
        {
          kind: "expression",
          id: "rules-produce-1",
          prompt: "Differentiate $3x^2 + 2x + 7$.",
          forms: [
            { value: "6x + 9", status: "wrong", misconception: "constant-not-zero", message: "The 7 is a constant: its derivative is 0." },
            { value: "6x + 2", status: "correct" },
          ],
          explain: "$6x + 2$: the constant 7 vanishes.",
        },
        {
          kind: "expression",
          id: "rules-produce-2",
          prompt: "Differentiate $x^5$.",
          forms: [
            { value: "x^4", status: "wrong", misconception: "power-rule-drop", message: "Multiply by the old power, 5." },
            { value: "5x^5", status: "wrong", misconception: "power-keep-exponent", message: "Lower the power to 4." },
            { value: "5x^4", status: "correct" },
          ],
          explain: "$5x^4$.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "expression",
      id: "rules-review-1",
      prompt: "Differentiate $4x^3 - x$.",
      forms: [{ value: "12x^2 - 1", status: "correct" }],
      explain: "$12x^2 - 1$.",
    },
  ],
};

const chain: ConceptNode = {
  id: "chain-rule",
  title: "The chain rule",
  summary: "(f(g(x)))′ = f′(g(x))·g′(x): rates of change multiply along a chain.",
  deps: ["derivative-rules"],
  pos: { x: 2, y: 0 },
  glossary: [{ term: "chain rule", meaning: "The derivative of a function inside a function: outer derivative times inner derivative." }],
  misconceptions: {
    "forget-inner": "Differentiates the outer function and forgets to multiply by the inner function's derivative.",
  },
  steps: [
    {
      type: "motivate",
      title: "Rates multiply",
      body: "Gear A turns 3× as fast as gear B, and B turns 2× as fast as C. How fast does A turn compared with C? 6×. Rates of change along a chain multiply.",
      realWorld: { title: "Unit conversions", body: "Litres per kilometre × kilometres per hour = litres per hour. The chain rule is the same bookkeeping." },
    },
    {
      type: "truth",
      statement: "**Chain rule:** $\\big(f(g(x))\\big)' = f'(g(x))\\cdot g'(x)$.",
      body: "Differentiate the outer function, leaving the inside alone; then multiply by the derivative of the inside.",
    },
    {
      type: "predict",
      misconception: "forget-inner",
      item: {
        kind: "mc",
        id: "chain-predict-1",
        prompt: "What is the derivative of $(3x + 1)^2$?",
        options: [
          { id: "a", text: "6(3x + 1)", correct: true, why: "2(3x + 1) from the outer square, times 3 from the inside." },
          { id: "b", text: "2(3x + 1)", misconception: "forget-inner", why: "The inside, 3x + 1, changes 3× as fast as x." },
        ],
      },
      reveal: {
        body: "At x = 0 the tangent slope is 6, not 2: the curve climbs three times faster than (stuff)² would, because the stuff inside changes 3× as fast as x.",
        widget: { kind: "tangent", fn: "chain", a: 0 },
      },
      resolve: {
        kind: "mc",
        id: "chain-resolve-1",
        prompt: "The chain rule needs:",
        options: [
          { id: "a", text: "The outer derivative times the inner function's derivative", correct: true, why: "Both rates multiply." },
          { id: "b", text: "Only the outer derivative", misconception: "forget-inner", why: "The widget showed the slope is 3× bigger." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "chain-check-1",
        prompt: "What is the derivative of $(x^2)^3$?",
        options: [
          { id: "a", text: "6x⁵", correct: true, why: "3(x²)² · 2x = 6x⁵. (Check: (x²)³ = x⁶, whose derivative is 6x⁵.)" },
          { id: "b", text: "3(x²)²", misconception: "forget-inner", why: "Multiply by the inner derivative 2x." },
          { id: "c", text: "6x", why: "The power of the outside still matters." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A neural network is a long chain: input → layer 1 → layer 2 → … → loss. The chain rule says the loss's sensitivity to an early weight is the product of every layer's local rate along the way. That's backpropagation.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "expression",
          id: "chain-produce-1",
          prompt: "Differentiate $(2x + 5)^3$.",
          forms: [
            { value: "3(2x + 5)^2", status: "wrong", misconception: "forget-inner", message: "Multiply by the inside's derivative, 2." },
            { value: "6(2x + 5)^2", status: "correct" },
          ],
          explain: "$3(2x+5)^2 \\cdot 2 = 6(2x+5)^2$.",
        },
        {
          kind: "number",
          id: "chain-produce-2",
          prompt: "h(x) = f(g(x)). You know g(1) = 2, g′(1) = 3 and f′(2) = 4. What is h′(1)?",
          answer: 12,
          explain: "f′(g(1)) · g′(1) = f′(2) · 3 = 4 · 3.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "chain-review-1", prompt: "What is the derivative of (x² + 1)² at x = 1?", answer: 8, explain: "2(x² + 1) · 2x = 2 · 2 · 2." },
  ],
};

const gradient: ConceptNode = {
  id: "gradient",
  title: "Partial derivatives & the gradient",
  summary: "∂f/∂x holds the other inputs fixed; the gradient ∇f collects them and points steepest uphill.",
  deps: ["derivative-rules", "vector"],
  pos: { x: 2, y: 2 },
  glossary: [
    { term: "partial derivative", meaning: "∂f/∂x: the derivative with respect to one input, treating the others as constants." },
    { term: "gradient", meaning: "∇f: the vector of all partial derivatives. Points in the direction of steepest increase." },
  ],
  misconceptions: {
    "gradient-downhill": "Thinks the gradient points downhill.",
    "partial-wrong-var": "Differentiates with respect to the wrong variable.",
    "drop-other-vars": "Treats the other variables as zero instead of as constants.",
  },
  steps: [
    {
      type: "motivate",
      title: "Many inputs at once",
      body: "A loss depends on millions of weights. We need the slope in every direction at once.",
      realWorld: { title: "Hiking in fog", body: "You can't see the summit, but you can feel the ground: which way is steepest right where you stand? That direction is the gradient." },
    },
    {
      type: "truth",
      statement: "The **partial derivative** $\\dfrac{\\partial f}{\\partial x}$ is the derivative with respect to $x$, treating every other input as a constant.",
      body: "For $f(x, y) = x^2y$: treat $y$ as a fixed number, so $\\partial f/\\partial x = 2xy$. Treat $x$ as fixed: $\\partial f/\\partial y = x^2$.",
    },
    {
      type: "truth",
      statement: `The **gradient** $\\nabla f = ${v("\\partial f/\\partial x", "\\partial f/\\partial y")}$ points in the direction of steepest increase. Its length is how steep.`,
      body: "It's a vector (from the very first lesson), so everything about vectors applies: scale it, add it, step along it.",
    },
    {
      type: "explore",
      title: "Feel the slope",
      body: "A bowl seen from above.",
      widget: { kind: "gradient2d", start: [2, 1] },
      task: "Drag the point around. Which way does the yellow arrow point compared with the rings? How long is it near the bottom?",
    },
    {
      type: "predict",
      misconception: "gradient-downhill",
      item: {
        kind: "mc",
        id: "grad-predict-1",
        prompt: "Which way does ∇f point?",
        options: [
          { id: "a", text: "Steepest uphill", correct: true, why: "It's the direction of fastest increase." },
          { id: "b", text: "Steepest downhill", misconception: "gradient-downhill", why: "Downhill is −∇f." },
        ],
      },
      reveal: {
        body: "Every arrow points away from the bottom of the bowl, across the rings: uphill. To go down, step along −∇f, the red arrow.",
        widget: { kind: "gradient2d", start: [-1.5, 1.5] },
      },
      resolve: {
        kind: "mc",
        id: "grad-resolve-1",
        prompt: "To decrease f as fast as possible, move along:",
        options: [
          { id: "a", text: "−∇f", correct: true, why: "Opposite the steepest climb." },
          { id: "b", text: "∇f", misconception: "gradient-downhill", why: "That climbs." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "grad-check-1",
        prompt: "f(x, y) = x²y. What is ∂f/∂x?",
        options: [
          { id: "a", text: "2xy", correct: true, why: "y is a constant multiplier." },
          { id: "b", text: "x²", misconception: "partial-wrong-var", why: "That's ∂f/∂y." },
          { id: "c", text: "2x", misconception: "drop-other-vars", why: "y doesn't vanish; it stays as a constant factor." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model with a million weights has a million-entry gradient: one partial derivative per weight, all computed together on every training step.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "grad-produce-1",
          prompt: "f(x, y) = x² + 2y². Compute ∇f at (1, 1).",
          answer: [2, 4],
          explain: `$\\nabla f = ${v("2x", "4y")} = ${v(2, 4)}$.`,
        },
        {
          kind: "expression",
          id: "grad-produce-2",
          prompt: "f(x, y) = 3xy + y². Write ∂f/∂y.",
          forms: [
            { value: "2y", status: "wrong", misconception: "drop-other-vars", message: "x is a constant here, not zero: 3xy contributes 3x." },
            { value: "3y + 2y", status: "wrong", misconception: "partial-wrong-var", message: "3y would be the x-derivative of 3xy." },
            { value: "3x + 2y", status: "correct" },
          ],
          explain: "$3x + 2y$.",
        },
      ],
    },
  ],
  review: [
    { kind: "vector", id: "grad-review-1", prompt: "f(x, y) = 3x + y². Compute ∇f at (2, 1).", answer: [3, 2], explain: `$${v(3, "2y")} = ${v(3, 2)}$.` },
  ],
};

const descent: ConceptNode = {
  id: "gradient-descent",
  title: "Gradient descent",
  summary: "Repeat θ ← θ − η∇L: small steps downhill. The learning rate η decides the step size.",
  deps: ["gradient", "loss-functions"],
  pos: { x: 3, y: 1 },
  glossary: [{ term: "learning rate", meaning: "η: how big a step gradient descent takes each time." }],
  misconceptions: {
    "bigger-lr-faster": "Thinks a bigger learning rate always trains faster.",
    "plus-gradient": "Adds the gradient instead of subtracting it.",
  },
  steps: [
    {
      type: "motivate",
      title: "Walking downhill in fog",
      body: "We can't solve for the best weights directly in a big model. But we can always feel which way is downhill and take a step.",
      realWorld: { title: "Tuning by feel", body: "Adjusting a shower: too cold, turn it a bit; still too cold, a bit more. Too big a twist and you overshoot to scalding. That's gradient descent, with the learning rate as your twist size." },
    },
    {
      type: "truth",
      statement: "**Gradient descent:** repeat $\\theta \\leftarrow \\theta - \\eta\\,\\nabla L(\\theta)$.",
      body: "Subtract because ∇L points uphill. Near the bottom the gradient shrinks, so the steps shrink on their own.",
    },
    {
      type: "explore",
      title: "Take steps",
      body: "A loss with its minimum at w = 3.",
      widget: { kind: "descent", eta: 0.1, start: -1 },
      task: "Step with η = 0.1. Then try 0.5, 0.9 and 1.05. Which reaches 3 fastest? Which never does?",
    },
    {
      type: "predict",
      misconception: "bigger-lr-faster",
      item: {
        kind: "mc",
        id: "gd-predict-1",
        prompt: "Use learning rate 1.05 instead of 0.3. Will it reach the minimum faster?",
        options: [
          { id: "a", text: "No: it overshoots further each step and blows up", correct: true, why: "Each step lands on the far side, further out." },
          { id: "b", text: "Yes: bigger steps means getting there sooner", misconception: "bigger-lr-faster", why: "Only up to a point." },
        ],
      },
      reveal: {
        body: "Each step jumps past w = 3 and lands further away than it started: the distance to the minimum gets multiplied by 1.1 every step. Too large a learning rate diverges.",
        widget: { kind: "descent", eta: 1.05, start: 2 },
      },
      resolve: {
        kind: "mc",
        id: "gd-resolve-1",
        prompt: "A learning rate that's too big:",
        options: [
          { id: "a", text: "Overshoots the minimum and can diverge", correct: true, why: "As the widget showed." },
          { id: "b", text: "Always just speeds things up", misconception: "bigger-lr-faster", why: "Past a point it stops converging." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "gd-check-1",
        prompt: "L(w) = w². You're at w = 4 with η = 0.25. Where does one step take you?",
        options: [
          { id: "a", text: "w = 2", correct: true, why: "L′(4) = 8; 4 − 0.25 × 8 = 2." },
          { id: "b", text: "w = 6", misconception: "plus-gradient", why: "That stepped uphill. Subtract the gradient." },
          { id: "c", text: "w = 3.75", why: "Multiply η by the gradient, not by 1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Every training loop is this: compute the loss on a batch, get its gradient, step. SGD, momentum and Adam are refinements of the same update. Picking η is one of the most important choices in training.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        { kind: "number", id: "gd-produce-1", prompt: "L(w) = (w − 3)². At w = 5 with η = 0.1, where does one step go?", answer: 4.6, explain: "L′(5) = 2(5 − 3) = 4; 5 − 0.1 × 4 = 4.6." },
        {
          kind: "vector",
          id: "gd-produce-2",
          prompt: "L(x, y) = x² + y². From (2, −4) with η = 0.25, where does one step go?",
          answer: [1, -2],
          explain: `$\\nabla L = ${v(4, -8)}$, so $${v(2, -4)} - 0.25${v(4, -8)} = ${v(1, -2)}$.`,
          traps: [{ answer: [3, -6], misconception: "plus-gradient", message: "That stepped uphill: subtract η∇L." }],
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "gd-review-1", prompt: "L(w) = w². At w = −2 with η = 0.5, where does one step go?", answer: 0, explain: "L′(−2) = −4; −2 − 0.5 × (−4) = 0." },
  ],
};

const backprop: ConceptNode = {
  id: "backprop",
  title: "Backpropagation",
  summary: "Run the chain rule backwards through the model, from the loss, reusing each step's derivative.",
  deps: ["chain-rule", "gradient-descent"],
  pos: { x: 4, y: 1 },
  glossary: [{ term: "backpropagation", meaning: "Computing every weight's gradient by applying the chain rule from the loss backwards through the model." }],
  misconceptions: {
    "forward-gradients": "Thinks gradients are computed from the inputs forwards, or that the direction doesn't matter.",
  },
  steps: [
    {
      type: "motivate",
      title: "Millions of weights, one loss",
      body: "Gradient descent needs ∂L/∂w for **every** weight. Nudging each weight separately and re-running the model would take forever.",
      realWorld: { title: "Blame assignment", body: "A project ran late. Work backwards from the deadline: which step delayed which, and by how much? Each step's share of the blame passes back to the steps before it." },
    },
    {
      type: "truth",
      statement: "Write the model as a chain of simple steps. **Backprop** runs the chain rule from the loss backwards, multiplying in each step's local derivative and reusing what's already computed.",
      body: "One forward pass computes the values; one backward pass computes every gradient. That reuse is why it's fast.",
    },
    {
      type: "truth",
      statement: "Example: $\\hat y = w x$ and $L = (\\hat y - y)^2$. Then $\\dfrac{\\partial L}{\\partial w} = \\dfrac{\\partial L}{\\partial \\hat y}\\cdot\\dfrac{\\partial \\hat y}{\\partial w} = 2(\\hat y - y)\\cdot x$.",
      body: "Start at the loss: $\\partial L/\\partial\\hat y = 2(\\hat y - y)$. Step back one link: $\\partial\\hat y/\\partial w = x$. Multiply.",
    },
    { type: "connect", body: "*Chain rule* computes the gradient; *gradient descent* uses it. Backprop is just the efficient order to do the first." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bp-check-1",
        prompt: "In backpropagation, the derivatives are computed:",
        options: [
          { id: "a", text: "From the loss backwards towards the inputs", correct: true, why: "Hence the name." },
          { id: "b", text: "From the inputs forwards to the loss", misconception: "forward-gradients", why: "The values go forwards; the gradients come back." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "bp-check-2",
        prompt: "Why go backwards?",
        options: [
          { id: "a", text: "Each layer's gradient reuses the ones after it, so one pass gives them all", correct: true, why: "Shared work is done once." },
          { id: "b", text: "It doesn't matter; it's just a convention", misconception: "forward-gradients", why: "Forwards, you'd redo the shared work for every weight." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "PyTorch's `loss.backward()` is exactly this. *Autograd* records each operation during the forward pass, then runs the chain rule backwards through that record.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**. Model: $\\hat y = wx$, loss $L = (\\hat y - y)^2$.",
      items: [
        {
          kind: "number",
          id: "bp-produce-1",
          prompt: "x = 2, y = 10, w = 3 (so ŷ = 6). What is ∂L/∂w?",
          answer: -16,
          explain: "2(ŷ − y) · x = 2(6 − 10) · 2 = −16. Negative: increasing w lowers the loss.",
        },
        {
          kind: "number",
          id: "bp-produce-2",
          prompt: "Same numbers. Take one gradient-descent step with η = 0.05. What is the new w?",
          answer: 3.8,
          explain: "3 − 0.05 × (−16) = 3.8. Closer to the ideal w = 5.",
        },
        {
          kind: "number",
          id: "bp-produce-3",
          prompt: "Two layers: h = w₁x, ŷ = w₂h, L = (ŷ − y)². With x = 1, w₁ = 2, w₂ = 3, y = 5, what is ∂L/∂w₁?",
          answer: 6,
          explain: "h = 2, ŷ = 6, ∂L/∂ŷ = 2(6 − 5) = 2. Back through ŷ = w₂h: ∂ŷ/∂h = w₂ = 3. Back through h = w₁x: ∂h/∂w₁ = x = 1. So 2 · 3 · 1 = 6.",
        },
      ],
    },
  ],
  review: [
    { kind: "number", id: "bp-review-1", prompt: "ŷ = wx, L = (ŷ − y)², x = 1, y = 3, w = 1. What is ∂L/∂w?", answer: -4, explain: "2(1 − 3) · 1." },
  ],
};

export const unit6: Unit = {
  id: "calc-1",
  track: "Calculus",
  title: "Calculus for ML",
  blurb: "Slopes, gradients, and how a model walks downhill on its loss: the engine of training.",
  nodes: [derivative, rules, chain, gradient, descent, backprop],
};
