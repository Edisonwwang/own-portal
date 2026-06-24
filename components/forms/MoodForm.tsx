"use client";

import { saveMoodEntry } from "@/actions/mood";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { error: undefined, success: false };
const scores = Array.from({ length: 10 }, (_, index) => index + 1);

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-md bg-amber-300 px-4 py-2 text-sm font-medium text-stone-950 disabled:opacity-60"
    >
      {pending ? "Logging..." : "Log mood"}
    </button>
  );
}

function ScoreButtons({
  name,
  value,
  onChange
}: {
  name: string;
  value: number | null;
  onChange: (score: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
      <input type="hidden" name={name} value={value ?? ""} />
      {scores.map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`min-h-11 rounded-md border text-sm ${
            value === score
              ? "border-amber-300 bg-amber-300 text-stone-950"
              : "border-stone-800 bg-stone-950 text-stone-300"
          }`}
        >
          {score}
        </button>
      ))}
    </div>
  );
}

export function MoodForm() {
  const [state, formAction] = useFormState(saveMoodEntry, initialState);
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [energyScore, setEnergyScore] = useState<number | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (state.success) {
      setMoodScore(null);
      setEnergyScore(null);
      setNote("");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-200">How do you feel?</label>
        <div className="mt-2">
          <ScoreButtons name="mood_score" value={moodScore} onChange={setMoodScore} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-200">Energy level?</label>
        <div className="mt-2">
          <ScoreButtons name="energy_score" value={energyScore} onChange={setEnergyScore} />
        </div>
      </div>
      <div>
        <label htmlFor="mood_note" className="block text-sm font-medium text-stone-200">
          Note
        </label>
        <input
          id="mood_note"
          name="note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Optional"
          className="mt-2 min-h-11 w-full rounded-md border border-stone-800 bg-stone-950 px-3 py-2 text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-300"
        />
        {state.error ? <p className="mt-2 text-sm text-red-300">{state.error}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.success ? <p className="text-sm text-amber-200">Logged</p> : null}
      </div>
    </form>
  );
}
