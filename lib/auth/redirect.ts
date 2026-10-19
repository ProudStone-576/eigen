/**
 * Where to send someone after logging in. Only same-site paths are accepted:
 * "//evil.com" and "/\evil.com" are protocol-relative URLs to another host.
 */
export function safeNext(next: unknown, fallback = "/learn"): string {
  if (typeof next !== "string" || next.length > 200) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(next)) return fallback;
  return next;
}
