import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/context";
import { canManageClass } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { reportData } from "@/lib/org/analytics";
import { Report } from "@/components/console/Report";

export const metadata = { title: "Class report" };

export default async function ClassAnalytics({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireStaff();
  const { id } = await params;
  const cls = await prisma.classroom.findFirst({ where: { id, orgId: ctx.org.id } });
  if (!cls || !canManageClass(ctx.role, ctx.teaches.includes(cls.id))) notFound();
  const data = await reportData({ orgId: ctx.org.id, classroomId: cls.id });
  return (
    <div className="space-y-6">
      <Link href={`/teacher/classes/${cls.id}`} className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
        ← {cls.name}
      </Link>
      <header className="tb-rule pt-6">
        <p className="tb-label">Class report</p>
        <h1 className="font-serif text-3xl font-semibold mt-1">{cls.name}</h1>
      </header>
      <Report data={data} exportHref={`/api/export/gradebook?class=${cls.id}`} />
    </div>
  );
}
