import Link from "next/link";
import { notFound } from "next/navigation";
import { MathText } from "@/components/MathText";
import { requireTeacher } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getNode } from "@/lib/content";
import { customId } from "@/lib/content/custom";
import type { CustomItemInput } from "@/lib/content/customSchema";
import { Editor } from "./Editor";
import { ItemActions } from "./ItemActions";

export const metadata = { title: "Edit questions" };

const KIND_LABEL: Record<string, string> = { mc: "Multiple choice", number: "Number", vector: "Vector", matrix: "Matrix", expression: "Expression" };

export default async function ContentNodePage({ params }: { params: Promise<{ nodeId: string }> }) {
  await requireTeacher();
  const { nodeId } = await params;
  const node = getNode(nodeId);
  if (!node) notFound();

  const rows = await prisma.customItem.findMany({ where: { nodeId }, orderBy: [{ archived: "asc" }, { createdAt: "desc" }] });
  const ids = rows.flatMap((r) => [customId(r.id, "p"), customId(r.id, "r")]);
  const stats = ids.length
    ? await prisma.attempt.groupBy({ by: ["itemId", "correct"], where: { itemId: { in: ids } }, _count: { _all: true } })
    : [];
  const statFor = (id: string) => {
    const mine = stats.filter((s) => s.itemId === customId(id, "p") || s.itemId === customId(id, "r"));
    const total = mine.reduce((n, s) => n + s._count._all, 0);
    const right = mine.filter((s) => s.correct).reduce((n, s) => n + s._count._all, 0);
    return { total, right };
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/teacher/content" className="text-sm underline text-[var(--muted)]">← All concepts</Link>
        <h1 className="text-3xl font-extrabold mt-1">{node.title}</h1>
        <p className="text-[var(--muted)]">{node.summary}</p>
      </div>

      <section className="card space-y-4">
        <h2 className="text-xl font-bold">Add a question</h2>
        <p className="text-sm text-[var(--muted)]">
          It&rsquo;s checked before saving: the answer you give must grade as correct. Tag wrong answers with a misconception and the app will treat them like its own
          diagnostic questions.
        </p>
        <Editor nodeId={node.id} misconceptions={node.misconceptions} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Your questions ({rows.filter((r) => !r.archived).length})</h2>
        {rows.length === 0 && <p className="card text-[var(--muted)]">None yet. Students see the built-in questions plus anything you add here.</p>}
        {rows.map((r) => {
          const data = r.data as unknown as CustomItemInput;
          const s = statFor(r.id);
          return (
            <div key={r.id} className={`card space-y-3 ${r.archived ? "opacity-50" : ""}`}>
              <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--muted)]">
                <span>
                  {KIND_LABEL[r.kind] ?? r.kind} · {[r.inPractice && "practice", r.inReview && "review"].filter(Boolean).join(" + ")}
                  {r.archived && " · archived"}
                </span>
                <span>{s.total ? `${s.right}/${s.total} correct (${Math.round((s.right / s.total) * 100)}%)` : "Not answered yet"}</span>
              </div>
              <MathText as="div" text={data.prompt} className="text-lg" />
              <ItemActions id={r.id} archived={r.archived} nodeId={node.id} misconceptions={node.misconceptions} initial={{ id: r.id, data, inPractice: r.inPractice, inReview: r.inReview }} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
