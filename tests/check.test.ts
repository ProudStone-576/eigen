import { describe, expect, it } from "vitest";
import { grade, parseNumber } from "@/lib/check";
import type { ExpressionItem, MatrixItem, VectorItem } from "@/lib/content/types";

const expr = (forms: ExpressionItem["forms"]): ExpressionItem => ({ kind: "expression", id: "t", prompt: "", forms, explain: "" });
const g = (item: ExpressionItem, text: string) => grade(item, { kind: "expression", text });

describe("expression equivalence (AC-1, AC-7)", () => {
  const twoXPlusTwo = expr([{ value: "2x+2", status: "correct" }]);
  it("accepts algebraically equal forms", () => {
    expect(g(twoXPlusTwo, "2(x+1)").status).toBe("correct");
    expect(g(twoXPlusTwo, "x + x + 2").status).toBe("correct");
    expect(g(twoXPlusTwo, "2·x + 2").status).toBe("correct");
  });
  it("rejects different expressions", () => {
    expect(g(expr([{ value: "x^2", status: "correct" }]), "2x").status).toBe("wrong");
    expect(g(expr([{ value: "(-2)^x", status: "correct" }]), "(-2)^(x+1)").status).toBe("wrong");
  });
  it("handles several variables in any order", () => {
    expect(g(expr([{ value: "a*x + b*y", status: "correct" }]), "b*y + a*x").status).toBe("correct");
    expect(g(expr([{ value: "a*x + b*y", status: "correct" }]), "y b + x a").status).toBe("correct");
  });
});

describe("invalid and ungraded (AC-2, AC-4)", () => {
  const item = expr([{ value: "2a - b", status: "correct" }]);
  it("empty or garbage is invalid, not wrong", () => {
    expect(g(item, "").status).toBe("invalid");
    expect(g(item, "2a -* )").status).toBe("invalid");
  });
  it("unknown variable is ungraded with a hint", () => {
    expect(g(item, "2a - c").status).toBe("ungraded");
  });
  it("glued letters get a times hint", () => {
    const r = g(expr([{ value: "a*x + b*y", status: "correct" }]), "ax + by");
    expect(r.status).toBe("ungraded");
    expect(r.message).toMatch(/a\*x/);
  });
  it("case-only mismatch says so", () => {
    const r = g(item, "2A - b");
    expect(r.status).toBe("ungraded");
    expect(r.message).toMatch(/case/);
  });
});

describe("ordered answer forms (AC-3)", () => {
  const item = expr([
    { value: "2a + b", status: "wrong", misconception: "sign", message: "check the sign" },
    { value: "2a - b", status: "correct" },
  ]);
  it("matches a specific wrong form first", () => {
    const r = g(item, "b + 2a");
    expect(r.status).toBe("wrong");
    expect(r.misconception).toBe("sign");
  });
  it("falls through to the correct form", () => {
    expect(g(item, "-b + 2a").status).toBe("correct");
  });
});

describe("numbers (AC-5)", () => {
  it("parses fractions and decimals", () => {
    expect(parseNumber("3/4")).toBeCloseTo(0.75);
    expect(parseNumber("−1.5")).toBe(-1.5);
    expect(parseNumber("x")).toBeNull();
  });
});

describe("vectors and matrices (AC-6)", () => {
  const vec: VectorItem = {
    kind: "vector",
    id: "v",
    prompt: "",
    answer: [-3, 1],
    explain: "",
    traps: [{ answer: [-10, -12], misconception: "mult", message: "add" }],
  };
  const mat: MatrixItem = { kind: "matrix", id: "m", prompt: "", answer: [[0, -1], [1, 0]], explain: "" };
  it("grades cellwise and accepts equivalent numbers", () => {
    expect(grade(vec, { kind: "vector", values: ["-3", "1"] }).status).toBe("correct");
    expect(grade(vec, { kind: "vector", values: ["-6/2", "2/2"] }).status).toBe("correct");
    expect(grade(mat, { kind: "matrix", values: [["0", "-1"], ["1", "0"]] }).status).toBe("correct");
    expect(grade(mat, { kind: "matrix", values: [["0", "1"], ["-1", "0"]] }).status).toBe("wrong");
  });
  it("catches traps", () => {
    expect(grade(vec, { kind: "vector", values: ["-10", "-12"] }).misconception).toBe("mult");
  });
  it("up-to-scale vectors accept any non-zero multiple, never zero", () => {
    const eig: VectorItem = { kind: "vector", id: "e", prompt: "", answer: [1, -2], explain: "", upToScale: true };
    const g = (values: string[]) => grade(eig, { kind: "vector", values }).status;
    expect(g(["1", "-2"])).toBe("correct");
    expect(g(["-3", "6"])).toBe("correct");
    expect(g(["0.5", "-1"])).toBe("correct");
    expect(g(["1", "2"])).toBe("wrong");
    expect(g(["0", "0"])).toBe("wrong");
    const axis: VectorItem = { kind: "vector", id: "a", prompt: "", answer: [0, 1], explain: "", upToScale: true };
    expect(grade(axis, { kind: "vector", values: ["0", "-4"] }).status).toBe("correct");
    expect(grade(axis, { kind: "vector", values: ["1", "4"] }).status).toBe("wrong");
  });
  it("empty cell is invalid", () => {
    expect(grade(vec, { kind: "vector", values: ["-3", ""] }).status).toBe("invalid");
  });
});
