# Bantayan Seafoods customer prototype

A responsive Next.js 16.4.6 App Router storefront for seafood sourced on request. This is a clickable prototype: no Laravel calls, customer accounts, supplier messages, live payment APIs, or real orders.

## Run and check

```sh
npm run dev
npm run lint
npm run check:demo
npm run build
```

The customer app runs on `http://localhost:3000`. `NEXT_PUBLIC_SITE_URL` sets the public canonical/sitemap origin; the default is localhost. The separate admin and API folders are not used by this prototype.

## Try the guest journey

1. Open `/seafood`, search or filter the catalog, and open an item.
2. Set the quantity and preferences, then add it to the quote request.
3. Review `/request-quote`, edit/remove quantities or add a custom item, and fill the guest form with test contact details.
4. Submit to `/request-received`. The request is saved in this browser; no email is sent.
5. Open the clearly labeled demo quotation. Accept its terms to preview the nonpayable QR Ph payment experience.
6. Simulate the deposit, then use the order controls to simulate procurement and delivery.
7. Use `/track` with the reference and email, or click “Fill in a demo request.”

The public sample is `RFQ-2026-001` / `maia.reyes@example.com`, with 5 kg dried squid at PHP 648/kg, PHP 350 delivery, PHP 3,590 total, and a PHP 1,795 deposit. A new local request can use that reference and replace the sample in this browser. All quoted values are illustrative; public catalog pages have no fixed prices or guaranteed availability.

## Routes and structure

Public pages: `/`, `/seafood`, `/seafood/[slug]`, `/how-it-works`, `/our-island`. The sitemap contains only these public routes. Each has unique metadata and canonical/Open Graph data.

Guest/demo pages: `/request-quote`, `/request-received`, `/track`, `/quote/[reference]`, `/payment/[reference]`, `/order/[reference]`. These pages have noindex metadata and are excluded by `robots.txt`.

Route files remain server components. Interactive forms, catalog filtering, and browser state live in focused components. Repeated brand, navigation, cards, icons, fields, and action links are shared. There are no added runtime dependencies. Local fonts and photographs are documented in `public/ASSET-CREDITS.md`; font licenses remain in `public/fonts`.

## Demo persistence and production boundary

The `bantayan-customer-demo-v1` localStorage entry holds the quote basket and guest requests. Hydration starts from the same empty server snapshot, then reads browser storage through `useSyncExternalStore`. A memory fallback supports a session when browser storage is unavailable. Clear that storage entry to reset the demo.

This storage and reference/email lookup are demonstration conveniences, not an authorization boundary. The sample quotation is intentionally public for testing. A production backend must verify guest access through scoped, expiring links or equivalent verification, issue supplier-approved quotations, validate all inputs and state transitions, and confirm payments server-side through a payment provider. The visual QR placeholder contains no payable data.

Money calculations use integer centavos. `npm run check:demo` checks the sample totals, fractional quantities, quantity bounds, invalid persisted data, and product lookup with the existing TypeScript compiler and Node assertions.
