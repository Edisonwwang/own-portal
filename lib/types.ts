export type JournalEntry = {
  id: number;
  raw_text: string;
  created_at: string;
};

export type MoodEntry = {
  id: number;
  mood_score: number | null;
  energy_score: number | null;
  note: string | null;
  created_at: string;
};

export type FinanceEntry = {
  id: number;
  type: "income" | "expense";
  amount: number;
  currency: string;
  category: string | null;
  description: string | null;
  created_at: string;
};

export type FinanceTotals = {
  income: number;
  expenses: number;
  net: number;
};

export type MoodDataPoint = {
  day: string;
  avg_mood: number;
  avg_energy: number;
  entry_count: number;
};

export type FinanceMonthPoint = {
  month: string;
  income: number;
  expenses: number;
  net: number;
};

export type CategorySpend = {
  category: string;
  total: number;
};

export type WeeklySummary = {
  avg_mood: number | null;
  avg_energy: number | null;
  total_income: number;
  total_expenses: number;
  journal_days: number;
};
