import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    const result = await db.execute(sql`select 1 as ok`);
    const row = result[0] as { ok: number } | undefined;

    return NextResponse.json({
      ok: true,
      db: row?.ok === 1,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json({ ok: false, db: false, error: message }, { status: 503 });
  }
}
