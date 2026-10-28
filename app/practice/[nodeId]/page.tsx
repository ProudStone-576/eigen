import Link from "next/link";
import { requireOrg } from "@/lib/auth/context";
import { opensEverySection } from "@/lib/auth/permissions";
import { notFound } from "next/navigation";
import { getNode } from "@/lib/content";
import { loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import { PRACTICE_STREAK } from "@/lib/learning/rules";
import { tutorEnabled } from "@/lib/tutor";
import { PracticeSession } from "./PracticeSession";
import { ChapterContents } from "@/components/course/ChapterContents";
import { LessonFrame } from "@/components/course/LessonFrame";
import type { CellState } from "@/components/course/Mastery";
import { locate } from "@/lib/content/numbering";

export async function generateMetadata({ params }: { params: Promise<{ nodeId: string }> }) {
  const node = getNode((await params).nodeId);
  return { title: node ? `Practice: ${node.title}` : "Practice" };
}

export default async function PracticePage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = getNode(nodeId);
  if (!node) notFound();
  const ctx = await requireOrg();
  const user = ctx.user;
  const progress = await loadProgress(user.id);
  if (!unlocked(node.id, progress, opensEverySection(ctx.role, user.platformAdmin))) {
    return (
      <div className="card max-w-lg mx-auto text-center space-y-4">
        <p>Land the concepts this builds on first.</p>
        <Link href="/learn" className="btn">Back to the syllabus</Link>
      </div>
    );
  }
  const status = statusIn(progress);
  const now = status(node.id);
  const held = progress.get(node.id);
  const at = locate(node.id)!;
  const openAll = opensEverySection(ctx.role, user.platformAdmin);
  const state = (id: string): CellState => (unlocked(id, progress, openAll) ? status(id) : "LOCKED");
  return (
    <LessonFrame panel={<ChapterContents unit={at.unit} node={node} state={state} counts={`Practice: fresh questions, mixed with the sections ${node.title.toLowerCase()} builds on.`} />}>
      <div className="space-y-6">
        <div>
          <p className="tb-label">
            Practice · {at.number}
          </p>
          <h1 className="mt-2 font-serif text-[2.4rem] leading-tight font-semibold">{node.title}</h1>
          <p className="mt-2 font-serif text-lg text-[var(--muted)]">
            New questions every time, mixed with the ideas this one is built on. Get {PRACTICE_STREAK} in a row on {node.title.toLowerCase()} and it is mastered.
          </p>
          {now === "MISCONCEPTION" && held?.misconceptionId && (
            <p className="feedback feedback-warn mt-3 text-sm">
              Working on: {node.misconceptions[held.misconceptionId] ?? "a common mix-up"} The questions are chosen to catch exactly that.
            </p>
          )}
        </div>
        <PracticeSession nodeId={node.id} title={node.title} alreadySolid={now === "SOLID"} tutor={tutorEnabled()} need={PRACTICE_STREAK} />
        <div className="border-t border-[var(--border)] pt-4 text-sm">
          <p className="tb-label">Related</p>
          <Link href={`/learn/${node.id}`} className="mt-1 inline-block hover:text-[var(--accent)]">
            Read {at.number} {node.title} again
          </Link>
        </div>
      </div>
    </LessonFrame>
  );
}
