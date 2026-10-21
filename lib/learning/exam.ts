import "server-only";
import { randomInt } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { course, getNode, publicItem, type PublicItem } from "@/lib/content";
import { generate, templatesFor, type Level } from "@/lib/content/templates";
import { resolveItem } from "@/lib/content/custom";
import { grade, type Grade, type Response } from "@/lib/check";
import { apply, FRESH, localDay, nextStreak, type Status } from "./rules";
import { loadProgress, statusIn, unlocked } from "./progress";

/**
 * Unit tests and mock exams: a fixed set of fresh questions, answered without
 * feedback and graded together. Results break down by concept and link back to
 * practice; a revealed misconception is recorded, and missing a solid concept
 * brings its review forward.
 */

export type ExamScope = { kind: "unit"; unitId: string } | { kind: "mock" };
export type ExamQuestion = { nodeId: string; title: string; item: PublicItem };
export type ExamPaper = { title: string; questions: ExamQuestion[] } | { error: string };

const EXAM_XP_PER_CORRECT = 2;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** `count` questions for a concept, each a different kind where possible, at medium/hard. */
function questionsFor(nodeId: string, count: number, hard: boolean): PublicItem[] {
  const kinds = shuffle(templatesFor(nodeId).map((_, i) => i));
  const out: PublicItem[] = [];
  for (let k = 0; k < count; k++) {
    const level: Level = hard || randomInt(3) === 0 ? 3 : 2;
    const item = generate(nodeId, randomInt(1, 2 ** 31 - 1), { template: kinds[k % kinds.length], level });
    if (item) out.push(publicItem(item));
  }
  return out;
}

export async function buildExam(userId: string, scope: ExamScope, openAll = false): Promise<ExamPaper> {
  const map = await loadProgress(userId);
  const status = statusIn(map);

  if (scope.kind === "unit") {
    const unit = course.units.find((u) => u.id === scope.unitId);
    if (!unit) return { error: "Unknown unit." };
    const open = unit.nodes.filter((n) => unlocked(n.id, map, openAll));
    if (open.length === 0) return { error: "Unlock at least one concept in this unit first." };
    const questions = shuffle(open.flatMap((n) => questionsFor(n.id, 2, false).map((item) => ({ nodeId: n.id, title: n.title, item }))));
    return { title: `Unit test: ${unit.title}`, questions: questions.slice(0, 16) };
  }

  // Mock exam: everything learned so far, weighted towards what's weakest.
  const learned = course.units.flatMap((u) => u.nodes).filter((n) => unlocked(n.id, map, openAll) && status(n.id) !== "UNKNOWN");
  if (learned.length < 3) return { error: "Learn at least three concepts before a mock exam." };
  const weight = (s: Status) => (s === "MISCONCEPTION" ? 3 : s === "EDGE" ? 3 : s === "LANDED" ? 2 : 1);
  const bag = learned.flatMap((n) => Array(weight(status(n.id))).fill(n));
  const picked = new Map<string, number>();
  for (let i = 0; i < 20 && bag.length; i++) {
    const n = bag[randomInt(bag.length)];
    picked.set(n.id, (picked.get(n.id) ?? 0) + 1);
  }
  const questions = shuffle(
    [...picked].flatMap(([id, count]) => {
      const n = getNode(id)!;
      return questionsFor(id, count, true).map((item) => ({ nodeId: id, title: n.title, item }));
    }),
  );
  return { title: "Mock exam", questions };
}

export type ExamAnswer = { nodeId: string; itemId: string; response: Response | null };
export type ExamResultItem = { nodeId: string; itemId: string; status: Grade["status"] | "blank"; grade: Grade | null; misconceptionText: string | null };
export type ExamResult = {
  score: number;
  total: number;
  xpGained: number;
  items: ExamResultItem[];
  byConcept: { nodeId: string; title: string; right: number; total: number; misconceptions: string[] }[];
};

export async function gradeExam(userId: string, answers: ExamAnswer[], timeZone: string | undefined): Promise<ExamResult | { error: string }> {
  if (answers.length === 0 || answers.length > 30) return { error: "That exam couldn't be read." };
  const items: ExamResultItem[] = [];
  for (const a of answers) {
    const node = getNode(a.nodeId);
    const found = node && a.itemId.startsWith("gen~") ? await resolveItem(node, a.itemId, null) : null;
    if (!node || !found) return { error: "That exam contains a question that no longer exists." };
    if (!a.response) {
      items.push({ nodeId: node.id, itemId: a.itemId, status: "blank", grade: null, misconceptionText: null });
      continue;
    }
    const g = grade(found.item, a.response);
    items.push({ nodeId: node.id, itemId: a.itemId, status: g.status, grade: g, misconceptionText: g.misconception ? (node.misconceptions[g.misconception] ?? null) : null });
  }

  const map = await loadProgress(userId);
  const now = new Date();
  const score = items.filter((i) => i.status === "correct").length;
  const xpGained = score * EXAM_XP_PER_CORRECT;

  await prisma.$transaction(async (tx) => {
    for (const [i, it] of items.entries()) {
      if (it.status !== "correct" && it.status !== "wrong") continue;
      await tx.attempt.create({
        data: {
          userId,
          nodeId: it.nodeId,
          itemId: it.itemId,
          step: "exam",
          correct: it.status === "correct",
          misconceptionId: it.grade?.misconception ?? null,
          response: answers[i].response as unknown as Prisma.InputJsonValue,
        },
      });
    }
    // Consequences, once per concept.
    for (const nodeId of new Set(items.map((i) => i.nodeId))) {
      const mine = items.filter((i) => i.nodeId === nodeId);
      const before = map.get(nodeId) ?? FRESH;
      const missed = mine.some((i) => i.status === "wrong");
      const mis = mine.find((i) => i.status === "wrong" && i.grade?.misconception)?.grade?.misconception ?? null;
      let after = before;
      if (mis && before.status !== "SOLID") after = apply(before, { type: "check", correct: false, misconception: mis }, now);
      else if (missed && before.status === "SOLID") after = { ...before, dueAt: now }; // memory slipped: review it now
      if (after !== before) {
        await tx.nodeProgress.upsert({
          where: { userId_nodeId: { userId, nodeId } },
          create: { userId, nodeId, status: after.status, misconceptionId: after.misconceptionId, intervalDays: after.intervalDays, reviewStreak: after.reviewStreak, dueAt: after.dueAt },
          update: { status: after.status, misconceptionId: after.misconceptionId, dueAt: after.dueAt },
        });
      }
    }
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId }, select: { lastActiveOn: true, streakDays: true } });
    let tz = "America/Vancouver";
    try {
      if (timeZone) {
        new Intl.DateTimeFormat("en-CA", { timeZone });
        tz = timeZone;
      }
    } catch {
      // keep default
    }
    const today = localDay(now, tz);
    await tx.user.update({ where: { id: userId }, data: { xp: { increment: xpGained }, lastActiveOn: today, streakDays: nextStreak(user.lastActiveOn, today, user.streakDays) } });
  });

  const byConcept = [...new Set(items.map((i) => i.nodeId))].map((nodeId) => {
    const mine = items.filter((i) => i.nodeId === nodeId);
    return {
      nodeId,
      title: getNode(nodeId)!.title,
      right: mine.filter((i) => i.status === "correct").length,
      total: mine.length,
      misconceptions: [...new Set(mine.flatMap((i) => (i.misconceptionText ? [i.misconceptionText] : [])))],
    };
  });
  byConcept.sort((a, b) => a.right / a.total - b.right / b.total);
  return { score, total: items.length, xpGained, items, byConcept };
}
