import type { ConceptNode, Unit, Vec } from "@/lib/content/types";

const v = (x: number | string, y: number | string) => `\\begin{bmatrix}${x}\\\\${y}\\end{bmatrix}`;
const m = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{bmatrix}${a}&${b}\\\\${c}&${d}\\end{bmatrix}`;
const I = "\\hat\\imath";
const J = "\\hat\\jmath";

// A small 2D dataset that leans along roughly 30 degrees: used by the PCA widget.
const CLOUD: Vec[] = [
  [-3, -1.5], [-2.5, -2], [-2, -0.5], [-1.5, -1.5], [-1, 0], [-0.5, -1], [0, 0.5], [0.5, -0.5],
  [1, 1], [1.5, 0], [2, 1.5], [2.5, 0.8], [3, 2], [-1, -1.2], [1, 0.2],
];

const eigenvector: ConceptNode = {
  id: "eigenvector",
  title: "Eigenvectors",
  summary: "An eigenvector of A is a non-zero vector that A only stretches: it stays on its own line.",
  deps: ["matrix-vector", "span"],
  pos: { x: 0, y: 1 },
  glossary: [{ term: "eigenvector", meaning: "A non-zero vector that a matrix keeps on its own line: it only gets stretched, shrunk or flipped." }],
  misconceptions: {
    "zero-is-eigenvector": "Counts the zero vector as an eigenvector.",
    "every-matrix-has": "Thinks every 2×2 matrix has real eigenvectors, even a rotation.",
  },
  steps: [
    {
      type: "motivate",
      title: "Arrows that keep their direction",
      body: "A transformation knocks almost every vector onto a new direction. But some special vectors only get **longer or shorter**. Those directions are the skeleton of the transformation.",
      realWorld: {
        title: "Stretching a rubber sheet",
        body: "Pull a rubber sheet sideways. Lines along the pull stay on themselves and just stretch; diagonal lines get tilted. The pull direction is an eigenvector.",
      },
    },
    {
      type: "explore",
      title: "Eigenvector hunt",
      body: `$A = ${m(2, 1, 1, 2)}$. The yellow arrow is $A\\vec v$.`,
      widget: { kind: "eigen", matrix: [[2, 1], [1, 2]], start: [2, 0] },
      task: "Find two different directions where the yellow arrow lands on the dashed line through v.",
    },
    {
      type: "truth",
      statement: "An **eigenvector** of $A$ is a non-zero vector $\\vec v$ with $A\\vec v = \\lambda\\vec v$ for some number $\\lambda$.",
      body: "In words: $A$ leaves $\\vec v$ on its own span. The zero vector is excluded, because $A\\vec 0 = \\vec 0$ for every matrix: it would tell you nothing.",
    },
    { type: "connect", body: "*Span* gave us \"the line through $\\vec v$\". *Matrix × vector* gave us $A\\vec v$. An eigenvector is where the two meet." },
    {
      type: "predict",
      misconception: "every-matrix-has",
      item: {
        kind: "mc",
        id: "eig-predict-1",
        prompt: `Does the 90° rotation $${m(0, -1, 1, 0)}$ have any (real) eigenvectors?`,
        options: [
          { id: "a", text: "No: every vector gets turned off its line", correct: true, why: "A 90° turn changes every direction." },
          { id: "b", text: "Yes: every matrix has some", misconception: "every-matrix-has", why: "Rotations by anything but 0° or 180° move every direction." },
        ],
      },
      reveal: {
        body: "Drag v anywhere: the yellow arrow is always at a right angle to it. No direction survives a 90° rotation.",
        widget: { kind: "eigen", matrix: [[0, -1], [1, 0]], start: [2, 1] },
      },
      resolve: {
        kind: "mc",
        id: "eig-resolve-1",
        prompt: "So eigenvectors are:",
        options: [
          { id: "a", text: "Special directions some matrices have, and some don't", correct: true, why: "Rotations have none; stretches have plenty." },
          { id: "b", text: "Something every matrix has", misconception: "every-matrix-has", why: "The rotation just showed one with none." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "eig-check-1",
        prompt: `Which of these is an eigenvector of $${m(3, 0, 0, 2)}$?`,
        options: [
          { id: "a", text: `$${v(0, 5)}$`, correct: true, why: `$A${v(0, 5)} = ${v(0, 10)} = 2${v(0, 5)}$.` },
          { id: "b", text: `$${v(0, 0)}$`, misconception: "zero-is-eigenvector", why: "The zero vector is never an eigenvector." },
          { id: "c", text: `$${v(1, 1)}$`, why: `$A${v(1, 1)} = ${v(3, 2)}$: knocked off its line.` },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Eigenvectors are how ML finds the \"natural axes\" of data. PCA (the end of this unit) is eigenvectors of one special matrix; Google's original PageRank was an eigenvector of the web's link matrix.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "mc",
          id: "eig-produce-1",
          prompt: `Which is an eigenvector of the shear $${m(1, 1, 0, 1)}$?`,
          options: [
            { id: "a", text: `$${v(1, 0)}$`, correct: true, why: "î stays put under the shear: λ = 1." },
            { id: "b", text: `$${v(0, 1)}$`, why: "ĵ is tilted to (1, 1)." },
            { id: "c", text: `$${v(0, 0)}$`, misconception: "zero-is-eigenvector", why: "Never the zero vector." },
          ],
        },
        {
          kind: "vector",
          id: "eig-produce-2",
          prompt: `Give an eigenvector of $${m(2, 1, 1, 2)}$ that points up and to the right. (Any multiple counts.)`,
          answer: [1, 1],
          upToScale: true,
          explain: `$A${v(1, 1)} = ${v(3, 3)} = 3${v(1, 1)}$.`,
          traps: [{ answer: [0, 0], misconception: "zero-is-eigenvector", message: "Not the zero vector." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "eig-review-1",
      prompt: `Give an eigenvector of $${m(4, 0, 0, -1)}$ along the x-axis. (Any multiple counts.)`,
      answer: [1, 0],
      upToScale: true,
      explain: `$A${v(1, 0)} = ${v(4, 0)}$.`,
    },
  ],
};

const eigenvalue: ConceptNode = {
  id: "eigenvalue",
  title: "Eigenvalues",
  summary: "The eigenvalue λ is how much A stretches its eigenvector: Av = λv. Negative λ flips it.",
  deps: ["eigenvector"],
  pos: { x: 1, y: 1 },
  glossary: [{ term: "eigenvalue", meaning: "The stretch factor λ for an eigenvector: Av = λv." }],
  misconceptions: {
    "lambda-is-entry": "Reads the eigenvalue off a matrix entry instead of computing Av ÷ v.",
    "negative-impossible": "Thinks eigenvalues can't be negative.",
  },
  steps: [
    {
      type: "motivate",
      title: "How much stretch?",
      body: "An eigenvector stays on its line, but it might get 3× longer, or half as long, or flipped. One number records which.",
      realWorld: {
        title: "Long-run behaviour",
        body: "Model a population year by year with a matrix. Its biggest eigenvalue is the long-run growth rate: above 1 it grows, below 1 it shrinks. Fibonacci numbers grow by the factor 1.618…, an eigenvalue.",
      },
    },
    {
      type: "truth",
      statement: "If $A\\vec v = \\lambda\\vec v$, then $\\lambda$ is the **eigenvalue** for $\\vec v$: the factor $A$ stretches it by.",
      body: "λ > 1 stretches, 0 < λ < 1 shrinks, λ < 0 flips to the opposite direction, λ = 0 squashes $\\vec v$ to zero.",
    },
    {
      type: "explore",
      title: "Read the stretch",
      body: `$A = ${m(4, 1, 2, 3)}$.`,
      widget: { kind: "eigen", matrix: [[4, 1], [2, 3]], start: [1.5, 0] },
      task: "Find both eigen-directions and read off λ for each. One of them points down and to the right.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ev-check-1",
        prompt: `$${m(4, 1, 2, 3)}${v(1, 1)} = ${v(5, 5)}$. What is the eigenvalue for $${v(1, 1)}$?`,
        options: [
          { id: "a", text: "5", correct: true, why: `$${v(5, 5)} = 5${v(1, 1)}$.` },
          { id: "b", text: "4", misconception: "lambda-is-entry", why: "Eigenvalues aren't read off the entries. Compare Av with v." },
          { id: "c", text: "1", why: "That would leave v unchanged." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ev-check-2",
        prompt: `The mirror $${m(1, 0, 0, -1)}$ flips the plane across the x-axis. What is the eigenvalue for $${J}$?`,
        options: [
          { id: "a", text: "−1", correct: true, why: "ĵ lands on −ĵ: same line, flipped." },
          { id: "b", text: "There isn't one: eigenvalues can't be negative", misconception: "negative-impossible", why: "A flip along the line is allowed: λ = −1." },
          { id: "c", text: "1", misconception: "lambda-is-entry", why: "That's the eigenvalue for î." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "ev-check-3",
        prompt: "Can an eigenvalue be −3?",
        options: [
          { id: "a", text: "Yes: the eigenvector gets flipped and tripled", correct: true, why: "It stays on its line, pointing the other way, 3× as long." },
          { id: "b", text: "No: stretch factors must be positive", misconception: "negative-impossible", why: "Flipping keeps the vector on its own line, so it still counts." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "When training deep networks, the eigenvalues of the weight matrices decide whether signals explode (λ much bigger than 1) or vanish (λ much smaller than 1) as they pass through many layers.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "ev-produce-1",
          prompt: `$${v(1, -2)}$ is an eigenvector of $${m(4, 1, 2, 3)}$. What is its eigenvalue?`,
          answer: 2,
          explain: `$A${v(1, -2)} = ${v(2, -4)} = 2${v(1, -2)}$.`,
        },
        {
          kind: "number",
          id: "ev-produce-2",
          prompt: `$${v(1, -1)}$ is an eigenvector of $${m(1, 3, 3, 1)}$. What is its eigenvalue?`,
          answer: -2,
          explain: `$A${v(1, -1)} = ${v(-2, 2)} = -2${v(1, -1)}$: flipped and doubled.`,
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "ev-review-1",
      prompt: `$${v(1, 1)}$ is an eigenvector of $${m(1, 3, 3, 1)}$. Its eigenvalue?`,
      answer: 4,
      explain: `$A${v(1, 1)} = ${v(4, 4)}$.`,
    },
  ],
};

const findingValues: ConceptNode = {
  id: "finding-eigenvalues",
  title: "Finding eigenvalues",
  summary: "λ is an eigenvalue exactly when det(A − λI) = 0.",
  deps: ["eigenvalue", "det-zero"],
  pos: { x: 2, y: 0 },
  glossary: [{ term: "characteristic equation", meaning: "det(A − λI) = 0: the equation whose solutions are the eigenvalues." }],
  misconceptions: {
    "det-of-A": "Sets det(A) = 0 instead of det(A − λI) = 0.",
    "plus-bc": "Adds b·c instead of subtracting it in a determinant.",
  },
  steps: [
    {
      type: "motivate",
      title: "No more hunting",
      body: "Dragging until an arrow lines up works for pictures. For a 100×100 matrix in ML we need an equation.",
      realWorld: { title: "Bridges and buildings", body: "Engineers find a structure's natural vibration frequencies as eigenvalues, so wind or footsteps never push it at exactly that rhythm." },
    },
    {
      type: "truth",
      statement: "$A\\vec v = \\lambda\\vec v$ means $(A - \\lambda I)\\vec v = \\vec 0$ with $\\vec v \\ne \\vec 0$.",
      body: `Move everything to one side: $A\\vec v - \\lambda\\vec v = \\vec 0$, and $\\lambda\\vec v = \\lambda I\\vec v$. So the matrix $A - \\lambda I$ sends a **non-zero** vector to zero.`,
    },
    {
      type: "truth",
      statement: "So $A - \\lambda I$ squashes the plane, which means $\\det(A - \\lambda I) = 0$.",
      body: `For $${m("a", "b", "c", "d")}$: $(a-\\lambda)(d-\\lambda) - bc = 0$. Solve that for $\\lambda$.`,
    },
    { type: "connect", body: "This is *det = 0* (squashing) doing the work: an eigenvalue is exactly a λ that makes $A - \\lambda I$ singular." },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fv-check-1",
        prompt: `Which equation gives the eigenvalues of $${m(2, 1, 1, 2)}$?`,
        options: [
          { id: "a", text: "(2 − λ)(2 − λ) − 1 = 0", correct: true, why: "det(A − λI) with a = d = 2, b = c = 1." },
          { id: "b", text: "2·2 − 1·1 = 0", misconception: "det-of-A", why: "That's det(A). The λ has to be subtracted first." },
          { id: "c", text: "(2 − λ)(2 − λ) + 1 = 0", misconception: "plus-bc", why: "Minus b·c, as always for a determinant." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Nobody solves big characteristic equations by hand. Libraries like NumPy (`np.linalg.eig`) use clever iterative methods, but they're finding the same λ that make $A - \\lambda I$ singular.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**.",
      items: [
        {
          kind: "number",
          id: "fv-produce-1",
          prompt: `Find the **largest** eigenvalue of $${m(5, 2, 2, 2)}$.`,
          answer: 6,
          explain: "(5 − λ)(2 − λ) − 4 = λ² − 7λ + 6 = (λ − 1)(λ − 6). So λ = 1 or 6.",
        },
        {
          kind: "expression",
          id: "fv-produce-2",
          prompt: `Write $\\det(A - \\lambda I)$ for $A = ${m("a", "b", "c", "d")}$. Type $x$ for $\\lambda$.`,
          forms: [
            { value: "(a - x)*(d - x) + b*c", status: "wrong", misconception: "plus-bc", message: "It's minus b·c." },
            { value: "a*d - b*c", status: "wrong", misconception: "det-of-A", message: "That's det(A). Subtract x from the diagonal first." },
            { value: "(a - x)*(d - x) - b*c", status: "correct" },
          ],
          explain: "$(a-\\lambda)(d-\\lambda) - bc$.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "fv-review-1",
      prompt: `Find the **smallest** eigenvalue of $${m(4, 1, 2, 3)}$.`,
      answer: 2,
      explain: "λ² − 7λ + 10 = (λ − 2)(λ − 5).",
    },
  ],
};

const findingVectors: ConceptNode = {
  id: "finding-eigenvectors",
  title: "Finding eigenvectors",
  summary: "For each eigenvalue λ, the eigenvectors are the non-zero solutions of (A − λI)v = 0.",
  deps: ["finding-eigenvalues", "solving-systems"],
  pos: { x: 3, y: 1 },
  glossary: [],
  misconceptions: {
    "unique-eigenvector": "Thinks each eigenvalue has exactly one eigenvector, not a whole line of them.",
    "zero-is-eigenvector": "Gives the zero vector as an eigenvector.",
  },
  steps: [
    {
      type: "motivate",
      title: "From λ to the direction",
      body: "You found the stretch factors. Now: which directions get those stretches?",
      realWorld: { title: "Which way does it wobble?", body: "Knowing a bridge vibrates at some frequency isn't enough; engineers need the *shape* of the wobble. That shape is the eigenvector." },
    },
    {
      type: "truth",
      statement: "For an eigenvalue $\\lambda$, solve $(A - \\lambda I)\\vec v = \\vec 0$. Every non-zero solution is an eigenvector.",
      body: `Because $A - \\lambda I$ is singular, its two rows say the same thing: one equation, a whole line of solutions. Pick any non-zero point on that line.`,
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fe-check-1",
        prompt: `$${v(1, 1)}$ is an eigenvector of $A$ with $\\lambda = 3$. Is $${v(-4, -4)}$ an eigenvector too?`,
        options: [
          { id: "a", text: "Yes, with the same λ = 3", correct: true, why: "A(−4v) = −4Av = −4·3v = 3(−4v)." },
          { id: "b", text: "No: each λ has just one eigenvector", misconception: "unique-eigenvector", why: "Any non-zero multiple works: the whole line." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "fe-check-2",
        prompt: "For one eigenvalue of a 2×2 matrix (with two different eigenvalues), how many eigenvectors are there?",
        options: [
          { id: "a", text: "A whole line of them: every non-zero multiple", correct: true, why: "If v works, so does kv for any k ≠ 0." },
          { id: "b", text: "Exactly one", misconception: "unique-eigenvector", why: "Scaling an eigenvector gives another one." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Because any multiple works, libraries return eigenvectors scaled to length 1 (*unit vectors*). The sign can still flip between runs, which trips people up when comparing PCA results.",
    },
    {
      type: "produce",
      body: "Unaided. Both right turns this **solid**. Any non-zero multiple counts.",
      items: [
        {
          kind: "vector",
          id: "fe-produce-1",
          prompt: `$${m(5, 2, 2, 2)}$ has eigenvalue $\\lambda = 6$. Find an eigenvector for it.`,
          answer: [2, 1],
          upToScale: true,
          explain: `$A - 6I = ${m(-1, 2, 2, -4)}$, so $-x + 2y = 0$: $x = 2y$, e.g. $${v(2, 1)}$.`,
          traps: [{ answer: [0, 0], misconception: "zero-is-eigenvector", message: "The zero vector always solves it, but it never counts." }],
        },
        {
          kind: "vector",
          id: "fe-produce-2",
          prompt: `Same matrix, $\\lambda = 1$. Find an eigenvector.`,
          answer: [1, -2],
          upToScale: true,
          explain: `$A - I = ${m(4, 2, 2, 1)}$, so $2x + y = 0$: e.g. $${v(1, -2)}$. It's perpendicular to $${v(2, 1)}$.`,
          traps: [{ answer: [0, 0], misconception: "zero-is-eigenvector", message: "Not the zero vector." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "fe-review-1",
      prompt: `$${m(2, 1, 1, 2)}$ has eigenvalue 1. Find an eigenvector.`,
      answer: [1, -1],
      upToScale: true,
      explain: `$A - I = ${m(1, 1, 1, 1)}$: $x + y = 0$.`,
    },
  ],
};

