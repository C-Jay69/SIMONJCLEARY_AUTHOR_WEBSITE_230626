import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  return provided === expected;
}

const schema = z.object({
  excerpt: z.string().nullable(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

/** PUT /api/admin/chapters/[id] — update a book's excerpt/tagline/description. */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;

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
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 }
    );
  }

  try {
    const updated = await db.book.update({
      where: { id },
      data: {
        excerpt: parsed.data.excerpt ?? null,
        ...(parsed.data.tagline !== undefined && { tagline: parsed.data.tagline ?? null }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description ?? null }),
      },
    });
    revalidatePath("/", "page");
    revalidatePath("/ghosts-in-the-ash", "page");
    return NextResponse.json({ ok: true, book: updated });
  } catch (err) {
    console.error("[admin/chapters] update failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save the chapter." },
      { status: 500 }
    );
  }
}
