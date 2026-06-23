"use client";

import * as React from "react";
import { Bell, Clock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/site/section";
import { NEWSLETTER_HREF } from "@/components/site/buy-links";
import type { Book } from "@/components/site/types";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { formatYear } from "@/lib/date-utils";

type BooksSectionProps = {
  books: Book[];
};

function BookCover({ book }: { book: Book }) {
  const t = useT();
  const isFeatured = book.featured;
  const isForthcoming = book.status === "forthcoming";
  // The real cover (Ghosts in the Ash) is rendered as-is, no overlay.
  const isRealCover = isFeatured;
  // Forthcoming titles without final cover art get a designed typographic cover.
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
            alt={`${book.title} cover art — A Duke Savage Novel`}
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
          <div
            aria-hidden={false}
            className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5"
          >
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
              A Duke Savage Novel
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
              A Duke Savage Novel
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

function BookCard({ book }: { book: Book }) {
  const t = useT();
  const isForthcoming = book.status === "forthcoming";
  const year = formatYear(book.releaseDate);

  return (
    <article className="flex flex-col gap-5">
      <BookCover book={book} />

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

        <h3 className="font-serif text-2xl font-semibold leading-tight tracking-tight">
          {book.title}
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
          {isForthcoming ? (
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
              <Link href={NEWSLETTER_HREF}>
                <Clock className="h-4 w-4" aria-hidden="true" />
                {t("books.comingSoon")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function BooksSection({ books }: BooksSectionProps) {
  const t = useT();
  if (!books.length) return null;

  return (
    <Section
      id="books"
      width="wide"
      eyebrow={t("books.eyebrow")}
      title={t("books.title")}
      intro={t("books.intro")}
    >
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Section>
  );
}
