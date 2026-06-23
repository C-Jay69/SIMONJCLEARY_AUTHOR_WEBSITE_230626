/**
 * Plain serializable versions of Prisma types.
 *
 * The server component (page.tsx) reads rows from Prisma, then converts
 * `Date` fields to ISO strings (and null for missing releaseDate) before
 * passing them to client components. Client components accept these plain
 * shapes — never raw Prisma rows with `Date` objects.
 */
import type {
  Book as BookRow,
  JournalPost as JournalPostRow,
  EventItem as EventItemRow,
  PressItem as PressItemRow,
  Podcast as PodcastRow,
} from "@prisma/client";

export type Book = Omit<BookRow, "releaseDate" | "createdAt"> & {
  releaseDate: string | null;
  createdAt: string;
};

export type JournalPost = Omit<JournalPostRow, "date"> & {
  date: string;
};

export type EventItem = Omit<EventItemRow, "date"> & {
  date: string;
};

export type PressItem = PressItemRow;

export type Podcast = Omit<PodcastRow, "publishedAt" | "createdAt"> & {
  publishedAt: string;
  createdAt: string;
};
