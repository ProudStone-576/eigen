import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { login } from "../actions";
import { safeNext } from "@/lib/auth/redirect";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next, "");
  return (
    <div className="max-w-sm mx-auto space-y-6 pt-6">
      <header className="tb-rule pt-6">
        <h1 className="font-serif text-3xl font-semibold">Log in</h1>
      </header>
      <AuthForm
        action={login}
        submit="Log in"
        hidden={next ? { next } : {}}
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ]}
      />
      <p className="text-sm text-[var(--muted)]">
        New here?{" "}
        <Link href="/signup" className="underline">
          Join with a class code
        </Link>
      </p>
    </div>
  );
}
