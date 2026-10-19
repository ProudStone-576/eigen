import "server-only";
import { prisma } from "@/lib/db";
import { findItem, getNode, type ItemContext } from "./index";
import type { ConceptNode } from "./types";
import { toItem } from "./customSchema";
import type { Item } from "./types";

/**
 * Teacher-written questions, stored in the database. Their ids carry where they
 * were served from, so grading applies the right rule:
 *   cust~<id>~p  -> practice      cust~<id>~r  -> review
 */

export type CustomUse = "p" | "r";
export const customId = (id: string, use: CustomUse) => `cust~${id}~${use}`;

type Row = { id: string; nodeId: string; data: unknown; inPractice: boolean; inReview: boolean };

function rowToItem(row: Row, use: CustomUse): Item | null {
  const node = getNode(row.nodeId);
  if (!node) return null;
  const r = toItem(node, row.data, customId(row.id, use));
  return "item" in r ? r.item : null;
}

/** Active custom items for a concept, ready to serve as practice or review questions. */
export async function customItemsFor(nodeId: string, use: CustomUse): Promise<Item[]> {
  const rows = await prisma.customItem.findMany({
    where: { nodeId, archived: false, ...(use === "p" ? { inPractice: true } : { inReview: true }) },
    orderBy: { createdAt: "asc" },
  });
  return rows.flatMap((row) => rowToItem(row, use) ?? []);
}

/** Any item id (built-in, generated or custom) to the item and the rule that grades it. */
export async function resolveItem(node: ConceptNode, itemId: string): Promise<{ item: Item; context: ItemContext; misconception?: string } | null> {
  return itemId.startsWith("cust~") ? findCustomItem(node.id, itemId) : findItem(node, itemId);
}

/** Rebuild a custom item from a served id; null if it doesn't belong to this concept or that use. */
export async function findCustomItem(nodeId: string, itemId: string): Promise<{ item: Item; context: "practice" | "review" } | null> {
  const [tag, id, use] = itemId.split("~");
  if (tag !== "cust" || !id || (use !== "p" && use !== "r")) return null;
  const row = await prisma.customItem.findUnique({ where: { id } });
  if (!row || row.archived || row.nodeId !== nodeId) return null;
  if ((use === "p" && !row.inPractice) || (use === "r" && !row.inReview)) return null;
  const item = rowToItem(row, use);
  return item ? { item, context: use === "p" ? "practice" : "review" } : null;
}
