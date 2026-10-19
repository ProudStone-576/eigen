import { describe, expect, it } from "vitest";
import { phi, quartiles } from "@/components/widgets/InferenceWidgets";

describe("box plot quartiles (median of halves, median excluded when n is odd)", () => {
  it("matches the lesson's worked examples", () => {
    expect(quartiles([2, 4, 5, 6, 7, 8, 30])).toMatchObject({ q1: 4, median: 6, q3: 8 });
    expect(quartiles([1, 3, 4, 6, 7, 8, 10, 12, 20])).toMatchObject({ q1: 3.5, median: 7, q3: 11 });
    expect(quartiles([2, 4, 6, 8, 10, 12])).toMatchObject({ q1: 4, median: 7, q3: 10 });
  });
  it("doesn't care about input order", () => {
    expect(quartiles([30, 2, 8, 5, 7, 4, 6])).toMatchObject({ q1: 4, q3: 8 });
  });
});

describe("normal CDF used for p-values", () => {
  it("hits the standard table values", () => {
    expect(phi(0)).toBeCloseTo(0.5, 6);
    expect(phi(1.96)).toBeCloseTo(0.975, 3);
    expect(phi(-1.96)).toBeCloseTo(0.025, 3);
    expect(2 * (1 - phi(2.17))).toBeCloseTo(0.03, 2); // the hypothesis-test lesson's example
    expect(2 * (1 - phi(3.29))).toBeCloseTo(0.001, 3); // the errors-and-power lesson's α = 0.001 cut-off
  });
});
