"use client";

import * as React from "react";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/section";
import { NEWSLETTER_HREF } from "@/components/site/buy-links";
import type { Book } from "@/components/site/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { formatYear } from "@/lib/date-utils";

const GHOSTS_HREF = "/ghosts-in-the-ash";
const SHATTERED_HREF = "/the-shattered-city";

/**
 * Static fallbacks for the two routed novels. The Ghosts in the Ash row
 * normally comes from the database; these exist so the Novels section still
 * renders both routed books even if the database query is unavailable.
 */
const GHOSTS_BOOK: Book = {
  id: "ghosts-in-the-ash-static",
  title: "Ghosts in the Ash",
  series: "Duke Savage",
  seriesIndex: 1,
  subtitle: "A Duke Savage Novel",
  tagline:
    "In a city that erases people with a transposed digit, one investigator was hired to find a woman who was never meant to be found.",
  description:
    "Duke Savage is fifty-three — a former investigative journalist turned private investigator operating out of a cramped office above a pawnshop in Los Angeles. When an encrypted message warns that a young woman is running out of time, he begins searching for Sarah Chu, who has been systematically erased from the administrative systems that govern modern life.",
  excerpt: null,
  releaseDate: null,
  status: "published",
  coverUrl: "/images/books/ghosts-in-the-ash.jpg",
  featured: true,
  createdAt: new Date(0).toISOString(),
};

const SHATTERED_CITY_BOOK: Book = {
  id: "the-shattered-city-static",
  title: "The Shattered City",
  series: "The Shattered City",
  seriesIndex: 1,
  subtitle: null,
  tagline: "The city was not drowning them. It was mopping its floor.",
  description:
    "When the transit platform collapses in the lower sectors of Neo-Tethys, three sisters wake in the dark carrying marks that grant them new kinds of power — and start climbing toward a surface that wants its floor clean.",
  excerpt: null,
  releaseDate: null,
  status: "forthcoming",
  coverUrl: "/images/books/the-shattered-city.png",
  featured: false,
  createdAt: new Date(0).toISOString(),
};

function BookCover({ book }: { book: Book }) {
  const t = useT();
  const isFeatured = book.featured;
  const isForthcoming = book.status === "forthcoming";
  // The real cover (Ghosts in the Ash) is rendered as-is, no overlay.
  const isRealCover = isFeatured;
  const hasCoverArt = Boolean(book.coverUrl);

  const [imgOk, setImgOk] = React.useState(true);

  return (
    <div
      className={cn(
        "group relative aspect-[2/3] w-full overflow-hidden rounded-md ring-1 ring-white/10 transition-all duration-500",
        "shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)]",
        isFeatured && "ring-accent/40",
        !isForthcoming && "hover:-translate-y-1 hover:shadow-[0_35px_80px_-25px_rgba(0,0,0,0.95)]"
      )}
    >
      {/* Status badges */}
      {(isFeatured || isForthcoming) && (
        <div className="absolute left-3 top-3 z-20">
          {isFeatured && (
            <Badge className="bg-accent text-accent-foreground shadow-md hover:bg-accent">
              {t("books.new")}
            </Badge>
          )}
          {isForthcoming && (
            <Badge
              variant="outline"
              className="border-accent/50 bg-background/70 text-accent backdrop-blur"
            >
              {t("books.forthcoming")}
            </Badge>
          )}
        </div>
      )}

      {/* Fallback gradient (always rendered behind image; visible if image errors) */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black",
          isFeatured
            ? "from-zinc-950 via-zinc-800 to-black"
            : "from-zinc-900 via-zinc-800 to-zinc-950"
        )}
      />

      {isRealCover ? (
        <img
          src={book.coverUrl}
          alt={`${book.title} — A Duke Savage Novel by Simon J Cleary`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImgOk(false)}
          style={{ display: imgOk ? "block" : "none" }}
        />
      ) : hasCoverArt ? (
        <>
          <img
            src={book.coverUrl}
            alt={`${book.title} cover art — A Simon J Cleary Novel`}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]",
              isForthcoming && "opacity-80"
            )}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            style={{ display: imgOk ? "block" : "none" }}
          />
          {/* Art-cover overlay: title (Fraunces), series tag, author */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
              A Simon J Cleary Novel
            </p>
            <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              {book.title}
            </h3>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-foreground/70">
              Simon J Cleary
            </p>
          </div>
        </>
      ) : (
        // Designed typographic cover for forthcoming titles without final art
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-800/95 to-black p-6">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-accent/80">
              A Simon J Cleary Novel
            </span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground">
              {`Book ${String(book.seriesIndex).padStart(2, "0")}`}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div aria-hidden className="ember-hairline" />
            <h3 className="font-serif text-3xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-4xl">
              {book.title}
            </h3>
            <p className="font-serif text-sm italic leading-snug text-muted-foreground">
              {book.tagline ? `“${book.tagline}”` : "Forthcoming"}
            </p>
            <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-foreground/60">
              Simon J Cleary
            </p>
          </div>
        </div>
      )}

      {/* Subtle inner ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/30"
      />
    </div>
  );
}

type NovelCardProps = {
  book: Book;
  /** Dedicated book page. When undefined and `status` is forecast, shows a Notify-me CTA instead. */
  href?: string;
  /** Anchor to append to `href` (e.g. "#chapter-one"). */
  hrefAnchor?: string;
  /** Button label. Falls back to an i18n key when not provided. */
  ctaLabel?: string;
};

