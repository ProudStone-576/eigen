import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Neon's serverless driver talks to Postgres over WebSockets (port 443), not raw TCP 5432.
// Works on serverless hosts and on networks that block 5432. Node 20 has no global WebSocket.
neonConfig.webSocketConstructor = ws;

function createClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

// One client per process. Dev hot-reload would otherwise open a new pool per edit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
