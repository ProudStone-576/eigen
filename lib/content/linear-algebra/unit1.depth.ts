import { ex, mat, mc, num, vec, type Depth } from "../deepen";

/**
 * Chapter 1 at exam depth: theory with proofs, worked examples on three
 * levels, common errors, a formula box and leveled exercises with solutions.
 * Level I ≈ SAT / school boards, II ≈ JEE Main, III ≈ JEE Advanced.
 */

const M = (a: string, b: string, c: string, d: string) => `\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}`;
const C = (a: string, b: string) => `\\begin{bmatrix} ${a} \\\\ ${b} \\end{bmatrix}`;

export const UNIT1_DEPTH: Record<string, Depth> = {
  // §{vector}
  vector: {
    definitions: [
      {
        type: "definition",
        term: "vector",
        body: "A **vector** in the plane is an ordered pair $\\vec v = (x, y)$, read as a movement: $x$ units across and $y$ units up. In space a vector has three components $(x, y, z)$. Two vectors are equal exactly when their corresponding components are equal.",
      },
      {
        type: "definition",
        term: "position vector, displacement",
        body: "The **position vector** of a point $P(x, y)$ is $\\vec{OP} = (x, y)$, the movement from the origin to $P$. The **displacement** from $A$ to $B$ is $\\vec{AB} = \\vec{OB} - \\vec{OA}$: subtract the start from the end, component by component.",
      },
      {
        type: "definition",
        term: "magnitude, unit vector",
        body: "The **magnitude** of $\\vec v = (x, y)$ is $|\\vec v| = \\sqrt{x^2 + y^2}$, and in space $|\\vec v| = \\sqrt{x^2 + y^2 + z^2}$. A **unit vector** has magnitude 1. For $\\vec v \\neq \\vec 0$ the unit vector in its direction is $\\hat v = \\vec v / |\\vec v|$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "distance",
        statement: "The distance between $A(x_1, y_1)$ and $B(x_2, y_2)$ is $|\\vec{AB}| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
        proof: [
          "$\\vec{AB} = (x_2 - x_1,\\ y_2 - y_1)$. Its horizontal and vertical components are the legs of a right triangle whose hypotenuse is the segment $AB$.",
          "By Pythagoras, $AB^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2$; take the positive square root. In space, applying Pythagoras twice adds the term $(z_2 - z_1)^2$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        title: "displacement and length",
        problem: "For $A(1, 2)$ and $B(4, 6)$, find $\\vec{AB}$, its length, and the unit vector in its direction.",
        solution: [
          "$\\vec{AB} = B - A = (4 - 1,\\ 6 - 2) = (3, 4)$.",
          "$|\\vec{AB}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.",
          "Divide by the length: $\\hat u = \\tfrac15(3, 4) = (0.6,\\ 0.8)$. Check: $0.6^2 + 0.8^2 = 1$.",
        ],
        result: "$\\vec{AB} = (3, 4)$, $|\\vec{AB}| = 5$, $\\hat u = (0.6, 0.8)$.",
      },
      {
        type: "example",
        level: 2,
        title: "an unknown component",
        problem: "Find every real $k$ for which $\\vec v = (k,\\ k + 1)$ has magnitude 5.",
        solution: [
          "$|\\vec v|^2 = k^2 + (k + 1)^2 = 25$.",
          "$2k^2 + 2k + 1 = 25$, so $k^2 + k - 12 = 0$, i.e. $(k + 4)(k - 3) = 0$.",
          "$k = 3$ gives $(3, 4)$; $k = -4$ gives $(-4, -3)$. Both have length 5.",
        ],
        result: "$k = 3$ or $k = -4$.",
      },
      {
        type: "example",
        level: 3,
        title: "in three dimensions",
        problem: "$A(1, -1, 2)$ and $B(3, 1, 1)$. Find the vector of length 6 pointing from $A$ towards $B$.",
        solution: [
          "$\\vec{AB} = (3 - 1,\\ 1 - (-1),\\ 1 - 2) = (2, 2, -1)$.",
          "$|\\vec{AB}| = \\sqrt{4 + 4 + 1} = 3$, so the unit vector is $\\tfrac13(2, 2, -1)$.",
          "Scale to length 6: $6 \\cdot \\tfrac13(2, 2, -1) = (4, 4, -2)$.",
        ],
        result: "$(4, 4, -2)$.",
      },
    ],
    pitfalls: [
      { wrong: "$\\vec{AB} = A - B$.", right: "$\\vec{AB} = B - A$, end minus start. $A - B$ is $\\vec{BA}$, the reverse movement." },
      { wrong: "$|(3, 4)| = 3 + 4 = 7$.", right: "$|(3, 4)| = \\sqrt{9 + 16} = 5$. Lengths combine by Pythagoras, not by addition." },
      { wrong: "The unit vector along $(3, 4)$ is $(3/7, 4/7)$.", right: "Divide by the magnitude 5, not by the sum of the components: $(3/5, 4/5)$." },
    ],
    formulas: [
      { label: "Displacement", tex: "\\vec{AB} = \\vec{OB} - \\vec{OA}" },
      { label: "Magnitude", tex: "|(x, y, z)| = \\sqrt{x^2 + y^2 + z^2}" },
      { label: "Unit vector", tex: "\\hat v = \\dfrac{\\vec v}{|\\vec v|}" },
      { label: "Distance", tex: "AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
    ],
    exercises: [
      ex(1, num("vec-ex-1", "Find $|(-5, 12)|$.", 13, "$\\sqrt{25 + 144} = 13$."), ["$|(-5, 12)| = \\sqrt{(-5)^2 + 12^2} = \\sqrt{169} = 13$."]),
      ex(1, vec("vec-ex-2", "$P(2, -3)$ and $Q(-1, 1)$. Find $\\vec{PQ}$.", [-3, 4], "$Q - P$."), ["$\\vec{PQ} = Q - P = (-1 - 2,\\ 1 + 3) = (-3, 4)$."]),
      ex(1, num("vec-ex-3", "Find the distance between $(-2, 5)$ and $(4, -3)$.", 10, "$\\sqrt{36 + 64}$."), ["Differences: $4 - (-2) = 6$ and $-3 - 5 = -8$.", "$\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$."]),
      ex(2, vec("vec-ex-4", "Find the unit vector in the direction of $(6, -8)$.", [0.6, -0.8], "Divide by the length 10."), ["$|(6, -8)| = \\sqrt{36 + 64} = 10$.", "$\\hat v = \\tfrac{1}{10}(6, -8) = (0.6, -0.8)$."]),
      ex(2, num("vec-ex-5", "Find $k > 0$ such that $|(k, 2k)| = 5\\sqrt5$.", 5, "$5k^2 = 125$."), ["$k^2 + 4k^2 = 5k^2 = (5\\sqrt5)^2 = 125$.", "$k^2 = 25$ and $k > 0$, so $k = 5$."]),
      ex(
        2,
        mc("vec-ex-6", "Are $A(1, 2)$, $B(3, 6)$ and $C(4, 8)$ collinear?", ["Yes, because $\\vec{AC} = \\tfrac32\\vec{AB}$", "$\\vec{AB} = (2, 4)$ and $\\vec{AC} = (3, 6)$ are parallel and share the point $A$."], [
          ["No, the points have different coordinates", "Collinear means the displacements are parallel, not that coordinates match."],
          ["It cannot be decided without a graph", "Compare the displacement vectors."],
        ]),
        ["$\\vec{AB} = (2, 4)$ and $\\vec{AC} = (3, 6)$.", "$\\vec{AC} = \\tfrac32\\vec{AB}$: the displacements are parallel and both start at $A$, so the three points lie on one line."],
      ),
      ex(3, vec("vec-ex-7", "$A(2, 0, -1)$ and $B(4, 3, 5)$. Find the vector of magnitude 14 in the direction of $\\vec{AB}$.", [4, 6, 12], "Twice $\\vec{AB}$."), [
        "$\\vec{AB} = (2, 3, 6)$ and $|\\vec{AB}| = \\sqrt{4 + 9 + 36} = 7$.",
        "Magnitude 14 is twice that: $2(2, 3, 6) = (4, 6, 12)$.",
      ]),
      ex(3, num("vec-ex-8", "$P$ lies on the $x$-axis and is equidistant from $A(1, 2)$ and $B(5, 4)$. Find the $x$-coordinate of $P$.", 4.5, "Equate squared distances."), [
        "Let $P = (x, 0)$. Equate squared distances: $(x - 1)^2 + 4 = (x - 5)^2 + 16$.",
        "$x^2 - 2x + 5 = x^2 - 10x + 41$, so $8x = 36$ and $x = 4.5$.",
      ]),
      ex(3, num("vec-ex-9", "How many vectors $(x, y)$ with integer components have magnitude 5?", 12, "Count integer solutions of $x^2 + y^2 = 25$."), [
        "We need integers with $x^2 + y^2 = 25$.",
        "On the axes: $(\\pm5, 0)$ and $(0, \\pm5)$, four vectors.",
        "From $9 + 16 = 25$: $(\\pm3, \\pm4)$ and $(\\pm4, \\pm3)$, eight vectors. No other pair of squares sums to 25.",
        "Total: $4 + 8 = 12$.",
      ]),
    ],
  },

  // §{vector-add}
  "vector-add": {
    definitions: [
      {
        type: "definition",
        term: "sum and difference",
        body: "For $\\vec a = (a_1, a_2)$ and $\\vec b = (b_1, b_2)$: $\\vec a + \\vec b = (a_1 + b_1,\\ a_2 + b_2)$, and $\\vec a - \\vec b = \\vec a + (-\\vec b) = (a_1 - b_1,\\ a_2 - b_2)$. The **zero vector** $\\vec 0 = (0, 0)$ is the movement that goes nowhere.",
      },
      {
        type: "definition",
        term: "triangle and parallelogram laws",
        body: "**Triangle law:** place $\\vec b$ so that it starts where $\\vec a$ ends; then $\\vec a + \\vec b$ runs from the start of $\\vec a$ to the end of $\\vec b$. **Parallelogram law:** draw $\\vec a$ and $\\vec b$ from one point and complete the parallelogram. The diagonal from that point is $\\vec a + \\vec b$; the other diagonal is $\\vec a - \\vec b$ or $\\vec b - \\vec a$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "laws of addition",
        statement: "For all vectors $\\vec a, \\vec b, \\vec c$: $\\vec a + \\vec b = \\vec b + \\vec a$, $(\\vec a + \\vec b) + \\vec c = \\vec a + (\\vec b + \\vec c)$, $\\vec a + \\vec 0 = \\vec a$ and $\\vec a + (-\\vec a) = \\vec 0$.",
        proof: [
          "Each identity holds component by component because it holds for real numbers. For instance $a_1 + b_1 = b_1 + a_1$ and $a_2 + b_2 = b_2 + a_2$, so $\\vec a + \\vec b$ and $\\vec b + \\vec a$ have equal components and are equal.",
        ],
      },
      {
        type: "theorem",
        name: "triangle inequality",
        statement: "$|\\vec a + \\vec b| \\le |\\vec a| + |\\vec b|$, with equality exactly when one vector is a non-negative multiple of the other.",
        proof: [
          "Place $\\vec a$ and $\\vec b$ tip to tail. Then $\\vec a$, $\\vec b$ and $\\vec a + \\vec b$ are the sides of a triangle, and no side of a triangle is longer than the other two together.",
          "The triangle collapses to a segment, and the lengths add exactly, only when $\\vec a$ and $\\vec b$ point the same way.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$\\vec a = (3, 1)$ and $\\vec b = (1, 2)$. Find $\\vec a + \\vec b$ and $\\vec a - \\vec b$.",
        solution: ["Add components: $(3 + 1,\\ 1 + 2) = (4, 3)$.", "Subtract components: $(3 - 1,\\ 1 - 2) = (2, -1)$."],
        result: "$(4, 3)$ and $(2, -1)$.",
      },
      {
        type: "example",
        level: 2,
        title: "fourth vertex of a parallelogram",
        problem: "$ABCD$ is a parallelogram (vertices in order) with $A(1, 1)$, $B(4, 2)$ and $C(6, 5)$. Find $D$.",
        solution: [
          "In parallelogram $ABCD$, $\\vec{AD} = \\vec{BC}$: opposite sides are equal and parallel.",
          "$\\vec{BC} = C - B = (2, 3)$, so $D = A + (2, 3) = (3, 4)$.",
          "Check with the diagonals: both $AC$ and $BD$ have midpoint $(3.5, 3)$, as the diagonals of a parallelogram bisect each other.",
        ],
        result: "$D(3, 4)$.",
      },
      {
        type: "example",
        level: 3,
        title: "two vector equations",
        problem: "Vectors satisfy $\\vec a + \\vec b = (5, 1)$ and $\\vec a - \\vec b = (1, 3)$. Find $\\vec a$, $\\vec b$ and $|\\vec a + 2\\vec b|$.",
        solution: [
          "Add the equations: $2\\vec a = (6, 4)$, so $\\vec a = (3, 2)$.",
          "Subtract them: $2\\vec b = (4, -2)$, so $\\vec b = (2, -1)$.",
          "$\\vec a + 2\\vec b = (3 + 4,\\ 2 - 2) = (7, 0)$, of length 7.",
        ],
        result: "$\\vec a = (3, 2)$, $\\vec b = (2, -1)$, $|\\vec a + 2\\vec b| = 7$.",
      },
    ],
    pitfalls: [
      { wrong: "$|\\vec a + \\vec b| = |\\vec a| + |\\vec b|$.", right: "Only when they point the same way. In general $|\\vec a + \\vec b| \\le |\\vec a| + |\\vec b|$: $|(3, 0) + (0, 4)| = 5$, not 7." },
      { wrong: "$\\vec a - \\vec b = \\vec b - \\vec a$.", right: "Subtraction is not commutative: $\\vec b - \\vec a = -(\\vec a - \\vec b)$, the same length in the opposite direction." },
      { wrong: "In parallelogram $ABCD$, $D = A + B - C$.", right: "The vertices go round in order, so $\\vec{AD} = \\vec{BC}$ and $D = A + C - B$." },
    ],
    formulas: [
      { label: "Sum", tex: "\\vec a + \\vec b = (a_1 + b_1,\\ a_2 + b_2)" },
      { label: "Displacement", tex: "\\vec{AB} = \\vec b - \\vec a" },
      { label: "Triangle inequality", tex: "|\\vec a + \\vec b| \\le |\\vec a| + |\\vec b|" },
      { label: "Parallelogram ABCD", tex: "\\vec d = \\vec a + \\vec c - \\vec b" },
    ],
    exercises: [
      ex(1, vec("vadd-ex-1", "Compute $(2, -3) + (-5, 7)$.", [-3, 4], "Add components."), ["$(2 - 5,\\ -3 + 7) = (-3, 4)$."]),
      ex(1, vec("vadd-ex-2", "Compute $(4, 1) - (6, -2)$.", [-2, 3], "Subtract components."), ["$(4 - 6,\\ 1 - (-2)) = (-2, 3)$."]),
      ex(1, vec("vadd-ex-3", "Forces $\\vec F_1 = (3, -1)$ and $\\vec F_2 = (-5, 4)$ act on a body. Find $\\vec F_3$ so that the body is in equilibrium: $\\vec F_1 + \\vec F_2 + \\vec F_3 = \\vec 0$.", [2, -3], "$-(\\vec F_1 + \\vec F_2)$."), [
        "$\\vec F_3 = -(\\vec F_1 + \\vec F_2) = -(-2, 3) = (2, -3)$.",
      ]),
      ex(2, vec("vadd-ex-4", "$ABCD$ is a parallelogram with $A(-1, 0)$, $B(3, 1)$ and $C(4, 4)$. Find $D$.", [0, 3], "$D = A + C - B$."), ["$\\vec{AD} = \\vec{BC} = (1, 3)$.", "$D = A + (1, 3) = (0, 3)$."]),
      ex(2, num("vadd-ex-5", "Find $|\\vec a + \\vec b|$ for $\\vec a = (3, 0)$ and $\\vec b = (0, 4)$.", 5, "$|(3, 4)|$."), [
        "$\\vec a + \\vec b = (3, 4)$, of length $\\sqrt{9 + 16} = 5$.",
        "Here $|\\vec a| + |\\vec b| = 7 > 5$: the triangle inequality is strict because the vectors are not parallel.",
      ]),
      ex(2, num("vadd-ex-6", "A boat heads due north at 4 km/h relative to the water, and the river flows due east at 3 km/h. Find the boat's speed over the ground, in km/h.", 5, "$|(3, 4)|$."), [
        "Ground velocity = velocity relative to the water + velocity of the water $= (0, 4) + (3, 0) = (3, 4)$.",
        "Speed $= |(3, 4)| = 5$ km/h.",
      ]),
      ex(3, vec("vadd-ex-7", "$2\\vec a + \\vec b = (7, 4)$ and $\\vec a - \\vec b = (2, -1)$. Find $\\vec a$.", [3, 1], "Add the equations."), [
        "Adding the equations eliminates $\\vec b$: $3\\vec a = (9, 3)$.",
        "$\\vec a = (3, 1)$, and then $\\vec b = \\vec a - (2, -1) = (1, 2)$.",
      ]),
      ex(
        3,
        mc("vadd-ex-8", "Which pair of vectors satisfies $|\\vec a + \\vec b| = |\\vec a| + |\\vec b|$?", ["$(1, 2)$ and $(3, 6)$", "$(3, 6) = 3(1, 2)$: same direction, so the lengths add."], [
          ["$(1, 2)$ and $(-3, -6)$", "Opposite directions: the lengths subtract."],
          ["$(1, 2)$ and $(2, 1)$", "Not parallel, so the inequality is strict."],
        ]),
        ["Equality in the triangle inequality needs one vector to be a non-negative multiple of the other.", "$(3, 6) = 3(1, 2)$ with $3 > 0$. Check: $|(4, 8)| = 4\\sqrt5 = \\sqrt5 + 3\\sqrt5$."],
      ),
      ex(3, num("vadd-ex-9", "$\\vec a + \\vec b + \\vec c = \\vec 0$, where $|\\vec a| = 3$, $|\\vec b| = 4$ and $\\vec a$ is perpendicular to $\\vec b$. Find $|\\vec c|$.", 5, "$|\\vec c| = |\\vec a + \\vec b|$."), [
        "$\\vec c = -(\\vec a + \\vec b)$, so $|\\vec c| = |\\vec a + \\vec b|$.",
        "Tip to tail, perpendicular vectors of lengths 3 and 4 form a right angle, so $|\\vec a + \\vec b| = \\sqrt{3^2 + 4^2} = 5$.",
      ]),
    ],
  },

  // §{scalar}
  scalar: {
    definitions: [
      {
        type: "definition",
        term: "scalar multiple",
        body: "For a real number $k$ and $\\vec v = (x, y)$, $k\\vec v = (kx, ky)$. If $k > 0$ it points the same way as $\\vec v$, if $k < 0$ the opposite way, and its length is $|k|$ times that of $\\vec v$.",
      },
      {
        type: "definition",
        term: "parallel, collinear",
        body: "Non-zero vectors $\\vec a$ and $\\vec b$ are **parallel** when $\\vec b = k\\vec a$ for some real $k \\neq 0$; in components, $a_1b_2 - a_2b_1 = 0$. Points $A, B, C$ are **collinear** when $\\vec{AB}$ and $\\vec{AC}$ are parallel.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        statement: "$|k\\vec v| = |k|\\,|\\vec v|$ for every real $k$.",
        proof: ["$|k\\vec v| = \\sqrt{(kx)^2 + (ky)^2} = \\sqrt{k^2(x^2 + y^2)} = \\sqrt{k^2}\\,\\sqrt{x^2 + y^2} = |k|\\,|\\vec v|$."],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "section formula",
        statement:
          "The point $P$ dividing $AB$ internally in the ratio $m : n$ (so $AP : PB = m : n$) has position vector $\\vec p = \\dfrac{n\\vec a + m\\vec b}{m + n}$. Dividing externally in the ratio $m : n$ with $m \\neq n$: $\\vec p = \\dfrac{m\\vec b - n\\vec a}{m - n}$. In particular the midpoint is $\\tfrac12(\\vec a + \\vec b)$ and the centroid of triangle $ABC$ is $\\tfrac13(\\vec a + \\vec b + \\vec c)$.",
        proof: [
          "$P$ lies $\\tfrac{m}{m + n}$ of the way from $A$ to $B$, so $\\vec p = \\vec a + \\tfrac{m}{m + n}(\\vec b - \\vec a) = \\dfrac{(m + n)\\vec a - m\\vec a + m\\vec b}{m + n} = \\dfrac{n\\vec a + m\\vec b}{m + n}$.",
          "For external division $\\vec{AP} = \\tfrac{m}{m - n}\\vec{AB}$, and the same algebra gives $\\vec p = \\dfrac{m\\vec b - n\\vec a}{m - n}$.",
          "The centroid lies two-thirds of the way from $A$ to the midpoint of $BC$: $\\vec a + \\tfrac23\\left(\\tfrac{\\vec b + \\vec c}{2} - \\vec a\\right) = \\tfrac13(\\vec a + \\vec b + \\vec c)$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find $3(2, -1)$ and $|-2(3, 4)|$.",
        solution: ["$3(2, -1) = (6, -3)$.", "$|-2(3, 4)| = |-2| \\cdot |(3, 4)| = 2 \\cdot 5 = 10$."],
        result: "$(6, -3)$ and $10$.",
      },
      {
        type: "example",
        level: 2,
        title: "section formula",
        problem: "Find the point dividing $A(1, 2)$, $B(7, 8)$ internally in the ratio $1 : 2$.",
        solution: [
          "With $m = 1$ and $n = 2$: $\\vec p = \\dfrac{2\\vec a + \\vec b}{3}$.",
          "$= \\tfrac13\\big(2(1, 2) + (7, 8)\\big) = \\tfrac13(9, 12) = (3, 4)$.",
          "Check: $\\vec{AP} = (2, 2)$ and $\\vec{PB} = (4, 4)$, in the same direction with lengths in the ratio $1 : 2$.",
        ],
        result: "$P(3, 4)$.",
      },
      {
        type: "example",
        level: 3,
        title: "a collinearity condition",
        problem: "For which $\\lambda$ are $A(1, 2)$, $B(3, \\lambda)$ and $C(7, 11)$ collinear?",
        solution: [
          "$\\vec{AB} = (2,\\ \\lambda - 2)$ and $\\vec{AC} = (6, 9)$.",
          "Parallel when $2 \\cdot 9 - 6(\\lambda - 2) = 0$, i.e. $18 = 6\\lambda - 12$, so $\\lambda = 5$.",
          "Check: $\\vec{AB} = (2, 3)$ and $\\vec{AC} = (6, 9) = 3(2, 3)$.",
        ],
        result: "$\\lambda = 5$.",
      },
    ],
    pitfalls: [
      { wrong: "$-2\\vec v$ is shorter than $\\vec v$.", right: "Its length is $2|\\vec v|$. The minus sign reverses the direction; the 2 doubles the length." },
      { wrong: "Dividing $AB$ in the ratio $m : n$ gives $\\dfrac{m\\vec a + n\\vec b}{m + n}$.", right: "The weights cross over: $\\dfrac{n\\vec a + m\\vec b}{m + n}$. When $m < n$ the point is nearer $A$, so $A$ gets the larger weight." },
      { wrong: "$k(x, y) = (kx, y)$.", right: "Both components are multiplied: $(kx, ky)$." },
    ],
    formulas: [
      { label: "Scalar multiple", tex: "k(x, y) = (kx, ky),\\quad |k\\vec v| = |k|\\,|\\vec v|" },
      { label: "Parallel", tex: "a_1b_2 - a_2b_1 = 0" },
      { label: "Internal division m : n", tex: "\\vec p = \\dfrac{n\\vec a + m\\vec b}{m + n}" },
      { label: "External division m : n", tex: "\\vec p = \\dfrac{m\\vec b - n\\vec a}{m - n}" },
      { label: "Centroid", tex: "\\vec g = \\tfrac13(\\vec a + \\vec b + \\vec c)" },
    ],
    exercises: [
      ex(1, vec("scal-ex-1", "Compute $-2(3, -1)$.", [-6, 2], "Multiply both components."), ["$(-2 \\cdot 3,\\ -2 \\cdot (-1)) = (-6, 2)$."]),
      ex(1, vec("scal-ex-2", "Find the midpoint of $(-3, 7)$ and $(5, -1)$.", [1, 3], "Average the coordinates."), ["$\\tfrac12\\big((-3, 7) + (5, -1)\\big) = \\tfrac12(2, 6) = (1, 3)$."]),
      ex(1, num("scal-ex-3", "Find $|-3(1, -1)|$. An exact form such as 3sqrt(2) is fine.", 3 * Math.SQRT2, "$3\\sqrt2$.", 0.005), ["$|-3| \\cdot |(1, -1)| = 3\\sqrt2 \\approx 4.24$."]),
      ex(2, vec("scal-ex-4", "Find the point dividing $A(2, -1)$, $B(8, 5)$ internally in the ratio $2 : 1$.", [6, 3], "$\\tfrac13(\\vec a + 2\\vec b)$."), [
        "With $m = 2$ and $n = 1$: $\\vec p = \\tfrac13(\\vec a + 2\\vec b)$.",
        "$= \\tfrac13\\big((2, -1) + (16, 10)\\big) = \\tfrac13(18, 9) = (6, 3)$.",
      ]),
      ex(2, num("scal-ex-5", "Find $k$ so that $(k, 4)$ is parallel to $(3, 6)$.", 2, "$6k - 12 = 0$."), ["Parallel: $k \\cdot 6 - 4 \\cdot 3 = 0$.", "$6k = 12$, so $k = 2$; indeed $(2, 4) = \\tfrac23(3, 6)$."]),
      ex(2, vec("scal-ex-6", "Find the centroid of the triangle with vertices $(2, 3)$, $(-4, 1)$ and $(5, -1)$.", [1, 1], "Average the three vertices."), [
        "$\\tfrac13\\big(2 - 4 + 5,\\ 3 + 1 - 1\\big) = \\tfrac13(3, 3) = (1, 1)$.",
      ]),
      ex(3, vec("scal-ex-7", "Find the point dividing $A(2, 1)$, $B(5, 4)$ externally in the ratio $2 : 1$.", [8, 7], "$\\dfrac{2\\vec b - \\vec a}{1}$."), [
        "External division: $\\vec p = \\dfrac{2\\vec b - \\vec a}{2 - 1} = 2(5, 4) - (2, 1) = (8, 7)$.",
        "Check: $P$ lies beyond $B$ with $AP = 2\\,BP$, since $\\vec{AP} = (6, 6)$ and $\\vec{BP} = (3, 3)$.",
      ]),
      ex(3, num("scal-ex-8", "The $y$-axis divides the segment from $A(-2, 3)$ to $B(6, 7)$ in the ratio $m : n$. Find $m/n$.", 1 / 3, "Set the $x$-coordinate to 0.", 0.001), [
        "The point dividing $AB$ in the ratio $m : n$ has $x = \\dfrac{-2n + 6m}{m + n}$.",
        "On the $y$-axis, $x = 0$: $6m = 2n$, so $m : n = 1 : 3$.",
      ]),
      ex(
        3,
        mc("scal-ex-9", "If $|k\\vec a| = |\\vec a|$ and $\\vec a \\neq \\vec 0$, then $k$ is", ["$1$ or $-1$", "$|k|\\,|\\vec a| = |\\vec a|$ forces $|k| = 1$."], [
          ["only $1$", "$k = -1$ also keeps the length; it reverses the direction."],
          ["any real number", "Most values of $k$ change the length."],
        ]),
        ["$|k\\vec a| = |k|\\,|\\vec a|$, so $|k|\\,|\\vec a| = |\\vec a|$.", "Divide by $|\\vec a| \\neq 0$: $|k| = 1$, so $k = \\pm 1$."],
      ),
    ],
  },

  // §{linear-combination}
  "linear-combination": {
    definitions: [
      {
        type: "definition",
        term: "linear combination",
        body: "A **linear combination** of $\\vec v$ and $\\vec w$ is any vector $\\alpha\\vec v + \\beta\\vec w$ with real **coefficients** $\\alpha$ and $\\beta$. Finding the coefficients that produce a given $\\vec u$ means solving $\\alpha\\vec v + \\beta\\vec w = \\vec u$: two simultaneous equations, one per component.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "unique coefficients",
        statement:
          "If $\\vec v = (v_1, v_2)$ and $\\vec w = (w_1, w_2)$ are not parallel, so $v_1w_2 - v_2w_1 \\neq 0$, then every $\\vec u = (u_1, u_2)$ is a combination $\\alpha\\vec v + \\beta\\vec w$ in exactly one way, with $\\alpha = \\dfrac{u_1w_2 - u_2w_1}{v_1w_2 - v_2w_1}$ and $\\beta = \\dfrac{v_1u_2 - v_2u_1}{v_1w_2 - v_2w_1}$.",
        proof: [
          "The components give $\\alpha v_1 + \\beta w_1 = u_1$ and $\\alpha v_2 + \\beta w_2 = u_2$.",
          "Multiply the first equation by $w_2$, the second by $w_1$, and subtract: $\\alpha(v_1w_2 - v_2w_1) = u_1w_2 - u_2w_1$. Eliminating $\\alpha$ the same way gives $\\beta$.",
          "Since $v_1w_2 - v_2w_1 \\neq 0$ we may divide, so a solution exists, and the elimination shows it is the only one.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Compute $2(1, 3) - 3(2, -1)$.",
        solution: ["$2(1, 3) = (2, 6)$ and $3(2, -1) = (6, -3)$.", "$(2, 6) - (6, -3) = (-4, 9)$."],
        result: "$(-4, 9)$.",
      },
      {
        type: "example",
        level: 2,
        title: "finding coefficients",
        problem: "Write $\\vec u = (7, 4)$ as $\\alpha(2, 1) + \\beta(1, 1)$.",
        solution: ["Components: $2\\alpha + \\beta = 7$ and $\\alpha + \\beta = 4$.", "Subtract: $\\alpha = 3$, and then $\\beta = 1$.", "Check: $3(2, 1) + (1, 1) = (7, 4)$."],
        result: "$\\alpha = 3$, $\\beta = 1$.",
      },
      {
        type: "example",
        level: 3,
        title: "parallel vectors",
        problem: "Find all $(\\alpha, \\beta)$ with $\\alpha(1, 2) + \\beta(2, 4) = (3, 6)$, and show that $(3, 5)$ is not a combination of $(1, 2)$ and $(2, 4)$.",
        solution: [
          "Both component equations reduce to $\\alpha + 2\\beta = 3$ (the second is twice the first), so there are infinitely many solutions: $\\alpha = 3 - 2\\beta$ for any $\\beta$.",
          "Every combination $\\alpha(1, 2) + \\beta(2, 4) = (\\alpha + 2\\beta)(1, 2)$ is a multiple of $(1, 2)$.",
          "$(3, 5)$ is not a multiple of $(1, 2)$, since $3 \\cdot 2 \\neq 5$, so it cannot be reached.",
        ],
        result: "$\\alpha = 3 - 2\\beta$ with $\\beta$ free; $(3, 5)$ is unreachable.",
      },
    ],
    pitfalls: [
      { wrong: "Every vector is a combination of any two vectors.", right: "Only of two non-parallel vectors. Parallel vectors reach only their common line." },
      { wrong: "$\\alpha\\vec v + \\beta\\vec w = (\\alpha + \\beta)(\\vec v + \\vec w)$.", right: "Scale each vector by its own coefficient first, then add." },
    ],
    formulas: [
      { label: "Combination", tex: "\\alpha\\vec v + \\beta\\vec w = (\\alpha v_1 + \\beta w_1,\\ \\alpha v_2 + \\beta w_2)" },
      { label: "Unique coefficients when", tex: "v_1w_2 - v_2w_1 \\neq 0" },
    ],
    exercises: [
      ex(1, vec("lc-ex-1", "Compute $3(1, -1) + 2(0, 2)$.", [3, 1], "Scale, then add."), ["$(3, -3) + (0, 4) = (3, 1)$."]),
      ex(1, vec("lc-ex-2", "Compute $\\tfrac12(4, -2) - (1, 3)$.", [1, -4], "Scale, then subtract."), ["$(2, -1) - (1, 3) = (1, -4)$."]),
      ex(2, vec("lc-ex-3", "Find $(\\alpha, \\beta)$ with $\\alpha(1, 1) + \\beta(1, -1) = (5, 1)$.", [3, 2], "Solve the pair of equations."), [
        "$\\alpha + \\beta = 5$ and $\\alpha - \\beta = 1$.",
        "Adding: $2\\alpha = 6$, so $\\alpha = 3$ and $\\beta = 2$.",
      ]),
      ex(2, vec("lc-ex-4", "Find $(\\alpha, \\beta)$ with $\\alpha(2, 1) + \\beta(-1, 3) = (0, 7)$.", [1, 2], "Solve the pair of equations."), [
        "$2\\alpha - \\beta = 0$ and $\\alpha + 3\\beta = 7$.",
        "From the first, $\\beta = 2\\alpha$; then $7\\alpha = 7$, so $\\alpha = 1$ and $\\beta = 2$.",
      ]),
      ex(
        2,
        mc("lc-ex-5", "Can $(3, 5)$ be written as a combination of $(1, 2)$ and $(2, 4)$?", ["No", "Every combination is a multiple of $(1, 2)$, and $(3, 5)$ is not."], [
          ["Yes, in exactly one way", "That needs the two vectors to be non-parallel."],
          ["Yes, in infinitely many ways", "That happens only for targets on the line through $(1, 2)$."],
        ]),
        ["$(2, 4) = 2(1, 2)$, so every combination equals $(\\alpha + 2\\beta)(1, 2)$, a multiple of $(1, 2)$.", "$(3, 5)$ would need $3 \\cdot 2 = 5$. It is not on that line."],
      ),
      ex(3, vec("lc-ex-6", "Find $(\\alpha, \\beta)$ with $\\alpha(1, 2) + \\beta(3, 1) = (8, 1)$.", [-1, 3], "Substitute and solve."), [
        "$\\alpha + 3\\beta = 8$ and $2\\alpha + \\beta = 1$.",
        "From the second, $\\beta = 1 - 2\\alpha$; substituting, $\\alpha + 3 - 6\\alpha = 8$, so $\\alpha = -1$ and $\\beta = 3$.",
        "Check: $-(1, 2) + 3(3, 1) = (8, 1)$.",
      ]),
      ex(3, num("lc-ex-7", "For which $k$ is $(k, 3)$ a combination of $(1, 2)$ and $(2, 4)$?", 1.5, "It must be a multiple of $(1, 2)$."), [
        "The combinations are exactly the multiples of $(1, 2)$.",
        "$(k, 3) = t(1, 2)$ needs $t = 1.5$, so $k = 1.5$.",
      ]),
      ex(3, num("lc-ex-8", "$\\vec u = (1, k)$ and $\\vec v = (k, 9)$. For how many real values of $k$ are $\\vec u$ and $\\vec v$ parallel (so that combinations are not unique)?", 2, "$9 - k^2 = 0$."), [
        "Parallel when $1 \\cdot 9 - k \\cdot k = 0$.",
        "$k^2 = 9$ gives $k = 3$ or $k = -3$: two values.",
      ]),
    ],
  },

  // §{basis}
  basis: {
    definitions: [
      {
        type: "definition",
        term: "basis, coordinates",
        body: "A **basis** of the plane is a pair of non-parallel vectors $\\{\\vec b_1, \\vec b_2\\}$. By the unique-coefficients theorem every vector can be written as $\\vec v = c_1\\vec b_1 + c_2\\vec b_2$ in exactly one way; the ordered pair $(c_1, c_2)$ is the **coordinate vector** of $\\vec v$ in that basis. The **standard basis** is $\\hat\\imath = (1, 0)$, $\\hat\\jmath = (0, 1)$.",
      },
      {
        type: "definition",
        term: "basis of space",
        body: "In space a basis has three vectors, none of which is a combination of the other two, such as $\\hat\\imath$, $\\hat\\jmath$, $\\hat k$. Two vectors are never enough: their combinations fill at most a plane.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "change of coordinates",
        statement:
          "If $\\vec b_1 = (p, r)$ and $\\vec b_2 = (q, s)$ with $ps - qr \\neq 0$, then the coordinates of $\\vec v = (x, y)$ in the basis $\\{\\vec b_1, \\vec b_2\\}$ are $c_1 = \\dfrac{sx - qy}{ps - qr}$ and $c_2 = \\dfrac{py - rx}{ps - qr}$.",
        proof: [
          "This is the unique-coefficients theorem of §{linear-combination} with $\\vec v$ and $\\vec w$ replaced by $\\vec b_1$ and $\\vec b_2$.",
          "Check: $c_1p + c_2q = \\dfrac{psx - pqy + pqy - qrx}{ps - qr} = x$, and in the same way $c_1r + c_2s = y$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "What are the coordinates of $(3, 2)$ in the standard basis?",
        solution: ["$(3, 2) = 3\\hat\\imath + 2\\hat\\jmath$, so its coordinates are $(3, 2)$.", "In the standard basis coordinates and components coincide; in any other basis they differ."],
        result: "$(3, 2)$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Find the coordinates of $\\vec v = (4, 2)$ in the basis $\\vec b_1 = (1, 1)$, $\\vec b_2 = (1, -1)$.",
        solution: ["Solve $c_1 + c_2 = 4$ and $c_1 - c_2 = 2$.", "$c_1 = 3$ and $c_2 = 1$. Check: $3(1, 1) + (1, -1) = (4, 2)$."],
        result: "$(3, 1)$.",
      },
      {
        type: "example",
        level: 3,
        title: "between two bases",
        problem: "In the basis $\\{(2, 1), (1, 1)\\}$ a vector has coordinates $(2, -1)$. Find the vector, then its coordinates in the basis $\\{(1, 2), (3, -1)\\}$.",
        solution: [
          "$\\vec v = 2(2, 1) - (1, 1) = (3, 1)$.",
          "Solve $c_1(1, 2) + c_2(3, -1) = (3, 1)$: $c_1 + 3c_2 = 3$ and $2c_1 - c_2 = 1$.",
          "From the second, $c_2 = 2c_1 - 1$; substituting, $7c_1 = 6$, so $c_1 = \\tfrac67$ and $c_2 = \\tfrac57$.",
        ],
        result: "$\\vec v = (3, 1)$, with new coordinates $\\left(\\tfrac67, \\tfrac57\\right)$.",
      },
    ],
    pitfalls: [
      { wrong: "Any two different vectors form a basis.", right: "They must be non-parallel. $(1, 2)$ and $(2, 4)$ are different but reach only a line." },
      { wrong: "Coordinates in a new basis equal the components.", right: "Only in the standard basis. In the basis $\\{(1, 1), (1, -1)\\}$ the vector $(4, 2)$ has coordinates $(3, 1)$." },
      { wrong: "The order of the basis vectors does not matter.", right: "Coordinates form an ordered pair: swapping $\\vec b_1$ and $\\vec b_2$ swaps the coordinates." },
    ],
    formulas: [
      { label: "Coordinates", tex: "\\vec v = c_1\\vec b_1 + c_2\\vec b_2" },
      { label: "Basis test for (p, r), (q, s)", tex: "ps - qr \\neq 0" },
    ],
    exercises: [
      ex(
        1,
        mc("bas-ex-1", "Which pair is a basis of the plane?", ["$(1, 2)$ and $(2, 1)$", "$1 \\cdot 1 - 2 \\cdot 2 = -3 \\neq 0$: not parallel."], [
          ["$(1, 2)$ and $(2, 4)$", "Parallel: $(2, 4) = 2(1, 2)$."],
          ["$(0, 0)$ and $(1, 0)$", "The zero vector is never part of a basis."],
        ]),
        ["A basis needs $ps - qr \\neq 0$.", "For $(1, 2), (2, 1)$ it is $1 \\cdot 1 - 2 \\cdot 2 = -3$; the other pairs give $0$."],
      ),
      ex(1, vec("bas-ex-2", "A vector has coordinates $(2, 3)$ in the basis $\\{(1, 1), (0, 1)\\}$. What is the vector?", [2, 5], "$2(1, 1) + 3(0, 1)$."), ["$2(1, 1) + 3(0, 1) = (2, 5)$."]),
      ex(2, vec("bas-ex-3", "Find the coordinates of $(5, 3)$ in the basis $\\{(1, 1), (1, -1)\\}$.", [4, 1], "Solve the pair of equations."), ["$c_1 + c_2 = 5$ and $c_1 - c_2 = 3$.", "$c_1 = 4$ and $c_2 = 1$."]),
      ex(2, num("bas-ex-4", "For which $k$ is $\\{(1, k), (2, 6)\\}$ not a basis?", 3, "$6 - 2k = 0$."), ["Not a basis exactly when the vectors are parallel: $1 \\cdot 6 - k \\cdot 2 = 0$.", "$k = 3$."]),
      ex(2, vec("bas-ex-5", "Find the coordinates of $(7, 5)$ in the basis $\\{(2, 1), (1, 2)\\}$.", [3, 1], "Solve the pair of equations."), [
        "$2c_1 + c_2 = 7$ and $c_1 + 2c_2 = 5$.",
        "Double the second and subtract the first: $3c_2 = 3$, so $c_2 = 1$ and $c_1 = 3$.",
      ]),
      ex(3, vec("bas-ex-6", "Find the coordinates of $(5, 3)$ in the basis $\\{(1, 2), (3, -1)\\}$.", [2, 1], "Substitute and solve."), [
        "$c_1 + 3c_2 = 5$ and $2c_1 - c_2 = 3$.",
        "$c_2 = 2c_1 - 3$; substituting, $7c_1 - 9 = 5$, so $c_1 = 2$ and $c_2 = 1$.",
      ]),
      ex(3, num("bas-ex-7", "The coordinates of $\\vec v$ in the basis $\\{\\vec b_1, \\vec b_2\\}$ are $(4, -1)$. What is the first coordinate of $\\vec v$ in the basis $\\{\\vec b_2, \\vec b_1\\}$?", -1, "Reorder the coordinates."), [
        "$\\vec v = 4\\vec b_1 - \\vec b_2 = (-1)\\vec b_2 + 4\\vec b_1$.",
        "In the order $(\\vec b_2, \\vec b_1)$ the coordinates are $(-1, 4)$.",
      ]),
      ex(3, vec("bas-ex-8", "Write $(3, 1, 2)$ as $c_1(1, 0, 0) + c_2(1, 1, 0) + c_3(1, 1, 1)$. Give $(c_1, c_2, c_3)$.", [2, -1, 2], "Solve from the last component up."), [
        "Third component: $c_3 = 2$.",
        "Second: $c_2 + c_3 = 1$, so $c_2 = -1$.",
        "First: $c_1 + c_2 + c_3 = 3$, so $c_1 = 2$.",
      ]),
    ],
  },

  // §{matrix-transform}
  "matrix-transform": {
    definitions: [
      {
        type: "definition",
        term: "linear transformation",
        body: "A map $T$ of the plane is **linear** when $T(\\vec u + \\vec v) = T(\\vec u) + T(\\vec v)$ and $T(k\\vec u) = kT(\\vec u)$ for all vectors and scalars. Consequences: $T(\\vec 0) = \\vec 0$, lines map to lines (or to a single point), and parallel lines stay parallel.",
      },
      {
        type: "definition",
        term: "matrix of a transformation",
        body: "Since $\\vec v = x\\hat\\imath + y\\hat\\jmath$, linearity gives $T(\\vec v) = xT(\\hat\\imath) + yT(\\hat\\jmath)$: a linear map is fixed by where it sends $\\hat\\imath$ and $\\hat\\jmath$. Its **matrix** has $T(\\hat\\imath)$ as first column and $T(\\hat\\jmath)$ as second column.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "rotation",
        statement: `Rotation anticlockwise about the origin by the angle $\\theta$ has matrix $R(\\theta) = ${M("\\cos\\theta", "-\\sin\\theta", "\\sin\\theta", "\\cos\\theta")}$.`,
        proof: [
          "Rotating $\\hat\\imath = (1, 0)$ by $\\theta$ gives the point of the unit circle at angle $\\theta$, namely $(\\cos\\theta, \\sin\\theta)$: the first column.",
          "$\\hat\\jmath$ sits at angle $90^\\circ$ and moves to angle $90^\\circ + \\theta$, the point $(\\cos(90^\\circ + \\theta), \\sin(90^\\circ + \\theta)) = (-\\sin\\theta, \\cos\\theta)$: the second column.",
        ],
      },
      {
        type: "theorem",
        name: "reflection",
        statement: `Reflection in the line through the origin at angle $\\theta$ to the $x$-axis has matrix $${M("\\cos 2\\theta", "\\sin 2\\theta", "\\sin 2\\theta", "-\\cos 2\\theta")}$. In particular, in the $x$-axis $${M("1", "0", "0", "-1")}$, in the $y$-axis $${M("-1", "0", "0", "1")}$ and in the line $y = x$, $${M("0", "1", "1", "0")}$.`,
        proof: [
          "Reflecting a direction at angle $\\varphi$ in a mirror at angle $\\theta$ gives the direction at angle $2\\theta - \\varphi$.",
          "So $\\hat\\imath$, at angle $0$, goes to $(\\cos 2\\theta, \\sin 2\\theta)$, and $\\hat\\jmath$, at angle $90^\\circ$, goes to angle $2\\theta - 90^\\circ$, the point $(\\sin 2\\theta, -\\cos 2\\theta)$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find the matrix of reflection in the $y$-axis and the image of $(3, 2)$.",
        solution: ["$\\hat\\imath = (1, 0) \\mapsto (-1, 0)$ and $\\hat\\jmath = (0, 1) \\mapsto (0, 1)$.", `The matrix is $${M("-1", "0", "0", "1")}$, and the image is $3(-1, 0) + 2(0, 1) = (-3, 2)$.`],
        result: `$${M("-1", "0", "0", "1")}$; image $(-3, 2)$.`,
      },
      {
        type: "example",
        level: 2,
        problem: "Find the image of $(3, 1)$ under anticlockwise rotation by $90^\\circ$.",
        solution: [`$R(90^\\circ) = ${M("0", "-1", "1", "0")}$, since $\\cos 90^\\circ = 0$ and $\\sin 90^\\circ = 1$.`, "$R(90^\\circ)(3, 1) = 3(0, 1) + 1(-1, 0) = (-1, 3)$."],
        result: "$(-1, 3)$.",
      },
      {
        type: "example",
        level: 3,
        title: "reflection in an oblique line",
        problem: "Find the matrix of reflection in the line $y = \\sqrt3\\,x$ and the image of $(2, 0)$.",
        solution: [
          "The line makes the angle $\\theta = 60^\\circ$ with the $x$-axis, because $\\tan 60^\\circ = \\sqrt3$. So $2\\theta = 120^\\circ$.",
          `$\\cos 120^\\circ = -\\tfrac12$ and $\\sin 120^\\circ = \\tfrac{\\sqrt3}{2}$, giving $${M("-\\tfrac12", "\\tfrac{\\sqrt3}{2}", "\\tfrac{\\sqrt3}{2}", "\\tfrac12")}$.`,
          "The image of $(2, 0)$ is twice the first column: $(-1, \\sqrt3)$. Check: it has length 2 and points at $120^\\circ$, the mirror image of $0^\\circ$ in a $60^\\circ$ line.",
        ],
        result: "$(-1, \\sqrt3)$.",
      },
    ],
    pitfalls: [
      { wrong: "The first row of the matrix is where $\\hat\\imath$ lands.", right: "The first column is. Each row mixes the two landing spots." },
      { wrong: "$T(x, y) = (x + 1, y)$ is linear because it maps lines to lines.", right: "It moves the origin, so $T(\\vec 0) \\neq \\vec 0$. A translation is not linear." },
      { wrong: `$${M("\\cos\\theta", "\\sin\\theta", "-\\sin\\theta", "\\cos\\theta")}$ rotates anticlockwise by $\\theta$.`, right: "That is $R(-\\theta)$, a clockwise rotation. Anticlockwise has $-\\sin\\theta$ in the top right." },
    ],
    formulas: [
      { label: "Rotation by θ", tex: `R(\\theta) = ${M("\\cos\\theta", "-\\sin\\theta", "\\sin\\theta", "\\cos\\theta")}` },
      { label: "Reflection in the line at angle θ", tex: M("\\cos 2\\theta", "\\sin 2\\theta", "\\sin 2\\theta", "-\\cos 2\\theta") },
      { label: "Stretch", tex: M("a", "0", "0", "d") },
      { label: "Shear along the x-axis", tex: M("1", "k", "0", "1") },
    ],
    exercises: [
      ex(1, mat("mt-ex-1", "Find the matrix of rotation by $180^\\circ$.", [[-1, 0], [0, -1]], "$\\cos 180^\\circ = -1$, $\\sin 180^\\circ = 0$."), [`$\\cos 180^\\circ = -1$ and $\\sin 180^\\circ = 0$: $${M("-1", "0", "0", "-1")}$. Every vector is reversed.`]),
      ex(1, mat("mt-ex-2", "$T(\\hat\\imath) = (2, 1)$ and $T(\\hat\\jmath) = (-1, 3)$. Write the matrix of $T$.", [[2, -1], [1, 3]], "The images are the columns."), [`The columns are the images: $${M("2", "-1", "1", "3")}$.`]),
      ex(1, mat("mt-ex-3", "Find the matrix of reflection in the line $y = x$.", [[0, 1], [1, 0]], "It swaps the axes."), [`$\\hat\\imath \\mapsto \\hat\\jmath$ and $\\hat\\jmath \\mapsto \\hat\\imath$: $${M("0", "1", "1", "0")}$.`]),
      ex(2, vec("mt-ex-4", "Rotate $(2, 1)$ anticlockwise by $90^\\circ$.", [-1, 2], "$(x, y) \\mapsto (-y, x)$."), ["$R(90^\\circ)(x, y) = (-y, x)$, so $(2, 1) \\mapsto (-1, 2)$."]),
      ex(
        2,
        mc("mt-ex-5", "Which map is linear?", ["$T(x, y) = (3x - y,\\ 2y)$", "Each output is a fixed combination of $x$ and $y$."], [
          ["$T(x, y) = (x + 1,\\ y)$", "$T(\\vec 0) = (1, 0) \\neq \\vec 0$."],
          ["$T(x, y) = (x^2,\\ y)$", "$T(2\\vec v) \\neq 2T(\\vec v)$ in general."],
        ]),
        ["A linear map sends $\\vec 0$ to $\\vec 0$, and each output is a combination of $x$ and $y$ with constant coefficients.", `$(3x - y, 2y)$ qualifies, with matrix $${M("3", "-1", "0", "2")}$.`],
      ),
      ex(2, vec("mt-ex-6", `A shear has matrix $${M("1", "2", "0", "1")}$. Find the image of $(1, 3)$.`, [7, 3], "$1(1, 0) + 3(2, 1)$."), ["$1(1, 0) + 3(2, 1) = (7, 3)$: each point slides sideways by twice its height."]),
      ex(3, vec("mt-ex-7", "A rotation by $\\theta$, with $0^\\circ < \\theta < 90^\\circ$ and $\\tan\\theta = \\tfrac34$. Find the image of $(5, 0)$.", [4, 3], "$\\cos\\theta = \\tfrac45$, $\\sin\\theta = \\tfrac35$."), [
        "$\\tan\\theta = \\tfrac34$ gives $\\cos\\theta = \\tfrac45$ and $\\sin\\theta = \\tfrac35$ (a 3-4-5 triangle).",
        "$R(\\theta)(5, 0) = 5(\\cos\\theta, \\sin\\theta) = (4, 3)$.",
      ]),
      ex(3, mat("mt-ex-8", "Find the matrix of reflection in the line $y = 2x$. Fractions or decimals are fine.", [[-0.6, 0.8], [0.8, 0.6]], "Use $\\cos 2\\theta$ and $\\sin 2\\theta$ from $\\tan\\theta = 2$."), [
        "With $\\tan\\theta = 2$: $\\cos 2\\theta = \\dfrac{1 - \\tan^2\\theta}{1 + \\tan^2\\theta} = -\\tfrac35$ and $\\sin 2\\theta = \\dfrac{2\\tan\\theta}{1 + \\tan^2\\theta} = \\tfrac45$.",
        `The matrix is $${M("-\\tfrac35", "\\tfrac45", "\\tfrac45", "\\tfrac35")}$. Check: $(1, 2)$, on the mirror, maps to itself.`,
      ]),
      ex(3, vec("mt-ex-9", "A rotation by $\\theta$, with $90^\\circ < \\theta < 180^\\circ$ and $\\sin\\theta = \\tfrac45$. Find the image of $(5, 0)$.", [-3, 4], "In the second quadrant $\\cos\\theta < 0$."), [
        "$\\cos^2\\theta = 1 - \\tfrac{16}{25} = \\tfrac{9}{25}$, and $\\cos\\theta < 0$ in the second quadrant, so $\\cos\\theta = -\\tfrac35$.",
        "$R(\\theta)(5, 0) = 5(\\cos\\theta, \\sin\\theta) = (-3, 4)$.",
      ]),
    ],
  },

  // §{matrix-vector}
  "matrix-vector": {
    definitions: [
      {
        type: "definition",
        term: "matrix–vector product",
        body: `For $A = ${M("a", "b", "c", "d")}$ and $\\vec x = (x, y)$: $A\\vec x = x${C("a", "c")} + y${C("b", "d")} = ${C("ax + by", "cx + dy")}$. In the **column picture** the entries of $\\vec x$ weight the columns of $A$; in the **row picture** each output entry is a row of $A$ times $\\vec x$.`,
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "linearity",
        statement: "For every matrix $A$, vectors $\\vec u, \\vec v$ and scalars $\\alpha, \\beta$: $A(\\alpha\\vec u + \\beta\\vec v) = \\alpha A\\vec u + \\beta A\\vec v$.",
        proof: [
          "Let $A$ have columns $\\vec a_1, \\vec a_2$. Then $A(\\alpha\\vec u + \\beta\\vec v) = (\\alpha u_1 + \\beta v_1)\\vec a_1 + (\\alpha u_2 + \\beta v_2)\\vec a_2$.",
          "Regroup: $\\alpha(u_1\\vec a_1 + u_2\\vec a_2) + \\beta(v_1\\vec a_1 + v_2\\vec a_2) = \\alpha A\\vec u + \\beta A\\vec v$.",
        ],
      },
      {
        type: "theorem",
        kind: "Corollary",
        statement: "A matrix is determined by its action on any basis: if $A\\vec b_1$ and $A\\vec b_2$ are known, then $A\\vec v = c_1A\\vec b_1 + c_2A\\vec b_2$, where $(c_1, c_2)$ are the coordinates of $\\vec v$ in the basis.",
        proof: ["Write $\\vec v = c_1\\vec b_1 + c_2\\vec b_2$, which is possible in exactly one way by §{basis}, and apply linearity."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Compute $${M("2", "1", "0", "3")}${C("1", "2")}$ in both pictures.`,
        solution: [`Column picture: $1${C("2", "0")} + 2${C("1", "3")} = ${C("4", "6")}$.`, "Row picture: $2 \\cdot 1 + 1 \\cdot 2 = 4$ and $0 \\cdot 1 + 3 \\cdot 2 = 6$."],
        result: "$(4, 6)$.",
      },
      {
        type: "example",
        level: 2,
        problem: "$A\\hat\\imath = (2, 5)$ and $A\\hat\\jmath = (-1, 3)$. Find $A(3, -2)$.",
        solution: ["$(3, -2) = 3\\hat\\imath - 2\\hat\\jmath$, so $A(3, -2) = 3(2, 5) - 2(-1, 3)$.", "$= (6 + 2,\\ 15 - 6) = (8, 9)$."],
        result: "$(8, 9)$.",
      },
      {
        type: "example",
        level: 3,
        title: "recovering a matrix",
        problem: "A $2 \\times 2$ matrix satisfies $A(1, 1) = (3, 1)$ and $A(1, -1) = (1, 5)$. Find $A$.",
        solution: [
          "$\\hat\\imath = \\tfrac12\\big((1, 1) + (1, -1)\\big)$, so $A\\hat\\imath = \\tfrac12\\big((3, 1) + (1, 5)\\big) = (2, 3)$.",
          "$\\hat\\jmath = \\tfrac12\\big((1, 1) - (1, -1)\\big)$, so $A\\hat\\jmath = \\tfrac12\\big((3, 1) - (1, 5)\\big) = (1, -2)$.",
          `Columns: $A = ${M("2", "1", "3", "-2")}$. Check: $A(1, 1) = (3, 1)$ and $A(1, -1) = (1, 5)$.`,
        ],
        result: `$${M("2", "1", "3", "-2")}$.`,
      },
    ],
    pitfalls: [
      { wrong: `$${M("a", "b", "c", "d")}${C("x", "y")} = ${C("ax", "dy")}$.`, right: "Every output entry uses both $x$ and $y$: $(ax + by,\\ cx + dy)$." },
      { wrong: "$A\\vec x$ combines the rows of $A$, weighted by $\\vec x$.", right: "It combines the columns. Rows appear only in the row picture, each giving one output entry." },
    ],
    formulas: [
      { label: "Product", tex: `${M("a", "b", "c", "d")}${C("x", "y")} = ${C("ax + by", "cx + dy")}` },
      { label: "Linearity", tex: "A(\\alpha\\vec u + \\beta\\vec v) = \\alpha A\\vec u + \\beta A\\vec v" },
    ],
    exercises: [
      ex(1, vec("mv-ex-1", `Compute $${M("1", "2", "3", "4")}${C("1", "1")}$.`, [3, 7], "Row sums."), ["Rows: $1 + 2 = 3$ and $3 + 4 = 7$."]),
      ex(1, vec("mv-ex-2", `Compute $${M("0", "-1", "1", "0")}${C("4", "-2")}$.`, [2, 4], "A $90^\\circ$ rotation."), [`$4${C("0", "1")} - 2${C("-1", "0")} = ${C("2", "4")}$, a rotation by $90^\\circ$.`]),
      ex(1, vec("mv-ex-3", `Compute $${M("2", "-1", "0", "3")}${C("-1", "2")}$.`, [-4, 6], "Row times vector."), ["$2(-1) + (-1)(2) = -4$ and $0 + 3 \\cdot 2 = 6$."]),
      ex(2, vec("mv-ex-4", "$A\\hat\\imath = (1, 2)$ and $A\\hat\\jmath = (3, -1)$. Find $A(2, 3)$.", [11, 1], "$2A\\hat\\imath + 3A\\hat\\jmath$."), ["$2(1, 2) + 3(3, -1) = (2 + 9,\\ 4 - 3) = (11, 1)$."]),
      ex(2, num("mv-ex-5", `$${M("a", "2", "1", "3")}${C("1", "1")} = ${C("5", "4")}$. Find $a$.`, 3, "First row."), ["First row: $a + 2 = 5$, so $a = 3$. The second row, $1 + 3 = 4$, is consistent."]),
      ex(2, vec("mv-ex-6", "$A\\vec u = (1, 4)$ and $A\\vec v = (2, -1)$. Find $A(3\\vec u - 2\\vec v)$.", [-1, 14], "Linearity."), ["By linearity, $3A\\vec u - 2A\\vec v = (3, 12) - (4, -2) = (-1, 14)$."]),
      ex(3, mat("mv-ex-7", "$A(1, 1) = (2, 4)$ and $A(1, -1) = (0, 2)$. Find $A$.", [[1, 1], [3, 1]], "Find $A\\hat\\imath$ and $A\\hat\\jmath$ first."), [
        "$A\\hat\\imath = \\tfrac12\\big((2, 4) + (0, 2)\\big) = (1, 3)$.",
        "$A\\hat\\jmath = \\tfrac12\\big((2, 4) - (0, 2)\\big) = (1, 1)$.",
        `$A = ${M("1", "1", "3", "1")}$.`,
      ]),
      ex(3, vec("mv-ex-8", `Find a non-zero vector $\\vec x$ with $${M("1", "2", "2", "4")}\\vec x = \\vec 0$.`, [2, -1], "Both rows say $x + 2y = 0$.", true), [
        "Both rows give the same equation, $x + 2y = 0$.",
        "Any non-zero multiple of $(2, -1)$ works. The columns are parallel, so a combination of them can cancel.",
      ]),
      ex(3, num("mv-ex-9", `$A = ${M("2", "k", "1", "3")}$ sends $(1, 1)$ to a vector parallel to $(1, 1)$. Find $k$.`, 2, "Equal components."), [
        "$A(1, 1) = (2 + k,\\ 4)$.",
        "Parallel to $(1, 1)$ means equal components: $2 + k = 4$, so $k = 2$. Then $(1, 1)$ is an eigenvector of $A$ with eigenvalue 4 (Chapter 3).",
      ]),
    ],
  },

  // §{composition}
  composition: {
    definitions: [
      {
        type: "definition",
        term: "composition, matrix product",
        body: "Doing $A$ first and then $B$ sends $\\vec x$ to $B(A\\vec x)$. The composite is linear, and its matrix is the **product** $BA$, built column by column: the $j$-th column of $BA$ is $B$ times the $j$-th column of $A$. Entry by entry, $(BA)_{ij}$ is row $i$ of $B$ times column $j$ of $A$.",
      },
      {
        type: "definition",
        term: "identity, powers",
        body: `The **identity** $I = ${M("1", "0", "0", "1")}$ satisfies $AI = IA = A$. Powers are repeated composition: $A^2 = AA$ and $A^{n+1} = AA^n$.`,
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "rotations add",
        statement: "$R(\\alpha)R(\\beta) = R(\\alpha + \\beta)$, and consequently $R(\\theta)^n = R(n\\theta)$.",
        proof: [
          "The top-left entry of $R(\\alpha)R(\\beta)$ is $\\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta = \\cos(\\alpha + \\beta)$.",
          "The bottom-left entry is $\\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta = \\sin(\\alpha + \\beta)$, and the second column works the same way, so the product is $R(\\alpha + \\beta)$.",
          "Induction on $n$ gives $R(\\theta)^n = R(n\\theta)$.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "not commutative, but associative",
        statement: "In general $AB \\neq BA$, but always $(AB)C = A(BC)$.",
        proof: [
          `Example: $A = ${M("1", "1", "0", "1")}$ and $B = ${M("1", "0", "1", "1")}$ give $AB = ${M("2", "1", "1", "1")}$ but $BA = ${M("1", "1", "1", "2")}$.`,
          "Associativity: both $(AB)C$ and $A(BC)$ are the matrix of the single map $\\vec x \\mapsto A(B(C\\vec x))$, so they are equal.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "powers of a shear",
        statement: `$${M("1", "k", "0", "1")}^n = ${M("1", "nk", "0", "1")}$ for every positive integer $n$.`,
        proof: [`True for $n = 1$. If it holds for $n$, then $${M("1", "k", "0", "1")}${M("1", "nk", "0", "1")} = ${M("1", "nk + k", "0", "1")}$, which is the case $n + 1$. By induction it holds for all $n$.`],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: `Compute $${M("1", "1", "0", "1")}${M("0", "-1", "1", "0")}$.`,
        solution: [`First column: $${M("1", "1", "0", "1")}${C("0", "1")} = ${C("1", "1")}$.`, `Second column: $${M("1", "1", "0", "1")}${C("-1", "0")} = ${C("-1", "0")}$.`],
        result: `$${M("1", "-1", "1", "0")}$: rotate by $90^\\circ$, then shear.`,
      },
      {
        type: "example",
        level: 2,
        title: "order matters",
        problem: "Find the single matrix for: reflect in the $x$-axis, then rotate anticlockwise by $90^\\circ$. Is it the same as rotating first?",
        solution: [
          `Reflection $F = ${M("1", "0", "0", "-1")}$, rotation $R = ${M("0", "-1", "1", "0")}$. The reflection acts first, so the matrix is $RF$.`,
          `$RF = ${M("0", "1", "1", "0")}$: reflection in the line $y = x$.`,
          `Rotating first gives $FR = ${M("0", "-1", "-1", "0")}$: reflection in $y = -x$. The two orders differ.`,
        ],
        result: `$${M("0", "1", "1", "0")}$; no, the other order gives $${M("0", "-1", "-1", "0")}$.`,
      },
      {
        type: "example",
        level: 3,
        title: "a power by the binomial theorem",
        problem: `Compute $${M("2", "1", "0", "2")}^5$.`,
        solution: [
          `Write $A = 2I + N$ with $N = ${M("0", "1", "0", "0")}$. Then $N^2 = 0$, and $2I$ commutes with $N$, so the binomial theorem applies.`,
          "$A^5 = (2I)^5 + 5(2I)^4N + \\dots = 32I + 80N$; every later term contains $N^2 = 0$.",
          `$A^5 = ${M("32", "80", "0", "32")}$.`,
        ],
        result: `$${M("32", "80", "0", "32")}$.`,
      },
    ],
    pitfalls: [
      { wrong: "$A$ then $B$ is the matrix $AB$.", right: "It is $BA$: the matrix next to the vector acts first, so read products from right to left." },
      { wrong: "$AB = BA$, as for numbers.", right: "Usually not. A shear and a rotation in the two orders give different results." },
      { wrong: "$(A + B)^2 = A^2 + 2AB + B^2$.", right: "$(A + B)^2 = A^2 + AB + BA + B^2$. The binomial shortcut needs $AB = BA$." },
    ],
    formulas: [
      { label: "A first, then B", tex: "\\vec x \\mapsto BA\\,\\vec x" },
      { label: "Entries", tex: "(BA)_{ij} = \\textstyle\\sum_k B_{ik}A_{kj}" },
      { label: "Rotations", tex: "R(\\alpha)R(\\beta) = R(\\alpha + \\beta)" },
      { label: "Shear powers", tex: `${M("1", "k", "0", "1")}^n = ${M("1", "nk", "0", "1")}` },
    ],
    exercises: [
      ex(1, mat("comp-ex-1", `Compute $${M("2", "0", "0", "3")}${M("1", "4", "2", "1")}$.`, [[2, 8], [6, 3]], "Row times column."), ["Multiplying on the left by a diagonal matrix scales the rows: the first row by 2, the second by 3."]),
      ex(1, mat("comp-ex-2", `Compute $${M("1", "2", "3", "4")}${M("0", "1", "1", "0")}$.`, [[2, 1], [4, 3]], "It swaps the columns."), [`Multiplying on the right by $${M("0", "1", "1", "0")}$ swaps the columns: $${M("2", "1", "4", "3")}$.`]),
      ex(1, mat("comp-ex-3", `Compute $${M("1", "2", "3", "4")}${M("2", "0", "1", "2")}$.`, [[4, 4], [10, 8]], "Row times column."), ["Row 1: $(1 \\cdot 2 + 2 \\cdot 1,\\ 0 + 2 \\cdot 2) = (4, 4)$. Row 2: $(3 \\cdot 2 + 4 \\cdot 1,\\ 0 + 4 \\cdot 2) = (10, 8)$."]),
      ex(2, mat("comp-ex-4", "Rotate anticlockwise by $90^\\circ$, then reflect in the $x$-axis. Find the single matrix.", [[0, -1], [-1, 0]], "The rotation acts first: $FR$."), [`The rotation acts first, so the matrix is $FR = ${M("1", "0", "0", "-1")}${M("0", "-1", "1", "0")} = ${M("0", "-1", "-1", "0")}$.`]),
      ex(2, mat("comp-ex-5", `Compute $${M("1", "1", "0", "1")}^5$.`, [[1, 5], [0, 1]], "Shear powers."), [`By the shear-power proposition with $k = 1$ and $n = 5$: $${M("1", "5", "0", "1")}$.`]),
      ex(
        2,
        mc("comp-ex-6", `For $N = ${M("0", "1", "0", "0")}$, what is $N^2$?`, ["The zero matrix", "$N$ sends $\\hat\\jmath$ to $\\hat\\imath$ and $\\hat\\imath$ to $\\vec 0$; applying it twice sends everything to $\\vec 0$."], [
          ["$N$ itself", "Compute it: every entry of $N^2$ is 0."],
          ["The identity", "$N$ is not invertible, so no power of it is $I$."],
        ]),
        [`$N^2 = ${M("0", "1", "0", "0")}${M("0", "1", "0", "0")} = ${M("0", "0", "0", "0")}$.`, "A non-zero matrix can square to zero: matrix multiplication has zero divisors."],
      ),
      ex(3, mat("comp-ex-7", `Compute $${M("2", "1", "0", "2")}^3$.`, [[8, 12], [0, 8]], "$2I + N$ with $N^2 = 0$."), [
        "Write $A = 2I + N$ with $N^2 = 0$. Then $A^3 = 8I + 3 \\cdot 4N = 8I + 12N$.",
        `$A^3 = ${M("8", "12", "0", "8")}$.`,
      ]),
      ex(3, num("comp-ex-8", "Find the smallest positive integer $n$ with $R(45^\\circ)^n = I$.", 8, "$45n$ must be a multiple of 360."), ["$R(45^\\circ)^n = R(45n^\\circ)$, which equals $I$ exactly when $45n$ is a multiple of $360$.", "The smallest such $n$ is $8$."]),
      ex(3, num("comp-ex-9", "$R(\\theta)^{10} = R(\\theta)$ with $0^\\circ < \\theta < 90^\\circ$. Find $\\theta$ in degrees.", 40, "$9\\theta$ is a multiple of $360^\\circ$."), [
        "$R(10\\theta) = R(\\theta)$ means $9\\theta$ is a multiple of $360^\\circ$, so $\\theta = 40k^\\circ$.",
        "The only value in $(0^\\circ, 90^\\circ)$ is $40^\\circ$.",
      ]),
    ],
  },
};
