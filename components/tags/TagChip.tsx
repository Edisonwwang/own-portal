import type { Tag } from "@/lib/types";
import Link from "next/link";

export function TagChip({ tag, href, active = false }: { tag: Tag; href?: string; active?: boolean }) {
  const chip = (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
      style={{
        background: active ? `${tag.color}33` : `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${active ? tag.color : `${tag.color}40`}`
      }}
    >
      {tag.name}
    </span>
  );

  if (href) {
    return <Link href={href}>{chip}</Link>;
  }

  return chip;
}
