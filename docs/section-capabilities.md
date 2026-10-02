# Section capabilities

This reference describes the unreleased capability-overhaul branch. Merchants supply images, products, collections, menus and copy. Nothing depends on a furnished demo store or external app.

## Common controls

Appropriate sections expose page/full width, normal/narrow/wide content, a Shopify color scheme, and compact (24px), normal (48px), spacious (80px) or custom top/bottom spacing (0–160px). Heading scale and heading alignment appear where meaningful. Custom spacing and page-content width controls are conditional. Hero, merchandising, product media and multi-column expose deliberate mobile layout controls rather than arbitrary CSS settings.

## Main capabilities

| Section | Purpose and layouts | Important merchant controls | Blocks |
| --- | --- | --- | --- |
| Hero | Campaign banner, split or contained media/content | Desktop/mobile image, hosted muted video, natural/fixed height, image position, media side, content width and alignment, overlay color/opacity, heading level/size, badge, two CTAs, mobile height/order/alignment | Equivalent section fields |
| Image with text | Adjacent or overlapping content, left/right media | Media width 35–65%, ratio, vertical/content alignment, mobile order, two CTAs | Heading, text, button, app |
| Bento | Responsive mixed-size merchandising | Desktop columns, row height, standard/wide/tall/large sizes, desktop/mobile image, product/collection, label, heading, rich text, link, overlay/below, alignment and tile scheme | Tile |
| Featured collection / Product carousel | Product grid or native horizontal scroll | Collection, manual product list in carousel, product count, desktop/mobile columns, vendor/price/badges/second-image/Quick Add/swatches, ratio/style/alignment, View All | App |
| Collection cards | Collection discovery, grid or carousel | Selected collection/custom image/title/description/link, image ratio, below/overlay, columns, mobile columns, alignment, View All | Collection |
| Product / Featured product | Composable full or miniature PDP | Resource selector on spotlight, gallery stacked/thumbnails/carousel, media side/width, mobile sticky ATC | Vendor, title, price, description, variant picker, quantity, buy buttons, inventory, SKU, accordion, page disclosure, Custom Liquid, complementary products, share, app |
| Multi-column / Icon list | Benefits, services or steps as grid/list/strip | 2–6 desktop columns, mobile columns, surface on/off, ratio, alignment | Image/icon, heading, text, link |
| FAQ / Collapsible content | Long-form accessible disclosure | Intro, width, expanded first, single/multiple open, scheme | Question/content with icon, rich text, optional page |
| Tabs | Switch between merchant content panels | Width, heading, scheme; horizontally scrolling tab bar on mobile | Label, rich text, page or Custom Liquid |
| Comparison table | Editable structured differences | 2–4 named columns, row label heading, mobile horizontal scrolling | Row label and text/yes/no value per column |
| Before/after | Compare two images with a native range control | Before/after images and labels, accessible slider label | Section fields |
| Shoppable image | Interactive product discovery | Image, Quick Add; responsive X/Y positions, labels and products | Hotspot |
| Testimonials | Genuine merchant-entered quotes | Grid, scroll or featured layout | Quote, author, role/company, avatar, optional rating |
| Logo list | Merchant logos or text | Columns, logo size, grayscale; optional links | Logo/image/text/link |
| Marquee | Short repeatable messages | Direction, duration, pause on hover/focus; reduced-motion static fallback | Text, icon, link |
| Timeline | Brand/process/delivery sequence | Vertical or horizontal desktop; vertical mobile | Date/step, heading, rich text, image |
| Statistics | Merchant-owned factual values | Scheme, width and heading | Value, prefix, suffix, label, text; no fake count-up |
| Video | Hosted or supported external media | Shopify video, YouTube/Vimeo, poster, hosted muted autoplay/loop/controls, adjacent/above content | Section fields |
| Newsletter | Native Shopify customer signup | Inline/centered/image layout, alignment, scheme, copy, consent, native success/errors | Section fields |
| Featured blog | Selected article feed | Count, columns, ratio, excerpt/date/author toggles, View All | Section fields |
| Image gallery | General merchant imagery | Columns, mobile columns, image ratio | Image, caption, optional link; no lightbox dependency |
| Header | Commerce navigation | Logo position, sticky, optional transparent homepage, menus, localization, scheme | Menu-title-linked promo image/product/collection/text/link |
| Footer | Adaptable store information | Scheme, short text, social settings, localization/payments/policies | Menu or newsletter |

Promo banners/grids are covered by Hero, Image with text and Bento. There is no extra duplicate promo section. Logo marquee is not a separate animation mode; use the dedicated Marquee for text/icon/link strips.

## Shared commerce behavior

Product cards across commerce sections use one snippet. Quick Add submits only a simple/default variant without selling plans; other products link to their PDP to choose options correctly. Swatches use Shopify option-value metadata, not a hard-coded `Color` option name. Image swatches use matching variant media when present; non-swatch data falls back to labelled buttons. Product variants are section-scoped, including invalid combinations and sold-out states.

PDP/Featured Product blocks can be reordered because controls attach to the native product form by ID. Gallery media includes Shopify images, videos, external videos and models. Native recommendations/complementary products and recently viewed reuse the card foundation. Share uses the browser share API or clipboard where available. Page disclosures remain native accessible details, not a separate modal library.

Carousels use native horizontal scrolling, snapping, previous/next disabled states and a keyboard-focusable region. Tabs implement roving focus and Left/Right/Home/End. Before/after uses a keyboard/touch range; without JS the two images remain visible. FAQ uses native details with modest progressive animation, not forced height scripting. Hotspots allow one open product panel at a time.

Predictive search includes Shopify-returned products, collections, pages and articles, images/prices when available, arrow navigation and View All. Cart preferences include drawer/page, notes, vendor/properties and an optional merchant-defined shipping threshold. No urgency or invented recommendation data is generated.

## Reusable theme blocks

Heading, text, button, image, group, quote and statistic are retained. Video, icon, badge and divider add reusable media/details primitives. Groups support direction, alignment and space between children, collapsing sensibly on mobile. The App and theme blocks section accepts both native app blocks and reusable theme blocks.

## Empty content

Missing resources in optional product/blog/gallery/logo/quote sections hide live output. Editor-only setup guidance uses `request.design_mode`. Where a surface is needed for layout, it is a restrained neutral CSS area, not enlarged Shopify line art. Defaults do not fabricate testimonials, statistics or a merchant brand. The production homepage starts with Hero, Featured collection and Newsletter, ready for merchant configuration.

The complete pre-overhaul inventory and weakness audit is in [section-audit.md](section-audit.md). Template-bound sections (article/blog/cart/collection/page/search/404/collection-list) retain their native resource behavior and gain appropriate common controls. Existing Rich text, Slideshow, Split hero, Contact form, Custom Liquid, Announcement, Press mentions, Recently viewed and App area remain compatible rather than being replaced with new files.
