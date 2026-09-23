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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, exceptId: string): Promise<string> {
  const clean = slugify(base) || "post";
  const existing = await db.journalPost.findMany({
    where: { NOT: { id: exceptId } },
    select: { slug: true },
  });
  const taken = new Set(existing.map((p) => p.slug));
  if (!taken.has(clean)) return clean;
  let i = 2;
  while (taken.has(`${clean}-${i}`)) i += 1;
  return `${clean}-${i}`;
}

const schema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  body: z.string().min(1, "Post body is required."),
  excerpt: z.string().trim().max(400).optional(),
  category: z.string().trim().max(60).optional(),
  readMinutes: z.coerce.number().int().min(1).max(240).optional(),
  date: z.string().optional(),
  slug: z.string().trim().max(120).optional(),
});

/** PATCH /api/admin/journal/[id] — update an existing post. */
export async function PATCH(
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

  const d = parsed.data;
  const postDate = d.date ? new Date(d.date) : undefined;
  if (d.date && isNaN(postDate!.getTime())) {
    return NextResponse.json(
      { ok: false, error: "The date doesn't look valid." },
      { status: 400 }
    );
  }

  try {
    const existing = await db.journalPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Post not found." },
        { status: 404 }
      );
    }

    const post = await db.journalPost.update({
      where: { id },
      data: {
        title: d.title,
        slug: d.slug ? await uniqueSlug(d.slug, id) : await uniqueSlug(d.title, id),
        body: d.body,
        excerpt: d.excerpt ?? d.body.slice(0, 200),
        category: d.category?.trim() || "Dispatch",
        readMinutes: d.readMinutes ?? existing.readMinutes,
        ...(postDate ? { date: postDate } : {}),
      },
    });
    revalidatePath("/", "page");
    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error("[admin/journal] update failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update the post." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/journal/[id] — remove a post. */
export async function DELETE(
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

  try {
    const existing = await db.journalPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Post not found." },
        { status: 404 }
      );
    }
    await db.journalPost.delete({ where: { id } });
    revalidatePath("/", "page");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/journal] delete failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete the post." },
      { status: 500 }
    );
  }
}