"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

const HEADLINE = "Ghosts in the Ash";
const TAGLINE =
  "In a city that erases people with a transposed digit, one investigator was hired to find a woman who was never meant to be found.";
const HOOK =
  "Duke Savage — disgraced gonzo journalist turned analog private investigator — is hired at 3 a.m. to find a missing woman. She isn't missing by accident. She's been systematically erased by a power network that operates through bureaucracy, not violence. Nobody broke the law. The law was the mechanism.";

export function Hero() {
  const reduce = useReducedMotion();
  const t = useT();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      {/* Atmospheric background: faint oversized title + gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[24vw] font-bold leading-none text-foreground/[0.025] sm:text-[18vw]"
        >
          SAVAGE
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:px-6 md:grid-cols-12 md:gap-10 md:pb-24 md:pt-20 lg:px-8">
        {/* Left column */}
        <motion.div
          className="md:col-span-7"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <span className="case-label text-accent/90">{t("hero.eyebrow")}</span>
            <span aria-hidden="true" className="ember-hairline" />
          </div>

          <h1
            id="hero-title"
            className={cn(
              "mt-5 font-serif font-semibold leading-[0.92] tracking-tight",
              "text-[clamp(2.75rem,8vw,5.75rem)]"
            )}
          >
            {HEADLINE}
          </h1>

          <p className="mt-6 max-w-xl font-serif text-xl italic leading-snug text-foreground/85 sm:text-2xl">
            &ldquo;{TAGLINE}&rdquo;
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HOOK}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-md bg-accent px-6 text-accent-foreground hover:bg-accent/90"
            >
              <Link href="#newsletter">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {t("hero.comingSoon")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-md border-border/70 bg-transparent px-6 text-foreground hover:bg-accent/10 hover:text-accent"
            >
              <Link href="#newsletter">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {t("hero.readChapterFree")}
              </Link>
            </Button>
          </div>

          {/* Series tag — no fabricated reviews */}
          <div className="mt-10 flex items-center gap-3">
            <span aria-hidden="true" className="ember-hairline" />
            <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              {t("hero.seriesTag")}
            </p>
          </div>
        </motion.div>

        {/* Right column — book cover */}
        <motion.div
          className="md:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-none">
            {/* Ember glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--accent)_30%,transparent),transparent_70%)] blur-2xl"
            />
            <div className="relative aspect-[2/3] w-full rotate-[1.5deg] overflow-hidden rounded-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0">
              <img
                src="/images/books/ghosts-in-the-ash.jpg"
                alt="Ghosts in the Ash — A Duke Savage Novel by Simon J Cleary"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
              {/* subtle inner border for depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/30"
              />
            </div>
            {/* tiny case-file tag under the cover */}
            <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              {t("hero.fileTag")}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