const eigenbasis: ConceptNode = {
  id: "eigenbasis",
  title: "Eigenbasis: powers made easy",
  summary: "In a basis of eigenvectors A just stretches each axis, so Aⁿ multiplies each part by λⁿ.",
  deps: ["finding-eigenvectors", "basis"],
  pos: { x: 4, y: 1 },
  glossary: [{ term: "eigenbasis", meaning: "A basis made of eigenvectors. In it, the matrix just stretches each axis." }],
  misconceptions: {
    "power-entries": "Thinks Aⁿ is computed by raising each entry to the n-th power.",
  },
  steps: [
    {
      type: "motivate",
      title: "Doing it 100 times",
      body: "Apply a matrix 100 times in a row: $A^{100}\\vec x$. Multiplying 100 matrices is painful. Is there a shortcut?",
      realWorld: {
        title: "Where will everyone be?",
        body: "Each year some people move from city to suburbs and back, captured by a matrix. Where's everyone in 50 years? That's $A^{50}$ times today's numbers.",
      },
    },
    {
      type: "truth",
      statement: "For an eigenvector, $A^n\\vec v = \\lambda^n\\vec v$.",
      body: "Each application of $A$ stretches $\\vec v$ by $\\lambda$ again. No matrix multiplication needed.",
    },
    {
      type: "truth",
      statement: "If $\\vec x = c_1\\vec v_1 + c_2\\vec v_2$ in an eigenbasis, then $A^n\\vec x = c_1\\lambda_1^n\\vec v_1 + c_2\\lambda_2^n\\vec v_2$.",
      body: "Split $\\vec x$ into eigen-parts (*basis*: coordinates are weights), power each eigenvalue, add back up. In the long run the biggest |λ| dominates.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "eb-check-1",
        prompt: `What is $${m(2, 1, 1, 2)}^2$?`,
        options: [
          { id: "a", text: `$${m(5, 4, 4, 5)}$`, correct: true, why: "Multiply A by itself: first entry 2·2 + 1·1 = 5." },
          { id: "b", text: `$${m(4, 1, 1, 4)}$`, misconception: "power-entries", why: "Squaring a matrix means applying it twice, not squaring each entry." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "This is why PageRank works: applying the web's link matrix over and over, everything lines up with the eigenvector of the biggest eigenvalue. Recurrent networks face the same maths: repeated multiplication either explodes or fades depending on |λ|.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "eb-produce-1",
          prompt: `$${v(1, 1)}$ is an eigenvector of $A = ${m(2, 1, 1, 2)}$ with $\\lambda = 3$. Compute $A^5${v(1, 1)}$.`,
          answer: [243, 243],
          explain: "$3^5 = 243$, so $A^5\\vec v = 243\\vec v$.",
          traps: [{ answer: [32, 32], misconception: "power-entries", message: "Power the eigenvalue 3, not the entries." }],
        },
        {
          kind: "vector",
          id: "eb-produce-2",
          prompt: `Same $A$. $${v(1, -1)}$ has $\\lambda = 1$. Compute $A^4${v(1, -1)}$.`,
          answer: [1, -1],
          explain: "$1^4 = 1$: it never changes.",
        },
        {
          kind: "vector",
          id: "eb-produce-3",
          prompt: `Same $A$. Write $${v(2, 0)} = ${v(1, 1)} + ${v(1, -1)}$ and compute $A^3${v(2, 0)}$.`,
          answer: [28, 26],
          explain: `$3^3${v(1, 1)} + 1^3${v(1, -1)} = ${v(27, 27)} + ${v(1, -1)} = ${v(28, 26)}$.`,
          traps: [{ answer: [8, 0], misconception: "power-entries", message: "That cubes the entries. Split into eigen-parts first." }],
        },
      ],
    },
  ],
  review: [
    {
      kind: "vector",
      id: "eb-review-1",
      prompt: `$${v(1, 0)}$ is an eigenvector of $${m(2, 5, 0, 3)}$ with $\\lambda = 2$. Compute $A^3${v(1, 0)}$.`,
      answer: [8, 0],
      explain: "$2^3 = 8$.",
    },
  ],
};

