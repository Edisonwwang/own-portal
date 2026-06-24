export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-40 rounded bg-[#1a1a1a]" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-24 rounded bg-[#1a1a1a]" />
        <div className="h-24 rounded bg-[#1a1a1a]" />
        <div className="h-24 rounded bg-[#1a1a1a]" />
      </div>
      <div className="h-[260px] rounded bg-[#1a1a1a]" />
    </div>
  );
}
