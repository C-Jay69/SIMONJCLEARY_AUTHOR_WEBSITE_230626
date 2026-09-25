/**
 * Slugifies a book title the same way pages/price lookups expect it.
 * Shared by server (price resolution) and client (button wiring).
 */
export function slugifyBookTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}