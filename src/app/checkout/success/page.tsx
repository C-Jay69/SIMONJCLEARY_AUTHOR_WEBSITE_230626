import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Section } from "@/components/site/section";

export const metadata: Metadata = {
  title: "Order confirmed — Simon J Cleary",
  description: "Your e-book order has been confirmed.",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex flex-1 items-center justify-center px-6 py-24">
        <Section
          width="prose"
          align="center"
          eyebrow="// ORDER CONFIRMED"
          title="Thank you — your e-book is on its way."
        >
          <div className="mt-8 flex flex-col items-center gap-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <BadgeCheck className="h-7 w-7 text-accent" aria-hidden="true" />
            </span>
            <p className="font-serif text-base leading-loose text-foreground/85">
              Your receipt and download instructions arrive by email from Stripe
              (SIMON J CLEARY). If they don&rsquo;t show up within a few
              minutes, check your spam folder or reach out at{" "}
              <a
                href="mailto:inquiries@simonjcleary.com"
                className="text-accent underline-offset-4 hover:underline"
              >
                inquiries@simonjcleary.com
              </a>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/#novels"
                className="rounded-md bg-accent px-6 py-2.5 font-mono text-sm uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Back to the novels
              </a>
              <a
                href="/"
                className="rounded-md border border-border/70 px-6 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:border-accent/50 hover:text-accent"
              >
                Home
              </a>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter className="mt-auto" />
    </div>
  );
}