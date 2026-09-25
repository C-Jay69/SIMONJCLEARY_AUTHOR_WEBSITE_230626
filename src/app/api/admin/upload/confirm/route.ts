import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createServerSupabase, getStorageBucket } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function checkPassword(req: Request): boolean {
  const expected = process.env.PODCAST_ADMIN_PASSWORD;
  if (!expected) return false;
  return req.headers.get("x-admin-password") === expected;
}

type ConfirmBody = {
  title?: unknown;
  episodeNumber?: unknown;
  description?: unknown;
  duration?: unknown;
  path?: unknown;
};

/**
 * POST /api/admin/upload/confirm — step 2 of publishing a podcast episode.
 *
 * Called after the browser has uploaded the audio file to Supabase Storage.
 * Verifies the file landed, records the episode in the database, and
 * invalidates the homepage cache so it appears on the live site.
 */
export async function POST(req: Request) {
  if (!checkPassword(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: ConfirmBody;
  try {
    body = (await req.json()) as ConfirmBody;
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
  const path = typeof body.path === "string" ? body.path.trim() : "";

  if (!title || !Number.isInteger(episodeNumber) || episodeNumber < 1) {
    return NextResponse.json(
      { ok: false, error: "Missing episode details." },
      { status: 400 }
    );
  }
  if (!path.startsWith("podcasts/")) {
    return NextResponse.json(
      { ok: false, error: "Missing uploaded file path." },
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

  try {
    // Make sure the file actually landed before publishing a broken episode.
    const { data: exists, error: existsError } = await supabase.storage
      .from(bucket)
      .exists(path);
    if (existsError) {
      console.error("[admin/upload] could not verify upload:", existsError);
      return NextResponse.json(
        { ok: false, error: "Could not verify the uploaded audio file." },
        { status: 500 }
      );
    }
    if (!exists) {
      return NextResponse.json(
        { ok: false, error: "The audio file didn't upload. Please try again." },
        { status: 400 }
      );
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

    const episode = await db.podcast.create({
      data: {
        title,
        episodeNumber,
        description,
        audioUrl: pub.publicUrl,
        duration: duration || null,
      },
    });

    revalidatePath("/", "page");
    return NextResponse.json({ ok: true, podcast: episode });
  } catch (err) {
    console.error("[admin/upload] confirm failed:", err);
    // Roll back the orphaned file so it doesn't sit in storage forever.
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch (cleanupErr) {
      console.warn("[admin/upload] cleanup failed:", cleanupErr);
    }
    return NextResponse.json(
      { ok: false, error: "Could not publish the episode. Try again." },
      { status: 500 }
    );
  }
}