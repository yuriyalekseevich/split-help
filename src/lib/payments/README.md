# Payments (not implemented)

Stripe is intentionally not wired up. The public site does not collect payment.

When you add it:

1. `Service.priceCents` on the domain model is the amount in euro cents.
2. Format a price with `formatPriceCents` in `src/lib/format.ts`.
3. Read the service through `serviceRepository.getById` (or `getBySlug`). Do not import the seed file.
4. Add a checkout route that creates a Stripe Checkout Session from `priceCents`.
5. Keep messenger ordering as the path for services that have no `priceCents` yet.

No Stripe environment variables are required for the current deploy.
