import { SearchInput } from "@/components/search/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";
import { searchEntries } from "@/lib/queries";

function formatDate(value: string) {
  return new Date(`${value}Z`).toLocaleString();
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const results = searchEntries(query);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <PageHeader title="Search" description="Find journal entries by full-text search." />
      <SearchInput defaultValue={query} />

      {query && results.length === 0 ? <p className="text-sm text-[#888888]">No entries found for &quot;{query}&quot;</p> : null}
      {!query ? <p className="text-sm text-[#888888]">Start typing to search your journal entries.</p> : null}

      <ul className="space-y-3">
        {results.map((result) => (
          <li key={result.id} className="space-y-1 rounded-lg border border-[#2a2a2a] p-4">
            <p
              className="text-sm leading-relaxed text-[#e5e5e5]"
              dangerouslySetInnerHTML={{ __html: result.excerpt }}
            />
            <p className="text-xs text-[#888888]">{formatDate(result.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
