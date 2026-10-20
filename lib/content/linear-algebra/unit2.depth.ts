import { ex, mat, mc, num, vec, type Depth } from "../deepen";

/** Chapter 2 at exam depth: span, independence, determinants, inverses, systems. */

const M = (a: string, b: string, c: string, d: string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const M3 = (r: string[][]) => `\\begin{bmatrix} ${r.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
const D3 = (r: string[][]) => `\\begin{vmatrix} ${r.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;

export const UNIT2_DEPTH: Record<string, Depth> = {
  // §{span}
  span: {
    definitions: [
      {
        type: "definition",
        term: "span",
        body: "The **span** of vectors $\\vec v_1, \\dots, \\vec v_k$ is the set of all their linear combinations $c_1\\vec v_1 + \\dots + c_k\\vec v_k$. The span of one non-zero vector is the line through the origin in its direction; the span of two non-parallel vectors is a plane through the origin (the whole plane, in two dimensions). The span of $\\{\\vec 0\\}$ is just $\\{\\vec 0\\}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "In the plane, $\\operatorname{span}\\{\\vec v, \\vec w\\}$ is all of $\\mathbb R^2$ exactly when $v_1w_2 - v_2w_1 \\neq 0$. Otherwise it is a line through the origin (or only $\\vec 0$, if both vectors are zero).",
        proof: [
          "If $v_1w_2 - v_2w_1 \\neq 0$, the unique-coefficients theorem of §{linear-combination} writes every vector as a combination of $\\vec v$ and $\\vec w$.",
          "If $v_1w_2 - v_2w_1 = 0$, the vectors are parallel (or one is zero), so every combination is a multiple of a single vector: a line, or the origin alone.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        statement: "Adding a vector $\\vec u$ to a list does not change the span exactly when $\\vec u$ is already in the span of the list.",
        proof: [
          "If $\\vec u = \\sum c_i\\vec v_i$, any combination that uses $\\vec u$ can be rewritten without it, so nothing new is reached.",
          "Conversely, $\\vec u$ is always in the span of the longer list; if the spans agree, it was already in the span of the shorter one.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Is $(6, 3)$ in the span of $(2, 1)$?",
        solution: ["The span of $(2, 1)$ is all multiples $t(2, 1)$.", "$(6, 3) = 3(2, 1)$, so yes."],
        result: "Yes: $(6, 3) = 3(2, 1)$.",
      },
      {
        type: "example",
        level: 2,
        title: "in space",
        problem: "Is $(1, 2, 3)$ in $\\operatorname{span}\\{(1, 0, 1), (0, 1, 1)\\}$?",
        solution: ["$a(1, 0, 1) + b(0, 1, 1) = (a,\\ b,\\ a + b)$.", "Matching the first two components gives $a = 1$, $b = 2$; the third needs $a + b = 3$, which holds."],
        result: "Yes: $(1, 2, 3) = (1, 0, 1) + 2(0, 1, 1)$.",
      },
      {
        type: "example",
        level: 3,
        title: "a parameter",
        problem: "Find $k$ so that $(1, k, 5) \\in \\operatorname{span}\\{(1, 2, 3), (0, 1, 1)\\}$.",
        solution: [
          "$a(1, 2, 3) + b(0, 1, 1) = (a,\\ 2a + b,\\ 3a + b)$.",
          "First component: $a = 1$. Third: $3 + b = 5$, so $b = 2$.",
          "Then the second component must be $2a + b = 4$.",
        ],
        result: "$k = 4$.",
      },
    ],
    pitfalls: [
      { wrong: "The span of two vectors is always a plane.", right: "Only if they are not parallel. $\\operatorname{span}\\{(1, 2), (3, 6)\\}$ is a line." },
      { wrong: "The span of $\\vec v$ and $\\vec w$ contains just $\\vec v$, $\\vec w$ and $\\vec v + \\vec w$.", right: "It contains every combination $a\\vec v + b\\vec w$: infinitely many vectors." },
      { wrong: "A span can miss the origin.", right: "Every span contains $\\vec 0$ (take all coefficients 0)." },
    ],
    formulas: [
      { label: "Span of one vector", tex: "\\operatorname{span}\\{\\vec v\\} = \\{t\\vec v : t \\in \\mathbb R\\}" },
      { label: "Span of two", tex: "\\operatorname{span}\\{\\vec v, \\vec w\\} = \\{a\\vec v + b\\vec w\\}" },
      { label: "Whole plane when", tex: "v_1w_2 - v_2w_1 \\neq 0" },
    ],
    exercises: [
      ex(1, mc("span-ex-1", "The span of $(1, 2)$ and $(3, 6)$ is", ["a line through the origin", "$(3, 6) = 3(1, 2)$: every combination is a multiple of $(1, 2)$."], [["the whole plane", "That needs non-parallel vectors."], ["just the two vectors", "A span contains all combinations."]]), [
        "$(3, 6) = 3(1, 2)$, so $a(1, 2) + b(3, 6) = (a + 3b)(1, 2)$: the line through the origin in the direction $(1, 2)$.",
      ]),
      ex(1, num("span-ex-2", "Find $k$ so that $(k, 6)$ lies in the span of $(1, 3)$.", 2, "$(k, 6) = 2(1, 3)$."), ["$(k, 6) = t(1, 3)$ forces $t = 2$, so $k = 2$."]),
      ex(1, mc("span-ex-3", "Does $\\operatorname{span}\\{(1, 0), (0, 1)\\}$ contain $(\\pi, -7)$?", ["Yes", "$(\\pi, -7) = \\pi\\hat\\imath - 7\\hat\\jmath$."], [["No, $\\pi$ is not an integer", "Coefficients may be any real numbers."]]), [
        "$\\hat\\imath$ and $\\hat\\jmath$ span the whole plane, and $(\\pi, -7) = \\pi\\hat\\imath - 7\\hat\\jmath$.",
      ]),
      ex(2, vec("span-ex-4", "Find $(a, b)$ with $a(1, 1, 2) + b(0, 1, 1) = (2, 5, 7)$.", [2, 3], "Match components."), ["$(a,\\ a + b,\\ 2a + b) = (2, 5, 7)$.", "$a = 2$, then $b = 3$; check $2a + b = 7$."]),
      ex(2, num("span-ex-5", "Find $k$ so that $(2, k, 7) \\in \\operatorname{span}\\{(1, 1, 2), (0, 1, 1)\\}$.", 5, "Solve with the first and third components."), [
        "$a(1, 1, 2) + b(0, 1, 1) = (a,\\ a + b,\\ 2a + b)$.",
        "First: $a = 2$. Third: $4 + b = 7$, so $b = 3$. Second: $k = a + b = 5$.",
      ]),
      ex(2, mc("span-ex-6", "In space, the span of $(1, 0, 0)$ and $(0, 1, 0)$ is", ["the $xy$-plane", "All vectors $(a, b, 0)$."], [["all of space", "Two vectors span at most a plane."], ["a line", "The vectors are not parallel."]]), [
        "$a(1, 0, 0) + b(0, 1, 0) = (a, b, 0)$: exactly the vectors with third component 0.",
      ]),
      ex(3, num("span-ex-7", "For which $c$ does $(1, c, 1)$ lie in the plane $\\operatorname{span}\\{(1, 1, 0), (0, 1, 1)\\}$?", 2, "Match the first and third components."), [
        "$a(1, 1, 0) + b(0, 1, 1) = (a,\\ a + b,\\ b)$.",
        "First and third components give $a = 1$, $b = 1$, so the second is $c = 2$.",
      ]),
      ex(3, num("span-ex-8", "For which $k$ is $(1, 1, k)$ in $\\operatorname{span}\\{(1, 0, 1), (0, 1, 2)\\}$?", 3, "Match the first two components."), [
        "$a(1, 0, 1) + b(0, 1, 2) = (a,\\ b,\\ a + 2b)$.",
        "So $a = 1$, $b = 1$ and the third component must be $1 + 2 = 3$.",
      ]),
      ex(3, mc("span-ex-9", "$\\operatorname{span}\\{(1, 2, 3), (2, 4, 6), (3, 6, 9)\\}$ is", ["a line", "All three are multiples of $(1, 2, 3)$."], [["a plane", "No two of them are independent."], ["all of space", "Three vectors span space only if independent."]]), [
        "$(2, 4, 6) = 2(1, 2, 3)$ and $(3, 6, 9) = 3(1, 2, 3)$.",
        "Every combination is a multiple of $(1, 2, 3)$: a line through the origin.",
      ]),
    ],
  },

  // §{linear-independence}
  "linear-independence": {
    definitions: [
      {
        type: "definition",
        term: "linear independence",
        body: "Vectors $\\vec v_1, \\dots, \\vec v_k$ are **linearly independent** when $c_1\\vec v_1 + \\dots + c_k\\vec v_k = \\vec 0$ forces $c_1 = \\dots = c_k = 0$. Otherwise they are **dependent**: some non-trivial combination is zero, which means at least one vector is a combination of the others.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "Two vectors are dependent exactly when they are parallel or one of them is zero. Any list containing $\\vec 0$ is dependent.",
        proof: [
          "If $a\\vec v + b\\vec w = \\vec 0$ with, say, $b \\neq 0$, then $\\vec w = -\\tfrac{a}{b}\\vec v$: parallel (or zero).",
          "A list containing $\\vec 0$ has the non-trivial combination $1 \\cdot \\vec 0 = \\vec 0$.",
        ],
      },
      {
        type: "theorem",
        statement: "In $\\mathbb R^2$ any three vectors are dependent. More generally, in $\\mathbb R^n$ any $n + 1$ vectors are dependent.",
        proof: [
          "Take three vectors in the plane. If two of them are parallel, they are already dependent.",
          "Otherwise the first two span the whole plane (§{span}), so the third is a combination of them, which is a dependence. The general statement follows by the same reasoning one dimension at a time.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Show that $(1, 2)$ and $(2, 4)$ are dependent.",
        solution: ["Look for a non-trivial combination equal to $\\vec 0$. Since $(2, 4) = 2(1, 2)$, the vectors are parallel.", "So $2(1, 2) - (2, 4) = \\vec 0$, with coefficients $2$ and $-1$, not both zero."],
        result: "Dependent: $2\\vec v - \\vec w = \\vec 0$.",
      },
      {
        type: "example",
        level: 2,
        title: "three vectors in space",
        problem: "Are $(1, 1, 0)$, $(0, 1, 1)$ and $(1, 0, -1)$ independent?",
        solution: ["$(1, 1, 0) - (0, 1, 1) = (1, 0, -1)$.", "So $\\vec v_1 - \\vec v_2 - \\vec v_3 = \\vec 0$: a non-trivial combination."],
        result: "Dependent.",
      },
      {
        type: "example",
        level: 3,
        title: "a parameter",
        problem: "For which $k$ are $(1, 2, k)$, $(0, 1, 1)$ and $(1, 3, 2)$ dependent?",
        solution: [
          "$(1, 2, k)$ and $(0, 1, 1)$ are never parallel, so the three are dependent exactly when $(1, 3, 2)$ is a combination of the first two.",
          "$a(1, 2, k) + b(0, 1, 1) = (1, 3, 2)$: the first component gives $a = 1$, the second $2 + b = 3$, so $b = 1$.",
          "The third component needs $k + 1 = 2$.",
        ],
        result: "$k = 1$.",
      },
    ],
    pitfalls: [
      { wrong: "Three vectors are dependent only if one is a multiple of another.", right: "One may be a combination of the others without any two being parallel: $(1, 0), (0, 1), (1, 1)$." },
      { wrong: "Vectors that are pairwise non-parallel are independent.", right: "True for two vectors only. Three non-parallel vectors in the plane are always dependent." },
      { wrong: "A list containing $\\vec 0$ can be independent.", right: "Never: $1 \\cdot \\vec 0 = \\vec 0$ is a non-trivial combination." },
    ],
    formulas: [
      { label: "Independent", tex: "\\textstyle\\sum c_i\\vec v_i = \\vec 0 \\Rightarrow \\text{all } c_i = 0" },
      { label: "Two vectors dependent", tex: "v_1w_2 - v_2w_1 = 0" },
      { label: "Too many vectors", tex: "n + 1 \\text{ vectors in } \\mathbb R^n \\text{ are dependent}" },
    ],
    exercises: [
      ex(1, mc("indep-ex-1", "Are $(2, -1)$ and $(-4, 2)$ independent?", ["No", "$(-4, 2) = -2(2, -1)$."], [["Yes", "They are parallel."]]), ["$(-4, 2) = -2(2, -1)$, so $2(2, -1) + (-4, 2) = \\vec 0$."]),
      ex(1, mc("indep-ex-2", "A list of vectors containing $\\vec 0$ is", ["always dependent", "$1 \\cdot \\vec 0 = \\vec 0$ is a non-trivial combination."], [["always independent", "The zero vector adds no direction."], ["dependent only if it has three or more vectors", "Even $\\{\\vec 0\\}$ alone is dependent."]]), [
        "Put coefficient 1 on $\\vec 0$ and 0 on the rest: a non-trivial combination equal to $\\vec 0$.",
      ]),
      ex(1, num("indep-ex-3", "Find $k$ so that $(3, k)$ and $(6, 4)$ are dependent.", 2, "$12 - 6k = 0$."), ["Dependent when $3 \\cdot 4 - k \\cdot 6 = 0$, so $k = 2$."]),
      ex(2, mc("indep-ex-4", "Are $(1, 0)$, $(0, 1)$ and $(1, 1)$ independent?", ["No", "Three vectors in the plane are always dependent: $(1, 1) = (1, 0) + (0, 1)$."], [["Yes, no two are parallel", "Non-parallel pairs are not enough for three vectors."]]), [
        "$(1, 0) + (0, 1) - (1, 1) = \\vec 0$.",
      ]),
      ex(2, vec("indep-ex-5", "Find $(a, b)$ with $a(1, 1, 0) + b(0, 1, 1) = (1, 0, -1)$.", [1, -1], "Match components."), ["$(a,\\ a + b,\\ b) = (1, 0, -1)$.", "$a = 1$ and $b = -1$, and indeed $a + b = 0$."]),
      ex(2, num("indep-ex-6", "Find $k$ so that $(1, 0, 2)$, $(0, 1, 1)$ and $(2, 3, k)$ are dependent.", 7, "Write the third as a combination of the first two."), [
        "$a(1, 0, 2) + b(0, 1, 1) = (a,\\ b,\\ 2a + b)$.",
        "Matching $(2, 3, k)$: $a = 2$, $b = 3$, so $k = 2a + b = 7$.",
      ]),
      ex(3, mc("indep-ex-7", "$\\vec u, \\vec v, \\vec w$ are independent. Are $\\vec u + \\vec v$, $\\vec v + \\vec w$, $\\vec w + \\vec u$ independent?", ["Yes", "A dependence among them gives $a + c = a + b = b + c = 0$, so all are zero."], [["No", "Check the combination: it forces every coefficient to be 0."], ["It depends on the vectors", "The argument works for any independent $\\vec u, \\vec v, \\vec w$."]]), [
        "Suppose $a(\\vec u + \\vec v) + b(\\vec v + \\vec w) + c(\\vec w + \\vec u) = \\vec 0$. Then $(a + c)\\vec u + (a + b)\\vec v + (b + c)\\vec w = \\vec 0$.",
        "Independence gives $a + c = 0$, $a + b = 0$ and $b + c = 0$. Adding: $a + b + c = 0$, so $a = b = c = 0$.",
      ]),
      ex(3, mc("indep-ex-8", "$\\vec u, \\vec v, \\vec w$ are independent. Are $\\vec u - \\vec v$, $\\vec v - \\vec w$, $\\vec w - \\vec u$ independent?", ["No", "Their sum is $\\vec 0$."], [["Yes", "Add them: $(\\vec u - \\vec v) + (\\vec v - \\vec w) + (\\vec w - \\vec u) = \\vec 0$."]]), [
        "$(\\vec u - \\vec v) + (\\vec v - \\vec w) + (\\vec w - \\vec u) = \\vec 0$ with all coefficients 1: a non-trivial dependence.",
      ]),
      ex(3, num("indep-ex-9", "What is the largest number of linearly independent vectors in $\\mathbb R^4$?", 4, "Any 5 vectors in $\\mathbb R^4$ are dependent."), [
        "The four standard basis vectors are independent, and any 5 vectors in $\\mathbb R^4$ are dependent, so the maximum is 4.",
      ]),
    ],
  },

  // §{determinant}
  determinant: {
    definitions: [
      {
        type: "definition",
        term: "2 × 2 determinant",
        body: `$\\det ${M("a", "b", "c", "d")} = ${"\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}"} = ad - bc$. It is the signed area of the parallelogram spanned by the columns: the factor by which the matrix scales areas, negative when it flips orientation.`,
      },
      {
        type: "definition",
        term: "3 × 3 determinant, cofactors",
        body: `For a $3 \\times 3$ matrix, expand along the first row: $${D3([["a_1", "a_2", "a_3"], ["b_1", "b_2", "b_3"], ["c_1", "c_2", "c_3"]])} = a_1\\begin{vmatrix} b_2 & b_3 \\\\ c_2 & c_3 \\end{vmatrix} - a_2\\begin{vmatrix} b_1 & b_3 \\\\ c_1 & c_3 \\end{vmatrix} + a_3\\begin{vmatrix} b_1 & b_2 \\\\ c_1 & c_2 \\end{vmatrix}$. The $2 \\times 2$ determinants are **minors**; with the signs $+ - +$ they are **cofactors**. Any row or column may be used, with the chessboard sign pattern. It is the signed volume scale factor.`,
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "properties",
        statement:
          "For square matrices: (i) swapping two rows changes the sign of the determinant; (ii) multiplying one row by $k$ multiplies it by $k$; (iii) adding a multiple of one row to another leaves it unchanged; (iv) $\\det A^{\\mathsf T} = \\det A$; (v) a triangular matrix has determinant equal to the product of its diagonal entries. The same holds for columns.",
        proof: [
          "For $2 \\times 2$ each property is a one-line check, e.g. (iii): $\\begin{vmatrix} a & b \\\\ c + ka & d + kb \\end{vmatrix} = a(d + kb) - b(c + ka) = ad - bc$.",
          "For $3 \\times 3$, expanding along a row reduces each property to the $2 \\times 2$ case; (v) follows by expanding down the first column repeatedly.",
        ],
      },
      {
        type: "theorem",
        name: "products and scalars",
        statement: "$\\det(AB) = \\det A \\cdot \\det B$, and for an $n \\times n$ matrix $\\det(kA) = k^n\\det A$.",
        proof: [
          "Applying $B$ scales every area (volume) by $\\det B$, then $A$ scales by $\\det A$; the composite $AB$ therefore scales by the product, including the signs for orientation.",
          "$kA$ multiplies each of the $n$ rows by $k$, and property (ii) contributes a factor $k$ per row.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "Vandermonde",
        statement: `$${D3([["1", "1", "1"], ["a", "b", "c"], ["a^2", "b^2", "c^2"]])} = (b - a)(c - a)(c - b)$.`,
        proof: [
          "The determinant is a polynomial in $a, b, c$. Setting $a = b$ makes two columns equal, so it is zero; hence $(b - a)$ is a factor, and likewise $(c - a)$ and $(c - b)$.",
          "Both sides have degree 3, so they differ by a constant. Comparing the coefficient of $bc^2$ (the product of the diagonal) shows the constant is 1.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find $\\begin{vmatrix} 3 & 1 \\\\ 2 & 4 \\end{vmatrix}$ and say what it means.",
        solution: ["$3 \\cdot 4 - 1 \\cdot 2 = 10$.", "The matrix scales every area by 10 and keeps orientation (positive sign)."],
        result: "$10$.",
      },
      {
        type: "example",
        level: 2,
        title: "cofactor expansion",
        problem: `Find $${D3([["2", "1", "3"], ["0", "-1", "4"], ["1", "2", "0"]])}$.`,
        solution: [
          "Expand along the first row: $2\\begin{vmatrix} -1 & 4 \\\\ 2 & 0 \\end{vmatrix} - 1\\begin{vmatrix} 0 & 4 \\\\ 1 & 0 \\end{vmatrix} + 3\\begin{vmatrix} 0 & -1 \\\\ 1 & 2 \\end{vmatrix}$.",
          "$= 2(0 - 8) - 1(0 - 4) + 3(0 + 1) = -16 + 4 + 3$.",
        ],
        result: "$-9$.",
      },
      {
        type: "example",
        level: 3,
        title: "properties without expanding",
        problem: "$A$ is $3 \\times 3$ with $\\det A = 4$. Find $\\det(2A)$, $\\det(A^2)$, $\\det(-A)$ and $\\det(A^{\\mathsf T}A)$.",
        solution: [
          "$\\det(2A) = 2^3 \\cdot 4 = 32$.",
          "$\\det(A^2) = (\\det A)^2 = 16$.",
          "$\\det(-A) = (-1)^3 \\cdot 4 = -4$.",
          "$\\det(A^{\\mathsf T}A) = \\det A^{\\mathsf T} \\cdot \\det A = 4 \\cdot 4 = 16$.",
        ],
        result: "$32$, $16$, $-4$, $16$.",
      },
    ],
    pitfalls: [
      { wrong: "$\\det(A + B) = \\det A + \\det B$.", right: "False in general. The determinant is multiplicative, $\\det(AB) = \\det A\\det B$, not additive." },
      { wrong: "$\\det(2A) = 2\\det A$ for a $3 \\times 3$ matrix.", right: "Each of the three rows doubles: $\\det(2A) = 8\\det A$." },
      { wrong: "Expanding a $3 \\times 3$ determinant with all plus signs.", right: "Cofactor signs alternate in a chessboard pattern: $+\\,-\\,+$ along the first row." },
    ],
    formulas: [
      { label: "2 × 2", tex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc" },
      { label: "Product", tex: "\\det(AB) = \\det A\\,\\det B" },
      { label: "Scalar (n × n)", tex: "\\det(kA) = k^n\\det A" },
      { label: "Transpose", tex: "\\det A^{\\mathsf T} = \\det A" },
      { label: "Triangle area", tex: "\\tfrac12\\,|\\det(\\vec{AB}, \\vec{AC})|" },
    ],
    exercises: [
      ex(1, num("det-ex-1", "Find $\\begin{vmatrix} 5 & 2 \\\\ 3 & 4 \\end{vmatrix}$.", 14, "$20 - 6$."), ["$5 \\cdot 4 - 2 \\cdot 3 = 14$."]),
      ex(1, num("det-ex-2", "Find $\\begin{vmatrix} 2 & -3 \\\\ 4 & -1 \\end{vmatrix}$.", 10, "$-2 + 12$."), ["$2(-1) - (-3)(4) = -2 + 12 = 10$."]),
      ex(1, num("det-ex-3", "Find the area of the parallelogram spanned by $(3, 1)$ and $(1, 2)$.", 5, "$|\\det|$."), ["$\\begin{vmatrix} 3 & 1 \\\\ 1 & 2 \\end{vmatrix} = 6 - 1 = 5$, so the area is 5."]),
      ex(2, num("det-ex-4", `Find $${D3([["1", "2", "3"], ["0", "4", "5"], ["0", "0", "6"]])}$.`, 24, "Triangular."), ["Triangular: the product of the diagonal, $1 \\cdot 4 \\cdot 6 = 24$."]),
      ex(2, num("det-ex-5", `Find $${D3([["1", "2", "0"], ["3", "-1", "2"], ["0", "1", "4"]])}$.`, -30, "Expand along the first row."), [
        "$1\\begin{vmatrix} -1 & 2 \\\\ 1 & 4 \\end{vmatrix} - 2\\begin{vmatrix} 3 & 2 \\\\ 0 & 4 \\end{vmatrix} + 0 = 1(-4 - 2) - 2(12 - 0)$.",
        "$= -6 - 24 = -30$.",
      ]),
      ex(2, num("det-ex-6", "$A$ is $3 \\times 3$ with $\\det A = 5$. Find $\\det(3A)$.", 135, "$3^3 \\cdot 5$."), ["$\\det(3A) = 3^3\\det A = 27 \\cdot 5 = 135$."]),
      ex(2, num("det-ex-7", "Find $x > 0$ with $\\begin{vmatrix} x & 2 \\\\ 3 & x \\end{vmatrix} = 10$.", 4, "$x^2 - 6 = 10$."), ["$x^2 - 6 = 10$, so $x^2 = 16$ and $x = 4$."]),
      ex(3, num("det-ex-8", `Find $${D3([["1", "1", "1"], ["1", "2", "3"], ["1", "4", "9"]])}$.`, 2, "Vandermonde with $a, b, c = 1, 2, 3$."), [
        "This is the Vandermonde determinant with $a = 1$, $b = 2$, $c = 3$ (rows $1$, $a$, $a^2$).",
        "$(b - a)(c - a)(c - b) = 1 \\cdot 2 \\cdot 1 = 2$.",
      ]),
      ex(3, num("det-ex-9", "Find the area of the triangle with vertices $(1, 1)$, $(4, 2)$ and $(2, 5)$.", 5.5, "Half the determinant of two edge vectors."), [
        "Edge vectors from $(1, 1)$: $(3, 1)$ and $(1, 4)$.",
        "Area $= \\tfrac12\\begin{vmatrix} 3 & 1 \\\\ 1 & 4 \\end{vmatrix} = \\tfrac12(12 - 1) = 5.5$.",
      ]),
      ex(3, num("det-ex-10", "$A$ is $3 \\times 3$ with $\\det A = 2$. Find $\\det(A^{\\mathsf T}A^2)$.", 8, "Multiply the determinants."), ["$\\det A^{\\mathsf T} \\cdot (\\det A)^2 = 2 \\cdot 4 = 8$."]),
    ],
  },

  // §{det-zero}
  "det-zero": {
    definitions: [
      {
        type: "definition",
        term: "singular matrix, rank",
        body: "A square matrix with $\\det A = 0$ is **singular**; otherwise it is **non-singular**. The **rank** of $A$ is the number of independent columns, which is the dimension of the span of the columns: 2 for a non-singular $2 \\times 2$ matrix, 1 if it squashes the plane onto a line, 0 for the zero matrix.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "invertible matrix theorem, first form",
        statement: "For a square matrix $A$ the following are equivalent: (a) $\\det A \\neq 0$; (b) the columns of $A$ are independent; (c) $A\\vec x = \\vec 0$ only for $\\vec x = \\vec 0$; (d) $A$ is invertible.",
        proof: [
          "For $2 \\times 2$: $\\det A = 0$ exactly when the columns are parallel or zero (§{linear-independence}), so (a) and (b) agree.",
          "Dependent columns mean some non-zero $\\vec x$ combines them to $\\vec 0$, which is $A\\vec x = \\vec 0$; so (b) and (c) agree.",
          "If $A\\vec x = \\vec 0$ for some $\\vec x \\neq \\vec 0$, two inputs ($\\vec x$ and $\\vec 0$) land on the same output, so no inverse can undo $A$. Conversely, §{inverse} constructs the inverse when $\\det A \\neq 0$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        statement: "A determinant is 0 whenever two rows (or columns) are equal or proportional, or a row is all zeros.",
        proof: ["Proportional rows are dependent. Directly: subtracting the right multiple of one from the other (property (iii) of §{determinant}) produces a zero row, and expanding along it gives 0."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Show that $${M("2", "4", "1", "2")}$ is singular and describe what it does.`,
        solution: ["$\\det = 2 \\cdot 2 - 4 \\cdot 1 = 0$.", "Its columns $(2, 1)$ and $(4, 2)$ are parallel, so it squashes the whole plane onto the line through $(2, 1)$."],
        result: "Singular; rank 1.",
      },
      {
        type: "example",
        level: 2,
        problem: `For which $k$ is $${M("k", "3", "4", "k + 1")}$ singular?`,
        solution: ["$\\det = k(k + 1) - 12 = k^2 + k - 12$.", "$k^2 + k - 12 = (k + 4)(k - 3) = 0$."],
        result: "$k = 3$ or $k = -4$.",
      },
      {
        type: "example",
        level: 3,
        title: "factorising a determinant",
        problem: `For which $k$ is $${M3([["1", "k", "1"], ["k", "1", "1"], ["1", "1", "k"]])}$ singular?`,
        solution: [
          "Expand along the first row: $1(k - 1) - k(k^2 - 1) + 1(k - 1) = 2(k - 1) - k(k - 1)(k + 1)$.",
          "$= (k - 1)(2 - k^2 - k) = -(k - 1)(k^2 + k - 2) = -(k - 1)^2(k + 2)$.",
          "Zero exactly when $k = 1$ or $k = -2$.",
        ],
        result: "$k = 1$ or $k = -2$.",
      },
    ],
    pitfalls: [
      { wrong: "$\\det A = 0$ means $A$ is the zero matrix.", right: "It means the columns are dependent. $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$ is singular but far from zero." },
      { wrong: "A singular system $A\\vec x = \\vec b$ never has a solution.", right: "It has either none or infinitely many, depending on whether $\\vec b$ lies in the span of the columns." },
    ],
    formulas: [
      { label: "Singular", tex: "\\det A = 0 \\iff \\text{columns dependent} \\iff A\\vec x = \\vec 0 \\text{ has } \\vec x \\neq \\vec 0" },
      { label: "Rank of n × n", tex: "\\operatorname{rank} A = n \\iff \\det A \\neq 0" },
    ],
    exercises: [
      ex(1, mc("detz-ex-1", "Which matrix is singular?", [`$${M("3", "6", "1", "2")}$`, "$3 \\cdot 2 - 6 \\cdot 1 = 0$."], [[`$${M("3", "6", "2", "1")}$`, "$3 - 12 = -9 \\neq 0$."], [`$${M("1", "0", "0", "2")}$`, "$\\det = 2$."]]), [
        "Compute each determinant; only $3 \\cdot 2 - 6 \\cdot 1 = 0$. Its second column is twice the first.",
      ]),
      ex(1, num("detz-ex-2", `Find $k$ so that $${M("2", "k", "3", "6")}$ is singular.`, 4, "$12 - 3k = 0$."), ["$2 \\cdot 6 - 3k = 0$, so $k = 4$."]),
      ex(2, num("detz-ex-3", `Find $k > 0$ so that $${M("k + 1", "2", "4", "k - 1")}$ is singular.`, 3, "$k^2 - 1 - 8 = 0$."), ["$(k + 1)(k - 1) - 8 = k^2 - 9 = 0$, and $k > 0$ gives $k = 3$."]),
      ex(2, vec("detz-ex-4", `Find a non-zero $\\vec x$ with $${M("3", "6", "1", "2")}\\vec x = \\vec 0$.`, [2, -1], "Both rows say $x + 2y = 0$.", true), ["Both rows reduce to $x + 2y = 0$; any non-zero multiple of $(2, -1)$ works."]),
      ex(2, mc("detz-ex-5", "If $\\det A = 0$ for a $2 \\times 2$ matrix $A$, the system $A\\vec x = \\vec b$ has", ["either no solution or infinitely many", "It depends on whether $\\vec b$ is in the span of the columns."], [["exactly one solution", "That needs $\\det A \\neq 0$."], ["always infinitely many", "If $\\vec b$ is off the line, there are none."]]), [
        "The columns span a line (or a point). If $\\vec b$ is on it, the solutions form a line; if not, there are none.",
      ]),
      ex(3, num("detz-ex-6", `The matrix $${M3([["1", "1", "1"], ["1", "2", "k"], ["1", "4", "k^2"]])}$ is singular for two values of $k$. Find their sum.`, 3, "It is a Vandermonde determinant."), [
        "This is the Vandermonde determinant with $a = 1$, $b = 2$, $c = k$, equal to $(2 - 1)(k - 1)(k - 2)$.",
        "Zero for $k = 1$ and $k = 2$; their sum is 3.",
      ]),
      ex(3, num("detz-ex-7", `Find the rank of $${M("1", "2", "2", "4")}$.`, 1, "The columns are parallel."), ["The columns $(1, 2)$ and $(2, 4)$ are parallel and non-zero, so they span a line: rank 1."]),
      ex(3, mc("detz-ex-8", "$\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = 0$ with $a \\neq 0$. Then", ["the second row is $\\tfrac{c}{a}$ times the first", "$ad = bc$ gives $(c, d) = \\tfrac{c}{a}(a, b)$."], [["$b = c$", "Not needed: $\\begin{vmatrix} 1 & 2 \\\\ 3 & 6 \\end{vmatrix} = 0$."], ["$a = d$", "Not needed either."]]), [
        "$ad = bc$ gives $d = \\tfrac{bc}{a}$, so $(c, d) = \\left(c, \\tfrac{bc}{a}\\right) = \\tfrac{c}{a}(a, b)$.",
      ]),
    ],
  },

  // §{inverse}
  inverse: {
    definitions: [
      {
        type: "definition",
        term: "inverse",
        body: "A square matrix $A$ is **invertible** if there is a matrix $A^{-1}$ with $A^{-1}A = AA^{-1} = I$. Geometrically $A^{-1}$ undoes $A$. When it exists it is unique.",
      },
      {
        type: "definition",
        term: "adjugate",
        body: "The **adjugate** $\\operatorname{adj}A$ is the transpose of the matrix of cofactors of $A$. For $2 \\times 2$, $\\operatorname{adj}\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "2 × 2 inverse",
        statement: "If $ad - bc \\neq 0$, then $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}^{-1} = \\dfrac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}$.",
        proof: ["Multiply: $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix} = \\begin{bmatrix} ad - bc & 0 \\\\ 0 & ad - bc \\end{bmatrix}$; divide by $ad - bc$ to get $I$."],
      },
      {
        type: "theorem",
        name: "adjugate",
        statement: "$A \\operatorname{adj}A = (\\operatorname{adj}A)A = (\\det A)I$, so $A^{-1} = \\dfrac{\\operatorname{adj}A}{\\det A}$ when $\\det A \\neq 0$. For $n \\times n$ matrices, $\\det(\\operatorname{adj}A) = (\\det A)^{n - 1}$.",
        proof: [
          "Entry $(i, i)$ of $A\\operatorname{adj}A$ is the cofactor expansion of $\\det A$ along row $i$. Entry $(i, j)$ with $i \\neq j$ is the expansion of a matrix with two equal rows, which is 0.",
          "Taking determinants of $A\\operatorname{adj}A = (\\det A)I$: $\\det A \\cdot \\det(\\operatorname{adj}A) = (\\det A)^n$; divide by $\\det A$ (when non-zero).",
        ],
      },
      {
        type: "theorem",
        name: "inverse of a product",
        statement: "$(AB)^{-1} = B^{-1}A^{-1}$ and $\\det(A^{-1}) = \\dfrac{1}{\\det A}$.",
        proof: [
          "$(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AA^{-1} = I$: to undo $B$ then $A$, undo $A$ first.",
          "$\\det A \\cdot \\det(A^{-1}) = \\det(AA^{-1}) = \\det I = 1$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Find the inverse of $${M("2", "1", "1", "1")}$.`,
        solution: ["$\\det = 2 - 1 = 1$.", `Swap the diagonal, negate the off-diagonal, divide by 1: $${M("1", "-1", "-1", "2")}$.`],
        result: `$${M("1", "-1", "-1", "2")}$.`,
      },
      {
        type: "example",
        level: 2,
        title: "a 3 × 3 inverse",
        problem: `Find the inverse of $${M3([["1", "1", "0"], ["0", "1", "1"], ["0", "0", "1"]])}$.`,
        solution: [
          "$\\det A = 1$ (triangular). Solve $A\\vec x = \\vec e_j$ for each column, working up from the last row.",
          "Column 1: $(1, 0, 0)$. Column 2: $x_3 = 0$, $x_2 = 1$, $x_1 = -1$. Column 3: $x_3 = 1$, $x_2 = -1$, $x_1 = 1$.",
          "Check by multiplying: $AA^{-1} = I$.",
        ],
        result: `$${M3([["1", "-1", "1"], ["0", "1", "-1"], ["0", "0", "1"]])}$.`,
      },
      {
        type: "example",
        level: 3,
        title: "determinants of adjugates",
        problem: "$A$ is $3 \\times 3$ with $\\det A = 4$. Find $\\det(\\operatorname{adj}A)$, $\\det(A^{-1})$ and $\\det(2\\operatorname{adj}A)$.",
        solution: [
          "$\\det(\\operatorname{adj}A) = (\\det A)^{3 - 1} = 16$.",
          "$\\det(A^{-1}) = \\tfrac14$.",
          "$\\det(2\\operatorname{adj}A) = 2^3 \\cdot 16 = 128$.",
        ],
        result: "$16$, $\\tfrac14$, $128$.",
      },
    ],
    pitfalls: [
      { wrong: "$(AB)^{-1} = A^{-1}B^{-1}$.", right: "$(AB)^{-1} = B^{-1}A^{-1}$: the last thing done is the first thing undone." },
      { wrong: "The inverse of $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ swaps $b$ and $c$.", right: "It swaps $a$ and $d$, negates $b$ and $c$, and divides by the determinant." },
      { wrong: "$\\det(\\operatorname{adj}A) = \\det A$.", right: "$\\det(\\operatorname{adj}A) = (\\det A)^{n-1}$: for $3 \\times 3$, the square of $\\det A$." },
    ],
    formulas: [
      { label: "2 × 2 inverse", tex: "\\dfrac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}" },
      { label: "Adjugate", tex: "A^{-1} = \\dfrac{\\operatorname{adj}A}{\\det A},\\quad \\det(\\operatorname{adj}A) = (\\det A)^{n-1}" },
      { label: "Products", tex: "(AB)^{-1} = B^{-1}A^{-1},\\quad \\det A^{-1} = 1/\\det A" },
    ],
    exercises: [
      ex(1, mat("inv-ex-1", `Find the inverse of $${M("3", "1", "5", "2")}$.`, [[2, -1], [-5, 3]], "$\\det = 1$."), ["$\\det = 6 - 5 = 1$.", `Inverse: $${M("2", "-1", "-5", "3")}$.`]),
      ex(1, num("inv-ex-2", "$\\det A = 5$. Find $\\det(A^{-1})$.", 0.2, "$1/5$."), ["$\\det(A^{-1}) = 1/\\det A = 0.2$."]),
      ex(1, mat("inv-ex-3", `Find the inverse of $${M("2", "0", "0", "4")}$.`, [[0.5, 0], [0, 0.25]], "Invert each stretch."), ["A diagonal matrix inverts entry by entry: $\\tfrac12$ and $\\tfrac14$."]),
      ex(2, mat("inv-ex-4", `Find the inverse of $${M("2", "3", "1", "2")}$.`, [[2, -3], [-1, 2]], "$\\det = 1$."), ["$\\det = 4 - 3 = 1$.", `Inverse: $${M("2", "-3", "-1", "2")}$.`]),
      ex(2, mat("inv-ex-5", `$A^{-1} = ${M("1", "2", "0", "1")}$ and $B^{-1} = ${M("1", "0", "3", "1")}$. Find $(AB)^{-1}$.`, [[1, 2], [3, 7]], "$B^{-1}A^{-1}$."), [
        `$(AB)^{-1} = B^{-1}A^{-1} = ${M("1", "0", "3", "1")}${M("1", "2", "0", "1")} = ${M("1", "2", "3", "7")}$.`,
      ]),
      ex(2, num("inv-ex-6", `Find $x$ so that $${M("x", "2", "3", "4")}$ has no inverse.`, 1.5, "$4x - 6 = 0$."), ["No inverse when $\\det = 4x - 6 = 0$, so $x = 1.5$."]),
      ex(3, num("inv-ex-7", "$A$ is $3 \\times 3$ with $\\det A = 3$. Find $\\det(2\\operatorname{adj}A)$.", 72, "$2^3(\\det A)^2$."), ["$\\det(\\operatorname{adj}A) = 3^2 = 9$.", "$\\det(2\\operatorname{adj}A) = 2^3 \\cdot 9 = 72$."]),
      ex(3, mat("inv-ex-8", `Find the inverse of $${M3([["1", "0", "0"], ["2", "1", "0"], ["3", "4", "1"]])}$.`, [[1, 0, 0], [-2, 1, 0], [5, -4, 1]], "Solve column by column from the top."), [
        "Solve $A\\vec x = \\vec e_j$ from the top row down. Column 1: $x_1 = 1$, $x_2 = -2$, $x_3 = -3 - 4(-2) = 5$.",
        "Column 2: $x_1 = 0$, $x_2 = 1$, $x_3 = -4$. Column 3: $(0, 0, 1)$.",
      ]),
      ex(3, mat("inv-ex-9", `Find the inverse of $A = ${M("1", "2", "0", "-1")}$. (Hint: compute $A^2$.)`, [[1, 2], [0, -1]], "$A^2 = I$."), [
        `$A^2 = ${M("1", "2 - 2", "0", "1")} = I$, so $A$ is its own inverse.`,
      ]),
      ex(3, num("inv-ex-10", `$A = ${M("3", "1", "-1", "2")}$ satisfies $A^2 - 5A + 7I = 0$. Use this to find the top-left entry of $A^{-1}$.`, 2 / 7, "$A^{-1} = (5I - A)/7$.", 0.001), [
        "Multiply $A^2 - 5A + 7I = 0$ by $A^{-1}$: $A - 5I + 7A^{-1} = 0$, so $A^{-1} = \\tfrac17(5I - A)$.",
        "Top-left entry: $\\tfrac17(5 - 3) = \\tfrac27$.",
      ]),
    ],
  },

  // §{solving-systems}
  "solving-systems": {
    definitions: [
      {
        type: "definition",
        term: "linear system",
        body: "A system of linear equations is $A\\vec x = \\vec b$: each equation is one row. It is **consistent** if it has at least one solution and **inconsistent** if it has none. Elimination solves it by adding multiples of equations to remove variables one at a time.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Rule",
        name: "Cramer",
        statement: "If $D = \\det A \\neq 0$, the unique solution of $A\\vec x = \\vec b$ is $x_i = D_i / D$, where $D_i$ is the determinant of $A$ with column $i$ replaced by $\\vec b$.",
        proof: [
          "For $2 \\times 2$, $\\vec x = A^{-1}\\vec b = \\tfrac1D\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}\\begin{bmatrix} b_1 \\\\ b_2 \\end{bmatrix}$; the first entry $db_1 - bb_2$ is exactly $\\begin{vmatrix} b_1 & b \\\\ b_2 & d \\end{vmatrix}$, and similarly for the second.",
          "In general, $x_i\\det A = \\det(A \\text{ with column } i \\text{ replaced by } A\\vec x)$, by linearity of the determinant in column $i$, and $A\\vec x = \\vec b$.",
        ],
      },
      {
        type: "theorem",
        name: "consistency",
        statement: "If $D \\neq 0$ the system has exactly one solution. If $D = 0$ it has either no solution or infinitely many; for $3 \\times 3$, if some $D_i \\neq 0$ there is no solution.",
        proof: [
          "$D \\neq 0$: $A$ is invertible and $\\vec x = A^{-1}\\vec b$ is the only solution.",
          "$D = 0$: the columns span less than the whole space. If $\\vec b$ is outside their span there is no solution; if inside, adding any non-zero solution of $A\\vec x = \\vec 0$ to one solution gives another, so there are infinitely many. Cramer's identity $x_iD = D_i$ shows $D_i \\neq 0$ is impossible when $D = 0$ and a solution exists.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Solve $2x + y = 5$, $x - y = 1$.",
        solution: ["Add the equations: $3x = 6$, so $x = 2$.", "Then $y = x - 1 = 1$."],
        result: "$(x, y) = (2, 1)$.",
      },
      {
        type: "example",
        level: 2,
        title: "Cramer's rule",
        problem: "Solve $3x + 2y = 7$, $x + 4y = 9$ by Cramer's rule.",
        solution: [
          "$D = \\begin{vmatrix} 3 & 2 \\\\ 1 & 4 \\end{vmatrix} = 10$, $D_x = \\begin{vmatrix} 7 & 2 \\\\ 9 & 4 \\end{vmatrix} = 10$, $D_y = \\begin{vmatrix} 3 & 7 \\\\ 1 & 9 \\end{vmatrix} = 20$.",
          "$x = 10/10 = 1$ and $y = 20/10 = 2$. Check: $3 + 4 = 7$ and $1 + 8 = 9$.",
        ],
        result: "$(1, 2)$.",
      },
      {
        type: "example",
        level: 3,
        title: "a parameter",
        problem: "For which $k$ does $x + y + z = 1$, $x + 2y + 3z = 2$, $x + 4y + kz = 4$ have a unique solution? What happens otherwise?",
        solution: [
          `$D = ${D3([["1", "1", "1"], ["1", "2", "3"], ["1", "4", "k"]])} = 1(2k - 12) - 1(k - 3) + 1(4 - 2) = k - 7$. Unique solution exactly when $k \\neq 7$.`,
          "For $k = 7$: subtracting the first equation from the others gives $y + 2z = 1$ and $3y + 6z = 3$, the same equation. So $z$ is free: infinitely many solutions.",
        ],
        result: "Unique for $k \\neq 7$; infinitely many for $k = 7$.",
      },
    ],
    pitfalls: [
      { wrong: "$D = 0$ means the system has no solution.", right: "It means not exactly one: there may be none or infinitely many. Check consistency." },
      { wrong: "In Cramer's rule, replace row $i$ by $\\vec b$.", right: "Replace column $i$, the column of the unknown $x_i$." },
    ],
    formulas: [
      { label: "Cramer", tex: "x_i = \\dfrac{D_i}{D}" },
      { label: "Unique solution", tex: "D \\neq 0" },
      { label: "D = 0", tex: "\\text{none or infinitely many}" },
    ],
    exercises: [
      ex(1, vec("sys-ex-1", "Solve $x + y = 3$, $x - y = 1$. Give $(x, y)$.", [2, 1], "Add the equations."), ["Adding: $2x = 4$, so $x = 2$ and $y = 1$."]),
      ex(1, vec("sys-ex-2", "Solve $2x + 3y = 12$, $x = 3$. Give $(x, y)$.", [3, 2], "Substitute."), ["$6 + 3y = 12$, so $y = 2$."]),
      ex(2, vec("sys-ex-3", "Solve $5x - 2y = 4$, $3x + y = 9$ by Cramer's rule. Give $(x, y)$.", [2, 3], "$D = 11$."), [
        "$D = 5 + 6 = 11$, $D_x = \\begin{vmatrix} 4 & -2 \\\\ 9 & 1 \\end{vmatrix} = 22$, $D_y = \\begin{vmatrix} 5 & 4 \\\\ 3 & 9 \\end{vmatrix} = 33$.",
        "$x = 2$ and $y = 3$.",
      ]),
      ex(2, mc("sys-ex-4", "How many solutions does $x + 2y = 3$, $2x + 4y = 7$ have?", ["None", "The left side doubles but the right side does not: $6 \\neq 7$."], [["One", "$D = 0$, so not exactly one."], ["Infinitely many", "That needs the second equation to be twice the first, including the right side."]]), [
        "Twice the first equation is $2x + 4y = 6$, which contradicts $2x + 4y = 7$: parallel lines, no solution.",
      ]),
      ex(2, num("sys-ex-5", "Find $k > 0$ for which $kx + 2y = 1$, $8x + ky = 2$ does not have a unique solution.", 4, "$D = k^2 - 16$."), ["$D = k^2 - 16 = 0$ gives $k = 4$ (for $k > 0$)."]),
      ex(3, vec("sys-ex-6", "Solve $x + y + z = 6$, $x - y + z = 2$, $2x + y - z = 1$. Give $(x, y, z)$.", [1, 2, 3], "Subtract the first two equations."), [
        "First minus second: $2y = 4$, so $y = 2$. Then $x + z = 4$.",
        "Third: $2x - z = 1 - 2 = -1$. Adding $x + z = 4$: $3x = 3$, so $x = 1$ and $z = 3$.",
      ]),
      ex(3, num("sys-ex-7", "For which $k$ does $x + y + z = 2$, $x + 2y + 3z = 5$, $2x + 3y + kz = 7$ have infinitely many solutions?", 4, "$D = k - 4$; check consistency."), [
        `$D = ${D3([["1", "1", "1"], ["1", "2", "3"], ["2", "3", "k"]])} = (2k - 9) - (k - 6) + (3 - 4) = k - 4$.`,
        "For $k = 4$ the third equation is the sum of the first two ($2x + 3y + 4z = 7$), so the system is consistent with a free variable: infinitely many solutions.",
      ]),
      ex(3, mc("sys-ex-8", "How many solutions does $x + y + z = 1$, $x + 2y + 3z = 2$, $x + 3y + 5z = 4$ have?", ["None", "Eliminating $x$ gives $y + 2z = 1$ and $y + 2z = 2$."], [["One", "$D = 0$ here."], ["Infinitely many", "The reduced equations contradict each other."]]), [
        "Second minus first: $y + 2z = 1$. Third minus second: $y + 2z = 2$.",
        "These contradict each other, so there is no solution (indeed $D = 0$).",
      ]),
    ],
  },
};
