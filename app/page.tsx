import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { allNodes, course } from "@/lib/content";
import { HeroGrid } from "@/components/landing/HeroGrid";
import { ScrollStory } from "@/components/landing/ScrollStory";
import { CountUp, Reveal } from "@/components/landing/Reveal";
import { WidgetView } from "@/components/widgets/Widgets";

const TRACK_STYLE: Record<string, { from: string; to: string; glyph: string }> = {
  "Linear algebra": { from: "#4f46e5", to: "#06b6d4", glyph: "⟂" },
  Statistics: { from: "#db2777", to: "#f59e0b", glyph: "σ" },
  Calculus: { from: "#059669", to: "#84cc16", glyph: "∂" },
  "Neural networks": { from: "#7c3aed", to: "#ec4899", glyph: "◉" },
  "Machine learning": { from: "#0f172a", to: "#6366f1", glyph: "ŷ" },
};

export default async function Home() {
  if (await currentUser()) redirect("/learn");

  const tracks = [...new Set(course.units.map((u) => u.track))].map((track) => {
    const units = course.units.filter((u) => u.track === track);
    const nodes = units.flatMap((u) => u.nodes);
    return { track, units: units.length, concepts: nodes.length, sample: nodes.slice(0, 4).map((n) => n.title) };
  });

  return (
    <div className="-my-8">
      <HeroGrid />

      {/* Statement */}
      <section className="py-28 md:py-40 text-center">
        <Reveal>
          <p className="mx-auto max-w-4xl text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Most math courses start with symbols.{" "}
            <span className="text-[var(--muted)]">Eigen starts with the thing the symbols describe, and lets you push it around.</span>
          </p>
        </Reveal>
      </section>

      <ScrollStory />

      {/* Tracks */}
      <section className="py-24 md:py-32 space-y-10">
        <Reveal className="text-center space-y-3">
          <h2 className="text-4xl md:text-6xl font-bold">{tracks.length} tracks. One map.</h2>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">Concepts unlock as their foundations land, so you never build on sand.</p>
        </Reveal>
        <div className="full-bleed overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-5 px-[max(1rem,calc(50vw-32rem))] pb-4 w-max">
            {tracks.map((t, i) => {
              const s = TRACK_STYLE[t.track] ?? { from: "#334155", to: "#64748b", glyph: "∑" };
              return (
                <Reveal key={t.track} delay={i * 90} className="snap-center">
                  <article
                    className="group relative w-[78vw] max-w-[22rem] h-[28rem] rounded-[32px] p-8 text-white overflow-hidden flex flex-col transition-transform duration-500 hover:scale-[1.02]"
                    style={{ background: `linear-gradient(150deg, ${s.from}, ${s.to})` }}
                  >
                    <span className="absolute -right-6 -bottom-10 text-[13rem] leading-none font-bold opacity-15 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" aria-hidden>
                      {s.glyph}
                    </span>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
                      {t.units} unit{t.units === 1 ? "" : "s"}
                    </p>
                    <h3 className="mt-2 text-4xl font-bold">{t.track}</h3>
                    <p className="mt-1 text-lg opacity-90">{t.concepts} concepts</p>
                    <ul className="mt-auto space-y-1 text-sm opacity-90 relative">
                      {t.sample.map((x) => (
                        <li key={x}>· {x}</li>
                      ))}
                      {t.concepts > t.sample.length && <li className="opacity-70">and {t.concepts - t.sample.length} more</li>}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20 md:py-28 border-y border-[var(--border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { n: allNodes.length, label: "concepts, each taught with something to touch" },
            { n: course.units.length, label: "units, from vectors to model evaluation" },
            { n: 5, label: "kinds of question per idea" },
            { n: 3, label: "difficulty levels that adapt to you" },
          ].map((x, i) => (
            <Reveal key={x.label} delay={i * 80}>
              <p className="text-5xl md:text-7xl font-bold text-gradient">
                <CountUp to={x.n} />
              </p>
              <p className="mt-2 text-sm text-[var(--muted)] max-w-[12rem] mx-auto">{x.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Try it */}
      <section className="full-bleed theme-dark bg-[radial-gradient(ellipse_at_70%_40%,#1d1640_0%,#000_60%)] text-[var(--fg)] py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <Reveal className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Try it. Right here.</p>
            <h2 className="text-4xl md:text-6xl font-bold leading-[1.02]">Why does every average become a bell?</h2>
            <p className="text-lg text-[var(--muted)]">
              The population is wildly lopsided. Average a few values at a time and watch the central limit theorem happen in front of you. This is a real lesson widget.
            </p>
            <Link href="/signup" className="link-more">Learn it properly</Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-[32px] bg-[var(--surface)] p-6 md:p-8 shadow-[0_40px_120px_-30px_rgb(124_108_255/0.45)]">
              <WidgetView widget={{ kind: "clt" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final call */}
      <section className="py-28 md:py-40 text-center space-y-8">
        <Reveal className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold">
            Start with a vector.
            <br />
            <span className="text-gradient">End with a neural network.</span>
          </h2>
          <p className="text-lg text-[var(--muted)]">Join with your class invite code.</p>
        </Reveal>
        <Reveal delay={120} className="flex justify-center gap-3 flex-wrap">
          <Link href="/signup" className="btn text-lg px-8 py-3">Get started</Link>
          <Link href="/login" className="btn-ghost text-lg px-8 py-3">Log in</Link>
        </Reveal>
      </section>
    </div>
  );
}
