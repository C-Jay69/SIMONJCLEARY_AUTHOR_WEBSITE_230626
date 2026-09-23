import type { Metadata } from "next";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Section } from "@/components/site/section";
import { ShatteredCityHero } from "@/components/site/shattered-city-hero";

import { chapterOne } from "@/content/shattered-city-chapter-one";
import { cast, storyIntro } from "@/content/shattered-city-cast";

const pageDescription =
  "The Shattered City — the second novel by Simon J. Cleary. An adult science-fantasy tale of ruin and the people who carry its power. Read Chapter One free.";

export const metadata: Metadata = {
  title: "The Shattered City — Second Novel",
  description: pageDescription,
  openGraph: {
    type: "website",
    url: "https://simonjcleary.com/the-shattered-city",
    siteName: "Simon J Cleary — Author",
    title: "The Shattered City — Second Novel",
    description: pageDescription,
    images: [
      {
        url: "/images/books/the-shattered-city.png",
        width: 1200,
        height: 1800,
        alt: "The Shattered City — Science-Fantasy Novel by Simon J Cleary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shattered City — Second Novel",
    description: pageDescription,
    images: ["/images/books/the-shattered-city.png"],
  },
};

export default function ShatteredCityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <ShatteredCityHero />

        {/* Story introduction / positioning */}
        <Section
          id="story"
          width="prose"
          eyebrow={storyIntro.eyebrow}
          title={storyIntro.title}
          align="left"
        >
          <div className="mt-2 flex items-center gap-3">
            <span
              className="rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-gold"
              title="Adult science-fantasy"
            >
              {storyIntro.positioning}
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {storyIntro.body.map((paragraph, i) => (
              <p
                key={i}
                className="font-serif text-lg leading-loose text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        {/* Power cards */}
        <Section
          id="cast"
          width="wide"
          eyebrow="// THE SURVIVORS"
          title="Three survivors. Three kinds of power. One broken city."
          intro="The city fell with its systems intact and its people buried under them. These three carry what they learned in the cracks."
        >
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cast.map((member) => (
              <article
                key={member.id}
                className="group rounded-md border border-border/60 bg-card/40 p-6 transition-colors duration-300 hover:border-gold/40 hover:bg-card/70"
              >
                <div className="flex items-center gap-3">
                  <span className="case-label text-wetsteel">
                    {member.epithet}
                  </span>
                  <span aria-hidden="true" className="steel-hairline" />
                </div>
                <h3 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground">
                  {member.name}
                </h3>
                <p className="mt-3 font-serif text-base italic leading-snug text-foreground/85">
                  &ldquo;{member.power}&rdquo;
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </Section>

        {/* Chapter One reading experience */}
        <Section
          id="chapter-one"
          width="default"
          eyebrow="// CHAPTER ONE · READ FREE"
          title="Read the opening of The Shattered City"
          intro="The full first chapter, on the house. Same deal as the debut: if it earns your attention, the rest of the story follows."
        >
          <article className="mx-auto mt-8 w-full max-w-3xl rounded-lg border border-wetsteel/20 bg-card/30 p-8 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.8)] md:p-12">
            <header className="flex items-start justify-between gap-4 border-b border-border/40 pb-6">
              <div>
                <p className="case-label text-gold">{chapterOne.label}</p>
                {chapterOne.title && (
                  <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {chapterOne.title}
                  </h3>
                )}
              </div>
              {chapterOne.location && (
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {chapterOne.location}
                </span>
              )}
            </header>

            {chapterOne.epigraph && (
              <div className="mt-8 flex flex-col items-center gap-1 text-center">
                <p className="font-serif text-xl italic leading-snug text-foreground/85">
                  &ldquo;{chapterOne.epigraph.text}&rdquo;
                </p>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-gold/80">
                  — {chapterOne.epigraph.attribution}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-6">
              {chapterOne.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "drop-cap font-serif text-lg leading-loose text-foreground/90"
                      : "font-serif text-lg leading-loose text-foreground/90"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <footer className="mt-10 flex flex-col items-start gap-3 border-t border-border/40 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md font-serif text-base italic leading-snug text-muted-foreground">
                Like what you read? The sequel is on its way.
              </p>
              <a
                href="/#newsletter"
                className="rounded-md bg-gold px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-background transition-colors hover:bg-gold/90"
              >
                Notify me
              </a>
            </footer>
          </article>
        </Section>

        {/* Return to the main site */}
        <Section
          align="center"
          eyebrow="// BACK TO THE STACK"
          title="The debut is still there"
          intro="Ghosts in the Ash and the Duke Savage trilogy are live on the main page."
        >
          <div>
            <a
              href="/"
              className="rounded-md border border-border/70 px-6 py-2.5 font-mono text-sm uppercase tracking-widest text-foreground transition-colors hover:border-gold/50 hover:text-gold"
            >
              Return to the main site
            </a>
          </div>
        </Section>
      </main>

      <SiteFooter className="mt-auto" />
    </div>
  );
}