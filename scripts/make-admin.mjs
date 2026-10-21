// Make an existing account a platform admin (or revoke it).
//
//   npm run make-admin -- you@example.com
//   npm run make-admin -- you@example.com --revoke
//
// Platform admins see the Platform console and open every section of the book
// regardless of prerequisites. The account must already exist: sign up first.
// Uses DATABASE_URL from the environment, .env.local or .env, so it changes
// whichever database that points at.

import { existsSync, readFileSync } from "node:fs";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"))?.trim().toLowerCase();
const revoke = args.includes("--revoke");
if (!email) {
  console.error("Usage: npm run make-admin -- you@example.com [--revoke]");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (environment, .env.local or .env).");
  process.exit(1);
}

neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });

try {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, platformAdmin: true, _count: { select: { memberships: true } } },
  });
  if (!user) {
    console.error(`No account for ${email}. Sign up with it first, then run this again.`);
    process.exit(1);
  }
  await prisma.user.update({ where: { id: user.id }, data: { platformAdmin: !revoke } });
  console.log(`${user.email} is ${revoke ? "no longer" : "now"} a platform admin.`);
  if (!revoke && user._count.memberships === 0) {
    console.log("It isn't a member of any organisation yet; join one (a class code or invitation) to open the book.");
  }
} finally {
  await prisma.$disconnect();
}
