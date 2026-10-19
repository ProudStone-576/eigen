import type { ConceptNode, Unit } from "@/lib/content/types";
import { deepen } from "../deepen";
import { UNIT1_DEPTH } from "./unit1.depth";

// LaTeX helpers. Column vector and 2x2 matrix.
const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;
const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;
const I = "\\hat\\imath";
const J = "\\hat\\jmath";

const vector: ConceptNode = {
  id: "vector",
  title: "Vectors are movements",
  summary: "A vector is an ordered list of numbers: how far to move along each direction.",
  deps: [],
  pos: { x: 0, y: 1 },
  glossary: [
    { term: "vector", meaning: "An ordered list of numbers. In 2D: how far right/left, then how far up/down." },
    { term: "component", meaning: "One number inside a vector." },
  ],
  misconceptions: {
    "sign-direction": "Thinks a negative component still points right or up.",
    "order-swap": "Reads the components in the wrong order (vertical first).",
    "point-only": "Thinks a vector is one fixed spot, not a movement that can start anywhere.",
  },
  steps: [
    {
      type: "motivate",
      title: "One number isn't enough",
      body: "You're programming a delivery robot. \"Move 3\" is useless: 3 which way? On a flat map you need **two** numbers, one for each direction. That pair is a vector.",
      realWorld: {
        title: "Every video game, every frame",
        body: "A character's motion each frame is a vector: how far along x, how far along y. Speed boosts, knockback and gravity are all vectors added to it.",
      },
    },
    {
      type: "explore",
      title: "Drag the arrow",
      body: "The arrow starts at the origin. Its two numbers update as you drag the tip.",
      widget: { kind: "vector", start: [3, 2] },
      task: `Make the arrow read $${v(-2, 3)}$. Which way did the tip go for the $-2$?`,
    },
    {
      type: "truth",
      statement: `A 2D vector $${v("x", "y")}$ means: move $x$ horizontally, then $y$ vertically.`,
      body: "Positive is right/up, negative is left/down. The order is fixed: first number horizontal, second vertical.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "vector-check-1",
        prompt: `Which movement does $${v(-2, 3)}$ describe?`,
        options: [
          { id: "a", text: "2 left, 3 up", correct: true, why: "First number horizontal, negative means left. Second vertical, positive means up." },
          { id: "b", text: "2 right, 3 up", misconception: "sign-direction", why: "The minus sign flips direction: −2 is 2 to the left." },
          { id: "c", text: "3 left, 2 up", misconception: "order-swap", why: "The first number is always the horizontal one." },
          { id: "d", text: "3 right, 2 down", why: "This swaps the order and flips both signs." },
        ],
      },
    },
    {
      type: "predict",
      misconception: "point-only",
      item: {
        kind: "mc",
        id: "vector-predict-1",
        prompt: "Arrow A goes from (0, 0) to (3, 2). Arrow B goes from (1, 1) to (4, 3). Same vector or different vectors?",
        options: [
          { id: "a", text: "The same vector", correct: true, why: "Both move 3 right and 2 up." },
          { id: "b", text: "Different vectors", misconception: "point-only", why: "They start in different places, but the movement is identical." },
        ],
      },
      reveal: {
        body: `Both say "move 3 right, 2 up": both are $${v(3, 2)}$. A vector records the movement, not where it starts.`,
        widget: { kind: "vector", start: [3, 2] },
      },
      resolve: {
        kind: "mc",
        id: "vector-resolve-1",
        prompt: "So what does a vector pin down?",
        options: [
          { id: "a", text: "How far and which way to move", correct: true, why: "That's all a vector holds. Where it starts is a separate choice." },
          { id: "b", text: "One fixed spot on the grid", misconception: "point-only", why: "Two arrows in different places can be the same vector." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Every data point is a vector. A house might be $[\\text{size}, \\text{bedrooms}, \\text{age}]$. The arrows here build the picture; ML just uses longer lists.",
    },
    {
      type: "produce",
      body: "No hints this time. Get it right and this concept turns **solid**.",
      items: [
        {
          kind: "vector",
          id: "vector-produce-1",
          prompt: "A robot drives 4 blocks **west** and 1 block **south**. East and north are positive. Write its movement as a vector.",
          answer: [-4, -1],
          explain: `West is negative horizontal, south is negative vertical: $${v(-4, -1)}$.`,
          traps: [
            { answer: [4, 1], misconception: "sign-direction", message: "West and south are the negative directions." },
            { answer: [-1, -4], misconception: "order-swap", message: "Horizontal first, then vertical." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "vector-review-1",
      prompt: "A drone moves 5 right and 2 down. Write the vector.",
      answer: [5, -2],
      explain: `Right is $+5$, down is $-2$: $${v(5, -2)}$.`,
    },
    {
      kind: "mc",
      id: "vector-review-2",
      prompt: `Which movement does $${v(0, -4)}$ describe?`,
      options: [
        { id: "a", text: "4 down", correct: true, why: "No horizontal movement, then 4 in the negative vertical direction." },
        { id: "b", text: "4 left", misconception: "order-swap", why: "The second number is vertical." },
        { id: "c", text: "4 up", misconception: "sign-direction", why: "Negative vertical is down." },
      ],
    },
  ],
};

const vectorAdd: ConceptNode = {
  id: "vector-add",
  title: "Adding vectors",
  summary: "Adding vectors = doing one movement, then the other: add matching components.",
  deps: ["vector"],
  pos: { x: 1, y: 0 },
  glossary: [{ term: "tip-to-tail", meaning: "Drawing the second arrow starting where the first one ends." }],
  misconceptions: {
    "multiply-components": "Multiplies matching components instead of adding them.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two moves in a row",
      body: `Walk $${v(3, 1)}$, then walk $${v(1, 2)}$. Where do you end up? One vector should describe the whole trip.`,
      realWorld: {
        title: "A plane in the wind",
        body: `A plane flies at $${v(300, 0)}$ km/h. A crosswind pushes it $${v(0, 40)}$ km/h. Its real motion over the ground is the sum of the two.`,
      },
    },
    {
      type: "explore",
      title: "Tip to tail",
      body: "Drag either arrow. The green arrow is the total trip.",
      widget: { kind: "vector-add", a: [3, 1], b: [1, 2] },
      task: "Watch the green total: it always runs from the start of the first arrow to the tip of the second.",
    },
    {
      type: "truth",
      statement: `To add vectors, add matching components: $${v("a", "b")} + ${v("c", "d")} = ${v("a+c", "b+d")}$.`,
      body: "Why? The horizontal moves pile up on their own, and so do the vertical ones. They never mix.",
    },
    { type: "connect", body: "This rests on *a vector is a movement*. Adding is just doing one movement after the other." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "vector-add-check-1",
        prompt: `What is $${v(1, 2)} + ${v(3, -1)}$?`,
        options: [
          { id: "a", text: `$${v(4, 1)}$`, correct: true, why: "1 + 3 = 4 and 2 + (−1) = 1." },
          { id: "b", text: `$${v(3, -2)}$`, misconception: "multiply-components", why: "That multiplies the components. Adding movements adds them." },
          { id: "c", text: `$${v(4, 3)}$`, why: "The −1 was read as +1." },
          { id: "d", text: `$${v(-2, 3)}$`, why: "That subtracts the first vector from the second." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A model's settings (its *parameters*) form one long vector. Every training step adds a small step-vector to it. Training is millions of vector additions.",
    },
    {
      type: "produce",
      body: "Unaided. Get it right and this turns **solid**.",
      items: [
        {
          kind: "vector",
          id: "vector-add-produce-1",
          prompt: `Compute $${v(2, -3)} + ${v(-5, 4)}$.`,
          answer: [-3, 1],
          explain: "2 + (−5) = −3, and −3 + 4 = 1.",
          traps: [{ answer: [-10, -12], misconception: "multiply-components", message: "That multiplies the components. Add them." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "vector-add-review-1",
      prompt: `Compute $${v(-1, 4)} + ${v(6, -2)}$.`,
      answer: [5, 2],
      explain: "−1 + 6 = 5, and 4 + (−2) = 2.",
    },
  ],
};

const scalar: ConceptNode = {
  id: "scalar",
  title: "Scaling vectors",
  summary: "Multiplying by a number stretches the arrow; a negative number also flips it.",
  deps: ["vector"],
  pos: { x: 1, y: 2 },
  glossary: [{ term: "scalar", meaning: "A plain number (not a vector) used to stretch or shrink a vector." }],
  misconceptions: {
    "negative-shrinks": "Thinks a negative scalar shrinks the vector instead of flipping it.",
    "scale-one-component": "Scales only one component.",
  },
  steps: [
    {
      type: "motivate",
      title: "Same direction, different size",
      body: `One batch of a recipe is $${v("2 \\text{ cups flour}", "1 \\text{ cup sugar}")}$. Three batches? You triple **every** ingredient, not just one.`,
      realWorld: { title: "Zooming a map", body: "Zoom in 2× and every distance on screen doubles by the same factor. That's scaling." },
    },
    {
      type: "explore",
      title: "Turn the dial",
      body: "Slide $k$ and watch $k$ times the vector.",
      widget: { kind: "scale", v: [2, 1], k: 1.5 },
      task: "Slide $k$ from 2 down to −2. What happens at exactly 0? What changes when $k$ goes negative?",
    },
    {
      type: "truth",
      statement: `$k\\,${v("x", "y")} = ${v("kx", "ky")}$. It stretches the arrow by $|k|$; if $k < 0$ it also points the opposite way.`,
      body: "The size of $k$ and the sign of $k$ do two separate jobs.",
    },
    {
      type: "predict",
      misconception: "negative-shrinks",
      item: {
        kind: "mc",
        id: "scalar-predict-1",
        prompt: `What does $-2\\,${v(1, 1)}$ look like compared with $${v(1, 1)}$?`,
        options: [
          { id: "a", text: "Twice as long, pointing the opposite way", correct: true, why: "The 2 stretches, the minus flips." },
          { id: "b", text: "Half as long, pointing the same way", misconception: "negative-shrinks", why: "A negative scalar flips the arrow. Its size, 2, still doubles the length." },
          { id: "c", text: "The same length, pointing the opposite way", why: "That would be −1. Here the size is 2." },
        ],
      },
      reveal: {
        body: `It's $${v(-2, -2)}$: twice as long and flipped.`,
        widget: { kind: "scale", v: [1, 1], k: -2 },
      },
      resolve: {
        kind: "mc",
        id: "scalar-resolve-1",
        prompt: "What does the sign of a scalar control?",
        options: [
          { id: "a", text: "Which way the arrow points", correct: true, why: "Sign flips direction. Size changes length." },
          { id: "b", text: "How long the arrow is", misconception: "negative-shrinks", why: "Length comes from the size of the number, not its sign." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "scalar-check-1",
        prompt: `What is $3\\,${v(2, -1)}$?`,
        options: [
          { id: "a", text: `$${v(6, -3)}$`, correct: true, why: "Both components times 3." },
          { id: "b", text: `$${v(6, -1)}$`, misconception: "scale-one-component", why: "Every component gets multiplied, not just the first." },
          { id: "c", text: `$${v(5, 2)}$`, why: "That adds 3 instead of multiplying." },
          { id: "d", text: `$${v(-6, 3)}$`, why: "The 3 is positive, so the direction doesn't flip." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The **learning rate** is a scalar. Each training step is learning rate × gradient: the scalar decides how big a step the model takes.",
    },
    {
      type: "produce",
      body: "Unaided. Get it right and this turns **solid**.",
      items: [
        {
          kind: "vector",
          id: "scalar-produce-1",
          prompt: `Compute $-\\tfrac{1}{2}\\,${v(4, -6)}$.`,
          answer: [-2, 3],
          explain: "Halve each component and flip each sign.",
          traps: [
            { answer: [2, -3], misconception: "negative-shrinks", message: "The minus sign flips the direction too." },
            { answer: [-2, -6], misconception: "scale-one-component", message: "Scale both components." },
          ],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "scalar-review-1",
      prompt: `Compute $4\\,${v(-1, 0.5)}$.`,
      answer: [-4, 2],
      explain: "4 × (−1) = −4 and 4 × 0.5 = 2.",
    },
  ],
};

const linearCombination: ConceptNode = {
  id: "linear-combination",
  title: "Linear combinations",
  summary: "Scale each vector, then add: av + bw.",
  deps: ["vector-add", "scalar"],
  pos: { x: 2, y: 1 },
  glossary: [{ term: "linear combination", meaning: "Scaling some vectors and adding the results." }],
  misconceptions: {
    "add-before-scale": "Adds the vectors first and scales the sum by both numbers together.",
  },
  steps: [
    {
      type: "motivate",
      title: "Mixing ingredients",
      body: "You can now scale a vector and add vectors. Use both at once: $a\\vec v + b\\vec w$. Which points can you reach by choosing $a$ and $b$?",
      realWorld: {
        title: "Every pixel on your screen",
        body: "Each pixel mixes red, green and blue light in different amounts. A colour is a linear combination of three colour vectors.",
      },
    },
    {
      type: "explore",
      title: "Mix two arrows",
      body: "Set the two dials $a$ and $b$. The yellow arrow is $a\\vec v + b\\vec w$.",
      widget: { kind: "combo", v: [2, 1], w: [-1, 1], a: 0.5, b: 0.5 },
      task: `Find $a$ and $b$ that put the yellow tip exactly on $${v(1, 2)}$.`,
    },
    {
      type: "truth",
      statement: "A linear combination of $\\vec v$ and $\\vec w$ is $a\\vec v + b\\vec w$: scale each one, then add.",
      body: "Nothing new. It's the last two concepts used together.",
    },
    { type: "connect", body: "Scaling came from *Scaling vectors*, adding from *Adding vectors*. A linear combination is both, one after the other." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "lc-check-1",
        prompt: `What is $2${v(1, 0)} + 3${v(0, 1)}$?`,
        options: [
          { id: "a", text: `$${v(2, 3)}$`, correct: true, why: `$${v(2, 0)} + ${v(0, 3)}$.` },
          { id: "b", text: `$${v(5, 5)}$`, misconception: "add-before-scale", why: "Each number scales its own vector before adding." },
          { id: "c", text: `$${v(3, 2)}$`, why: "The 2 belongs to the first vector, the horizontal one." },
          { id: "d", text: `$${v(6, 0)}$`, why: "That multiplies 2 by 3. The two scaled vectors should be added." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A linear model's prediction is a linear combination: price $= w_1 \\cdot \\text{size} + w_2 \\cdot \\text{bedrooms}$. Training means finding the weights $w_1, w_2$.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "expression",
          id: "lc-produce-1",
          prompt: `Write the **first** component of $a${v(2, 1)} + b${v(-1, 1)}$ in terms of $a$ and $b$.`,
          forms: [
            { value: "2a + b", status: "wrong", message: "Check the sign: the second vector's first component is −1." },
            { value: "a + b", status: "wrong", message: "That's the second component. The first uses 2 and −1." },
            { value: "2a - b", status: "correct" },
          ],
          explain: "First components: $2a + (-1)b = 2a - b$.",
        },
        {
          kind: "vector",
          id: "lc-produce-2",
          prompt: `Compute $3${v(1, -1)} - 2${v(0, 2)}$.`,
          answer: [3, -7],
          explain: `$${v(3, -3)} - ${v(0, 4)} = ${v(3, -7)}$.`,
          traps: [{ answer: [1, 1], misconception: "add-before-scale", message: "Scale each vector by its own number first, then combine." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "lc-review-1",
      prompt: `Compute $-1${v(2, 3)} + 2${v(1, 1)}$.`,
      answer: [0, -1],
      explain: `$${v(-2, -3)} + ${v(2, 2)} = ${v(0, -1)}$.`,
    },
  ],
};

const basis: ConceptNode = {
  id: "basis",
  title: "Basis vectors",
  summary: "Every vector is xî + yĵ: coordinates are the weights on the basis.",
  deps: ["linear-combination"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "basis vectors", meaning: "The unit steps the coordinates count: î = one step right, ĵ = one step up." },
    { term: "coordinates", meaning: "The weights you put on each basis vector." },
  ],
  misconceptions: {
    "coords-not-weights": "Treats coordinates as fixed labels, not as weights on the basis vectors.",
  },
  steps: [
    {
      type: "motivate",
      title: "x of what?",
      body: `We've written $${v("x", "y")}$ all along. Hidden question: $x$ copies of **what**?`,
      realWorld: {
        title: "City blocks",
        body: "\"3 blocks east, 2 north\" only means something once everyone agrees how long one block is and which way east is.",
      },
    },
    {
      type: "explore",
      title: "The two unit steps",
      body: `Here $\\vec v = ${I}$ (one step right) and $\\vec w = ${J}$ (one step up).`,
      widget: { kind: "combo", v: [1, 0], w: [0, 1], a: 3, b: 2 },
      task: `Set $a$ and $b$ so the tip lands on $${v(-2, 4)}$. Notice: $a$ and $b$ **are** the coordinates.`,
    },
    {
      type: "truth",
      statement: `$${I} = ${v(1, 0)}$ and $${J} = ${v(0, 1)}$ are the basis vectors. Every 2D vector is $${v("x", "y")} = x${I} + y${J}$.`,
      body: "Coordinates are not labels stuck on a point. They are the weights in a linear combination of the basis.",
    },
    { type: "connect", body: "This is a linear combination where the two vectors happen to be the unit steps." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "basis-check-1",
        prompt: `$${v(5, -2)}$ equals which combination?`,
        options: [
          { id: "a", text: `$5${I} - 2${J}$`, correct: true, why: "5 steps right, 2 steps down." },
          { id: "b", text: `$-2${I} + 5${J}$`, why: "The first coordinate goes with î." },
          { id: "c", text: `$5${I} + 2${J}$`, why: "The second coordinate is −2." },
          { id: "d", text: `$7(${I} + ${J})$`, misconception: "coords-not-weights", why: "Each coordinate weights its own basis vector." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "In a dataset, each column (size, bedrooms, ...) is a basis direction, and a row's numbers are its weights on them. PCA, coming later, picks a **better** basis.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "basis-produce-1",
          prompt: `Which vector is $-3${I} + 0.5${J}$?`,
          answer: [-3, 0.5],
          explain: "The weights on î and ĵ are the coordinates.",
        },
        {
          kind: "vector",
          id: "basis-produce-2",
          prompt: `Use a different basis: $\\vec b_1 = ${v(1, 1)}$, $\\vec b_2 = ${v(1, -1)}$. A vector has weights 2 and 1 in this basis, so it is $2\\vec b_1 + 1\\vec b_2$. Write it in ordinary coordinates.`,
          answer: [3, 1],
          explain: `$2${v(1, 1)} + ${v(1, -1)} = ${v(3, 1)}$.`,
          traps: [{ answer: [2, 1], misconception: "coords-not-weights", message: "Those are the weights. Apply them to b₁ and b₂ and add." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "basis-review-1",
      prompt: `Which vector is $4${J} - ${I}$?`,
      answer: [-1, 4],
      explain: "−1 copy of î and 4 copies of ĵ.",
    },
  ],
};

const matrixTransform: ConceptNode = {
  id: "matrix-transform",
  title: "Matrices move the plane",
  summary: "A matrix records where î and ĵ land: first column for î, second column for ĵ.",
  deps: ["basis"],
  pos: { x: 4, y: 1 },
  glossary: [
    { term: "linear transformation", meaning: "A way of moving every point of the plane that keeps the origin still and keeps grid lines straight, parallel and evenly spaced." },
    { term: "matrix", meaning: "A grid of numbers. A 2×2 matrix's columns say where î and ĵ land." },
  ],
  misconceptions: {
    "rows-are-landings": "Reads where î lands from the first row instead of the first column.",
    "nonlinear-ok": "Thinks a linear transformation can curve grid lines or move the origin.",
  },
  steps: [
    {
      type: "motivate",
      title: "Moving the whole plane at once",
      body: "Rotate a photo, stretch a sprite, slant text into italics. Each moves **every** point of the plane. How can a few numbers describe infinitely many moves?",
      realWorld: { title: "Italic text", body: "Italics is a *shear*: the top of each letter slides right while the baseline stays put." },
    },
    {
      type: "truth",
      statement: "A linear transformation keeps the origin fixed and keeps grid lines straight, parallel and evenly spaced.",
      body: "That restriction is the whole point. It's what lets a few numbers describe the entire move.",
    },
    {
      type: "explore",
      title: "Drag î and ĵ",
      body: "Drag the green tip (where î lands) and the red tip (where ĵ lands). The whole grid follows.",
      widget: { kind: "transform", matrix: [[1, 1], [0, 1]] },
      task: "Make a rotation. Then make italics. Watch the matrix numbers as you go.",
    },
    {
      type: "truth",
      statement: `Where $${I}$ and $${J}$ land decides everything. A 2×2 matrix records it: **first column = where $${I}$ lands, second column = where $${J}$ lands.**`,
      body: `Every vector is $x${I} + y${J}$, and evenly spaced grid lines stay evenly spaced. So after the move it is $x(\\text{new } ${I}) + y(\\text{new } ${J})$.`,
    },
    {
      type: "predict",
      misconception: "rows-are-landings",
      item: {
        kind: "mc",
        id: "mt-predict-1",
        prompt: `For $${m(1, 2, 0, 1)}$, where does $${I}$ land?`,
        options: [
          { id: "a", text: `$${v(1, 0)}$`, correct: true, why: "The first column is (1, 0)." },
          { id: "b", text: `$${v(1, 2)}$`, misconception: "rows-are-landings", why: "That's the first row. Landing spots are columns." },
          { id: "c", text: `$${v(2, 1)}$`, why: "That's where ĵ lands, the second column." },
        ],
      },
      reveal: {
        body: `$${I}$ stays at $${v(1, 0)}$, the first **column**. $${J}$ moves to $${v(2, 1)}$, the second column. Each row mixes the two.`,
        widget: { kind: "transform", matrix: [[1, 2], [0, 1]], lockMatrix: true },
      },
      resolve: {
        kind: "mc",
        id: "mt-resolve-1",
        prompt: "In a matrix, where does î land?",
        options: [
          { id: "a", text: "Its first column", correct: true, why: "Columns are landing spots." },
          { id: "b", text: "Its first row", misconception: "rows-are-landings", why: "The grid above showed î at the first column." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mt-check-1",
        prompt: "Which of these can a linear transformation do?",
        options: [
          { id: "a", text: "Rotate the grid around the origin", correct: true, why: "The origin stays put and the lines stay straight and evenly spaced." },
          { id: "b", text: "Bend grid lines into curves", misconception: "nonlinear-ok", why: "Lines must stay straight." },
          { id: "c", text: "Shift the whole grid 2 to the right", misconception: "nonlinear-ok", why: "That moves the origin. (A shift is called a translation.)" },
          { id: "d", text: "Squeeze only the top half of the grid", misconception: "nonlinear-ok", why: "Grid lines would no longer be evenly spaced." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mt-check-2",
        prompt: "A move sends every point $(x, y)$ to $(x + 1, y)$: everything slides one step right. Is it a linear transformation?",
        options: [
          { id: "a", text: "No: it moves the origin", correct: true, why: "The origin lands on (1, 0). Linear transformations keep it fixed." },
          { id: "b", text: "Yes: grid lines stay straight and parallel", misconception: "nonlinear-ok", why: "Straight and parallel isn't enough. The origin must stay put too." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Image models are trained on photos that have been rotated, sheared and stretched by 2×2 matrices (*data augmentation*). That teaches the model a tilted cat is still a cat.",
    },
    {
      type: "produce",
      body: "Unaided. Get it right and this turns **solid**.",
      items: [
        {
          kind: "matrix",
          id: "mt-produce-1",
          prompt: `A 90° counter-clockwise rotation sends $${I} \\to ${v(0, 1)}$ and $${J} \\to ${v(-1, 0)}$. Write its matrix.`,
          answer: [[0, -1], [1, 0]],
          explain: `The columns are the landing spots: $${m(0, -1, 1, 0)}$.`,
          traps: [{ answer: [[0, 1], [-1, 0]], misconception: "rows-are-landings", message: "Those landing spots went in as rows. They belong in columns." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "matrix",
      id: "mt-review-1",
      prompt: "Write the matrix that stretches the plane 3× horizontally and leaves vertical alone.",
      answer: [[3, 0], [0, 1]],
      explain: `î lands on $${v(3, 0)}$, ĵ stays at $${v(0, 1)}$.`,
    },
  ],
};

const matrixVector: ConceptNode = {
  id: "matrix-vector",
  title: "Matrix × vector",
  summary: "Av = x·(first column) + y·(second column).",
  deps: ["matrix-transform", "linear-combination"],
  pos: { x: 5, y: 1 },
  glossary: [{ term: "matrix–vector product", meaning: "Where a vector lands after the matrix's transformation." }],
  misconceptions: {
    elementwise: "Multiplies matrix and vector entry by entry, ignoring the off-diagonal entries.",
    "column-row-mix": "Combines a row of the matrix where a column belongs.",
  },
  steps: [
    {
      type: "motivate",
      title: "Where does one vector go?",
      body: `We know where $${I}$ and $${J}$ land. Where does $${v(2, 3)}$ land?`,
      realWorld: {
        title: "3D graphics",
        body: "A game engine multiplies every corner of every 3D model by the camera's matrix, millions of times a second. That's how a scene gets drawn from your point of view.",
      },
    },
    {
      type: "explore",
      title: "Follow the yellow vector",
      body: "The yellow arrow is $\\vec v$ before and after the move.",
      widget: { kind: "transform", matrix: [[2, 1], [0, 3]], showVector: [1, 2] },
      task: "Read where the yellow vector lands. Then check it equals 1 × (first column) + 2 × (second column).",
    },
    {
      type: "truth",
      statement: `$${m("a", "b", "c", "d")}${v("x", "y")} = x${v("a", "c")} + y${v("b", "d")} = ${v("ax+by", "cx+dy")}$`,
      body: "Not a rule to memorise: it's $x$ copies of the new î plus $y$ copies of the new ĵ.",
    },
    { type: "connect", body: "*Matrices move the plane* says the columns are landing spots. *Linear combinations* says how to mix them." },
    {
      type: "predict",
      misconception: "elementwise",
      item: {
        kind: "mc",
        id: "mv-predict-1",
        prompt: `$${m(2, 1, 0, 3)}${v(1, 2)} = ?$`,
        options: [
          { id: "a", text: `$${v(4, 6)}$`, correct: true, why: "1·(2, 0) + 2·(1, 3)." },
          { id: "b", text: `$${v(2, 6)}$`, misconception: "elementwise", why: "That multiplies only the matching diagonal entries and skips the 1." },
          { id: "c", text: `$${v(3, 3)}$`, why: "That adds entries instead of combining columns." },
        ],
      },
      reveal: {
        body: `It lands on $${v(4, 6)} = 1${v(2, 0)} + 2${v(1, 3)}$. The off-diagonal 1 is half of where ĵ goes, so it can't be skipped.`,
        widget: { kind: "transform", matrix: [[2, 1], [0, 3]], showVector: [1, 2], lockMatrix: true },
      },
      resolve: {
        kind: "mc",
        id: "mv-resolve-1",
        prompt: "What does the vector's first number tell you?",
        options: [
          { id: "a", text: "How many copies of the first column to take", correct: true, why: "x copies of the new î." },
          { id: "b", text: "Which matrix entry to multiply it by", misconception: "elementwise", why: "It scales a whole column, not one entry." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mv-check-1",
        prompt: `$${m(1, -1, 2, 0)}${v(3, 1)} = ?$`,
        options: [
          { id: "a", text: `$${v(2, 6)}$`, correct: true, why: "3·(1, 2) + 1·(−1, 0) = (2, 6)." },
          { id: "b", text: `$${v(3, 0)}$`, misconception: "elementwise", why: "That multiplies only the diagonal." },
          { id: "c", text: `$${v(4, 6)}$`, why: "The −1 was read as +1." },
          { id: "d", text: `$${v(5, -3)}$`, misconception: "column-row-mix", why: "That takes 3 copies of the first row and 1 of the second. Columns are the landing spots." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A neural-network layer is exactly this: outputs $= W\\vec x$ (plus a bias). The weight matrix $W$ moves the input vector into a new space.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "expression",
          id: "mv-produce-1",
          prompt: `Write the **first** component of $${m("a", "b", "c", "d")}${v("x", "y")}$.`,
          forms: [
            { value: "a*x + c*y", status: "wrong", misconception: "column-row-mix", message: "a and c are the first column, where î lands. The first component uses the first row: a and b." },
            { value: "a*x", status: "wrong", misconception: "elementwise", message: "ĵ's landing spot contributes too." },
            { value: "a*x + b*y", status: "correct" },
          ],
          explain: "$x$ copies of $(a, c)$ plus $y$ copies of $(b, d)$; the first component is $ax + by$.",
        },
        {
          kind: "vector",
          id: "mv-produce-2",
          prompt: `Compute $${m(3, 0, 1, -2)}${v(2, -1)}$.`,
          answer: [6, 4],
          explain: `$2${v(3, 1)} - 1${v(0, -2)} = ${v(6, 4)}$.`,
          traps: [{ answer: [6, 2], misconception: "elementwise", message: "Every entry contributes, not just the diagonal." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "mv-review-1",
      prompt: `Compute $${m(0, -1, 1, 0)}${v(3, 2)}$.`,
      answer: [-2, 3],
      explain: `$3${v(0, 1)} + 2${v(-1, 0)} = ${v(-2, 3)}$. A 90° rotation.`,
    },
  ],
};

const composition: ConceptNode = {
  id: "composition",
  title: "Composing transformations",
  summary: "B then A is the single matrix AB. Order matters: AB ≠ BA in general.",
  deps: ["matrix-vector"],
  pos: { x: 6, y: 1 },
  glossary: [{ term: "composition", meaning: "Doing one transformation, then another. The result is one matrix." }],
  misconceptions: {
    commutes: "Believes the order of transformations doesn't matter (AB = BA).",
    "left-first": "Applies the left matrix first.",
  },
  steps: [
    {
      type: "motivate",
      title: "Two moves of the plane",
      body: "Rotate, then shear. Is there one matrix that does both in a single step?",
      realWorld: {
        title: "Stacked photo edits",
        body: "Stretch a photo sideways and then rotate it, or rotate first and then stretch: the two results are different pictures.",
      },
    },
    {
      type: "explore",
      title: "Swap the order",
      body: "Rotate 90° and shear. Toggle which one happens first.",
      widget: { kind: "compose", first: [[0, -1], [1, 0]], second: [[1, 1], [0, 1]] },
      task: "Compare where î ends up in each order.",
    },
    {
      type: "truth",
      statement: "Doing $B$ first and then $A$ is the single matrix $AB$. Read right to left, like $f(g(x))$.",
      body: "Its first column is $A$ applied to $B$'s first column: follow î through $B$, then through $A$.",
    },
    {
      type: "predict",
      misconception: "commutes",
      item: {
        kind: "mc",
        id: "comp-predict-1",
        prompt: "Rotate 90° then shear, versus shear then rotate 90°. Same final grid?",
        options: [
          { id: "a", text: "Different grids", correct: true, why: "Order changes where î and ĵ end up." },
          { id: "b", text: "The same grid", misconception: "commutes", why: "Toggle the order: î ends in different places." },
        ],
      },
      reveal: {
        body: `Rotate then shear sends $${I}$ to $${v(1, 1)}$. Shear then rotate sends it to $${v(0, 1)}$. Different, so $AB \\ne BA$ in general.`,
        widget: { kind: "compose", first: [[0, -1], [1, 0]], second: [[1, 1], [0, 1]] },
      },
      resolve: {
        kind: "mc",
        id: "comp-resolve-1",
        prompt: "So for matrices, AB and BA are:",
        options: [
          { id: "a", text: "Allowed to differ", correct: true, why: "Sometimes equal, usually not." },
          { id: "b", text: "Always equal", misconception: "commutes", why: "Rotate-then-shear just showed they differ." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "comp-check-1",
        prompt: "In $AB\\vec v$, which transformation acts on $\\vec v$ first?",
        options: [
          { id: "a", text: "$B$", correct: true, why: "The matrix next to the vector acts first: $A(B\\vec v)$." },
          { id: "b", text: "$A$", misconception: "left-first", why: "Read right to left. B touches v first." },
          { id: "c", text: "Both at the same time", why: "They act one after the other; AB is just the shortcut for both." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "comp-check-2",
        prompt: "Now flip it: in $BA\\vec v$, which transformation acts on $\\vec v$ first?",
        options: [
          { id: "a", text: "$A$", correct: true, why: "A sits next to the vector: $B(A\\vec v)$." },
          { id: "b", text: "$B$", misconception: "left-first", why: "The leftmost matrix acts last." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Deep networks stack layers: $W_3W_2W_1\\vec x$. Without activation functions, that whole stack collapses into **one** matrix. That's why networks need nonlinear activations between layers.",
    },
    {
      type: "produce",
      body: "Unaided. Get it right and this turns **solid**.",
      items: [
        {
          kind: "matrix",
          id: "comp-produce-1",
          prompt: `$A = ${m(1, 1, 0, 1)}$, $B = ${m(2, 0, 0, 1)}$. Compute $AB$.`,
          answer: [[2, 1], [0, 1]],
          explain: `First column: $A${v(2, 0)} = ${v(2, 0)}$. Second column: $A${v(0, 1)} = ${v(1, 1)}$.`,
          traps: [{ answer: [[2, 2], [0, 1]], misconception: "commutes", message: "That's BA. AB means B first, then A." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "matrix",
      id: "comp-review-1",
      prompt: `$A = ${m(0, 1, 1, 0)}$ (swap axes), $B = ${m(3, 0, 0, 1)}$. Compute $AB$.`,
      answer: [[0, 1], [3, 0]],
      explain: `First column: $A${v(3, 0)} = ${v(0, 3)}$. Second column: $A${v(0, 1)} = ${v(1, 0)}$.`,
      traps: [{ answer: [[0, 3], [1, 0]], misconception: "commutes", message: "That's BA." }],
    },
  ],
};

export const unit1: Unit = {
  id: "la-1",
  track: "Linear algebra",
  title: "Vectors & Linear Transformations",
  blurb: "From arrows to matrices that move the whole plane: the language every ML model is written in.",
  nodes: [vector, vectorAdd, scalar, linearCombination, basis, matrixTransform, matrixVector, composition].map((n) => deepen(n, UNIT1_DEPTH[n.id])),
};
