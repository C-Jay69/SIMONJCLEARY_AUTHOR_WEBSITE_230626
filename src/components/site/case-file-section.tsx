"use client";

import * as React from "react";
import { Fingerprint, MapPin } from "lucide-react";

import { Section } from "@/components/site/section";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Field = {
  labelKey: string;
  value: React.ReactNode;
};

const DOSSIER: Field[] = [
  { labelKey: "casefile.name", value: <>Duke Savage</> },
  { labelKey: "casefile.age", value: "53" },
  { labelKey: "casefile.formerly", value: "Investigative journalist — a prodigy with a keyboard and a curse with a conscience. His exposés toppled mayors and vaporized criminal syndicates." },
  { labelKey: "casefile.now", value: "Private investigator. A cramped office above a pawnshop, Los Angeles." },
  {
    labelKey: "casefile.broke",
    value: (
      <>
        The Heartland ring. He went <span className="redact" aria-label="[redacted]">deep</span> undercover to get revenge, and the things he did to keep his cover came home as a chemical ghost. The blowback from his crusade shattered his daughter Julie's sense of safety. She survived. The light in her eyes didn't.
      </>
    ),
  },
  {
    labelKey: "casefile.kryptonite",
    value: "Julie Savage. The one person who could ever make him hesitate, the one memory that can still cut him to the bone. Her absence is a wound that never closes. She still leaves a lamp on in the hall.",
  },
  {
    labelKey: "casefile.motivation",
    value: "He doesn't believe in justice anymore. He believes in exposure. He digs, he reveals, he wounds the beast — not because he thinks he can kill it, but because he can't stand the thought of letting it feed unchallenged. Every case is a penance.",
  },
  {
    labelKey: "casefile.voice",
    value: "A cocktail of Hunter S. Thompson's gonzo paranoia, James Ellroy's staccato brutality, and Chandler's weary lyricism. Dry. Sardonic. Never impressed — by power, by money, by evil. Only occasionally by honesty.",
  },
  {
    labelKey: "casefile.theCase",
    value: "Hired to find a missing woman. Discovers he wasn't hired to find her — he was selected. In a war fought with administrative cascades, Duke is the one variable the system cannot quietly resolve.",
  },
];

const MAP_LOCATIONS: { name: string; note: string; book?: string }[] = [
  { name: "The Arts District, L.A.", note: "Duke's desk. Where the 3 a.m. cases arrive and the files stay open.", book: "Books 01\u201303" },
  { name: "Kingdom Cares / CivicBridge", note: "The nonprofit and the data platform clearing the corridor. The mechanism's local face.", book: "Book 01" },
  { name: "Baltimore research archives", note: "Where the twelve-year land assembly scheme was designed and laundered.", book: "Book 01" },
  { name: "Arlington / McLean, VA", note: "The consulting firms and advisory working groups above the mechanism.", book: "Books 01\u201303" },
  { name: "Santa Monica", note: "Julie's apartment. The lamp she still leaves on.", book: "Books 01\u201302" },
  { name: "The Mojave", note: "Where Duke does the accounting. Desert light before the heat arrives.", book: "Book 03" },
];

export function CaseFileSection() {
  const t = useT();
  return (
    <Section
      id="casefile"
      eyebrow={t("casefile.eyebrow")}
      title="Duke Savage"
      intro={t("casefile.intro")}
    >
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Dossier card */}
        <article className="lg:col-span-7">
          <div
            className={cn(
              "relative overflow-hidden rounded-md border border-border/70 bg-card/40 p-6 sm:p-8",
              "shadow-[0_25px_60px_-30px_rgba(0,0,0,0.85)]"
            )}
          >
            {/* Stamps */}
            <div className="pointer-events-none absolute right-4 top-4 select-none">
              <span className="inline-flex rotate-3 items-center rounded-sm border-2 border-accent/60 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-accent/80">
                {t("casefile.confidential")}
              </span>
            </div>
            <div className="pointer-events-none absolute right-4 top-14 hidden select-none sm:block">
              <span className="inline-flex -rotate-2 items-center rounded-sm border-2 border-muted-foreground/40 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                {t("casefile.pi")}
              </span>
            </div>

            <header className="flex items-center gap-3 border-b border-border/60 pb-4">
              <Fingerprint className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-serif text-xl font-semibold tracking-tight">
                {t("casefile.subjectProfile")}
              </h3>
              <span className="ml-auto font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground sm:ml-0">
                {t("casefile.fileTag")}
              </span>
            </header>

            <dl className="mt-6 flex flex-col divide-y divide-border/40">
              {DOSSIER.map((f) => (
                <div
                  key={f.labelKey}
                  className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-4"
                >
                  <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground sm:pt-1">
                    {t(f.labelKey)}
                  </dt>
                  <dd className="font-serif text-base leading-relaxed text-foreground/90 sm:text-lg">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <footer className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              <span>{t("casefile.updated")}: 2026.05.01</span>
              <span>{t("casefile.status")}: <span className="text-accent">{t("casefile.active")}</span></span>
            </footer>
          </div>
        </article>

        {/* Baltimore: The Map */}
        <aside className="lg:col-span-5">
          <div className="rounded-md border border-border/70 bg-card/30 p-6 sm:p-8">
            <header className="flex items-center gap-3 border-b border-border/60 pb-4">
              <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-serif text-xl font-semibold tracking-tight">
                {t("casefile.territory")}
              </h3>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("casefile.territoryIntro")}
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {MAP_LOCATIONS.map((loc) => (
                <li
                  key={loc.name}
                  className="flex flex-col gap-1 border-l-2 border-accent/30 pl-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-base font-semibold text-foreground">
                      {loc.name}
                    </span>
                    {loc.book && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent/80">
                        {loc.book}
                      </span>
                    )}
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {loc.note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
