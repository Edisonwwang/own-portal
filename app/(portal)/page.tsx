import { FinanceForm } from "@/components/forms/FinanceForm";
import { JournalForm } from "@/components/forms/JournalForm";
import { MoodForm } from "@/components/forms/MoodForm";
import { EntryCard } from "@/components/ui/EntryCard";
import { OnThisDayWidget } from "@/components/OnThisDayWidget";
import { TagChip } from "@/components/tags/TagChip";
import { PageHeader } from "@/components/ui/PageHeader";
import { WeeklySummaryWidget } from "@/components/WeeklySummaryWidget";
import {
  getAllTags,
  getOnThisDay,
  getRecentEntries,
  getTodaysFinanceEntries,
  getTodaysMoodEntries,
  getWeeklySummary
} from "@/lib/queries";
import Link from "next/link";

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function HomePage() {
  const weeklySummary = getWeeklySummary();
  const onThisDayEntries = getOnThisDay();
  const journalEntries = getRecentEntries(5);
  const moodEntries = getTodaysMoodEntries();
  const financeEntries = getTodaysFinanceEntries();
  const recentTags = getAllTags(5);

  const todayLog = [
    ...moodEntries.map((entry) => ({ kind: "Mood" as const, created_at: entry.created_at, entry })),
    ...financeEntries.map((entry) => ({ kind: "Finance" as const, created_at: entry.created_at, entry }))
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <>
      <PageHeader title="Home" description="Capture the day without turning it into a dashboard." />
      <WeeklySummaryWidget summary={weeklySummary} />
      <OnThisDayWidget entries={onThisDayEntries} />

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-stone-100">Journal</h2>
          <Link href="/journal" className="text-sm text-amber-200 hover:text-amber-100">
            View all
          </Link>
        </div>
        <JournalForm />
        <div className="space-y-3">
          {journalEntries.length === 0 ? <p className="text-sm text-stone-500">No journal entries yet.</p> : null}
          {journalEntries.map((entry) => (
            <EntryCard key={entry.id} meta={formatDate(entry.created_at)}>
              <p className="line-clamp-2 whitespace-pre-wrap">{entry.raw_text}</p>
              {entry.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <TagChip key={tag.id} tag={tag} href={`/journal?tag=${tag.id}`} />
                  ))}
                </div>
              ) : null}
            </EntryCard>
          ))}
        </div>
        {recentTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
            <span>Tags:</span>
            {recentTags.map((tag) => (
              <TagChip key={tag.id} tag={tag} href={`/journal?tag=${tag.id}`} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-lg font-medium text-stone-100">Today</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
            <h3 className="mb-4 text-sm font-medium text-stone-300">Mood</h3>
            <MoodForm />
          </div>
          <div className="rounded-lg border border-stone-800 bg-[#111111] p-4">
            <h3 className="mb-4 text-sm font-medium text-stone-300">Finance</h3>
            <FinanceForm />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-5 text-lg font-medium text-stone-100">Today log</h2>
        <div className="space-y-3">
          {todayLog.length === 0 ? <p className="text-sm text-stone-500">Nothing logged today.</p> : null}
          {todayLog.map((item) => (
            <EntryCard key={`${item.kind}-${item.entry.id}`} title={item.kind} meta={formatDate(item.created_at)}>
              {item.kind === "Mood" ? (
                <p>
                  Mood {item.entry.mood_score ?? "-"} / Energy {item.entry.energy_score ?? "-"}
                  {item.entry.note ? <span className="text-stone-400"> - {item.entry.note}</span> : null}
                </p>
              ) : (
                <p>
                  <span className={item.entry.type === "income" ? "text-emerald-300" : "text-red-300"}>
                    {item.entry.type}
                  </span>{" "}
                  {item.entry.amount.toFixed(2)} {item.entry.currency}
                  {item.entry.category ? <span className="text-stone-400"> - {item.entry.category}</span> : null}
                </p>
              )}
            </EntryCard>
          ))}
        </div>
      </section>
    </>
  );
}
