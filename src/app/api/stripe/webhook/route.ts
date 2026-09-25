import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret || !signature) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 400 });
  }

  let payload: string;
  try {
    payload = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await recordOrder(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}

async function recordOrder(session: Stripe.Checkout.Session) {
  try {
    await db.order.upsert({
      where: { stripeSessionId: session.id },
      update: { status: "paid" },
      create: {
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email ?? null,
        customerName: session.customer_details?.name ?? null,
        bookTitle: session.metadata?.bookTitle ?? null,
        bookSlug: session.metadata?.bookSlug ?? null,
        amountTotal: session.amount_total ?? null,
        currency: session.currency ?? null,
        status: "paid",
      },
    });
  } catch (err) {
    // The purchase still succeeds even if order recording is unavailable
    // (e.g. the Order table hasn't been pushed to the database yet).
    console.error("[stripe-webhook] could not write order:", err);
  }
}