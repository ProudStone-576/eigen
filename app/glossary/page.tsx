import { MathText } from "@/components/MathText";
import { requireUser } from "@/lib/auth/session";
import { allNodes } from "@/lib/content";
import { loadProgress, statusIn } from "@/lib/learning/progress";

export const metadata = { title: "Glossary" };

/** Your dictionary: only the words from concepts you've actually opened. */
export default async function GlossaryPage() {
  const user = await requireUser();
  const status = statusIn(await loadProgress(user.id));
  const reached = allNodes.filter((n) => status(n.id) !== "UNKNOWN");
  const terms = reached
    .flatMap((n) => n.glossary.map((g) => ({ ...g, from: n.title })))
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold">Your glossary</h1>
      <p className="text-[var(--muted)]">Every word you&rsquo;ve met so far, in plain language. It grows as you open new concepts.</p>
      {terms.length === 0 ? (
        <p className="card">Open your first concept and its words will show up here.</p>
      ) : (
        <dl className="card divide-y divide-[var(--border)]">
          {terms.map((t) => (
            <div key={t.term} className="py-3 first:pt-0 last:pb-0">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="text-[var(--muted)]">
                <MathText text={t.meaning} />
              </dd>
              <dd className="text-xs text-[var(--muted)] mt-1">from {t.from}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
