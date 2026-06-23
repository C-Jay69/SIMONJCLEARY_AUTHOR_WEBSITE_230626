import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public list of podcast episodes. No auth required.
 * Used by the public PodcastSection on the homepage.
 */
export async function GET() {
  try {
    const episodes = await db.podcast.findMany({
      orderBy: { episodeNumber: "desc" },
    });
    return NextResponse.json({ ok: true, episodes });
  } catch (err) {
    console.error("[podcasts] list failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load episodes." },
      { status: 500 }
    );
  }
}
