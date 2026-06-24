import manifest from "@/app/manifest";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(manifest());
}
