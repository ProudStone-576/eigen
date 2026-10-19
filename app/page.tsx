import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";

const FEATURES = [
  { icon: "🎛️", title: "Play first", body: "Drag vectors, bend the grid, watch a matrix move the whole plane before you ever see a formula." },
  { icon: "🎯", title: "Predict, then see", body: "Commit to a guess, watch what really happens, and untangle the mix-up yourself. That's what makes it stick." },
  { icon: "✍️", title: "Produce, don't recognise", body: "A concept only turns solid when you produce the answer unaided: typed math, vectors, matrices." },
  { icon: "🔁", title: "Review that spaces out", body: "Solid ideas come back after 1, 2, 4, 8… days. Miss one and it comes back tomorrow." },
  { icon: "🤖", title: "Why ML cares", body: "Every concept ends with where it shows up in real models: layers, gradients, PCA." },
  { icon: "🗺️", title: "A map, not a list", body: "Concepts unlock as their foundations land, so you never build on sand." },
];

export default async function Home() {
  if (await currentUser()) redirect("/learn");
  return (
    <div className="space-y-14 py-6">
      <section className="text-center space-y-5">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          The math behind ML,
          <br />
          <span className="text-[var(--accent)]">learned by playing with it.</span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
          Linear algebra and statistics for machine learning, built from ideas you already hold, one concept at a time.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/signup" className="btn">Join with an invite code</Link>
          <Link href="/login" className="btn-ghost">Log in</Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card">
            <p className="text-2xl">{f.icon}</p>
            <h2 className="mt-2 font-bold">{f.title}</h2>
            <p className="mt-1 text-[var(--muted)]">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
