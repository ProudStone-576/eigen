import Link from "next/link";
import { requireStaff } from "@/lib/auth/context";
import { can, isAdmin, isStaff, ROLE_LABEL } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import { formatCode } from "@/lib/org/codes";
import { NewClass } from "./ClassActions";

export const metadata = { title: "Classes" };

/** The register of classes: every class for admins, your own for teachers. */
export default async function ClassesPage({ searchParams }: { searchParams: Promise<{ archived?: string }> }) {
  const ctx = await requireStaff();
  const showArchived = (await searchParams).archived === "1";
  const admin = isAdmin(ctx.role);
  const scope = { orgId: ctx.org.id, ...(admin ? {} : { id: { in: ctx.teaches } }) };
  const [classes, archivedCount, staff] = await Promise.all([
    prisma.classroom.findMany({
      where: { ...scope, archived: showArchived },
      orderBy: { name: "asc" },
      include: {
        enrollments: { select: { role: true, user: { select: { name: true } } } },
        _count: { select: { assignments: { where: { archived: false } } } },
      },
    }),
    prisma.classroom.count({ where: { ...scope, archived: true } }),
    admin
      ? prisma.membership.findMany({ where: { orgId: ctx.org.id, role: { in: ["OWNER", "ADMIN", "TEACHER"] } }, include: { user: { select: { id: true, name: true } } } })
      : Promise.resolve([]),
  ]);
  const teachers = admin ? staff.filter((m) => isStaff(m.role)).map((m) => ({ id: m.user.id, name: m.user.name })).sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <div className="max-w-5xl space-y-8">
      <header className="tb-rule pt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tb-label">
            {ctx.org.name} · {ROLE_LABEL[ctx.role]}
          </p>
          <h1 className="font-serif text-3xl font-semibold mt-1">{showArchived ? "Archived classes" : admin ? "All classes" : "Your classes"}</h1>
        </div>
        <nav className="flex gap-5 text-sm">
          {can(ctx.role, "content.edit") && (
            <Link href="/teacher/content" className="hover:text-[var(--accent)]">
              Question bank
            </Link>
          )}
          {(archivedCount > 0 || showArchived) && (
            <Link href={showArchived ? "/teacher" : "/teacher?archived=1"} className="text-[var(--muted)] hover:text-[var(--fg)]">
              {showArchived ? "Current classes" : `Archived (${archivedCount})`}
            </Link>
          )}
        </nav>
      </header>

      {classes.length === 0 ? (
        <p className="text-[var(--muted)]">{showArchived ? "No archived classes." : "No classes yet. Create one below; students join it with its code."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="ledger">
            <thead>
              <tr>
                <th>Class</th>
                <th>Teachers</th>
                <th className="num">Students</th>
                <th className="num">Open assignments</th>
                <th>Join code</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => {
                const students = c.enrollments.filter((e) => e.role === "STUDENT").length;
                const names = c.enrollments.filter((e) => e.role === "TEACHER").map((e) => e.user.name);
                return (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/teacher/classes/${c.id}`} className="font-medium hover:text-[var(--accent)]">
                        {c.name}
                      </Link>
                    </td>
                    <td className="text-[var(--muted)]">{names.join(", ") || "None"}</td>
                    <td className="num">{students}</td>
                    <td className="num">{c._count.assignments}</td>
                    <td>
                      <span className="code-chip text-xs">{formatCode(c.joinCode)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!showArchived && can(ctx.role, "classes.create") && (
        <section className="max-w-2xl">
          <NewClass teachers={teachers} me={ctx.user.id} />
        </section>
      )}
    </div>
  );
}
