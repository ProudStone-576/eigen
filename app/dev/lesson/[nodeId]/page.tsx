import Link from "next/link";
import { notFound } from "next/navigation";
import { MathText } from "@/components/MathText";
import { Section } from "@/components/textbook/Section";
import { FigurePlate } from "@/components/intro/FigurePlate";
import { allNodes, getNode, publicSteps } from "@/lib/content";
import { introCaption, introFor } from "@/lib/content/intro";
import { locate, sectionNumber } from "@/lib/content/numbering";
import { ChapterContents } from "@/components/course/ChapterContents";
import { LessonFrame } from "@/components/course/LessonFrame";
import type { CellState } from "@/components/course/Mastery";

const SAMPLE: CellState[] = ["SOLID", "LANDED", "EDGE", "MISCONCEPTION", "UNKNOWN", "LOCKED"];

/** Development-only preview of a section as a student sees it (no account; answers won't save). 404s in production. */
export default async function LessonPreview({ params }: { params: Promise<{ nodeId: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const node = getNode((await params).nodeId);
  const at = node && locate(node.id);
  if (!node || !at) notFound();
  const i = allNodes.indexOf(node);
  const next = allNodes[i + 1] ?? null;
  const spec = introFor(node);
  return (
    <LessonFrame panel={<ChapterContents unit={at.unit} node={node} state={(id) => SAMPLE[at.unit.nodes.findIndex((n) => n.id === id) % SAMPLE.length]} counts="Sample margin note" />}>
      <p className="tb-label">
        Part {at.part.roman} · {at.part.track} / Chapter {at.chapter} · {at.unit.title} · <span className="text-[var(--mis)]">dev preview</span>
      </p>
      <h1 className="mt-3 font-serif text-[2.6rem] leading-tight font-semibold">
        <span className="text-[var(--muted)]">{at.number}</span> {node.title}
      </h1>
      <MathText as="p" text={node.summary} className="mt-4 block font-serif text-xl leading-relaxed text-[var(--muted)]" />
      <Section
        nodeId={node.id}
        number={at.number}
        title={node.title}
        steps={publicSteps(node)}
        initialStatus="UNKNOWN"
        nextNode={next ? { id: next.id, title: next.title, number: sectionNumber(next.id) } : null}
        tutor={false}
        figure={<FigurePlate spec={spec} number={`${at.number}.1`} caption={introCaption(spec)} />}
      />
      <p className="py-8 text-sm">
        {i > 0 && <Link href={`/dev/lesson/${allNodes[i - 1].id}`}>← preview previous</Link>}{" "}
        {next && <Link href={`/dev/lesson/${next.id}`}>preview next →</Link>}
      </p>
    </LessonFrame>
  );
}
