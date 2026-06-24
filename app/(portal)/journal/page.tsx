import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { db } from "@/lib/db";

type JournalEntry = {
  id: number;
  raw_text: string;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function JournalPage() {
  const entries = db
    .prepare("SELECT id, raw_text, created_at FROM entries ORDER BY created_at DESC LIMIT 30")
    .all() as JournalEntry[];

  return (
    <>
      <PageHeader title="Journal" description="The most recent 30 entries, newest first." />
      <div className="space-y-4">
        {entries.length === 0 ? <p className="text-sm text-stone-500">No journal entries yet.</p> : null}
        {entries.map((entry) => (
          <EntryCard key={entry.id} meta={formatDate(entry.created_at)}>
            <p className="whitespace-pre-wrap">{entry.raw_text}</p>
          </EntryCard>
        ))}
      </div>
    </>
  );
}
