import { AddTagForm } from "@/components/tags/AddTagForm";
import { TagChip } from "@/components/tags/TagChip";
import { EntryCard } from "@/components/ui/EntryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllTags, getRecentEntries } from "@/lib/queries";
import Link from "next/link";

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function JournalPage({ searchParams }: { searchParams: { tag?: string } }) {
  const tagId = searchParams.tag ? Number(searchParams.tag) : undefined;
  const activeTagId = tagId && Number.isFinite(tagId) ? tagId : undefined;
  const entries = getRecentEntries(30, activeTagId);
  const tags = getAllTags();

  return (
    <>
      <PageHeader title="Journal" description="The most recent 30 entries, newest first." />
      {tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/journal"
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              activeTagId ? "border border-stone-700 text-stone-400" : "border border-[#c9a84c] bg-[#c9a84c33] text-[#c9a84c]"
            }`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <TagChip key={tag.id} tag={tag} href={`/journal?tag=${tag.id}`} active={activeTagId === tag.id} />
          ))}
        </div>
      ) : null}
      <div className="space-y-4">
        {entries.length === 0 ? <p className="text-sm text-stone-500">No journal entries yet.</p> : null}
        {entries.map((entry) => (
          <EntryCard key={entry.id} meta={formatDate(entry.created_at)}>
            <p className="whitespace-pre-wrap">{entry.raw_text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <TagChip key={tag.id} tag={tag} href={`/journal?tag=${tag.id}`} />
              ))}
            </div>
            <AddTagForm entryId={entry.id} />
          </EntryCard>
        ))}
      </div>
    </>
  );
}
