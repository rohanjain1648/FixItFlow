import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
const dbPath = rawUrl.startsWith("file:") ? rawUrl.replace("file:", "") : rawUrl;
const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath.replace(/^\.\//, ""));

const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
