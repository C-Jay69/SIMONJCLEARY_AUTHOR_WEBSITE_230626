import type { Metadata } from "next";

import { db } from "@/lib/db";
import type { Book as BookRow, PressItem as PressItemRow } from "@prisma/client";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Section } from "@/components/site/section";
import { GhostsHero } from "@/components/site/ghosts-hero";
import { PressStrip } from "@/components/site/press-strip";
import { ExcerptSection } from "@/components/site/excerpt-section";
import { CaseFileSection } from "@/components/site/case-file-section";
import { BUY_LINKS } from "@/components/site/buy-links";
import { BuyButton } from "@/components/site/buy-button";

import { ghostsStory, ghostsBuy } from "@/content/ghosts-in-the-ash";

export const revalidate = 60;

const pageDescription =
  "Ghosts in the Ash — the debut novel by Simon J. Cleary. Duke Savage, the debut installment of the Duke Savage trilogy. A city that erases people with a transposed digit, and the investigator who notices.";

export const metadata: Metadata = {
  title: "Ghosts in the Ash — Debut Novel",
  description: pageDescription,
  openGraph: {
    type: "website",
    url: "https://simonjcleary.com/ghosts-in-the-ash",
    siteName: "Simon J Cleary — Author",
    title: "Ghosts in the Ash — Debut Novel",
    description: pageDescription,
    images: [
      {
        url: "/images/books/ghosts-in-the-ash.jpg",
        width: 1200,
        height: 1800,
        alt: "Ghosts in the Ash — A Duke Savage Novel by Simon J Cleary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghosts in the Ash — Debut Novel",
    description: pageDescription,
    images: ["/images/books/ghosts-in-the-ash.jpg"],
  },
};

async function safeQuery<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[ghosts] ${label} query failed:`, err);
    return [] as unknown as T;
  }
}

function serializePress(p: PressItemRow): PressItemRow {
  return { ...p };
}

export default async function GhostsInTheAshPage() {
  const [books, pressItems] = await Promise.all([
    safeQuery<BookRow[]>(
      () =>
        (db.book?.findMany({ orderBy: { seriesIndex: "asc" } }) ??
          Promise.resolve([])) as Promise<BookRow[]>,
      "books"
    ),
    safeQuery<PressItemRow[]>(
      () => (db.pressItem?.findMany() ?? Promise.resolve([])) as Promise<PressItemRow[]>,
      "pressItems"
    ),
  ]);

  const ghostBook =
    books.find((b) => b.title.toLowerCase().includes("ghosts")) ?? null;
  const press = pressItems.map(serializePress);

  const buy = BUY_LINKS["Ghosts in the Ash"];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <GhostsHero />

        {press.length > 0 && <PressStrip items={press} />}

        {/* Story / positioning */}
        <Section
          id="story"
          width="prose"
          eyebrow={ghostsStory.eyebrow}
          title={ghostsStory.title}
          intro={ghostsStory.body[2]}
          align="left"
        >
          <div className="mt-2 flex items-center gap-3">
            <span
              className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent"
              title="Published — The Duke Savage Trilogy"
            >
              {ghostsStory.positioning}
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {ghostsStory.body.slice(0, 2).map((paragraph, i) => (
              <p
                key={i}
                className="font-serif text-lg leading-loose text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        {/* Prologue reading experience — free hook, gated to the buy section */}
        <ExcerptSection
          excerpt={ghostBook?.excerpt}
          ctaHref="#buy"
          maxParagraphs={3}
        />

        {/* Where to buy */}
        {buy && (
          <Section
            id="buy"
            width="prose"
            eyebrow={ghostsBuy.eyebrow}
            title={ghostsBuy.title}
            intro={ghostsBuy.intro}
          >
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BuyButton
                slug="ghosts-in-the-ash"
                label="Buy the e-book"
                className="bg-accent px-6 py-2.5 text-accent-foreground hover:bg-accent/90"
              />
              {[
                { href: buy.amazon, label: "Amazon" },
                { href: buy.bookshop, label: "Bookshop.org" },
                { href: buy.audible, label: "Audible" },
              ].map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-border/70 px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {r.label}
                </a>
              ))}
              <a
                href="/#newsletter"
                className="rounded-md border border-border/70 px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                Signed copy
              </a>
            </div>
            <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              The e-book is delivered by email after checkout — secure payment handled by Stripe. Signed-copy drops go out to the dispatch list first.
            </p>
          </Section>
        )}

        {/* Duke Savage — the case file */}
        <CaseFileSection />

        {/* Cross-links */}
        <Section
          align="center"
          eyebrow="// WHAT'S NEXT"
          title="The second novel is live"
          intro="The city was not drowning them. It was mopping its floor."
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/the-shattered-city"
              className="rounded-md bg-gold px-6 py-2.5 font-mono text-sm uppercase tracking-widest text-background transition-colors hover:bg-gold/90"
            >
              Read The Shattered City
            </a>
            <a
              href="/"
              className="rounded-md border border-border/70 px-6 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              Return to the main site
            </a>
          </div>
        </Section>
      </main>

      <SiteFooter className="mt-auto" />
    </div>
  );
}