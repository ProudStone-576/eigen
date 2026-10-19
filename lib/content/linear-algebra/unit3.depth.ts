import { ex, mat, mc, num, vec, type Depth } from "../deepen";

/** Chapter 3 at exam depth: eigenvectors, eigenvalues, the characteristic polynomial, diagonalisation, PCA. */

const M = (a: string, b: string, c: string, d: string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const M3 = (r: string[][]) => `\\begin{bmatrix} ${r.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;

export const UNIT3_DEPTH: Record<string, Depth> = {
  // §3.1
  eigenvector: {
    definitions: [
      {
        type: "definition",
        term: "eigenvector, eigenvalue",
        body: "A non-zero vector $\\vec v$ is an **eigenvector** of the square matrix $A$ if $A\\vec v = \\lambda\\vec v$ for some scalar $\\lambda$, its **eigenvalue**. Geometrically, $A$ keeps $\\vec v$ on its own line, stretching it by $\\lambda$ (and reversing it if $\\lambda < 0$). The value $\\lambda = 0$ is allowed; the vector $\\vec v = \\vec 0$ is not.",
      },
      {
        type: "definition",
        term: "eigenspace",
        body: "For an eigenvalue $\\lambda$, the **eigenspace** is the set of all $\\vec v$ with $A\\vec v = \\lambda\\vec v$: every eigenvector for $\\lambda$, together with $\\vec 0$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "If $\\vec v$ is an eigenvector of $A$ with eigenvalue $\\lambda$, so is $c\\vec v$ for every $c \\neq 0$. If $\\vec u$ and $\\vec v$ are eigenvectors for the same $\\lambda$, so is $\\vec u + \\vec v$ (when non-zero). Hence each eigenspace is a line, a plane, or larger, through the origin.",
        proof: ["$A(c\\vec v) = cA\\vec v = c\\lambda\\vec v = \\lambda(c\\vec v)$, and $A(\\vec u + \\vec v) = \\lambda\\vec u + \\lambda\\vec v = \\lambda(\\vec u + \\vec v)$, by linearity."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        statement: "A rotation of the plane by an angle that is not a multiple of $180^\\circ$ has no real eigenvector.",
        proof: ["Such a rotation moves every non-zero vector off its own line, so $A\\vec v$ is never a multiple of $\\vec v$."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Is $(1, 1)$ an eigenvector of $${M("2", "1", "1", "2")}$?`,
        solution: ["$A(1, 1) = (2 + 1,\\ 1 + 2) = (3, 3)$.", "$(3, 3) = 3(1, 1)$, so yes, with eigenvalue 3."],
        result: "Yes, $\\lambda = 3$.",
      },
      {
        type: "example",
        level: 2,
        title: "from geometry",
        problem: "Find the eigenvectors and eigenvalues of reflection in the line $y = x$, without computing.",
        solution: [
          "Vectors on the mirror are unchanged: $(1, 1)$ is an eigenvector with $\\lambda = 1$.",
          "Vectors perpendicular to the mirror are reversed: $(1, -1)$ is an eigenvector with $\\lambda = -1$.",
          "Every other direction is moved off its line, so these are all of them (up to scaling).",
        ],
        result: "$(1, 1)$ with $\\lambda = 1$; $(1, -1)$ with $\\lambda = -1$.",
      },
      {
        type: "example",
        level: 3,
        title: "eigenvalue zero",
        problem: `Find the eigenvectors of the projection $P = ${M("1", "0", "0", "0")}$ onto the $x$-axis.`,
        solution: [
          "$P\\hat\\imath = \\hat\\imath$: eigenvalue 1.",
          "$P\\hat\\jmath = \\vec 0 = 0 \\cdot \\hat\\jmath$: eigenvalue 0. This is allowed, because $\\hat\\jmath \\neq \\vec 0$.",
          "Any other vector $(x, y)$ with $x, y \\neq 0$ goes to $(x, 0)$, which is not a multiple of it.",
        ],
        result: "$\\hat\\imath$ ($\\lambda = 1$) and $\\hat\\jmath$ ($\\lambda = 0$).",
      },
    ],
    pitfalls: [
      { wrong: "$\\vec 0$ is an eigenvector of every matrix.", right: "It satisfies $A\\vec 0 = \\lambda\\vec 0$ for every $\\lambda$, which is why it is excluded by definition." },
      { wrong: "An eigenvalue cannot be 0.", right: "$\\lambda = 0$ is fine; it means $A$ squashes that direction to $\\vec 0$, so $A$ is singular." },
      { wrong: "Eigenvectors must have length 1.", right: "Any non-zero multiple of an eigenvector is an eigenvector." },
    ],
    formulas: [{ label: "Definition", tex: "A\\vec v = \\lambda\\vec v,\\quad \\vec v \\neq \\vec 0" }],
    exercises: [
      ex(1, mc("eigv-ex-1", `Is $(1, -1)$ an eigenvector of $${M("2", "1", "1", "2")}$?`, ["Yes, with $\\lambda = 1$", "$A(1, -1) = (1, -1)$."], [["No", "Compute $A(1, -1)$."], ["Yes, with $\\lambda = 3$", "That is the eigenvalue of $(1, 1)$."]]), [
        "$A(1, -1) = (2 - 1,\\ 1 - 2) = (1, -1) = 1 \\cdot (1, -1)$.",
      ]),
      ex(1, num("eigv-ex-2", `$A = ${M("3", "0", "0", "5")}$. What is the eigenvalue of $(0, 1)$?`, 5, "$A\\hat\\jmath = 5\\hat\\jmath$."), ["$A(0, 1) = (0, 5) = 5(0, 1)$."]),
      ex(1, mc("eigv-ex-3", `Is $(1, 2)$ an eigenvector of $${M("1", "1", "0", "1")}$?`, ["No", "$A(1, 2) = (3, 2)$ is not a multiple of $(1, 2)$."], [["Yes, with $\\lambda = 1$", "Only multiples of $(1, 0)$ are fixed."]]), ["$A(1, 2) = (3, 2)$, and $(3, 2) \\neq t(1, 2)$ for any $t$."]),
      ex(2, num("eigv-ex-4", `$\\vec v = (1, 2)$ is an eigenvector of $${M("1", "2", "4", "3")}$. Find its eigenvalue.`, 5, "Compute $A\\vec v$."), ["$A(1, 2) = (1 + 4,\\ 4 + 6) = (5, 10) = 5(1, 2)$."]),
      ex(2, vec("eigv-ex-5", "Give an eigenvector of reflection in the $x$-axis with eigenvalue $-1$.", [0, 1], "Vectors perpendicular to the mirror.", true), ["Reflection in the $x$-axis sends $(0, 1)$ to $(0, -1)$: eigenvalue $-1$. Any non-zero multiple works."]),
      ex(2, mc("eigv-ex-6", "Which of these has no real eigenvector?", ["Rotation by $90^\\circ$", "It moves every direction off its own line."], [["The shear $\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}$", "It fixes $\\hat\\imath$."], ["The stretch $\\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix}$", "$\\hat\\imath$ and $\\hat\\jmath$ are eigenvectors."]]), [
        "A $90^\\circ$ rotation turns every non-zero vector to a perpendicular one, never a multiple of itself.",
      ]),
      ex(3, num("eigv-ex-7", `Find $k$ so that $(1, 1)$ is an eigenvector of $${M("2", "k", "3", "4")}$.`, 5, "$A(1, 1)$ needs equal components."), [
        "$A(1, 1) = (2 + k,\\ 7)$. Parallel to $(1, 1)$ means equal components: $2 + k = 7$.",
        "So $k = 5$, and the eigenvalue is 7.",
      ]),
      ex(3, vec("eigv-ex-8", "The projection onto the line $y = x$ sends $(x, y)$ to $\\tfrac12(x + y,\\ x + y)$. Give an eigenvector with eigenvalue 0.", [1, -1], "Vectors it sends to $\\vec 0$.", true), [
        "Eigenvalue 0 means $P\\vec v = \\vec 0$: $x + y = 0$.",
        "Any non-zero multiple of $(1, -1)$, the direction perpendicular to the line.",
      ]),
      ex(3, num("eigv-ex-9", `How many independent eigenvectors does the shear $${M("1", "1", "0", "1")}$ have?`, 1, "Only one direction is fixed."), [
        "$A(x, y) = (x + y,\\ y) = \\lambda(x, y)$ needs $y = \\lambda y$ and $x + y = \\lambda x$.",
        "If $y \\neq 0$ then $\\lambda = 1$ and $y = 0$, a contradiction. So $y = 0$: only multiples of $(1, 0)$, one independent eigenvector.",
      ]),
    ],
  },

  // §3.2
  eigenvalue: {
    definitions: [
      {
        type: "definition",
        term: "trace",
        body: "The **trace** of a square matrix, $\\operatorname{tr}A$, is the sum of its diagonal entries. For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, $\\operatorname{tr}A = a + d$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "functions of a matrix",
        statement: "If $A\\vec v = \\lambda\\vec v$, then $A^n\\vec v = \\lambda^n\\vec v$, $(A + cI)\\vec v = (\\lambda + c)\\vec v$, and if $A$ is invertible, $A^{-1}\\vec v = \\tfrac1\\lambda\\vec v$. More generally $p(A)\\vec v = p(\\lambda)\\vec v$ for any polynomial $p$.",
        proof: [
          "$A^2\\vec v = A(\\lambda\\vec v) = \\lambda A\\vec v = \\lambda^2\\vec v$; induction gives $\\lambda^n$.",
          "$(A + cI)\\vec v = \\lambda\\vec v + c\\vec v$. If $A$ is invertible then $\\lambda \\neq 0$ (otherwise $A\\vec v = \\vec 0$), and applying $A^{-1}$ to $A\\vec v = \\lambda\\vec v$ gives $\\vec v = \\lambda A^{-1}\\vec v$.",
        ],
      },
      {
        type: "theorem",
        name: "trace and determinant",
        statement: "For a $2 \\times 2$ matrix with eigenvalues $\\lambda_1, \\lambda_2$ (counted with repetition, possibly complex): $\\lambda_1 + \\lambda_2 = \\operatorname{tr}A$ and $\\lambda_1\\lambda_2 = \\det A$. For $n \\times n$ matrices, the sum is the trace and the product is the determinant.",
        proof: ["The eigenvalues are the roots of $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$ (§3.3). By Vieta's formulas the sum of the roots is $\\operatorname{tr}A$ and their product is $\\det A$."],
      },
      {
        type: "theorem",
        kind: "Corollary",
        statement: "$A$ is invertible exactly when 0 is not an eigenvalue.",
        proof: ["0 is an eigenvalue exactly when $A\\vec v = \\vec 0$ for some $\\vec v \\neq \\vec 0$, which by §2.4 is exactly when $A$ is singular."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$A\\vec v = 3\\vec v$. Find $A^2\\vec v$ in terms of $\\vec v$.",
        solution: ["$A^2\\vec v = A(A\\vec v) = A(3\\vec v)$.", "By linearity $A(3\\vec v) = 3A\\vec v = 3 \\cdot 3\\vec v = 9\\vec v$: the stretch factor is applied twice."],
        result: "$9\\vec v$.",
      },
      {
        type: "example",
        level: 2,
        problem: "A $2 \\times 2$ matrix $A$ has eigenvalues 2 and 5. Find the eigenvalues of $A^2$, $A^{-1}$ and $A + 3I$, and find $\\operatorname{tr}A$ and $\\det A$.",
        solution: ["$A^2$: $4$ and $25$. $A^{-1}$: $\\tfrac12$ and $\\tfrac15$. $A + 3I$: $5$ and $8$.", "$\\operatorname{tr}A = 2 + 5 = 7$ and $\\det A = 2 \\cdot 5 = 10$."],
        result: "$\\{4, 25\\}$, $\\{\\tfrac12, \\tfrac15\\}$, $\\{5, 8\\}$; $\\operatorname{tr}A = 7$, $\\det A = 10$.",
      },
      {
        type: "example",
        level: 3,
        title: "eigenvalues from trace and determinant",
        problem: "A $2 \\times 2$ matrix has trace 5 and determinant 6. Find its eigenvalues and $\\det(A^2 - 3A)$.",
        solution: [
          "The eigenvalues solve $\\lambda^2 - 5\\lambda + 6 = 0$: $\\lambda = 2$ and $\\lambda = 3$.",
          "$A^2 - 3A$ has eigenvalues $\\lambda^2 - 3\\lambda$: $4 - 6 = -2$ and $9 - 9 = 0$.",
          "Its determinant is the product, $-2 \\cdot 0 = 0$.",
        ],
        result: "$2$ and $3$; $\\det(A^2 - 3A) = 0$.",
      },
    ],
    pitfalls: [
      { wrong: "The eigenvalues of $A^2$ are $2\\lambda$.", right: "They are $\\lambda^2$: apply $A$ twice and the stretch factor multiplies." },
      { wrong: "The eigenvalues of $A + B$ are the sums of the eigenvalues of $A$ and $B$.", right: "Only in special cases (for example when $A$ and $B$ share eigenvectors). $A + cI$ is the safe case." },
    ],
    formulas: [
      { label: "Powers and inverse", tex: "A^n\\vec v = \\lambda^n\\vec v,\\quad A^{-1}\\vec v = \\lambda^{-1}\\vec v" },
      { label: "Sum and product", tex: "\\textstyle\\sum\\lambda_i = \\operatorname{tr}A,\\quad \\prod\\lambda_i = \\det A" },
    ],
    exercises: [
      ex(1, num("eigl-ex-1", "$A\\vec v = 4\\vec v$ and $A^3\\vec v = k\\vec v$. Find $k$.", 64, "$4^3$."), ["$A^3\\vec v = 4^3\\vec v = 64\\vec v$."]),
      ex(1, num("eigl-ex-2", "$A\\vec v = 5\\vec v$ and $A$ is invertible. Find the eigenvalue of $A^{-1}$ for $\\vec v$.", 0.2, "$1/5$."), ["$A^{-1}\\vec v = \\tfrac15\\vec v$."]),
      ex(2, num("eigl-ex-3", "A $2 \\times 2$ matrix has eigenvalues 3 and $-2$. Find $\\det A$.", -6, "Product of eigenvalues."), ["$\\det A = 3 \\cdot (-2) = -6$."]),
      ex(2, num("eigl-ex-4", "A $2 \\times 2$ matrix has trace 7 and determinant 12. Find its larger eigenvalue.", 4, "Roots of $\\lambda^2 - 7\\lambda + 12$."), ["$\\lambda^2 - 7\\lambda + 12 = (\\lambda - 3)(\\lambda - 4)$, so the eigenvalues are 3 and 4."]),
      ex(2, num("eigl-ex-5", "$A$ has eigenvalue 2 for $\\vec v$. Find the eigenvalue of $A + 3I$ for $\\vec v$.", 5, "$\\lambda + 3$."), ["$(A + 3I)\\vec v = 2\\vec v + 3\\vec v = 5\\vec v$."]),
      ex(3, num("eigl-ex-6", "A $2 \\times 2$ matrix has eigenvalues 1 and 3. Find $\\det(A^2 + A)$.", 24, "Eigenvalues of $A^2 + A$ are $\\lambda^2 + \\lambda$."), [
        "$A^2 + A$ has eigenvalues $1 + 1 = 2$ and $9 + 3 = 12$.",
        "$\\det(A^2 + A) = 2 \\cdot 12 = 24$.",
      ]),
      ex(3, mc("eigl-ex-7", "If 0 is an eigenvalue of $A$, then $A$ is", ["singular", "$A\\vec v = \\vec 0$ for some $\\vec v \\neq \\vec 0$."], [["invertible", "An invertible matrix sends only $\\vec 0$ to $\\vec 0$."], ["the zero matrix", "Only one direction need be squashed."]]), [
        "Eigenvalue 0 means a non-zero $\\vec v$ with $A\\vec v = \\vec 0$, so $\\det A = 0$.",
      ]),
      ex(3, num("eigl-ex-8", "A $3 \\times 3$ matrix has eigenvalues 1, 2 and 4. Find $\\det(A^{-1})$.", 0.125, "$\\det A = 8$."), ["$\\det A = 1 \\cdot 2 \\cdot 4 = 8$, so $\\det(A^{-1}) = \\tfrac18$."]),
    ],
  },

  // §3.3
  "finding-eigenvalues": {
    definitions: [
      {
        type: "definition",
        term: "characteristic polynomial",
        body: "The **characteristic polynomial** of $A$ is $p(\\lambda) = \\det(A - \\lambda I)$. For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, $p(\\lambda) = \\lambda^2 - (a + d)\\lambda + (ad - bc) = \\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "$\\lambda$ is an eigenvalue of $A$ exactly when $\\det(A - \\lambda I) = 0$.",
        proof: ["$A\\vec v = \\lambda\\vec v$ is $(A - \\lambda I)\\vec v = \\vec 0$. A non-zero solution exists exactly when $A - \\lambda I$ is singular (§2.4), i.e. when its determinant is 0."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        statement: "The eigenvalues of a triangular matrix are its diagonal entries. A real $2 \\times 2$ matrix has real eigenvalues exactly when $(\\operatorname{tr}A)^2 \\ge 4\\det A$.",
        proof: [
          "$A - \\lambda I$ is triangular, so its determinant is the product of $(a_{ii} - \\lambda)$, which vanishes exactly at the diagonal entries.",
          "The quadratic $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A$ has real roots exactly when its discriminant $(\\operatorname{tr}A)^2 - 4\\det A$ is non-negative.",
        ],
      },
      {
        type: "theorem",
        name: "Cayley–Hamilton, 2 × 2",
        statement: "Every $2 \\times 2$ matrix satisfies its own characteristic equation: $A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0$.",
        proof: [
          "For $A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, $A^2 = \\begin{bmatrix} a^2 + bc & b(a + d) \\\\ c(a + d) & d^2 + bc \\end{bmatrix}$.",
          "Subtract $(a + d)A$ and add $(ad - bc)I$: the top-left entry is $a^2 + bc - a^2 - ad + ad - bc = 0$, and the other entries vanish the same way.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Find the eigenvalues of $${M("4", "1", "2", "3")}$.`,
        solution: ["$\\operatorname{tr}A = 7$ and $\\det A = 12 - 2 = 10$, so $p(\\lambda) = \\lambda^2 - 7\\lambda + 10$.", "$\\lambda^2 - 7\\lambda + 10 = (\\lambda - 5)(\\lambda - 2)$."],
        result: "$\\lambda = 5$ and $\\lambda = 2$.",
      },
      {
        type: "example",
        level: 2,
        title: "triangular",
        problem: `Find the eigenvalues of $${M3([["2", "0", "0"], ["1", "3", "0"], ["4", "5", "-1"]])}$.`,
        solution: ["The matrix is lower triangular, so $\\det(A - \\lambda I) = (2 - \\lambda)(3 - \\lambda)(-1 - \\lambda)$.", "Its roots are the diagonal entries."],
        result: "$2$, $3$ and $-1$.",
      },
      {
        type: "example",
        level: 3,
        title: "a repeated eigenvalue",
        problem: `Find $k$ so that $${M("2", "k", "1", "4")}$ has a repeated eigenvalue, and find it.`,
        solution: [
          "$p(\\lambda) = \\lambda^2 - 6\\lambda + (8 - k)$. A repeated root needs discriminant 0: $36 - 4(8 - k) = 0$.",
          "$36 - 32 + 4k = 0$, so $k = -1$. Then $p(\\lambda) = \\lambda^2 - 6\\lambda + 9 = (\\lambda - 3)^2$.",
        ],
        result: "$k = -1$; the eigenvalue is 3.",
      },
    ],
    pitfalls: [
      { wrong: "Solve $\\det A = 0$ to find eigenvalues.", right: "Solve $\\det(A - \\lambda I) = 0$: $\\lambda$ must appear in the equation." },
      { wrong: "$p(\\lambda) = \\lambda^2 + (\\operatorname{tr}A)\\lambda + \\det A$.", right: "The middle sign is minus: $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A$." },
    ],
    formulas: [
      { label: "Characteristic equation", tex: "\\det(A - \\lambda I) = 0" },
      { label: "2 × 2", tex: "\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0" },
      { label: "Cayley–Hamilton", tex: "A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0" },
    ],
    exercises: [
      ex(1, num("feig-ex-1", `Find the larger eigenvalue of $${M("5", "2", "2", "2")}$.`, 6, "$\\lambda^2 - 7\\lambda + 6$."), ["$\\operatorname{tr} = 7$, $\\det = 6$: $(\\lambda - 6)(\\lambda - 1) = 0$."]),
      ex(1, num("feig-ex-2", `Find the smaller eigenvalue of $${M("3", "0", "4", "-2")}$.`, -2, "Triangular."), ["Lower triangular: the eigenvalues are 3 and $-2$."]),
      ex(2, num("feig-ex-3", `Find the sum of the eigenvalues of $${M3([["1", "2", "3"], ["0", "4", "5"], ["0", "0", "6"]])}$.`, 11, "Trace."), ["Triangular: eigenvalues 1, 4, 6, summing to 11 (the trace)."]),
      ex(2, num("feig-ex-4", `Find the larger eigenvalue of $${M("1", "4", "2", "3")}$.`, 5, "$\\lambda^2 - 4\\lambda - 5$."), ["$\\operatorname{tr} = 4$, $\\det = 3 - 8 = -5$: $\\lambda^2 - 4\\lambda - 5 = (\\lambda - 5)(\\lambda + 1)$."]),
      ex(2, mc("feig-ex-5", `Does $${M("1", "-2", "1", "3")}$ have real eigenvalues?`, ["No", "$(\\operatorname{tr})^2 - 4\\det = 16 - 20 < 0$."], [["Yes, two distinct ones", "Check the discriminant."], ["Yes, one repeated", "The discriminant is not 0."]]), [
        "$\\operatorname{tr} = 4$, $\\det = 3 + 2 = 5$: the discriminant $16 - 20 = -4$ is negative, so the eigenvalues are complex.",
      ]),
      ex(3, num("feig-ex-6", `For exactly one value of $k$, $${M("1", "k", "2", "5")}$ has a repeated eigenvalue. What is that eigenvalue?`, 3, "Set the discriminant to 0."), [
        "$p(\\lambda) = \\lambda^2 - 6\\lambda + (5 - 2k)$. A repeated root needs $36 - 4(5 - 2k) = 16 + 8k = 0$, so $k = -2$.",
        "Then $p(\\lambda) = \\lambda^2 - 6\\lambda + 9 = (\\lambda - 3)^2$: the repeated eigenvalue is 3.",
      ]),
      ex(3, num("feig-ex-7", `$A = ${M("2", "1", "1", "3")}$ satisfies $A^2 = pA + qI$. Find $q$.`, -5, "Cayley–Hamilton."), [
        "$\\operatorname{tr}A = 5$, $\\det A = 5$. Cayley–Hamilton: $A^2 - 5A + 5I = 0$, so $A^2 = 5A - 5I$.",
        "So $p = 5$ and $q = -5$.",
      ]),
      ex(3, num("feig-ex-8", `Find the sum of the squares of the eigenvalues of $${M3([["2", "1", "0"], ["1", "2", "0"], ["0", "0", "5"]])}$.`, 35, "The top-left block has eigenvalues 3 and 1."), [
        "The top-left $2 \\times 2$ block has eigenvalues 3 and 1; the bottom-right entry gives 5.",
        "$9 + 1 + 25 = 35$.",
      ]),
    ],
  },

  // §3.4
  "finding-eigenvectors": {
    definitions: [
      {
        type: "definition",
        term: "solving for eigenvectors",
        body: "For each eigenvalue $\\lambda$, the eigenvectors are the non-zero solutions of $(A - \\lambda I)\\vec v = \\vec 0$. Because $A - \\lambda I$ is singular, its rows are dependent: for $2 \\times 2$, one row is enough to read off the direction.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "Eigenvectors belonging to distinct eigenvalues are linearly independent. In particular, an $n \\times n$ matrix with $n$ distinct eigenvalues has $n$ independent eigenvectors.",
        proof: [
          "Two eigenvalues $\\lambda_1 \\neq \\lambda_2$: suppose $c_1\\vec v_1 + c_2\\vec v_2 = \\vec 0$. Apply $A$: $c_1\\lambda_1\\vec v_1 + c_2\\lambda_2\\vec v_2 = \\vec 0$.",
          "Subtract $\\lambda_2$ times the first equation: $c_1(\\lambda_1 - \\lambda_2)\\vec v_1 = \\vec 0$, so $c_1 = 0$, and then $c_2 = 0$. The general case is the same argument by induction.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Find the eigenvectors of $${M("2", "0", "0", "3")}$.`,
        solution: ["Eigenvalues 2 and 3 (diagonal).", "$\\lambda = 2$: $(A - 2I)\\vec v = (0, v_2) = \\vec 0$ gives $\\vec v = (1, 0)$. $\\lambda = 3$: $\\vec v = (0, 1)$."],
        result: "$(1, 0)$ for 2 and $(0, 1)$ for 3.",
      },
      {
        type: "example",
        level: 2,
        problem: `Find the eigenvectors of $${M("4", "1", "2", "3")}$ (eigenvalues 5 and 2).`,
        solution: [
          `$\\lambda = 5$: $A - 5I = ${M("-1", "1", "2", "-2")}$, so $-x + y = 0$: $\\vec v = (1, 1)$.`,
          `$\\lambda = 2$: $A - 2I = ${M("2", "1", "2", "1")}$, so $2x + y = 0$: $\\vec v = (1, -2)$.`,
          "Check: $A(1, -2) = (2, -4) = 2(1, -2)$.",
        ],
        result: "$(1, 1)$ for 5 and $(1, -2)$ for 2.",
      },
      {
        type: "example",
        level: 3,
        title: "when eigenvectors run short",
        problem: `Compare the eigenvectors of $${M("3", "1", "0", "3")}$ and $3I$.`,
        solution: [
          "Both have the single eigenvalue 3, repeated.",
          `For the first, $A - 3I = ${M("0", "1", "0", "0")}$ forces $y = 0$: only multiples of $(1, 0)$.`,
          "For $3I$, $3I - 3I = 0$, so every non-zero vector is an eigenvector.",
        ],
        result: "The first has one independent eigenvector; $3I$ has two.",
      },
    ],
    pitfalls: [
      { wrong: "Solve $A\\vec v = \\vec 0$ to find the eigenvectors.", right: "That only finds eigenvectors for $\\lambda = 0$. Use $(A - \\lambda I)\\vec v = \\vec 0$ for each $\\lambda$." },
      { wrong: "A repeated eigenvalue always gives two independent eigenvectors.", right: "Sometimes only one, as for the shear-like matrix $\\begin{bmatrix} 3 & 1 \\\\ 0 & 3 \\end{bmatrix}$." },
    ],
    formulas: [{ label: "Eigenvectors for λ", tex: "(A - \\lambda I)\\vec v = \\vec 0,\\ \\vec v \\neq \\vec 0" }],
    exercises: [
      ex(1, vec("fvec-ex-1", `Give an eigenvector of $${M("2", "1", "1", "2")}$ for $\\lambda = 3$.`, [1, 1], "$-x + y = 0$.", true), [`$A - 3I = ${M("-1", "1", "1", "-1")}$, so $x = y$: $(1, 1)$.`]),
      ex(1, vec("fvec-ex-2", `Give an eigenvector of $${M("2", "1", "1", "2")}$ for $\\lambda = 1$.`, [1, -1], "$x + y = 0$.", true), [`$A - I = ${M("1", "1", "1", "1")}$, so $x + y = 0$: $(1, -1)$.`]),
      ex(2, vec("fvec-ex-3", `Give an eigenvector of $${M("1", "2", "4", "3")}$ for $\\lambda = -1$.`, [1, -1], "$2x + 2y = 0$.", true), [`$A + I = ${M("2", "2", "4", "4")}$, so $x + y = 0$: $(1, -1)$.`]),
      ex(2, vec("fvec-ex-4", `Give an eigenvector of $${M("5", "4", "1", "2")}$ for $\\lambda = 6$.`, [4, 1], "$-x + 4y = 0$.", true), [`$A - 6I = ${M("-1", "4", "1", "-4")}$, so $x = 4y$: $(4, 1)$.`]),
      ex(2, vec("fvec-ex-5", `Give an eigenvector of $${M("5", "4", "1", "2")}$ for $\\lambda = 1$.`, [1, -1], "$4x + 4y = 0$.", true), [`$A - I = ${M("4", "4", "1", "1")}$, so $x + y = 0$: $(1, -1)$.`]),
      ex(3, num("fvec-ex-6", `How many independent eigenvectors does $${M("3", "1", "0", "3")}$ have?`, 1, "Solve $(A - 3I)\\vec v = \\vec 0$."), [`$A - 3I = ${M("0", "1", "0", "0")}$ forces $y = 0$: one independent eigenvector, $(1, 0)$.`]),
      ex(3, vec("fvec-ex-7", `Give an eigenvector of $${M3([["1", "2", "0"], ["0", "3", "0"], ["0", "0", "2"]])}$ for $\\lambda = 3$.`, [1, 1, 0], "$-2x + 2y = 0$ and $z = 0$.", true), [
        `$A - 3I = ${M3([["-2", "2", "0"], ["0", "0", "0"], ["0", "0", "-1"]])}$, giving $x = y$ and $z = 0$: $(1, 1, 0)$.`,
      ]),
      ex(3, num("fvec-ex-8", `Find $k$ so that $(1, 2)$ is an eigenvector of $${M("1", "k", "2", "1")}$.`, 0.5, "$A(1, 2)$ must be parallel to $(1, 2)$."), [
        "$A(1, 2) = (1 + 2k,\\ 4)$. Parallel to $(1, 2)$ means $4 = 2(1 + 2k)$.",
        "So $1 + 2k = 2$ and $k = \\tfrac12$; the eigenvalue is 2.",
      ]),
    ],
  },

  // §3.5
  eigenbasis: {
    definitions: [
      {
        type: "definition",
        term: "diagonalisable",
        body: "$A$ is **diagonalisable** if it has a basis of eigenvectors. Putting them as the columns of $P$ and the eigenvalues on the diagonal of $D$ gives $AP = PD$, i.e. $A = PDP^{-1}$: in the eigenbasis, $A$ simply stretches each axis.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "powers",
        statement: "If $A = PDP^{-1}$, then $A^n = PD^nP^{-1}$, where $D^n$ is diagonal with entries $\\lambda_i^n$. Equivalently, writing $\\vec v = c_1\\vec v_1 + c_2\\vec v_2$ in the eigenbasis, $A^n\\vec v = c_1\\lambda_1^n\\vec v_1 + c_2\\lambda_2^n\\vec v_2$.",
        proof: [
          "$A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}$: the inner $P^{-1}P$ cancels. Induction gives $A^n = PD^nP^{-1}$.",
          "The second form follows from linearity and $A^n\\vec v_i = \\lambda_i^n\\vec v_i$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        statement: "An $n \\times n$ matrix with $n$ distinct eigenvalues is diagonalisable.",
        proof: ["Its $n$ eigenvectors are independent (§3.4), so they form a basis."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Find $${M("2", "0", "0", "3")}^4$.`,
        solution: ["A diagonal matrix is already in its eigenbasis.", "Raise each diagonal entry to the 4th power."],
        result: `$${M("16", "0", "0", "81")}$.`,
      },
      {
        type: "example",
        level: 2,
        title: "a closed form for powers",
        problem: `Find a formula for $${M("2", "1", "1", "2")}^n$ and check it for $n = 3$.`,
        solution: [
          `Eigenvectors $(1, 1)$ for 3 and $(1, -1)$ for 1, so $P = ${M("1", "1", "1", "-1")}$, $D = ${M("3", "0", "0", "1")}$ and $P^{-1} = \\tfrac12${M("1", "1", "1", "-1")}$.`,
          `$A^n = PD^nP^{-1} = \\tfrac12${M("3^n + 1", "3^n - 1", "3^n - 1", "3^n + 1")}$.`,
          `For $n = 3$: $\\tfrac12${M("28", "26", "26", "28")} = ${M("14", "13", "13", "14")}$, matching direct multiplication.`,
        ],
        result: `$A^n = \\tfrac12${M("3^n + 1", "3^n - 1", "3^n - 1", "3^n + 1")}$.`,
      },
      {
        type: "example",
        level: 3,
        title: "Fibonacci numbers",
        problem: `The Fibonacci numbers satisfy $F_{n+1} = F_n + F_{n-1}$ with $F_0 = 0$, $F_1 = 1$. Use $Q = ${M("1", "1", "1", "0")}$ to find a closed form.`,
        solution: [
          `$Q${"\\begin{bmatrix} F_n \\\\ F_{n-1} \\end{bmatrix}"} = ${"\\begin{bmatrix} F_{n+1} \\\\ F_n \\end{bmatrix}"}$, so $Q^n = ${M("F_{n+1}", "F_n", "F_n", "F_{n-1}")}$.`,
          "$p(\\lambda) = \\lambda^2 - \\lambda - 1$ has roots $\\varphi = \\tfrac{1 + \\sqrt5}{2}$ and $\\psi = \\tfrac{1 - \\sqrt5}{2}$.",
          "Diagonalising and reading off the top-right entry gives Binet's formula $F_n = \\dfrac{\\varphi^n - \\psi^n}{\\sqrt5}$. Since $|\\psi| < 1$, $F_n$ is the integer nearest $\\varphi^n/\\sqrt5$.",
        ],
        result: "$F_n = \\dfrac{\\varphi^n - \\psi^n}{\\sqrt5}$.",
      },
    ],
    pitfalls: [
      { wrong: "$A^n = P^nD^n(P^{-1})^n$.", right: "The $P$'s cancel in pairs: $A^n = PD^nP^{-1}$." },
      { wrong: "Every matrix is diagonalisable.", right: "Not $\\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}$: it has only one independent eigenvector." },
    ],
    formulas: [
      { label: "Diagonalisation", tex: "A = PDP^{-1}" },
      { label: "Powers", tex: "A^n = PD^nP^{-1}" },
      { label: "Binet", tex: "F_n = \\dfrac{\\varphi^n - \\psi^n}{\\sqrt5}" },
    ],
    exercises: [
      ex(1, mat("eb-ex-1", `Find $${M("2", "0", "0", "3")}^3$.`, [[8, 0], [0, 27]], "Cube the diagonal."), ["Cube each diagonal entry: $8$ and $27$."]),
      ex(2, vec("eb-ex-2", `$A = ${M("2", "1", "1", "2")}$. Find $A^2(2, 0)$ using $(2, 0) = (1, 1) + (1, -1)$.`, [10, 8], "Eigenvalues 3 and 1."), [
        "$A^2(1, 1) = 9(1, 1)$ and $A^2(1, -1) = 1(1, -1)$.",
        "$A^2(2, 0) = (9, 9) + (1, -1) = (10, 8)$.",
      ]),
      ex(2, mat("eb-ex-3", `Find $${M("2", "1", "1", "2")}^4$.`, [[41, 40], [40, 41]], "Use $\\tfrac12(3^n \\pm 1)$."), ["$\\tfrac12(81 + 1) = 41$ and $\\tfrac12(81 - 1) = 40$."]),
      ex(2, num("eb-ex-4", `Find the top-right entry of $${M("1", "1", "1", "0")}^{10}$.`, 55, "It is $F_{10}$."), ["$Q^{10}$ has top-right entry $F_{10}$; the sequence runs $0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55$."]),
      ex(3, num("eb-ex-5", `Find the top-right entry of $${M("3", "1", "0", "2")}^5$.`, 211, "It equals $3^5 - 2^5$."), [
        "Eigenvalues 3 and 2 with eigenvectors $(1, 0)$ and $(1, -1)$. Diagonalising gives top-right entry $3^n - 2^n$ (check $n = 2$: $9 - 4 = 5$).",
        "For $n = 5$: $243 - 32 = 211$.",
      ]),
      ex(3, mc("eb-ex-6", `Is $${M("1", "1", "0", "1")}$ diagonalisable?`, ["No", "It has only one independent eigenvector."], [["Yes", "A basis of eigenvectors would be needed."]]), [
        "Its only eigenvalue is 1, and $A - I = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}$ gives only multiples of $(1, 0)$. No eigenbasis exists.",
      ]),
      ex(3, num("eb-ex-7", `Each year 90% of state-1 people stay and 10% move to state 2; 80% of state-2 people stay and 20% move to state 1: $\\vec x_{t+1} = ${M("0.9", "0.2", "0.1", "0.8")}\\vec x_t$. In the long run, what fraction is in state 1?`, 2 / 3, "The eigenvector for $\\lambda = 1$.", 0.001), [
        "The eigenvalues are 1 and 0.7; the $0.7^t$ part dies out, leaving the eigenvector for $\\lambda = 1$.",
        `$A - I = ${M("-0.1", "0.2", "0.1", "-0.2")}$ gives $x = 2y$, so the long-run split is $2 : 1$: two thirds in state 1.`,
      ]),
    ],
  },

  // §3.6
  pca: {
    definitions: [
      {
        type: "definition",
        term: "dot product, perpendicular",
        body: "The **dot product** of $\\vec u = (u_1, u_2)$ and $\\vec v = (v_1, v_2)$ is $\\vec u \\cdot \\vec v = u_1v_1 + u_2v_2$. Vectors are **perpendicular** exactly when $\\vec u \\cdot \\vec v = 0$, and $|\\vec u|^2 = \\vec u \\cdot \\vec u$. The coordinate of a point $\\vec x$ along a unit vector $\\hat u$ is $\\vec x \\cdot \\hat u$.",
      },
      {
        type: "definition",
        term: "principal components",
        body: "For centred data with covariance matrix $\\Sigma$, the **principal components** are the eigenvectors of $\\Sigma$, ordered by eigenvalue. The eigenvalue $\\lambda_i$ is the variance of the data along component $i$, and the fraction of variance it explains is $\\lambda_i / \\sum_j \\lambda_j$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "symmetric matrices",
        statement: "A real symmetric $2 \\times 2$ matrix $\\begin{bmatrix} a & b \\\\ b & c \\end{bmatrix}$ has real eigenvalues, and eigenvectors for different eigenvalues are perpendicular.",
        proof: [
          "The discriminant is $(a + c)^2 - 4(ac - b^2) = (a - c)^2 + 4b^2 \\ge 0$, so the eigenvalues are real.",
          "For $\\Sigma\\vec u = \\lambda\\vec u$ and $\\Sigma\\vec v = \\mu\\vec v$, symmetry gives $(\\Sigma\\vec u) \\cdot \\vec v = \\vec u \\cdot (\\Sigma\\vec v)$, i.e. $\\lambda\\,\\vec u \\cdot \\vec v = \\mu\\,\\vec u \\cdot \\vec v$. If $\\lambda \\neq \\mu$ then $\\vec u \\cdot \\vec v = 0$.",
        ],
      },
      {
        type: "theorem",
        name: "maximum spread",
        statement: "Among all unit directions $\\hat u$, the variance of the data along $\\hat u$ is largest for the top eigenvector of $\\Sigma$, and that largest variance is $\\lambda_1$. The total variance $\\sum\\lambda_i$ equals $\\operatorname{tr}\\Sigma$.",
        proof: [
          "Write $\\hat u = c_1\\hat v_1 + c_2\\hat v_2$ in the perpendicular unit eigenvectors, with $c_1^2 + c_2^2 = 1$. The variance along $\\hat u$ is $\\lambda_1c_1^2 + \\lambda_2c_2^2$.",
          "With $\\lambda_1 \\ge \\lambda_2$ this is at most $\\lambda_1(c_1^2 + c_2^2) = \\lambda_1$, with equality at $\\hat u = \\hat v_1$. The trace equals the sum of the eigenvalues (§3.2).",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Data has covariance $${M("4", "0", "0", "1")}$. Find the first principal component and the variance it explains.`,
        solution: ["The matrix is diagonal: eigenvalues 4 (along $x$) and 1 (along $y$).", "PC1 is the $x$-axis, explaining $\\tfrac{4}{4 + 1} = 80\\%$."],
        result: "The $x$-axis; 80%.",
      },
      {
        type: "example",
        level: 2,
        problem: `Data has covariance $${M("2", "1", "1", "2")}$. Find PC1 and the variance it explains.`,
        solution: ["Eigenvalues 3 and 1, with eigenvectors $(1, 1)$ and $(1, -1)$ (perpendicular, as the theorem says).", "PC1 is $\\tfrac{1}{\\sqrt2}(1, 1)$, explaining $\\tfrac34 = 75\\%$."],
        result: "$\\tfrac{1}{\\sqrt2}(1, 1)$; 75%.",
      },
      {
        type: "example",
        level: 3,
        title: "projecting a point",
        problem: `Data has covariance $${M("5", "2", "2", "2")}$. Find PC1, the variance it explains, and the PC1 coordinate of the centred point $(3, 1)$.`,
        solution: [
          "$\\operatorname{tr} = 7$, $\\det = 6$: eigenvalues 6 and 1.",
          `$\\lambda = 6$: $\\Sigma - 6I = ${M("-1", "2", "2", "-4")}$ gives $x = 2y$, so PC1 is $\\tfrac{1}{\\sqrt5}(2, 1)$, explaining $\\tfrac67 \\approx 85.7\\%$.`,
          "Coordinate along PC1: $(3, 1) \\cdot \\tfrac{1}{\\sqrt5}(2, 1) = \\tfrac{7}{\\sqrt5} \\approx 3.13$.",
        ],
        result: "PC1 $= \\tfrac{1}{\\sqrt5}(2, 1)$; $\\tfrac67$ of the variance; coordinate $\\tfrac{7}{\\sqrt5}$.",
      },
    ],
    pitfalls: [
      { wrong: "PCA keeps the original axes with the largest values.", right: "It finds new directions, the eigenvectors of the covariance matrix, which are usually not the original axes." },
      { wrong: "The fraction of variance explained is $\\lambda_1/\\lambda_2$.", right: "It is $\\lambda_1/(\\lambda_1 + \\lambda_2 + \\dots)$: divide by the total variance, the trace." },
      { wrong: "PCA works on raw, uncentred data.", right: "Subtract the mean first; otherwise the first component mostly points at the mean." },
    ],
    formulas: [
      { label: "Dot product", tex: "\\vec u \\cdot \\vec v = u_1v_1 + u_2v_2" },
      { label: "Variance explained", tex: "\\dfrac{\\lambda_i}{\\sum_j \\lambda_j},\\quad \\textstyle\\sum_j \\lambda_j = \\operatorname{tr}\\Sigma" },
      { label: "Coordinate on a component", tex: "\\vec x \\cdot \\hat v_i" },
    ],
    exercises: [
      ex(1, num("pca-ex-1", "A covariance matrix has eigenvalues 9 and 1. What fraction of the variance does PC1 explain?", 0.9, "$9/10$."), ["$9/(9 + 1) = 0.9$."]),
      ex(1, mc("pca-ex-2", `Data has covariance $${M("1", "0", "0", "6")}$. PC1 is`, ["the $y$-axis", "The larger eigenvalue, 6, belongs to $\\hat\\jmath$."], [["the $x$-axis", "Its variance is only 1."], ["the line $y = x$", "The matrix is diagonal: its eigenvectors are the axes."]]), [
        "Diagonal covariance: the axes are the eigenvectors, with variances 1 (along $x$) and 6 (along $y$).",
      ]),
      ex(2, num("pca-ex-3", `What fraction of the variance does PC1 explain for covariance $${M("3", "1", "1", "3")}$?`, 2 / 3, "Eigenvalues 4 and 2.", 0.001), ["Eigenvalues $3 \\pm 1$: 4 and 2.", "$4/6 = \\tfrac23$."]),
      ex(2, vec("pca-ex-4", `Give the direction of PC1 for covariance $${M("3", "1", "1", "3")}$.`, [1, 1], "The eigenvector for 4.", true), [`$\\Sigma - 4I = ${M("-1", "1", "1", "-1")}$ gives $x = y$: the direction $(1, 1)$.`]),
      ex(2, num("pca-ex-5", "A covariance matrix has eigenvalues 5, 3, 1 and 1. What is the fewest components that keep at least 80% of the variance?", 2, "Cumulative sums over the total 10."), ["Total 10. One component keeps 50%; two keep $(5 + 3)/10 = 80\\%$."]),
      ex(3, num("pca-ex-6", `What fraction of the variance does PC1 explain for covariance $${M("5", "2", "2", "2")}$?`, 6 / 7, "Eigenvalues 6 and 1.", 0.001), ["Eigenvalues 6 and 1 (trace 7, determinant 6), so PC1 explains $\\tfrac67$."]),
      ex(3, num("pca-ex-7", "For covariance $\\begin{bmatrix} 5 & 2 \\\\ 2 & 2 \\end{bmatrix}$, PC1 is $\\tfrac{1}{\\sqrt5}(2, 1)$. Find the PC1 coordinate of the centred point $(3, 1)$, to two decimals.", 7 / Math.sqrt(5), "Dot with the unit vector.", 0.01), [
        "$(3, 1) \\cdot \\tfrac{1}{\\sqrt5}(2, 1) = \\tfrac{6 + 1}{\\sqrt5} = \\tfrac{7}{\\sqrt5} \\approx 3.13$.",
      ]),
      ex(3, num("pca-ex-8", "What is the total variance of data with covariance $\\begin{bmatrix} 5 & 2 \\\\ 2 & 2 \\end{bmatrix}$?", 7, "The trace."), ["Total variance is the sum of the eigenvalues, which is the trace: $5 + 2 = 7$."]),
    ],
  },
};