const pca: ConceptNode = {
  id: "pca",
  title: "PCA: directions of spread",
  summary: "The top eigenvector of a dataset's covariance matrix is the direction of greatest spread; its eigenvalue is that spread.",
  deps: ["eigenbasis"],
  pos: { x: 5, y: 1 },
  glossary: [
    { term: "covariance matrix", meaning: "A symmetric matrix summarising how a dataset spreads and how its features move together. Defined properly in the statistics track." },
    { term: "principal component", meaning: "An eigenvector of the covariance matrix: a direction of spread, ranked by its eigenvalue." },
  ],
  misconceptions: {
    "smallest-eigen": "Picks the eigenvector with the smallest eigenvalue as the main direction.",
  },
  steps: [
    {
      type: "motivate",
      title: "Too many columns",
      body: "A dataset with 1,000 columns is impossible to look at. Can we find a few directions that capture most of what's going on?",
      realWorld: {
        title: "Face recognition",
        body: "Early face-recognition systems turned each photo into a long vector and kept only its top principal components (\"eigenfaces\"): a few dozen numbers instead of thousands of pixels.",
      },
    },
    {
      type: "explore",
      title: "Find the longest shadow",
      body: "Each blue point casts a yellow shadow onto the line. The bar shows how spread out the shadows are.",
      widget: { kind: "spread", points: CLOUD },
      task: "Turn the line to make the shadows spread out as much as possible.",
    },
    {
      type: "truth",
      statement: "A dataset's **covariance matrix** $C$ is symmetric, and the spread of the data along a unit direction $\\vec u$ is $\\vec u^\\top C\\vec u$.",
      body: "Symmetric matrices always have real eigenvalues and perpendicular eigenvectors. Take that at face value for now; the statistics track builds $C$ properly.",
    },
    {
      type: "truth",
      statement: "The direction of **greatest spread** is the eigenvector of $C$ with the **largest** eigenvalue, and that eigenvalue is the spread along it.",
      body: "That's PCA: rotate onto the eigenvectors of $C$ (an eigenbasis), rank them by eigenvalue, and keep the top few.",
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "pca-check-1",
        prompt: `A dataset's covariance matrix is $${m(4, 0, 0, 1)}$. Along which direction is it most spread out?`,
        options: [
          { id: "a", text: "Along the x-axis", correct: true, why: "î has eigenvalue 4, the bigger one." },
          { id: "b", text: "Along the y-axis", misconception: "smallest-eigen", why: "ĵ has eigenvalue 1: the least spread." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "`sklearn.decomposition.PCA` does exactly this: builds the covariance matrix, finds its eigenvectors, sorts by eigenvalue. Its `explained_variance_ratio_` is each eigenvalue divided by the total.",
    },
    {
      type: "produce",
      body: "Unaided. All three right turns this **solid**.",
      items: [
        {
          kind: "vector",
          id: "pca-produce-1",
          prompt: `A covariance matrix is $C = ${m(5, 2, 2, 2)}$ (eigenvalues 6 and 1). Give the first principal component's direction. (Any multiple counts.)`,
          answer: [2, 1],
          upToScale: true,
          explain: `The eigenvector for the biggest eigenvalue, 6: $${v(2, 1)}$.`,
          traps: [{ answer: [1, -2], misconception: "smallest-eigen", message: "That's the direction of least spread (λ = 1)." }],
        },
        {
          kind: "number",
          id: "pca-produce-2",
          prompt: "Same $C$. How much spread (variance) lies along the first principal component?",
          answer: 6,
          explain: "The eigenvalue itself: 6.",
        },
        {
          kind: "number",
          id: "pca-produce-3",
          prompt: "Same $C$. Keeping only the first component, what **fraction** of the total variance do you keep? (A decimal, two places is fine.)",
          answer: 6 / 7,
          tolerance: 0.01,
          explain: "Total variance = sum of eigenvalues = 7. Kept: 6/7 ≈ 0.86.",
        },
      ],
    },
  ],
  review: [
    {
      kind: "number",
      id: "pca-review-1",
      prompt: `Covariance eigenvalues are 9, 3 and 0. What fraction of variance do the top **two** components keep?`,
      answer: 1,
      explain: "(9 + 3) / 12 = 1: the third direction has no spread at all.",
    },
  ],
};

export const unit3: Unit = {
  id: "la-3",
  track: "Linear algebra",
  title: "Eigenvectors & PCA",
  blurb: "The directions a matrix doesn't turn, and how they find the shape of data.",
  nodes: [eigenvector, eigenvalue, findingValues, findingVectors, eigenbasis, pca],
};
