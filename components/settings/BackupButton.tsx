"use client";

import { sendBackupEmail } from "@/actions/backup";
import { useState, useTransition } from "react";

type Status = {
  kind: "success" | "error";
  message: string;
};

export function BackupButton() {
  const [status, setStatus] = useState<Status | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            setStatus(null);
            const result = await sendBackupEmail();
            setStatus(
              "success" in result
                ? { kind: "success", message: "Backup sent to your Gmail" }
                : { kind: "error", message: result.error }
            );
          });
        }}
        disabled={isPending}
        className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-[#e5e5e5] transition-colors hover:border-[#c9a84c] disabled:opacity-40"
      >
        {isPending ? "Sending" : "Send backup to Gmail"}
      </button>
      {status ? (
        <p className={`text-xs ${status.kind === "success" ? "text-green-400" : "text-red-400"}`}>
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
