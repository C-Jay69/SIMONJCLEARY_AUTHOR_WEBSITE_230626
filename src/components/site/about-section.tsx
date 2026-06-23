"use client";

import * as React from "react";
import Link from "next/link";
import { BookMarked, Feather, Globe, MapPin, Newspaper, PenLine } from "lucide-react";

import { Section } from "@/components/site/section";
import { Separator } from "@/components/ui/separator";
import { useT } from "@/lib/i18n";

const BIO_PARAGRAPHS = [
  "Simon J. Cleary is an Irish-born writer and entrepreneur. His fascination with institutional systems, public narratives, and the hidden mechanisms that shape modern life informed the creation of GHOSTS IN THE ASH — written across twenty-seven drafts and exploring administrative power, personal responsibility, and the cost of pursuing truth when the people closest to you are paying the price.",
  "He didn't fully understand what he'd written until the night his wife's friends went quiet listening to it and told him: \u201CThe dry, sarcastic, notices-everything cynic — that's one hundred percent you.\u201D GHOSTS IN THE ASH is his debut novel and the first installment in the Duke Savage trilogy.",
];

const VITAL_STATS: {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  valueKey: string;
}[] = [
  { icon: Globe, labelKey: "about.born", valueKey: "about.bornValue" },
  { icon: Newspaper, labelKey: "about.background", valueKey: "about.backgroundValue" },
  { icon: PenLine, labelKey: "about.debut", valueKey: "about.debutValue" },
  { icon: BookMarked, labelKey: "about.series", valueKey: "about.seriesValue" },
  { icon: MapPin, labelKey: "about.setting", valueKey: "about.settingValue" },
];

const SOCIALS: { label: string; href: string; handle: string }[] = [
  { label: "Twitter / X", href: "#", handle: "@simonjcleary" },
  { label: "Instagram", href: "#", handle: "@simonjcleary" },
  { label: "Goodreads", href: "#", handle: "Simon J Cleary" },
  { label: "Substack", href: "#", handle: "The Savage Dispatch" },
];

export function AboutSection() {
  const t = useT();
  return (
    <Section
      id="about"
      eyebrow={t("about.eyebrow")}
      title={t("about.title")}
      intro={t("about.intro")}
    >
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
        {/* Author photo */}
        <figure className="md:col-span-5">
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -z-10 rounded-md bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_70%)] blur-xl"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md ring-1 ring-border/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]">
              <img
                src="/images/author-simon-cleary.jpg"
                alt="Simon J Cleary holding a copy of Ghosts in the Ash"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/20"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              <Feather className="h-3 w-3 text-accent" aria-hidden="true" />
              {t("about.caption")}
            </figcaption>
          </div>
        </figure>

        {/* Bio + vitals */}
        <div className="flex flex-col gap-8 md:col-span-7">
          <div className="flex flex-col gap-5">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                className="font-serif text-lg leading-relaxed text-foreground/90 sm:text-xl"
              >
                {p}
              </p>
            ))}
          </div>

          <Separator />

          {/* Vital stats */}
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {VITAL_STATS.map((s) => (
              <div key={s.labelKey} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted/40 text-accent">
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="flex flex-col">
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {t(s.labelKey)}
                  </dt>
                  <dd className="text-sm text-foreground/90">{t(s.valueKey)}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* Socials */}
          <div className="flex flex-wrap items-center gap-3">
            {SOCIALS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="group rounded-md border border-border/60 bg-card/30 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:border-accent/50 hover:text-accent"
              >
                <span className="font-mono uppercase tracking-widest">
                  {s.label}
                </span>
                <span className="ml-2 text-muted-foreground group-hover:text-accent/80">
                  {s.handle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
