import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getPurchaseable } from "@/lib/store";
import { slugifyBookTitle } from "@/lib/slug";

export const dynamic = "force-dynamic";

type CheckoutBody = {
  slug?: string;
  bookId?: string;
  returnPath?: string;
};

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Payments are not configured yet." },
      { status: 500 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugifyBookTitle(body.slug)
      : undefined;
  const bookId =
    typeof body.bookId === "string" && body.bookId.trim() ? body.bookId : undefined;

  if (!slug && !bookId) {
    return NextResponse.json({ ok: false, error: "Missing book." }, { status: 400 });
  }

  let title: string | undefined;
  let priceId: string | undefined;
  let resolvedSlug = slug;

  if (bookId) {
    const book = await db.book
      .findUnique({ where: { id: bookId } })
      .catch(() => null);
    if (book) {
      resolvedSlug = slugifyBookTitle(book.title);
      title = book.title;
      priceId = getPurchaseable(resolvedSlug)?.priceId ?? book.stripePriceId ?? undefined;
    }
  }

  if (!priceId && resolvedSlug) {
    const purchasable = getPurchaseable(resolvedSlug);
    if (purchasable) {
      priceId = purchasable.priceId;
      title = purchasable.title;
    }
  }

  if (!priceId) {
    return NextResponse.json(
      { ok: false, error: "This title isn't available for direct purchase yet." },
      { status: 404 }
    );
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const returnPath =
    typeof body.returnPath === "string" && /^\/[^?#]*$/.test(body.returnPath)
      ? body.returnPath
      : "/#novels";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        bookTitle: title ?? "",
        bookSlug: resolvedSlug ?? "",
      },
      success_url: `${origin}/checkout/success?book=${encodeURIComponent(resolvedSlug ?? "")}`,
      cancel_url: `${origin}${returnPath}`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[checkout] create session failed:", err);
    return NextResponse.json({ ok: false, error: "Unable to start checkout." }, { status: 500 });
  }
}