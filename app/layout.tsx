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
import { CoursesMenu, type MenuPart } from "@/components/nav/CoursesMenu";
import { chapterHref, courseHref, partSlug } from "@/lib/content/catalog";
import { chapterNumber, parts } from "@/lib/content/numbering";

const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif", display: "swap", style: ["normal", "italic"] });

const SEARCH: SearchEntry[] = course.units.flatMap((u, ci) =>
  u.nodes.map((n, si) => ({ id: n.id, title: n.title, where: `${ci + 1}.${si + 1} · ${u.track} · ${u.title}`, terms: n.glossary.map((g) => g.term) })),
);

export const metadata: Metadata = {
  title: { default: "Eigen", template: "%s · Eigen" },
  description: "Exam-level mathematics, from first principles to the hardest problems, with interactive figures.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const MENU: MenuPart[] = parts.map((p) => ({
  key: partSlug(p),
  label: p.roman,
  track: p.track,
  href: courseHref(p),
  chapters: p.units.map((u) => ({ id: u.id, label: String(chapterNumber(u)), title: u.title, href: chapterHref(u) })),
}));

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
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:bg-[var(--surface)] focus:px-3 focus:py-1.5">
        Skip to content
      </a>
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
        <div className="flex items-center gap-5">
          <div className="hidden md:block">
            <CoursesMenu parts={MENU} />
          </div>
          <Link href="/courses" className="text-sm font-medium md:hidden">
            Courses
          </Link>
          <div className="hidden md:block">
            <Search entries={SEARCH} />
          </div>
        </div>
        <Link href={user ? "/learn" : "/"} className="font-serif text-[1.05rem] font-semibold tracking-[0.18em] uppercase" aria-label="Eigen home">
          Eigen
        </Link>
        <div className="flex items-center justify-end gap-5 text-sm">
          {ctx?.org && ctx.memberships.length > 0 && (
            <span className="hidden max-w-[12rem] truncate text-[var(--muted)] 2xl:inline" title="Organisation">
              {ctx.org.name}
            </span>
          )}
          {!user && (
            <>
              <Link href="/login" className="text-[var(--muted)] hover:text-[var(--fg)]">
                Log in
              </Link>
              <Link href="/signup" className="btn">
                Join
              </Link>
            </>
          )}
          {user && (
            <>
              <nav aria-label="Your work" className="hidden items-center gap-5 lg:flex">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="hover:text-[var(--accent)]">
                    {l.label}
                    {l.badge ? <span className="ml-1 text-xs text-[var(--accent)] tabular-nums">({l.badge})</span> : null}
                  </Link>
                ))}
                <form action={logout}>
                  <button className="text-[var(--muted)] hover:text-[var(--fg)]">Log out</button>
                </form>
              </nav>
              <div className="flex items-center gap-3 lg:hidden">
                <span className="md:hidden">
                  <Search entries={SEARCH} compact />
                </span>
                <MobileMenu links={[{ href: "/courses", label: "Courses" }, ...links]} name={user.name} />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--rule)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-[1.05rem] font-semibold tracking-[0.18em] uppercase">Eigen</p>
          <p className="mt-3 max-w-xs text-[var(--muted)]">Exam mathematics, from first principles to the hardest problems, taught as a book you can practise in.</p>
        </div>
        <nav aria-label="Courses">
          <h2 className="tb-label">Courses</h2>
          <ul className="mt-3 space-y-1.5">
            {parts.map((p) => (
              <li key={p.track}>
                <Link href={courseHref(p)} className="text-[var(--muted)] hover:text-[var(--fg)]">
                  {p.track}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Study">
          <h2 className="tb-label">Study</h2>
          <ul className="mt-3 space-y-1.5">
            {[
              ["/learn", "Syllabus"],
              ["/review", "Review"],
              ["/exam", "Tests"],
              ["/glossary", "Glossary"],
              ["/learn/map", "Dependency map"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-[var(--muted)] hover:text-[var(--fg)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Account">
          <h2 className="tb-label">Account</h2>
          <ul className="mt-3 space-y-1.5">
            {[
              ["/login", "Log in"],
              ["/signup", "Join with a class code"],
              ["/join", "Join another class"],
              ["/account", "Your account"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-[var(--muted)] hover:text-[var(--fg)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl border-t border-[var(--border)] px-4 py-4 text-xs text-[var(--muted)]">Problems are original, written in the style of the exams they prepare for.</p>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      {/* Extensions like Grammarly add attributes to <body> before React hydrates. */}
      <body className="min-h-dvh font-sans" suppressHydrationWarning>
        <Header />
        <main id="main" className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
