import Link from "next/link";
import { notFound } from "next/navigation";
import { allNodes, course, getNode } from "@/lib/content";
import { introFor } from "@/lib/content/intro";
import { LessonIntro } from "@/components/intro/LessonIntro";

/** Development-only preview of a lesson's intro (no account needed). 404s in production. */
export default async function IntroPreview({ params }: { params: Promise<{ nodeId: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const node = getNode((await params).nodeId);
  if (!node) notFound();
  const unit = course.units.find((u) => u.nodes.includes(node))!;
  const motivate = node.steps.find((s) => s.type === "motivate");
  const i = allNodes.indexOf(node);
  return (
    <>
      <LessonIntro
        spec={introFor(node)}
        kicker={`${unit.track} · ${unit.title}`}
        title={node.title}
        question={motivate?.type === "motivate" ? motivate.title : node.title}
        questionBody={motivate?.type === "motivate" ? motivate.body : ""}
        idea={node.summary}
      />
      <div id="lesson" className="flex justify-between py-10 text-sm">
        {i > 0 ? <Link href={`/dev/intro/${allNodes[i - 1].id}`}>← {allNodes[i - 1].title}</Link> : <span />}
        <code>{JSON.stringify(introFor(node)).slice(0, 80)}</code>
        {i < allNodes.length - 1 ? <Link href={`/dev/intro/${allNodes[i + 1].id}`}>{allNodes[i + 1].title} →</Link> : <span />}
      </div>
    </>
  );
}
