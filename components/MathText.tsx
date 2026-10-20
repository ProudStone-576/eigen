import katex from "katex";

/**
 * Renders content text: $$display$$, $inline$, **bold**, *italic*, `code`.
 * Content is ours (lib/content), not user input, so HTML from KaTeX is trusted;
 * plain text segments are still escaped.
 */

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function emphasis(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // *emphasis* only when it starts after a space/bracket with a letter, so "2*3 - 1*4" stays maths.
    .replace(/(^|[\s(])\*([A-Za-z][^*\n]*?)\*(?=[\s.,;:!?)]|$)/g, "$1<em>$2</em>");
}

/** `code` spans stay literal, so `SELECT *` or `x**2` inside them isn't read as emphasis. */
function inlineMarkup(s: string): string {
  return escape(s)
    .split(/(`[^`\n]+`)/)
    .map((part, i) => (i % 2 === 1 ? `<code class="inline-code">${part.slice(1, -1)}</code>` : emphasis(part)))
    .join("");
}

function tex(src: string, displayMode: boolean): string {
  return katex.renderToString(src.replaceAll(DOLLAR, "\\$"), { displayMode, throwOnError: false, strict: "ignore" });
}

const DOLLAR = "\u0001";

/** `\$` is a literal dollar sign (prices), not the start of maths. */
export function renderMath(text: string): string {
  text = text.replace(/\\\$/g, DOLLAR);
  let html = "";
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    html += inlineMarkup(text.slice(last, m.index));
    html += m[1] !== undefined ? tex(m[1], true) : tex(m[2], false);
    last = m.index + m[0].length;
  }
  return (html + inlineMarkup(text.slice(last))).replaceAll(DOLLAR, "$");
}

export function MathText({ text, className, as: Tag = "span" }: { text: string; className?: string; as?: "span" | "p" | "div" }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: renderMath(text) }} />;
}
