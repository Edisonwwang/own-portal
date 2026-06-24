import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_DB_PATH = "./data/portal.db";

let db: Database.Database | undefined;

function resolveDbPath() {
  return path.resolve(process.env.DB_PATH || DEFAULT_DB_PATH);
}

function initSchema(database: Database.Database) {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS entries_fts USING fts5(
      raw_text,
      content='entries',
      content_rowid='id'
    );

    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL REFERENCES entries(id),
      mood_score INTEGER CHECK(mood_score BETWEEN 1 AND 10),
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS finance_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL REFERENCES entries(id),
      type TEXT CHECK(type IN ('income','expense')) NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function getDb() {
  if (!db) {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);
    initSchema(db);
  }

  return db;
}

export function checkDbConnection() {
  return getDb().prepare("SELECT 1 AS ok").get() as { ok: number };
}

export function getRowCounts() {
  const database = getDb();

  return {
    entries: database.prepare("SELECT COUNT(*) AS count FROM entries").get() as { count: number },
    mood_entries: database.prepare("SELECT COUNT(*) AS count FROM mood_entries").get() as { count: number },
    finance_entries: database.prepare("SELECT COUNT(*) AS count FROM finance_entries").get() as { count: number }
  };
}
