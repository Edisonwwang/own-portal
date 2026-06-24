"use client";

import { saveFinanceEntry } from "@/actions/finance";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { error: undefined, success: false };
const categories = ["Food", "Transport", "Shopping", "Bills", "Salary", "Freelance", "Investment", "Entertainment", "Health", "Other"];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-md bg-amber-300 px-4 py-2 text-sm font-medium text-stone-950 disabled:opacity-60"
    >
      {pending ? "Logging..." : "Log finance"}
    </button>
  );
}

export function FinanceForm() {
  const [state, formAction] = useFormState(saveFinanceEntry, initialState);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (state.success) {
      setType("expense");
      setAmount("");
      setCategory("");
      setDescription("");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="currency" value="MYR" />
      <div>
        <label className="block text-sm font-medium text-stone-200">Type</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["income", "expense"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`min-h-11 rounded-md border px-3 py-2 text-sm capitalize ${
                type === option
                  ? "border-amber-300 bg-amber-300 text-stone-950"
                  : "border-stone-800 bg-stone-950 text-stone-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-stone-200">
          Amount
        </label>
        <div className="mt-2 flex overflow-hidden rounded-md border border-stone-800 bg-stone-950 focus-within:border-amber-300">
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="min-h-11 w-full bg-transparent px-3 py-2 text-stone-100 outline-none"
          />
          <span className="flex min-h-11 items-center border-l border-stone-800 px-3 text-sm text-stone-400">MYR</span>
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-stone-200">
          Category
        </label>
        <input
          id="category"
          name="category"
          list="finance_categories"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-md border border-stone-800 bg-stone-950 px-3 py-2 text-stone-100 outline-none focus:border-amber-300"
        />
        <datalist id="finance_categories">
          {categories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-200">
          Description
        </label>
        <input
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
