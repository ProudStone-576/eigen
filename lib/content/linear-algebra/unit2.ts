import type { ConceptNode, Unit } from "@/lib/content/types";

const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;
const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;
const I = "\\hat\\imath";
const J = "\\hat\\jmath";

const span: ConceptNode = {
  id: "span",
  title: "Span",
  summary: "The span of some vectors is everything their linear combinations can reach.",
  deps: ["linear-combination", "basis"],
  pos: { x: 0, y: 0 },
  glossary: [{ term: "span", meaning: "Every vector you can reach by scaling and adding a set of vectors." }],
  misconceptions: {
    "any-two-span": "Thinks any two vectors can reach the whole plane, even parallel ones.",
    "span-is-just-vectors": "Thinks the span is only the vectors themselves, not every combination of them.",
  },
  steps: [
    {
      type: "motivate",
      title: "What can two moves reach?",
      body: "A robot can only drive along two fixed directions, as far as it likes, forwards or backwards. Can it reach **every** spot on the floor?",
      realWorld: {
        title: "A drawing robot with two motors",
        body: "Plotters and 3D printers move along two (or three) motor directions. If the motors pointed the same way, half the page would be unreachable.",
      },
    },
    {
      type: "explore",
      title: "Two arrows on the same line",
      body: `Here $\\vec v = ${v(1, 2)}$ and $\\vec w = ${v(2, 4)}$.`,
      widget: { kind: "combo", v: [1, 2], w: [2, 4], a: 1, b: 0 },
      task: `Try to land the yellow tip on $${v(1, 0)}$. Move both dials. What shape does the tip trace out?`,
    },
    {
      type: "truth",
      statement: "The **span** of $\\vec v$ and $\\vec w$ is every vector $a\\vec v + b\\vec w$ can reach.",
      body: "Two vectors pointing in different directions span the whole plane. Two parallel vectors only span a line.",
    },
    {
      type: "predict",
      misconception: "any-two-span",
      item: {
        kind: "mc",
        id: "span-predict-1",
        prompt: `Can $a${v(1, 2)} + b${v(2, 4)}$ reach $${v(1, 0)}$ for some $a$ and $b$?`,
        options: [
          { id: "a", text: "No: both arrows lie on the same line", correct: true, why: "Every combination stays on that line." },
          { id: "b", text: "Yes: two vectors reach the whole plane", misconception: "any-two-span", why: "Only if they point in different directions." },
        ],
      },
      reveal: {
        body: `$${v(2, 4)}$ is just $2${v(1, 2)}$. Every combination is a multiple of $${v(1, 2)}$, so the tip never leaves that line.`,
        widget: { kind: "combo", v: [1, 2], w: [2, 4], a: 1, b: -0.5 },
      },
      resolve: {
        kind: "mc",
        id: "span-resolve-1",
        prompt: "When do two 2D vectors span the whole plane?",
        options: [
          { id: "a", text: "When they don't lie on the same line", correct: true, why: "A second direction is what opens up the plane." },
          { id: "b", text: "Always", misconception: "any-two-span", why: "Parallel vectors only add length, not a new direction." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "span-check-1",
        prompt: `What is the span of $${v(3, 0)}$ and $${v(0, -2)}$?`,
        options: [
          { id: "a", text: "The whole plane", correct: true, why: "One points along x, the other along y: different directions." },
          { id: "b", text: "Just those two arrows", misconception: "span-is-just-vectors", why: "The span is every combination, not only the starting vectors." },
          { id: "c", text: "A single line", why: "They point in different directions, so it's more than a line." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "span-check-2",
        prompt: `What is the span of the single vector $${v(1, 1)}$?`,
        options: [
          { id: "a", text: "The whole line through it", correct: true, why: `All multiples $k${v(1, 1)}$, forwards and backwards.` },
          { id: "b", text: "Just the arrow itself", misconception: "span-is-just-vectors", why: "Scaling it by any number is allowed." },
          { id: "c", text: "The whole plane", misconception: "any-two-span", why: "One direction only gives a line." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "If one feature is just a multiple of another (height in cm and height in inches), it adds no new direction to the data. Models handle that badly: it's called **multicollinearity**.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "span-produce-1",
          prompt: `For which $k$ does $${v(2, "k")}$ lie in the span of $${v(1, 3)}$?`,
          answer: 6,
          explain: `It must be a multiple of $${v(1, 3)}$: $2${v(1, 3)} = ${v(2, 6)}$, so $k = 6$.`,
        },
        {
          kind: "vector",
          id: "span-produce-2",
          prompt: `Write $${v(4, 1)}$ as $a${v(1, 0)} + b${v(1, 1)}$. Give the weights $${v("a", "b")}$.`,
          answer: [3, 1],
          explain: "Second component: $b = 1$. First: $a + b = 4$, so $a = 3$.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "span-review-1",
      prompt: `For which $k$ is $${v("k", 2)}$ in the span of $${v(3, 1)}$?`,
      answer: 6,
      explain: `$2${v(3, 1)} = ${v(6, 2)}$.`,
    },
  ],
};

const independence: ConceptNode = {
  id: "linear-independence",
  title: "Linear independence",
  summary: "Vectors are independent when none is a combination of the others: each adds a new direction.",
  deps: ["span"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "linearly independent", meaning: "No vector in the set can be built from the others." },
    { term: "linearly dependent", meaning: "At least one vector is a combination of the others, so it adds nothing new." },
  ],
  misconceptions: {
    "different-means-independent": "Thinks two vectors are independent just because they are different vectors.",
  },
  steps: [
    {
      type: "motivate",
      title: "Redundant arrows",
      body: "If $\\vec w$ is already reachable from $\\vec v$, adding $\\vec w$ to your set changes nothing about what you can reach. It's dead weight.",
      realWorld: {
        title: "A spreadsheet with a total column",
        body: "Columns: rent, food, and total = rent + food. The total column is built from the others. It carries no new information.",
      },
    },
    {
      type: "truth",
      statement: "Vectors are **linearly independent** when none of them is a linear combination of the others.",
      body: "In 2D: two vectors are independent exactly when they don't lie on the same line. The zero vector is never independent: it's $0$ times anything.",
    },
    { type: "connect", body: "Independent vectors are the ones that each grow the *span*. Dependent ones leave it unchanged." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "li-check-1",
        prompt: `Are $${v(2, 4)}$ and $${v(1, 2)}$ independent?`,
        options: [
          { id: "a", text: "No: one is 2 times the other", correct: true, why: `$${v(2, 4)} = 2${v(1, 2)}$.` },
          { id: "b", text: "Yes: they are different vectors", misconception: "different-means-independent", why: "Different isn't enough. One must not be buildable from the other." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "li-check-2",
        prompt: `Are $${v(0, 0)}$ and $${v(1, 3)}$ independent?`,
        options: [
          { id: "a", text: "No: the zero vector is 0 times the other", correct: true, why: "$0\\cdot\\vec w = \\vec 0$, so the zero vector is a combination." },
          { id: "b", text: "Yes: they point in different directions", misconception: "different-means-independent", why: "The zero vector has no direction at all, and it's always buildable." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Before training, data scientists drop features that are combinations of others (like a total column). Independent features each bring new information.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "li-produce-1",
          prompt: `For which $k$ are $${v(3, "k")}$ and $${v(1, 2)}$ dependent?`,
          answer: 6,
          explain: `Dependent means parallel: $3${v(1, 2)} = ${v(3, 6)}$.`,
        },
        {
          kind: "number",
          id: "li-produce-2",
          prompt: `$${v("a", 4)}$ and $${v(2, 8)}$ are dependent. What is $a$?`,
          answer: 1,
          explain: `$${v(2, 8)} = 2${v(1, 4)}$, so $a = 1$.`,
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "li-review-1",
      prompt: `$${v(6, "k")}$ and $${v(2, -1)}$ are dependent. What is $k$?`,
      answer: -3,
      explain: `$3${v(2, -1)} = ${v(6, -3)}$.`,
    },
  ],
};

const determinant: ConceptNode = {
  id: "determinant",
  title: "The determinant",
  summary: "det A is the factor by which A scales area; its sign says whether the plane flipped.",
  deps: ["matrix-transform"],
  pos: { x: 0, y: 2 },
  glossary: [{ term: "determinant", meaning: "How much a matrix scales area. Negative means the plane got flipped over." }],
  misconceptions: {
    "negative-means-smaller": "Thinks a negative determinant means areas shrink.",
    "ad-only": "Computes the determinant as a·d and forgets the −b·c.",
    "plus-bc": "Adds b·c instead of subtracting it.",
  },
  steps: [
    {
      type: "motivate",
      title: "How much bigger did it get?",
      body: "A transformation stretches some parts of the plane and squeezes others. Is there **one** number that says how much area changes?",
      realWorld: {
        title: "Resizing a photo",
        body: "Scale a photo 2× wide and 2× tall and it covers 4× the area. Stretch only the width and it's 2×.",
      },
    },
    {
      type: "explore",
      title: "Watch the shaded square",
      body: "The shaded shape is where the unit square (area 1) lands.",
      widget: { kind: "transform", matrix: [[2, 0], [0, 1]], showArea: true },
      task: "Make the shaded area exactly 6. Then drag î past ĵ so they swap sides, and watch the sign.",
    },
    {
      type: "truth",
      statement: "The **determinant** is the factor by which a matrix scales area. The unit square becomes a shape of area $|\\det A|$; a negative $\\det A$ means the plane was flipped over.",
      body: "Because every region is made of tiny squares, and they all scale by the same factor, one number covers the whole plane.",
    },
    {
      type: "truth",
      statement: `$\\det${m("a", "b", "c", "d")} = ad - bc$`,
      body: `For $${m("a", 0, 0, "d")}$ the square becomes an $a \\times d$ rectangle: area $ad$. When the columns lean towards each other, the parallelogram gets thinner, and $bc$ is exactly how much area that lean removes. Check it in the widget.`,
    },
    {
      type: "predict",
      misconception: "negative-means-smaller",
      item: {
        kind: "mc",
        id: "det-predict-1",
        prompt: `$${m(0, 1, 1, 0)}$ swaps $${I}$ and $${J}$. Its determinant is $-1$. What happened to areas?`,
        options: [
          { id: "a", text: "Same size, but the plane is flipped", correct: true, why: "|−1| = 1: no change in size. The minus means a mirror flip." },
          { id: "b", text: "Areas got smaller", misconception: "negative-means-smaller", why: "Size comes from |det|, which is 1 here." },
        ],
      },
      reveal: {
        body: `The square still has area 1. It's just mirrored: $${I}$ and $${J}$ swapped sides. The **sign** records orientation; the **size** records area.`,
        widget: { kind: "transform", matrix: [[0, 1], [1, 0]], showArea: true, lockMatrix: true },
      },
      resolve: {
        kind: "mc",
        id: "det-resolve-1",
        prompt: "A determinant of −3 means:",
        options: [
          { id: "a", text: "Areas grow 3× and the plane is flipped", correct: true, why: "Size 3, sign negative." },
          { id: "b", text: "Areas shrink to a third", misconception: "negative-means-smaller", why: "Shrinking to a third would be det ±1/3." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "det-check-1",
        prompt: `$\\det${m(3, 1, 2, 4)} = ?$`,
        options: [
          { id: "a", text: "10", correct: true, why: "3·4 − 1·2 = 12 − 2." },
          { id: "b", text: "12", misconception: "ad-only", why: "Don't forget to subtract b·c." },
          { id: "c", text: "14", misconception: "plus-bc", why: "It's minus b·c, not plus." },
          { id: "d", text: "−10", why: "That's b·c − a·d, the wrong way round." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The determinant of a dataset's *covariance matrix* measures how spread out the data is in all directions at once. When it's 0, the data is flat: some feature is a combination of the others.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "det-produce-1",
          prompt: `Compute $\\det${m(2, 5, 1, 3)}$.`,
          answer: 1,
          explain: "2·3 − 5·1 = 1. Areas don't change, though the shape does.",
        },
        {
          kind: "expression",
          id: "det-produce-2",
          prompt: `Write $\\det${m("a", "b", "c", "d")}$ in terms of $a, b, c, d$.`,
          forms: [
            { value: "a*d + b*c", status: "wrong", misconception: "plus-bc", message: "It's minus b·c." },
            { value: "a*d", status: "wrong", misconception: "ad-only", message: "Missing the −b·c part." },
            { value: "a*d - b*c", status: "correct" },
          ],
          explain: "$ad - bc$.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "det-review-1",
      prompt: `Compute $\\det${m(-1, 2, 3, 4)}$.`,
      answer: -10,
      explain: "(−1)·4 − 2·3 = −4 − 6 = −10.",
    },
  ],
};

const detZero: ConceptNode = {
  id: "det-zero",
  title: "Squashing: det = 0",
  summary: "det A = 0 exactly when A's columns are dependent: the plane is squashed onto a line or a point.",
  deps: ["determinant", "linear-independence"],
  pos: { x: 2, y: 1 },
  glossary: [{ term: "singular matrix", meaning: "A matrix with determinant 0. It squashes the plane flat." }],
  misconceptions: {
    "zeros-needed": "Thinks a determinant can only be 0 if the matrix has zero entries.",
    "ad-only": "Computes the determinant as a·d and forgets the −b·c.",
  },
  steps: [
    {
      type: "motivate",
      title: "When the area is zero",
      body: "If a transformation scales every area by 0, what does the plane look like afterwards?",
      realWorld: {
        title: "A shadow at noon",
        body: "Shine light straight down on a flat card held vertically and its shadow is a line. A whole 2D shape lands on 1D.",
      },
    },
    {
      type: "explore",
      title: "Flatten it",
      body: "Drag î and ĵ and watch the shaded area.",
      widget: { kind: "transform", matrix: [[1, 2], [1, 1]], showArea: true },
      task: "Make the shaded area exactly 0. Where are î and ĵ when it happens?",
    },
    {
      type: "truth",
      statement: "$\\det A = 0$ exactly when the columns of $A$ are linearly dependent: $\\hat\\imath$ and $\\hat\\jmath$ land on the same line, and the whole plane is squashed flat.",
      body: "Zero area means no 2D region survives. Everything lands on a line (or, if both columns are zero, on a single point).",
    },
    { type: "connect", body: "This joins two ideas: *the determinant* (area) and *linear independence*. Zero area ⟺ dependent columns." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dz-check-1",
        prompt: `What is $\\det${m(2, 4, 1, 2)}$?`,
        options: [
          { id: "a", text: "0: the plane is squashed onto a line", correct: true, why: "2·2 − 4·1 = 0. The columns (2,1) and (4,2) are parallel." },
          { id: "b", text: "4: areas grow 4 times", misconception: "ad-only", why: "That's only a·d. Subtract b·c = 4." },
          { id: "c", text: "Not zero: no entry is zero", misconception: "zeros-needed", why: "Zero entries aren't needed. Parallel columns are." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dz-check-2",
        prompt: "Which matrix squashes the plane flat?",
        options: [
          { id: "a", text: `$${m(1, 2, 2, 4)}$`, correct: true, why: "1·4 − 2·2 = 0." },
          { id: "b", text: `$${m(2, 0, 0, 3)}$`, misconception: "zeros-needed", why: "Its determinant is 6. Zeros alone don't squash." },
          { id: "c", text: `$${m(0, 1, 1, 5)}$`, misconception: "ad-only", why: "a·d = 0, but the determinant is 0 − 1 = −1." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A matrix with determinant 0 is called **singular**. In linear regression, if two features are dependent, a key matrix becomes singular and the textbook formula breaks down.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "dz-produce-1",
          prompt: `For which $k$ is $\\det${m("k", 3, 2, 6)} = 0$?`,
          answer: 1,
          explain: "6k − 3·2 = 0, so k = 1.",
        },
        {
          kind: "number",
          id: "dz-produce-2",
          prompt: `Pick $x$ so that $${m(2, 4, 1, "x")}$ squashes the plane flat.`,
          answer: 2,
          explain: "2x − 4·1 = 0, so x = 2. The columns become (2, 1) and (4, 2): parallel.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "dz-review-1",
      prompt: `Compute $\\det${m(4, -2, -2, 1)}$.`,
      answer: 0,
      explain: "4·1 − (−2)(−2) = 4 − 4 = 0. Squashed.",
    },
  ],
};

const inverse: ConceptNode = {
  id: "inverse",
  title: "Inverse matrices",
  summary: "A⁻¹ undoes A, so A⁻¹A = I. It exists exactly when det A ≠ 0.",
  deps: ["composition", "det-zero"],
  pos: { x: 3, y: 1 },
  glossary: [
    { term: "identity matrix", meaning: "I = the matrix that changes nothing: î stays î, ĵ stays ĵ." },
    { term: "inverse", meaning: "A⁻¹: the transformation that undoes A." },
  ],
  misconceptions: {
    "reciprocal-entries": "Thinks the inverse is found by flipping each entry (1 over each number).",
    "zero-entry-no-inverse": "Thinks any matrix with a zero entry has no inverse.",
  },
  steps: [
    {
      type: "motivate",
      title: "An undo button",
      body: "You applied a transformation. Can you get every point back to where it started?",
      realWorld: { title: "Undo in a photo editor", body: "Rotate 90° clockwise; the undo is 90° counter-clockwise. Every edit you can undo has an inverse." },
    },
    {
      type: "truth",
      statement: `The **inverse** $A^{-1}$ undoes $A$: $A^{-1}A = I$, where $I = ${m(1, 0, 0, 1)}$ changes nothing.`,
      body: "It works from both sides too: undoing then redoing also gets you back to I.",
    },
    {
      type: "explore",
      title: "Do, then undo",
      body: `$A = ${m(2, 1, 1, 1)}$ and $A^{-1} = ${m(1, -1, -1, 2)}$.`,
      widget: { kind: "compose", first: [[2, 1], [1, 1]], second: [[1, -1], [-1, 2]], firstName: "A", secondName: "A⁻¹" },
      task: "Try both orders. Where do î and ĵ end up each time?",
    },
    {
      type: "truth",
      statement: "$A^{-1}$ exists exactly when $\\det A \\ne 0$.",
      body: "A squash can't be undone: many different points landed on the same spot, and nothing can tell them apart again.",
    },
    {
      type: "truth",
      statement: `$${m("a", "b", "c", "d")}^{-1} = \\dfrac{1}{ad-bc}${m("d", "-b", "-c", "a")}$`,
      body: "Swap the diagonal, negate the other two, divide by the determinant. Dividing by det is exactly why det = 0 has no inverse.",
    },
    {
      type: "predict",
      misconception: "reciprocal-entries",
      item: {
        kind: "mc",
        id: "inv-predict-1",
        prompt: `What is the inverse of $${m(2, 1, 1, 1)}$ (determinant 1)?`,
        options: [
          { id: "a", text: `$${m(1, -1, -1, 2)}$`, correct: true, why: "Swap the diagonal, negate the rest, divide by 1." },
          { id: "b", text: `$${m("\\tfrac12", 1, 1, 1)}$`, misconception: "reciprocal-entries", why: "Flipping each entry doesn't undo where î and ĵ went." },
          { id: "c", text: `$${m(1, 1, 1, 2)}$`, why: "Close: the off-diagonal entries need their signs flipped." },
        ],
      },
      reveal: {
        body: `Flip-each-entry gives $${m("\\tfrac12", 1, 1, 1)}$, and $A$ times that is $${m(2, 3, "1.5", 2)}$: not the identity. Toggle the order: still not $I$.`,
        widget: { kind: "compose", first: [[0.5, 1], [1, 1]], second: [[2, 1], [1, 1]], firstName: "Flipped guess", secondName: "A" },
      },
      resolve: {
        kind: "mc",
        id: "inv-resolve-1",
        prompt: "To undo a matrix, you must:",
        options: [
          { id: "a", text: "Undo where î and ĵ landed", correct: true, why: "That's what A⁻¹ records in its columns." },
          { id: "b", text: "Flip each entry upside down", misconception: "reciprocal-entries", why: "The widget just showed that doesn't give I." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "inv-check-1",
        prompt: "Which matrix has **no** inverse?",
        options: [
          { id: "a", text: `$${m(2, 4, 1, 2)}$`, correct: true, why: "Its determinant is 0: it squashes the plane." },
          { id: "b", text: `$${m(0, 1, 1, 0)}$`, misconception: "zero-entry-no-inverse", why: "It swaps the axes, and swapping again undoes it. det = −1." },
          { id: "c", text: `$${m(3, 0, 0, 3)}$`, misconception: "zero-entry-no-inverse", why: "Its inverse shrinks by 3: det = 9." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Linear regression's classic formula $w = (X^\\top X)^{-1}X^\\top y$ needs an inverse. When features are dependent there is none, so libraries use regularisation or a *pseudo-inverse* instead.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "matrix",
          id: "inv-produce-1",
          prompt: `Find the inverse of $${m(3, 1, 2, 1)}$.`,
          answer: [[1, -1], [-2, 3]],
          explain: `det = 3 − 2 = 1, so the inverse is $${m(1, -1, -2, 3)}$.`,
          traps: [{ answer: [[1 / 3, 1], [1 / 2, 1]], misconception: "reciprocal-entries", message: "Flipping entries doesn't undo the transformation." }],
        },
        {
          kind: "matrix",
          id: "inv-produce-2",
          prompt: `Find the inverse of $${m(0, 1, 1, 0)}$ (swap the axes).`,
          answer: [[0, 1], [1, 0]],
          explain: "Swapping twice changes nothing, so it's its own inverse.",
          traps: [{ answer: [[0, 0], [0, 0]], misconception: "zero-entry-no-inverse", message: "It has an inverse: det = −1, not 0." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "matrix",
      id: "inv-review-1",
      prompt: `Find the inverse of $${m(2, 0, 0, 5)}$.`,
      answer: [[0.5, 0], [0, 0.2]],
      explain: "Undo stretching by 2 and 5: shrink by 2 and 5.",
    },
  ],
};

const solving: ConceptNode = {
  id: "solving-systems",
  title: "Solving Ax = b",
  summary: "A system of equations asks which input lands on b. If det A ≠ 0, x = A⁻¹b.",
  deps: ["inverse", "matrix-vector"],
  pos: { x: 4, y: 1 },
  glossary: [{ term: "system of linear equations", meaning: "Several equations like 2x + y = 5 that must all be true at once. Written Ax = b." }],
  misconceptions: {
    "columns-are-equations": "Writes each equation as a column of A instead of a row.",
  },
  steps: [
    {
      type: "motivate",
      title: "Working backwards",
      body: "So far: given an input, find where it lands. Now flip it: you know where it **landed**. Where did it start?",
      realWorld: {
        title: "A smoothie bar",
        body: "Juice A has 2 g sugar and 1 g fibre per cup; juice B has 1 g of each. A customer wants exactly 5 g sugar and 3 g fibre. How many cups of each? That's a system of equations.",
      },
    },
    {
      type: "explore",
      title: "Hit the target",
      body: `Here $A = ${m(2, 1, 1, 1)}$.`,
      widget: { kind: "solve", matrix: [[2, 1], [1, 1]], target: [3, 2], start: [0, 0] },
      task: "Drag the blue input until its output lands in the green ring.",
    },
    {
      type: "truth",
      statement: "A system of linear equations is $A\\vec x = \\vec b$: find the input $\\vec x$ that lands on $\\vec b$. If $\\det A \\ne 0$, the answer is $\\vec x = A^{-1}\\vec b$.",
      body: "Each equation is one **row** of $A$: $2x + y = 5$ becomes the row $(2, 1)$ with $5$ in $\\vec b$.",
    },
    { type: "connect", body: "*Matrix × vector* goes forwards. The *inverse* goes backwards." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "sys-check-1",
        prompt: "Write $2x + 3y = 8$ and $x - y = -1$ as $A\\vec x = \\vec b$. What is $A$?",
        options: [
          { id: "a", text: `$${m(2, 3, 1, -1)}$`, correct: true, why: "One row per equation." },
          { id: "b", text: `$${m(2, 1, 3, -1)}$`, misconception: "columns-are-equations", why: "Each equation is a row, not a column." },
          { id: "c", text: `$${m(8, -1, 2, 3)}$`, why: "The right-hand sides belong in b, not in A." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Linear regression is a huge system $X\\vec w \\approx \\vec y$: find weights $\\vec w$ that send your data $X$ to the targets $\\vec y$. With more equations than unknowns there's no exact answer, so we find the **closest** one. That's the next unit.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "sys-produce-1",
          prompt: `Solve $${m(2, 1, 1, 1)}\\vec x = ${v(5, 3)}$. (The smoothie: cups of A and B.)`,
          answer: [2, 1],
          explain: `$A^{-1} = ${m(1, -1, -1, 2)}$, so $\\vec x = ${v("5-3", "-5+6")} = ${v(2, 1)}$. Check: 2·2 + 1 = 5, 2 + 1 = 3.`,
        },
        {
          kind: "vector",
          id: "sys-produce-2",
          prompt: "Solve $2x + 3y = 8$ and $x - y = -1$. Give $\\begin{bmatrix}x\\\\y\\end{bmatrix}$.",
          answer: [1, 2],
          explain: "From the second, x = y − 1. Then 2(y − 1) + 3y = 8, so y = 2 and x = 1.",
          traps: [{ answer: [1.4, 5.2], misconception: "columns-are-equations", message: "That solves the system with the equations written as columns." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "sys-review-1",
      prompt: `Solve $${m(1, 2, 0, 1)}\\vec x = ${v(5, 2)}$.`,
      answer: [1, 2],
      explain: "Second row: y = 2. First: x + 4 = 5, so x = 1.",
    },
  ],
};

export const unit2: Unit = {
  id: "la-2",
  track: "Linear algebra",
  title: "Span, Determinants & Inverses",
  blurb: "What a set of vectors can reach, how much a matrix stretches space, and how to run it backwards.",
  nodes: [span, independence, determinant, detZero, inverse, solving],
};
