import Link from "next/link";
import { requireOrg } from "@/lib/auth/context";
import { notFound } from "next/navigation";
import { getNode } from "@/lib/content";
import { loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import { PRACTICE_STREAK } from "@/lib/learning/rules";
import { tutorEnabled } from "@/lib/tutor";
import { PracticeSession } from "./PracticeSession";

export async function generateMetadata({ params }: { params: Promise<{ nodeId: string }> }) {
  const node = getNode((await params).nodeId);
  return { title: node ? `Practice: ${node.title}` : "Practice" };
}

export default async function PracticePage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const node = getNode(nodeId);
  if (!node) notFound();
  const user = (await requireOrg()).user;
  const progress = await loadProgress(user.id);
  if (!unlocked(node.id, progress)) {
    return (
      <div className="card max-w-lg mx-auto text-center space-y-4">
        <p>Land the concepts this builds on first.</p>
        <Link href="/learn" className="btn">Back to the map</Link>
      </div>
    );
  }
  const status = statusIn(progress)(node.id);
  const held = progress.get(node.id);
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-[var(--accent)]">Practice until it clicks</p>
        <h1 className="text-3xl font-extrabold">{node.title}</h1>
        <p className="text-[var(--muted)] mt-1">
          Fresh questions every time, mixed with the ideas this one is built on. Get {PRACTICE_STREAK} in a row on {node.title.toLowerCase()} and
          it&rsquo;s yours.
        </p>
        {status === "MISCONCEPTION" && held?.misconceptionId && (
          <p className="feedback feedback-warn mt-3 text-sm">
            Working on: {node.misconceptions[held.misconceptionId] ?? "a common mix-up"} The questions are chosen to catch exactly that.
          </p>
        )}
      </div>
      <PracticeSession nodeId={node.id} title={node.title} alreadySolid={status === "SOLID"} tutor={tutorEnabled()} need={PRACTICE_STREAK} />
      <p className="text-sm text-[var(--muted)]">
        Stuck on the idea itself? <Link href={`/learn/${node.id}`} className="underline">Re-run the lesson</Link>.
      </p>
    </div>
  );
}
