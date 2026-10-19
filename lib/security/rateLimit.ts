import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { POLICIES, retryIn, type Policy } from "./limits";

/** The caller's IP as reported by the platform's proxy (first X-Forwarded-For hop). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export type LimitResult = { ok: true } | { ok: false; retry: string };

/**
 * Count one hit against `key` under `policy`, atomically in the database (one
 * statement, so concurrent serverless instances share the counter). Fails open:
 * if the database is unreachable the request is allowed and the error logged.
 */
export async function rateLimit(name: keyof typeof POLICIES, subject: string): Promise<LimitResult> {
  const policy: Policy = POLICIES[name];
  const key = `${name}:${subject}`;
  const interval = `${policy.windowSec} seconds`;
  try {
    const [row] = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, timezone('UTC', now()) + ${interval}::interval)
      ON CONFLICT ("key") DO UPDATE SET
        "count"   = CASE WHEN "RateLimit"."resetAt" <= timezone('UTC', now()) THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= timezone('UTC', now()) THEN timezone('UTC', now()) + ${interval}::interval ELSE "RateLimit"."resetAt" END
      RETURNING "count", "resetAt"`;
    if (Math.random() < 0.01) void prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "resetAt" < timezone('UTC', now()) - interval '1 day'`.catch(() => {});
    return row && row.count > policy.limit ? { ok: false, retry: retryIn({ count: row.count, resetAt: row.resetAt }) } : { ok: true };
  } catch (err) {
    console.error("rate limit unavailable", key, err);
    return { ok: true };
  }
}
