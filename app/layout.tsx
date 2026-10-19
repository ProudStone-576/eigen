import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { currentUser } from "@/lib/auth/session";
import { dueNodes, loadProgress } from "@/lib/learning/progress";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: { default: "Eigen", template: "%s · Eigen" },
  description: "Learn the math behind machine learning by playing with it.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

async function Header() {
  const user = await currentUser();
  const due = user ? dueNodes(await loadProgress(user.id)).length : 0;
  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--border)_60%,transparent)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center gap-4">
        <Link href={user ? "/learn" : "/"} className="font-extrabold text-lg tracking-tight">
          eigen<span className="text-[var(--accent)]">.</span>
        </Link>
        {!user && (
          <nav className="flex items-center gap-5 text-xs ml-auto">
            <Link href="/login" className="text-[var(--muted)] hover:text-[var(--fg)]">Log in</Link>
            <Link href="/signup" className="rounded-full bg-[var(--accent)] text-white px-3.5 py-1 font-medium hover:brightness-110">Join</Link>
          </nav>
        )}
        {user && (
          <nav className="flex items-center gap-4 text-sm ml-auto">
            <Link href="/review" className="hover:text-[var(--accent)]">
              Review{due > 0 && <span className="ml-1 rounded-full bg-[var(--accent)] text-white px-2 py-0.5 text-xs">{due}</span>}
            </Link>
            <Link href="/exam" className="hover:text-[var(--accent)]">Tests</Link>
            <Link href="/glossary" className="hover:text-[var(--accent)] hidden sm:inline">Glossary</Link>
            {user.role === "TEACHER" && <Link href="/teacher" className="hover:text-[var(--accent)]">Students</Link>}
            {user.role === "TEACHER" && <Link href="/teacher/content" className="hover:text-[var(--accent)]">Questions</Link>}
            <span title="Day streak">🔥 {user.streakDays}</span>
            <span title="Experience points" className="font-semibold">{user.xp} XP</span>
            <form action={logout}>
              <button className="text-[var(--muted)] hover:text-[var(--fg)]">Log out</button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Extensions like Grammarly add attributes to <body> before React hydrates. */}
      <body className="min-h-dvh font-sans" suppressHydrationWarning>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
