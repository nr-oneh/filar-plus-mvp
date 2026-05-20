import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function buildDatasourceUrl() {
  const url = process.env.DATABASE_URL ?? ""
  if (!url) return url
  // Supabase transaction pooler (port 6543) requires pgbouncer=true to
  // disable prepared statements, which pgbouncer transaction mode rejects.
  if (!url.includes("pgbouncer=true")) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true"
  }
  return url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: buildDatasourceUrl(),
    log: ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
