/**
 * Rate-limit policies, and the fixed-window arithmetic behind them. Pure; the
 * database counter lives in rateLimit.ts.
 */

export type Policy = { limit: number; windowSec: number };

export const POLICIES = {
  /** Per IP: stops password spraying across many accounts. */
  loginIp: { limit: 30, windowSec: 15 * 60 },
  /** Per email: complements the account lockout. */
  loginEmail: { limit: 10, windowSec: 15 * 60 },
  signupIp: { limit: 10, windowSec: 60 * 60 },
  /** Guessing class codes. */
  joinIp: { limit: 20, windowSec: 15 * 60 },
  /** Graded answers per user: generous for real study, stops scripted flooding. */
  answerUser: { limit: 900, windowSec: 60 * 60 },
  examUser: { limit: 30, windowSec: 60 * 60 },
  /** Administrative writes (invites, role changes, classes) per user. */
  adminUser: { limit: 120, windowSec: 60 * 60 },
} satisfies Record<string, Policy>;

export type Window = { count: number; resetAt: Date };

/** The counter after one more hit: a fresh window if the old one has ended. */
export function nextWindow(prev: Window | null, policy: Policy, now = new Date()): Window {
  if (!prev || prev.resetAt <= now) return { count: 1, resetAt: new Date(now.getTime() + policy.windowSec * 1000) };
  return { count: prev.count + 1, resetAt: prev.resetAt };
}

export const allowed = (w: Window, policy: Policy) => w.count <= policy.limit;

/** "3 minutes" / "1 minute" until the window resets (at least 1). */
export function retryIn(w: Window, now = new Date()): string {
  const m = Math.max(1, Math.ceil((w.resetAt.getTime() - now.getTime()) / 60_000));
  return `${m} minute${m === 1 ? "" : "s"}`;
}
