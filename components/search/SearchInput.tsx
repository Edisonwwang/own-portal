"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const handleChange = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams();
        if (value.trim()) {
          params.set("q", value.trim());
        }
        const query = params.toString();
        router.replace(query ? `/search?${query}` : "/search");
      }, 300),
    [router]
  );

  return (
    <input
      type="search"
      defaultValue={defaultValue}
      onChange={(event) => handleChange(event.target.value)}
      placeholder="Search journal entries..."
      autoFocus
      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-base text-[#e5e5e5] placeholder:text-[#888888] outline-none focus:border-[#c9a84c]"
    />
  );
}

function debounce<T extends (...args: string[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
