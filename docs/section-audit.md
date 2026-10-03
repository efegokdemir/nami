# Historical pre-remediation audit

This inventory records the weaknesses found before the v0.3 P0/P1, P2 and core polish passes. Its section grades and defect descriptions are not current. See [the latest core polish report](v0.3-core-polish-qa.md) for the updated core-surface assessment.

# Section capability audit — pre-overhaul

Audited all 44 Liquid sections from the interrupted working tree before cleanup. The generated photographs and bundled-image switches are demo-only changes and will be removed. Retain font delivery, color schemes, responsive foundations, commerce price fixes, account links and editor-only resource guidance. No merchant catalog changes are needed.

## Announcement bar (`announcement-bar.liquid`)

- Layout: document-flow content.
- Settings: text, link, color_scheme.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## App and theme blocks (`app-area.liquid`)

- Layout: document-flow content.
- Settings: none.
- Blocks: @app []; heading []; text []; button []; image []; statistic []; quote []; group [].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: explicit app block support.

## Before and after (`before-after.liquid`)

- Layout: document-flow content.
- Settings: heading, before_image, before_label, after_image, after_label.
- Blocks: none.
- Missing controls / weak areas: Two panels rather than an interactive comparison.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Bento grid (`bento-grid.liquid`)

- Layout: grid.
- Settings: heading, layout.
- Blocks: tile [image, product, collection, demo_media, size, eyebrow, heading, text, link].
- Missing controls / weak areas: Tile sizes overridden by CSS; no mobile media, overlay or tile alignment.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Collapsible content (`collapsible-tabs.liquid`)

- Layout: native disclosure list.
- Settings: heading.
- Blocks: tab [heading, content].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Collection cards (`collection-grid.liquid`)

- Layout: document-flow content.
- Settings: eyebrow, heading, text.
- Blocks: collection [collection, image, demo_media, label, description, link].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Comparison table (`comparison-table.liquid`)

- Layout: document-flow content.
- Settings: heading, feature_label, row_one, row_two, row_three.
- Blocks: column [name, row_one_value, row_two_value, row_three_value].
- Missing controls / weak areas: Three fixed rows and CSS hard-coded to two columns.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Contact form (`contact-form.liquid`)

- Layout: document-flow content.
- Settings: eyebrow, heading, button_label.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Custom Liquid (`custom-liquid.liquid`)

- Layout: document-flow content.
- Settings: custom_liquid.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## FAQ (`faq.liquid`)

- Layout: native disclosure list.
- Settings: eyebrow, heading.
- Blocks: question [question, answer].
- Missing controls / weak areas: No width, intro or single-open setting.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Featured blog (`featured-blog.liquid`)

- Layout: grid.
- Settings: heading, blog, limit, link_label.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Featured collection (`featured-collection.liquid`)

- Layout: grid.
- Settings: eyebrow, heading, collection, products_to_show, show_vendor, link_label.
- Blocks: none.
- Missing controls / weak areas: Fixed four/two grid; no Quick Add or image/card controls.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Featured product (`featured-product.liquid`)

- Layout: media/content split.
- Settings: product, eyebrow, button_label, color_scheme.
- Blocks: none.
- Missing controls / weak areas: Rigid mini-form; silently selects a catalog product when unset; no app blocks.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: commerce area needs app insertion points.

## Features (`features.liquid`)

- Layout: document-flow content.
- Settings: eyebrow, heading, color_scheme.
- Blocks: feature [icon, heading, text].
- Missing controls / weak areas: Icon rendered as hidden text, not a reusable icon.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Footer (`footer.liquid`)

- Layout: media/content split.
- Settings: text, color_scheme.
- Blocks: menu [heading, menu]; newsletter [heading, placeholder].
- Missing controls / weak areas: Merchant menus supported; default intro is home-specific.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Header (`header.liquid`)

- Layout: document-flow content.
- Settings: menu, sticky.
- Blocks: none.
- Missing controls / weak areas: Plain nested dropdown; no merchant promo blocks or logo positioning.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Hero banner (`hero-banner.liquid`)

- Layout: document-flow content.
- Settings: image, mobile_image, demo_media, eyebrow, heading, text, button_label, button_link, secondary_label, secondary_link, alignment, text_width, overlay.
- Blocks: none.
- Missing controls / weak areas: Single split composition; no video, vertical placement, mobile order or height controls.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Image with text (`image-with-text.liquid`)

- Layout: media/content split.
- Settings: image, demo_media, eyebrow, heading, text, button_label, button_link, reverse, color_scheme.
- Blocks: none.
- Missing controls / weak areas: One ratio and 50/50 layout; no content blocks or second CTA.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Logo list (`logo-list.liquid`)

