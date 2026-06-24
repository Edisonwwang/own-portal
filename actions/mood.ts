"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const schema = z.object({
  mood_score: z.coerce
    .number()
    .int("Pick a mood score")
    .min(1, "Pick a mood score from 1 to 10")
    .max(10, "Pick a mood score from 1 to 10"),
  energy_score: z.coerce
    .number()
    .int("Pick an energy score")
    .min(1, "Pick an energy score from 1 to 10")
    .max(10, "Pick an energy score from 1 to 10"),
  note: z.string().max(500, "Keep notes under 500 characters").optional()
});

export async function saveMoodEntry(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const result = schema.safeParse({
    mood_score: formData.get("mood_score"),
    energy_score: formData.get("energy_score"),
    note: formData.get("note") || undefined
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  db.prepare("INSERT INTO mood_entries (mood_score, energy_score, note) VALUES (?, ?, ?)").run(
    result.data.mood_score,
    result.data.energy_score,
    result.data.note ?? null
  );
  revalidatePath("/");
  revalidatePath("/mood");

  return { success: true };
}
