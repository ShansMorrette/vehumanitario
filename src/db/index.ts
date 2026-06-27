import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/*
 * Lazy database connection.
 * The pool + drizzle client are created on first access, NOT at import time.
 * This prevents build-time errors on platforms like Netlify / Vercel where
 * DATABASE_URL may not be set during `next build`.
 */

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzle?: NodePgDatabase;
};

function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) {
    return globalForDb.__arenaNextJsPostgresqlPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  return pool;
}

function getDb(): NodePgDatabase {
  if (globalForDb.__arenaNextJsDrizzle) {
    return globalForDb.__arenaNextJsDrizzle;
  }

  const instance = drizzle(getPool());

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsDrizzle = instance;
  }

  return instance;
}

/**
 * Use `db` in API routes and server components.
 * The connection is established lazily on first property access.
 */
export const db: NodePgDatabase = new Proxy({} as NodePgDatabase, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realDb);
    }
    return value;
  },
});

/** Access the underlying pg Pool if needed (also lazy). */
export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const realPool = getPool();
    const value = Reflect.get(realPool, prop, receiver);
    if (typeof value === "function") {
      return value.bind(realPool);
    }
    return value;
  },
});
