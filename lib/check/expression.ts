import { parse, type MathNode } from "mathjs";

/**
 * Typed-expression equivalence by random evaluation.
 *
 * Two expressions are equal if they agree at many variable bindings. This is
 * how Khan Academy's checker works (see reverse engineer/docs/spec/
 * perseus-answer-checking.md); the implementation here is our own, on mathjs.
 */

const CONSTANTS = new Set(["pi", "e", "PI", "E", "Infinity", "NaN", "true", "false"]);
const TOLERANCE = 1e-9;

export type Parsed = { ok: true; node: MathNode; vars: string[] } | { ok: false };

/** Student keyboards produce ×, ·, −, ÷. mathjs wants ASCII. */
export function normalize(input: string): string {
  return input
    .replace(/[×·⋅]/g, "*")
    .replace(/[−–]/g, "-")
    .replace(/÷/g, "/")
    .replace(/\*\*/g, "^")
    .trim();
}

export function parseExpression(input: string): Parsed {
  const text = normalize(input);
  if (!text) return { ok: false };
  try {
    const node = parse(text);
    const vars = new Set<string>();
    node.traverse((n, _path, parent) => {
      if (n.type !== "SymbolNode") return;
      const name = (n as unknown as { name: string }).name;
      // f(x): the symbol "f" is the function's name, not a variable.
      if (parent?.type === "FunctionNode" && (parent as unknown as { fn: MathNode }).fn === n) return;
      if (!CONSTANTS.has(name)) vars.add(name);
    });
    // Compile once to surface unknown-function errors at parse time.
    node.compile();
    return { ok: true, node, vars: [...vars].sort() };
  } catch {
    return { ok: false };
  }
}

/** Absolute difference near zero, relative difference otherwise. */
export function numbersEqual(a: number, b: number): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return !Number.isNaN(a) && !Number.isNaN(b) && a === b;
  }
  const delta = Math.abs(a) < 1 || Math.abs(b) < 1 ? Math.abs(a - b) : Math.abs(1 - a / b);
  return delta < TOLERANCE;
}

function evaluate(node: MathNode, scope: Record<string, number>): number {
  try {
    const value = node.compile().evaluate({ ...scope });
    return typeof value === "number" ? value : Number.NaN; // complex, matrix, unit -> not comparable
  } catch {
    return Number.NaN;
  }
}

/** Deterministic PRNG so the same answer always grades the same way. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Bindings: always -1, 0, 1, then integers and floats of both signs at
 * magnitudes 1, 10, 100, 1000. Integers matter: (-2)^x is NaN at x = 0.5.
 */
function bindings(vars: string[]): Record<string, number>[] {
  const rand = mulberry32(0x5eed);
  const out: Record<string, number>[] = [];
  for (const fixed of [-1, 0, 1]) out.push(Object.fromEntries(vars.map((v) => [v, fixed])));
  for (const magnitude of [1, 10, 100, 1000]) {
    for (const sign of [1, -1]) {
      for (const integer of [true, false]) {
        for (let k = 0; k < 2; k++) {
          out.push(
            Object.fromEntries(
              vars.map((v) => {
                const raw = rand() * magnitude;
                return [v, sign * (integer ? Math.round(raw) : raw)];
              }),
            ),
          );
        }
      }
    }
  }
  return out;
}

export function equivalent(a: MathNode, b: MathNode, vars: string[]): boolean {
  if (vars.length === 0) return numbersEqual(evaluate(a, {}), evaluate(b, {}));
  let compared = 0;
  for (const scope of bindings(vars)) {
    const x = evaluate(a, scope);
    const y = evaluate(b, scope);
    if (!numbersEqual(x, y)) return false;
    if (Number.isFinite(x)) compared++;
  }
  // Agreeing only on NaN (both undefined everywhere we looked) proves nothing.
  return compared > 0;
}
