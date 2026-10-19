import Link from "next/link";
import { requireStaff } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { course } from "@/lib/content";

export const metadata = { title: "Questions" };

/** Every concept, with how many questions the teacher has added to it. */
export default async function ContentPage() {
  const ctx = await requireStaff();
  const counts = await prisma.customItem.groupBy({ by: ["nodeId"], where: { archived: false, orgId: ctx.org.id }, _count: { _all: true } });
  const countOf = new Map(counts.map((c) => [c.nodeId, c._count._all]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Your questions</h1>
        <p className="text-[var(--muted)]">
          Add questions to any concept. They join that concept&rsquo;s practice sessions and reviews alongside the built-in ones.
        </p>
      </div>
      {course.units.map((unit) => (
        <section key={unit.id} className="card space-y-3">
          <h2 className="font-bold">
            <span className="text-xs uppercase tracking-widest text-[var(--accent)] mr-2">{unit.track}</span>
            {unit.title}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {unit.nodes.map((n) => (
              <li key={n.id}>
                <Link href={`/teacher/content/${n.id}`} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 hover:border-[var(--accent)]">
                  <span>{n.title}</span>
                  <span className="text-sm text-[var(--muted)]">{countOf.get(n.id) ?? 0} added</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
