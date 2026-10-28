import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { allNodes, course } from "@/lib/content";
import { courseHref, partSlug } from "@/lib/content/catalog";
import { parts } from "@/lib/content/numbering";
import { AudienceTabs, type Audience } from "@/components/landing/AudienceTabs";
import { Film } from "@/components/landing/Film";
import { Reveal } from "@/components/landing/Reveal";
import { WidgetView } from "@/components/widgets/Widgets";

const AUDIENCES: Audience[] = [
  {
    id: "students",
    tab: "Students",
    title: "Know exactly what you have mastered.",
    body: "Every section is a short chapter of a textbook: definitions, theorems with proofs, worked examples and graded exercises. Practice decides when it counts as mastered, not a progress bar.",
    points: [
      "Sections open once the sections they assume are learned, so nothing is built on sand.",
      "Three right in a row on questions you have never seen makes a section mastered.",
      "Common mix-ups are caught by name and practised until they are gone.",
      "Mastered sections come back for review after 1, 2, 4 … up to 90 days.",
    ],
    link: { href: "/signup", label: "Join with a class code" },
  },
  {
    id: "teachers",
    tab: "Teachers",
    title: "See who is stuck, and on what.",
    body: "Your classes, their mastery section by section, and the mix-ups the class shares, on one page. Set work with a due date and watch it get done.",
    points: [
      "Assign chapters or sections, with or without a chapter test.",
      "A class report of misconceptions, so you can reteach the right idea.",
      "Write your own questions; they are checked before they reach students.",
      "Export the gradebook as a spreadsheet whenever you need it.",
    ],
    link: { href: "/login", label: "Teachers log in" },
  },
  {
    id: "schools",
    tab: "Schools",
    title: "One organisation, every class.",
    body: "Schools and coaching institutes run Eigen as their own organisation, with owners, admins, teachers and students, and seats you control.",
    points: [
      "Invitation links with expiry dates and use limits, revocable at any time.",
      "Admins see analytics across the whole organisation or one class.",
      "An audit log of security-relevant actions.",
      "Each learner can download their own data, and accounts can be deleted cleanly.",
    ],
    link: { href: "/login", label: "Admins log in" },
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Who is Eigen for?",
    a: "Students preparing for demanding mathematics exams such as JEE Main, JEE Advanced and the SAT, and anyone who wants the statistics and linear algebra behind machine learning taught properly.",
  },
  {
    q: "How hard are the problems?",
    a: "Exercises come in three levels. Level I is about SAT and board standard, Level II about JEE Main, Level III about JEE Advanced. Every exercise has a full solution, shown after you attempt it.",
  },
  {
    q: "Are these past exam papers?",
    a: "No. Every problem is original, written in the style of the exams it prepares for.",
  },
  {
    q: "How do I join?",
    a: "With the class code your teacher or institute gives you, or an invitation link. Course outlines are open to everyone; lessons and practice need an account.",
  },
];

