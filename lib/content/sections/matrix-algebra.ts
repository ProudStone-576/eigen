import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Matrices: order and types (square, diagonal, scalar, identity, triangular, symmetric, skew-symmetric), equality, addition and scalar multiples, matrix multiplication and its non-commutativity, transpose and its properties, trace, powers, idempotent, nilpotent and involutory matrices. */

type M2 = [[number, number], [number, number]];
const mul = (a: M2, b: M2): M2 => [
  [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
  [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
];
const tex = (m: M2) => `\\begin{bmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{bmatrix}`;

const base: ConceptNode = {
  id: "matrix-algebra",
  title: "Matrices & their algebra",
  summary: "A matrix is a rectangular array of numbers. Matrices of the same order add entry by entry, but they multiply row-by-column: the (i, j) entry of AB is row i of A dotted with column j of B. That product is usually not commutative, AB ≠ BA. Transposing swaps rows and columns, reverses products, (AB)ᵀ = BᵀAᵀ, and splits every square matrix into a symmetric part and a skew-symmetric part.",
  deps: ["functions-basics", "linear-equations"],
  pos: { x: 0, y: 0 },
  glossary: [
    { term: "order", meaning: "$m \\times n$: $m$ rows and $n$ columns." },
    { term: "symmetric", meaning: "$A^{\\mathsf T} = A$; skew-symmetric means $A^{\\mathsf T} = -A$, which forces zeros on the diagonal." },
    { term: "trace", meaning: "$\\operatorname{tr}A$: the sum of the diagonal entries of a square matrix." },
  ],
  misconceptions: {
    "matrix-commute": "Assumes $AB = BA$ for matrices.",
    "elementwise-product": "Multiplies matrices entry by entry instead of row by column.",
  },
  steps: [
    {
      type: "motivate",
      title: "Tables that multiply",
      body: "A shop sells 3 products in 2 branches; prices are a $3 \\times 1$ column, quantities a $2 \\times 3$ table. Revenue per branch is one matrix product. Matrices also encode systems of equations and geometric transformations, and the JEE chapter on them rewards fluency with their algebra, especially the facts that fail for matrices but hold for numbers.",
      realWorld: {
        title: "Graphics pipelines",
        body: "Every frame of a 3D game multiplies millions of vertex coordinates by $4 \\times 4$ matrices that rotate, scale and project them. The order of the matrices in the product decides whether an object is rotated then moved, or moved then rotated: two very different pictures.",
      },
    },
    {
      type: "truth",
      statement: "If $A$ is $m \\times n$ and $B$ is $n \\times p$, then $AB$ is $m \\times p$ with $(AB)_{ij} = \\sum_ka_{ik}b_{kj}$. Multiplication is associative, $(AB)C = A(BC)$, and distributive, but **not commutative**: in general $AB \\ne BA$, and $AB = O$ doesn't force $A = O$ or $B = O$. The **transpose** satisfies $(A^{\\mathsf T})^{\\mathsf T} = A$, $(A + B)^{\\mathsf T} = A^{\\mathsf T} + B^{\\mathsf T}$ and $(AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}$. Every square matrix is $A = \\tfrac12(A + A^{\\mathsf T}) + \\tfrac12(A - A^{\\mathsf T})$, symmetric plus skew-symmetric.",
      body: "Types: **square** ($n \\times n$), **diagonal** (zeros off the diagonal), **scalar** ($kI$), **identity** $I$ ($AI = IA = A$), **zero** $O$, **upper/lower triangular**. Special square matrices: **idempotent** $A^2 = A$, **nilpotent** $A^k = O$ for some $k$, **involutory** $A^2 = I$, **orthogonal** $AA^{\\mathsf T} = I$. Because $AB \\ne BA$, identities like $(A + B)^2 = A^2 + 2AB + B^2$ fail; the correct expansion is $A^2 + AB + BA + B^2$. The trace satisfies $\\operatorname{tr}(A + B) = \\operatorname{tr}A + \\operatorname{tr}B$ and $\\operatorname{tr}(AB) = \\operatorname{tr}(BA)$. Matrices as transformations of the plane are developed in §{matrix-transform}.",
    },
    {
      type: "predict",
      misconception: "matrix-commute",
      item: {
        kind: "mc",
        id: "mal-predict-1",
        prompt: `$A = ${tex([[1, 1], [0, 1]])}$ and $B = ${tex([[1, 0], [1, 1]])}$. Compare $AB$ and $BA$.`,
        options: [
          { id: "a", text: `$AB = ${tex([[2, 1], [1, 1]])}$ but $BA = ${tex([[1, 1], [1, 2]])}$: different`, correct: true, why: "Row-by-column products in the two orders." },
          { id: "b", text: "They are equal, as for numbers", misconception: "matrix-commute", why: "Matrix multiplication isn't commutative." },
          { id: "c", text: `Both equal $${tex([[1, 0], [0, 1]])}$`, why: "Compute the entries." },
        ],
      },
      reveal: {
        body: "$AB$: first row $(1, 1)$ times columns $(1, 1)$ and $(0, 1)$ gives 2 and 1; second row $(0, 1)$ gives 1 and 1. $BA$ comes out differently. As transformations, $A$ and $B$ are shears in different directions, and shearing one way then the other isn't the same as the reverse order. Commuting is the exception (for example any matrix with $I$, or with its own powers).",
      },
      resolve: {
        kind: "mc",
        id: "mal-resolve-1",
        prompt: "For square matrices $A$ and $B$, $(A + B)^2$ equals",
        options: [
          { id: "a", text: "$A^2 + AB + BA + B^2$", correct: true, why: "Expand without swapping factors." },
          { id: "b", text: "$A^2 + 2AB + B^2$", misconception: "matrix-commute", why: "That assumes $AB = BA$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mal-check-1",
        prompt: `$${tex([[1, 2], [3, 4]])}${tex([[2, 0], [1, 3]])}$ has top-left entry`,
        options: [
          { id: "a", text: "4", correct: true, why: "Row $(1, 2)$ · column $(2, 1)$ $= 2 + 2$." },
          { id: "b", text: "2", misconception: "elementwise-product", why: "That multiplies the top-left entries only." },
          { id: "c", text: "8", why: "Use the first column of the second matrix." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "mal-check-2",
        prompt: "$A$ is $2 \\times 3$ and $B$ is $3 \\times 4$. Which products exist?",
        options: [
          { id: "a", text: "$AB$ (order $2 \\times 4$) only", correct: true, why: "Inner dimensions must match." },
          { id: "b", text: "$AB$ and $BA$", why: "$BA$ needs $4 = 2$." },
          { id: "c", text: "neither", why: "$AB$ works: $3 = 3$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "A neural-network layer is a matrix product $Wx + b$ (§{layer}); a batch of inputs stacked as rows makes it one matrix–matrix product, the operation GPUs are built for. Element-wise products also appear (the Hadamard product, written $\\odot$), which is exactly why the two must not be confused.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "mal-produce-1", prompt: `Find the bottom-right entry of $${tex([[1, 2], [3, 4]])}${tex([[2, 0], [1, 3]])}$.`, answer: 12, explain: "$3 \\times 0 + 4 \\times 3$." },
        { kind: "number", id: "mal-produce-2", prompt: `$A = ${tex([[0, 1], [0, 0]])}$. Find the sum of the entries of $A^2$.`, answer: 0, explain: "$A$ is nilpotent: $A^2 = O$." },
        {
          kind: "mc",
          id: "mal-produce-3",
          prompt: "For matrices with $AB$ defined, $(AB)^{\\mathsf T}$ equals",
          options: [
            { id: "a", text: "$B^{\\mathsf T}A^{\\mathsf T}$", correct: true, why: "Transposing reverses the order." },
            { id: "b", text: "$A^{\\mathsf T}B^{\\mathsf T}$", misconception: "matrix-commute", why: "That would need the factors to commute." },
          ],
        },
        {
          kind: "mc",
          id: "mal-produce-4",
          prompt: `The product $${tex([[1, 0], [0, 2]])}${tex([[3, 1], [1, 3]])}$ is`,
          options: [
            { id: "a", text: `$${tex([[3, 1], [2, 6]])}$`, correct: true, why: "Row by column: the diagonal matrix scales the rows." },
            { id: "b", text: `$${tex([[3, 0], [0, 6]])}$`, misconception: "elementwise-product", why: "That multiplies matching entries." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "mal-review-1", prompt: `Find the trace of $${tex([[3, 7], [-2, 5]])}$.`, answer: 8, explain: "$3 + 5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "symmetric and skew-symmetric parts",
      body: "$P = \\tfrac12(A + A^{\\mathsf T})$ is symmetric and $Q = \\tfrac12(A - A^{\\mathsf T})$ is skew-symmetric, with $A = P + Q$, uniquely. A skew-symmetric matrix has zero diagonal, since $a_{ii} = -a_{ii}$. For any $A$, $AA^{\\mathsf T}$ and $A^{\\mathsf T}A$ are symmetric.",
    },
    {
      type: "definition",
      term: "powers",
      body: "Powers of a square matrix are defined by repeated multiplication, and they commute with each other. Patterns help: $\\begin{bmatrix} 1 & a \\\\ 0 & 1 \\end{bmatrix}^n = \\begin{bmatrix} 1 & na \\\\ 0 & 1 \\end{bmatrix}$; a diagonal matrix's powers are its diagonal entries' powers; and if $A^2 = A$, then $A^n = A$ for all $n \\ge 1$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "transpose of a product",
      statement: "$(AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}$.",
      proof: ["$((AB)^{\\mathsf T})_{ij} = (AB)_{ji} = \\sum_ka_{jk}b_{ki} = \\sum_k(B^{\\mathsf T})_{ik}(A^{\\mathsf T})_{kj} = (B^{\\mathsf T}A^{\\mathsf T})_{ij}$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "trace of a product",
      statement: "$\\operatorname{tr}(AB) = \\operatorname{tr}(BA)$ whenever both products are square.",
      proof: ["Both equal $\\sum_i\\sum_ka_{ik}b_{ki}$, the sum of every product of an entry of $A$ with the transposed entry of $B$."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "what fails for matrices",
      statement: "$AB \\ne BA$ in general; $AB = O$ is possible with $A, B \\ne O$; $AB = AC$ doesn't imply $B = C$ unless $A$ is invertible; $(A + B)^2 \\ne A^2 + 2AB + B^2$ unless $AB = BA$.",
      proof: ["Counterexamples: $\\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}^2 = O$, and the two shears above don't commute."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: `Find $${tex([[1, 2], [3, 4]])}${tex([[2, 0], [1, 3]])}$.`,
      solution: ["Top row: $(2 + 2, 0 + 6) = (4, 6)$. Bottom row: $(6 + 4, 0 + 12) = (10, 12)$.", `Result $${tex([[4, 6], [10, 12]])}$.`],
      result: `$${tex([[4, 6], [10, 12]])}$.`,
    },
    {
      type: "example",
      level: 2,
      title: "a power",
      problem: `Find $${tex([[1, 2], [0, 1]])}^{10}$.`,
      solution: [`Compute $A^2 = ${tex([[1, 4], [0, 1]])}$: the top-right entry adds 2 each time.`, `So $A^{10} = ${tex([[1, 20], [0, 1]])}$ (prove by induction, §{induction}).`],
      result: "$\\begin{bmatrix} 1 & 20 \\\\ 0 & 1 \\end{bmatrix}$.",
    },
    {
      type: "example",
      level: 3,
      title: "symmetric plus skew",
      problem: `Write $A = ${tex([[2, 5], [1, 3]])}$ as symmetric plus skew-symmetric.`,
      solution: [`$P = \\tfrac12(A + A^{\\mathsf T}) = ${tex([[2, 3], [3, 3]])}$.`, `$Q = \\tfrac12(A - A^{\\mathsf T}) = ${tex([[0, 2], [-2, 0]])}$, and $P + Q = A$.`],
      result: "$P + Q$ as shown.",
    },
  ],
  pitfalls: [
    { wrong: "$AB = BA$.", right: "Order matters; check both products." },
    { wrong: "Multiply matrices entry by entry.", right: "Row of the first times column of the second." },
    { wrong: "$(AB)^{\\mathsf T} = A^{\\mathsf T}B^{\\mathsf T}$.", right: "$(AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}$." },
  ],
  formulas: [
    { label: "Product entry", tex: "(AB)_{ij} = \\textstyle\\sum_ka_{ik}b_{kj}" },
    { label: "Transpose", tex: "(AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}" },
    { label: "Decomposition", tex: "A = \\tfrac12(A + A^{\\mathsf T}) + \\tfrac12(A - A^{\\mathsf T})" },
    { label: "Trace", tex: "\\operatorname{tr}(AB) = \\operatorname{tr}(BA)" },
  ],
  exercises: [
    ex(1, num("malx-ex-1", "A matrix has order $3 \\times 4$. How many entries has it?", 12, "$3 \\times 4$."), ["$12$."]),
    ex(1, num("malx-ex-2", `Find the top-right entry of $${tex([[2, 1], [0, 3]])}${tex([[1, 4], [2, 1]])}$.`, 9, "$2 \\times 4 + 1 \\times 1$."), ["$9$."]),
    ex(2, num("malx-ex-3", `$A = ${tex([[1, 3], [0, 1]])}$. Find the top-right entry of $A^5$.`, 15, "It adds 3 each power."), ["$15$."]),
    ex(2, num("malx-ex-4", "A skew-symmetric $3 \\times 3$ matrix has how many independent entries?", 3, "Diagonal zero; the lower triangle copies the upper with a sign change."), ["$3$."]),
    ex(2, num("malx-ex-5", `Find $\\operatorname{tr}(AB)$ for $A = ${tex([[1, 2], [3, 4]])}$, $B = ${tex([[2, 0], [1, 3]])}$.`, 16, "$4 + 12$."), ["$16$, equal to $\\operatorname{tr}(BA)$."]),
    ex(3, num("malx-ex-6", `$A = ${tex([[2, -2], [1, -1]])}$. Find the smallest $n \\ge 2$ with $A^n = A$.`, 2, "Check $A^2$."), ["$A^2 = A$: idempotent."]),
    ex(3, mc("malx-ex-7", "If $A$ is symmetric, then $B^{\\mathsf T}AB$ is", ["symmetric", "$(B^{\\mathsf T}AB)^{\\mathsf T} = B^{\\mathsf T}A^{\\mathsf T}B = B^{\\mathsf T}AB$."], [["skew-symmetric", "Transpose it and see."], ["not necessarily either", "It is always symmetric."]]), ["Reverse the order when transposing."]),
    ex(3, mc("malx-ex-8", "$A$ and $B$ are $2 \\times 2$ with $AB = O$. Then", ["it is possible that neither $A$ nor $B$ is $O$", "E.g. $A = B = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}$."], [["$A = O$ or $B = O$", "That holds for numbers, not matrices."], ["$BA = O$ too", "Not necessarily."]]), ["Zero divisors exist among matrices."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const a: M2 = [[r.int(-3, 4), r.int(-3, 4)], [r.int(-3, 4), r.int(-3, 4)]];
      const b: M2 = [[r.int(-3, 4), r.int(-3, 4)], [r.int(-3, 4), r.int(-3, 4)]];
      const i = r.int(0, 1);
      const j = r.int(0, 1);
      const p = mul(a, b);
      const pos = `${i === 0 ? "top" : "bottom"}-${j === 0 ? "left" : "right"}`;
      return n(`Find the ${pos} entry of $${tex(a)}${tex(b)}$.`, p[i][j], `Row ${i + 1} of the first times column ${j + 1} of the second: $${a[i][0]} \\times ${b[0][j]} + ${a[i][1]} \\times ${b[1][j]} = ${p[i][j]}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const k = r.nonzero(-4, 5);
      const nn = r.int(3, 20);
      return n(`$A = ${tex([[1, k], [0, 1]])}$. Find the top-right entry of $A^{${nn}}$.`, k * nn, `Each power adds ${k}: $${nn} \\times ${k}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const a: M2 = [[r.int(-5, 9), r.int(-5, 9)], [r.int(-5, 9), r.int(-5, 9)]];
      const b: M2 = [[r.int(-5, 9), r.int(-5, 9)], [r.int(-5, 9), r.int(-5, 9)]];
      const p = mul(a, b);
      return n(`Find $\\operatorname{tr}(AB)$ for $A = ${tex(a)}$ and $B = ${tex(b)}$.`, p[0][0] + p[1][1], `Diagonal of $AB$: $${p[0][0]} + ${p[1][1]}$.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const v = r.pick([
        ["(A + B)^2", "A^2 + AB + BA + B^2", "A^2 + 2AB + B^2"],
        ["(A - B)(A + B)", "A^2 + AB - BA - B^2", "A^2 - B^2"],
        ["(AB)^2", "ABAB", "A^2B^2"],
      ] as const);
      return mcNumbers(
        `For general square matrices, $${v[0]}$ equals`,
        { text: `$${v[1]}$`, why: "Expand without swapping the order of factors." },
        [{ text: `$${v[2]}$`, why: "That assumes $AB = BA$.", misconception: "matrix-commute" }],
      );
    },
  },
];
