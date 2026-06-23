import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  name: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "Please check the form and try again.";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  const { email, name, source } = parsed.data;

  try {
    // Idempotent: if already subscribed, treat as success.
    const existing = await db.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ ok: true, id: existing.id, already: true });
    }
    const created = await db.subscriber.create({
      data: {
        email: email.toLowerCase(),
        name: name?.trim() || null,
        source: source ?? "website",
      },
    });

    // Sync to Supabase (if configured). Non-blocking — local DB is source of truth.
    if (supabase) {
      try {
        await supabase.from("subscribers").upsert(
          {
            email: email.toLowerCase(),
            name: name?.trim() || null,
            source: source ?? "website",
          },
          { onConflict: "email", ignoreDuplicates: true }
        );
      } catch (syncErr) {
        console.warn("[newsletter] Supabase sync failed (non-fatal):", syncErr);
      }
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Try again shortly." },
      { status: 500 }
    );
  }
}
