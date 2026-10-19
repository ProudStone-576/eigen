import { describe, expect, it } from "vitest";
import { renderMath } from "@/components/MathText";

describe("content text rendering", () => {
  it("keeps * as multiplication in plain text", () => {
    expect(renderMath("2*3 - 1*4 = 2")).toBe("2*3 - 1*4 = 2");
    expect(renderMath("use a*x + b*y")).not.toContain("<em>");
  });
  it("still renders word emphasis and bold", () => {
    expect(renderMath("This rests on *a vector is a movement*.")).toContain("<em>a vector is a movement</em>");
    expect(renderMath("turns **solid**")).toContain("<strong>solid</strong>");
  });
  it("escapes HTML in plain text", () => {
    expect(renderMath("<script>x</script>")).not.toContain("<script>");
  });
});
