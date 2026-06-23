import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  return provided === expected;
}

/** GET /api/admin/chapters — list all books with their excerpt fields. */
export async function GET(req: Request) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const books = await db.book.findMany({
      orderBy: { seriesIndex: "asc" },
      select: {
        id: true,
        title: true,
        seriesIndex: true,
        status: true,
        excerpt: true,
        tagline: true,
        description: true,
      },
    });
    return NextResponse.json({ ok: true, books });
  } catch (err) {
    console.error("[admin/chapters] list failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load chapters." },
      { status: 500 }
    );
  }
}
