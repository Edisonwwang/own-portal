import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = {
    exported_at: new Date().toISOString(),
    entries: db.prepare("SELECT * FROM entries ORDER BY created_at ASC").all(),
    mood_entries: db.prepare("SELECT * FROM mood_entries ORDER BY created_at ASC").all(),
    finance_entries: db.prepare("SELECT * FROM finance_entries ORDER BY created_at ASC").all(),
    tags: db.prepare("SELECT * FROM tags ORDER BY name ASC").all(),
    entry_tags: db.prepare("SELECT * FROM entry_tags").all()
  };
  const timestamp = new Date().toISOString().split("T")[0];

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portal-export-${timestamp}.json"`
    }
  });
}
