import Link from "next/link";
import { requireOrg } from "@/lib/auth/context";
import { opensEverySection } from "@/lib/auth/permissions";
import { notFound } from "next/navigation";
import { MathText } from "@/components/MathText";
import { Section, STATUS_WORD } from "@/components/textbook/Section";
import { FigurePlate } from "@/components/intro/FigurePlate";
import { allNodes, getNode, publicSteps } from "@/lib/content";
import { introCaption, introFor } from "@/lib/content/intro";
import { chapterNumber, locate, sectionNumber } from "@/lib/content/numbering";
import { loadProgress, markOpened, statusIn, unlocked } from "@/lib/learning/progress";
import { tutorEnabled } from "@/lib/tutor";

export async function generateMetadata({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = getNode(nodeId);
  return { title: node ? `${sectionNumber(nodeId)} ${node.title}` : "Section" };
}

export default async function LessonPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = getNode(nodeId);
  const at = node && locate(node.id);
  if (!node || !at) notFound();
  const ctx = await requireOrg();
  const user = ctx.user;
  const openAll = opensEverySection(ctx.role, user.platformAdmin);
  const progress = await loadProgress(user.id);
  const status = statusIn(progress);
  const previewing = openAll && !unlocked(node.id, progress);

  const crumbs = (
    <p className="tb-label">
      Part {at.part.roman} · {at.part.track} <span className="mx-1">/</span> Chapter {at.chapter} · {at.unit.title}
    </p>
  );

  if (!unlocked(node.id, progress, openAll)) {
    const missing = node.deps.flatMap((id) => {
      const d = getNode(id);
      return d && !["LANDED", "SOLID"].includes(status(id)) ? [d] : [];
    });
    return (
      <div className="mx-auto max-w-2xl py-6">
        {crumbs}
        <h1 className="mt-3 font-serif text-4xl font-semibold">
          {at.number} {node.title}
        </h1>
        <p className="mt-6 tb">This section assumes the following. Learn them first:</p>
        <ul className="mt-3 space-y-1 tb">
          {missing.map((d) => (
            <li key={d.id}>
              <Link href={`/learn/${d.id}`} className="text-[var(--accent)] hover:underline underline-offset-4">
                {sectionNumber(d.id)} {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  await markOpened(user.id, node.id);
  const now = statusIn(await loadProgress(user.id))(node.id);
  const i = allNodes.findIndex((n) => n.id === node.id);
  const next = allNodes.slice(i + 1).find((n) => n.deps.includes(node.id)) ?? allNodes[i + 1] ?? null;
  const prev = i > 0 ? allNodes[i - 1] : null;
  const counts = {
    examples: node.steps.filter((s) => s.type === "example").length,
    exercises: node.steps.reduce((k, s) => k + (s.type === "exercises" ? s.items.length : 0), 0),
    checks: node.steps.filter((s) => s.type === "check" || s.type === "predict").length,
  };
  const spec = introFor(node);

  return (
    <div className="mx-auto grid max-w-6xl gap-x-14 lg:grid-cols-[minmax(0,44rem)_15rem]">
      <div>
        {crumbs}
        <h1 className="mt-3 font-serif text-[2.6rem] leading-tight font-semibold">
          <span className="text-[var(--muted)]">{at.number}</span> {node.title}
        </h1>
        <MathText as="p" text={node.summary} className="mt-4 block font-serif text-xl leading-relaxed text-[var(--muted)]" />
        {previewing && <p className="mt-4 text-sm text-[var(--muted)]">Admin view: opened before its prerequisites. Students see this section once they have learned {node.deps.filter((d) => !["LANDED", "SOLID"].includes(status(d))).map((d) => sectionNumber(d)).join(", ")}.</p>}
        <Section
          nodeId={node.id}
          number={at.number}
          title={node.title}
          steps={publicSteps(node)}
          initialStatus={now}
          nextNode={next ? { id: next.id, title: next.title, number: sectionNumber(next.id) } : null}
          tutor={tutorEnabled()}
          figure={<FigurePlate spec={spec} number={`${at.number}.1`} caption={introCaption(spec)} />}
        />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-7 font-sans text-sm">
          <div>
            <p className="tb-label">Status</p>
            <p className="mt-1 font-medium">{STATUS_WORD[now]}</p>
          </div>
          <div>
            <p className="tb-label">In this section</p>
            <p className="mt-1 text-[var(--muted)]">
              {[counts.examples && `${counts.examples} worked example${counts.examples === 1 ? "" : "s"}`, counts.checks && `${counts.checks} checks`, counts.exercises && `${counts.exercises} exercises`]
                .filter(Boolean)
                .join(" · ") || "Core reading"}
            </p>
          </div>
          {node.glossary.length > 0 && (
            <div>
              <p className="tb-label">Terms</p>
              <dl className="mt-2 space-y-2.5">
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
          )}
          {node.deps.length > 0 && (
            <div>
              <p className="tb-label">Assumes</p>
              <ul className="mt-2 space-y-1">
                {node.deps.map((d) => (
                  <li key={d}>
                    <Link href={`/learn/${d}`} className="hover:text-[var(--accent)]">
                      {sectionNumber(d)} {getNode(d)?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-1">
            <p className="tb-label">Chapter {chapterNumber(at.unit)}</p>
            {at.unit.nodes.map((n) => (
              <Link key={n.id} href={`/learn/${n.id}`} className={`block ${n.id === node.id ? "font-medium text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"}`}>
                {sectionNumber(n.id)} {n.title}
              </Link>
            ))}
          </div>
          {prev && (
            <Link href={`/learn/${prev.id}`} className="block text-[var(--muted)] hover:text-[var(--fg)]">
              ← {sectionNumber(prev.id)} {prev.title}
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
