/**
 * The exam mathematics syllabus (JEE Main units, JEE Advanced additions and the
 * SAT Math domains), topic by topic, mapped to the section that teaches it.
 * Topics point at an existing section or a planned one (MATH_PLANNED), so the
 * map doubles as the build roadmap. tests/syllabus.test.ts checks every id.
 */

import type { Area } from "./statistics";

/** Sections still to be written, with the chapter each will join. */
export const MATH_PLANNED: Record<string, { title: string; chapter: string }> = {
  limits: { title: "Limits", chapter: "Limits, Continuity & Differentiability" },
  continuity: { title: "Continuity", chapter: "Limits, Continuity & Differentiability" },
  differentiability: { title: "Differentiability", chapter: "Limits, Continuity & Differentiability" },
  "differentiation-methods": { title: "Methods of differentiation", chapter: "Limits, Continuity & Differentiability" },
  "tangents-normals": { title: "Tangents, normals & rates of change", chapter: "Applications of Derivatives" },
  monotonicity: { title: "Increasing & decreasing functions", chapter: "Applications of Derivatives" },
  "maxima-minima": { title: "Maxima & minima", chapter: "Applications of Derivatives" },
  "mean-value-theorems": { title: "Rolle's & mean value theorems", chapter: "Applications of Derivatives" },
  "indefinite-integrals": { title: "Indefinite integrals & substitution", chapter: "Integral Calculus" },
  "integration-techniques": { title: "Integration by parts & partial fractions", chapter: "Integral Calculus" },
  "definite-integrals": { title: "Definite integrals", chapter: "Integral Calculus" },
  "area-under-curves": { title: "Areas between curves", chapter: "Integral Calculus" },
  "de-basics": { title: "Differential equations: order, degree & formation", chapter: "Differential Equations" },
  "separable-homogeneous": { title: "Separable & homogeneous equations", chapter: "Differential Equations" },
  "linear-de": { title: "Linear first-order equations", chapter: "Differential Equations" },
  "de-applications": { title: "Applications of differential equations", chapter: "Differential Equations" },
  "vector-algebra": { title: "Vector algebra & the dot product", chapter: "Vectors & 3D Geometry" },
  "cross-product": { title: "Cross & triple products", chapter: "Vectors & 3D Geometry" },
  "lines-3d": { title: "Lines in space", chapter: "Vectors & 3D Geometry" },
  "planes-3d": { title: "Planes", chapter: "Vectors & 3D Geometry" },
};

const T = (section: string, ...names: string[]): [string, string][] => names.map((n) => [n, section]);

