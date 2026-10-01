# Architecture

Nami uses Shopify's native theme structure. `layout/theme.liquid` owns the document shell and section groups. JSON templates compose merchant-editable sections. Sections contain meaningful settings and blocks; snippets contain reusable markup; assets contain the scoped token-based CSS and progressive-enhancement JavaScript.

The theme has no required external runtime. App blocks are accepted where they are useful, and Custom Liquid can be added through Shopify's native editor. CSS avoids broad element selectors so app output is less likely to be damaged.
