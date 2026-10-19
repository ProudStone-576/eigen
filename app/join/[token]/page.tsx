import Link from "next/link";
import { currentUser } from "@/lib/auth/session";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { targetForInvitation } from "@/lib/org/join";
import { AuthForm } from "../../login/AuthForm";
import { signup } from "../../actions";
import { AcceptInvitationForm } from "../JoinForms";

export const metadata = { title: "Invitation" };

const STATE_TEXT = { expired: "This invitation has expired.", used: "This invitation has already been used.", revoked: "This invitation was withdrawn." } as const;

/** An invitation link: accept it if signed in, or create an account through it. */
export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [view, user] = await Promise.all([targetForInvitation(token), currentUser()]);

  if (!view || view.state !== "active") {
    return (
      <div className="max-w-md mx-auto pt-6">
        <header className="tb-rule pt-6 space-y-2">
          <h1 className="font-serif text-3xl font-semibold">Invitation unavailable</h1>
          <p className="text-[var(--muted)]">{view && view.state !== "active" ? STATE_TEXT[view.state] : "This link isn't valid."} Ask whoever sent it for a new one.</p>
        </header>
      </div>
    );
  }

  const t = view.target;
  const what = `${ROLE_LABEL[t.role].toLowerCase()} in ${t.orgName}${t.className ? `, class ${t.className}` : ""}`;
  return (
    <div className="max-w-sm mx-auto space-y-6 pt-6">
      <header className="tb-rule pt-6">
        <p className="tb-label">Invitation</p>
        <h1 className="font-serif text-3xl font-semibold mt-1">{t.orgName}</h1>
        <p className="mt-1 text-[var(--muted)]">You&apos;re invited to join as {what}.</p>
      </header>
      {user ? (
        <>
          <p className="text-sm">
            Signed in as <span className="font-medium">{user.email}</span>.
          </p>
          <AcceptInvitationForm token={token} label={`Join as ${ROLE_LABEL[t.role].toLowerCase()}`} />
        </>
      ) : (
        <>
          <AuthForm
            action={signup}
            submit="Create account and join"
            hidden={{ invite: token }}
            fields={[
              { name: "name", label: "Your name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "password", label: "Password", type: "password", hint: "At least 8 characters." },
            ]}
          />
          <p className="text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(`/join/${token}`)}`} className="underline">
              Log in to accept
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}