export const MATHEMATICS_SYLLABUS: Area[] = [
  {
    title: "JEE Main: Sets, relations & functions",
    topics: [
      ...T("sets-relations", "Sets and their representation", "Union, intersection and complement", "Power set", "Relations", "Types of relations", "Equivalence relations"),
      ...T("functions-basics", "Functions", "One-one, into and onto functions"),
      ...T("composition-inverse", "Composition of functions"),
    ],
  },
  {
    title: "JEE Main: Complex numbers & quadratic equations",
    topics: [
      ...T("complex-algebra", "Complex numbers as ordered pairs", "Representation in the Argand plane", "Algebra of complex numbers"),
      ...T("complex-polar", "Modulus and argument"),
      ...T("quadratics", "Quadratic equations in real and complex number systems", "Relations between roots and coefficients", "Nature of roots", "Formation of quadratic equations with given roots"),
    ],
  },
  {
    title: "JEE Main: Matrices & determinants",
    topics: [
      ...T("matrix-algebra", "Matrices and the algebra of matrices", "Types of matrices"),
      ...T("determinants-properties", "Determinants of order two and three", "Evaluation of determinants", "Area of triangles using determinants"),
      ...T("adjoint-systems", "Adjoint and inverse of a square matrix", "Test of consistency of simultaneous linear equations", "Solving linear equations using determinants and matrices"),
    ],
  },
  {
    title: "JEE Main: Permutations, combinations & binomial theorem",
    topics: [
      ...T("permutations-advanced", "Fundamental principle of counting", "Permutation as an arrangement", "Meaning of P(n, r)"),
      ...T("combinations-advanced", "Combination as a selection", "Meaning of C(n, r)", "Simple applications of permutations and combinations"),
      ...T("binomial-theorem", "Binomial theorem for a positive integral index", "General term and middle term", "Simple applications of the binomial theorem"),
    ],
  },
  {
    title: "JEE Main: Sequences & series",
    topics: [
      ...T("arithmetic-progressions", "Arithmetic progressions", "Insertion of arithmetic means"),
      ...T("geometric-progressions", "Geometric progressions", "Insertion of geometric means"),
      ...T("means-inequalities", "Relation between AM and GM"),
    ],
  },
  {
    title: "JEE Main: Limit, continuity & differentiability",
    topics: [
      ...T("functions-basics", "Real-valued functions", "Algebra of functions"),
      ...T("function-graphs", "Polynomial, rational, trigonometric, logarithmic and exponential functions", "Graphs of simple functions"),
      ...T("composition-inverse", "Inverse functions"),
      ...T("limits", "Limits"),
      ...T("continuity", "Continuity"),
      ...T("differentiability", "Differentiability"),
      ...T("differentiation-methods", "Differentiation of sum, difference, product and quotient", "Differentiation of trigonometric, inverse trigonometric, logarithmic and exponential functions", "Differentiation of composite and implicit functions", "Derivatives of order up to two"),
      ...T("tangents-normals", "Applications of derivatives: rate of change of quantities"),
      ...T("monotonicity", "Monotonic: increasing and decreasing functions"),
      ...T("maxima-minima", "Maxima and minima of functions of one variable"),
    ],
  },
  {
    title: "JEE Main: Integral calculus",
    topics: [
      ...T("indefinite-integrals", "Integral as an antiderivative", "Fundamental integrals", "Integration by substitution", "Integration using trigonometric identities"),
      ...T("integration-techniques", "Integration by parts", "Integration by partial fractions", "Evaluation of simple integrals of special types"),
      ...T("definite-integrals", "Fundamental theorem of calculus", "Properties of definite integrals"),
      ...T("area-under-curves", "Areas of regions bounded by simple curves in standard form"),
    ],
  },
  {
    title: "JEE Main: Differential equations",
    topics: [
      ...T("de-basics", "Ordinary differential equations, their order and degree"),
      ...T("separable-homogeneous", "Solution by separation of variables", "Solution of homogeneous differential equations"),
      ...T("linear-de", "Linear differential equations of the type dy/dx + p(x)y = q(x)"),
    ],
  },
  {
    title: "JEE Main: Coordinate geometry",
    topics: [
      ...T("straight-lines", "Cartesian system of rectangular coordinates", "Distance formula", "Section formula", "Locus and its equation", "Slope of a line", "Parallel and perpendicular lines", "Intercepts of a line on the coordinate axes", "Various forms of equations of a line", "Intersection of lines", "Angles between two lines", "Conditions for concurrence of three lines", "Distance of a point from a line", "Coordinates of centroid, orthocentre and circumcentre"),
      ...T("circles", "Standard form of the equation of a circle", "General form of the equation of a circle", "Radius and centre of a circle", "Circle with given ends of a diameter", "Intersection of a line and a circle"),
      ...T("parabola", "Sections of cones", "Parabola in standard form"),
      ...T("ellipse", "Ellipse in standard form"),
      ...T("hyperbola", "Hyperbola in standard form"),
    ],
  },
  {
    title: "JEE Main: Three-dimensional geometry & vectors",
    topics: [
      ...T("vector-algebra", "Coordinates of a point in space", "Distance between two points in space", "Section formula in space", "Vectors and scalars", "Addition of vectors", "Components of a vector in two and three dimensions", "Scalar product"),
      ...T("cross-product", "Vector product"),
      ...T("lines-3d", "Direction ratios and direction cosines", "Angle between two intersecting lines", "Equation of a line", "Skew lines and the shortest distance between them"),
    ],
  },
  {
    title: "JEE Main: Statistics & probability",
    topics: [
      ...T("mean-median-mode", "Mean, median and mode of ungrouped data"),
      ...T("other-means", "Mean, median and mode of grouped data"),
      ...T("variance", "Standard deviation and variance"),
      ...T("spread-measures", "Mean deviation"),
      ...T("probability", "Probability of an event"),
      ...T("probability-rules", "Addition and multiplication theorems of probability"),
      ...T("bayes", "Bayes' theorem"),
      ...T("random-variable", "Probability distribution of a random variable"),
    ],
  },
  {
    title: "JEE Main: Trigonometry",
    topics: [
      ...T("trig-ratios", "Trigonometric functions"),
      ...T("trig-identities", "Trigonometric identities"),
      ...T("inverse-trig", "Inverse trigonometric functions and their properties"),
    ],
  },
  {
    title: "JEE Advanced additions",
    topics: [
      ...T("exponents-logs", "Logarithms and their properties"),
      ...T("induction", "Principle of mathematical induction"),
      ...T("geometric-progressions", "Sum of an infinite geometric series", "Arithmetico-geometric series"),
      ...T("special-series", "Sums of squares and cubes of the first n natural numbers", "Method of differences and telescoping sums"),
      ...T("means-inequalities", "Harmonic progressions and harmonic means", "AM–GM–HM inequalities"),
      ...T("binomial-coefficients", "Properties of binomial coefficients"),
      ...T("combinations-advanced", "Distribution of objects into groups", "Derangements"),
      ...T("permutations-advanced", "Circular permutations", "Permutations with repetition and restrictions"),
      ...T("matrix-algebra", "Symmetric and skew-symmetric matrices", "Transpose and trace"),
      ...T("roots-of-unity", "Cube roots of unity", "nth roots of unity"),
      ...T("complex-geometry", "Geometric interpretation of complex numbers", "Rotation in the complex plane"),
      ...T("complex-polar", "De Moivre's theorem"),
      ...T("trig-equations", "Trigonometric equations and general solutions"),
      ...T("triangles-trig", "Sine and cosine rules", "Half-angle formulae", "Area of a triangle", "Circumradius and inradius"),
      ...T("circles", "Tangent and normal to a circle", "Chord of contact", "Family of circles", "Radical axis"),
      ...T("parabola", "Tangents and normals to a parabola", "Focal chords"),
      ...T("ellipse", "Tangents and normals to an ellipse", "Eccentricity and directrices"),
      ...T("hyperbola", "Asymptotes", "Rectangular hyperbola"),
      ...T("planes-3d", "Equation of a plane", "Angle between two planes", "Distance of a point from a plane", "Angle between a line and a plane"),
      ...T("cross-product", "Scalar triple product", "Vector triple product"),
      ...T("mean-value-theorems", "Rolle's theorem", "Lagrange's mean value theorem"),
      ...T("differentiation-methods", "Parametric differentiation", "Logarithmic differentiation"),
      ...T("limits", "Indeterminate forms and L'Hôpital's rule"),
      ...T("continuity", "Intermediate value theorem"),
      ...T("definite-integrals", "Definite integral as the limit of a sum", "Leibniz's rule for differentiating integrals"),
      ...T("de-applications", "Applications of differential equations: growth, decay and cooling"),
      ...T("linear-de", "Bernoulli equations"),
      ...T("de-basics", "Formation of differential equations"),
    ],
  },
  {
    title: "SAT: Algebra",
    topics: [
      ...T("linear-equations", "Linear equations in one variable", "Linear functions", "Linear equations in two variables", "Systems of two linear equations in two variables", "Linear inequalities in one or two variables"),
    ],
  },
  {
    title: "SAT: Advanced math",
    topics: [
      ...T("quadratics", "Quadratic functions and their graphs"),
      ...T("exponents-logs", "Exponential functions and growth"),
      ...T("polynomials", "Polynomials and rational expressions", "Equivalent expressions"),
      ...T("functions-basics", "Nonlinear functions"),
      ...T("linear-equations", "Nonlinear equations and systems of equations", "Absolute value equations"),
    ],
  },
  {
    title: "SAT: Problem-solving & data analysis",
    topics: [
      ...T("ratios-percentages", "Ratios, rates, proportional relationships and units", "Percentages"),
      ...T("mean-median-mode", "One-variable data: distributions and measures of centre"),
      ...T("quartiles-iqr", "One-variable data: measures of spread"),
      ...T("least-squares", "Two-variable data: models and scatterplots"),
      ...T("conditional-probability", "Probability and conditional probability"),
      ...T("standard-error", "Inference from sample statistics and margin of error"),
      ...T("experiment-design", "Evaluating statistical claims: observational studies and experiments"),
    ],
  },
  {
    title: "SAT: Geometry & trigonometry",
    topics: [
      ...T("mensuration", "Area and volume"),
      ...T("plane-geometry", "Lines, angles and triangles", "Similar triangles", "Circles: arcs, angles and chords"),
      ...T("trig-ratios", "Right triangles and trigonometry", "Radian measure"),
      ...T("circles", "Equation of a circle in the coordinate plane"),
    ],
  },
];
