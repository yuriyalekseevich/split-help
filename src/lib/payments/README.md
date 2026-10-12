# Payments (not implemented)

Stripe is intentionally not wired up. The public site does not collect payment.

When you add it:

1. Add an integer euro-cents column on `services`. `price_description` is display text only.
2. Format a price with `formatPriceCents` in `src/lib/format.ts`.
3. Read the service through `getCatalogServiceBySlug`.
4. Add a checkout route that creates a Stripe Checkout Session from that price.
5. Keep messenger ordering as the path for services that have no price yet.

No Stripe environment variables are required for the current deploy.
