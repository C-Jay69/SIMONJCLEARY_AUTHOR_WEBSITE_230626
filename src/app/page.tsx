import { db } from "@/lib/db";
import { getPurchaseableSlugs } from "@/lib/store";
import type {
  Book as BookRow,
  JournalPost as JournalPostRow,
  EventItem as EventItemRow,
  PressItem as PressItemRow,
  Podcast as PodcastRow,
} from "@prisma/client";

import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { PressStrip } from "@/components/site/press-strip";
import { BooksSection } from "@/components/site/books-section";
import { AboutSection } from "@/components/site/about-section";
import { JournalSection } from "@/components/site/journal-section";
import { PodcastSection } from "@/components/site/podcast-section";
import { EventsSection } from "@/components/site/events-section";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { ContactForm } from "@/components/site/contact-form";
import { SiteFooter } from "@/components/site/site-footer";
import type {
  Book,
  JournalPost,
  EventItem,
  PressItem,
  Podcast,
} from "@/components/site/types";

/**
 * The homepage is static, but journal posts and other DB content are edited
 * live from the admin panel. ISR (60s) + on-demand revalidatePath() after
 * admin mutations lets new posts appear without a full redeploy.
 */
export const revalidate = 60;

/**
 * Serialize a Prisma Book row to a plain object safe to pass across the
 * Server/Client boundary (Date fields become ISO strings).
 */
function serializeBook(b: BookRow): Book {
  return {
    ...b,
    releaseDate: b.releaseDate ? b.releaseDate.toISOString() : null,
    createdAt: b.createdAt.toISOString(),
  };
}

function serializeJournal(p: JournalPostRow): JournalPost {
  return { ...p, date: p.date.toISOString() };
}

function serializeEvent(e: EventItemRow): EventItem {
  return { ...e, date: e.date.toISOString() };
}

// PressItem has no Date fields, but pass it through for type consistency.
function serializePress(p: PressItemRow): PressItem {
  return { ...p };
}

function serializePodcast(p: PodcastRow): Podcast {
  return {
    ...p,
    publishedAt: p.publishedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}

async function safeQuery<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[page] ${label} query failed:`, err);
    return [] as unknown as T;
  }
}

export default async function Home() {
  const [books, journalPosts, eventItems, pressItems, podcasts] = await Promise.all([
    safeQuery<BookRow[]>(
      () =>
        (db.book?.findMany({ orderBy: { seriesIndex: "asc" } }) ??
          Promise.resolve([])) as Promise<BookRow[]>,
      "books"
    ),
    safeQuery<JournalPostRow[]>(
      () =>
        (db.journalPost?.findMany({ orderBy: { date: "desc" } }) ??
          Promise.resolve([])) as Promise<JournalPostRow[]>,
      "journalPosts"
    ),
    safeQuery<EventItemRow[]>(
      () =>
        (db.eventItem?.findMany({ orderBy: { date: "asc" } }) ??
          Promise.resolve([])) as Promise<EventItemRow[]>,
      "eventItems"
    ),
    safeQuery<PressItemRow[]>(
      () =>
        (db.pressItem?.findMany() ?? Promise.resolve([])) as Promise<PressItemRow[]>,
      "pressItems"
    ),
    safeQuery<PodcastRow[]>(
      () =>
        (db.podcast?.findMany({ orderBy: { episodeNumber: "desc" } }) ??
          Promise.resolve([])) as Promise<PodcastRow[]>,
      "podcasts"
    ),
  ]);

  const serializedBooks = books.map(serializeBook);
  const serializedJournal = journalPosts.map(serializeJournal);
  const serializedEvents = eventItems.map(serializeEvent);
  const serializedPress = pressItems.map(serializePress);
  const serializedPodcasts = podcasts.map(serializePodcast);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />

        {serializedPress.length > 0 && (
          <PressStrip items={serializedPress} />
        )}

        <BooksSection
          books={serializedBooks}
          buyableSlugs={getPurchaseableSlugs()}
        />

        <AboutSection />

        {serializedJournal.length > 0 && (
          <JournalSection posts={serializedJournal} />
        )}

        <PodcastSection episodes={serializedPodcasts} />

        {/* Events always render — shows a T.B.A. card when there are none. */}
        <EventsSection events={serializedEvents} />

        <NewsletterForm />

        <ContactForm />
      </main>

      <SiteFooter className="mt-auto" podcastEpisodes={serializedPodcasts} />
    </div>
  );
}
