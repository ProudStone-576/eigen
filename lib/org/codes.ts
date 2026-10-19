import { createHash, randomBytes, randomInt } from "node:crypto";

/**
 * Class join codes and invitation tokens.
 *
 * Join codes are short and typed by students, so they avoid look-alike
 * characters (0/O, 1/I/L) and are compared after normalising case, spaces and
 * dashes. Invitation tokens are long random strings sent as links; only their
 * hash is stored.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const JOIN_CODE_LENGTH = 6;

export function newJoinCode(): string {
  let code = "";
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return code;
}

/** What the student typed, to the stored form: "k7q 4mz" and "K7Q-4MZ" both become "K7Q4MZ". */
export const normaliseCode = (input: string) => input.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Display form: "K7Q4MZ" -> "K7Q-4MZ". */
export const formatCode = (code: string) => (code.length === 6 ? `${code.slice(0, 3)}-${code.slice(3)}` : code);

export const newToken = () => randomBytes(24).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** A slug from an organisation name: "St. Xavier's Academy" -> "st-xaviers-academy". */
export function slugify(name: string): string {
  const s = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return s || "org";
}

export type InvitationState = "active" | "expired" | "used" | "revoked";

export function invitationState(inv: { expiresAt: Date; revokedAt: Date | null; uses: number; maxUses: number }, now = new Date()): InvitationState {
  if (inv.revokedAt) return "revoked";
  if (inv.uses >= inv.maxUses) return "used";
  if (inv.expiresAt <= now) return "expired";
  return "active";
}
