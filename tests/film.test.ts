import { describe, expect, it } from "vitest";
import {
  A,
  ACT_COUNT,
  ACT_VIEW,
  apply3,
  EIGEN,
  fillShape,
  inv3,
  LR,
  matrixAt,
  mul3,
  N,
  NET_EDGES,
  onEigenAxis,
  PATH,
  PCA_AXES,
  T_EDGES,
  T_VERTS,
  tesseract,
  VARIANCE_KEPT,
} from "@/components/landing/filmMath";

const close = (a: number[], b: number[], eps = 1e-9) => a.every((x, i) => Math.abs(x - b[i]) < eps);

describe("act 1: the matrix", () => {
  it("has the advertised eigenvectors and eigenvalues", () => {
    EIGEN.vectors.forEach((v, k) => expect(close(apply3(A, v), v.map((x) => x * EIGEN.values[k]))).toBe(true));
  });
  it("keeps (1, 1, 1) an eigenvector all along the path from I to A, with λ = 1 + 0.7u (the readout)", () => {
    for (const u of [0, 0.25, 0.5, 1]) expect(close(apply3(matrixAt(u), [1, 1, 1]), [1, 1, 1].map((x) => x * (1 + 0.7 * u)))).toBe(true);
  });
  it("inverts correctly", () => {
    expect(close(mul3(A, inv3(A)), [1, 0, 0, 0, 1, 0, 0, 0, 1])).toBe(true);
  });
  it("highlights exactly the 16 lattice points on the eigen-line", () => {
    expect(Array.from({ length: N }, (_, i) => onEigenAxis(i)).filter(Boolean)).toHaveLength(16);
  });
});

describe("act 2: the tesseract", () => {
  it("has 16 vertices and 32 edges of length 2", () => {
    expect(T_VERTS).toHaveLength(16);
    expect(T_EDGES).toHaveLength(32);
    for (const [a, b] of T_EDGES) expect(Math.hypot(...T_VERTS[a].map((x, i) => x - T_VERTS[b][i]))).toBeCloseTo(2);
  });
  it("rotates rigidly in 4D (distance from the origin is preserved before projection)", () => {
    // With no rotation, w passes straight through.
    expect(tesseract([1, -1, 1, 1], 0, 0).w).toBeCloseTo(1);
    // A rotation keeps |x|² + |z|² + |w|² for points with y fixed.
    const v = [1, 1, -1, 1];
    const { w } = tesseract(v, 0.7, 0.3);
    expect(Math.abs(w)).toBeLessThanOrEqual(Math.sqrt(3) + 1e-9);
  });
});

describe("act 3: PCA", () => {
  it("uses orthonormal principal axes", () => {
    for (let a = 0; a < 3; a++)
      for (let b = 0; b < 3; b++) {
        const dot = PCA_AXES[a].reduce((s, x, i) => s + x * PCA_AXES[b][i], 0);
        expect(dot).toBeCloseTo(a === b ? 1 : 0);
      }
  });
  it("keeps the variance the page claims", () => {
    expect(VARIANCE_KEPT).toBeCloseTo(1.0825 / 1.105, 6); // 98.0%
  });
  it("flattening removes the third component entirely", () => {
    const pos = new Float32Array(N * 3);
    fillShape(3, 1, 0, pos, new Float32Array(N * 3), new Float32Array(N));
    const q3 = PCA_AXES[2];
    for (let i = 0; i < N; i++) expect(Math.abs(pos[i * 3] * q3[0] + pos[i * 3 + 1] * q3[1] + pos[i * 3 + 2] * q3[2])).toBeLessThan(1e-5);
  });
});

describe("act 4: gradient descent", () => {
  it("lowers the loss at every step (η is small enough) and ends near the minimum", () => {
    expect(LR).toBe(0.18);
    for (let s = 1; s < PATH.length; s++) expect(PATH[s].loss).toBeLessThanOrEqual(PATH[s - 1].loss + 1e-12);
    expect(PATH.at(-1)!.loss).toBeLessThan(PATH[0].loss - 1);
  });
});

describe("act 5: the network", () => {
  it("is fully connected layer to layer: 3·5 + 5·5 + 5·2 = 50 weights", () => {
    expect(NET_EDGES).toHaveLength(50);
  });
});

describe("every act", () => {
  it("fills all particles with finite values at any progress", () => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const size = new Float32Array(N);
    for (let k = 0; k < ACT_COUNT; k++)
      for (const u of [0, 0.5, 1]) {
        pos.fill(NaN);
        fillShape(k, u, 3.7, pos, col, size);
        expect(pos.every(Number.isFinite), `act ${k}`).toBe(true);
        expect(size.every((s) => s > 0), `act ${k}`).toBe(true);
      }
  });
  it("has a camera for each act", () => {
    expect(ACT_VIEW).toHaveLength(ACT_COUNT);
  });
});
