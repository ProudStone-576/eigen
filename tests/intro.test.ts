import { describe, expect, it } from "vitest";
import { allNodes, getNode } from "@/lib/content";
import { introFor } from "@/lib/content/intro";
import { buildProgram, eigen2, N, phi } from "@/components/intro/programs";

const buffers = () => ({ pos: new Float32Array(N * 3), col: new Float32Array(N * 3), size: new Float32Array(N) });
const at = (id: string, p: number) => {
  const prog = buildProgram(introFor(getNode(id)!));
  const b = buffers();
  return { f: prog.frame(p, 1.5, b.pos, b.col, b.size), ...b };
};

describe.each(allNodes.map((n) => [n.id, n] as const))("intro for %s", (_id, node) => {
  it("renders finite particles, overlays and a readout from start to end", () => {
    const prog = buildProgram(introFor(node));
    const { pos, col, size } = buffers();
    for (const p of [0, 0.2, 0.5, 0.8, 1]) {
      pos.fill(NaN);
      const f = prog.frame(p, 2.3, pos, col, size);
      expect(pos.every(Number.isFinite), `p=${p}`).toBe(true);
      expect(col.every(Number.isFinite), `p=${p}`).toBe(true);
      expect(size.every((s) => Number.isFinite(s) && s > 0), `p=${p}`).toBe(true);
      expect(f.hud.length, `p=${p}`).toBeGreaterThan(0);
      for (const a of f.arrows) expect(a.v.every(Number.isFinite)).toBe(true);
      for (const l of f.lines) expect([...l.a, ...l.b, ...l.c, l.o].every(Number.isFinite)).toBe(true);
    }
  });
});

describe("the readouts tell the truth", () => {
  it("eigenvalues of the eigenvector lesson's matrix are 3 and 1", () => {
    expect(eigen2([[2, 1], [1, 2]]).map((e) => e.value)).toEqual([3, 1]);
    const [e] = eigen2([[4, 1], [2, 3]]);
    expect(e.value).toBeCloseTo(5);
    // A v = λ v
    expect(4 * e.vector[0] + e.vector[1]).toBeCloseTo(5 * e.vector[0]);
  });

  it("Bayes: 1% prevalence, 90% sensitivity, 9% false positives → about 9% of positives are sick", () => {
    const hud = at("bayes", 1).f.hud;
    expect(hud).toMatch(/of 98 positive tests, only 9 are sick: P\(sick \| positive\) = 9%/);
  });

  it("solving Ax = b ends with Ax on the target", () => {
    expect(at("solving-systems", 1).f.hud).toContain("Ax = (3, 2)");
  });

  it("the determinant lesson's matrix doubles areas", () => {
    expect(at("determinant", 1).f.hud).toContain("area ×2");
    expect(at("det-zero", 1).f.hud).toContain("area ×1, flipped");
  });

  it("composition ends at second·first", () => {
    // first = 90° rotation, second = shear: shear·rot = [[1,-1],[1,0]]
    expect(at("composition", 1).f.hud).toContain("[ 1  -1 ; 1  0 ]");
    // A then A⁻¹ is the identity
    expect(at("inverse", 1).f.hud).toContain("[ 1  0 ; 0  1 ]");
  });

  it("the derivative readout reaches f′(a)", () => {
    expect(at("derivative", 1).f.hud).toContain("f′(1) = 2");
    expect(at("chain-rule", 1).f.hud).toContain("f′(0) = 6");
  });

  it("p-value tails match the normal table", () => {
    expect(2 * (1 - phi(1.96))).toBeCloseTo(0.05, 3);
    expect(at("hypothesis-tests", 1).f.hud).toMatch(/13\.4% of the time/);
  });

  it("the variance lesson's data has variance 5.6", () => {
    expect(at("variance", 1).f.hud).toContain("variance 5.6");
  });

  it("the box plot flags 30 as the outlier", () => {
    expect(at("quartiles-iqr", 1).f.hud).toContain("Q1 4  ·  median 6  ·  Q3 8  ·  IQR 4  ·  30 is an outlier");
  });

  it("span: a dependent pair collapses to a line, an independent pair fills the plane", () => {
    expect(at("span", 1).f.hud).toContain("one line");
    expect(at("linear-independence", 1).f.hud).toContain("the whole plane");
  });

  it("Simpson: the pooled slope is positive and both group slopes are negative", () => {
    const pooled = at("correlation-causation", 0.45).f.hud.match(/slope \+([\d.]+)/);
    expect(pooled).not.toBeNull();
    const within = at("correlation-causation", 1).f.hud.match(/slope is (-[\d.]+) and (-[\d.]+)/);
    expect(within).not.toBeNull();
  });

  it("the overfit curve memorises the training points but does worse on new data than the simple fit", () => {
    const wig = at("regularization", 0.55).f.hud.match(/training error ([\d.]+), new-data error ([\d.]+)/)!;
    const cub = at("regularization", 1).f.hud.match(/training error ([\d.]+), new-data error ([\d.]+)/)!;
    expect(Number(wig[1])).toBeLessThan(0.001);
    expect(Number(wig[2])).toBeGreaterThan(Number(cub[2]));
  });

  it("95% intervals: 38 of 40 catch the true mean", () => {
    expect(at("confidence-intervals", 1).f.hud).toContain("40 samples  ·  38 intervals caught the true mean (95%)");
  });

  it("chi-square on the 'differ' table is large; on the 'same' table it is 0", () => {
    expect(Number(at("chi-square", 1).f.hud.match(/χ² = ([\d.]+)/)![1])).toBeGreaterThan(50);
    expect(at("independence", 1).f.hud).toContain("χ² = 0.0");
  });
});
