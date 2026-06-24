import type { OnThisDayEntry } from "@/lib/types";

export function OnThisDayWidget({ entries }: { entries: OnThisDayEntry[] }) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-[#888888]">On this day</h2>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="space-y-1 rounded-lg border border-[#2a2a2a] p-4">
            <p className="text-xs text-[#888888]">
              {entry.years_ago} year{entry.years_ago !== 1 ? "s" : ""} ago
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-[#e5e5e5]">{entry.raw_text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