function NovelCard({ book, href, hrefAnchor, ctaLabel }: NovelCardProps) {
  const t = useT();
  const isForthcoming = book.status === "forthcoming";
  const year = formatYear(book.releaseDate);
  const target = href ? `${href}${hrefAnchor ?? ""}` : undefined;

  // Whole cover is a hit target when the book has a page.
  const cover = (
    <BookCover book={book} />
  );

  return (
    <article className="group flex flex-col gap-5">
      {target ? (
        <Link href={target} aria-label={book.title} className="block">
          {cover}
        </Link>
      ) : (
        cover
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {t("books.book")} {String(book.seriesIndex).padStart(2, "0")} · {book.series}
          </span>
          {year && (
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {year}
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent">
          {target ? (
            <Link href={target}>{book.title}</Link>
          ) : (
            book.title
          )}
        </h3>

        {book.tagline && (
          <p className="font-serif text-base italic leading-snug text-foreground/80">
            &ldquo;{book.tagline}&rdquo;
          </p>
        )}

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {book.description}
        </p>

        <div className="mt-1">
          {target ? (
            <Button
              asChild
              size="sm"
              className={cn(
                "h-9 rounded-md",
                book.title.toLowerCase().includes("shattered")
                  ? "bg-gold text-background hover:bg-gold/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
            >
              <Link href={target}>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {ctaLabel ?? t("books.readNovel")}
              </Link>
            </Button>
          ) : isForthcoming ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-md border-accent/40 text-accent hover:bg-accent/10 hover:text-accent"
            >
              <a href={NEWSLETTER_HREF}>
                <Bell className="h-4 w-4" aria-hidden="true" />
                {t("books.notifyMe")}
              </a>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="h-9 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a href={NEWSLETTER_HREF}>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {t("books.comingSoon")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function BooksSection({ books }: { books: Book[] }) {
  const t = useT();

  const isGhost = (b: Book) =>
    b.title?.toLowerCase().includes("ghosts") ?? false;
  const isShattered = (b: Book) =>
    b.title?.toLowerCase().includes("shattered") || b.id === SHATTERED_CITY_BOOK.id;

  const dbGhost = books.find(isGhost);
  const dbShattered = books.find(isShattered);
  const others = books.filter((b) => !isGhost(b) && !isShattered(b));

  const ghost = dbGhost ?? GHOSTS_BOOK;
  const showShattered = !dbShattered;

  return (
    <Section
      id="novels"
      width="wide"
      eyebrow={t("books.eyebrow")}
      title={t("books.title")}
      intro={t("books.intro")}
    >
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <NovelCard book={ghost} href={GHOSTS_HREF} />

        {others.map((book) => (
          <NovelCard key={book.id} book={book} />
        ))}

        {showShattered && (
          <NovelCard
            book={SHATTERED_CITY_BOOK}
            href={SHATTERED_HREF}
            hrefAnchor="#chapter-one"
            ctaLabel={t("books.readChapter")}
          />
        )}
      </div>
    </Section>
  );
}