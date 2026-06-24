"use client";

import { saveJournalEntry } from "@/actions/journal";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { error: undefined, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-md bg-amber-300 px-4 py-2 text-sm font-medium text-stone-950 disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save entry"}
    </button>
  );
}

export function JournalForm() {
  const [state, formAction] = useFormState(saveJournalEntry, initialState);
  const [rawText, setRawText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.success) {
      setRawText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [state.success]);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function handleInput(event: FormEvent<HTMLTextAreaElement>) {
    setRawText(event.currentTarget.value);
    resizeTextarea();
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div>
        <label htmlFor="raw_text" className="block text-sm font-medium text-stone-200">
          Journal entry
        </label>
        <textarea
          ref={textareaRef}
          id="raw_text"
          name="raw_text"
          value={rawText}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          rows={5}
          placeholder="What's on your mind?"
          className="mt-2 min-h-40 w-full resize-none overflow-y-hidden rounded-lg border border-stone-800 bg-stone-950 px-4 py-3 font-mono text-base leading-7 text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-300"
        />
        {state.error ? <p className="mt-2 text-sm text-red-300">{state.error}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.success ? <p className="text-sm text-amber-200">Entry saved</p> : null}
      </div>
    </form>
  );
}
