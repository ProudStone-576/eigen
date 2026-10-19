import Link from "next/link";
import { AuthForm } from "../login/AuthForm";
import { signup } from "../actions";

export const metadata = { title: "Join" };

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto card space-y-5">
      <h1 className="text-2xl font-bold">Join Eigen</h1>
      <AuthForm
        action={signup}
        submit="Create account"
        fields={[
          { name: "name", label: "Your name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password", hint: "At least 8 characters." },
          { name: "invite", label: "Invite code", type: "text", hint: "Your teacher gives you this." },
        ]}
      />
      <p className="text-sm text-[var(--muted)]">
        Have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </div>
  );
}
