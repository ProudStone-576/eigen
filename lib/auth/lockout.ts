import { randomInt } from "node:crypto";

/** After this many wrong passwords in a row, the account locks for a while. */
export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 15;

export function isLocked(lockedUntil: Date | null, now = new Date()): boolean {
  return !!lockedUntil && lockedUntil > now;
}

/** State after one more wrong password. The counter resets when it triggers a lock. */
export function afterFailedLogin(failedLogins: number, now = new Date()): { failedLogins: number; lockedUntil: Date | null } {
  const n = failedLogins + 1;
  if (n >= MAX_FAILED_LOGINS) return { failedLogins: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) };
  return { failedLogins: n, lockedUntil: null };
}

export const minutesLeft = (lockedUntil: Date, now = new Date()) => Math.max(1, Math.ceil((lockedUntil.getTime() - now.getTime()) / 60_000));

const WORDS = ["amber", "birch", "cobalt", "delta", "ember", "fjord", "garnet", "harbor", "indigo", "juniper", "kelp", "lumen", "maple", "nebula", "onyx", "pixel", "quartz", "river", "sable", "tundra", "umber", "vector", "willow", "zephyr"];

/**
 * A temporary password a teacher can read out: two words and four digits
 * (5.76 million combinations). Acceptable because it only lasts until the
 * student's first login, which forces a change, and the lockout caps guessing
 * at 5 tries per 15 minutes.
 */
export function temporaryPassword(): string {
  const w = () => WORDS[randomInt(WORDS.length)];
  return `${w()}-${w()}-${String(randomInt(10_000)).padStart(4, "0")}`;
}
