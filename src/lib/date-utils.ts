/**
 * Timezone-stable date formatting.
 *
 * `date-fns` `format()` uses the runtime's local timezone, which causes
 * hydration mismatches when the server (UTC) and client (e.g. UTC-6) render
 * different dates for the same ISO string. These helpers use UTC methods
 * so the output is identical on server and client.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDate(iso: string): Date | null {
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/** "May 12, 2026" — stable across timezones. */
export function formatDateShort(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "2026" — year only, stable. */
export function formatYear(iso: string | null): string | null {
  if (!iso) return null;
  const d = toDate(iso);
  if (!d) return null;
  return String(d.getUTCFullYear());
}

/** Month abbreviation for date blocks: "May". */
export function formatMonthShort(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  return MONTHS_SHORT[d.getUTCMonth()];
}

/** Day of month: "12". */
export function formatDay(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  return String(d.getUTCDate());
}

/** Full date+time for events: "Fri · May 12, 2026 · 7:00 PM". */
export function formatEventDateTime(iso: string): string {
  const d = toDate(iso);
  if (!d) return "";
  const dayName = DAYS_SHORT[d.getUTCDay()];
  const month = MONTHS_SHORT[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  // 12-hour UTC time
  let h = d.getUTCHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${dayName} · ${month} ${day}, ${year} · ${h}:${m} ${ampm}`;
}
