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
  it("\\$ is a literal dollar sign, not maths", () => {
    const h = renderMath("costs \\$12 and \\$5, and $x^2$");
    expect(h).toContain("costs $12 and $5, and ");
    expect(h.match(/class="katex"/g)).toHaveLength(1);
  });
  it("escapes HTML in plain text", () => {
    expect(renderMath("<script>x</script>")).not.toContain("<script>");
  });
  it("renders `code` literally, without emphasis inside", () => {
    const h = renderMath("run `SELECT *, COUNT(*) FROM t` and **check**");
    expect(h).toContain('<code class="inline-code">SELECT *, COUNT(*) FROM t</code>');
    expect(h).toContain("<strong>check</strong>");
    expect(renderMath("`a <b> c`")).toBe('<code class="inline-code">a &lt;b&gt; c</code>');
    expect(renderMath("`**x**`")).not.toContain("<strong>");
  });
});
