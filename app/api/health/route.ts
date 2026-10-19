import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Liveness + database reachability, for uptime checks. Reveals nothing about data. */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, db: "up", ms: Date.now() - started });
  } catch {
    return Response.json({ ok: false, db: "down" }, { status: 503 });
  }
}
