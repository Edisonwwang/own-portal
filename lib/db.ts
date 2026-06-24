import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "data", "portal.db");

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

type TableColumn = {
  name: string;
  notnull: 0 | 1;
};

function getColumns(database: Database.Database, tableName: string) {
  return database.prepare(`PRAGMA table_info(${tableName})`).all() as TableColumn[];
}

function migrateMoodEntries(database: Database.Database) {
  const columns = getColumns(database, "mood_entries");
  const entryIdColumn = columns.find((column) => column.name === "entry_id");
  const hasEnergyScore = columns.some((column) => column.name === "energy_score");

  if (columns.length > 0 && (entryIdColumn?.notnull === 1 || !hasEnergyScore)) {
    database.exec(`
      CREATE TABLE mood_entries_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entry_id INTEGER REFERENCES entries(id),
        mood_score INTEGER CHECK(mood_score BETWEEN 1 AND 10),
        energy_score INTEGER CHECK(energy_score BETWEEN 1 AND 10),
        note TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT INTO mood_entries_new (id, entry_id, mood_score, energy_score, note, created_at)
      SELECT id, entry_id, mood_score, NULL, note, created_at FROM mood_entries;

      DROP TABLE mood_entries;
      ALTER TABLE mood_entries_new RENAME TO mood_entries;
    `);
  }
}

function migrateFinanceEntries(database: Database.Database) {
  const columns = getColumns(database, "finance_entries");
  const entryIdColumn = columns.find((column) => column.name === "entry_id");
  const hasCurrency = columns.some((column) => column.name === "currency");

  if (columns.length > 0 && (entryIdColumn?.notnull === 1 || !hasCurrency)) {
    database.exec(`
      CREATE TABLE finance_entries_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entry_id INTEGER REFERENCES entries(id),
        type TEXT CHECK(type IN ('income','expense')) NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'MYR',
        category TEXT,
        description TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      INSERT INTO finance_entries_new (id, entry_id, type, amount, currency, category, description, created_at)
      SELECT id, entry_id, type, amount, 'MYR', category, description, created_at FROM finance_entries;

      DROP TABLE finance_entries;
      ALTER TABLE finance_entries_new RENAME TO finance_entries;
    `);
  }
}

function initSchema(database: Database.Database) {
  database.exec(`
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
      entry_id INTEGER REFERENCES entries(id),
      mood_score INTEGER CHECK(mood_score BETWEEN 1 AND 10),
      energy_score INTEGER CHECK(energy_score BETWEEN 1 AND 10),
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS finance_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER REFERENCES entries(id),
      type TEXT CHECK(type IN ('income','expense')) NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'MYR',
      category TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  migrateMoodEntries(database);
  migrateFinanceEntries(database);
}

export function getDb() {
  if (!globalThis.__db) {
    const dbPath = path.resolve(DB_PATH);
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    globalThis.__db = new Database(dbPath);
    globalThis.__db.pragma("journal_mode = WAL");
    globalThis.__db.pragma("foreign_keys = ON");
    initSchema(globalThis.__db);
  }

  return globalThis.__db;
}

export const db = getDb();

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
