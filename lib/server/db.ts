import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalDb = globalThis as unknown as { catlinkDb?: PrismaClient };
export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("Database not configured");
  if (!globalDb.catlinkDb) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      max: 5,
    });
    globalDb.catlinkDb = new PrismaClient({ adapter });
  }
  return globalDb.catlinkDb;
}
