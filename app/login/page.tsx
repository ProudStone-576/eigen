import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { login } from "../actions";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto card space-y-5">
      <h1 className="text-2xl font-bold">Log in</h1>
      <AuthForm action={login} submit="Log in" fields={[{ name: "email", label: "Email", type: "email" }, { name: "password", label: "Password", type: "password" }]} />
      <p className="text-sm text-[var(--muted)]">
        New here? <Link href="/signup" className="underline">Join with an invite code</Link>
      </p>
    </div>
  );
}
