"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Section tabs for a console: plain text links, the current one underlined. */
export function ConsoleNav({ links }: { links: { href: string; label: string; exact?: boolean }[] }) {
  const path = usePathname();
  return (
    <nav className="console-nav flex flex-wrap gap-x-6 gap-y-2 text-sm border-b border-[var(--border)]">
      {links.map((l) => {
        const active = l.exact ? path === l.href : path === l.href || path.startsWith(`${l.href}/`);
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
