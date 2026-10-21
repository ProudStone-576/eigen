import { requireOrg } from "@/lib/auth/context";
import { opensEverySection } from "@/lib/auth/permissions";
import { allNodes } from "@/lib/content";
import { dueNodes, loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import { strugglingNodes } from "@/lib/learning/practice";
import { prisma } from "@/lib/db";
import { assignmentProgress } from "@/lib/learning/summary";
import { SyllabusView } from "@/components/textbook/SyllabusView";

export const metadata = { title: "Syllabus" };

export default async function SyllabusPage() {
  const ctx = await requireOrg();
  const user = ctx.user;
  const openAll = opensEverySection(ctx.role, user.platformAdmin);
  const progress = await loadProgress(user.id);
  const status = statusIn(progress);
  const [struggling, assignments, exams] = await Promise.all([
    strugglingNodes(user.id, openAll),
    prisma.assignment.findMany({ where: { archived: false, classroomId: { in: ctx.learnsIn } }, orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }] }),
    prisma.examRecord.findMany({ where: { userId: user.id }, select: { scope: true, createdAt: true, score: true, total: true } }),
  ]);
  const rows = [...progress.entries()].map(([nodeId, p]) => ({ nodeId, status: p.status, misconceptionId: p.misconceptionId }));
  return (
    <SyllabusView
      name={user.name}
      streakDays={user.streakDays}
      statusOf={Object.fromEntries(allNodes.map((n) => [n.id, status(n.id)]))}
      unlockedIds={allNodes.filter((n) => unlocked(n.id, progress, openAll)).map((n) => n.id)}
      due={dueNodes(progress)}
      assigned={assignments.map((a) => ({ a, pr: assignmentProgress(a, rows, exams) })).filter(({ pr }) => !pr.complete)}
      struggling={struggling}
      openAll={openAll}
    />
  );
}
