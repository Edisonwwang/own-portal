import { db } from "./db";
import type {
  CategorySpend,
  FinanceEntry,
  FinanceMonthPoint,
  FinanceTotals,
  JournalEntry,
  MoodDataPoint,
  MoodEntry,
  WeeklySummary
} from "./types";

type FinanceMonthRow = {
  month_key: string;
  income: number | null;
  expenses: number | null;
};

type WeeklyMoodRow = {
  avg_mood: number | null;
  avg_energy: number | null;
};

type WeeklyFinanceRow = {
  total_income: number | null;
  total_expenses: number | null;
};

type WeeklyJournalRow = {
  journal_days: number | null;
};

export function getRecentJournalEntries(limit = 30): JournalEntry[] {
  return db
    .prepare("SELECT id, raw_text, created_at FROM entries ORDER BY created_at DESC LIMIT ?")
    .all(limit) as JournalEntry[];
}

export function getRecentMoodEntries(limit = 30): MoodEntry[] {
  return db
    .prepare("SELECT id, mood_score, energy_score, note, created_at FROM mood_entries ORDER BY created_at DESC LIMIT ?")
    .all(limit) as MoodEntry[];
}

export function getRecentFinanceEntries(limit = 30): FinanceEntry[] {
  return db
    .prepare(
      "SELECT id, type, amount, currency, category, description, created_at FROM finance_entries ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as FinanceEntry[];
}

export function getTodaysMoodEntries(): MoodEntry[] {
  return db
    .prepare(
      "SELECT id, mood_score, energy_score, note, created_at FROM mood_entries WHERE date(created_at) = date('now') ORDER BY created_at DESC"
    )
    .all() as MoodEntry[];
}

export function getTodaysFinanceEntries(): FinanceEntry[] {
  return db
    .prepare(
      "SELECT id, type, amount, currency, category, description, created_at FROM finance_entries WHERE date(created_at) = date('now') ORDER BY created_at DESC"
    )
    .all() as FinanceEntry[];
}

export function getMonthlyFinanceTotals(): FinanceTotals {
  const row = db
    .prepare(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
       FROM finance_entries
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    )
    .get() as { income: number | null; expenses: number | null };
  const income = row.income ?? 0;
  const expenses = row.expenses ?? 0;

  return {
    income,
    expenses,
    net: income - expenses
  };
}

export function getMoodTrend(days = 30): MoodDataPoint[] {
  return db
    .prepare(
      `SELECT
        strftime('%d %b', created_at) AS day,
        ROUND(AVG(mood_score), 1) AS avg_mood,
        ROUND(AVG(energy_score), 1) AS avg_energy,
        COUNT(*) AS entry_count
      FROM mood_entries
      WHERE created_at >= date('now', $offset)
      GROUP BY date(created_at)
      ORDER BY date(created_at) ASC`
    )
    .all({ offset: `-${days} days` }) as MoodDataPoint[];
}

export function getFinanceByMonth(months = 6): FinanceMonthPoint[] {
  const rows = db
    .prepare(
      `SELECT
        strftime('%Y-%m', created_at) AS month_key,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM finance_entries
      WHERE created_at >= date('now', $offset)
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month_key ASC`
    )
    .all({ offset: `-${months} months` }) as FinanceMonthRow[];

  return rows.map((row) => {
    const income = row.income ?? 0;
    const expenses = row.expenses ?? 0;

    return {
      month: formatMonthKey(row.month_key),
      income,
      expenses,
      net: income - expenses
    };
  });
}

export function getSpendingByCategory(): CategorySpend[] {
  return db
    .prepare(
      `SELECT
        COALESCE(NULLIF(TRIM(category), ''), 'Other') AS category,
        ROUND(SUM(amount), 2) AS total
      FROM finance_entries
      WHERE type = 'expense'
        AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
      GROUP BY category
      ORDER BY total DESC`
    )
    .all() as CategorySpend[];
}

export function getWeeklySummary(): WeeklySummary {
  const moodRow = db
    .prepare(
      `SELECT
        ROUND(AVG(mood_score), 1) AS avg_mood,
        ROUND(AVG(energy_score), 1) AS avg_energy
      FROM mood_entries
      WHERE date(created_at) >= date('now', 'weekday 1', '-7 days')`
    )
    .get() as WeeklyMoodRow;

  const financeRow = db
    .prepare(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
      FROM finance_entries
      WHERE date(created_at) >= date('now', 'weekday 1', '-7 days')`
    )
    .get() as WeeklyFinanceRow;

  const journalRow = db
    .prepare(
      `SELECT COUNT(DISTINCT date(created_at)) AS journal_days
      FROM entries
      WHERE date(created_at) >= date('now', 'weekday 1', '-7 days')`
    )
    .get() as WeeklyJournalRow;

  return {
    avg_mood: moodRow.avg_mood ?? null,
    avg_energy: moodRow.avg_energy ?? null,
    total_income: financeRow.total_income ?? 0,
    total_expenses: financeRow.total_expenses ?? 0,
    journal_days: journalRow.journal_days ?? 0
  };
}

function formatMonthKey(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return `${date.toLocaleString("en", { month: "short" })} ${year.slice(2)}`;
}
