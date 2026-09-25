import { slugifyBookTitle } from "@/lib/slug";

export type Purchaseable = {
  slug: string;
  title: string;
  priceId: string;
};

/**
 * Static price catalog for the two routed novels. The price IDs live in
 * environment variables so Stripe stays the single source of truth for
 * amounts (change a price in Stripe, no code change needed).
 *
 * Future titles need no code changes: create a Stripe price and add an
 * env var named STRIPE_PRICE_ID_<UPPER_SNAKE_CASE_SLUG>
 * (e.g. STRIPE_PRICE_ID_CINDER_GIRL for title "Cinder Girl").
 */
const STATIC_PRICES: Record<string, { title: string; env: string }> = {
  "ghosts-in-the-ash": {
    title: "Ghosts in the Ash",
    env: "STRIPE_PRICE_ID_GHOSTS_IN_THE_ASH",
  },
  "the-shattered-city": {
    title: "The Shattered City",
    env: "STRIPE_PRICE_ID_THE_SHATTERED_CITY",
  },
};

function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getPurchaseable(slug: string): Purchaseable | null {
  const known = STATIC_PRICES[slug];
  if (known) {
    const priceId = process.env[known.env];
    if (priceId) return { slug, title: known.title, priceId };
  }

  const derivedEnvKey = `STRIPE_PRICE_ID_${slug
    .toUpperCase()
    .replace(/-/g, "_")}`;
  const derivedPriceId = process.env[derivedEnvKey];
  if (derivedPriceId) {
    return {
      slug,
      title: known?.title ?? titleizeSlug(slug),
      priceId: derivedPriceId,
    };
  }

  return null;
}

export function getPurchaseableSlugs(): string[] {
  return Object.keys(STATIC_PRICES).filter((slug) => getPurchaseable(slug));
}
