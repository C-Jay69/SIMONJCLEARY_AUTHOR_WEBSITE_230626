"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

const FALLBACK_EXCERPT = `The house was a rental on Fontenelle Boulevard. Two bedrooms, a yard that had given up, and the same furnace that ran three months behind the weather.

The man inside the house had a daughter. Eight years old. She slept in the back bedroom with a lamp on.

The men left. The man on the floor of his hallway got up. He would require ongoing management for the next twenty-five years.

The child went back to her room. She left the lamp on.`;

type ExcerptSectionProps = {
  /** The opening teaser from the Ghosts in the Ash book row, if present in DB. */
  excerpt?: string | null;
  /** Book title for the section header. */
  title?: string;
  /** Where the "read the rest" CTA points (homepage newsletter anchor by default). */
  ctaHref?: string;
  /** Only show the first N paragraphs. 0/undefined shows the whole excerpt. */
  maxParagraphs?: number;
};

export function ExcerptSection({
  excerpt,
  title = "Ghosts in the Ash",
  ctaHref = "/#newsletter",
  maxParagraphs,
}: ExcerptSectionProps) {
  const t = useT();
  const body = excerpt?.trim() || FALLBACK_EXCERPT;
  const allParagraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const truncated = Boolean(
    maxParagraphs && maxParagraphs > 0 && allParagraphs.length > maxParagraphs
  );
  const paragraphs = truncated
    ? allParagraphs.slice(0, maxParagraphs)
    : allParagraphs;

  return (
    <Section
      id="excerpt"
      width="prose"
      eyebrow={t("excerpt.eyebrow")}
      title={t("excerpt.title")}
      intro={t("excerpt.intro")}
    >
      <article className="mt-10 flex flex-col gap-6">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              "font-serif text-lg leading-[1.85] text-foreground/90 sm:text-xl sm:leading-[1.85] " +
              (i === 0 ? "drop-cap" : "")
            }
          >
            {p}
          </p>
        ))}

        {truncated && (
          <div
            aria-hidden="true"
            className="mt-2 flex items-center gap-3 text-muted-foreground"
          >
            <span className="steel-hairline" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em]">
              …
            </span>
            <span className="steel-hairline" />
          </div>
        )}

        <div className="mt-8 flex flex-col items-start gap-4 border-l-2 border-accent/60 pl-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base italic text-muted-foreground">
            {t("excerpt.cta")}
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href={ctaHref}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t("excerpt.button")}
            </Link>
          </Button>
        </div>
      </article>
    </Section>
  );
}
