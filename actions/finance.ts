"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: boolean;
};

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Enter an amount greater than zero"),
  currency: z.string().min(1).default("MYR"),
  category: z.string().max(100, "Keep categories under 100 characters").optional(),
  description: z.string().max(500, "Keep descriptions under 500 characters").optional()
});

export async function saveFinanceEntry(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const result = schema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    currency: formData.get("currency") || "MYR",
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined
  });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  db.prepare(
    `INSERT INTO finance_entries (type, amount, currency, category, description)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    result.data.type,
    result.data.amount,
    result.data.currency,
    result.data.category ?? null,
    result.data.description ?? null
  );
  revalidatePath("/");
  revalidatePath("/finance");

  return { success: true };
}
