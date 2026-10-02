# Architecture

Nami uses Shopify's native theme structure. `layout/theme.liquid` owns the document shell and section groups. JSON templates compose merchant-editable sections. Sections contain meaningful settings and blocks; snippets contain reusable markup; assets contain the scoped token-based CSS and progressive-enhancement JavaScript.

The theme has no required external runtime. App blocks are accepted where they are useful, and Custom Liquid can be added through Shopify's native editor. CSS avoids broad element selectors so app output is less likely to be damaged.

## Shared foundations

- `snippets/section-style.liquid` scopes width, heading scale, scheme tokens and spacing to a section instance. Common schemas expose page/full width, normal/narrow/wide content and compact/normal/spacious/custom spacing where relevant.
- `snippets/product-card.liquid` is the product-card foundation used by merchandising, collections, search, recommendations, recently viewed and hotspots. `sections/product-card-render.liquid` is an internal section-rendering endpoint, not a merchant preset.
- `product-information`, `product-info-block`, `product-data` and `product-media` snippets are shared by PDP and Featured Product. Variant/quantity inputs refer to the buy-button form by ID, allowing merchants to reorder blocks without invalid nested forms.
- `assets/nami.js` retains the cart queue and predictive-search engine. Delegated controls survive editor header reloads. `assets/nami-capabilities.js` enhances section-scoped variants, native carousels, tabs, comparisons and recommendations, and initializes Shopify section-load events.
- `assets/nami-theme.css`, `nami-overhaul.css` and `nami-capabilities.css` provide tokens, component treatment and capability layouts respectively. Shopify-hosted fonts are emitted by the layout, not embedded as Liquid in a static CSS asset.

No-image surfaces are restrained CSS. Editorial photography is merchant content, never a bundled decoration. App areas accept `@theme`/`@app`; product information and selected commerce sections accept app blocks. Native product media uses Shopify media rendering rather than discarding video/model types.
