import "server-only";
import { currentContext } from "@/lib/auth/context";
import { opensEverySection } from "@/lib/auth/permissions";
import { loadProgress, statusIn, unlocked } from "@/lib/learning/progress";
import type { CellState } from "@/components/course/Mastery";

/**
 * Who is looking at a public course page. Signed-out visitors see every
 * section as not started, and its links ask them to log in first.
 */
export async function viewer(): Promise<{ signedIn: boolean; state: (id: string) => CellState; lessonHref: (id: string) => string }> {
  const ctx = await currentContext();
  if (!ctx) return { signedIn: false, state: () => "UNKNOWN", lessonHref: (id) => `/login?next=${encodeURIComponent(`/learn/${id}`)}` };
  const lessonHref = (id: string) => `/learn/${id}`;
  if (!ctx.org || !ctx.role) return { signedIn: true, state: () => "UNKNOWN", lessonHref };
  const openAll = opensEverySection(ctx.role, ctx.user.platformAdmin);
  const progress = await loadProgress(ctx.user.id);
  const status = statusIn(progress);
  return { signedIn: true, state: (id) => (unlocked(id, progress, openAll) ? status(id) : "LOCKED"), lessonHref };
}