- Layout: document-flow content.
- Settings: heading.
- Blocks: logo [image, text, alt].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Lookbook (`lookbook.liquid`)

- Layout: document-flow content.
- Settings: image, demo_media, heading, button_label, button_link.
- Blocks: hotspot [product, left, top].
- Missing controls / weak areas: Link-only hotspots; forced image crop misaligns coordinates.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## 404 (`main-404.liquid`)

- Layout: document-flow content.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Article (`main-article.liquid`)

- Layout: document-flow content.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Blog (`main-blog.liquid`)

- Layout: grid.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Cart (`main-cart.liquid`)

- Layout: document-flow content.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Collection products (`main-collection.liquid`)

- Layout: grid.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Commerce works but card options and per-page count fixed.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Collection list (`main-list-collections.liquid`)

- Layout: grid.
- Settings: heading.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Page (`main-page.liquid`)

- Layout: document-flow content.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Product (`main-product.liquid`)

- Layout: media/content split.
- Settings: details, dynamic_checkout, sticky_atc, size_guide_page, size_guide_label.
- Blocks: info [heading, content]; @app [].
- Missing controls / weak areas: Rigid title/price/description/form order; models rendered as preview images; dropdown only.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: explicit app block support.

## Search results (`main-search.liquid`)

- Layout: grid.
- Settings: none.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Marquee (`marquee.liquid`)

- Layout: document-flow content.
- Settings: text, color_scheme.
- Blocks: none.
- Missing controls / weak areas: Repeated text; no speed, direction, pause or links.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Multi-column (`multi-column.liquid`)

- Layout: grid.
- Settings: eyebrow, heading, color_scheme.
- Blocks: column [number, heading, text, link_label, link].
- Missing controls / weak areas: Number/text cards only; no images, icons or column settings.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Newsletter (`newsletter.liquid`)

- Layout: document-flow content.
- Settings: eyebrow, heading, text, placeholder, button_label.
- Blocks: none.
- Missing controls / weak areas: No alignment, image or consent controls.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Press mentions (`press-mentions.liquid`)

- Layout: document-flow content.
- Settings: heading.
- Blocks: mention [publication, quote, link].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Product carousel (`product-carousel.liquid`)

- Layout: horizontal scroll.
- Settings: heading, collection, limit, link_label.
- Blocks: none.
- Missing controls / weak areas: Overflowing grid only; lacks controls, disabled states and manual source.
- Mobile: native overflow; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Product recommendations (`product-recommendations.liquid`)

- Layout: grid.
- Settings: heading.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Recently viewed (`recently-viewed.liquid`)

- Layout: grid.
- Settings: heading.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Rich text (`rich-text.liquid`)

- Layout: document-flow content.
- Settings: eyebrow, heading, text, button_label, button_link, color_scheme.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Slideshow (`slideshow.liquid`)

- Layout: media/content split.
- Settings: none.
- Blocks: slide [image, eyebrow, heading, text, button_label, button_link].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Split hero (`split-hero.liquid`)

- Layout: media/content split.
- Settings: image, eyebrow, heading, text, button_label, button_link, reverse, color_scheme.
- Blocks: none.
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global stacked split; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Statistics (`statistics.liquid`)

- Layout: grid.
- Settings: heading.
- Blocks: stat [value, label].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Tabs (`tabs.liquid`)

- Layout: tab panels.
- Settings: heading.
- Blocks: tab [heading, content].
- Missing controls / weak areas: No arrow keys, roving tabindex or panel labelling.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: initially hidden until content is available.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Testimonials (`testimonials.liquid`)

- Layout: grid.
- Settings: heading, color_scheme.
- Blocks: quote [quote, author, detail].
- Missing controls / weak areas: Default quote contains setup text on live pages.
- Mobile: global fixed grid columns; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Timeline (`timeline.liquid`)

- Layout: document-flow content.
- Settings: heading, color_scheme.
- Blocks: step [date, heading, text].
- Missing controls / weak areas: Lacks consistent per-section width, spacing, color and heading controls; review resource and long-content states.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: renders without a design-mode guard; incomplete content may leave empty structure.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.

## Video (`video.liquid`)

- Layout: document-flow content.
- Settings: heading, video, cover.
- Blocks: none.
- Missing controls / weak areas: Hosted video/cover only; playback options fixed.
- Mobile: document flow; no section-specific mobile controls unless listed above.
- Empty state: contains design-mode-aware branching; resource/block validity still needs review.
- App compatibility: no app blocks; add only where useful, Custom Liquid/app area available separately.
