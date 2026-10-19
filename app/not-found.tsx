import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto pt-10">
      <header className="tb-rule pt-6 space-y-3">
        <p className="tb-label">Error 404</p>
        <h1 className="font-serif text-3xl font-semibold">Page not found</h1>
        <p className="text-[var(--muted)]">The page doesn&apos;t exist, or you don&apos;t have access to it from this organisation.</p>
        <p>
          <Link href="/learn" className="underline">
            Go to the syllabus
          </Link>
        </p>
      </header>
    </div>
  );
}
