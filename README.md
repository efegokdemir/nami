# Nami

Nami is a calm, flexible, mobile-first Shopify theme for real commerce. It is free and open source under the MIT license, with no required apps, external services, tracking, or build step for merchants.

## Install

Download the release ZIP and upload it in **Online Store → Themes → Add theme → Upload zip file**. Preview the unpublished theme, configure sections and menus in the Theme Editor, then publish when ready.

## Develop locally

Install the current [Shopify CLI](https://shopify.dev/docs/api/shopify-cli), authenticate with a development store, then run:

```bash
shopify theme dev --path nami
shopify theme check --path nami
```

Nami uses Shopify's native Online Store architecture: JSON templates, section groups, sections, snippets, app blocks, Liquid forms and the Ajax Cart API. JavaScript is small vanilla enhancement code in `assets/nami.js`; CSS tokens and components live in `assets/nami.css.liquid`.

## Included experiences

Nami includes 44 merchant-facing sections, 7 reusable theme blocks, and templates for home, product, collection, collection list, search, cart, blog, article, page, contact and 404. Commerce features include accessible navigation, predictive search, native filters and sorting, variant-aware product forms, accelerated checkout, cart drawer, cart page, recommendations, recently viewed products, responsive imagery, translation-ready strings, app insertion points and visual presets.

## Quality and scope

Nami intentionally avoids fabricated urgency, fake reviews, hidden tracking, remote runtime dependencies, external fonts and framework bundles. Run Theme Check before contribution. Real storefront, Theme Editor, Lighthouse and upload QA require a Shopify development-store session and are recorded only when actually performed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/architecture.md](docs/architecture.md), and [docs/testing.md](docs/testing.md).

## License

MIT. See [LICENSE.md](LICENSE.md).
