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
npm test
```

## Where things live

- Brand, domain, and contact handles: `src/content/site.ts`
- Service catalog: Supabase tables `services` and `service_translations`, read through `listCatalogServices` / `getCatalogServiceBySlug`
- Useful-info notes: Supabase tables `useful_info` and `useful_info_translations`, read through `listUsefulInfo` / `getUsefulInfoById`. A file copy still lives in `src/infrastructure/data/info-topics.ts`
- Interface copy: `messages/*.json`
