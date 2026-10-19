"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions";

export type NavLink = { href: string; label: string; badge?: number };

/** Phone-sized navigation: a button that opens a sheet of links. Closes on navigation. */
export function MobileMenu({ links, name }: { links: NavLink[]; name: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu" className="p-1.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="fixed inset-x-0 top-12 z-[90] border-b border-[var(--border)] bg-[var(--bg)] px-4 pb-6 pt-2 shadow-xl">
          <p className="py-2 text-xs text-[var(--muted)]">{name}</p>
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`flex items-center justify-between border-b border-[var(--border)] py-3 text-lg ${path === l.href ? "text-[var(--accent)]" : ""}`}>
                {l.label}
                {l.badge ? <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white">{l.badge}</span> : null}
              </Link>
            ))}
            <form action={logout}>
              <button className="w-full py-3 text-left text-lg text-[var(--muted)]">Log out</button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
}
