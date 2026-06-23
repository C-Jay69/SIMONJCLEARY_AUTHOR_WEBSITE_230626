import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(120, "That name is a little long."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "A few more words would help.")
    .max(4000, "That message is a little long."),
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

  const { name, email, subject, message } = parsed.data;

  try {
    const created = await db.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        subject: subject?.trim() || null,
        message,
      },
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error("[contact] create failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Try again shortly." },
      { status: 500 }
    );
  }
}
