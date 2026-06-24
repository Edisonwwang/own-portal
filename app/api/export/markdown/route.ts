import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ExportEntry = {
  id: number;
  raw_text: string;
  created_at: string;
};

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = db
    .prepare("SELECT id, raw_text, created_at FROM entries ORDER BY created_at ASC")
    .all() as ExportEntry[];
  const lines = ["# Personal Portal Journal Export", `_Exported ${new Date().toISOString()}_`, ""];

  for (const entry of entries) {
    const date = new Date(`${entry.created_at}Z`).toLocaleDateString("en-MY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    lines.push(`## ${date}`, "", entry.raw_text.trim(), "", "---", "");
  }

  const timestamp = new Date().toISOString().split("T")[0];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="portal-journal-${timestamp}.md"`
    }
  });
}
