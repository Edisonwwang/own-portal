"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const schema = z.object({
  raw_text: z.string().min(1, "Write something first").max(10000, "Keep entries under 10000 characters")
});

export async function saveJournalEntry(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const result = schema.safeParse({
    raw_text: formData.get("raw_text")
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  db.prepare("INSERT INTO entries (raw_text) VALUES (?)").run(result.data.raw_text);
  revalidatePath("/");
  revalidatePath("/journal");

  return { success: true };
}
