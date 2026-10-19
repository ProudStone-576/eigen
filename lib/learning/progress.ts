import "server-only";
import type { NodeProgress, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { allNodes, findItem, getNode, targets } from "@/lib/content";
import { grade, type Grade, type Response } from "@/lib/check";
import { apply, FRESH, isDue, isUnlocked, localDay, nextStreak, PRACTICE_STREAK, XP, type LearningEvent, type Progress, type Status } from "./rules";

export type ProgressMap = Map<string, Progress>;

function toProgress(row: NodeProgress | undefined): Progress {
  if (!row) return FRESH;
  return {
    status: row.status,
    misconceptionId: row.misconceptionId,
    intervalDays: row.intervalDays,
    reviewStreak: row.reviewStreak,
    dueAt: row.dueAt,
  };
}

export async function loadProgress(userId: string): Promise<ProgressMap> {
  const rows = await prisma.nodeProgress.findMany({ where: { userId } });
  const byNode = new Map(rows.map((r) => [r.nodeId, r]));
  return new Map(allNodes.map((n) => [n.id, toProgress(byNode.get(n.id))]));
}

export const statusIn = (map: ProgressMap) => (id: string): Status => map.get(id)?.status ?? "UNKNOWN";

export function unlocked(nodeId: string, map: ProgressMap): boolean {
  const node = getNode(nodeId);
  return !!node && isUnlocked(node.deps, statusIn(map));
}

export function dueNodes(map: ProgressMap, now = new Date()): string[] {
  return allNodes.filter((n) => isDue(map.get(n.id) ?? FRESH, now)).map((n) => n.id);
}

async function save(tx: Prisma.TransactionClient, userId: string, nodeId: string, p: Progress) {
  const data = {
    status: p.status,
    misconceptionId: p.misconceptionId,
    intervalDays: p.intervalDays,
    reviewStreak: p.reviewStreak,
    dueAt: p.dueAt,
  };
  await tx.nodeProgress.upsert({ where: { userId_nodeId: { userId, nodeId } }, create: { userId, nodeId, ...data }, update: data });
}

export async function markOpened(userId: string, nodeId: string): Promise<void> {
  const row = await prisma.nodeProgress.findUnique({ where: { userId_nodeId: { userId, nodeId } } });
  const next = apply(toProgress(row ?? undefined), { type: "opened" }, new Date());
  if (!row || row.status !== next.status) await save(prisma, userId, nodeId, next);
}

export type GradeResult = Grade & {
  status_after: Status;
  xpGained: number;
  /** Practice only: correct answers in a row on this concept, and whether this answer mastered it. */
  practiceStreak?: number;
  mastered?: boolean;
};

function safeTimeZone(tz: string | undefined): string {
  try {
    if (tz) {
      new Intl.DateTimeFormat("en-CA", { timeZone: tz });
      return tz;
    }
  } catch {
    // fall through
  }
  return "America/Vancouver";
}

/**
 * Grade one answer and apply its consequence. The only write path for progress.
 * `mode: "review"` grades a review-pool item against the spaced-review rule.
 */
export async function submitAnswer(args: {
  userId: string;
  nodeId: string;
  itemId: string;
  response: Response;
  timeZone?: string;
}): Promise<GradeResult | { error: string }> {
  const node = getNode(args.nodeId);
  if (!node) return { error: "Unknown concept." };
  const found = findItem(node, args.itemId);
  if (!found) return { error: "Unknown question." };

  const map = await loadProgress(args.userId);
  if (!isUnlocked(node.deps, statusIn(map))) return { error: "Finish the concepts this one depends on first." };
  const before = map.get(node.id) ?? FRESH;
  if (found.context === "review" && before.status !== "SOLID") return { error: "Reviews are for solid concepts." };

  const result = grade(found.item, args.response);
  if (result.status === "invalid" || result.status === "ungraded") {
    return { ...result, status_after: before.status, xpGained: 0 };
  }
  const correct = result.status === "correct";
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const firstCorrect =
      correct &&
      !(await tx.attempt.findFirst({ where: { userId: args.userId, itemId: args.itemId, correct: true }, select: { id: true } }));

    await tx.attempt.create({
      data: {
        userId: args.userId,
        nodeId: node.id,
        itemId: args.itemId,
        step: found.context,
        correct,
        misconceptionId: result.misconception,
        response: args.response as unknown as Prisma.InputJsonValue,
      },
    });

    const events: LearningEvent[] = [];
    // Re-check in different clothes: a correct answer to another question built
    // around the misconception the student holds is what dislodges it.
    if (correct && before.status === "MISCONCEPTION" && before.misconceptionId && targets(found.item, before.misconceptionId)) {
      events.push({ type: "resolved", misconception: before.misconceptionId, correct: true });
    }
    let event: LearningEvent | null = null;
    switch (found.context) {
      case "check":
        event = { type: "check", correct, misconception: result.misconception };
        break;
      case "predict":
        // A wrong prediction that matches a known misconception means it is held.
        if (!correct && result.misconception) event = { type: "check", correct: false, misconception: result.misconception };
        break;
      case "resolve":
        event = { type: "resolved", misconception: found.misconception!, correct };
        break;
      case "produce": {
        // Solid only when every production item of the node has been produced correctly.
        const produceIds = node.steps.flatMap((s) => (s.type === "produce" ? s.items.map((i) => i.id) : []));
        const done = await tx.attempt.findMany({
          where: { userId: args.userId, itemId: { in: produceIds }, correct: true },
          select: { itemId: true },
          distinct: ["itemId"],
        });
        event = { type: "produce", correct: produceIds.every((id) => done.some((d) => d.itemId === id)) };
        break;
      }
      case "review":
        event = { type: "review", correct };
        break;
      case "practice": {
        // A wrong answer that springs a trap reveals a held misconception (never demotes a solid concept).
        if (!correct && result.misconception && before.status !== "SOLID") {
          event = { type: "check", correct: false, misconception: result.misconception };
        }
        break;
      }
    }

    if (event) events.push(event);
    let practiceStreak: number | undefined;
    let mastered = false;
    if (found.context === "practice") {
      const recent = await tx.attempt.findMany({
        where: { userId: args.userId, nodeId: node.id, step: "practice" },
        orderBy: { createdAt: "desc" },
        take: PRACTICE_STREAK,
        select: { correct: true },
      });
      practiceStreak = 0;
      for (const a of recent) {
        if (!a.correct) break;
        practiceStreak++;
      }
      if (practiceStreak >= PRACTICE_STREAK) {
        const preview = events.reduce((p, e) => apply(p, e, now), before);
        if (preview.status !== "SOLID" && preview.status !== "MISCONCEPTION") {
          events.push({ type: "practice-mastered" });
          mastered = true;
        }
      }
    }
    const after = events.reduce((p, e) => apply(p, e, now), before);
    if (after !== before) await save(tx, args.userId, node.id, after);

    // XP: first correct answer per item, every correct review (reviews are rate-limited by due dates),
    // a little per correct practice answer, and a bonus for mastering through practice.
    const xpGained = !correct
      ? 0
      : found.context === "practice"
        ? XP.practice + (mastered ? XP.mastered : 0)
        : found.context === "review"
          ? XP.review
          : firstCorrect
            ? found.context === "produce"
              ? XP.produce
              : found.context === "resolve"
                ? XP.resolved
                : XP.check
            : 0;

    const user = await tx.user.findUniqueOrThrow({ where: { id: args.userId }, select: { lastActiveOn: true, streakDays: true } });
    const today = localDay(now, safeTimeZone(args.timeZone));
    await tx.user.update({
      where: { id: args.userId },
      data: { xp: { increment: xpGained }, lastActiveOn: today, streakDays: nextStreak(user.lastActiveOn, today, user.streakDays) },
    });

    return { ...result, status_after: after.status, xpGained, practiceStreak, mastered };
  });
}
