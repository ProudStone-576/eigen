"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown when a page throws. The digest lets an operator find the server log entry. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="max-w-md mx-auto pt-10">
      <header className="tb-rule pt-6 space-y-3">
        <p className="tb-label">Something went wrong</p>
        <h1 className="font-serif text-3xl font-semibold">This page couldn&apos;t load</h1>
        <p className="text-[var(--muted)]">Your work is saved. Try again; if it keeps happening, tell your teacher or administrator{error.digest ? ` and quote reference ${error.digest}` : ""}.</p>
        <div className="flex gap-3 pt-2">
          <button className="btn" onClick={reset}>
            Try again
          </button>
          <Link href="/learn" className="btn-ghost">
            Syllabus
          </Link>
        </div>
      </header>
    </div>
  );
}
