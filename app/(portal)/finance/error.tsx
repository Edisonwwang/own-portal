"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 text-sm text-[#888888]">
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset} className="mt-2 underline">
        Try again
      </button>
    </div>
  );
}
