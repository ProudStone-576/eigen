import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Cofactor matrices and the adjoint; the inverse via the adjoint; properties of the inverse and adjoint; Cramer's rule; consistency of linear systems (unique, infinitely many, none); homogeneous systems; the matrix method X = A⁻¹B. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
type M3 = number[][];
const det3 = (m: M3) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

const base: ConceptNode = {
  id: "adjoint-systems",
  title: "Adjoint, inverse & linear systems",
  summary: "The adjoint of a square matrix is the transpose of its matrix of cofactors, and A·adj A = (det A)·I. So when det A ≠ 0, A⁻¹ = adj A / det A. For a system AX = B this gives the unique solution X = A⁻¹B, or Cramer's rule. When det A = 0 the system has either no solution or infinitely many, and the homogeneous system AX = 0 has non-zero solutions exactly then.",
  deps: ["determinants-properties"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "adjoint", meaning: "$\\operatorname{adj}A$: the transpose of the matrix of cofactors $C_{ij}$." },
    { term: "Cramer's rule", meaning: "For $AX = B$ with $\\det A \\ne 0$: $x_i = \\dfrac{\\det A_i}{\\det A}$, where $A_i$ has column $i$ replaced by $B$." },
    { term: "homogeneous system", meaning: "$AX = 0$; it always has the trivial solution $X = 0$." },
  ],
  misconceptions: {
    "det-zero-no-solution": "Thinks $\\det A = 0$ always means the system has no solution.",
    "inverse-entrywise": "Takes the inverse of a matrix to be the matrix of reciprocals of its entries.",
  },
  steps: [
    {
      type: "motivate",
      title: "Solving many equations at once",
      body: "Three unknowns, three equations: elimination works, but JEE also asks whether a system has a solution, how many, and for which values of a parameter. The determinant decides: nonzero means exactly one solution; zero means a degenerate case that needs a closer look.",
      realWorld: {
        title: "Circuit analysis",
        body: "Kirchhoff's laws turn an electrical network into a linear system for the unknown currents; with three loops it is $3 \\times 3$, and Cramer's rule or the inverse gives each current. Larger networks use the same algebra with computers.",
      },
    },
    {
      type: "truth",
      statement: "$A\\,\\operatorname{adj}A = \\operatorname{adj}A\\,A = (\\det A)I$, so $A$ is invertible iff $\\det A \\ne 0$, with $A^{-1} = \\dfrac{\\operatorname{adj}A}{\\det A}$. For $2 \\times 2$: $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\dfrac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$. Properties: $(AB)^{-1} = B^{-1}A^{-1}$, $\\det(A^{-1}) = \\dfrac1{\\det A}$, $\\lvert\\operatorname{adj}A\\rvert = \\lvert A\\rvert^{n-1}$. **Consistency** of $AX = B$: $\\det A \\ne 0$ gives a unique solution $X = A^{-1}B$; if $\\det A = 0$ and $(\\operatorname{adj}A)B \\ne 0$, no solution; if $\\det A = 0$ and $(\\operatorname{adj}A)B = 0$, usually infinitely many (check by elimination).",
      body: "**Cramer's rule** gives each unknown as a ratio of determinants: $x = \\Delta_x/\\Delta$, $y = \\Delta_y/\\Delta$, $z = \\Delta_z/\\Delta$, where $\\Delta_x$ replaces the $x$-column by the constants. If $\\Delta = 0$ but some $\\Delta_x \\ne 0$, the system is inconsistent. A **homogeneous** system $AX = 0$ has only the trivial solution if $\\det A \\ne 0$ and infinitely many if $\\det A = 0$; this is the condition for three planes through the origin to share a line. The inverse is **not** the matrix of reciprocals: that almost never satisfies $AA^{-1} = I$. This links to the geometric view of inverses in §{inverse}.",
    },
    {
      type: "predict",
      misconception: "det-zero-no-solution",
      item: {
        kind: "mc",
        id: "adj-predict-1",
        prompt: "The system $x + y = 2$, $2x + 2y = 4$ has $\\det A = 0$. It has",
        options: [
          { id: "a", text: "infinitely many solutions: the equations describe the same line", correct: true, why: "The second is twice the first." },
          { id: "b", text: "no solution, because the determinant is 0", misconception: "det-zero-no-solution", why: "$\\det A = 0$ means not exactly one; it can be none or infinitely many." },
          { id: "c", text: "exactly one solution", why: "That needs $\\det A \\ne 0$." },
        ],
      },
      reveal: {
        body: "A zero determinant rules out a unique solution, but leaves two cases. If the equations are consistent multiples, as here, every point of the shared line is a solution. If they contradict, such as $x + y = 2$ and $2x + 2y = 5$, there is none. Cramer's determinants tell them apart: here $\\Delta_x = \\Delta_y = 0$ as well.",
      },
      resolve: {
        kind: "mc",
        id: "adj-resolve-1",
        prompt: "$\\det A = 0$ for a system $AX = B$. The system has",
        options: [
          { id: "a", text: "no solution or infinitely many, to be decided by further checks", correct: true, why: "Zero determinant only excludes uniqueness." },
          { id: "b", text: "no solution", misconception: "det-zero-no-solution", why: "Consistent dependent equations have infinitely many." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "adj-check-1",
        prompt: "The inverse of $\\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$ is",
        options: [
          { id: "a", text: "$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$", correct: true, why: "$\\det = 1$; swap the diagonal, negate the off-diagonal." },
          { id: "b", text: "$\\begin{bmatrix} \\tfrac12 & 1 \\\\ \\tfrac15 & \\tfrac13 \\end{bmatrix}$", misconception: "inverse-entrywise", why: "Reciprocals of entries don't give $AA^{-1} = I$." },
          { id: "c", text: "$\\begin{bmatrix} 3 & 1 \\\\ 5 & 2 \\end{bmatrix}$", why: "The off-diagonal signs must change." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "adj-check-2",
        prompt: "$A$ is $3 \\times 3$ with $\\det A = 4$. $\\det(\\operatorname{adj}A)$ is",
        options: [
          { id: "a", text: "16", correct: true, why: "$\\lvert A\\rvert^{n-1} = 4^2$." },
          { id: "b", text: "4", why: "Use $\\lvert A\\rvert^{n-1}$." },
          { id: "c", text: "64", why: "That is $\\lvert A\\rvert^n$." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Least squares solves $X^{\\mathsf T}X\\beta = X^{\\mathsf T}y$; when $X^{\\mathsf T}X$ is singular (perfectly collinear features) there are infinitely many solutions, which ridge regression fixes by adding $\\lambda I$ to make it invertible (§{regularization}). In practice software solves systems by factorisation rather than forming $A^{-1}$.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "adj-produce-1", prompt: "Solve $2x + y = 5$, $5x + 3y = 13$ by the inverse. Give $x$.", answer: 2, explain: "$A^{-1}B = (3 \\cdot 5 - 13, -5 \\cdot 5 + 2 \\cdot 13) = (2, 1)$." },
        { kind: "number", id: "adj-produce-2", prompt: "For which $k$ does $x + 2y + 3z = 0$, $2x + ky + 6z = 0$, $x + y + z = 0$ have non-trivial solutions?", answer: 4, explain: "$\\det = 0$." },
        {
          kind: "mc",
          id: "adj-produce-3",
          prompt: "$x + y = 1$ and $3x + 3y = 3$. The system has",
          options: [
            { id: "a", text: "infinitely many solutions", correct: true, why: "The second equation is 3 times the first." },
            { id: "b", text: "no solution", misconception: "det-zero-no-solution", why: "Consistent dependent equations share every solution." },
          ],
        },
        {
          kind: "mc",
          id: "adj-produce-4",
          prompt: "The inverse of $\\begin{bmatrix} 4 & 0 \\\\ 0 & 5 \\end{bmatrix}$ is",
          options: [
            { id: "a", text: "$\\begin{bmatrix} \\tfrac14 & 0 \\\\ 0 & \\tfrac15 \\end{bmatrix}$", correct: true, why: "For a diagonal matrix, invert each diagonal entry." },
            { id: "b", text: "undefined, because some entries are 0", misconception: "inverse-entrywise", why: "Zero entries are fine; only $\\det A = 0$ blocks an inverse." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "adj-review-1", prompt: "$\\det A = 5$. Find $\\det(A^{-1})$.", answer: 0.2, explain: "$1/5$." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "computing the adjoint",
      body: "Replace each entry by its cofactor $C_{ij} = (-1)^{i+j}M_{ij}$, then transpose. For $3 \\times 3$ this means nine $2 \\times 2$ determinants. Check: $A\\,\\operatorname{adj}A$ should be $(\\det A)I$.",
    },
    {
      type: "definition",
      term: "parameters and consistency",
      body: "For a system depending on $k$: find the values making $\\Delta = 0$; for other $k$ the solution is unique. At each critical $k$, compute $\\Delta_x, \\Delta_y, \\Delta_z$: if any is nonzero, there is no solution; if all are zero, eliminate to see whether the equations agree (infinitely many) or clash (none).",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Proposition",
      name: "A adj A = (det A) I",
      statement: "For any square $A$, $A\\,\\operatorname{adj}A = \\operatorname{adj}A\\,A = (\\det A)I$.",
      proof: ["Entry $(i, j)$ of $A\\,\\operatorname{adj}A$ is $\\sum_ka_{ik}C_{jk}$: row $i$ of $A$ against the cofactors of row $j$. For $i = j$ it is the expansion of $\\det A$; for $i \\ne j$ it is the determinant of a matrix with two equal rows, 0 (§{determinants-properties})."],
    },
    {
      type: "theorem",
      name: "Cramer's rule",
      statement: "If $\\det A \\ne 0$, the unique solution of $AX = B$ has $x_i = \\dfrac{\\det A_i}{\\det A}$, where $A_i$ is $A$ with column $i$ replaced by $B$.",
      proof: ["$X = A^{-1}B = \\dfrac{\\operatorname{adj}A\\,B}{\\det A}$, and the $i$th entry of $\\operatorname{adj}A\\,B$ is $\\sum_kC_{ki}b_k$, the cofactor expansion of $\\det A_i$ down column $i$."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "determinant of the adjoint",
      statement: "For $n \\times n$ $A$, $\\det(\\operatorname{adj}A) = (\\det A)^{n-1}$, and $\\operatorname{adj}(\\operatorname{adj}A) = (\\det A)^{n-2}A$.",
      proof: ["Take determinants of $A\\,\\operatorname{adj}A = (\\det A)I$: $\\det A\\det(\\operatorname{adj}A) = (\\det A)^n$; divide (when $\\det A \\ne 0$, then extend by continuity)."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      problem: "Find the inverse of $\\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$ and solve $2x + y = 5$, $5x + 3y = 13$.",
      solution: ["$\\det = 1$: $A^{-1} = \\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$.", "$X = A^{-1}\\begin{bmatrix} 5 \\\\ 13 \\end{bmatrix} = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}$."],
      result: "$x = 2$, $y = 1$.",
    },
    {
      type: "example",
      level: 2,
      title: "Cramer's rule",
      problem: "Solve $x + y + z = 6$, $x - y + z = 2$, $2x + y - z = 1$.",
      solution: ["$\\Delta = \\begin{vmatrix} 1 & 1 & 1 \\\\ 1 & -1 & 1 \\\\ 2 & 1 & -1 \\end{vmatrix} = 6$; $\\Delta_x = 6$, $\\Delta_y = 12$, $\\Delta_z = 18$.", "$x = 1$, $y = 2$, $z = 3$."],
      result: "$(1, 2, 3)$.",
    },
    {
      type: "example",
      level: 3,
      title: "a parameter",
      problem: "For which $k$ does $x + 2y + 3z = 0$, $2x + ky + 6z = 0$, $x + y + z = 0$ have non-trivial solutions?",
      solution: ["$\\Delta = 1(k - 6) - 2(2 - 6) + 3(2 - k) = k - 6 + 8 + 6 - 3k = 8 - 2k$.", "$\\Delta = 0$ at $k = 4$."],
      result: "$k = 4$.",
    },
  ],
  pitfalls: [
    { wrong: "$\\det A = 0$ means no solution.", right: "It means not a unique one: none or infinitely many." },
    { wrong: "Invert a matrix entry by entry.", right: "$A^{-1} = \\operatorname{adj}A/\\det A$." },
    { wrong: "$(AB)^{-1} = A^{-1}B^{-1}$.", right: "$(AB)^{-1} = B^{-1}A^{-1}$." },
  ],
  formulas: [
    { label: "Inverse", tex: "A^{-1} = \\dfrac{\\operatorname{adj}A}{\\det A}" },
    { label: "2 × 2", tex: "\\tfrac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}" },
    { label: "Cramer", tex: "x_i = \\det A_i/\\det A" },
    { label: "Adjoint", tex: "\\lvert\\operatorname{adj}A\\rvert = \\lvert A\\rvert^{n-1}" },
  ],
  exercises: [
    ex(1, num("adjx-ex-1", "Find the top-left entry of the inverse of $\\begin{bmatrix} 4 & 7 \\\\ 2 & 6 \\end{bmatrix}$.", 0.6, "$6/10$."), ["$\\det = 10$; entry $6/10 = 0.6$."]),
    ex(1, num("adjx-ex-2", "$\\det A = 3$ for $2 \\times 2$ $A$. Find $\\det(\\operatorname{adj}A)$.", 3, "$\\lvert A\\rvert^{1}$."), ["$3$."]),
    ex(2, num("adjx-ex-3", "Solve $x + y + z = 6$, $x - y + z = 2$, $2x + y - z = 1$. Give $z$.", 3, "Cramer: $\\Delta_z/\\Delta = 18/6$."), ["$3$."]),
    ex(2, num("adjx-ex-4", "For which $k$ has $kx + 2y = 3$, $3x + 6y = 5$ no unique solution?", 1, "$6k - 6 = 0$."), ["$k = 1$ (then the system is inconsistent)."]),
    ex(2, num("adjx-ex-5", "$\\det A = 2$ for $3 \\times 3$ $A$. Find $\\det(\\operatorname{adj}(\\operatorname{adj}A))$.", 16, "$\\lvert\\operatorname{adj}A\\rvert^2 = (2^2)^2$."), ["$16$."]),
    ex(3, num("adjx-ex-6", "For which $k$ does $x + 2y + 3z = 0$, $2x + ky + 6z = 0$, $x + y + z = 0$ have non-trivial solutions?", 4, "$8 - 2k = 0$."), ["$4$."]),
    ex(3, fr("adjx-ex-7", "Solve by Cramer's rule: $2x + 3y = 7$, $4x - y = 3$. Give $y$.", 11 / 7, "$\\Delta = -14$, $\\Delta_y = -22$."), ["$\\tfrac{11}{7}$; $x = \\tfrac{8}{7}$."]),
    ex(3, mc("adjx-ex-8", "$x + y + z = 1$, $x + 2y + 3z = 2$, $2x + 3y + 4z = 4$ has", ["no solution", "Row 3 should be row 1 + row 2, giving 3, not 4."], [["infinitely many solutions", "The constants clash."], ["a unique solution", "$\\Delta = 0$."]]), ["$\\Delta = 0$ and the equations are inconsistent."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      let a = r.int(-4, 6), b = r.int(-4, 6), c = r.int(-4, 6), d = r.int(-4, 6);
      if (a * d - b * c === 0) { a += 1; d += 2; }
      if (a * d - b * c === 0) { b += 1; }
      const det = a * d - b * c;
      const pos = r.pick([[0, 0], [0, 1], [1, 0], [1, 1]] as const);
      const inv = [[d / det, -b / det], [-c / det, a / det]];
      const v = inv[pos[0]][pos[1]];
      return n(`Find the ${pos[0] === 0 ? "top" : "bottom"}-${pos[1] === 0 ? "left" : "right"} entry of the inverse of $\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}$ (3 decimals).`, Math.round(v * 1000) / 1000, `$\\det = ${det}$; $A^{-1} = \\tfrac1{${det}}\\begin{bmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{bmatrix}$.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const [x, y, z] = [r.int(-3, 4), r.int(-3, 4), r.int(-3, 4)];
      let A: M3 = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => r.int(-2, 3)));
      if (det3(A) === 0) A = [[1, 1, 1], [1, -1, 1], [2, 1, -1]];
      const B = A.map((row) => row[0] * x + row[1] * y + row[2] * z);
      const want = r.pick(["x", "y", "z"] as const);
      const eq = (row: number[], b: number) => `${row[0]}x ${row[1] < 0 ? "-" : "+"} ${Math.abs(row[1])}y ${row[2] < 0 ? "-" : "+"} ${Math.abs(row[2])}z = ${b}`;
      return n(`Solve $${eq(A[0], B[0])}$, $${eq(A[1], B[1])}$, $${eq(A[2], B[2])}$. Give $${want}$.`, want === "x" ? x : want === "y" ? y : z, `$\\Delta = ${det3(A)} \\ne 0$; Cramer's rule or elimination gives $(${x}, ${y}, ${z})$.`);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const nn = r.int(2, 4);
      const d = r.nonzero(-4, 4);
      const want = r.pick(["adj", "inv"] as const);
      const v = want === "adj" ? d ** (nn - 1) : 1 / d;
      return n(`$A$ is $${nn} \\times ${nn}$ with $\\det A = ${d}$. Find $\\det(${want === "adj" ? "\\operatorname{adj}A" : "A^{-1}"})$ (3 decimals).`, Math.round(v * 1000) / 1000, want === "adj" ? `$(${d})^{${nn - 1}}$.` : `$1/${d}$.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const [k, c, same] = r.pick([[2, 4, true], [3, 6, true], [2, 5, false], [3, 7, false]] as const);
      return mcNumbers(
        `The system $x + y = 2$, $${k}x + ${k}y = ${c}$ has determinant 0. It has`,
        same ? { text: "infinitely many solutions", why: `The second equation is ${k} times the first.` } : { text: "no solution", why: `Multiplying the first by ${k} gives ${2 * k}, not ${c}: the lines are parallel.` },
        same ? [{ text: "no solution", why: "Consistent dependent equations share all solutions.", misconception: "det-zero-no-solution" }] : [{ text: "infinitely many solutions", why: "The constants are inconsistent." }],
      );
    },
  },
];
