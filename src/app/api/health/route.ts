import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, db: false, error: "DATABASE_URL is not set" },
      { status: 503 },
    );
  }

  try {
    const { db } = await import("@/db");
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
