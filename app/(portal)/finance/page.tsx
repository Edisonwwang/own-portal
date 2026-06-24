import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { db } from "@/lib/db";

type FinanceEntry = {
  id: number;
  type: "income" | "expense";
  amount: number;
  currency: string;
  category: string | null;
  description: string | null;
  created_at: string;
};

type Totals = {
  income: number | null;
  expense: number | null;
};

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function FinancePage() {
  const entries = db
    .prepare("SELECT id, type, amount, currency, category, description, created_at FROM finance_entries ORDER BY created_at DESC LIMIT 30")
    .all() as FinanceEntry[];
  const totals = db
    .prepare(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
       FROM finance_entries
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    )
    .get() as Totals;

  return (
    <>
      <PageHeader title="Finance" description="The most recent 30 finance logs, newest first." />
      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Income this month</p>
          <p className="mt-2 text-xl font-semibold text-emerald-300">{(totals.income ?? 0).toFixed(2)} MYR</p>
        </div>
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Expenses this month</p>
          <p className="mt-2 text-xl font-semibold text-red-300">{(totals.expense ?? 0).toFixed(2)} MYR</p>
        </div>
      </section>
      <div className="space-y-4">
        {entries.length === 0 ? <p className="text-sm text-stone-500">No finance logs yet.</p> : null}
        {entries.map((entry) => (
          <EntryCard key={entry.id} meta={formatDate(entry.created_at)}>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs capitalize ${
                  entry.type === "income" ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"
                }`}
              >
                {entry.type}
              </span>
              <span>
                {entry.amount.toFixed(2)} {entry.currency}
              </span>
              {entry.category ? <span className="text-stone-400">- {entry.category}</span> : null}
              {entry.description ? <span className="text-stone-400">- {entry.description}</span> : null}
            </div>
          </EntryCard>
        ))}
      </div>
    </>
  );
}
