import "server-only";
import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";
import { getNode, misconceptionsOf, publicItem, type PublicItem } from "@/lib/content";
import { generate, parseGeneratedId, templatesFor, type Level } from "@/lib/content/templates";
import { customItemsFor } from "@/lib/content/custom";
import type { ConceptNode, Item } from "@/lib/content/types";
import { loadProgress, statusIn, unlocked } from "./progress";

/**
 * "Practice until it clicks": an endless mix of fresh variants of the struggling
 * concept, interleaved with the concepts it rests on. Every third question comes
 * from a prerequisite, so the session rebuilds the foundations as well as the node.
 */

export type PracticeQuestion = { nodeId: string; title: string; isTarget: boolean; item: PublicItem; level?: Level };

/** Prerequisites up to two levels down, nearest first. */
function ancestors(node: ConceptNode): ConceptNode[] {
  const out: ConceptNode[] = [];
  const seen = new Set<string>([node.id]);
  let frontier = node.deps;
  for (let depth = 0; depth < 2 && frontier.length; depth++) {
    const next: string[] = [];
    for (const id of frontier) {
      if (seen.has(id)) continue;
      seen.add(id);
      const n = getNode(id);
      if (n) {
        out.push(n);
        next.push(...n.deps);
      }
    }
    frontier = next;
  }
  return out;
}

/** Fixed lesson items a student can safely re-see in practice (not the one-shot predict/resolve). */
function staticPool(node: ConceptNode): Item[] {
  return [
    ...node.steps.flatMap((s) => (s.type === "produce" ? s.items : s.type === "check" ? [s.item] : [])),
    ...node.review,
  ];
}

/**
 * Adaptive difficulty from the student's recent practice on this concept:
 * two right in a row at a level moves up, two wrong in a row moves down.
 * Also returns the last template used, so the next question is a different kind.
 */
async function practiceState(userId: string, nodeId: string): Promise<{ level: Level; lastTemplate: number | null }> {
  const recent = await prisma.attempt.findMany({
    where: { userId, nodeId, step: "practice" },
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { itemId: true, correct: true },
  });
  const parsed = recent.map((a) => ({ ...a, gen: parseGeneratedId(a.itemId) }));
  const lastGen = parsed.find((a) => a.gen)?.gen ?? null;
  let level: Level = lastGen?.level ?? 1;
  if (parsed.length === 2 && parsed.every((a) => a.correct)) level = Math.min(3, level + 1) as Level;
  if (parsed.length === 2 && parsed.every((a) => !a.correct)) level = Math.max(1, level - 1) as Level;
  return { level, lastTemplate: lastGen?.template ?? null };
}

const freshSeed = () => randomInt(1, 2 ** 31 - 1);

/** A template different from the last one, so practice comes at the idea from a new angle. */
function nextTemplate(nodeId: string, last: number | null): number {
  const n = templatesFor(nodeId).length;
  if (n <= 1) return 0;
  let t = randomInt(n);
  if (t === last) t = (t + 1 + randomInt(n - 1)) % n;
  return t;
}

async function pickFor(node: ConceptNode, misconception: string | null, level: Level, lastTemplate: number | null, orgId: string | null): Promise<Item> {
  // Teacher-written questions take a share of practice when they exist.
  const custom = await customItemsFor(node.id, "p", orgId);
  if (misconception) {
    const targetedCustom = custom.filter((i) => misconceptionsOf(i).includes(misconception));
    if (targetedCustom.length && randomInt(2) === 0) return targetedCustom[randomInt(targetedCustom.length)];
    // Aim straight at the mix-up: a variant whose traps catch exactly this misconception.
    for (let tries = 0; tries < 30; tries++) {
      const g = generate(node.id, freshSeed(), { template: nextTemplate(node.id, null), level });
      if (g && misconceptionsOf(g).includes(misconception)) return g;
    }
    const targeted = staticPool(node).filter((i) => misconceptionsOf(i).includes(misconception));
    if (targeted.length) return targeted[randomInt(targeted.length)];
  }
  if (custom.length && randomInt(3) === 0) return custom[randomInt(custom.length)];
  return generate(node.id, freshSeed(), { template: nextTemplate(node.id, lastTemplate), level }) ?? staticPool(node)[randomInt(staticPool(node).length)];
}

export async function nextPracticeQuestion(userId: string, nodeId: string, index: number, orgId: string | null): Promise<PracticeQuestion | { error: string }> {
  const node = getNode(nodeId);
  if (!node) return { error: "Unknown concept." };
  const map = await loadProgress(userId);
  if (!unlocked(node.id, map)) return { error: "Finish the concepts this one depends on first." };

  const prereqs = ancestors(node);
  const mixIn = prereqs.length > 0 && index % 3 === 2;
  if (mixIn) {
    // Prefer foundations that aren't solid yet: that's usually where the trouble starts.
    const status = statusIn(map);
    const weak = prereqs.filter((p) => status(p.id) !== "SOLID");
    const pool = weak.length ? weak : prereqs;
    const source = pool[randomInt(pool.length)];
    const p = map.get(source.id);
    const st = await practiceState(userId, source.id);
    return {
      nodeId: source.id,
      title: source.title,
      isTarget: false,
      level: st.level,
      item: publicItem(await pickFor(source, p?.status === "MISCONCEPTION" ? p.misconceptionId : null, st.level, st.lastTemplate, orgId)),
    };
  }
  const held = map.get(node.id);
  const st = await practiceState(userId, node.id);
  return {
    nodeId: node.id,
    title: node.title,
    isTarget: true,
    level: st.level,
    item: publicItem(await pickFor(node, held?.status === "MISCONCEPTION" ? held.misconceptionId : null, st.level, st.lastTemplate, orgId)),
  };
}

/**
 * Concepts a student is struggling with: a live misconception, or two or more
 * wrong answers in the last two weeks on a concept that isn't solid.
 */
export async function strugglingNodes(userId: string): Promise<{ id: string; title: string; reason: string }[]> {
  const map = await loadProgress(userId);
  const since = new Date(Date.now() - 14 * 86_400_000);
  const misses = await prisma.attempt.groupBy({
    by: ["nodeId"],
    where: { userId, correct: false, createdAt: { gte: since } },
    _count: { _all: true },
  });
  const missCount = new Map(misses.map((m) => [m.nodeId, m._count._all]));
  const out: { id: string; title: string; reason: string }[] = [];
  for (const [id, p] of map) {
    const node = getNode(id);
    if (!node || !unlocked(id, map)) continue;
    if (p.status === "MISCONCEPTION") {
      out.push({ id, title: node.title, reason: node.misconceptions[p.misconceptionId ?? ""] ?? "A mix-up to untangle." });
    } else if (p.status !== "SOLID" && (missCount.get(id) ?? 0) >= 2) {
      out.push({ id, title: node.title, reason: `${missCount.get(id)} misses recently.` });
    }
  }
  return out;
}
