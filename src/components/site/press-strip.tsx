import * as React from "react";
import type { PressItem } from "@prisma/client";

import { cn } from "@/lib/utils";

type PressStripProps = {
  items: PressItem[];
  className?: string;
};

function PressCard({ item }: { item: PressItem }) {
  return (
    <figure className="relative flex w-[88vw] max-w-md shrink-0 flex-col gap-4 px-5 sm:w-[420px]">
      <span
        aria-hidden="true"
        className="font-serif text-5xl leading-none text-accent/50"
      >
        &ldquo;
      </span>
      <blockquote className="-mt-6 font-serif text-xl leading-snug text-foreground/90 sm:text-2xl">
        {item.quote}
      </blockquote>
      <figcaption className="flex flex-col gap-1 border-t border-border/50 pt-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-widest text-accent">
          — {item.source}
        </span>
        {item.author && (
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {item.author}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function PressStrip({ items, className }: PressStripProps) {
  if (!items.length) return null;

  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...items, ...items];

  return (
    <section
      aria-label="Praise for Simon J Cleary"
      className={cn("relative py-16 md:py-20", className)}
    >
      <div className="mx-auto mb-10 flex max-w-6xl flex-col items-center gap-3 px-5 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="case-label text-accent/90">{"// PRAISE"}</span>
          <span aria-hidden="true" className="ember-hairline" />
        </div>
        <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          What the critics are saying
        </h2>
      </div>

      <div className="marquee-mask relative flex overflow-hidden">
        <div className="flex min-w-full shrink-0 animate-marquee gap-6 pr-6">
          {loop.map((item, i) => (
            <PressCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
