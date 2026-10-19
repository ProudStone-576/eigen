import Link from "next/link";
import { manageableClasses, requireStaff } from "@/lib/auth/context";
import { course } from "@/lib/content";
import { AssignmentForm } from "./AssignmentForm";

export const metadata = { title: "New assignment" };

export default async function NewAssignment({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const ctx = await requireStaff();
  const classes = (await manageableClasses(ctx)).map((c) => ({ id: c.id, name: c.name }));
  const wanted = (await searchParams).class;
  const initialClass = classes.find((c) => c.id === wanted)?.id ?? classes[0]?.id ?? "";
  const units = course.units.map((u) => ({ id: u.id, track: u.track, title: u.title, nodes: u.nodes.map((n) => ({ id: n.id, title: n.title })) }));
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={initialClass ? `/teacher/classes/${initialClass}` : "/teacher"} className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← Class</Link>
      <h1 className="font-serif text-3xl font-semibold">New assignment</h1>
      {classes.length === 0 ? (
        <p>
          You don&apos;t teach a class yet. <Link href="/teacher" className="underline">Create one first</Link>.
        </p>
      ) : (
        <AssignmentForm units={units} classes={classes} initialClass={initialClass} />
      )}
    </div>
  );
}
