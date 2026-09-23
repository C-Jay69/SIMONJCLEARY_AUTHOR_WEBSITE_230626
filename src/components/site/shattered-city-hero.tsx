"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShatteredCityHero() {
  const reduce = useReducedMotion();
  const [imgOk, setImgOk] = React.useState(true);

  return (
    <section
      id="top"
      aria-labelledby="shattered-city-hero-title"
      className="relative overflow-hidden"
    >
      {/* Atmospheric background: faint oversized title + copper/wet-steel washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[26vw] font-bold leading-none text-foreground/[0.03] sm:text-[20vw]">
          CITY
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,color-mix(in_oklch,var(--copper)_22%,transparent),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,color-mix(in_oklch,var(--wetsteel)_30%,transparent),transparent_60%)]" />
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
            <span className="case-label text-gold">// THE SECOND NOVEL</span>
            <span aria-hidden="true" className="steel-hairline" />
          </div>

          <h1
            id="shattered-city-hero-title"
            className={cn(
              "mt-5 font-serif font-semibold leading-[0.92] tracking-tight",
              "text-[clamp(2.75rem,8vw,5.75rem)]"
            )}
          >
            THE
            <br />
            <span className="gold-gradient-text">SHATTERED</span>
            <br />
            CITY
          </h1>

          <p className="mt-6 max-w-xl font-serif text-xl italic leading-snug text-foreground/85 sm:text-2xl">
            &ldquo;The city was not drowning them. It was mopping its floor.&rdquo;
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span
              className="rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-gold"
              title="Adult science-fantasy"
            >
              Adult Science-Fantasy
            </span>
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            When the transit platform collapses in the lower reaches of
            Neo-Tethys, three sisters — Sophia, Kiera and Zoey — wake in a
            buried deck with no water, no food, and no map. Each of them
            carries a mark that did not exist at roll call this morning. Each
            mark does something the city never agreed to let them do.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-md bg-gold px-6 text-background hover:bg-gold/90"
            >
              <Link href="#chapter-one">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Read Chapter One
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-md border-border/70 bg-transparent px-6 text-foreground hover:bg-copper/10 hover:text-copper"
            >
              <Link href="/#books">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                The Duke Savage books
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span aria-hidden="true" className="ember-hairline" />
            <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground">
              THE SHATTERED CITY · SECOND NOVEL · FILE 002
            </p>
          </div>
        </motion.div>

        {/* Right column — cover */}
        <motion.div
          className="md:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-none">
            <div
              aria-hidden="true"
              className="copper-glow absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
            />
            <div className="relative aspect-[2/3] w-full rotate-[1.5deg] overflow-hidden rounded-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-gold/30 transition-transform duration-500 hover:rotate-0">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
              />
              {imgOk ? (
                <img
                  src="/images/books/the-shattered-city.png"
                  alt="The Shattered City — Science-Fantasy Novel by Simon J Cleary"
                  className="relative h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between font-mono text-[0.55rem] uppercase tracking-[0.3em]">
                    <span className="text-gold">A Simon J Cleary Novel</span>
                    <span className="text-muted-foreground">Book 02</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div aria-hidden className="steel-hairline" />
                    <h3 className="font-serif text-3xl font-semibold leading-[0.95] tracking-tight text-foreground">
                      THE SHATTERED CITY
                    </h3>
                    <p className="font-serif text-sm italic leading-snug text-muted-foreground">
                      &ldquo;Cover art pending&rdquo;
                    </p>
                  </div>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/30"
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
              FILE 002 · SCIENCE-FANTASY · SECOND NOVEL
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}