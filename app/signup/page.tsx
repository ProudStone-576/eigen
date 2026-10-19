import Link from "next/link";
import { AuthForm } from "../login/AuthForm";
import { signup } from "../actions";
import { formatCode, normaliseCode } from "@/lib/org/codes";

export const metadata = { title: "Join" };

/** Sign up with a class code (from a teacher) or, via /join/[token], an invitation link. */
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const code = (await searchParams).code;
  const prefill = code ? formatCode(normaliseCode(code).slice(0, 12)) : undefined;
  return (
    <div className="max-w-sm mx-auto space-y-6 pt-6">
      <header className="tb-rule pt-6">
        <h1 className="font-serif text-3xl font-semibold">Join Eigen</h1>
        <p className="mt-1 text-[var(--muted)]">Your school or institute gives you a class code.</p>
      </header>
      <AuthForm
        action={signup}
        submit="Create account"
        fields={[
          { name: "name", label: "Your name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password", hint: "At least 8 characters." },
          { name: "code", label: "Class code", type: "text", hint: "Six characters, e.g. K7Q-4MZ.", defaultValue: prefill },
        ]}
      />
      <p className="text-sm text-[var(--muted)]">
        Have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
        , then join the class from your account page.
      </p>
    </div>
  );
}
