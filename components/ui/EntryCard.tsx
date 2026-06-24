type EntryCardProps = {
  title?: string;
  meta: string;
  children: React.ReactNode;
};

export function EntryCard({ title, meta, children }: EntryCardProps) {
  return (
    <article className="rounded-lg border border-stone-800 bg-stone-950/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        {title ? <h3 className="font-medium text-amber-300">{title}</h3> : <span />}
        <time>{meta}</time>
      </div>
      <div className="mt-3 text-sm leading-6 text-stone-200">{children}</div>
    </article>
  );
}
