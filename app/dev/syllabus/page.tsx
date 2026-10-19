import { notFound } from "next/navigation";
import { allNodes, getNode } from "@/lib/content";
import { SyllabusView } from "@/components/textbook/SyllabusView";
import type { Status } from "@/lib/learning/rules";

/** Development-only preview of the syllabus with sample progress. 404s in production. */
export default function SyllabusPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  const sample: Record<string, Status> = { vector: "SOLID", "vector-add": "SOLID", scalar: "MISCONCEPTION", "linear-combination": "LANDED", basis: "EDGE", probability: "LANDED", "mean-median-mode": "SOLID" };
  const statusOf = Object.fromEntries(allNodes.map((n) => [n.id, sample[n.id] ?? "UNKNOWN"])) as Record<string, Status>;
  const done = (id: string) => ["LANDED", "SOLID"].includes(statusOf[id]);
  const unlockedIds = allNodes.filter((n) => n.deps.every(done)).map((n) => n.id);
  return (
    <SyllabusView
      name="Sample Student"
      streakDays={4}
      statusOf={statusOf}
      unlockedIds={unlockedIds}
      due={["vector", "mean-median-mode"]}
      assigned={[
        {
          a: { id: "x", title: "Week 3 set", note: "Finish before Friday's class test.", dueAt: new Date(Date.now() + 3 * 86_400_000), unitId: "la-1" },
          pr: { conceptsDone: 2, concepts: 5, exam: null, complete: false, fraction: 2 / 6, next: "scalar", overdue: false },
        },
      ]}
      struggling={[{ id: "scalar", title: getNode("scalar")!.title, reason: "a negative scalar flips, it doesn't shrink" }]}
    />
  );
}
