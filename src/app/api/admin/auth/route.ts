import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(1, "Password is required."),
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
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) {
    console.error("[admin/auth] PODCAST_ADMIN_PASSWORD env var is not set.");
    return NextResponse.json(
      { ok: false, error: "Admin is not configured on the server." },
      { status: 500 }
    );
  }

  if (parsed.data.password !== expected) {
    return NextResponse.json(
      { ok: false, error: "Wrong password." },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
