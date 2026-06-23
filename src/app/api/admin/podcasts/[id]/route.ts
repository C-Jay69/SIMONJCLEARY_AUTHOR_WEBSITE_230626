import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  return provided === expected;
}

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
    const episode = await db.podcast.findUnique({ where: { id } });
    if (!episode) {
      return NextResponse.json(
        { ok: false, error: "Episode not found." },
        { status: 404 }
      );
    }

    await db.podcast.delete({ where: { id } });

    // Best-effort delete of the audio file from disk.
    if (episode.audioUrl?.startsWith("/podcasts/")) {
      const filePath = path.join(
        process.cwd(),
        "public",
        episode.audioUrl.replace(/^\//, "")
      );
      try {
        await unlink(filePath);
      } catch (e) {
        // File may already be gone — non-fatal.
        console.warn("[admin/podcasts] could not delete file:", filePath, e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/podcasts] delete failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete the episode." },
      { status: 500 }
    );
  }
}
