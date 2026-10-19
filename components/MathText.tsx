import katex from "katex";

/**
 * Renders content text: $$display$$, $inline$, **bold**, *italic*.
 * Content is ours (lib/content), not user input, so HTML from KaTeX is trusted;
 * plain text segments are still escaped.
 */

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inlineMarkup(s: string): string {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function tex(src: string, displayMode: boolean): string {
  return katex.renderToString(src, { displayMode, throwOnError: false, strict: "ignore" });
}

export function renderMath(text: string): string {
  let html = "";
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    html += inlineMarkup(text.slice(last, m.index));
    html += m[1] !== undefined ? tex(m[1], true) : tex(m[2], false);
    last = m.index + m[0].length;
  }
  return html + inlineMarkup(text.slice(last));
}

export function MathText({ text, className, as: Tag = "span" }: { text: string; className?: string; as?: "span" | "p" | "div" }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: renderMath(text) }} />;
}
