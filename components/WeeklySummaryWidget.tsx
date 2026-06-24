import type { WeeklySummary } from "@/lib/types";

function formatScore(value: number | null) {
  return value === null ? "-" : value.toFixed(1);
}

function formatMoney(value: number) {
  return `MYR ${Math.abs(value).toFixed(2)}`;
}

export function WeeklySummaryWidget({ summary }: { summary: WeeklySummary }) {
  const net = summary.total_income - summary.total_expenses;
  const progress = Math.min(Math.max(summary.journal_days, 0), 7) / 7;

  return (
    <section className="mb-8 rounded-lg border border-stone-800 bg-[#111111]">
      <div className="grid divide-y divide-stone-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Avg mood</p>
          <p className="mt-2 text-2xl font-semibold text-stone-100">{formatScore(summary.avg_mood)}</p>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Avg energy</p>
          <p className="mt-2 text-2xl font-semibold text-stone-100">{formatScore(summary.avg_energy)}</p>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Net this week</p>
          <p className={`mt-2 text-2xl font-semibold ${net >= 0 ? "text-emerald-300" : "text-red-300"}`}>
            {net < 0 ? "-" : ""}
            {formatMoney(net)}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Spent MYR {summary.total_expenses.toFixed(2)}
          </p>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">Journal</p>
          <p className="mt-2 text-2xl font-semibold text-stone-100">{summary.journal_days}/7 days</p>
          <div className="mt-3 h-1.5 rounded-full bg-stone-800">
            <div className="h-1.5 rounded-full bg-amber-300" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
