import type { Metadata, Viewport } from "next";
import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { currentContext } from "@/lib/auth/context";
import { isAdmin, isStaff } from "@/lib/auth/permissions";
import { dueNodes, loadProgress } from "@/lib/learning/progress";
import { logout } from "./actions";
import { course } from "@/lib/content";
import { Search, type SearchEntry } from "@/components/nav/Search";
import { MobileMenu, type NavLink } from "@/components/nav/MobileMenu";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif", display: "swap", style: ["normal", "italic"] });

const SEARCH: SearchEntry[] = course.units.flatMap((u, ci) =>
  u.nodes.map((n, si) => ({ id: n.id, title: n.title, where: `§${ci + 1}.${si + 1} · ${u.track} · ${u.title}`, terms: n.glossary.map((g) => g.term) })),
);

export const metadata: Metadata = {
  title: { default: "Eigen", template: "%s · Eigen" },
  description: "Exam-level mathematics, from first principles to the hardest problems, with interactive figures.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

async function Header() {
  const ctx = await currentContext();
  const user = ctx?.user ?? null;
  const role = ctx?.role ?? null;
  const due = user ? dueNodes(await loadProgress(user.id)).length : 0;
  const links: NavLink[] = user
    ? [
        { href: "/learn", label: "Syllabus" },
        { href: "/review", label: "Review", badge: due },
        { href: "/exam", label: "Tests" },
        { href: "/glossary", label: "Glossary" },
        ...(role && isStaff(role) ? [{ href: "/teacher", label: "Classes" }] : []),
        ...(role && isAdmin(role) ? [{ href: "/admin", label: "Admin" }] : []),
        ...(user.platformAdmin ? [{ href: "/platform", label: "Platform" }] : []),
        { href: "/account", label: "Account" },
      ]
    : [];
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 h-12 flex items-center gap-4">
        <Link href={user ? "/learn" : "/"} className="font-serif text-[1.05rem] font-semibold tracking-[0.18em] uppercase">
          Eigen
        </Link>
        {ctx?.org && ctx.memberships.length > 0 && (
          <span className="hidden lg:inline text-sm text-[var(--muted)] border-l border-[var(--border)] pl-4 truncate max-w-[16rem]" title="Organisation">
            {ctx.org.name}
          </span>
        )}
        {!user && (
          <nav className="flex items-center gap-5 text-sm ml-auto">
            <Link href="/login" className="text-[var(--muted)] hover:text-[var(--fg)]">Log in</Link>
            <Link href="/signup" className="hover:text-[var(--accent)] font-medium">Join</Link>
          </nav>
        )}
        {user && (
          <>
            <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-[var(--accent)]">
                  {l.label}
                  {l.badge ? <span className="ml-1 text-xs text-[var(--accent)] tabular-nums">({l.badge})</span> : null}
                </Link>
              ))}
              <Search entries={SEARCH} />
              <form action={logout}>
                <button className="text-[var(--muted)] hover:text-[var(--fg)]">Log out</button>
              </form>
            </nav>
            <div className="ml-auto flex md:hidden items-center gap-3 text-sm">
              <Search entries={SEARCH} compact />
              <MobileMenu links={links} name={user.name} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      {/* Extensions like Grammarly add attributes to <body> before React hydrates. */}
      <body className="min-h-dvh font-sans" suppressHydrationWarning>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
