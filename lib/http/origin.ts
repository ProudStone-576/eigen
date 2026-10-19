import "server-only";
import { headers } from "next/headers";

/** The site's public origin, for links people share (join links, invitations). */
export async function siteOrigin(): Promise<string> {
  const fixed = process.env.SITE_URL?.replace(/\/+$/, "");
  if (fixed) return fixed;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
