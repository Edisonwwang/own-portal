import { getRowCounts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const counts = getRowCounts();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-950">Personal Portal</h1>
      <p className="mt-2 text-slate-600">Phase 1 skeleton is running and connected to SQLite.</p>

      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-medium text-slate-950">Database row counts</h2>
        </div>
        <dl className="divide-y divide-slate-200">
          {Object.entries(counts).map(([tableName, row]) => (
            <div key={tableName} className="flex items-center justify-between px-4 py-3">
              <dt className="font-mono text-sm text-slate-700">{tableName}</dt>
              <dd className="text-sm font-semibold text-slate-950">{row.count}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
