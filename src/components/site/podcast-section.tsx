"use client";

import * as React from "react";
import { Headphones, Mic } from "lucide-react";

import { Section } from "@/components/site/section";
import { cn } from "@/lib/utils";
import type { Podcast } from "@/components/site/types";
import { useT } from "@/lib/i18n";
import { formatDateShort } from "@/lib/date-utils";

type PodcastSectionProps = {
  episodes: Podcast[];
};

function EpisodeCard({ episode, latest }: { episode: Podcast; latest?: boolean }) {
  const t = useT();
  const audioRef = React.useRef<HTMLAudioElement>(null);

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-md border bg-card/30 p-5 transition-colors sm:p-6",
        latest
          ? "border-accent/40 hover:border-accent/60"
          : "border-border/60 hover:border-border"
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
              latest ? "bg-accent/15 text-accent" : "bg-muted/40 text-foreground/70"
            )}
            aria-hidden="true"
          >
            <Mic className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {t("podcast.episode")} {String(episode.episodeNumber).padStart(2, "0")}
            </span>
            <time
              dateTime={episode.publishedAt}
              className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/80"
            >
              {formatDateShort(episode.publishedAt)}
            </time>
          </div>
        </div>
        {latest && (
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
            {t("podcast.latest")}
          </span>
        )}
      </header>

      <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
        {episode.title}
      </h3>

      {episode.description && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {episode.description}
        </p>
      )}

      <div className="mt-1 flex items-center gap-3">
        <audio
          ref={audioRef}
          controls
          preload="none"
          className="h-10 w-full min-w-0"
          aria-label={`Play episode ${episode.episodeNumber}: ${episode.title}`}
        >
          <source src={episode.audioUrl} />
          Your browser does not support the audio element.
        </audio>
        {episode.duration && (
          <span className="hidden shrink-0 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground sm:inline">
            {episode.duration}
          </span>
        )}
      </div>
    </article>
  );
}

export function PodcastSection({ episodes }: PodcastSectionProps) {
  const t = useT();
  const sorted = [...episodes].sort(
    (a, b) => b.episodeNumber - a.episodeNumber
  );

  return (
    <Section
      id="podcast"
      eyebrow={t("podcast.eyebrow")}
      title={t("podcast.title")}
      intro={t("podcast.intro")}
    >
      {sorted.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-md border border-dashed border-border/60 bg-card/20 px-6 py-14 text-center">
          <Headphones className="h-6 w-6 text-accent/70" aria-hidden="true" />
          <p className="font-serif text-xl font-semibold tracking-tight text-foreground">
            {t("podcast.comingSoon")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("podcast.comingSoonDesc")}
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5">
          {sorted.map((ep, i) => (
            <EpisodeCard key={ep.id} episode={ep} latest={i === 0} />
          ))}
        </div>
      )}
    </Section>
  );
}
