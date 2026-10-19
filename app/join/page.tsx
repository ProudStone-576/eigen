import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { currentContext } from "@/lib/auth/context";
import { JoinCodeForm } from "./JoinForms";

export const metadata = { title: "Join a class" };

/** For a signed-in user: join a class (and its organisation) with a code. */
export default async function JoinPage() {
  await requireUser({ allowPasswordChange: false });
  const ctx = await currentContext();
  const none = !ctx?.org;
  return (
    <div className="max-w-md mx-auto space-y-6 pt-6">
      <header className="tb-rule pt-6">
        <h1 className="font-serif text-3xl font-semibold">Join a class</h1>
        <p className="mt-1 text-[var(--muted)]">
          {none
            ? "Your account isn't in a school or institute at the moment. Enter a class code from your teacher to continue."
            : "Enter the code your teacher gave you. You can belong to several classes and organisations."}
        </p>
      </header>
      <JoinCodeForm />
      {!none && (
        <p className="text-sm">
          <Link href="/learn" className="text-[var(--muted)] hover:text-[var(--fg)]">
            ← Back to the syllabus
          </Link>
        </p>
      )}
    </div>
  );
}
