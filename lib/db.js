import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const globalForDb = globalThis;

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS otp_codes (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    purpose TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    pincode TEXT NOT NULL,
    locality TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL,
    landmark TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    address JSONB NOT NULL,
    payment TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS otp_email_idx ON otp_codes (email, purpose, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS addresses_user_idx ON addresses (user_id)`,
  `CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC)`,
];

function postgresConfig(connectionString) {
  const url = new URL(connectionString);
  const sslmode = url.searchParams.get("sslmode") || "";
  url.searchParams.delete("sslmode");
  const aiven = url.hostname.endsWith(".aivencloud.com");
  const needsSsl = aiven || (sslmode !== "" && sslmode !== "disable");
  const config = { connectionString: url.toString() };
  if (!needsSsl) return config;

  const caPath = process.env.DATABASE_CA_PATH;
  config.ssl = caPath
    ? { rejectUnauthorized: true, ca: readFileSync(caPath, "utf8") }
    : { rejectUnauthorized: false };
  return config;
}

async function openDatabase() {
  if (process.env.DATABASE_URL) {
    const pool = new Pool(postgresConfig(process.env.DATABASE_URL));
    return {
      kind: "pg",
      async query(text, params = []) {
        return pool.query(text, params);
      },
    };
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = path.join(process.cwd(), ".data", "pg");
  mkdirSync(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
  return {
    kind: "pglite",
    async query(text, params = []) {
      return db.query(text, params);
    },
  };
}

async function readyDatabase() {
  const database = await openDatabase();
  for (const statement of statements) {
    await database.query(statement);
  }
  return database;
}

function getDatabase() {
  if (!globalForDb.__wearvelthoDb) {
    globalForDb.__wearvelthoDb = readyDatabase().catch((error) => {
      globalForDb.__wearvelthoDb = undefined;
      throw error;
    });
  }
  return globalForDb.__wearvelthoDb;
}

export async function query(text, params = []) {
  const db = await getDatabase();
  return db.query(text, params);
}

export function jsonValue(value) {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
