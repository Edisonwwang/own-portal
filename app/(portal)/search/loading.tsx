export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 animate-pulse">
      <div className="h-12 rounded-lg bg-[#1a1a1a]" />
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-20 rounded-lg bg-[#1a1a1a]" />
      ))}
    </div>
  );
}
