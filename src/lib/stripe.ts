import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

/**
 * Stripe client singleton (server-side only). Null when the secret key is
 * not configured, so routes can return a clean "not configured" error
 * instead of crashing at module load.
 */
export const stripe: Stripe | null = apiKey ? new Stripe(apiKey) : null;