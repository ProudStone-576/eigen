import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { course } from "@/lib/content";
import { Film } from "@/components/landing/Film";
import { Reveal } from "@/components/landing/Reveal";
import { WidgetView } from "@/components/widgets/Widgets";

export default async function Home() {
  if (await currentUser()) redirect("/learn");

  const tracks = [...new Set(course.units.map((u) => u.track))].map((track) => {
    const nodes = course.units.filter((u) => u.track === track).flatMap((u) => u.nodes);
    return { track, nodes };
  });

  return (
    <div className="-my-8">
      <Film />

      <div className="theme-dark full-bleed relative z-10 bg-black text-[#f5f5f7]">
        {/* A real lesson widget */}
        <section className="mx-auto max-w-6xl px-6 py-28 md:py-40 grid md:grid-cols-[1fr_1.15fr] gap-14 items-center">
          <Reveal>
            <p className="text-sm font-medium text-[#86868b]">Not a demo</p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">This is a real lesson.</h2>
            <p className="mt-5 text-xl leading-relaxed text-[#86868b]">
              The population below is wildly lopsided. Average a few values at a time, again and again, and <span className="text-white">a bell curve appears</span>. That&rsquo;s the
              central limit theorem, and you just discovered it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[28px] bg-[#161618] p-6 md:p-8 ring-1 ring-white/10">
              <WidgetView widget={{ kind: "clt" }} />
            </div>
          </Reveal>
        </section>

        {/* Curriculum, set like a spec sheet */}
        <section className="mx-auto max-w-6xl px-6 pb-28 md:pb-40">
          <Reveal>
            <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] font-semibold tracking-[-0.035em]">What&rsquo;s inside.</h2>
          </Reveal>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {tracks.map((t, i) => (
              <Reveal key={t.track} delay={i * 60}>
                <div className="grid md:grid-cols-[16rem_1fr] gap-3 md:gap-10 py-8">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{t.track}</h3>
                    <p className="mt-1 text-sm text-[#86868b]">{t.nodes.length} concepts</p>
                  </div>
                  <p className="text-[15px] leading-7 text-[#86868b]">{t.nodes.map((n) => n.title).join(" · ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
            <p className="text-[#86868b]">Join with your class invite code.</p>
            <div className="flex gap-3">
              <Link href="/signup" className="rounded-full bg-white px-6 py-2.5 font-medium text-black transition hover:bg-white/90 active:scale-[0.97]">
                Get started
              </Link>
              <Link href="/login" className="rounded-full border border-white/30 px-6 py-2.5 font-medium transition hover:bg-white/10 active:scale-[0.97]">
                Log in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
