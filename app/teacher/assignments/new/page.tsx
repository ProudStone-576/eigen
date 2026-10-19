import Link from "next/link";
import { requireTeacher } from "@/lib/auth/session";
import { course } from "@/lib/content";
import { AssignmentForm } from "./AssignmentForm";

export const metadata = { title: "New assignment" };

export default async function NewAssignment() {
  await requireTeacher();
  const units = course.units.map((u) => ({ id: u.id, track: u.track, title: u.title, nodes: u.nodes.map((n) => ({ id: n.id, title: n.title })) }));
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/teacher" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← Class</Link>
      <h1 className="text-3xl font-bold tracking-tight">New assignment</h1>
      <AssignmentForm units={units} />
    </div>
  );
}
