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

async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  const clean = slugify(base) || "post";
  const existing = await db.journalPost.findMany({
    where: exceptId ? { NOT: { id: exceptId } } : undefined,
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

/** GET /api/admin/journal — list all journal posts (newest first). */
export async function GET(req: Request) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const posts = await db.journalPost.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    console.error("[admin/journal] list failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load journal posts." },
      { status: 500 }
    );
  }
}

/** POST /api/admin/journal — create a new journal post. */
export async function POST(req: Request) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

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
  const postDate = d.date
    ? new Date(d.date)
    : new Date();
  if (isNaN(postDate.getTime())) {
    return NextResponse.json(
      { ok: false, error: "The date doesn't look valid." },
      { status: 400 }
    );
  }

  try {
    const post = await db.journalPost.create({
      data: {
        title: d.title,
        slug: d.slug ? await uniqueSlug(d.slug) : await uniqueSlug(d.title),
        body: d.body,
        excerpt: d.excerpt ?? d.body.slice(0, 200),
        category: d.category?.trim() || "Dispatch",
        readMinutes: d.readMinutes ?? 4,
        date: postDate,
      },
    });
    revalidatePath("/", "page");
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (err) {
    console.error("[admin/journal] create failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not create the post." },
      { status: 500 }
    );
  }
}