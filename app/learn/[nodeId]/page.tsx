import Link from "next/link";
import { notFound } from "next/navigation";
import { Lesson } from "@/components/Lesson";
import { MathText } from "@/components/MathText";
import { requireUser } from "@/lib/auth/session";
import { allNodes, getNode, publicSteps } from "@/lib/content";
import { loadProgress, markOpened, statusIn, unlocked } from "@/lib/learning/progress";
import { tutorEnabled } from "@/lib/tutor";

export async function generateMetadata({ params }: { params: Promise<{ nodeId: string }> }) {
  const node = getNode((await params).nodeId);
  return { title: node?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = getNode(nodeId);
  if (!node) notFound();
  const user = await requireUser();
  const progress = await loadProgress(user.id);

  if (!unlocked(node.id, progress)) {
    const status = statusIn(progress);
    const missing = node.deps.flatMap((id) => {
      const d = getNode(id);
      return d && !["LANDED", "SOLID"].includes(status(id)) ? [d] : [];
    });
    return (
      <div className="card max-w-lg mx-auto text-center space-y-4">
        <p className="text-4xl">🔒</p>
        <h1 className="text-2xl font-bold">{node.title}</h1>
        <p className="text-[var(--muted)]">This builds on ideas you haven&rsquo;t landed yet:</p>
        <div className="flex flex-col gap-2">
          {missing.map((d) => (
            <Link key={d.id} href={`/learn/${d.id}`} className="btn-ghost">
              {d.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  await markOpened(user.id, node.id);
  const status = statusIn(await loadProgress(user.id))(node.id);
  const i = allNodes.findIndex((n) => n.id === node.id);
  const next = allNodes.slice(i + 1).find((n) => n.deps.includes(node.id)) ?? allNodes[i + 1] ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
      <Lesson
        nodeId={node.id}
        title={node.title}
        steps={publicSteps(node)}
        initialStatus={status}
        nextNode={next ? { id: next.id, title: next.title } : null}
        tutor={tutorEnabled()}
      />
      <aside className="space-y-4 text-sm">
        <Link href={`/practice/${node.id}`} className="card p-4! block hover:border-[var(--accent)]">
          <p className="font-semibold">🎯 Practice</p>
          <p className="text-[var(--muted)]">Endless fresh questions on this, mixed with what it builds on.</p>
        </Link>
        <div className="card p-4!">
          <p className="font-semibold">New words</p>
          <dl className="mt-2 space-y-2">
            {node.glossary.map((g) => (
              <div key={g.term}>
                <dt className="font-medium">{g.term}</dt>
                <dd className="text-[var(--muted)]">
                  <MathText text={g.meaning} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {node.deps.length > 0 && (
          <div className="card p-4!">
            <p className="font-semibold">Builds on</p>
            <ul className="mt-2 space-y-1">
              {node.deps.map((d) => (
                <li key={d}>
                  <Link href={`/learn/${d}`} className="underline">
                    {getNode(d)?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
