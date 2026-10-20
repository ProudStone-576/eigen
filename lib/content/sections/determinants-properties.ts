import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Determinants of order 2 and 3: cofactor expansion, row and column operations, properties (transpose, swaps, scaling, equal rows, adding multiples), det(AB) and det(kA); factor theorem for determinants; area of a triangle and collinearity. */

type M3 = number[][];
const det2 = (a: number, b: number, c: number, d: number) => a * d - b * c;
const det3 = (m: M3) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const tex3 = (m: M3) => `\\begin{vmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;

const base: ConceptNode = {
  id: "determinants-properties",
  title: "Determinants & their properties",
  summary: "The determinant of a square matrix is a single number: for 2 × 2 it is ad − bc, and larger ones expand along a row using cofactors. Its properties do most of the work in exams: swapping rows flips the sign, scaling a row scales the determinant, adding a multiple of one row to another changes nothing, and two equal rows give zero. It multiplies, det(AB) = det A · det B, and it measures area.",
  deps: ["matrix-algebra"],
  pos: { x: 1, y: 0 },
  glossary: [
    { term: "minor", meaning: "$M_{ij}$: the determinant left after deleting row $i$ and column $j$." },
    { term: "cofactor", meaning: "$C_{ij} = (-1)^{i+j}M_{ij}$." },
    { term: "singular", meaning: "A square matrix with determinant 0; it has no inverse." },
  ],
  misconceptions: {
    "det-kA": "Thinks $\\det(kA) = k\\det A$ for an $n \\times n$ matrix, instead of $k^n\\det A$.",
    "det-sum": "Thinks $\\det(A + B) = \\det A + \\det B$.",
  },
  steps: [
    {
      type: "motivate",
      title: "One number for a whole matrix",
      body: "Does a system of three equations have a unique solution? Is a matrix invertible? What is the area of a triangle with given corners? All three answers come from a determinant. JEE determinant questions are usually solved by properties, simplifying rows and columns before expanding, not by brute force.",
      realWorld: {
        title: "Area and volume scaling",
        body: "A linear transformation multiplies every area (in 2D) or volume (in 3D) by the absolute value of its determinant. Computer graphics and physics simulations use this to track how shapes are stretched (§{determinant}).",
      },
    },
    {
      type: "truth",
      statement: "$\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$. For $3 \\times 3$, expand along any row or column: $\\det A = \\sum_ja_{ij}C_{ij}$. Properties: $\\det A^{\\mathsf T} = \\det A$; swapping two rows changes the sign; multiplying a row by $k$ multiplies $\\det$ by $k$, so $\\det(kA) = k^n\\det A$; two equal (or proportional) rows give 0; adding a multiple of one row to another leaves $\\det$ unchanged; $\\det(AB) = \\det A\\det B$. The same holds for columns.",
      body: "Strategy: use row or column operations to create zeros, then expand along the row or column with the most zeros. If putting $x = a$ makes two rows equal, then $(x - a)$ is a factor of the determinant (the factor theorem, §{polynomials}). The area of the triangle with vertices $(x_i, y_i)$ is $\\tfrac12\\left\\lvert\\begin{vmatrix} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{vmatrix}\\right\\rvert$, and the points are collinear exactly when it is 0. There is **no** rule for $\\det(A + B)$ in general.",
    },
    {
      type: "predict",
      misconception: "det-kA",
      item: {
        kind: "mc",
        id: "dtp-predict-1",
        prompt: "$A$ is $3 \\times 3$ with $\\det A = 5$. Then $\\det(2A)$ is",
        options: [
          { id: "a", text: "40", correct: true, why: "Each of the 3 rows is doubled: $2^3 \\times 5$." },
          { id: "b", text: "10", misconception: "det-kA", why: "Doubling the matrix doubles every row, and each row contributes a factor 2." },
          { id: "c", text: "25", why: "That squares the determinant." },
        ],
      },
      reveal: {
        body: "$2A$ multiplies all three rows by 2, and each row operation multiplies the determinant by 2: $2 \\times 2 \\times 2 = 8$, so $\\det(2A) = 40$. Geometrically, doubling every length in 3D multiplies volumes by 8.",
      },
      resolve: {
        kind: "mc",
        id: "dtp-resolve-1",
        prompt: "$A$ is $2 \\times 2$ with $\\det A = 3$. Then $\\det(-A)$ is",
        options: [
          { id: "a", text: "3", correct: true, why: "$(-1)^2 \\times 3$." },
          { id: "b", text: "$-3$", misconception: "det-kA", why: "Two rows each change sign: $(-1)^2 = 1$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dtp-check-1",
        prompt: "$A = I$ and $B = I$ ($2 \\times 2$). Compare $\\det(A + B)$ with $\\det A + \\det B$.",
        options: [
          { id: "a", text: "$\\det(2I) = 4$, but $\\det A + \\det B = 2$", correct: true, why: "Determinants don't add." },
          { id: "b", text: "Both are 2", misconception: "det-sum", why: "$\\det(2I) = 2^2$." },
          { id: "c", text: "Both are 4", why: "$1 + 1 = 2$." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "dtp-check-2",
        prompt: "The points $(1, 2)$, $(3, 6)$ and $(5, 10)$ are",
        options: [
          { id: "a", text: "collinear: the area determinant is 0", correct: true, why: "All lie on $y = 2x$." },
          { id: "b", text: "the vertices of a triangle of area 4", why: "Compute the determinant." },
          { id: "c", text: "impossible to test with determinants", why: "Zero area means collinear." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "The determinant of a covariance matrix measures the volume of the data cloud and appears in the normal density's normalising constant; normalising flows need $\\log\\lvert\\det J\\rvert$ of each layer's Jacobian, so they are designed with triangular Jacobians whose determinant is the product of the diagonal.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "dtp-produce-1", prompt: `Evaluate $${tex3([[2, 1, 3], [0, 4, 5], [0, 0, 6]])}$.`, answer: 48, explain: "Triangular: product of the diagonal." },
        { kind: "number", id: "dtp-produce-2", prompt: "Find the area of the triangle with vertices $(0, 0)$, $(4, 0)$ and $(1, 3)$.", answer: 6, explain: "$\\tfrac12\\lvert 4 \\times 3 - 0 \\times 1\\rvert$." },
        {
          kind: "mc",
          id: "dtp-produce-3",
          prompt: "$\\det A = 2$ for a $4 \\times 4$ matrix. $\\det(3A)$ is",
          options: [
            { id: "a", text: "162", correct: true, why: "$3^4 \\times 2$." },
            { id: "b", text: "6", misconception: "det-kA", why: "Use $k^n$." },
          ],
        },
        {
          kind: "mc",
          id: "dtp-produce-4",
          prompt: "In general, $\\det(A + B)$",
          options: [
            { id: "a", text: "has no formula in terms of $\\det A$ and $\\det B$", correct: true, why: "Only products behave: $\\det(AB) = \\det A\\det B$." },
            { id: "b", text: "equals $\\det A + \\det B$", misconception: "det-sum", why: "False even for $A = B = I$." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "dtp-review-1", prompt: "Evaluate $\\begin{vmatrix} 3 & 5 \\\\ 2 & 4 \\end{vmatrix}$.", answer: 2, explain: "$12 - 10$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "cofactor expansion",
      body: "For $3 \\times 3$ along the first row: $\\det A = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})$, with signs $+ - +$ in the checkerboard pattern. Expanding a row against the cofactors of a **different** row gives 0, a fact used in proving $A\\,\\operatorname{adj}A = \\det A\\,I$ (§{adjoint-systems}).",
    },
    {
      type: "definition",
      term: "special determinants",
      body: "Triangular (or diagonal): the product of the diagonal. Vandermonde: $\\begin{vmatrix} 1 & 1 & 1 \\\\ a & b & c \\\\ a^2 & b^2 & c^2 \\end{vmatrix} = (a - b)(b - c)(c - a)$. Skew-symmetric of odd order: 0, since $\\det A = \\det A^{\\mathsf T} = \\det(-A) = -\\det A$.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "equal rows give zero",
      statement: "If two rows of $A$ are equal, $\\det A = 0$.",
      proof: ["Swapping those rows leaves $A$ unchanged but negates the determinant, so $\\det A = -\\det A$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "adding a multiple of a row",
      statement: "Replacing row $i$ by row $i$ + $k \\times$ row $j$ ($j \\ne i$) leaves the determinant unchanged.",
      proof: ["The determinant is linear in row $i$: the new value is $\\det A + k\\det A'$, where $A'$ has row $j$ in two places, so $\\det A' = 0$."],
    },
    {
      type: "theorem",
      kind: "Formula",
      name: "area by determinant",
      statement: "Triangle $(x_1, y_1), (x_2, y_2), (x_3, y_3)$ has area $\\tfrac12\\lvert x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\\rvert$.",
      proof: ["Expand the $3 \\times 3$ determinant with a column of 1s; it equals the cross product of two side vectors (§{vector})."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: `Evaluate $${tex3([[1, 2, 3], [4, 5, 6], [7, 8, 10]])}$.`,
      solution: ["Expand along row 1: $1(50 - 48) - 2(40 - 42) + 3(32 - 35)$.", "$= 2 + 4 - 9 = -3$."],
      result: "$-3$.",
    },
    {
      type: "example",
      level: 2,
      title: "using properties",
      problem: `Evaluate $${tex3([[1, 1, 1], [1, 2, 3], [1, 3, 6]])}$.`,
      solution: ["$R_2 \\to R_2 - R_1$, $R_3 \\to R_3 - R_1$: rows $(1, 1, 1)$, $(0, 1, 2)$, $(0, 2, 5)$.", "Expand down column 1: $1 \\times (5 - 4) = 1$."],
      result: "1.",
    },
    {
      type: "example",
      level: 3,
      title: "a factor",
      problem: `Factorise $\\begin{vmatrix} 1 & 1 & 1 \\\\ a & b & c \\\\ a^2 & b^2 & c^2 \\end{vmatrix}$.`,
      solution: ["Putting $a = b$ makes two columns equal, so $(a - b)$ is a factor; likewise $(b - c)$, $(c - a)$.", "The determinant has degree 3, so it is $k(a - b)(b - c)(c - a)$; comparing the $bc^2$ term gives $k = 1$."],
      result: "$(a - b)(b - c)(c - a)$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\det(kA) = k\\det A$.", right: "$\\det(kA) = k^n\\det A$ for $n \\times n$." },
    { wrong: "$\\det(A + B) = \\det A + \\det B$.", right: "No such rule; only $\\det(AB) = \\det A\\det B$." },
    { wrong: "Forget the checkerboard signs in cofactor expansion.", right: "$C_{ij} = (-1)^{i+j}M_{ij}$." },
  ],
  formulas: [
    { label: "2 × 2", tex: "ad - bc" },
    { label: "Scaling", tex: "\\det(kA) = k^n\\det A" },
    { label: "Product", tex: "\\det(AB) = \\det A\\det B" },
    { label: "Area", tex: "\\tfrac12\\lvert x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\\rvert" },
  ],
  exercises: [
    ex(1, num("dtpx-ex-1", "Evaluate $\\begin{vmatrix} 4 & -2 \\\\ 3 & 5 \\end{vmatrix}$.", 26, "$20 + 6$."), ["$26$."]),
    ex(1, num("dtpx-ex-2", "$\\det A = 4$ and $\\det B = -3$ for $3 \\times 3$ matrices. Find $\\det(AB)$.", -12, "Determinants multiply."), ["$-12$."]),
    ex(2, num("dtpx-ex-3", `Evaluate $${tex3([[1, 2, 3], [4, 5, 6], [7, 8, 10]])}$.`, det3([[1, 2, 3], [4, 5, 6], [7, 8, 10]]), "Expand along row 1."), ["$-3$."]),
    ex(2, num("dtpx-ex-4", "Find the area of the triangle with vertices $(1, 1)$, $(4, 2)$ and $(2, 5)$.", 5.5, "$\\tfrac12\\lvert 1(2 - 5) + 4(5 - 1) + 2(1 - 2)\\rvert$."), ["$\\tfrac12\\lvert -3 + 16 - 2\\rvert = 5.5$."]),
    ex(2, num("dtpx-ex-5", "For which $k$ are $(1, 2)$, $(3, k)$ and $(5, 6)$ collinear?", 4, "Area 0."), ["$k = 4$."]),
    ex(3, num("dtpx-ex-6", `Evaluate $${tex3([[1, 1, 1], [1, 2, 3], [1, 3, 6]])}$.`, 1, "Row-reduce."), ["$1$."]),
    ex(3, num("dtpx-ex-7", "$A$ is $3 \\times 3$ with $\\det A = 2$. Find $\\det(2A^{\\mathsf T}A)$.", 32, "$2^3 \\times 2 \\times 2$."), ["$8 \\times 4 = 32$."]),
    ex(3, mc("dtpx-ex-8", "A $3 \\times 3$ skew-symmetric matrix has determinant", ["0", "$\\det A = \\det(-A^{\\mathsf T}) = (-1)^3\\det A$."], [["1", "Odd order forces 0."], ["$-1$", "$\\det A = -\\det A$ leaves only 0."]]), ["True for every odd order."]),
  ],
});

const n = (prompt: string, answer: number, explain: string): Item => ({ kind: "number", id: "", prompt, answer, explain });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const [a, b, c, d] = [r.int(-6, 9), r.int(-6, 9), r.int(-6, 9), r.int(-6, 9)];
      return n(`Evaluate $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}$.`, det2(a, b, c, d), `$${a} \\times ${d} - ${b} \\times ${c} = ${det2(a, b, c, d)}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const m: M3 = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => r.int(-3, 4)));
      const v = det3(m);
      return n(`Evaluate $${tex3(m)}$.`, v, `Expand along the first row (or row-reduce first): ${v}.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(2, 4);
      const k = r.pick([-2, -1, 2, 3]);
      const d = r.nonzero(-5, 5);
      return n(`$A$ is $${nn} \\times ${nn}$ with $\\det A = ${d}$. Find $\\det(${k}A)$.`, k ** nn * d, `$(${k})^{${nn}} \\times ${d} = ${k ** nn * d}$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const pts = Array.from({ length: 3 }, () => [r.int(-5, 6), r.int(-5, 6)]);
      const [[x1, y1], [x2, y2], [x3, y3]] = pts;
      const v = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
      return n(`Find the area of the triangle with vertices $(${x1}, ${y1})$, $(${x2}, ${y2})$ and $(${x3}, ${y3})$.`, v, `$\\tfrac12\\lvert x_1(y_2 - y_3) + x_2(y_3 - y_1) + x_3(y_1 - y_2)\\rvert = ${v}$${v === 0 ? " (collinear)" : ""}.`);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const nn = r.pick([2, 3, 4]);
      const k = r.pick([2, 3]);
      const d = r.pick([1, 2, 5]);
      return mcNumbers(
        `$\\det A = ${d}$ for an $${nn} \\times ${nn}$ matrix. $\\det(${k}A)$ equals`,
        { text: `${k ** nn * d}`, why: `$${k}^{${nn}} \\times ${d}$.` },
        [{ text: `${k * d}`, why: "Each row is scaled, giving $k^n$.", misconception: "det-kA" }],
      );
    },
  },
];
