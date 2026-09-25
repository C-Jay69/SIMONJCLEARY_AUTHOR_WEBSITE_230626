import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

import { db } from "@/lib/db";
import { createServerSupabase } from "@/lib/supabase";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  return provided === expected;
}

/** Best-effort removal of the stored audio file. Never blocks the delete. */
async function removeStoredAudio(audioUrl: string): Promise<void> {
  // Supabase Storage public URL:
  //   https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const storageMatch = audioUrl.match(
    /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
  );
  if (storageMatch) {
    try {
      const supabase = createServerSupabase();
      await supabase.storage
        .from(storageMatch[1])
        .remove([decodeURIComponent(storageMatch[2])]);
    } catch (err) {
      console.warn("[admin/podcasts] could not delete object:", err);
    }
    return;
  }

  // Legacy local-file mode (audioUrl is a path under /public).
  if (audioUrl.startsWith("/")) {
    const filePath = path.join(
      process.cwd(),
      "public",
      audioUrl.replace(/^\//, "")
    );
    try {
      await unlink(filePath);
    } catch (e) {
      console.warn("[admin/podcasts] could not delete file:", filePath, e);
    }
  }
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

    await removeStoredAudio(episode.audioUrl);

    revalidatePath("/", "page");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/podcasts] delete failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete the episode." },
      { status: 500 }
    );
  }
}