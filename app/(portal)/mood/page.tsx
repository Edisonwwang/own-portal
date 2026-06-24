import { MoodTrendChart } from "@/components/charts/MoodTrendChart";
import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMoodTrend, getRecentMoodEntries } from "@/lib/queries";

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function MoodPage() {
  const trend = getMoodTrend(30);
  const entries = getRecentMoodEntries(30);

  return (
    <>
      <PageHeader title="Mood" description="The most recent 30 mood logs, newest first." />
      <section className="mb-8 rounded-lg border border-stone-800 bg-[#111111] p-4">
        <h2 className="mb-4 text-lg font-medium text-stone-100">Last 30 days</h2>
        <MoodTrendChart data={trend} />
      </section>
      <div className="space-y-4">
        {entries.length === 0 ? <p className="text-sm text-stone-500">No mood logs yet.</p> : null}
        {entries.map((entry) => (
          <EntryCard key={entry.id} meta={formatDate(entry.created_at)}>
            <p>
              Mood {entry.mood_score ?? "-"} / Energy {entry.energy_score ?? "-"}
              {entry.note ? <span className="text-stone-400"> - {entry.note}</span> : null}
            </p>
          </EntryCard>
        ))}
      </div>
    </>
  );
}
