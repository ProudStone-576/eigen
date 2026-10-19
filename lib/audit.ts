import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { clientIp } from "@/lib/security/rateLimit";
import type { AuditAction } from "./auditLabels";

/**
 * Record a security-relevant action. Never throws: a failed audit write is
 * logged, and the action it describes still completes.
 */
export async function audit(e: {
  orgId?: string | null;
  actorId?: string | null;
  action: AuditAction;
  targetType?: "user" | "class" | "invitation" | "assignment" | "org" | "question";
  targetId?: string;
  meta?: Record<string, string | number | boolean | null>;
}): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        orgId: e.orgId ?? null,
        actorId: e.actorId ?? null,
        action: e.action,
        targetType: e.targetType ?? null,
        targetId: e.targetId ?? null,
        meta: (e.meta ?? undefined) as Prisma.InputJsonValue | undefined,
        ip: await clientIp(),
      },
    });
  } catch (err) {
    console.error("audit write failed", e.action, err);
  }
}
