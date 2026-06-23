/**
 * Buy-link map for the Duke Savage series.
 * Per §1 of the brief: keyed by book title. The signed-copy link points
 * at the newsletter anchor so visitors can sign up for signed-copy drops.
 * Forthcoming titles have no retailer links — only a "Notify me" path.
 */
export type BuyLinks = {
  amazon: string;
  bookshop: string;
  audible: string;
  signed: string;
};

const SEARCH_URLS: BuyLinks = {
  amazon: "https://www.amazon.com/s?k=simon+j+cleary",
  bookshop: "https://bookshop.org/search?keywords=simon+j+cleary",
  audible: "https://www.audible.com/search?keywords=simon+j+cleary",
  signed: "#newsletter",
};

export const BUY_LINKS: Record<string, BuyLinks> = {
  "Ghosts in the Ash": { ...SEARCH_URLS },
};

export const NEWSLETTER_HREF = "#newsletter";
