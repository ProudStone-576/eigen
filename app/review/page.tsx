import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getNode, publicItem } from "@/lib/content";
import { dueNodes, loadProgress } from "@/lib/learning/progress";
import { ReviewSession } from "./ReviewSession";

export const metadata = { title: "Review" };
const MAX_PER_SESSION = 10;

export default async function ReviewPage() {
  const user = await requireUser();
  const progress = await loadProgress(user.id);
  const due = dueNodes(progress).slice(0, MAX_PER_SESSION);

  if (due.length === 0) {
    return (
      <div className="card max-w-lg mx-auto text-center space-y-4">
        <p className="text-4xl">✨</p>
        <h1 className="text-2xl font-bold">Nothing due</h1>
        <p className="text-[var(--muted)]">Solid concepts come back on their own schedule. Learn something new meanwhile.</p>
        <Link href="/learn" className="btn">
          Back to the map
        </Link>
      </div>
    );
  }

  // Rotate through each node's review pool so repeat reviews aren't the same question.
  const cards = due.map((id) => {
    const node = getNode(id)!;
    const streak = progress.get(id)?.reviewStreak ?? 0;
    return { nodeId: id, title: node.title, item: publicItem(node.review[streak % node.review.length]) };
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold">Review</h1>
      <p className="text-[var(--muted)]">Answer from memory. A miss isn&rsquo;t a failure; it just brings the idea back tomorrow.</p>
      <ReviewSession cards={cards} />
    </div>
  );
}
