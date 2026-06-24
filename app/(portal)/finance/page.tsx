import { FinanceBarChart } from "@/components/charts/FinanceBarChart";
import { SpendingPieChart } from "@/components/charts/SpendingPieChart";
import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getFinanceByMonth, getMonthlyFinanceTotals, getRecentFinanceEntries, getSpendingByCategory } from "@/lib/queries";

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function FinancePage() {
  const entries = getRecentFinanceEntries(30);
  const totals = getMonthlyFinanceTotals();
  const monthlyData = getFinanceByMonth(6);
  const categorySpend = getSpendingByCategory();

  return (
    <>
      <PageHeader title="Finance" description="The most recent 30 finance logs, newest first." />
      <section className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Income this month</p>
          <p className="mt-2 text-xl font-semibold text-emerald-300">{totals.income.toFixed(2)} MYR</p>
        </div>
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Expenses this month</p>
          <p className="mt-2 text-xl font-semibold text-red-300">{totals.expenses.toFixed(2)} MYR</p>
        </div>
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Net this month</p>
          <p className={`mt-2 text-xl font-semibold ${totals.net >= 0 ? "text-emerald-300" : "text-red-300"}`}>
            {totals.net.toFixed(2)} MYR
          </p>
        </div>
      </section>
      <section className="mb-6 rounded-lg border border-stone-800 bg-[#111111] p-4">
        <h2 className="mb-4 text-lg font-medium text-stone-100">Last 6 months</h2>
        <FinanceBarChart data={monthlyData} />
      </section>
      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
          <h2 className="mb-4 text-lg font-medium text-stone-100">Spending by category</h2>
          <SpendingPieChart data={categorySpend} />
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
