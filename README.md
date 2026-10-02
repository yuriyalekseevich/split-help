# Split Help

Multilingual site for a local team that helps with everyday needs in Split, Croatia. Visitors look through the services on offer, describe what they need, and reach the team on WhatsApp or Telegram. The team answers directly.

## Run locally

```bash
npm install
npm run dev
```

The home path redirects to the default language.

```bash
npm run build
npm run start
npm run lint
```

## Where things live

- Brand, domain, and contact handles: `src/content/site.ts`
- Service catalog: `src/infrastructure/data/services.ts`, read only through `serviceRepository`
- Interface copy: `messages/*.json`

The catalog is a file for now. A database repository can replace that one implementation later without changing the pages.
