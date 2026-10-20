import { ex, mc, num, vec, type Depth } from "../deepen";

/** Calculus for ML at exam depth: first principles, differentiation rules and extrema, the chain rule, gradients, descent, backpropagation. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);
/** Accepts 3 decimal places. */
const dp = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give 3 decimal places.`, value, explain, 0.0006);
const V = (a: string, b: string) => `\\begin{bmatrix} ${a} \\\\ ${b} \\end{bmatrix}`;

export const UNIT6_DEPTH: Record<string, Depth> = {
  // §{derivative}
  derivative: {
    definitions: [
      {
        type: "definition",
        term: "derivative from first principles",
        body: "$f$ is **differentiable** at $a$ when $f'(a) = \\displaystyle\\lim_{h \\to 0}\\frac{f(a + h) - f(a)}{h}$ exists. The derivative function is written $f'(x)$ or $\\dfrac{dy}{dx}$ for $y = f(x)$.",
      },
      {
        type: "definition",
        term: "tangent and normal",
        body: "The **tangent** to $y = f(x)$ at $(a, f(a))$ is $y - f(a) = f'(a)(x - a)$. The **normal** is the perpendicular line through the same point, with slope $-1/f'(a)$ when $f'(a) \\neq 0$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Proposition",
        name: "first principles for basic functions",
        statement: "$(x^2)' = 2x$, $(x^3)' = 3x^2$, $\\left(\\dfrac1x\\right)' = -\\dfrac{1}{x^2}$ and $(\\sqrt x)' = \\dfrac{1}{2\\sqrt x}$.",
        proof: [
          "$\\dfrac{(x + h)^3 - x^3}{h} = \\dfrac{3x^2h + 3xh^2 + h^3}{h} = 3x^2 + 3xh + h^2 \\to 3x^2$; $x^2$ is the same with one fewer term.",
          "$\\dfrac{1}{h}\\left(\\dfrac{1}{x + h} - \\dfrac1x\\right) = \\dfrac{-1}{x(x + h)} \\to -\\dfrac{1}{x^2}$.",
          "Multiply by the conjugate: $\\dfrac{\\sqrt{x + h} - \\sqrt x}{h} = \\dfrac{1}{\\sqrt{x + h} + \\sqrt x} \\to \\dfrac{1}{2\\sqrt x}$.",
        ],
      },
      {
        type: "theorem",
        name: "differentiable implies continuous",
        statement: "If $f$ is differentiable at $a$, it is continuous there. The converse is false: $|x|$ is continuous at 0 but not differentiable.",
        proof: [
          "$f(a + h) - f(a) = h \\cdot \\dfrac{f(a + h) - f(a)}{h} \\to 0 \\cdot f'(a) = 0$.",
          "For $|x|$ at 0 the quotient $|h|/h$ is $1$ for $h > 0$ and $-1$ for $h < 0$: the one-sided limits disagree, so there is no tangent (a corner).",
        ],
      },
      {
        type: "theorem",
        name: "mean value theorem",
        statement: "If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, some $c$ in $(a, b)$ has $f'(c) = \\dfrac{f(b) - f(a)}{b - a}$. Hence $f' > 0$ on an interval means $f$ is increasing there, and $f' < 0$ means decreasing.",
        proof: [
          "Subtract the secant line: $g(x) = f(x) - \\tfrac{f(b) - f(a)}{b - a}(x - a)$ has $g(a) = g(b)$, so $g$ has a highest or lowest point inside, where $g'(c) = 0$.",
          "For $x_1 < x_2$, $f(x_2) - f(x_1) = f'(c)(x_2 - x_1)$, which has the sign of $f'$.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "From first principles, find $f'(2)$ for $f(x) = 3x^2$.",
        solution: ["$\\dfrac{3(2 + h)^2 - 12}{h} = \\dfrac{12h + 3h^2}{h} = 12 + 3h$.", "As $h \\to 0$ this tends to 12."],
        result: "$f'(2) = 12$.",
      },
      {
        type: "example",
        level: 2,
        title: "tangent and normal",
        problem: "Find the tangent and normal to $y = x^3$ at $(1, 1)$.",
        solution: ["$y' = 3x^2 = 3$ at $x = 1$.", "Tangent: $y - 1 = 3(x - 1)$, i.e. $y = 3x - 2$.", "Normal: slope $-\\tfrac13$, so $y - 1 = -\\tfrac13(x - 1)$, i.e. $y = -\\tfrac13x + \\tfrac43$."],
        result: "$y = 3x - 2$ and $y = -\\tfrac13x + \\tfrac43$.",
      },
      {
        type: "example",
        level: 3,
        title: "the mean value theorem",
        problem: "Find the $c$ promised by the mean value theorem for $f(x) = x^2$ on $[1, 3]$.",
        solution: ["The secant slope is $\\dfrac{9 - 1}{3 - 1} = 4$.", "$f'(c) = 2c = 4$ gives $c = 2$, which lies in $(1, 3)$."],
        result: "$c = 2$.",
      },
    ],
    pitfalls: [
      { wrong: "$f'(a)$ is the height of the curve at $a$.", right: "It is the slope there. $x^2$ at 3 has height 9 and slope 6." },
      { wrong: "A continuous function is differentiable.", right: "Corners such as $|x|$ at 0 are continuous with no derivative." },
      { wrong: "The normal has slope $-f'(a)$.", right: "Perpendicular slopes multiply to $-1$: the normal's slope is $-1/f'(a)$." },
    ],
    formulas: [
      { label: "Definition", tex: "f'(a) = \\lim_{h \\to 0}\\dfrac{f(a + h) - f(a)}{h}" },
      { label: "Tangent", tex: "y - f(a) = f'(a)(x - a)" },
      { label: "Normal slope", tex: "-1/f'(a)" },
      { label: "Mean value theorem", tex: "f'(c) = \\dfrac{f(b) - f(a)}{b - a}" },
    ],
    exercises: [
      ex(1, num("dfp-ex-1", "$f(x) = x^2$. Find $f'(5)$.", 10, "$2x$."), ["$2 \\times 5 = 10$."]),
      ex(1, num("dfp-ex-2", "Find the slope of the tangent to $y = x^3$ at $x = 2$.", 12, "$3x^2$."), ["$3 \\times 4 = 12$."]),
      ex(2, num("dfp-ex-3", "Find $\\displaystyle\\lim_{h \\to 0}\\frac{(2 + h)^2 - 4}{h}$.", 4, "It is $f'(2)$ for $x^2$."), ["The quotient simplifies to $4 + h$, which tends to 4."]),
      ex(2, num("dfp-ex-4", "The tangent to $y = x^2$ at $x = 3$ meets the $y$-axis where? Give the $y$-intercept.", -9, "$y = 6x - 9$."), ["Slope 6 through $(3, 9)$: $y = 9 + 6(x - 3) = 6x - 9$."]),
      ex(2, num("dfp-ex-5", "Find the slope of the normal to $y = x^2$ at $x = 1$.", -0.5, "$-1/f'(1)$."), ["$f'(1) = 2$, so the normal has slope $-\\tfrac12$."]),
      ex(2, num("dfp-ex-6", "$f(x) = 1/x$. Find $f'(2)$.", -0.25, "$-1/x^2$."), ["$-1/4$."]),
      ex(3, num("dfp-ex-7", "$f(x) = \\sqrt x$. Find $f'(4)$.", 0.25, "$1/(2\\sqrt x)$."), ["$\\dfrac{1}{2 \\times 2} = \\dfrac14$."]),
      ex(3, dp("dfp-ex-8", "Find the $c$ in $(0, 3)$ given by the mean value theorem for $f(x) = x^3$.", Math.sqrt(3), "Secant slope 9."), ["The secant slope is $27/3 = 9$.", "$3c^2 = 9$ gives $c = \\sqrt3 \\approx 1.732$."]),
      ex(3, num("dfp-ex-9", "At what $x$ is the tangent to $y = x^2$ parallel to $y = 4x + 1$?", 2, "Equal slopes."), ["$2x = 4$ gives $x = 2$."]),
      ex(3, mc("dfp-ex-10", "At $x = 2$, $f(x) = |x - 2|$ is", ["continuous but not differentiable", "It has a corner there."], [["differentiable with $f'(2) = 0$", "The one-sided slopes are $-1$ and $1$."], ["not continuous", "The graph has no jump."]]), [
        "The right-hand quotient is 1 and the left-hand one is $-1$, so the limit does not exist; the graph is unbroken.",
      ]),
    ],
  },

  // §{derivative-rules}
  "derivative-rules": {
    definitions: [
      {
        type: "definition",
        term: "standard derivatives",
        body: "$(e^x)' = e^x$, $(\\ln x)' = \\dfrac1x$, $(a^x)' = a^x\\ln a$, $(\\sin x)' = \\cos x$ and $(\\cos x)' = -\\sin x$, with angles in radians.",
      },
      {
        type: "definition",
        term: "stationary point, local extremum",
        body: "$c$ is a **stationary point** when $f'(c) = 0$. $f$ has a **local maximum** at $c$ when $f(c) \\ge f(x)$ for all $x$ near $c$, and a **local minimum** when $f(c) \\le f(x)$. The **second derivative** $f''$ is the derivative of $f'$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "product rule",
        statement: "$(fg)' = f'g + fg'$.",
        proof: [
          "$f(x + h)g(x + h) - f(x)g(x) = [f(x + h) - f(x)]g(x + h) + f(x)[g(x + h) - g(x)]$.",
          "Divide by $h$ and let $h \\to 0$; $g(x + h) \\to g(x)$ because $g$ is differentiable, hence continuous.",
        ],
      },
      {
        type: "theorem",
        name: "quotient rule",
        statement: "$\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}$ where $g \\neq 0$.",
        proof: ["Write $q = f/g$, so $f = qg$ and $f' = q'g + qg'$. Solve: $q' = \\dfrac{f' - qg'}{g} = \\dfrac{f'g - fg'}{g^2}$."],
      },
      {
        type: "theorem",
        name: "second-derivative test",
        statement: "If $f'(c) = 0$ and $f''(c) > 0$, $c$ is a local minimum; if $f''(c) < 0$, a local maximum. If $f''(c) = 0$ the test says nothing: $x^3$, $x^4$ and $-x^4$ all have $f'(0) = f''(0) = 0$.",
        proof: ["$f''(c) > 0$ means $f'$ is increasing through 0 at $c$: negative just before, positive just after. So $f$ falls and then rises, a minimum. The maximum case is the mirror image."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "extremes on a closed interval",
        statement: "The largest and smallest values of a differentiable $f$ on $[a, b]$ occur at stationary points or at the endpoints $a$ and $b$. Compare $f$ at all of them.",
        proof: ["At an interior extreme the tangent must be flat, else $f$ would be larger or smaller on one side; the only other candidates are the endpoints."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Differentiate $x^2e^x$.",
        solution: ["Product rule with $f = x^2$, $g = e^x$: $2x \\cdot e^x + x^2 \\cdot e^x$.", "Factorise: $xe^x(x + 2)$."],
        result: "$xe^x(x + 2)$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Differentiate $\\dfrac{x}{x^2 + 1}$.",
        solution: ["$f = x$, $g = x^2 + 1$: $\\dfrac{1 \\cdot (x^2 + 1) - x \\cdot 2x}{(x^2 + 1)^2}$.", "Simplify the numerator: $1 - x^2$."],
        result: "$\\dfrac{1 - x^2}{(x^2 + 1)^2}$.",
      },
      {
        type: "example",
        level: 3,
        title: "classifying stationary points",
        problem: "Find and classify the stationary points of $f(x) = x^3 - 3x^2 - 9x + 5$.",
        solution: [
          "$f'(x) = 3x^2 - 6x - 9 = 3(x - 3)(x + 1)$, zero at $x = -1$ and $x = 3$.",
          "$f''(x) = 6x - 6$: $f''(-1) = -12 < 0$, a maximum; $f''(3) = 12 > 0$, a minimum.",
          "$f(-1) = 10$ and $f(3) = -22$.",
        ],
        result: "Local maximum $(-1, 10)$, local minimum $(3, -22)$.",
      },
      {
        type: "example",
        level: 3,
        title: "optimisation",
        problem: "A rectangle has perimeter 20. Find the largest possible area.",
        solution: ["With sides $x$ and $10 - x$, the area is $A = 10x - x^2$.", "$A' = 10 - 2x = 0$ at $x = 5$, and $A'' = -2 < 0$: a maximum."],
        result: "A $5 \\times 5$ square, area 25.",
      },
    ],
    pitfalls: [
      { wrong: "$(fg)' = f'g'$.", right: "$(fg)' = f'g + fg'$. Check: $(x \\cdot x)' = 2x$, not 1." },
      { wrong: "$\\left(\\tfrac fg\\right)' = \\tfrac{fg' - f'g}{g^2}$.", right: "The numerator starts with $f'g$. The order matters because of the minus sign." },
      { wrong: "$f'(c) = 0$ means an extremum.", right: "$x^3$ has $f'(0) = 0$ and keeps increasing: a point of inflection." },
      { wrong: "Use degrees with $(\\sin x)' = \\cos x$.", right: "The rule holds only in radians." },
    ],
    formulas: [
      { label: "Product", tex: "(fg)' = f'g + fg'" },
      { label: "Quotient", tex: "\\left(\\tfrac fg\\right)' = \\dfrac{f'g - fg'}{g^2}" },
      { label: "Exponential, log", tex: "(e^x)' = e^x,\\quad (\\ln x)' = \\tfrac1x" },
      { label: "Trigonometric", tex: "(\\sin x)' = \\cos x,\\quad (\\cos x)' = -\\sin x" },
    ],
    exercises: [
      ex(1, num("drl-ex-1", "Find the derivative of $xe^x$ at $x = 0$.", 1, "Product rule."), ["$(xe^x)' = e^x + xe^x$, which is 1 at $x = 0$."]),
      ex(1, num("drl-ex-2", "Find the derivative of $\\ln x$ at $x = 4$.", 0.25, "$1/x$."), ["$1/4$."]),
      ex(2, num("drl-ex-3", "Find the derivative of $x^3\\ln x$ at $x = 1$.", 1, "Product rule."), ["$3x^2\\ln x + x^3 \\cdot \\tfrac1x = 3x^2\\ln x + x^2$, which is $0 + 1 = 1$ at $x = 1$."]),
      ex(2, num("drl-ex-4", "Find the derivative of $\\dfrac{x}{x + 1}$ at $x = 1$.", 0.25, "Quotient rule."), ["$\\dfrac{(x + 1) - x}{(x + 1)^2} = \\dfrac{1}{(x + 1)^2} = \\dfrac14$ at $x = 1$."]),
      ex(2, num("drl-ex-5", "Find the derivative of $\\sin x\\cos x$ at $x = 0$.", 1, "Product rule."), ["$\\cos^2 x - \\sin^2 x$, which is 1 at 0."]),
      ex(2, num("drl-ex-6", "Find the $x$ where $f(x) = x^3 - 12x$ has its local minimum.", 2, "$f' = 3x^2 - 12$."), ["Stationary at $x = \\pm 2$; $f''(2) = 12 > 0$, so the minimum is at $x = 2$."]),
      ex(2, num("drl-ex-7", "Find the local maximum value of $f(x) = x^3 - 3x$.", 2, "Stationary at $\\pm 1$."), ["$f'(x) = 3x^2 - 3 = 0$ at $x = \\pm 1$; $f''(-1) = -6 < 0$.", "$f(-1) = -1 + 3 = 2$."]),
      ex(3, dp("drl-ex-8", "Find the $x$ where $f(x) = \\dfrac{\\ln x}{x}$ is largest.", Math.E, "Quotient rule."), ["$f'(x) = \\dfrac{1 - \\ln x}{x^2} = 0$ when $\\ln x = 1$: $x = e \\approx 2.718$.", "$f'$ changes from positive to negative there, so it is the maximum."]),
      ex(3, num("drl-ex-9", "A rectangle has perimeter 36. Find its largest possible area.", 81, "Sides $x$ and $18 - x$."), ["$A = 18x - x^2$, $A' = 0$ at $x = 9$: area 81."]),
      ex(3, num("drl-ex-10", "Find the largest value of $f(x) = x^2 - 4x + 1$ on $[0, 5]$.", 6, "Check the endpoints too."), ["Stationary point $x = 2$ gives $-3$, a minimum. Endpoints: $f(0) = 1$, $f(5) = 6$.", "The largest is 6."]),
      ex(3, mc("drl-ex-11", "$f(x) = x^4$ has $f'(0) = 0$ and $f''(0) = 0$. At $x = 0$, $f$ has", ["a minimum, which the second-derivative test cannot detect", "$x^4 \\ge 0$ everywhere."], [["a point of inflection", "$x^4$ does not change concavity at 0."], ["no stationary point", "$f'(0) = 0$."]]), [
        "The test is silent when $f'' = 0$; checking signs, $f'$ goes from negative to positive, so 0 is a minimum.",
      ]),
    ],
  },

  // §{chain-rule}
  "chain-rule": {
    definitions: [
      {
        type: "definition",
        term: "Leibniz form",
        body: "If $y = f(u)$ and $u = g(x)$, then $\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}$. Longer chains multiply more factors.",
      },
      {
        type: "definition",
        term: "implicit differentiation",
        body: "When $y$ is defined by an equation such as $x^2 + y^2 = 25$, differentiate both sides with respect to $x$, treating $y$ as a function of $x$: $\\dfrac{d}{dx}(y^2) = 2y\\dfrac{dy}{dx}$. Then solve for $\\dfrac{dy}{dx}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        kind: "Formula",
        name: "standard chain forms",
        statement: "$(e^{g})' = g'e^{g}$, $(\\ln g)' = \\dfrac{g'}{g}$, $(g^n)' = ng^{n-1}g'$, $(\\sin g)' = g'\\cos g$ and $(\\cos g)' = -g'\\sin g$.",
        proof: ["Each is the chain rule with outer function $e^u$, $\\ln u$, $u^n$, $\\sin u$ or $\\cos u$ and inner function $u = g(x)$."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "the sigmoid's derivative",
        statement: "For $\\sigma(z) = \\dfrac{1}{1 + e^{-z}}$, $\\sigma'(z) = \\sigma(z)\\big(1 - \\sigma(z)\\big)$. Its largest value is $\\sigma'(0) = \\tfrac14$.",
        proof: [
          "$\\sigma = (1 + e^{-z})^{-1}$, so $\\sigma' = -(1 + e^{-z})^{-2} \\cdot (-e^{-z}) = \\dfrac{e^{-z}}{(1 + e^{-z})^2}$.",
          "Split as $\\dfrac{1}{1 + e^{-z}}\\cdot\\dfrac{e^{-z}}{1 + e^{-z}} = \\sigma(1 - \\sigma)$. A product $s(1 - s)$ is largest at $s = \\tfrac12$.",
        ],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "related rates",
        statement: "If two quantities are linked and both change with time, $\\dfrac{dy}{dt} = \\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$.",
        proof: ["This is the chain rule with time as the outer variable."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Differentiate $(x^2 + 1)^5$.",
        solution: ["Outer $u^5$, inner $u = x^2 + 1$: $5(x^2 + 1)^4 \\cdot 2x$.", "Tidy: $10x(x^2 + 1)^4$."],
        result: "$10x(x^2 + 1)^4$.",
      },
      {
        type: "example",
        level: 2,
        problem: "Differentiate $e^{-x^2}$ and $\\ln(1 + x^2)$.",
        solution: ["$(e^{-x^2})' = -2x\\,e^{-x^2}$.", "$(\\ln(1 + x^2))' = \\dfrac{2x}{1 + x^2}$."],
        result: "$-2xe^{-x^2}$ and $\\dfrac{2x}{1 + x^2}$.",
      },
      {
        type: "example",
        level: 3,
        title: "implicit differentiation",
        problem: "Find the slope of the circle $x^2 + y^2 = 25$ at $(3, 4)$.",
        solution: ["Differentiate: $2x + 2y\\dfrac{dy}{dx} = 0$, so $\\dfrac{dy}{dx} = -\\dfrac{x}{y}$.", "At $(3, 4)$: $-\\tfrac34$. The radius has slope $\\tfrac43$, perpendicular as it should be."],
        result: "$-\\tfrac34$.",
      },
      {
        type: "example",
        level: 3,
        title: "related rates",
        problem: "A balloon's radius grows at 2 cm/s. How fast is its volume growing when $r = 5$ cm?",
        solution: ["$V = \\tfrac43\\pi r^3$, so $\\dfrac{dV}{dt} = 4\\pi r^2\\dfrac{dr}{dt}$.", "$4\\pi \\cdot 25 \\cdot 2 = 200\\pi$."],
        result: "$200\\pi \\approx 628$ cm³/s.",
      },
    ],
    pitfalls: [
      { wrong: "$(\\sin 3x)' = \\cos 3x$.", right: "Multiply by the inner derivative: $3\\cos 3x$." },
      { wrong: "$\\big(f(g(x))\\big)' = f'(g'(x))$.", right: "$f'(g(x)) \\cdot g'(x)$: evaluate $f'$ at the inside, then multiply." },
      { wrong: "$\\dfrac{d}{dx}(y^2) = 2y$.", right: "$y$ depends on $x$: $2y\\dfrac{dy}{dx}$." },
    ],
    formulas: [
      { label: "Chain rule", tex: "\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}" },
      { label: "Exponential, log", tex: "(e^{g})' = g'e^{g},\\quad (\\ln g)' = g'/g" },
      { label: "Power", tex: "(g^n)' = ng^{n-1}g'" },
      { label: "Sigmoid", tex: "\\sigma' = \\sigma(1 - \\sigma)" },
    ],
    exercises: [
      ex(1, num("chn-ex-1", "Find the derivative of $(2x + 1)^3$ at $x = 0$.", 6, "$3(2x + 1)^2 \\cdot 2$."), ["$3 \\cdot 1 \\cdot 2 = 6$."]),
      ex(1, num("chn-ex-2", "Find the derivative of $e^{3x}$ at $x = 0$.", 3, "$3e^{3x}$."), ["$3e^0 = 3$."]),
      ex(2, num("chn-ex-3", "Find the derivative of $\\ln(x^2 + 1)$ at $x = 1$.", 1, "$2x/(x^2 + 1)$."), ["$2/2 = 1$."]),
      ex(2, num("chn-ex-4", "Find the derivative of $\\sin 2x$ at $x = 0$.", 2, "$2\\cos 2x$."), ["$2\\cos 0 = 2$."]),
      ex(2, num("chn-ex-5", "Find $\\sigma'(0)$ for the sigmoid.", 0.25, "$\\sigma(0) = \\tfrac12$."), ["$\\tfrac12 \\cdot \\tfrac12 = \\tfrac14$."]),
      ex(2, num("chn-ex-6", "Find the derivative of $\\sqrt{x^2 + 9}$ at $x = 4$.", 0.8, "$x/\\sqrt{x^2 + 9}$."), ["$\\dfrac{2x}{2\\sqrt{x^2 + 9}} = \\dfrac45$."]),
      ex(3, num("chn-ex-7", "Find $\\dfrac{dy}{dx}$ on $x^2 + y^2 = 25$ at $(3, 4)$.", -0.75, "$-x/y$."), ["$2x + 2yy' = 0$ gives $y' = -3/4$."]),
      ex(3, num("chn-ex-8", "Find $\\dfrac{dy}{dx}$ on $xy = 6$ at $(2, 3)$.", -1.5, "Product rule on $xy$."), ["$y + xy' = 0$, so $y' = -y/x = -\\tfrac32$."]),
      ex(3, num("chn-ex-9", "A square's side grows at 3 cm/s. How fast (cm²/s) is its area growing when the side is 10 cm?", 60, "$dA/dt = 2s\\,ds/dt$."), ["$2 \\cdot 10 \\cdot 3 = 60$."]),
      ex(3, num("chn-ex-10", "A sigmoid unit outputs $\\sigma(z) = 0.8$. Find $\\sigma'(z)$.", 0.16, "$\\sigma(1 - \\sigma)$."), ["$0.8 \\times 0.2 = 0.16$."]),
      ex(3, dp("chn-ex-11", "Find the derivative of $e^{-x^2}$ at $x = 1$.", -2 * Math.exp(-1), "$-2xe^{-x^2}$."), ["$-2e^{-1} \\approx -0.736$."]),
      ex(3, num("chn-ex-12", "Find the derivative of $\\ln(e^{2x} + 1)$ at $x = 0$.", 1, "$(\\ln g)' = g'/g$."), ["$\\dfrac{2e^{2x}}{e^{2x} + 1} = \\dfrac22 = 1$ at $x = 0$."]),
    ],
  },

  // §{gradient}
  gradient: {
    definitions: [
      {
        type: "definition",
        term: "directional derivative",
        body: "For a unit vector $\\hat u$, the **directional derivative** $D_{\\hat u}f$ is the rate of change of $f$ when moving from a point in direction $\\hat u$: $\\displaystyle\\lim_{h \\to 0}\\frac{f(\\vec x + h\\hat u) - f(\\vec x)}{h}$.",
      },
      {
        type: "definition",
        term: "level curve, Hessian",
        body: "A **level curve** is a set where $f(x, y) = c$, like a contour on a map. The **Hessian** collects the second partial derivatives, $H = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{xy} & f_{yy} \\end{bmatrix}$, where $f_{xy} = \\dfrac{\\partial^2 f}{\\partial x\\,\\partial y}$.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "directional derivatives",
        statement: "$D_{\\hat u}f = \\nabla f\\cdot\\hat u$. It is largest, $|\\nabla f|$, when $\\hat u$ points along $\\nabla f$; smallest, $-|\\nabla f|$, opposite; and zero along a level curve, so $\\nabla f$ is perpendicular to level curves.",
        proof: [
          "Linear approximation: $f(\\vec x + h\\hat u) \\approx f(\\vec x) + h(f_x u_1 + f_y u_2) = f(\\vec x) + h\\,\\nabla f\\cdot\\hat u$.",
          "$\\nabla f\\cdot\\hat u = |\\nabla f|\\cos\\theta$, extreme at $\\theta = 0$ and $\\pi$ and zero at $\\theta = \\tfrac\\pi2$.",
        ],
      },
      {
        type: "theorem",
        kind: "Formula",
        name: "linear approximation",
        statement: "$f(x + \\Delta x, y + \\Delta y) \\approx f(x, y) + f_x\\Delta x + f_y\\Delta y$, i.e. $\\Delta f \\approx \\nabla f\\cdot\\Delta\\vec x$.",
        proof: ["Change $x$ with $y$ fixed, then $y$; each one-variable change is approximated by its tangent line."],
      },
      {
        type: "theorem",
        name: "second-derivative test in two variables",
        statement: "At a stationary point ($\\nabla f = \\vec 0$) let $D = f_{xx}f_{yy} - f_{xy}^2 = \\det H$. If $D > 0$ and $f_{xx} > 0$, it is a local minimum; if $D > 0$ and $f_{xx} < 0$, a local maximum; if $D < 0$, a **saddle point**. $D = 0$ is inconclusive.",
        proof: [
          "Near the point, $f \\approx f_0 + \\tfrac12\\Delta\\vec x^{\\mathsf T}H\\Delta\\vec x$. The symmetric $H$ has real eigenvalues $\\lambda_1, \\lambda_2$ (§{pca}) with $\\lambda_1\\lambda_2 = \\det H = D$.",
          "$D > 0$: same sign, so the surface curves the same way in every direction, up if $f_{xx} > 0$. $D < 0$: opposite signs, up one way and down the other.",
        ],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "Find $\\nabla f$ at $(1, 2)$ for $f(x, y) = x^2y + 3y$.",
        solution: ["$f_x = 2xy$ and $f_y = x^2 + 3$.", `At $(1, 2)$: $\\nabla f = ${V("4", "4")}$.`],
        result: `$${V("4", "4")}$.`,
      },
      {
        type: "example",
        level: 2,
        title: "a directional derivative",
        problem: "$f(x, y) = x^2 + 2y^2$. Find the rate of change at $(1, 1)$ towards direction $(3, 4)$, and the largest possible rate there.",
        solution: [
          `$\\nabla f = ${V("2x", "4y")} = ${V("2", "4")}$ and $\\hat u = \\tfrac15(3, 4)$.`,
          "$D_{\\hat u}f = \\tfrac{6 + 16}{5} = 4.4$.",
          "The largest rate is $|\\nabla f| = \\sqrt{20} \\approx 4.47$, along $\\nabla f$.",
        ],
        result: "4.4; at most $\\sqrt{20} \\approx 4.47$.",
      },
      {
        type: "example",
        level: 3,
        title: "classifying a stationary point",
        problem: "Find and classify the stationary point of $f(x, y) = x^2 + xy + y^2 - 3x$.",
        solution: [
          "$f_x = 2x + y - 3 = 0$ and $f_y = x + 2y = 0$ give $x = 2$, $y = -1$.",
          "$f_{xx} = 2$, $f_{yy} = 2$, $f_{xy} = 1$: $D = 4 - 1 = 3 > 0$ with $f_{xx} > 0$.",
          "$f(2, -1) = 4 - 2 + 1 - 6 = -3$.",
        ],
        result: "A local minimum at $(2, -1)$ with value $-3$.",
      },
      {
        type: "example",
        level: 3,
        title: "a saddle",
        problem: "Classify the stationary point of $f(x, y) = x^2 - y^2$ at the origin.",
        solution: ["$f_{xx} = 2$, $f_{yy} = -2$, $f_{xy} = 0$, so $D = -4 < 0$.", "Along the $x$-axis $f$ rises, along the $y$-axis it falls: a saddle, not a minimum."],
        result: "A saddle point.",
      },
    ],
    pitfalls: [
      { wrong: "Differentiate every variable when finding $f_x$.", right: "Hold the others fixed: $\\partial(x^2y)/\\partial x = 2xy$." },
      { wrong: "Use a non-unit direction in $\\nabla f\\cdot\\vec u$.", right: "Normalise first; otherwise the answer is scaled by $|\\vec u|$." },
      { wrong: "$\\nabla f = \\vec 0$ means a minimum.", right: "It may be a maximum or a saddle. Check $D$." },
    ],
    formulas: [
      { label: "Directional derivative", tex: "D_{\\hat u}f = \\nabla f\\cdot\\hat u" },
      { label: "Steepest rate", tex: "\\max D_{\\hat u}f = |\\nabla f|" },
      { label: "Linear approximation", tex: "\\Delta f \\approx f_x\\Delta x + f_y\\Delta y" },
      { label: "Test", tex: "D = f_{xx}f_{yy} - f_{xy}^2" },
    ],
    exercises: [
      ex(1, vec("grd-ex-1", "$f(x, y) = 3x^2 + y^3$. Find $\\nabla f$ at $(1, 1)$.", [6, 3], "$(6x, 3y^2)$."), ["$f_x = 6x = 6$ and $f_y = 3y^2 = 3$."]),
      ex(1, num("grd-ex-2", "$f(x, y) = xy^2$. Find $\\partial f/\\partial y$ at $(2, 3)$.", 12, "$2xy$."), ["$2 \\cdot 2 \\cdot 3 = 12$."]),
      ex(2, num("grd-ex-3", "$f(x, y) = x^2 + y^2$. Find the rate of change at $(1, 2)$ in the direction $(1, 0)$.", 2, "$\\nabla f\\cdot\\hat u = f_x$."), ["$\\nabla f = (2, 4)$; dotted with $(1, 0)$ gives 2."]),
      ex(2, num("grd-ex-4", "$f(x, y) = x^2 + y^2$. Find the largest rate of change at $(3, 4)$.", 10, "$|\\nabla f|$."), ["$\\nabla f = (6, 8)$ with length 10."]),
      ex(2, num("grd-ex-5", "$f(x, y) = xy$. Find the rate of change at $(2, 3)$ towards the direction $(3, 4)$.", 3.4, "Normalise to $\\tfrac15(3, 4)$."), ["$\\nabla f = (y, x) = (3, 2)$.", "$\\tfrac15(9 + 8) = 3.4$."]),
      ex(2, mc("grd-ex-6", "At a point, in which direction does $f$ not change to first order?", ["Perpendicular to $\\nabla f$", "$\\nabla f\\cdot\\hat u = 0$."], [["Along $\\nabla f$", "That is the steepest increase."], ["Along $-\\nabla f$", "That is the steepest decrease."]]), ["Moving along the level curve, perpendicular to $\\nabla f$, keeps $f$ constant."]),
      ex(3, vec("grd-ex-7", "Find the stationary point of $f(x, y) = x^2 + y^2 - 4x + 6y$.", [2, -3], "Set both partials to 0."), ["$2x - 4 = 0$ and $2y + 6 = 0$ give $(2, -3)$."]),
      ex(3, mc("grd-ex-8", "At the origin, $f(x, y) = x^2 + 4xy + y^2$ has", ["a saddle point", "$D = 4 - 16 < 0$."], [["a minimum", "Along $y = -x$, $f = -2x^2 < 0$."], ["a maximum", "Along the axes $f$ is positive."]]), ["$f_{xx} = f_{yy} = 2$, $f_{xy} = 4$: $D = 4 - 16 = -12 < 0$."]),
      ex(3, num("grd-ex-9", "Find the minimum value of $f(x, y) = x^2 + xy + y^2 - 3x$.", -3, "At $(2, -1)$."), ["The stationary point $(2, -1)$ is a minimum ($D = 3$), with $f = -3$."]),
      ex(3, num("grd-ex-10", "$f(x, y) = x^2y$. Use the linear approximation at $(1, 2)$ to estimate $f(1.1, 1.9)$.", 2.3, "$f + f_x\\Delta x + f_y\\Delta y$."), ["$f = 2$, $f_x = 2xy = 4$, $f_y = x^2 = 1$.", "$2 + 4(0.1) + 1(-0.1) = 2.3$; the exact value is 2.299."]),
      ex(3, num("grd-ex-11", "Find $D = f_{xx}f_{yy} - f_{xy}^2$ for $f(x, y) = 3x^2 + 2xy + y^2$.", 8, "$f_{xx} = 6$, $f_{yy} = 2$, $f_{xy} = 2$."), ["$6 \\cdot 2 - 2^2 = 8 > 0$ with $f_{xx} > 0$: the origin is a minimum."]),
    ],
  },

  // §{gradient-descent}
  "gradient-descent": {
    definitions: [
      {
        type: "definition",
        term: "iteration, learning rate",
        body: "Gradient descent produces $\\theta_0, \\theta_1, \\dots$ by $\\theta_{k+1} = \\theta_k - \\eta\\nabla L(\\theta_k)$. The **learning rate** $\\eta > 0$ scales each step; the actual step length is $\\eta|\\nabla L|$.",
      },
      {
        type: "definition",
        term: "batch, stochastic, mini-batch",
        body: "**Batch** descent uses the gradient of the loss averaged over all the data. **Stochastic** (SGD) uses one example at a time, **mini-batch** a small random group of $B$ examples: noisier steps, but far cheaper. One pass through the data is an **epoch**.",
      },
      {
        type: "definition",
        term: "convex function",
        body: "$f$ is **convex** if the chord between any two points of its graph lies on or above the graph; for a twice-differentiable one-variable $f$, this means $f'' \\ge 0$. Squared-error loss for a linear model is convex.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "descent on a quadratic",
        statement: "For $L(w) = \\tfrac a2(w - w^*)^2$ with $a > 0$, each step gives $w_{k+1} - w^* = (1 - \\eta a)(w_k - w^*)$. So descent converges exactly when $0 < \\eta < \\tfrac2a$: steadily if $\\eta < \\tfrac1a$, in one step if $\\eta = \\tfrac1a$, zig-zagging if $\\tfrac1a < \\eta < \\tfrac2a$. It diverges if $\\eta > \\tfrac2a$.",
        proof: [
          "$L'(w) = a(w - w^*)$, so $w_{k+1} - w^* = w_k - w^* - \\eta a(w_k - w^*)$.",
          "The distance is multiplied by $r = 1 - \\eta a$ each step, and $|r| < 1$ exactly when $0 < \\eta a < 2$. A negative $r$ flips the side each step.",
        ],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "small steps go downhill",
        statement: "If $\\nabla L \\neq \\vec 0$, a small enough step reduces the loss: $L(\\theta - \\eta\\nabla L) \\approx L(\\theta) - \\eta|\\nabla L|^2$.",
        proof: ["By the linear approximation (§{gradient}), $\\Delta L \\approx \\nabla L\\cdot\\Delta\\theta = \\nabla L\\cdot(-\\eta\\nabla L) = -\\eta|\\nabla L|^2 < 0$."],
      },
      {
        type: "theorem",
        kind: "Corollary",
        name: "uneven curvature",
        statement: "For $L = \\tfrac12(ax^2 + by^2)$ with $a > b > 0$, descent needs $\\eta < \\tfrac2a$ for the steep direction, which makes progress along the flat direction slow: each step multiplies $y$ by $1 - \\eta b$, close to 1 when $b \\ll a$.",
        proof: ["The coordinates update independently, $x \\leftarrow (1 - \\eta a)x$ and $y \\leftarrow (1 - \\eta b)y$, and one $\\eta$ must keep both factors inside $(-1, 1)$."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "convex losses",
        statement: "For a convex loss, every local minimum is a global minimum, so descent with a suitable $\\eta$ cannot get stuck in a worse valley. Neural-network losses are not convex.",
        proof: ["If $w_1$ were a local minimum with a lower point $w_2$ elsewhere, the chord from $w_1$ to $w_2$ would dip below $L(w_1)$ arbitrarily close to $w_1$, contradicting that $w_1$ is a local minimum."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$L(w) = (w - 3)^2$, start at $w_0 = 0$ with $\\eta = 0.25$. Find $w_1$ and $w_2$.",
        solution: ["$L'(w) = 2(w - 3)$. $w_1 = 0 - 0.25(-6) = 1.5$.", "$w_2 = 1.5 - 0.25(-3) = 2.25$. The distance to 3 halves each step: $r = 1 - 0.25 \\times 2 = 0.5$."],
        result: "$w_1 = 1.5$, $w_2 = 2.25$.",
      },
      {
        type: "example",
        level: 2,
        title: "the largest stable rate",
        problem: "For $L(w) = 5w^2$, which learning rates converge?",
        solution: ["$5w^2 = \\tfrac{10}{2}w^2$, so $a = 10$.", "Converge when $0 < \\eta < \\tfrac{2}{10}$; one step at $\\eta = 0.1$."],
        result: "$0 < \\eta < 0.2$.",
      },
      {
        type: "example",
        level: 3,
        title: "a narrow valley",
        problem: "$L = \\tfrac12(10x^2 + y^2)$ from $(1, 1)$ with $\\eta = 0.15$. Describe ten steps.",
        solution: [
          "$x$ is multiplied by $1 - 1.5 = -0.5$ each step: after 10 steps $|x| \\approx 0.001$, zig-zagging across the valley.",
          "$y$ is multiplied by $0.85$: after 10 steps $y \\approx 0.197$, still far from 0.",
          "$\\eta$ cannot exceed $0.2$ without $x$ diverging, so the flat direction is the bottleneck. Momentum and Adam were invented for this.",
        ],
        result: "$x$ settles fast, $y$ crawls.",
      },
    ],
    pitfalls: [
      { wrong: "$\\theta \\leftarrow \\theta + \\eta\\nabla L$.", right: "Subtract: the gradient points uphill." },
      { wrong: "A larger learning rate always trains faster.", right: "Beyond $2/a$ the iterates diverge; between $1/a$ and $2/a$ they zig-zag." },
      { wrong: "Gradient descent always finds the best weights.", right: "Only for convex losses. Otherwise it can stop at a local minimum or stall near a saddle." },
    ],
    formulas: [
      { label: "Update", tex: "\\theta_{k+1} = \\theta_k - \\eta\\nabla L(\\theta_k)" },
      { label: "Quadratic factor", tex: "w_{k+1} - w^* = (1 - \\eta a)(w_k - w^*)" },
      { label: "Stable rates", tex: "0 < \\eta < 2/a" },
      { label: "Decrease", tex: "\\Delta L \\approx -\\eta|\\nabla L|^2" },
    ],
    exercises: [
      ex(1, num("gdc-ex-1", "$L(w) = w^2$, $w = 3$, $\\eta = 0.1$. Find the next $w$.", 2.4, "$L' = 6$."), ["$3 - 0.1 \\times 6 = 2.4$."]),
      ex(1, vec("gdc-ex-2", "$L(x, y) = x^2 + y^2$. From $(1, 2)$ with $\\eta = 0.1$, find the next point.", [0.8, 1.6], "$\\nabla L = (2, 4)$."), ["$(1, 2) - 0.1(2, 4) = (0.8, 1.6)$."]),
      ex(2, num("gdc-ex-3", "$L(w) = (w - 1)^2$, $w = 3$, $\\eta = 0.25$. Find the next $w$.", 2, "$L' = 4$."), ["$3 - 0.25 \\times 4 = 2$."]),
      ex(2, num("gdc-ex-4", "For $L(w) = 2w^2$, find the learning rate above which descent diverges.", 0.5, "$a = 4$."), ["$2w^2 = \\tfrac42w^2$, so $a = 4$ and the limit is $2/4 = 0.5$."]),
      ex(2, num("gdc-ex-5", "For $L(w) = 2w^2$ with $\\eta = 0.2$, by what factor does $w$ shrink each step?", 0.2, "$1 - \\eta a$."), ["$1 - 0.2 \\times 4 = 0.2$."]),
      ex(2, fr("gdc-ex-6", "For $L(w) = 3(w - 5)^2$, which $\\eta$ reaches the minimum in one step?", 1 / 6, "$\\eta = 1/a$."), ["$a = 6$, so $\\eta = \\tfrac16$."]),
      ex(3, num("gdc-ex-7", "$L(w) = w^2$ with $\\eta = 0.75$, starting at $w = 8$. Find $w$ after two steps.", 2, "Factor $1 - 1.5$."), ["Each step multiplies $w$ by $-0.5$: $8 \\to -4 \\to 2$."]),
      ex(3, mc("gdc-ex-8", "$L(w) = w^2$ with $\\eta = 0.6$. The iterates", ["converge, alternating in sign", "The factor is $1 - 1.2 = -0.2$."], [["diverge", "$|-0.2| < 1$."], ["converge without changing sign", "A negative factor flips the sign each step."]]), ["$w_{k+1} = -0.2\\,w_k$: shrinking and alternating."]),
      ex(3, fr("gdc-ex-9", "For $L = \\tfrac12(x^2 + 9y^2)$, find the largest learning rate that still converges.", 2 / 9, "The steep direction decides."), ["The curvatures are 1 and 9; stability needs $\\eta < 2/9$."]),
      ex(3, num("gdc-ex-10", "One training example has $x = 2$, $y = 6$, and the loss is $L(w) = (wx - y)^2$. Find the largest stable learning rate.", 0.25, "Write $L = 4(w - 3)^2$."), ["$(2w - 6)^2 = 4(w - 3)^2 = \\tfrac82(w - 3)^2$, so $a = 8$ and $\\eta < 2/8 = 0.25$."]),
      ex(3, mc("gdc-ex-11", "On a loss with two valleys, gradient descent from a poor starting point", ["may settle in the worse valley", "Descent only follows the local slope."], [["always finds the deeper valley", "Only true for convex losses."], ["cannot converge", "It converges, just possibly to a local minimum."]]), ["Descent sees only the local gradient; a non-convex loss can trap it in a local minimum."]),
    ],
  },

  // §{backprop}
  backprop: {
    definitions: [
      {
        type: "definition",
        term: "computational graph",
        body: "A model written as a chain of simple operations (add, multiply, activation, loss). The **forward pass** computes and stores every intermediate value; each operation knows its **local derivative** with respect to its inputs.",
      },
      {
        type: "definition",
        term: "upstream gradient",
        body: "At each node, the **upstream gradient** $\\partial L/\\partial(\\text{output})$ arrives from later in the graph. The node passes back $\\partial L/\\partial(\\text{input}) = \\partial L/\\partial(\\text{output}) \\times$ local derivative.",
      },
    ],
    theorems: [
      {
        type: "theorem",
        name: "multivariable chain rule",
        statement: "If $L$ depends on $w$ through intermediate values $u_1, \\dots, u_k$, then $\\dfrac{\\partial L}{\\partial w} = \\displaystyle\\sum_j \\frac{\\partial L}{\\partial u_j}\\frac{\\partial u_j}{\\partial w}$: gradients from different paths add.",
        proof: ["A nudge $\\Delta w$ changes each $u_j$ by about $\\tfrac{\\partial u_j}{\\partial w}\\Delta w$, and by the linear approximation (§{gradient}) the effects of those changes on $L$ add."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "how common nodes pass gradients",
        statement: "**Add** $q = x + y$: both inputs receive the upstream gradient unchanged. **Multiply** $q = xy$: $x$ receives upstream $\\times\\, y$, and $y$ receives upstream $\\times\\, x$. **ReLU**: passes it through where the input was positive, else 0. **Sigmoid**: multiplies it by $\\sigma(1 - \\sigma)$.",
        proof: ["These are the local derivatives: $\\partial(x + y)/\\partial x = 1$, $\\partial(xy)/\\partial x = y$, $\\text{ReLU}'(z) = 1$ for $z > 0$ and 0 for $z < 0$, and $\\sigma'$ from §{chain-rule}."],
      },
      {
        type: "theorem",
        kind: "Proposition",
        name: "sigmoid with cross-entropy",
        statement: "For $p = \\sigma(z)$ and $L = -[y\\ln p + (1 - y)\\ln(1 - p)]$, $\\dfrac{\\partial L}{\\partial z} = p - y$.",
        proof: ["$\\dfrac{\\partial L}{\\partial p} = -\\dfrac yp + \\dfrac{1 - y}{1 - p} = \\dfrac{p - y}{p(1 - p)}$. Multiply by $\\sigma'(z) = p(1 - p)$."],
      },
      {
        type: "theorem",
        kind: "Rule",
        name: "cost",
        statement: "A backward pass costs a small constant multiple of a forward pass, however many weights there are. Estimating each derivative by nudging weights one at a time costs one forward pass per weight.",
        proof: ["Each node is visited once going back, doing a fixed amount of work with values stored on the way forward."],
      },
    ],
    examples: [
      {
        type: "example",
        level: 1,
        problem: "$f = (x + y)z$ with $x = 2$, $y = 3$, $z = 4$. Find every partial derivative by backprop.",
        solution: ["Forward: $q = x + y = 5$, $f = qz = 20$.", "Backward: $\\partial f/\\partial z = q = 5$ and $\\partial f/\\partial q = z = 4$.", "The add node passes 4 to both: $\\partial f/\\partial x = \\partial f/\\partial y = 4$."],
        result: "$(4, 4, 5)$ for $x, y, z$.",
      },
      {
        type: "example",
        level: 2,
        title: "a logistic neuron",
        problem: "$z = wx + b$, $p = \\sigma(z)$, cross-entropy loss with label $y = 1$. At $x = 2$, $w = 0$, $b = 0$, find $\\partial L/\\partial w$ and $\\partial L/\\partial b$.",
        solution: ["Forward: $z = 0$ and $p = 0.5$.", "$\\partial L/\\partial z = p - y = -0.5$.", "$z = wx + b$: $\\partial L/\\partial w = -0.5 \\times 2 = -1$ and $\\partial L/\\partial b = -0.5$."],
        result: "$-1$ and $-0.5$: descent raises both.",
      },
      {
        type: "example",
        level: 3,
        title: "a dead ReLU",
        problem: "$h = \\text{ReLU}(w_1x)$, $\\hat y = w_2h$, $L = (\\hat y - y)^2$ with $x = 1$, $w_1 = -1$, $w_2 = 3$, $y = 2$. Find $\\partial L/\\partial w_1$ and $\\partial L/\\partial w_2$.",
        solution: [
          "Forward: $w_1x = -1$, so $h = 0$, $\\hat y = 0$ and $L = 4$.",
          "$\\partial L/\\partial\\hat y = 2(0 - 2) = -4$; $\\partial L/\\partial w_2 = -4h = 0$.",
          "The ReLU input was negative, so nothing passes back: $\\partial L/\\partial w_1 = 0$. This unit cannot learn from this example.",
        ],
        result: "Both are 0.",
      },
    ],
    pitfalls: [
      { wrong: "A weight used twice gets the gradient from one use.", right: "Add the contributions from every path." },
      { wrong: "Gradients can be computed without the forward pass.", right: "Local derivatives need the stored forward values, such as $y$ for a multiply node." },
      { wrong: "ReLU's derivative is 1.", right: "It is 0 wherever the input was negative." },
    ],
    formulas: [
      { label: "Pass back", tex: "\\dfrac{\\partial L}{\\partial\\,\\text{in}} = \\dfrac{\\partial L}{\\partial\\,\\text{out}}\\cdot\\dfrac{\\partial\\,\\text{out}}{\\partial\\,\\text{in}}" },
      { label: "Paths add", tex: "\\dfrac{\\partial L}{\\partial w} = \\textstyle\\sum_j \\dfrac{\\partial L}{\\partial u_j}\\dfrac{\\partial u_j}{\\partial w}" },
      { label: "Sigmoid + cross-entropy", tex: "\\partial L/\\partial z = p - y" },
    ],
    exercises: [
      ex(1, num("bkp-ex-1", "$f = (x + y)z$ with $x = 1$, $y = 2$, $z = 5$. Find $\\partial f/\\partial x$.", 5, "The add node passes $z$ back."), ["$\\partial f/\\partial q = z = 5$, and the add node passes it to $x$ unchanged."]),
      ex(1, num("bkp-ex-2", "Same $f$. Find $\\partial f/\\partial z$.", 3, "$x + y$."), ["$\\partial f/\\partial z = x + y = 3$."]),
      ex(2, num("bkp-ex-3", "A multiply node $q = xy$ has $x = 3$, $y = -2$ and upstream gradient 4. Find $\\partial L/\\partial x$.", -8, "Upstream times the other input."), ["$4 \\times (-2) = -8$."]),
      ex(2, num("bkp-ex-4", "A ReLU had input $-2$ and receives upstream gradient 7. What does it pass back?", 0, "Negative input."), ["The input was negative, so the local derivative is 0."]),
      ex(2, num("bkp-ex-5", "A sigmoid node output 0.7 and receives upstream gradient 2. What does it pass back?", 0.42, "$\\sigma(1 - \\sigma) = 0.21$."), ["$2 \\times 0.7 \\times 0.3 = 0.42$."]),
      ex(2, num("bkp-ex-6", "A logistic neuron with input $x = 3$ predicts $p = 0.8$ for a label $y = 1$. Find $\\partial L/\\partial w$ for cross-entropy loss.", -0.6, "$(p - y)x$."), ["$\\partial L/\\partial z = -0.2$ and $\\partial z/\\partial w = x = 3$: $-0.6$."]),
      ex(3, num("bkp-ex-7", "$L = w^2x + wx$ with $w = 2$, $x = 3$. Find $\\partial L/\\partial w$.", 15, "Two paths."), ["$2wx + x = 12 + 3 = 15$."]),
      ex(3, num("bkp-ex-8", "$h = w_1x$, $\\hat y = w_2h$, $L = (\\hat y - y)^2$ with $x = 2$, $w_1 = 1$, $w_2 = 3$, $y = 4$. Find $\\partial L/\\partial w_2$.", 8, "$\\partial L/\\partial\\hat y \\cdot h$."), ["Forward: $h = 2$, $\\hat y = 6$. $\\partial L/\\partial\\hat y = 2(6 - 4) = 4$, times $h = 2$: 8."]),
      ex(3, num("bkp-ex-9", "Same network. Find $\\partial L/\\partial w_1$.", 24, "$4 \\cdot w_2 \\cdot x$."), ["$\\partial L/\\partial h = 4w_2 = 12$, and $\\partial h/\\partial w_1 = x = 2$: 24."]),
      ex(3, num("bkp-ex-10", "$h = \\text{ReLU}(w_1x + b_1)$, $\\hat y = w_2h$, $L = (\\hat y - y)^2$ with $x = 1$, $w_1 = 2$, $b_1 = -1$, $w_2 = 3$, $y = 1$. Find $\\partial L/\\partial b_1$.", 12, "The ReLU input is $1 > 0$."), ["Forward: pre-activation 1, $h = 1$, $\\hat y = 3$.", "$\\partial L/\\partial\\hat y = 4$, $\\partial L/\\partial h = 12$, the ReLU passes it, and $\\partial(w_1x + b_1)/\\partial b_1 = 1$: 12."]),
      ex(3, mc("bkp-ex-11", "A model has a million weights. Compared with nudging each weight to estimate its derivative, backprop needs", ["about one forward and one backward pass", "Every gradient comes from one sweep back."], [["a million backward passes", "One backward pass gives all of them."], ["the same work", "Nudging needs a forward pass per weight."]]), ["Nudging costs about a million forward passes; backprop costs a small multiple of one."]),
    ],
  },
};
