import { requireAdmin } from "@/lib/auth/context";
import { prisma } from "@/lib/db";
import { reportData } from "@/lib/org/analytics";
import { Report } from "@/components/console/Report";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const ctx = await requireAdmin();
  const classes = await prisma.classroom.findMany({ where: { orgId: ctx.org.id, archived: false }, orderBy: { name: "asc" }, select: { id: true, name: true } });
  const wanted = (await searchParams).class;
  const cls = classes.find((c) => c.id === wanted) ?? null;
  const data = await reportData({ orgId: ctx.org.id, classroomId: cls?.id });
  return (
    <div className="space-y-6">
      <form action="/admin/analytics" className="flex flex-wrap items-end gap-3">
        <label>
          <span className="tb-label block mb-1">Scope</span>
          <select name="class" defaultValue={cls?.id ?? ""} className="field text-sm">
            <option value="">Whole organisation</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-ghost">Show</button>
      </form>
      <Report data={data} exportHref={`/api/export/gradebook${cls ? `?class=${cls.id}` : ""}`} />
    </div>
  );
}
