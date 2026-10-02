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

Nami uses Shopify's native Online Store architecture: JSON templates, section groups, sections, snippets, app blocks, Liquid forms and the Ajax Cart API. Vanilla enhancements live in `assets/nami.js` and `assets/nami-capabilities.js`; tokens, components and responsive layouts live in the theme CSS assets. No build step is required.

## Included experiences

The current development branch includes 45 merchant-facing sections and 11 reusable theme blocks, plus an internal product-card renderer. Templates cover home, product, collection, collection list, search, cart, blog, article, page, contact and 404. Previous release ZIPs remain unchanged; this capability overhaul is not yet released.

- Hero: full-bleed, split and contained layouts; desktop/mobile images, hosted video, positioning, overlays and two CTAs.
- Bento: standard, wide, tall and large merchant-defined tiles using images, products, collections or concise content.
- Merchandising: shared product cards, grid/carousel layouts, native scrolling and controls, Quick Add for simple products without selling plans, product-page links for other products, optional second images and Shopify-data swatches.
- Product composition: reorderable information blocks, three gallery layouts, native media, dropdown/buttons/swatches, Custom Liquid, app blocks and native recommendations.
- Content: shoppable image hotspots, keyboard tabs, before/after range slider, structured comparison tables, FAQ, galleries, testimonials, logos, video and newsletter.
- Commerce: menu-linked mega-menu promotions, mobile navigation, predictive search, native filtering/sorting, cart drawer/page preference, order notes, optional shipping threshold, localisation and payment methods.

Merchants supply their own content. No lifestyle photos, fake endorsements or curated QA-store products ship as default merchandising. Resource-dependent sections hide missing content on live pages and offer setup guidance in Theme Editor. See the [section capability reference](docs/section-capabilities.md) for controls and supported blocks.

The native product form does not select or submit selling plans. Subscription-only products require an app integration that supplies the selling-plan controls and submission; a product-page link alone does not enable subscription purchases. Upgrading from v0.2.0 requires the saved-configuration migration before upload; comparison content and supported aliases are converted offline, while removed copy is archived for manual review. See the [exact upgrade procedure](docs/upgrade-v02.md).

## Quality and scope

Nami intentionally avoids fabricated urgency, fake reviews, hidden tracking, remote runtime dependencies, external fonts and framework bundles. Run Theme Check before contribution. Real storefront, Theme Editor, Lighthouse and upload QA require a Shopify development-store session and are recorded only when actually performed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/architecture.md](docs/architecture.md), and [docs/testing.md](docs/testing.md).

## License

MIT. See [LICENSE.md](LICENSE.md).
