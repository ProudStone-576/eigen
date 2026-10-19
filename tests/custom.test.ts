import { describe, expect, it } from "vitest";
import { getNode, publicItem } from "@/lib/content";
import { correctResponse, toItem } from "@/lib/content/customSchema";
import { grade } from "@/lib/check";

const node = getNode("determinant")!;
const ok = (input: unknown) => {
  const r = toItem(node, input, "cust~x~p");
  if ("error" in r) throw new Error(r.error);
  return r.item;
};
const err = (input: unknown) => {
  const r = toItem(node, input, "cust~x~p");
  return "error" in r ? r.error : null;
};

describe("teacher-written questions", () => {
  it("multiple choice: one correct option, misconceptions carried through", () => {
    const item = ok({
      kind: "mc",
      prompt: "det of [[1,2],[3,4]]?",
      options: [
        { text: "-2", correct: true, why: "4 − 6" },
        { text: "4", correct: false, why: "a·d only", misconception: "ad-only" },
      ],
    });
    expect(grade(item, correctResponse(item)).status).toBe("correct");
    expect(grade(item, { kind: "mc", optionId: "b" }).misconception).toBe("ad-only");
    expect(JSON.stringify(publicItem(item))).not.toMatch(/"correct":|"why":/);
  });

  it("rejects zero or two correct options, duplicates, and unknown misconceptions", () => {
    const base = { kind: "mc", prompt: "Q" };
    expect(err({ ...base, options: [{ text: "a", correct: false, why: "" }, { text: "b", correct: false, why: "" }] })).toMatch(/exactly one/);
    expect(err({ ...base, options: [{ text: "a", correct: true, why: "" }, { text: "b", correct: true, why: "" }] })).toMatch(/exactly one/);
    expect(err({ ...base, options: [{ text: "a", correct: true, why: "" }, { text: "a", correct: false, why: "" }] })).toMatch(/same text/);
    expect(err({ ...base, options: [{ text: "a", correct: true, why: "" }, { text: "b", correct: false, why: "", misconception: "made-up" }] })).toMatch(/misconception/);
  });

  it("numbers, vectors and matrices self-grade", () => {
    for (const input of [
      { kind: "number", prompt: "Q", answer: 0.75, explain: "" },
      { kind: "vector", prompt: "Q", answer: [1, -2], upToScale: true, explain: "" },
      { kind: "matrix", prompt: "Q", answer: [[1, 0], [0, 1]], explain: "" },
    ]) {
      const item = ok(input);
      expect(grade(item, correctResponse(item)).status).toBe("correct");
    }
  });

  it("rejects missing answers, ragged matrices and a zero any-multiple vector", () => {
    expect(err({ kind: "number", prompt: "Q", answer: Number.NaN, explain: "" })).toBeTruthy();
    expect(err({ kind: "matrix", prompt: "Q", answer: [[1, 2], [3]], explain: "" })).toMatch(/same number/);
    expect(err({ kind: "vector", prompt: "Q", answer: [0, 0], upToScale: true, explain: "" })).toMatch(/zero vector/);
    expect(err({ kind: "number", prompt: "", answer: 1, explain: "" })).toMatch(/empty/);
  });

  it("expressions: equivalent student answers accepted, wrong forms must really be wrong", () => {
    const item = ok({ kind: "expression", prompt: "det of [[a,b],[c,d]]", correct: "a*d - b*c", wrong: [{ value: "a*d + b*c", message: "minus", misconception: "plus-bc" }], explain: "" });
    expect(grade(item, { kind: "expression", text: "-c*b + d*a" }).status).toBe("correct");
    expect(grade(item, { kind: "expression", text: "a*d + c*b" }).misconception).toBe("plus-bc");
    expect(err({ kind: "expression", prompt: "Q", correct: "a*d - b*c", wrong: [{ value: "d*a - c*b", message: "" }], explain: "" })).toMatch(/equivalent/);
    expect(err({ kind: "expression", prompt: "Q", correct: "a*d -* )", wrong: [], explain: "" })).toBeTruthy();
  });
});
