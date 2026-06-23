"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { AdminPanel } from "@/components/site/admin-panel";
import type { Podcast } from "@/components/site/types";
import { useT } from "@/lib/i18n";

const NAV_KEYS: { key: string; href: string }[] = [
  { key: "nav.books", href: "#books" },
  { key: "nav.about", href: "#about" },
  { key: "nav.journal", href: "#journal" },
  { key: "nav.events", href: "#events" },
  { key: "nav.newsletter", href: "#newsletter" },
  { key: "nav.contact", href: "#contact" },
];

const SOCIALS: { label: string; href: string }[] = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Goodreads", href: "#" },
  { label: "Substack", href: "#" },
];

type SiteFooterProps = {
  className?: string;
  podcastEpisodes?: Podcast[];
};

export function SiteFooter({ className, podcastEpisodes = [] }: SiteFooterProps) {
  const t = useT();
  return (
    <footer
      className={cn(
        "relative border-t border-border/60 bg-card/20",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Wordmark + bio */}
          <div className="md:col-span-5">
            <Link
              href="#top"
              className="group flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight"
              aria-label="Simon J Cleary — home"
            >
              <img
                src="/logo-icon.png"
                alt=""
                aria-hidden="true"
                className="h-8 w-8 shrink-0 rounded-full ring-1 ring-accent/30 transition-transform group-hover:scale-105"
              />
              SIMON J CLEARY
            </Link>
            <p className="mt-3 max-w-sm font-serif text-base italic leading-snug text-muted-foreground">
              &ldquo;{t("footer.tagline")}&rdquo;
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("footer.bio")}
            </p>
          </div>

          {/* Nav */}
          <nav
            aria-label="Footer"
            className="md:col-span-4"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {t("footer.index")}
            </span>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {NAV_KEYS.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-accent"
                  >
                    {t(n.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div className="md:col-span-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {t("footer.elsewhere")}
            </span>
            <ul className="mt-4 flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Simon J Cleary · {t("footer.copyright")}
          </p>
          <p
            className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground/70"
            title={t("footer.madeWith")}
          >
            {t("footer.madeWith")}
          </p>
          <AdminPanel episodes={podcastEpisodes}>
            {t("footer.admin")}
          </AdminPanel>
        </div>
      </div>
    </footer>
  );
}
