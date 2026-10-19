import Link from "next/link";
import type { ConceptNode } from "@/lib/content/types";
import type { Status } from "@/lib/learning/rules";

const DX = 175;
const DY = 115;
const W = 155;
const H = 76;

/** Two lines of at most ~18 characters, split on words. */
function wrap(title: string): string[] {
  const words = title.split(" ");
  const lines = [""];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if (cur && (cur + " " + w).length > 18 && lines.length < 2) lines.push(w);
    else lines[lines.length - 1] = cur ? `${cur} ${w}` : w;
  }
  return lines;
}

export const STATUS_STYLE: Record<Status | "LOCKED", { fill: string; stroke: string; label: string }> = {
  LOCKED: { fill: "var(--surface)", stroke: "var(--border)", label: "Locked" },
  UNKNOWN: { fill: "var(--surface)", stroke: "var(--accent)", label: "Ready" },
  EDGE: { fill: "var(--edge-bg)", stroke: "var(--edge)", label: "In progress" },
  LANDED: { fill: "var(--landed-bg)", stroke: "var(--landed)", label: "Landed" },
  SOLID: { fill: "var(--solid-bg)", stroke: "var(--solid)", label: "Solid" },
  MISCONCEPTION: { fill: "var(--mis-bg)", stroke: "var(--mis)", label: "Untangle" },
};

export function ConceptMap({ nodes, state }: { nodes: ConceptNode[]; state: Record<string, Status | "LOCKED"> }) {
  const maxX = Math.max(...nodes.map((n) => n.pos.x));
  const maxY = Math.max(...nodes.map((n) => n.pos.y));
  const width = maxX * DX + W + 20;
  const height = maxY * DY + H + 20;
  const at = (n: ConceptNode) => ({ x: 10 + n.pos.x * DX, y: 10 + n.pos.y * DY });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: Math.min(width, 900) }} className="w-full" role="img" aria-label="Concept map">
        {nodes.flatMap((n) =>
          n.deps.map((d) => {
            const from = byId.get(d);
            if (!from) return null;
            const a = at(from);
            const b = at(n);
            const x1 = a.x + W;
            const y1 = a.y + H / 2;
            const x2 = b.x;
            const y2 = b.y + H / 2;
            const mid = (x1 + x2) / 2;
            return (
              <path
                key={`${d}-${n.id}`}
                d={`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`}
                fill="none"
                stroke="var(--border)"
                strokeWidth={2}
              />
            );
          }),
        )}
        {nodes.map((n) => {
          const s = state[n.id] ?? "LOCKED";
          const st = STATUS_STYLE[s];
          const { x, y } = at(n);
          const body = (
            <g opacity={s === "LOCKED" ? 0.55 : 1}>
              <rect x={x} y={y} width={W} height={H} rx={14} fill={st.fill} stroke={st.stroke} strokeWidth={2.5} />
              <text x={x + 12} y={y + 22} fontSize={13} fontWeight={700} fill="var(--fg)">
                {wrap(n.title).map((line, k) => (
                  <tspan key={k} x={x + 12} dy={k === 0 ? 0 : 16}>
                    {line}
                  </tspan>
                ))}
              </text>
              <text x={x + 12} y={y + H - 12} fontSize={12} fill={st.stroke}>
                {s === "LOCKED" ? "🔒 " : ""}
                {st.label}
              </text>
            </g>
          );
          return s === "LOCKED" ? (
            <g key={n.id}>{body}</g>
          ) : (
            <Link key={n.id} href={`/learn/${n.id}`}>
              {body}
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
