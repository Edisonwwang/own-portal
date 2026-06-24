"use client";

import { addTagToEntry } from "@/actions/tags";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { error: undefined, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="px-1 text-xs text-[#888888] hover:text-[#c9a84c] disabled:opacity-40">
      +
    </button>
  );
}

export function AddTagForm({ entryId }: { entryId: number }) {
  const [state, formAction] = useFormState(addTagToEntry, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state.success]);

  return (
    <form action={formAction} className="mt-2 flex items-center gap-1">
      <input type="hidden" name="entry_id" value={entryId} />
      <input
        ref={inputRef}
        type="text"
        name="tag_name"
        placeholder="Add tag..."
        maxLength={30}
        className="w-28 rounded border border-[#2a2a2a] bg-transparent px-2 py-1 text-xs text-[#888888] placeholder:text-[#555555] outline-none transition-all focus:w-40 focus:border-[#c9a84c]"
      />
      <SubmitButton />
      {state.error ? <span className="text-xs text-red-400">{state.error}</span> : null}
    </form>
  );
}
