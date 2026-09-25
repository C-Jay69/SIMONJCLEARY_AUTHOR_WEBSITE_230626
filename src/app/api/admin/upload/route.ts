import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { createServerSupabase, getStorageBucket } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  return req.headers.get("x-admin-password") === expected;
}

/** Extensions we're willing to serve as podcast audio. */
const ALLOWED_EXTENSIONS = new Set([
  "mp3", "m4a", "aac", "ogg", "oga", "wav", "flac", "opus", "wma", "mp4",
]);

function safeExtension(fileName: string): string {
  const ext = fileName.slice(fileName.lastIndexOf(".") + 1).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) ? ext : "mp3";
}

type UploadInitBody = {
  title?: unknown;
  episodeNumber?: unknown;
  description?: unknown;
  duration?: unknown;
  fileName?: unknown;
};

/**
 * POST /api/admin/upload — step 1 of publishing a podcast episode.
 *
 * Validates the metadata and mints a signed upload URL for the audio file.
 * The browser then uploads the file directly to Supabase Storage (this URL),
 * which keeps big audio files out of the Vercel function body (>4.5MB would
 * otherwise fail). No DB write happens here — see /upload/confirm for that.
 */
export async function POST(req: Request) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: UploadInitBody;
  try {
    body = (await req.json()) as UploadInitBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const episodeNumber = Number(body.episodeNumber);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const duration = typeof body.duration === "string" ? body.duration.trim() : "";
  const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";

  if (!title) {
    return NextResponse.json(
      { ok: false, error: "Episode title is required." },
      { status: 400 }
    );
  }
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1) {
    return NextResponse.json(
      { ok: false, error: "Episode number must be a positive integer." },
      { status: 400 }
    );
  }
  if (!fileName) {
    return NextResponse.json(
      { ok: false, error: "Select an audio file to upload." },
      { status: 400 }
    );
  }

  let supabase;
  try {
    supabase = createServerSupabase();
  } catch (err) {
    console.error("[admin/upload] storage not configured:", err);
    return NextResponse.json(
      { ok: false, error: "Podcast storage is not configured on the server." },
      { status: 500 }
    );
  }

  const bucket = getStorageBucket();
  const ext = safeExtension(fileName);
  const path = `podcasts/ep-${episodeNumber}-${randomUUID()}.${ext}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("[admin/upload] signed url failed:", error);
      return NextResponse.json(
        { ok: false, error: "Could not stage the upload. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      bucket,
      path: data.path,
      token: data.token,
      uploadUrl: data.signedUrl,
    });
  } catch (err) {
    console.error("[admin/upload] unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Could not stage the upload. Try again." },
      { status: 500 }
    );
  }
}