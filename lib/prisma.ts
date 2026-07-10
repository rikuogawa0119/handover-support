import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

// Only instantiate the client when a DATABASE_URL is configured. Prisma tries to
// load its query engine as soon as the client is constructed, and doing that with
// no DB configured (e.g. Supabase outage / local UI work) crashes the dev server.
export const prisma = (hasDatabaseUrl()
  ? (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    }))
  : (new Proxy(
      {},
      {
        get() {
          throw new Error("prisma client used without DATABASE_URL set");
        }
      }
    ) as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production" && hasDatabaseUrl()) {
  globalForPrisma.prisma = prisma;
}
