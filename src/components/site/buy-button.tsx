"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type BuyButtonProps = {
  /** Price-catalog slug, e.g. "ghosts-in-the-ash". */
  slug?: string;
  /** Database Book row id (resolved server-side). */
  bookId?: string;
  label?: string;
  className?: string;
};

/**
 * Starts a Stripe Checkout session for a book and redirects the browser.
 * The checkout URL is created server-side so no publishable key is needed
 * client-side.
 */
export function BuyButton({ slug, bookId, label, className }: BuyButtonProps) {
  const t = useT();
  const [busy, setBusy] = React.useState(false);

  async function handleClick() {
    if (busy || (!slug && !bookId)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          bookId,
          returnPath: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      toast.error(data.error ?? t("books.buyError"));
    } catch {
      toast.error(t("books.buyError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-5 py-2 font-mono text-sm uppercase tracking-widest text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <Loader2
        className={cn("h-4 w-4", busy ? "animate-spin" : "hidden")}
        aria-hidden="true"
      />
      {busy ? t("books.buying") : label ?? t("books.buyDirect")}
    </button>
  );
}