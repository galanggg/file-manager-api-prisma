import { PrismaClient } from "@prisma/client"

export function prismaClient() {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
  return prisma
}