export default async function Home() {
  if (await currentUser()) redirect("/learn");

  const sections = allNodes.length;
  const exercises = allNodes.reduce((k, n) => k + n.steps.reduce((j, s) => j + (s.type === "exercises" ? s.items.length : 0), 0), 0);
  const examples = allNodes.reduce((k, n) => k + n.steps.filter((s) => s.type === "example").length, 0);
  const facts: [string, string][] = [
    [String(parts.length), "parts, from exam algebra to machine learning"],
    [String(course.units.length), "chapters"],
    [sections.toLocaleString("en-US"), "sections, each a complete lesson"],
    [exercises.toLocaleString("en-US"), `graded exercises and ${examples.toLocaleString("en-US")} worked examples`],
  ];

  return (
    <div className="-my-8">
      <Film />

      <div className="theme-dark full-bleed relative z-10 bg-black text-[#f5f5f7]">
        {/* Get started, by who you are */}
        <section aria-labelledby="start" className="mx-auto grid max-w-6xl items-start gap-14 px-6 py-28 md:grid-cols-[1.1fr_1fr] md:py-36">
          <Reveal>
            <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Turn hard mathematics into <em className="font-serif font-normal">marks.</em>
            </h2>
            <p className="mt-5 max-w-lg text-xl leading-relaxed text-[#86868b]">
              A complete course written like a good textbook, with figures you can move, practice that adapts to you, and a clear record of what you have mastered.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h3 id="start" className="text-lg font-semibold">
              Get started
            </h3>
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {[
                { href: "/signup", title: "Student", line: "I have a class code from my teacher or institute" },
                { href: "/login", title: "Teacher", line: "My school has invited me to teach on Eigen" },
                { href: "/courses", title: "Just looking", line: "Browse the course outlines first" },
              ].map((r) => (
                <li key={r.title}>
                  <Link href={r.href} className="group flex items-center justify-between gap-4 py-5">
                    <span>
                      <span className="block text-lg font-medium">{r.title}</span>
                      <span className="text-[15px] text-[#86868b]">{r.line}</span>
                    </span>
                    <span aria-hidden className="text-xl text-[#86868b] transition group-hover:translate-x-1 group-hover:text-white">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] text-[#86868b]">
              Already have an account?{" "}
              <Link href="/login" className="text-white underline underline-offset-4">
                Log in
              </Link>
            </p>
          </Reveal>
        </section>

        {/* What is in the book, counted from the book itself */}
        <section aria-label="Eigen in numbers" className="border-y border-white/10">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 py-14 md:grid-cols-4">
            {facts.map(([n, label]) => (
              <li key={label} className="pr-6">
                <span className="block font-serif text-[clamp(2rem,3.5vw,3rem)] leading-none tabular-nums">{n}</span>
                <span className="mt-2 block text-[15px] text-[#86868b]">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* A real lesson widget */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-28 md:grid-cols-[1fr_1.15fr] md:py-40">
          <Reveal>
            <p className="text-sm font-medium text-[#86868b]">Not a demo</p>
            <h2 className="mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">This is a real lesson.</h2>
            <p className="mt-5 text-xl leading-relaxed text-[#86868b]">
              The population below is wildly lopsided. Average a few values at a time, again and again, and <span className="text-white">a bell curve appears</span>. That&rsquo;s the
              central limit theorem, and you just discovered it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[28px] bg-[#161618] p-6 ring-1 ring-white/10 md:p-8">
              <WidgetView widget={{ kind: "clt" }} />
            </div>
          </Reveal>
        </section>

        {/* The courses */}
        <section aria-labelledby="courses" className="mx-auto max-w-6xl px-6 pb-28 md:pb-40">
          <Reveal>
            <h2 id="courses" className="text-[clamp(2.25rem,4.5vw,4rem)] font-semibold tracking-[-0.035em]">
              Explore the courses.
            </h2>
          </Reveal>
          <nav aria-label="Courses" className="mt-12">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {parts.map((p) => (
                <li key={p.track}>
                  <Link href={courseHref(p)} id={`course-${partSlug(p)}`} className="group grid gap-3 py-8 md:grid-cols-[16rem_1fr_auto] md:gap-10">
                    <span>
                      <span className="block text-sm text-[#86868b]">Part {p.roman}</span>
                      <span className="text-2xl font-semibold tracking-tight">{p.track}</span>
                      <span className="mt-1 block text-sm text-[#86868b]">
                        {p.units.length} chapters · {p.units.reduce((k, u) => k + u.nodes.length, 0)} sections
                      </span>
                    </span>
                    <span className="text-[15px] leading-7 text-[#86868b]">{p.units.map((u) => u.title).join(" · ")}</span>
                    <span aria-hidden className="hidden self-center text-2xl text-[#86868b] transition group-hover:translate-x-1 group-hover:text-white md:block">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* How it works */}
        <section aria-labelledby="how" className="border-t border-white/10">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 py-28 md:grid-cols-[1fr_1.4fr] md:py-36">
            <Reveal>
              <h2 id="how" className="text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                How Eigen works.
              </h2>
              <p className="mt-5 text-xl leading-relaxed text-[#86868b]">Read it, prove you can do it, keep it. The same three steps for every section in the book.</p>
            </Reveal>
            <ol className="divide-y divide-white/10 border-y border-white/10">
              {[
                ["Read the section", "Definitions, theorems with proofs, worked examples at three levels, and the errors examiners see most. Figures move when you drag them."],
                ["Practise until it is mastered", "Fresh questions every time, mixed with the ideas the section is built on. Three in a row makes it mastered; a mix-up gets named and fixed."],
                ["Keep it", "Mastered sections return for review on a widening schedule. Chapter tests and mock exams show exactly what to go back to."],
              ].map(([t, b], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 py-7">
                  <span className="font-serif text-3xl leading-none text-[#86868b] tabular-nums">{i + 1}</span>
                  <span>
                    <span className="block text-xl font-semibold">{t}</span>
                    <span className="mt-2 block text-[15px] leading-7 text-[#86868b]">{b}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* For students, teachers, schools */}
        <section aria-labelledby="for" className="mx-auto max-w-6xl px-6 pb-28 md:pb-36">
          <h2 id="for" className="mb-10 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold tracking-[-0.035em]">
            For students, teachers and schools.
          </h2>
          <AudienceTabs audiences={AUDIENCES} />
        </section>

        {/* Questions */}
        <section aria-labelledby="faq" className="border-t border-white/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-28 md:grid-cols-[1fr_1.4fr] md:py-36">
            <h2 id="faq" className="text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Questions, answered.
            </h2>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {FAQ.map((f) => (
                <li key={f.q}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                      <h3>{f.q}</h3>
                      <span aria-hidden className="text-2xl text-[#86868b] transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#86868b]">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Close */}
        <section className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-6 py-24">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.035em]">Start with your class code.</h2>
              <p className="mt-3 text-lg text-[#86868b]">Your teacher or institute will have given you one.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/signup" className="rounded-full bg-white px-6 py-2.5 font-medium text-black transition hover:bg-white/90 active:scale-[0.97]">
                Get started
              </Link>
              <Link href="/courses" className="rounded-full border border-white/30 px-6 py-2.5 font-medium transition hover:bg-white/10 active:scale-[0.97]">
                Browse courses
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
