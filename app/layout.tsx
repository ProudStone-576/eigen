import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { currentUser } from "@/lib/auth/session";
import { dueNodes, loadProgress } from "@/lib/learning/progress";
import { logout } from "./actions";
import { course } from "@/lib/content";
import { Search, type SearchEntry } from "@/components/nav/Search";
import { MobileMenu, type NavLink } from "@/components/nav/MobileMenu";

const SEARCH: SearchEntry[] = course.units.flatMap((u) =>
  u.nodes.map((n) => ({ id: n.id, title: n.title, where: `${u.track} · ${u.title}`, terms: n.glossary.map((g) => g.term) })),
);

export const metadata: Metadata = {
  title: { default: "Eigen", template: "%s · Eigen" },
  description: "Learn the math behind machine learning by playing with it.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

async function Header() {
  const user = await currentUser();
  const due = user ? dueNodes(await loadProgress(user.id)).length : 0;
  const links: NavLink[] = user
    ? [
        { href: "/learn", label: "Map" },
        { href: "/review", label: "Review", badge: due },
        { href: "/exam", label: "Tests" },
        { href: "/glossary", label: "Glossary" },
        ...(user.role === "TEACHER" ? [{ href: "/teacher", label: "Class" }] : []),
        { href: "/account", label: "Account" },
      ]
    : [];
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
          <>
            <nav className="ml-auto hidden md:flex items-center gap-5 text-sm">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                  {l.badge ? <span className="ml-1 rounded-full bg-[var(--accent)] text-white px-2 py-0.5 text-xs">{l.badge}</span> : null}
                </Link>
              ))}
              <Search entries={SEARCH} />
              <span title="Day streak" className="tabular-nums">🔥 {user.streakDays}</span>
              <span title="Experience points" className="font-semibold tabular-nums">{user.xp} XP</span>
              <form action={logout}>
                <button className="text-[var(--muted)] hover:text-[var(--fg)]">Log out</button>
              </form>
            </nav>
            <div className="ml-auto flex md:hidden items-center gap-3 text-sm">
              <Search entries={SEARCH} compact />
              <span title="Day streak" className="tabular-nums">🔥 {user.streakDays}</span>
              <MobileMenu links={links} name={`${user.name} · ${user.xp} XP`} />
            </div>
          </>
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
