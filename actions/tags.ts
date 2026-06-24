"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type TagActionState = {
  error?: string;
  success?: boolean;
};

const nameSchema = z.string().min(1).max(30).trim();

export async function addTagToEntry(_previousState: TagActionState, formData: FormData): Promise<TagActionState> {
  const entryId = Number(formData.get("entry_id"));
  const parsed = nameSchema.safeParse(formData.get("tag_name"));

  if (!parsed.success || !entryId) {
    return { error: "Invalid input" };
  }

  db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(parsed.data);
  const tag = db.prepare("SELECT id FROM tags WHERE name = ? COLLATE NOCASE").get(parsed.data) as { id: number };
  db.prepare("INSERT OR IGNORE INTO entry_tags (entry_id, tag_id) VALUES (?, ?)").run(entryId, tag.id);

  revalidatePath("/");
  revalidatePath("/journal");

  return { success: true };
}

export async function removeTagFromEntry(entryId: number, tagId: number) {
  db.prepare("DELETE FROM entry_tags WHERE entry_id = ? AND tag_id = ?").run(entryId, tagId);
  revalidatePath("/");
  revalidatePath("/journal");
}
