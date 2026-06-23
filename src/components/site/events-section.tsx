"use client";

import * as React from "react";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";

import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/components/site/types";
import { useT } from "@/lib/i18n";
import {
  formatMonthShort,
  formatDay,
  formatEventDateTime,
} from "@/lib/date-utils";

type EventsSectionProps = {
  events: EventItem[];
};

function DateBlock({ iso, highlight }: { iso: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md border",
        highlight
          ? "border-accent/60 bg-accent/10 text-accent"
          : "border-border/60 bg-card/40 text-foreground"
      )}
      aria-hidden="true"
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-widest">
        {formatMonthShort(iso)}
      </span>
      <span className="font-serif text-2xl font-semibold leading-none">
        {formatDay(iso)}
      </span>
    </div>
  );
}

function EventRow({
  event,
  highlight = false,
  compact = false,
}: {
  event: EventItem;
  highlight?: boolean;
  compact?: boolean;
}) {
  const href = event.url && event.url !== "#" ? event.url : null;
  const isExternal = Boolean(href);

  const inner = (
    <>
      <DateBlock iso={event.date} highlight={highlight} />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "border-border/60 text-muted-foreground",
              highlight && "border-accent/40 text-accent"
            )}
          >
            {event.type}
          </Badge>
          <time
            dateTime={event.date}
            className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground"
          >
            {formatEventDateTime(event.date)}
          </time>
        </div>
        <h3
          className={cn(
            "font-serif font-semibold leading-snug tracking-tight",
            compact ? "text-base" : "text-lg sm:text-xl",
            highlight ? "text-foreground" : "text-foreground/90"
          )}
        >
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {event.venue}
            {event.city ? `, ${event.city}` : ""}
          </span>
        </div>
      </div>
      {isExternal && !compact && (
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent sm:flex">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
    </>
  );

  const rowClass = cn(
    "group flex items-start gap-4 rounded-md p-3 transition-colors sm:gap-5",
    highlight
      ? "border border-accent/30 bg-accent/[0.04] hover:bg-accent/[0.08]"
      : "border border-transparent hover:bg-accent/[0.04]"
  );

  if (isExternal) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClass}
      >
        {inner}
      </a>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}

export function EventsSection({ events }: EventsSectionProps) {
  const t = useT();
  const upcoming = events
    .filter((e) => !e.past)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => e.past)
    .sort((a, b) => b.date.localeCompare(a.date));

  const isEmpty = upcoming.length === 0 && past.length === 0;

  return (
    <Section
      id="events"
      eyebrow={t("events.eyebrow")}
      title={t("events.title")}
      intro={t("events.intro")}
    >
      {isEmpty ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-md border border-dashed border-border/60 bg-card/20 px-6 py-14 text-center">
          <CalendarDays className="h-6 w-6 text-accent/70" aria-hidden="true" />
          <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            {t("events.tba")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("events.tbaDesc")}
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
                <h3 className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                  {t("events.upcoming")}
                </h3>
                <span aria-hidden="true" className="ember-hairline" />
              </div>

              {upcoming.map((e, i) => (
                <EventRow key={e.id} event={e} highlight={i === 0} />
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-12 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                  {t("events.past")}
                </h3>
                <span aria-hidden="true" className="ember-hairline" />
              </div>
              <div className="flex flex-col divide-y divide-border/40 rounded-md border border-border/40">
                {past.map((e) => (
                  <EventRow key={e.id} event={e} compact />
                ))}
              </div>
            </div>
          )}

          {upcoming.length === 0 && past.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-2 rounded-md border border-dashed border-border/60 bg-card/20 px-6 py-8 text-center">
              <p className="font-mono text-[0.7rem] uppercase tracking-widest text-accent">
                {t("events.upcomingTba")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("events.upcomingTbaDesc")}
              </p>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
