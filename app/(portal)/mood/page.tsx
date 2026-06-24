import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { db } from "@/lib/db";

type MoodEntry = {
  id: number;
  mood_score: number | null;
  energy_score: number | null;
  note: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function MoodPage() {
  const entries = db
    .prepare("SELECT id, mood_score, energy_score, note, created_at FROM mood_entries ORDER BY created_at DESC LIMIT 30")
    .all() as MoodEntry[];

  return (
    <>
      <PageHeader title="Mood" description="The most recent 30 mood logs, newest first." />
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
